import { clone, stableStringify } from './common.js';

export const CAUSAL_SCHEMA = 'battle_v2_causal';
export const CAUSAL_VERSION = 1;
export const CAUSAL_DURATIONS = Object.freeze({
  cooldown15d: { key: 'cooldown15d', unit: 'story_days', value: 15, storyHours: 15 * 24 },
  influenceMonth: { key: 'influenceMonth', unit: 'story_months', value: 1, storyHours: 30 * 24 },
  death22h: { key: 'death22h', unit: 'story_hours', value: 22, storyHours: 22 }
});

const now = () => new Date().toISOString();
const arr = (value) => Array.isArray(value) ? value : [];
const scopeKey = (scope) => `${scope?.chatId ?? ''}:${scope?.branchId ?? ''}`;
const sameScope = (a, b) => scopeKey(a) === scopeKey(b);

export function normalizeCausalDuration(value) {
  if (value == null) return null;
  if (typeof value === 'string' && CAUSAL_DURATIONS[value]) return clone(CAUSAL_DURATIONS[value]);
  if (Number.isFinite(value)) return { unit: 'story_hours', value, storyHours: Number(value) };
  if (typeof value !== 'object' || !Number.isFinite(Number(value.value))) throw new Error('无效因果持续时间');
  const unit = value.unit || 'story_hours';
  const multiplier = unit === 'story_days' ? 24 : unit === 'story_months' ? 30 * 24 : 1;
  return { ...(value.key ? { key: value.key } : {}), unit, value: Number(value.value), storyHours: Number(value.storyHours ?? Number(value.value) * multiplier) };
}

function clockValue(clock = {}) {
  return { roundId: clock.roundId ?? null, totalStoryHours: Number(clock.totalStoryHours || 0), storyTime: clock.storyTime == null ? null : clone(clock.storyTime) };
}

export function createCausalState({ scope = null, clock, anchors = [], relations = [], debts = [], cooldowns = {}, ledger = [], appliedActions = [] } = {}) {
  if (!scope?.chatId || !scope?.branchId) throw new Error('因果状态需要 chatId/branchId 作用域');
  const state = { schema: CAUSAL_SCHEMA, version: CAUSAL_VERSION, scope: clone(scope), clock: clockValue(clock), anchors: clone(arr(anchors)), relations: clone(arr(relations)), debts: clone(arr(debts)), cooldowns: clone(cooldowns || {}), ledger: clone(arr(ledger)), appliedActions: clone(arr(appliedActions)) };
  validateCausalState(state); return state;
}

function validateList(list, name) { if (!Array.isArray(list)) throw new Error(`因果字段 ${name} 必须为数组`); }
export function validateCausalState(state) {
  if (!state || state.schema !== CAUSAL_SCHEMA || state.version !== CAUSAL_VERSION) throw new Error('因果状态 schema/version 无效');
  if (!state.scope?.chatId || !state.scope?.branchId) throw new Error('因果状态作用域无效');
  if (!state.clock || !Number.isFinite(state.clock.totalStoryHours) || state.clock.totalStoryHours < 0) throw new Error('因果时钟无效');
  for (const key of ['anchors', 'relations', 'debts', 'ledger', 'appliedActions']) validateList(state[key], key);
  if (!state.cooldowns || typeof state.cooldowns !== 'object' || Array.isArray(state.cooldowns)) throw new Error('cooldowns 必须为对象');
  for (const entry of [...state.anchors, ...state.relations, ...state.debts]) if (entry && entry.scope && !sameScope(entry.scope, state.scope)) throw new Error('因果实体跨分支写入');
  for (const entry of state.ledger) if (!entry?.entryId || !entry?.actionId || entry.scope && !sameScope(entry.scope, state.scope)) throw new Error('因果 ledger 条目无效');
  for (const entry of state.appliedActions) if (!entry?.actionId || !entry?.hash) throw new Error('因果幂等收据无效');
  return true;
}

export function restoreCausalState(raw, scope) {
  if (!raw) return createCausalState({ scope });
  if (raw.schema !== CAUSAL_SCHEMA) throw new Error('无法恢复未知因果 schema');
  const state = { ...clone(raw), scope: clone(raw.scope || scope) };
  if (!sameScope(state.scope, scope || state.scope)) throw new Error('因果状态作用域不一致');
  state.version ||= CAUSAL_VERSION; state.clock = clockValue(state.clock);
  state.anchors ||= []; state.relations ||= []; state.debts ||= []; state.cooldowns ||= {}; state.ledger ||= []; state.appliedActions ||= [];
  validateCausalState(state); return state;
}

