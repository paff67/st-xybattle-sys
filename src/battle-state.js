const clone = (value) => value === undefined ? undefined : JSON.parse(JSON.stringify(value));

export const PHASES = Object.freeze(['idle','active','awaiting_player','judging','committed','narrating','awaiting_next','ended','rewrite']);
const SEMANTIC_KEYS = new Set(['潮眼','回弦','站位','压制','破绽','effects','statuses','positions','control']);

export function createInitialState({ sessionId = `battle-${Date.now()}`, chatId = 'default-chat', branchId = 'main', location = '未设定地点', time = '未设定时间', player, enemies = [], registrySnapshot = [], semanticState } = {}) {
  return {
    schema: 'battle_v2', version: 1, sessionId, scope: { chatId: String(chatId), branchId: String(branchId), extension: 'st-xybattle-sys' }, phase: 'idle', round: 0, roundId: null, actionSeq: 0,
    scene: { location, time, turn: 0, initiative: 'pending', positions: {}, effects: [], publicEvents: [] },
    actors: {
      player: clone(player || { id: 'player', name: '主角', visibleInfo: '可见', resources: {}, techniques: [] }),
      enemies: enemies.map((enemy) => ({ id: enemy.id, name: enemy.name, visibleInfo: clone(enemy.visibleInfo || {}), hidden: clone(enemy.hidden || {}), resources: clone(enemy.resources || {}), techniques: clone(enemy.techniques || []) }))
    },
    semanticState: clone(semanticState || { statuses: [], effects: [], positions: {}, control: '均势' }),
    registrySnapshot: clone(registrySnapshot), history: [], pending: null, lastError: null, updatedAt: new Date().toISOString()
  };
}

function transition(state, phase, patch = {}) { return { ...state, ...patch, phase, version: state.version + 1, updatedAt: new Date().toISOString() }; }
function assertPhase(state, expected) { if (!expected.includes(state.phase)) throw new Error(`当前状态 ${state.phase} 不允许此操作，需要 ${expected.join('/')}`); }

export function startBattle(state) {
  assertPhase(state, ['idle','ended']);
  const round = state.round + 1;
  return transition(state, 'awaiting_player', { round, roundId: `${state.sessionId}-r${round}`, scene: { ...state.scene, turn: round }, pending: null, lastError: null });
}
export function stopBattle(state, reason = '用户停止') { return transition(state, 'ended', { pending: null, lastError: reason }); }
export function restoreBattle(raw) {
  if (!raw || raw.schema !== 'battle_v2' || !PHASES.includes(raw.phase)) throw new Error('无法恢复：不是有效 battle_v2 会话');
  const restored = clone(raw);
  if (restored.phase === 'judging' || restored.phase === 'narrating' || restored.phase === 'rewrite' || restored.phase === 'active') {
    const pendingRecord = restored.history?.find((record) => record.status === 'committed' && !record.narrativePacket);
    restored.phase = pendingRecord ? 'awaiting_next' : (restored.roundId ? 'awaiting_player' : 'idle');
    restored.pending = null; restored.lastError = '检测到上次操作中断，已恢复到可继续状态；不会自动重发请求';
  }
  return restored;
}
export function nextRound(state) { assertPhase(state, ['awaiting_next','committed']); return startBattle({ ...state, phase: 'ended' }); }

export function getPlayerView(state) {
  return {
    schema: state.schema, version: state.version, scope: clone(state.scope), phase: state.phase, round: state.round, roundId: state.roundId,
    scene: clone(state.scene), semanticState: clone(state.semanticState), player: clone(state.actors.player),
    enemies: state.actors.enemies.map(({ hidden, resources, techniques, ...visible }) => visible),
    timeline: state.history.slice(-12).map((record) => ({ actionId: record.actionId, roundId: record.roundId, label: record.action?.label, outcome: record.adjudication?.summary, narrative: record.narrative?.text, status: record.status }))
  };
}

export function getAiReadContext(state) {
  return {
    session: { id: state.sessionId, version: state.version, round: state.round, phase: state.phase, scope: clone(state.scope) },
    scene: clone(state.scene), actors: clone(state.actors), semanticState: clone(state.semanticState), registry: clone(state.registrySnapshot),
    priorCommittedFacts: state.history.filter((r) => ['committed', 'complete'].includes(r.status)).map((r) => r.adjudication)
  };
}

