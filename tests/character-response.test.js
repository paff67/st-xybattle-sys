import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCharacterJson, normalizeParticipantResponse } from '../src/character-response.js';
import { createHttpCharacterInference } from '../src/character-source-adapters.js';
import { prepareEnemyCandidates, confirmEnemyCandidates } from '../src/character-preparation.js';
import { fullCombatProfile } from './fixtures/combat-profile.js';
import { normalizeCharacterCompletionPrompt, DEFAULT_CHARACTER_COMPLETION_PROMPT } from '../src/character-prompts.js';

test('repairs missing brackets and discards player payload while recovering nested enemy candidates', () => {
  const broken = '{"player":{"name":"许妍","explicitFacts":{"境界":"错误境界"},"candidates":[{"name":"顾澜"},{"name":"许妍"}],"scene":{"location":"太平洋"}}';
  const result = normalizeParticipantResponse(parseCharacterJson(broken));
  assert.deepEqual(result.player, { name: '许妍' });
  assert.deepEqual(result.candidates, [{ name: '顾澜' }]);
  assert.equal(result.scene.location, '太平洋');
  assert.deepEqual(parseCharacterJson('{"items":["水元" "雷元"]}'), { items: ['水元', '雷元'] });
  assert.throws(() => normalizeParticipantResponse(parseCharacterJson('{"player":{"name":"许妍"}}')), { code: 'CHARACTER_SCHEMA_INVALID' });
});

test('extraction repairs locally without extra requests and omits protagonist library', async () => {
  let calls = 0;
  const ai = createHttpCharacterInference({ endpoint: 'https://example.invalid', fetchImpl: async (_url, options) => {
    calls++;
    const body = JSON.parse(options.body);
    assert.doesNotMatch(body.messages[1].content, /private-library|player-detail/);
    assert.match(body.messages[0].content, /用户主角为许妍/);
    return Response.json({ choices: [{ message: { content: '{"candidates":[{"name":"顾澜"},{"name":"许妍"}],"scene":{},}' } }] });
  } });
  const result = await ai.inferParticipants({ registry: ['private-library'], playerCandidate: { data: 'player-detail' } });
  assert.equal(calls, 1);
  assert.deepEqual(result.candidates.map(c => c.name), ['顾澜']);
});

test('enemy response naming protagonist is discarded without partial profile or retry', async () => {
  let calls = 0;
  const ai = createHttpCharacterInference({ endpoint: 'https://example.invalid', maxRetries: 3, fetchImpl: async () => { calls++; return Response.json({ candidate: fullCombatProfile('许妍') }); } });
  await assert.rejects(ai.completeCandidate({ candidate: { name: '顾澜' } }), error => error.code === 'PROTAGONIST_DISCARDED' && !error.partialProfile);
  assert.equal(calls, 1);
});

test('preparation and confirmation filter protagonist from enemy results', async () => {
  const draft = await prepareEnemyCandidates({ enemies: [{ name: '许妍' }, { id: 'g', name: '顾澜' }] }, {
    inference: { completeCandidate: async () => fullCombatProfile('许妍') }, requireProfiles: true
  });
  assert.equal(draft.candidates.length, 1);
  assert.equal(draft.candidates[0].name, '顾澜');
  assert.equal(draft.candidates[0].fields.techniques.length, 0);
  assert.throws(() => confirmEnemyCandidates(draft, { g: fullCombatProfile('许妍') }), /不能作为敌人/);
});

test('previous default migrates to the named protagonist enemy-only prompt', () => {
  assert.equal(normalizeCharacterCompletionPrompt('你是独立战斗系统的敌人档案构造器。禁止生成主角资料。'), DEFAULT_CHARACTER_COMPLETION_PROMPT);
});
