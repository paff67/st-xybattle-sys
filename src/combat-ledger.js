import { clone, stableStringify } from './common.js';
import { knownRules } from './authoritative-rules.js';

const kinds = ['resource', 'effect', 'anchor', 'intel'];
const statuses = ['active', 'dispersed', 'interrupted', 'expired', 'consumed', 'destroyed', 'reclaimed'];
const terminal = new Set(['expired', 'consumed', 'destroyed', 'reclaimed']);
const live = (object) => object.status === 'active';
const fail = (message) => { throw new Error(`战场对象：${message}`); };
const nonempty = (value) => typeof value === 'string' && !!value.trim();
export const emptyCombatLedger = () => ({ schema: 'battle_combat_ledger_v1', revision: 0, objects: [], receipts: [] });

export function restoreCombatLedger(value) {
  const state = clone(value ?? emptyCombatLedger());
  if (state.schema !== 'battle_combat_ledger_v1' || !Number.isInteger(state.revision) || state.revision < 0 || !Array.isArray(state.objects) || !Array.isArray(state.receipts)) fail('存档结构无效');
  const ids = new Set();
  for (const object of state.objects) {
    if (!object || !nonempty(object.id) || ids.has(object.id) || !kinds.includes(object.kind) || !statuses.includes(object.status) || !nonempty(object.ownerId) || !nonempty(object.label) || !nonempty(object.description) || !Array.isArray(object.dependsOn) || !Array.isArray(object.ruleRefs) || !['public', 'player', 'internal'].includes(object.visibility)) fail('存档对象无效');
    ids.add(object.id);
  }
  checkGraph(state.objects);
  return state;
}

function checkGraph(objects) {
  const map = new Map(objects.map((object) => [object.id, object]));
  const visiting = new Set(), visited = new Set();
  function visit(object) {
    if (visiting.has(object.id)) fail('依赖不能成环');
    if (visited.has(object.id)) return;
    visiting.add(object.id);
    for (const id of object.dependsOn) {
      const parent = map.get(id);
      if (!parent) fail(`依赖对象不存在：${id}`);
      if (live(object) && !live(parent)) fail(`活动对象依赖已失效对象：${id}`);
      visit(parent);
    }
    visiting.delete(object.id); visited.add(object.id);
  }
  objects.forEach(visit);
}

