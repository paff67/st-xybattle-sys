import { observeOperation, bindTrace, signalTrace } from './operation-log.js';
import { activationBranchKey, activationFingerprint, observeBattleState } from './battle-state-observer.js';
import { copyEvent } from './event-state.js';

const ledger = root => root.battleActivation ||= { schema: 'battle_activation_v1', observations: {}, records: {} };
const terminal = new Set(['accepted', 'cancelled', 'obsolete', 'failed', 'needs_context']);
export class BattleEntryCoordinator {
  constructor({ store, lock, controller, onStatus = () => {} }) { Object.assign(this, { store, lock, controller, onStatus }); this.active = null; }
  async mutate(scope, operation, signal, guard) {
    return this.lock.queued(`${scope.avatar}:${scope.chatId}`, 'battle-entry', async () => {
      this.store.assertScope(scope);
      const root = await this.store.load(scope);
      this.store.assertScope(scope);
      const result = await operation(ledger(root));
      const trace = signalTrace(signal);
      if (trace) await trace.span('activation-save', () => this.store.write(scope, root, [], guard));
      else await this.store.write(scope, root, [], guard);
      return result;
    }, { signal });
  }
  async observe(input, trace) {
    if (!trace) return observeOperation('battle-observation', { chatId: this.store.scope().chatId, branchId:input.identity?.branchUid, requestId:input.identity?.requestId, parentRunId:signalTrace(input.signal)?.runId }, next => this.observe(input,next));
    const scope = this.store.scope();
    const candidate = await this.mutate(scope, data => {
      input.guard();
      const key = activationBranchKey(input.identity);
      const result = observeBattleState(data.observations[key], input);
      data.observations[key] = result.observation;
      if (result.candidate) {
        const candidate = result.candidate;
        data.records[candidate.activationId] ||= { ...candidate, sources: [candidate.source], status: input.identity.skipped ? 'cancelled' : 'queued', reason: input.identity.skipped ? 'user_skipped_adjudication' : null };
        return candidate;
      }
      return null;
    }, input.signal, input.guard);
    trace.write('route',candidate?'success':'skipped','战界边沿选择结果',{selected:!!candidate,reasonCode:candidate?'activation_edge':'no_new_edge'});
    // Do not hold the variable observer while a model is working.
    if (candidate) void this.request({ ...input, ...candidate, scope, parentRunId:trace.runId }).catch(error => this.onStatus({ status: 'battle_failed', reason: error.message }));
    return candidate;
  }
  async request(input, trace) {
    if (!trace) return observeOperation('battle-entry', { chatId:(input.scope || this.store.scope()).chatId, branchId:input.branchUid, requestId:input.requestId, eventId:input.parentEventId, activationId:input.activationId, parentRunId:input.parentRunId || signalTrace(input.signal)?.runId }, next => this.request(input,next));
    const scope = input.scope || this.store.scope();
    const activationId = input.activationId || `entry-${activationFingerprint([scope.chatId, input.parentEventId, input.requestId, input.messageFingerprint])}`;
    const abort = new AbortController(), task = { activationId, scope, abort };
    bindTrace(abort.signal,trace);
    const guard = () => { this.store.assertScope(scope); input.guard?.(); if (abort.signal.aborted || input.signal?.aborted) throw new DOMException('战斗准备已取消', 'AbortError'); };
    let record;
    try {
      record = await this.mutate(scope, data => {
        guard();
        const existing = data.records[activationId];
        if (existing && (terminal.has(existing.status) || existing.status === 'preparing')) return copyEvent(existing);
        const related = Object.values(data.records).find(row => row.activationId !== activationId && ['preparing', 'accepted'].includes(row.status) && row.parentEventId && row.parentEventId === input.parentEventId && row.branchUid === input.branchUid && row.requestId === input.requestId && (!row.swipeUid || !input.swipeUid || row.swipeUid === input.swipeUid));
        const value = existing || { activationId, source: input.source, parentEventId: input.parentEventId, requestId: input.requestId,
          branchUid: input.branchUid, assistantMessageUid: input.assistantMessageUid, swipeUid: input.swipeUid, messageFingerprint: input.messageFingerprint,
          before: input.before, after: input.after, sources: [input.source] };
        if (related) {
          related.sources = [...new Set([...related.sources, input.source])];
          value.status = related.status; value.sessionId = related.sessionId; value.relatedActivationId = related.activationId;
        } else if (this.active) { value.status = 'needs_context'; value.reason = '另一项战斗准备正在进行，请稍后手动打开'; }
        else { value.status = 'preparing'; this.active = task; }
        data.records[activationId] = value;
        return copyEvent(value);
      }, input.signal, guard);
      trace.identify({ activationId }); trace.write('route',this.active===task?'success':'skipped','战斗入口选择结果',{status:record.status,reasonCode:record.relatedActivationId?'related_activation':this.active===task?'new_activation':'already_recorded'});
      if (this.active !== task) {
        if (record.status === 'accepted') {
          const acceptedId = record.relatedActivationId || activationId;
          if (this.controller.state?.battleEntry?.activationId === acceptedId && this.controller.state.sessionId === record.sessionId) await this.controller.requestBattleEntry({ ...input, activationId: acceptedId, signal: input.signal, guard });
          else this.onStatus({ status: 'battle_needs_context', reason: '此边沿已有接管记录；请从工作台恢复保存的战斗，不自动重发人物请求', activationId });
        }
        return record;
      }
      this.onStatus({ status: 'battle_preparing', reason: '检测到战斗入口，正在读取当前人物并提取对手资料', activationId });
      const cancel = () => this.cancel('source_invalidated');
      input.signal?.addEventListener('abort', cancel, { once: true });
      let result;
      try {
        result = await this.controller.requestBattleEntry({ ...input, activationId, signal: abort.signal, guard, trace,
          apply: operation => this.lock.queued(`${scope.avatar}:${scope.chatId}`, `entry-result:${activationId}`, async () => { guard(); return operation(); }, { signal: abort.signal }) });
      } finally { input.signal?.removeEventListener('abort', cancel); }
      guard();
      await this.mutate(scope, data => {
        guard(); const current = data.records[activationId];
        if (current.status !== 'preparing') throw new DOMException('接管记录已被撤销', 'AbortError');
        Object.assign(current, { status: result.status === 'already_accepted' ? 'accepted' : result.status, sessionId: result.sessionId, reason: result.reason || null });
        for (const linked of Object.values(data.records)) if (linked.relatedActivationId === activationId) Object.assign(linked, { status: current.status, sessionId: current.sessionId, reason: current.reason });
      }, abort.signal, guard);
      this.onStatus({ status: `battle_${result.status === 'already_accepted' ? 'accepted' : result.status}`, reason: result.reason || '战斗资料已接管，等待人物确认与行动', activationId, sessionId: result.sessionId });
      return result;
    } catch (error) {
      trace.fail('battle-entry',error);
      // Unknown persistence outcomes remain retained by HostEventStore.pending.
      if ((this.active === task || input.activationId) && !this.store.pending) {
        try { await this.mutate(scope, data => {
          const current = data.records[activationId];
          if (current && !terminal.has(current.status) && (this.active === task || current.status === 'queued')) {
            current.status = abort.signal.aborted || input.signal?.aborted ? 'cancelled' : error.name === 'AbortError' ? 'obsolete' : 'failed'; current.reason = error.message;
            for (const linked of Object.values(data.records)) if (linked.relatedActivationId === activationId) Object.assign(linked, { status: current.status, reason: current.reason });
          }
        }); } catch { /* Keep uncertain receipt; recovery must not rerun it. */ }
      }
      if (error.name !== 'AbortError') throw error;
      return { status: 'cancelled' };
    } finally { if (this.active === task) this.active = null; }
  }
  cancel(reason = 'user_cancelled') {
    const task = this.active;
    if (!task) return false;
    task.abort.abort(); this.controller.cancelCharacterPreparation();
    this.onStatus({ status: 'battle_cancelled', reason: '已取消战斗准备；保留待裁定状态，不追加正文', activationId: task.activationId });
    // Mark consumed even when the provider never resolves its request.
    void this.mutate(task.scope, data => {
      const row = data.records[task.activationId];
      if (row && row.status !== 'accepted') {
        row.status = 'cancelled'; row.reason = reason;
        for (const linked of Object.values(data.records)) if (linked.relatedActivationId === task.activationId) Object.assign(linked, { status: row.status, reason: row.reason });
      }
    }).catch(() => {});
    return true;
  }
  async recover(trace) {
    if (!trace) return observeOperation('battle-recovery', {chatId:this.store.scope().chatId}, next=>this.recover(next));
    const scope = this.store.scope();
    return this.mutate(scope, data => {
      for (const row of Object.values(data.records)) {
        if (!['queued', 'preparing'].includes(row.status)) continue;
        const accepted = this.controller.state?.battleEntry;
        if (accepted?.activationId === (row.relatedActivationId || row.activationId) && accepted.status === 'accepted' && (!this.controller.hostAdapter || this.controller.state.hostSync?.status === 'confirmed')) Object.assign(row, { status: 'accepted', sessionId: this.controller.state.sessionId });
        else { row.status = 'needs_context'; row.reason = 'interrupted_reload：请手动恢复，自动请求不会重发'; }
      }
      return copyEvent(data.records);
    });
  }
}
