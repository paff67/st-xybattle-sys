import test from 'node:test';
import assert from 'node:assert/strict';
import { dynamicProfile } from './fixtures/dynamic-profile.js';
import { normalizeCombatProfile, combatProfileIssues, compileCombatProfile } from '../src/combat-profile.js';
import { createInitialState, startBattle, nextRound, judgeAndCommit, validateAdjudication, restoreBattle, buildAdjudicationRequest, getPlayerView } from '../src/battle-state.js';
import { initializeCombatObjects } from '../src/combat-ledger.js';
import { applyCombatProposal } from '../src/combat-ledger.js';
import { prepareEnemyCandidates, confirmEnemyCandidates, applyConfirmedEnemies } from '../src/character-preparation.js';
import { rollbackFromAction } from '../src/battle-rollback.js';
import { createHttpCharacterInference } from '../src/character-source-adapters.js';
import { normalizeSettings } from '../src/adapters.js';

function fixture() {
  const { actor, entry, resourceRules } = compileCombatProfile({ ...dynamicProfile().candidate, id: 'gulan' }, 'enemy');
  let state = createInitialState({ enemies: [actor], registrySnapshot: [entry], resourceRules });
  state.combatLedger = initializeCombatObjects(state);
  return startBattle(state);
}
function response(state) {
  const enemy = state.actors.enemies[0];
  return { summary: '顾澜控制负担加重', reason: '持续维持并抵抗干扰', ruleRefs: enemy.techniques[0].ruleRefs,
    actorChanges: [{ actorId: enemy.id, resources: [{ resourceId: enemy.state.resources[1].resourceId, condition: '仍能维持主要封锁', burden: '多向控制负担加重', limitations: ['难以扩大范围'], reason: '持续施术', ruleRefs: enemy.techniques[0].ruleRefs }] }],
    combatChanges: { baseRevision: state.combatLedger.revision, operations: [] },
    exchange: { playerResult: '形成干扰', techniques: [], opponents: [{ actorId: enemy.id, response: '维持封锁', techniques: [{ techniqueId: enemy.techniques[0].id, manifestation: '重水尖刺颤动', interaction: '收缩控制抵抗干扰' }], result: '仍维持封锁' }], environmentResult: '无其他变化', boundaries: ['未记录新的伤势'] }
  };
}
const commit = (state, result, actionId = 'a1') => judgeAndCommit(state, { actionId, label: '试探封锁' }, { adjudicator: { judge: async () => result }, settings: { autoNarrative: false, repairAttempts: 0 } });

test('nested enemy profile accepts qualitative rules, preserves unknown state and owns stable IDs', () => {
  const normalized = normalizeCombatProfile(dynamicProfile(), { id: 'gulan' });
  assert.deepEqual(combatProfileIssues(normalized), []);
  assert.deepEqual(normalizeCombatProfile(normalized, { id: 'gulan' }), normalized);
  const state = fixture(), enemy = state.actors.enemies[0];
  assert.equal(enemy.name, '顾澜'); assert.deepEqual(enemy.resources, {});
  assert.equal(enemy.state.resources[0].condition, '当前余裕未明确');
  assert.deepEqual(enemy.state.injuries, []);
  assert.equal(state.combatLedger.objects[0].sourceTechniqueId, enemy.techniques[0].id);
  assert.deepEqual(initializeCombatObjects(state), state.combatLedger);
});

