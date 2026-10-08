// Only committed, round-local facts cross the story bridge. Routing identity is
// retained for host deduplication; profiles, prompts and full state never do.
const text = (value) => typeof value === 'string' ? value.trim() : '';
const unique = (values) => [...new Set((Array.isArray(values) ? values : []).map(text).filter(Boolean))];
const strings = (source, keys) => Object.fromEntries(keys.flatMap((key) => text(source?.[key]) ? [[key, text(source[key])]] : []));

export function validateExchange(exchange, state, { required = false } = {}) {
  if (exchange === undefined && !required) return undefined;
  const requireText = (value, path) => { if (!text(value)) throw new Error(`exchange.${path} 必须为非空文字`); return text(value); };
  if (!exchange || !Array.isArray(exchange.opponents) || !Array.isArray(exchange.boundaries)) throw new Error('裁定缺少完整 exchange：需要 opponents 与 boundaries 数组');
  const seen = new Set();
  if (exchange.techniques !== undefined && !Array.isArray(exchange.techniques)) throw new Error('exchange.techniques 必须是主角实际使用的招式数组');
  const playerTechniques = (exchange.techniques || []).map(move => {
    if (!(state.actors.player.techniques || []).some(group => group.techniqueIds?.includes(move?.techniqueId)) || !state.registrySnapshot.some(entry => entry.techniques.some(item => item.id === move?.techniqueId))) throw new Error('exchange 主角招式未激活');
    return { techniqueId: move.techniqueId, manifestation: requireText(move.manifestation, 'manifestation'), interaction: requireText(move.interaction, 'interaction') };
  });
  const opponents = exchange.opponents.map((item) => {
    const actor = state.actors.enemies.find((enemy) => enemy.id === item?.actorId);
    if (!actor || seen.has(actor.id)) throw new Error('exchange 对手不存在或重复');
    seen.add(actor.id);
    if (!Array.isArray(item.techniques)) throw new Error('exchange.techniques 必须是本轮实际使用的招式数组');
    const techniques = item.techniques.map((move) => {
      const owned = (actor.techniques || []).some((known) => known.id === move?.techniqueId || known.techniqueIds?.includes(move?.techniqueId));
      const registered = state.registrySnapshot.some((entry) => entry.techniques.some((known) => known.id === move?.techniqueId));
      if (!owned || !registered) throw new Error('exchange 招式不是该敌人的已确认招式');
      return { techniqueId: move.techniqueId, manifestation: requireText(move.manifestation, 'manifestation'), interaction: requireText(move.interaction, 'interaction') };
    });
    return { actorId: actor.id, response: requireText(item.response, 'response'), result: requireText(item.result, 'result'), techniques };
  });
  if (state.actors.enemies.some((enemy) => !seen.has(enemy.id))) throw new Error('exchange 缺少对手本轮反应（未参与者也须说明保持状态）');
  return { ...(exchange.techniques !== undefined ? { techniques: playerTechniques } : {}), playerResult: requireText(exchange.playerResult, 'playerResult'), opponents, environmentResult: requireText(exchange.environmentResult, 'environmentResult'), boundaries: exchange.boundaries.map((boundary) => requireText(boundary, 'boundaries')) };
}

export function projectScenePacket(packet = {}) {
  const result = { type: 'BATTLE_SCENE_PACKET', schema: 'battle_scene_v3' };
  for (const key of ['sessionId', 'roundId', 'actionId', 'version']) if (['string', 'number'].includes(typeof packet[key])) result[key] = packet[key];
  if (packet.scope) result.scope = Object.fromEntries(['chatId', 'branchId', 'messageId', 'swipeId', 'messageUid'].filter((key) => ['string', 'number'].includes(typeof packet.scope[key])).map((key) => [key, packet.scope[key]]));
  const action = packet.playerAction || { action: packet.originalAction?.label, intent: packet.originalAction?.intent };
  result.playerAction = strings(action, ['action', 'intent', 'school', 'technique']);
  if (packet.exchange) {
    const exchange = packet.exchange;
    result.exchange = {
      playerResult: text(exchange.playerResult),
      ...(exchange.techniques ? { techniques: exchange.techniques.map(move => strings(move, ['school', 'name', 'manifestation', 'interaction'])) } : {}),
      opponents: (Array.isArray(exchange.opponents) ? exchange.opponents : []).map((opponent) => ({
        ...strings(opponent, ['name', 'response', 'result']),
        techniques: (Array.isArray(opponent.techniques) ? opponent.techniques : []).map((move) => strings(move, ['school', 'name', 'manifestation', 'interaction']))
      })),
      environmentResult: text(exchange.environmentResult),
      boundaries: unique(exchange.boundaries)
    };
  } else {
    // Legacy packets already contain this round's summary/events here. Never
    // fall back to publicEvents: that old field contains the entire battle.
    result.committedFacts = unique(packet.committedFacts);
  }
  return result;
}

function namedTechnique(state, id, { enemy = false } = {}) {
  for (const entry of state.registrySnapshot || []) {
    const move = entry.techniques.find((item) => item.id === id);
    if (!move) continue;
    // A hidden move can have observable effects without exposing its name or
    // school. No originalDefinition/mechanics/private stats leave the engine.
    if (enemy && !['public', 'player'].includes(move.visibility)) return {};
    return { school: move.school || entry.name, name: move.name };
  }
  return {};
}

export function createScenePacket(state, record, action = record.action) {
  const move = namedTechnique(state, action?.techniqueId);
  const exchange = record.adjudication.exchange;
  return projectScenePacket({
    type: 'BATTLE_SCENE_PACKET', scope: state.scope, sessionId: state.sessionId,
    roundId: record.roundId, actionId: record.actionId,
    playerAction: { action: action?.label, intent: action?.intent, school: move.school, technique: move.name },
    ...(exchange ? { exchange: {
      ...exchange,
      ...(exchange.techniques ? { techniques: exchange.techniques.map(move => ({ ...namedTechnique(state, move.techniqueId), manifestation: move.manifestation, interaction: move.interaction })) } : {}),
      opponents: exchange.opponents.map((opponent) => ({
        name: state.actors.enemies.find((actor) => actor.id === opponent.actorId)?.name || '对手',
        response: opponent.response, result: opponent.result,
        techniques: opponent.techniques.map((technique) => ({
          ...namedTechnique(state, technique.techniqueId, { enemy: true }),
          manifestation: technique.manifestation, interaction: technique.interaction
        }))
      }))
    } } : { committedFacts: [record.adjudication.summary, ...record.adjudication.publicEvents] })
  });
}

// Public result projection shared by both result cards. Never include the
// narrator response (which may contain the main preset's analysis/CoT).
export function publicRoundResult(record) {
  return {
    actionId: record.actionId, roundId: record.roundId, label: record.action?.label,
    outcome: record.adjudication?.summary,
    publicEvents: unique(record.adjudication?.publicEvents).filter((event) => event !== record.adjudication?.summary),
    status: record.status
  };
}
