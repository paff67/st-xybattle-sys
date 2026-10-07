import test from 'node:test';
import assert from 'node:assert/strict';
import { BattleHostAdapter, createHostAdapter } from '../src/host-adapter.js';
import { BattleController } from '../src/battle-controller.js';
import { MainStoryNarrator, MockAdjudicator } from '../src/adapters.js';
import { JSDOM } from 'jsdom';
import { parseBattlePackets } from '../src/host-input-bridge.js';

// These stubs follow the reviewed TavernHelper signatures. This suite is offline;
// it does not verify a loaded extension, browser events, or a running ST server.
const clone = (value) => JSON.parse(JSON.stringify(value));
class Events {
  handlers = new Map();
  on(name, handler) { if (!this.handlers.has(name)) this.handlers.set(name, new Set()); this.handlers.get(name).add(handler); }
  off(name, handler) { this.handlers.get(name)?.delete(handler); }
  async emit(name, ...args) { for (const handler of [...this.handlers.get(name) || []]) await handler(...args); }
  count(name) { return this.handlers.get(name)?.size || 0; }
}
function rawAssistant(text = 'A', extra = { unrelated: 'keep' }) {
  return { name: 'Assistant', is_user: false, mes: text, swipe_id: 0, swipes: [text, 'B'], variables: [{ stats: { qi: 9 } }, { stats: { qi: 4 } }], extra: clone(extra), swipe_info: [clone(extra), { otherBranch: true }] };
}
function fixture({ noHelper = false, noSave = false, documentRef } = {}) {
  const events = new Events(), page = new Events(), calls = { read: [], write: [], save: 0, inject: [], uninject: 0 };
  let context = { chatId: 'chat-1', chat: [rawAssistant()], eventSource: events };
  let disk = null;
  if (!noSave) context.saveChat = async () => { calls.save += 1; disk = clone(context.chat); };
  const helper = {
    getChatMessages(id, options) {
      calls.read.push([id, options]); const raw = context.chat[id]; if (!raw) return [];
      const common = { message_id: id, name: raw.name, role: raw.is_user ? 'user' : 'assistant', is_hidden: false };
      if (!options?.include_swipes) return [{ ...common, message: raw.mes, extra: clone(raw.extra), data: clone(raw.variables?.[raw.swipe_id || 0] || {}) }];
      return [{ ...common, swipe_id: raw.swipe_id || 0, swipes: clone(raw.swipes || [raw.mes]), swipes_data: clone(raw.variables || [{}]), swipes_info: clone(raw.swipe_info || [raw.extra || {}]) }];
    },
    async setChatMessages(messages, options) {
      calls.write.push([clone(messages), options]);
      for (const message of messages) {
        const raw = context.chat[message.message_id];
        // The reviewed source selects its all-swipes path by presence of these fields.
        assert.equal('message' in message, false); assert.equal('data' in message, false);
        Object.assign(raw, { swipe_id: message.swipe_id, swipes: clone(message.swipes), variables: clone(message.swipes_data), swipe_info: clone(message.swipes_info), mes: message.swipes[message.swipe_id], extra: clone(message.swipes_info[message.swipe_id]) });
      }
    },
    injectPrompts(prompts, options) { calls.inject.push([prompts, options]); let removed = false; return { uninject() { if (!removed) calls.uninject += 1; removed = true; } }; }
  };
  const windowRef = { addEventListener: (name, handler) => page.on(name, handler), removeEventListener: (name, handler) => page.off(name, handler) };
  const options = { contextProvider: () => context, helper: noHelper ? null : helper, windowRef, documentRef };
  const adapter = new BattleHostAdapter(options);
  return { adapter, helper, events, page, calls, options, context: () => context, disk: () => disk, changeChat(chatId, chat = [rawAssistant('New')]) { context = { ...context, chatId, chat }; }, reload() { context.chat = clone(disk); }, selectSwipe(index) { const raw = context.chat[0]; raw.swipe_id = index; raw.mes = raw.swipes[index]; raw.extra = clone(raw.swipe_info[index]); } };
}
function data(scope, version = 3, actionId = 'action-1', status = 'committed') {
  return { receipt: { schema: 'battle_v2_receipt', actionId, status, version, scope }, state: { schema: 'battle_v2', version, phase: 'committed', sessionId: 'battle-1', scope, history: [] }, packet: { type: 'BATTLE_SCENE_PACKET', actionId, version, scope, committedFacts: ['A visible event'], preserveUserPrompt: true } };
}
async function queue(host) { const scope = host.adapter.scope(), item = data(scope); assert.equal((await host.adapter.persistReceipt(item.receipt, item.state, scope)).confirmed, true); assert.equal((await host.adapter.injectScenePacket(item.packet, scope)).queued, true); return item; }

