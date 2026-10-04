const test = require('node:test');
const assert = require('node:assert/strict');

const storageModule = import('../src/battle-storage.js');

class MemoryStorage {
  #items = new Map();
  getItem(key) { return this.#items.has(key) ? this.#items.get(key) : null; }
  setItem(key, value) { this.#items.set(key, String(value)); }
  removeItem(key) { this.#items.delete(key); }
  keys() { return [...this.#items.keys()]; }
}

test('settings remove credentials and branch keys do not collide', async () => {
  const { BattleStorage } = await storageModule;
  const raw = new MemoryStorage();
  const a = new BattleStorage(raw, { chatId: 'same-chat', branchId: 'left' });
  const b = new BattleStorage(raw, { chatId: 'same-chat', branchId: 'right' });

  a.writeSettings({ mode: 'http', endpoint: 'https://example.invalid', apiKey: 'never-persist' });
  a.writeSession({ schema: 'battle_v2', scope: { chatId: 'same-chat', branchId: 'left' }, phase: 'idle' });
  b.writeSession({ schema: 'battle_v2', scope: { chatId: 'same-chat', branchId: 'right' }, phase: 'ended' });

  assert.equal(a.readSettings().apiKey, undefined);
  assert.equal(a.readSession().scope.branchId, 'left');
  assert.equal(b.readSession().scope.branchId, 'right');
  assert.equal(raw.keys().length, 3);
});

test('session writes reject a mismatched scope before touching storage', async () => {
  const { BattleStorage } = await storageModule;
  const raw = new MemoryStorage();
  const storage = new BattleStorage(raw, { chatId: 'chat', branchId: 'main' });
  assert.throws(() => storage.writeSession({ schema: 'battle_v2', scope: { chatId: 'chat', branchId: 'other' }, phase: 'idle' }), /作用域不匹配/);
  assert.equal(storage.readSession(), null);
});
