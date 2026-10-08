import test from 'node:test';
import assert from 'node:assert/strict';
import { createCharacterJsonRequest, createHttpCharacterInference } from '../src/character-source-adapters.js';
import { BattleController } from '../src/battle-controller.js';
import { normalizeSettings } from '../src/adapters.js';
import { authoritativeEntries } from '../src/authoritative-rules.js';
import { knownPlayerProfile } from '../src/player-profile.js';
import { combatProfileIssues } from '../src/combat-profile.js';
import { fullCombatProfile } from './fixtures/combat-profile.js';
import { prepareEnemyCandidates } from '../src/character-preparation.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const never = () => new Promise(() => {});

for (const bodyStalls of [false, true]) test(`timeout rejects even when ${bodyStalls ? 'response body' : 'fetch wrapper'} ignores abort`, async () => {
  let requestSignal;
  const request = createCharacterJsonRequest({ endpoint: 'https://example.invalid/v1', timeoutMs: 25, fetchImpl: (_url, options) => {
    requestSignal = options.signal;
    return bodyStalls ? Promise.resolve({ ok: true, json: never }) : never();
  } });
  const start = Date.now();
  await assert.rejects(request('test', {}), (error) => error.code === 'CHARACTER_TIMEOUT' && /超时/.test(error.message));
  assert.ok(Date.now() - start < 500);
  assert.equal(requestSignal.aborted, true);
});

test('timeout is terminal even with retries configured; caller cancellation rejects immediately', async () => {
  let calls = 0;
  const ai = createHttpCharacterInference({ endpoint: 'https://example.invalid/v1', timeoutMs: 25, maxRetries: 3, fetchImpl: () => { calls++; return never(); } });
  await assert.rejects(ai.completeCandidate({ candidate: { id: 'e' } }), { code: 'CHARACTER_TIMEOUT' });
  assert.equal(calls, 1);
  const abort = new AbortController();
  const pending = ai.inferParticipants({}, { signal: abort.signal });
  abort.abort();
  await assert.rejects(pending, { name: 'AbortError' });
});

test('retries default to zero and explicit retry count is bounded', async () => {
  assert.equal(normalizeSettings().characterMaxRetries, 0);
  assert.throws(() => normalizeSettings({ characterMaxRetries: 4 }), /0~3/);
  let calls = 0;
  const ai = createHttpCharacterInference({ endpoint: 'https://example.invalid', fetchImpl: async () => { calls++; return new Response(JSON.stringify({ name: '顾澜' })); } });
  await assert.rejects(ai.completeCandidate({ candidate: { id: 'e' } }), /自动生成未完成/);
  assert.equal(calls, 1);
});

test('successful stages renew the timeout; a stalled stage still times out', async () => {
  const controller = new BattleController();
  controller.settings.adjudicator.timeoutMs = 100;
  let calls = 0;
  const started = Date.now();
  await controller.prepareCharacters({ inference: {
    inferCandidates: async () => { await delay(45); return [{ id: 'e', name: '顾澜' }, { id: 'e2', name: '另一敌手' }]; },
    completeCandidate: async () => { calls++; await delay(75); return fullCombatProfile('顾澜'); }
  } });
  assert.ok(Date.now() - started >= 190);
  assert.equal(controller.preparationAbort, null);
  assert.equal(calls, 2);
  assert.equal(controller.characterPreparation.candidates.length, 2);
  await assert.rejects(controller.prepareCharacters({ inference: {
    inferCandidates: async () => [{ id: 'e', name: '顾澜' }],
    completeCandidate: never
  } }), /战前人物准备超时/);
  assert.equal(controller.state.history.length, 0);
});

const playerMvu = { name: '许妍', 身份: '许家修士', 境界: '金丹初期', 状态: '持弓对峙', 生命: 92, 灵力: 76, 精血: 95, 神识: 83,
  功法: { 太一沧澜经: { 境界: '小成' }, 叠浪玄潮诀: { 掌握状态: '已习得' }, 无相水镜法: { 境界: '未入门' } } };

test('MVU protagonist never calls model or auto-activates methods, even when incomplete', async () => {
  let calls = 0;
  const registry = authoritativeEntries();
  const ai = createHttpCharacterInference({ endpoint: 'https://example.invalid', fetchImpl: () => { calls++; throw new Error('Should not request'); } });
  const profile = await ai.completeCandidate({ side: 'player', candidate: { id: 'player', name: '许妍' }, knownFields: playerMvu, context: { registry } });
  assert.equal(calls, 0);
  assert.deepEqual(profile.martialArts, []);
  assert.deepEqual(profile.learnedTechniqueRefs, []);
  assert.equal(profile.techniques.length, 0);
  assert.deepEqual(profile.resources, {});
  assert.match(profile.state.resources.find(r => r.name === '灵力').condition, /76/);
  assert.deepEqual(profile.resourceDefinitions, []);
  const incomplete = await ai.completeCandidate({ side: 'player', candidate: { id: 'player' }, knownFields: {} });
  assert.equal(calls, 0);
  assert.ok(combatProfileIssues(incomplete).length);
});

test('unknown or unlearned methods never grant all installed arts', () => {
  const profile = knownPlayerProfile({ ...playerMvu, 功法: { 不存在的功法: { 境界: '小成' }, 太一沧澜经: { 掌握状态: '未习得' } } }, { id: 'player', registry: authoritativeEntries() });
  assert.equal(profile.learnedTechniqueRefs.length, 0);
  assert.equal(profile.techniques.length, 0);
  assert.deepEqual(combatProfileIssues(profile), []);
});

test('preparation ignores AI player facts and only completes enemies', async () => {
  const sides = [];
  const result = await prepareEnemyCandidates({ registry: authoritativeEntries() }, {
    includePlayer: true, requireProfiles: true,
    mvu: ({ candidate }) => candidate.role === 'player' ? playerMvu : null,
    inference: {
      inferParticipants: async () => ({ player: { name: '许妍', explicitFacts: { cultivationRealm: '渡劫', martialArts: [{ name: '伪造功法' }] } }, candidates: [{ id: 'e', name: '顾澜' }] }),
      completeCandidate: async ({ side }) => { sides.push(side); return fullCombatProfile('顾澜'); }
    }
  });
  assert.deepEqual(sides, ['enemy']);
  assert.equal(result.candidates[0].fields.cultivationRealm, '金丹初期');
  assert.deepEqual(result.candidates[0].fields.techniques, []);
  assert.equal(result.candidates[0].sourceStatus.ai_complete.status, 'not_requested');
});
