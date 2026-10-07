import test from 'node:test';
import assert from 'node:assert/strict';
import { authoritativeEntries, createRuleMemory, selectNegativeCases, assertBindings, projectRuleContext } from '../src/authoritative-rules.js';
import { normalizeCombatProfile, compileCombatProfile, combatProfileIssues } from '../src/combat-profile.js';
import { prepareEnemyCandidates, confirmEnemyCandidates, applyConfirmedEnemies } from '../src/character-preparation.js';
import { applyCombatProposal } from '../src/combat-ledger.js';
import { createInitialState, startBattle, buildAdjudicationRequest, restoreBattle, judgeAndCommit, getPlayerView, nextRound } from '../src/battle-state.js';
import { rollbackFromAction } from '../src/battle-rollback.js';
import { fullCombatProfile } from './fixtures/combat-profile.js';
import { characterTree } from '../src/character-presentation.js';

const entries = authoritativeEntries();
const dielang = entries.find((entry) => entry.name === '叠浪玄潮诀');
const jump = dielang.techniques.find((move) => move.name === '跳弓·碎潮');
const mirror = entries.find((entry) => entry.name === '无相水镜法');
const node = mirror.techniques[0];
function sourceProfile() {
  return { ...fullCombatProfile('许妍'), id: 'player', hidden: {}, techniques: [], martialArts: [], resourceDefinitions: [],
    learnedTechniqueRefs: entries.map((entry) => ({ registryId: entry.id, techniqueIds: entry.techniques.map((move) => move.id), proficiency: '依据本场确认境界', evidence: '测试明确选择' })) };
}
function fixture() {
  const { actor, entry } = compileCombatProfile(sourceProfile(), 'player', entries);
  return startBattle(createInitialState({ player: actor, registrySnapshot: [...entries, entry] }));
}
function create(id, kind = 'effect', dependsOn = [], overrides = {}) {
  return { operationId: `create-${id}`, type: 'create', reason: '按已掌握节点规则生成持续结构', ruleRefs: node.ruleRefs,
    object: { id, kind, ownerId: 'player', sourceTechniqueId: node.id, label: id, description: '本轮确认存在的持续结构', visibility: 'player', dependsOn, ...overrides } };
}
function proposal(state, operations) { return { baseRevision: state.combatLedger.revision, operations }; }
function outcome(request, operations = []) {
  return { summary: '按规则建立结构', before: request.context.semanticState, after: structuredClone(request.context.semanticState), reason: '依据节点规则', ruleRefs: node.ruleRefs, publicEvents: ['结构已建立'],
    exchange: { playerResult: '主角保持站位', opponents: [], environmentResult: '未破坏地形', boundaries: ['未造成伤害'] },
    combatChanges: { baseRevision: request.context.combatLedger.revision, operations } };
}

test('authoritative binding replaces invented player definitions without granting unlisted moves', async () => {
  const wrong = { ...sourceProfile(), learnedTechniqueRefs: [], martialArts: [], techniques: [{ school: dielang.name, name: jump.name, originalDefinition: '跳跃步法' }] };
  const profile = normalizeCombatProfile(wrong, { side: 'player', registry: entries });
  assert.deepEqual(profile.learnedTechniqueRefs[0].techniqueIds, [jump.id]);
  assert.equal(profile.techniques[0].originalDefinition, jump.originalDefinition);
  assert.deepEqual(combatProfileIssues(profile), []);
  const compiled = compileCombatProfile(profile, 'player', entries);
  assert.deepEqual(compiled.actor.techniques, [{ registryId: dielang.id, techniqueIds: [jump.id] }]);
  assert.equal(compiled.entry.techniques.length, 0, 'no competing generated definition');
  const draft = await prepareEnemyCandidates({ registry: entries, scope: { chatId: 'c', branchId: 'b' }, playerCandidate: wrong, enemies: [{ id: 'e', name: '敌人' }] }, {
    includePlayer: true, requireProfiles: true, inference: { completeCandidate: async ({ side }) => side === 'player' ? wrong : fullCombatProfile() }
  });
  const state = applyConfirmedEnemies(createInitialState({ chatId: 'c', branchId: 'b' }), confirmEnemyCandidates(draft));
  assertBindings(state);
  assert.equal(state.registrySnapshot.find((entry) => entry.id === dielang.id).techniques.find((move) => move.id === jump.id).originalDefinition, jump.originalDefinition);
  assert.ok(buildAdjudicationRequest(startBattle(state), { label: '跳弓', techniqueId: jump.id }).prompt.includes(JSON.stringify(jump.originalDefinition).slice(1, -1)));
  const paths = (nodes) => nodes.flatMap((item) => [item, ...paths(item.children || [])]);
  assert.equal(paths(characterTree(profile)).find((item) => item.path === 'techniques.0.originalDefinition').editable, false);
});

