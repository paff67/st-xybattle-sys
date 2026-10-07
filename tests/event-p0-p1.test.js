import test from 'node:test';
import assert from 'node:assert/strict';
import { EventCoordinator } from '../src/event-coordinator.js';
import { HostEventStore } from '../src/event-store.js';
import { EventOperationLock } from '../src/event-lock.js';
import { HostGenerationGate, EVENT_INTERCEPTOR_NAME } from '../src/host-generation-gate.js';
import { EVENT_NAMESPACE as NS, inputDigest, emptyEventStore } from '../src/event-state.js';
import { createAutomaticEventPreparation } from '../src/event-preparation.js';
import { createEventCombatPipeline } from '../src/event-combat.js';
import { scenarioRoot } from './fixtures/event-model-scenarios.js';
import { responseFor, preparationRequest } from './fixtures/event-execution-fixture.js';

const copy = value => JSON.parse(JSON.stringify(value));
const tick = () => new Promise(resolve => setImmediate(resolve));
async function until(predicate) { for (let i = 0; i < 100; i++) { if (predicate()) return; await tick(); } throw new Error('condition not reached'); }
class Events {
  events = new Map();
  on(key, fn) { if (!this.events.has(key)) this.events.set(key, new Set()); this.events.get(key).add(fn); }
  off(key, fn) { this.events.get(key)?.delete(fn); }
  async emit(key, ...args) { for (const fn of [...this.events.get(key) || []]) await fn(...args); }
}
const user = text => ({ is_user: true, mes: text, extra: { unrelated: 'keep' } });
const assistant = text => ({ is_user: false, mes: text, extra: {}, swipe_id: 0, swipes: [text], swipe_info: [{ extra: {} }] });
function fixture({ router = async () => ({ decision: 'pass' }), timeoutMs = 1000 } = {}) {
  let n = 0, routes = 0, saves = 0, skipSave = false;
  const id = () => `test-id-${++n}`, events = new Events(), disks = new Map();
  const types = Object.fromEntries(['GENERATION_STARTED', 'GENERATION_STOPPED', 'GENERATION_ENDED', 'MESSAGE_SENT', 'MESSAGE_RECEIVED', 'CHAT_CHANGED', 'MESSAGE_SWIPED', 'MESSAGE_EDITED', 'MESSAGE_DELETED'].map(k => [k, k]));
  let c;
  function select(chatId = 'chat-A', rows) {
    c = { chatId, characterId: 0, characters: [{ name: 'test', avatar: 'test.png' }], chat: rows || [], chatMetadata: {}, eventSource: events, eventTypes: types,
      saveChat: async () => { saves++; if (!skipSave) disks.set(c.chatId, copy([{ chat_metadata: c.chatMetadata }, ...c.chat])); } };
    if (!disks.has(chatId)) disks.set(chatId, []);
    return c;
  }
  select();
  const store = new HostEventStore({ contextProvider: () => c, readRemote: async scope => copy(disks.get(scope.chatId)), id });
  const lock = new EventOperationLock({ locks: null });
  const coordinator = new EventCoordinator({ store, lock, id, timeoutMs, router: async args => { routes++; return router(args); } });
  const windowRef = {};
  const gate = new HostGenerationGate({ coordinator, contextProvider: () => c, windowRef, id }).start();
  return { store, lock, coordinator, gate, events, windowRef, context: () => c, id,
    get routes() { return routes; }, get saves() { return saves; }, disks,
    setSkipSave(value) { skipSave = value; }, select,
    async start(text = 'same', kind = 'normal') {
      await events.emit('GENERATION_STARTED', kind, {}, false);
      if (kind === 'normal') { c.chat.push(user(text)); await events.emit('MESSAGE_SENT', c.chat.length - 1); }
      let aborted = 0;
      await gate.intercept([], 8192, () => aborted++, kind);
      return { aborted, event: coordinator.active?.event };
    },
    async story({ reverse = false } = {}) {
      const kind = gate.intent.kind;
      c.chat.push(assistant('story'));
      const at = c.chat.length - 1;
      if (reverse) await events.emit('GENERATION_ENDED', c.chat.length);
      await events.emit('MESSAGE_RECEIVED', at, kind);
      if (!reverse) await events.emit('GENERATION_ENDED', c.chat.length);
    },
    reload() { const disk = copy(disks.get(c.chatId)); c.chat = disk.slice(1); c.chatMetadata = disk[0]?.chat_metadata || {}; },
  };
}