test('committed controller action automatically sends the native composer once and tracks normal story completion', async () => {
  const dom = new JSDOM('<textarea id="send_textarea">玩家原始文字</textarea><button id="send_but">发送</button>');
  const host = fixture({ documentRef: dom.window.document });
  const controller = await attachedController(host);
  const input = dom.window.document.querySelector('textarea');
  let clicks = 0, started;
  dom.window.document.querySelector('button').addEventListener('click', () => {
    clicks += 1;
    started = (async () => {
      await host.events.emit('GENERATION_STARTED', 'normal');
      await host.events.emit('GENERATION_AFTER_COMMANDS', 'normal');
      host.context().chat.push({ is_user: true, mes: input.value });
      input.value = '';
      await host.events.emit('USER_MESSAGE_RENDERED', host.context().chat.length - 1);
    })();
  });
  try {
    controller.start();
    await controller.submit({ actionId: 'auto-send', label: '试探' });
    await started;
    assert.equal(clicks, 1);
    assert.match(host.context().chat.at(-1).mes, /^玩家原始文字/);
    assert.equal(parseBattlePackets(host.context().chat.at(-1).mes).length, 1);
    assert.equal(host.calls.inject.length, 0, 'input and extension prompt must not both inject');
    assert.equal(host.adapter.sendQueuedScenePacket(host.adapter.scope()).deduplicated, true);
    assert.equal(clicks, 1);
    assert.equal(controller.bridgeQueuedAction, 'auto-send');
    host.context().chat.push(rawAssistant('<think>正文思考</think>主剧情正文'));
    await host.events.emit('GENERATION_ENDED');
    assert.equal(controller.bridgeQueuedAction, null);
    assert.equal(controller.state.history.at(-1).status, 'complete');
    assert.equal(controller.adjudicator.calls.length, 1);
    assert.doesNotMatch(JSON.stringify(controller.playerView().timeline), /正文思考|主剧情正文/);
  } finally { controller.dispose(); dom.window.close(); }
});

test('auto-send waits for a valid native button and refuses busy, stale or changed-scope sends', async () => {
  const dom = new JSDOM('<textarea id="send_textarea">草稿</textarea><button id="send_but" disabled>发送</button>');
  const host = fixture({ documentRef: dom.window.document });
  let clicks = 0;
  const button = dom.window.document.querySelector('button'); button.addEventListener('click', () => { clicks += 1; });
  try {
    const item = await queue(host);
    assert.equal(host.adapter.sendQueuedScenePacket(item.receipt.scope).requested, false);
    assert.match(dom.window.document.querySelector('textarea').value, /草稿/);
    button.disabled = false;
    await host.events.emit('GENERATION_STARTED', 'normal');
    assert.match(host.adapter.sendQueuedScenePacket(item.receipt.scope).reason, /正在生成/);
    await host.events.emit('GENERATION_STOPPED');
    await queue(host);
    const newer = data(item.receipt.scope, 4, 'newer');
    await host.adapter.persistReceipt(newer.receipt, newer.state, item.receipt.scope);
    assert.match(host.adapter.sendQueuedScenePacket(item.receipt.scope).reason, /过期/);
    host.changeChat('different-chat');
    assert.equal(host.adapter.sendQueuedScenePacket(item.receipt.scope).requested, false);
    assert.equal(clicks, 0);
  } finally { host.adapter.dispose(); dom.window.close(); }
});

test('extension-prompt fallback injects the same minimal facts as the input-box transport', async () => {
  const host = fixture(), scope = host.adapter.scope(), item = data(scope);
  item.packet = { ...item.packet, committedFacts: ['无伤试探', '无伤试探'], publicEvents: ['旧事件'], storyAiDirective: '递归旧包', playerVisibleContext: { player: { currentState: '尚未交手' } }, location: '清晨演示台', descriptionRequirements: ['剧烈冲击'] };
  await host.adapter.persistReceipt(item.receipt, item.state, scope);
  assert.equal((await host.adapter.injectScenePacket(item.packet, scope)).queued, true);
  await host.events.emit('GENERATION_AFTER_COMMANDS', 'normal');
  const content = host.calls.inject[0][0][0].content;
  assert.deepEqual(JSON.parse(content).committedFacts, ['无伤试探']);
  assert.doesNotMatch(content, /旧事件|递归旧包|尚未交手|清晨|剧烈冲击/);
  host.adapter.dispose();
});

test('startup repairs old completed actions whose packet and prose have both been deleted', async () => {
  const host = fixture(), storage = controllerStorage();
  let controller = await attachedController(host, { storage });
  controller.start();
  const before = clone(controller.state.semanticState);
  await controller.submit({ actionId: 'legacy-deleted', label: '旧版行动', techniqueId: 'xianshi' });
  const record = controller.state.history[0];
  delete record.rollbackState;
  delete record.storyLink;
  record.status = 'complete'; record.narrative = { text: '已经删除的正文', metadata: { source: 'SillyTavern normal generation' } };
  controller.state.version += 1; controller.emit(); await controller.checkpoints;
  controller.dispose();
  const adapter = new BattleHostAdapter(host.options);
  controller = new BattleController({ storage, hostAdapter: adapter, chatId: 'chat-1', branchId: 'message:0:swipe:0', adjudicator: new MockAdjudicator(), narrator: new MainStoryNarrator() });
  try {
    await controller.ready; await controller.checkpoints;
    assert.equal(controller.state.history.length, 0);
    assert.deepEqual(controller.state.semanticState, before);
    assert.equal(controller.state.hostSync.status, 'confirmed');
    assert.equal(host.disk()[0].extra.battle_v2.receipts['legacy-deleted'], undefined);
  } finally { controller.dispose(); }
});

