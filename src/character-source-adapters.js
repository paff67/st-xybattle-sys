import { clone, normalizeChatCompletionsEndpoint } from './common.js';
import { DEFAULT_CHARACTER_COMPLETION_PROMPT, COMBAT_PROFILE_CONTRACT, ENEMY_GENERATION_POLICY, normalizePrompt } from './character-prompts.js';
import { normalizeCombatProfile, combatProfileIssues } from './combat-profile.js';

const text = (value) => value == null ? '' : String(value).trim();
const isObject = (value) => !!value && typeof value === 'object' && !Array.isArray(value);

function exactMatch(records, candidate) {
  const list = Array.isArray(records) ? records : records && typeof records === 'object' ? Object.entries(records).map(([key, value]) => isObject(value) ? ({ id: value.id || key, ...value }) : ({ id: key, name: value })) : [];
  const id = text(candidate?.id), name = text(candidate?.name);
  const matches = list.filter((item) => text(item?.id || item?.characterId || item?.uid) === id || text(item?.name || item?.characterName || item?.displayName || item?.姓名 || item?.名称) === name);
  if (matches.length > 1) throw new Error(`人物资料匹配歧义：${id || name}`);
  return matches[0] ? clone(matches[0]) : null;
}

function mvuRecords(data) {
  const root = data?.stat_data ?? data?.data?.stat_data ?? data;
  if (!root || typeof root !== 'object') return [];
  const player = root.player || root.protagonist || root.主角;
  const buckets = [root.enemies, root.opponents, root.characters, root.actors, root.敌方, root.对手, root.男性角色档案, root.女性角色档案, ...(player ? [[player]] : [])].filter(Boolean);
  if (buckets.length) return buckets.flatMap((value) => Array.isArray(value) ? value : Object.entries(value).map(([id, item]) => isObject(item) ? ({ id: item.id || id, name: item.name || item.姓名 || id, ...item }) : ({ id, name: item })));
  return Object.entries(root).filter(([, value]) => isObject(value)).map(([id, value]) => ({ id: value.id || id, ...value }));
}

export async function readMvuCharacter({ candidate, context = {} } = {}, { mvu = globalThis.Mvu } = {}) {
  if (!mvu?.getMvuData) return null;
  const scope = context.scope || context;
  const messageId = scope.messageId ?? context.messageId ?? context.message_id;
  if (messageId == null) throw new Error('MVU 当前消息作用域不可用');
  const data = await mvu.getMvuData({ type: 'message', message_id: messageId });
  const root = data?.stat_data ?? data?.data?.stat_data ?? data;
  const player = root?.主角 || root?.player || root?.protagonist;
  // The current MVU schema identifies the protagonist by its container, often
  // with no name field. Only the extracted player may use this role binding.
  const match = candidate?.role === 'player' && isObject(player)
    ? { ...clone(player), id: candidate.id, name: candidate.name }
    : exactMatch(mvuRecords(data), candidate);
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
  if (payload?.choices?.[0]?.finish_reason === 'length') throw new Error('人物档案输出被截断，请提高人物生成输出上限');
  const content = payload?.choices?.[0]?.message?.content ?? payload?.output_text ?? payload;
  if (typeof content === 'string') {
    const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] || content;
    return JSON.parse(fenced);
  }
  return content;
}

export function createCharacterJsonRequest({ endpoint, model, apiKey = '', fetchImpl = globalThis.fetch, timeoutMs = 60000, maxOutput = 5000, temperature = 0.4 } = {}) {
  if (!endpoint || typeof fetchImpl !== 'function') throw new Error('资料 AI 需要 endpoint 与 fetch');
  return async (instruction, context, requestTimeoutMs = timeoutMs, signal) => {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) throw new DOMException('人物 AI 请求已取消', 'AbortError');
    signal?.addEventListener('abort', abort, { once: true });
    const timer = setTimeout(abort, requestTimeoutMs);
    try {
      const response = await fetchImpl(normalizeChatCompletionsEndpoint(endpoint), { method: 'POST', headers: { 'content-type': 'application/json', ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}) }, body: JSON.stringify({ model: model || '', temperature, max_tokens: maxOutput, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: instruction }, { role: 'user', content: `上下文：${JSON.stringify(context)}` }] }), signal: controller.signal });
      return await readResponse(response);
    } catch (error) {
      if (controller.signal.aborted && !signal?.aborted) throw new Error('人物 AI 请求超时，请重试生成');
      throw error;
    } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
  };
}