test('P0 disabled install and disposal are idempotent and do not affect native generation', async () => {
  const f = fixture(); f.gate.start();
  assert.equal(f.events.events.get('GENERATION_STARTED').size, 1);
  assert.equal(f.windowRef[EVENT_INTERCEPTOR_NAME], f.gate.interceptor);
  assert.equal((await f.start()).aborted, 0); assert.equal(f.routes, 0); assert.equal(f.saves, 0);
  f.gate.dispose(); f.gate.dispose();
  assert.equal(f.events.events.get('GENERATION_STARTED').size, 0);
  assert.equal(f.windowRef[EVENT_INTERCEPTOR_NAME], undefined);
});

function combatFixture() {
  let pipeline, judges = 0, injected = 0, cleared = 0;
  const f = fixture({ router: args => pipeline(args), timeoutMs: 2000 });
  const prior = assistant('林澜和石衡在战界中相距五米，正在交战。'); prior.variables = [{ stat_data: scenarioRoot() }];
  f.context().chat.push(prior);
  f.windowRef.TavernHelper = { injectPrompts(prompts, options) {
    assert.equal(options.once, true); assert.equal(prompts[0].should_scan, false);
    assert.ok(prompts[0].content.includes('XY_EVENT_RESULT')); assert.ok(!prompts[0].content.includes('narrativeProfile'));
    injected++; return { uninject() { cleared++; } };
  } };
  pipeline = createEventCombatPipeline({ contextProvider: f.context, database: null, request: preparationRequest(), adjudicator: { judge: async request => { judges++; return responseFor(request); } } });
  return { ...f, f, counters: () => ({ judges, injected, cleared }) };
}

test('P3 P0/P1 integration saves combat before one internal injection; regenerate never judges or deducts again', async () => {
  const { f, counters } = combatFixture(); await f.gate.setEnabled(true);
  const first = await f.start('我用水击攻击石衡'); assert.equal(first.aborted, 0);
  const id = first.event.eventId; assert.equal(first.event.status, 'committed');
  assert.equal(f.disks.get('chat-A')[0].chat_metadata[NS].events[id].execution.afterState.actors.player.resources.灵力, 8);
  assert.equal(f.context().chat[1].mes, '我用水击攻击石衡'); await f.story();
  f.context().chat.pop();
  const retry = await f.start('', 'regenerate'); assert.equal(retry.aborted, 0); assert.equal(retry.event.eventId, id);
  assert.equal(retry.event.execution.afterState.actors.player.resources.灵力, 8); await f.story();
  assert.deepEqual(counters(), { judges: 1, injected: 2, cleared: 2 });
  const second = await f.start('我再次用水击攻击石衡'); assert.equal(second.event.execution.afterState.actors.player.resources.灵力, 6);
  await f.story(); assert.equal(counters().judges, 2);
});

test('P3 committed result survives missing injection capability and can regenerate after repair', async () => {
  const { f, counters } = combatFixture(); const helper = f.windowRef.TavernHelper; delete f.windowRef.TavernHelper;
  await f.gate.setEnabled(true); assert.equal((await f.start('水击石衡')).aborted, 1);
  const committed = Object.values(f.context().chatMetadata[NS].events)[0]; assert.equal(committed.status, 'committed');
  assert.equal(committed.generationBindings[0].status, 'narrative_failed'); assert.equal(f.lock.owner, null);
  f.windowRef.TavernHelper = helper;
  assert.equal((await f.start('', 'regenerate')).aborted, 0); await f.story(); assert.equal(counters().judges, 1);
});