test('deleting a sent battle exchange rolls back while its original assistant anchor survives, then reload keeps rollback', async () => {
  const dom = new JSDOM('<textarea id="send_textarea"></textarea><button id="send_but">发送</button>');
  const host = fixture({ documentRef: dom.window.document });
  const storage = controllerStorage();
  let controller = await attachedController(host, { storage });
  const input = dom.window.document.querySelector('textarea');
  let generation;
  dom.window.document.querySelector('button').addEventListener('click', () => {
    generation = (async () => {
      await host.events.emit('GENERATION_STARTED', 'normal');
      await host.events.emit('GENERATION_AFTER_COMMANDS', 'normal');
      host.context().chat.push({ is_user: true, mes: input.value }); input.value = '';
      await host.events.emit('USER_MESSAGE_RENDERED', host.context().chat.length - 1);
      host.context().chat.push(rawAssistant('本轮正文'));
      await host.events.emit('GENERATION_ENDED');
    })();
  });
  try {
    controller.start(); await controller.checkpoints;
    const before = clone(controller.state);
    await controller.submit({ actionId: 'deleted-exchange', label: '建立弦势', techniqueId: 'xianshi' }); await generation;
    assert.equal(controller.state.history[0].storyLink.sent, true);
    assert.ok(controller.state.semanticState.statuses.includes('xianshi:triggered'));
    host.context().chat.pop(); // Only prose deleted: committed action survives.
    await host.events.emit('MESSAGE_DELETED', 2);
    assert.equal(controller.state.history.length, 1);
    host.context().chat.pop(); // Packet deleted: revert this action.
    await host.events.emit('MESSAGE_DELETED', 1); await controller.checkpoints;
    assert.equal(host.adapter.scope().messageId, 0);
    assert.deepEqual(controller.state.semanticState, before.semanticState);
    assert.deepEqual(controller.state.actors, before.actors);
    assert.deepEqual(controller.state.causalState, before.causalState);
    assert.deepEqual(controller.state.scene.publicEvents, before.scene.publicEvents);
    assert.equal(controller.state.phase, 'awaiting_player');
    assert.equal(controller.state.history.length, 0);
    assert.equal(controller.state.hostSync.status, 'confirmed');
    assert.equal(host.disk()[0].extra.battle_v2.receipts['deleted-exchange'], undefined);
    host.reload();
    const restored = await attachedController(host, { storage });
    controller.dispose(); controller = restored;
    assert.equal(controller.state.history.length, 0);
    assert.deepEqual(controller.state.semanticState, before.semanticState);
  } finally { controller.dispose(); dom.window.close(); }
});

test('scope uses ST chat/message/swipe and stays anchored when generation appends floors', async () => {
  const host = fixture(), first = host.adapter.scope();
  assert.equal(first.chatId, 'chat-1'); assert.equal(first.messageId, 0); assert.equal(first.swipeId, 0); assert.equal(first.branchId, 'message:0:swipe:0');
  host.context().chat.push({ is_user: true, mes: 'Original prompt' }, rawAssistant('Generated'));
  assert.deepEqual(host.adapter.scope(), first);
  host.selectSwipe(1); const next = host.adapter.scope(); assert.equal(next.swipeId, 1); assert.equal(next.messageUid, first.messageUid); assert.ok(next.scopeEpoch > first.scopeEpoch);
});

test('deleting all assistant messages clears the branch battle snapshot and waits for a new anchor', async () => {
  const host = fixture(), storage = controllerStorage(), controller = await attachedController(host, { storage });
  try {
    controller.start();
    controller.state.actors.enemies = [{ id: 'old-enemy', name: '旧敌手' }];
    controller.state.semanticState.statuses = ['xianshi:triggered'];
    controller.emit();
    host.context().chat.length = 0;
    host.context().chat.push({ is_user: true, mes: '只剩用户消息' });
    await host.events.emit('MESSAGE_DELETED', 0);
    await controller.ready;
    await controller.checkpoints;
    assert.equal(host.adapter.scope().available, false);
    assert.equal(controller.state.phase, 'idle');
    assert.deepEqual(controller.state.actors.enemies, []);
    assert.deepEqual(controller.state.semanticState.statuses, []);
    assert.equal(controller.state.history.length, 0);
    assert.equal(controller.state.hostSync.status, 'unavailable');
    assert.equal(controller.state.hostSync.reason, null);
    assert.deepEqual(controller.storage.readSession().actors.enemies, []);
  } finally { controller.dispose(); }
});

