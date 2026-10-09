import test from 'node:test';
import assert from 'node:assert/strict';
import { compileCombatProfile } from '../src/combat-profile.js';
import { fullCombatProfile } from './fixtures/combat-profile.js';
import { createInitialState, startBattle, judgeAndCommit, getPlayerView, rewriteNarrative, validateAdjudication } from '../src/battle-state.js';
import { projectScenePacket } from '../src/scene-packet.js';
import { serializeBattlePacket, parseBattlePackets } from '../src/host-input-bridge.js';
import { normalizeSettings } from '../src/adapters.js';
import { HEAVENLY_ADJUDICATOR_SYSTEM_PROMPT, buildAdjudicationPrompt } from '../src/battle-adjudicator-prompt.js';
import { LEGACY_ADJUDICATOR_SYSTEM_PROMPT } from '../src/legacy-adjudicator-prompt.js';
import { createBattleScenePacket, buildMainStoryRequest } from '../src/battle-scene-packet.js';

function fixture() {
  const player = compileCombatProfile({ ...fullCombatProfile('许妍'), id: 'player', currentState: '旧档案：尚未交手' }, 'player');
  const enemy = compileCombatProfile({ ...fullCombatProfile(), id: 'enemy' }, 'enemy');
  const state = startBattle(createInitialState({ player: player.actor, enemies: [enemy.actor], registrySnapshot: [player.entry, enemy.entry], scene: { location: '离线演示·临水练武台', time: '清晨', publicEvents: ['上回合过期事件'] } }));
  const action = { label: '以剑试探', techniqueId: player.entry.techniques[0].id };
  const result = {
    summary: '试探后取得先手，双方无伤', before: state.semanticState,
    actorChanges: [{ actorId: 'player', statuses: [{ type: 'add', operationId: 'stance', label: '弦势已建立', description: '取得先手', visibility: 'public', reason: '起势完成', ruleRefs: player.entry.ruleRefs }] }],
    combatChanges: { baseRevision: state.combatLedger.revision, operations: [] },
    reason: '私密因果推理', ruleRefs: enemy.entry.ruleRefs,
    publicEvents: ['弦势已建立', '厉沧海双足稳立'],
    exchange: {
      playerResult: '弦势已建立，许妍取得先手',
      opponents: [{ actorId: 'enemy', response: '剑锋引流稳守', techniques: [{ techniqueId: enemy.entry.techniques[0].id, manifestation: '剑身微震，身前气流分成两股', interaction: '仅局部偏流共振，未中断主角起势' }], result: '双足稳立、未反噬' }],
      environmentResult: '仅有局部气流偏转', boundaries: ['未造成固定伤害、强制位移或破防', '未造成台面碎裂、积雪切断或大范围灵压爆发']
    }
  };
  return { state, action, result };
}

test('committed scene packet contains a single round of grounded effects without profiles or prose directives', async () => {
  const { state, action, result } = fixture();
  const committed = await judgeAndCommit(state, action, { adjudicator: { judge: async () => result }, settings: { autoNarrative: false } });
  const packet = committed.record.narrativePacket;
  assert.equal(packet.playerAction.technique, '平川断澜');
  assert.equal(packet.playerAction.school, '断澜剑诀');
  assert.equal(packet.exchange.opponents[0].techniques[0].school, '断澜剑诀');
  assert.match(JSON.stringify(packet), /弦势已建立|未造成固定伤害/);
  assert.doesNotMatch(JSON.stringify(packet), /currentState|尚未交手|清晨|临水练武台|上回合|私密因果|reservePlan|descriptionRequirements|storyAiDirective|publicEvents|playerVisibleContext|originalDefinition/);
  assert.deepEqual(projectScenePacket(packet), packet, 'transport projection must be idempotent');
  const marker = serializeBattlePacket(packet, { version: committed.state.version });
  assert.deepEqual(parseBattlePackets(marker)[0].packet.exchange, packet.exchange);
  committed.record.narrative = { text: '<think>正文AI思考</think>正文段落' };
  assert.doesNotMatch(JSON.stringify(getPlayerView(committed.state)), /正文AI思考|正文段落|narrative/);
});

