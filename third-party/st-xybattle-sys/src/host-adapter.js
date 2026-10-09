import { projectScenePacket } from './scene-packet.js';
// Contract evidence: docs/host-contract-review.md. Fixtures are not live-host acceptance.
import { HostInputBridge } from './host-input-bridge.js';
import { HostDisplayFolding } from './host-display-folding.js';
import { battlePacketKey, parseBattlePacketMarkers } from './battle-packet-markers.js';
import { normalizeCoreSelection } from './core-rules.js';
const clone = (value) => value == null ? value : JSON.parse(JSON.stringify(value));
const integer = (value) => value != null && value !== '' && Number.isInteger(Number(value)) && Number(value) >= 0 ? Number(value) : null;
const assistant = (message) => !!message && (message.role === 'assistant' || (message.role == null && message.is_user === false && message.extra?.type !== 'narrator'));
const scopeFields = ['chatId', 'branchId', 'messageId', 'swipeId', 'messageUid'];
const matches = (expected, current, lease = false) => {
  if (!expected || !current) return false;
  const stableAnchor = expected.messageUid != null && current.messageUid != null && String(expected.messageUid) === String(current.messageUid);
  const sameFields = scopeFields.every((key) => {
    if (expected[key] == null) return true;
    if (stableAnchor && (key === 'messageId' || key === 'branchId')) return true;
    return String(expected[key]) === String(current[key]);
  });
  return sameFields && (!lease || expected.scopeEpoch == null || expected.scopeEpoch === current.scopeEpoch);
};
const persistedScope = (scope) => Object.fromEntries(scopeFields.map((key) => [key, scope[key]]));
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
function withoutCredentials(value) {
  if (Array.isArray(value)) return value.map(withoutCredentials);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).filter(([key]) => !['apiKey', 'api_key', 'authorization'].includes(key)).map(([key, item]) => [key, withoutCredentials(item)]));
}
function messageUid(message) {
  return message?.extra?.battle_v2_message_uuid || message?.extra?.message_uuid || message?.swipe_info?.find((info) => info?.battle_v2_message_uuid)?.battle_v2_message_uuid || message?.swipes_info?.find((info) => info?.battle_v2_message_uuid)?.battle_v2_message_uuid;
}

