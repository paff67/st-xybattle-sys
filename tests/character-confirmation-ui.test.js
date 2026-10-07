import { authoritativeEntries } from '../src/authoritative-rules.js';
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { parse, compileScript } from '@vue/compiler-sfc';
import { BattleController } from '../src/battle-controller.js';
import { prepareEnemyCandidates, buildCharacterConfirmationPanel } from '../src/character-preparation.js';
import { characterSections, editCharacterField } from '../src/character-presentation.js';
import { fullCombatProfile } from './fixtures/combat-profile.js';

// Compile the actual component, then exercise DOM events without a browser or model API.
const dom = new JSDOM('<!doctype html><html><body></body></html>');
for (const key of ['window', 'document', 'Element', 'HTMLElement', 'SVGElement', 'Node']) globalThis[key] = dom.window[key];
const { createApp, nextTick, reactive } = await import('vue');
const source = await readFile(new URL('../src/ui/components/CharacterConfirmationPanel.vue', import.meta.url), 'utf8');
const { descriptor } = parse(source);
const treeSource = await readFile(new URL('../src/ui/components/CharacterFieldTree.vue', import.meta.url), 'utf8');
const treeCode = compileScript(parse(treeSource).descriptor, { id: 'character-tree-test', inlineTemplate: true }).content;
const compiled = compileScript(descriptor, { id: 'character-confirmation-test', inlineTemplate: true }).content;
await mkdir(new URL('../output/', import.meta.url), { recursive: true });
const compiledPath = new URL(`../output/character-confirmation-${process.pid}.mjs`, import.meta.url);
const treePath = new URL(`../output/character-tree-${process.pid}.mjs`, import.meta.url);
await writeFile(treePath, treeCode);
await writeFile(compiledPath, compiled.replace('./CharacterFieldTree.vue', treePath.href).replace('../../combat-profile.js', pathToFileURL(resolve('src/combat-profile.js')).href).replace('../../character-presentation.js', pathToFileURL(resolve('src/character-presentation.js')).href));
const { default: Panel } = await import(compiledPath.href);
after(async () => { await unlink(compiledPath); await unlink(treePath); dom.window.close(); });

const scope = { chatId: 'confirmation-ui', branchId: 'main' };
async function fixture(count = 1) {
  return prepareEnemyCandidates({ scope, enemies: Array.from({ length: count }, (_, index) => ({
    id: `enemy-${index}`, name: `候选人物${index + 1}`, visibleInfo: { 姿态: '守势', 站位: '中距' },
    resources: { qi: 80 }, techniques: [{ name: '平川断澜', mechanics: ['改变站位', '长说明'.repeat(400)], availability: { default: 'available', conditions: [] } }],
    hidden: { reservePlan: '未公开后备计划' }, customData: { description: '未知字段也不能丢失' }
  })) });
}

function mount(t, preparation, onConfirm = () => {}) {
  const root = document.createElement('div');
  document.body.append(root);
  const props = reactive({ preparation: buildCharacterConfirmationPanel(preparation), busy: false, onConfirm });
  const app = createApp(Panel, props);
  app.mount(root);
  t.after(() => { app.unmount(); root.remove(); });
  return { root, props, button: () => root.querySelector('[data-action="confirm"]') };
}

async function acknowledge(root, index = 0) {
  const input = root.querySelectorAll('.xy-character-candidate__ack input')[index];
  input.checked = true;
  input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  await nextTick();
}

async function inputValue(input, value) {
  input.value = value;
  input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  await nextTick();
}

