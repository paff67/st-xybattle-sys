import pack from '../content/authoritative-six-arts/six-arts.content.json' with { type: 'json' };
import interactions from '../content/authoritative-six-arts/system-interactions.json' with { type: 'json' };
import cases from '../content/authoritative-six-arts/negative-cases.json' with { type: 'json' };
import { clone, stableStringify } from './common.js';
import { worldbookEntries, isWorldbookAbility, assertWorldbookAbility, abilityIndex } from './worldbook-abilities.js';
import { assertCoreRules } from './core-rules.js';

export const authoritativeEntries = () => clone(pack.items.map((item) => item.entry));
export const isAuthority = (entry) => entry?.authority?.kind === 'user-designated-source' && (!!entry.combatSpec?.rules || isWorldbookAbility(entry));
export function assertAuthorityDefinition(entry) {
  if (isWorldbookAbility(entry)) return assertWorldbookAbility(entry);
  const source = pack.items.find((item) => item.id === entry.id)?.entry;
  if (!source) return;
  for (const key of ['version', 'corePrinciple', 'mechanics', 'techniques', 'synergies', 'combatSpec', 'authority']) {
    if (stableStringify(entry[key]) !== stableStringify(source[key])) throw new Error(`${entry.name}的权威定义与来源版本不一致；请作为独立修订导入，不能沿用权威身份`);
  }
}
// Explicit new preparation only. Never upgrade an already running battle.
export function preparationRegistry(entries = []) {
  const installed = worldbookEntries();
  return [...clone(entries).filter((entry) => !installed.some((item) => item.id === entry.id)), ...installed];
}

/** Resolve only explicit learned references or exact named moves, never a whole school by inference. */
export function bindLearnedRules(profile, registry = []) {
  const entries = registry.filter(isAuthority);
  entries.forEach(assertAuthorityDefinition);
  const refs = clone(profile.learnedTechniqueRefs || []);
  for (const move of profile.techniques || []) {
    const entry = entries.find((item) => item.name === move.school);
    if (!entry) continue;
    const technique = entry.techniques.find((item) => item.name === move.name);
    if (!technique) throw new Error(`${entry.name}没有权威招式“${move.name}”，请核对已掌握招式`);
    let ref = refs.find((item) => item.registryId === entry.id);
    if (!ref) { ref = { registryId: entry.id, techniqueIds: [], proficiency: '', evidence: '候选档案明确列出的招式，待用户确认' }; refs.push(ref); }
    if (!ref.techniqueIds.includes(technique.id)) ref.techniqueIds.push(technique.id);
  }
  const canonicalMoves = [], methods = [], seen = new Set();
  for (const ref of refs) {
    const entry = registry.find((item) => item.id === ref.registryId);
    if (!entry || seen.has(ref.registryId)) throw new Error('已修功法引用不存在或重复');
    seen.add(ref.registryId);
    if (ref.version && ref.version !== entry.version || ref.contentSha256 && ref.contentSha256 !== entry.authority?.contentSha256) throw new Error('功法绑定版本不匹配，请重新核对');
    if (!Array.isArray(ref.techniqueIds) || !ref.techniqueIds.length || new Set(ref.techniqueIds).size !== ref.techniqueIds.length) throw new Error('已修招式引用不能为空或重复');
    ref.version = entry.version; ref.contentSha256 = entry.authority?.contentSha256 || '';
    ref.name = entry.name;
    for (const id of ref.techniqueIds) {
      const move = entry.techniques.find((item) => item.id === id);
      if (!move) throw new Error('已修招式不属于指定权威功法');
      canonicalMoves.push({ ...clone(move), school: entry.name, authoritativeRef: id,
        cost: move.cost || '按原文与本轮控制负担裁定；未规定固定数值', range: move.range || '按原文、修为和本轮对象联系裁定',
        cooldown: move.cooldown || '原文未规定固定回合冷却', counterplay: move.counterplay || entry.combatSpec?.limitations?.text || '按功法原文限制与实际交锋裁定',
        availability: isAuthority(entry) ? { ...clone(move.availability), description: '可提交施展意图，成立条件仍由裁定检查', default: 'available' } : { ...clone(move.availability), description: move.availability?.description || move.availability?.conditions?.join('；') || '按功法原文条件裁定' } });
    }
    methods.push({ name: entry.name, rank: entry.rank, description: entry.abilitySource?.content || entry.mechanics.join('\n'), principle: entry.corePrinciple });
  }
  return { ...profile, learnedTechniqueRefs: refs,
    martialArts: [...(profile.martialArts || []).filter((method) => !methods.some((item) => item.name === method.name)), ...methods],
    techniques: [...(profile.techniques || []).filter((move) => !entries.some((entry) => entry.name === move.school) && !methods.some((method) => method.name === move.school)), ...canonicalMoves] };
}

