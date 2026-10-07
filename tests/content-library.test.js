import test from 'node:test';
import assert from 'node:assert/strict';
import sample from '../sample-data/techniques/dielang-xuanchaojue.json' with { type: 'json' };
import { ContentStore, resetMemoryContentStore } from '../src/content-store.js';
import { importContent, previewContentImport } from '../src/content-importer.js';
import { IDBFactory } from 'fake-indexeddb';
import { BattleController } from '../src/battle-controller.js';

class MemoryStorage {
  #items = new Map();
  getItem(key) { return this.#items.get(key) ?? null; }
  setItem(key, value) { this.#items.set(key, String(value)); }
  removeItem(key) { this.#items.delete(key); }
  raw(key) { return this.#items.get(key); }
}

test('content store uses IndexedDB for full records and localStorage only for metadata', async () => {
  const local = new MemoryStorage();
  const store = new ContentStore({ indexedDB: new IDBFactory(), localStorage: local, dbName: `test-${Date.now()}` });
  assert.equal(store.status().mode, 'indexeddb');
  await store.put(sample);
  const saved = await store.get(sample.id);
  assert.deepEqual(saved, sample);
  assert.doesNotMatch(local.raw('xybattle.content.index'), /corePrinciple|techniques|ruleRefs/);
  const copy = await store.copy(sample.id, { id: 'gongfa.dielang-xuanchaojue-copy' });
  assert.notEqual(copy.id, sample.id);
  assert.equal((await store.listRecords()).length, 2);
  await store.update(copy.id, { name: '编辑副本' });
  assert.equal((await store.get(copy.id)).name, '编辑副本');
  const exported = await store.exportContents(sample.id);
  assert.equal(exported.items.length, 1);
  assert.equal(await store.remove(copy.id), true);
  assert.equal(await store.get(copy.id), undefined);
  const second = structuredClone(sample);
  second.id = 'gongfa.dielang-xuanchaojue-second';
  await assert.rejects(() => store.putMany([second, sample]), /内容已存在/);
  assert.equal(await store.get(second.id), undefined);
});

test('import preview is non-mutating and duplicate batch import is atomic', async () => {
  resetMemoryContentStore({ dbName: 'content-import-test' });
  const store = new ContentStore({ memory: true, dbName: 'content-import-test' });
  const preview = previewContentImport(JSON.stringify({ registry: [sample] }));
  assert.equal(preview.count, 1);
  assert.equal(await store.listRecords().then((items) => items.length), 0);
  await importContent(JSON.stringify({ registry: [sample] }), { store });
  const duplicate = { ...sample, name: '冲突' };
  await assert.rejects(() => importContent([sample, duplicate], { store }), /重复|已存在/);
  assert.equal((await store.listRecords()).length, 1);
});

test('memory fallback advertises temporary durability and keeps battle snapshots detached', async () => {
  const store = new ContentStore({ memory: true, dbName: `temporary-${Date.now()}` });
  assert.equal(store.status().durable, false);
  const snapshot = structuredClone(sample);
  await store.put(sample);
  const loaded = await store.get(sample.id);
  loaded.name = '库内编辑';
  assert.equal(snapshot.name, sample.name);
});

test('content entries enter the next registry only by explicit apply and do not rewrite a battle snapshot', async () => {
  const store = new ContentStore({ memory: true, dbName: `registry-${Date.now()}` });
  const entry = structuredClone(sample);
  entry.id = 'gongfa.user-authored';
  await store.put(entry);
  const controller = new BattleController({ storage: new MemoryStorage(), chatId: 'content', branchId: 'snapshot' });
  await controller.hydrateContentStore(store);
  assert.equal(controller.registry.get(entry.id), undefined);
  controller.applyContentEntries([entry]);
  controller.start();
  const snapshotName = controller.state.registrySnapshot.find((item) => item.id === entry.id).name;
  await store.update(entry.id, { name: '库内修订名称' });
  assert.equal(controller.state.registrySnapshot.find((item) => item.id === entry.id).name, snapshotName);
});
