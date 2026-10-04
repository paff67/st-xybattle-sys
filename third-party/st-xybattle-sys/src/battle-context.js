import { clone } from './common.js';

const HIDDEN = new Set(['hidden', 'internal', 'gm', 'secret']);
const TECHNIQUE_KEYS = ['techniques', 'abilities', 'skills', 'spells', '术法', '功法', '招式'];

function text(value) {
  if (typeof value === 'string') return value.trim();
  if (value === undefined || value === null) return '';
  return String(value);
}

function asItems(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return Object.entries(value).map(([name, description]) => ({ name, description }));
  return [];
}

function publicTechnique(item, source, status = 'known') {
  if (typeof item === 'string') return { id: `enemy-${item}`, name: item, description: '已从公开上下文识别名称；具体效果尚未公开。', status, source, visibility: 'public' };
  if (!item || typeof item !== 'object') return null;
  const visibility = text(item.visibility || item.exposure || 'public').toLowerCase();
  if (HIDDEN.has(visibility)) return null;
  const name = text(item.name || item.label || item.title || item.id);
  if (!name) return null;
  return {
    id: text(item.id || `enemy-${name}`),
    name,
    description: text(item.description || item.originalDefinition || item.definition || item.summary || '已识别名称；完整效果尚未公开。'),
    mechanics: Array.isArray(item.mechanics) ? clone(item.mechanics) : [],
    status: text(item.status || status) || status,
    source,
    visibility: 'public',
    confidence: item.confidence ?? (status === 'known' ? 'high' : 'medium')
  };
}

/**
 * Build only the enemy technique petals that the player-facing scene is allowed to see.
 * It deliberately does not inspect enemy.hidden, resources, or internal registry data.
 */
export function extractEnemyTechniques(enemy = {}, state = {}) {
  const result = [];
  const seen = new Set();
  const add = (item, source, status) => {
    const technique = publicTechnique(item, source, status);
    if (!technique || seen.has(technique.id)) return;
    seen.add(technique.id);
    result.push(technique);
  };
  for (const key of TECHNIQUE_KEYS) {
    const value = enemy[key] ?? enemy.visibleInfo?.[key];
    const fromVisibleInfo = enemy.visibleInfo && Object.hasOwn(enemy.visibleInfo, key);
    for (const item of asItems(value)) {
      if (key === 'techniques' && !fromVisibleInfo && item && typeof item === 'object' && item.exposed !== true && !['public', 'player'].includes(text(item.visibility).toLowerCase())) continue;
      add(item, `敌方公开资料 · ${key}`, item?.status || (key === 'techniques' ? 'known' : 'inferred'));
    }
  }
  const observations = enemy.visibleInfo?.observedTechniques || enemy.visibleInfo?.observedAbilities || enemy.visibleInfo?.可观察招式;
  for (const item of asItems(observations)) add(item, '本轮公开观察', 'inferred');
  if (result.length) return result;
  const events = state.scene?.publicEvents || [];
  const enemyName = text(enemy.name);
  for (const event of events) {
    const line = text(event);
    if (!line || (enemyName && !line.includes(enemyName))) continue;
    const match = line.match(/(?:施展|使用|祭出|发动|招式|术式)[：:\s]*([^，。；,.;]+)/);
    if (match?.[1]) add({ id: `observed-${match[1].trim()}`, name: match[1].trim(), description: '从公开战报中观察到的名称，具体效果需由裁定器确认。' }, '公开战报', 'inferred');
  }
  if (!result.length) result.push({ id: `unknown-${enemy.id || 'enemy'}`, name: '招式未识别', description: '当前上下文没有公开的敌方招式定义。点击可查看信息边界；裁定器仍可依据隐藏上下文判断敌方行动。', status: 'unknown', source: '未发现公开来源', visibility: 'public', confidence: 'none' });
  return result;
}

export function classifyEffect(effect) {
  if (typeof effect === 'string') return { id: effect, label: effect, lane: 'field' };
  const side = effect?.side || effect?.target || (effect?.actorId === 'player' ? 'player' : effect?.actorId ? 'enemy' : 'field');
  const lane = ['player', 'self', 'ally'].includes(side) ? 'player' : ['enemy', 'opponent'].includes(side) ? 'enemy' : 'field';
  return { ...clone(effect), lane, label: text(effect?.label || effect?.id || '未命名效果') };
}

export function splitEffects(effects = []) {
  const buckets = { player: [], enemy: [], field: [] };
  for (const effect of effects) buckets[classifyEffect(effect).lane].push(classifyEffect(effect));
  return buckets;
}
