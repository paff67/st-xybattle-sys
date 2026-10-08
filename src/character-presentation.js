import { publicCharacterTraits } from './combat-profile.js';
// Presentation only: never rewrite AI/source fields to translate their labels.
const names = {
  profile: '能力档案', state: '当前状态', resourceTraits: '资源性质', initialCombatObjects: '当前已形成的术式',
  burden: '当前负担', basis: '状态依据', depletionConsequences: '不足的后果', recoveryConditions: '恢复条件',
  sustaining: '持续维持负担', onUse: '施展负担', amplifiers: '负担加重因素', overuseConsequences: '过度使用后果', limits: '限制',
  label: '名称', statuses: '持续状态', positionOrTarget: '位置或目标', technique: '来源招式', dependsOn: '依赖对象', kind: '对象类型',
  learnedTechniqueRefs: '已修功法绑定', proficiency: '修炼程度', evidence: '掌握依据',
  id: '内部编号', name: '名称', identity: '身份', cultivationRealm: '修为境界', cultivation: '修为', realm: '境界',
  currentState: '当前状态', combatStyle: '战斗方式', weapon: '武器', weapons: '武器', stance: '姿态', position: '站位',
  visibleInfo: '可见情报', resources: '灵力与资源', techniques: '功法与招式', abilities: '能力', skills: '技能',
  behavior: '行动倾向', weaknesses: '弱点', observed: '已观察情报', generated: '构造补充', hidden: '裁定专用资料',
  originalDefinition: '完整定义', mechanics: '作用机制', cost: '施术消耗', costs: '施术消耗', availability: '使用条件',
  visibility: '可见范围', ruleRefs: '规则依据', category: '类型', effects: '效果', effect: '效果',
  notes: '备注', description: '说明', type: '类型', value: '数值', status: '状态', default: '默认状态', conditions: '条件',
  condition: '条件', trigger: '触发条件', triggers: '触发条件', duration: '持续时间', cooldown: '冷却', cooldowns: '冷却限制',
  remainingRounds: '剩余回合', rounds: '回合数', range: '作用范围', target: '目标', targets: '目标', limitation: '限制',
  limitations: '限制', counters: '应对方式', risks: '风险', risk: '风险', confidence: '可信程度', evidence: '依据', source: '来源',
  health: '生命', hp: '生命', qi: '真气', mana: '灵力', stamina: '体力', spiritualPower: '灵力', current: '当前值',
  max: '上限', min: '下限', capacity: '容量', amount: '数量', unit: '单位', recovery: '恢复方式', regeneration: '恢复',
  reservePlan: '后备计划', intent: '意图', intentSummary: '意图概述', tactics: '战术', strategy: '策略', personality: '性格',
  opening: '起手', openingMove: '起手招式', priorities: '行动优先顺序', preferredRange: '偏好距离', retreatCondition: '撤退条件',
  retreatConditions: '撤退条件', surrenderConditions: '投降条件', goals: '目标', motivation: '动机',
  confirmationStatus: '资料确认状态', battleStateEffect: '对战局的影响', missingFields: '待补充资料', uncertainties: '待核实事项',
  assumptions: '构造假设', equipment: '装备', artifacts: '法宝', level: '层级', rank: '品阶', title: '称谓', faction: '所属势力',
  appearance: '外貌', background: '背景', injuries: '伤势', buffs: '增益', debuffs: '负面状态', resistances: '抗性',
  damage: '伤害', defense: '防御', attack: '攻击', speed: '速度', accuracy: '命中', power: '威力', strength: '强度',
  requirements: '施展要求', prerequisites: '前置条件', interruptConditions: '打断条件', interruption: '打断方式',
  public: '公开', private: '不公开', secret: '隐秘', enabled: '启用', reason: '原因', summary: '概述',
  martialArts: '功法', school: '所属功法', principle: '核心原理', definition: '规则定义',
  resourceDefinitions: '战斗资源', preference: '战斗偏好', retreat: '撤退条件', counterplay: '应对与打断',
  triggeredState: '触发效果', environmentalEffect: '环境影响', aura: '气息'
};
const normalizedNames = Object.fromEntries(Object.entries(names).map(([key, value]) => [key.replace(/[_\-\s]/g, '').toLowerCase(), value]));
const normalize = (key) => String(key).replace(/[_\-\s]/g, '').toLowerCase();

