import { clone } from './common.js';

/**
 * Character preparation is deliberately a read-only, pre-battle boundary.
 *
 * The module never writes MVU, a database, or battle state.  Source records are
 * merged per leaf field so a live MVU value can replace only the field that it
 * owns while the rest of a database profile remains available for review.
 */
export const CHARACTER_PREPARATION_SCHEMA = 'battle_character_preparation_v1';

export const CHARACTER_SOURCE_PRIORITY = Object.freeze({
  ai_extracted: 0,
  ai_inferred: 0,
  context_explicit: 1,
  database: 2,
  mvu_dynamic: 3,
  user_confirmed: 4
});

const PRIVATE_KEYS = new Set(['apiKey', 'api_key', 'authorization', 'token', 'password', 'secret']);
const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor']);
const CANDIDATE_BUCKETS = [
  ['enemies', 'context_explicit'],
  ['opponents', 'context_explicit'],
  ['hostiles', 'context_explicit'],
  ['actors.enemies', 'context_explicit'],
  ['battle.enemies', 'context_explicit'],
  ['combat.enemies', 'context_explicit'],
  ['scene.enemies', 'context_explicit'],
  ['characters', 'context_explicit'],
  ['actors.characters', 'context_explicit']
];

const SOURCE_METHODS = {
  mvu_dynamic: ['getEnemy', 'getCharacter', 'lookup', 'query', 'read'],
  database: ['getEnemyProfile', 'getCharacter', 'findById', 'lookup', 'query', 'read', 'get']
};

function isObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function text(value) {
  return typeof value === 'string' ? value.trim() : value == null ? '' : String(value).trim();
}

function pathValue(value, path) {
  return path.split('.').reduce((current, key) => current == null ? undefined : current[key], value);
}

function slug(value, fallback = 'enemy') {
  const result = text(value).toLowerCase().replace(/[^\w\u4e00-\u9fff-]+/g, '-').replace(/^-+|-+$/g, '');
  return result || fallback;
}

/** Recursively remove credentials before a source result is retained in a draft. */
export function redactCharacterSource(value) {
  if (Array.isArray(value)) return value.map(redactCharacterSource);
  if (!isObject(value)) return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !PRIVATE_KEYS.has(key) && !FORBIDDEN_KEYS.has(key))
    .map(([key, item]) => [key, redactCharacterSource(item)]));
}

function sourcePriority(source) {
  return CHARACTER_SOURCE_PRIORITY[source] ?? 0;
}

function normalizeSource(source) {
  if (!source) return 'context_explicit';
  const value = String(source);
  if (value === 'mvu' || value === 'mvu_dynamic_value') return 'mvu_dynamic';
  if (value === 'db' || value === 'database_profile') return 'database';
  if (value === 'context' || value === 'explicit') return 'context_explicit';
  if (value === 'ai' || value === 'inference' || value === 'ai_inference') return 'ai_inferred';
  if (value === 'ai_extract' || value === 'ai_extracted') return 'ai_extracted';
  if (value === 'user' || value === 'confirmed') return 'user_confirmed';
  return value;
}

function isEnemySide(value) {
  return ['enemy', 'opponent', 'hostile', 'foe', '敌方', '对手'].includes(text(value).toLowerCase());
}

function normalizeRawCandidate(raw, index, source = 'context_explicit') {
  if (typeof raw === 'string') {
    const name = text(raw);
    if (!name) return null;
    return { id: `enemy-${slug(name, index + 1)}`, name, fields: { id: `enemy-${slug(name, index + 1)}`, name }, source: normalizeSource(source) };
  }
  if (!isObject(raw)) return null;
  const name = text(raw.name || raw.characterName || raw.displayName || raw.title || raw.label);
  const suppliedId = text(raw.id || raw.characterId || raw.uid || raw.uuid);
  if (!name && !suppliedId) return null;
  const id = suppliedId || `enemy-${slug(name, index + 1)}`;
  const fields = redactCharacterSource({ ...raw, id, ...(name ? { name } : {}) });
  return { id, name: name || id, fields, source: normalizeSource(source) };
}

function asCandidateItems(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return [value];
  if (!isObject(value)) return [];
  // A map keyed by character id/name is a common MVU/DB shape.
  return Object.entries(value).map(([key, item]) => isObject(item) ? ({ id: item.id || key, ...item }) : ({ id: key, name: item }));
}

