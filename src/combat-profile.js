import { clone } from './common.js';
import { bindLearnedRules } from './authoritative-rules.js';
import { initializeActorState, resourceIdFor, publicActorState } from './actor-state.js';

export const COMBAT_PROFILE_SCHEMA = 'battle_combat_profile_v2';
export const DYNAMIC_COMBAT_PROFILE_SCHEMA = 'battle_combat_profile_v3_dynamic';
const object = (value) => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const text = (value) => typeof value === 'string' ? value.trim() : '';
const list = (value) => Array.isArray(value) ? value : typeof value === 'string' && value.trim() ? [value] : [];
const words = (value) => list(value).filter((item) => typeof item === 'string' && item.trim());
const first = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');
const visibility = (value, fallback) => ['public', 'player', 'internal', 'gm'].includes(value) ? value : fallback;

// Only battle-facing traits may enter a public actor card. Arbitrary source objects
// (generated, observed, bookkeeping, internal resources) never enter this projection.
export function publicCharacterTraits(raw = {}) {
  if (typeof raw === 'string') return raw ? { description: raw } : {};
  const result = {};
  const aliases = {
    identity: ['identity', '身份'], cultivationRealm: ['cultivationRealm', 'realm', '境界', '修为'],
    currentState: ['currentState', '当前状态'], stance: ['stance', '姿态'], position: ['position', '站位'],
    weapon: ['weapon', '武器'], appearance: ['appearance', '外貌'], aura: ['aura', '气息'],
    environmentalEffect: ['environmentalEffect', '环境影响'], description: ['description', '说明', '公开表现']
  };
  for (const [key, candidates] of Object.entries(aliases)) {
    const value = first(...candidates.map((alias) => raw[alias]));
    if (typeof value === 'string' || typeof value === 'number') result[key] = value;
    else if (key === 'weapon' && value && typeof value === 'object') {
      result.weapon = [text(value.name || value.名称), text(value.state || value.状态), value.drawn === false ? '未出鞘' : '', text(value.grip), text(value.observableState)].filter(Boolean).join('；');
    }
  }
  return result;
}

