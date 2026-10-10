import { signalTrace } from './operation-log.js';
import { judgeAndCommit } from './battle-state.js';
import { clone, stableStringify, abortIfNeeded } from './common.js';

// Run the existing engine against a detached working copy. No storage, narrator,
// host UI or callbacks can observe this provisional state.
export async function proposeBattleAction(before, action, { adjudicator, settings = {}, signal } = {}) {
  abortIfNeeded(signal);
  const trace=signalTrace(signal);
  const result = await judgeAndCommit(clone(before), action, { adjudicator, signal, logger:entry=>{
    if (['program_validation','adjudication_failed','commit'].includes(entry.kind)) trace?.write(entry.kind==='commit'?'proposal':'validation',entry.validation?.valid===false?'failed':'success','战斗提案校验',{proposalId:action.actionId,committed:false,attempt:entry.validation?.repairAttempt,code:entry.code},entry.validation?.valid===false?'ERROR':'INFO');
  }, settings: { ...settings, autoNarrative: false } });
  abortIfNeeded(signal);
  if (result.record.adjudication?.battleStatus === 'ended') result.state.phase = 'ended';
  return { schema: 'battle_proposal_v1', base: stableStringify(before), actionId: result.record.actionId,
    before: clone(before), after: result.state, record: result.record, packet: result.record.narrativePacket };
}

export function commitBattleProposal(current, proposal) {
  if (proposal?.schema !== 'battle_proposal_v1' || stableStringify(current) !== proposal.base || proposal.before?.version !== current.version) throw new Error('战斗提案基线已变化');
  if (!proposal.record || proposal.record.actionId !== proposal.actionId || proposal.record.status !== 'committed') throw new Error('战斗提案未经校验');
  return clone(proposal.after);
}