test('confirmation emits complete reviewed data and controller can enter the next phase', async (t) => {
  const preparation = await fixture();
  const controller = new BattleController({ ...scope, storage: null });
  await controller.ready;
  controller.characterPreparation = preparation;
  t.after(() => controller.dispose());
  let emitted;
  const { root, button } = mount(t, preparation, (payload) => {
    emitted = payload;
    controller.confirmCharacters(payload.edits, { removeIds: payload.removeIds });
    controller.start();
  });
  assert.equal(button().disabled, true);
  assert.equal(root.querySelector('.xy-character-candidate__raw').open, false);
  const content = root.querySelector('.xy-character-candidate__sections').textContent;
  assert.match(content, /可见情报 · 姿态|姿态/);
  assert.match(content, /可用/);
  assert.doesNotMatch(content, /未知字段也不能丢失|内部编号|enemy-0/);
  assert.ok([...root.querySelectorAll("[data-section], [data-field-group]")].every((details) => !details.open));
  assert.match(content, /长说明/);
  assert.doesNotMatch(content, /visibleInfo|availability|customData|reservePlan/);
  await acknowledge(root);
  assert.equal(button().disabled, false);
  button().click();
  assert.deepEqual(emitted.edits['enemy-0'], preparation.candidates[0].fields);
  assert.equal(controller.state.phase, 'awaiting_player');
  assert.equal(controller.state.characterPreparation.status, 'confirmed');
  assert.equal(controller.state.actors.enemies[0].hidden.reservePlan, '未公开后备计划');
  assert.doesNotMatch(JSON.stringify(controller.playerView()), /未公开后备计划/);
});

test('editing a form value revokes acknowledgment, preserves types, and updates the emitted draft', async (t) => {
  let emitted;
  const preparation = await fixture();
  const { root, button } = mount(t, preparation, (payload) => { emitted = payload; });
  await acknowledge(root);
  await inputValue(root.querySelector('[data-field-path="resources.qi"] input'), '42');
  assert.equal(button().disabled, true);
  assert.equal(root.querySelector('.xy-character-candidate__ack input').checked, false);
  assert.match(root.querySelector('[data-field-path="resources.qi"]').textContent, /用户修改，待确认/);
  assert.equal(preparation.candidates[0].fields.resources.qi, 80);
  await acknowledge(root);
  button().click();
  assert.equal(emitted.edits['enemy-0'].resources.qi, 42);
  await inputValue(root.querySelector('[data-field-path="resources.qi"] input'), '');
  assert.equal(button().disabled, true);
  assert.match(root.textContent, /有效数字/);
  // Editing another field must not clear the outstanding numeric error.
  await inputValue(root.querySelector('[data-field-path="name"] textarea'), '新的姓名');
  assert.equal(root.querySelector('.xy-character-candidate__ack input').disabled, true);
  await inputValue(root.querySelector('[data-field-path="resources.qi"] input'), '0');
  await acknowledge(root);
  assert.equal(button().disabled, false);
});

test('raw JSON changes require a new acknowledgment and invalid JSON cannot be confirmed', async (t) => {
  const { root, button } = mount(t, await fixture());
  await acknowledge(root);
  const editor = root.querySelector('[data-candidate-json]');
  const initial = editor.value;
  await inputValue(editor, '{ broken');
  assert.equal(button().disabled, true);
  assert.equal(root.querySelector('.xy-character-candidate__ack input').disabled, true);
  assert.match(root.textContent, /原始资料格式有误/);
  await inputValue(editor, '[]');
  assert.equal(button().disabled, true);
  await inputValue(editor, initial);
  assert.equal(button().disabled, true);
  await acknowledge(root);
  assert.equal(button().disabled, false);
});

test('all retained candidates need review; removing all candidates never enables confirmation', async (t) => {
  let emitted;
  const { root, button } = mount(t, await fixture(2), (payload) => { emitted = payload; });
  await acknowledge(root);
  assert.equal(button().disabled, true);
  root.querySelector('[data-candidate-id="enemy-1"] [data-action="remove"]').click();
  await nextTick();
  assert.equal(button().disabled, false);
  button().click();
  assert.deepEqual(emitted.removeIds, ['enemy-1']);
  assert.deepEqual(Object.keys(emitted.edits), ['enemy-0']);
  root.querySelector('[data-action="remove"]').click();
  await nextTick();
  assert.equal(button().disabled, true);
  root.querySelector('[data-action="restore"]').click();
  await nextTick();
  assert.equal(button().disabled, true);
});

