import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeBattlefieldState, readAcuBattlefieldState, battlefieldProjection } from '../src/event-battlefield-state.js';
import { validateEventRoute, combatActivationCandidates } from '../src/event-router.js';
import { createAutomaticEventPreparation, validatePreparedEvidence } from '../src/event-preparation.js';
import { createEventContextReader } from '../src/event-context.js';
import { EVENT_DOMAINS } from '../src/event-domain-contracts.js';
import { preparationPrompt } from '../src/event-preparation-prompts.js';
import { inputDigest } from '../src/event-state.js';

const state = { 空间层: '下沉战界', 战界ID: '战界-001', 备案状态: '紧急备案', 战斗状态: '进行中' };
const table = (value = state, name = '全局数据表') => ({ sheet_0: { name, content: [['日期', ...Object.keys(value).map(key => `当前${key}`)], ['今天', ...Object.values(value)]] } });
const text = '我现在探查四周，也申请战界备案。';
function snapshot() {
  return { input: { id: 'input', text }, history: [{ id: 'history:0', text: '敌人已经向我攻击，四周是竹林。', role: 'assistant' }],
    scope: { chatId: 'chat', branchUid: 'branch' }, battlefield: battlefieldProjection({ 世界: { 战界: state } }, table()),
    sources: [{ id: 'input', kind: 'intent', branchKnown: true, data: text },
      { id: 'mvu', kind: 'mvu', branchKnown: true, data: { 主角: { 姓名: '许妍', 功法: { 听澜: { 习得: true, 定义: '感知水息', 招式: { 观澜: { 条件: '水息', 代价: '灵力' } } } } }, 世界: { 地点: '竹林' } } },
      { id: 'acu', kind: 'acu', branchKnown: false, data: { 位置: '别的分支' } }], assertFresh() {} };
}
const action = (domain = 'perception', extra = {}) => ({ localKey: 'a', domain, intent: '探查四周', execution: 'now', dependsOn: [],
  source: { id: 'input', quote: '探查四周' }, worldSignal: { kind: 'none', purpose: 'none', confrontation: 'none', evidence: [] }, ...extra });
const route = actions => ({ decision: 'adjudicate', actions, missingInformation: [] });
const evidence = () => ({ fields: {
  subject: [{ sourceId: 'mvu', pointer: '/主角/姓名' }], method: [{ sourceId: 'mvu', pointer: '/主角/功法/听澜' }],
  target: [{ sourceId: 'input', pointer: '', quote: '四周' }], environment: [{ sourceId: 'mvu', pointer: '/世界/地点' }],
}, missing: [], conflicts: [] });

test('four-field MVU and one-row ACU normalize to the same projection without mutating either', () => {
  const mvu = { 世界: { 战界: { ...state, 多余日志: [] } } }, acu = table();
  const before = JSON.stringify({ mvu, acu });
  const view = battlefieldProjection(mvu, acu);
  assert.deepEqual(view.current, state); assert.deepEqual(view.acuHint, state); assert.deepEqual(view.differences, []);
  assert.equal(view.acuBranchKnown, false); assert.equal(JSON.stringify({ mvu, acu }), before);
  assert.equal(normalizeBattlefieldState({ ...state, 战斗状态: '已备案' }).state, null);
  assert.equal(normalizeBattlefieldState({ ...state, 战界ID: '无' }).state, null);
  assert.equal(normalizeBattlefieldState(null).state, null);
});

test('ACU rejects historical rows, duplicate columns and ambiguous tables; alternate table is explicit only', () => {
  const many = table(); many.sheet_0.content.push(many.sheet_0.content[1]);
  assert.equal(readAcuBattlefieldState(many).state, null);
  const duplicate = table(); duplicate.sheet_0.content[0].push('当前战界ID');
  assert.equal(readAcuBattlefieldState(duplicate).state, null);
  const both = { ...table(), sheet_1: table().sheet_0 };
  assert.equal(readAcuBattlefieldState(both).state, null);
  const alternate = table(state, '当前战界表');
  assert.equal(readAcuBattlefieldState(alternate).state, null);
  assert.deepEqual(readAcuBattlefieldState(alternate, { tableName: '当前战界表' }).state, state);
});

test('registration alone, rescue and cultivation never emit a combat activation candidate', () => {
  for (const purpose of ['rescue', 'cultivation', 'training', 'unknown', 'combat']) {
    const r = validateEventRoute(route([action('battlefield', { worldSignal: { kind: 'registration_request', purpose,
      confrontation: purpose === 'combat' ? 'unknown' : 'linked', evidence: [{ id: 'input', quote: '申请战界备案' }] } })]), snapshot());
    assert.deepEqual(combatActivationCandidates(r, snapshot()), []);
  }
});

