import { clone } from './common.js';
import { assertRegistryEntry } from './battle-registry.js';

/**
 * Versioned envelope used by the editable technique/treasure catalogue.
 * Registry entries themselves intentionally remain compatible with the
 * existing battle_v2 schema; the envelope is only used when content is
 * stored or exchanged through ContentStore/ContentImporter.
 */
export const CONTENT_SCHEMA = 'xybattle-content-v1';
export const CONTENT_PROTOCOL_VERSION = 1;
export const CONTENT_TYPES = Object.freeze(['technique', 'treasure']);
export const CONTENT_EXPORT_SCHEMA = 'xybattle-content-export-v1';

const VISIBILITIES = new Set(['public', 'player', 'gm', 'internal']);

function text(value, field) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${field} 必须是非空文字`);
}

function parseObject(raw) {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch (error) {
      throw new Error(`内容 JSON 无法解析：${error.message}`);
    }
  }
  if (!raw || typeof raw !== 'object') throw new Error('内容必须是 JSON 对象或数组');
  return clone(raw);
}

/** Infer the catalogue kind without changing the battle registry schema. */
export function inferContentType(entry, explicitType) {
  const type = explicitType ?? entry?.contentType ?? entry?.kind ?? entry?.type;
  if (type === '功法' || type === 'gongfa') return 'technique';
  if (type === 'technique') return 'technique';
  if (type === '法宝' || type === 'fabao' || type === 'treasure') return 'treasure';
  if (typeof entry?.id === 'string' && entry.id.startsWith('fabao.')) return 'treasure';
  if (type !== undefined && type !== null && type !== '') return null;
  return 'technique';
}

function unwrap(raw) {
  let value = parseObject(raw);
  if (value.schema && value.schema !== CONTENT_EXPORT_SCHEMA && value.schema !== CONTENT_SCHEMA) throw new Error(`内容 schema 不受支持：${value.schema}`);
  // Accept exported envelopes, registry wrappers and a single content record.
  if (value.schema === CONTENT_EXPORT_SCHEMA && Array.isArray(value.items)) return value.items;
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.registry)) return value.registry;
  if (value.entry && typeof value.entry === 'object') return value.entry;
  if (value.content && typeof value.content === 'object') return value.content;
  return value;
}

/**
 * Validate one registry entry and return a deep-cloned, normalized value.
 * The function deliberately does not load canonical-techniques.js: imported
 * content is opt-in and never silently injects the six techniques or three
 * treasures into a battle registry.
 */
export function validateContent(raw, options = {}) {
  const value = parseObject(raw);
  if (value.schema && ![CONTENT_SCHEMA, CONTENT_EXPORT_SCHEMA].includes(value.schema) && !value.entry && !value.content) throw new Error(`内容 schema 不受支持：${value.schema}`);
  const entry = value.entry && typeof value.entry === 'object' ? value.entry : value.content && typeof value.content === 'object' ? value.content : value;
  const declaredType = options.contentType ?? value.contentType ?? value.kind ?? (value.entry ? undefined : value.type);
  const contentType = inferContentType(entry, declaredType);
  if (!CONTENT_TYPES.includes(contentType)) throw new Error(`内容类型无效：${contentType}`);
  assertRegistryEntry(entry);
  if (!/^(gongfa|fabao)\.[a-z0-9._-]+$/i.test(entry.id)) throw new Error('内容 id 必须使用 gongfa. 或 fabao. 前缀');
  for (const key of ['mechanics', 'synergies', 'narrativeGuidance', 'ruleRefs']) {
    if (!entry[key].every((item) => typeof item === 'string' && item.trim())) throw new Error(`${key} 必须是非空文字数组`);
  }
  for (const technique of entry.techniques) {
    if (!technique.mechanics.every((item) => typeof item === 'string' && item.trim()) || !technique.triggeredState.every((item) => typeof item === 'string' && item.trim())) throw new Error(`词条 ${technique.id} 的机制文字无效`);
    if (!Array.isArray(technique.availability.conditions) || !technique.availability.conditions.every((item) => typeof item === 'string' && item.trim())) throw new Error(`词条 ${technique.id} 的可用性条件无效`);
    const requires = technique.availability.requires ?? [];
    if (!Array.isArray(requires) || requires.some((requirement) => !requirement || typeof requirement !== 'object' || typeof requirement.path !== 'string' || !['includes', 'truthy', 'equals', 'not'].includes(requirement.op))) throw new Error(`词条 ${technique.id} 的 requires 无效`);
  }
  if (entry.id.startsWith('fabao.') && contentType !== 'treasure') throw new Error('fabao 条目必须标记为 treasure');
  if (entry.id.startsWith('gongfa.') && contentType !== 'technique') throw new Error('gongfa 条目必须标记为 technique');
  if (options.excludeIds?.includes(entry.id)) throw new Error(`内容已被排除：${entry.id}`);
  if (options.requirePrefix !== false && !/^(gongfa|fabao)\.[a-z0-9._-]+$/i.test(entry.id)) {
    throw new Error('内容 id 必须使用 gongfa. 或 fabao. 前缀');
  }
  return clone(entry);
}

export function validateContentBatch(raw, options = {}) {
  const values = unwrap(raw);
  const entries = Array.isArray(values) ? values : [values];
  const seen = new Set();
  return entries.map((entry) => {
    const normalized = validateContent(entry, options);
    if (seen.has(normalized.id)) throw new Error(`内容 id 重复：${normalized.id}`);
    seen.add(normalized.id);
    return normalized;
  });
}

export function createContentRecord(raw, options = {}) {
  const entry = validateContent(raw, options);
  const now = options.now || new Date().toISOString();
  const createdAt = options.createdAt || now;
  const updatedAt = options.updatedAt || now;
  return {
    schema: CONTENT_SCHEMA,
    protocolVersion: CONTENT_PROTOCOL_VERSION,
    id: entry.id,
    contentType: inferContentType(entry, options.contentType),
    name: entry.name,
    version: entry.version,
    createdAt,
    updatedAt,
    entry
  };
}

export function createContentExport(items, options = {}) {
  const values = Array.isArray(items) ? items : [items];
  const normalized = values.map((item) => item?.entry ? createContentRecord(item.entry, item) : createContentRecord(item, options));
  return {
    schema: CONTENT_EXPORT_SCHEMA,
    protocolVersion: CONTENT_PROTOCOL_VERSION,
    exportedAt: options.exportedAt || new Date().toISOString(),
    items: normalized
  };
}

export function parseContentExport(raw, options = {}) {
  const parsed = parseObject(raw);
  if (parsed.schema === CONTENT_EXPORT_SCHEMA) {
    if (parsed.protocolVersion !== CONTENT_PROTOCOL_VERSION) throw new Error(`内容协议版本不支持：${parsed.protocolVersion}`);
    if (!Array.isArray(parsed.items)) throw new Error('内容导出文件缺少 items 数组');
    const records = parsed.items.map((item) => createContentRecord(item.entry || item.content || item, {
      ...options,
      contentType: item.contentType,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
    const ids = new Set();
    for (const record of records) { if (ids.has(record.id)) throw new Error(`内容 id 重复：${record.id}`); ids.add(record.id); }
    return records;
  }
  return validateContentBatch(parsed, options).map((entry) => createContentRecord(entry, options));
}

export function contentMetadata(record) {
  if (record && !record.entry && record.id && !Array.isArray(record.techniques)) {
    return {
      id: record.id,
      contentType: record.contentType || inferContentType(record, record.contentType),
      name: record.name || record.id,
      version: record.version || '',
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    };
  }
  const item = record?.entry ? record : createContentRecord(record);
  return {
    id: item.id,
    contentType: item.contentType,
    name: item.name,
    version: item.version,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

export function assertContentRecord(record) {
  if (!record || record.schema !== CONTENT_SCHEMA || record.protocolVersion !== CONTENT_PROTOCOL_VERSION) {
    throw new Error('不是有效的 xybattle 内容记录');
  }
  if (!record.id || !record.entry || record.id !== record.entry.id) throw new Error('内容记录 id 与 entry 不一致');
  if (!VISIBILITIES.has(record.entry.visibility)) throw new Error('visibility 无效');
  const entry = validateContent(record.entry, { contentType: record.contentType });
  if (record.name !== entry.name || record.version !== entry.version) throw new Error('内容记录元数据与 entry 不一致');
  return true;
}