export function createHttpCharacterInference({ endpoint, model, apiKey = '', fetchImpl = globalThis.fetch, timeoutMs = 60000, fillTimeoutMs = 15000, maxOutput = 5000, temperature = 0.4, characterCompletionPrompt = DEFAULT_CHARACTER_COMPLETION_PROMPT } = {}) {
  if (!endpoint || typeof fetchImpl !== 'function') throw new Error('人物 AI 需要 endpoint 与 fetch');
  const request = createCharacterJsonRequest({ endpoint, model, apiKey, fetchImpl, timeoutMs, maxOutput, temperature });
  const enemyRequest = createCharacterJsonRequest({ endpoint, model, apiKey, fetchImpl, timeoutMs, maxOutput: Math.min(maxOutput, 4000), temperature });
  return {
    async inferParticipants(context, { signal } = {}) {
      const extractionContext = { ...clone(context), registry: (context.registry || []).map(entry => ({ id: entry.id, name: entry.name, techniques: entry.techniques.map(move => ({ id: move.id, name: move.name })) })) };
      return request('从聊天和人设识别当前实际主角与敌人及当前场景。场景额外返回 scene:{location,time,weather,terrain,tags:[]}，只提取正文已有事实，未知留空，禁止演示场景。返回 {"player":{"name":"主角实际姓名","explicitFacts":{}},"candidates":[{"id":"可选稳定标识","name":"敌人姓名","explicitFacts":{},"inferred":{}}]}。主角不是助手角色的默认称呼，不得复用演示人物；主角依据不足时 player=null。角色卡仅是证据，不能直接认定其角色是主角。提取已有境界、功法、当前状态、资源和战斗偏好，明确事实放 explicitFacts；此步只识别人物与已有事实，不构造完整档案，敌人未描述的资料由下一步自动生成，不要求用户提供。', extractionContext, timeoutMs, signal);
    },
    async inferCandidates(context, { signal } = {}) { const result = await request('只提取敌方候选人物，返回 {"candidates":[{"id":"...","name":"...","explicitFacts":{},"inferred":{}}]}。明确事实放 explicitFacts；不确定的内容放 inferred；不要构造完整人物。', clone(context), timeoutMs, signal); return Array.isArray(result) ? result : result?.candidates || []; },
    async completeCandidate({ candidate, knownFields, context, signal, side = 'enemy' } = {}) {
      let result, issues, partialProfile;
      // Enemy generation needs the scene and enemy evidence, not the complete
      // protagonist six-arts rule library (large and not owned by this NPC).
      const completionContext = side === 'enemy'
        ? { scope: context?.scope, recentMessages: context?.recentMessages, scene: context?.scene, characterCard: context?.characterCard }
        : context;
      const style = normalizePrompt(characterCompletionPrompt, DEFAULT_CHARACTER_COMPLETION_PROMPT).replace(COMBAT_PROFILE_CONTRACT, '').trim();
      const instruction = `${style}\n\n以下输出契约优先于上方可编辑风格提示：\n${COMBAT_PROFILE_CONTRACT}${side === 'enemy' ? `\n\n${ENEMY_GENERATION_POLICY}` : ''}`;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const ask = side === 'enemy' ? enemyRequest : request;
          result = await ask(instruction, { task: 'complete_combat_profile', side, candidate, knownFields, context: completionContext, ...(attempt ? { repair: { issues, previous: result } } : {}) }, timeoutMs, signal);
          partialProfile = normalizeCombatProfile(result, { id: candidate?.id, side });
          const profile = normalizeCombatProfile(result, { id: candidate?.id, side, registry: context?.registry || [] });
          partialProfile = profile;
          issues = combatProfileIssues(profile);
          if (!issues.length) return profile;
        } catch (error) {
          if (signal?.aborted || error.name === 'AbortError') throw error;
          issues = [error.message];
        }
      }
      throw Object.assign(new Error(`${side === 'enemy' ? '敌人自动生成未完成，请重试生成' : '人物档案仍不完整'}：${issues.join('；')}`), { partialProfile });
    },
    async fillMissingFields({ candidate, knownFields, context, signal }) { const result = await request('仅补全明确缺失字段，返回 {"fields":{...},"inferred":true}，不得覆盖已有字段。', { candidate, knownFields, context }, fillTimeoutMs, signal); return result?.fields || result || {}; }
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
