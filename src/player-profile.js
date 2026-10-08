import { normalizeCombatProfile, DYNAMIC_COMBAT_PROFILE_SCHEMA } from './combat-profile.js';

/** Adapt existing MVU facts, not a second AI-authored protagonist. */
export function knownPlayerProfile(raw, { id, name, registry = [] } = {}) {
  const profile = normalizeCombatProfile({ ...raw, learnedTechniqueRefs: [], martialArts: [], techniques: [] }, { id, side: 'player', registry });
  profile.name ||= name || '';
  profile.currentState ||= typeof raw.状态 === 'string' ? raw.状态 : '';
  profile.profileSchema = DYNAMIC_COMBAT_PROFILE_SCHEMA;
  profile.resourceDefinitions = [];
  profile.resources = {};
  // Host numbers are evidence, never a fixed-cost resource account.
  for (const key of ['生命', '精血', '灵力', '神识']) {
    if (typeof raw[key] !== 'number' || !Number.isFinite(raw[key])) continue;
    if (!profile.resourceTraits.some(item => item.name === key)) profile.resourceTraits.push({ name: key, description: `MVU 主角.${key} 的状态证据`, depletionConsequences: '依据已激活功法与实际状态判断行动限制', recoveryConditions: ['依据已激活功法、治疗或调息的实际条件判断'] });
    profile.state.resources = profile.state.resources.filter(item => item.name !== key);
    profile.state.resources.push({ name: key, condition: `MVU 记录 ${key}=${raw[key]}，定性余裕尚未裁定`, burden: '', limitations: [], basis: `MVU 主角.${key}`, visibility: 'player' });
  }
  profile.combatStyle ||= '依玩家本轮行动和手动启用的功法裁定';
  profile.behavior.preference ||= '依玩家当前输入选择行动';
  profile.behavior.opening ||= '执行玩家本轮已提交的意图，不自动替玩家决定起手';
  if (!profile.behavior.tactics.length) profile.behavior.tactics = ['按已掌握功法、当前资源和实际条件裁定'];
  if (!profile.weaknesses.length) profile.weaknesses = ['受已启用功法的原文限制与当前资源约束，不预设额外弱点'];
  return normalizeCombatProfile(profile, { id, side: 'player', registry });
}
