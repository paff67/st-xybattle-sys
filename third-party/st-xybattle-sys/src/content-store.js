import { clone, stripSecrets } from './common.js';
import {
  contentMetadata,
  createContentExport,
  createContentRecord,
  assertContentRecord
} from './content-protocol.js';

export const CONTENT_DB_NAME = 'st-xybattle-content';
export const CONTENT_DB_VERSION = 1;
export const CONTENT_OBJECT_STORE = 'contents';
export const CONTENT_INDEX_KEY = 'xybattle.content.index';
export const CONTENT_SETTINGS_KEY = 'xybattle.content.settings';

// Node has no IndexedDB. Keeping a module-level map makes the fallback act
// like a small persistent database for the lifetime of the process and keeps
// separate ContentStore instances consistent in tests and CLI tooling.
const MEMORY_DATABASES = new Map();

function memoryDatabase(name, store) {
  const key = `${name}::${store}`;
  if (!MEMORY_DATABASES.has(key)) MEMORY_DATABASES.set(key, new Map());
  return MEMORY_DATABASES.get(key);
}

function randomId() {
  return Math.random().toString(36).slice(2, 8);
}

function parseLocal(raw, fallback) {
  if (raw == null || raw === '') return clone(fallback);
  try { return JSON.parse(raw); } catch { return clone(fallback); }
}

function storageCanUse(storage) {
  return storage && typeof storage.getItem === 'function' && typeof storage.setItem === 'function';
}

function requestPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('IndexedDB 请求失败'));
  });
}

function transactionPromise(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('IndexedDB 事务失败'));
    transaction.onabort = () => reject(transaction.error || new Error('IndexedDB 事务已中止'));
  });
}

function abortTransaction(transaction, error) {
  transaction.__xyError = error;
  try { transaction.abort(); } catch {}
}

/**
 * IndexedDB-backed content store. The only values written to localStorage
 * are settings and a lightweight metadata index; full registry entries live
 * in IndexedDB (or the explicit in-memory fallback in Node).
 */
