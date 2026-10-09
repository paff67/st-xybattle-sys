import test from 'node:test';
import assert from 'node:assert/strict';

import { BattleController } from '../src/battle-controller.js';
import { BattleStorage } from '../src/battle-storage.js';
import { CREDENTIAL_STORAGE_KEY, clearCredentialSettings, readCredentialSettings, writeCredentialSettings } from '../src/credential-store.js';

class MemoryStorage {
  constructor() { this.items = new Map(); }
  getItem(key) { return this.items.get(key) ?? null; }
  setItem(key, value) { this.items.set(key, String(value)); }
  removeItem(key) { this.items.delete(key); }
  values() { return [...this.items.values()]; }
}

test('browser credential storage keeps model keys separate from battle storage', () => {
  const credentials = new MemoryStorage();
  const battle = new MemoryStorage();

  writeCredentialSettings({ adjudicator: { apiKey: 'judge-secret' }, narrator: { apiKey: 'narrator-secret' } }, credentials);
  assert.deepEqual(readCredentialSettings(credentials), {
    adjudicator: { apiKey: 'judge-secret' },
    narrator: { apiKey: 'narrator-secret' }, characterGenerator: { apiKey: '' }, dailyAdjudicator: { apiKey: '' }
  });
  assert.deepEqual(credentials.values().length, 1);
  assert.equal(credentials.items.has(CREDENTIAL_STORAGE_KEY), true);

  const storage = new BattleStorage(battle, { chatId: 'chat', branchId: 'main' });
  storage.writeSettings({ mode: 'http', apiKey: 'judge-secret' });
  assert.equal(battle.values().some((value) => value.includes('judge-secret')), false);
});

test('controller restores browser credentials and clearing settings removes them', () => {
  const credentials = new MemoryStorage();
  const battle = new MemoryStorage();
  const first = new BattleController({ storage: battle, credentialStorage: credentials, chatId: 'chat', branchId: 'main' });

  first.setSettings({
    adjudicator: { mode: 'http', endpoint: 'https://example.invalid/v1', model: 'test-model', apiKey: 'persisted-secret' },
    narrator: { mode: 'mock', apiKey: '' }
  });
  assert.equal(first.settings.adjudicator.apiKey, 'persisted-secret');
  assert.equal(battle.values().some((value) => value.includes('persisted-secret')), false);

  const second = new BattleController({ storage: battle, credentialStorage: credentials, chatId: 'chat', branchId: 'main' });
  assert.equal(second.settings.adjudicator.apiKey, 'persisted-secret');
  assert.equal(second.exportData().includes('persisted-secret'), false);

  second.setSettings({ adjudicator: { apiKey: '' } });
  assert.deepEqual(readCredentialSettings(credentials), { adjudicator: { apiKey: '' }, narrator: { apiKey: '' }, characterGenerator: { apiKey: '' }, dailyAdjudicator: { apiKey: '' } });
  assert.equal(credentials.items.has(CREDENTIAL_STORAGE_KEY), false);
  clearCredentialSettings(credentials);
});
