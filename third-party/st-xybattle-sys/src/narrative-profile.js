import { clone } from './common.js';
import { TechniqueRegistry } from './battle-registry.js';

const record = value => value && typeof value === 'object' && !Array.isArray(value);
const entries = value => Array.isArray(value) ? value.map((item, index) => [item?.名称 || item?.name || String(index), item]) : Object.entries(record(value) ? value : {});
const words = value => typeof value === 'string' ? value.trim() : value == null ? '' : JSON.stringify(value);
const pick = (object, ...keys) => keys.map(key => object?.[key]).find(value => value !== undefined && value !== null && value !== '');
const definition = value => words(pick(value, '完整设定', '完整定义', '定义', '原文', '描述', 'description', 'originalDefinition', 'definition'));
const encode = value => encodeURIComponent(value);
const learned = value => value === true || ['已习得', '已掌握', '熟练', '精通', '圆满', 'learned'].includes(value);

export function withoutLegacyDc(value) {
  if (Array.isArray(value)) return value.map(withoutLegacyDc);
  if (!record(value)) return value;
  return Object.fromEntries(Object.entries(value).filter(([key]) => !/^(?:dc(?:点数|差值|阈值|判定|加值)?|战斗力dc|骰点|判定骰|哈希骰|三才判定)$/i.test(key)).map(([key, item]) => [key, withoutLegacyDc(item)]));
}

// Compile user-maintained definitions; never install a same-named built-in rule
// pack or demand registry/version/authority fields in the narrative schema.
export function normalizeNarrativeProfile(raw, { id, side = 'player', ruleSource = 'current', builtinRegistry = [] } = {}) {
  const missing = [], registry = [], resourceRules = [];
  if (!record(raw) || !id) return { status: 'needs_context', missing: ['actor_object_or_id'] };
  raw = withoutLegacyDc(raw);
  const name = words(pick(raw, '姓名', '名称', 'name'));
  const realm = words(pick(raw, '境界', '修为境界', 'cultivationRealm', 'realm'));
  if (!name) missing.push('姓名');
  if (!realm) missing.push('境界');
  const owned = [], enemyMoves = [];
  for (const [methodName, data] of entries(pick(raw, '功法', 'martialArts', 'methods'))) {
    if (!record(data)) { missing.push(`${methodName}.完整定义`); continue; }
    const name = words(pick(data, '名称', 'name')) || methodName;
    const mastery = pick(data, '掌握状态', '学习状态', '习得', 'learned');
    // Negative/absent mastery must not grant an entire method by implication.
    if (!learned(mastery)) continue;
    const prefix = `narrative.${encode(id)}.${encode(name)}`;
    let source = data;
    if (ruleSource === 'builtin') {
      const found = builtinRegistry.filter(entry => entry.name === name);
      if (found.length !== 1) { missing.push(`${name}.内置来源不唯一`); continue; }
      source = { ...found[0], 定义: found[0].corePrinciple, 招式: found[0].techniques };
    }
    const body = definition(source);
    if (!body) missing.push(`${name}.完整定义`);
    const moves = entries(pick(source, '招式', 'techniques', 'moves')).map(([moveKey, move]) => {
      const moveName = words(pick(move, '名称', 'name')) || moveKey;
      const body = definition(move);
      if (!record(move) || !body) missing.push(`${name}.${moveName}.完整定义`);
      const moveId = `${prefix}.${encode(moveName)}`;
      const conditions = words(pick(move, '条件', '使用条件', 'requirements', 'availability'));
      return { id: moveId, name: moveName, school: name, originalDefinition: body,
        mechanics: Array.isArray(move?.机制) ? clone(move.机制) : [body].filter(Boolean), cost: words(pick(move, '限制与代价', '代价', '消耗', 'cost')),
        cooldown: words(pick(move, '冷却', 'cooldown')), range: words(pick(move, '范围', 'range')),
        counterplay: words(pick(move, '应对与打断', '对抗', '限制', '破解方式', 'counterplay')),
        availability: { default: conditions ? 'conditional' : 'available', conditions: conditions ? [conditions] : [], requires: [] },
        triggeredState: [], visibility: side === 'player' ? 'player' : 'internal', ruleRefs: [`${moveId}.definition`],
        narrativeDefinition: clone(move) };
    });
    if (!moves.length) missing.push(`${name}.招式定义`);
    const entry = { id: prefix, name, rank: words(pick(source, '品阶', 'rank')) || '未标注', element: '用户当前定义',
      corePrinciple: body || '定义缺失', mechanics: [body].filter(Boolean), techniques: moves, synergies: [], narrativeGuidance: [],
      ruleRefs: [`${prefix}.definition`], version: 'narrative-snapshot-v1', visibility: side === 'player' ? 'player' : 'internal',
      narrativeDefinition: clone(source), narrativeCompiled: true };
    registry.push(entry); owned.push({ registryId: entry.id, techniqueIds: moves.map(move => move.id) }); enemyMoves.push(...moves);
  }
  if (!registry.length) missing.push('已习得且有定义的功法');
  const resources = {}, resourceDefinitions = [];
  for (const [key, data] of entries(pick(raw, '资源', 'resourceDefinitions', 'resources'))) {
    const resource = words(pick(data, 'key', '资源名')) || key;
    const current = pick(data, '当前', '当前值', 'current', 'value');
    const min = pick(data, '下限', 'min'), max = pick(data, '上限', '最大值', 'max');
    const body = definition(data);
    if (![current, min, max].every(Number.isFinite) || min > max || current < min || current > max || !body) { missing.push(`资源.${resource}.定义与边界`); continue; }
    const ref = `narrative.${encode(id)}.resource.${encode(resource)}`;
    resources[resource] = current;
    resourceDefinitions.push({ key: resource, name: words(pick(data, '名称', 'name')) || resource, current, min, max, definition: body });
    resourceRules.push({ actorId: id, resource, min, max, definition: body, ruleRefs: [ref] });
  }
  const actor = { id, name, cultivationRealm: realm, resources, resourceDefinitions,
    techniques: side === 'player' ? owned : enemyMoves, narrativeProfile: clone(raw),
    visibleInfo: { cultivationRealm: realm, currentState: words(pick(raw, '当前状态', 'currentState')) },
    hidden: clone(raw.hidden || raw.隐藏信息 || {}) };
  if (!missing.length) new TechniqueRegistry(registry);
  return { status: missing.length ? 'needs_context' : 'ready', missing, actor, registry, resourceRules };
}

export function narrativeActors(root) {
  const result = [];
  const player = root?.主角 || root?.player || root?.protagonist;
  if (record(player)) result.push({ side: 'player', path: root.主角 ? '/主角' : root.player ? '/player' : '/protagonist', data: player });
  for (const key of ['角色', '人物', '男性角色', '女性角色', '男性角色档案', '女性角色档案', '男性档案', '女性档案', 'characters', 'actors', 'enemies', '敌方']) {
    for (const [name, data] of entries(root?.[key])) if (record(data)) result.push({ side: 'candidate', path: `/${key}/${name.replace(/~/g, '~0').replace(/\//g, '~1')}`, data: { ...data, 姓名: data.姓名 || data.name || name } });
  }
  return result;
}
