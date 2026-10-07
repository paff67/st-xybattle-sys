import { domainContract, EVENT_DOMAINS } from './event-domain-contracts.js';
import { HIGH_MARTIAL_EVENT_POLICY } from './event-world-policy.js';
import { EVENT_ROUTER_PROMPT, preparationPrompt } from './event-preparation-prompts.js';
import { validateEventRoute, combatActivationCandidates } from './event-router.js';
import { createEventContextReader } from './event-context.js';
import { createCharacterJsonRequest } from './character-source-adapters.js';
import { stripSecrets } from './common.js';
import { normalizeNarrativeProfile } from './narrative-profile.js';

function resolveReference(ref, snapshot) {
  const source = snapshot.sources.find(item => item.id === ref?.sourceId);
  if (!source || typeof ref.pointer !== 'string' || ref.pointer && !ref.pointer.startsWith('/')) throw new Error('资料引用无效');
  let value = source.data;
  const parts = ref.pointer === '' ? [] : ref.pointer.slice(1).split('/');
  for (const token of parts) {
    if (/~(?![01])/u.test(token)) throw new Error('资料指针转义无效');
    const key = token.replace(/~1/g, '/').replace(/~0/g, '~');
    if (['__proto__', 'constructor', 'prototype'].includes(key) || value === null || typeof value !== 'object' || !Object.prototype.hasOwnProperty.call(value, key)) throw new Error('资料指针不存在');
    value = value[key];
  }
  if (ref.quote !== undefined) {
    if (typeof value !== 'string' || typeof ref.quote !== 'string' || !ref.quote.trim() || !value.includes(ref.quote)) throw new Error('资料引文不匹配');
    value = ref.quote;
  }
  const empty = value == null || value === '' || value === '未知' || typeof value === 'object' && !Object.keys(value).length;
  return { sourceId: source.id, pointer: ref.pointer, ...(ref.quote !== undefined ? { quote: ref.quote } : {}),
    value: structuredClone(value), sourceKind: source.kind, branchKnown: source.branchKnown, empty };
}

export function validatePreparedEvidence(domain, raw, snapshot, profileOptions = {}) {
  const contract = domainContract(domain), allowed = new Set([...contract.required, ...contract.optional]);
  if (!raw || !raw.fields || Array.isArray(raw.fields) || typeof raw.fields !== 'object' || !Array.isArray(raw.missing) || !Array.isArray(raw.conflicts)) throw new Error('模块资料契约无效');
  const fields = {};
  for (const [key, refs] of Object.entries(raw.fields)) {
    if (!allowed.has(key) || !Array.isArray(refs) || refs.length > 24) throw new Error('模块字段或引用数量无效');
    fields[key] = refs.map(ref => resolveReference(ref, snapshot));
  }
  if (raw.missing.some(key => !allowed.has(key))) throw new Error('模块缺项未知');
  const conflicts = raw.conflicts.map(conflict => {
    if (!allowed.has(conflict?.field) || !Array.isArray(conflict.refs) || conflict.refs.length < 2 || conflict.refs.length > 24) throw new Error('模块冲突格式无效');
    return { field: conflict.field, refs: conflict.refs.map(ref => resolveReference(ref, snapshot)) };
  });
  // Input may identify a target/purpose, but cannot grant a method, actor identity,
  // resource, current position or injury. Unanchored ACU remains a useful hint.
  const intentFields = new Set(['target', 'purpose']);
  const missing = [...new Set([...raw.missing, ...contract.required.filter(key => !(fields[key] || []).some(ref => !ref.empty && ref.branchKnown && (ref.sourceKind !== 'intent' || intentFields.has(key))))])];
  let roster;
  if (domain === 'combat') {
    roster = [];
    const participants = raw.participants || [], seen = new Set();
    if (!Array.isArray(participants) || participants.length > 12) throw new Error('交战人物选择无效');
    for (const participant of participants) {
      if (!['player', 'enemy'].includes(participant.side) || participant.ref?.sourceId !== 'actor-candidates' || !/^\/\d+\/data$/.test(participant.ref.pointer)) throw new Error('交战人物来源无效');
      const index = Number(participant.ref.pointer.split('/')[1]);
      const candidate = snapshot.sources.find(source => source.id === 'actor-candidates')?.data[index];
      if (!candidate || (participant.side === 'player') !== (candidate.side === 'player') || seen.has(index)) throw new Error('主角或对手引用不匹配');
      seen.add(index);
      const ref = resolveReference(participant.ref, snapshot);
      const compiled = normalizeNarrativeProfile(ref.value, { ...profileOptions, id: `actor:${candidate.path}`, side: participant.side });
      roster.push({ side: participant.side, source: { sourceId: ref.sourceId, pointer: ref.pointer }, ...compiled });
      if (compiled.status !== 'ready') missing.push(...compiled.missing.map(key => `${compiled.actor?.name || index}.${key}`));
    }
    if (roster.filter(item => item.side === 'player').length !== 1 || !roster.some(item => item.side === 'enemy')) missing.push('actors');
  }
  return { domain, status: missing.length || conflicts.length ? 'needs_context' : 'ready', fields, missing, conflicts, ...(roster ? { roster } : {}) };
}

