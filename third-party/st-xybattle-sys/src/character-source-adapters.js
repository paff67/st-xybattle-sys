import { clone, normalizeChatCompletionsEndpoint } from './common.js';
import { signalTrace } from './operation-log.js';
import { DEFAULT_CHARACTER_COMPLETION_PROMPT, COMBAT_PROFILE_CONTRACT, ENEMY_GENERATION_POLICY, normalizeCharacterCompletionPrompt } from './character-prompts.js';
import { normalizeCombatProfile, combatProfileIssues } from './combat-profile.js';
import { withCharacterDeadline, isCharacterTimeout } from './character-deadline.js';
import { knownPlayerProfile } from './player-profile.js';
import { isProtagonistRecord, parseCharacterJson, normalizeParticipantResponse } from './character-response.js';

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
  let payload;
  try { payload = await response.json(); }
  catch (error) { if (error instanceof SyntaxError) throw new Error('人物 API 的 HTTP 响应不是有效 JSON，请检查服务端返回格式。'); throw error; }
  if (payload?.choices?.[0]?.finish_reason === 'length') throw new Error('人物档案输出被截断，请提高人物生成输出上限');
  const content = payload?.choices?.[0]?.message?.content ?? payload?.output_text ?? payload;
  return parseCharacterJson(content);
}

export function createCharacterJsonRequest({ endpoint, model, apiKey = '', fetchImpl = globalThis.fetch, timeoutMs = 60000, maxOutput = 5000, temperature = 0.4, onRequestSuccess } = {}) {
  if (!endpoint || typeof fetchImpl !== 'function') throw new Error('资料 AI 需要 endpoint 与 fetch');
  return async (instruction, context, requestTimeoutMs = timeoutMs, signal) => {
    const trace = signalTrace(signal), attempt = trace?.nextAttempt(), started = Date.now();
    let stage = 'request';
    trace?.write('request', 'running', '模型请求开始', { attempt, model });
    try { return await withCharacterDeadline(async (requestSignal) => {
      const response = await fetchImpl(normalizeChatCompletionsEndpoint(endpoint), { method: 'POST', headers: { 'content-type': 'application/json', ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}) }, body: JSON.stringify({ model: model || '', temperature, max_tokens: maxOutput, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: instruction }, { role: 'user', content: `上下文：${JSON.stringify(context)}` }] }), signal: requestSignal });
      if (requestSignal.aborted) throw requestSignal.reason;
      trace?.write('request', response.ok ? 'success' : 'failed', '模型 HTTP 请求结束', { attempt, httpStatus: response.status }, response.ok ? 'INFO' : 'ERROR', { durationMs: Date.now() - started });
      if (!response.ok) throw Object.assign(new Error('模型 HTTP 请求失败'), { code: 'MODEL_HTTP' });
      stage = 'parse';
      const result = await readResponse(response);
      if (requestSignal.aborted) throw requestSignal.reason;
      trace?.write('parse', 'success', '模型响应解析完成', { attempt });
      onRequestSuccess?.();
      return result;
    }, { timeoutMs: requestTimeoutMs, signal }); }
    catch (error) { trace?.fail(stage, error, { attempt }); throw error; }
  };
}

