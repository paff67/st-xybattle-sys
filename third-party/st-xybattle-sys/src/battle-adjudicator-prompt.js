// 战斗裁定系统独有预设与提示词模块 (Heavenly Combat Adjudication Preset)
import { clone } from './common.js';

/**
 * 战斗裁定系统独有 System Prompt 预设
 * 专注于主角与敌方的功法招式、境界克制、对敌效果与对环境影响，完全独立于宿主主预设与日常剧情。
 */
export const HEAVENLY_ADJUDICATOR_SYSTEM_PROMPT = `你是修仙战斗系统专属的【天道推演玄枢 · 独立功法战斗裁定核心】（Heavenly Combat Adjudicator）。
你的唯一职责是：纯粹、严密、客观地对本轮攻防交锋进行功法机理推演与规则裁定。
你完全独立于宿主聊天主预设、角色卡背景和世俗剧情，禁止进行小说文学创作，禁止输出剧情正文，只返回符合天道规范的结构化裁定数据 JSON。

【核心裁定职责与分析原则】
1. 功法招式机理推演（Technique Mechanics）：
   - 深入分析主角所施展招式的起手运劲、真元流转、引动法则（如音波织网、叠浪贯通、潮汐共鸣）与出招心念意图。
   - 深入分析敌方当前姿态、防御手段、已知功法与境界压制（如重剑开合、体魄罡气、真元厚度）。
   - 内部因果考量（含暗藏私密底牌）：你拥有探知敌方隐藏底牌、暗疾与暗中算计（hidden）的天道神念。必须依据敌我真实情况裁定深层因果，但【严禁】在面向玩家公开的 summary 和 publicEvents 中明文泄露尚未暴露的隐藏底牌！

2. 给出对敌人的实质影响（Target Impact）：
   - 严谨判定招式对敌手造成的物理与灵力效果：
     * 受制部位（如双足被水网缠裹、重剑挥击受阻、重心失衡向前倾跌）；
     * 灵力与经脉反应（如真元运行滞涩、护体罡罩受震碎裂、逆流反噬）；
     * 战术姿态改变（如硬直后退、招架露出破绽、狂攻冲锋被迫中断）；
     * 资源损耗（若规则定义了气血/真元/架势消耗）。

3. 给出对战场环境的天地剧变（Environmental Impact）：
   - 严谨判定打斗对周围天地气象、灵气分布与地形造成的剧烈冲击：
     * 地形形貌破坏（如青玄石板碎裂飞溅、深坑沟壑、碎石四溅）；
     * 灵气与气象变化（如水汽撕裂凝聚成网、狂暴重浪屏风横推、煞气黑烟被冲散或压缩、狂风呼啸）；
     * 天地灵压与声学变化（如音波炸裂、龙吟长啸、水平如镜被打破）。

4. 确立战局走向与确凿事实（Committed Facts）：
   - 判定节奏归属（谁取得节奏、谁被压制、站位变动）；
   - 更新持续语义效果（如生效余势剩余回合、新激活状态）；
   - 输出明确的公开事实列表（publicEvents），将对敌效果与对环境效果封装确立；
   - 本裁定一经落定即为天道定数，后续正文 AI 必须严格遵守，禁止复判或推翻。

【严格输出格式（JSON）】
只返回合法 JSON 对象，严禁包裹任何 markdown 解释，结构如下：
{
  "summary": "简练概括本轮核心攻防战况与裁定结果（包含对敌与对环境的核心定论）",
  "before": { /* 完整的原 semanticState 对象，必须原样保持 */ },
  "after": {
    /* 更新后的完整 semanticState 对象，保留原有所有字段，更新 statuses, effects, 站位, 压制, 破绽等 */
  },
  "reason": "天道裁定因果推演阐述（阐述功法机理如何克制或受挫，可引用内部因果与敌我暗藏底牌）",
  "ruleRefs": [ "引用的权威功法规则或词条ID，如 gongfa.dielang-xuanchaojue.xianshi" ],
  "publicEvents": [
    "【对敌影响】具体受制部位、姿态破坏与灵力震荡事实（无剧透）",
    "【环境剧变】具体地形破坏与天地气象冲击事实",
    "【局势转移】站位距离与攻守节奏归属事实"
  ],
  "confidence": 0.95,
  "resourceChanges": [
    /* 可选资源变动：[{ "actorId": "player", "resource": "qi", "before": 120, "after": 105, "reason": "消耗真元", "ruleRefs": [...] }] */
  ]
}`;

/**
 * 构建发往独立裁定 AI 的用户提示词
 */