test('P3 deleting committed input invalidates only descendant domain snapshots; original MVU remains unchanged', async () => {
  const { f } = combatFixture(); await f.gate.setEnabled(true);
  const first = await f.start('水击石衡'); await f.story(); const second = await f.start('再次水击石衡'); await f.story();
  f.context().chat.splice(1); await f.events.emit('MESSAGE_DELETED'); await f.coordinator.recover();
  const root = f.context().chatMetadata[NS]; assert.equal(root.events[first.event.eventId].status, 'rolled_back'); assert.equal(root.events[second.event.eventId].status, 'rolled_back');
  const replacement = await f.start('水击石衡'); assert.equal(replacement.event.execution.afterState.actors.player.resources.灵力, 8);
  assert.equal(f.context().chat[0].variables[0].stat_data.主角.资源.灵力.当前, 10); await f.story();
});

test('automatic preparation persists referenced evidence but cannot release an unimplemented domain', async () => {
  for (const missing of [false, true]) {
    let pipeline, requests = 0;
    const f = fixture({ router: args => pipeline(args) });
    const prior = assistant('许妍正在竹林，以听澜感知水息。');
    prior.variables = [{ stat_data: { 主角: { 姓名: '许妍', 功法: { 听澜: { 定义: '感知水息', 代价: '灵力' } } }, 世界: { 地点: '竹林' } } }];
    f.context().chat.push(prior);
    pipeline = createAutomaticEventPreparation({ contextProvider: f.context, database: null, request: async () => {
      requests++;
      if (requests === 1) return { decision: 'adjudicate', actions: [{ localKey: 'p', domain: 'perception', intent: '探查竹林', execution: 'now', dependsOn: [],
        source: { id: 'input', quote: '探查竹林' }, worldSignal: { kind: 'none', purpose: 'none', confrontation: 'none', evidence: [] } }], missingInformation: [] };
      return { fields: { subject: [{ sourceId: 'mvu', pointer: '/主角/姓名' }],
        method: missing ? [] : [{ sourceId: 'mvu', pointer: '/主角/功法/听澜' }],
        target: [{ sourceId: 'input', pointer: '', quote: '竹林' }], environment: [{ sourceId: 'mvu', pointer: '/世界/地点' }] }, missing: [], conflicts: [] };
    } });
    await f.gate.setEnabled(true);
    assert.equal((await f.start('探查竹林')).aborted, 1);
    const event = Object.values(f.context().chatMetadata[NS].events)[0];
    assert.equal(event.status, missing ? 'needs_input' : 'unsupported');
    assert.equal(event.route.preparation.status, missing ? 'needs_context' : 'ready');
    assert.equal(event.route.actions[0].domain, 'perception'); assert.equal(event.generationBindings.length, 0);
    assert.equal(requests, 2); assert.equal(f.lock.owner, null);
    assert.deepEqual(f.disks.get('chat-A')[2].extra[NS].receipts[event.eventId].route, event.route);
  }
});

test('P1 first input without assistant anchor saves identity before pass and binds the exact story', async () => {
  const f = fixture(); await f.gate.setEnabled(true);
  const result = await f.start('hello');
  assert.equal(result.aborted, 0); assert.equal(result.event.status, 'passed'); assert.equal(f.context().chat.length, 1);
  const saved = f.disks.get('chat-A');
  assert.equal(saved[1].extra.unrelated, 'keep');
  assert.equal(saved[1].extra[NS].receipts[result.event.eventId].status, 'passed');
  await f.story();
  const root = f.context().chatMetadata[NS];
  assert.equal(root.events[result.event.eventId].generationBindings[0].status, 'completed');
  assert.equal(f.context().chat[1].extra[NS].story.eventId, result.event.eventId);
  assert.equal(f.context().chat[1].mes, 'story');
  assert.equal(f.lock.owner, null);
});

test('P1 streaming ENDED before RECEIVED does not guess the latest assistant', async () => {
  const f = fixture(); await f.gate.setEnabled(true); const result = await f.start();
  await f.story({ reverse: true });
  assert.equal(f.context().chatMetadata[NS].events[result.event.eventId].generationBindings[0].status, 'completed');
});

test('P0 held asynchronous route issues no pass until released; duplicate callbacks do not reroute', async () => {
  let release;
  const f = fixture({ router: () => new Promise(resolve => { release = resolve; }) }); await f.gate.setEnabled(true);
  const pending = f.start(); await until(() => release);
  let aborted = 0; await f.gate.intercept([], 0, () => aborted++, 'normal');
  assert.equal(aborted, 1); assert.equal(f.routes, 1); assert.equal(f.coordinator.active.generating, undefined);
  release({ decision: 'pass' }); assert.equal((await pending).aborted, 0); await f.story();
});

