import { createAutomaticEventPreparation } from './event-preparation.js';
import { createCharacterJsonRequest } from './character-source-adapters.js';
import { EVENT_ROUTER_PROMPT } from './event-preparation-prompts.js';
import { HIGH_MARTIAL_EVENT_POLICY } from './event-world-policy.js';
import { EVENT_DOMAINS } from './event-domain-contracts.js';
import { validateEventRoute, combatActivationCandidates } from './event-router.js';
import { battlefieldProjection } from './event-battlefield-state.js';
import { storyText } from './story-context.js';
import { createDailyExecutor } from './event-daily.js';

export function createWorkbenchEventRouter(options = {}) {
  return createAutomaticEventPreparation({ ...options, combatHandoff: true, onPrepared: createDailyExecutor(options) });
}

// Scene-creation/OOC inputs pass through ST first. Inspect only the exact new
// assistant linked by P1, never a globally latest message or a keyword hit.
export function createNarrativeBattleObserver(options = {}) {
  const ask = options.request || createCharacterJsonRequest(options);
  return async ({ message, input, signal }) => {
    const snapshot = { input: { id: 'input', text: storyText(message.mes) },
      history: [{ id: 'request', text: input.mes }], battlefield: battlefieldProjection(null, null) };
    const route = validateEventRoute(await ask(EVENT_ROUTER_PROMPT + '\n本次input是刚完成的助手正文，history是玩家的场景请求。只判断正文末尾是否有当前未解决、需交给战斗工作台的交战或有对手的战前准备。已结束战斗、背景回忆、比喻、推演、单纯提到战界一律pass；不要把创建场景请求本身当成已发生战斗。',
      { input: snapshot.input, history: snapshot.history, battlefield: snapshot.battlefield, policy: HIGH_MARTIAL_EVENT_POLICY,
        domains: Object.entries(EVENT_DOMAINS).map(([id, value]) => ({ id, label: value.label })) }, options.requestTimeoutMs, signal), snapshot);
    const candidates = combatActivationCandidates(route, snapshot);
    return candidates.length ? { ...route, decision: 'handoff', reasonCode: 'narrative_battle_preparation' } : null;
  };
}