export function characterFieldLabel(key, index = 0) {
  if (/^\d+$/.test(String(key))) return `第 ${Number(key) + 1} 项`;
  return normalizedNames[normalize(key)] || (/\p{Script=Han}/u.test(key) ? key : `补充资料 ${index + 1}`);
}

export function characterPathLabel(path) {
  return String(path).split('.').map((part, index) => characterFieldLabel(part, index)).join(' · ');
}

const enumNames = {
  visibility: { public: '公开可见', player: '主角可见', gm: '仅供裁定', private: '仅供裁定', hidden: '隐藏', internal: '仅供裁定', secret: '隐藏' },
  status: { available: '可用', unavailable: '不可用', locked: '未解锁', pending: '待确认', confirmed: '已确认', active: '生效中', inactive: '未生效' },
  default: { available: '可用', conditional: '满足条件后可用', unavailable: '不可用', locked: '未解锁' },
  confirmationstatus: { pending: '待确认', confirmed: '已确认', awaiting_confirmation: '待确认' },
  stance: { guard: '守势', defensive: '守势', offensive: '攻势', neutral: '中立' }
};

export function characterValueLabel(value, key = '') {
  if (value === null || value === undefined || value === '') return '未提供';
  if (typeof value === 'boolean') return value ? '是' : '否';
  if (Array.isArray(value)) return value.length ? value.map((item) => characterValueLabel(item, key)).join('；') : '暂无条目';
  if (typeof value === 'object') return Object.entries(value).map(([name, item], index) => `${characterFieldLabel(name, index)}：${characterValueLabel(item, name)}`).join('\n') || '暂无资料';
  return enumNames[normalize(key)]?.[value] || String(value);
}

const definitions = [
  { id: 'identity', label: '身份与当前状态', keys: ['id', 'name', 'identity', 'cultivationRealm', 'cultivation', 'realm', 'currentState', 'combatStyle', 'weapon', 'weapons', 'stance', 'position', '身份', '境界', '修为', '当前状态', '武器', '姿态', '站位'] },
  { id: 'visible', label: '可见情报与行动倾向', keys: ['visibleInfo', 'observed', 'behavior', '公开表现', '可观察招式', '可能特征'] },
  { id: 'techniques', label: '功法、招式与能力', keys: ['learnedTechniqueRefs', 'martialArts', 'techniques', 'skills', 'abilities', '功法', '招式', '技能', '能力'] },
  { id: 'resources', label: '资源、状态与弱点', keys: ['state', 'resourceTraits', 'initialCombatObjects', 'resourceDefinitions', 'resources', 'weaknesses', 'equipment', 'artifacts', '资源', '弱点', '装备', '法宝'] },
  { id: 'hidden', label: '构造补充与裁定专用资料', keys: ['hidden', 'generated', '隐藏信息'] },
  { id: 'other', label: '补充资料', keys: [] }
];

const internalKeys = new Set(['id', 'key', 'profileschema', 'rulerefs', 'registryid', 'techniqueids', 'sourcescope', 'sourcekind', 'branchknown', 'confirmationstatus', 'battlestateeffect', 'provenance', 'sources', 'confirmation', 'priority', 'generated', 'observed', 'version']);

export function characterTree(fields, provenance = {}, original = fields) {
  const rows = characterSections(fields, provenance, original).flatMap((section) => section.rows);
  function node(value, keys, index = 0) {
    const key = keys.at(-1);
    if (internalKeys.has(normalize(key))) return null;
    if (!/^\d+$/.test(key) && !normalizedNames[normalize(key)] && !/\p{Script=Han}/u.test(key)) return null;
    const path = keys.join('.');
    const boundNames = new Set((fields.learnedTechniqueRefs || []).map((ref) => ref.name));
    const locked = keys[0] === 'techniques' && boundNames.has(fields.techniques?.[Number(keys[1])]?.school) || keys[0] === 'martialArts' && boundNames.has(fields.martialArts?.[Number(keys[1])]?.name);
    const label = /^\d+$/.test(key) && value && typeof value === 'object' ? textName(value) || characterFieldLabel(key) : characterFieldLabel(key, index);
    if (value && typeof value === 'object') {
      const children = Object.entries(value).map(([childKey, child], childIndex) => node(child, [...keys, childKey], childIndex)).filter(Boolean);
      return { path, keys, label, children, group: true, canAdd: !locked && Array.isArray(value) && ['martialArts', 'techniques', 'resourceDefinitions', 'weaknesses', 'tactics', 'mechanics', 'triggeredState', 'conditions'].includes(key) };
    }
    return { ...rows.find((row) => row.path === path), path, keys, label, value, display: characterValueLabel(value, key), ...(locked ? { editable: false } : {}), ...(key === 'default' ? { options: { available: '可用', conditional: '满足条件后可用', unavailable: '不可用' } } : {}) };
  }
  return definitions.filter((section) => !['other', 'hidden'].includes(section.id)).map((section) => ({
    ...section,
    children: Object.entries(fields || {}).filter(([key]) => section.keys.some((known) => normalize(known) === normalize(key)) && !(key === 'resources' && fields.resourceDefinitions?.length)).map(([key, value], index) => node(value, [key], index)).filter(Boolean)
  })).filter((section) => section.children.length);
}

