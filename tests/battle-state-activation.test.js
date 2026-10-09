import test from 'node:test';
import assert from 'node:assert/strict';
import { observeBattleState, activationFingerprint, selectedMvu } from '../src/battle-state-observer.js';
import { HostMvuObserver } from '../src/host-mvu-observer.js';
import { BattleEntryCoordinator } from '../src/battle-entry-coordinator.js';
import { EventCoordinator } from '../src/event-coordinator.js';
import { HostEventStore } from '../src/event-store.js';
import { EventOperationLock } from '../src/event-lock.js';
import { HostGenerationGate } from '../src/host-generation-gate.js';
import { BattleController } from '../src/battle-controller.js';
import { prepareEnemyCandidates } from '../src/character-preparation.js';
import { fullCombatProfile } from './fixtures/combat-profile.js';
import { normalizeSettings } from '../src/adapters.js';
const copy = value => JSON.parse(JSON.stringify(value));
const data = (state = '无', id = '战界-001') => ({ stat_data: { 世界: { 战界: { 空间层: '下沉战界', 战界ID: id, 备案状态: '已备案', 战斗状态: state } } } });
const identity = { chatId: 'test', avatar: 'test.png', branchUid: 'b', assistantMessageUid: 'm', swipeUid: 's', requestId: 'r' };
const base = { identity, eligible: true, messageFingerprint: 'content' };
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(fn) { for (let i = 0; i < 200; i++) { if (fn()) return; await delay(5); } throw new Error('condition not reached'); }
class Bus {
  handlers = new Map();
  on(k, fn) { if (!this.handlers.has(k)) this.handlers.set(k, new Set()); this.handlers.get(k).add(fn); }
  off(k, fn) { this.handlers.get(k)?.delete(fn); }
  async emit(k, ...args) { for (const fn of [...this.handlers.get(k) || []]) await fn(...args); }
}
const message = (text, is_user = false, vars) => ({ mes: text, is_user, extra: {}, swipe_id: 0, swipes: [text], swipe_info: [{ extra: {} }], ...(vars ? { variables: [copy(vars)] } : {}) });
function fixture(t, { p1 = false, before = '无', skip = false, request } = {}) {
  const bus = new Bus(), mvuBus = new Bus(), statuses = [], calls = [];
  const keys = ['GENERATION_STARTED','GENERATION_ENDED','GENERATION_STOPPED','MESSAGE_SENT','MESSAGE_RECEIVED','CHAT_CHANGED','MESSAGE_SWIPED','MESSAGE_EDITED','MESSAGE_DELETED'];
  const c = { chatId: 'test', characterId: 0, characters: [{ name: 'test', avatar: 'test.png' }], chat: [message('parent', false, data(before))], chatMetadata: {}, eventSource: bus, eventTypes: Object.fromEntries(keys.map(k => [k,k])) };
  let disk;
  c.saveChat = async () => { disk = copy([{ chat_metadata: c.chatMetadata }, ...c.chat]); };
  c.saveChat();
  const store = new HostEventStore({ contextProvider: () => c, readRemote: async () => copy(disk), confirmationAttempts: 1 });
  const lock = new EventOperationLock({ locks: null });
  const coordinator = new EventCoordinator({ store, lock, router: async () => ({ decision: 'pass' }) });
  const win = { Mvu: { events: { VARIABLE_UPDATE_ENDED: 'end', BEFORE_MESSAGE_UPDATE: 'write' } }, eventOn: mvuBus.on.bind(mvuBus), eventRemoveListener: mvuBus.off.bind(mvuBus) };
  const gate = new HostGenerationGate({ coordinator, contextProvider: () => c, windowRef: win }).start();
  const controller = { state: { sessionId: 'session' }, cancelCharacterPreparation() {}, async requestBattleEntry(input) { calls.push(input); return request ? request(input) : { status: 'accepted', sessionId: 'session' }; } };
  const entry = new BattleEntryCoordinator({ store, lock, controller, onStatus: value => statuses.push(value) });
  const observer = new HostMvuObserver({ contextProvider: () => c, windowRef: win, coordinator, gate, waitMs: 80, onObservation: value => entry.observe(value), onInvalidate: reason => entry.cancel(reason), onStatus: value => statuses.push(value) });
  observer.setEnabled(true);
  t.after(() => { observer.dispose(); gate.dispose(); });
  return { c, bus, win, mvuBus, store, lock, coordinator, gate, controller, entry, observer, statuses, calls,
    async begin(kind = 'normal') {
      if (p1 && !gate.enabled) await gate.setEnabled(true);
      await bus.emit('GENERATION_STARTED', kind, {}, false);
      if (kind === 'normal') { c.chat.push(message('行动', true)); await bus.emit('MESSAGE_SENT', c.chat.length - 1); }
      if (p1) { await gate.intercept([], 1, () => {}, kind); if (skip) coordinator.active.event.reasonCode = 'user_skipped_adjudication'; }
    },
    async receive(text = '同样正文') { c.chat.push(message(text)); await bus.emit('MESSAGE_RECEIVED', c.chat.length - 1); return c.chat.at(-1); },
    async update(value, { persist = true, beforeSignal = true } = {}) {
      await mvuBus.emit('end', value, data());
      if (beforeSignal) await mvuBus.emit('write', { variables: value, message_content: c.chat.at(-1).mes });
      c.chat.at(-1).variables = [copy(value)]; if (persist) await c.saveChat();
    },
    records() { return Object.values(store.local(store.scope())?.battleActivation?.records || {}); },
  };
}

