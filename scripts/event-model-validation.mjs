// Reads an ignored local file; never copies credentials into reports or bundles.
import fs from 'node:fs/promises';
import { createCharacterJsonRequest } from '../src/character-source-adapters.js';
import { createEventContextReader } from '../src/event-context.js';
import { EVENT_ROUTER_PROMPT } from '../src/event-preparation-prompts.js';
import { validateEventRoute, combatActivationCandidates } from '../src/event-router.js';
import { EVENT_DOMAINS } from '../src/event-domain-contracts.js';
import { HIGH_MARTIAL_EVENT_POLICY } from '../src/event-world-policy.js';
import { createEventCombatPipeline } from '../src/event-combat.js';
import { inputDigest } from '../src/event-state.js';
import { scenarioRoot, routeCases } from '../tests/fixtures/event-model-scenarios.js';

const config = JSON.parse(await fs.readFile('.env.event-model.json', 'utf8'));
if (!config.endpoint || !config.model || !config.apiKey || config.endpoint.includes('YOUR')) throw new Error('真实模型配置不完整');
const request = createCharacterJsonRequest({ ...config, timeoutMs: 90000, maxOutput: 6500, temperature: 0 });
const report = { date: new Date().toISOString(), model: config.model, mock: false, policy: HIGH_MARTIAL_EVENT_POLICY.id, routes: [], combat: [], requests: 0 };
const ask = async (...args) => { report.requests++; return request(...args); };
async function setup(input, history = '午后，林澜和石衡在试剑台相距五米，尚未交锋。', root = scenarioRoot()) {
  const message = { is_user: true, mes: input };
  const context = { chatId: 'real-model-fixture', characters: [{ avatar: 'fixture.png' }], characterId: 0,
    chat: [{ is_user: false, mes: history, variables: [{ stat_data: root }] }, message] };
  const args = { message, event: { eventId: `live-${Date.now()}`, chatId: context.chatId, branchUid: 'fixture-branch', inputMessageUid: 'fixture-input', originalInputHash: await inputDigest(message) } };
  const reader = createEventContextReader({ contextProvider: () => context, database: null });
  return { args, reader };
}
const redact = message => String(message).split(config.apiKey).join('[REDACTED]').split(config.endpoint).join('[ENDPOINT]');
const mode = process.argv[2] || 'all';
if (mode !== 'combat') {
  // Bounded concurrency; this run uses fictitious local context, not private chats.
  const variants = process.argv.includes('--expanded') ? [input => input, input => `本轮输入：${input}`, input => `${input}\n请依据当前上下文继续。`, input => `接着上文。${input}`] : [input => input];
  const queue = variants.flatMap((wrap, index) => routeCases.map(item => ({ ...item, id: `${item.id}-v${index + 1}`, input: wrap(item.input) })));
  if (process.argv.includes('--expanded')) queue.push(
    { id: 'no_phone_protection', input: '手机坏了，石衡已经攻击我，我立刻用水击反击。', expect: 'adjudicate', domains: ['combat'] },
    { id: 'mere_intent', input: '他只是对我心怀杀意，还没有出手；我暂时继续喝茶。', expect: 'pass', domains: [] },
    { id: 'withdraw_not_escape', history: '石衡的护罩封锁了出口，水击正在袭来。', input: '我撤销备案，然后用水击挡住攻击。', expect: 'adjudicate', includes: 'combat' },
    { id: 'public_weather', input: '战界备案时，手机天气预报是不是会变？这是设定问题。', expect: 'pass', domains: [] });
  await Promise.all(Array.from({ length: 3 }, async () => {
    for (let item; (item = queue.shift());) {
      const started = Date.now();
      try {
        const { args, reader } = await setup(item.input, item.history);
        const snapshot = await reader(args);
        const raw = await ask(EVENT_ROUTER_PROMPT, { input: snapshot.input, history: snapshot.history, battlefield: snapshot.battlefield,
          policy: HIGH_MARTIAL_EVENT_POLICY, domains: Object.entries(EVENT_DOMAINS).map(([id, value]) => ({ id, label: value.label })) }, 90000);
        const route = validateEventRoute(raw, snapshot), domains = route.actions.map(action => action.domain);
        const candidates = combatActivationCandidates(route, snapshot);
        const passed = route.decision === item.expect && (!item.domains || JSON.stringify([...new Set(domains)].sort()) === JSON.stringify([...item.domains].sort()))
          && (!item.includes || domains.includes(item.includes)) && (!item.noCombat || !candidates.length && !domains.includes('combat'));
        report.routes.push({ id: item.id, input: item.input, expected: item.expect, passed, ms: Date.now() - started, route, candidates });
        console.log(`route ${item.id}: ${passed ? 'PASS' : 'FAIL'} (${route.decision}: ${domains.join(',')})`);
      } catch (error) { report.routes.push({ id: item.id, passed: false, error: redact(error.message), ms: Date.now() - started }); console.log(`route ${item.id}: ERROR ${redact(error.message)}`); }
    }
  }));
}
if (mode !== 'routes') {
  let battleState;
  for (const [index, input] of ['我现在施展水击攻击五米内的石衡，石衡使用护衣抵挡。', '我再次施展水击攻击石衡。'].entries()) {
    const started = Date.now();
    try {
      const { args, reader } = await setup(input, '林澜和石衡在战界-001内试剑，双方都清醒，距离五米。本轮将正常施展一次招式。');
      args.event.eventId += `-${index}`; args.battleState = battleState;
      const pipeline = createEventCombatPipeline({ captureContext: reader, request: ask, maxOutput: 6500, requestTimeoutMs: 90000 });
      const result = await pipeline(args);
      const after = result.execution?.afterState;
      const usedResources = result.execution?.records.flatMap(record => record.adjudication.resourceChanges || []) || [];
      const passed = result.decision === 'adjudicate' && result.execution?.status === 'validated' && usedResources.length >= 1
        && after?.actors.player.resources.灵力 === (index === 0 ? 8 : 6);
      report.combat.push({ id: `round-${index + 1}`, passed, ms: Date.now() - started, result });
      console.log(`combat round-${index + 1}: ${passed ? 'PASS' : 'FAIL'} (${result.decision}, player resource ${after?.actors.player.resources.灵力})`);
      if (!after) break;
      battleState = after;
    } catch (error) { report.combat.push({ id: `round-${index + 1}`, passed: false, error: redact(error.message), ms: Date.now() - started }); console.log(`combat: ERROR ${redact(error.message)}`); break; }
  }
}
report.summary = { routes: `${report.routes.filter(row => row.passed).length}/${report.routes.length}`, combat: `${report.combat.filter(row => row.passed).length}/${report.combat.length}` };
const durations = report.routes.map(row => row.ms).sort((a, b) => a - b);
report.latency = { routeP50ms: durations[Math.floor(durations.length * .5)] ?? null, routeP95ms: durations[Math.min(durations.length - 1, Math.floor(durations.length * .95))] ?? null };
await fs.mkdir('artifacts/event-p2-p3-model-20261007', { recursive: true });
const out = `artifacts/event-p2-p3-model-20261007/${mode}-${Date.now()}.json`;
await fs.writeFile(out, redact(JSON.stringify(report, null, 2)) + '\n');
console.log(JSON.stringify({ report: out, ...report.summary, requests: report.requests }));
if ([...report.routes, ...report.combat].some(row => !row.passed)) process.exitCode = 1;
