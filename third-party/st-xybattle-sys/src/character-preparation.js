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
  ai_inferred: 0,
  ai_extracted: 0,
  ai_completed: 0,
  context_explicit: 0,
  database: 0,
  mvu_dynamic: 0,
  user_confirmed: 0
});

const PRIVATE_KEYS = new Set(['apiKey', 'api_key', 'authorization', 'token', 'password', 'secret']);
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
    .filter(([key]) => !PRIVATE_KEYS.has(key))
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
  const id = text(raw.id || raw.characterId || raw.uid || raw.uuid) || `enemy-${slug(name, index + 1)}`;
  if (!name && !id) return null;
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
  const payload = sourcePayload(value, source);
  const data = isObject(payload) ? redactCharacterSource(payload) : { value: redactCharacterSource(payload) };
  return { source: normalizeSource(source), priority: sourcePriority(normalizeSource(source)), data };
}

function sourcePayload(value, source) {
  if (!isObject(value)) return value;
  if (source === 'ai_extracted') return value.explicitFacts || value.explicit || value.facts || value;
  if (source === 'ai_inferred') return value.inferred && typeof value.inferred === 'object' ? value.inferred : value.inference || value.guess || value.predicted || (value.inferred === true ? value.fields : value);
  if (source === 'ai_completed') return value.candidate || value.fields || value.profile || value;
  return value;
}

function leaves(value, prefix = '') {
  if (!isObject(value)) return prefix ? [[prefix, value]] : [];
  const result = [];
  for (const [key, item] of Object.entries(value)) {
    if (PRIVATE_KEYS.has(key) || key === 'provenance' || key === 'sources' || key === 'confirmation') continue;
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
    if (index === keys.length - 1) cursor[key] = clone(value);
    else { if (!isObject(cursor[key])) cursor[key] = {}; cursor = cursor[key]; }
  });
}

function getSourceValues(candidate, { mvu, database, inference, aiExtracted, aiCompleted } = {}) {
  return [
    sourceRecord(candidate, 'context_explicit', candidate.fields || candidate),
    sourceRecord(candidate, 'ai_extracted', aiExtracted),
    sourceRecord(candidate, 'ai_inferred', inference),
    sourceRecord(candidate, 'database', database),
    sourceRecord(candidate, 'mvu_dynamic', mvu),
    sourceRecord(candidate, 'ai_completed', aiCompleted)
      
  ].filter(Boolean);
}

