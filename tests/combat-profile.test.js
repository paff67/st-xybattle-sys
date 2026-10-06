import test from 'node:test';
import assert from 'node:assert/strict';
import { fullCombatProfile } from './fixtures/combat-profile.js';
import { normalizeCombatProfile, combatProfileIssues, publicEnemyProfile } from '../src/combat-profile.js';
import { prepareEnemyCandidates, confirmEnemyCandidates, applyConfirmedEnemies } from '../src/character-preparation.js';
import { BattleController } from '../src/battle-controller.js';
import { buildAdjudicationRequest, createInitialState, startBattle, judgeAndCommit, getPlayerView, restoreBattle } from '../src/battle-state.js';
import { createHttpCharacterInference } from '../src/character-source-adapters.js';
import { normalizeSettings } from '../src/adapters.js';
import { DEFAULT_CHARACTER_COMPLETION_PROMPT, LEGACY_CHARACTER_COMPLETION_PROMPT } from '../src/character-prompts.js';
import { actorTraitLabels, actorResourceLabels, characterTree } from '../src/character-presentation.js';

const scope = { chatId: 'profile-chat', branchId: 'profile-branch', messageId: 1 };
const inference = {
  inferParticipants: async () => ({ player: { name: '许新毅', explicitFacts: { cultivationRealm: '假丹境' } }, candidates: [{ id: 'enemy-1', name: '厉沧海' }] }),
  completeCandidate: async ({ side }) => ({ ...fullCombatProfile(side === 'player' ? '许新毅' : '厉沧海'), ...(side === 'player' ? { hidden: {}, visibleInfo: { position: '河畔', stance: '攻势' } } : {}) })
};
async function preparation() {
  return prepareEnemyCandidates({ scope, playerId: 'player' }, { inference, requireProfiles: true, includePlayer: true });
}

test('complete profiles atomically replace demo actors and register actual moves and resource rules', async (t) => {
  const hostAdapter = { scope: () => scope, context: () => ({ name1: '许新毅', chat: [{ mes: '许新毅与厉沧海交手', is_user: false }] }) };
  const controller = new BattleController({ ...scope, hostAdapter, initialPlayer: { id: 'player', name: '演示主角', techniques: [] }, initialEnemies: [{ id: 'demo', name: '演示敌人' }] });
  t.after(() => controller.dispose());
  const panel = await controller.prepareCharacters({ inference });
  assert.deepEqual(panel.candidates.map((item) => item.role), ['player', 'enemy']);
  assert.equal(controller.state.actors.player.name, '演示主角');
  assert.throws(() => controller.confirmCharacters({}, { removeIds: ['player'] }), /不能移除主角/);
  controller.confirmCharacters();
  assert.equal(controller.state.actors.player.name, '许新毅');
  assert.deepEqual(controller.state.actors.enemies.map((item) => item.name), ['厉沧海']);
  const moveId = controller.state.actors.player.techniques[0].techniqueIds[0];
  assert.equal(controller.registry.findTechnique(moveId).technique.name, '平川断澜');
  assert.equal(controller.state.resourceRules.find((rule) => rule.actorId === 'enemy-1').max, 100);
  assert.equal(controller.state.semanticState.positions.player, '河畔');
  controller.start();
  const request = buildAdjudicationRequest(controller.state, { label: '横斩', techniqueId: moveId });
  assert.match(request.prompt, /保持中近距/);
  assert.match(request.prompt, /施展剑招消耗/);
  assert.match(request.prompt, /一回合内收剑硬直/);
  assert.equal(request.context.actors.enemies[0].techniques[0].originalDefinition, fullCombatProfile().techniques[0].originalDefinition);
  assert.equal(getPlayerView(controller.state).player.name, '许新毅');
  assert.deepEqual(restoreBattle(controller.state).resourceRules, controller.state.resourceRules);
});

test('profile resource settlement uses registered references and persists current resources without redefining moves', async () => {
  let state = startBattle(applyConfirmedEnemies(createInitialState(scope), confirmEnemyCandidates(await preparation())));
  const initialMoves = structuredClone(state.actors.enemies[0].techniques);
  const enemyRule = state.resourceRules.find((rule) => rule.actorId === 'enemy-1');
  const result = await judgeAndCommit(state, { label: '试探', actionId: 'profile-action' }, {
    adjudicator: { judge: async (request) => ({ summary: '双方交锋', before: request.context.semanticState, after: { ...request.context.semanticState, positions: { player: '台边', 'enemy-1': '后撤两步' } }, reason: '依据固定剑招消耗', ruleRefs: enemyRule.ruleRefs, publicEvents: ['敌手退后'], resourceChanges: [{ actorId: 'enemy-1', resource: 'qi', before: 80, after: 70, reason: '施展平川断澜', ruleRefs: enemyRule.ruleRefs }] }) },
    settings: { autoNarrative: false }, save: async (next) => { state = next; }
  });
  assert.equal(result.state.actors.enemies[0].resources.qi, 70);
  assert.equal(result.state.actors.enemies[0].resourceDefinitions[0].current, 70);
  assert.deepEqual(result.state.actors.enemies[0].techniques, initialMoves);
  assert.equal(getPlayerView(result.state).enemies[0].visibleInfo.position, '后撤两步');
});

