const prefix = 'battle_v2';
function safeStorage(storage) { return storage && typeof storage.getItem === 'function' ? storage : null; }
function scopeToken(scope) { return encodeURIComponent(`${scope.chatId || 'default-chat'}::${scope.branchId || 'main'}`); }
export class BattleStorage {
  constructor(storage = globalThis.localStorage, scope = { chatId: 'default-chat', branchId: 'main' }) { this.storage = safeStorage(storage); this.scope = { chatId: String(scope.chatId || 'default-chat'), branchId: String(scope.branchId || 'main') }; this.token = scopeToken(this.scope); }
  key(kind) { return `${prefix}.${kind}.${this.token}`; }
  readSettings() { return this.#read(this.key('settings'), {}); }
  writeSettings(settings) { const safe = { ...settings }; delete safe.apiKey; this.#write(this.key('settings'), safe); return safe; }
  readSession() { return this.#read(this.key('session'), null); }
  writeSession(state) { if (state?.scope && (state.scope.chatId !== this.scope.chatId || state.scope.branchId !== this.scope.branchId)) throw new Error('存储作用域不匹配，拒绝串写'); this.#write(this.key('session'), state); return state; }
  readLogs() { return this.#read(this.key('logs'), []); }
  appendLog(entry) { const logs = [...this.readLogs(), { ...entry, at: new Date().toISOString() }].slice(-300); this.#write(this.key('logs'), logs); return logs; }
  clear() { ['settings','session','logs'].forEach((kind) => this.storage?.removeItem(this.key(kind))); }
  #read(key, fallback) { if (!this.storage) return fallback; try { const raw = this.storage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }
  #write(key, value) { if (this.storage) this.storage.setItem(key, JSON.stringify(value)); }
}
export const STORAGE_PREFIX = prefix;