function dedupeCandidate(items) {
  const byKey = new Map();
  for (const item of items) {
    const key = text(item.id || item.name).toLowerCase();
    if (!key) continue;
    const prior = byKey.get(key);
    if (!prior) byKey.set(key, item);
    else byKey.set(key, { ...prior, fields: { ...prior.fields, ...item.fields }, source: prior.source || item.source });
  }
  return [...byKey.values()];
}

/**
 * Extract candidate enemy records from explicit context containers.
 * This function does not infer a character and does not inspect hidden battle
 * state unless the caller explicitly supplied it in one of these containers.
 */
export function extractEnemyCandidates(context = {}, { maxCandidates = 32 } = {}) {
  const candidates = [];
  const add = (value, source) => {
    for (const raw of asCandidateItems(value)) {
      const item = normalizeRawCandidate(raw, candidates.length, source);
      if (!item) continue;
      // `characters` is a mixed bucket; only retain explicitly hostile entries.
      if ((source === 'context_explicit' && (pathValue(context, 'characters') === value || pathValue(context, 'actors.characters') === value)) && !isEnemySide(raw?.side || raw?.faction || raw?.role || raw?.alignment || raw?.team)) continue;
      candidates.push(item);
      if (candidates.length >= maxCandidates) return;
    }
  };
  for (const [path, source] of CANDIDATE_BUCKETS) {
    if (candidates.length >= maxCandidates) break;
    add(pathValue(context, path), source);
  }
  // A singular enemy/opponent object is also accepted by host integrations.
  if (candidates.length < maxCandidates) add(context.enemy || context.opponent || context.hostile, 'context_explicit');
  return dedupeCandidate(candidates).slice(0, maxCandidates);
}

function sourceRecord(candidate, source, value) {
  if (value == null) return null;
  const data = isObject(value) ? redactCharacterSource(value) : { value: redactCharacterSource(value) };
  return { source: normalizeSource(source), priority: sourcePriority(normalizeSource(source)), data };
}

function leaves(value, prefix = '') {
  if (Array.isArray(value)) {
    if (!value.length) return prefix ? [[prefix, []]] : [];
    return value.flatMap((item, index) => leaves(item, `${prefix}.${index}`));
  }
  if (!isObject(value)) return prefix ? [[prefix, value]] : [];
  const result = [];
  for (const [key, item] of Object.entries(value)) {
    if (PRIVATE_KEYS.has(key) || FORBIDDEN_KEYS.has(key) || key === 'provenance' || key === 'sources' || key === 'confirmation') continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (isObject(item)) result.push(...leaves(item, path));
    else result.push([path, item]);
  }
  return result;
}

function setPath(target, path, value) {
  const keys = path.split('.');
  let cursor = target;
  keys.forEach((key, index) => {
    if (!key || key === '__proto__' || key === 'constructor' || key === 'prototype') throw new Error('人物资料字段路径非法');
    if (index === keys.length - 1) cursor[key] = clone(value);
    else {
      const nextIsIndex = /^\d+$/.test(keys[index + 1]);
      if (!isObject(cursor[key]) && !Array.isArray(cursor[key])) cursor[key] = nextIsIndex ? [] : {};
      cursor = cursor[key];
    }
  });
}

function getSourceValues(candidate, { mvu, database, inference, aiExtracted } = {}) {
  return [
    sourceRecord(candidate, 'ai_extracted', aiExtracted),
    sourceRecord(candidate, 'ai_inferred', inference),
    sourceRecord(candidate, candidate.source || 'context_explicit', candidate.fields || candidate),
    sourceRecord(candidate, 'database', database),
    sourceRecord(candidate, 'mvu_dynamic', mvu)
  ].filter(Boolean);
}

/** Merge one candidate by leaf field and retain provenance/conflict information. */
export function mergeCharacterCandidate(candidate, sources = {}) {
  const records = getSourceValues(candidate, sources).sort((a, b) => a.priority - b.priority);
  const fields = {};
  const provenance = {};
  const conflicts = [];
  for (const record of records) {
    for (const [path, value] of leaves(record.data)) {
      const previous = provenance[path];
      const current = pathValue(fields, path);
      if (previous && JSON.stringify(current) !== JSON.stringify(value)) conflicts.push({ path, kept: record.source, ignored: previous.source, keptValue: clone(value), ignoredValue: clone(current) });
      if (!previous || record.priority >= previous.priority) {
        setPath(fields, path, value);
        provenance[path] = { source: record.source, priority: record.priority };
      }
    }
  }
  const id = text(fields.id || candidate.id) || `enemy-${slug(fields.name || candidate.name)}`;
  const name = text(fields.name || candidate.name || id);
  fields.id = id;
  fields.name = name;
  provenance.id ||= { source: candidate.source || 'context_explicit', priority: sourcePriority(candidate.source || 'context_explicit') };
  provenance.name ||= provenance.id;
  return {
    id,
    name,
    fields: redactCharacterSource(fields),
    sources: Object.fromEntries(records.map((item) => [item.source, clone(item.data)])),
    provenance,
    conflicts,
    confirmation: { status: 'pending', required: true }
  };
}

