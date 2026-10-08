export function dynamicProfile() {
  return { candidate: { name: '顾澜', profile: {
    identity: '东海散修', cultivationRealm: '金丹初期', combatStyle: '重水封锁',
    martialArts: [{ name: '鲸波御水诀', description: '真元凝炼重水', principle: '神识分流控制', limitations: ['依赖水源'] }],
    techniques: [{ name: '重水棘阵', school: '鲸波御水诀', mechanism: '凝聚重水尖刺从多个方向封锁',
      conditions: ['附近有水源'], limits: ['多目标加重负担'],
      cost: { resources: ['灵力', '神识'], onUse: '凝炼重水消耗真元', sustaining: '维持与追踪累积负担', amplifiers: ['扩大范围'], overuseConsequences: ['控制失稳'] },
      recovery: { conditions: ['停止维持', '调息'], effect: '解除控制压力，真元逐渐恢复', limits: ['释放控制不补回已损耗真元'] },
      counterplay: ['干扰神识'], visibility: 'public' }],
    resourceTraits: ['灵力', '神识'].map(name => ({ name, description: '支持凝炼与控制', depletionConsequences: '难以维持精度', recoveryConditions: '停止维持并调息' })),
    behavior: { preference: '保持距离', tactics: ['集中封锁'], retreat: '失控时撤退' }, weaknesses: ['依赖水源'], hidden: { secret: '背部旧伤为不公开弱点' }
  }, initialState: { resources: [{ name: '神识', condition: '余裕未明确', burden: '正在维持重水尖刺', limitations: [], basis: '当前正文', visibility: 'internal' }], injuries: [], statuses: [], position: '海面浪峰' },
  initialCombatObjects: [{ key: 'spikes', technique: '重水棘阵', kind: 'effect', label: '重水尖刺', description: '封锁许妍周围空间', basis: '当前正文已形成', visibility: 'public', dependsOn: [] }]
  } };
}