function findById(list, id) { return list.find((item) => item.id === id || item.key === id); }
function ensureOperationScope(operation, scope) { if (operation.scope && !sameScope(operation.scope, scope)) throw new Error('因果变更跨分支，已拒绝'); }
function durationFields(duration, clock) {
  const normalized = normalizeCausalDuration(duration); if (!normalized) return {};
  return { duration: normalized, startedStoryHours: clock.totalStoryHours, remainingStoryHours: normalized.storyHours, expiresAtStoryHours: clock.totalStoryHours + normalized.storyHours };
}

export function applyCausalChanges(input, changes = [], { actionId, roundId, scope, ruleRefs = [], knownRuleRefs = [], allowMock = false, requireRuleRefs = false, authority = 'adjudicator' } = {}) {
  const state = restoreCausalState(input, scope || input?.scope); const targetScope = scope || state.scope;
  if (!sameScope(targetScope, state.scope)) throw new Error('因果变更作用域不一致');
  if (!actionId) throw new Error('因果变更需要 actionId');
  if (!['adjudicator', 'system'].includes(authority)) throw new Error('只有裁定器或系统可以提交因果变更');
  const hash = stableStringify({ actionId, roundId, scope: targetScope, changes });
  const prior = state.appliedActions.find((item) => item.actionId === actionId);
  if (prior) { if (prior.hash !== hash) throw new Error('相同 actionId 的因果变更内容不一致'); return { state, deduplicated: true, entries: [] }; }
  const known = new Set(knownRuleRefs); const refs = [...ruleRefs, ...changes.flatMap((item) => item.ruleRefs || [])];
  if (requireRuleRefs && !refs.length && !allowMock) throw new Error('因果变更缺少 ruleRefs');
  for (const ref of refs) if (!(known.has(ref) || allowMock && String(ref).startsWith('mock.'))) throw new Error(`未知因果 ruleRef：${ref}`);
  const next = clone(state); const entries = [];
  for (const operation of changes) {
    if (!operation || typeof operation !== 'object' || !operation.type) throw new Error('因果操作无效');
    ensureOperationScope(operation, targetScope);
    const base = { ...clone(operation), scope: clone(targetScope), updatedAt: now(), roundId: roundId ?? state.clock.roundId };
    if (operation.type === 'anchor.add' || operation.type === 'anchor.upsert') { const existing = findById(next.anchors, operation.id); if (existing) Object.assign(existing, base); else next.anchors.push({ ...base, id: operation.id || `anchor-${actionId}-${next.anchors.length}` }); }
    else if (operation.type === 'anchor.remove') next.anchors = next.anchors.filter((item) => item.id !== operation.id);
    else if (operation.type === 'relation.upsert') { const existing = findById(next.relations, operation.id); if (existing) Object.assign(existing, base); else next.relations.push({ ...base, id: operation.id || `relation-${actionId}-${next.relations.length}` }); }
    else if (operation.type === 'relation.remove') next.relations = next.relations.filter((item) => item.id !== operation.id);
    else if (operation.type === 'debt.open' || operation.type === 'debt.update') { const existing = findById(next.debts, operation.id); const value = { ...base, id: operation.id || `debt-${actionId}-${next.debts.length}`, status: operation.status || existing?.status || 'open', ...durationFields(operation.duration, state.clock) }; if (existing) Object.assign(existing, value); else next.debts.push(value); }
    else if (operation.type === 'debt.settle') { const existing = findById(next.debts, operation.id); if (!existing) throw new Error('要结清的因果债务不存在'); Object.assign(existing, base, { status: 'settled', settledAtStoryHours: state.clock.totalStoryHours }); }
    else if (operation.type === 'cooldown.set') { const key = operation.key || operation.id; if (!key) throw new Error('冷却缺少 key'); next.cooldowns[key] = { ...base, key, status: 'active', ...durationFields(operation.duration || operation.durationKey, state.clock), remainingRounds: Number.isInteger(operation.remainingRounds) ? operation.remainingRounds : undefined }; }
    else if (operation.type === 'cooldown.clear') delete next.cooldowns[operation.key || operation.id];
    else if (operation.type === 'ledger.append') next.ledger.push({ ...base, entryId: operation.entryId || `ledger-${actionId}-${next.ledger.length}`, actionId });
    else throw new Error(`未知因果操作：${operation.type}`);
    const entry = { entryId: `ledger-${actionId}-${entries.length}`, actionId, roundId: roundId ?? null, scope: clone(targetScope), type: operation.type, targetId: operation.id || operation.key || null, ruleRefs: clone(operation.ruleRefs || ruleRefs), createdAt: now(), summary: operation.summary || operation.type };
    next.ledger.push(entry); entries.push(entry);
  }
  next.clock.roundId = roundId ?? next.clock.roundId;
  next.appliedActions.push({ actionId, roundId: roundId ?? null, hash, entryIds: entries.map((e) => e.entryId), scope: clone(targetScope), createdAt: now() });
  validateCausalState(next); return { state: next, deduplicated: false, entries };
}