/** Pure transaction. No caller state is mutated, including on a rejected operation. */
export function applyCombatProposal(state, proposal, actionId) {
  const ledger = restoreCombatLedger(state.combatLedger);
  if (!proposal || !Number.isInteger(proposal.baseRevision) || !Array.isArray(proposal.operations) || proposal.operations.length > 48) fail('需要 baseRevision 和 operations（最多48项）');
  if (!nonempty(actionId)) fail('缺少行动编号');
  const duplicate = ledger.receipts.find((receipt) => receipt.actionId === actionId);
  if (duplicate) {
    if (duplicate.proposal !== stableStringify(proposal)) fail('同一行动重复提交不同变更');
    return ledger;
  }
  if (proposal.baseRevision !== ledger.revision) fail('版本过期，请按最新状态裁定');
  const rules = knownRules(state), operationIds = new Set();
  const actors = [state.actors.player, ...state.actors.enemies];
  const map = new Map(ledger.objects.map((object) => [object.id, object]));
  for (const operation of proposal.operations) {
    if (!operation || !nonempty(operation.operationId) || operationIds.has(operation.operationId)) fail('操作编号为空或重复');
    operationIds.add(operation.operationId);
    if (!['create', 'update', 'retire', 'reclaim'].includes(operation.type) || !nonempty(operation.reason) || !Array.isArray(operation.ruleRefs) || !operation.ruleRefs.length || operation.ruleRefs.some((ref) => !rules.has(ref))) fail('操作类型或规则依据无效');
    if (operation.type === 'create') {
      const input = operation.object;
      if (!input || !nonempty(input.id) || map.has(input.id) || !kinds.includes(input.kind) || !nonempty(input.label) || !nonempty(input.description) || !['public', 'player', 'internal'].includes(input.visibility) || !Array.isArray(input.dependsOn)) fail('新建对象字段无效或编号已使用');
      const owner = actors.find((actor) => actor.id === input.ownerId);
      const entry = state.registrySnapshot.find((entry) => entry.techniques.some((move) => move.id === input.sourceTechniqueId));
      const move = entry?.techniques.find((move) => move.id === input.sourceTechniqueId);
      const owns = owner && (owner.id === state.actors.player.id
        ? owner.techniques?.some((group) => group.registryId === entry?.id && group.techniqueIds?.includes(input.sourceTechniqueId))
        : owner.techniques?.some((technique) => technique.id === input.sourceTechniqueId));
      if (!move || !owns || !operation.ruleRefs.some((ref) => move.ruleRefs.includes(ref))) fail('对象来源招式未掌握或缺少该招式依据');
      if (input.dependsOn.some((id) => typeof id !== 'string' || !map.has(id) || !live(map.get(id))) || new Set(input.dependsOn).size !== input.dependsOn.length) fail('新建对象需要仍有效的已有依赖，按先后顺序创建');
      if (input.kind === 'intel' && (!Array.isArray(input.knownTo) || !input.knownTo.length || input.knownTo.some((id) => !actors.some((actor) => actor.id === id)) || input.visibility !== 'internal' && !input.knownTo.includes(state.actors.player.id))) fail('情报需要明确知情人物，未知于主角的情报不能公开');
      if (input.kind === 'resource' && (!nonempty(input.resourceKey) || [...map.values()].some((object) => object.kind === 'resource' && object.ownerId === input.ownerId && object.resourceKey === input.resourceKey))) fail('资源批次键缺失或重复');
      map.set(input.id, { id: input.id, kind: input.kind, label: input.label, description: input.description,
        ownerId: input.ownerId, sourceTechniqueId: input.sourceTechniqueId, visibility: input.visibility,
        positionOrTarget: String(input.positionOrTarget || ''), dependsOn: clone(input.dependsOn),
        ...(input.kind === 'resource' ? { resourceKey: input.resourceKey } : {}), status: 'active',
        ...(input.kind === 'intel' ? { knownTo: clone(input.knownTo) } : {}),
        ruleRefs: clone(operation.ruleRefs), createdByActionId: actionId, updatedByActionId: actionId });
    } else {
      const object = map.get(operation.objectId);
      if (!object || terminal.has(object.status)) fail('对象不存在或已终结，不能再次使用');
      const source = state.registrySnapshot.flatMap((entry) => entry.techniques).find((move) => move.id === object.sourceTechniqueId);
      if (!source || !operation.ruleRefs.some((ref) => source.ruleRefs.includes(ref))) fail('修改必须引用对象来源招式依据');
      if (operation.type === 'reclaim') {
        if (object.kind !== 'resource' || object.status !== 'dispersed' || [...map.values()].some((child) => live(child) && child.dependsOn.includes(object.id))) fail('只有已散逸且无活动占用的资源批次可回收');
        const recoveryEntry = state.registrySnapshot.find((entry) => entry.id === 'gongfa.taiyi-canglanjing');
        const recovery = recoveryEntry?.techniques.find((move) => move.id === operation.techniqueId && ['澄渊·气海回流', '太一·回澜'].includes(move.name));
        const owner = actors.find((actor) => actor.id === object.ownerId);
        const ownsRecovery = owner?.id === state.actors.player.id ? owner.techniques.some((group) => group.registryId === recoveryEntry?.id && group.techniqueIds.includes(operation.techniqueId)) : owner?.techniques?.some((move) => move.id === operation.techniqueId);
        if (!recovery || !ownsRecovery || !operation.ruleRefs.some((ref) => recovery.ruleRefs.includes(ref))) fail('水元回收必须引用所属人物已掌握的回流招式及依据');
        object.status = 'reclaimed';
      } else if (operation.type === 'retire') {
        if (!['interrupted', 'expired', 'consumed', 'destroyed'].includes(operation.status)) fail('终止状态无效');
        object.status = operation.status;
      } else {
        const patch = operation.patch;
        if (!patch || Array.isArray(patch) || typeof patch !== 'object' || Object.keys(patch).some((key) => !['description', 'positionOrTarget', 'dependsOn', 'status'].includes(key))) fail('更新越权字段');
        if (patch.description !== undefined && !nonempty(patch.description) || patch.positionOrTarget !== undefined && typeof patch.positionOrTarget !== 'string' || patch.dependsOn !== undefined && !Array.isArray(patch.dependsOn)) fail('更新字段类型无效');
        if (patch.status !== undefined && !(patch.status === 'dispersed' && object.kind === 'resource' && live(object))) fail('不允许以 update 复活对象或绕过终止');
        if (patch.status === 'dispersed' && [...map.values()].some((child) => live(child) && child.dependsOn.includes(object.id))) fail('仍在占用的水元不能标为已散逸');
        Object.assign(object, clone(patch));
      }
      object.updatedByActionId = actionId;
    }
  }
  // Destruction invalidates dependent effects transitively, not unrelated effects.
  let changed;
  do {
    changed = false;
    for (const object of map.values()) if (live(object) && object.dependsOn.some((id) => map.has(id) && !live(map.get(id)))) {
      object.status = 'interrupted'; object.updatedByActionId = actionId; changed = true;
    }
  } while (changed);
  ledger.objects = [...map.values()];
  checkGraph(ledger.objects);
  ledger.revision += 1;
  ledger.receipts.push({ actionId, revision: ledger.revision, proposal: stableStringify(proposal) });
  return ledger;
}

