import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { parse, compileScript } from '@vue/compiler-sfc';
import { createConfigEnvelope, runtimeConfig } from '../src/config-schema.js';

const dom = new JSDOM('<html><body></body></html>', { url: 'http://localhost' });
for (const key of ['window', 'document', 'Element', 'HTMLElement', 'Document', 'SVGElement', 'Node']) globalThis[key] = dom.window[key];
const { createApp, nextTick } = await import('vue');
const source = await readFile(new URL('../src/ui/components/SettingsPanel.vue', import.meta.url), 'utf8');
let code = compileScript(parse(source).descriptor, { id: 'config-ui-test', inlineTemplate: true }).content;
code = code.replace(/import Icons from .*?;/, 'const Icons = { render: () => null };')
  .replace(/import CoreRulesSettings from .*?;/, 'const CoreRulesSettings = { render: () => null };')
  .replaceAll("from '../../", "from '../src/");
const compiled = new URL(`../output/config-ui-${process.pid}.mjs`, import.meta.url);
await writeFile(compiled, code);
const { default: Panel } = await import(compiled.href);
after(async () => { await unlink(compiled); dom.window.close(); });

test('settings draft preserves failed saves, carries original baseWriteId, and reports submitted separately', async t => {
  const root = document.createElement('div'); document.body.append(root);
  const envelope = createConfigEnvelope({ adjudicationPrompt: '  custom original\n' });
  const controller = { configStore: {}, configEnvelope: envelope, settings: runtimeConfig(envelope), localConfigSources: [] };
  let received, complete;
  const app = createApp(Panel, { controller, settings: controller.settings,
    onSave: (settings, options, done) => { received = { settings, options }; complete = done; } });
  app.mount(root); t.after(() => { app.unmount(); root.remove(); });
  const button = label => [...root.querySelectorAll('button')].find(node => node.textContent.includes(label));
  const prompts = [...root.querySelectorAll('textarea')];
  const prompt = prompts.find(node => node.value === '  custom original\n');
  prompt.value = '  edited prompt\n'; prompt.dispatchEvent(new dom.window.Event('input')); await nextTick();
  button('保存机枢设定').click(); await nextTick();
  assert.equal(received.settings.adjudicationPrompt, '  edited prompt\n');
  assert.equal(received.options.baseWriteId, envelope.writeId);
  assert.equal(button('保存机枢设定').disabled, true);
  complete(new Error('config_conflict')); await nextTick();
  assert.match(root.textContent, /配置冲突，草稿保留/);
  assert.equal(prompt.value, '  edited prompt\n');
  button('保存机枢设定').click(); await nextTick();
  controller.configEnvelope = createConfigEnvelope(received.settings, { previous: envelope });
  controller.settings = runtimeConfig(controller.configEnvelope);
  complete(null, { status: 'submitted' }); await nextTick();
  assert.match(root.textContent, /已提交，服务器保存待确认/);
  assert.equal(prompt.value, '  edited prompt\n');
  button('保存机枢设定').click(); await nextTick();
  assert.equal(received.options.baseWriteId, controller.configEnvelope.writeId);
  complete(null, { status: 'confirmed', entryError: true }); await nextTick();
  assert.match(root.textContent, /已确认服务器保存；入口启用失败/);
});

test('mount returns a synchronous handle and leaves controller absent until host config is ready', async () => {
  const { mountBattleSystem } = await import('../dist/battle-ui.bundle.js');
  let reject;
  const store = { load: () => new Promise((_, fail) => { reject = fail; }), invalidate() {} };
  const api = mountBattleSystem({ documentRef: document, configStore: store });
  assert.equal(globalThis.XYBattle, api);
  assert.equal(api.controller, undefined);
  assert.match(api.root.textContent, /正在读取酒馆配置/);
  api.close(); assert.equal(api.root.hidden, true);
  api.open(); assert.equal(api.root.hidden, false);
  reject(new Error('bad host'));
  await assert.rejects(api.ready, /host_config_load_failed/);
  assert.equal(api.controller, undefined);
  assert.equal(api.root.querySelector('button').hidden, false);
  api.destroy();
});
