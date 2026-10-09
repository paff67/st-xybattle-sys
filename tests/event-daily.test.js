import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorkbenchEventRouter } from '../src/event-workbench.js';
import { validateDailyResult, createDailyExecutor } from '../src/event-daily.js';
import { DAILY_DOMAINS, dailyAdjudicationPrompt } from '../src/event-daily-prompts.js';
import { EVENT_DOMAINS } from '../src/event-domain-contracts.js';
import { battlefieldProjection } from '../src/event-battlefield-state.js';
import { eventBattleState, eventDailyChanges } from '../src/event-coordinator.js';

const source = { id: 'mvu', kind: 'mvu', branchKnown: true, data: { 主角: { 灵力: 10, 姓名: '许妍' }, method: '已掌握的疗伤功法及其适用条件' } };
const ref = { sourceId: 'mvu', pointer: '', value: source.data, sourceKind: 'mvu', branchKnown: true, empty: false };
const snapshot = () => ({ sources: [structuredClone(source)], input: { id: 'input', text: '尝试行动' }, history: [], battlefield: battlefieldProjection(null, null), scope: { chatId: 'test' } });
const result = () => ({ outcome: 'success', summary: '当前阶段完成', publicFacts: ['状态有所改善'], costs: ['消耗一点灵力'], effects: ['当前阶段完成'], duration: '当前阶段', missing: [], basis: [{ field: 'subject', index: 0, reason: '已知主体具备对应能力' }], changes: [{ sourceId: 'mvu', pointer: '/主角/灵力', before: 10, after: 9, reason: '资料中的既定消耗' }] });
const action = (domain = 'recovery', localKey = 'one', dependsOn = []) => ({ localKey, domain, intent: '尝试行动', source: { id: 'input', quote: '尝试行动' }, execution: 'now', dependsOn,
  worldSignal: { kind: 'none', purpose: 'none', confrontation: 'none', evidence: [] } });
const moduleFor = (domain, actionKey) => ({ domain, actionKey, status: 'ready', fields: { subject: [ref] } });
const routeFor = actions => ({ decision: 'adjudicate', actions, preparation: { modules: actions.map(a => moduleFor(a.domain, a.localKey)) } });
const context = extra => ({ snapshot: snapshot(), args: { event: { eventId: 'daily-test' } }, assertFresh() {}, ...extra });

test('every daily domain routes, extracts and judges silently with domain-specific prompts', async () => {
  for (const domain of DAILY_DOMAINS) {
    let calls = 0;
    const router = createWorkbenchEventRouter({ captureContext: async () => snapshot(), request: async (prompt, data) => {
      calls++;
      if (calls === 1) return { decision: 'adjudicate', missingInformation: [], actions: [action(domain)] };
      if (calls === 2) return { fields: Object.fromEntries(EVENT_DOMAINS[domain].required.map(key => [key, [{ sourceId: 'mvu', pointer: '' }]])), missing: [], conflicts: [] };
      assert.match(prompt, /专项约束/); assert.match(prompt, /不得引入 DC/);
      assert.ok(data.evidence); const value = result(); value.basis[0].field = EVENT_DOMAINS[domain].required[0]; return value;
    } });
    const output = await router({ event: { eventId: 'event' } });
    assert.equal(calls, 3); assert.equal(output.execution.schema, 'event_daily_commit_v1');
    assert.equal(output.execution.records[0].outcome, 'success');
    assert.equal(output.execution.packet.results[0].basis, undefined);
    assert.equal(output.execution.packet.results[0].changes[0].reason, undefined);
  }
});

test('resource proposals reject fake references, overdraw, duplicate updates and stale before values', () => {
  for (const edit of [r => { r.changes[0].after = -1; }, r => { r.changes[0].before = 100; }, r => { r.changes.push({ ...r.changes[0] }); }, r => { r.changes[0].pointer = '/主角/不存在'; }, r => { r.basis[0].index = 9; }, r => { r.basis[0].field = 'missing'; }, r => { r.changes[0].after = '9'; }]) {
    const raw = result(); edit(raw); assert.throws(() => validateDailyResult(raw, moduleFor('recovery', 'one'), snapshot()));
  }
  const unanchored = moduleFor('recovery', 'one'); unanchored.fields = { subject: [{ ...ref, branchKnown: false }] };
  assert.throws(() => validateDailyResult(result(), unanchored, snapshot()), /锚定/);
  assert.throws(() => dailyAdjudicationPrompt('combat'), /不支持/);
});

