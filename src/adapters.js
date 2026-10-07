import { LEGACY_ADJUDICATOR_SYSTEM_PROMPT } from './legacy-adjudicator-prompt.js';
import { clone, abortIfNeeded, normalizeChatCompletionsEndpoint } from './common.js';
import { HEAVENLY_ADJUDICATOR_SYSTEM_PROMPT, formatScenePacketForStoryAI } from './battle-adjudicator-prompt.js';
import { normalizeCharacterCompletionPrompt, normalizePrompt } from './character-prompts.js';
export function normalizeSettings(input = {}) {
  const characterMaxOutput = Number(input.characterMaxOutput ?? 8000);
  if (!Number.isInteger(characterMaxOutput) || characterMaxOutput < 1024) throw new Error('人物档案输出上限必须是至少 1024 的整数');
  const defaultConfig = { mode: 'unconfigured', endpoint: '', model: '', maxOutput: 1600, temperature: 0.2, repairAttempts: 2, timeoutMs: 60000 };
  const adjudicator = { ...defaultConfig, ...(input.adjudicator || {}) };
  if (!input.adjudicator) for (const key of Object.keys(defaultConfig).concat('apiKey')) if (input[key] !== undefined) adjudicator[key] = input[key];
  const narrator = { ...defaultConfig, mode: 'main_story', temperature: 0.7, ...input.narrator };
  if (!input.narrator && input.mode === 'mock') narrator.mode = 'mock';
  if (!input.narrator && input.mode === 'http') Object.assign(narrator, { ...adjudicator, repairAttempts: 0 });
  for (const config of [adjudicator, narrator]) {
    if (!['unconfigured','http','mock','main_story','packet'].includes(config.mode)) throw new Error('未知模型模式');
    config.temperature = Number(config.temperature); config.maxOutput = Number(config.maxOutput); config.repairAttempts = Number(config.repairAttempts); config.timeoutMs = Number(config.timeoutMs);
    if (!Number.isFinite(config.temperature) || config.temperature < 0 || config.temperature > 2 || !Number.isInteger(config.maxOutput) || config.maxOutput < 1 || !Number.isInteger(config.repairAttempts) || config.repairAttempts < 0 || config.repairAttempts > 3 || !Number.isFinite(config.timeoutMs) || config.timeoutMs < 100) throw new Error('模型参数无效（温度0~2；修复0~3）');
  }
  return { adjudicator, narrator, autoNarrative: input.autoNarrative !== false, originalPrompt: input.originalPrompt || '', characterMaxOutput, characterCompletionPrompt: normalizeCharacterCompletionPrompt(input.characterCompletionPrompt), adjudicationPrompt: input.adjudicationPrompt?.trim() === LEGACY_ADJUDICATOR_SYSTEM_PROMPT.trim() ? HEAVENLY_ADJUDICATOR_SYSTEM_PROMPT : normalizePrompt(input.adjudicationPrompt, HEAVENLY_ADJUDICATOR_SYSTEM_PROMPT), developerLogs: input.developerLogs !== false };
}
export function extractJson(content) {
  if (content && typeof content === 'object') return clone(content);
  const text = String(content || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim();
  try { return JSON.parse(text); } catch { const start = text.indexOf('{'); const end = text.lastIndexOf('}'); if (start >= 0 && end > start) return JSON.parse(text.slice(start, end + 1)); throw new Error('AI 响应不是合法 JSON'); }
}
export class UnconfiguredAdjudicator { async judge() { throw new Error('未配置裁定 AI；请在独立设置中选择 HTTP，或明确选择离线 Mock 演示'); } }
export class UnconfiguredNarrator { async generate() { throw new Error('未配置正文 AI；默认可选择主剧情一次性注入'); } async rewrite() { return this.generate(); } }
export class MainStoryNarrator { constructor() { this.mode = 'main_story'; } async generate() { return { pending: true, text: '', metadata: { mode: 'main_story', status: 'waiting_for_normal_generation' } }; } async rewrite() { return this.generate(); } }
export class PacketNarrator extends MainStoryNarrator { constructor() { super(); this.mode = 'packet'; } }
export class MockAdjudicator {
  constructor() { this.calls = []; this.isMock = true; }
  async judge(request, { signal } = {}) {
    abortIfNeeded(signal); this.calls.push(clone(request)); const before = clone(request.context.semanticState); const after = clone(before); const techniqueId = request.action.techniqueId;
    if ('潮眼' in after && techniqueId === 'chaoyan') after['潮眼'] = true;
    if ('回弦' in after && techniqueId === 'huixian') after['回弦'] = true;
    if ('站位' in after && techniqueId === 'xianshi') after['站位'] = '中近距';
    if ('压制' in after && techniqueId === 'dielang') after['压制'] = '我方取得节奏';
    if ('破绽' in after && techniqueId === 'fanyin-chaoyan') after['破绽'] = ['敌方节奏出现可见偏差'];
    after.statuses = [...new Set([...(after.statuses || []), ...(techniqueId ? [`${techniqueId}:triggered`] : [])])];
    after.effects = [...(after.effects || []).filter((effect) => effect.id !== `mock-${techniqueId}`), ...(techniqueId ? [{ id: `mock-${techniqueId}`, label: `${techniqueId}余势`, techniqueId, remainingRounds: 2, visibility: 'public', ruleRefs: ['mock.semantic.1'] }] : [])];
    const enemyImpact = techniqueId === 'xianshi'
      ? '【对敌影响】弦音水网无形延展缠缚敌手重靴下盘，敌方冲锋攻势受阻，重心脱节'
      : techniqueId === 'dielang'
      ? '【对敌影响】三重重浪连续砸击敌方护体煞气罡罩，产生钝力冲击，逼退敌方并造成硬直破绽'
      : `【对敌影响】${request.action.label}迫使敌方防御身法出现停滞`;
    const envImpact = techniqueId === 'xianshi'
      ? '【环境剧变】试剑台周遭弥漫水汽被清越琴音撕裂重聚，在青石板缝隙间织成微光水网'
      : techniqueId === 'dielang'
      ? '【环境剧变】湖面激荡掀起半人高碧青水浪屏风，青玄石台受水压与煞气碰撞震裂数处'
      : `【环境剧变】气劲与灵波激荡四周天地环境`;
    const rhythmImpact = `${request.action.label}造成可观察的节奏变化`;
    const result = {
      summary: `离线裁定：${request.action.label}。${enemyImpact}；${envImpact}。`,
      before,
      after,
      reason: '独立裁定预设推演：功法起手与机理契合水域环境，达成对敌实质牵制与天地水势共鸣。',
      ruleRefs: ['mock.semantic.1'],
      publicEvents: [rhythmImpact, enemyImpact, envImpact],
      exchange: {
        playerResult: rhythmImpact,
        opponents: request.context.actors.enemies.map((enemy) => ({ actorId: enemy.id, response: '离线演示：采取防御应对', techniques: [], result: enemyImpact })),
        environmentResult: envImpact, boundaries: []
      },
      confidence: 0.95
    };
    return result;
  }
}
export class MockNarrator {
  constructor() { this.calls = []; this.mode = 'mock'; }
  async generate(packet) { this.calls.push(packet); return { text: `【离线正文演示】${packet.playerAction?.action || "自由行动"}。${packet.exchange?.playerResult || (packet.committedFacts || []).join("；")}` }; }
  async rewrite(packet) { this.calls.push({ rewrite: true, packet }); return { text: `【离线重写】保留已提交事实：${packet.exchange?.playerResult || (packet.committedFacts || []).join('；')}。` }; }
}
async function chatCompletion(config, messages, options = {}) {
  if (!config.endpoint || !config.model) throw new Error('HTTP 适配器缺少 endpoint 或 model');
  abortIfNeeded(options.signal); const controller = new AbortController(); const abort = () => controller.abort(); options.signal?.addEventListener('abort', abort, { once: true }); const timer = setTimeout(abort, config.timeoutMs ?? 60000);
  const headers = { 'content-type': 'application/json' }; if (config.apiKey) headers.authorization = `Bearer ${config.apiKey}`;
  const body = { model: config.model, messages, temperature: config.temperature ?? 0.2, max_tokens: config.maxOutput ?? 1600, stream: false };
  if (options.jsonMode && config.jsonMode === true) body.response_format = { type: 'json_object' };
  options.logger?.({ kind: 'model_request', requestMetadata: { model: config.model, temperature: body.temperature, maxOutput: body.max_tokens }, body: clone(body) });
  try {
    const response = await fetch(normalizeChatCompletionsEndpoint(config.endpoint), { method: 'POST', headers, signal: controller.signal, body: JSON.stringify(body) });
    const raw = await response.text(); options.logger?.({ kind: 'model_response', metadata: { status: response.status, requestId: response.headers.get('x-request-id'), model: config.model }, rawResponse: raw });
    if (!response.ok) throw new Error(`模型 API ${response.status}（详情见开发者日志）`);
    const payload = JSON.parse(raw); const content = payload.result ?? payload.choices?.[0]?.message?.content ?? payload.output_text ?? payload.text ?? payload;
    return { content, metadata: { model: payload.model || config.model, usage: payload.usage || null } };
  } finally { clearTimeout(timer); options.signal?.removeEventListener('abort', abort); }
}
export class HttpJsonAdjudicator {
  constructor(config = {}) { this.config = { timeoutMs: 60000, repairAttempts: 2, ...config }; this.isMock = false; }
  async judge(request, options = {}) {
    const config = { ...this.config, temperature: this.config.temperature ?? request.settings.temperature, maxOutput: this.config.maxOutput ?? request.settings.maxOutput };
    const systemPrompt = request.systemPrompt || HEAVENLY_ADJUDICATOR_SYSTEM_PROMPT;
    const messages = [{ role: 'system', content: systemPrompt }, { role: 'user', content: request.prompt }];
    const response = await chatCompletion(config, messages, { ...options, jsonMode: true });
    try { return extractJson(response.content); } catch (error) { error.rawContent = response.content; throw error; }
  }
  async repair(request, raw, error, options = {}) {
    const messages = [{ role: 'system', content: '这是结构修复；保持原行动裁定事实与对敌对环境影响，禁止重新裁定。只修复 JSON 和被程序指出的字段。' }, { role: 'user', content: `${request.prompt}\n原返回：${JSON.stringify(raw)}\n程序拒绝原因：${error.message}` }];
    const response = await chatCompletion(this.config, messages, { ...options, jsonMode: true }); return extractJson(response.content);
  }
}
export class HttpJsonNarrator {
  constructor(config = {}) { this.config = { timeoutMs: 60000, ...config }; this.mode = 'http'; }
  async generate(packet, options = {}) { return this.generateFromBattlePacket(options.originalPrompt ?? this.config.originalPrompt ?? '', packet, options); }
  async generateFromBattlePacket(originalPrompt, packet, options = {}) {
    const formatted = formatScenePacketForStoryAI(packet);
    const messages = [{ role: 'system', content: formatted }, { role: 'user', content: originalPrompt || '继续描写这一已提交战斗场景。' }];
    const response = await chatCompletion(this.config, messages, options); return { text: typeof response.content === 'string' ? response.content : JSON.stringify(response.content), metadata: response.metadata };
  }
  async rewrite(packet, prior, options = {}) { return this.generateFromBattlePacket(`${options.originalPrompt ?? this.config.originalPrompt ?? ''}\n重写本轮正文。`, packet, options); }
}
