import test from 'node:test';
import assert from 'node:assert/strict';
import { TechniqueRegistry, assertRegistryEntry } from '../src/battle-registry.js';
import {
  SIX_HEAVENLY_TECHNIQUES,
  THREE_HEAVENLY_TREASURES,
  ALL_CANONICAL_REGISTRIES
} from '../src/canonical-techniques.js';

test('all six heavenly techniques conform to registry schema and pass assertions', () => {
  assert.equal(SIX_HEAVENLY_TECHNIQUES.length, 6);
  const expectedIds = [
    'gongfa.taiyi-canglanjing',
    'gongfa.chengxin-tinglanjue',
    'gongfa.wuxiang-shuijingfa',
    'gongfa.liuguang-tachaobu',
    'gongfa.dielang-xuanchaojue',
    'gongfa.xianhai-gongmingpian'
  ];

  for (const entry of SIX_HEAVENLY_TECHNIQUES) {
    assert.doesNotThrow(() => assertRegistryEntry(entry), `Assertion failed for ${entry.id}`);
    assert.ok(expectedIds.includes(entry.id), `Unexpected technique ID: ${entry.id}`);
    assert.equal(entry.rank, '天阶');
    assert.ok(entry.techniques.length > 0);
    assert.ok(entry.synergies.length > 0);
    assert.ok(entry.narrativeGuidance.length > 0);
  }
});

test('all three heavenly treasures conform to registry schema and pass assertions', () => {
  assert.equal(THREE_HEAVENLY_TREASURES.length, 3);
  const expectedTreasureIds = [
    'fabao.cangxian-chaoyin',
    'fabao.chengjie-wuxiangjing',
    'fabao.chaochen-xinglv'
  ];

  for (const treasure of THREE_HEAVENLY_TREASURES) {
    assert.doesNotThrow(() => assertRegistryEntry(treasure), `Assertion failed for ${treasure.id}`);
    assert.ok(expectedTreasureIds.includes(treasure.id), `Unexpected treasure ID: ${treasure.id}`);
    assert.equal(treasure.rank, '天阶');
    assert.ok(treasure.techniques.length > 0);
    assert.ok(treasure.synergies.length > 0);
  }
});

test('canonical registry instantiates cleanly and provides lookup across all entries', () => {
  const registry = new TechniqueRegistry(ALL_CANONICAL_REGISTRIES);
  assert.equal(registry.list().length, 9);

  // Test finding technique across entries
  const foundTaiyi = registry.findTechnique('chengyuan-qihaihuiliu');
  assert.ok(foundTaiyi);
  assert.equal(foundTaiyi.entry.id, 'gongfa.taiyi-canglanjing');
  assert.equal(foundTaiyi.technique.name, '澄渊·气海回流');

  const foundMirror = registry.findTechnique('shijie-maoding');
  assert.ok(foundMirror);
  assert.equal(foundMirror.entry.id, 'fabao.chengjie-wuxiangjing');
  assert.equal(foundMirror.technique.name, '视界锚定');

  const foundFootwear = registry.findTechnique('tianyayikui');
  assert.ok(foundFootwear);
  assert.equal(foundFootwear.entry.id, 'fabao.chaochen-xinglv');

  // Test dynamic availability
  const taiyiAvail = registry.availability('gongfa.taiyi-canglanjing', 'chengyuan-qihaihuiliu');
  assert.equal(taiyiAvail.available, true);

  const dielangAvailLocked = registry.availability('gongfa.dielang-xuanchaojue', 'dielang', {});
  assert.equal(dielangAvailLocked.available, false);

  const dielangAvailUnlocked = registry.availability('gongfa.dielang-xuanchaojue', 'dielang', {
    statuses: ['xianshi:triggered']
  });
  assert.equal(dielangAvailUnlocked.available, true);
});
