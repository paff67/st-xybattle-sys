import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { HostInputBridge, serializeBattlePacket, parseBattlePackets, appendBattlePacket } from '../src/host-input-bridge.js';
import { foldBattlePacketDom } from '../src/host-display-folding.js';
import { BattleHostAdapter } from '../src/host-adapter.js';

const makePacket = (version = 3) => ({ type: 'BATTLE_SCENE_PACKET', actionId: 'action!1', version, scope: { branchId: 'message:0:swipe:0' }, committedFacts: ['事实 [[/XY_BATTLE_PACKET]] 仍是正文数据'] });

test('XY_BATTLE_PACKET round-trips special identities and delimiter-like payload text', () => {
  const source = serializeBattlePacket(makePacket(), { version: 3 });
  const parsed = parseBattlePackets(source);
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].packet.committedFacts[0], makePacket().committedFacts[0]);
  assert.equal(appendBattlePacket(source, makePacket(), { version: 3 }).deduplicated, true);
});

test('HostInputBridge appends once, dispatches input/change, and clears only its suffix', () => {
  const dom = new JSDOM('<textarea id="send_textarea">原始提示</textarea>');
  const textarea = dom.window.document.querySelector('textarea');
  const events = [];
  textarea.addEventListener('input', () => events.push('input'));
  textarea.addEventListener('change', () => events.push('change'));
  const bridge = new HostInputBridge({ documentRef: dom.window.document, windowRef: dom.window, bindPageLifecycle: false });
  const first = bridge.append(makePacket(), { branchId: makePacket().scope.branchId, version: 3 });
  const value = textarea.value;
  const duplicate = bridge.append(makePacket(), { branchId: makePacket().scope.branchId, version: 3 });
  assert.equal(first.injected, true); assert.equal(duplicate.deduplicated, true); assert.equal(textarea.value, value);
  assert.deepEqual(events, ['input', 'change']);
  textarea.value += ' 用户补充';
  assert.equal(bridge.clear().cleared, false);
  assert.match(textarea.value, /XY_BATTLE_PACKET/);
  bridge.dispose();
});

test('existing legacy marker is upgraded without duplicating facts or restoring stale instructions on cleanup', () => {
  const packet = { ...makePacket(), committedFacts: ['本轮未受伤'], descriptionRequirements: ['强写创伤'], storyAiDirective: '完整旧包', playerVisibleContext: { currentState: '过时状态' } };
  const header = encodeURIComponent(JSON.stringify({ actionId: packet.actionId, version: packet.version, branchId: packet.scope.branchId }));
  const legacy = `[[XY_BATTLE_PACKET v1 ${header}]]\n${JSON.stringify(packet)}\n[[/XY_BATTLE_PACKET]]`;
  const dom = new JSDOM('<textarea id="send_textarea"></textarea>');
  const textarea = dom.window.document.querySelector('textarea'); textarea.value = `玩家前文\n${legacy}\n玩家后文`;
  const bridge = new HostInputBridge({ documentRef: dom.window.document, windowRef: dom.window, bindPageLifecycle: false });
  assert.equal(bridge.append(packet, { version: 3 }).queued, true);
  assert.equal(parseBattlePackets(textarea.value).length, 1);
  assert.doesNotMatch(textarea.value, /强写创伤|完整旧包|过时状态/);
  assert.match(textarea.value, /本轮未受伤/);
  bridge.clear();
  assert.equal(textarea.value, '玩家前文\n\n玩家后文');
  bridge.dispose(); dom.window.close();
});

test('display folding works across text nodes and br while preserving ordinary links', () => {
  const dom = new JSDOM('<div class="mes_text"></div>');
  const root = dom.window.document.querySelector('.mes_text');
  const marker = serializeBattlePacket(makePacket(), { version: 3 });
  const lines = marker.split('\n');
  const before = dom.window.document.createElement('p');
  before.append('before');
  const emphasis = dom.window.document.createElement('em'); emphasis.textContent = lines[0]; before.append(dom.window.document.createElement('br'), emphasis);
  root.append(before, dom.window.document.createElement('br'));
  const code = dom.window.document.createElement('code'); code.textContent = lines[1]; root.append(code, dom.window.document.createElement('br'));
  const after = dom.window.document.createElement('p'); after.append(lines[2], ' after ');
  const link = dom.window.document.createElement('a'); link.href = '/keep'; link.textContent = 'link'; after.append(link); root.append(after);
  let clicked = false; link.addEventListener('click', () => { clicked = true; });
  const result = foldBattlePacketDom(root, { documentRef: dom.window.document });
  assert.equal(result.folded, 1);
  assert.equal(root.querySelectorAll('[data-xy-battle-packet-key]').length, 1);
  assert.equal(root.querySelector('a').getAttribute('href'), '/keep');
  root.querySelector('a').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
  assert.equal(clicked, true);
  assert.match(root.textContent, /before/); assert.match(root.textContent, /after/);
});