test('exchange rejects missing opponents, foreign moves and leaked hidden facts before committing', async () => {
  const { state, action, result } = fixture();
  const noExchange = structuredClone(result); delete noExchange.exchange;
  await assert.rejects(judgeAndCommit(state, action, { adjudicator: { judge: async () => noExchange }, settings: { repairAttempts: 0 } }), /exchange/);
  const missingEnemy = structuredClone(result); missingEnemy.exchange.opponents = [];
  assert.throws(() => validateAdjudication(missingEnemy, state), /缺少对手/);
  const foreignMove = structuredClone(result); foreignMove.exchange.opponents[0].techniques[0].techniqueId = action.techniqueId;
  assert.throws(() => validateAdjudication(foreignMove, state), /已确认招式/);
  const leaked = structuredClone(result); leaked.exchange.opponents[0].result = state.actors.enemies[0].hidden.reservePlan;
  assert.throws(() => validateAdjudication(leaked, state), /隐藏信息/);
});

test('using a hidden move sends observable effects but never its secret name or full definition', async () => {
  const { state, action, result } = fixture();
  const move = state.registrySnapshot[1].techniques[0];
  move.visibility = 'internal'; move.name = '未暴露的秘密剑招';
  const { record } = await judgeAndCommit(state, action, { adjudicator: { judge: async () => result }, settings: { autoNarrative: false } });
  const publicMove = record.narrativePacket.exchange.opponents[0].techniques[0];
  assert.equal(publicMove.name, undefined);
  assert.equal(publicMove.school, undefined);
  assert.match(publicMove.manifestation, /剑身微震/);
  assert.doesNotMatch(JSON.stringify(record.narrativePacket), /秘密剑招|techniqueId|originalDefinition/);
});

test('legacy rewrite and input transport remove nested packets, duplicate facts and stale scene state', async () => {
  const { state } = fixture();
  const packet = { type: 'BATTLE_SCENE_PACKET', actionId: 'old', scope: state.scope, originalAction: { label: '试探' }, committedFacts: ['未受伤', '未受伤', '先手已转移'], publicEvents: ['旧事件'], location: '晨间演示台', time: '清晨', playerVisibleContext: { player: { currentState: '尚未交手' } }, descriptionRequirements: ['剧烈冲击'], prohibitions: ['写作禁令'], storyAiDirective: 'BATTLE_SCENE_PACKET_JSON: 全量重复' };
  state.phase = 'awaiting_next';
  state.history = [{ actionId: 'old', status: 'complete', narrativePacket: packet }];
  let received;
  await rewriteNarrative(state, 'old', { rewrite: async (safe) => { received = safe; return { text: '重写正文' }; } });
  const parsed = parseBattlePackets(serializeBattlePacket(packet, { version: 2 }))[0].packet;
  assert.deepEqual(createBattleScenePacket(state, state.history[0]), received);
  assert.deepEqual(buildMainStoryRequest(packet, '用户文字'), { preserveUserPrompt: '用户文字', injection: received });
  assert.deepEqual(parsed.committedFacts, ['未受伤', '先手已转移']);
  for (const safe of [received, parsed]) assert.doesNotMatch(JSON.stringify(safe), /旧事件|清晨|演示台|尚未交手|剧烈冲击|写作禁令|重复|BATTLE_SCENE_PACKET_JSON/);
});

test('saved prompts remain verbatim and request always includes the exchange contract', () => {
  assert.equal(normalizeSettings({ adjudicationPrompt: LEGACY_ADJUDICATOR_SYSTEM_PROMPT }).adjudicationPrompt, LEGACY_ADJUDICATOR_SYSTEM_PROMPT);
  assert.equal(normalizeSettings({ adjudicationPrompt: '自定义裁定规则' }).adjudicationPrompt, '自定义裁定规则');
  const prompt = buildAdjudicationPrompt({}, { label: '试探' });
  assert.match(prompt, /exchange.*playerResult/s);
  assert.match(prompt, /允许无伤试探与轻微扰动/);
  assert.doesNotMatch(prompt, /时辰天色：破晓|天地气象：长风激荡/);
});