export function buildAdjudicationRequest(state, action, settings = {}) {
  assertPhase(state, ['awaiting_player']);
  if (!action || typeof action.label !== 'string' || !action.label.trim()) throw new Error('行动需要非空 label');
  const actionId = action.actionId || `${state.sessionId}-a${state.actionSeq + 1}`; const context = getAiReadContext(state);
  return { type: 'BATTLE_ADJUDICATION_REQUEST', actionId, roundId: state.roundId, version: state.version, settings: { model: settings.model || '', temperature: settings.temperature ?? 0.2, maxOutput: settings.maxOutput ?? 1200, repairAttempts: settings.repairAttempts ?? 2 }, action: { label: action.label.trim(), techniqueId: action.techniqueId || null, intent: action.intent || '' }, context, playerVisibleContext: getPlayerView(state), prompt: buildAdjudicationPrompt(context, action) };
}
export function buildAdjudicationPrompt(context, action) {
  return ['你是独立 battle_v2 战斗裁定器，只依据给定结构化上下文裁定本轮行动。','只返回 JSON：{summary,before,after,reason,ruleRefs,publicEvents,confidence}。不要输出固定伤害，不要泄露 hidden 信息。',`行动：${action.label}`,`完整上下文 JSON：${JSON.stringify(context)}`,'before 必须完整复制当前 semanticState；after 只允许改变语义状态字段；程序会验证作用域、ruleRefs 和幂等。'].join('\n');
}

function knownRuleRefs(state) { return new Set(state.registrySnapshot.flatMap((entry) => [...(entry.ruleRefs || []), ...(entry.techniques || []).flatMap((technique) => technique.ruleRefs || [])])); }
function validateAdjudication(result, state) {
  if (!result || typeof result !== 'object') throw new Error('裁定响应不是对象');
  for (const key of ['summary','before','after','reason','ruleRefs']) if (!(key in result)) throw new Error(`裁定缺少字段 ${key}`);
  if (!result.before || !result.after || typeof result.reason !== 'string' || !Array.isArray(result.ruleRefs)) throw new Error('裁定字段类型错误');
  const currentKeys = Object.keys(state.semanticState); const allowed = new Set([...SEMANTIC_KEYS, ...currentKeys]);
  for (const key of currentKeys) if (!(key in result.before) || JSON.stringify(result.before[key]) !== JSON.stringify(state.semanticState[key])) throw new Error(`裁定 before 与当前状态不一致：${key}`);
  for (const side of [result.before, result.after]) for (const key of Object.keys(side)) if (!allowed.has(key)) throw new Error(`裁定越权修改字段 ${key}`);
  const known = knownRuleRefs(state); for (const ref of result.ruleRefs) if (!String(ref).trim() || (!known.has(ref) && !String(ref).startsWith('mock.'))) throw new Error(`未知 ruleRef：${ref}`);
  return { summary: String(result.summary), before: clone(result.before), after: clone(result.after), reason: String(result.reason), ruleRefs: result.ruleRefs.map(String), publicEvents: Array.isArray(result.publicEvents) ? result.publicEvents.map(String) : [], confidence: Number.isFinite(result.confidence) ? result.confidence : null };
}