export function createAutomaticEventPreparation({ captureContext, request, policy = HIGH_MARTIAL_EVENT_POLICY, onPrepared, reuseCombatState = false, profileOptions,
  requestTimeoutMs = 60000, ...options } = {}) {
  const capture = captureContext || createEventContextReader(options);
  const ask = request || createCharacterJsonRequest(options);
  const policySnapshot = structuredClone(policy);
  return async args => {
    const snapshot = await capture(args);
    const assertFresh = () => { if (args.signal?.aborted) throw new DOMException('事件准备已取消', 'AbortError'); snapshot.assertFresh?.(); };
    assertFresh();
    // Until a multimodal/context attachment adapter exists, text-only routing
    // cannot safely decide that an unseen attachment contains no action.
    if (snapshot.hasAttachments) return { decision: 'needs_context', framework: 'auto-preparation-v1', policyId: policySnapshot.id,
      scope: snapshot.scope, battlefield: snapshot.battlefield, actions: [], missingInformation: ['attachment_context_not_supported'], activationCandidates: [], preparation: null };
    const route = validateEventRoute(await ask(EVENT_ROUTER_PROMPT, { input: snapshot.input, history: snapshot.history,
      battlefield: snapshot.battlefield, activeCombat: args.battleState ? { sessionId: args.battleState.sessionId, phase: args.battleState.phase, actors: [args.battleState.actors.player, ...args.battleState.actors.enemies].map(actor => ({ id: actor.id, name: actor.name })) } : null,
      policy: policySnapshot, domains: Object.entries(EVENT_DOMAINS).map(([id, value]) => ({ id, label: value.label })) }, requestTimeoutMs, args.signal), snapshot);
    assertFresh();
    const result = { ...route, framework: 'auto-preparation-v1', policyId: policySnapshot.id, scope: snapshot.scope,
      battlefield: snapshot.battlefield, activationCandidates: combatActivationCandidates(route, snapshot), preparation: null };
    if (route.decision !== 'adjudicate') return result;
    if (snapshot.battlefield.differences.length && route.actions.some(action => ['combat', 'battlefield', 'pursuit'].includes(action.domain))) {
      return { ...result, decision: 'needs_context', preparation: { status: 'needs_context', reason: 'battlefield_projection_conflict', modules: [] } };
    }
    if (reuseCombatState && args.battleState && route.actions.every(action => action.domain === 'combat' && action.opponentNames.length && action.opponentNames.every(name => args.battleState.actors.enemies.some(enemy => enemy.name === name))) && ['awaiting_player', 'awaiting_next', 'committed'].includes(args.battleState.phase)) {
      const prepared = { ...result, preparation: { status: 'ready', reusedSessionId: args.battleState.sessionId, executable: false, modules: [] } };
      return onPrepared ? onPrepared(prepared, { snapshot, args, assertFresh }) : prepared;
    }
    const modules = [];
    for (const action of route.actions) {
      assertFresh();
      const raw = await ask(preparationPrompt(action.domain), { action, scope: snapshot.scope, sources: snapshot.sources,
        battlefield: snapshot.battlefield, policy: policySnapshot }, requestTimeoutMs, args.signal);
      assertFresh();
      modules.push({ actionKey: action.localKey, ...validatePreparedEvidence(action.domain, raw, snapshot, profileOptions) });
    }
    const ready = modules.every(module => module.status === 'ready');
    // Preparation does not satisfy execution. The P0/P1 coordinator still blocks
    // adjudication with domain_not_implemented; no legacy confirmation is called.
    const prepared = stripSecrets({ ...result, decision: ready ? 'adjudicate' : 'needs_context',
      activationCandidates: result.activationCandidates.map(candidate => ({ ...candidate, status: ready ? 'staged' : 'needs_context' })),
      preparation: { status: ready ? 'ready' : 'needs_context', executable: false, modules } }, [options.apiKey]);
    return ready && onPrepared ? onPrepared(prepared, { snapshot, args, assertFresh }) : prepared;
  };
}
