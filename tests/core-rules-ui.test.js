import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { parse, compileScript } from '@vue/compiler-sfc';
const dom = new JSDOM('<html><body></body></html>');
for (const key of ['window', 'document', 'Element', 'HTMLElement', 'Document', 'SVGElement', 'Node']) globalThis[key] = dom.window[key];
const { createApp, nextTick, reactive } = await import('vue');
const source = await readFile(new URL('../src/ui/components/CoreRulesSettings.vue', import.meta.url), 'utf8');
const code = compileScript(parse(source).descriptor, { id: 'core-rules-ui-test', inlineTemplate: true }).content;
await mkdir(new URL('../output/', import.meta.url), { recursive: true });
const compiled = new URL(`../output/core-rules-${process.pid}.mjs`, import.meta.url);
await writeFile(compiled, code);
const { default: Panel } = await import(compiled.href);
after(async () => { await unlink(compiled); dom.window.close(); });

test('settings select multiple book-qualified entries and lock controls in an active battle', async t => {
  const root = document.createElement('div'); document.body.append(root);
  let saved;
  const state = reactive({ phase: 'idle' });
  const controller = { coreRuleConfig: () => ({ characterKey: 'card.png', characterName: '测试卡', selection: [] }),
    hostAdapter: { listCoreWorldbooks: async () => ['甲', '乙'], readCoreWorldbook: async () => ({ entries: { 25: { uid: 25, comment: '境界' } } }) },
    saveCoreRuleConfig: (selection, key) => { saved = { selection: JSON.parse(JSON.stringify(selection)), key }; } };
  const app = createApp(Panel, { controller, state }); app.mount(root);
  t.after(() => { app.unmount(); root.remove(); });
  const settle = async () => { await new Promise(resolve => setTimeout(resolve, 0)); await nextTick(); };
  const button = label => [...root.querySelectorAll('button')].find(node => node.textContent === label);
  button('读取世界书列表').click(); await settle();
  for (const name of ['甲', '乙']) {
    const select = root.querySelector('select'); select.value = name; select.dispatchEvent(new dom.window.Event('change')); await settle();
    root.querySelector('input[type=checkbox]').click(); await settle();
  }
  button('保存本角色卡底则').click(); await settle();
  assert.deepEqual(saved, { key: 'card.png', selection: [{ book: '甲', uid: 25 }, { book: '乙', uid: 25 }] });
  state.phase = 'awaiting_player'; await settle();
  assert.equal(root.querySelector('fieldset').disabled, true);
  assert.match(root.textContent, /期间已锁定/);
});
