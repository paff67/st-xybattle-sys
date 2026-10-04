import sampleTechnique from '../sample-data/dielang-xuanchaojue.json' with { type: 'json' };

export function assertRegistryEntry(entry) {
  const required = ['id','name','rank','element','corePrinciple','mechanics','techniques','synergies','narrativeGuidance','version','visibility','ruleRefs'];
  const missing = required.filter((key) => !(key in (entry || {})));
  if (missing.length) throw new Error(`功法字段缺失：${missing.join(',')}`);
  if (!Array.isArray(entry.techniques)) throw new Error('techniques 必须是数组');
  for (const technique of entry.techniques) {
    const tm = ['id','name','originalDefinition','mechanics','availability','triggeredState','visibility','ruleRefs'].filter((key) => !(key in technique));
    if (tm.length) throw new Error(`词条 ${technique.name || technique.id} 缺少：${tm.join(',')}`);
  }
  return true;
}

export class TechniqueRegistry {
  constructor(entries = [sampleTechnique]) {
    this.entries = new Map();
    entries.forEach((entry) => this.register(entry));
  }
  register(entry) {
    assertRegistryEntry(entry);
    if (this.entries.has(entry.id)) throw new Error(`功法已存在：${entry.id}`);
    this.entries.set(entry.id, typeof structuredClone === 'function' ? structuredClone(entry) : JSON.parse(JSON.stringify(entry)));
    return this;
  }
  get(id) { const entry = this.entries.get(id); return entry ? JSON.parse(JSON.stringify(entry)) : undefined; }
  list() { return [...this.entries.values()].map((entry) => JSON.parse(JSON.stringify(entry))); }
  snapshot() { return this.list(); }
  technique(id, techniqueId) { return this.get(id)?.techniques.find((item) => item.id === techniqueId); }
  availability(entryId, techniqueId, semanticState = {}) {
    const technique = this.technique(entryId, techniqueId); if (!technique) return { available: false, reason: 'unknown-technique' };
    const conditions = technique.availability?.conditions || [];
    const text = JSON.stringify(semanticState);
    const available = technique.availability?.default === 'available' || conditions.some((condition) => text.includes(condition.split('已')[0]));
    return { available, state: available ? 'available' : 'conditional', reason: conditions.join('；'), triggered: (semanticState.statuses || []).some((status) => String(status).startsWith(`${techniqueId}:`)) || (semanticState.effects || []).some((effect) => String(effect).startsWith(`${techniqueId}`)) };
  }
}

