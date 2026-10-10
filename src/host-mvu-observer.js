import { operationLog, bindTrace } from './operation-log.js';
import { selectedMvu, activationFingerprint } from './battle-state-observer.js';
import { copyEvent, newEventId } from './event-state.js';

const dataHash = value => activationFingerprint(value?.stat_data ?? value?.data?.stat_data ?? value);
// The installed MVU writer adds/removes these presentation wrappers between
// BEFORE_MESSAGE_UPDATE and its message-variable commit. Other edits invalidate.
const comparableText = text => String(text || '').replaceAll('<StatusPlaceHolderImpl/>', '').replace(/<(status_current_variable)>(?:(?!<\1>).)*<\/\1?>/gis, '').trimEnd();
// MVU's callbacks are signals, not receipts. No save/model call is awaited on
// its event bus: the exact native response is reread after the writer returns.
export class HostMvuObserver {
  constructor({ contextProvider, windowRef, coordinator, gate, onObservation, onInvalidate = () => {}, onStatus = () => {}, waitMs = 30000 }) {
    Object.assign(this, { contextProvider, windowRef, coordinator, gate, onObservation, onInvalidate, onStatus, waitMs });
    this.enabled = false; this.disposers = []; this.pending = null;
  }
  capability() {
    const c = this.contextProvider(), w = this.windowRef;
    const lifecycle = ['GENERATION_STARTED', 'GENERATION_ENDED', 'MESSAGE_SENT', 'MESSAGE_RECEIVED'];
    return { enabled: this.enabled, available: !!(c?.eventSource?.on && (c.eventSource.off || c.eventSource.removeListener) && lifecycle.every(key => c.eventTypes?.[key]) && w.Mvu?.events?.VARIABLE_UPDATE_ENDED && w.Mvu?.events?.BEFORE_MESSAGE_UPDATE), liveVerified: false };
  }
  invalidate(reason) {
    const task = this.pending;
    if (task) { task.trace?.end('cancelled',{reasonCode:reason}); task.abort.abort(); clearTimeout(task.timer); this.pending = null; }
    this.onInvalidate(reason);
  }
  setEnabled(enabled) {
    this.dispose();
    if (!enabled) return this.capability();
    if (!this.capability().available) {
      const trace=operationLog.start('mvu-listener'); trace.write('capability','degraded','MVU 监听接口暂不可用',{reasonCode:'missing_mvu_events'},'WARN'); trace.end('degraded');
      this.onStatus({ status: 'battle_unavailable', reason: '状态监听不可用：缺少可清理的 MVU 事件接口；仍可手动准备战斗' });
      // Character scripts may load after the extension/welcome screen.
      const c = this.contextProvider();
      const retry = () => {
        clearInterval(this.discoveryTimer); let attempts = 0;
        this.discoveryTimer = setInterval(() => {
          if (this.capability().available) this.setEnabled(true);
          else if (++attempts >= 30) clearInterval(this.discoveryTimer);
        }, 1000);
        this.discoveryTimer.unref?.();
      };
      if (c?.eventSource?.on && c.eventTypes?.CHAT_CHANGED) {
        c.eventSource.on(c.eventTypes.CHAT_CHANGED, retry);
        this.disposers.push(() => (c.eventSource.removeListener || c.eventSource.off).call(c.eventSource, c.eventTypes.CHAT_CHANGED, retry));
      }
      retry(); return this.capability();
    }
    this.enabled = true;
    const c = this.contextProvider(), w = this.windowRef;
    const bind = (key, fn) => {
      if (!c.eventTypes[key]) return;
      const callback = (...args) => { try { fn(...args); } catch (error) { this.report(error); } };
      c.eventSource.on(c.eventTypes[key], callback);
      this.disposers.push(() => (c.eventSource.removeListener || c.eventSource.off).call(c.eventSource, c.eventTypes[key], callback));
    };
    bind('GENERATION_STARTED', (kind = 'normal', _params, dryRun) => {
      if (dryRun) return;
      this.invalidate('new_generation');
      if (!['normal', 'regenerate', 'swipe'].includes(kind)) return;
      const context = this.contextProvider();
      if (!context?.chatId || context.groupId) return;
      const chat = context.chat, input = [...chat].reverse().find(row => row.is_user === true);
      // A new swipe's parent is BEFORE its user message, never the old swipe.
      const parentRows = kind === 'normal' && !chat.at(-1)?.is_user ? chat : chat.slice(0, chat.indexOf(input));
      const parent = [...parentRows].reverse().find(row => row.is_user === false && !row.is_system);
      this.pending = { kind, chat, chatId: context.chatId, input: chat.at(-1)?.is_user || kind !== 'normal' ? input : null,
        baseline: copyEvent(selectedMvu(parent) ?? null), requestId: newEventId(), abort: new AbortController(), received: false, ended: false, signals: [] };
      const task = this.pending;
      // The P0 listener establishes its intent on the same native event.
      queueMicrotask(() => { if (this.pending === task && this.gate.intent) task.requestId = this.gate.intent.requestId; });
    });
    bind('MESSAGE_SENT', index => {
      const task = this.pending, message = this.contextProvider()?.chat?.[index];
      this.onInvalidate('new_input');
      if (task && !task.received && message?.is_user && task.chat === this.contextProvider().chat) task.input = message;
      else this.invalidate('new_input');
    });
    bind('MESSAGE_RECEIVED', index => {
      const task = this.pending;
      if (!task || task.chat !== this.contextProvider()?.chat || index !== task.chat.indexOf(task.input) + 1) return;
      const message = task.chat[index];
      if (message?.is_user !== false || message.is_system) return;
      Object.assign(task, { message, index, swipe: message.swipe_id || 0, text: message.mes, received: true });
      this.schedule(task);
    });
    bind('GENERATION_ENDED', () => { if (this.pending) { this.pending.ended = true; this.schedule(this.pending); } });
    for (const key of ['GENERATION_STOPPED', 'CHAT_CHANGED', 'MESSAGE_SWIPED', 'MESSAGE_EDITED', 'MESSAGE_DELETED']) bind(key, () => {
      // Removing the old reply is part of native regenerate, before RECEIVED.
      if (key === 'MESSAGE_DELETED' && this.pending?.kind === 'regenerate' && !this.pending.received) return;
      this.invalidate(key);
    });
    const ended = (variables, before) => {
      const task = this.pending; if (!task) return;
      task.signals.push({ ref: variables, snapshot: copyEvent(variables), before: copyEvent(before), written: false });
      if (task.signals.length > 8) task.signals.shift();
    };
    const beforeWrite = value => {
      const task = this.pending; if (!task) return;
      const signals = task.signals.filter(item => item.ref === value?.variables);
      if (signals.length !== 1) { signals.forEach(item => { item.ambiguous = true; }); this.onStatus({ status: 'battle_unavailable', reason: 'MVU 更新无法唯一关联，保留手动入口' }); return; }
      Object.assign(signals[0], { written: true, content: value.message_content, snapshot: copyEvent(value.variables) });
      this.schedule(task);
    };
    for (const [event, fn] of [[w.Mvu.events.VARIABLE_UPDATE_ENDED, ended], [w.Mvu.events.BEFORE_MESSAGE_UPDATE, beforeWrite]]) {
      const callback = (...args) => { try { fn(...args); } catch (error) { this.report(error); } };
      if (typeof w.eventOn === 'function' && typeof w.eventRemoveListener === 'function') {
        w.eventOn(event, callback); this.disposers.push(() => w.eventRemoveListener(event, callback));
      } else {
        // Verified against yiyu JS-Slash-Runner/src/function/event.ts:
        // iframe eventOn/eventEmit wrap the host's eventSource directly.
        c.eventSource.on(event, callback);
        this.disposers.push(() => (c.eventSource.removeListener || c.eventSource.off).call(c.eventSource, event, callback));
      }
    }
    // Initial pending states are deliberately not replayed.
    return this.capability();
  }
  assertFresh(task) {
    const c = this.contextProvider();
    if (!this.enabled || this.pending !== task || task.abort.signal.aborted || c?.chat !== task.chat || c.chatId !== task.chatId || task.chat.at(-1) !== task.message || comparableText(task.message.mes) !== comparableText(task.text) || (task.message.swipe_id || 0) !== task.swipe) throw new DOMException('状态观察消息已过期', 'AbortError');
  }
  schedule(task) {
    if (!task.received || !task.ended) return;
    if (!task.trace) { task.trace=operationLog.start('mvu-observation',{chatId:task.chatId,requestId:task.requestId,messageId:task.index}); bindTrace(task.abort.signal,task.trace); }
    if (task.processing) { task.reschedule = true; return; }
    clearTimeout(task.timer);
    task.until = Date.now() + this.waitMs;
    task.timer = setTimeout(() => void this.check(task), 0);
  }
  async check(task) {
    task.processing = true;
    try {
      this.assertFresh(task);
      if (this.windowRef.Mvu?.isDuringExtraAnalysis?.()) {
        if (Date.now() < task.until) this.scheduleAfter(task);
        else this.notReady(task, { status: 'battle_mvu_not_ready', reason: '额外变量分析仍在进行，等待完成信号' });
        return;
      }
      const snapshot = copyEvent(selectedMvu(task.message) ?? null);
      const signals = task.signals.filter(item => item.written && !item.ambiguous && !item.consumed && comparableText(item.content) === comparableText(task.text) && dataHash(item.snapshot) === dataHash(snapshot));
      if (!signals.length) {
        if (Date.now() < task.until) task.timer = setTimeout(() => void this.check(task), 100);
        else this.notReady(task, { status: 'battle_mvu_not_ready', reason: 'MVU 尚未完成精确消息写入；等待可靠更新或手动准备' });
        return;
      }
      const disk = await this.coordinator.store.remote(this.coordinator.store.scope());
      this.assertFresh(task);
      task.text = task.message.mes;
      const persisted = disk.messages[task.index];
      if (persisted?.mes !== task.text || (persisted?.swipe_id || 0) !== task.swipe || dataHash(selectedMvu(persisted)) !== dataHash(snapshot)) {
        if (Date.now() < task.until) this.scheduleAfter(task);
        else this.notReady(task, { status: 'battle_mvu_not_ready', reason: '目标消息变量保存尚未确认，等待后续更新' });
        return;
      }
      // A completed P1 binding (or a new independent native binding) is
      // mandatory. Queueing occurs outside the MVU writer's call stack.
      const identity = await this.coordinator.bindObservedNarrative({ input: task.input, message: task.message, requestId: task.requestId, assertFresh: () => this.assertFresh(task) });
      this.assertFresh(task);
      if (dataHash(selectedMvu(task.message)) !== dataHash(snapshot)) { this.scheduleAfter(task); return; }
      const guard = () => { this.assertFresh(task); if (dataHash(selectedMvu(task.message)) !== dataHash(snapshot)) throw new DOMException('MVU 快照已改变', 'AbortError'); };
      task.trace?.identify({branchId:identity.branchUid,eventId:identity.parentEventId});
      task.trace?.write('validation','success','精确消息与服务器 MVU 快照已核对');
      await this.onObservation({ identity, snapshot, baseline: task.baseline, message: task.message,
        messageFingerprint: activationFingerprint([task.text, task.swipe, task.requestId]), eligible: true, guard, signal: task.abort.signal });
      signals.forEach(item => { item.consumed = true; item.ref = null; });
      task.confirmedFingerprint = dataHash(snapshot); task.trace?.end('success'); task.trace=null;
    } catch (error) { task.trace?.fail('observation',error); task.trace?.end(error.name==='AbortError'?'cancelled':'failed'); task.trace=null; if (error.name !== 'AbortError') this.report(error); }
    finally {
      task.processing = false;
      if (this.pending === task && task.reschedule) { task.reschedule = false; this.schedule(task); }
    }
  }
  scheduleAfter(task) { task.timer = setTimeout(() => void this.check(task), 100); }
  notReady(task, status) { task.trace?.write('mvu-readback','degraded','MVU 精确写入等待超时',{code:'TIMEOUT'},'WARN'); task.trace?.end('degraded'); task.trace=null; this.onStatus(status); }
  report(error) { const trace=operationLog.start('mvu-listener'); trace.fail('observation',error); trace.end('failed'); this.onStatus({ status: 'battle_failed', reason: error.message }); }
  dispose() { clearInterval(this.discoveryTimer); this.enabled = false; this.invalidate('listener_disabled'); for (const dispose of this.disposers.splice(0)) dispose(); }
}