export function publicCombatObjects(ledger) {
  return (ledger?.objects || []).filter((object) => object.visibility !== 'internal' && ['active', 'dispersed', 'interrupted'].includes(object.status))
    .map(({ label, description, status, kind, positionOrTarget }) => ({ label, description, status, kind, positionOrTarget }));
}

export const COMBAT_LEDGER_CONTRACT = `【战场对象变更契约】
combatChanges 必填：{baseRevision: 当前 combatLedger.revision, operations: []}。无变化也返回空数组；不能直接回写 combatLedger。
每项操作含 operationId（本轮唯一）、type、reason（简短依据）、ruleRefs（权威规则引用）。
create: object={id,kind:resource|effect|anchor|intel,label,description,ownerId,sourceTechniqueId,visibility:public|player|internal,positionOrTarget,dependsOn:[]}; resource 另需唯一 resourceKey（同一水元批次始终沿用同键），intel 另需 knownTo:[知情人物ID]，不知情的敌人不能利用该线索。只为跨行动有效事实创建对象，不为瞬时攻击或文学描写建档。依赖必须已存在且有效，新对象按依赖顺序创建。
update: objectId, patch={description?,positionOrTarget?,dependsOn?,status?}。status 只可将无活动占用的 resource 从 active 改 dispersed；不能更改归属、来源或复活终结对象。
retire: objectId,status=interrupted|expired|consumed|destroyed；失效会传递至依赖它的活动对象，但不影响独立效果。
reclaim: objectId,techniqueId=所属人物已掌握的气海回流或太一回澜招式ID，ruleRefs 同时引用对象来源和该回流招式；只允许 dispersed 且无活动占用的资源批次。已湮灭、已回收的水元不能回收。资源对象仅记录占用关系，不代表数字增益；数值变化仍需独立 resourceChanges 及既有资源规则。
每项修改必须引用被修改对象的来源招式规则。新建对象必须来自该人物已掌握招式。
持续状态以 combatLedger 为唯一对象事实源，after.effects 不新增同一体系的第二份对象状态；after 只保留兼容字段并更新概括、站位。对象描述与 summary/exchange 必须一致。
所有原文未定量的消耗、层数、持续时间保持定性，禁止发明固定上限。敌人应对仅使用其可知情报，不能利用裁判可见的隐秘计划。`;