test('deleted anchor rolls back to the surviving assistant checkpoint instead of local stale state', async () => {
  const host = fixture(), storage = controllerStorage(), controller = await attachedController(host, { storage });
  try {
    controller.start();
    controller.state.actors.enemies = [{ id: 'checkpoint-enemy', name: '检查点敌手' }];
    controller.state.semanticState.statuses = ['checkpoint:active'];
    controller.emit();
    await controller.checkpoints;
    host.context().chat.push({ is_user: true, mes: '后续用户消息' }, rawAssistant('后续正文'));
    const deleted = host.context().chat.pop();
    assert.equal(deleted.is_user, false);
    await host.events.emit('MESSAGE_DELETED', 2);
    await controller.ready;
    await controller.checkpoints;
    assert.equal(host.adapter.scope().available, true);
    assert.equal(controller.state.phase, 'awaiting_player');
    assert.deepEqual(controller.state.actors.enemies, [{ id: 'checkpoint-enemy', name: '检查点敌手' }]);
    assert.deepEqual(controller.state.semanticState.statuses, ['checkpoint:active']);
  } finally { controller.dispose(); }
});

test('surviving checkpoint follows its stable message uid when earlier messages are deleted', async () => {
  const host = fixture(), storage = controllerStorage(), controller = await attachedController(host, { storage });
  try {
    controller.start();
    controller.state.actors.enemies = [{ id: 'uid-enemy', name: 'UID 敌手' }];
    controller.emit();
    await controller.checkpoints;
    const original = host.context().chat[0];
    host.context().chat.unshift({ is_user: true, mes: '后来插入的用户消息' });
    await host.events.emit('MESSAGE_DELETED', 0);
    await controller.ready;
    await controller.checkpoints;
    assert.equal(host.adapter.scope().messageId, 1);
    assert.equal(controller.state.phase, 'awaiting_player');
    assert.equal(controller.state.actors.enemies[0].id, 'uid-enemy');
    assert.equal(host.adapter.scope().messageUid, original.extra.battle_v2_message_uuid);
  } finally { controller.dispose(); }
});

test('helper persistence resends all swipes and preserves unrelated fields and MVU data', async () => {
  const host = fixture(), scope = host.adapter.scope(), item = data(scope), before = clone(host.context().chat[0]);
  const result = await host.adapter.persistReceipt(item.receipt, item.state, scope);
  assert.equal(result.persisted, true); assert.equal(result.confirmed, true); assert.equal(result.capability.write, 'tavern-helper'); assert.equal(result.capability.liveVerified, false);
  assert.deepEqual(host.calls.write[0][1], { refresh: 'none' }); assert.equal(host.calls.save, 1);
  const saved = host.context().chat[0]; assert.deepEqual(saved.swipes, before.swipes); assert.deepEqual(saved.variables, before.variables); assert.deepEqual(saved.swipe_info[1], before.swipe_info[1]); assert.equal(saved.extra.unrelated, 'keep');
  assert.deepEqual(saved.extra.battle_v2, saved.swipe_info[0].battle_v2); assert.equal(host.disk()[0].extra.battle_v2.state.sessionId, 'battle-1');
  assert.ok(host.calls.read.every(([, options]) => options.include_swipes === true));
});

test('A/B branch receipts and sessions survive reload without leaking to the other swipe', async () => {
  const host = fixture(); let scope = host.adapter.scope(); const a = data(scope, 3, 'A'); await host.adapter.persistReceipt(a.receipt, a.state, scope);
  host.selectSwipe(1); await host.events.emit('MESSAGE_SWIPED', 0); scope = host.adapter.scope(); assert.equal((await host.adapter.loadSession(scope)).loaded, false);
  const b = data(scope, 4, 'B'); b.state.sessionId = 'battle-B'; await host.adapter.persistReceipt(b.receipt, b.state, scope);
  host.reload(); const reloaded = new BattleHostAdapter(host.options); const readB = await reloaded.loadSession(); assert.equal(readB.state.sessionId, 'battle-B'); assert.deepEqual(Object.keys(readB.receipts), ['B']);
  host.selectSwipe(0); const readA = await reloaded.loadSession(); assert.equal(readA.state.sessionId, 'battle-1'); assert.deepEqual(Object.keys(readA.receipts), ['A']);
  reloaded.dispose();
});

test('refresh recovers the persisted fixed anchor after a normal generated message', async () => {
  const host = fixture(); await queue(host); host.context().chat.push(rawAssistant('New prose')); await host.context().saveChat(); host.reload();
  const fresh = new BattleHostAdapter(host.options); const scope = fresh.scope(); assert.equal(scope.messageId, 0); assert.equal(scope.writable, true); assert.equal((await fresh.loadSession()).loaded, true); fresh.dispose();
});

test('context.chat + saveChat fallback persists the same branch envelope', async () => {
  const host = fixture({ noHelper: true }), scope = host.adapter.scope(), item = data(scope);
  const result = await host.adapter.persistReceipt(item.receipt, item.state, scope); assert.equal(result.confirmed, true); assert.equal(result.capability.write, 'context-chat');
  assert.equal(host.disk()[0].extra.battle_v2.receipts['action-1'].status, 'committed'); assert.equal((await host.adapter.loadSession()).state.version, 3);
  assert.equal((await host.adapter.injectScenePacket(item.packet, scope)).queued, false);
});

