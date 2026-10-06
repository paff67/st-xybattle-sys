import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parseContentExport, createContentExport } from '../src/content-protocol.js';

const base = new URL('../content/authoritative-six-arts/', import.meta.url);
const pack = JSON.parse(await readFile(new URL('six-arts.content.json', base), 'utf8'));
const records = parseContentExport(pack);
assert.equal(records.length, 6);
assert.equal(records.reduce((n, item) => n + item.entry.techniques.length, 0), 39);
const ids = new Set(), rules = new Set();
for (const { entry } of records) {
  const individual = JSON.parse(await readFile(new URL(`${entry.id.slice(7)}.json`, base), 'utf8'));
  assert.deepEqual(individual.entry, entry);
  for (const rule of entry.combatSpec.rules) {
    assert.ok(!rules.has(rule.id)); rules.add(rule.id);
    assert.ok(rule.text.trim());
  }
  assert.deepEqual(entry.narrativeGuidance, []);
  assert.ok(!entry.combatSpec.rules.some((rule) => rule.heading === '叙事规则'));
  for (const move of entry.techniques) {
    assert.ok(!ids.has(move.id)); ids.add(move.id);
    assert.equal(move.originalDefinition, entry.combatSpec.rules.find((rule) => rule.id === move.ruleRefs[0]).text);
    assert.equal(move.availability.default, 'conditional');
    for (const key of ['numericCost', 'cooldownTurns', 'durationTurns', 'maxStacks']) assert.equal(move.resolution[key], null);
    for (const ref of [...move.ruleRefs, ...move.resolution.conditionSourceRefs, ...move.resolution.effectSourceRefs]) assert.ok(rules.has(ref), ref);
  }
}
const restored = parseContentExport(createContentExport(records));
assert.deepEqual(restored.map((r) => r.entry), records.map((r) => r.entry), 'content import/export must preserve semantic extensions');
const interactions = JSON.parse(await readFile(new URL('system-interactions.json', base), 'utf8'));
const entryIds = new Set(records.map((r) => r.id));
for (const edge of interactions.edges) {
  assert.ok(entryIds.has(edge.from) && entryIds.has(edge.to));
  edge.sourceRefs.forEach((ref) => assert.ok(rules.has(ref), ref));
}
// Optional verification against the user's exact original, without copying
// unrelated worldbook/persona entries into the repository.
if (process.argv[2]) {
  const raw = await readFile(process.argv[2]);
  const source = JSON.parse(raw.toString('utf8').replace(/^\uFEFF/, ''));
  const digest = createHash('sha256').update(raw).digest('hex');
  for (const { entry } of records) {
    assert.equal(entry.authority.sourceFileSha256, digest);
    const original = source.entries[entry.authority.entryKey];
    assert.equal(entry.authority.contentSha256, createHash('sha256').update(original.content.trim()).digest('hex'));
    for (const rule of entry.combatSpec.rules) assert.ok(original.content.includes(rule.text), `${entry.name}: ${rule.heading} changed`);
    const named = [...original.content.matchAll(/^### 《([^》]+)》/gm)].map((match) => match[1]);
    assert.deepEqual(entry.techniques.map((move) => move.name), named, 'every named source technique must be present');
  }
}
console.log(`Verified ${records.length} source-backed templates, ${ids.size} actions, ${rules.size} source rules and ${interactions.edges.length} interactions; import/export roundtrip preserved.`);