test('P0 stop aborts a non-cooperative router and releases the writer without sending', async () => {
  const f = fixture({ router: () => new Promise(() => {}) }); await f.gate.setEnabled(true);
  const pending = f.start('cancel'); await until(() => f.routes === 1);
  await f.events.emit('GENERATION_STOPPED');
  assert.equal((await pending).aborted, 1);
  assert.equal(f.lock.owner, null); assert.equal(f.context().chat[0].mes, 'cancel');
  assert.equal(Object.values(f.context().chatMetadata[NS].events)[0].status, 'cancelled');
});

test('P0 malformed or throwing routes fail closed; timeout cannot silently pass', async () => {
  for (const router of [async () => null, async () => { throw new Error('bad json'); }, () => new Promise(() => {})]) {
    const f = fixture({ router, timeoutMs: 10 }); await f.gate.setEnabled(true);
    assert.equal((await f.start()).aborted, 1);
    assert.equal(f.lock.owner, null); assert.equal(Object.values(f.context().chatMetadata[NS].events)[0].status, 'rejected');
  }
});

test('P1 unsupported and not-yet-implemented adjudication never run a story', async () => {
  for (const decision of ['unsupported', 'adjudicate', 'needs_context']) {
    const f = fixture({ router: async () => ({ decision }) }); await f.gate.setEnabled(true);
    assert.equal((await f.start()).aborted, 1); assert.equal(f.routes, 1);
    assert.notEqual(Object.values(f.context().chatMetadata[NS].events)[0].status, 'passed');
  }
});

test('P1 two actual identical sends create different input/event identities', async () => {
  const f = fixture(); await f.gate.setEnabled(true);
  const a = (await f.start()).event; await f.story();
  const b = (await f.start()).event; await f.story();
  assert.notEqual(a.inputMessageUid, b.inputMessageUid); assert.notEqual(a.eventId, b.eventId);
  assert.equal(b.parentEventId, a.eventId); assert.equal(f.routes, 2);
});

test('P1 regeneration reuses a passed event without routing again', async () => {
  const f = fixture(); await f.gate.setEnabled(true);
  const a = (await f.start()).event; await f.story();
  f.context().chat.pop();
  const b = (await f.start(null, 'regenerate')).event;
  assert.equal(a.eventId, b.eventId); assert.equal(f.routes, 1);
  await f.story(); assert.equal(b.generationBindings.length, 2);
});

test('P0 native regenerate assistant deletion preserves the already captured request', async () => {
  const f = fixture(); await f.gate.setEnabled(true); const first = (await f.start()).event; await f.story();
  await f.events.emit('GENERATION_STARTED', 'regenerate', {}, false);
  const requestId = f.gate.intent.requestId;
  f.context().chat.pop(); await f.events.emit('MESSAGE_DELETED', f.context().chat.length);
  let aborted = 0; await f.gate.intercept([], 0, () => aborted++, 'regenerate');
  assert.equal(aborted, 0); assert.equal(f.coordinator.active.requestId, requestId);
  assert.equal(f.coordinator.active.event.eventId, first.eventId); assert.equal(f.routes, 1); await f.story();
});

test('P1 deleted assistant does not revoke the input event; deleted input invalidates dependent chain', async () => {
  const f = fixture(); await f.gate.setEnabled(true);
  const a = (await f.start('a')).event; await f.story();
  const b = (await f.start('b')).event; await f.story();
  f.context().chat.pop(); await f.coordinator.recover();
  assert.equal(f.context().chatMetadata[NS].events[b.eventId].status, 'passed');
  f.context().chat.splice(0, 1); await f.coordinator.recover();
  assert.equal(f.context().chatMetadata[NS].events[a.eventId].status, 'rolled_back');
  assert.equal(f.context().chatMetadata[NS].events[b.eventId].status, 'rolled_back');
});

