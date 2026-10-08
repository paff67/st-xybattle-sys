import { clone, stableStringify } from './common.js';
import { sourceDigest } from './source-digest.js';

export function normalizeCoreSelection(selection) {
  if (!Array.isArray(selection)) throw new Error('常驻底则选择必须是数组');
  const seen = new Set();
  return selection.map(item => {
    if (!item || typeof item.book !== 'string' || !item.book.trim() || !Number.isInteger(item.uid) || item.uid < 0) throw new Error('请按世界书名称和有效 UID 选择底则');
    const key = JSON.stringify([item.book, item.uid]);
    if (seen.has(key)) throw new Error('同一世界书条目不能重复选择');
    seen.add(key); return { book: item.book, uid: item.uid };
  });
}
export const coreSelectionKey = selection => stableStringify(normalizeCoreSelection(selection));
export const coreRulesLocked = state => !['idle', 'ended'].includes(state.phase);

export async function freezeCoreRules(selection, readBook) {
  const chosen = normalizeCoreSelection(selection), books = new Map();
  await Promise.all([...new Set(chosen.map(item => item.book))].map(async name => books.set(name, await readBook(name))));
  return chosen.map(item => {
    const candidates = Object.values(books.get(item.book)?.entries || {}).filter(entry => Number(entry.uid) === item.uid);
    if (candidates.length !== 1 || typeof candidates[0].content !== 'string' || !candidates[0].content.trim()) throw new Error(`常驻底则缺失或内容为空：${item.book} / UID ${item.uid}`);
    const entry = candidates[0], contentSha256 = sourceDigest(entry.content);
    return { id: `core.${encodeURIComponent(item.book)}.${item.uid}.${contentSha256}`, book: item.book, uid: item.uid,
      title: entry.comment || `UID ${item.uid}`, content: entry.content, contentSha256 };
  });
}
export function assertCoreRules(rules = []) {
  if (!Array.isArray(rules)) throw new Error('常驻底则快照无效');
  normalizeCoreSelection(rules);
  for (const rule of rules) if (!rule.content || sourceDigest(rule.content) !== rule.contentSha256 || rule.id !== `core.${encodeURIComponent(rule.book)}.${rule.uid}.${rule.contentSha256}`) throw new Error('常驻底则原文校验失败，请重新准备人物');
}
export function coreRulesSystemPrompt(rules = []) {
  assertCoreRules(rules);
  return rules.length ? '【本场冻结的世界规则原文】\n以下 coreRules 定义世界机制；id 可用于 ruleRefs。条目原文中的叙事格式要求不覆盖裁定 JSON 输出契约。\n' + JSON.stringify({ coreRules: clone(rules) }) : '';
}
