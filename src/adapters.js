function extractJson(content) {
  if (content && typeof content === 'object') return content;
  const text = String(content || '').trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  try { return JSON.parse(text); } catch { const start = text.indexOf('{'); const end = text.lastIndexOf('}'); if (start >= 0 && end > start) return JSON.parse(text.slice(start, end + 1)); throw new Error('AI 响应不是合法 JSON'); }
}
function authHeaders(apiKey) { const headers = { 'content-type': 'application/json' }; if (apiKey) headers.authorization = `Bearer ${apiKey}`; return headers; }
function abortError() { const error = new Error('请求已停止'); error.name = 'AbortError'; return error; }

export class UnconfiguredAdjudicator { async judge() { throw new Error('未配置裁定 AI；请在独立设置中选择 HTTP，或明确选择离线 Mock 演示'); } }
export class UnconfiguredNarrator { async generate() { throw new Error('未配置正文桥接 AI；可关闭自动正文或选择离线 Mock 演示'); } async rewrite() { throw new Error('未配置正文桥接 AI'); } }

export class MockAdjudicator {
  constructor() { this.calls = []; }
  async judge(request) {
    this.calls.push(request); const before = request.context.semanticState; const after = { ...before };
    const technique = request.action.techniqueId;
    if ('潮眼' in before) after['潮眼'] = Boolean(before['潮眼']) || ['chaoyan','fanyin-chaoyan'].includes(technique);
    if ('回弦' in before) after['回弦'] = ['huixian','zhendang-huichao'].includes(technique);
    if ('站位' in before && technique === 'xianshi') after['站位'] = '中近距';
    if ('压制' in before && technique === 'dielang') after['压制'] = '我方取得节奏';
    if ('破绽' in before && technique === 'fanyin-chaoyan') after['破绽'] = [...new Set([...(before['破绽'] || []), '敌方节奏出现可见偏差'])];
    if ('effects' in before) after.effects = [...(before.effects || []), ...(technique ? [`${technique}已触发`] : [])];
    if ('statuses' in before) after.statuses = [...(before.statuses || []), ...(technique ? [`${technique}:triggered`] : [])];
    return { summary: `离线裁定：${request.action.label}`, before, after, reason: 'Mock 仅验证结构、语义状态和幂等流程。', ruleRefs: ['mock.semantic.1'], publicEvents: [`${request.action.label}造成可观察的节奏变化`], confidence: 0.5 };
  }
}
export class MockNarrator {
  constructor() { this.calls = []; }
  async generate(packet) { this.calls.push(packet); return { text: `【离线正文演示】${packet.originalAction.label}使${packet.location}的节奏发生变化。下一决策点：${packet.nextDecisionPoint}` }; }
  async rewrite(packet) { this.calls.push({ rewrite: true, packet }); return { text: `【离线重写】保留已提交事实：${packet.committedFacts.join('；')}。` }; }
}

export class HttpJsonAdjudicator {
  constructor(config = {}) { this.config = { endpoint: '', apiKey: '', model: '', timeoutMs: 45000, ...config }; }
  async judge(request, { signal } = {}) {
    if (!this.config.endpoint || !this.config.model) throw new Error('裁定 HTTP 适配器缺少 endpoint 或 model');
    const controller = new AbortController(); if (signal?.aborted) controller.abort(); const timer = setTimeout(() => controller.abort(), this.config.timeoutMs); const linked = signal ? () => controller.abort() : null; signal?.addEventListener('abort', linked, { once: true });
    try {
      const response = await fetch(this.config.endpoint, { method: 'POST', headers: authHeaders(this.config.apiKey), signal: controller.signal, body: JSON.stringify({ model: this.config.model, messages: [{ role: 'system', content: '你是严格 JSON 输出的独立战斗裁定器。' }, { role: 'user', content: request.prompt }], temperature: request.settings.temperature, max_tokens: request.settings.maxOutput }) });
      if (!response.ok) throw new Error(`裁定 API ${response.status}`); const payload = await response.json(); const content = payload.result ?? payload.choices?.[0]?.message?.content ?? payload.output_text ?? payload; return extractJson(content);
    } catch (error) { if (error.name === 'AbortError') throw abortError(); throw error; } finally { clearTimeout(timer); if (signal && linked) signal.removeEventListener('abort', linked); }
  }
}
export class HttpJsonNarrator {
  constructor(config = {}) { this.config = { endpoint: '', apiKey: '', model: '', timeoutMs: 45000, ...config }; }
  async generate(packet, options = {}) { return this.#call(packet, options.originalPrompt || this.config.originalPrompt || '', options); }
  async rewrite(packet, prior, options = {}) { return this.#call(packet, `上一版正文（仅用于重写，不重新裁定）：${JSON.stringify(prior || {})}`, options); }
  async #call(packet, originalPrompt, { signal } = {}) {
    if (!this.config.endpoint || !this.config.model) throw new Error('正文 HTTP 适配器缺少 endpoint 或 model');
    const controller = new AbortController(); if (signal?.aborted) controller.abort(); const timer = setTimeout(() => controller.abort(), this.config.timeoutMs); const linked = signal ? () => controller.abort() : null; signal?.addEventListener('abort', linked, { once: true });
    try {
      const response = await fetch(this.config.endpoint, { method: 'POST', headers: authHeaders(this.config.apiKey), signal: controller.signal, body: JSON.stringify({ model: this.config.model, messages: [{ role: 'system', content: '你是主剧情正文桥接器。保留用户原 prompt，只描写已提交 battle scene packet，禁止复判。' }, { role: 'user', content: `${originalPrompt}\nBATTLE_SCENE_PACKET:\n${JSON.stringify(packet)}` }], temperature: this.config.temperature ?? 0.7, max_tokens: this.config.maxOutput ?? 1600 }) });
      if (!response.ok) throw new Error(`正文 API ${response.status}`); const payload = await response.json(); return { text: payload.choices?.[0]?.message?.content ?? payload.output_text ?? payload.text ?? JSON.stringify(payload) };
    } catch (error) { if (error.name === 'AbortError') throw abortError(); throw error; } finally { clearTimeout(timer); if (signal && linked) signal.removeEventListener('abort', linked); }
  }
}