export class BattleHostAdapter {
  constructor({ contextProvider = () => globalThis.SillyTavern?.getContext?.() || {}, helper, eventEmitter, eventTypes, windowRef = globalThis, documentRef = globalThis.document, inputBridge, displayFolding, extensionName = 'st-xybattle-sys' } = {}) {
    Object.assign(this, { contextProvider, helperDependency: helper, eventEmitterDependency: eventEmitter, eventTypesDependency: eventTypes, windowRef, documentRef, extensionName });
    this.anchor = null; this.currentScope = null; this.epoch = 0; this.messageUids = new WeakMap();
    this.transcriptListeners = new Set(); this.sentListeners = new Set(); this.scopeListeners = new Set(); this.narrativeListeners = new Set(); this.disposers = []; this.boundEmitter = null;
    this.packet = null; this.activePacket = null; this.injected = false; this.lastInjection = null; this.generationBusy = false;
    this.inputBridge = inputBridge || new HostInputBridge({ contextProvider, documentRef, windowRef, bindPageLifecycle: false, getInputElement: (_context, doc) => doc?.querySelector?.('#send_textarea, textarea#send_textarea, textarea[data-testid="send-textarea"]') || null });
    this.displayFolding = displayFolding || new HostDisplayFolding({ documentRef });
    this.writeQueue = Promise.resolve(); this.uncertainScopes = new Set(); this.disposed = false; this.start();
  }
  context() { return this.contextProvider() || {}; }
  coreRuleConfig() {
    const context = this.context(), card = context.characters?.[context.characterId];
    const characterKey = !context.groupId && typeof card?.avatar === 'string' ? card.avatar : '';
    const selection = characterKey ? context.extensionSettings?.xybattleCoreRules?.[characterKey]?.selection || [] : [];
    return { characterKey, characterName: card?.name || '', selection: normalizeCoreSelection(selection) };
  }
  saveCoreRuleConfig(selection, expectedCharacterKey) {
    const context = this.context(), current = this.coreRuleConfig();
    if (!current.characterKey || current.characterKey !== expectedCharacterKey) throw new Error('角色卡已切换或不可用，请重新打开配置');
    if (!context.extensionSettings || typeof context.saveSettingsDebounced !== 'function') throw new Error('宿主不支持保存角色卡底则配置');
    const map = { ...(context.extensionSettings.xybattleCoreRules || {}) };
    Object.defineProperty(map, current.characterKey, { value: { selection: normalizeCoreSelection(selection) }, enumerable: true, configurable: true, writable: true });
    context.extensionSettings.xybattleCoreRules = map;
    context.saveSettingsDebounced();
    return this.coreRuleConfig();
  }
  async coreWorldbookRequest(path, body) {
    const context = this.context();
    if (typeof context.getRequestHeaders !== 'function') throw new Error('宿主世界书读取接口不可用');
    const response = await fetch(path, { method: 'POST', headers: context.getRequestHeaders(), body: JSON.stringify(body), signal: AbortSignal.timeout(15000), cache: 'no-cache' });
    if (!response.ok) throw new Error(`世界书读取失败（HTTP ${response.status}）`);
    return response.json();
  }
  async listCoreWorldbooks() {
    const data = await this.coreWorldbookRequest('/api/settings/get', {});
    return (data.world_names || []).filter(name => typeof name === 'string');
  }
  async readCoreWorldbook(name) { return this.coreWorldbookRequest('/api/worldinfo/get', { name }); }
  helper() { return this.helperDependency === undefined ? globalThis.TavernHelper : this.helperDependency; }
  chatId(context) { return String(context.chatId ?? context.getCurrentChatId?.() ?? context.chat?.id ?? ''); }
  explicitMessageId(context) { return integer(context.messageId ?? context.message_id ?? context.message?.message_id); }
  latestAssistantId(context) {
    if (!Array.isArray(context.chat)) return null;
    for (let index = context.chat.length - 1; index >= 0; index -= 1) if (assistant(context.chat[index])) return index;
    return null;
  }
  storedAnchorId(context, chatId) {
    if (!Array.isArray(context.chat)) return null;
    const candidates = [];
    for (let index = context.chat.length - 1; index >= 0; index -= 1) {
      const raw = context.chat[index], swipeId = raw?.swipe_id ?? 0;
      const info = raw?.swipe_info?.[swipeId] || raw?.swipes_info?.[swipeId] || raw?.extra || {};
      const store = info?.battle_v2;
      if (!assistant(raw) || store?.schema !== 'battle_v2_host_store' || String(store.scope?.chatId) !== String(chatId) || String(store.scope?.swipeId) !== String(swipeId)) continue;
      const exactIndex = String(store.scope?.messageId) === String(index) ? 1 : 0;
      const version = Number(store.version ?? store.state?.version ?? 0);
      candidates.push({ index, exactIndex, version: Number.isFinite(version) ? version : 0, updatedAt: Date.parse(store.state?.updatedAt || '') || 0 });
    }
    candidates.sort((a, b) => b.exactIndex - a.exactIndex || b.version - a.version || b.updatedAt - a.updatedAt || b.index - a.index);
    return candidates[0]?.index ?? null;
  }
  readMessageSync(id, context = this.context()) {
    const helper = this.helper();
    if (typeof helper?.getChatMessages === 'function') {
      const messages = helper.getChatMessages(id, { include_swipes: true });
      if (messages?.then) throw new Error('getChatMessages must follow the synchronous TavernHelper contract');
      const message = messages?.[0];
      if (message?.message_id !== id) return null;
      const copy = clone(message), rawExtra = context.chat?.[id]?.extra;
      if (copy.swipes_info && rawExtra) copy.swipes_info[copy.swipe_id] = { ...clone(rawExtra), ...copy.swipes_info[copy.swipe_id] };
      return copy;
    }
    const raw = context.chat?.[id] || (this.explicitMessageId(context) === id ? context.message : null);
    if (!raw) return null;
    const swipes = raw.swipes || [raw.mes ?? raw.message ?? ''];
    const swipeId = integer(raw.swipe_id ?? raw.swipeId) ?? 0;
    const infos = Array.from({ length: swipes.length }, (_, index) => clone(raw.swipe_info?.[index] ?? raw.swipes_info?.[index] ?? (index === swipeId ? raw.extra : {}) ?? {}));
    infos[swipeId] = { ...clone(raw.extra || {}), ...infos[swipeId] };
    return { message_id: id, name: raw.name, role: raw.role || (raw.is_user ? 'user' : raw.extra?.type === 'narrator' ? 'system' : 'assistant'), is_hidden: !!raw.is_system, swipe_id: swipeId, swipes: clone(swipes), swipes_data: Array.from({ length: swipes.length }, (_, index) => clone(raw.variables?.[index] ?? raw.swipes_data?.[index] ?? {})), swipes_info: infos };
  }
  selectPreparationSource(message) {
    const context = this.context(), index = context.chat?.indexOf(message);
    if (index < 0 || index !== this.latestAssistantId(context) || message.is_user !== false || message.is_system) throw new Error('人物准备来源不是当前有效回复');
    this.anchor = { chatId: this.chatId(context), messageId: index, raw: message, writable: true };
    return this.scope();
  }
  scope() {
    const context = this.context(), chatId = this.chatId(context), explicitId = this.explicitMessageId(context);
    let id = this.anchor?.chatId === chatId ? this.anchor.messageId : null;
    let recovered = false;
    if (explicitId != null) id = explicitId;
    if (id == null) {
      id = this.storedAnchorId(context, chatId); recovered = id != null;
      if (id == null) id = this.latestAssistantId(context);
      if (id == null) { try { id = integer(this.helper()?.getCurrentMessageId?.()); } catch { /* Message-iframe-only API. */ } }
    }
    let message;
    try { message = id == null ? null : this.readMessageSync(id, context); } catch { message = null; }
    // A deleted anchor must not pin the adapter to a dead array index. Re-scan
    // surviving assistant messages for the latest durable battle checkpoint.
    if (id != null && !assistant(message)) {
      this.anchor = null;
      id = this.storedAnchorId(context, chatId);
      recovered = id != null;
      if (id == null) id = this.latestAssistantId(context);
      try { message = id == null ? null : this.readMessageSync(id, context); } catch { message = null; }
    }
    const raw = context.chat?.[id] || (explicitId === id ? context.message : null);
    if (!chatId || !assistant(message) || integer(message?.swipe_id) == null) {
      this.publishScope({ chatId: chatId || 'default-chat', branchId: 'main', messageId: null, swipeId: null, messageUid: null, available: false, writable: false });
      this.anchor = null; return { ...this.currentScope };
    }
    const storedUid = messageUid(raw) || messageUid(message);
    const sameMessage = this.anchor?.chatId === chatId && this.anchor.messageId === id && (raw ? raw === this.anchor.raw || storedUid === this.anchor.messageUid : !storedUid || storedUid === this.anchor.messageUid);
    let uid = storedUid || (sameMessage ? this.anchor.messageUid : raw && this.messageUids.get(raw));
    if (!uid) uid = globalThis.crypto?.randomUUID?.() || `battle-message-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    if (raw) this.messageUids.set(raw, uid);
    const latest = this.latestAssistantId(context);
    const writable = sameMessage ? this.anchor.writable : recovered || latest == null || latest === id;
    this.anchor = { chatId, messageId: id, messageUid: String(uid), raw, writable };
    this.publishScope({ chatId, branchId: `message:${id}:swipe:${message.swipe_id}`, messageId: id, swipeId: message.swipe_id, messageUid: String(uid), available: true, writable });
    return { ...this.currentScope };
  }
  publishScope(next, force = false) {
    const previous = this.currentScope;
    if (force || !previous || !matches(previous, next) || previous.available !== next.available || previous.writable !== next.writable) {
      this.epoch += 1; this.currentScope = { ...next, scopeEpoch: this.epoch }; this.clearScenePacket();
      for (const listener of this.scopeListeners) listener({ ...this.currentScope }, previous && { ...previous });
    } else this.currentScope = { ...next, scopeEpoch: this.epoch };
  }
  validateScope(expected, { writable = false } = {}) {
    const current = this.scope();
    if (!current.available) throw new Error('No assistant message anchor is available');
    if (!matches(expected, current, true)) throw new Error('Host scope changed; refusing a late cross-chat or cross-swipe operation');
    if (writable && !current.writable) throw new Error('Historical message anchors are read-only');
    return current;
  }
  capability() {
    const context = this.context(), helper = this.helper();
    const read = typeof helper?.getChatMessages === 'function' ? 'tavern-helper' : Array.isArray(context.chat) ? 'context-chat' : 'unavailable';
    const write = read === 'tavern-helper' && typeof helper?.setChatMessages === 'function' ? 'tavern-helper' : Array.isArray(context.chat) ? 'context-chat' : 'unavailable';
    const input = this.inputBridge?.capability?.() || { input: 'unavailable' };
    const injection = input.input === 'available' && this.boundEmitter ? 'input-box-once-generation-event' : typeof helper?.injectPrompts === 'function' && this.boundEmitter ? 'once-generation-event' : 'unavailable';
    return { read, write, save: typeof context.saveChat === 'function' ? 'awaitable-save-chat' : write === 'tavern-helper' ? 'debounced-only' : 'unavailable', injection, input: input.input, display: this.displayFolding ? 'dom-projection' : 'unavailable', events: !!this.boundEmitter, liveVerified: false };
  }
  async ready() { this.start(); return { scope: this.scope(), capability: this.capability() }; }
  subscribeScopeChange(listener) { this.scopeListeners.add(listener); return () => this.scopeListeners.delete(listener); }
  subscribeTranscriptChange(listener) { this.transcriptListeners.add(listener); return () => this.transcriptListeners.delete(listener); }
  subscribePacketSent(listener) { this.sentListeners.add(listener); return () => this.sentListeners.delete(listener); }
  hasSentPacket(record) {
    return (this.context().chat || []).some((message) => (message.is_user || message.role === 'user') && parseBattlePacketMarkers(String(message.mes ?? message.message ?? '')).some((entry) => entry.packet.actionId === record.actionId && (!entry.packet.sessionId || entry.packet.sessionId === record.narrativePacket?.sessionId)));
  }
  hasNarrative(record) { return !!record.narrative?.text && (this.context().chat || []).some((message) => assistant(message) && (message.mes ?? message.message) === record.narrative.text); }
  subscribeNarrative(listener) { this.narrativeListeners.add(listener); return () => this.narrativeListeners.delete(listener); }
  async loadSession(expectedScope = this.scope()) {
    const capability = this.capability();
    try {
      const scope = this.validateScope(expectedScope), message = this.readMessageSync(scope.messageId);
      const store = message?.swipes_info?.[scope.swipeId]?.battle_v2;
      if (!store) return { loaded: false, state: null, receipts: {}, scope, capability };
      if (store.schema !== 'battle_v2_host_store' || !matches(store.scope, scope) || !matches(store.state?.scope || store.scope, scope)) throw new Error('Stored battle_v2 scope does not match this message branch');
      const state = clone(store.state); if (state) state.scope = { ...state.scope, ...scope };
      return { loaded: !!state, state, receipts: clone(store.receipts || {}), version: store.version, scope, capability };
    } catch (error) { return { loaded: false, state: null, receipts: {}, scope: expectedScope, capability, reason: error.message, stale: true }; }
  }
  persistReceipt(receipt, state, expectedScope = receipt?.scope || state?.scope || this.scope()) {
    const scope = { ...expectedScope }, savedReceipt = withoutCredentials(clone(receipt)), savedState = withoutCredentials(clone(state));
    const task = this.writeQueue.catch(() => {}).then(() => this.writeReceipt(savedReceipt, savedState, scope)); this.writeQueue = task; return task;
  }
  async writeReceipt(receipt, state, expectedScope) {
    const capability = this.capability();
    try {
      const scope = this.validateScope(expectedScope, { writable: true });
      if (receipt?.scope && !matches(receipt.scope, scope, true) || state?.scope && !matches(state.scope, scope, true)) throw new Error('Receipt/session scope mismatch');
      if (capability.write === 'unavailable' || capability.save !== 'awaitable-save-chat') return { persisted: false, confirmed: false, scope, capability, reason: 'Awaitable host message persistence is unavailable' };
      const message = this.readMessageSync(scope.messageId);
      if (!message || message.swipe_id !== scope.swipeId) throw new Error('Anchored swipe is no longer selected');
      const previous = message.swipes_info?.[scope.swipeId]?.battle_v2;
      if (previous && (previous.schema !== 'battle_v2_host_store' || !matches(previous.scope, scope))) throw new Error('Existing host store has an incompatible scope/schema');
      const key = canonical(persistedScope(scope));
      const version = Math.max(Number(receipt?.version ?? 0), Number(state?.version ?? 0));
      if (!Number.isFinite(version) || version < 0) throw new Error('Invalid host store version');
      const oldReceipt = receipt?.actionId && previous?.receipts?.[receipt.actionId], cleanReceipt = receipt && { ...receipt, scope: persistedScope(scope) };
      if (previous && version < previous.version) {
        if (!this.uncertainScopes.has(key) && oldReceipt && canonical(oldReceipt) === canonical(cleanReceipt)) return { persisted: true, confirmed: true, scope, capability, deduplicated: true, version: previous.version };
        throw new Error('Older host version refused; persisted state cannot roll back');
      }
      if (receipt && !receipt.actionId) throw new Error('A receipt must carry a stable actionId');
      if (oldReceipt) {
        for (const field of ['actionId', 'roundId', 'action', 'adjudication', 'before', 'after', 'narrativePacket']) {
          if (oldReceipt.status !== 'prepared' && canonical(oldReceipt[field]) !== canonical(cleanReceipt[field])) throw new Error('Conflicting duplicate actionId refused');
        }
        const rank = { prepared: 0, committed: 1, complete: 2 };
        if ((rank[receipt.status] ?? -1) < (rank[oldReceipt.status] ?? -1) && !receipt.rewrittenAt) throw new Error('Receipt status cannot regress');
      }
      const next = { ...(previous || {}), schema: 'battle_v2_host_store', scope: persistedScope(scope), version: Math.max(version, previous?.version || 0), state: state ? { ...state, scope: { ...state.scope, ...persistedScope(scope) } } : previous?.state || null, receipts: { ...previous?.receipts } };
      if (state?.rollback?.reason === 'host-message-deleted' && version > (previous?.version || 0)) {
        for (const id of state.rollback.removedActionIds || []) if (!state.history.some((record) => record.actionId === id)) delete next.receipts[id];
        next.lastActionId = state.history.filter((record) => ['committed', 'complete'].includes(record.status)).at(-1)?.actionId || null;
      }
      if (cleanReceipt) { next.receipts[receipt.actionId] = cleanReceipt; next.lastActionId = receipt.actionId; }
      if (!this.uncertainScopes.has(key) && previous && canonical(previous) === canonical(next)) return { persisted: true, confirmed: true, scope, capability, deduplicated: true, version: next.version };
      const infos = message.swipes_info.map((info) => clone(info || {}));
      infos[scope.swipeId] = { ...infos[scope.swipeId], battle_v2_message_uuid: scope.messageUid, battle_v2: next };
      const payload = { message_id: message.message_id, swipe_id: message.swipe_id, swipes: clone(message.swipes), swipes_data: clone(message.swipes_data), swipes_info: infos };
      this.validateScope(scope, { writable: true }); const context = this.context(); this.uncertainScopes.add(key);
      if (capability.write === 'tavern-helper') {
        if (await this.helper().setChatMessages([payload], { refresh: 'none' }) === false) throw new Error('setChatMessages returned false');
      } else Object.assign(context.chat[scope.messageId], { swipe_id: payload.swipe_id, swipes: payload.swipes, variables: payload.swipes_data, swipe_info: payload.swipes_info, mes: payload.swipes[payload.swipe_id], extra: payload.swipes_info[payload.swipe_id] });
      this.validateScope(scope, { writable: true });
      if (await context.saveChat() === false) throw new Error('saveChat returned false');
      this.validateScope(scope, { writable: true });
      const read = this.readMessageSync(scope.messageId)?.swipes_info?.[scope.swipeId]?.battle_v2;
      if (canonical(read) !== canonical(next)) throw new Error('Host persistence readback mismatch');
      this.uncertainScopes.delete(key);
      return { persisted: true, confirmed: true, scope, capability, version: next.version };
    } catch (error) { return { persisted: false, confirmed: false, scope: expectedScope, capability, reason: error.message, stale: /scope|swipe|Older|Historical|anchor/.test(error.message) }; }
  }
  async injectScenePacket(packet, expectedScope = packet?.scope || this.scope(), { userAction = '' } = {}) {
    this.start();
    try {
      const scope = this.validateScope(expectedScope, { writable: true });
      if (!packet || packet.type !== 'BATTLE_SCENE_PACKET' || !packet.actionId) throw new Error('A committed BATTLE_SCENE_PACKET with actionId is required');
      if (packet.scope && !matches(packet.scope, scope, true)) throw new Error('Scene packet scope mismatch');
      if (this.capability().injection === 'unavailable') return { queued: false, injected: false, capability: this.capability(), reason: 'injectPrompts or generation events are unavailable' };
      const store = this.readMessageSync(scope.messageId)?.swipes_info?.[scope.swipeId]?.battle_v2, receipt = store?.receipts?.[packet.actionId];
      if (this.uncertainScopes.has(canonical(persistedScope(scope)))) throw new Error('Host persistence is unconfirmed after a failed save');
      if (!receipt || ['prepared', 'judging'].includes(receipt.status)) throw new Error('Scene packet has no persisted committed receipt');
      if (packet.version != null && Number(packet.version) !== store.version) throw new Error('Scene packet version mismatch');
      const key = battlePacketKey(packet, { branchId: scope.branchId, version: store.version });
      if (!key) throw new Error('Scene packet identity is incomplete');
      if (this.packet?.key === key || this.activePacket?.key === key) return { queued: true, injected: !!this.activePacket, deduplicated: true, scope, capability: this.capability() };
      this.clearScenePacket();
      packet = projectScenePacket(packet);
      const inputResult = this.inputBridge?.append?.(packet, { ...scope, version: store.version }, { userAction });
      if (inputResult?.conflict) throw new Error(inputResult.reason || 'Input contains a conflicting XY_BATTLE_PACKET');
      this.packet = { ...clone(packet), packet: clone(packet), scope, version: store.version, key, transportCandidate: inputResult?.queued ? 'input-box' : null, inputResult };
      return { queued: true, injected: false, scope, transport: inputResult?.queued ? 'input-box' : 'extension-prompt', pendingVerification: !!inputResult?.queued, capability: this.capability() };
    } catch (error) { this.clearScenePacket(); return { queued: false, injected: false, reason: error.message, stale: true, capability: this.capability() }; }
  }
  sendQueuedScenePacket(expectedScope = this.packet?.scope || this.activePacket?.scope) {
    const pending = this.packet || this.activePacket;
    if (!pending) return { requested: false, reason: '没有待发送的场景包' };
    try {
      const scope = this.validateScope(expectedScope, { writable: true });
      const store = this.readMessageSync(scope.messageId)?.swipes_info?.[scope.swipeId]?.battle_v2;
      if (store?.version !== pending.version || !store.receipts?.[pending.packet.actionId]) throw new Error('场景包已过期，请重新注入本轮裁定');
      if (pending.sendRequested || this.activePacket) return { requested: true, deduplicated: true };
      if (this.generationBusy) throw new Error('酒馆正在生成，请结束当前生成后点击“发送主剧情”重试');
      const button = this.documentRef?.querySelector?.('#send_but');
      const input = this.documentRef?.querySelector?.('#send_textarea, textarea[data-testid="send-textarea"]');
      const style = button && (this.documentRef?.defaultView || this.windowRef)?.getComputedStyle?.(button);
      if (!button || typeof button.click !== 'function' || button.disabled || button.hidden || button.getAttribute('aria-disabled') === 'true' || button.classList.contains('disabled') || style?.display === 'none' || style?.visibility === 'hidden' || input?.disabled) throw new Error('酒馆发送按钮当前不可用，场景包已保留，可点击“发送主剧情”重试');
      // Send through the native composer to preserve normal presets, worldbook
      // recall, user-message creation and all existing generation hooks.
      if (pending.transportCandidate !== 'input-box' || !this.inputBridge?.verify?.(pending.packet, { ...scope, version: pending.version })?.valid) throw new Error('输入框场景包校验失败，未自动发送');
      pending.sendRequested = true; // Set before click: host hooks may run synchronously.
      button.click();
      return { requested: true, transport: 'native-send-button' };
    } catch (error) {
      pending.sendRequested = false;
      return { requested: false, reason: error.message };
    }
  }
  beforeGeneration(...args) {
    if (!this.packet || this.activePacket) return;
    const type = typeof args[0] === 'string' ? args[0] : args[0]?.type;
    if (type && !['normal', 'generate'].includes(type) || args.some((arg) => arg === true || arg?.dryRun === true || arg?.dry_run === true)) return;
    const pending = this.packet;
    try {
      this.validateScope(pending.scope, { writable: true });
      const store = this.readMessageSync(pending.scope.messageId)?.swipes_info?.[pending.scope.swipeId]?.battle_v2;
      if (!store || store.version !== pending.version || !store.receipts?.[pending.packet.actionId]) throw new Error('Scene packet version/scope changed before generation');
      const context = this.context(), baselineId = this.latestAssistantId(context), baselineText = baselineId == null ? null : context.chat[baselineId]?.mes;
      const inputResult = pending.transportCandidate === 'input-box' ? this.inputBridge?.verify?.(pending.packet, { ...pending.scope, version: pending.version }) : { valid: false };
      if (inputResult?.valid) {
        this.activePacket = { ...pending, baselineId, baselineText, transport: 'input-box', inputResult }; this.packet = null; this.injected = true;
        this.lastInjection = { injected: true, transport: 'input-box', verified: false, pendingVerification: true, deduplicated: !!inputResult.deduplicated, actionId: pending.packet.actionId, scope: pending.scope };
        return;
      }
      this.inputBridge?.clear?.();
      const helper = this.helper();
      if (typeof helper?.injectPrompts !== 'function') throw new Error(inputResult?.reason || 'injectPrompts is unavailable');
      const result = helper.injectPrompts([{ id: `${this.extensionName}:battle_v2:${pending.packet.actionId}`, role: 'system', position: 'in_chat', depth: 0, should_scan: false, content: JSON.stringify(pending.packet), filter: () => { try { this.validateScope(pending.scope); return this.readMessageSync(pending.scope.messageId)?.swipes_info?.[pending.scope.swipeId]?.battle_v2?.version === pending.version; } catch { return false; } } }], { once: true });
      if (typeof result?.uninject !== 'function') throw new Error('injectPrompts did not return its documented uninject handle');
      this.activePacket = { ...pending, uninject: result.uninject, baselineId, baselineText, transport: 'extension-prompt' }; this.packet = null; this.injected = true;
      this.lastInjection = { injected: true, transport: 'extension-prompt', actionId: pending.packet.actionId, scope: pending.scope };
    } catch (error) { this.clearScenePacket(); this.lastInjection = { injected: false, reason: error.message }; }
  }
  async finishGeneration(status) {
    this.generationBusy = false;
    const active = this.activePacket; this.clearScenePacket(); if (!active) return;
    if (active.transport === 'input-box' && active.inputVerified !== true) this.lastInjection = { ...this.lastInjection, transport: 'input-box', verified: false, pendingVerification: false, reason: 'The rendered user message was not observed with an exact XY_BATTLE_PACKET' };
    try {
      this.validateScope(active.scope);
      if (this.readMessageSync(active.scope.messageId)?.swipes_info?.[active.scope.swipeId]?.battle_v2?.version !== active.version) throw new Error('Scene packet version changed during generation');
      const context = this.context(), id = this.latestAssistantId(context), message = id == null ? null : context.chat[id];
      let text = message?.mes ?? message?.message ?? '';
      if (id != null && typeof this.helper()?.getChatMessages === 'function') text = this.helper().getChatMessages(id, { include_swipes: false })?.[0]?.message ?? text;
      const complete = status === 'complete' && typeof text === 'string' && text.trim() && (id !== active.baselineId || text !== active.baselineText);
      const event = { actionId: active.packet.actionId, scope: active.scope, text: complete ? text : '', status: complete ? 'complete' : 'stopped', packet: clone(active.packet), messageId: id, transport: active.transport, inputVerified: active.inputVerified };
      for (const listener of this.narrativeListeners) await listener(event);
    } catch (error) { this.lastInjection = { injected: false, reason: error.message, stale: true }; }
  }
  verifyRenderedUserMessage(messageId) {
    const active = this.activePacket;
    if (!active || active.transport !== 'input-box') return;
    const context = this.context();
    const id = integer(messageId) ?? (Array.isArray(context.chat) ? context.chat.reduce((found, item, index) => item?.is_user || item?.role === 'user' ? index : found, null) : null);
    const raw = id == null ? null : context.chat?.[id];
    const text = raw?.mes ?? raw?.message ?? '';
    const exact = parseBattlePacketMarkers(String(text)).some((entry) => entry.key === active.key);
    active.inputVerified = exact;
    if (exact) {
      for (const listener of this.sentListeners) listener({ actionId: active.packet.actionId, scope: active.scope, transport: 'input-box' });
      this.lastInjection = { ...this.lastInjection, transport: 'input-box', verified: true, pendingVerification: false }; return; }
    // The host created a user message without the marker. The input transport
    // is therefore not authoritative; add one extension prompt before prompt
    // assembly, with no simultaneous input marker transport.
    const helper = this.helper();
    try {
      if (typeof helper?.injectPrompts !== 'function') throw new Error('injectPrompts is unavailable after input verification failed');
      const result = helper.injectPrompts([{ id: `${this.extensionName}:battle_v2:${active.packet.actionId}`, role: 'system', position: 'in_chat', depth: 0, should_scan: false, content: JSON.stringify(active.packet), filter: () => { try { this.validateScope(active.scope); return this.readMessageSync(active.scope.messageId)?.swipes_info?.[active.scope.swipeId]?.battle_v2?.version === active.version; } catch { return false; } } }], { once: true });
      if (typeof result?.uninject !== 'function') throw new Error('injectPrompts did not return its documented uninject handle');
      active.uninject = result.uninject;
      active.transport = 'extension-prompt';
      this.lastInjection = { injected: true, transport: 'extension-prompt', fallback: true, actionId: active.packet.actionId, scope: active.scope, reason: 'Rendered user message did not retain exact XY_BATTLE_PACKET' };
    } catch (error) {
      this.lastInjection = { injected: false, transport: 'input-box', verified: false, reason: error.message };
    }
  }
  clearScenePacket() {
    const active = this.activePacket, pending = this.packet; this.activePacket = null; this.packet = null; this.injected = false;
    if (active?.uninject) active.uninject();
    if (active?.transport === 'input-box' || pending?.transportCandidate === 'input-box') this.inputBridge?.clear?.();
  }
  start() {
    if (this.disposed) return this.capability();
    const context = this.context(), helper = this.helper(), emitter = this.eventEmitterDependency || context.eventSource || helper?.eventSource;
    if (emitter === this.boundEmitter && this.disposers.length) return this.capability();
    if (this.disposers.length) { for (const dispose of this.disposers.splice(0)) dispose(); this.boundEmitter = null; }
    const events = this.eventTypesDependency || context.event_types || helper?.tavern_events || globalThis.tavern_events || {};
    const on = (name, handler) => { if (!emitter?.on) return; emitter.on(name, handler); this.disposers.push(() => (emitter.off || emitter.removeListener)?.call(emitter, name, handler)); };
    if (emitter?.on) {
      this.boundEmitter = emitter;
      on(events.GENERATION_STARTED || 'GENERATION_STARTED', (...args) => {
        if (!args.some((arg) => arg === true || arg?.dryRun === true || arg?.dry_run === true)) this.generationBusy = true;
      });
      on(events.GENERATION_AFTER_COMMANDS || 'GENERATION_AFTER_COMMANDS', (...args) => this.beforeGeneration(...args));
      on(events.GENERATION_ENDED || 'GENERATION_ENDED', () => this.finishGeneration('complete'));
      on(events.GENERATION_STOPPED || 'GENERATION_STOPPED', () => this.finishGeneration('stopped'));
      const iframeEnded = helper?.iframe_events?.GENERATION_ENDED;
      if (iframeEnded && iframeEnded !== events.GENERATION_ENDED) on(iframeEnded, () => this.finishGeneration('complete'));
      on(events.CHAT_CHANGED || 'CHAT_CHANGED', () => { this.clearScenePacket(); this.anchor = null; const next = this.scope(); this.publishScope(next, true); });
      for (const name of ['MESSAGE_SWIPED', 'MESSAGE_SWIPE_DELETED', 'MESSAGE_DELETED', 'MESSAGE_UPDATED']) on(events[name] || name, (messageId) => {
        this.clearScenePacket();
        if (name === 'MESSAGE_SWIPED' && integer(messageId) != null && this.anchor) this.anchor = { ...this.anchor, messageId: integer(messageId), raw: null };
        this.scope();
        if (name === 'MESSAGE_DELETED') return Promise.all([...this.transcriptListeners].map((listener) => listener()));
      });
      on(events.USER_MESSAGE_RENDERED || 'USER_MESSAGE_RENDERED', (messageId) => { this.displayFolding?.apply?.(); this.verifyRenderedUserMessage(messageId); });
      for (const name of ['CHARACTER_MESSAGE_RENDERED', 'MESSAGE_RENDERED']) on(events[name] || name, () => { this.displayFolding?.apply?.(); this.scope(); });
    }
    this.displayFolding?.observe?.();
    if (this.windowRef?.addEventListener) { const handler = () => this.clearScenePacket(); this.windowRef.addEventListener('pagehide', handler); this.disposers.push(() => this.windowRef.removeEventListener?.('pagehide', handler)); }
    return this.capability();
  }
  dispose() { this.clearScenePacket(); this.inputBridge?.dispose?.(); this.displayFolding?.dispose?.(); for (const dispose of this.disposers.splice(0)) dispose(); this.boundEmitter = null; this.scopeListeners.clear(); this.narrativeListeners.clear(); this.transcriptListeners.clear(); this.sentListeners.clear(); this.disposed = true; }
}
export function createHostAdapter(contextProvider) { return new BattleHostAdapter(typeof contextProvider === 'function' ? { contextProvider } : contextProvider); }