function textName(value) { return typeof value.name === 'string' ? value.name : typeof value.名称 === 'string' ? value.名称 : ''; }

export function actorTraitLabels(actor) {
  return Object.fromEntries(Object.entries(publicCharacterTraits(actor.visibleInfo)).map(([key, value]) => [characterFieldLabel(key), characterValueLabel(value, key)]));
}

export function actorResourceLabels(actor) {
  if (actor.state?.schema) return Object.fromEntries((actor.state.resources || []).filter(item => ['public', 'player'].includes(item.visibility)).map(item => [item.name, [item.condition, item.burden, ...item.limitations].filter(Boolean).join('；')]));
  return Object.fromEntries(Object.entries(actor.resources || {}).filter(([, value]) => Number.isFinite(value)).map(([key, value]) => [actor.resourceDefinitions?.find((item) => item.key === key)?.name || normalizedNames[normalize(key)] || '战斗资源', value]));
}

export function characterSections(fields, provenance = {}, original = fields) {
  const sections = definitions.map((section) => ({ ...section, rows: [] }));
  function visit(value, keys, context, section, index = 0) {
    const key = keys.at(-1);
    const label = characterFieldLabel(key, index);
    const path = keys.join('.');
    if (value && typeof value === 'object' && Object.keys(value).length) {
      const namedGroup = typeof value.name === 'string' ? value.name : typeof value.名称 === 'string' ? value.名称 : '';
      const group = Array.isArray(value) ? label : namedGroup || label;
      for (const [childIndex, [childKey, child]] of Object.entries(value).entries()) {
        visit(child, [...keys, childKey], [...context, group], section, childIndex);
      }
      return;
    }
    let sourceKeys = [...keys];
    let source;
    while (sourceKeys.length && !source) {
      source = provenance[sourceKeys.join('.')]?.source;
      sourceKeys.pop();
    }
    const prior = keys.reduce((parent, part) => parent?.[part], original);
    section.rows.push({
      path, keys, label: keys.length === 1 && key === 'name' ? '姓名' : label,
      context: context.join(' · '), value, display: characterValueLabel(value, key),
      source: JSON.stringify(prior) !== JSON.stringify(value) ? 'user_edited' : source || 'unknown',
      editable: (value === null || ['string', 'number', 'boolean'].includes(typeof value)) && !['id', 'ruleRefs', 'visibility', 'confirmationStatus', 'battleStateEffect'].some((part) => keys.includes(part))
    });
  }
  for (const [index, [key, value]] of Object.entries(fields || {}).entries()) {
    const section = sections.find((item) => item.keys.some((known) => normalize(known) === normalize(key))) || sections.at(-1);
    visit(value, [key], [], section, index);
  }
  return sections.filter((section) => section.rows.length);
}

export function editCharacterField(fields, keys, input) {
  const result = structuredClone(fields);
  const key = keys.at(-1);
  const parent = keys.slice(0, -1).reduce((value, part) => value[part], result);
  const previous = parent[key];
  if (typeof previous === 'number' || previous === null && ['current', 'min', 'max'].includes(key)) {
    if (String(input).trim() === '' || !Number.isFinite(Number(input))) throw new Error('请填写有效数字');
    parent[key] = Number(input);
  } else if (typeof previous === 'boolean') parent[key] = input === true || input === 'true';
  else parent[key] = String(input);
  return result;
}
