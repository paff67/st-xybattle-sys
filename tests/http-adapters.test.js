import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { HttpJsonAdjudicator, HttpJsonNarrator } from '../src/adapters.js';
import { createHttpCharacterInference } from '../src/character-source-adapters.js';

test('OpenAI-compatible adapters send structured context and preserve original prompt', async () => {
  const requests = [];
  const server = createServer((req, res) => { let body = ''; req.on('data', (chunk) => { body += chunk; }); req.on('end', () => { requests.push(JSON.parse(body)); res.setHeader('content-type', 'application/json'); const isJudge = requests.length === 1; res.end(JSON.stringify(isJudge ? { choices: [{ message: { content: JSON.stringify({ summary: 'ok', before: { statuses: [], effects: [] }, after: { statuses: [], effects: [] }, reason: 'test', ruleRefs: ['mock.test'] }) } }] } : { choices: [{ message: { content: '正文完成' } }] })); }); });
  await new Promise((resolve) => server.listen(0, resolve));
  const endpoint = `http://127.0.0.1:${server.address().port}`;
  try {
    const adjudicator = new HttpJsonAdjudicator({ endpoint, model: 'judge' });
    await adjudicator.judge({ prompt: '完整上下文 JSON：{"actors":{"enemies":[]},"priorCommittedFacts":[]}', settings: { temperature: 0.2, maxOutput: 100 } });
    const narrator = new HttpJsonNarrator({ endpoint, model: 'writer' });
    await narrator.generate({ type: 'BATTLE_SCENE_PACKET', preserveUserPrompt: true }, { originalPrompt: '用户原 prompt' });
    assert.equal(requests[0].messages[1].role, 'user');
    assert.match(requests[0].messages[1].content, /actors/);
    assert.match(requests[1].messages[1].content, /用户原 prompt/);
  } finally { server.close(); }
});

test('OpenAI-compatible v1 roots resolve to chat completions for adjudication and character inference', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url: String(url), body: JSON.parse(options.body) });
    return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify({ candidates: [{ id: 'enemy-1', name: '厉沧海', explicitFacts: {} }] }) } }] }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const inference = createHttpCharacterInference({ endpoint: 'https://api.example.test/v1/', model: 'judge', fetchImpl });
  await inference.inferCandidates({ scope: { chatId: 'chat', branchId: 'branch' } });
  assert.equal(calls[0].url, 'https://api.example.test/v1/chat/completions');
  assert.equal(calls[0].body.model, 'judge');
});

test('character inference defaults to the configured long request timeout', async () => {
  let timeoutSignal;
  const fetchImpl = async (_url, options) => {
    timeoutSignal = options.signal;
    return new Response(JSON.stringify({ candidates: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const inference = createHttpCharacterInference({ endpoint: 'https://api.example.test/v1', model: 'judge', fetchImpl });
  await inference.inferCandidates({});
  assert.equal(timeoutSignal.aborted, false);
});

test('character field fill uses a shorter optional timeout than candidate extraction', async () => {
  const fetchImpl = async (_url, options) => {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, 20);
      options.signal.addEventListener('abort', () => { clearTimeout(timer); reject(new DOMException('The operation was aborted', 'AbortError')); }, { once: true });
    });
    return new Response(JSON.stringify({ fields: { realm: '未知' }, inferred: true }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const inference = createHttpCharacterInference({ endpoint: 'https://api.example.test/v1', model: 'judge', fetchImpl, fillTimeoutMs: 5 });
  await assert.rejects(inference.fillMissingFields({ candidate: { id: 'enemy-1' }, knownFields: { id: 'enemy-1' }, context: {} }), /超时|aborted|AbortError|The operation was aborted/i);
});


test('enemy completion constructs a full contextual opponent without user data or protagonist rule library', async () => {
  const { fullCombatProfile } = await import('./fixtures/combat-profile.js');
  let calls = 0;
  const ai = createHttpCharacterInference({ endpoint: 'https://example.invalid/v1', model: 'real-config-fixture', fetchImpl: async (_url, options) => {
    calls++;
    const body = JSON.parse(options.body), input = JSON.parse(body.messages[1].content.slice('上下文：'.length));
    assert.equal(input.side, 'enemy'); assert.equal(input.context.registry, undefined);
    assert.equal(input.context.persona, undefined);
    assert.ok(body.max_tokens <= 4000);
    assert.match(body.messages[0].content, /首份档案优先设计3个招式/);
    assert.match(body.messages[0].content, /由你主动设计/);
    assert.match(body.messages[0].content, /不能因为缺乏功法原文/);
    assert.equal(body.messages[0].content.match(/candidate 严格使用以下字段/g).length, 1);
    assert.match(input.context.recentMessages[0].text, /顾澜/);
    return new Response(JSON.stringify({ candidate: { ...fullCombatProfile('顾澜'), cultivationRealm: '金丹初期' } }), { status: 200 });
  } });
  const profile = await ai.completeCandidate({ candidate: { id: 'gulan', name: '顾澜' }, knownFields: { cultivationRealm: '金丹初期' }, side: 'enemy', context: { recentMessages: [{ text: '顾澜在太平洋操纵重水攻击' }], registry: [{ huge: 'protagonist-only' }], persona: 'player-only' } });
  assert.equal(profile.name, '顾澜'); assert.ok(profile.techniques.length); assert.ok(profile.resourceDefinitions.length); assert.equal(calls, 1);
});

test('timed-out enemy generation automatically retries once without treating transport timeout as user cancellation', async () => {
  const { fullCombatProfile } = await import('./fixtures/combat-profile.js'); let calls = 0;
  const ai = createHttpCharacterInference({ endpoint: 'https://example.invalid/v1', model: 'fixture', timeoutMs: 15, fetchImpl: async (_url, options) => {
    if (++calls === 1) return new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError'))));
    return new Response(JSON.stringify({ candidate: fullCombatProfile('顾澜') }), { status: 200 });
  } });
  assert.equal((await ai.completeCandidate({ candidate: { name: '顾澜' }, context: {}, side: 'enemy' })).name, '顾澜');
  assert.equal(calls, 2);
});
