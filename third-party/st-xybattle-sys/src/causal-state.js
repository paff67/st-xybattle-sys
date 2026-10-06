import { clone, stableStringify } from './common.js';

/** Persistent lifecycle for causal-level techniques. */
export const CAUSAL_SCHEMA = 'battle_v2_causal';
export const CAUSAL_VERSION = 1;
export const CAUSAL_SCOPE_KINDS = Object.freeze(['branch', 'actor', 'relation', 'scene', 'global']);
// Story-clock durations. These are deliberately expressed in story time;
// wall-clock time and a fixed number of battle rounds never advance them.
export const CAUSAL_DURATIONS = Object.freeze({
  cooldown15d: Object.freeze({ unit: 'story_days', value: 15, storyHours: 15 * 24 }),
  influenceMonth: Object.freeze({ unit: 'story_months', value: 1, storyHours: 30 * 24 }),
  death22h: Object.freeze({ unit: 'story_hours', value: 22, storyHours: 22 })
});

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const asId = (value, name) => {
  const id = String(value ?? '').trim();
  if (!id) throw new Error(`${name} 不能为空`);
  if (id.length > 256) throw new Error(`${name} 过长`);
  return id;
};
const sameBranch = (a, b) => String(a?.chatId) === String(b?.chatId) && String(a?.branchId) === String(b?.branchId);
const cloneMap = (value) => value && typeof value === 'object' && !Array.isArray(value) ? clone(value) : {};
const normalizeArray = (value) => Array.isArray(value) ? clone(value) : [];
const normalizeClock = (value = {}) => ({
  day: Number.isFinite(value.day) ? Math.max(0, Number(value.day)) : 0,
  hour: Number.isFinite(value.hour) ? Math.max(0, Number(value.hour)) : 0,
  minute: Number.isFinite(value.minute) ? Math.max(0, Number(value.minute)) : 0,
  totalStoryHours: Number.isFinite(value.totalStoryHours) ? Math.max(0, Number(value.totalStoryHours)) : Math.max(0, Number(value.day || 0) * 24 + Number(value.hour || 0) + Number(value.minute || 0) / 60)
});

export function normalizeCausalDuration(duration) {
  if (duration == null) return null;
  if (typeof duration === 'string' && CAUSAL_DURATIONS[duration]) return { ...clone(CAUSAL_DURATIONS[duration]), key: duration };
  if (typeof duration === 'number' && Number.isFinite(duration) && duration >= 0) return { unit: 'story_hours', value: duration, storyHours: duration };
  if (!duration || typeof duration !== 'object') throw new Error('因果期限必须是故事时间对象');
  const unit = String(duration.unit || 'story_hours');
  const value = Number(duration.value ?? duration.hours ?? duration.days ?? duration.months);
  if (!Number.isFinite(value) || value < 0) throw new Error('因果期限数值无效');
  const multiplier = unit === 'story_days' || unit === 'days' ? 24 : unit === 'story_months' || unit === 'months' ? 30 * 24 : 1;
  if (!['story_hours', 'hours', 'story_days', 'days', 'story_months', 'months'].includes(unit)) throw new Error(`未知因果期限单位：${unit}`);
  return { unit: unit.startsWith('story_') ? unit : `story_${unit}`, value, storyHours: value * multiplier };
}

function prepareTimed(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const duration = normalizeCausalDuration(value.duration ?? value.storyDuration);
  if (!duration) return clone(value);
  const result = { ...clone(value), duration, remainingStoryHours: Number.isFinite(value.remainingStoryHours) ? value.remainingStoryHours : duration.storyHours };
  delete result.storyDuration;
  return result;
}

export function normalizeCausalScope(scope = {}) {
  const chatId = asId(scope.chatId ?? 'default-chat', '因果 scope.chatId');
  const branchId = asId(scope.branchId ?? 'main', '因果 scope.branchId');
  const out = { chatId, branchId };
  if (scope.kind !== undefined) {
    if (!CAUSAL_SCOPE_KINDS.includes(scope.kind)) throw new Error(`未知因果作用范围：${scope.kind}`);
    out.kind = scope.kind;
  } else out.kind = 'branch';
  if (scope.id !== undefined && scope.id !== null) out.id = asId(scope.id, '因果 scope.id');
  return out;
}

