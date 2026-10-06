import { clone } from './common.js';

const text = (value) => value == null ? '' : String(value).trim();
const isObject = (value) => !!value && typeof value === 'object' && !Array.isArray(value);

function exactMatch(records, candidate) {
  const list = Array.isArray(records) ? records : records && typeof records === 'object' ? Object.entries(records).map(([key, value]) => isObject(value) ? ({ id: value.id || key, ...value }) : ({ id: key, name: value })) : [];
  const id = text(candidate?.id), name = text(candidate?.name);
  const matches = list.filter((item) => text(item?.id || item?.characterId || item?.uid) === id || text(item?.name || item?.characterName || item?.displayName) === name);
  if (matches.length > 1) throw new Error(`人物资料匹配歧义：${id || name}`);
  return matches[0] ? clone(matches[0]) : null;
}

function mvuRecords(data) {
  const root = data?.stat_data ?? data?.data?.stat_data ?? data;
  if (!root || typeof root !== 'object') return [];
  const buckets = [root.enemies, root.opponents, root.characters, root.actors, root.敌方, root.对手].filter(Boolean);
  if (buckets.length) return buckets.flatMap((value) => Array.isArray(value) ? value : Object.entries(value).map(([id, item]) => isObject(item) ? ({ id: item.id || id, ...item }) : ({ id, name: item })));
  return Object.entries(root).filter(([, value]) => isObject(value)).map(([id, value]) => ({ id: value.id || id, ...value }));
}

export async function readMvuCharacter({ candidate, context = {} } = {}, { mvu = globalThis.Mvu } = {}) {
  if (!mvu?.getMvuData) return null;
  const scope = context.scope || context;
  const messageId = scope.messageId ?? context.messageId ?? context.message_id;
  if (messageId == null) throw new Error('MVU 当前消息作用域不可用');
  const data = await mvu.getMvuData({ type: 'message', message_id: messageId });
  const match = exactMatch(mvuRecords(data), candidate);
  return match ? { ...match, sourceScope: { chatId: scope.chatId, branchId: scope.branchId, messageId, swipeId: scope.swipeId }, sourceKind: 'mvu_dynamic', branchKnown: true } : null;
}

function tableRows(exported) {
  return Object.values(exported || {}).flatMap((table) => {
    const content = table?.content;
    if (!Array.isArray(content) || !Array.isArray(content[0])) return [];
    const headers = content[0].map((header) => text(header));
    return content.slice(1).filter(Array.isArray).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index]])));
  });
}

export async function readDatabaseCharacter({ candidate } = {}, { database = globalThis.AutoCardUpdaterAPI } = {}) {
  if (!database?.exportTableAsJson) return null;
  const exported = await database.exportTableAsJson();
  const match = exactMatch(tableRows(exported), candidate);
  // Database rows may belong to another swipe/branch. They are usable as
  // review material, never as an authoritative dynamic fact.
  return match ? { ...match, sourceKind: 'database', sourceScope: { branchKnown: false }, branchKnown: false } : null;
}

async function readResponse(response) {
  if (!response?.ok) throw new Error(`人物 AI HTTP ${response?.status || '失败'}`);
  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content ?? payload?.output_text ?? payload;
  if (typeof content === 'string') {
    const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] || content;
    return JSON.parse(fenced);
  }
  return content;
}

export function createHttpCharacterInference({ endpoint, model, apiKey = '', fetchImpl = globalThis.fetch, timeoutMs = 30000 } = {}) {
  if (!endpoint || typeof fetchImpl !== 'function') throw new Error('人物 AI 需要 endpoint 与 fetch');
  const request = async (instruction, context) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(endpoint, { method: 'POST', headers: { 'content-type': 'application/json', ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}) }, body: JSON.stringify({ model: model || '', temperature: 0, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: '你是战斗前人物资料辅助器。只返回JSON；不得创造未给出的事实；推断字段必须标记 inferred。' }, { role: 'user', content: `${instruction}\n上下文：${JSON.stringify(context)}` }] }), signal: controller.signal });
      return await readResponse(response);
    } finally { clearTimeout(timer); }
  };
  return {
    async inferCandidates(context) { const result = await request('提取敌方候选人物，返回 {"candidates":[{"id":"...","name":"...","explicitFacts":{},"inferred":{}}]}。明确事实放 explicitFacts；不确定的补全放 inferred，不得把推断当作事实。', clone(context)); return Array.isArray(result) ? result : result?.candidates || []; },
    async fillMissingFields({ candidate, knownFields, context }) { const result = await request('仅补全明确缺失字段，返回 {"fields":{...},"inferred":true}，不得覆盖已有字段。', { candidate, knownFields, context }); return result?.fields || result || {}; }
  };
}

export function createReadOnlyCharacterSourceAdapters(options = {}) {
  const mvu = options.mvu || globalThis.Mvu;
  const database = options.database || globalThis.AutoCardUpdaterAPI;
  return {
    mvu: (query) => readMvuCharacter(query, { mvu }),
    database: (query) => readDatabaseCharacter(query, { database }),
    ...(options.inference ? { inference: options.inference } : {})
  };
}
