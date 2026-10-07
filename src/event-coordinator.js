import { EVENT_NAMESPACE as NS, copyEvent as copy, canonicalEvent, inputDigest, inputSnapshot, newEventId, createEventRecord, transitionEvent, invalidateEventChain } from './event-state.js';
import { EventPersistenceError } from './event-store.js';

const user = message => message?.is_user === true;
const assistant = message => message?.is_user === false && !message.is_system;
export function eventMessageIdentity(message) {
  const swipe = message?.swipe_info?.[message.swipe_id || 0];
  return swipe?.[NS] || swipe?.extra?.[NS] || message?.extra?.[NS] || null;
}
// Walk the captured parent lineage, never select the globally latest battle.
// A child branch inherits the parent's immutable domain snapshot by value.
export function eventBattleState(root, event) {
  let key = event.parentEventId;
  const seen = new Set();
  while (key && !seen.has(key)) {
    seen.add(key);
    const parent = root.events[key];
    if (!parent || parent.status === 'rolled_back') return null;
    if (parent.execution?.status === 'committed') return copy(parent.execution.afterState);
    key = parent.parentEventId;
  }
  return null;
}
function identityPatch(message, id) {
  const identity = copy(eventMessageIdentity(message) || {});
  identity.messageUid ||= message.extra?.[NS]?.messageUid || id();
  // A native new swipe can copy extra from the previous page. Never reuse a
  // swipe UID that is already assigned to a different page of this message.
  const selected = message.swipe_id || 0;
  const duplicate = message.swipe_info?.some((info, index) => index !== selected && (info?.[NS] || info?.extra?.[NS])?.swipeUid === identity.swipeUid);
  if (!identity.swipeUid || duplicate) identity.swipeUid = id();
  identity.eventIds ||= [];
  return { message, swipeId: selected, value: identity };
}
export function abortableEventTask(operation, signal, timeoutMs) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn, value) => { if (settled) return; settled = true; clearTimeout(timer); signal.removeEventListener('abort', cancel); fn(value); };
    const cancel = () => finish(reject, new DOMException('事件已取消', 'AbortError'));
    const timer = setTimeout(() => finish(reject, new Error('事件分流超时')), timeoutMs);
    signal.addEventListener('abort', cancel, { once: true });
    if (signal.aborted) { cancel(); return; }
    Promise.resolve().then(operation).then(value => finish(resolve, value), error => finish(reject, error));
  });
}