test('context-linked combat registration stages a resume candidate without executing; unregistered attacks also qualify', () => {
  const r = validateEventRoute(route([action('battlefield', { worldSignal: { kind: 'registration_request', purpose: 'combat',
    confrontation: 'linked', evidence: [{ id: 'history:0', quote: '敌人已经向我攻击' }] } })]), snapshot());
  const candidate = combatActivationCandidates(r, snapshot())[0];
  assert.equal(candidate.executable, false); assert.equal(candidate.mode, 'resume_candidate'); assert.equal(candidate.battleId, '战界-001');
  const s = snapshot(); s.battlefield.current = { 空间层: '现实', 战界ID: '无', 备案状态: '未备案', 战斗状态: '无' };
  assert.equal(combatActivationCandidates(validateEventRoute(route([action('combat')]), s), s)[0].mode, 'prepare_candidate');
});

test('contract rejects non-actionable grammar, forged evidence, unsupported domains, cyclic dependencies and too many actions', () => {
  for (const execution of ['planned', 'conditional', 'quoted', 'negated']) assert.throws(() => validateEventRoute(route([action('combat', { execution })]), snapshot()));
  assert.throws(() => validateEventRoute(route([action('magic')]), snapshot()));
  assert.throws(() => validateEventRoute(route([action('__proto__')]), snapshot()));
  assert.throws(() => validateEventRoute(route([action('combat', { source: { id: 'input', quote: '已经打赢' } })]), snapshot()));
  assert.throws(() => validateEventRoute(route([action('combat', { dependsOn: ['a'] })]), snapshot()));
  assert.throws(() => validateEventRoute(route([action('combat', { dependsOn: ['missing'] })]), snapshot()));
  assert.throws(() => validateEventRoute(route(Array.from({ length: 7 }, (_, i) => action('combat', { localKey: String(i) }))), snapshot()));
  assert.throws(() => validateEventRoute({ ...route([action()]), decision: 'pass' }, snapshot()));
  const sorted = validateEventRoute(route([action('perception', { dependsOn: ['b'] }), action('recovery', { localKey: 'b' })]), snapshot());
  assert.deepEqual(sorted.actions.map(item => item.localKey), ['b', 'a']);
});

test('ordinary pass uses one request, no module preparation, even with active battlefield state', async () => {
  let count = 0;
  const prepare = createAutomaticEventPreparation({ captureContext: async () => snapshot(), request: async () => { count++; return { decision: 'pass', actions: [], missingInformation: [] }; } });
  const result = await prepare({});
  assert.equal(count, 1); assert.equal(result.preparation, null); assert.deepEqual(result.activationCandidates, []);
});

test('automatic extraction preserves full method definitions and resolves evidence without manual confirmation', async () => {
  const calls = [];
  const prepare = createAutomaticEventPreparation({ captureContext: async () => snapshot(), request: async (prompt, context) => {
    calls.push({ prompt, context }); return calls.length === 1 ? route([action()]) : evidence();
  } });
  const result = await prepare({});
  assert.equal(result.decision, 'adjudicate'); assert.equal(result.preparation.status, 'ready'); assert.equal(result.preparation.executable, false);
  assert.equal(calls.length, 2); assert.match(calls[1].prompt, /探查/); assert.equal(calls[0].context.sources, undefined);
  assert.deepEqual(result.preparation.modules[0].fields.method[0].value.招式.观澜, { 条件: '水息', 代价: '灵力' });
});

test('missing facts, unanchored ACU and user-claimed abilities cannot satisfy required fact fields', () => {
  for (const refs of [[], [{ sourceId: 'acu', pointer: '/位置' }], [{ sourceId: 'input', pointer: '' }]]) {
    const raw = evidence(); raw.fields.method = refs;
    const result = validatePreparedEvidence('perception', raw, snapshot());
    assert.equal(result.status, 'needs_context'); assert.ok(result.missing.includes('method'));
  }
  const conflict = evidence(); conflict.conflicts = [{ field: 'environment', refs: [conflict.fields.environment[0], { sourceId: 'acu', pointer: '/位置' }] }];
  assert.equal(validatePreparedEvidence('perception', conflict, snapshot()).status, 'needs_context');
});

test('invalid pointers, invented quotes and unknown fields are rejected instead of AI-filled', () => {
  for (const pointer of ['/__proto__', '/constructor', '/主角/不存在', '/~3']) {
    const raw = evidence(); raw.fields.method = [{ sourceId: 'mvu', pointer }];
    assert.throws(() => validatePreparedEvidence('perception', raw, snapshot()));
  }
  const raw = evidence(); raw.fields.target[0].quote = '隐形杀手';
  assert.throws(() => validatePreparedEvidence('perception', raw, snapshot()));
  assert.throws(() => validatePreparedEvidence('perception', { ...evidence(), fields: { fabricated: [] } }, snapshot()));
});

