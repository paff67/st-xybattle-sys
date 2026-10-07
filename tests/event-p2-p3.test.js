import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeNarrativeProfile, narrativeActors } from '../src/narrative-profile.js';
import { actor, scenarioRoot } from './fixtures/event-model-scenarios.js';
import { createInitialState, startBattle } from '../src/battle-state.js';
import { proposeBattleAction, commitBattleProposal } from '../src/battle-proposal.js';
import { createEventCombatPipeline } from '../src/event-combat.js';
import { createEventContextReader } from '../src/event-context.js';
import { inputDigest } from '../src/event-state.js';
import { eventBattleState } from '../src/event-coordinator.js';

import { responseFor, preparationRequest } from './fixtures/event-execution-fixture.js';
function battle() {
  const player = normalizeNarrativeProfile(actor('林澜'), { id: 'p' });
  const enemy = normalizeNarrativeProfile(actor('石衡', true), { id: 'e', side: 'enemy' });
  return startBattle(createInitialState({ sessionId: 'fixed', player: player.actor, enemies: [enemy.actor], registrySnapshot: [...player.registry, ...enemy.registry], resourceRules: [...player.resourceRules, ...enemy.resourceRules] }));
}
async function host() {
  const root = scenarioRoot(), message = { is_user: true, mes: '我用水击攻击石衡' };
  const context = { chatId: 'c', characterId: 0, characters: [{ avatar: 'c.png' }], chat: [{ is_user: false, mes: '林澜与石衡交战，相距五米。', variables: [{ stat_data: root }] }, message] };
  const args = { message, event: { chatId: 'c', eventId: 'event-a', branchUid: 'b', inputMessageUid: 'u', originalInputHash: await inputDigest(message) } };
  return { context, args, root };
}

test('P2 whole learned method expands moves while preserving full mechanics, conditions and custom terms', () => {
  const raw = actor('林澜'); raw.功法.水击诀.招式.回澜 = { 定义: '以水息恢复既有联系', 机制: ['联系保留'], 条件: ['已有水息'], 限制与代价: ['不可复活'], 应对与打断: ['断开水息'], 联动引用: ['其他自定义功法'] };
  const result = normalizeNarrativeProfile(raw, { id: 'p' });
  assert.equal(result.status, 'ready'); assert.equal(result.registry[0].techniques.length, 2);
  const move = result.registry[0].techniques[1]; assert.deepEqual(move.mechanics, ['联系保留']); assert.match(move.cost, /不可复活/);
  assert.deepEqual(move.narrativeDefinition.联动引用, ['其他自定义功法']); assert.equal(raw.registryId, undefined);
});

test('P2 known, forbidden, forgotten, absent mastery do not grant moves; legacy labels cannot invent definitions', () => {
  for (const mastery of ['已知晓', '暂时封禁', '遗忘', undefined]) {
    const raw = actor('林澜'); raw.功法.水击诀.掌握状态 = mastery;
    assert.equal(normalizeNarrativeProfile(raw, { id: 'p' }).registry.length, 0);
  }
  const old = { 姓名: '林澜', 境界: '筑基', 功法: { 水击诀: { 类型: '攻伐', 境界: '圆满', 描述: '旧简表' } } };
  assert.equal(normalizeNarrativeProfile(old, { id: 'p' }).status, 'needs_context');
});

test('P2 edits override same-named installed definitions; invalid numeric resources block rather than gain defaults', () => {
  const raw = actor('林澜'); raw.功法.水击诀.定义 = '用户修订，不能穿墙';
  const a = normalizeNarrativeProfile(raw, { id: 'p', builtinRegistry: [{ name: '水击诀', corePrinciple: '可以穿墙' }] });
  assert.equal(a.registry[0].corePrinciple, '用户修订，不能穿墙');
  raw.资源.灵力 = 10; assert.equal(normalizeNarrativeProfile(raw, { id: 'p' }).status, 'needs_context');
});

test('P3 narrative compiler excludes legacy DC scores and dice from execution profiles', () => {
  const raw = actor('林澜'); raw.DC = 999999; raw.骰点 = 100; raw.功法.水击诀.DC加值 = 99;
  const result = normalizeNarrativeProfile(raw, { id: 'p' });
  assert.equal(result.actor.narrativeProfile.DC, undefined); assert.equal(result.actor.narrativeProfile.骰点, undefined);
  assert.equal(result.registry[0].narrativeDefinition.DC加值, undefined);
});