export const applyCausalStateChanges = applyCausalChanges;

function advanceCollection(items, elapsed, kind, state, scope, entries) {
  return items.map((item) => {
    if (!item?.duration?.storyHours || ['settled', 'expired', 'dead'].includes(item.status)) return item;
    const remaining = Math.max(0, Number(item.expiresAtStoryHours) - state.clock.totalStoryHours - elapsed);
    if (remaining > 0) return { ...item, remainingStoryHours: remaining };
    const death = item.duration.key === 'death22h' || item.expiryEffect === 'death' || item.onExpire === 'death';
    const status = death ? 'dead' : 'expired';
    const updated = { ...item, status, expired: true, remainingStoryHours: 0, ...(death ? { consequence: 'death' } : {}) };
    entries.push({ entryId: `expire-${kind}-${item.id}-${state.clock.totalStoryHours + elapsed}`, actionId: 'causal.expire', roundId: state.clock.roundId, scope: clone(scope), type: 'causal.expire', targetId: item.id, createdAt: now(), summary: `${kind}:${status}` });
    return updated;
  });
}

export function advanceCausalState(input, { roundId, scope, elapsedStoryHours = 0, storyTime, advanceId } = {}) {
  const state = restoreCausalState(input, scope || input?.scope); const targetScope = scope || state.scope;
  if (!sameScope(targetScope, state.scope)) throw new Error('因果推进作用域不一致');
  const elapsed = Number(elapsedStoryHours || 0); if (!Number.isFinite(elapsed) || elapsed < 0) throw new Error('因果推进时间无效');
  if (storyTime?.totalStoryHours != null && Number(storyTime.totalStoryHours) < state.clock.totalStoryHours) throw new Error('故事时钟不可倒退');
  const receiptKey = `clock:${advanceId || `${roundId || ''}:${state.clock.totalStoryHours}:${elapsed}`}`;
  if (state.appliedActions.some((item) => item.actionId === receiptKey)) return { state, deduplicated: true, entries: [] };
  const entries = []; const next = clone(state); const old = next.clock.totalStoryHours; next.clock = { ...next.clock, roundId: roundId ?? next.clock.roundId, totalStoryHours: storyTime?.totalStoryHours != null ? Number(storyTime.totalStoryHours) : old + elapsed, storyTime: storyTime?.storyTime ?? storyTime ?? next.clock.storyTime };
  next.debts = advanceCollection(next.debts, next.clock.totalStoryHours - old, 'debt', state, targetScope, entries);
  next.relations = advanceCollection(next.relations, next.clock.totalStoryHours - old, 'relation', state, targetScope, entries);
  for (const [key, item] of Object.entries(next.cooldowns)) {
    if (item?.duration?.storyHours && !['expired', 'ready'].includes(item.status)) {
      const remaining = Math.max(0, Number(item.expiresAtStoryHours) - next.clock.totalStoryHours);
      next.cooldowns[key] = remaining > 0 ? { ...item, remainingStoryHours: remaining, status: 'active' } : { ...item, remainingStoryHours: 0, status: 'ready', expired: true };
    } else if (Number.isInteger(item?.remainingRounds)) next.cooldowns[key] = item.remainingRounds > 1 ? { ...item, remainingRounds: item.remainingRounds - 1 } : { ...item, remainingRounds: 0, status: 'ready' };
  }
  next.ledger.push(...entries); next.appliedActions.push({ actionId: receiptKey, hash: stableStringify({ receiptKey, totalStoryHours: next.clock.totalStoryHours }), entryIds: entries.map((e) => e.entryId), scope: clone(targetScope), createdAt: now() });
  validateCausalState(next); return { state: next, deduplicated: false, entries };
}

export function publicCausalState(input) {
  const state = restoreCausalState(input, input.scope); return { schema: state.schema, version: state.version, scope: clone(state.scope), clock: clone(state.clock), anchors: state.anchors.map(({ hidden, secret, ...item }) => item), relations: state.relations.map(({ hidden, secret, ...item }) => item), debts: state.debts.map(({ hidden, secret, ...item }) => item), cooldowns: clone(state.cooldowns) };
}

export function causalActionReceipt(state, actionId) { return state.appliedActions.find((item) => item.actionId === actionId) || null; }