test('conflicting current MVU/ACU battle projections block preparation without rewriting either', async () => {
  const s = snapshot(); s.battlefield = battlefieldProjection({ 世界: { 战界: state } }, table({ ...state, 战界ID: '战界-002' }));
  let calls = 0;
  const result = await createAutomaticEventPreparation({ captureContext: async () => s, request: async () => { calls++; return route([action('combat')]); } })({});
  assert.equal(calls, 1); assert.equal(result.decision, 'needs_context'); assert.equal(result.preparation.reason, 'battlefield_projection_conflict');
  assert.equal(result.activationCandidates[0].status, 'state_conflict');
});

test('every domain has an automatic preparation prompt and no mandatory enemy outside combat', () => {
  for (const [domain, contract] of Object.entries(EVENT_DOMAINS)) {
    assert.ok(preparationPrompt(domain).includes(contract.label));
    if (domain !== 'combat') assert.ok(!contract.required.includes('enemy'));
  }
});

async function hostFixture() {
  const prior = { is_user: false, mes: '上一轮', swipe_id: 0, variables: [{ stat_data: { 主角: { 姓名: '许妍' }, 世界: { 战界: state }, apiKey: 'must-remove' } }] };
  const input = { is_user: true, mes: text };
  const context = { chatId: 'chat', characterId: 0, characters: [{ avatar: 'a.png' }], chat: [prior, input, { is_user: false, mes: '不能读取的未来回复' }] };
  const event = { chatId: 'chat', branchUid: 'b', inputMessageUid: 'u', originalInputHash: await inputDigest(input) };
  return { prior, input, context, event, args: { message: input, event } };
}

test('context pins prior selected MVU, excludes future messages, strips credentials and keeps ACU a hint', async () => {
  const f = await hostFixture();
  const reader = createEventContextReader({ contextProvider: () => f.context, readAcu: async () => table() });
  const result = await reader(f.args);
  assert.equal(result.scope.anchorMessageId, 0); assert.equal(result.history.length, 1); assert.equal(result.history[0].text, '上一轮');
  assert.equal(result.sources.find(source => source.id === 'mvu').data.apiKey, undefined);
  assert.equal(result.sources.find(source => source.id === 'acu').branchKnown, false);
  f.prior.swipe_id = 1; assert.throws(() => result.assertFresh(), /分支/);
});

test('async input edits and in-place chat switches invalidate snapshots', async () => {
  for (const mutate of [f => { f.input.mes = '修改'; }, f => { f.context.chatId = 'other'; }, f => { f.prior.variables[0].stat_data.世界.战界 = { ...state, 战斗状态: '已结束' }; }]) {
    const f = await hostFixture();
    await assert.rejects(createEventContextReader({ contextProvider: () => f.context, readAcu: async () => { mutate(f); return table(); } })(f.args), /作用域/);
  }
});

test('future MVU schema is isolated in a reader adapter and first-input missing anchor is not guessed', async () => {
  const f = await hostFixture();
  const s = await createEventContextReader({ contextProvider: () => f.context,
    readMvu: async query => { assert.equal(query.messageId, 0); return { future: { 世界: { 战界: state } } }; }, adaptMvu: value => value.future })(f.args);
  assert.deepEqual(s.battlefield.current, state);
  f.context.chat = [f.input];
  const first = await createEventContextReader({ contextProvider: () => f.context, readMvu: async () => assert.fail('no anchor') })(f.args);
  assert.equal(first.scope.anchorMessageId, -1); assert.equal(first.sources.some(source => source.kind === 'mvu'), false);
});

test('stop during model extraction rejects late results', async () => {
  const controller = new AbortController();
  const prepare = createAutomaticEventPreparation({ captureContext: async () => snapshot(), request: async () => { controller.abort(); return route([action()]); } });
  await assert.rejects(prepare({ signal: controller.signal }), { name: 'AbortError' });
});

test('unread attachments do not fall through text-only routing', async () => {
  const f = await hostFixture(); f.input.extra = { image: '/attachment.png' };
  f.event.originalInputHash = await inputDigest(f.input);
  const result = await createAutomaticEventPreparation({ contextProvider: () => f.context, database: null,
    request: async () => assert.fail('must not assume image contains no actionable content') })(f.args);
  assert.equal(result.decision, 'needs_context'); assert.deepEqual(result.missingInformation, ['attachment_context_not_supported']);
});

test('missing latest MVU update never falls back to older narrative resources', async () => {
  const f = await hostFixture();
  f.context.chat.splice(1, 0, { is_user: false, mes: '刚消耗了资源，但 MVU 尚未更新', variables: [{}] });
  const s = await createEventContextReader({ contextProvider: () => f.context, mvu: null, database: null })(f.args);
  assert.equal(s.scope.anchorMessageId, 1);
  assert.equal(s.battlefield.current, null);
  assert.equal(s.sources.find(source => source.id === 'mvu')?.data?.主角, undefined);
});