export function createHttpCharacterInference({ endpoint, model, apiKey = '', fetchImpl = globalThis.fetch, timeoutMs = 60000, fillTimeoutMs = 15000, maxOutput = 5000, temperature = 0.4, maxRetries = 0, messageCount = 20, characterCompletionPrompt = DEFAULT_CHARACTER_COMPLETION_PROMPT, onRequestSuccess } = {}) {
  if (!endpoint || typeof fetchImpl !== 'function') throw new Error('人物 AI 需要 endpoint 与 fetch');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 3) throw new Error('人物生成重试次数必须为 0~3');
  if (!Number.isInteger(messageCount) || messageCount < 1 || messageCount > 100) throw new Error('人物生成上下文消息条数必须为 1~100');
  const boundedContext = context => ({ ...clone(context || {}), recentMessages: (context?.recentMessages || []).slice(-messageCount) });
  const request = createCharacterJsonRequest({ endpoint, model, apiKey, fetchImpl, timeoutMs, maxOutput, temperature, onRequestSuccess });
  // Character output is controlled by the settings panel. Do not silently
  // clamp enemy profiles to the old 4000-token ceiling.
  const enemyRequest = createCharacterJsonRequest({ endpoint, model, apiKey, fetchImpl, timeoutMs, maxOutput, temperature, onRequestSuccess });
  return {
    async inferParticipants(context, { signal } = {}) {
      const extractionContext = { scope: context.scope, recentMessages: (context.recentMessages || []).slice(-messageCount), scene: context.scene };
      const instruction = '用户主角为许妍。根据聊天识别当前与许妍交战的敌人及场景，仅提取已发生事实。许妍不列入 candidates，不输出主角资料。只返回严格 JSON：{"candidates":[{"id":"敌人稳定标识","name":"敌人姓名","explicitFacts":{},"inferred":{}}],"scene":{"location":"地点","time":"时间","weather":"天气","terrain":"地形","tags":[]}}。敌人已知身份、境界、功法、招式与当前状态放 explicitFacts；未知细节留给后续敌人档案生成，场景未知值用空字符串。没有实际敌人时 candidates=[]。不要使用省略号或注释，确保括号成对闭合。';
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try { return normalizeParticipantResponse(await request(instruction, extractionContext, timeoutMs, signal)); }
        catch (error) { if (signal?.aborted || error.name === 'AbortError' || isCharacterTimeout(error) || attempt === maxRetries) throw error; }
      }
    },
    async inferCandidates(context, { signal } = {}) { const result = await request('只提取敌方候选人物，返回 {"candidates":[{"id":"...","name":"...","explicitFacts":{},"inferred":{}}]}。明确事实放 explicitFacts；不确定的内容放 inferred；不要构造完整人物。', boundedContext(context), timeoutMs, signal); return Array.isArray(result) ? result : result?.candidates || []; },
    async completeCandidate({ candidate, knownFields, context, signal, side = 'enemy' } = {}) {
      if (side === 'player') return knownPlayerProfile(knownFields || candidate || {}, { id: candidate?.id, name: candidate?.name, registry: context?.registry || [] });
      if (isProtagonistRecord(candidate)) throw Object.assign(new Error('已丢弃许妍资料，不作为敌人生成。'), { code: 'PROTAGONIST_DISCARDED' });
      let result, issues, partialProfile;
      // Enemy generation needs the scene and enemy evidence, not the complete
      // protagonist six-arts rule library (large and not owned by this NPC).
      const completionContext = { scope: context?.scope, recentMessages: (context?.recentMessages || []).slice(-messageCount), scene: context?.scene };
      const style = normalizeCharacterCompletionPrompt(characterCompletionPrompt).replace(COMBAT_PROFILE_CONTRACT, '').trim();
      const instruction = `${style}\n\n以下输出契约优先于上方可编辑风格提示：\n${COMBAT_PROFILE_CONTRACT}\n\n${ENEMY_GENERATION_POLICY}`;
      for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
        try {
          result = await enemyRequest(instruction, { task: 'complete_combat_profile', side: 'enemy', candidate, knownFields, context: completionContext, ...(attempt ? { repair: { issues, previous: result } } : {}) }, timeoutMs, signal);
          if (isProtagonistRecord(result) || result?.player && !result?.candidate) {
            result = undefined;
            throw Object.assign(new Error('模型返回了许妍的资料，已丢弃；请重新生成敌人档案。'), { code: 'PROTAGONIST_DISCARDED' });
          }
          partialProfile = normalizeCombatProfile(result, { id: candidate?.id, side });
          const options = { id: candidate?.id, side, registry: context?.registry || [] };
          const profile = normalizeCombatProfile(result, options);
          partialProfile = profile;
          issues = combatProfileIssues(profile);
          if (!issues.length) return profile;
        } catch (error) {
          if (signal?.aborted || error.name === 'AbortError' || isCharacterTimeout(error) || error.code === 'PROTAGONIST_DISCARDED') throw error;
          issues = [error.message];
        }
      }
      throw Object.assign(new Error(`敌人自动生成未完成，请重试生成：${issues.join('；')}`), { partialProfile });
    },
    async fillMissingFields({ candidate, knownFields, context, signal }) { const result = await request('仅补全明确缺失字段，返回 {"fields":{...},"inferred":true}，不得覆盖已有字段。', { candidate, knownFields, context: boundedContext(context) }, fillTimeoutMs, signal); return result?.fields || result || {}; }
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