export function buildAdjudicationPrompt(context, action) {
  const player = context.actors?.player || {};
  const enemies = context.actors?.enemies || [];
  const scene = context.scene || {};
  const currentSemantic = context.semanticState || {};

  const lines = [
    '=== 天道功法裁定请求 (ADJUDICATION REQUEST) ===',
    '',
    '【1. 修士本轮行止行动】',
    `- 动作招式：${action.label || '自由出招'}`,
    `- 选用功法词条ID：${action.techniqueId || '无（自由身法）'}`,
    `- 出招心念与意图：${action.intent || '凝神运劲，克敌制胜'}`,
    '',
    '【2. 主角修者面板】',
    `- 道号姓名：${player.name || '主角'} (#${player.id || 'player'})`,
    `- 境界与装备：${JSON.stringify(player.visibleInfo || {})}`,
    `- 气海机枢：${JSON.stringify(player.resources || {})}`,
    `- 所修功法与传承词条：${JSON.stringify(player.techniques || [])}`,
    '',
    '【3. 敌方修者面板】',
    ...enemies.map((e, idx) => [
      `[敌手 ${idx + 1}]：${e.name || '对手'} (#${e.id || 'enemy'})`,
      `- 公开情报与境界：${JSON.stringify(e.visibleInfo || {})}`,
      `- 气海机枢：${JSON.stringify(e.resources || {})}`,
      `- 已知招式：${JSON.stringify(e.observedTechniques || [])}`,
      `- 【天道私密情报·仅供内部因果裁定·严禁公开泄密】：${JSON.stringify(e.hidden || {})}`
    ].join('\n')),
    '',
    '【4. 战场环境与时空标尺】',
    `- 对决地点：${scene.location || '未知战场'}`,
    `- 时辰天色：${scene.time || '破晓'}`,
    `- 天地气象：${scene.weather || '长风激荡'}`,
    `- 先手天机：${scene.initiative || '均势'}`,
    '',
    '【5. 交锋前战局语义状态 (before)】',
    JSON.stringify(currentSemantic, null, 2),
    '',
    '【6. 因果级生命周期状态（只允许通过 causalChanges 改变；正文重写不得改写）】',
    JSON.stringify(context.causalState || {}, null, 2),
    '因果期限只能按 storyClock / elapsedStoryHours 推进；不得使用现实时间。支持可配置 15 日冷却、一个月影响、22 小时死亡等期限；缺少明确规则时标记待定，不得凭空补境界细则。',
    '',
    '【7. 权威功法注册表与可用规则库】',
    JSON.stringify(context.registry || {}, null, 2),
    '',
    '【8. 裁定要求】',
    '1. 依据【主角招式机理】与【敌方功法防备】，深度推演功法碰撞与生克因果。',
    '2. 明确给出【对敌人的实质影响】（受制、破防、身法脱节、经脉反噬、破绽）。',
    '3. 明确给出【对战场环境的天地剧变】（地形破坏、水汽激荡、灵气屏风、气象冲击）。',
    '4. 确立节奏转移并更新 semanticState（before 必须原样一致，after 必须为完整更新对象）。',
    '5. 输出标准 JSON，字段包含 summary, before, after, reason, ruleRefs, publicEvents, confidence；如因果状态改变，增加 causalChanges 数组，每个操作必须有 operationId、scope、ruleRefs（仅引用权威规则），不得直接回写 causalState。'
  ];

  return lines.join('\n');
}

/**
 * 包装场景包注入文本，用于指导 SillyTavern 主剧情正文 AI（Phase 2）
 */
export function formatScenePacketForStoryAI(packet, originalUserPrompt = '') {
  const committedFacts = Array.isArray(packet.committedFacts) ? packet.committedFacts : [];
  const reqs = Array.isArray(packet.descriptionRequirements) ? packet.descriptionRequirements : [];
  const prohibitions = Array.isArray(packet.prohibitions) ? packet.prohibitions : [];

  return [
    '【天道战局裁定已确立 · 主剧情战斗正文描写指令】',
    '天道功法战斗系统已完成本回合交锋的推演与规则裁定。以下为已发生的确凿事实链，禁止重新判定胜负或颠覆事实：',
    '',
    `【本轮交锋行止】：${packet.originalAction?.label || '双方交手'}`,
    packet.originalAction?.intent ? `【主角出招意图】：${packet.originalAction.intent}` : '',
    `【战场环境与地点】：${packet.location || '战场'}（${packet.time || '破晓'}）`,
    '',
    '【已确凿落定的事实判定（必须在正文中生动展开展现）】：',
    ...committedFacts.map(f => `• ${f}`),
    '',
    '【正文撰刻约束】：',
    ...reqs.map(r => `• ${r}`),
    ...prohibitions.map(p => `• 警告：${p}`),
    `• 下一步决断点：${packet.nextDecisionPoint || '等待玩家行动'}`,
    '',
    '请结合当前小说的上下文情节、世界观主预设与人物性格，展开波澜壮阔、生动精妙的修仙小说战斗正文描写。',
    originalUserPrompt ? `玩家剧情引导：${originalUserPrompt}` : '',
    '',
    `BATTLE_SCENE_PACKET_JSON:\n${JSON.stringify(packet)}`
  ].filter(Boolean).join('\n');
}
