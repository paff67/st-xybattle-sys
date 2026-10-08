import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { freezeCoreRules, assertCoreRules } from '../src/core-rules.js';
import { BattleHostAdapter } from '../src/host-adapter.js';
import { BattleController } from '../src/battle-controller.js';
import { createInitialState, startBattle, buildAdjudicationRequest, restoreBattle, validateAdjudication } from '../src/battle-state.js';
import { knownRules } from '../src/authoritative-rules.js';
import { HttpJsonAdjudicator } from '../src/adapters.js';
import { fullCombatProfile } from './fixtures/combat-profile.js';

const books = { '世界甲': { entries: { 25: { uid: 25, comment: '十境', content: '原文甲：十境与生命阶梯。\n末尾约束。' } } },
  '世界乙': { entries: { 25: { uid: 25, comment: '另一规则', content: '原文乙：同 UID 不同世界书。' } } } };
const selection = [{ book: '世界甲', uid: 25 }, { book: '世界乙', uid: 25 }];
const read = async book => structuredClone(books[book]);

test('core rules use book plus UID, freeze verbatim, fail closed on missing or corrupt content', async () => {
  const frozen = await freezeCoreRules(selection, read);
  assert.equal(frozen.length, 2); assert.notEqual(frozen[0].id, frozen[1].id);
  assert.equal(frozen[0].content, books['世界甲'].entries[25].content);
  assertCoreRules(frozen);
  await assert.rejects(freezeCoreRules([{ book: '不存在', uid: 25 }], read), /缺失/);
  await assert.rejects(freezeCoreRules([selection[0], selection[0]], read), /重复/);
  frozen[0].content += '篡改'; assert.throws(() => assertCoreRules(frozen), /校验失败/);
});

test('card-bound preferences survive chat switches, isolate same-name cards and reject stale saves', () => {
  let saves = 0;
  const context = { characters: [{ avatar: 'one.png', name: '同名' }, { avatar: 'two.png', name: '同名' }], characterId: 0,
    extensionSettings: {}, saveSettingsDebounced() { saves++; } };
  const host = new BattleHostAdapter({ contextProvider: () => context, windowRef: {}, documentRef: null });
  host.saveCoreRuleConfig(selection, 'one.png');
  context.chatId = 'another-chat'; assert.deepEqual(host.coreRuleConfig().selection, selection);
  context.characterId = 1; assert.deepEqual(host.coreRuleConfig().selection, []);
  assert.throws(() => host.saveCoreRuleConfig(selection, 'one.png'), /切换/);
  context.characterId = 0;
  assert.deepEqual(host.coreRuleConfig().selection, selection); assert.equal(saves, 1);
  host.dispose();
});

test('controller locks core config during battle and preparation, resets draft after an idle change', async () => {
  const controller = new BattleController({ storage: null, credentialStorage: null });
  let saved;
  controller.hostAdapter = { coreRuleConfig: () => ({ characterKey: 'one.png', selection: saved || [] }), saveCoreRuleConfig: (value, key) => { saved = value; return { characterKey: key, selection: value }; } };
  controller.saveCoreRuleConfig(selection, 'one.png');
  assert.deepEqual(saved, selection);
  assert.throws(() => controller.start(), /尚未加载/);
  controller.state.phase = 'awaiting_player';
  assert.throws(() => controller.saveCoreRuleConfig([], 'one.png'), /不能修改/);
  controller.state.phase = 'idle'; controller.preparationAbort = new AbortController();
  assert.throws(() => controller.saveCoreRuleConfig([], 'one.png'), /不能修改/);
  controller.preparationAbort = null; controller.saveCoreRuleConfig([], 'one.png');
  assert.deepEqual(controller.state.coreRules, []);
});

test('frozen rules persist and provide valid verdict citations independently of changed worldbooks', async () => {
  const state = startBattle(createInitialState({ coreRules: await freezeCoreRules(selection, read) }));
  assert.deepEqual(restoreBattle(state).coreRules, state.coreRules);
  const before = books['世界甲'].entries[25].content;
  books['世界甲'].entries[25].content = '之后修订';
  try {
    const request = buildAdjudicationRequest(state, { label: '观察' }, { adjudicationPrompt: '用户自己的提示词' });
    assert.equal(request.systemPrompt, '用户自己的提示词');
    assert.ok(request.coreRulesSystemPrompt.includes(JSON.stringify(before).slice(1, -1)));
    const ref = state.coreRules[0].id; assert.ok(knownRules(state).has(ref));
    const result = validateAdjudication({ summary: '未改变', before: state.semanticState, after: state.semanticState, reason: '依据境界底则', ruleRefs: [ref], publicEvents: [] }, state);
    assert.deepEqual(result.ruleRefs, [ref]);
    const corrupt = structuredClone(state); corrupt.coreRules[0].content += 'changed';
    assert.throws(() => restoreBattle(corrupt), /校验失败/);
  } finally { books['世界甲'].entries[25].content = before; }
});

test('host preparation freezes selected rules before AI and confirmation carries them into battle', async t => {
  const scope = { chatId: 'core-flow', branchId: 'main', available: true };
  let reads = 0, calls = 0;
  const hostAdapter = { scope: () => scope, context: () => ({ name1: '许妍', chat: [] }),
    coreRuleConfig: () => ({ characterKey: 'card.png', selection }),
    readCoreWorldbook: async name => { reads++; return read(name); } };
  const controller = new BattleController({ hostAdapter, storage: null, credentialStorage: null });
  t.after(() => controller.dispose()); await controller.ready;
  await controller.prepareCharacters({ context: { playerCandidate: fullCombatProfile('许妍') }, inference: {
    inferParticipants: async () => { calls++; assert.equal(reads, 2); return { candidates: [{ id: 'enemy', name: '厉沧海' }] }; },
    completeCandidate: async () => fullCombatProfile('厉沧海')
  } });
  controller.confirmCharacters(); controller.start();
  assert.equal(calls, 1); assert.equal(controller.state.coreRules.length, 2);
  assertCoreRules(controller.state.coreRules);
  assert.ok(buildAdjudicationRequest(controller.state, { label: '观察' }).coreRulesSystemPrompt);
});

test('HTTP judge and repair receive independent core system rules without replacing user prompt', async t => {
  const requests = [];
  const server = createServer((req, res) => { let data = ''; req.on('data', chunk => { data += chunk; }); req.on('end', () => {
    requests.push(JSON.parse(data)); res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ choices: [{ message: { content: '{}' } }] }));
  }); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const state = startBattle(createInitialState({ coreRules: await freezeCoreRules(selection, read) }));
  const request = buildAdjudicationRequest(state, { label: '观察' }, { adjudicationPrompt: 'USER PROMPT' });
  const adapter = new HttpJsonAdjudicator({ endpoint: `http://127.0.0.1:${server.address().port}`, model: 'transport-test' });
  await adapter.judge(request);
  await adapter.repair(request, {}, new Error('shape'));
  assert.equal(requests[0].messages[0].content, 'USER PROMPT');
  for (const body of requests) assert.ok(body.messages.some(message => message.role === 'system' && message.content === request.coreRulesSystemPrompt));
});