test('pure edge matrix: only valid non-pending → pending, initialization and missing are baselines', () => {
  for (const state of ['无', '已结束', '进行中']) assert.ok(observeBattleState(null, { ...base, baseline: data(state), snapshot: data('待裁定') }).candidate);
  for (const state of ['无', '已结束', '进行中', '待裁定']) assert.equal(observeBattleState(null, { ...base, baseline: data('待裁定'), snapshot: data(state) }).candidate, null);
  assert.equal(observeBattleState(null, { ...base, baseline: null, snapshot: data('待裁定') }).candidate, null);
  assert.equal(observeBattleState(null, { ...base, baseline: data(), snapshot: data('待裁定'), eligible: false }).candidate, null);
  assert.equal(observeBattleState(null, { ...base, baseline: data(), snapshot: data('待裁定', '无') }).candidate, null);
  const reality = data('待裁定', '无'); reality.stat_data.世界.战界.空间层 = '现实';
  assert.ok(observeBattleState(null, { ...base, baseline: data(), snapshot: reality }).candidate);
});
test('real update sequences distinguish a second edge but not repeats or other-field pending changes', () => {
  const a = observeBattleState(null, { ...base, baseline: data(), snapshot: data('待裁定') });
  const repeated = observeBattleState(a.observation, { ...base, snapshot: data('待裁定') });
  assert.equal(repeated.candidate, null); assert.equal(repeated.observation.sequence, a.observation.sequence);
  const altered = observeBattleState(a.observation, { ...base, snapshot: data('待裁定', '战界-002') }); assert.equal(altered.candidate, null);
  const b = observeBattleState(a.observation, { ...base, snapshot: data('进行中') });
  const c = observeBattleState(b.observation, { ...base, snapshot: data('待裁定') });
  assert.notEqual(a.candidate.activationId, c.candidate.activationId);
  const regenerated = observeBattleState(a.observation, { ...base, messageFingerprint: 'new-native-request', baseline: data(), snapshot: data('待裁定') });
  assert.ok(regenerated.candidate); assert.notEqual(a.candidate.activationId, regenerated.candidate.activationId);
});
test('rolled-back bindings cannot override a fresh independent observation', t => {
  const f = fixture(t), reply = message('reply'); f.c.chat.push(reply);
  reply.extra.xy_event_v1 = { messageUid: 'm', swipeUid: 's', story: { eventId: 'old', requestId: 'old-r' } };
  const root = { events: { old: { eventId: 'old', status: 'rolled_back', branchUid: 'old-b', generationBindings: [{ status: 'completed', requestId: 'old-r', assistantMessageUid: 'm', swipeUid: 's' }] } } };
  assert.equal(f.coordinator.observedIdentity(reply, root), null);
  reply.extra.xy_event_v1.activationObservation = { completed: true, requestId: 'fresh-r', branchUid: 'fresh-b' };
  const current = f.coordinator.observedIdentity(reply, root);
  assert.equal(current.requestId, 'fresh-r'); assert.equal(current.branchUid, 'fresh-b'); assert.equal(current.parentEventId, null);
});
test('listener default off setting and repeated mount/unload release every callback', t => {
  assert.equal(normalizeSettings({}).battleStateListenerEnabled, false);
  const f = fixture(t); f.observer.setEnabled(true); f.observer.setEnabled(true);
  assert.equal(f.mvuBus.handlers.get('end').size, 1); f.observer.dispose(); assert.equal(f.mvuBus.handlers.get('end').size, 0);
  assert.equal(f.calls.length, 0);
});
test('exact early MVU signals wait for native finish, P1 binding and persisted target; repeat has one acceptance', async t => {
  const f = fixture(t, { p1: true }); await f.begin(); await f.receive();
  const after = data('待裁定'); await f.update(after);
  await delay(20); assert.equal(f.calls.length, 0);
  await f.bus.emit('GENERATION_ENDED'); await until(() => f.records().some(r => r.status === 'accepted'));
  assert.equal(f.calls.length, 1); assert.ok(f.calls[0].parentEventId); assert.equal(f.calls[0].requestId, f.records()[0].requestId);
  await f.update(after); await delay(50); assert.equal(f.calls.length, 1);
  assert.deepEqual(selectedMvu(f.c.chat.at(-1)), after, 'observer never writes MVU');
});
test('independent listener works with semantic gate disabled and exact signal before MESSAGE_RECEIVED', async t => {
  const f = fixture(t); await f.begin(); f.c.chat.push(message('同样正文'));
  await f.update(data('待裁定')); await f.bus.emit('GENERATION_ENDED'); await f.bus.emit('MESSAGE_RECEIVED', f.c.chat.length - 1);
  await until(() => f.calls.length === 1); assert.equal(f.calls[0].parentEventId, null); assert.ok(f.calls[0].assistantMessageUid);
});
test('unpersisted or unpaired variable callbacks never launch, late verified save can be retried', async t => {
  const f = fixture(t); await f.begin(); await f.receive(); await f.update(data('待裁定'), { persist: false }); await f.bus.emit('GENERATION_ENDED');
  await until(() => f.statuses.some(s => s.status === 'battle_mvu_not_ready')); assert.equal(f.calls.length, 0);
  await f.c.saveChat(); await f.update(data('待裁定')); await until(() => f.calls.length === 1);
});
test('unpaired and ambiguous MVU callbacks cannot act as message save receipts', async t => {
  for (const ambiguous of [false, true]) {
    const f = fixture(t); await f.begin(); await f.receive(); const vars = data('待裁定');
    await f.mvuBus.emit('end', vars, data());
    if (ambiguous) { await f.mvuBus.emit('end', vars, data()); await f.mvuBus.emit('write', { variables: vars, message_content: f.c.chat.at(-1).mes }); }
    f.c.chat.at(-1).variables = [copy(vars)]; await f.c.saveChat(); await f.bus.emit('GENERATION_ENDED');
    await until(() => f.statuses.some(s => s.status === 'battle_mvu_not_ready'));
    assert.equal(f.calls.length, 0); f.observer.dispose();
  }
});
test('host shared event bus supports MVU without iframe-only globals', async t => {
  const f = fixture(t); f.observer.dispose(); delete f.win.eventOn; delete f.win.eventRemoveListener; f.observer.setEnabled(true);
  await f.begin(); await f.receive(); const vars = data('待裁定');
  await f.bus.emit('end', vars, data()); await f.bus.emit('write', { variables: vars, message_content: f.c.chat.at(-1).mes });
  f.c.chat.at(-1).variables = [copy(vars)]; await f.c.saveChat(); await f.bus.emit('GENERATION_ENDED');
  await until(() => f.calls.length === 1); f.observer.dispose(); assert.equal(f.bus.handlers.get('end').size, 0);
});
test('extra variable analysis and presentation wrapper writes finish before activation', async t => {
  const f = fixture(t); let analysis = true; f.win.Mvu.isDuringExtraAnalysis = () => analysis;
  await f.begin(); await f.receive(); await f.update(data('待裁定'));
  f.c.chat.at(-1).mes += '\n<StatusPlaceHolderImpl/>'; await f.c.saveChat(); await f.bus.emit('GENERATION_ENDED');
  await until(() => f.statuses.some(s => s.status === 'battle_mvu_not_ready')); assert.equal(f.calls.length, 0);
  analysis = false; await f.update(data('待裁定')); await until(() => f.calls.length === 1);
});
test('same message real state cycles get distinct observations; pending-only changes never prepare again', async t => {
  const f = fixture(t); await f.begin(); await f.receive(); await f.update(data('待裁定')); await f.bus.emit('GENERATION_ENDED');
  await until(() => f.records().some(r => r.status === 'accepted'));
  await f.update(data('待裁定', '战界-002')); await delay(30); assert.equal(f.calls.length, 1);
  await f.update(data('进行中')); await until(() => Object.values(f.store.local(f.store.scope()).battleActivation.observations)[0].state.战斗状态 === '进行中');
  await f.update(data('待裁定')); await until(() => f.records().length === 2);
  assert.notEqual(f.records()[0].activationId, f.records()[1].activationId);
});
test('native regenerate uses actual parent and a fresh request even with identical text', async t => {
  const f = fixture(t); await f.begin(); await f.receive(); await f.update(data('待裁定')); await f.bus.emit('GENERATION_ENDED');
  await until(() => f.records().some(r => r.status === 'accepted'));
  await f.begin('regenerate'); f.c.chat.pop(); await f.bus.emit('MESSAGE_DELETED'); await f.receive();
  await f.update(data('待裁定')); await f.bus.emit('GENERATION_ENDED'); await until(() => f.records().length === 2);
  assert.notEqual(f.records()[0].requestId, f.records()[1].requestId);
});
test('skipped parent consumes the edge and does not call controller', async t => {
  const f = fixture(t, { p1: true, skip: true }); await f.begin(); await f.receive(); await f.update(data('待裁定')); await f.bus.emit('GENERATION_ENDED');
  await until(() => f.records().length === 1); assert.equal(f.records()[0].status, 'cancelled'); assert.equal(f.calls.length, 0);
});
test('next input, edit, stop and swipe invalidate pending observations', async t => {
  for (const event of ['MESSAGE_SENT', 'MESSAGE_EDITED', 'GENERATION_STOPPED', 'MESSAGE_SWIPED', 'CHAT_CHANGED']) {
    const f = fixture(t); await f.begin(); await f.receive(); await f.update(data('待裁定'), { persist: false }); await f.bus.emit('GENERATION_ENDED');
    if (event === 'MESSAGE_SENT') f.c.chat.push(message('新输入', true));
    await f.bus.emit(event, f.c.chat.length - 1); await f.c.saveChat(); await delay(15);
    assert.equal(f.calls.length, 0, event); f.observer.dispose();
  }
});
test('new native swipe uses actual parent baseline, not the previous pending swipe', async t => {
  const f = fixture(t); await f.begin(); await f.receive(); await f.update(data('待裁定')); await f.bus.emit('GENERATION_ENDED'); await until(() => f.records().some(r => r.status === 'accepted'));
  await f.begin('swipe'); const m = f.c.chat.at(-1); m.swipe_id = 1; m.swipes.push('同样正文'); m.swipe_info.push({ extra: copy(m.extra) });
  await f.bus.emit('MESSAGE_RECEIVED', f.c.chat.length - 1);
  const vars = data('待裁定'); await f.mvuBus.emit('end', vars, data()); await f.mvuBus.emit('write', { variables: vars, message_content: m.mes }); m.variables[1] = vars;
  await f.c.saveChat(); await f.bus.emit('GENERATION_ENDED'); await until(() => f.records().length === 2);
  assert.notEqual(f.records()[0].swipeUid, f.records()[1].swipeUid);
});
test('cancellation consumes preparation even if provider returns late; reload never reruns uncertain work', async t => {
  let release;
  const f = fixture(t, { request: () => new Promise(resolve => { release = resolve; }) });
  await f.begin(); await f.receive(); await f.update(data('待裁定')); await f.bus.emit('GENERATION_ENDED'); await until(() => !!release);
  assert.equal(f.entry.cancel(), true); await until(() => f.records()[0].status === 'cancelled');
  release({ status: 'accepted', sessionId: 'late' }); await delay(25); assert.equal(f.records()[0].status, 'cancelled');
  await f.update(data('待裁定')); await delay(30); assert.equal(f.calls.length, 1);
  await f.entry.mutate(f.store.scope(), d => { d.records.test = { activationId: 'test', status: 'preparing' }; });
  await f.entry.recover(); assert.equal(f.records().find(r => r.activationId === 'test').status, 'needs_context'); assert.equal(f.calls.length, 1);
});
test('shared queue preserves latest revision after another operation releases', async t => {
  const f = fixture(t); const release = await f.lock.acquire('test.png:test', 'native');
  const pending = f.entry.mutate(f.store.scope(), d => { d.records.a = { activationId: 'a', status: 'queued' }; });
  await delay(20); assert.equal(f.records().length, 0); release(); await pending; assert.equal(f.records().length, 1);
});
test('semantic and state sources merge one preparation and propagate cancellation to aliases', async t => {
  let release;
  const f = fixture(t, { request: () => new Promise(resolve => { release = resolve; }) });
  const input = { parentEventId: 'event', branchUid: 'branch', requestId: 'request', swipeUid: 'swipe' };
  const pending = f.entry.request({ ...input, activationId: 'semantic', source: 'semantic-input' });
  await until(() => !!release);
  await f.entry.request({ ...input, activationId: 'edge', source: 'mvu-state-edge' });
  assert.equal(f.calls.length, 1); assert.equal(f.records().find(row => row.activationId === 'edge').relatedActivationId, 'semantic');
  f.entry.cancel(); await until(() => f.records().every(row => row.status === 'cancelled'));
  release({ status: 'accepted', sessionId: 'late' }); await pending;
});
test('queued edge invalidated before admission is consumed without making a request', async t => {
  const f = fixture(t); const abort = new AbortController();
  await f.entry.mutate(f.store.scope(), d => { d.records.queued = { activationId: 'queued', status: 'queued' }; });
  abort.abort(); await f.entry.request({ activationId: 'queued', signal: abort.signal });
  assert.equal(f.records()[0].status, 'cancelled'); assert.equal(f.calls.length, 0);
});
test('guard expires during persistence preflight: no save and no retryable stale write', async t => {
  const f = fixture(t); const scope = f.store.scope(); const root = await f.store.load(scope); let checks = 0, saves = 0;
  f.c.saveChat = async () => { saves++; };
  await assert.rejects(f.store.write(scope, root, [], () => { if (++checks === 3) throw new DOMException('expired', 'AbortError'); }), /expired/);
  assert.equal(saves, 0); assert.equal(f.store.pending, null); assert.equal(f.store.local(scope), null);
});
test('controller entry is idempotent, restores draft and resumes known battle without model or action', async () => {
  const c = new BattleController(); let count = 0;
  c.prepareCharactersOwned = async ({ apply }) => { count++; await delay(10); const p = await prepareEnemyCandidates({ scope: c.state.scope, enemies: [{ ...fullCombatProfile('顾澜'), id: 'gulan' }] }); return apply(() => { c.characterPreparation = p; return c.characterConfirmationPanel(); }); };
  const input = { activationId: 'one', parentEventId: 'p', after: data('待裁定').stat_data.世界.战界 };
  const [a,b] = await Promise.all([c.requestBattleEntry(input), c.requestBattleEntry(input)]);
  assert.equal(count, 1); assert.equal(a.sessionId, b.sessionId); assert.equal(c.state.phase, 'idle'); assert.equal(c.state.history.length, 0);
  c.characterPreparation = null; assert.equal((await c.requestBattleEntry(input)).status, 'already_accepted'); assert.ok(c.characterPreparation);
  c.state.phase = 'awaiting_next'; c.characterPreparation = null;
  assert.equal((await c.requestBattleEntry({ ...input, activationId: 'two', before: { 战斗状态: '进行中' } })).status, 'already_accepted'); assert.equal(count, 1);
  assert.equal((await c.requestBattleEntry({ ...input, activationId: 'other', after: { 战界ID: '战界-002' } })).status, 'needs_context');
});
test('provider result cannot apply after source guard expires', async () => {
  const c = new BattleController(); let valid = true;
  c.prepareCharactersOwned = async ({ apply }) => { valid = false; return apply(() => { throw new Error('must not apply'); }); };
  await assert.rejects(c.requestBattleEntry({ activationId: 'late', guard: () => { if (!valid) throw new DOMException('expired','AbortError'); } }), /expired/);
  assert.equal(c.state.battleEntry, undefined);
});