async function callAdapter(adapter, candidate, context, source) {
  if (!adapter) return null;
  const query = { candidate: clone(candidate), id: candidate.id, name: candidate.name, context: clone(context), source };
  if (typeof adapter === 'function') return adapter(query);
  if (source === 'mvu_dynamic' && typeof adapter.getMvuData === 'function') {
    const scope = context.scope || context;
    const raw = await adapter.getMvuData({ type: 'message', message_id: scope.messageId ?? context.messageId });
    return pickCharacterFromSource(raw, candidate);
  }
  const methods = SOURCE_METHODS[source] || ['resolve', 'lookup', 'query', 'read', 'get'];
  for (const method of methods) if (typeof adapter[method] === 'function') {
    const value = await adapter[method](query);
    if (value != null) return pickCharacterFromSource(value, candidate);
  }
  return null;
}

async function readSource(adapter, candidate, context, source) {
  if (!adapter) return { value: null, status: 'missing', error: null };
  try {
    const raw = await callAdapter(adapter, candidate, context, source);
    if (raw && typeof raw === 'object' && typeof raw.status === 'string' && ('data' in raw || 'reason' in raw || 'error' in raw)) {
      return { value: raw.data ?? null, status: raw.status, error: raw.error || raw.reason || null, metadata: Object.fromEntries(Object.entries(raw).filter(([key]) => !['status', 'data', 'error', 'reason'].includes(key))) };
    }
    return { value: raw, status: raw == null ? 'missing' : 'matched', error: null, metadata: {} };
  } catch (error) {
    return { value: null, status: 'read_failed', error: String(error?.message || error), metadata: {} };
  }
}

function pickCharacterFromSource(value, candidate) {
  if (value == null) return null;
  if (Array.isArray(value)) {
    const match = value.find((item) => text(item?.id || item?.characterId || item?.uid) === candidate.id || text(item?.name || item?.characterName) === candidate.name);
    return match || null;
  }
  if (!isObject(value)) return value;
  for (const bucket of ['enemies', 'opponents', 'characters', 'actors', 'profiles', 'data']) {
    const nested = value[bucket];
    if (Array.isArray(nested)) {
      const match = nested.find((item) => text(item?.id || item?.characterId || item?.uid) === candidate.id || text(item?.name || item?.characterName) === candidate.name);
      if (match) return match;
    } else if (isObject(nested) && (nested[candidate.id] || nested[candidate.name])) return nested[candidate.id] || nested[candidate.name];
  }
  if (value[candidate.id] || value[candidate.name]) return value[candidate.id] || value[candidate.name];
  return text(value.id || value.characterId || value.uid) === candidate.id || text(value.name || value.characterName) === candidate.name ? value : null;
}

async function inferCandidates(inference, context) {
  if (!inference) return [];
  const result = typeof inference === 'function' ? await inference(clone(context))
    : typeof inference.extract === 'function' ? await inference.extract(clone(context))
    : typeof inference.inferCandidates === 'function' ? await inference.inferCandidates(clone(context))
      : typeof inference.infer === 'function' ? await inference.infer(clone(context)) : inference;
  const payload = result?.data ?? result;
  return Array.isArray(payload) ? payload : payload?.enemies || payload?.candidates || [];
}

function aiCandidateSources(item = {}) {
  const explicit = item.explicitFacts || item.explicit || item.facts || item.contextFacts || (item.inferred === true ? {} : item.fields) || {};
  const inferred = (item.inferred === true ? item.fields : item.inferred) || item.inference || item.guess || item.predicted || {};
  return { explicit: isObject(explicit) ? redactCharacterSource(explicit) : {}, inferred: isObject(inferred) ? redactCharacterSource(inferred) : {} };
}

function matchingCandidate(candidates, item, index) {
  const split = aiCandidateSources(item);
  const normalized = normalizeRawCandidate({ id: item?.id || item?.characterId, name: item?.name || item?.characterName || split.explicit.name }, index, 'ai_extracted');
  if (normalized) { normalized.aiExtracted = split.explicit; normalized.aiInferred = split.inferred; }
  if (!normalized) return null;
  return candidates.find((candidate) => candidate.id === normalized.id || candidate.name === normalized.name) || normalized;
}

