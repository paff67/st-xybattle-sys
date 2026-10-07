import { clone } from './common.js';

export function rollbackFromAction(state, index) {
  const first = state.history[index];
  if (!first) return state;
  let restored;
  if (first.rollbackState) restored = clone(first.rollbackState);
  else {
    // Older builds saved semantic/causal before-images and resource deltas,
    // but no full snapshot. Reverse every removed settlement exactly once.
    restored = clone(state);
    for (const record of state.history.slice(index).reverse()) {
      if (!['committed', 'complete'].includes(record.status)) continue;
      for (const change of record.adjudication?.resourceChanges || []) {
        const actor = [restored.actors.player, ...restored.actors.enemies].find((item) => item.id === change.actorId);
        if (!actor) continue;
        actor.resources[change.resource] = change.before;
        const definition = actor.resourceDefinitions?.find((item) => item.key === change.resource);
        if (definition) definition.current = change.before;
      }
    }
    restored.semanticState = clone(first.before);
    if (first.causalBefore) restored.causalState = clone(first.causalBefore);
    restored.roundId = first.roundId;
    const round = Number(String(first.roundId).match(/-r(\d+)$/)?.[1]);
    if (round) restored.round = round;
    restored.scene.publicEvents = state.history.slice(0, index).flatMap((record) => record.adjudication?.publicEvents || []);
    restored.scene.turn = restored.round;
  }
  return {
    ...restored, scope: clone(state.scope), history: clone(state.history.slice(0, index)),
    phase: 'awaiting_player', pending: null, lastError: null,
    // Storage revision and action sequence never regress; battle state does.
    version: state.version + 1, actionSeq: state.actionSeq,
    rollback: { removedActionIds: state.history.slice(index).map((record) => record.actionId), reason: 'host-message-deleted' },
    updatedAt: new Date().toISOString()
  };
}
