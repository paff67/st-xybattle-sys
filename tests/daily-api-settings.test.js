import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSettings, dailyRuntimeSettings } from '../src/adapters.js';
import { BattleController } from '../src/battle-controller.js';
import { CREDENTIAL_STORAGE_KEY } from '../src/credential-store.js';
import { DAILY_ADJUDICATION_PROMPT, DAILY_MODULE_PROMPTS, DAILY_DOMAINS, dailyAdjudicationPrompt } from '../src/event-daily-prompts.js';
import { createWorkbenchEventRouter } from '../src/event-workbench.js';
import { battlefieldProjection } from '../src/event-battlefield-state.js';

class MemoryStorage {
  items = new Map();
  getItem(key) { return this.items.get(key) ?? null; }
  setItem(key, value) { this.items.set(key, String(value)); }
  removeItem(key) { this.items.delete(key); }
}
const daily = { inherit: false, mode: 'http', endpoint: 'https://daily.invalid/v1', model: 'daily-model', apiKey: 'daily-secret', temperature: 0.9, maxOutput: 6789, timeoutMs: 4321 };

test('old settings get default prompts and inherited API; independent API works without combat configuration', () => {
  const legacy = normalizeSettings({ adjudicator: { mode: 'http', endpoint: 'https://judge.invalid', model: 'judge', temperature: 0.7 } });
  assert.equal(dailyRuntimeSettings(legacy).temperature, 0.7);
  assert.equal(dailyRuntimeSettings(legacy).model, 'judge');
  for (const domain of DAILY_DOMAINS) assert.equal(dailyAdjudicationPrompt(domain, legacy.dailyPrompts), dailyAdjudicationPrompt(domain));
  const own = normalizeSettings({ dailyAdjudicator: daily, dailyTotalTimeoutMs: 12345 });
  assert.equal(dailyRuntimeSettings(own).model, 'daily-model');
  assert.equal(dailyRuntimeSettings(own).totalTimeoutMs, 12345);
  own.dailyAdjudicator.inherit = true;
  assert.throws(() => dailyRuntimeSettings(own), /真实接口/);
  for (const bad of [{ temperature: 3 }, { maxOutput: 0 }, { timeoutMs: -1 }]) assert.throws(() => normalizeSettings({ dailyAdjudicator: { ...daily, ...bad } }));
  assert.throws(() => normalizeSettings({ dailyTotalTimeoutMs: NaN }), /总超时/);
});

test('daily API and all prompts persist across reload; credentials stay separate and can be cleared', () => {
  const storage = new MemoryStorage(), credentials = new MemoryStorage();
  const first = new BattleController({ storage, credentialStorage: credentials });
  const modules = Object.fromEntries(DAILY_DOMAINS.map(domain => [domain, `${domain} 专项自定义`]));
  first.setSettings({ dailyAdjudicator: daily, dailyTotalTimeoutMs: 54321, dailyPrompts: { common: '自定义通用', modules } });
  first.setSettings({ dailyAdjudicator: { inherit: true } });
  const second = new BattleController({ storage, credentialStorage: credentials });
  assert.equal(second.settings.dailyAdjudicator.inherit, true);
  second.setSettings({ dailyAdjudicator: { inherit: false } });
  assert.equal(dailyRuntimeSettings(second.settings).apiKey, 'daily-secret');
  assert.equal(dailyRuntimeSettings(second.settings).maxOutput, 6789);
  assert.equal(second.settings.dailyTotalTimeoutMs, 54321);
  assert.deepEqual(second.settings.dailyPrompts, { common: '自定义通用', modules });
  second.log({ kind: 'test', text: 'provider echo daily-secret' });
  assert.doesNotMatch(second.exportData(), /daily-secret/);
  assert.doesNotMatch(second.debugLogExport(), /daily-secret/);
  assert.doesNotMatch(JSON.stringify([...storage.items]), /daily-secret/);
  second.setSettings({ dailyPrompts: { common: '', modules: { recovery: '  ' } } });
  assert.equal(second.settings.dailyPrompts.common, DAILY_ADJUDICATION_PROMPT);
  assert.equal(second.settings.dailyPrompts.modules.recovery, DAILY_MODULE_PROMPTS.recovery);
  assert.equal(second.settings.dailyPrompts.modules.alchemy, modules.alchemy);
  second.setSettings({ dailyAdjudicator: { apiKey: '' } });
  assert.equal(credentials.getItem(CREDENTIAL_STORAGE_KEY), null);
});

test('routing, extraction and daily HTTP request use saved API while only adjudication uses custom prompts', async () => {
  const calls = [];
  const snapshot = { input: { id: 'input', text: '治疗伤势' }, history: [], scope: { chatId: 'test' }, battlefield: battlefieldProjection(null, null),
    sources: [{ id: 'mvu', kind: 'mvu', branchKnown: true, data: { 主角: '许妍', 伤势: '擦伤', 功法: '已掌握的疗伤功法' } }] };
  const action = { localKey: 'heal', domain: 'recovery', intent: '治疗伤势', source: { id: 'input', quote: '治疗伤势' }, execution: 'now', dependsOn: [], worldSignal: { kind: 'none', purpose: 'none', confrontation: 'none', evidence: [] } };
  const replies = [
    { decision: 'adjudicate', missingInformation: [], actions: [action] },
    { fields: Object.fromEntries(['subject', 'injury', 'method'].map(key => [key, [{ sourceId: 'mvu', pointer: '' }]])), missing: [], conflicts: [] },
    { outcome: 'success', summary: '伤口已稳定', publicFacts: ['伤口不再出血'], costs: [], effects: ['伤势稳定'], duration: '当前阶段', missing: [], changes: [], basis: [{ field: 'method', index: 0, reason: '已知疗法适用' }] }
  ];
  const settings = normalizeSettings({ dailyAdjudicator: daily, dailyPrompts: { common: 'CUSTOM_COMMON', modules: { recovery: 'CUSTOM_HEAL', alchemy: 'UNRELATED_ALCHEMY' } } });
  const router = createWorkbenchEventRouter({ ...dailyRuntimeSettings(settings), captureContext: async () => snapshot, fetchImpl: async (url, init) => {
    calls.push({ url, headers: init.headers, body: JSON.parse(init.body) });
    return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(replies.shift()) } }] }));
  } });
  const result = await router({ event: { eventId: 'test' } });
  assert.equal(result.execution.status, 'validated');
  assert.equal(calls.length, 3);
  for (const call of calls) {
    assert.equal(call.url, 'https://daily.invalid/v1/chat/completions');
    assert.equal(call.headers.authorization, 'Bearer daily-secret');
    assert.equal(call.body.model, 'daily-model');
    assert.equal(call.body.temperature, 0.9);
    assert.equal(call.body.max_tokens, 6789);
  }
  assert.doesNotMatch(calls[0].body.messages[0].content, /CUSTOM_COMMON/);
  assert.doesNotMatch(calls[1].body.messages[0].content, /CUSTOM_COMMON/);
  assert.equal(calls[2].body.messages[0].content, 'CUSTOM_COMMON\n【疗伤专项约束】\nCUSTOM_HEAL');
  assert.doesNotMatch(JSON.stringify(result), /daily-secret/);
});