test('frozen definitions augment preparation without granting current facts or reaching combat handoff', async () => {
  let reads = 0, asks = 0;
  const definitions = { coreRules: [{ content: '测试底则' }], abilities: [] };
  const router = createWorkbenchEventRouter({ captureContext: async () => snapshot(), readDailyDefinitions: async () => { reads++; return definitions; }, request: async (_prompt, data) => {
    asks++;
    if (asks === 1) return { decision: 'adjudicate', missingInformation: [], actions: [action()] };
    if (asks === 2) {
      assert.equal(data.sources.at(-1).branchKnown, false);
      return { fields: Object.fromEntries(['subject', 'injury', 'method'].map(key => [key, [{ sourceId: 'mvu', pointer: '' }]])), missing: [], conflicts: [] };
    }
    assert.deepEqual(data.definitions, definitions); return result();
  } });
  assert.equal((await router({ event: { eventId: 'test' } })).execution.status, 'validated'); assert.equal(reads, 1);
  const combat = createWorkbenchEventRouter({ captureContext: async () => snapshot(), readDailyDefinitions: async () => { throw new Error('must not read'); }, request: async () => ({ decision: 'adjudicate', actions: [action('combat')], missingInformation: [] }) });
  assert.equal((await combat({})).decision, 'handoff');
});

test('dependent actions see sequential resource balances; input snapshot stays immutable', async () => {
  let calls = 0;
  const execute = createDailyExecutor({ request: async (_prompt, data) => {
    const raw = result(); if (calls++) { assert.equal(data.currentResources[0].value, 9); assert.equal(data.previousResults.length, 1); raw.changes[0].before = 9; raw.changes[0].after = 8; } return raw;
  } });
  const ctx = context(); const output = await execute(routeFor([action(), action('cultivation', 'two', ['one'])]), ctx);
  assert.equal(calls, 2); assert.equal(output.execution.changes[0].after, 8); assert.equal(ctx.snapshot.sources[0].data.主角.灵力, 10);
});

test('failed prerequisites skip dependent work and missing context commits no prefix', async () => {
  for (const outcome of ['failure', 'partial', 'in_progress', 'blocked', 'needs_context']) {
    let calls = 0;
    const execute = createDailyExecutor({ request: async () => { calls++; const raw = result(); raw.outcome = outcome; raw.changes = []; raw.costs = []; raw.effects = []; if (outcome === 'needs_context') { raw.publicFacts = []; raw.missing = ['伤势']; } return raw; } });
    const output = await execute(routeFor([action(), action('recovery', 'two', ['one'])]), context());
    assert.equal(calls, 1);
    if (outcome === 'needs_context') { assert.equal(output.decision, 'needs_context'); assert.equal(output.execution, undefined); }
    else assert.equal(output.execution.records[1].outcome, 'skipped');
  }
  let calls = 0;
  await assert.rejects(createDailyExecutor({ request: async () => { if (calls++) throw new Error('second request failed'); return result(); } })(routeFor([action(), action('recovery', 'two', ['one'])]), context()), /second request/);
});

test('late result, missing projection and mixed domains cannot produce a daily commit', async () => {
  let changed = false, calls = 0;
  const execute = createDailyExecutor({ request: async () => { calls++; changed = true; return result(); } });
  await assert.rejects(execute(routeFor([action()]), context({ assertFresh() { if (changed) throw new Error('stale'); } })), /stale/);
  const output = await execute(routeFor([action()]), context({ args: { dailyChanges: [{ sourceId: 'mvu', pointer: '/主角/灵力', after: 9 }] } }));
  assert.equal(output.reasonCode, 'daily_projection_pending'); assert.equal(calls, 1);
  assert.equal((await execute(routeFor([action(), action('combat', 'two')]), context())).decision, 'unsupported');
});

test('daily receipts cannot mask combat lineage or freeze historical MVU resources', () => {
  const root = { events: { a: { status: 'committed', execution: { schema: 'event_combat_commit_v1', status: 'committed', afterState: { combat: true } } }, b: { parentEventId: 'a', status: 'committed', execution: { schema: 'event_daily_commit_v1', status: 'committed', changes: [{ pointer: '/x', after: 2 }] } }, c: { parentEventId: 'b', status: 'passed' } } };
  assert.deepEqual(eventBattleState(root, { parentEventId: 'b' }), { combat: true });
  assert.equal(eventDailyChanges(root, { parentEventId: 'b' }).length, 1);
  assert.deepEqual(eventDailyChanges(root, { parentEventId: 'c' }), []);
});
