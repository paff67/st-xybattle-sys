import test from 'node:test';
import assert from 'node:assert/strict';

import { BattleStorage } from '../src/battle-storage.js';
import { TechniqueRegistry, assertRegistryEntry } from '../src/battle-registry.js';
import { MockAdjudicator, MockNarrator } from '../src/adapters.js';
import { adaptersFromSettings } from '../src/battle-controller.js';
import {
  createInitialState,
  startBattle,
  getPlayerView,
  getAiReadContext,
  judgeAndCommit
} from '../src/battle-state.js';

class MemoryStorage {
  #items = new Map();
  getItem(key) { return this.#items.has(key) ? this.#items.get(key) : null; }
  setItem(key, value) { this.#items.set(key, String(value)); }
  removeItem(key) { this.#items.delete(key); }
}

test('branch-scoped storage isolates sessions and does not persist api keys', () => {
  const raw = new MemoryStorage();
  const branchA = new BattleStorage(raw, { chatId: 'chat-1', branchId: 'a' });
  const branchB = new BattleStorage(raw, { chatId: 'chat-1', branchId: 'b' });

  branchA.writeSettings({ mode: 'http', endpoint: 'https://example.invalid', apiKey: 'secret-a' });
  branchA.writeSession({ schema: 'battle_v2', scope: { chatId: 'chat-1', branchId: 'a' }, phase: 'idle' });
  branchB.writeSession({ schema: 'battle_v2', scope: { chatId: 'chat-1', branchId: 'b' }, phase: 'ended' });

  assert.equal(branchA.readSettings().apiKey, undefined);
  assert.equal(branchA.readSession().scope.branchId, 'a');
  assert.equal(branchB.readSession().scope.branchId, 'b');
  assert.throws(() => branchA.writeSession({ scope: { chatId: 'chat-1', branchId: 'b' } }), /作用域不匹配/);
});

test('player projection strips hidden enemy fields while AI context retains them', () => {
  const state = createInitialState({
    enemies: [{ id: 'enemy-1', name: '敌手', visibleInfo: { stance: 'guard' }, hidden: { secret: 'do-not-publish' }, resources: { qi: 99 }, techniques: [{ id: 'secret-technique' }] }]
  });
  const player = getPlayerView(state);
  const ai = getAiReadContext(state);

  assert.deepEqual(player.enemies, [{ id: 'enemy-1', name: '敌手', visibleInfo: { stance: 'guard' } }]);
  assert.equal(ai.actors.enemies[0].hidden.secret, 'do-not-publish');
});

test('mock is explicit and the implicit path never silently falls back to mock', () => {
  const mock = adaptersFromSettings({ mode: 'mock' });
  const production = adaptersFromSettings({ mode: 'http', endpoint: 'https://example.invalid', model: 'test-model' });
  const unconfigured = adaptersFromSettings({});
  assert.ok(mock.adjudicator instanceof MockAdjudicator);
  assert.ok(mock.narrator instanceof MockNarrator);
  assert.equal(production.adjudicator.constructor.name, 'HttpJsonAdjudicator');
  assert.equal(production.narrator.constructor.name, 'HttpJsonNarrator');
  assert.notEqual(unconfigured.adjudicator.constructor.name, 'MockAdjudicator');
  assert.notEqual(unconfigured.narrator.constructor.name, 'MockNarrator');
});

test('registry entries are validated and snapshots are isolated', () => {
  const registry = new TechniqueRegistry();
  const snapshot = registry.snapshot();
  snapshot[0].techniques[0].name = 'mutated outside registry';
  assert.notEqual(registry.list()[0].techniques[0].name, 'mutated outside registry');
  assert.throws(() => assertRegistryEntry({ id: 'incomplete' }), /功法字段缺失/);
  assert.throws(() => registry.register(registry.get(registry.list()[0].id)), /功法已存在/);
});

test('same actionId is idempotent and narrative receives a committed scene packet', async () => {
  let state = startBattle(createInitialState({ sessionId: 'test-session' }));
  const adjudicator = new MockAdjudicator();
  const narrator = new MockNarrator();
  const first = await judgeAndCommit(state, { actionId: 'test-action', label: '观察并试探' }, {
    adjudicator,
    narrator,
    settings: { autoNarrative: true },
    save: async (next) => { state = next; }
  });

  assert.equal(first.deduplicated, false);
  assert.equal(first.state.phase, 'awaiting_next');
  assert.equal(first.record.status, 'complete');
  assert.equal(first.record.narrativePacket.type, 'BATTLE_SCENE_PACKET');
  assert.equal(first.record.narrativePacket.schema, 'battle_scene_v3');
  assert.equal(adjudicator.calls.length, 1);
  assert.equal(narrator.calls.length, 1);

  const retry = await judgeAndCommit(state, { actionId: 'test-action', label: '观察并试探' }, { adjudicator, narrator });
  assert.equal(retry.deduplicated, true);
  assert.equal(adjudicator.calls.length, 1);
  assert.equal(narrator.calls.length, 1);
});
