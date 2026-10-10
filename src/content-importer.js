import { clone } from './common.js';
import { observeOperation } from './operation-log.js';
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
  return observeOperation('content-import', {}, async trace => {
  if (!store) throw new Error('导入内容需要 ContentStore');
  if (!['reject', 'replace'].includes(mode)) throw new Error(`不支持的导入模式：${mode}`);
  const preview = await trace.span('validation', () => previewContentImport(raw, options));
  const conflicts = await trace.span('conflict-check', () => inspectContentConflicts(preview, store, { mode }));
  trace.write('route', conflicts.length && mode==='reject' ? 'failed':'success','内容冲突处理选择',{mode,conflictCount:conflicts.length},conflicts.length && mode==='reject'?'ERROR':'INFO');
  if (mode === 'reject' && conflicts.length) throw Object.assign(new Error(`内容已存在：${conflicts.map((item) => item.id).join('、')}`), {code:'VALIDATION_FAILED'});
  if (typeof store.putMany === 'function') {
    await trace.span('commit', () => store.putMany(preview.records, { overwrite: mode === 'replace', trace }));
  } else if (typeof store.importRecords === 'function') {
    await trace.span('commit', () => store.importRecords(preview.records, { overwrite: mode === 'replace' }));
  } else {
    throw new Error('ContentStore 缺少原子批量导入接口');
  }
  trace.result.committed = true;
  return { ...preview, conflicts, imported: preview.records.map((record) => record.id) };
  });
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
