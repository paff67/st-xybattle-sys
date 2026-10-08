import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { sourceDigest } from '../src/source-digest.js';
import { worldbookEntries, assertWorldbookAbility } from '../src/worldbook-abilities.js';
import { preparationRegistry, authoritativeEntries, knownRules, createRuleMemory } from '../src/authoritative-rules.js';
import { compileCombatProfile } from '../src/combat-profile.js';
import { createInitialState, startBattle, buildAdjudicationRequest, restoreBattle } from '../src/battle-state.js';
import { prepareEnemyCandidates, confirmEnemyCandidates, applyConfirmedEnemies } from '../src/character-preparation.js';
import { HttpJsonAdjudicator } from '../src/adapters.js';
import { fullCombatProfile } from './fixtures/combat-profile.js';

const entries = worldbookEntries();
const selected = [entries[0], entries[6]];
function playerSource() {
  return { ...fullCombatProfile('许妍'), id: 'player', techniques: [], martialArts: [], resourceDefinitions: [],
    learnedTechniqueRefs: selected.map(entry => ({ registryId: entry.id, techniqueIds: entry.techniques.map(move => move.id), evidence: '用户手动启用' })) };
}
function fixture(registry = entries) {
  const compiled = compileCombatProfile(playerSource(), 'player', registry);
  return startBattle(createInitialState({ player: compiled.actor, registrySnapshot: [...registry, compiled.entry] }));
}

test('pack contains exact digest-addressed originals and updated moves, excluding unrelated lore', () => {
  assert.equal(entries.length, 8);
  assert.equal(entries.filter(entry => entry.contentType === 'technique').reduce((n, entry) => n + entry.techniques.length, 0), 40);
  assert.deepEqual(entries.map(entry => entry.abilitySource.uid), [9, 14, 15, 16, 17, 18, 10, 4]);
  for (const entry of entries) {
    assertWorldbookAbility(entry);
    assert.equal(sourceDigest(entry.abilitySource.content), createHash('sha256').update(entry.abilitySource.content).digest('hex'));
    assert.ok(entry.abilitySource.content.trimEnd().endsWith('</cultivation_lore>'));
  }
  const taiyi = entries.find(entry => entry.name === '太一沧澜经');
  assert.ok(taiyi.techniques.some(move => move.name === '分念·同潮'));
  assert.ok(!taiyi.techniques.some(move => move.name === '无相分身'));
  for (const text of ['', 'abc', '许妍🌊'.repeat(100), 'x'.repeat(55), 'x'.repeat(56), 'x'.repeat(64)])
    assert.equal(sourceDigest(text), createHash('sha256').update(text).digest('hex'));
});

test('new preparations replace catalogue definitions without upgrading existing snapshots', () => {
  const old = authoritativeEntries();
  const before = structuredClone(old);
  const registry = preparationRegistry(old);
  assert.equal(registry.length, 8);
  assert.deepEqual(old, before);
  assert.equal(registry[0].abilitySource.book, '自定义全能 .json');
  const state = fixture();
  const snapshot = structuredClone(state);
  entries[0].abilitySource.content += 'changed installed catalogue';
  try { assert.deepEqual(restoreBattle(state), snapshot); }
  finally { entries[0].abilitySource.content = snapshot.registrySnapshot[0].abilitySource.content; }
  assert.deepEqual(createRuleMemory(registry).interactions, []);
});

test('adjudication sends full selected originals once with addressable rules and ownership', () => {
  const state = fixture();
  const request = buildAdjudicationRequest(state, { label: '起弦', techniqueId: selected[0].techniques[0].id });
  const payload = JSON.parse(request.prompt).context;
  assert.deepEqual(payload.abilitySources.map(source => source.uid), [9, 10]);
  for (const entry of selected) {
    const original = entry.abilitySource.content;
    assert.equal(payload.abilitySources.find(source => source.id === entry.abilitySource.id).content, original);
    const escaped = JSON.stringify(original).slice(1, -1);
    assert.equal(request.prompt.split(escaped).length - 1, 1);
    const index = payload.registry.find(item => item.id === entry.id);
    assert.equal(index.mechanics, undefined);
    for (const move of index.techniques) assert.ok(move.ruleRefs.every(ref => knownRules(state).has(ref)));
  }
  assert.ok(!payload.registry.some(entry => entry.id === entries[5].id));
  assert.equal(payload.actors.player.profile.martialArts[0].description, undefined);
  assert.ok(payload.actors.player.activatedTechniques.includes(selected[0].techniques[0].id));
  assert.throws(() => buildAdjudicationRequest(state, { label: '未启用', techniqueId: entries[5].techniques[0].id }), /未拥有/);
});

test('missing, corrupted originals or mismatched move text fail before adjudication', () => {
  for (const mutate of [e => { delete e.abilitySource; }, e => { e.abilitySource.content += '额外文字'; }, e => { e.techniques[0].originalDefinition = '精简替代'; }]) {
    const state = fixture(); mutate(state.registrySnapshot[0]);
    assert.throws(() => buildAdjudicationRequest(state, { label: '试探' }), /原文/);
    assert.throws(() => restoreBattle(state), /原文/);
  }
});

test('confirmed battle freezes only manually enabled source entries', async () => {
  const scope = { chatId: 'raw-book', branchId: 'main' };
  const prep = await prepareEnemyCandidates({ registry: entries, scope, playerCandidate: playerSource(), enemies: [{ id: 'enemy', name: '厉沧海' }] },
    { includePlayer: true, requireProfiles: true, inference: { completeCandidate: async () => fullCombatProfile() } });
  const player = prep.candidates.find(candidate => candidate.role === 'player');
  const confirmed = confirmEnemyCandidates(prep, { [player.id]: playerSource() });
  const state = applyConfirmedEnemies(createInitialState({ ...scope }), confirmed);
  assert.deepEqual(state.registrySnapshot.filter(entry => entry.abilitySource).map(entry => entry.abilitySource.uid), [9, 10]);
  assert.equal(JSON.parse(buildAdjudicationRequest(startBattle(state), { label: '观察' }).prompt).context.abilitySources.length, 2);
});

test('HTTP adapter transmits untruncated raw originals and honours output configuration', async t => {
  let body;
  const server = createServer((req, res) => { let data = ''; req.on('data', chunk => { data += chunk; }); req.on('end', () => {
    body = JSON.parse(data); res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ choices: [{ message: { content: '{}' } }] }));
  }); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const request = buildAdjudicationRequest(fixture(), { label: '观察' }, { maxOutput: 9876 });
  const adapter = new HttpJsonAdjudicator({ endpoint: `http://127.0.0.1:${server.address().port}`, model: 'transport-test' });
  await adapter.judge(request);
  assert.equal(body.max_tokens, 9876);
  assert.equal(body.messages[1].content, request.prompt);
  assert.equal(JSON.parse(body.messages[1].content).context.abilitySources[1].content, selected[1].abilitySource.content);
});