test('display folding does not cross message containers', () => {
  const dom = new JSDOM('<div id="chat"><div class="mes_text" id="a">one</div><div class="mes_text" id="b">two</div></div>');
  const chat = dom.window.document.querySelector('#chat');
  const marker = serializeBattlePacket(makePacket(), { version: 3 });
  dom.window.document.querySelector('#a').textContent = marker.slice(0, Math.floor(marker.length / 2));
  dom.window.document.querySelector('#b').textContent = marker.slice(Math.floor(marker.length / 2));
  assert.equal(foldBattlePacketDom(chat, { documentRef: dom.window.document }).folded, 0);
});

test('BattleHostAdapter queues into the input before generation and avoids prompt double injection', async () => {
  const dom = new JSDOM('<textarea id="send_textarea">玩家原始文字</textarea>');
  const textarea = dom.window.document.querySelector('textarea');
  const handlers = new Map();
  const events = { on(name, fn) { if (!handlers.has(name)) handlers.set(name, new Set()); handlers.get(name).add(fn); }, off(name, fn) { handlers.get(name)?.delete(fn); }, async emit(name, ...args) { for (const fn of [...handlers.get(name) || []]) await fn(...args); } };
  const assistant = { is_user: false, mes: '上一条正文', swipe_id: 0, swipes: ['上一条正文'], variables: [{}], swipe_info: [{}], extra: {} };
  const context = { chatId: 'chat-input', chat: [assistant], eventSource: events, saveChat: async () => {} };
  let promptCalls = 0;
  const helper = {
    getChatMessages(id, options) {
      const raw = context.chat[id]; if (!raw) return [];
      if (!options?.include_swipes) return [{ message_id: id, message: raw.mes, role: raw.is_user ? 'user' : 'assistant', extra: raw.extra }];
      return [{ message_id: id, role: raw.is_user ? 'user' : 'assistant', swipe_id: raw.swipe_id, swipes: raw.swipes, swipes_data: raw.variables, swipes_info: raw.swipe_info }];
    },
    async setChatMessages(messages) { for (const message of messages) { const raw = context.chat[message.message_id]; Object.assign(raw, { swipe_id: message.swipe_id, swipes: message.swipes, variables: message.swipes_data, swipe_info: message.swipes_info, mes: message.swipes[message.swipe_id], extra: message.swipes_info[message.swipe_id] }); } },
    injectPrompts() { promptCalls += 1; return { uninject() {} }; }
  };
  const adapter = new BattleHostAdapter({ contextProvider: () => context, helper, eventEmitter: events, documentRef: dom.window.document, windowRef: dom.window });
  const scope = adapter.scope();
  const receipt = { schema: 'battle_v2_receipt', actionId: 'queued-input', status: 'committed', version: 3, scope };
  const state = { schema: 'battle_v2', version: 3, phase: 'committed', sessionId: 's', scope, history: [] };
  const queuedPacket = { ...makePacket(3), actionId: 'queued-input', scope };
  assert.equal((await adapter.persistReceipt(receipt, state, scope)).confirmed, true);
  assert.equal((await adapter.injectScenePacket(queuedPacket, scope)).queued, true);
  assert.match(textarea.value, /XY_BATTLE_PACKET/);
  await events.emit('GENERATION_AFTER_COMMANDS', 'normal');
  context.chat.push({ is_user: true, mes: textarea.value });
  textarea.value = '';
  await events.emit('USER_MESSAGE_RENDERED', 1);
  assert.equal(promptCalls, 0);
  assert.equal(parseBattlePackets(context.chat[1].mes).length, 1);
  adapter.dispose();
});

