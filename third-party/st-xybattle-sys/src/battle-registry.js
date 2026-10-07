import { clone } from './common.js';
import sampleTechnique from '../sample-data/dielang-xuanchaojue.json' with { type: 'json' };
const arrays = ['mechanics','techniques','synergies','narrativeGuidance','ruleRefs'];
const visibility = new Set(['public','player','gm','internal']);
function text(value, field) { if (typeof value !== 'string' || !value.trim()) throw new Error(`${field} 必须是非空文字`); }
export function assertRegistryEntry(entry) {
  const required = ['id','name','rank','element','corePrinciple',...arrays,'version','visibility'];
  const missing = required.filter((key) => !(key in (entry || {}))); if (missing.length) throw new Error(`功法字段缺失：${missing.join(',')}`);
  for (const key of ['id','name','rank','element','corePrinciple','version']) text(entry[key], key);
  if (!visibility.has(entry.visibility)) throw new Error('visibility 无效');
  for (const key of arrays) if (!Array.isArray(entry[key])) throw new Error(`${key} 必须是数组`);
  const ids = new Set();
  for (const technique of entry.techniques) {
    for (const key of ['id','name','originalDefinition','mechanics','availability','triggeredState','visibility','ruleRefs']) if (!(key in technique)) throw new Error(`词条缺少 ${key}`);
    for (const key of ['id','name','originalDefinition']) text(technique[key], key);
    if (ids.has(technique.id)) throw new Error(`词条 id 重复：${technique.id}`); ids.add(technique.id);
    if (!Array.isArray(technique.mechanics) || !Array.isArray(technique.triggeredState) || !Array.isArray(technique.ruleRefs) || !technique.ruleRefs.length || !visibility.has(technique.visibility)) throw new Error(`词条 ${technique.id} 结构无效`);
    if (!['available','conditional','unavailable'].includes(technique.availability?.default) || !Array.isArray(technique.availability.conditions)) throw new Error(`词条 ${technique.id} 可用性定义无效`);
  }
  if (!entry.ruleRefs.length || entry.ruleRefs.some((ref) => typeof ref !== 'string' || !ref.trim())) throw new Error('ruleRefs 不得为空');
  return true;
}
function readPath(object, path) { return String(path).split('.').reduce((value, key) => value?.[key], object); }
export function matchesRequirement(state, requirement) {
  const value = readPath(state, requirement.path);
  if (requirement.op === 'includes') return Array.isArray(value) && value.includes(requirement.value);
  if (requirement.op === 'truthy') return Boolean(value);
  if (requirement.op === 'equals') return value === requirement.value;
  if (requirement.op === 'not') return value !== requirement.value;
  return false;
}
export class TechniqueRegistry {
  constructor(entries = [sampleTechnique]) { this.entries = new Map(); entries.forEach((entry) => this.register(entry)); }
  register(entry) { assertRegistryEntry(entry); if (this.entries.has(entry.id)) throw new Error(`功法已存在：${entry.id}`); this.entries.set(entry.id, clone(entry)); return this; }
  get(id) { return clone(this.entries.get(id)); }
  list() { return [...this.entries.values()].map(clone); }
  snapshot() { return this.list(); }
  technique(id, techniqueId) { return this.get(id)?.techniques.find((item) => item.id === techniqueId); }
  findTechnique(techniqueId) { for (const entry of this.list()) { const technique = entry.techniques.find((item) => item.id === techniqueId); if (technique) return { entry, technique }; } return undefined; }
  availability(entryId, techniqueId, semanticState = {}) {
    const technique = this.technique(entryId, techniqueId); if (!technique) return { available: false, state: 'unavailable', reason: '词条不存在', triggered: false };
    const requirements = technique.availability.requires || [];
    if ((this.get(entryId)?.combatSpec || this.get(entryId)?.narrativeCompiled) && technique.availability.default === 'conditional' && !requirements.length) return { available: true, state: 'conditional', reason: '可提交意图；实际条件由裁定检查', triggered: false };
    const available = technique.availability.default !== 'unavailable' && (requirements.length ? requirements.every((requirement) => matchesRequirement(semanticState, requirement)) : technique.availability.default === 'available');
    const triggered = (semanticState.statuses || []).some((status) => status === `${techniqueId}:triggered`) || (semanticState.effects || []).some((effect) => typeof effect === 'string' ? effect.startsWith(`${techniqueId}`) : effect.techniqueId === techniqueId);
    return { available, state: available ? 'available' : 'conditional', reason: technique.availability.conditions.join('；'), triggered };
  }
}
