import { clone } from './common.js';

export const ACTOR_STATE_SCHEMA = 'battle_actor_state_v1';
const nonempty = value => typeof value === 'string' && !!value.trim();
const fail = message => { throw new Error(`人物状态：${message}`); };
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const allowedKeys = (value, keys) => {
  if (!object(value) || Object.keys(value).some(key => !keys.includes(key))) fail('字段越权或类型错误');
};
const strings = value => Array.isArray(value) && value.every(item => typeof item === 'string');
export const resourceIdFor = (actorId, name) => `${actorId}.resource.${encodeURIComponent(name)}`;

/** IDs are assigned once at confirmation; unknown state is never filled to full. */
export function initializeActorState(actor) {
  const input = actor.state || {};
  const traits = actor.profile?.resourceTraits || actor.resourceTraits || [];
  const resources = traits.map(trait => {
    const known = (input.resources || []).find(item => item.name === trait.name);
    return { resourceId: resourceIdFor(actor.id, trait.name), name: trait.name,
      condition: known?.condition || '当前余裕未明确', burden: known?.burden || '',
      limitations: clone(known?.limitations || []), basis: known?.basis || '能力档案仅定义资源性质，未提供当前余裕',
      visibility: known?.visibility || (actor.side === 'player' ? 'player' : 'internal') };
  });
  const records = key => (input[key] || []).map((item, index) => {
    const record = typeof item === 'string' ? { label: item, description: item } : item;
    if (!object(record) || !nonempty(record.label) || !nonempty(record.description)) fail(`初始${key}需要 label/description`);
    return { id: `${actor.id}.${key}.initial-${index + 1}`, label: record.label, description: record.description,
      visibility: ['public', 'player', 'internal'].includes(record.visibility) ? record.visibility : 'internal', basis: record.basis || '已确认人物资料' };
  });
  return { schema: ACTOR_STATE_SCHEMA, revision: 0, resources, injuries: records('injuries'), statuses: records('statuses'), position: input.position || actor.visibleInfo?.position || '' };
}

/** A pure transaction: fixed profiles and numeric host evidence are never mutated. */
export function applyActorChanges(actors, changes, { knownRules, actionId } = {}) {
  if (!Array.isArray(changes)) fail('actorChanges 必须是数组');
  const next = clone(actors), all = [next.player, ...next.enemies], seen = new Set();
  function evidence(change) {
    if (!nonempty(change.reason) || !Array.isArray(change.ruleRefs) || !change.ruleRefs.length || change.ruleRefs.some(ref => !knownRules.has(ref))) fail('变更必须有原因和有效规则引用');
  }
  for (const change of changes) {
    allowedKeys(change, ['actorId', 'resources', 'injuries', 'statuses', 'position']);
    const actor = all.find(item => item.id === change.actorId);
    if (!actor?.state || actor.state.schema !== ACTOR_STATE_SCHEMA || seen.has(actor.id)) fail('人物不存在、未初始化或重复变更');
    seen.add(actor.id);
    const state = actor.state;
    if (change.resources !== undefined) {
      if (!Array.isArray(change.resources)) fail('resources 必须是数组');
      const resources = new Set();
      for (const item of change.resources) {
        allowedKeys(item, ['resourceId', 'condition', 'burden', 'limitations', 'reason', 'ruleRefs']);
        const old = state.resources.find(resource => resource.resourceId === item.resourceId);
        if (!old || resources.has(item.resourceId)) fail('资源不存在或重复');
        resources.add(item.resourceId); evidence(item);
        if (!nonempty(item.condition) || typeof item.burden !== 'string' || !strings(item.limitations)) fail('资源状态需要 condition/burden/limitations');
        // Replace the entire mutable description, preserving only identity/visibility.
        state.resources[state.resources.indexOf(old)] = { resourceId: old.resourceId, name: old.name, visibility: old.visibility,
          condition: item.condition, burden: item.burden, limitations: clone(item.limitations), basis: item.reason,
          ruleRefs: clone(item.ruleRefs), updatedByActionId: actionId };
      }
    }
    for (const key of ['injuries', 'statuses']) {
      if (change[key] === undefined) continue;
      if (!Array.isArray(change[key])) fail(`${key} 必须是操作数组`);
      const seenIds = new Set(), seenOps = new Set();
      for (const op of change[key]) {
        allowedKeys(op, ['type', 'operationId', 'id', 'label', 'description', 'visibility', 'reason', 'ruleRefs']);
        evidence(op);
        if (!['add', 'update', 'remove'].includes(op.type) || !nonempty(op.operationId) || seenOps.has(op.operationId)) fail('状态操作无效或重复');
        seenOps.add(op.operationId);
        const id = op.type === 'add' ? `${actor.id}.${key}.${encodeURIComponent(actionId)}.${encodeURIComponent(op.operationId)}` : op.id;
        const index = state[key].findIndex(item => item.id === id);
        if (!nonempty(id) || seenIds.has(id) || op.type === 'add' && (op.id !== undefined || index >= 0) || op.type !== 'add' && index < 0) fail('状态 ID 不存在或重复');
        seenIds.add(id);
        if (op.type === 'remove') { state[key].splice(index, 1); continue; }
        if (!nonempty(op.label) || !nonempty(op.description) || !['public', 'player', 'internal'].includes(op.visibility)) fail('状态需要 label/description/visibility');
        if (state[key].some(item => item.id !== id && item.label === op.label)) fail('同一伤势或状态应更新已有 ID，不得重复新增');
        const record = { id, label: op.label, description: op.description, visibility: op.visibility, reason: op.reason, ruleRefs: clone(op.ruleRefs), updatedByActionId: actionId };
        if (op.type === 'add') state[key].push(record); else state[key][index] = record;
      }
    }
    if (change.position !== undefined) {
      allowedKeys(change.position, ['value', 'reason', 'ruleRefs']); evidence(change.position);
      if (!nonempty(change.position.value)) fail('位置不能为空');
      state.position = change.position.value;
    }
    state.revision += 1;
  }
  return next;
}

export function publicActorState(state) {
  if (!state) return undefined;
  return { position: state.position, ...Object.fromEntries(['resources', 'injuries', 'statuses'].map(key => [key, (state[key] || []).filter(item => ['public', 'player'].includes(item.visibility)).map(item => {
    const { basis, reason, ruleRefs, updatedByActionId, ...visible } = item;
    return visible;
  })])) };
}

export function assertActorState(actor) {
  const state = actor.state;
  if (!state?.schema) return; // Legacy session; do not silently migrate it.
  if (state.schema !== ACTOR_STATE_SCHEMA || !Number.isInteger(state.revision) || state.revision < 0 || typeof state.position !== 'string') fail('存档版本或位置无效');
  for (const key of ['resources', 'injuries', 'statuses']) {
    if (!Array.isArray(state[key])) fail('存档状态列表无效');
    const ids = new Set();
    for (const item of state[key]) {
      const id = key === 'resources' ? item.resourceId : item.id;
      if (!nonempty(id) || ids.has(id) || !['public', 'player', 'internal'].includes(item.visibility)) fail('存档状态 ID 或可见性无效');
      ids.add(id);
      if (key === 'resources') {
        if (id !== resourceIdFor(actor.id, item.name) || !nonempty(item.condition) || typeof item.burden !== 'string' || !strings(item.limitations) || !actor.profile?.resourceTraits?.some(trait => trait.name === item.name)) fail('存档资源状态与档案不匹配');
      } else if (!nonempty(item.label) || !nonempty(item.description)) fail('存档伤势或状态无效');
    }
  }
}
