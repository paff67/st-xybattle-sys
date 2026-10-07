export function responseFor(request, { end = false } = {}) {
  const state = request.context, player = state.actors.player, enemy = state.actors.enemies[0];
  return { summary: '水击被护衣抵挡，双方各消耗2点灵力。', before: structuredClone(state.semanticState), after: structuredClone(state.semanticState),
    reason: '依照固定消耗与护衣规则', ruleRefs: [state.registry[0].ruleRefs[0]], publicEvents: ['护衣减弱水击'],
    battleStatus: end ? 'ended' : 'ongoing', ...(end ? { battleEndReason: '双方完成约定试剑并明确脱战' } : {}),
    resourceChanges: [player, enemy].map(value => ({ actorId: value.id, resource: '灵力', before: value.resources.灵力, after: value.resources.灵力 - 2,
      reason: '施展一次招式', ruleRefs: state.resourceRules.find(rule => rule.actorId === value.id).ruleRefs })),
    exchange: { playerResult: '水击被减弱，未受伤', opponents: [{ actorId: enemy.id, response: '施展护衣', result: '抵挡水击，后退一步', techniques: [] }], environmentResult: '战界地面微湿', boundaries: [] } };
}
export function preparationRequest({ mixed = false } = {}) {
  return async (_prompt, context) => {
    if (!context.action) return { decision: 'adjudicate', actions: [{ localKey: 'attack', domain: 'combat', intent: context.input.text,
      source: { id: 'input', quote: context.input.text }, execution: 'now', dependsOn: [], opponentNames: ['石衡'], worldSignal: { kind: 'none', purpose: 'none', confrontation: 'none', evidence: [] } },
    ...(mixed ? [{ localKey: 'other', domain: 'perception', intent: '探查', source: { id: 'input', quote: context.input.text }, execution: 'now', dependsOn: ['attack'], worldSignal: { kind: 'none', purpose: 'none', confrontation: 'none', evidence: [] } }] : [])], missingInformation: [] };
    if (context.action.domain === 'perception') return { fields: Object.fromEntries(['subject','method','target','environment'].map(key => [key, [{ sourceId: 'mvu', pointer: '/主角' }]])), missing: [], conflicts: [] };
    return { fields: { actors: [{ sourceId: 'actor-candidates', pointer: '' }], methods: [{ sourceId: 'mvu', pointer: '/主角/功法' }],
      resources: [{ sourceId: 'mvu', pointer: '/主角/资源' }], situation: [{ sourceId: 'history:0', pointer: '' }] }, missing: [], conflicts: [],
      participants: [{ side: 'player', ref: { sourceId: 'actor-candidates', pointer: '/0/data' } }, { side: 'enemy', ref: { sourceId: 'actor-candidates', pointer: '/1/data' } }] };
  };
}