/**
 * Read all sources and create an editable draft.  No result is written to the
 * supplied state, MVU, database, or host.  The draft is intentionally marked
 * `pending`, making accidental use by an adjudicator fail closed.
 */
export async function prepareEnemyCandidates(context = {}, { mvu, database, inference, ai, maxCandidates = 32, signal } = {}) {
  if (signal?.aborted) throw new DOMException('人物准备已取消', 'AbortError');
  const explicit = extractEnemyCandidates(context, { maxCandidates });
  const aiSource = ai || inference;
  const inferredRaw = await inferCandidates(aiSource, context);
  const all = [...explicit];
  inferredRaw.forEach((item, index) => { const match = matchingCandidate(all, item, index); if (match && !all.includes(match)) all.push(match); });
  const candidates = [];
  for (const candidate of all.slice(0, maxCandidates)) {
    if (signal?.aborted) throw new DOMException('人物准备已取消', 'AbortError');
    const inferred = inferredRaw.find((item) => text(item?.id || item?.name || item?.characterName) === candidate.id || text(item?.name || item?.characterName) === candidate.name);
    const aiParts = inferred ? aiCandidateSources(inferred) : { explicit: {}, inferred: {} };
    const [mvuResult, databaseResult] = await Promise.all([
      readSource(mvu, candidate, context, 'mvu_dynamic'),
      readSource(database, candidate, context, 'database')
    ]);
    let merged = mergeCharacterCandidate(candidate, { mvu: mvuResult.value, database: databaseResult.value, inference: aiParts.inferred, aiExtracted: aiParts.explicit });
    let fillStatus = { status: aiSource ? 'not_requested' : 'not_configured' };
    const fillFn = aiSource && (typeof aiSource.fill === 'function' ? aiSource.fill.bind(aiSource) : typeof aiSource.fillMissingFields === 'function' ? aiSource.fillMissingFields.bind(aiSource) : null);
    if (fillFn) {
      const missingFields = ['realm', '境界', 'visibleInfo', 'resources', 'techniques', 'abilities', 'skills'].filter((key) => merged.fields?.[key] == null);
      try {
        const fill = await fillFn({ candidate: clone(merged.fields), knownFields: clone(merged.fields), missingFields, context: clone(context), signal }, { context: clone(context), signal });
        const fillData = fill?.data ?? fill;
        if (fillData && typeof fillData === 'object' && fill?.status !== 'read_failed') {
          const patch = fillData.fields || fillData.inferred || fillData;
          merged = mergeCharacterCandidate(merged, { mvu: mvuResult.value, database: databaseResult.value, inference: patch, aiExtracted: aiParts.explicit });
        }
        fillStatus = fill?.status ? { status: fill.status, ...(fill.error || fill.reason ? { error: fill.error || fill.reason } : {}) } : { status: fillData ? 'matched' : 'missing' };
      } catch (error) {
        // A slow optional fill must not discard already extracted, reviewable facts.
        fillStatus = { status: 'read_failed', error: String(error?.message || error) };
      }
    }
    merged.sourceStatus = { mvu_dynamic: { status: mvuResult.status, ...(mvuResult.error ? { error: mvuResult.error } : {}), ...(mvuResult.metadata || {}) }, database: { status: databaseResult.status, ...(databaseResult.error ? { error: databaseResult.error } : {}), ...(databaseResult.metadata || {}) }, ai_extract: inferred ? { status: 'matched' } : { status: aiSource ? 'missing' : 'not_configured' }, ai_fill: fillStatus };
    candidates.push(merged);
  }
  return {
    schema: CHARACTER_PREPARATION_SCHEMA,
    version: 1,
    status: 'awaiting_confirmation',
    createdAt: new Date().toISOString(),
    scope: clone(context.scope || null),
    candidates,
    confirmedAt: null
  };
}

function normalizeEdits(edits) {
  if (!edits) return {};
  if (Array.isArray(edits)) return Object.fromEntries(edits.map((item) => [item.id, item.fields || item.patch || item]));
  return edits;
}