export function assertBindings(state) {
  assertCoreRules(state.coreRules);
  state.registrySnapshot.filter(isWorldbookAbility).forEach(assertWorldbookAbility);
  const player = state.actors.player;
  for (const ref of player.learnedTechniqueRefs || []) {
    const entry = state.registrySnapshot.find((item) => item.id === ref.registryId);
    if (!entry || entry.version !== ref.version || (entry.authority?.contentSha256 || '') !== ref.contentSha256) throw new Error('主角权威功法绑定失效，需重新确认人物');
    if (isAuthority(entry)) assertAuthorityDefinition(entry);
    const owned = player.techniques.find((group) => group.registryId === entry.id);
    if (!owned || owned.techniqueIds.length !== ref.techniqueIds.length || ref.techniqueIds.some((id) => !owned.techniqueIds.includes(id) || !entry.techniques.some((move) => move.id === id))) throw new Error('主角招式所有权与权威绑定不一致');
  }
}

export function createRuleMemory(registry) {
  const versions = interactions.templateRefs.filter((ref) => registry.some((entry) => entry.id === ref.id && entry.version === ref.version && entry.authority?.sourceFileSha256 === interactions.sourceFileSha256));
  const ids = new Set(versions.map((ref) => ref.id));
  const edges = interactions.edges.filter((edge) => ids.has(edge.from) && ids.has(edge.to));
  const rules = new Set(registry.flatMap((entry) => [...entry.ruleRefs, ...entry.techniques.flatMap((move) => move.ruleRefs), ...(entry.combatSpec?.rules || []).map((rule) => rule.id)]));
  return { schema: 'battle_rule_memory_v1', versions: clone(versions), interactions: clone(edges),
    negativeCases: clone(cases.items.filter((item) => item.sourceRefs.every((ref) => rules.has(ref)) && (!item.interactionId || edges.some((edge) => edge.id === item.interactionId)))) };
}

export function knownRules(state) {
  return new Set([...state.registrySnapshot.flatMap((entry) => [...entry.ruleRefs, ...entry.techniques.flatMap((move) => move.ruleRefs), ...(entry.combatSpec?.rules || []).map((rule) => rule.id)]),
    ...(state.coreRules || []).map(rule => rule.id), ...(state.ruleMemory?.interactions || []).map((edge) => edge.id), ...(state.resourceRules || []).flatMap((rule) => rule.ruleRefs || [])]);
}

/** Send every source mechanism once, keeping rule IDs addressable. */
export function projectRuleContext(registry = []) {
  return registry.map((entry) => {
    if (isWorldbookAbility(entry)) return abilityIndex(entry);
    if (!isAuthority(entry)) return clone(entry);
    const rules = entry.combatSpec.rules.map((rule) => ['主要攻击形式', '主要术式'].includes(rule.heading)
      ? { id: rule.id, heading: rule.heading, children: entry.techniques.flatMap((move) => move.ruleRefs) } : rule);
    return { id: entry.id, name: entry.name, version: entry.version, contentSha256: entry.authority.contentSha256,
      rank: entry.rank, role: entry.combatSpec.role, rules,
      techniques: entry.techniques.map((move) => ({ id: move.id, name: move.name, ruleRefs: move.ruleRefs })),
      disambiguation: entry.combatSpec.glossary.filter((term) => term.authority === 'source-grounded-disambiguation'),
      numericPolicy: entry.combatSpec.numericPolicy };
  });
}

export function selectNegativeCases(state, action, { maxCases = 4, maxChars = 2600 } = {}) {
  const text = `${action.label || ''} ${action.intent || ''}`;
  const selected = new Set([action.techniqueId, ...(action.actions || []).map((part) => part.techniqueId)].filter(Boolean));
  const owned = new Set((state.actors.player.techniques || []).flatMap((group) => group.techniqueIds || []));
  // Only player action text / owned move names are used. Enemy secrets never trigger examples.
  for (const entry of state.registrySnapshot) for (const move of entry.techniques) if (owned.has(move.id) && text.includes(move.name)) selected.add(move.id);
  const mentioned = new Set(selected);
  for (const item of state.ruleMemory?.negativeCases || []) if (item.keywords.some((word) => text.includes(word))) {
    item.techniqueIds.filter((id) => owned.has(id)).forEach((id) => mentioned.add(id));
  }
  const schools = new Set(state.registrySnapshot.filter((entry) => entry.techniques.some((move) => mentioned.has(move.id)) || text.includes(entry.name) && (state.actors.player.techniques || []).some((group) => group.registryId === entry.id)).map((entry) => entry.id));
  const pool = (state.ruleMemory?.negativeCases || []).map((item) => {
    const exact = item.techniqueIds.some((id) => selected.has(id));
    const linked = item.interactionId && item.registryIds.every((id) => schools.has(id));
    const keyword = item.keywords.some((word) => text.includes(word));
    const inScope = item.registryIds.every((id) => (state.actors.player.techniques || []).some((group) => group.registryId === id));
    return { item, score: exact ? 100 : linked ? 90 : keyword && inScope ? 20 : 0 };
  }).filter((hit) => hit.score).sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id));
  const result = []; let length = 0;
  for (const { item } of pool) {
    const size = JSON.stringify(item).length;
    if (result.length >= maxCases) break;
    if (length + size > maxChars) continue;
    result.push(clone(item)); length += size;
  }
  return result;
}