test('P2 Chinese gender buckets include named candidates with precise pointers', () => {
  const result = narrativeActors({ 主角: actor('林澜'), 女性角色档案: { '甲/乙': { 境界: '金丹' } } });
  assert.equal(result[1].data.姓名, '甲/乙'); assert.equal(result[1].path, '/女性角色档案/甲~1乙');
});

test('P3 detached proposal does not mutate base, only validated current baseline can commit', async () => {
  const base = battle(), before = structuredClone(base);
  const proposal = await proposeBattleAction(base, { actionId: 'action', label: '水击' }, { adjudicator: { judge: async request => responseFor(request) } });
  assert.deepEqual(base, before); assert.equal(proposal.after.actors.player.resources.灵力, 8);
  assert.equal(commitBattleProposal(base, proposal).actors.player.resources.灵力, 8);
  assert.throws(() => commitBattleProposal({ ...base, version: base.version + 1 }, proposal), /基线/);
  assert.throws(() => commitBattleProposal(proposal.after, proposal), /基线/);
});

test('P3 invalid resource proposal and cancellation leave the original state untouched', async () => {
  const base = battle(), before = structuredClone(base);
  await assert.rejects(proposeBattleAction(base, { label: '水击' }, { adjudicator: { judge: async request => {
    const raw = responseFor(request); raw.resourceChanges[0].before = 99; return raw;
  } } }), /before/);
  const controller = new AbortController();
  await assert.rejects(proposeBattleAction(base, { label: '水击' }, { signal: controller.signal, adjudicator: { judge: async request => { controller.abort(); return responseFor(request); } } }), { name: 'AbortError' });
  assert.deepEqual(base, before);
});

test('P3 full automatic pipeline prepares new cast then resumes committed resources without extracting again', async () => {
  const f = await host(); let extractions = 0;
  const ask = preparationRequest();
  const pipeline = createEventCombatPipeline({ contextProvider: () => f.context, database: null, request: async (...args) => { if (args[1].action) extractions++; return ask(...args); }, adjudicator: { judge: async request => responseFor(request) } });
  const first = await pipeline(f.args); assert.equal(first.execution.afterState.actors.player.resources.灵力, 8);
  const second = await pipeline({ ...f.args, event: { ...f.args.event, eventId: 'event-b' }, battleState: first.execution.afterState });
  assert.equal(second.execution.afterState.actors.player.resources.灵力, 6); assert.equal(extractions, 1);
  assert.equal(f.root.主角.资源.灵力.当前, 10); assert.equal(second.execution.afterState.history.length, 0);
});

test('P3 mixed unsupported event never partially judges or commits combat', async () => {
  const f = await host(); let calls = 0;
  const result = await createEventCombatPipeline({ contextProvider: () => f.context, database: null, request: preparationRequest({ mixed: true }), adjudicator: { judge: async () => { calls++; } } })(f.args);
  assert.equal(result.decision, 'unsupported'); assert.equal(calls, 0); assert.equal(result.execution, undefined);
});

test('P3 ended battles keep resources and effects, with no exit-based healing', async () => {
  const base = battle(); base.semanticState.statuses.push('旧伤');
  const proposal = await proposeBattleAction(base, { actionId: 'end', label: '最后一次交锋后脱战' }, { adjudicator: { judge: async request => responseFor(request, { end: true }) } });
  const result = commitBattleProposal(base, proposal);
  assert.equal(result.phase, 'ended'); assert.equal(result.actors.player.resources.灵力, 8); assert.deepEqual(result.semanticState.statuses, ['旧伤']);
});

test('P3 state lookup follows parent lineage and ignores other branches and invalidated ancestors', () => {
  const root = { events: { a: { status: 'committed', execution: { status: 'committed', afterState: { value: 'A' } } }, b: { status: 'passed', parentEventId: 'a' }, other: { status: 'committed', execution: { status: 'committed', afterState: { value: 'OTHER' } } } } };
  assert.deepEqual(eventBattleState(root, { parentEventId: 'b' }), { value: 'A' });
  root.events.a.status = 'rolled_back'; assert.equal(eventBattleState(root, { parentEventId: 'b' }), null);
});

test('P3 switched snapshot during adjudication cannot yield a commit', async () => {
  const f = await host();
  const capture = createEventContextReader({ contextProvider: () => f.context, database: null });
  const pipeline = createEventCombatPipeline({ captureContext: capture, request: preparationRequest(), adjudicator: { judge: async request => { f.context.chatId = 'changed'; return responseFor(request); } } });
  await assert.rejects(pipeline(f.args), /作用域/);
});