test('P1 input edits invalidate old identity revision; attachments participate in the digest', async () => {
  const f = fixture(); await f.gate.setEnabled(true);
  const a = (await f.start()).event; await f.story();
  const m = f.context().chat[0], old = await inputDigest(m);
  m.extra.media = [{ url: '/user/images/a.png', type: 'image' }];
  assert.notEqual(await inputDigest(m), old);
  f.context().chat.pop();
  const b = (await f.start(null, 'regenerate')).event;
  assert.equal(b.inputRevision, 2); assert.notEqual(b.eventId, a.eventId);
  assert.equal(f.context().chatMetadata[NS].events[a.eventId].status, 'rolled_back');
  await f.story();
});

test('P1 saveChat resolving without server persistence blocks main request and retry saves identical proposal', async () => {
  const f = fixture(); await f.gate.setEnabled(true); f.setSkipSave(true);
  assert.equal((await f.start()).aborted, 1); assert.equal(f.routes, 0);
  assert.equal(f.coordinator.lastStatus.status, 'persistence_pending');
  const pendingId = Object.keys(f.store.pending.candidate.events)[0];
  f.setSkipSave(false); await f.coordinator.retryPersistence();
  assert.equal(Object.keys(f.disks.get('chat-A')[0].chat_metadata[NS].events)[0], pendingId);
  assert.equal(f.routes, 0); assert.equal(f.store.pending, null);
});

test('P1 waits for delayed server visibility after save without writing twice', async () => {
  const f = fixture();
  let reads = 0;
  const read = f.store.readRemote;
  f.store.readRemote = async scope => {
    const rows = await read(scope);
    if (f.saves && ++reads <= 2) return [];
    return rows;
  };
  const result = await f.store.write(f.store.scope(), emptyEventStore('chat-A', f.id));
  assert.equal(result.revision, 1);
  assert.equal(f.saves, 1);
  assert.equal(f.store.pending, null);
});

test('P0 regenerate binds native normal MESSAGE_RECEIVED to captured request', async () => {
  const f = fixture(); await f.gate.setEnabled(true);
  await f.start(); await f.story(); f.context().chat.pop();
  const retry = await f.start(null, 'regenerate');
  assert.equal(retry.aborted, 0);
  f.context().chat.push(assistant('regenerated story'));
  await f.events.emit('MESSAGE_RECEIVED', f.context().chat.length - 1, 'normal');
  await f.events.emit('GENERATION_ENDED', f.context().chat.length);
  assert.equal(f.coordinator.lastStatus.status, 'completed');
  assert.equal(f.gate.intent, null);
});

test('P1 route result persistence retry never calls the router a second time', async () => {
  const f = fixture({ router: async () => { f.setSkipSave(true); return { decision: 'pass' }; } });
  await f.gate.setEnabled(true); assert.equal((await f.start()).aborted, 1);
  assert.equal(f.routes, 1); f.setSkipSave(false); await f.coordinator.retryPersistence();
  const root = f.context().chatMetadata[NS]; assert.equal(Object.values(root.events)[0].status, 'passed');
  assert.equal((await f.start(null, 'regenerate')).aborted, 0); assert.equal(f.routes, 1); await f.story();
});

test('P1 stale remote revision refuses overwrite before save', async () => {
  const f = fixture(); await f.gate.setEnabled(true); await f.start(); await f.story();
  const remote = f.disks.get('chat-A')[0].chat_metadata[NS]; remote.revision++;
  const saves = f.saves; assert.equal((await f.start('next')).aborted, 1); assert.equal(f.saves, saves);
});

test('P1 changing chat discards delayed router output and never writes the new chat', async () => {
  let release; const f = fixture({ router: () => new Promise(resolve => { release = resolve; }) }); await f.gate.setEnabled(true);
  const pending = f.start(); await until(() => release);
  f.select('chat-B'); await f.events.emit('CHAT_CHANGED'); release({ decision: 'pass' });
  assert.equal((await pending).aborted, 1); assert.equal(f.context().chatMetadata[NS], undefined); assert.equal(f.lock.owner, null);
});

test('P1 reload recovers interrupted routing as needs_input without auto routing', async () => {
  const f = fixture(); await f.gate.setEnabled(true); const event = (await f.start()).event; await f.story();
  const disk = f.disks.get('chat-A'); disk[0].chat_metadata[NS].events[event.eventId].status = 'routing';
  f.reload(); const routes = f.routes;
  await f.coordinator.recover(); assert.equal(f.routes, routes);
  assert.equal(f.context().chatMetadata[NS].events[event.eventId].status, 'needs_input');
});