test('presentation preserves nested arrays, long values, empty and unknown fields without mutating data', () => {
  const fields = { techniques: [{ name: '剑招', mechanics: ['全文'.repeat(1000)], enabled: false }], resources: { qi: 0 }, unfamiliar: null, another: [] };
  const before = structuredClone(fields);
  const rows = characterSections(fields, { techniques: { source: 'ai_completed' } }).flatMap((section) => section.rows);
  assert.equal(rows.find((row) => row.path === 'techniques.0.mechanics.0').display.length, 2000);
  assert.equal(rows.find((row) => row.path === 'techniques.0.mechanics.0').source, 'ai_completed');
  assert.equal(rows.find((row) => row.path === 'resources.qi').display, '0');
  assert.equal(rows.find((row) => row.path === 'unfamiliar').display, '未提供');
  assert.equal(rows.find((row) => row.path === 'another').display, '暂无条目');
  const edited = editCharacterField(fields, ['techniques', '0', 'enabled'], 'true');
  assert.equal(edited.techniques[0].enabled, true);
  assert.ok(Array.isArray(edited.techniques));
  assert.deepEqual(fields, before);
});

test('complete profile review hides internal fields and requires both protagonist and enemy acknowledgments', async (t) => {
  const preparation = await prepareEnemyCandidates({ scope, playerId: 'player', enemies: [{ id: 'e', name: '厉沧海' }] }, {
    includePlayer: true, requireProfiles: true,
    inference: { completeCandidate: async ({ side }) => fullCombatProfile(side === 'player' ? '许新毅' : '厉沧海') }
  });
  const { root, button } = mount(t, preparation);
  assert.equal(root.querySelector('[data-candidate-id="player"] [data-action="remove"]'), null);
  assert.ok(root.querySelector('[data-field-group="techniques.0"]'));
  assert.equal(root.querySelector('[data-field-group="techniques.0"]').open, false);
  const visibleFields = [...root.querySelectorAll('.xy-character-candidate__sections')].map((section) => section.textContent).join('');
  assert.doesNotMatch(visibleFields, /内部编号|profileSchema|ruleRefs|combat-profile/);
  assert.match(visibleFields, /消耗10点真气/);
  await acknowledge(root, 0);
  assert.equal(button().disabled, true);
  await acknowledge(root, 1);
  assert.equal(button().disabled, false);
  await inputValue(root.querySelector('[data-candidate-id="e"] [data-field-path="techniques.0.originalDefinition"] textarea'), '');
  assert.equal(button().disabled, true);
  assert.match(root.textContent, /平川断澜缺少完整定义/);
});


test('authority selector changes learned references, revokes acknowledgment and never requires raw JSON editing', async (t) => {
  const registry = authoritativeEntries();
  const entry = registry.find((item) => item.name === '叠浪玄潮诀');
  const first = entry.techniques[0], second = entry.techniques[2];
  const player = { ...fullCombatProfile('许妍'), martialArts: [], techniques: [], resourceDefinitions: [],
    learnedTechniqueRefs: [{ registryId: entry.id, techniqueIds: [first.id], evidence: '已修成' }] };
  const preparation = await prepareEnemyCandidates({ registry, scope, playerCandidate: player, enemies: [{ id: 'e', name: '敌人' }] }, {
    includePlayer: true, requireProfiles: true, inference: { completeCandidate: async ({ side }) => side === 'player' ? player : fullCombatProfile() }
  });
  let emitted;
  const { root, button } = mount(t, preparation, (value) => { emitted = value; });
  const actor = root.querySelector('[data-candidate-id="player"]');
  const choice = actor.querySelector(`[data-learned-technique="${second.id}"]`);
  assert.equal(choice.checked, false);
  choice.checked = true; choice.dispatchEvent(new dom.window.Event('change', { bubbles: true })); await nextTick();
  assert.match(actor.textContent, /跳弓·碎潮/);
  const initial = actor.querySelector(`[data-learned-technique="${first.id}"]`);
  initial.checked = false; initial.dispatchEvent(new dom.window.Event('change', { bubbles: true })); await nextTick();
  for (const input of root.querySelectorAll('.xy-character-candidate > .xy-character-candidate__ack input')) {
    input.checked = true; input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  }
  await nextTick();
  assert.equal(button().disabled, false);
  button().click(); await nextTick();
  assert.deepEqual(emitted.edits.player.learnedTechniqueRefs[0].techniqueIds, [second.id]);
  assert.equal(actor.querySelector('[data-field-path="techniques.0.originalDefinition"] .xy-character-tree__edit'), null);
});
