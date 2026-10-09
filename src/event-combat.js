import { createAutomaticEventPreparation } from './event-preparation.js';
import { createInitialState, startBattle, nextRound } from './battle-state.js';
import { proposeBattleAction, commitBattleProposal } from './battle-proposal.js';
import { createCharacterJsonRequest } from './character-source-adapters.js';
import { HIGH_MARTIAL_EVENT_POLICY } from './event-world-policy.js';
import { clone, stripSecrets } from './common.js';
import { createDailyExecutor } from './event-daily.js';

export function createEventCombatPipeline({ request, adjudicator, policy = HIGH_MARTIAL_EVENT_POLICY, ...options } = {}) {
  const ask = request || createCharacterJsonRequest(options);
  const judge = adjudicator || {
    judge: (query, { signal }) => ask(query.systemPrompt + '\n以本次用户世界规则为准：\n' + JSON.stringify(policy) +
      '\n战斗胜负、命中、攻防、伤害与脱战完全由本次AI依据能力原文和当前事实裁定。禁止用DC总分、差值、阈值、骰点或哈希骰决定结果；程序仅校验提案一致性，不再进行第二次胜负判定。用户当前定义优先。只能引用本次 registry 与 resourceRules 中已有的 ruleRefs；条件、消耗、冷却及对抗仍按完整原文检查。缺少数值定义时不得编造数值消耗；无变更返回空数组。额外返回 battleStatus:"ongoing|ended"；只有交战已经确实终止/脱战才 ended，并提供 battleEndReason。请求停战或注销备案不能单独证明成功脱战。',
    { request: query.prompt }, options.requestTimeoutMs || 60000, signal),
    repair: (query, raw, error, { signal }) => ask('修复一次裁定 JSON 的结构或被指出的引用错误，保持原行动事实，不增加能力。只返回 JSON。',
      { request: query.prompt, previous: raw, issue: error.message }, options.requestTimeoutMs || 60000, signal),
  };
  return createAutomaticEventPreparation({ ...options, request: ask, policy, reuseCombatState: true,
    onPrepared: async (route, { snapshot, args, assertFresh }) => {
      // P3 owns combat only. Refuse the whole mixed event before any proposal;
      // later perception/recovery executors can share this transaction boundary.
      if (route.actions.length && route.actions.every(action => action.domain !== 'combat')) return createDailyExecutor({ ...options, request: ask, policy })(route, { snapshot, args, assertFresh });
      if (!route.actions.length || route.actions.some(action => action.domain !== 'combat')) return { ...route, decision: 'unsupported', reasonCode: 'domain_not_implemented' };
      assertFresh();
      let working = args.battleState ? clone(args.battleState) : null;
      if (working && !route.preparation.reusedSessionId) {
        const existing = [working.actors.player, ...working.actors.enemies].map(actor => actor.id).sort().join('|');
        if (route.preparation.modules.some(module => module.roster?.map(item => item.actor.id).sort().join('|') !== existing)) return { ...route, decision: 'needs_context', reasonCode: 'active_battle_cast_changed' };
      }
      if (!working) {
        const roster = route.preparation.modules.find(module => module.domain === 'combat')?.roster;
        if (!roster?.length || roster.some(item => item.status !== 'ready')) return { ...route, decision: 'needs_context' };
        // Multiple stages may cite the same cast. A new actor in another stage
        // requires a separate, explicit roster update, not an implicit summon.
        const cast = roster.map(item => item.actor.id).sort().join('|');
        if (route.preparation.modules.some(module => module.roster?.map(item => item.actor.id).sort().join('|') !== cast)) return { ...route, decision: 'needs_context', reasonCode: 'cast_changes_within_event' };
        const world = snapshot.sources.find(source => source.id === 'mvu')?.data?.世界 || {};
        working = startBattle(createInitialState({ sessionId: `event-battle:${args.event.eventId}`, chatId: args.event.chatId, branchId: args.event.branchUid,
          player: roster.find(item => item.side === 'player').actor, enemies: roster.filter(item => item.side === 'enemy').map(item => item.actor),
          registrySnapshot: roster.flatMap(item => item.registry), resourceRules: roster.flatMap(item => item.resourceRules),
          location: typeof world.地点 === 'string' ? world.地点 : '以当前上下文为准',
          time: typeof world.时间 === 'string' ? world.时间 : '当前剧情时间',
          scene: { battlefield: clone(snapshot.battlefield.current), situation: route.preparation.modules[0]?.fields.situation?.map(ref => ref.value) || [] } }));
      }
      const before = clone(working), packets = [], records = [];
      for (const action of route.actions) {
        assertFresh();
        if (working.phase === 'ended') working = startBattle(working);
        if (['awaiting_next', 'committed'].includes(working.phase)) working = nextRound(working);
        const proposal = await proposeBattleAction(working, { actionId: `${args.event.eventId}:${action.localKey}`, label: action.intent, intent: action.source.quote },
          { adjudicator: judge, signal: args.signal, settings: { adjudicator: { repairAttempts: 1, maxOutput: options.maxOutput || 6000 } } });
        assertFresh();
        working = commitBattleProposal(working, proposal);
        packets.push(proposal.packet); records.push(proposal.record);
      }
      // History lives once in event receipts. Avoid nesting all prior rollback
      // images in every new event's persistent domain snapshot.
      const after = clone(working); after.history = [];
      return stripSecrets({ ...route, execution: { schema: 'event_combat_commit_v1', beforeState: before, afterState: after, records,
        packet: { type: 'XY_EVENT_RESULT', eventId: args.event.eventId, results: packets },
        status: 'validated', modules: ['combat'] } }, [options.apiKey]);
    } });
}
