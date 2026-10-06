import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve, dirname, basename } from 'node:path';
import { JSDOM } from 'jsdom';
import { parse, compileScript } from '@vue/compiler-sfc';
import 'fake-indexeddb/auto';
import { BattleController } from '../src/battle-controller.js';
import { prepareEnemyCandidates, buildCharacterConfirmationPanel } from '../src/character-preparation.js';
import { fullCombatProfile } from './fixtures/combat-profile.js';

// Exercise real Vue component state and DOM events, without browser automation.
const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
for (const key of ['window', 'document', 'Element', 'HTMLElement', 'SVGElement', 'Node']) globalThis[key] = dom.window[key];
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
const { createApp, nextTick } = await import('vue');
const modules = new Map();
await mkdir(resolve('output'), { recursive: true });
async function compileVue(filename) {
  const file = resolve(filename);
  if (modules.has(file)) return modules.get(file);
  const target = pathToFileURL(resolve('output', `draft-test-${process.pid}-${basename(file)}.mjs`));
  modules.set(file, target);
  const { descriptor } = parse(await readFile(file, 'utf8'), { filename: file });
  let code = compileScript(descriptor, { id: basename(file), inlineTemplate: true }).content;
  for (const match of [...code.matchAll(/from\s+['"]([^'"]+)['"]/g)]) {
    if (!match[1].startsWith('.')) continue;
    const dependency = resolve(dirname(file), match[1]);
    const url = dependency.endsWith('.vue') ? await compileVue(dependency) : pathToFileURL(dependency);
    code = code.replace(match[0], `from '${url.href}'`);
  }
  await writeFile(target, code);
  return target;
}
const App = (await import((await compileVue('src/ui/App.vue')).href)).default;
after(async () => { await Promise.all([...modules.values()].map((url) => unlink(url))); dom.window.close(); });

async function mount(t) {
  const controller = new BattleController({ storage: null, chatId: 'draft-test', branchId: 'main' });
  await controller.ready;
  const root = document.createElement('div'); document.body.append(root);
  const app = createApp(App, { controller });
  const vm = app.mount(root); vm.open(); await nextTick();
  t.after(() => { app.unmount(); root.remove(); controller.dispose(); });
  return { root, controller, vm };
}
async function input(node, value, event = 'input') {
  node.value = value; node.dispatchEvent(new dom.window.Event(event, { bubbles: true })); await nextTick();
}
async function tab(root, label) {
  [...root.querySelectorAll('.xy-tab-btn')].find((button) => button.textContent.includes(label)).click(); await nextTick();
}
async function reopen(root) {
  root.querySelector('[aria-label="关闭工作台"]').click(); await nextTick();
  root.querySelector('#xybattle-v2-launcher').click(); await nextTick();
}

test('closing/reopening and switching tabs preserve action, selected technique and unsaved settings', async (t) => {
  const { root } = await mount(t);
  const action = root.querySelector('.xy-action-textarea');
  const technique = root.querySelector('.xy-tech-select');
  await input(action, '未提交的行动草稿');
  const selected = [...technique.options].find((option) => option.value && !option.disabled).value;
  await input(technique, selected, 'change');
  await tab(root, '独立机枢');
  const settings = root.querySelector('.xy-settings-panel textarea');
  await input(settings, '未保存的原始输入');
  await reopen(root);
  assert.equal(root.querySelector('.xy-settings-panel textarea').value, '未保存的原始输入');
  await tab(root, '战场对决');
  assert.equal(root.querySelector('.xy-action-textarea').value, '未提交的行动草稿');
  assert.equal(root.querySelector('.xy-tech-select').value, selected);
  assert.equal(root.querySelector('.xy-action-textarea'), action, 'closing must not destroy the form');
});

test('chat/branch/session changes clear drafts rather than applying them to another battle', async (t) => {
  const { root, controller } = await mount(t);
  await input(root.querySelector('.xy-action-textarea'), '仅属于原分支');
  await controller.switchScope({ chatId: 'draft-test', branchId: 'other' });
  await nextTick();
  assert.equal(root.querySelector('.xy-action-textarea').value, '');
  await input(root.querySelector('.xy-action-textarea'), '仅属于原会话');
  controller.state = { ...controller.state, sessionId: 'new-session' }; controller.emit(); await nextTick();
  assert.equal(root.querySelector('.xy-action-textarea').value, '');
});

test('unconfirmed candidate edits survive closing and switching away from the confirmation tab', async (t) => {
  const { root, controller } = await mount(t);
  const preparation = await prepareEnemyCandidates({ scope: controller.state.scope, enemies: [{ ...fullCombatProfile(), id: 'e' }] });
  controller.prepareCharacters = async () => buildCharacterConfirmationPanel(preparation);
  controller.hostAdapter = {}; // Enter the actual hosted preparation branch without a host API.
  root.querySelector('.btn-start').click();
  await new Promise((resolve) => setTimeout(resolve, 0)); await nextTick();
  const editor = root.querySelector('.xy-character-candidate__raw textarea');
  const data = JSON.parse(editor.value); data.name = '草稿人物名字';
  await input(editor, JSON.stringify(data));
  await tab(root, '独立机枢'); await reopen(root); await tab(root, '战场对决');
  assert.equal(JSON.parse(root.querySelector('.xy-character-candidate__raw textarea').value).name, '草稿人物名字');
  assert.equal(root.querySelector('.xy-character-candidate__raw textarea'), editor);
});

test('battle verdict and timeline display committed results even if stored narration contains CoT', async (t) => {
  const { root, controller } = await mount(t);
  controller.state.history = [{ actionId: 'cot-test', roundId: 'round-1', action: { label: '试探' }, status: 'complete', adjudication: { summary: '双方未受伤', publicEvents: ['只有局部偏流'] }, narrative: { text: '<think>不应出现在战场的推理</think>正文也不展示' } }];
  controller.emit(); await nextTick();
  const verdict = root.querySelector('.xy-verdict-card');
  assert.match(verdict.textContent, /双方未受伤/);
  assert.match(verdict.textContent, /只有局部偏流/);
  assert.doesNotMatch(verdict.textContent, /推理|正文也不展示/);
  root.querySelector('.btn-history').click(); await nextTick();
  const history = root.querySelector('.xy-timeline-drawer-panel');
  assert.match(history.textContent, /双方未受伤/);
  assert.doesNotMatch(history.textContent, /推理|正文也不展示|正文演化/);
});
