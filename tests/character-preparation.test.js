import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareEnemyCandidates, confirmEnemyCandidates, applyConfirmedEnemies } from '../src/character-preparation.js';
import { BattleController } from '../src/battle-controller.js';

class MemoryStorage {
  items = new Map();
  getItem(key) { return this.items.get(key) ?? null; }
  setItem(key, value) { this.items.set(key, String(value)); }
  removeItem(key) { this.items.delete(key); }
}

function inferenceFixture() {
  return {
    async inferCandidates() {
      return [{ id: 'enemy-1', name: '厉沧海', explicitFacts: { cultivationRealm: '假丹境', observed: { technique: '平川断澜' } } }];
    },
    async completeCandidate({ candidate }) {
      return {
        id: candidate.id,
        name: '厉沧海',
        cultivationRealm: '假丹境',
        combatStyle: '潮汐剑修',
        visibleInfo: { stance: '按剑', position: '中距' },
        techniques: [{ id: 'li-pingchuan', name: '平川断澜', category: '剑招', originalDefinition: '以潮线压缩退路', mechanics: ['改变站位'], availability: { default: 'available', conditions: [] }, visibility: 'public', ruleRefs: ['fixture.technique'] }],
        hidden: { reservePlan: '诱导对手先手' }
      };
    }
  };
}

test('AI completion creates a full candidate draft and no source wins automatically', async () => {
  const preparation = await prepareEnemyCandidates({ enemies: [{ id: 'enemy-1', name: '演示对手', visibleInfo: { stance: '守势' } }] }, { inference: inferenceFixture() });
  const candidate = preparation.candidates[0];
  assert.equal(candidate.name, '厉沧海');
  assert.equal(candidate.fields.cultivationRealm, '假丹境');
  assert.equal(candidate.fields.techniques[0].name, '平川断澜');
  assert.equal(candidate.confirmation.status, 'pending');
  assert.equal(candidate.provenance.name.priority, 0);
  assert.ok(candidate.conflicts.length >= 1);

  const confirmed = confirmEnemyCandidates(preparation, { [candidate.id]: { ...candidate.fields, name: '用户确认的厉沧海' } });
  const state = applyConfirmedEnemies({ phase: 'idle', version: 1, actors: { player: { id: 'player' }, enemies: [] } }, confirmed);
  assert.equal(state.actors.enemies[0].name, '用户确认的厉沧海');
  assert.equal(state.characterPreparation.status, 'confirmed');
  assert.equal(state.characterPreparation.candidates[0].confirmation.status, 'confirmed');
});

test('controller refuses to start an unconfirmed candidate and starts after user confirmation', async () => {
  const controller = new BattleController({ storage: new MemoryStorage(), chatId: 'character-test', characterInference: inferenceFixture(), initialEnemies: [{ id: 'enemy-1', name: '演示对手' }] });
  await controller.prepareCharacters();
  assert.throws(() => controller.start(), /确认/);
  const candidate = controller.state.characterPreparation.candidates[0];
  controller.confirmCharacters({ [candidate.id]: { ...candidate.fields, name: '厉沧海' } });
  controller.start();
  assert.equal(controller.state.phase, 'awaiting_player');
  assert.equal(controller.state.actors.enemies[0].name, '厉沧海');
});
