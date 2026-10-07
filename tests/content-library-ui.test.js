import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { parse, compileScript } from '@vue/compiler-sfc';
import { ContentStore } from '../src/content-store.js';
import { parseContentExport } from '../src/content-protocol.js';
import { authoritativeEntries } from '../src/authoritative-rules.js';
const dom = new JSDOM('<html><body></body></html>');
for (const key of ['window', 'document', 'Element', 'HTMLElement', 'Document', 'SVGElement', 'Node']) globalThis[key] = dom.window[key];
const { createApp, nextTick } = await import('vue');
const source = await readFile(new URL('../src/ui/components/ContentLibraryPanel.vue', import.meta.url), 'utf8');
let code = compileScript(parse(source).descriptor, { id: 'content-library-test', inlineTemplate: true }).content;
for (const [from, to] of [
  ['../../content-importer.js', '../src/content-importer.js'],
  ['../../content-protocol.js', '../src/content-protocol.js'],
  ['../../../content/authoritative-six-arts/six-arts.content.json', '../content/authoritative-six-arts/six-arts.content.json']
]) code = code.replace(from, new URL(to, import.meta.url).href);
await mkdir(new URL('../output/', import.meta.url), { recursive: true });
const compiled = new URL(`../output/content-library-${process.pid}.mjs`, import.meta.url);
await writeFile(compiled, code);
const { default: Panel } = await import(compiled.href);
after(async () => { await unlink(compiled); dom.window.close(); });
async function mount(t, store) {
  const root = document.createElement('div'); document.body.append(root);
  const exports = [], applied = [];
  const app = createApp(Panel, { store, onExport: value => exports.push(value), onApply: value => applied.push(value) });
  app.mount(root); await new Promise(resolve => setTimeout(resolve, 0)); await nextTick();
  t.after(() => { app.unmount(); root.remove(); });
  const button = label => [...root.querySelectorAll('button')].find(item => item.textContent.trim() === label);
  const click = async element => { element.click(); await new Promise(resolve => setTimeout(resolve, 0)); await nextTick(); };
  return { root, exports, applied, button, click };
}

test('empty browser library displays six readonly builtins without persisting or granting anything', async t => {
  const store = new ContentStore({ memory: true, dbName: `builtins-${Date.now()}`, localStorage: null });
  const { root, exports, applied, button, click } = await mount(t, store);
  assert.equal(root.querySelectorAll('[data-source="builtin"]').length, 6);
  assert.deepEqual(await store.listRecords(), []);
  await click(root.querySelector('[data-source="builtin"]'));
  assert.equal(root.querySelector('textarea').readOnly, true);
  assert.match(root.textContent, /版本 2026.10.06-source.1/);
  for (const label of ['保存编辑', '复制', '删除', '预览校验']) assert.equal(button(label).disabled, true);
  await click(button('导出选中'));
  assert.equal(parseContentExport(exports.at(-1)).length, 1);
  await click(button('导出全部'));
  assert.equal(parseContentExport(exports.at(-1)).length, 6);
  await click(button('应用到本场'));
  assert.equal(applied[0][0].authority.kind, 'user-designated-source');
  assert.deepEqual(await store.listRecords(), []);
});

test('same-id user record stays independently editable and export remains importable', async t => {
  const store = new ContentStore({ memory: true, dbName: `duplicates-${Date.now()}`, localStorage: null });
  const entry = authoritativeEntries()[0]; entry.name = '用户保存版本'; await store.add(entry);
  const { root, exports, button, click } = await mount(t, store);
  assert.equal(root.querySelectorAll('.xy-library-item').length, 7);
  await click(root.querySelector('[data-source="user"]'));
  assert.equal(root.querySelector('textarea').readOnly, false);
  assert.equal(button('删除').disabled, false);
  await click(button('导出选中'));
  assert.equal(parseContentExport(exports.at(-1))[0].name, '用户保存版本');
  await click(button('导出全部'));
  assert.equal(parseContentExport(exports.at(-1)).length, 6);
  assert.match(root.textContent, /同编号采用用户保存版本/);
  await click(button('删除'));
  assert.equal(root.querySelectorAll('.xy-library-item').length, 6);
  assert.deepEqual(await store.listRecords(), []);
});

test('builtins remain accessible when reading user storage fails', async t => {
  const { root } = await mount(t, { listRecords: async () => { throw new Error('blocked'); } });
  assert.equal(root.querySelectorAll('[data-source="builtin"]').length, 6);
  assert.match(root.textContent, /用户资料读取失败/);
});