test('missing awaitable save reports capability and does not claim durable persistence', async () => {
  const host = fixture({ noSave: true }), scope = host.adapter.scope(), item = data(scope); const result = await host.adapter.persistReceipt(item.receipt, item.state, scope);
  assert.equal(result.persisted, false); assert.equal(result.confirmed, false); assert.equal(result.capability.save, 'debounced-only'); assert.equal(host.calls.write.length, 0);
});

test('late writes reject changed chat, changed swipe, and A→B→A leases', async () => {
  const host = fixture(), original = host.adapter.scope(), item = data(original);
  host.selectSwipe(1); host.adapter.scope(); host.selectSwipe(0); host.adapter.scope();
  assert.equal((await host.adapter.persistReceipt(item.receipt, item.state, original)).persisted, false);
  host.changeChat('chat-2'); assert.equal((await host.adapter.persistReceipt(item.receipt, item.state, original)).persisted, false); assert.equal(host.calls.write.length, 0);
});

test('a chat switch while setChatMessages awaits skips save on the replacement chat', async () => {
  const host = fixture(), scope = host.adapter.scope(), item = data(scope); let release;
  host.helper.setChatMessages = async () => new Promise((resolve) => { release = resolve; });
  const pending = host.adapter.persistReceipt(item.receipt, item.state, scope);
  while (!release) await new Promise((resolve) => setImmediate(resolve));
  host.changeChat('chat-2'); release(); const result = await pending; assert.equal(result.persisted, false); assert.equal(result.stale, true); assert.equal(host.calls.save, 0); assert.equal(host.context().chat[0].extra.battle_v2, undefined);
});

test('reused numeric message floor cannot inherit the old message lease', async () => {
  const host = fixture(), scope = host.adapter.scope(), item = data(scope); host.context().chat[0] = rawAssistant('Replacement');
  assert.equal((await host.adapter.persistReceipt(item.receipt, item.state, scope)).persisted, false); assert.notEqual(host.adapter.scope().messageUid, scope.messageUid);
});

test('duplicate actionId is idempotent and older versions never roll the session back', async () => {
  const host = fixture(), scope = host.adapter.scope(), item = data(scope);
  await host.adapter.persistReceipt(item.receipt, item.state, scope); const duplicate = await host.adapter.persistReceipt(item.receipt, item.state, scope); assert.equal(duplicate.deduplicated, true); assert.equal(host.calls.save, 1);
  const newer = data(scope, 4, 'action-2'); await host.adapter.persistReceipt(newer.receipt, newer.state, scope);
  const old = await host.adapter.persistReceipt(item.receipt, item.state, scope); assert.equal(old.deduplicated, true); assert.equal((await host.adapter.loadSession()).state.version, 4);
  assert.equal((await host.adapter.persistReceipt(data(scope, 2, 'late').receipt, data(scope, 2).state, scope)).persisted, false); assert.equal(host.calls.save, 2);
});

test('conflicting duplicate receipts cannot replace a committed action', async () => {
  const host = fixture(), scope = host.adapter.scope(), item = data(scope); await host.adapter.persistReceipt(item.receipt, item.state, scope);
  const conflict = await host.adapter.persistReceipt({ ...item.receipt, adjudication: { changed: true } }, item.state, scope); assert.equal(conflict.persisted, false); assert.match(conflict.reason, /duplicate/);
});

test('null receipt saves lifecycle state and credentials never reach message extra', async () => {
  const host = fixture(), scope = host.adapter.scope(), item = data(scope); item.state.settings = { apiKey: 'SECRET', authorization: 'SECRET', model: 'model' };
  assert.equal((await host.adapter.persistReceipt(null, item.state, scope)).confirmed, true); const read = await host.adapter.loadSession(); assert.deepEqual(read.state.settings, { model: 'model' }); assert.deepEqual(read.receipts, {});
});

test('failed save blocks packet publication and a retry reconfirms the stored candidate', async () => {
  const host = fixture(), scope = host.adapter.scope(), item = data(scope), save = host.context().saveChat;
  host.context().saveChat = async () => { throw new Error('Disk unavailable'); };
  assert.equal((await host.adapter.persistReceipt(item.receipt, item.state, scope)).confirmed, false); assert.equal((await host.adapter.injectScenePacket(item.packet, scope)).queued, false);
  host.context().saveChat = save; assert.equal((await host.adapter.persistReceipt(item.receipt, item.state, scope)).confirmed, true); assert.equal((await host.adapter.injectScenePacket(item.packet, scope)).queued, true);
});

