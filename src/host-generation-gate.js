import { newEventId } from './event-state.js';

export const EVENT_INTERCEPTOR_NAME = 'xyEventGenerationInterceptor';
const supportedKinds = new Set(['normal', 'regenerate', 'swipe']);

export class HostGenerationGate {
  constructor({ coordinator, contextProvider = () => globalThis.SillyTavern?.getContext(), windowRef = globalThis,
    isLegacySend = () => false, onStatus = () => {}, id = newEventId, completionTimeoutMs = 10000 } = {}) {
    Object.assign(this, { coordinator, contextProvider, windowRef, isLegacySend, onStatus, id, completionTimeoutMs });
    this.enabled = false; this.disposers = []; this.intent = null; this.started = false;
    this.interceptor = (...args) => this.intercept(...args);
  }
  capability() {
    const c = this.contextProvider() || {};
    return { installed: this.started, enabled: this.enabled, entry: 'manifest.generate_interceptor',
      singleChat: !!c.chatId && !c.groupId, readback: !!(this.coordinator.store.readRemote || (this.coordinator.store.fetchRef && c.getRequestHeaders)),
      normalSend: true, resume: true, cancellation: 'explicit-abort-retains-user-message',
      promptInjection: typeof this.windowRef.TavernHelper?.injectPrompts === 'function',
      messageMetadata: Array.isArray(c.chat) && !!c.chatMetadata,
      generationAssociation: 'native-start-and-message-received',
      liveVerified: false, automaticRouting: typeof this.coordinator.router === 'function',
      reason: this.enabled ? null : '自动事件入口已安装，需配置模型并显式启用' };
  }
  clearPacket() { this.packetHandle?.uninject?.(); this.packetHandle = null; }
  cancelObservation() { this.observation?.abort(); this.observation = null; }
  injectPacket(event, intent) {
    const packet = event.execution?.packet;
    if (!packet) return;
    this.clearPacket();
    const helper = this.windowRef.TavernHelper;
    if (typeof helper?.injectPrompts !== 'function') throw new Error('已提交裁定，但宿主缺少内部结果注入接口；修复后重生成可复用结果');
    this.packetHandle = helper.injectPrompts([{ id: `xy-event:${event.eventId}`, role: 'system', position: 'in_chat', depth: 0, should_scan: false,
      content: '本轮以下结果已由独立裁定器提交。正文只描写这些既定事实，不重复扣费、不重判成败，不为未裁定行动补写结果。\n' + JSON.stringify(packet),
      filter: () => this.enabled && this.intent === intent && this.matches(intent) }], { once: true });
    if (typeof this.packetHandle?.uninject !== 'function') throw new Error('宿主注入接口未返回清理句柄');
  }
  start() {
    if (this.started) return this;
    const c = this.contextProvider();
    if (!c?.eventSource?.on || !c.eventTypes) return this;
    if (this.windowRef[EVENT_INTERCEPTOR_NAME] && this.windowRef[EVENT_INTERCEPTOR_NAME] !== this.interceptor) throw new Error('事件拦截器已被另一实例安装');
    this.windowRef[EVENT_INTERCEPTOR_NAME] = this.interceptor;
    const bind = (key, fn) => {
      const event = c.eventTypes[key]; if (!event) return;
      const safe = (...args) => Promise.resolve().then(() => fn(...args)).catch(error => this.onStatus({ status: 'blocked', reason: error.message }));
      c.eventSource.on(event, safe);
      this.disposers.push(() => (c.eventSource.removeListener || c.eventSource.off).call(c.eventSource, event, safe));
    };
    bind('GENERATION_STARTED', (kind = 'normal', _params, dryRun) => {
      if (!this.enabled || dryRun) return;
      this.cancelObservation();
      if (this.intent?.running || this.intent?.accepted || this.coordinator.active) return;
      const context = this.contextProvider();
      this.intent = { kind: kind || 'normal', requestId: this.id(), chat: context.chat, chatId: context.chatId, input: null, received: null, ended: false };
    });
    bind('MESSAGE_SENT', messageId => {
      const c = this.contextProvider(), intent = this.intent;
      if (!intent || intent.chat !== c.chat || intent.input) return;
      if (Number.isInteger(messageId) && c.chat[messageId]?.is_user) intent.input = c.chat[messageId];
    });
    bind('MESSAGE_RECEIVED', async (messageId) => {
      const intent = this.intent;
      // ST reports a regenerated/swiped assistant as "normal" here. The
      // captured chat, input and exact next message provide the association.
      if (!intent?.accepted || !this.matches(intent)) return;
      const c = this.contextProvider();
      if (messageId !== c.chat.indexOf(intent.input) + 1 || c.chat[messageId]?.is_user !== false) return;
      intent.received = messageId;
      if (intent.ended) await this.complete(intent);
    });
    bind('GENERATION_ENDED', async () => {
      const intent = this.intent;
      if (!intent?.accepted || !this.matches(intent)) return;
      intent.ended = true;
      if (intent.received !== null) await this.complete(intent);
      // In ST streaming, ENDED can precede RECEIVED. Never guess the latest id.
      else if (!intent.completionTimer) intent.completionTimer = setTimeout(() => {
        if (this.intent !== intent) return;
        void this.coordinator.finish({ stopped: true }).finally(() => { this.clearPacket(); if (this.intent === intent) this.intent = null; });
      }, this.completionTimeoutMs);
    });
    bind('GENERATION_STOPPED', async () => {
      this.cancelObservation();
      clearTimeout(this.intent?.completionTimer);
      this.clearPacket();
      this.coordinator.cancel();
      await this.coordinator.finish({ stopped: true });
      this.intent = null;
    });
    for (const key of ['CHAT_CHANGED', 'MESSAGE_SWIPED', 'MESSAGE_EDITED', 'MESSAGE_DELETED']) bind(key, () => {
      // Native regenerate removes the previous assistant before the manifest
      // hook. This is part of the captured request, not a user scope switch.
      if (key === 'MESSAGE_DELETED' && this.intent?.kind === 'regenerate' && !this.intent.running && !this.coordinator.active && this.matches(this.intent)) return;
      clearTimeout(this.intent?.completionTimer);
      this.clearPacket();
      this.cancelObservation();
      this.coordinator.scopeChanged(); this.intent = null;
    });
    this.started = true;
    return this;
  }
  matches(intent) {
    const c = this.contextProvider();
    return c?.chat === intent.chat && c.chatId === intent.chatId;
  }
  async complete(intent) {
    if (this.intent !== intent) return;
    clearTimeout(intent.completionTimer);
    const completed = await this.coordinator.finish({ messageId: intent.received });
    this.clearPacket();
    if (this.intent === intent) this.intent = null;
    if (completed && this.enabled && this.matches(intent)) {
      this.cancelObservation();
      this.observation = new AbortController();
      void this.afterNarrative?.({ ...completed, signal: this.observation.signal });
    }
  }
  async setEnabled(enabled) {
    if (!enabled) {
      this.cancelObservation();
      clearTimeout(this.intent?.completionTimer);
      this.clearPacket();
      this.enabled = false; this.coordinator.cancel('事件入口已关闭');
      await this.coordinator.finish({ stopped: true }); this.intent = null; return this.capability();
    }
    this.start();
    if (!this.started || !this.capability().readback || typeof this.coordinator.router !== 'function') throw new Error('宿主能力或分流器未配置，不能启用默认入口');
    await this.coordinator.recover();
    this.enabled = true; return this.capability();
  }
  async intercept(_chat, _contextSize, abort, kind = 'normal') {
    if (!this.enabled) return;
    const intent = this.intent;
    try {
      if (typeof abort !== 'function') throw new Error('宿主缺少显式 abort 接口');
      if (this.isLegacySend()) { this.intent = null; return; }
      if (!supportedKinds.has(kind)) {
        // Quiet/impersonation/continue do not create a P1 user event. While a
        // transaction is busy, refuse competing native generation instead.
        if (this.coordinator.active) abort(true);
        this.intent = null; return;
      }
      if (!intent || !this.matches(intent) || intent.kind !== kind) throw new Error('无法确认原生用户请求来源');
      if (intent.accepted || intent.running) { abort(true); return; }
      if (kind !== 'normal') {
        const messages = this.contextProvider().chat;
        intent.input = [...messages].reverse().find(message => message.is_user) || null;
      }
      if (!intent.input) throw new Error('无法关联本次用户消息');
      intent.running = true;
      const result = await this.coordinator.enter({ input: intent.input, kind, requestId: intent.requestId });
      if (!result.allow || this.intent !== intent || !this.enabled || !this.matches(intent)) {
        abort(true); if (this.intent === intent) this.intent = null;
        if (result.event?.status === 'handed_off' && this.enabled && this.matches(intent)) void this.onCombatHandoff?.(result.event);
        return;
      }
      this.injectPacket(result.event, intent);
      intent.accepted = true;
    } catch (error) {
      abort?.(true);
      this.coordinator.cancel(error.message);
      this.clearPacket();
      await this.coordinator.finish({ stopped: true });
      if (this.intent === intent) this.intent = null;
      this.onStatus({ status: 'blocked', reason: error.message });
    }
  }
  dispose() {
    this.cancelObservation();
    clearTimeout(this.intent?.completionTimer);
    this.clearPacket();
    this.enabled = false; this.coordinator.scopeChanged(); this.intent = null;
    for (const dispose of this.disposers.splice(0)) dispose();
    if (this.windowRef[EVENT_INTERCEPTOR_NAME] === this.interceptor) delete this.windowRef[EVENT_INTERCEPTOR_NAME];
    this.started = false;
  }
}
