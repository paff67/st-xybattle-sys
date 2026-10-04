import test from 'node:test';
import assert from 'node:assert/strict';
import { extractEnemyTechniques } from '../src/battle-context.js';

test('enemy context extraction exposes public and observed techniques but never hidden data', () => {
  const state = { scene: { publicEvents: ['敌手施展守势回流'] } };
  const enemy = {
    id: 'e1',
    name: '敌手',
    visibleInfo: { stance: 'guard', observedTechniques: [{ id: 'guard-wave', name: '守势回流', description: '公开观察' }] },
    hidden: { techniques: [{ name: '不可见秘术', description: '不得显示' }] },
    techniques: [{ id: 'secret', name: '不可见秘术', visibility: 'internal' }]
  };
  const extracted = extractEnemyTechniques(enemy, state);
  assert.deepEqual(extracted.map((item) => item.name), ['守势回流']);
  assert.doesNotMatch(JSON.stringify(extracted), /不可见秘术/);
  assert.equal(extracted[0].status, 'inferred');
});

test('enemy context extraction gives an explicit unknown frame instead of inventing a move', () => {
  const extracted = extractEnemyTechniques({ id: 'e2', name: '未知敌手', visibleInfo: {} }, { scene: { publicEvents: [] } });
  assert.equal(extracted.length, 1);
  assert.equal(extracted[0].status, 'unknown');
  assert.match(extracted[0].description, /没有公开/);
});
