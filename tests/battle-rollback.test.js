import test from 'node:test';
import assert from 'node:assert/strict';
import { rollbackFromAction } from '../src/battle-rollback.js';
import { createInitialState, startBattle } from '../src/battle-state.js';

test('legacy rollback reverses all removed resource settlements and restores semantic and causal before-images', () => {
  const state = startBattle(createInitialState({ sessionId: 'old', player: { id: 'player', resources: { qi: 60 }, resourceDefinitions: [{ key: 'qi', current: 60 }] } }));
  const before = structuredClone(state.semanticState);
  const causal = structuredClone(state.causalState);
  state.history = [
    { actionId: 'keep', status: 'complete', adjudication: { publicEvents: ['保留第一轮'] } },
    { actionId: 'remove1', roundId: 'old-r2', status: 'complete', before, causalBefore: causal, adjudication: { resourceChanges: [{ actorId: 'player', resource: 'qi', before: 100, after: 80 }], publicEvents: ['删去第二轮'] } },
    { actionId: 'remove2', roundId: 'old-r3', status: 'complete', adjudication: { resourceChanges: [{ actorId: 'player', resource: 'qi', before: 80, after: 60 }], publicEvents: ['删去第三轮'] } }
  ];
  state.semanticState.statuses = ['xianshi:triggered'];
  state.semanticState.effects = [{ id: 'removed-effect' }];
  state.actionSeq = 3; state.version = 26; state.round = 3;
  const next = rollbackFromAction(state, 1);
  assert.equal(next.actors.player.resources.qi, 100);
  assert.equal(next.actors.player.resourceDefinitions[0].current, 100);
  assert.deepEqual(next.semanticState, before);
  assert.deepEqual(next.causalState, causal);
  assert.equal(next.round, 2);
  assert.equal(next.roundId, 'old-r2');
  assert.deepEqual(next.scene.publicEvents, ['保留第一轮']);
  assert.equal(next.history.length, 1);
  assert.equal(next.actionSeq, 3);
  assert.equal(next.version, 27);
  assert.equal(state.actors.player.resources.qi, 60);
});