export function createCausalState({ scope, chatId = 'default-chat', branchId = 'main', anchors = [], relations = [], debts = [], cooldowns = {}, ledger = [], appliedActions = {}, clock, version = CAUSAL_VERSION } = {}) {
  const normalizedScope = normalizeCausalScope(scope || { chatId, branchId });
  return validateCausalState({ schema: CAUSAL_SCHEMA, version: Number.isInteger(version) && version > 0 ? version : CAUSAL_VERSION, scope: normalizedScope, clock: normalizeClock(clock), anchors: normalizeArray(anchors).map(prepareTimed), relations: normalizeArray(relations).map(prepareTimed), debts: normalizeArray(debts).map(prepareTimed), cooldowns: Object.fromEntries(Object.entries(cloneMap(cooldowns)).map(([key, value]) => [key, prepareTimed(value)])), ledger: normalizeArray(ledger), appliedActions: cloneMap(appliedActions), updatedAt: new Date().toISOString() }, { scope: normalizedScope });
}

function validateEntityArray(items, kind, actualScopeForValidation) {
  const ids = new Set();
  for (const item of items) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error(`因果 ${kind} 条目无效`);
    const id = asId(item.id, `因果 ${kind}.id`);
    if (ids.has(id)) throw new Error(`因果 ${kind} id 重复：${id}`);
    ids.add(id);
    if (item.scope !== undefined && actualScopeForValidation && !sameBranch(normalizeCausalScope(item.scope), actualScopeForValidation)) throw new Error(`因果 ${kind} 作用域不匹配`);
  }
}

export function validateCausalState(input, { scope } = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('因果状态不是对象');
  if (input.schema !== CAUSAL_SCHEMA) throw new Error('因果状态 schema 不匹配');
  if (!Number.isInteger(input.version) || input.version < 1) throw new Error('因果状态 version 无效');
  const actualScope = normalizeCausalScope(input.scope);
  if (scope && !sameBranch(actualScope, normalizeCausalScope(scope))) throw new Error('因果状态作用域不匹配');
  for (const key of ['anchors', 'relations', 'debts', 'ledger']) if (!Array.isArray(input[key])) throw new Error(`因果状态 ${key} 必须是数组`);
  if (input.clock !== undefined) normalizeClock(input.clock);
  if (!input.cooldowns || typeof input.cooldowns !== 'object' || Array.isArray(input.cooldowns)) throw new Error('因果状态 cooldowns 必须是对象');
  if (!input.appliedActions || typeof input.appliedActions !== 'object' || Array.isArray(input.appliedActions)) throw new Error('因果状态 appliedActions 必须是对象');
  for (const [key, value] of Object.entries(input.cooldowns)) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`因果 cooldown 无效：${key}`);
    if (value.scope !== undefined && !sameBranch(normalizeCausalScope(value.scope), actualScope)) throw new Error('因果 cooldown 作用域不匹配');
    if (value.remainingStoryHours !== undefined && (!Number.isFinite(value.remainingStoryHours) || value.remainingStoryHours < 0)) throw new Error('因果 cooldown.remainingStoryHours 无效');
    if (value.remainingRounds !== undefined && (!Number.isInteger(value.remainingRounds) || value.remainingRounds < 0)) throw new Error('因果 cooldown.remainingRounds 无效');
  }
  validateEntityArray(input.anchors, 'anchor', actualScope); validateEntityArray(input.relations, 'relation', actualScope); validateEntityArray(input.debts, 'debt', actualScope);
  for (const entry of input.ledger) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) throw new Error('因果 ledger 条目无效');
    asId(entry.entryId, '因果 ledger.entryId'); asId(entry.actionId, '因果 ledger.actionId');
    if (entry.scope && !sameBranch(actualScope, normalizeCausalScope(entry.scope))) throw new Error('因果 ledger 作用域不匹配');
  }
  for (const [actionId, receipt] of Object.entries(input.appliedActions)) {
    asId(actionId, '因果 appliedActions.actionId');
    if (!receipt || typeof receipt !== 'object' || typeof receipt.hash !== 'string' || !Array.isArray(receipt.entryIds)) throw new Error('因果幂等收据无效');
  }
  return clone({ ...input, scope: actualScope, clock: normalizeClock(input.clock) });
}