test('packet queues until a normal GENERATION_AFTER_COMMANDS and injects once', async () => {
  const host = fixture(); const item = await queue(host); assert.equal(host.calls.inject.length, 0);
  await host.events.emit('GENERATION_AFTER_COMMANDS', 'quiet'); await host.events.emit('GENERATION_AFTER_COMMANDS', 'normal', {}, true); assert.equal(host.calls.inject.length, 0);
  host.context().chat.push({ is_user: true, mes: 'Keep the original user prompt' });
  await host.events.emit('GENERATION_AFTER_COMMANDS', 'normal', {}, false); await host.events.emit('GENERATION_AFTER_COMMANDS', 'normal'); assert.equal(host.calls.inject.length, 1);
  const [prompts, options] = host.calls.inject[0]; assert.deepEqual(options, { once: true }); assert.equal(prompts[0].position, 'in_chat'); assert.equal(prompts[0].depth, 0); assert.equal(prompts[0].should_scan, false); assert.equal(JSON.parse(prompts[0].content).actionId, item.receipt.actionId); assert.equal(prompts[0].filter(), true); assert.equal(host.context().chat[1].mes, 'Keep the original user prompt');
});

test('generation end reports actual main-story assistant prose and removes the prompt', async () => {
  const host = fixture(), received = []; await queue(host); host.adapter.subscribeNarrative((event) => received.push(event));
  await host.events.emit('GENERATION_AFTER_COMMANDS', 'normal'); host.context().chat.push(rawAssistant('Actual generated prose')); await host.events.emit('GENERATION_ENDED');
  assert.equal(received.length, 1); assert.equal(received[0].status, 'complete'); assert.equal(received[0].text, 'Actual generated prose'); assert.equal(received[0].scope.messageId, 0); assert.equal(host.calls.uninject, 1); assert.equal(host.adapter.injected, false);
  await host.events.emit('GENERATION_AFTER_COMMANDS', 'normal'); await host.events.emit('GENERATION_ENDED'); assert.equal(host.calls.inject.length, 1); assert.equal(received.length, 1);
});

test('stop reports interrupted narration without publishing a partial text or recosting', async () => {
  const host = fixture(), received = []; await queue(host); host.adapter.subscribeNarrative((event) => received.push(event)); await host.events.emit('GENERATION_AFTER_COMMANDS', 'normal');
  host.context().chat.push(rawAssistant('Partial text')); await host.events.emit('GENERATION_STOPPED'); await host.events.emit('GENERATION_ENDED');
  assert.equal(received.length, 1); assert.equal(received[0].status, 'stopped'); assert.equal(received[0].text, ''); assert.equal(host.calls.save, 1); assert.equal(host.calls.uninject, 1);
});

test('changed committed version drops the queued or active packet', async () => {
  const host = fixture(), item = await queue(host); const newer = data(item.receipt.scope, 4, 'action-2'); await host.adapter.persistReceipt(newer.receipt, newer.state, item.receipt.scope);
  await host.events.emit('GENERATION_AFTER_COMMANDS', 'normal'); assert.equal(host.calls.inject.length, 0); assert.match(host.adapter.lastInjection.reason, /version/);
});

test('chat_changed, swipe, pagehide, and explicit clear remove queued and active injections', async () => {
  for (const cleanup of ['CHAT_CHANGED', 'MESSAGE_SWIPED', 'pagehide', 'clear']) {
    const host = fixture(); await queue(host); await host.events.emit('GENERATION_AFTER_COMMANDS', 'normal');
    if (cleanup === 'pagehide') await host.page.emit('pagehide'); else if (cleanup === 'clear') host.adapter.clearScenePacket(); else await host.events.emit(cleanup, 0);
    assert.equal(host.calls.uninject, 1, cleanup); assert.equal(host.adapter.packet, null, cleanup); assert.equal(host.adapter.activePacket, null, cleanup); host.adapter.dispose();
  }
});

test('historical explicit assistant anchors are read-only', async () => {
  const host = fixture(); host.context().chat.push(rawAssistant('Latest')); host.context().message_id = 0;
  const scope = host.adapter.scope(); assert.equal(scope.writable, false); assert.equal((await host.adapter.persistReceipt(data(scope).receipt, data(scope).state, scope)).persisted, false);
});

test('ready/start are idempotent and dispose unregisters host/page listeners', async () => {
  const host = fixture(); await host.adapter.ready(); await host.adapter.ready(); host.adapter.start(); assert.equal(host.events.count('GENERATION_AFTER_COMMANDS'), 1); assert.equal(host.page.count('pagehide'), 1);
  host.adapter.dispose(); assert.equal(host.events.count('GENERATION_AFTER_COMMANDS'), 0); assert.equal(host.page.count('pagehide'), 0);
  assert.ok(createHostAdapter({ contextProvider: () => ({}) }) instanceof BattleHostAdapter);
});

