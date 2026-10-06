import { clone } from './common.js';

export const COMBAT_PROFILE_SCHEMA = 'battle_combat_profile_v2';
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

export function normalizeCombatProfile(raw = {}, { id, side = 'enemy' } = {}) {
  const data = object(raw.candidate || raw.profile || raw.fields || raw);
  const visible = publicCharacterTraits(data.visibleInfo || data.可见情报 || {});
  const generated = object(data.generated);
  const resourceInput = data.resourceDefinitions || data.resourceModel || generated.battleResourceModel || data.resources || [];
  const definitions = Array.isArray(resourceInput) ? resourceInput : Object.entries(object(resourceInput)).map(([key, value]) => ({ key, ...(typeof value === 'number' ? { current: value } : object(value)) }));
  const resourceDefinitions = definitions.map(object).map((item, index) => ({
    key: text(item.key || item.resource || item.id) || `resource-${index + 1}`,
    name: text(item.name || item.label || item.名称 || item.key),
    current: first(item.current, item.value, data.resources?.[item.key]) ?? null,
    min: first(item.min, 0), max: first(item.max, item.maximum, item.capacity) ?? null,
    definition: text(item.definition || item.description), recovery: text(item.recovery || item.regeneration),
    visibility: visibility(item.visibility, side === 'player' ? 'player' : 'internal')
  }));
  const techniques = list(data.techniques || data.skills || data.招式).map(object).map((item) => ({
    name: text(item.name || item.名称), school: text(item.school || item.martialArt || item.所属功法),
    category: text(item.category || item.type), originalDefinition: text(item.originalDefinition || item.definition || item.description),
    mechanics: words(item.mechanics), cost: text(item.cost), range: text(item.range), cooldown: text(item.cooldown),
    counterplay: text(item.counterplay || item.interruptConditions || item.破解方式),
    availability: { default: ['available', 'conditional', 'unavailable'].includes(item.availability?.default) ? item.availability.default : 'available', conditions: words(item.availability?.conditions), requires: list(item.availability?.requires), description: text(item.availability?.description || item.requirements) },
    triggeredState: words(item.triggeredState), visibility: visibility(item.visibility, side === 'player' ? 'player' : 'internal')
  }));
  const behavior = typeof data.behavior === 'string' ? { preference: data.behavior } : object(data.behavior);
  return {
    profileSchema: COMBAT_PROFILE_SCHEMA, id: id || text(data.id), name: text(data.name || data.姓名),
    identity: text(data.identity || data.身份 || visible.identity),
    cultivationRealm: text(data.cultivationRealm || data.realm || data.境界 || visible.cultivationRealm),
    combatStyle: text(data.combatStyle || data.战斗方式), currentState: text(data.currentState || data.当前状态 || visible.currentState),
    visibleInfo: visible,
    martialArts: list(data.martialArts || data.功法).map(object).map((item) => ({ name: text(item.name || item.名称), rank: text(item.rank || item.品阶), description: text(item.description || item.originalDefinition || item.definition), principle: text(item.principle || item.corePrinciple) })),
    techniques, resourceDefinitions,
    resources: Object.fromEntries(resourceDefinitions.filter((item) => Number.isFinite(item.current)).map((item) => [item.key, item.current])),
    behavior: { preference: text(behavior.preference || behavior.preferredRange || behavior.style), opening: text(behavior.opening || behavior.openingMove), tactics: words(behavior.tactics || behavior.priorities), retreat: text(behavior.retreat || behavior.retreatConditions) },
    weaknesses: words(data.weaknesses || data.弱点), hidden: clone(object(data.hidden))
  };
}

