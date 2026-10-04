import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { HttpJsonAdjudicator, HttpJsonNarrator } from '../src/adapters.js';

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