test('P0 dry-run, pure command and auxiliary GAC cannot create event identities', async () => {
  const f = fixture(); await f.gate.setEnabled(true);
  await f.events.emit('GENERATION_STARTED', 'normal', {}, true);
  assert.equal(f.gate.intent, null);
  await f.events.emit('GENERATION_AFTER_COMMANDS', 'normal', {}, false);
  assert.equal(f.routes, 0); assert.equal(f.saves, 0);
});

test('P0 unknown source with official interceptor fails closed when enabled', async () => {
  const f = fixture(); await f.gate.setEnabled(true);
  let aborted = false; await f.gate.intercept([], 0, () => aborted = true, 'normal'); assert.equal(aborted, true);
});

test('P1 manual operation and automatic story share one writer', async () => {
  const f = fixture(); await f.gate.setEnabled(true); await f.start();
  await assert.rejects(f.lock.run('test.png:chat-A', 'manual-battle', async () => {}), /另一项事务/);
  await f.story(); assert.equal(await f.lock.run('test.png:chat-A', 'manual-battle', async () => 'ok'), 'ok');
});

test('P1 origin-wide writer lock denies another tab and releases after operation', async () => {
  let held = false;
  const locks = { async request(_key, _options, fn) { if (held) return fn(null); held = true; try { return await fn({}); } finally { held = false; } } };
  const a = new EventOperationLock({ locks }), b = new EventOperationLock({ locks });
  const release = await a.acquire('same-chat', 'a');
  await assert.rejects(b.acquire('same-chat', 'b'), /另一标签页/); release(); await tick();
  const releaseB = await b.acquire('same-chat', 'b'); releaseB();
});

test('P1 pending persistence cannot confirm a receipt against edited input', async () => {
  const f = fixture(); await f.gate.setEnabled(true); f.setSkipSave(true); await f.start('before');
  f.context().chat[0].mes = 'after'; f.setSkipSave(false);
  await assert.rejects(f.coordinator.retryPersistence(), /内容已改变/);
  assert.equal(f.disks.get('chat-A').length, 0);
});

test('P1 A/B prior-assistant branches isolate the same user input and recover A without rerouting', async () => {
  const f = fixture(); const opening = assistant('A'); opening.swipes.push('B'); opening.swipe_info.push({ extra: {} });
  f.context().chat.push(opening); await f.context().saveChat(); await f.gate.setEnabled(true);
  const a = (await f.start()).event; await f.story(); f.context().chat.pop();
  opening.swipe_id = 1; opening.mes = 'B'; opening.extra = copy(opening.swipe_info[1].extra);
  await f.events.emit('MESSAGE_SWIPED');
  const b = (await f.start(null, 'regenerate')).event; await f.story(); f.context().chat.pop();
  assert.notEqual(a.branchUid, b.branchUid); assert.notEqual(a.eventId, b.eventId);
  opening.swipe_id = 0; opening.mes = 'A'; opening.extra = copy(opening.swipe_info[0].extra);
  await f.events.emit('MESSAGE_SWIPED');
  const back = (await f.start(null, 'regenerate')).event;
  assert.equal(back.eventId, a.eventId); assert.equal(f.routes, 2); await f.story();
});

test('P1 native new swipe copied extra receives a fresh stable swipe identity', async () => {
  const f = fixture(); await f.gate.setEnabled(true); await f.start(); await f.story();
  const a = f.context().chat[1], firstUid = a.extra[NS].swipeUid;
  a.swipes.push('new'); a.swipe_info.push(copy(a.swipe_info[0])); a.swipe_id = 1; a.mes = 'new';
  await f.events.emit('MESSAGE_SWIPED');
  const next = await f.start('next');
  assert.equal(next.aborted, 0); assert.notEqual(a.extra[NS].swipeUid, firstUid); await f.story();
});