test('continuous use, recovery and restore preserve definitions and only replace changed resource states', async () => {
  const before = fixture(), profile = structuredClone(before.actors.enemies[0].profile);
  let { state } = await commit(before, response(before));
  assert.deepEqual(state.actors.enemies[0].profile, profile);
  assert.equal(state.actors.enemies[0].state.resources[0].condition, '当前余裕未明确');
  assert.equal(state.actors.enemies[0].state.resources[1].burden, '多向控制负担加重');
  state = nextRound(restoreBattle(state));
  assert.equal(state.actors.enemies[0].state.resources[1].burden, '多向控制负担加重');
  const recovered = response(state);
  Object.assign(recovered.actorChanges[0].resources[0], { condition: '尚可施术', burden: '控制压力解除', limitations: [], reason: '停止维持并获得调息空间' });
  recovered.combatChanges.operations.push({ type: 'retire', operationId: 'stop', objectId: state.combatLedger.objects[0].id, status: 'expired', reason: '主动停止维持', ruleRefs: profile.techniques[0].ruleRefs });
  const result = await commit(state, recovered, 'a2');
  assert.equal(result.state.actors.enemies[0].state.resources[1].burden, '控制压力解除');
  assert.equal(result.state.combatLedger.objects[0].status, 'expired');
  const request = buildAdjudicationRequest(nextRound(result.state), { label: '继续观察' });
  const snapshot = JSON.parse(request.prompt);
  assert.equal(snapshot.context.actors.enemies[0].state.resources[1].burden, '控制压力解除');
  assert.equal(snapshot.context.combatLedger.objects[0].status, 'expired');
  assert.deepEqual(restoreBattle(result.state).actors, result.state.actors);
  assert.deepEqual(rollbackFromAction(result.state, 1).actors, state.actors);
  const duplicate = await commit(result.state, recovered, 'a2');
  assert.equal(duplicate.deduplicated, true);
  await assert.rejects(judgeAndCommit(result.state, { actionId: 'a2', label: '更换同一编号的行动' }), /不同内容/);
});

test('injuries and statuses add, update and remove with stable IDs; duplicate injuries rejected', async () => {
  let state = fixture(), raw = response(state);
  raw.actorChanges[0].injuries = [{ type: 'add', operationId: 'cut', label: '右臂裂伤', description: '持印受限', visibility: 'public', reason: '交锋擦伤', ruleRefs: raw.ruleRefs }];
  ({ state } = await commit(state, raw));
  const id = state.actors.enemies[0].state.injuries[0].id;
  state = nextRound(state); raw = response(state);
  raw.actorChanges[0].injuries = [{ type: 'add', operationId: 'cut', label: '右臂裂伤', description: '再度记录', visibility: 'public', reason: '同一伤口', ruleRefs: raw.ruleRefs }];
  assert.throws(() => validateAdjudication(raw, state), /不得重复新增/);
  raw.actorChanges[0].injuries = [{ type: 'update', operationId: 'worse', id, label: '右臂裂伤', description: '牵扯后加剧', visibility: 'public', reason: '强行持印', ruleRefs: raw.ruleRefs }];
  ({ state } = await commit(state, raw, 'a2'));
  assert.equal(state.actors.enemies[0].state.injuries.length, 1);
  assert.equal(state.actors.enemies[0].state.injuries[0].id, id);
  state = nextRound(state); raw = response(state);
  raw.actorChanges[0].injuries = [{ type: 'remove', operationId: 'heal', id, reason: '治疗完成', ruleRefs: raw.ruleRefs }];
  ({ state } = await commit(state, raw, 'a3'));
  assert.deepEqual(state.actors.enemies[0].state.injuries, []);
});

for (const [label, mutate, pattern] of [
  ['old version', r => { r.baseVersion = -1; }, /版本过期/],
  ['profile overwrite', r => { r.actorChanges[0].profile = {}; }, /越权/],
  ['unknown actor', r => { r.actorChanges[0].actorId = 'stranger'; }, /人物不存在/],
  ['unknown resource', r => { r.actorChanges[0].resources[0].resourceId = 'other'; }, /资源不存在/],
  ['duplicate resource', r => { r.actorChanges[0].resources.push(r.actorChanges[0].resources[0]); }, /资源不存在或重复/],
  ['missing reason', r => { r.actorChanges[0].resources[0].reason = ''; }, /原因/],
  ['unknown rule', r => { r.actorChanges[0].resources[0].ruleRefs = ['made-up']; }, /规则引用/],
  ['numeric settlement', r => { r.resourceChanges = [{ after: 5 }]; }, /数值/],
  ['old ledger revision', r => { r.combatChanges.baseRevision = -1; }, /版本过期/]
]) test(`dynamic result rejects ${label} atomically`, () => {
  const state = fixture(), copy = structuredClone(state), raw = response(state); mutate(raw);
  assert.throws(() => validateAdjudication(raw, state), pattern); assert.deepEqual(state, copy);
});

