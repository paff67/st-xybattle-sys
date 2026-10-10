import { createCharacterJsonRequest } from './character-source-adapters.js';
import { HIGH_MARTIAL_EVENT_POLICY } from './event-world-policy.js';
import { stripSecrets } from './common.js';
import { resolveReference } from './event-preparation.js';
import { DAILY_DOMAINS, DAILY_PROMPT_VERSION, dailyAdjudicationPrompt } from './event-daily-prompts.js';

const text = (v, max = 1200) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
const list = v => Array.isArray(v) && v.length <= 24;
const refKey = ref => JSON.stringify([ref.sourceId, ref.pointer]);

export function validateDailyResult(raw, module, snapshot, resources = new Map()) {
  if (!raw || !['success', 'partial', 'failure', 'blocked', 'in_progress', 'needs_context'].includes(raw.outcome) || !text(raw.summary) || !text(raw.duration)) throw new Error('日常裁定结论格式无效');
  for (const key of ['publicFacts', 'costs', 'effects', 'missing']) if (!list(raw[key]) || raw[key].some(v => !text(v))) throw new Error(`日常裁定 ${key} 格式无效`);
  if (!list(raw.basis) || !raw.basis.length || !list(raw.changes)) throw new Error('日常裁定缺少依据或变更契约');
  const basis = raw.basis.map(item => {
    const ref = module.fields[item?.field]?.[item?.index];
    if (!Number.isInteger(item?.index) || !ref || ref.empty || !ref.branchKnown || ref.sourceKind === 'intent' || !text(item.reason)) throw new Error('日常裁定依据未锚定');
    return { field: item.field, index: item.index, reason: item.reason, sourceId: ref.sourceId, pointer: ref.pointer };
  });
  const refs = Object.values(module.fields).flat();
  const seen = new Set();
  const changes = raw.changes.map(change => {
    if (change?.sourceId !== 'mvu' || !text(change.pointer, 1000) || !text(change.reason)) throw new Error('资源变更引用无效');
    const source = resolveReference(change, snapshot);
    const key = refKey(change);
    if (!source.branchKnown || !refs.some(ref => ref.sourceId === 'mvu' && ref.branchKnown && (ref.pointer === change.pointer || change.pointer.startsWith(`${ref.pointer}/`)))) throw new Error('资源变更超出已提取资料');
    const before = resources.has(key) ? resources.get(key) : source.value;
    if (typeof before !== 'number' || !Number.isFinite(before) || change.before !== before || !Number.isFinite(change.after) || change.after < 0 || change.after === before || seen.has(key)) throw new Error('资源变更前值、范围或重复扣费无效');
    if (change.pointer === '/世界/战界' || change.pointer.startsWith('/世界/战界/')) throw new Error('日常裁定不能改变战界状态');
    seen.add(key);
    return { sourceId: 'mvu', pointer: change.pointer, before, after: change.after, reason: change.reason };
  });
  if ((raw.outcome === 'needs_context') !== !!raw.missing.length) throw new Error('缺项与结论不一致');
  if (['blocked', 'needs_context'].includes(raw.outcome) && (changes.length || raw.costs.length || raw.effects.length || raw.outcome === 'needs_context' && raw.publicFacts.length)) throw new Error('未执行行动不能产生结果或消耗');
  if (changes.length && !raw.costs.length && !raw.effects.length) throw new Error('资源变化缺少可见代价或效果');
  return { outcome: raw.outcome, summary: raw.summary, duration: raw.duration, publicFacts: [...raw.publicFacts], costs: [...raw.costs], effects: [...raw.effects], missing: [...raw.missing], basis, changes };
}

// Pure proposals: receipts commit atomically through P1; MVU/ACU stay host-owned.
export function createDailyExecutor(options = {}) {
  const ask = options.request || createCharacterJsonRequest(options);
  return async (route, { snapshot, args, assertFresh }) => {
    if (!route.actions.length || route.actions.some(a => !DAILY_DOMAINS.includes(a.domain))) return { ...route, decision: 'unsupported', reasonCode: 'mixed_or_unimplemented_domain' };
    for (const previous of args.dailyChanges || []) {
      let actual;
      try { actual = resolveReference(previous, snapshot).value; } catch { /* Missing host projection is not a new resource. */ }
      if (actual !== previous.after) return { ...route, decision: 'needs_context', reasonCode: 'daily_projection_pending', missingInformation: ['上一事务的资源变化尚未与当前 MVU 对齐：' + previous.pointer] };
    }
    const resources = new Map(), records = [];
    for (const action of route.actions) {
      assertFresh();
      const module = route.preparation.modules.find(m => m.actionKey === action.localKey);
      if (!module || module.status !== 'ready') throw new Error('日常行动缺少已核对资料');
      // A partial result does not prove a dependent action's prerequisites.
      if (action.dependsOn.some(key => records.find(r => r.actionKey === key)?.outcome !== 'success')) {
        records.push({ actionKey: action.localKey, domain: action.domain, outcome: 'skipped', summary: '前置行动未完全完成，本行动未执行', publicFacts: [], costs: [], effects: [], changes: [], basis: [], duration: '未执行', missing: [] });
        continue;
      }
      args.onProgress?.({ stage: 'adjudicating', domain: action.domain, actionKey: action.localKey });
      const raw = await ask(dailyAdjudicationPrompt(action.domain, options.dailyPrompts), { promptVersion: DAILY_PROMPT_VERSION, action, evidence: module.fields,
        policy: options.policy || HIGH_MARTIAL_EVENT_POLICY, definitions: snapshot.definitions || null, scope: snapshot.scope, previousResults: records,
        currentResources: [...resources].map(([key, value]) => { const [sourceId, pointer] = JSON.parse(key); return { sourceId, pointer, value }; }) }, options.requestTimeoutMs || 60000, args.signal);
      assertFresh();
      args.onProgress?.({ stage: 'validating', domain: action.domain, actionKey: action.localKey });
      let result;
      try { result = validateDailyResult(raw, module, snapshot, resources); args.trace?.write('validation', 'success', '日常候选通过校验', { actionKey: action.localKey, committed: false }); }
      catch (error) { args.trace?.fail('validation', error); throw error; }
      const record = { actionKey: action.localKey, domain: action.domain, ...result };
      records.push(record);
      args.onProgress?.({ stage: 'evaluated', domain: action.domain, actionKey: action.localKey, result: record });
      if (result.outcome === 'needs_context') return { ...route, decision: 'needs_context', reasonCode: 'daily_evidence_missing', missingInformation: result.missing };
      for (const change of result.changes) resources.set(refKey(change), change.after);
    }
    assertFresh();
    const changes = [...resources].map(([key, after]) => { const [sourceId, pointer] = JSON.parse(key); return { sourceId, pointer, after }; });
    return stripSecrets({ ...route, execution: { schema: 'event_daily_commit_v1', promptVersion: DAILY_PROMPT_VERSION, status: 'validated', modules: [...new Set(records.map(r => r.domain))], records, changes,
      packet: { type: 'XY_EVENT_DAILY_RESULT', eventId: args.event.eventId, results: records.map(({ basis, missing, changes: adjustments, ...record }) => ({ ...record, changes: adjustments.map(({ reason, ...change }) => change) })),
        instruction: '只叙述可见事实；不重新裁定、不重复扣费。changes 是同一资源的顺序变化，宿主仅投影一次；未执行与跳过行动不补写结果。' } } }, [options.apiKey]);
  };
}