const uncertain = /^(?:未知|不明|待定|待补充|未提供|待裁定|unknown|tbd|player|主角|演示主角)$/i;
const defined = (value) => !!text(value) && !uncertain.test(value);
export function combatProfileIssues(profile) {
  const issues = [];
  for (const [key, label] of Object.entries({ name: '姓名', identity: '身份', cultivationRealm: '修为境界', combatStyle: '战斗方式', currentState: '当前状态' })) {
    if (!defined(profile[key])) issues.push(`请补全${label}`);
  }
  if (!defined(profile.behavior?.preference) || !defined(profile.behavior?.opening) || !profile.behavior?.tactics?.length) issues.push('请补全战斗偏好、起手和战术');
  if (!profile.martialArts?.length) issues.push('至少需要一门有完整设定的功法');
  for (const method of profile.martialArts || []) if (!defined(method.name) || !defined(method.description) || !defined(method.principle)) issues.push(`${method.name || '功法'}缺少名称、完整设定或核心原理`);
  if (!profile.techniques?.length) issues.push('至少需要一项有完整设定的招式');
  for (const move of profile.techniques || []) {
    const missing = Object.entries({ name: '名称', school: '所属功法', originalDefinition: '完整定义', cost: '消耗', range: '范围', cooldown: '冷却', counterplay: '应对与打断方式' }).filter(([key]) => !defined(move[key])).map(([, label]) => label);
    if (!move.mechanics?.length) missing.push('作用机制');
    if (!defined(move.availability?.description)) missing.push('使用条件');
    if (missing.length) issues.push(`${move.name || '招式'}缺少${missing.join('、')}`);
    if (move.availability?.default === 'conditional' && !move.availability.requires?.length) issues.push(`${move.name || '招式'}缺少可检查的解锁条件；普通消耗限制请写在使用条件中并设为可用`);
    if (move.availability?.requires?.some((requirement) => !defined(requirement?.path) || !['includes', 'truthy', 'equals', 'not'].includes(requirement?.op))) issues.push(`${move.name || '招式'}的解锁条件无效`);
    if (!(profile.martialArts || []).some((method) => method.name === move.school)) issues.push(`${move.name || '招式'}的所属功法未定义`);
  }
  if (!profile.resourceDefinitions?.length) issues.push('请定义至少一种战斗资源及其边界');
  const keys = new Set();
  for (const resource of profile.resourceDefinitions || []) {
    if (!defined(resource.name) || !defined(resource.definition) || !Number.isFinite(resource.current) || !Number.isFinite(resource.min) || !Number.isFinite(resource.max) || resource.current < resource.min || resource.current > resource.max || resource.min > resource.max || keys.has(resource.key)) issues.push(`${resource.name || '资源'}的名称、定义、当前值或边界无效`);
    keys.add(resource.key);
  }
  if (!profile.weaknesses?.length) issues.push('请补全战斗弱点与限制');
  return [...new Set(issues)];
}

/** Compile confirmed definitions into the same registry/rule surface as adjudication. */
export function compileCombatProfile(input, side) {
  const profile = normalizeCombatProfile(input, { id: input.id, side });
  const issues = combatProfileIssues(profile);
  if (issues.length) throw new Error(`${profile.name || '人物'}资料不完整：${issues.join('；')}`);
  const prefix = `combat-profile.${encodeURIComponent(profile.id)}`;
  const techniques = profile.techniques.map((move, index) => ({ ...move, id: `${prefix}.move-${index + 1}`, ruleRefs: [`${prefix}.move-${index + 1}.definition`] }));
  const entry = {
    id: prefix, name: `${profile.name}·战斗功法`, rank: profile.cultivationRealm, element: '人物已确认设定',
    corePrinciple: profile.martialArts.map((method) => `${method.name}：${method.description}；${method.principle}`).join('\n'),
    mechanics: [profile.combatStyle], techniques, synergies: [], narrativeGuidance: [], ruleRefs: [`${prefix}.profile`],
    version: '1', visibility: side === 'player' ? 'player' : 'internal', characterProfileId: profile.id
  };
  const resourceRules = profile.resourceDefinitions.map((resource) => ({ actorId: profile.id, resource: resource.key, min: resource.min, max: resource.max, name: resource.name, definition: resource.definition, recovery: resource.recovery, visibility: resource.visibility, ruleRefs: [`${prefix}.resource.${encodeURIComponent(resource.key)}`] }));
  const actor = { ...profile, techniques: side === 'player' ? [{ registryId: prefix, techniqueIds: techniques.map((move) => move.id) }] : techniques };
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
  return { id: enemy.id, name: enemy.name, visibleInfo };
}