test('binding rejects forged versions, unknown moves and source definitions modified under the same hash', () => {
  const state = fixture();
  state.registrySnapshot[0].techniques[0].originalDefinition = '免费必杀';
  assert.throws(() => buildAdjudicationRequest(state, { label: '攻击' }), /权威定义/);
  const profile = sourceProfile(); profile.learnedTechniqueRefs[0].version = 'forged';
  assert.throws(() => compileCombatProfile(profile, 'player', entries), /版本/);
  profile.learnedTechniqueRefs[0].version = ''; profile.learnedTechniqueRefs[0].techniqueIds = ['unknown'];
  assert.throws(() => compileCombatProfile(profile, 'player', entries), /不属于/);
});

test('ledger transactions reject occupied recovery, missing dependencies, duplicate batches and resurrection atomically', () => {
  let state = fixture();
  const initial = structuredClone(state);
  state.combatLedger = applyCombatProposal(state, proposal(state, [create('water', 'resource', [], { resourceKey: 'water-batch-1' }), create('node', 'anchor', ['water']), create('independent')]), 'a1');
  assert.deepEqual(initial.combatLedger.objects, [], 'input was not mutated');
  const before = structuredClone(state.combatLedger);
  for (const operations of [
    [create('early'), { operationId: 'bad', type: 'reclaim', objectId: 'water', reason: '回收', ruleRefs: node.ruleRefs }],
    [create('bad', 'effect', ['missing'])],
    [create('copy', 'resource', [], { resourceKey: 'water-batch-1' })],
    [{ operationId: 'release', type: 'update', objectId: 'water', patch: { status: 'dispersed' }, reason: '散逸', ruleRefs: node.ruleRefs }]
  ]) {
    assert.throws(() => applyCombatProposal(state, proposal(state, operations), 'bad'));
    assert.deepEqual(state.combatLedger, before);
  }
  state.combatLedger = applyCombatProposal(state, proposal(state, [{ operationId: 'destroy', type: 'retire', objectId: 'water', status: 'destroyed', reason: '外力摧毁', ruleRefs: node.ruleRefs }]), 'a2');
  assert.equal(state.combatLedger.objects.find((item) => item.id === 'node').status, 'interrupted');
  assert.equal(state.combatLedger.objects.find((item) => item.id === 'independent').status, 'active');
  assert.throws(() => applyCombatProposal(state, proposal(state, [create('later', 'effect', ['node'])]), 'a3'), /有效/);
  assert.throws(() => applyCombatProposal(state, proposal(state, [{ operationId: 'revive', type: 'update', objectId: 'water', patch: { status: 'active' }, reason: '恢复', ruleRefs: node.ruleRefs }]), 'a3'), /终结/);
});

test('ledger checks ownership, cycles, revision, knowledge and exact idempotence', () => {
  const state = fixture();
  assert.throws(() => applyCombatProposal(state, proposal(state, [create('foreign', 'effect', [], { ownerId: 'unknown' })]), 'a'), /未掌握/);
  assert.throws(() => applyCombatProposal(state, proposal(state, [create('secret', 'intel', [], { knownTo: [] })]), 'a'), /知情/);
  const changes = proposal(state, [create('first'), create('second', 'effect', ['first'])]);
  state.combatLedger = applyCombatProposal(state, changes, 'a');
  assert.deepEqual(applyCombatProposal(state, changes, 'a'), state.combatLedger);
  assert.throws(() => applyCombatProposal(state, { ...changes, operations: [] }, 'a'), /不同变更/);
  assert.throws(() => applyCombatProposal(state, changes, 'b'), /版本过期/);
  assert.throws(() => applyCombatProposal(state, proposal(state, [{ operationId: 'cycle', type: 'update', objectId: 'first', patch: { dependsOn: ['second'] }, reason: '形成循环', ruleRefs: node.ruleRefs }]), 'b'), /成环/);
});