export class EventCoordinator {
  constructor({ store, lock, router = null, id = newEventId, timeoutMs = 30000, onStatus = () => {} }) {
    Object.assign(this, { store, lock, router, id, timeoutMs, onStatus });
    this.epoch = 0;
    this.active = null;
  }
  status(status, reason = null) { this.lastStatus = { status, reason }; this.onStatus(this.lastStatus); }
  cancel(reason = '用户停止') {
    if (this.active) { this.active.cancelReason = reason; this.active.controller.abort(); }
  }
  scopeChanged() {
    this.epoch += 1;
    this.cancel('聊天或消息分支已变化');
    this.active?.release?.();
    this.active = null;
    this.store.abandonChangedScope();
  }
  assertActive(task) {
    this.store.assertScope(task.scope);
    if (task.epoch !== this.epoch || this.active !== task) throw new DOMException('事件作用域已变化', 'AbortError');
    if (task.controller.signal.aborted) throw new DOMException('事件已取消', 'AbortError');
  }
  async reconcile(scope, root) {
    let changed = false;
    for (const event of Object.values(root.events)) {
      if (event.status === 'rolled_back') continue;
      const message = scope.chat.find(m => user(m) && eventMessageIdentity(m)?.messageUid === event.inputMessageUid);
      // An event from an alternate branch stays retained, but an input edit or
      // removal invalidates its own descendants. No battle resources are touched.
      if (!message || await inputDigest(message) !== event.originalInputHash) {
        invalidateEventChain(root, event.eventId, message ? 'input_edited' : 'input_deleted'); changed = true;
      } else if (['captured', 'routing'].includes(event.status)) {
        root.events[event.eventId] = transitionEvent(event, 'needs_input', 'interrupted_reload'); changed = true;
      }
      if (event.generationBindings.some(binding => binding.status === 'pending')) {
        root.events[event.eventId].generationBindings = event.generationBindings.map(binding => binding.status === 'pending' ? { ...binding, status: 'narrative_failed', reasonCode: 'interrupted_reload' } : binding);
        changed = true;
      }
    }
    if (!changed) return root;
    const patches = scope.chat.filter(m => user(m) && eventMessageIdentity(m)?.eventIds?.length).map(message => {
      const patch = identityPatch(message, this.id); patch.value.receipts ??= {};
      for (const eventId of patch.value.eventIds) if (root.events[eventId]) patch.value.receipts[eventId] = copy(root.events[eventId]);
      return patch;
    });
    return this.store.write(scope, root, patches);
  }
  async recover() {
    const scope = this.store.scope();
    const release = await this.lock.acquire(`${scope.avatar}:${scope.chatId}`, 'event-recovery');
    try {
      const root = await this.reconcile(scope, await this.store.load(scope));
      this.status('ready'); return root;
    } catch (error) { this.status(error instanceof EventPersistenceError ? 'persistence_pending' : 'blocked', error.message); throw error; }
    finally { release(); }
  }
  async capture(task, input, kind) {
    const { scope } = task;
    let root = await this.reconcile(scope, await this.store.load(scope));
    this.assertActive(task);
    const index = scope.chat.indexOf(input);
    if (index < 0 || !user(input)) throw new Error('无法定位本次用户输入');
    const patches = scope.chat.slice(0, index + 1).filter(m => user(m) || assistant(m)).map(m => identityPatch(m, this.id));
    const patch = patches.find(p => p.message === input);
    const lineage = patches.filter(p => assistant(p.message)).map(p => p.value.swipeUid);
    const lineageKey = canonicalEvent(lineage);
    root.branches[lineageKey] ||= lineage.length ? this.id() : root.rootBranchUid;
    const branchUid = root.branches[lineageKey];
    const digest = await inputDigest(input);
    this.assertActive(task);
    const previous = Object.values(root.events).filter(e => e.inputMessageUid === patch.value.messageUid);
    const existing = previous.find(e => e.originalInputHash === digest && e.branchUid === branchUid && e.status !== 'rolled_back');
    if (existing) return { root, event: existing, patch };
    const priorIds = patches.filter(p => user(p.message) && p.message !== input).flatMap(p => p.value.eventIds);
    const branchLineages = Object.fromEntries(Object.entries(root.branches).map(([key, value]) => [value, JSON.parse(key)]));
    const parent = priorIds.map(key => root.events[key]).filter(e => {
      const path = branchLineages[e?.branchUid];
      return e && e.status !== 'rolled_back' && path && path.every((uid, at) => lineage[at] === uid);
    }).at(-1);
    const event = createEventRecord({ requestId: task.requestId, chatId: scope.chatId, branchUid,
      inputMessageUid: patch.value.messageUid, inputRevision: previous.length + 1,
      originalInputHash: digest, parentEventId: parent?.eventId, baseRevision: root.revision, generationKind: kind, id: this.id });
    patch.value.eventIds.push(event.eventId);
    patch.value.inputRevision = event.inputRevision;
    patch.value.receipts ??= {}; patch.value.receipts[event.eventId] = copy(event);
    root.events[event.eventId] = event;
    root = await this.store.write(scope, root, patches);
    return { root, event: root.events[event.eventId], patch };
  }
  async saveEvent(task, root, event) {
    this.store.assertScope(task.scope);
    const input = task.scope.chat.find(m => user(m) && eventMessageIdentity(m)?.messageUid === event.inputMessageUid);
    if (!input || await inputDigest(input) !== event.originalInputHash) throw new Error('输入已改变，不能复用旧事件');
    const patch = identityPatch(input, this.id);
    // Input owns the durable receipt; metadata is the indexed transaction log.
    patch.value.receipts ??= {};
    patch.value.receipts[event.eventId] = copy(event);
    root.events[event.eventId] = event;
    return this.store.write(task.scope, root, [patch]);
  }
  async enter({ input, kind = 'normal', requestId = this.id() }) {
    if (this.active) return { allow: false, reason: '已有生成或事件正在处理' };
    const scope = this.store.scope();
    const release = await this.lock.acquire(`${scope.avatar}:${scope.chatId}`, requestId);
    const task = { scope, epoch: this.epoch, requestId, controller: new AbortController(), release, root: null, event: null, input };
    this.active = task;
    try {
      this.status('capturing');
      const captured = await this.capture(task, input, kind);
      task.root = captured.root; task.event = captured.event;
      this.assertActive(task);
      if (!['passed', 'committed', 'handed_off'].includes(task.event.status)) {
        task.event = { ...transitionEvent(task.event, 'routing'), attempts: task.event.attempts + 1 };
        task.root = await this.saveEvent(task, task.root, task.event);
        this.assertActive(task); this.status('routing');
        if (typeof this.router !== 'function') throw new Error('P3 分流器尚未配置');
        const route = await abortableEventTask(() => this.router({ input: inputSnapshot(input), message: input, event: copy(task.event), battleState: eventBattleState(task.root, task.event), signal: task.controller.signal }), task.controller.signal, this.timeoutMs);
        this.assertActive(task);
        if (!route || !['pass', 'needs_context', 'unsupported', 'adjudicate', 'handoff'].includes(route.decision)) throw new Error('无效的分流结果，拒绝默认放行');
        // P0/P1 never executes a domain or makes a success/failure judgment.
        const executed = route.decision === 'adjudicate' && route.execution?.schema === 'event_combat_commit_v1' && route.execution.status === 'validated';
        const status = executed ? 'committed' : { pass: 'passed', handoff: 'handed_off', needs_context: 'needs_input', unsupported: 'unsupported', adjudicate: 'unsupported' }[route.decision];
        const details = route.framework === 'auto-preparation-v1' ? copy({ framework: route.framework, policyId: route.policyId,
          scope: route.scope, battlefield: route.battlefield, actions: route.actions, missingInformation: route.missingInformation,
          activationCandidates: route.activationCandidates, preparation: route.preparation }) : {};
        if (JSON.stringify(details).length > 240000) throw new Error('资料快照过大，需缩小提取范围');
        task.event = { ...transitionEvent(task.event, status, executed ? null : route.reasonCode || (route.decision === 'adjudicate' ? 'domain_not_implemented' : route.decision)), route: { decision: route.decision, ...details },
          ...(executed ? { execution: { ...copy(route.execution), status: 'committed' } } : {}) };
      }
      if (['passed', 'committed'].includes(task.event.status)) {
        task.event = { ...task.event, generationBindings: [...task.event.generationBindings, { requestId, kind, status: 'pending', assistantMessageUid: null, swipeUid: null }] };
      }
      task.root = await this.saveEvent(task, task.root, task.event);
      this.assertActive(task);
      if (!['passed', 'committed'].includes(task.event.status)) { this.status(task.event.status, task.event.reasonCode); return { allow: false, event: copy(task.event) }; }
      task.generating = true;
      this.status('generating_story');
      return { allow: true, event: copy(task.event) };
    } catch (error) {
      const pending = error instanceof EventPersistenceError;
      this.status(pending ? 'persistence_pending' : task.controller.signal.aborted ? 'cancelled' : 'rejected', error.message);
      const wasCancelled = task.controller.signal.aborted;
      task.controller.abort();
      if (!pending && task.event && ['captured', 'routing'].includes(task.event.status) && task.epoch === this.epoch) {
        try { task.event = transitionEvent(task.event, wasCancelled ? 'cancelled' : 'rejected', 'request_interrupted'); await this.saveEvent(task, task.root, task.event); }
        catch (saveError) { this.status('persistence_pending', saveError.message); }
      }
      return { allow: false, reason: error.message };
    } finally {
      if (!task.generating) { release(); if (this.active === task) this.active = null; }
    }
  }
  async finish({ messageId = null, stopped = false } = {}) {
    const task = this.active;
    if (!task?.generating || task.finishing) return;
    task.finishing = true;
    try {
      this.store.assertScope(task.scope);
      const inputIndex = task.scope.chat.indexOf(task.input);
      const message = Number.isInteger(messageId) ? task.scope.chat[messageId] : null;
      // The caller must supply the actual MESSAGE_RECEIVED id. Do not bind the
      // global latest message or infer identity from text/GENERATION_ENDED.
      if (!stopped && (!assistant(message) || messageId !== inputIndex + 1 || !message.mes?.trim())) throw new Error('正文消息无法与当前输入精确关联');
      const binding = task.event.generationBindings.find(b => b.requestId === task.requestId);
      if (!binding) throw new Error('正文请求身份丢失');
      const patches = [];
      binding.status = stopped ? 'narrative_failed' : 'completed';
      if (!stopped) {
        const patch = identityPatch(message, this.id);
        binding.assistantMessageUid = patch.value.messageUid; binding.swipeUid = patch.value.swipeUid;
        patch.value.story = { eventId: task.event.eventId, requestId: task.requestId, inputMessageUid: task.event.inputMessageUid };
        patches.push(patch);
      }
      task.root.events[task.event.eventId] = task.event;
      const inputPatch = identityPatch(task.input, this.id);
      inputPatch.value.receipts ??= {}; inputPatch.value.receipts[task.event.eventId] = copy(task.event);
      patches.push(inputPatch);
      await this.store.write(task.scope, task.root, patches);
      this.status(stopped ? 'narrative_failed' : 'completed');
      return stopped ? null : { event: copy(task.event), message, input: task.input };
    } catch (error) { this.status(error instanceof EventPersistenceError ? 'persistence_pending' : 'binding_pending', error.message); }
    finally { task.release(); if (this.active === task) this.active = null; }
  }
  async retryPersistence() {
    const scope = this.store.scope();
    return this.lock.run(`${scope.avatar}:${scope.chatId}`, 'event-persistence-retry', async () => {
      const result = await this.store.retry(); this.status('ready'); return result;
    });
  }
}
