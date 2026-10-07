import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HEAVENLY_ADJUDICATOR_SYSTEM_PROMPT,
  buildAdjudicationPrompt,
  formatScenePacketForStoryAI
} from '../src/battle-adjudicator-prompt.js';
import {
  createInitialState,
  startBattle,
  buildAdjudicationRequest,
  judgeAndCommit
} from '../src/battle-state.js';
import { MockAdjudicator, MockNarrator } from '../src/adapters.js';
import { ALL_CANONICAL_REGISTRIES } from '../src/canonical-techniques.js';

test('HEAVENLY_ADJUDICATOR_SYSTEM_PROMPT contains essential combat adjudication boundaries', () => {
  assert.ok(HEAVENLY_ADJUDICATOR_SYSTEM_PROMPT.includes('天道推演玄枢 · 独立功法战斗裁定核心'));
  assert.ok(HEAVENLY_ADJUDICATOR_SYSTEM_PROMPT.includes('对敌人的实际影响'));
  assert.ok(HEAVENLY_ADJUDICATOR_SYSTEM_PROMPT.includes('对战场环境的实际影响'));
  assert.ok(HEAVENLY_ADJUDICATOR_SYSTEM_PROMPT.includes('在面向玩家公开的 summary、publicEvents 和 exchange 中明文泄露尚未暴露的隐藏底牌'));
  assert.ok(HEAVENLY_ADJUDICATOR_SYSTEM_PROMPT.includes('只返回符合天道规范的结构化裁定数据 JSON'));
});

test('buildAdjudicationPrompt formats actors, techniques, and confidentiality boundaries cleanly', () => {
  const context = {
    actors: {
      player: {
        id: 'xuyan',
        name: '许妍',
        visibleInfo: { 境界: '筑基后期' },
        resources: { hp: 100, qi: 120 },
        techniques: [{ registryId: 'gongfa.dielang', techniqueIds: ['xianshi'] }]
      },
      enemies: [{
        id: 'lichanghai',
        name: '厉沧海',
        visibleInfo: { 境界: '假丹境' },
        resources: { hp: 150 },
        observedTechniques: [{ id: 'xuansha', name: '玄煞破灵剑' }],
        hidden: { hiddenTactic: '暗藏腐血煞针' }
      }]
    },
    scene: {
      location: '沧澜湖心·试剑台',
      time: '破晓',
      weather: '长风激荡'
    },
    semanticState: {
      statuses: ['心湖澄澈'],
      站位: '中距对峙'
    },
    registry: []
  };

  const action = {
    label: '起弦引潮·建立弦势',
    techniqueId: 'xianshi',
    intent: '反手拂弦，水波激荡成网'
  };

  const prompt = buildAdjudicationPrompt(context, action);
  assert.ok(prompt.includes('起弦引潮·建立弦势'));
  assert.ok(prompt.includes('反手拂弦，水波激荡成网'));
  assert.ok(prompt.includes('许妍'));
  assert.ok(prompt.includes('厉沧海'));
  assert.ok(prompt.includes('暗藏腐血煞针'));
  assert.ok(prompt.includes('【天道私密情报·仅供内部因果裁定·严禁公开泄密】'));
  assert.ok(prompt.includes('对敌人的实际影响'));
  assert.ok(prompt.includes('对战场环境的实际影响'));
});

test('formatScenePacketForStoryAI strips legacy prose instructions and keeps only round facts', () => {
  const packet = {
    type: 'BATTLE_SCENE_PACKET',
    roundId: 1,
    actionId: 'action-test',
    location: '试剑台',
    time: '破晓',
    committedFacts: [
      '天道裁定：起弦引潮',
      '【对敌影响】水网缠裹敌手重靴下盘，冲锋攻势受阻',
      '【环境剧变】水汽撕裂凝聚成网，青石缝隙泛起微光'
    ],
    descriptionRequirements: ['细致描写本轮交锋对敌手造成的物理与灵力实质创伤/制约'],
    prohibitions: ['禁止复判本轮行动胜负'],
    nextDecisionPoint: '等待玩家下一步行动',
    originalAction: {
      label: '起弦引潮',
      intent: '抚琴织网'
    }
  };

  const directive = formatScenePacketForStoryAI(packet, '继续描写');
  assert.equal(JSON.parse(directive).schema, 'battle_scene_v3');
  assert.ok(directive.includes('【对敌影响】水网缠裹敌手重靴下盘'));
  assert.ok(directive.includes('【环境剧变】水汽撕裂凝聚成网'));
  assert.doesNotMatch(directive, /descriptionRequirements|prohibitions|破晓|禁止复判|BATTLE_SCENE_PACKET_JSON|继续描写/);
});

test('buildAdjudicationRequest and judgeAndCommit use dedicated system prompt and generate structured facts', async () => {
  const initial = createInitialState({
    scene: { location: '试剑台' },
    player: {
      id: 'p1',
      name: '许妍',
      techniques: [{ registryId: 'gongfa.dielang-xuanchaojue', techniqueIds: ['xianshi'] }]
    },
    enemies: [{ id: 'e1', name: '厉沧海', hidden: { secret: '暗疾' } }],
    semanticState: { statuses: [], effects: [], positions: {}, control: '均势' },
    registrySnapshot: ALL_CANONICAL_REGISTRIES
  });

  const started = startBattle(initial);
  const action = { label: '起弦引潮', techniqueId: 'xianshi', intent: '引动水流' };
  const request = buildAdjudicationRequest(started, action);

  assert.equal(request.systemPrompt, HEAVENLY_ADJUDICATOR_SYSTEM_PROMPT);
  assert.ok(request.prompt.includes('【1. 修士本轮行止行动】'));
  assert.ok(request.prompt.includes('【天道私密情报·仅供内部因果裁定·严禁公开泄密】'));

  const adjudicator = new MockAdjudicator();
  const narrator = new MockNarrator();
  const result = await judgeAndCommit(started, action, { adjudicator, narrator });

  assert.equal(result.record.status, 'complete');
  assert.ok(result.record.adjudication.summary.includes('【对敌影响】'));
  assert.ok(result.record.adjudication.summary.includes('【环境剧变】'));
  assert.ok(result.record.adjudication.publicEvents.some(e => e.includes('【对敌影响】')));
  assert.ok(result.record.adjudication.publicEvents.some(e => e.includes('【环境剧变】')));
  assert.equal(result.record.narrativePacket.storyAiDirective, undefined);
  assert.equal(result.record.narrativePacket.playerAction.technique, '弦势');
  assert.equal(result.record.narrativePacket.exchange.opponents[0].name, '厉沧海');
});
