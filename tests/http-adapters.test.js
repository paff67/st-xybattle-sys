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