export function restoreCausalState(raw, { scope, chatId = 'default-chat', branchId = 'main' } = {}) {
  if (raw === undefined || raw === null) return createCausalState({ scope, chatId, branchId });
  const candidate = { schema: raw.schema || CAUSAL_SCHEMA, version: raw.version || CAUSAL_VERSION, scope: raw.scope || scope || { chatId, branchId }, clock: raw.clock, anchors: raw.anchors || [], relations: raw.relations || [], debts: raw.debts || [], cooldowns: raw.cooldowns || {}, ledger: raw.ledger || [], appliedActions: raw.appliedActions || {}, updatedAt: raw.updatedAt || new Date().toISOString() };
  return validateCausalState(candidate, { scope });
}

function scopedChangeScope(change, stateScope) {
  const scope = normalizeCausalScope(change.scope || stateScope);
  if (!sameBranch(scope, stateScope)) throw new Error('因果变更作用域与当前分支不匹配');
  return scope;
}
function findById(items, id) { return items.findIndex((item) => item.id === id); }
function putById(items, item, kind) { const id = asId(item.id, `因果 ${kind}.id`); const index = findById(items, id); const prepared = prepareTimed(item); if (index < 0) return [...items, clone(prepared)]; const next = items.slice(); next[index] = clone(prepared); return next; }
function removeById(items, id) { return items.filter((item) => item.id !== id); }
function normalizeOperation(change, index) { if (!change || typeof change !== 'object' || Array.isArray(change)) throw new Error(`因果变更 ${index + 1} 无效`); const operation = String(change.operation || change.type || '').trim(); if (!operation) throw new Error(`因果变更 ${index + 1} 缺少 operation`); const operationId = String(change.operationId || `${index + 1}`).trim(); if (!operationId) throw new Error(`因果变更 ${index + 1} 缺少 operationId`); return { ...clone(change), operation, operationId }; }
function operationEntry(change, actionId, scope, version) { return { entryId: `${actionId}:${change.operationId}`, actionId, operationId: change.operationId, operation: change.operation, scope: clone(scope), roundId: change.roundId || null, version, data: clone(change), at: new Date().toISOString() }; }

