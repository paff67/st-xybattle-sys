import { EVENT_DOMAINS } from './event-domain-contracts.js';

const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const boundedText = (value, max = 2000) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
function evidence(ref, snapshot) {
  const source = [snapshot.input, ...snapshot.history].find(item => item.id === ref?.id);
  if (!source || !boundedText(ref.quote) || !source.text.includes(ref.quote)) throw new Error('分流缺少可核对的原文证据');
  return { id: ref.id, quote: ref.quote };
}

export function validateEventRoute(raw, snapshot) {
  if (!raw || !['pass', 'adjudicate', 'needs_context', 'unsupported'].includes(raw.decision) || !Array.isArray(raw.actions) || raw.actions.length > 6) throw new Error('分流契约无效');
  if (!Array.isArray(raw.missingInformation) || raw.missingInformation.some(value => !boundedText(value, 200))) throw new Error('分流缺项格式无效');
  if (raw.decision === 'pass' && raw.actions.length || raw.decision === 'adjudicate' && !raw.actions.length) throw new Error('分流决策与行动不一致');
  const actions = raw.actions.map(action => {
    if (!boundedText(action.localKey, 64) || !own(EVENT_DOMAINS, action.domain) || !boundedText(action.intent) || !['now', 'ongoing'].includes(action.execution)) throw new Error('分流模块或可执行语态无效');
    if (!Array.isArray(action.dependsOn) || action.dependsOn.some(key => !boundedText(key, 64))) throw new Error('行动依赖无效');
    const world = action.worldSignal;
    if (!world || !['none', 'registration_request', 'entry_request', 'emergency_request', 'attack_observed', 'entry_confirmed', 'exit_request'].includes(world.kind)
      || !['none', 'combat', 'cultivation', 'rescue', 'training', 'inspection', 'unknown'].includes(world.purpose)
      || !['none', 'linked', 'unknown'].includes(world.confrontation) || !Array.isArray(world.evidence) || world.evidence.length > 12) throw new Error('战界语义信号无效');
    if ((world.kind !== 'none' || world.confrontation === 'linked') && !world.evidence.length) throw new Error('战界语义缺少证据');
    return { localKey: action.localKey, domain: action.domain, intent: action.intent,
      ...(action.domain === 'combat' ? { opponentNames: Array.isArray(action.opponentNames) ? action.opponentNames.filter(name => boundedText(name, 100)).slice(0, 12) : [] } : {}),
      source: evidence(action.source, snapshot), execution: action.execution, dependsOn: [...new Set(action.dependsOn)],
      worldSignal: { kind: world.kind, purpose: world.purpose, confrontation: world.confrontation, evidence: world.evidence.map(ref => evidence(ref, snapshot)) } };
  });
  const map = new Map(actions.map(action => [action.localKey, action]));
  if (map.size !== actions.length) throw new Error('行动标识重复');
  const done = new Set(), active = new Set(), sorted = [];
  function visit(key) {
    if (!map.has(key) || active.has(key)) throw new Error('行动依赖缺失或循环');
    if (done.has(key)) return;
    active.add(key); map.get(key).dependsOn.forEach(visit); active.delete(key); done.add(key); sorted.push(map.get(key));
  }
  actions.forEach(action => visit(action.localKey));
  return { decision: raw.decision, actions: sorted, missingInformation: raw.missingInformation.slice(0, 20) };
}

// A candidate is a future integration hook, never a permission, state change or
// battle-controller invocation. A four-field projection cannot identify actors.
export function combatActivationCandidates(route, snapshot) {
  if (route.decision !== 'adjudicate') return [];
  const state = snapshot.battlefield.current;
  return route.actions.filter(action => {
    const signal = action.worldSignal;
    if (action.domain === 'combat') return true;
    return action.domain === 'battlefield' && signal.purpose === 'combat' && signal.confrontation === 'linked'
      && ['registration_request', 'entry_request', 'emergency_request', 'attack_observed', 'entry_confirmed'].includes(signal.kind);
  }).map(action => ({ actionKey: action.localKey, kind: action.domain === 'combat' ? 'combat_action' : 'battlefield_link',
    battleId: state?.战界ID === '无' ? null : state?.战界ID ?? null,
    mode: state?.战斗状态 === '进行中' ? 'resume_candidate' : 'prepare_candidate',
    status: snapshot.battlefield.differences.length ? 'state_conflict' : 'staged', executable: false }));
}