export function normalizeCombatProfile(raw = {}, { id, side = 'enemy', registry = [] } = {}) {
  const data = object(raw.candidate || raw.fields || raw);
  // v3 keeps immutable ability definitions and mutable round state separate.
  // We still emit the legacy flat projection so existing panels/registries can
  // read a confirmed actor while the adjudicator uses profile/state directly.
  const nestedProfile = object(data.profile);
  const profileData = Object.keys(nestedProfile).length ? nestedProfile : data;
  const initialState = object(data.initialState || data.state);
  const visible = publicCharacterTraits(data.visibleInfo || data.可见情报 || {});
  const generated = object(data.generated);
  const resourceInput = profileData.resourceDefinitions || profileData.resourceModel || generated.battleResourceModel || data.resourceDefinitions || data.resourceModel || data.resources || [];
  const definitions = Array.isArray(resourceInput) ? resourceInput : Object.entries(object(resourceInput)).map(([key, value]) => ({ key, ...(typeof value === 'number' ? { current: value } : object(value)) }));
  const resourceDefinitions = definitions.map(object).map((item, index) => ({
    key: text(item.key || item.resource || item.id) || `resource-${index + 1}`,
    name: text(item.name || item.label || item.名称 || item.key),
    current: first(item.current, item.value, data.resources?.[item.key]) ?? null,
    min: first(item.min, 0), max: first(item.max, item.maximum, item.capacity) ?? null,
    definition: text(item.definition || item.description), recovery: text(item.recovery || item.regeneration),
    visibility: visibility(item.visibility, side === 'player' ? 'player' : 'internal')
  }));
  const techniques = list(profileData.techniques || data.techniques || data.skills || data.招式).map(object).map((item) => ({
    name: text(item.name || item.名称), school: text(item.school || item.martialArt || item.所属功法),
    category: text(item.category || item.type), originalDefinition: text(item.originalDefinition || item.definition || item.description || item.mechanism),
    mechanics: words(item.mechanics || item.mechanism), cost: item.cost && typeof item.cost === 'object' ? clone(item.cost) : text(item.cost), range: text(item.range), cooldown: text(item.cooldown),
    conditions: words(item.conditions || item.availability?.conditions), limits: words(item.limits || item.limitations), recovery: item.recovery && typeof item.recovery === 'object' ? clone(item.recovery) : text(item.recovery),
    counterplay: Array.isArray(item.counterplay) ? words(item.counterplay).join('；') : text(item.counterplay || item.interruptConditions || item.破解方式 || list(item.counterplayConditions).join('；')),
    availability: { default: ['available', 'conditional', 'unavailable'].includes(item.availability?.default) ? item.availability.default : 'available', conditions: words(item.availability?.conditions), requires: list(item.availability?.requires), description: text(item.availability?.description || item.requirements) },
    triggeredState: words(item.triggeredState), visibility: visibility(item.visibility, side === 'player' ? 'player' : 'internal')
  }));
  const behavior = typeof profileData.behavior === 'string' ? { preference: profileData.behavior } : object(profileData.behavior || data.behavior);
  const dynamicResourceTraits = list(profileData.resourceTraits || data.resourceTraits).map(object).map((item) => ({ name: text(item.name || item.label), description: text(item.description), depletionConsequences: text(item.depletionConsequences), recoveryConditions: words(item.recoveryConditions) }));
  const dynamicState = {
    resources: list(initialState.resources).map(object).map((item) => ({ name: text(item.name), condition: text(item.condition), burden: text(item.burden), limitations: words(item.limitations), basis: text(item.basis), visibility: visibility(item.visibility, 'internal') })),
    injuries: clone(list(initialState.injuries)), statuses: clone(list(initialState.statuses)), position: text(initialState.position)
  };
  const profile = {
    learnedTechniqueRefs: (side === 'player' ? list(data.learnedTechniqueRefs) : []).map((ref) => ({ registryId: text(ref.registryId), techniqueIds: words(ref.techniqueIds), version: text(ref.version), contentSha256: text(ref.contentSha256), proficiency: text(ref.proficiency), evidence: text(ref.evidence) })),
    id: id || text(data.id), name: text(data.name || data.姓名), side,
    profileSchema: Object.keys(nestedProfile).length || data.profileSchema === DYNAMIC_COMBAT_PROFILE_SCHEMA ? DYNAMIC_COMBAT_PROFILE_SCHEMA : COMBAT_PROFILE_SCHEMA,
    identity: text(profileData.identity || data.identity || data.身份 || visible.identity),
    cultivationRealm: text(profileData.cultivationRealm || data.cultivationRealm || data.realm || data.境界 || visible.cultivationRealm),
    combatStyle: text(profileData.combatStyle || data.combatStyle || data.战斗方式), currentState: text(data.currentState || data.当前状态 || visible.currentState),
    visibleInfo: visible,
    martialArts: list(profileData.martialArts || data.martialArts || data.功法).map(object).map((item) => ({ name: text(item.name || item.名称), rank: text(item.rank || item.品阶), description: text(item.description || item.originalDefinition || item.definition), principle: text(item.principle || item.corePrinciple), limitations: words(item.limitations || item.limits) })),
    techniques, resourceDefinitions,
    resources: Object.fromEntries(resourceDefinitions.filter((item) => Number.isFinite(item.current)).map((item) => [item.key, item.current])),
    behavior: { preference: text(behavior.preference || behavior.preferredRange || behavior.style), opening: text(behavior.opening || behavior.openingMove), tactics: words(behavior.tactics || behavior.priorities), retreat: text(behavior.retreat || behavior.retreatConditions) },
    resourceTraits: dynamicResourceTraits, weaknesses: words(profileData.weaknesses || data.weaknesses || data.弱点), hidden: clone(object(profileData.hidden || data.hidden)),
    state: dynamicState, initialCombatObjects: clone(list(data.initialCombatObjects || initialState.combatObjects))
  };
  return side === 'player' && registry.length ? bindLearnedRules(profile, registry) : profile;
}