/** Atomically apply causalChanges; retrying an action is a no-op. */
export function applyCausalChanges(input, changes = [], { actionId, roundId = null, scope, version, knownRuleRefs = [], allowMock = false, requireRuleRefs = false, authority = 'adjudicator' } = {}) {
  const state = restoreCausalState(input, { scope: scope || input?.scope }); const id = asId(actionId, '因果 actionId');
  if (!Array.isArray(changes)) throw new Error('causalChanges 必须是数组');
  const normalizedScope = normalizeCausalScope(scope || state.scope); if (!sameBranch(normalizedScope, state.scope)) throw new Error('因果提交作用域不匹配');
  const normalized = changes.map(normalizeOperation).map((change) => ({ ...change, roundId: change.roundId || roundId, scope: scopedChangeScope(change, state.scope) }));
  const hash = stableStringify(normalized); const existing = state.appliedActions[id];
  if (existing) { if (existing.hash !== hash) throw new Error(`因果 actionId 重复但内容不一致：${id}`); return { state, deduplicated: true, entries: state.ledger.filter((entry) => existing.entryIds.includes(entry.entryId)) }; }
  const operationIds = new Set(); let next = clone(state); const entries = [];
  for (const change of normalized) {
    if (operationIds.has(change.operationId)) throw new Error(`因果 operationId 重复：${change.operationId}`); operationIds.add(change.operationId);
    const requestedAuthority = String(change.authority || authority);
    if (!['adjudicator', 'system'].includes(requestedAuthority)) throw new Error('因果变更来源无权限');
    const refs = Array.isArray(change.ruleRefs) ? change.ruleRefs : [];
    if (requireRuleRefs && !allowMock && refs.length === 0) throw new Error('因果变更缺少权威 ruleRefs');
    if (refs.some((ref) => typeof ref !== 'string' || (!knownRuleRefs.includes(ref) && !(allowMock && ref.startsWith('mock.'))))) throw new Error('因果变更引用未知规则');
    const entry = operationEntry(change, id, change.scope, (version ?? state.version) + 1); if (next.ledger.some((item) => item.entryId === entry.entryId)) throw new Error(`因果 ledger entry 已存在：${entry.entryId}`);
    const op = change.operation.toLowerCase(); const payload = change.value || change.entity || change.data || change;
    if (['anchor.upsert','anchor.add','upsertanchor','addanchor'].includes(op)) next.anchors = putById(next.anchors, { ...clone(payload), id: asId(payload.id, '因果 anchor.id'), scope: clone(change.scope) }, 'anchor');
    else if (['anchor.remove','anchor.delete','removeanchor','deleteanchor'].includes(op)) next.anchors = removeById(next.anchors, asId(change.id || payload.id, '因果 anchor.id'));
    else if (['relation.upsert','relation.add','upsertrelation','addrelation'].includes(op)) next.relations = putById(next.relations, { ...clone(payload), id: asId(payload.id, '因果 relation.id'), scope: clone(change.scope) }, 'relation');
    else if (['relation.remove','relation.delete','removerelation','deleterelation'].includes(op)) next.relations = removeById(next.relations, asId(change.id || payload.id, '因果 relation.id'));
    else if (['debt.open','debt.upsert','debt.add','opendebt','upsertdebt'].includes(op)) next.debts = putById(next.debts, { status: 'open', ...clone(payload), id: asId(payload.id, '因果 debt.id'), scope: clone(change.scope) }, 'debt');
    else if (['debt.update','debt.settle','updatedebt','settledebt'].includes(op)) { const debtId = asId(change.id || payload.id, '因果 debt.id'); const index = findById(next.debts, debtId); if (index < 0) throw new Error(`因果 debt 不存在：${debtId}`); const current = next.debts[index]; next.debts = putById(next.debts, { ...current, ...clone(payload), id: debtId, status: op.includes('settle') || payload.status === 'settled' ? 'settled' : (payload.status || current.status), scope: clone(change.scope) }, 'debt'); }
    else if (['cooldown.set','cooldown.upsert','setcooldown','upsertcooldown'].includes(op)) { const key = asId(change.key || payload.key || payload.id, '因果 cooldown.key'); const value = { ...clone(payload), key, scope: clone(change.scope) }; if (value.remainingRounds !== undefined && (!Number.isInteger(value.remainingRounds) || value.remainingRounds < 1)) throw new Error('因果 cooldown.remainingRounds 无效'); next.cooldowns[key] = value; }
    else if (['cooldown.clear','clearcooldown'].includes(op)) delete next.cooldowns[asId(change.key || payload.key || payload.id, '因果 cooldown.key')];
    else if (['ledger.append','ledger','appendledger'].includes(op)) { /* canonical entry is appended below */ }
    else throw new Error(`未知因果 operation：${change.operation}`);
    entries.push(entry); next.ledger.push(entry);
  }
  const nextVersion = Math.max(Number.isInteger(version) ? version : 0, state.version) + 1; next.version = nextVersion; next.appliedActions[id] = { hash, entryIds: entries.map((entry) => entry.entryId), version: nextVersion }; next.updatedAt = new Date().toISOString();
  return { state: validateCausalState(next, { scope: state.scope }), deduplicated: false, entries: clone(entries) };
}

