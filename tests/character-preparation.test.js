import test from 'node:test';
import assert from 'node:assert/strict';
import { BattleController } from '../src/battle-controller.js';
import { applyConfirmedEnemies, confirmEnemyCandidates, prepareEnemyCandidates } from '../src/character-preparation.js';
import { createInitialState, getAiReadContext } from '../src/battle-state.js';

const scope = { chatId: 'character-chat', branchId: 'swipe-a', messageId: 12 };

test('character sources merge by field and remain outside battle state until confirmation', async () => {
  const context = { scope, enemies: [{ id: 'enemy', name: '旧称', realm: '上下文' }] };
  const preparation = await prepareEnemyCandidates(context, {
    mvu: async () => ({ id: 'enemy', name: '现名', realm: '动态境界' }),
    database: async () => ({ id: 'enemy', name: '档案名', resources: { qi: 10 } }),
    inference: { inferCandidates: async () => [{ id: 'enemy', name: '旧称', inferred: { realm: '猜测境界' } }] }
  });
  const candidate = preparation.candidates[0];
  assert.equal(candidate.fields.realm, '动态境界');
  assert.equal(candidate.fields.name, '现名');
  assert.equal(candidate.fields.resources.qi, 10);
  assert.equal(candidate.provenance.realm.source, 'mvu_dynamic');
  assert.ok(candidate.conflicts.some((conflict) => conflict.path === 'realm' && conflict.keptValue === '动态境界'));
  assert.equal(candidate.sourceStatus.mvu_dynamic.status, 'matched');
  const state = createInitialState({ chatId: scope.chatId, branchId: scope.branchId, enemies: [] });
  assert.deepEqual(state.actors.enemies, []);
  assert.deepEqual(getAiReadContext(state).actors.enemies, []);
  const confirmed = confirmEnemyCandidates(preparation, { enemy: { name: '用户定名' } });
  const applied = applyConfirmedEnemies(state, confirmed);
  assert.equal(applied.actors.enemies[0].name, '用户定名');
  assert.equal(applied.characterPreparation.status, 'confirmed');
  assert.deepEqual(state.actors.enemies, []);
});

test('unmatched source profiles and malformed AI candidates are not assigned to an enemy', async () => {
  const preparation = await prepareEnemyCandidates({ scope, enemies: [{ id: 'enemy', name: '敌人' }] }, {
    database: { getCharacter: async () => [{ id: 'other', name: '旁人', realm: '不可串用' }] },
    inference: { inferCandidates: async () => [{}, { id: 'ai-enemy', name: '新敌', fields: { realm: '推断' }, inferred: true }] }
  });
  assert.equal(preparation.candidates.length, 2);
  assert.equal(preparation.candidates[0].sourceStatus.database.status, 'missing');
  assert.equal(preparation.candidates[0].fields.realm, undefined);
  assert.equal(preparation.candidates[1].fields.realm, '推断');
  assert.equal(preparation.candidates[1].provenance.realm.source, 'ai_inferred');
  assert.equal(preparation.candidates[1].fields.fields, undefined);
});

test('controller cancels stale character reads and rejects duplicate confirmed identities', async () => {
  const controller = new BattleController({ chatId: scope.chatId, branchId: scope.branchId, initialEnemies: [{ id: 'enemy', name: '敌人' }] });
  let release;
  const pending = controller.prepareCharacters({ inference: { inferCandidates: () => new Promise((resolve) => { release = resolve; }) } });
  await new Promise((resolve) => setImmediate(resolve));
  controller.cancelCharacterPreparation();
  release([]);
  await assert.rejects(pending, /取消/);
  assert.equal(controller.characterConfirmationPanel(), null);
  await controller.prepareCharacters();
  assert.equal(controller.state.characterPreparation, undefined);
  assert.throws(() => controller.confirmCharacters({ enemy: { id: 'player' } }), /主角重复/);
  assert.equal(controller.state.characterPreparation, undefined);
  controller.confirmCharacters({ enemy: { name: '已确认' } });
  assert.equal(controller.state.actors.enemies[0].name, '已确认');
});

test('failed optional field fill keeps the extracted candidate reviewable', async () => {
  const preparation = await prepareEnemyCandidates({ scope, enemies: [{ id: 'enemy', name: '敌人' }] }, {
    inference: {
      inferCandidates: async () => [{ id: 'enemy', name: '敌人', explicitFacts: { cultivation: '假丹境' } }],
      fillMissingFields: async () => { throw new Error('补全服务超时'); }
    }
  });
  assert.equal(preparation.candidates.length, 1);
  assert.equal(preparation.candidates[0].fields.cultivation, '假丹境');
  assert.equal(preparation.candidates[0].sourceStatus.ai_fill.status, 'read_failed');
  assert.match(preparation.candidates[0].sourceStatus.ai_fill.error, /补全服务超时/);
});