export class ContentStore {
  constructor({
    dbName = CONTENT_DB_NAME,
    dbVersion = CONTENT_DB_VERSION,
    storeName = CONTENT_OBJECT_STORE,
    indexedDB = globalThis.indexedDB,
    localStorage = globalThis.localStorage,
    memory = false
  } = {}) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.storeName = storeName;
    this.indexedDB = indexedDB;
    this.localStorage = storageCanUse(localStorage) ? localStorage : null;
    this.memoryMode = memory || !indexedDB || typeof indexedDB.open !== 'function';
    this.durability = this.memoryMode ? 'temporary' : 'indexeddb';
    this.warning = this.memoryMode ? 'IndexedDB 不可用，内容只保存在当前运行期间' : null;
    this.memory = memoryDatabase(dbName, storeName);
    this.dbPromise = null;
  }

  async ready() {
    if (this.memoryMode) return null;
    if (this.dbPromise) return this.dbPromise;
    this.dbPromise = new Promise((resolve, reject) => {
      let request;
      try { request = this.indexedDB.open(this.dbName, this.dbVersion); } catch (error) { this.memoryMode = true; this.durability = 'temporary'; this.warning = error.message; resolve(null); return; }
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(this.storeName)) {
          const store = database.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
          store.createIndex('contentType', 'contentType', { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        // Browsers can disable IndexedDB (private mode, blocked origin). The
        // caller still receives a functioning explicit memory fallback.
        this.memoryMode = true; this.durability = 'temporary'; this.warning = 'IndexedDB 打开失败，内容只保存在当前运行期间';
        resolve(null);
      };
      request.onblocked = () => {
        this.memoryMode = true; this.durability = 'temporary'; this.warning = 'IndexedDB 被阻塞，内容只保存在当前运行期间';
        resolve(null);
      };
    });
    return this.dbPromise;
  }

  status() { return { mode: this.durability, durable: this.durability === 'indexeddb', warning: this.warning }; }

  readSettings(fallback = {}) {
    return parseLocal(this.localStorage?.getItem(CONTENT_SETTINGS_KEY), fallback);
  }

  writeSettings(settings) {
    const safe = stripSecrets(clone(settings || {}));
    if (this.localStorage) this.localStorage.setItem(CONTENT_SETTINGS_KEY, JSON.stringify(safe));
    return safe;
  }

  readIndex() {
    const index = parseLocal(this.localStorage?.getItem(CONTENT_INDEX_KEY), []);
    return Array.isArray(index) ? index : [];
  }

  writeIndex(index) {
    const safe = Array.isArray(index) ? index.map((item) => contentMetadata(item)) : [];
    if (this.localStorage) {
      try { this.localStorage.setItem(CONTENT_INDEX_KEY, JSON.stringify(safe)); }
      catch (error) { this.warning = `内容已写入 IndexedDB，但索引缓存不可用：${error.message}`; }
    }
    return safe;
  }

  async _readAll() {
    const database = await this.ready();
    if (!database) return [...this.memory.values()].map(clone);
    const tx = database.transaction(this.storeName, 'readonly');
    const request = tx.objectStore(this.storeName).getAll();
    return (await requestPromise(request)).map(clone);
  }

  async _read(id) {
    const database = await this.ready();
    if (!database) return clone(this.memory.get(String(id)));
    const tx = database.transaction(this.storeName, 'readonly');
    return clone(await requestPromise(tx.objectStore(this.storeName).get(String(id))));
  }

  async _write(record, { overwrite = true } = {}) {
    const database = await this.ready();
    if (!database) {
      if (!overwrite && this.memory.has(record.id)) throw new Error(`内容已存在：${record.id}`);
      this.memory.set(record.id, clone(record)); return;
    }
    const tx = database.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    const request = overwrite ? store.put(clone(record)) : store.add(clone(record));
    request.onerror = () => {
      if (request.error?.name === 'ConstraintError') abortTransaction(tx, new Error(`内容已存在：${record.id}`));
    };
    try { await transactionPromise(tx); }
    catch (error) { throw tx.__xyError || error; }
  }

  async _remove(id) {
    const database = await this.ready();
    if (!database) { this.memory.delete(String(id)); return; }
    const tx = database.transaction(this.storeName, 'readwrite');
    tx.objectStore(this.storeName).delete(String(id));
    await transactionPromise(tx);
  }

  async _replaceIndex() {
    const records = await this._readAll();
    return this.writeIndex(records.map(contentMetadata).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt))));
  }

  async list({ contentType, type, query } = {}) {
    const wantedType = contentType || type;
    const values = await this._readAll();
    return values
      .filter((record) => !wantedType || record.contentType === wantedType)
      .filter((record) => !query || `${record.name || ''} ${record.id}`.toLowerCase().includes(String(query).toLowerCase()))
      .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
      .map((record) => clone(record.entry));
  }

  async listRecords(options = {}) {
    const wantedType = options.contentType || options.type;
    const values = await this._readAll();
    return values.filter((record) => !wantedType || record.contentType === wantedType).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt))).map(clone);
  }

  async get(id) {
    const record = await this._read(id);
    return record ? clone(record.entry) : undefined;
  }

  async getRecord(id) {
    return clone(await this._read(id));
  }

  async put(value, options = {}) {
    const existing = value?.id ? await this._read(value.id) : undefined;
    const record = createContentRecord(value, {
      ...options,
      createdAt: options.createdAt || existing?.createdAt,
      updatedAt: options.updatedAt || new Date().toISOString()
    });
    if (existing && !options.overwrite) throw new Error(`内容已存在：${record.id}`);
    await this._write(record, { overwrite: options.overwrite !== false });
    await this._replaceIndex();
    return clone(record.entry);
  }

  async add(value, options = {}) { return this.put(value, { ...options, overwrite: false }); }
  async save(value, options = {}) { return this.put(value, { ...options, overwrite: true }); }

  async putMany(values, options = {}) {
    if (!Array.isArray(values) || !values.length) return [];
    const records = values.map((value) => {
      const record = value?.entry ? clone(value) : createContentRecord(value, options);
      assertContentRecord(record);
      return record;
    });
    const ids = new Set();
    for (const record of records) { if (ids.has(record.id)) throw new Error(`内容 id 重复：${record.id}`); ids.add(record.id); }
    const existing = await this._readAll();
    const existingIds = new Set(existing.map((record) => record.id));
    if (!options.overwrite) for (const record of records) if (existingIds.has(record.id)) throw new Error(`内容已存在：${record.id}`);
    const database = await this.ready();
    if (!database) {
      const previous = new Map(this.memory);
      try { for (const record of records) this.memory.set(record.id, clone(record)); }
      catch (error) { this.memory.clear(); for (const [id, record] of previous) this.memory.set(id, record); throw error; }
    } else {
      const tx = database.transaction(this.storeName, 'readwrite');
      const objectStore = tx.objectStore(this.storeName);
      for (const record of records) {
        const request = options.overwrite ? objectStore.put(clone(record)) : objectStore.add(clone(record));
        request.onerror = () => {
          if (request.error?.name === 'ConstraintError') abortTransaction(tx, new Error(`内容已存在：${record.id}`));
        };
      }
      try { await transactionPromise(tx); }
      catch (error) { throw tx.__xyError || error; }
    }
    await this._replaceIndex();
    return records.map((record) => clone(record.entry));
  }

  async importRecords(records, options = {}) { return this.putMany(records, options); }

  async update(id, patch, options = {}) {
    const existing = await this._read(id);
    if (!existing) throw new Error(`内容不存在：${id}`);
    const source = typeof patch === 'function' ? patch(clone(existing.entry)) : { ...existing.entry, ...clone(patch) };
    if (source.id && source.id !== id) throw new Error('编辑不允许修改内容 id，请使用复制');
    source.id = id;
    return this.put(source, { ...options, overwrite: true, createdAt: existing.createdAt });
  }

  async remove(id) {
    const existing = await this._read(id);
    if (!existing) return false;
    await this._remove(id);
    await this._replaceIndex();
    return true;
  }

  async delete(id) { return this.remove(id); }

  async copy(id, options = {}) {
    const source = await this._read(id);
    if (!source) throw new Error(`内容不存在：${id}`);
    const targetId = options.id || `${source.id}-copy-${Date.now().toString(36)}-${randomId()}`;
    if (await this._read(targetId)) throw new Error(`内容已存在：${targetId}`);
    const entry = clone(source.entry);
    entry.id = targetId;
    if (options.name) entry.name = options.name;
    else entry.name = `${entry.name} 副本`;
    // Technique ids are namespaced by their parent entry in user-authored
    // content. Remapping them avoids ambiguous lookups after a copy.
    const idMap = new Map((entry.techniques || []).map((technique, index) => [
      technique.id,
      `${targetId}.technique-${index + 1}`
    ]));
    const rewrite = (value) => {
      if (typeof value === 'string') {
        let result = value;
        for (const [from, to] of idMap) {
          result = result.replace(new RegExp(`(^|[^A-Za-z0-9_.-])${from.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}(?=[:\\s,;.)]|$)`, 'g'), `$1${to}`);
        }
        return result;
      }
      if (Array.isArray(value)) return value.map(rewrite);
      if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, rewrite(item)]));
      return value;
    };
    const rewritten = rewrite(entry);
    rewritten.techniques.forEach((technique, index) => { technique.id = `${targetId}.technique-${index + 1}`; });
    return this.put(rewritten, { contentType: source.contentType });
  }

  async clear() {
    const records = await this._readAll();
    const database = await this.ready();
    if (!database) this.memory.clear();
    else {
      const tx = database.transaction(this.storeName, 'readwrite');
      tx.objectStore(this.storeName).clear();
      await transactionPromise(tx);
    }
    this.writeIndex([]);
    return records.length;
  }

  async exportContents(ids, options = {}) {
    const wanted = ids == null ? null : new Set(Array.isArray(ids) ? ids : [ids]);
    const records = (await this._readAll()).filter((record) => !wanted || wanted.has(record.id));
    return createContentExport(records, options);
  }

  async exportData(ids, options = {}) {
    const document = await this.exportContents(ids, options);
    return JSON.stringify(document, null, options.pretty === false ? 0 : 2);
  }

  async export(ids, options = {}) { return this.exportData(ids, options); }
}

export function resetMemoryContentStore({ dbName = CONTENT_DB_NAME, storeName = CONTENT_OBJECT_STORE } = {}) {
  memoryDatabase(dbName, storeName).clear();
}

