import { clone } from './common.js';
import {
  CONTENT_EXPORT_SCHEMA,
  CONTENT_PROTOCOL_VERSION,
  createContentRecord,
  parseContentExport,
  validateContentBatch
} from './content-protocol.js';

/**
 * Parse and validate content without mutating a store. The returned records
 * are detached clones, so an editor can safely change its draft after the
 * preview has been rendered.
 */
export function previewContentImport(raw, options = {}) {
  const records = parseContentExport(raw, options);
  const seen = new Set();
  const conflicts = [];
  for (const record of records) {
    if (seen.has(record.id)) throw new Error(`内容 id 重复：${record.id}`);
    seen.add(record.id);
  }
  return {
    schema: CONTENT_EXPORT_SCHEMA,
    protocolVersion: CONTENT_PROTOCOL_VERSION,
    valid: true,
    count: records.length,
    records: clone(records),
    ids: records.map((record) => record.id),
    conflicts
  };
}

/**
 * Resolve conflicts before writing. `mode=reject` is the safe default; use
 * replace explicitly for an editor save or a deliberate import overwrite.
 */
export async function inspectContentConflicts(preview, store, { mode = 'reject' } = {}) {
  if (!preview?.valid || !Array.isArray(preview.records)) throw new Error('无效的内容导入预览');
  if (!store?.getRecord) return [];
  const conflicts = [];
  for (const record of preview.records) {
    if (await store.getRecord(record.id)) conflicts.push({ id: record.id, action: mode === 'replace' ? 'replace' : 'reject' });
  }
  return conflicts;
}

export async function importContent(raw, { store, mode = 'reject', ...options } = {}) {
  if (!store) throw new Error('导入内容需要 ContentStore');
  if (!['reject', 'replace'].includes(mode)) throw new Error(`不支持的导入模式：${mode}`);
  const preview = previewContentImport(raw, options);
  const conflicts = await inspectContentConflicts(preview, store, { mode });
  if (mode === 'reject' && conflicts.length) throw new Error(`内容已存在：${conflicts.map((item) => item.id).join('、')}`);
  if (typeof store.putMany === 'function') {
    await store.putMany(preview.records, { overwrite: mode === 'replace' });
  } else if (typeof store.importRecords === 'function') {
    await store.importRecords(preview.records, { overwrite: mode === 'replace' });
  } else {
    throw new Error('ContentStore 缺少原子批量导入接口');
  }
  return { ...preview, conflicts, imported: preview.records.map((record) => record.id) };
}

export async function exportContent(store, ids, options = {}) {
  if (!store?.exportContents) throw new Error('导出内容需要 ContentStore');
  return store.exportContents(ids, options);
}

export async function exportContentJson(store, ids, options = {}) {
  const value = await exportContent(store, ids, options);
  return JSON.stringify(value, null, options.pretty === false ? 0 : 2);
}

export function draftRecord(entry, options = {}) {
  return createContentRecord(entry, options);
}

export function normalizeContentBatch(raw, options = {}) {
  return validateContentBatch(raw, options).map((entry) => createContentRecord(entry, options));
}