test('real controller and host contracts persist final version, consume one main-story packet, and record prose without rejudging', async () => {
  const host = fixture(), scope = host.adapter.scope(), adjudicator = new MockAdjudicator();
  const storage = { items: new Map(), getItem(key) { return this.items.get(key) || null; }, setItem(key, value) { this.items.set(key, value); } };
  const controller = new BattleController({ storage, hostAdapter: host.adapter, chatId: scope.chatId, branchId: scope.branchId, adjudicator, narrator: new MainStoryNarrator(), initialScene: { location: 'Test quay', time: 'Noon' } });
  await controller.ready;
  controller.start();
  const result = await controller.submit({ actionId: 'integration-action', label: 'Observe the visible flow' });
  assert.equal(result.record.status, 'committed'); assert.ok(host.adapter.packet, 'controller must queue only after its final version is durably saved');
  const userMessage = { is_user: true, mes: 'Original user prompt stays intact' };
  const input = { value: 'Unsent draft stays intact' }; host.context().chat.push(userMessage); host.context().textarea = input;
  await host.events.emit('GENERATION_AFTER_COMMANDS', 'normal');
  assert.equal(host.calls.inject.length, 1); assert.equal(host.adapter.injected, true); assert.equal(input.value, 'Unsent draft stays intact'); assert.equal(userMessage.mes, 'Original user prompt stays intact');
  host.context().chat.push(rawAssistant('The committed visible flow reaches the test quay.'));
  await host.events.emit('GENERATION_ENDED');
  const record = controller.state.history.find((item) => item.actionId === 'integration-action');
  assert.equal(record.status, 'complete'); assert.equal(record.narrative.text, 'The committed visible flow reaches the test quay.'); assert.equal(adjudicator.calls.length, 1);
  const persisted = await host.adapter.loadSession(); assert.equal(persisted.state.history.at(-1).narrative.text, record.narrative.text); assert.equal(persisted.version, controller.state.version); assert.equal(host.calls.uninject, 1); assert.equal(host.adapter.scope().messageId, 0);
  controller.dispose();
});

function controllerStorage() {
  return { items: new Map(), getItem(key) { return this.items.get(key) || null; }, setItem(key, value) { this.items.set(key, value); } };
}
async function attachedController(host, { storage = controllerStorage(), adjudicator = new MockAdjudicator(), narrator = new MainStoryNarrator(), adapter = host.adapter } = {}) {
  const scope = adapter.scope();
  const controller = new BattleController({ storage, hostAdapter: adapter, chatId: scope.chatId, branchId: scope.branchId, adjudicator, narrator, initialScene: { location: 'Checkpoint quay', time: 'Noon' } });
  await controller.ready;
  await controller.checkpoints;
  return controller;
}

test('controller keeps a local commit but blocks narrator and main-story injection until failed host save is retried', async () => {
  const host = fixture(), adjudicator = new MockAdjudicator(), narrator = new MainStoryNarrator();
  let narrativeCalls = 0;
  const generate = narrator.generate.bind(narrator);
  narrator.generate = async (...args) => { narrativeCalls += 1; return generate(...args); };
  const controller = await attachedController(host, { adjudicator, narrator });
  try {
    controller.start(); await controller.checkpoints;
    const save = host.context().saveChat;
    host.context().saveChat = async () => { throw new Error('Fixture disk unavailable'); };
    const result = await controller.submit({ actionId: 'failed-controller-save', label: 'Establish a visible line', techniqueId: 'xianshi' });
    const committed = clone(controller.state.history[0]), semanticState = clone(controller.state.semanticState);

    assert.equal(result.record.status, 'committed');
    assert.equal(controller.state.phase, 'awaiting_next');
    assert.equal(controller.state.hostSync.status, 'pending');
    assert.equal(committed.narrativePacket.actionId, 'failed-controller-save');
    assert.equal(committed.narrative, undefined);
    assert.deepEqual(controller.storage.readSession().history[0], committed);
    assert.deepEqual(controller.storage.readSession().semanticState, semanticState);
    assert.equal(host.disk()[0].extra.battle_v2.state.history.length, 0, 'failed saves must not be mistaken for disk persistence');
    assert.equal(narrativeCalls, 0);
    assert.equal(host.adapter.packet, null);
    assert.equal(controller.bridgeQueuedAction, null);
    await host.events.emit('GENERATION_AFTER_COMMANDS', 'normal');
    assert.equal(host.calls.inject.length, 0);

    const duplicate = await controller.submit({ actionId: committed.actionId, label: 'Retry original action' });
    assert.equal(duplicate.deduplicated, true);
    host.context().saveChat = save;
    const retry = await controller.retryHostPersistence();
    assert.equal(retry.persisted, true); assert.equal(retry.confirmed, true);
    assert.equal(controller.state.hostSync.status, 'confirmed');
    assert.equal(host.adapter.packet.actionId, committed.actionId);
    assert.equal(controller.bridgeQueuedAction, committed.actionId);
    assert.equal(adjudicator.calls.length, 1);
    assert.equal(narrativeCalls, 0, 'retrying persistence must not invoke a narrator or repeat adjudication');
    assert.deepEqual(controller.state.semanticState, semanticState);
    assert.deepEqual(controller.state.history[0].adjudication, committed.adjudication);
    assert.equal(host.disk()[0].extra.battle_v2.receipts[committed.actionId].status, 'committed');
    await host.events.emit('GENERATION_AFTER_COMMANDS', 'normal');
    assert.equal(host.calls.inject.length, 1);
  } finally { controller.dispose(); }
});

