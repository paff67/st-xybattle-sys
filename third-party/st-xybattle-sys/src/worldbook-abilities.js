import pack from '../content/worldbook-abilities/abilities.content.json' with { type: 'json' };
import { clone } from './common.js';
import { sourceDigest } from './source-digest.js';

export const worldbookEntries = () => clone(pack.items.map(item => item.entry));
export const isWorldbookAbility = entry => entry?.authority?.format === 'worldbook-original-v1';

// Verify the frozen source, not the currently installed catalogue. Old battles
// continue to use their confirmed version after an extension/catalogue update.
export function assertWorldbookAbility(entry) {
  const source = entry.abilitySource;
  if (!source?.content || sourceDigest(source.content) !== source.contentSha256 || source.contentSha256 !== entry.authority?.contentSha256 ||
      source.id !== `worldbook.${source.uid}.${source.contentSha256}` || !entry.ruleRefs.includes(source.id)) throw new Error(`${entry.name}的权威原文缺失或校验失败，请重新准备人物`);
  const sections = new Map((source.sections || []).map(section => [section.id, section]));
  if (sections.size !== source.sections?.length) throw new Error('原文规则索引重复');
  for (const section of sections.values()) {
    if (!Number.isInteger(section.start) || !Number.isInteger(section.end) || section.start < 0 || section.end > source.content.length || section.end <= section.start ||
        !source.content.slice(section.start, section.end).startsWith(`${'#'.repeat(section.level)} ${section.heading}`) || !entry.ruleRefs.includes(section.id)) throw new Error('原文段落索引无效');
  }
  for (const move of entry.techniques) {
    const ref = move.sourceRef, section = sections.get(ref?.ruleRef);
    if (!section || ref.sourceId !== source.id || ref.start !== section.start || ref.end !== section.end ||
        move.originalDefinition !== source.content.slice(ref.start, ref.end) || !move.ruleRefs.includes(section.id)) throw new Error(`${move.name}与权威原文不一致`);
  }
}

export function abilityIndex(entry) {
  assertWorldbookAbility(entry);
  return { id: entry.id, name: entry.name, version: entry.version, contentType: entry.contentType,
    sourceId: entry.abilitySource.id, contentSha256: entry.abilitySource.contentSha256, ruleRefs: clone(entry.ruleRefs),
    techniques: entry.techniques.map(move => ({ id: move.id, name: move.name, sourceRef: clone(move.sourceRef), ruleRefs: clone(move.ruleRefs) })) };
}

export function activeAbilityRegistry(registry, actors) {
  if (!registry.some(isWorldbookAbility)) return registry;
  const ids = new Set(actors.flatMap(actor => [
    ...(actor.learnedTechniqueRefs || []).map(ref => ref.registryId),
    ...(actor.techniques || []).map(group => group.registryId).filter(Boolean)
  ]));
  // Generated enemy profiles remain actor-bound; catalogue membership is not ownership.
  const moves = new Set(actors.flatMap(actor => (actor.techniques || []).map(move => move.id).filter(Boolean)));
  return registry.filter(entry => ids.has(entry.id) || actors.some(actor => actor.id === entry.characterProfileId) || entry.techniques.some(move => moves.has(move.id)));
}

export function projectAbilityContext(context) {
  const actors = [context.actors.player, ...context.actors.enemies];
  const selected = activeAbilityRegistry(context.registry, actors);
  const raw = selected.filter(isWorldbookAbility);
  if (!raw.length) return { ...context, registry: selected };
  raw.forEach(assertWorldbookAbility);
  const project = actor => {
    const copy = clone(actor);
    const owned = new Set([...(actor.learnedTechniqueRefs || []).map(ref => ref.registryId), ...(actor.techniques || []).map(group => group.registryId)]);
    const entries = raw.filter(entry => owned.has(entry.id));
    const byName = new Map(entries.map(entry => [entry.name, entry]));
    const byMove = new Map(entries.flatMap(entry => entry.techniques.map(move => [move.id, move])));
    const strip = profile => {
      if (!profile) return;
      profile.martialArts = (profile.martialArts || []).map(method => byName.has(method.name)
        ? { name: method.name, registryId: byName.get(method.name).id, sourceId: byName.get(method.name).abilitySource.id } : method);
      profile.techniques = (profile.techniques || []).map(move => byMove.has(move.id)
        ? { id: move.id, name: move.name, sourceRef: clone(byMove.get(move.id).sourceRef), ruleRefs: clone(byMove.get(move.id).ruleRefs) } : move);
    };
    strip(copy); strip(copy.profile);
    return copy;
  };
  return { ...context, actors: { player: project(context.actors.player), enemies: context.actors.enemies.map(project) },
    registry: selected.map(entry => isWorldbookAbility(entry) ? abilityIndex(entry) : entry),
    abilitySources: raw.map(entry => clone(entry.abilitySource)),
    abilitySourcePolicy: { authority: 'abilitySources.content 为完整能力定义；registry 仅用于身份、招式与规则引用索引。',
      activation: '仅 activatedTechniques/人物所有权列出的能力可用；原文中的其他功法、境界和联动描述不自动授予能力或成功效果。',
      state: '原文定义固定；消耗、恢复和限制结合当前状态与交锋裁定，原文不确定的事实不自动补全。' }
  };
}