/** Merge one candidate by leaf field and retain provenance/conflict information. */
export function mergeCharacterCandidate(candidate, sources = {}) {
  // Every source is a proposal. The resulting fields are an editable draft;
  // no source is authoritative until the user confirms the complete record.
  const records = getSourceValues(candidate, sources);
  const fields = {};
  const provenance = {};
  const conflicts = [];
  for (const record of records) {
    for (const [path, value] of leaves(record.data)) {
      const previous = provenance[path];
      if (previous && JSON.stringify(fields[path]) !== JSON.stringify(value)) conflicts.push({ path, previous: previous.source, incoming: record.source, previousValue: clone(fields[path]), incomingValue: clone(value) });
      setPath(fields, path, value);
      provenance[path] = { source: record.source, priority: 0 };
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

function pickCharacterFromSource(value, candidate) {
  if (value == null) return null;
  if (Array.isArray(value)) {
    const match = value.find((item) => text(item?.id || item?.characterId || item?.uid) === candidate.id || text(item?.name || item?.characterName) === candidate.name);
    if (match) return match;
    if (value.length > 1) throw new Error(`人物 ${candidate.id} 的来源结果存在歧义`);
    return null;
  }
  if (!isObject(value)) return null;
  const matches = [];
  for (const bucket of ['enemies', 'opponents', 'characters', 'actors', 'profiles', 'data']) {
    const nested = value[bucket];
    if (Array.isArray(nested)) {
      const match = nested.find((item) => text(item?.id || item?.characterId || item?.uid) === candidate.id || text(item?.name || item?.characterName) === candidate.name);
      if (match) matches.push(match);
    } else if (isObject(nested) && (nested[candidate.id] || nested[candidate.name])) matches.push(nested[candidate.id] || nested[candidate.name]);
  }
  if (value[candidate.id] || value[candidate.name]) matches.push(value[candidate.id] || value[candidate.name]);
  const unique = [...new Set(matches)];
  if (unique.length > 1) throw new Error(`人物 ${candidate.id} 的来源结果存在歧义`);
  return unique[0] || null;
}

async function inferCandidates(inference, context) {
  if (!inference) return [];
  const result = typeof inference === 'function' ? await inference(clone(context))
    : typeof inference.inferCandidates === 'function' ? await inference.inferCandidates(clone(context))
      : typeof inference.infer === 'function' ? await inference.infer(clone(context)) : inference;
  return Array.isArray(result) ? result : result?.enemies || result?.candidates || [];
}

async function completeCandidate(inference, candidate, context, signal) {
  if (!inference) return null;
  const query = { candidate: clone(candidate), knownFields: clone(candidate.fields), missingFields: [], context: clone(context), signal };
  if (typeof inference.completeCandidate === 'function') return inference.completeCandidate(query);
  if (typeof inference.fillMissingFields === 'function') return inference.fillMissingFields(query);
  return null;
}

function matchingCandidate(candidates, item, index) {
  const normalized = normalizeRawCandidate(item, index, 'ai_inferred');
  if (!normalized) return null;
  return candidates.find((candidate) => candidate.id === normalized.id || candidate.name === normalized.name) || normalized;
}

/**
 * Read all sources and create an editable draft.  No result is written to the
 * supplied state, MVU, database, or host.  The draft is intentionally marked
 * `pending`, making accidental use by an adjudicator fail closed.
 */
export async function prepareEnemyCandidates(context = {}, { mvu, database, inference, maxCandidates = 32, signal } = {}) {
  if (signal?.aborted) throw new DOMException('人物准备已取消', 'AbortError');
  const explicit = extractEnemyCandidates(context, { maxCandidates });
  const inferredRaw = await inferCandidates(inference, context);
  const all = [...explicit];
  inferredRaw.forEach((item, index) => { const match = matchingCandidate(all, item, index); if (match && !all.includes(match)) all.push(match); });
  const candidates = [];
  for (const candidate of all.slice(0, maxCandidates)) {
    if (signal?.aborted) throw new DOMException('人物准备已取消', 'AbortError');
    const inferred = inferredRaw.find((item) => text(item?.id || item?.name || item?.characterName) === candidate.id || text(item?.name || item?.characterName) === candidate.name);
    const [mvuValue, databaseValue, completedValue] = await Promise.all([
      callAdapter(mvu, candidate, context, 'mvu_dynamic'),
      callAdapter(database, candidate, context, 'database'),
      completeCandidate(inference, candidate, context, signal)
    ]);
    const explicitFacts = inferred?.explicitFacts || inferred?.explicit || inferred?.facts || {};
    const inferredFacts = inferred?.inferred === true ? inferred?.fields : inferred?.inferred || inferred?.inference || {};
    candidates.push(mergeCharacterCandidate(candidate, {
      mvu: mvuValue,
      database: databaseValue,
      aiExtracted: { ...explicitFacts, id: inferred?.id || inferred?.characterId || candidate.id, name: inferred?.name || inferred?.characterName || candidate.name },
      inference: inferredFacts,
      aiCompleted: completedValue || (inferred?.fields && inferred)
    }));
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
    const fields = redactCharacterSource({ ...candidate.fields, ...patch });
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
  const enemies = confirmedEnemyActors(preparation);
  return { ...clone(state), actors: { ...clone(state.actors), enemies }, characterPreparation: clone(preparation), version: Number(state.version || 0) + 1, updatedAt: new Date().toISOString() };
}

/** Serializable model for a confirmation panel. */
export function buildCharacterConfirmationPanel(preparation) {
  assertPreparation(preparation);
  return {
    schema: CHARACTER_PREPARATION_SCHEMA,
    status: preparation.status,
    candidates: preparation.candidates.map((candidate) => ({
      id: candidate.id,
      name: candidate.name,
      fields: clone(candidate.fields),
      editableFields: Object.keys(candidate.fields),
      provenance: clone(candidate.provenance),
      conflicts: clone(candidate.conflicts),
      confirmation: clone(candidate.confirmation)
    }))
  };
}

// Names kept as aliases so host/UI integrations can adopt the boundary without
// coupling to a particular spelling of “prepare” or “confirm”.
export const buildCharacterPreparation = prepareEnemyCandidates;
export const confirmCharacterPreparation = confirmEnemyCandidates;
export const getConfirmedEnemyActors = confirmedEnemyActors;