const uncertain = /^(?:未知|不明|待定|待补充|未提供|待裁定|unknown|tbd|player|主角|演示主角)$/i;
const defined = (value) => !!text(value) && !uncertain.test(value);
export function combatProfileIssues(profile) {
  const issues = [];
  const dynamic = profile.profileSchema === DYNAMIC_COMBAT_PROFILE_SCHEMA;
  const localPlayer = dynamic && profile.side === 'player';
  for (const [key, label] of Object.entries({ name: '姓名', identity: '身份', cultivationRealm: '修为境界', combatStyle: '战斗方式', currentState: '当前状态' })) {
    if (!(dynamic && key === 'currentState') && !defined(profile[key])) issues.push(`请补全${label}`);
  }
  if (!defined(profile.behavior?.preference) || !dynamic && !defined(profile.behavior?.opening) || !profile.behavior?.tactics?.length) issues.push('请补全战斗偏好、起手和战术');
  if (!localPlayer && !profile.martialArts?.length) issues.push('至少需要一门有完整设定的功法');
  for (const method of profile.martialArts || []) if (!defined(method.name) || !defined(method.description) || !defined(method.principle)) issues.push(`${method.name || '功法'}缺少名称、完整设定或核心原理`);
  if (!localPlayer && !profile.techniques?.length) issues.push('至少需要一项有完整设定的招式');
  for (const move of profile.techniques || []) {
    const dynamic = profile.profileSchema === DYNAMIC_COMBAT_PROFILE_SCHEMA;
    const missing = Object.entries(dynamic ? { name: '名称', school: '所属功法', originalDefinition: '完整定义', counterplay: '应对与打断方式' } : { name: '名称', school: '所属功法', originalDefinition: '完整定义', cost: '消耗', range: '范围', cooldown: '冷却', counterplay: '应对与打断方式' }).filter(([key]) => !defined(move[key])).map(([, label]) => label);
    if (!move.mechanics?.length) missing.push('作用机制');
    if (dynamic && !localPlayer ? !move.conditions?.length : !defined(move.availability?.description)) missing.push('使用条件');
    if (dynamic && !localPlayer && (!words(move.cost?.resources).length || !defined(move.cost?.onUse) || !defined(move.cost?.sustaining) || !words(move.cost?.amplifiers).length || !words(move.cost?.overuseConsequences).length || !words(move.recovery?.conditions).length || !defined(move.recovery?.effect) || !words(move.recovery?.limits).length)) missing.push('定性消耗和恢复规则');
    if (missing.length) issues.push(`${move.name || '招式'}缺少${missing.join('、')}`);
    if (move.availability?.default === 'conditional' && !move.availability.requires?.length) issues.push(`${move.name || '招式'}缺少可检查的解锁条件；普通消耗限制请写在使用条件中并设为可用`);
    if (move.availability?.requires?.some((requirement) => !defined(requirement?.path) || !['includes', 'truthy', 'equals', 'not'].includes(requirement?.op))) issues.push(`${move.name || '招式'}的解锁条件无效`);
    if (!(profile.martialArts || []).some((method) => method.name === move.school)) issues.push(`${move.name || '招式'}的所属功法未定义`);
  }
  if (!profile.resourceDefinitions?.length && !profile.learnedTechniqueRefs?.length && profile.profileSchema !== DYNAMIC_COMBAT_PROFILE_SCHEMA) issues.push('请定义至少一种战斗资源及其边界');
  const keys = new Set();
  for (const resource of profile.resourceDefinitions || []) {
    const numericRequired = profile.profileSchema !== DYNAMIC_COMBAT_PROFILE_SCHEMA;
    if (!defined(resource.name) || !defined(resource.definition) || numericRequired && (!Number.isFinite(resource.current) || !Number.isFinite(resource.min) || !Number.isFinite(resource.max) || resource.current < resource.min || resource.current > resource.max || resource.min > resource.max) || keys.has(resource.key)) issues.push(`${resource.name || '资源'}的名称、定义、当前值或边界无效`);
    keys.add(resource.key);
  }
  if (!profile.weaknesses?.length) issues.push('请补全战斗弱点与限制');
  if (dynamic) {
    const names = new Set();
    if (!localPlayer && !profile.resourceTraits?.length) issues.push('请定义资源性质');
    for (const trait of profile.resourceTraits || []) {
      if (!defined(trait.name) || !defined(trait.description) || !defined(trait.depletionConsequences) || !words(trait.recoveryConditions).length || names.has(trait.name)) issues.push('资源性质定义无效或重复');
      names.add(trait.name);
    }
    const states = new Set();
    for (const resource of profile.state?.resources || []) {
      if (!names.has(resource.name) || !defined(resource.condition) || states.has(resource.name)) issues.push('初始资源状态未定义或重复');
      states.add(resource.name);
    }
  }
  return [...new Set(issues)];
}

