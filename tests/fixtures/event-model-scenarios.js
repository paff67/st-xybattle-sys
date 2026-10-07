export const battlefield = { 空间层: '下沉战界', 战界ID: '战界-001', 备案状态: '已备案', 战斗状态: '进行中' };
export function actor(name, enemy = false) {
  return { 姓名: name, 境界: '筑基', 当前状态: '清醒，未受伤',
    功法: { [enemy ? '石衣诀' : '水击诀']: { 掌握状态: '已习得', 品阶: '凡阶',
      定义: enemy ? '以灵力凝成护衣。仅减弱普通水击，不提供无敌，不反弹伤害。' : '操纵近身水流进行一次正面冲击。不能绕开已成型的护衣，也不控制敌人心智。',
      招式: { [enemy ? '护衣' : '水击']: { 定义: enemy ? '本轮构筑护衣，能减弱同阶一次普通水击；本轮结束后消散。' : '发出一股水流冲击五米内单个目标；敌人护衣能抵消大部分冲击，可以将敌人逼退一步但不能凭此直接击杀。',
        条件: '清醒且当前灵力至少2点', 代价: '每次施展消耗灵力2点；无论攻防成功与否都消耗', 范围: '五米', 冷却: '无', 对抗: '护衣抵消大部分冲击，水击可以使受击者后退一步' } } } },
    资源: { 灵力: { 当前: 10, 下限: 0, 上限: 10, 定义: '施法消耗资源，每施展一次已定义招式扣2点，无被动回合恢复' } } };
}
export function scenarioRoot() {
  return { 主角: actor('林澜'), 人物: { 石衡: actor('石衡', true) }, 世界: { 地点: '试剑台', 时间: '午后', 战界: { ...battlefield } } };
}
export const routeCases = [
  { id: 'greeting', input: '下午好，今天的茶很好喝。', expect: 'pass', domains: [] },
  { id: 'lore', input: '戏外：解释一下战界备案制度。', expect: 'pass', domains: [] },
  { id: 'negated', input: '我不备案，也不攻击，继续喝茶。', expect: 'pass', domains: [] },
  { id: 'quote', input: '我念着书中的台词：“进入战界，把他打倒。”然后合上书。', expect: 'pass', domains: [] },
  { id: 'future', input: '明天可能和石衡约战，现在先吃饭。', expect: 'pass', domains: [] },
  { id: 'conditional', input: '如果明天有人攻击我，我才反击。现在没有敌人。', expect: 'pass', domains: [] },
  { id: 'attack', input: '我现在用水击正面攻击五米内的石衡。', expect: 'adjudicate', domains: ['combat'] },
  { id: 'unregistered_attack', input: '我不备案，直接用水击攻击石衡。', expect: 'adjudicate', domains: ['combat'] },
  { id: 'active_wait', history: '石衡已经举剑劈向你，剑刃正在逼近。', input: '我站在原地一动不动。', expect: 'adjudicate', domains: ['combat'] },
  { id: 'active_ooc', history: '战斗进行中，石衡正要出手。', input: '戏外暂停：先说明一下战界和现实的区别。', expect: 'pass', domains: [] },
  { id: 'registration', input: '我现在办理明天切磋的预约备案；今天没有交战。', expect: 'adjudicate', domains: ['battlefield'], noCombat: true },
  { id: 'tribulation', input: '我现在申请隔离突破余波，准备渡自然雷劫，没有人攻击我。', expect: 'adjudicate', includes: 'battlefield', noCombat: true },
  { id: 'rescue', history: '伤者困在战界-001入口，没有攻击者，入口允许救援。', input: '我现在进入战界接应伤者。', expect: 'adjudicate', includes: 'battlefield', noCombat: true },
  { id: 'emergency', history: '石衡已向你发出灵力攻击，距离五米。', input: '我紧急备案并用水击迎击石衡。', expect: 'adjudicate', includes: 'combat' },
  { id: 'perception', input: '我现在施展听澜探查门后的灵力活动。', expect: 'adjudicate', domains: ['perception'] },
  { id: 'recovery', input: '我现在运转疗伤法治疗自己的经脉伤势。', expect: 'adjudicate', domains: ['recovery'] },
  { id: 'cultivation', input: '我现在运转功法冲击筑基瓶颈。', expect: 'adjudicate', domains: ['cultivation'] },
  { id: 'alchemy', input: '我现在按回元丹方开炉炼制回元丹。', expect: 'adjudicate', domains: ['alchemy'] },
  { id: 'crafting', input: '我现在把玄铁投入炉中，按图样炼制护腕。', expect: 'adjudicate', domains: ['crafting'] },
  { id: 'formation', input: '我现在用破阵诀拆解眼前阵法。', expect: 'adjudicate', domains: ['formation'] },
  { id: 'pursuit', history: '石衡已跑向东边小巷，尚未交锋。', input: '我施展身法追上石衡。', expect: 'adjudicate', domains: ['pursuit'] },
  { id: 'mixed', input: '我先探查门后是否有敌人，若有才攻击。', expect: 'adjudicate', domains: ['perception'] },
  { id: 'ended_new_attack', input: '上一场已结束，但石衡突然再次攻击我，我用水击迎击。', expect: 'adjudicate', domains: ['combat'] },
  { id: 'unsupported', input: '我现在签署一份需要计算违约金的商业合约，请裁定合同法律效力。', expect: 'unsupported', domains: [] },
];