/** Apply user edits and mark the resulting candidate set as confirmed. */
export function confirmEnemyCandidates(preparation, edits = {}, { removeIds = [], requireName = true } = {}) {
  assertPreparation(preparation);
  const patchMap = normalizeEdits(edits);
  const removed = new Set(removeIds.map(String));
  const candidates = preparation.candidates.filter((candidate) => !removed.has(String(candidate.id))).map((candidate) => {
    const patch = patchMap[candidate.id] || {};
    const fields = redactCharacterSource(clone(candidate.fields));
    for (const [path, value] of leaves(patch)) setPath(fields, path, value);
    const id = text(fields.id || candidate.id);
    const name = text(fields.name || candidate.name || id);
    if (!id || requireName && !name) throw new Error(`敌方人物 ${candidate.id} 缺少 id/name`);
    fields.id = id; fields.name = name;
    const provenance = { ...candidate.provenance };
    for (const [path] of leaves(patch)) provenance[path] = { source: 'user_confirmed', priority: sourcePriority('user_confirmed') };
    provenance.id = { source: 'user_confirmed', priority: sourcePriority('user_confirmed') };
    provenance.name = { source: 'user_confirmed', priority: sourcePriority('user_confirmed') };
    return { ...candidate, id, name, fields, provenance, confirmation: { status: 'confirmed', required: true, confirmedAt: new Date().toISOString() } };
  });
  if (!candidates.length) throw new Error('确认后没有可用的敌方人物');
  if (new Set(candidates.map((candidate) => candidate.id)).size !== candidates.length) throw new Error('敌方人物 id 重复');
  const confirmedAt = new Date().toISOString();
  return { ...clone(preparation), status: 'confirmed', confirmedAt, candidates };
}

export function assertPreparation(preparation) {
  if (!preparation || preparation.schema !== CHARACTER_PREPARATION_SCHEMA || !Array.isArray(preparation.candidates)) throw new Error('无效的人物准备草稿');
  return preparation;
}

export function assertConfirmedEnemyPreparation(preparation) {
  assertPreparation(preparation);
  if (preparation.status !== 'confirmed' || !preparation.confirmedAt || preparation.candidates.some((candidate) => candidate.confirmation?.status !== 'confirmed')) throw new Error('敌方人物资料尚未确认，禁止进入裁定器');
  return preparation;
}

/** Return only the confirmed, merged actor records suitable for battle state. */
export function confirmedEnemyActors(preparation) {
  assertConfirmedEnemyPreparation(preparation);
  return preparation.candidates.map((candidate) => clone(candidate.fields));
}

/** Fail-closed projection used by a controller before building an adjudication request. */
export function getAdjudicatorEnemyContext(preparation) {
  return { enemies: confirmedEnemyActors(preparation) };
}

/** Apply a confirmed draft to an idle/ended battle state without writing any host data. */
export function applyConfirmedEnemies(state, preparation) {
  assertConfirmedEnemyPreparation(preparation);
  if (!state || !['idle', 'ended'].includes(state.phase)) throw new Error('只能在战斗开始前写入已确认人物');
  if (preparation.scope) {
    if (String(preparation.scope.chatId) !== String(state.scope?.chatId) || String(preparation.scope.branchId) !== String(state.scope?.branchId)) throw new Error('人物准备作用域与当前聊天/分支不一致');
  }
  const enemies = confirmedEnemyActors(preparation);
  if (enemies.some((enemy) => enemy.id === state.actors?.player?.id)) throw new Error('敌方人物 id 与主角重复');
  return { ...clone(state), actors: { ...clone(state.actors), enemies }, characterPreparation: clone(preparation), version: Number(state.version || 0) + 1, updatedAt: new Date().toISOString() };
}

/** Serializable model for a confirmation panel. */
export function buildCharacterConfirmationPanel(preparation) {
  assertPreparation(preparation);
  return {
    schema: CHARACTER_PREPARATION_SCHEMA,
    status: preparation.status,
    scope: clone(preparation.scope),
    candidates: preparation.candidates.map((candidate) => ({
      id: candidate.id,
      name: candidate.name,
      fields: clone(candidate.fields),
      editableFields: Object.keys(candidate.fields),
      provenance: clone(candidate.provenance),
      conflicts: clone(candidate.conflicts),
      sourceStatus: clone(candidate.sourceStatus || {}),
      confirmation: clone(candidate.confirmation)
    }))
  };
}

// Names kept as aliases so host/UI integrations can adopt the boundary without
// coupling to a particular spelling of “prepare” or “confirm”.
export const buildCharacterPreparation = prepareEnemyCandidates;
export const confirmCharacterPreparation = confirmEnemyCandidates;
export const getConfirmedEnemyActors = confirmedEnemyActors;
