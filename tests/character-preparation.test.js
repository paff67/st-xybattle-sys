import test from 'node:test';
import { fullCombatProfile } from './fixtures/combat-profile.js';
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
  assert.deepEqual(candidate.conflicts.find((conflict) => conflict.path === 'realm').values.map((item) => item.source), ['ai_inferred', 'context_explicit', 'mvu_dynamic']);
  assert.equal(new Set(Object.values(candidate.provenance).map((item) => item.priority)).size, 1);
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

test('AI completion builds a full opponent draft and requires explicit user confirmation', async () => {
  const preparation = await prepareEnemyCandidates({ scope, enemies: [{ id: 'enemy', name: '演示对手', visibleInfo: { stance: '守势' } }] }, {
    inference: {
      inferCandidates: async () => [{ id: 'enemy', name: '厉沧海', explicitFacts: { cultivationRealm: '假丹境' } }],
      completeCandidate: async ({ candidate }) => ({ ...fullCombatProfile(), id: candidate.id })
    }
  });
  const candidate = preparation.candidates[0];
  assert.equal(candidate.fields.name, '厉沧海');
  assert.equal(candidate.fields.techniques[0].name, '平川断澜');
  assert.equal(candidate.confirmation.status, 'pending');
  assert.equal(candidate.provenance.name.priority, 0);
  const confirmed = confirmEnemyCandidates(preparation, { enemy: { ...candidate.fields, name: '用户确认的厉沧海' } });
  const applied = applyConfirmedEnemies(createInitialState({ chatId: scope.chatId, branchId: scope.branchId, enemies: [] }), confirmed);
  assert.equal(applied.actors.enemies[0].name, '用户确认的厉沧海');
  assert.equal(applied.actors.enemies[0].techniques[0].name, '平川断澜');
});


test('MVU role container binds only the protagonist; named gender archives supply enemies', async () => {
  const { readMvuCharacter } = await import('../src/character-source-adapters.js');
  const mvu = { getMvuData: async () => ({ stat_data: { 主角: { 境界: '金丹初期', 功法: { 水法: { 定义: '主角自己的功法' } } }, 男性角色档案: { 顾澜: { 境界: '金丹初期', 身份: '散修' } } } }) };
  const player = await readMvuCharacter({ candidate: { id: 'player', name: '许妍', role: 'player' }, context: { scope } }, { mvu });
  assert.equal(player.name, '许妍'); assert.equal(player.境界, '金丹初期');
  const enemy = await readMvuCharacter({ candidate: { id: 'gulan', name: '顾澜' }, context: { scope } }, { mvu });
  assert.equal(enemy.身份, '散修'); assert.equal(enemy.功法, undefined);
  assert.equal(await readMvuCharacter({ candidate: { id: 'x', name: '无记录敌人' }, context: { scope } }, { mvu }), null);
});