test('a queued main-story packet blocks next round until generation or an explicit skip', async () => {
  const host = fixture(), adjudicator = new MockAdjudicator(), controller = await attachedController(host, { adjudicator });
  try {
    controller.start();
    await controller.submit({ actionId: 'queued-round-action', label: 'Keep this committed turn', techniqueId: 'xianshi' });
    const before = clone(controller.state), packet = clone(host.adapter.packet);
    assert.equal(controller.bridgeQueuedAction, 'queued-round-action');
    assert.throws(() => controller.continueNext(), /主剧情|正文|场景包/);
    assert.deepEqual(controller.state, before);
    assert.deepEqual(host.adapter.packet, packet);
    assert.equal(host.calls.inject.length, 0);

    controller.skipPendingNarrative(); await controller.checkpoints;
    assert.equal(controller.bridgeQueuedAction, null); assert.equal(host.adapter.packet, null);
    assert.equal(controller.state.history[0].narrative.pending, false);
    controller.continueNext(); await controller.checkpoints;
    assert.equal(controller.state.round, 2);
    assert.equal(controller.state.phase, 'awaiting_player');
    assert.equal(adjudicator.calls.length, 1);
    assert.deepEqual(controller.state.history[0].adjudication, before.history[0].adjudication);
  } finally { controller.dispose(); }
});

test('controller lifecycle checkpoints restore start, next-round, and stop from host disk without rolling back', async () => {
  const host = fixture(), adjudicator = new MockAdjudicator();
  let controller = await attachedController(host, { adjudicator });
  const refreshFromHost = async () => {
    const expected = clone(controller.state);
    controller.dispose(); host.reload();
    const adapter = new BattleHostAdapter(host.options);
    controller = await attachedController(host, { adjudicator, adapter });
    assert.equal(controller.state.sessionId, expected.sessionId);
    assert.equal(controller.state.version, expected.version);
    assert.equal(controller.state.phase, expected.phase);
    assert.equal(controller.state.round, expected.round);
    assert.equal(controller.state.roundId, expected.roundId);
    assert.deepEqual(controller.state.semanticState, expected.semanticState);
    assert.deepEqual(controller.state.history, expected.history);
    return expected;
  };
  try {
    controller.start(); await controller.checkpoints;
    assert.equal((await controller.hostAdapter.loadSession()).state.phase, 'awaiting_player');
    await refreshFromHost();
    await controller.submit({ actionId: 'lifecycle-action', label: 'Carry a committed effect', techniqueId: 'xianshi' });
    controller.skipPendingNarrative(); await controller.checkpoints;
    controller.continueNext(); await controller.checkpoints;
    assert.equal(controller.state.round, 2);
    assert.equal(controller.state.semanticState.effects[0].remainingRounds, 1);
    await refreshFromHost();
    controller.stop('Persisted stop'); await controller.checkpoints;
    assert.equal(controller.state.phase, 'ended');
    await refreshFromHost();
    assert.equal(adjudicator.calls.length, 1);
    assert.equal((await controller.hostAdapter.loadSession()).version, controller.state.version);
  } finally { controller.dispose(); }
});

test('a newer local lifecycle checkpoint survives refresh over older host disk and retries without rejudging', async () => {
  const host = fixture(), storage = controllerStorage(), adjudicator = new MockAdjudicator();
  let controller = await attachedController(host, { storage, adjudicator });
  try {
    controller.start();
    await controller.submit({ actionId: 'local-ahead-action', label: 'Preserve the visible effect', techniqueId: 'xianshi' });
    controller.skipPendingNarrative(); await controller.checkpoints;
    const durableVersion = host.disk()[0].extra.battle_v2.version, save = host.context().saveChat;
    host.context().saveChat = async () => { throw new Error('Fixture disk disconnected'); };
    controller.continueNext(); await controller.checkpoints;
    controller.stop('Latest local stop'); await controller.checkpoints;
    const newer = clone(controller.state);
    assert.equal(newer.hostSync.status, 'pending');
    assert.ok(newer.version > durableVersion);

    controller.dispose(); host.reload();
    const adapter = new BattleHostAdapter(host.options);
    controller = await attachedController(host, { storage, adjudicator, adapter });
    assert.equal(controller.state.version, newer.version);
    assert.equal(controller.state.phase, 'ended');
    assert.equal(controller.state.round, 2);
    assert.deepEqual(controller.state.semanticState, newer.semanticState);
    assert.deepEqual(controller.state.history, newer.history);
    assert.ok(controller.logs.some((entry) => entry.kind === 'host_local_ahead'));
    assert.equal(host.disk()[0].extra.battle_v2.version, durableVersion);
    host.context().saveChat = save;
    const retry = await controller.retryHostPersistence();
    assert.equal(retry.confirmed, true);
    assert.equal(host.disk()[0].extra.battle_v2.state.version, newer.version);
    assert.equal(host.disk()[0].extra.battle_v2.state.phase, 'ended');
    assert.equal(adjudicator.calls.length, 1);
  } finally { controller.dispose(); }
});