/** Compile confirmed definitions into the same registry/rule surface as adjudication. */
export function compileCombatProfile(input, side, registry = []) {
  const profile = normalizeCombatProfile(input, { id: input.id, side, registry });
  const issues = combatProfileIssues(profile);
  if (issues.length) throw new Error(`${profile.name || '人物'}资料不完整：${issues.join('；')}`);
  // Old model responses/imports remain readable, but new confirmed battles use
  // qualitative state. Preserve old numbers as evidence, never spendable points.
  if (!profile.resourceTraits.length) profile.resourceTraits = profile.resourceDefinitions.map(resource => ({ name: resource.name,
    description: resource.definition, depletionConsequences: '依据已确认功法限制和当前交锋判断', recoveryConditions: [resource.recovery || '未提供恢复条件，不自动恢复'] }));
  if (!profile.state.resources.length) profile.state.resources = profile.resourceDefinitions.map(resource => ({ name: resource.name,
    condition: Number.isFinite(resource.current) ? `来源记录 ${resource.name}=${resource.current}，不自动换算定性余裕` : '当前余裕未明确', burden: '', limitations: [], basis: '旧格式已确认资料', visibility: resource.visibility }));
  const prefix = `combat-profile.${encodeURIComponent(profile.id)}`;
  const boundIds = new Set(profile.learnedTechniqueRefs.flatMap((ref) => ref.techniqueIds));
  const techniques = profile.techniques.filter((move) => !boundIds.has(move.id)).map((move, index) => ({ ...move, id: `${prefix}.move-${index + 1}`, ruleRefs: [`${prefix}.move-${index + 1}.definition`] }));
  const entry = {
    id: prefix, name: `${profile.name}·战斗功法`, rank: profile.cultivationRealm, element: '人物已确认设定',
    corePrinciple: profile.martialArts.filter(method => !profile.learnedTechniqueRefs.some(ref => ref.name === method.name)).map((method) => `${method.name}：${method.description}；${method.principle}`).join('\n') || '已绑定的功法与法宝按对应来源裁定，其余以玩家实际行动与状态为据',
    mechanics: [profile.combatStyle], techniques, synergies: [], narrativeGuidance: [], ruleRefs: [`${prefix}.profile`],
    version: '1', visibility: side === 'player' ? 'player' : 'internal', characterProfileId: profile.id
  };
  const resourceRules = [];
  for (const trait of profile.resourceTraits) resourceRules.push({ actorId: profile.id, resource: resourceIdFor(profile.id, trait.name), name: trait.name, qualitative: true, definition: trait.description, recovery: clone(trait.recoveryConditions), ruleRefs: [`${prefix}.resource-trait.${encodeURIComponent(trait.name)}`] });
  const immutableProfile = { schema: DYNAMIC_COMBAT_PROFILE_SCHEMA, identity: profile.identity, cultivationRealm: profile.cultivationRealm, combatStyle: profile.combatStyle, martialArts: clone(profile.martialArts), techniques: clone([...techniques, ...profile.techniques.filter(move => boundIds.has(move.id))]), resourceTraits: clone(profile.resourceTraits), behavior: clone(profile.behavior), weaknesses: clone(profile.weaknesses), hidden: clone(profile.hidden) };
  const actor = { ...profile, profile: immutableProfile, state: clone(profile.state), techniques: side === 'player' ? [...(techniques.length ? [{ registryId: prefix, techniqueIds: techniques.map((move) => move.id) }] : []), ...profile.learnedTechniqueRefs.map((ref) => ({ registryId: ref.registryId, techniqueIds: clone(ref.techniqueIds) }))] : techniques };
  actor.state = initializeActorState(actor);
  actor.numericEvidence = clone(profile.resourceDefinitions);
  actor.resources = {}; actor.resourceDefinitions = [];
  actor.visibleInfo = { ...profile.visibleInfo, identity: profile.identity, cultivationRealm: profile.cultivationRealm, currentState: profile.currentState };
  return { actor, entry, resourceRules };
}

export function publicEnemyProfile(enemy) {
  const visibleInfo = publicCharacterTraits(enemy.visibleInfo || {});
  // Confirmed definitions may be known to the author but still secret in-world.
  const techniques = (enemy.techniques || []).filter((move) => ['public', 'player'].includes(move.visibility));
  if (techniques.length) visibleInfo.techniques = clone(techniques);
  else for (const key of ['observedTechniques', 'observedAbilities', '可观察招式']) {
    if (enemy.visibleInfo?.[key]) visibleInfo[key] = clone(enemy.visibleInfo[key]);
  }
  return { id: enemy.id, name: enemy.name, visibleInfo, ...(enemy.state?.schema ? { state: publicActorState(enemy.state) } : {}) };
}
