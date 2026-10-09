import { normalizeBattlefieldState } from './event-battlefield-state.js';
import { canonicalEvent, copyEvent } from './event-state.js';
import { sourceDigest } from './source-digest.js';

export const selectedMvu = message => Array.isArray(message?.variables) ? message.variables[message.swipe_id || 0] : message?.variables;
export const battleProjection = data => normalizeBattlefieldState((data?.stat_data ?? data?.data?.stat_data)?.世界?.战界);
export const activationFingerprint = value => sourceDigest(canonicalEvent(value) || 'null');
export const activationBranchKey = identity => JSON.stringify([identity.avatar, identity.chatId, identity.branchUid, identity.assistantMessageUid, identity.swipeUid]);

// Missing/invalid is never normalized into “无”. Update numbers come from
// confirmed state changes, not callback counts or four-field hashes alone.
export function observeBattleState(previous, { identity, snapshot, baseline, eligible = false, messageFingerprint }) {
  const sameRequest = !!previous && previous.messageFingerprint === messageFingerprint;
  const after = battleProjection(snapshot), before = sameRequest ? { state: previous.state, issues: previous.issues } : battleProjection(baseline);
  const fingerprint = activationFingerprint(snapshot);
  const changed = !sameRequest || previous.snapshotFingerprint !== fingerprint;
  const sequence = (previous?.sequence || 0) + (changed ? 1 : 0);
  const observation = { ...copyEvent(identity), state: after.state, issues: after.issues, snapshotFingerprint: fingerprint, messageFingerprint, sequence };
  const edge = eligible && changed && !!before.state && !!after.state && before.state.战斗状态 !== '待裁定' && after.state.战斗状态 === '待裁定';
  return { observation, candidate: edge ? { ...copyEvent(identity), activationId: `activation-${activationFingerprint([activationBranchKey(identity), messageFingerprint, sequence])}`,
    source: 'mvu-state-edge', before: before.state, after: after.state, sequence, snapshotFingerprint: fingerprint, messageFingerprint } : null,
    reason: !after.state ? after.issues.join(',') : !before.state ? 'valid_baseline_required' : !eligible ? 'baseline_only' : changed ? 'no_activation_edge' : 'duplicate_signal' };
}