test('request has recent summaries, live state and no leak of internal actor state into public view', async () => {
  const state = fixture();
  state.history = Array.from({ length: 8 }, (_, i) => ({ status: 'committed', roundId: `r${i}`, adjudication: { summary: `summary${i}`, after: { obsolete: 'old effect' } } }));
  const context = buildAdjudicationRequest(state, { label: '观察' }).context;
  assert.equal(context.priorCommittedFacts.length, 4); assert.equal(context.priorCommittedFacts[0].summary, 'summary4');
  assert.doesNotMatch(JSON.stringify(context.priorCommittedFacts), /old effect/);
  assert.doesNotMatch(JSON.stringify(getPlayerView(state).enemies), /当前余裕|正在维持|背部旧伤/);
});

test('HTTP candidate accepts new interface and obeys message count and configured output budget', async () => {
  const calls = [];
  const ai = createHttpCharacterInference({ endpoint: 'https://example.invalid', maxOutput: 12345, messageCount: 2, fetchImpl: async (_url, options) => {
    const body = JSON.parse(options.body); calls.push(body);
    return new Response(JSON.stringify(calls.length === 1 ? { candidates: [{ name: '顾澜' }] } : dynamicProfile()));
  } });
  const context = { recentMessages: [{ text: 'old' }, { text: 'recent1' }, { text: 'recent2' }] };
  await ai.inferParticipants(context);
  const candidate = await ai.completeCandidate({ candidate: { id: 'gulan', name: '顾澜' }, context });
  assert.deepEqual(combatProfileIssues(candidate), []);
  for (const body of calls) { assert.equal(body.max_tokens, 12345); assert.doesNotMatch(body.messages[1].content, /"old"/); assert.match(body.messages[1].content, /recent1/); }
  assert.equal(normalizeSettings({ characterMessageCount: 7 }).characterMessageCount, 7);
  assert.throws(() => normalizeSettings({ characterMessageCount: 0 }), /消息条数/);
});

test('nested profiles survive preparation/confirmation and initialize scene objects once', async () => {
  const preparation = await prepareEnemyCandidates({ enemies: [{ id: 'gulan', name: '顾澜' }] }, { inference: { completeCandidate: async () => dynamicProfile() } });
  assert.deepEqual(preparation.candidates[0].validationIssues, []);
  const confirmed = confirmEnemyCandidates(preparation);
  const state = applyConfirmedEnemies(createInitialState(), confirmed);
  assert.equal(state.actors.enemies[0].state.position, '海面浪峰');
  assert.equal(state.combatLedger.objects.length, 1);
  assert.equal(applyConfirmedEnemies(state, confirmed).combatLedger.objects.length, 1);
});

test('reclaim validates ownership and releases objects without auto-restoring any actor resource', () => {
  const state = fixture(), enemy = state.actors.enemies[0], move = enemy.techniques[0];
  const before = structuredClone(enemy.state);
  state.combatLedger = applyCombatProposal(state, { baseRevision: state.combatLedger.revision, operations: [{ type: 'create', operationId: 'water', reason: '施术外放', ruleRefs: move.ruleRefs,
    object: { id: 'water', kind: 'resource', resourceKey: 'water', label: '外放水元', description: '已释放的力量', ownerId: enemy.id, sourceTechniqueId: move.id, visibility: 'internal', dependsOn: [] } }] }, 'water');
  const released = { type: 'update', operationId: 'release', objectId: 'water', patch: { status: 'dispersed' }, reason: '停止维持', ruleRefs: move.ruleRefs };
  const reclaimed = { type: 'reclaim', operationId: 'reclaim', objectId: 'water', techniqueId: move.id, reason: '按回收条件聚拢', ruleRefs: move.ruleRefs };
  state.combatLedger = applyCombatProposal(state, { baseRevision: state.combatLedger.revision, operations: [released, reclaimed] }, 'recover');
  assert.equal(state.combatLedger.objects.find(item => item.id === 'water').status, 'reclaimed');
  assert.deepEqual(state.actors.enemies[0].state, before);
  assert.throws(() => applyCombatProposal(state, { baseRevision: state.combatLedger.revision, operations: [reclaimed] }, 'again'), /终结/);
  const invalid = structuredClone(state); invalid.actors.enemies[0].state.resources[0].resourceId = 'wrong';
  assert.throws(() => restoreBattle(invalid), /存档资源状态/);
});
