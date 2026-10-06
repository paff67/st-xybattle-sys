import { clone } from './common.js';
import { DEFAULT_CHARACTER_COMPLETION_PROMPT, normalizePrompt } from './character-prompts.js';

const text = (value) => value == null ? '' : String(value).trim();
const exact = (row, candidate) => {
  const id = text(row?.id || row?.characterId || row?.uid || row?.uuid);
  const name = text(row?.name || row?.characterName || row?.displayName);
  return id === text(candidate.id) || name === text(candidate.name);
};

function findExact(value, candidate) {
  if (Array.isArray(value)) return value.filter((item) => exact(item, candidate));
  if (!value || typeof value !== 'object') return [];
  const found = [];
  for (const bucket of ['enemies', 'opponents', 'characters', 'actors', 'profiles', 'data']) {
    const nested = value[bucket];
    if (Array.isArray(nested)) found.push(...nested.filter((item) => exact(item, candidate)));
    else if (nested && typeof nested === 'object') {
      for (const [key, item] of Object.entries(nested)) if (key === candidate.id || key === candidate.name || exact(item, candidate)) found.push(item);
    }
  }
  if (value[candidate.id]) found.push(value[candidate.id]);
  if (value[candidate.name]) found.push(value[candidate.name]);
  if (exact(value, candidate)) found.push(value);
  return [...new Set(found)];
}

function one(value, candidate) {
  const found = findExact(value, candidate);
  if (found.length > 1) throw new Error(`人物 ${candidate.id} 的来源结果存在歧义`);
  return found[0] ? clone(found[0]) : null;
}

/** Read only the MVU message scope and return an exact character match. */
export async function readMvuCharacter({ candidate, context = {} } = {}, { mvu = globalThis.Mvu } = {}) {
  if (!mvu?.getMvuData) return null;
  const scope = context.scope || context;
  if (scope.messageId == null && scope.message_id == null) return null;
  const raw = await mvu.getMvuData({ type: 'message', message_id: scope.messageId ?? scope.message_id });
  const row = one(raw?.stat_data || raw?.data || raw, candidate);
  return row ? { ...row, _sourceScope: { chatId: scope.chatId, branchId: scope.branchId, messageId: scope.messageId ?? scope.message_id, swipeId: scope.swipeId }, _branchKnown: true } : null;
}

/** Read only an exported AutoCardUpdater table; no write/update API is used. */
export async function readDatabaseCharacter({ candidate } = {}, { database = globalThis.AutoCardUpdaterAPI } = {}) {
  const exporter = database?.exportTableAsJson || database?.exportTable || database?.getTableJson;
  if (!exporter) return null;
  const raw = await exporter.call(database);
  let rows = raw;
  if (typeof raw === 'string') rows = JSON.parse(raw);
  if (rows?.rows && rows?.columns) rows = rows.rows.map((row) => Object.fromEntries(rows.columns.map((key, i) => [key, row[i]])));
  const row = one(rows?.characters || rows?.profiles || rows, candidate);
  return row ? { ...row, _sourceScope: { database: true }, _branchKnown: false } : null;
}

export function createHttpCharacterInference({ endpoint, model = '', apiKey = '', fetchImpl = globalThis.fetch, timeoutMs = 60000, maxOutput = 5000, temperature = 0.4, characterCompletionPrompt = DEFAULT_CHARACTER_COMPLETION_PROMPT } = {}) {
  if (!endpoint) throw new Error('人物推断 endpoint 缺失');
  const request = async (payload, { signal } = {}) => {
    const controller = new AbortController();
    const abort = () => controller.abort();
    signal?.addEventListener('abort', abort, { once: true });
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(endpoint, { method: 'POST', headers: { 'content-type': 'application/json', ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}) }, body: JSON.stringify({ model, temperature, max_tokens: maxOutput, stream: false, ...payload }), signal: controller.signal });
      if (!response.ok) throw new Error(`人物推断 HTTP ${response.status}`);
      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content ?? data?.output_text ?? data?.content;
      if (typeof content === 'string') { try { return JSON.parse(content); } catch { return { candidates: [] }; } }
      return content || {};
    } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
  };
  return {
    async inferCandidates(context, { signal, prompt } = {}) {
      const instruction = normalizePrompt(prompt, '从上下文提取敌方人物候选。只返回 {"candidates":[{"id","name","explicitFacts":{}}]}，不得补全未知字段。');
      const result = await request({ messages: [{ role: 'system', content: instruction }, { role: 'user', content: JSON.stringify({ task: 'extract_enemy_candidates', context }) }] }, { signal });
      return result.candidates || result.enemies || [];
    },
    async completeCandidate({ candidate, knownFields, context, signal, prompt } = {}) {
      const instruction = normalizePrompt(prompt, characterCompletionPrompt);
      const result = await request({ messages: [{ role: 'system', content: instruction }, { role: 'user', content: JSON.stringify({ task: 'complete_enemy_candidate', candidate, knownFields, context }) }] }, { signal });
      return result.candidate || result.fields || result;
    },
    async fillMissingFields({ candidate, knownFields, missingFields, context, signal, prompt } = {}) {
      const result = await request({ messages: [{ role: 'system', content: normalizePrompt(prompt, characterCompletionPrompt) }, { role: 'user', content: JSON.stringify({ task: 'fill_enemy_fields', candidate, knownFields, missingFields, context }) }] }, { signal });
      return result.fields || result.candidate || result;
    }
  };
}

export function createReadOnlyCharacterSourceAdapters({ mvu, database, inference } = {}) {
  return { mvu: (query) => readMvuCharacter(query, { mvu }), database: (query) => readDatabaseCharacter(query, { database }), inference };
}
