export function fullCombatProfile(name = '厉沧海') {
  return {
    name, identity: '剑修', cultivationRealm: '假丹境', combatStyle: '近身重剑压制', currentState: '未受伤，正在对峙',
    visibleInfo: { stance: '守势', position: '台心', weapon: '铁灰长剑' },
    martialArts: [{ name: '断澜剑诀', rank: '地阶', description: '以沉重剑势截断来袭气流，护身与反击一体。', principle: '聚气于剑脊，横斩散流' }],
    techniques: [{ name: '平川断澜', school: '断澜剑诀', category: '剑招', originalDefinition: '消耗10点真气横斩五丈范围，截断一道来袭气流；无法阻挡超出自身境界的正面攻势。', mechanics: ['横向剑气截流', '收剑时暴露右侧'], cost: '真气10点', range: '正面五丈', cooldown: '一回合', counterplay: '可绕至背后，蓄力时打断剑势', availability: { default: 'available', conditions: [], description: '持剑且真气不少于10点' }, triggeredState: ['一回合内收剑硬直'], visibility: 'public' }],
    resourceDefinitions: [{ key: 'qi', name: '真气', current: 80, min: 0, max: 100, definition: '施展剑招消耗；不足时不能施术', recovery: '静息一回合恢复5点', visibility: 'internal' }],
    behavior: { preference: '保持中近距', opening: '先守后斩', tactics: ['封锁正面', '反击敌方收招'], retreat: '真气低于10点时后撤' },
    weaknesses: ['收剑时背后空虚'], hidden: { reservePlan: '靠近断崖时佯退诱敌' }
  };
}
