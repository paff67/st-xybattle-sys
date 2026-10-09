import { stripSecrets } from './common.js';
import { canonicalEvent, inputSnapshot, inputDigest, EVENT_NAMESPACE } from './event-state.js';
import { battlefieldProjection } from './event-battlefield-state.js';
import { narrativeActors } from './narrative-profile.js';
import { storyText } from './story-context.js';

const copy = value => JSON.parse(JSON.stringify(value));
const selectedVariables = message => Array.isArray(message?.variables) ? message.variables[message.swipe_id || 0] : message?.variables;
const mvuRoot = value => value?.stat_data ?? value?.data?.stat_data ?? value ?? null;

// Adapters only read the anchored message and exported tables. Schema changes
// belong here, not in MVU/ACU transaction/provenance fields.
export function createEventContextReader({ contextProvider = () => globalThis.SillyTavern?.getContext(), mvu = () => globalThis.Mvu,
  database = () => globalThis.AutoCardUpdaterAPI, readMvu, readAcu, adaptMvu = mvuRoot, adaptAcu = value => value,
  acuTableName = '全局数据表', historyLimit = 12, historyChars = 2400 } = {}) {
  return async ({ message, event, signal }) => {
    const context = contextProvider(), chat = context?.chat;
    const at = chat?.indexOf(message);
    const chatId = context?.chatId;
    const avatar = context?.characters?.[context.characterId]?.avatar;
    if (!Array.isArray(chat) || at < 0 || !message?.is_user || context.groupId || String(context.chatId) !== event.chatId || !avatar) throw new Error('资料读取缺少当前输入作用域');
    const fingerprint = () => canonicalEvent(chat.slice(0, at + 1).map(row => ({ input: inputSnapshot(row), user: row.is_user,
      swipe: row.swipe_id || 0, variables: selectedVariables(row), identity: row.extra?.[EVENT_NAMESPACE]?.messageUid })));
    const before = fingerprint();
    const assertFresh = () => {
      const current = contextProvider();
      if (signal?.aborted) throw new DOMException('资料准备已取消', 'AbortError');
      if (current?.chat !== chat || current.chatId !== chatId || current.groupId || current.characters?.[current.characterId]?.avatar !== avatar || chat[at] !== message || fingerprint() !== before) throw new Error('资料作用域、输入或分支已变化');
    };
    assertFresh();
    if (await inputDigest(message) !== event.originalInputHash) throw new Error('资料输入摘要不匹配');
    const prior = chat.slice(0, at);
    // Anchor the immediately preceding assistant. If its MVU update is missing,
    // do not silently borrow older resources from an earlier narrative turn.
    const anchor = prior.findLastIndex(row => !row.is_user && !row.is_system);
    const query = { messageId: anchor, swipeId: anchor < 0 ? null : chat[anchor].swipe_id || 0, chatId: event.chatId, branchUid: event.branchUid, signal };
    let rawMvu = null;
    if (anchor >= 0) {
      if (readMvu) rawMvu = await readMvu(query);
      else {
        rawMvu = selectedVariables(chat[anchor]);
        const api = typeof mvu === 'function' ? mvu() : mvu;
        if (!rawMvu?.stat_data && api?.getMvuData) rawMvu = await api.getMvuData({ type: 'message', message_id: anchor });
      }
    }
    assertFresh();
    const api = typeof database === 'function' ? database() : database;
    const rawAcu = readAcu ? await readAcu(query) : api?.exportTableAsJson ? await api.exportTableAsJson() : null;
    assertFresh();
    const mvuData = stripSecrets(copy(adaptMvu(rawMvu) ?? null));
    const acuData = stripSecrets(copy(adaptAcu(rawAcu) ?? null));
    const history = prior.map((row, index) => ({ row, index })).filter(({ row }) => !row.is_system)
      .slice(-historyLimit).map(({ row, index }) => ({ id: `history:${index}`, role: row.is_user ? 'user' : 'assistant', text: (row.is_user ? String(row.mes || '') : storyText(row.mes)).slice(-historyChars) }));
    const input = { id: 'input', text: String(message.mes || '') };
    const sources = [{ id: 'input', kind: 'intent', branchKnown: true, data: input.text },
      ...history.map(row => ({ id: row.id, kind: 'history', branchKnown: true, data: row.text })),
      ...(mvuData ? [{ id: 'mvu', kind: 'mvu', branchKnown: true, data: mvuData }] : []),
      ...(mvuData ? [{ id: 'actor-candidates', kind: 'mvu', branchKnown: true, data: narrativeActors(mvuData) }] : []),
      ...(acuData ? [{ id: 'acu', kind: 'acu', branchKnown: false, data: acuData }] : [])];
    const battlefield = battlefieldProjection(mvuData, acuData, { tableName: acuTableName });
    return { input, history, sources, battlefield, assertFresh, hasAttachments: Object.keys(inputSnapshot(message).attachments).length > 0,
      scope: { chatId: event.chatId, branchUid: event.branchUid, inputMessageUid: event.inputMessageUid, originalInputHash: event.originalInputHash, anchorMessageId: anchor, anchorSwipeId: query.swipeId } };
  };
}
