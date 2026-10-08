import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSettings, characterApiSettings } from '../src/adapters.js';
import { BattleController } from '../src/battle-controller.js';
import { CREDENTIAL_STORAGE_KEY } from '../src/credential-store.js';

class MemoryStorage {
  items = new Map();
  getItem(key) { return this.items.get(key) ?? null; }
  setItem(key, value) { this.items.set(key, String(value)); }
  removeItem(key) { this.items.delete(key); }
}

test('character API follows judge by default and preserves a separate override when toggled', () => {
  let settings = normalizeSettings({ adjudicator: { mode: 'http', endpoint: 'https://judge.invalid/v1', model: 'judge', apiKey: 'judge-key', timeoutMs: 12000 } });
  assert.equal(characterApiSettings(settings).model, 'judge');
  settings = normalizeSettings({ ...settings, adjudicator: { ...settings.adjudicator, model: 'changed' }, characterGenerator: { inherit: false, endpoint: 'https://cast.invalid/v1', model: 'cast', apiKey: 'cast-key', timeoutMs: 34000 } });
  assert.equal(characterApiSettings(settings).model, 'cast');
  assert.equal(characterApiSettings(settings).apiKey, 'cast-key');
  assert.equal(characterApiSettings(settings).timeoutMs, 34000);
  settings.characterGenerator.inherit = true;
  assert.equal(characterApiSettings(settings).model, 'changed');
  assert.equal(settings.characterGenerator.model, 'cast');
});

test('independent character credentials survive reload and remain absent from exports and logs', () => {
  const storage = new MemoryStorage(), credentials = new MemoryStorage();
  const first = new BattleController({ storage, credentialStorage: credentials });
  first.setSettings({ characterGenerator: { inherit: false, endpoint: 'https://cast.invalid/v1', model: 'cast', apiKey: 'character-secret' } });
  const second = new BattleController({ storage, credentialStorage: credentials });
  assert.equal(characterApiSettings(second.settings).apiKey, 'character-secret');
  second.log({ kind: 'test', text: 'provider echo character-secret' });
  assert.doesNotMatch(second.exportData(), /character-secret/);
  assert.doesNotMatch(second.debugLogExport(), /character-secret/);
  assert.doesNotMatch(JSON.stringify([...storage.items]), /character-secret/);
  second.setSettings({ characterGenerator: { apiKey: '' } });
  assert.equal(credentials.getItem(CREDENTIAL_STORAGE_KEY), null);
});

test('controller sends participant extraction to character endpoint rather than judge endpoint', async () => {
  const originalFetch = globalThis.fetch, calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body), auth: options.headers.authorization });
    return new Response(JSON.stringify({ player: null, candidates: [] }));
  };
  try {
    const controller = new BattleController({ credentialStorage: null });
    controller.setSettings({ adjudicator: { mode: 'http', endpoint: 'https://judge.invalid/v1', model: 'judge', apiKey: 'judge-key' }, characterGenerator: { inherit: false, endpoint: 'https://cast.invalid/v1', model: 'cast', apiKey: 'cast-key' } });
    await controller.prepareCharacters();
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://cast.invalid/v1/chat/completions');
    assert.equal(calls[0].body.model, 'cast');
    assert.equal(calls[0].auth, 'Bearer cast-key');
    controller.setSettings({ characterGenerator: { inherit: true } });
    await controller.prepareCharacters();
    assert.equal(calls[1].url, 'https://judge.invalid/v1/chat/completions');
    assert.equal(calls[1].auth, 'Bearer judge-key');
  } finally { globalThis.fetch = originalFetch; }
});