export async function judgeAndCommit(state, action, { adjudicator, narrator, settings = {}, signal, save = () => {}, logger = () => {} } = {}) {
  const providedId = action?.actionId; const existing = providedId ? state.history.find((record) => record.actionId === providedId) : null;
  if (existing) return { state, record: clone(existing), request: { type: 'BATTLE_ADJUDICATION_REQUEST', actionId: providedId, roundId: existing.roundId, version: existing.version }, deduplicated: true };
  const request = buildAdjudicationRequest(state, action, settings); let next = transition(state, 'judging', { actionSeq: state.actionSeq + 1, pending: { actionId: request.actionId, roundId: request.roundId } });
  logger({ kind: 'adjudication_request', aiRead: request.context, playerVisible: request.playerVisibleContext, internal: { requestMetadata: { type: request.type, actionId: request.actionId, roundId: request.roundId, version: request.version, settings: request.settings, promptIncludedForModel: true } } }); await save(next);
  let raw;
  try { raw = await adjudicator.judge(request, { signal }); }
  catch (error) { next = transition(next, 'awaiting_player', { pending: null, lastError: error.name === 'AbortError' ? '请求已停止' : error.message }); await save(next); throw error; }
  let adjudication;
  try { adjudication = validateAdjudication(raw, state); }
  catch (error) { next = transition(next, 'awaiting_player', { pending: null, lastError: error.message }); await save(next); throw error; }
  next = transition(next, 'committed', { semanticState: { ...next.semanticState, ...clone(adjudication.after) }, scene: { ...next.scene, publicEvents: [...next.scene.publicEvents, ...adjudication.publicEvents] } });
  const packet = buildNarrativePacket(next, { actionId: request.actionId, roundId: request.roundId, adjudication, action: request.action }, request);
  const record = { actionId: request.actionId, roundId: request.roundId, version: next.version, action: clone(request.action), adjudication, status: 'committed', before: clone(state.semanticState), after: clone(next.semanticState), narrativePacket: packet, createdAt: new Date().toISOString() };
  next = transition(next, 'narrating', { history: [...next.history, record], pending: { actionId: request.actionId, roundId: request.roundId } }); await save(next); logger({ kind: 'commit', aiRead: request.context, playerVisible: request.playerVisibleContext, internal: { programValidation: { valid: true, ruleRefs: adjudication.ruleRefs }, aiRawResponse: clone(raw) }, adjudication, record: { ...record, narrative: undefined } });
  if (settings.autoNarrative === false) { const committed = { ...record, status: 'committed' }; next = transition(next, 'awaiting_next', { history: next.history.map((r) => r.actionId === record.actionId ? committed : r), pending: null }); await save(next); logger({ kind: 'narrative_packet', aiRead: request.context, playerVisible: request.playerVisibleContext, packet }); return { state: next, record: clone(committed), request, deduplicated: false }; }
  let narrative;
  try { narrative = await narrator.generate(packet, { signal, originalPrompt: settings.originalPrompt || '' }); }
  catch (error) { next = transition(next, 'awaiting_next', { history: next.history.map((r) => r.actionId === record.actionId ? { ...r, status: 'committed', narrativePacket: packet, narrativeError: error.message } : r), pending: null, lastError: error.message }); await save(next); throw error; }
  const finalRecord = { ...record, narrative: normalizeNarrative(narrative), status: 'complete' }; next = transition(next, 'awaiting_next', { history: next.history.map((r) => r.actionId === record.actionId ? finalRecord : r), pending: null, lastError: null }); await save(next); logger({ kind: 'narrative_result', aiRead: request.context, playerVisible: request.playerVisibleContext, packet, narrative: finalRecord.narrative }); return { state: next, record: clone(finalRecord), request, deduplicated: false };
}
function normalizeNarrative(value) { return typeof value === 'string' ? { text: value } : { text: String(value?.text || ''), metadata: clone(value?.metadata || {}) }; }
export function buildNarrativePacket(state, record, request) { return { type: 'BATTLE_SCENE_PACKET', schema: 'battle_v2', scope: clone(state.scope), sessionId: state.sessionId, roundId: record.roundId, actionId: record.actionId, preserveUserPrompt: true, committedFacts: [record.adjudication.summary, ...record.adjudication.publicEvents], location: state.scene.location, time: state.scene.time, publicEvents: clone(state.scene.publicEvents), descriptionRequirements: ['描写本轮可见因果和语义状态变化', '保持角色能感知的信息边界'], prohibitions: ['禁止复判本轮行动', '禁止新增未提交数值结算', '禁止泄露敌方 hidden 字段'], nextDecisionPoint: '等待玩家选择下一步行动', playerVisibleContext: getPlayerView(state), originalAction: clone(request.action) }; }
export async function rewriteNarrative(state, actionId, narrator, { signal, save = () => {}, logger = () => {} } = {}) {
  const record = state.history.find((item) => item.actionId === actionId); if (!record || !record.narrativePacket) throw new Error('找不到可重写的已提交行动');
  let next = transition(state, 'rewrite', { pending: { actionId, roundId: record.roundId } }); await save(next);
  let narrative; try { narrative = normalizeNarrative(await narrator.rewrite(record.narrativePacket, record.narrative, { signal })); } catch (error) { next = transition(next, 'awaiting_next', { pending: null, lastError: error.message }); await save(next); throw error; }
  const final = { ...record, narrative, rewrittenAt: new Date().toISOString() }; const result = transition(next, 'awaiting_next', { history: next.history.map((item) => item.actionId === actionId ? final : item), pending: null, lastError: null }); await save(result); logger({ kind: 'rewrite', actionId, packet: record.narrativePacket, narrative }); return { state: result, record: clone(final) };
}
