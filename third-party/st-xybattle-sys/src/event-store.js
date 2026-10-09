import { EVENT_NAMESPACE as NS, copyEvent as copy, canonicalEvent, inputSnapshot, emptyEventStore, validateEventStore, newEventId } from './event-state.js';

export class EventPersistenceError extends Error {
  constructor(message) { super(message); this.name = 'EventPersistenceError'; }
}

// The read endpoint is the actual ST 1.17 contract verified on yiyu. A fulfilled
// saveChat() alone is NOT confirmation: that function can swallow save errors.
export class HostEventStore {
  constructor({ contextProvider = () => globalThis.SillyTavern?.getContext(), fetchRef = globalThis.fetch?.bind(globalThis), readRemote, id = newEventId,
    confirmationAttempts = 5, confirmationDelayMs = 100 } = {}) {
    Object.assign(this, { contextProvider, fetchRef, readRemote, id, confirmationAttempts, confirmationDelayMs });
    this.pending = null;
    this.queue = Promise.resolve();
  }
  scope() {
    const context = this.contextProvider();
    const character = context?.characters?.[context.characterId];
    if (!context?.chatId || context.groupId || !character?.avatar || !Array.isArray(context.chat) || !context.chatMetadata) throw new Error('事件入口仅支持已打开的单角色聊天');
    return { chatId: String(context.chatId), avatar: character.avatar, name: character.name, chat: context.chat, metadata: context.chatMetadata };
  }
  assertScope(scope) {
    const current = this.scope();
    if (current.chatId !== scope.chatId || current.avatar !== scope.avatar || current.chat !== scope.chat || current.metadata !== scope.metadata) throw new Error('聊天作用域已变化，拒绝迟到写入');
    return current;
  }
  async remote(scope) {
    this.assertScope(scope);
    let rows;
    if (this.readRemote) rows = await this.readRemote(scope);
    else {
      const response = await this.fetchRef('/api/chats/get', { method: 'POST', cache: 'no-store',
        headers: this.contextProvider().getRequestHeaders(),
        body: JSON.stringify({ ch_name: scope.name, file_name: scope.chatId, avatar_url: scope.avatar }) });
      if (!response.ok) throw new EventPersistenceError(`服务器事件回读失败 (${response.status})`);
      rows = await response.json();
    }
    this.assertScope(scope);
    if (!Array.isArray(rows) || (rows.length && !rows[0]?.chat_metadata)) throw new EventPersistenceError('服务器聊天格式无效');
    return { root: rows[0]?.chat_metadata?.[NS] || null, messages: rows.slice(1) };
  }
  local(scope) {
    this.assertScope(scope);
    const root = scope.metadata[NS];
    return root ? copy(validateEventStore(root, scope.chatId)) : null;
  }
  serialize(operation) {
    const result = this.queue.catch(() => {}).then(operation);
    this.queue = result;
    return result;
  }
  async load(scope = this.scope()) {
    if (this.pending) throw new EventPersistenceError('有未确认的事件写入，请先重试保存');
    const disk = await this.remote(scope), local = this.local(scope);
    if (disk.root) validateEventStore(disk.root, scope.chatId);
    if (canonicalEvent(disk.root) !== canonicalEvent(local)) throw new EventPersistenceError('本地与服务器事件版本不同，请重新加载聊天');
    return copy(disk.root || emptyEventStore(scope.chatId, this.id));
  }
  write(scope, root, patches = [], assertCurrent) {
    return this.serialize(async () => {
      if (this.pending) throw new EventPersistenceError('有未确认的事件写入，请先重试保存');
      this.assertScope(scope);
      assertCurrent?.();
      const disk = await this.remote(scope), local = this.local(scope);
      const baseline = disk.root;
      if (canonicalEvent(baseline) !== canonicalEvent(local) || (baseline?.revision || 0) !== root.revision) throw new EventPersistenceError('事件版本冲突，拒绝覆盖');
      const candidate = { ...copy(root), revision: root.revision + 1, writeId: this.id() };
      validateEventStore(candidate, scope.chatId);
      assertCurrent?.();
      this.pending = { scope, assertCurrent, baseline: copy(baseline), candidate, patches: patches.map(p => ({ ...p, value: copy(p.value), fingerprint: canonicalEvent(inputSnapshot(p.message)) })) };
      return this.persistPending();
    });
  }
  applyPatches({ scope, candidate, patches }) {
    this.assertScope(scope);
    this.validatePatches({ scope, patches });
    scope.metadata[NS] = copy(candidate);
    for (const { message, value, swipeId } of patches) {
      message.extra ??= {};
      message.extra[NS] = copy(value);
      if (message.swipe_info?.[swipeId]) {
        message.swipe_info[swipeId][NS] = copy(value);
        message.swipe_info[swipeId].extra ??= {};
        message.swipe_info[swipeId].extra[NS] = copy(value);
      }
    }
  }
  validatePatches({ scope, patches }) {
    for (const patch of patches) {
      if (!scope.chat.includes(patch.message)) throw new EventPersistenceError('待保存的消息已被删除');
      if ((patch.message.swipe_id || 0) !== patch.swipeId) throw new EventPersistenceError('待保存的消息页已切换');
      if (canonicalEvent(inputSnapshot(patch.message)) !== patch.fingerprint) throw new EventPersistenceError('待保存的消息内容已改变，请重新加载聊天');
    }
  }
  confirmed(disk, pending) {
    if (canonicalEvent(disk.root) !== canonicalEvent(pending.candidate)) return false;
    return pending.patches.every(({ value, swipeId }) => {
      const message = disk.messages.find(m => m.extra?.[NS]?.messageUid === value.messageUid);
      return message && (message.swipe_id || 0) === swipeId && canonicalEvent(message.extra[NS]) === canonicalEvent(value)
        && (!message.swipe_info?.[swipeId] || canonicalEvent(message.swipe_info[swipeId][NS]) === canonicalEvent(value));
    });
  }
  async persistPending() {
    const pending = this.pending;
    if (!pending) return null;
    const { scope } = pending;
    try {
      this.validatePatches(pending);
      const before = await this.remote(scope);
      if (this.confirmed(before, pending)) { this.pending = null; return copy(pending.candidate); }
      if (canonicalEvent(before.root) !== canonicalEvent(pending.baseline) && canonicalEvent(before.root) !== canonicalEvent(pending.candidate)) throw new EventPersistenceError('另一写入者已修改事件存档，请重新加载聊天');
      try { pending.assertCurrent?.(); }
      catch (error) { this.pending = null; throw error; }
      this.applyPatches(pending);
      if (typeof this.contextProvider().saveChat !== 'function') throw new EventPersistenceError('宿主缺少保存接口');
      await this.contextProvider().saveChat();
      this.assertScope(scope);
      let confirmed = false;
      for (let attempt = 0; attempt < this.confirmationAttempts; attempt++) {
        if (attempt) await new Promise(resolve => setTimeout(resolve, this.confirmationDelayMs));
        const after = await this.remote(scope);
        if (this.confirmed(after, pending)) { confirmed = true; break; }
        if (canonicalEvent(after.root) !== canonicalEvent(pending.baseline)
          && canonicalEvent(after.root) !== canonicalEvent(pending.candidate)) throw new EventPersistenceError('另一写入者已修改事件存档，请重新加载聊天');
      }
      if (!confirmed) throw new EventPersistenceError('服务器尚未确认事件及消息身份落盘');
      this.pending = null;
      return copy(pending.candidate);
    } catch (error) {
      if (error instanceof EventPersistenceError) throw error;
      throw new EventPersistenceError(error.message);
    }
  }
  retry() { return this.serialize(() => this.persistPending()); }
  // Never silently discard a pending write while the same chat is active.
  abandonChangedScope() {
    if (!this.pending) return;
    try { this.assertScope(this.pending.scope); } catch { this.pending = null; }
  }
}
