import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { basename } from 'node:path';
import { createContentExport } from '../src/content-protocol.js';

// Explicit selection: clothing, family lore and ST activation flags are not ownership.
const selected = [
  [9, 'gongfa.dielang-xuanchaojue'], [14, 'gongfa.taiyi-canglanjing'],
  [15, 'gongfa.chengxin-tinglanjue'], [16, 'gongfa.wuxiang-shuijingfa'],
  [17, 'gongfa.liuguang-tachaobu'], [18, 'gongfa.xianhai-gongmingpian'],
  [10, 'fabao.cangxian-chaoyin'], [4, 'fabao.chaohen-xinglv']
];
const filename = process.argv[2];
if (!filename) throw new Error('Usage: node scripts/import-worldbook-abilities.mjs <authoritative-worldbook.json>');
const bytes = await readFile(filename), book = JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, ''));
const hash = text => createHash('sha256').update(text).digest('hex');
const entries = selected.map(([uid, id]) => {
  const record = Object.values(book.entries).find(entry => Number(entry.uid) === uid);
  if (!record?.content) throw new Error(`Missing worldbook entry ${uid}`);
  const content = record.content, name = content.match(/<cultivation_lore name="([^"]+)"/)?.[1];
  if (!name) throw new Error(`Missing ability name in entry ${uid}`);
  const contentSha256 = hash(content), sourceId = `worldbook.${uid}.${contentSha256}`;
  const headings = [...content.matchAll(/^(#{2,3}) ([^\r\n]+)\r?$/gm)];
  const sections = headings.map((match, i) => ({ id: `${sourceId}.section-${i + 1}`, heading: match[2], level: match[1].length,
    start: match.index, end: headings.slice(i + 1).find(next => next[1].length <= match[1].length)?.index ?? content.length }));
  let parent = '';
  const moves = sections.filter(section => {
    if (section.level === 2) parent = section.heading;
    return id.startsWith('gongfa.') ? section.level === 3 && ['主要攻击形式', '主要术式'].includes(parent)
      : /《[^》]+》/.test(section.heading) && !/^(?:与|器灵|日常)/.test(section.heading) &&
        (section.level === 3 && ['核心能力', '核心法则', '对六部功法的强化'].includes(parent) || section.level === 2 && /^(?:战斗形态|形态切换|六法合奏|天阶主场)/.test(parent));
  }).map(section => {
    const moveName = [...section.heading.matchAll(/《([^》]+)》/g)].at(-1)?.[1];
    if (!moveName) throw new Error(`Missing move name: ${section.heading}`);
    return { id: `${id}.move-${hash(moveName).slice(0, 12)}`, name: moveName,
      originalDefinition: content.slice(section.start, section.end), mechanics: [content.slice(section.start, section.end)],
      sourceRef: { sourceId, ruleRef: section.id, start: section.start, end: section.end },
      availability: { default: 'available', conditions: [] }, triggeredState: [], visibility: 'player', ruleRefs: [section.id] };
  });
  if (!moves.length) throw new Error(`No abilities found: ${name}`);
  return { id, name, version: `2026.10.08-raw.${contentSha256.slice(0, 12)}`, rank: '以原文为准', element: '以原文为准',
    contentType: id.startsWith('fabao.') ? 'treasure' : 'technique', visibility: 'player',
    corePrinciple: `以世界书《${name}》完整原文为能力定义`, mechanics: [`原文绑定：${sourceId}`],
    techniques: moves, synergies: [], narrativeGuidance: [], ruleRefs: [sourceId, ...sections.map(section => section.id)],
    authority: { kind: 'user-designated-source', format: 'worldbook-original-v1', contentSha256, sourceFileSha256: hash(bytes) },
    abilitySource: { id: sourceId, book: basename(filename), uid, name, contentSha256, sourceFileSha256: hash(bytes),
      sourceDisabled: !!record.disable, content, sections }
  };
});
const timestamp = '2026-10-08T00:00:00+08:00';
const pack = createContentExport(entries, { now: timestamp, exportedAt: timestamp });
await mkdir('content/worldbook-abilities', { recursive: true });
await writeFile('content/worldbook-abilities/abilities.content.json', JSON.stringify(pack, null, 2) + '\n');
console.log(JSON.stringify({ entries: entries.map(entry => ({ name: entry.name, moves: entry.techniques.length, uid: entry.abilitySource.uid })), sourceFileSha256: hash(bytes) }, null, 2));