export function advanceCausalState(input, { roundId = null, scope, elapsedStoryHours = 0, storyTime, advanceId } = {}) {
  const state = restoreCausalState(input, { scope: scope || input?.scope });
  const receiptKey = advanceId || roundId ? `clock:${advanceId || roundId}` : null;
  if (receiptKey && state.appliedActions[receiptKey]) return state;
  const clock = storyTime ? normalizeClock(storyTime) : { ...state.clock, totalStoryHours: state.clock.totalStoryHours + (Number.isFinite(elapsedStoryHours) && elapsedStoryHours > 0 ? elapsedStoryHours : 0) };
  if (clock.totalStoryHours < state.clock.totalStoryHours) throw new Error('故事时间不能倒退');
  const elapsed = clock.totalStoryHours - state.clock.totalStoryHours;
  const cooldowns = {};
  const expiryEntries = [];
  for (const [key, value] of Object.entries(state.cooldowns)) {
    if (!value) continue;
    if (elapsed > 0 && !value.expired && Number.isFinite(value.remainingStoryHours)) {
      const remaining = value.remainingStoryHours - elapsed;
      if (remaining > 0) cooldowns[key] = { ...value, remainingStoryHours: remaining, lastAdvancedRoundId: roundId || value.lastAdvancedRoundId || null };
      else cooldowns[key] = { ...value, remainingStoryHours: 0, status: 'ready', expired: true, expiredAtStoryHours: clock.totalStoryHours };
    } else if (Number.isInteger(value.remainingRounds)) {
      if (value.remainingRounds > 1) cooldowns[key] = { ...value, remainingRounds: value.remainingRounds - 1, lastAdvancedRoundId: roundId || value.lastAdvancedRoundId || null };
    } else cooldowns[key] = value;
  }
  const advanceItems = (items, kind) => items.map((value) => {
    if (!elapsed || value?.expired || !Number.isFinite(value?.remainingStoryHours)) return [value];
    const remaining = value.remainingStoryHours - elapsed;
    if (remaining > 0) return [{ ...value, remainingStoryHours: remaining, lastAdvancedRoundId: roundId || value.lastAdvancedRoundId || null }];
    const death = value.duration?.key === 'death22h' || value.onExpire === 'death' || value.expiryEffect === 'death';
    const status = death ? 'dead' : 'expired';
    expiryEntries.push({ entryId: `${receiptKey || 'clock'}:${kind}:${value.id}`, actionId: receiptKey || 'story-clock', operationId: `expire:${kind}:${value.id}`, operation: 'causal.expire', scope: clone(state.scope), version: state.version + 1, data: { kind, id: value.id, status, consequence: death ? 'death' : 'expiry' }, at: new Date().toISOString() });
    return [{ ...value, remainingStoryHours: 0, status, expired: true, expiredAtStoryHours: clock.totalStoryHours, ...(death ? { consequence: { type: 'death', committed: true } } : {}) }];
  });
  const nextVersion = state.version + 1;
  const next = { ...state, version: nextVersion, clock, cooldowns, anchors: advanceItems(state.anchors, 'anchor').flat(), relations: advanceItems(state.relations, 'relation').flat(), debts: advanceItems(state.debts, 'debt').flat(), ledger: [...state.ledger, ...expiryEntries], updatedAt: new Date().toISOString() };
  if (receiptKey) next.appliedActions[receiptKey] = { hash: stableStringify({ elapsedStoryHours: elapsed, storyTime: clock }), entryIds: expiryEntries.map((entry) => entry.entryId), version: nextVersion };
  return validateCausalState(next, { scope: state.scope });
}

/** Safe player/story projection: no private ledger payloads or hidden source data. */
export function publicCausalState(input) {
  const state = restoreCausalState(input, { scope: input?.scope });
  const visible = (item) => !['hidden', 'private', 'gm', 'internal'].includes(item.visibility);
  const project = (item) => ({ id: item.id, status: item.status, label: item.label, type: item.type, remainingStoryHours: item.remainingStoryHours, expired: item.expired, ...(item.consequence?.committed && item.consequence?.type ? { consequence: { type: item.consequence.type, committed: true } } : {}) });
  return { schema: state.schema, version: state.version, scope: clone(state.scope), clock: clone(state.clock), anchors: state.anchors.filter(visible).map(project), relations: state.relations.filter(visible).map(project), debts: state.debts.filter(visible).map(project), cooldowns: Object.fromEntries(Object.entries(state.cooldowns).filter(([, value]) => visible(value)).map(([key, value]) => [key, project({ ...value, id: key })])) };
}

export function causalActionReceipt(state, actionId) { const id = String(actionId || ''); return id && state?.appliedActions ? clone(state.appliedActions[id]) : undefined; }
export const applyCausalStateChanges = applyCausalChanges;
export const validateCausal = validateCausalState;