test('incomplete or unbounded AI profiles cannot be confirmed and leave battle state untouched', async () => {
  const draft = await prepareEnemyCandidates({ scope, enemies: [{ id: 'e', name: '敌手' }] }, {
    inference: { completeCandidate: async () => ({ name: '敌手', realm: '未知', generated: { guess: '可能会剑法' } }) }
  });
  assert.ok(draft.candidates[0].validationIssues.length > 5);
  assert.throws(() => confirmEnemyCandidates(draft), /资料不完整/);
  const profile = normalizeCombatProfile(fullCombatProfile(), { id: 'e' });
  profile.resourceDefinitions[0].current = 101;
  assert.ok(combatProfileIssues(profile).some((issue) => issue.includes('边界无效')));
  profile.resourceDefinitions[0].current = 80;
  profile.techniques[0].school = '未定义功法';
  assert.ok(combatProfileIssues(profile).some((issue) => issue.includes('所属功法未定义')));
});

test('public cards deduplicate aliases, omit raw structures and never expose internal resources or moves', async () => {
  const enemy = { ...fullCombatProfile(), id: 'e', visibleInfo: { stance: '守势', 姿态: '重复守势', weapon: { id: 'sword', name: '铁灰长剑', drawn: false }, generated: { battleResourceModel: { qi: 100 } } }, resources: { qi: 80, observed: { mystery: '不该展示' } } };
  enemy.techniques.push({ ...enemy.techniques[0], name: '秘密断魂', visibility: 'internal' });
  const view = publicEnemyProfile(enemy);
  assert.doesNotMatch(JSON.stringify(view), /秘密断魂|battleResourceModel|重复守势|resources/);
  assert.deepEqual(actorTraitLabels(view), { 姿态: '守势', 武器: '铁灰长剑；未出鞘' });
  assert.deepEqual(actorResourceLabels(enemy), { 真气: 80 });
  const tree = characterTree(normalizeCombatProfile(enemy, { id: 'e' }));
  const paths = (nodes) => nodes.flatMap((node) => [node.path || '', ...paths(node.children || [])]);
  assert.ok(!paths(tree).some((path) => path === 'id' || path.endsWith('.key')));
  assert.ok(paths(tree).includes('techniques.0.mechanics'));
});

test('HTTP completion repairs partial profiles and uses fixed battle profile instructions despite custom prompt', async () => {
  const calls = [];
  const ai = createHttpCharacterInference({ endpoint: 'https://example.invalid/v1', model: 'test', characterCompletionPrompt: '自定义文风', fetchImpl: async (_url, options) => {
    calls.push(JSON.parse(options.body));
    return new Response(JSON.stringify({ candidate: calls.length === 1 ? { name: '厉沧海' } : fullCombatProfile() }), { status: 200 });
  } });
  const profile = await ai.completeCandidate({ candidate: { id: 'e' }, side: 'enemy' });
  assert.equal(calls.length, 2);
  assert.match(calls[0].messages[0].content, /自定义文风/);
  assert.match(calls[0].messages[0].content, /固定招式/);
  assert.match(calls[1].messages[1].content, /repair/);
  assert.deepEqual(combatProfileIssues(profile), []);
  const alwaysPartial = createHttpCharacterInference({ endpoint: 'https://example.invalid/v1', fetchImpl: async () => new Response(JSON.stringify({ candidate: { name: '许新毅', identity: '琴修' } }), { status: 200 }) });
  await assert.rejects(alwaysPartial.completeCandidate({ candidate: { id: 'player' }, side: 'player' }), (error) => error.partialProfile?.identity === '琴修' && /不完整/.test(error.message));
});

test('old default completion prompt migrates; custom prompt persists; generation budget is separate', () => {
  assert.equal(normalizeSettings({ characterCompletionPrompt: LEGACY_CHARACTER_COMPLETION_PROMPT }).characterCompletionPrompt, DEFAULT_CHARACTER_COMPLETION_PROMPT);
  const settings = normalizeSettings({ characterCompletionPrompt: '我的自定义补全约束', adjudicator: { maxOutput: 1600 } });
  assert.equal(settings.characterCompletionPrompt, '我的自定义补全约束');
  assert.equal(settings.characterMaxOutput, 8000);
  assert.match(DEFAULT_CHARACTER_COMPLETION_PROMPT, /martialArts/);
  assert.match(DEFAULT_CHARACTER_COMPLETION_PROMPT, /主角/);
  assert.throws(() => normalizeSettings({ characterMaxOutput: Infinity }), /输出上限/);
});

test('malformed nested entries report missing definitions instead of bypassing completeness validation', () => {
  const profile = normalizeCombatProfile({ techniques: [null], martialArts: [null], resourceDefinitions: [null] });
  assert.ok(combatProfileIssues(profile).length > 5);
});
