import test from 'node:test';
import assert from 'node:assert/strict';
import { applyCausalChanges, advanceCausalState, createCausalState, publicCausalState, restoreCausalState } from '../src/causal-state.js';
import { createInitialState, judgeAndCommit, startBattle } from '../src/battle-state.js';
import { BattleController } from '../src/battle-controller.js';

test('causal lifecycle stores anchors, relations, debts and cooldowns in one branch-scoped ledger', () => {
  const scope = { chatId: 'chat-causal', branchId: 'swipe-a' };
  const initial = createCausalState({ scope });
  const result = applyCausalChanges(initial, [
    { operation: 'anchor.upsert', operationId: 'anchor', value: { id: 'oath-1', label: '潮痕誓约', ownerId: 'player' } },
    { operation: 'relation.upsert', operationId: 'relation', value: { id: 'r-1', from: 'player', to: 'enemy', type: 'debt-bound', value: 1 } },
    { operation: 'debt.open', operationId: 'debt', value: { id: 'debt-1', debtor: 'enemy', creditor: 'player', amount: 1 } },
    { operation: 'cooldown.set', operationId: 'cooldown', value: { key: 'technique.causal', remainingRounds: 2 } },
  ], { actionId: 'turn-1', roundId: 'r1', scope });
  assert.equal(result.state.anchors[0].id, 'oath-1');
  assert.equal(result.state.relations[0].type, 'debt-bound');
  assert.equal(result.state.debts[0].status, 'open');
  assert.equal(result.state.cooldowns['technique.causal'].remainingRounds, 2);
  assert.equal(result.state.ledger.length, 4);
  assert.ok(result.state.appliedActions['turn-1']);
  assert.equal(advanceCausalState(result.state, { roundId: 'r2', scope }).cooldowns['technique.causal'].remainingRounds, 1);
});

test('causal action retries are idempotent and conflicting rewrites cannot settle twice', () => {
  const scope = { chatId: 'chat-causal', branchId: 'main' };
  const initial = createCausalState({ scope });
  const changes = [{ operation: 'debt.open', operationId: 'debt', value: { id: 'debt-1', debtor: 'enemy', creditor: 'player', amount: 1 } }];
  const committed = applyCausalChanges(initial, changes, { actionId: 'same-action', scope });
  const retry = applyCausalChanges(committed.state, changes, { actionId: 'same-action', scope });
  assert.equal(retry.deduplicated, true);
  assert.equal(retry.state.ledger.length, 1);
  assert.throws(() => applyCausalChanges(committed.state, [{ ...changes[0], value: { ...changes[0].value, amount: 2 } }], { actionId: 'same-action', scope }), /内容不一致/);
});

test('causal changes are rejected across branches and battle commit persists causalState', async () => {
  const a = createCausalState({ chatId: 'chat-causal', branchId: 'a' });
  assert.throws(() => applyCausalChanges(a, [{ operation: 'anchor.upsert', value: { id: 'x' } }], { actionId: 'cross-branch', scope: { chatId: 'chat-causal', branchId: 'b' } }), /作用域/);
  const state = startBattle(createInitialState({ chatId: 'chat-causal', branchId: 'a', semanticState: {}, player: { id: 'player', name: '主角', resources: {}, techniques: [] }, enemies: [] }));
  const adjudicator = { isMock: true, async judge(request) { const before = request.context.semanticState; return { summary: '建立因果锚点', before, after: { ...before }, reason: '测试', ruleRefs: ['mock.causal'], publicEvents: [], causalChanges: [{ operation: 'anchor.upsert', operationId: 'oath', value: { id: 'oath-1', label: '锚点' } }] }; } };
  const result = await judgeAndCommit(state, { actionId: 'causal-action', label: '立誓' }, { adjudicator, settings: { mode: 'mock', autoNarrative: false }, save: async () => {} });
  assert.equal(result.state.causalState.anchors[0].id, 'oath-1');
  assert.equal(result.state.history[0].causalAfter.anchors[0].id, 'oath-1');
  assert.deepEqual(restoreCausalState(result.state.causalState, { scope: state.scope }).scope.branchId, 'a');
});

test('story clock expiry settles once and private causal records stay out of public projection', () => {
  const scope = { chatId: 'chat-causal', branchId: 'private' };
  const initial = createCausalState({ scope, anchors: [
    { id: 'visible', label: '可见锚点', duration: 'death22h', onExpire: 'death' },
    { id: 'hidden', label: '秘密锚点', visibility: 'hidden', duration: 'death22h' }
  ], cooldowns: { secret: { visibility: 'private', duration: 'cooldown15d' } } });
  const expired = advanceCausalState(initial, { roundId: 'r2', storyTime: { day: 1, hour: 0 }, scope });
  assert.equal(expired.anchors[0].status, 'dead');
  assert.equal(expired.ledger.length, 2);
  const later = advanceCausalState(expired, { roundId: 'r3', storyTime: { day: 2, hour: 0 }, scope });
  assert.equal(later.ledger.length, 2);
  assert.equal(later.cooldowns.secret.remainingStoryHours, 15 * 24 - 48);
  assert.deepEqual(publicCausalState(later).anchors.map((item) => item.id), ['visible']);
  assert.deepEqual(Object.keys(publicCausalState(later).cooldowns), []);
  assert.throws(() => advanceCausalState(later, { roundId: 'r4', storyTime: { day: 1 }, scope }), /倒退/);
});

test('importing a new scene does not inherit the previous battle causal ledger', () => {
  const controller = new BattleController({ chatId: 'scene-chat', branchId: 'main' });
  controller.state.causalState = applyCausalChanges(controller.state.causalState, [
    { operation: 'anchor.upsert', value: { id: 'old-anchor' } }
  ], { actionId: 'old-action', scope: controller.state.scope }).state;
  controller.importScene({ scene: { location: '新战场' }, actors: { player: { id: 'player', name: '主角' }, enemies: [] } });
  assert.deepEqual(controller.state.causalState.anchors, []);
  assert.deepEqual(controller.state.causalState.ledger, []);
});