test('P1 array index shifts alone do not create new event identity', async () => {
  const f = fixture(); await f.gate.setEnabled(true); const a = (await f.start()).event; await f.story();
  f.context().chat.pop(); f.context().chat.unshift({ is_system: true, mes: 'system insertion' });
  const b = (await f.start(null, 'regenerate')).event; assert.equal(b.eventId, a.eventId); await f.story();
});

test('P0 command-like generation start cannot leave a stale identity on the next real send', async () => {
  const f = fixture(); await f.gate.setEnabled(true);
  await f.events.emit('GENERATION_STARTED', 'normal', {}, false); const old = f.gate.intent.requestId;
  const next = await f.start(); assert.notEqual(next.event.requestId, old); await f.story();
});

test('P0 missing completion message releases the lock as narrative_failed, not guessed success', async () => {
  const f = fixture(); f.gate.completionTimeoutMs = 5; await f.gate.setEnabled(true);
  const { event } = await f.start(); await f.events.emit('GENERATION_ENDED', 1);
  await new Promise(resolve => setTimeout(resolve, 20));
  assert.equal(f.lock.owner, null);
  assert.equal(f.context().chatMetadata[NS].events[event.eventId].generationBindings[0].status, 'narrative_failed');
});

test('P1 interrupted pending narrative on reload becomes retryable without automatic generation', async () => {
  const f = fixture(); await f.gate.setEnabled(true); const { event } = await f.start();
  f.gate.dispose(); f.reload(); const routes = f.routes;
  await f.coordinator.recover();
  assert.equal(f.routes, routes);
  assert.equal(f.context().chatMetadata[NS].events[event.eventId].generationBindings[0].status, 'narrative_failed');
});

test('P0 disabling while routing cancels and releases rather than allowing stale result', async () => {
  const f = fixture({ router: () => new Promise(() => {}) }); await f.gate.setEnabled(true);
  const pending = f.start(); await until(() => f.routes);
  await f.gate.setEnabled(false); assert.equal((await pending).aborted, 1); assert.equal(f.lock.owner, null);
});

test('P1 backend reader uses current character/chat and CSRF headers without persisting credentials', async () => {
  const f = fixture(); const calls = [];
  f.context().getRequestHeaders = () => ({ 'X-CSRF-Token': 'fixture-secret' });
  const store = new HostEventStore({ contextProvider: f.context, fetchRef: async (url, init) => { calls.push([url, init]); return { ok: true, json: async () => [] }; } });
  const root = await store.load();
  assert.equal(calls[0][0], '/api/chats/get');
  assert.deepEqual(JSON.parse(calls[0][1].body), { ch_name: 'test', file_name: 'chat-A', avatar_url: 'test.png' });
  assert.doesNotMatch(JSON.stringify(root), /fixture-secret/);
});


test('workbench handoff blocks story, releases P1 lock and reuses durable handoff without adjudication', async () => {
  const f = fixture({ router: async () => ({ decision: 'handoff', reasonCode: 'battle_workbench_preparation' }) });
  let handoffs = 0;
  f.gate.onCombatHandoff = event => { assert.equal(f.lock.owner, null); assert.equal(event.execution, undefined); handoffs++; };
  await f.gate.setEnabled(true);
  assert.equal((await f.start('迎击顾澜')).aborted, 1);
  assert.equal(handoffs, 1);
  assert.equal(Object.values(f.context().chatMetadata[NS].events)[0].status, 'handed_off');
  assert.equal((await f.start('', 'regenerate')).aborted, 1);
  assert.equal(handoffs, 2); assert.equal(f.routes, 1);
  f.gate.dispose();
});

test('passed scene request observes only its completed assistant after the generation lock is released', async () => {
  const f = fixture(); let observed = 0;
  f.gate.afterNarrative = ({ message, input, event, signal }) => {
    assert.equal(f.lock.owner, null); assert.equal(event.status, 'passed');
    assert.equal(message, f.context().chat[1]); assert.equal(input, f.context().chat[0]);
    assert.equal(signal.aborted, false); observed++;
  };
  await f.gate.setEnabled(true); await f.start('创建战斗场景');
  await f.story({ reverse: true }); assert.equal(observed, 1);
  await f.events.emit('GENERATION_ENDED'); assert.equal(observed, 1);
  f.gate.dispose();
});
