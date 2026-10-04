import { clone, stableStringify, abortIfNeeded } from './common.js';
import { TechniqueRegistry } from './battle-registry.js';
export const PHASES = Object.freeze(['idle','active','awaiting_player','judging','committed','narrating','awaiting_next','ended','rewrite']);
const fixedKeys = ['statuses','effects','positions','control'];
export function createInitialState({ sessionId = `battle-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, chatId = 'default-chat', branchId = 'main', location = '未设定地点', time = '未设定时间', player, enemies = [], registrySnapshot = [], semanticState, resourceRules = [], scene = {} } = {}) {
  return { schema: 'battle_v2', version: 1, sessionId, scope: { chatId: String(chatId), branchId: String(branchId), extension: 'st-xybattle-sys' }, phase: 'idle', round: 0, roundId: null, actionSeq: 0,
    scene: { location, time, turn: 0, initiative: 'pending', positions: {}, publicEvents: [], ...clone(scene) },
    actors: { player: clone(player || { id: 'player', name: '主角', visibleInfo: '可见', resources: {}, techniques: [] }), enemies: clone(enemies) },
    semanticState: { statuses: [], effects: [], positions: {}, control: '均势', ...clone(semanticState || {}) }, resourceRules: clone(resourceRules), registrySnapshot: clone(registrySnapshot), history: [], pending: null, lastError: null, updatedAt: new Date().toISOString() };
}
function transition(state, phase, patch = {}) { return { ...state, ...patch, phase, version: state.version + 1, updatedAt: new Date().toISOString() }; }
function assertPhase(state, phases) { if (!phases.includes(state.phase)) throw new Error(`当前状态 ${state.phase} 不允许此操作，需要 ${phases.join('/')}`); }
export function startBattle(state) { assertPhase(state, ['idle','ended']); return transition(state, 'awaiting_player', { round: state.round + 1, roundId: `${state.sessionId}-r${state.round + 1}`, scene: { ...state.scene, turn: state.round + 1 }, pending: null, lastError: null }); }
export function stopBattle(state, reason = '用户停止') { return transition(state, 'ended', { lastError: reason }); }
export function restoreBattle(raw) {
  if (!raw || raw.schema !== 'battle_v2' || !PHASES.includes(raw.phase) || !raw.scope || !raw.actors || !raw.semanticState || !Array.isArray(raw.history) || !Array.isArray(raw.registrySnapshot)) throw new Error('无法恢复：不是有效 battle_v2 会话');
  const state = clone(raw); new TechniqueRegistry(state.registrySnapshot); state.resourceRules ||= [];
  if (['judging','narrating','rewrite','active','committed'].includes(state.phase)) {
    const last = state.history.at(-1); const committed = last && ['committed','complete'].includes(last.status);
    if (state.phase === 'judging' && state.pending) { const attempt = state.history.find((item) => item.actionId === state.pending.actionId); if (attempt) attempt.status = 'interrupted'; }
    state.phase = committed ? 'awaiting_next' : (state.roundId ? 'awaiting_player' : 'idle'); state.pending = null; state.lastError = '检测到上次操作中断；已提交事实保留，未完成请求不会自动重发。';
  }
  return state;
}
export function advanceEffects(effects = []) { return effects.flatMap((effect) => typeof effect === 'string' || !Number.isInteger(effect.remainingRounds) ? [effect] : effect.remainingRounds > 1 ? [{ ...effect, remainingRounds: effect.remainingRounds - 1 }] : []); }
export function nextRound(state) { assertPhase(state, ['awaiting_next','committed']); const semanticState = { ...state.semanticState, effects: advanceEffects(state.semanticState.effects) }; return startBattle({ ...state, phase: 'ended', semanticState }); }
function publicSemantic(state) { return { ...clone(state), effects: (state.effects || []).filter((effect) => typeof effect === 'string' || ['public','player',undefined].includes(effect.visibility)) }; }
export function getPlayerView(state) { return { schema: state.schema, version: state.version, scope: clone(state.scope), phase: state.phase, round: state.round, roundId: state.roundId, scene: clone(state.scene), semanticState: publicSemantic(state.semanticState), player: clone(state.actors.player), enemies: state.actors.enemies.map((enemy) => ({ id: enemy.id, name: enemy.name, visibleInfo: clone(enemy.visibleInfo || {}) })), timeline: state.history.filter((record) => ['committed','complete'].includes(record.status)).slice(-12).map((record) => ({ actionId: record.actionId, roundId: record.roundId, label: record.action?.label, outcome: record.adjudication?.summary, narrative: record.narrative?.text, status: record.status })) }; }
export function getAiReadContext(state) { return { session: { id: state.sessionId, version: state.version, round: state.round, phase: state.phase, scope: clone(state.scope) }, scene: clone(state.scene), actors: clone(state.actors), semanticState: clone(state.semanticState), resourceRules: clone(state.resourceRules), registry: clone(state.registrySnapshot), priorCommittedFacts: state.history.filter((r) => ['committed','complete'].includes(r.status)).map((r) => clone(r.adjudication)) }; }
export function buildAdjudicationRequest(state, action, settings = {}) {
  assertPhase(state, ['awaiting_player']); if (!action || typeof action.label !== 'string' || !action.label.trim()) throw new Error('行动需要非空 label');
  const context = getAiReadContext(state);
  if (action.techniqueId) { const registry = new TechniqueRegistry(state.registrySnapshot); const found = registry.findTechnique(action.techniqueId); if (!found) throw new Error('行动功法未注册'); const owns = (state.actors.player.techniques || []).some((group) => group.registryId === found.entry.id && group.techniqueIds?.includes(action.techniqueId)); if (!owns) throw new Error('主角未拥有该词条'); const available = registry.availability(found.entry.id, action.techniqueId, state.semanticState); if (!available.available) throw new Error(`本轮词条条件不足：${available.reason}`); }
  const config = settings.adjudicator || settings;
  return { type: 'BATTLE_ADJUDICATION_REQUEST', actionId: action.actionId || `${state.sessionId}-a${state.actionSeq + 1}`, roundId: state.roundId, version: state.version, scope: clone(state.scope), settings: { model: config.model || '', temperature: config.temperature ?? 0.2, maxOutput: config.maxOutput ?? 1600, repairAttempts: config.repairAttempts ?? 2 }, action: { label: action.label.trim(), techniqueId: action.techniqueId || null, intent: action.intent || '' }, context, playerVisibleContext: getPlayerView(state), prompt: buildAdjudicationPrompt(context, action) };
}
export function buildAdjudicationPrompt(context, action) { return ['你是独立 battle_v2 战斗裁定器。只依据给定结构化上下文和原始功法定义裁定本轮，不使用酒馆主预设。','只返回 JSON：{summary,before,after,reason,ruleRefs,publicEvents,confidence,resourceChanges?}。before/after 是完整 semanticState；summary/publicEvents 只含玩家可观察事实；hidden 用于决定内部因果，不得泄露。','资源只按 resourceRules 定义的边界改变，未定义数值不得创建。语义站位、压制、破绽和持续效果优先。effects 对象格式：{id,label,techniqueId?,remainingRounds:正整数,visibility:"public"|"player"|"gm"|"internal",ruleRefs:[]}；不设remainingRounds表示直到显式终止。',`行动 JSON：${JSON.stringify(action)}`,`完整上下文 JSON：${JSON.stringify(context)}`,'可选 resourceChanges 是 [{actorId,resource,before,after,reason,ruleRefs}]，只能改变resourceRules已声明的角色资源；没有变更请省略。', 'ruleRefs 必须引用给定 registry/resourceRules 中的精确引用。禁止自由编造规则；不返回演员整表、不复写 session/version。'].join('\n'); }
function hiddenLeaves(value) { if (!value || typeof value !== 'object') return typeof value === 'string' && value.length > 3 ? [value] : []; return Object.values(value).flatMap(hiddenLeaves); }
export function validateAdjudication(result, state, { allowMock = false } = {}) {
  if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('裁定响应不是对象');
  for (const key of ['summary','before','after','reason','ruleRefs','publicEvents']) if (!(key in result)) throw new Error(`裁定缺少字段 ${key}`);
  if (typeof result.summary !== 'string' || !result.summary.trim() || typeof result.reason !== 'string' || !result.reason.trim() || !Array.isArray(result.ruleRefs) || !result.ruleRefs.length || !Array.isArray(result.publicEvents)) throw new Error('裁定字段类型或非空约束错误');
  if (stableStringify(result.before) !== stableStringify(state.semanticState)) throw new Error('裁定 before 与当前状态不一致');
  if (!result.after || Array.isArray(result.after) || typeof result.after !== 'object') throw new Error('after 必须是完整对象');
  const keys = Object.keys(state.semanticState); for (const key of keys) if (!(key in result.after)) throw new Error(`after 缺少 ${key}`);
  const allowed = new Set([...fixedKeys,...keys]); for (const key of Object.keys(result.after)) if (!allowed.has(key)) throw new Error(`裁定越权修改字段 ${key}`);
  for (const [key, before] of Object.entries(state.semanticState)) { const after = result.after[key]; if (Array.isArray(before) ? !Array.isArray(after) : typeof before !== typeof after || (before && typeof before === 'object' && (after === null || Array.isArray(after)))) throw new Error(`语义字段类型不匹配：${key}`); if (typeof before === 'number' && before !== after && !(state.resourceRules || []).some((rule) => rule.path === key)) throw new Error(`未定义资源规则：${key}`); }
  const known = new Set(state.registrySnapshot.flatMap((entry) => [...entry.ruleRefs,...entry.techniques.flatMap((technique) => technique.ruleRefs)]).concat((state.resourceRules || []).flatMap((rule) => rule.ruleRefs || [])));
  for (const ref of result.ruleRefs) if (typeof ref !== 'string' || !known.has(ref) && !(allowMock && ref.startsWith('mock.'))) throw new Error(`未知 ruleRef：${ref}`);
  for (const rule of (state.resourceRules || []).filter((item) => item.path)) { const value = rule.path.split('.').reduce((object,key) => object?.[key], result.after); if (typeof value !== 'number' || !Number.isFinite(value) || value < (rule.min ?? -Infinity) || value > (rule.max ?? Infinity)) throw new Error(`资源边界不合法：${rule.path}`); }
  for (const effect of result.after.effects || []) { if (typeof effect === 'string') continue; if (!effect || typeof effect.id !== 'string' || typeof effect.label !== 'string' || !['public','player','gm','internal'].includes(effect.visibility) || !Array.isArray(effect.ruleRefs) || effect.remainingRounds !== undefined && (!Number.isInteger(effect.remainingRounds) || effect.remainingRounds < 1)) throw new Error('持续效果结构无效'); for (const ref of effect.ruleRefs) if (!known.has(ref) && !(allowMock && ref.startsWith('mock.'))) throw new Error(`效果引用未知规则：${ref}`); }
  const resourceChanges = result.resourceChanges === undefined ? [] : result.resourceChanges;
  if (!Array.isArray(resourceChanges)) throw new Error('resourceChanges 必须是数组');
  const changedResources = new Set();
  for (const change of resourceChanges) {
    const actor = [state.actors.player,...state.actors.enemies].find((item) => item.id === change.actorId);
    const rule = state.resourceRules.find((item) => item.actorId === change.actorId && item.resource === change.resource);
    const resourceKey = `${change.actorId}:${change.resource}`;
    if (!actor || !rule || !Object.hasOwn(actor.resources || {},change.resource)) throw new Error('资源变化没有角色/权威规则定义');
    if (changedResources.has(resourceKey)) throw new Error('资源重复变更'); changedResources.add(resourceKey);
    if (!Number.isFinite(change.before) || !Number.isFinite(change.after) || change.before !== actor.resources[change.resource]) throw new Error('资源 before/after 不是当前有限数');
    if (change.after < (rule.min ?? -Infinity) || change.after > (rule.max ?? Infinity)) throw new Error('资源变化超出世界规则边界');
    if (typeof change.reason !== 'string' || !change.reason.trim() || !Array.isArray(change.ruleRefs) || !change.ruleRefs.length || !change.ruleRefs.some((ref) => rule.ruleRefs.includes(ref)) || change.ruleRefs.some((ref) => !known.has(ref))) throw new Error('资源变化缺少权威reason/ruleRefs');
  }
  const publiclyVisible = JSON.stringify({ summary: result.summary, publicEvents: result.publicEvents, after: publicSemantic(result.after) }); for (const leaf of state.actors.enemies.flatMap((enemy) => hiddenLeaves(enemy.hidden))) if (publiclyVisible.includes(leaf)) throw new Error('裁定公开结果包含敌方隐藏信息，拒绝发布');
  return { summary: result.summary, before: clone(result.before), after: clone(result.after), reason: result.reason, ruleRefs: clone(result.ruleRefs), publicEvents: result.publicEvents.map(String), ...(result.resourceChanges === undefined ? {} : {resourceChanges: clone(resourceChanges)}), confidence: Number.isFinite(result.confidence) ? result.confidence : null };
}
export function buildNarrativePacket(state, record, request) { return { type: 'BATTLE_SCENE_PACKET', schema: 'battle_v2', scope: clone(state.scope), sessionId: state.sessionId, roundId: record.roundId, actionId: record.actionId, preserveUserPrompt: true, committedFacts: [record.adjudication.summary,...record.adjudication.publicEvents], location: state.scene.location, time: state.scene.time, publicEvents: clone(state.scene.publicEvents), descriptionRequirements: ['描写本轮可见因果和语义状态变化','保持角色信息边界'], prohibitions: ['禁止复判本轮行动','禁止新增未提交数值结算','禁止泄露隐藏敌情'], nextDecisionPoint: '等待玩家选择下一步行动', playerVisibleContext: getPlayerView(state), originalAction: clone(request.action) }; }
function normalizeNarrative(value) { return typeof value === 'string' ? { text: value } : { text: String(value?.text || ''), pending: value?.pending === true, metadata: clone(value?.metadata || {}) }; }
export async function judgeAndCommit(state, action, { adjudicator, narrator, settings = {}, signal, save = () => {}, logger = () => {}, onCommit = () => {} } = {}) {
  const existing = action?.actionId ? state.history.find((record) => record.actionId === action.actionId) : null; if (existing) return { state, record: clone(existing), deduplicated: true };
  const request = buildAdjudicationRequest(state, action, settings); const allowMock = adjudicator?.isMock === true || (settings.adjudicator?.mode || settings.mode) === 'mock';
  const attempt = { actionId: request.actionId, roundId: request.roundId, action: clone(request.action), status: 'prepared', version: state.version, before: clone(state.semanticState) };
  let next = transition(state, 'judging', { actionSeq: state.actionSeq + 1, pending: { actionId: request.actionId, roundId: request.roundId }, history: [...state.history,attempt] });
  logger({ kind: 'adjudication_request', actionId: request.actionId, roundId: request.roundId, aiRead: clone(request.context), playerVisible: request.playerVisibleContext, request: clone(request), internal: { requestMetadata: { type: request.type, actionId: request.actionId, roundId: request.roundId, version: request.version, settings: request.settings } } }); await save(next);
  let raw, adjudication; const repairLimit = request.settings.repairAttempts;
  try {
    for (let attemptIndex = 0; ; attemptIndex += 1) {
      try { raw = attemptIndex === 0 ? await adjudicator.judge(request, { signal, logger }) : await adjudicator.repair(request, raw, adjudication, { signal, logger }); abortIfNeeded(signal); logger({ kind: 'ai_raw_response', actionId: request.actionId, rawResponse: clone(raw), repairAttempt: attemptIndex }); adjudication = validateAdjudication(raw, state, { allowMock }); logger({ kind: 'program_validation', actionId: request.actionId, validation: { valid: true, repairAttempt: attemptIndex } }); break; }
      catch (error) { abortIfNeeded(signal); logger({ kind: 'program_validation', actionId: request.actionId, validation: { valid: false, error: error.message, repairAttempt: attemptIndex } }); raw = error.rawContent ?? raw; if (attemptIndex >= repairLimit || typeof adjudicator.repair !== 'function' || raw === undefined) throw error; adjudication = error; }
    }
  } catch (error) { next = transition(next, 'awaiting_player', { pending: null, lastError: error.message, history: next.history.map((item) => item.actionId === request.actionId ? { ...item, status: error.name === 'AbortError' ? 'interrupted' : 'rejected', error: error.message } : item) }); if (!signal?.aborted) await save(next); throw error; }
  const actors = clone(next.actors);
  for (const change of adjudication.resourceChanges || []) { const actor = [actors.player,...actors.enemies].find((item) => item.id === change.actorId); actor.resources[change.resource] = change.after; }
  next = transition(next, 'committed', { actors, semanticState: clone(adjudication.after), scene: { ...next.scene, publicEvents: [...next.scene.publicEvents,...adjudication.publicEvents] }, pending: null });
  const record = { ...attempt, status: 'committed', version: next.version, adjudication, before: clone(state.semanticState), after: clone(next.semanticState), createdAt: new Date().toISOString() };
  record.narrativePacket = buildNarrativePacket(next,record,request); next = { ...next, history: next.history.map((item) => item.actionId === record.actionId ? record : item) }; abortIfNeeded(signal); await save(next);
  logger({ kind: 'commit', actionId: record.actionId, playerVisible: getPlayerView(next), record: clone(record), internal: { programValidation: { valid: true }, aiRawResponse: clone(raw) } });
  const durability = await onCommit(clone(record),next); abortIfNeeded(signal);
  if(durability?.allowed===false){next=transition(next,'awaiting_next',{lastError:durability.reason||'宿主保存待确认；裁定已保留，不重裁',history:next.history.map((item)=>item.actionId===record.actionId?{...record,narrativeError:durability.reason}:item)});await save(next);return{state:next,record:clone(next.history.find((item)=>item.actionId===record.actionId)),request,deduplicated:false};}
  if (settings.autoNarrative === false) { next = transition(next,'awaiting_next'); await save(next); logger({kind:'narrative_packet',actionId:record.actionId,packet:record.narrativePacket}); return {state:next,record:clone(record),request,deduplicated:false}; }
  next = transition(next,'narrating',{pending:{actionId:record.actionId,roundId:record.roundId}}); await save(next);
  let narrative; try { narrative = normalizeNarrative(await narrator.generate(record.narrativePacket,{signal,logger,originalPrompt:settings.originalPrompt || ''})); abortIfNeeded(signal); }
  catch (error) { next = transition(next,'awaiting_next',{pending:null,lastError:error.message,history:next.history.map((item) => item.actionId === record.actionId ? {...record,narrativeError:error.message} : item)}); if (!signal?.aborted) await save(next); throw error; }
  const finalRecord={...record,narrative,status:narrative.pending?'committed':'complete'}; next=transition(next,'awaiting_next',{history:next.history.map((item)=>item.actionId===record.actionId?finalRecord:item),pending:null,lastError:null}); await save(next); logger({kind:'narrative_result',actionId:record.actionId,packet:record.narrativePacket,narrative}); return {state:next,record:clone(finalRecord),request,deduplicated:false};
}
export async function rewriteNarrative(state,actionId,narrator,{signal,save=()=>{},logger=()=>{},originalPrompt=''}={}) {
  assertPhase(state,['awaiting_next','committed','ended']); const record=state.history.find((item)=>item.actionId===actionId&&['committed','complete'].includes(item.status)); if(!record?.narrativePacket)throw new Error('找不到可重写的已提交行动');
  let next=transition(state,'rewrite',{pending:{actionId,roundId:record.roundId}}); await save(next); let narrative;
  try {narrative=normalizeNarrative(await narrator.rewrite(record.narrativePacket,record.narrative,{signal,logger,originalPrompt}));abortIfNeeded(signal);}catch(error){if(!signal?.aborted)await save(transition(next,'awaiting_next',{pending:null,lastError:error.message}));throw error;}
  const final={...record,narrative,status:narrative.pending?'committed':'complete',rewrittenAt:new Date().toISOString()}; const result=transition(next,'awaiting_next',{history:next.history.map((item)=>item.actionId===actionId?final:item),pending:null,lastError:null});await save(result);logger({kind:'rewrite',actionId,packet:record.narrativePacket,narrative});return{state:result,record:clone(final)};
}