test('release and reclaim succeed once after dependent effects terminate', () => {
  const state = fixture();
  state.combatLedger = applyCombatProposal(state, proposal(state, [create('water', 'resource', [], { resourceKey: 'batch' }), create('node', 'anchor', ['water'])]), 'a');
  const recovery = entries.find((entry) => entry.name === '太一沧澜经').techniques[0];
  const ops = [
    { operationId: 'end', type: 'retire', objectId: 'node', status: 'expired', reason: '解除维持', ruleRefs: node.ruleRefs },
    { operationId: 'release', type: 'update', objectId: 'water', patch: { status: 'dispersed' }, reason: '不再占用', ruleRefs: node.ruleRefs },
    { operationId: 'recover', type: 'reclaim', objectId: 'water', techniqueId: recovery.id, reason: '已散逸回收', ruleRefs: [...node.ruleRefs, ...recovery.ruleRefs] }
  ];
  state.combatLedger = applyCombatProposal(state, proposal(state, ops), 'b');
  assert.equal(state.combatLedger.objects[0].status, 'reclaimed');
  assert.throws(() => applyCombatProposal(state, proposal(state, [ops[2]]), 'c'), /终结/);
});

test('full rule memory and bounded counterexamples reconstruct independently of conversation history', () => {
  const state = fixture();
  assert.equal(state.ruleMemory.interactions.length, 16);
  assert.equal(state.ruleMemory.negativeCases.length, 55);
  const input = { label: '跳弓·碎潮', techniqueId: jump.id };
  const selected = selectNegativeCases(state, input);
  assert.equal(selected[0].techniqueIds[0], jump.id);
  assert.match(selected[0].wrongVerdict, /步法/);
  assert.ok(selected.length <= 4 && selected.reduce((n, item) => n + JSON.stringify(item).length, 0) <= 2600);
  assert.deepEqual(selectNegativeCases(state, { label: '保持沉默' }), []);
  assert.ok(selectNegativeCases(state, { label: '听隙配合跳弓' }).some((item) => item.interactionId === 'six-arts.interaction-08'));
  assert.ok(selectNegativeCases(state, { label: '跳弓' }).some((item) => item.techniqueIds.includes(jump.id)));
  assert.equal(buildAdjudicationRequest(restoreBattle(JSON.parse(JSON.stringify(state))), input).prompt, buildAdjudicationRequest(state, input).prompt);
  const prompt = buildAdjudicationRequest(state, input).prompt;
  assert.match(prompt, /不是本场事实/);
  assert.ok(JSON.stringify(projectRuleContext(entries)).length < JSON.stringify(entries).length / 2);
  const nextCatalog = createRuleMemory(entries);
  nextCatalog.interactions[0].boundary = '被修改的全局库';
  assert.doesNotMatch(prompt, /被修改的全局库/);
});

test('commit, restore, next round and message rollback preserve the object ledger and rule snapshot', async () => {
  const initial = fixture();
  const committed = await judgeAndCommit(initial, { label: '建节点', actionId: 'commit-a' }, {
    adjudicator: { judge: async (request) => outcome(request, [create('node', 'anchor'), create('secret', 'intel', [], { visibility: 'internal', knownTo: ['player'], description: '私密联系细节' })]) }, settings: { autoNarrative: false }
  });
  assert.equal(committed.state.combatLedger.revision, 1);
  assert.equal(getPlayerView(committed.state).combatObjects.length, 1);
  assert.doesNotMatch(JSON.stringify(getPlayerView(committed.state)), /私密联系细节/);
  const restored = nextRound(restoreBattle(JSON.parse(JSON.stringify(committed.state))));
  assert.deepEqual(restored.combatLedger, committed.state.combatLedger);
  const request = buildAdjudicationRequest(restored, { label: '维持节点' });
  assert.match(request.prompt, /私密联系细节/);
  const rolledBack = rollbackFromAction(restored, 0);
  assert.deepEqual(rolledBack.combatLedger, initial.combatLedger);
  assert.deepEqual(rolledBack.ruleMemory, initial.ruleMemory);
});

test('invalid object proposal enters repair loop; failed repair never partly commits', async () => {
  const initial = fixture(); let repaired = 0, saved;
  const result = await judgeAndCommit(initial, { label: '试探', actionId: 'repair-a' }, {
    adjudicator: { judge: async (request) => outcome(request, [create('invalid', 'effect', ['missing'])]), repair: async (request) => { repaired++; return outcome(request); } },
    settings: { autoNarrative: false }, save: (state) => { saved = state; }
  });
  assert.equal(repaired, 1); assert.equal(result.state.combatLedger.objects.length, 0);
  await assert.rejects(judgeAndCommit(initial, { label: '试探', actionId: 'reject-a' }, {
    adjudicator: { judge: async (request) => outcome(request, [create('valid'), create('invalid', 'effect', ['missing'])]) },
    settings: { autoNarrative: false }, save: (state) => { saved = state; }
  }), /有效/);
  assert.deepEqual(saved.combatLedger, initial.combatLedger);
  assert.equal(saved.phase, 'awaiting_player');
});
