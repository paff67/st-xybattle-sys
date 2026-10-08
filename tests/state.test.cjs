const test = require('node:test');
const assert = require('node:assert/strict');

const modules = Promise.all([
  import('../src/battle-state.js'),
  import('../src/battle-controller.js'),
  import('../src/battle-storage.js'),
  import('../src/adapters.js')
]);

class MemoryStorage {
  #items = new Map();
  getItem(key) { return this.#items.has(key) ? this.#items.get(key) : null; }
  setItem(key, value) { this.#items.set(key, String(value)); }
  removeItem(key) { this.#items.delete(key); }
  keys() { return [...this.#items.keys()]; }
}

async function makeController({ rawStorage = new MemoryStorage(), branchId = 'main', adjudicator, narrator } = {}) {
  const [, { BattleController }, , { MockAdjudicator, MockNarrator }] = await modules;
  const controller = new BattleController({
    storage: rawStorage,
    chatId: 'test-chat',
    branchId,
    adjudicator: adjudicator || new MockAdjudicator(),
    narrator: narrator || new MockNarrator()
  });
  return { controller, rawStorage };
}

test('mock controller completes a round and deduplicates the same actionId', async () => {
  const [{ getPlayerView }, , , { MockAdjudicator, MockNarrator }] = await modules;
  const adjudicator = new MockAdjudicator();
  const narrator = new MockNarrator();
  const { controller } = await makeController({ adjudicator, narrator });
  controller.start();

  const first = await controller.submit({ actionId: 'action-1', label: '观察并试探' });
  const retry = await controller.submit({ actionId: 'action-1', label: '观察并试探' });

  assert.equal(first.deduplicated, false);
  assert.equal(first.state.phase, 'awaiting_next');
  assert.equal(first.record.status, 'complete');
  assert.equal(first.record.narrativePacket.type, 'BATTLE_SCENE_PACKET');
  assert.equal(retry.deduplicated, true);
  assert.equal(adjudicator.calls.length, 1);
  assert.equal(narrator.calls.length, 1);
  assert.equal(getPlayerView(controller.state).phase, 'awaiting_next');
});

test('hidden enemy fields are excluded from getPlayerView', async () => {
  const [{ createInitialState, getPlayerView, getAiReadContext }] = await modules;
  const state = createInitialState({ enemies: [{ id: 'e1', name: '敌手', visibleInfo: { stance: 'guard' }, hidden: { secret: 'hidden' }, resources: { qi: 1 }, techniques: [{ id: 'secret' }] }] });

  assert.deepEqual(getPlayerView(state).enemies, [{ id: 'e1', name: '敌手', visibleInfo: { stance: 'guard' } }]);
  assert.equal(getAiReadContext(state).actors.enemies[0].hidden.secret, 'hidden');
});

test('public log export redacts hidden enemy fields', async () => {
  const [, { BattleController }, , { MockAdjudicator, MockNarrator }] = await modules;
  const controller = new BattleController({
    storage: new MemoryStorage(),
    chatId: 'test-chat',
    branchId: 'log-redaction',
    initialEnemies: [{ id: 'e1', name: '敌手', visibleInfo: { stance: 'guard' }, hidden: { secret: 'do-not-publish' } }],
    adjudicator: new MockAdjudicator(),
    narrator: new MockNarrator()
  });
  controller.start();
  await controller.submit({ actionId: 'log-redaction-action', label: '记录公开结果' });

  assert.doesNotMatch(controller.logExport(), /do-not-publish/);
  assert.doesNotMatch(controller.logExport(), /"hidden"/);
});

test('branch-scoped storage creates independent keys', async () => {
  const [, , { BattleStorage }] = await modules;
  const raw = new MemoryStorage();
  const a = new BattleStorage(raw, { chatId: 'chat', branchId: 'a' });
  const b = new BattleStorage(raw, { chatId: 'chat', branchId: 'b' });
  a.writeSession({ schema: 'battle_v2', scope: { chatId: 'chat', branchId: 'a' }, phase: 'idle' });
  b.writeSession({ schema: 'battle_v2', scope: { chatId: 'chat', branchId: 'b' }, phase: 'ended' });

  assert.equal(a.readSession().scope.branchId, 'a');
  assert.equal(b.readSession().scope.branchId, 'b');
  assert.equal(raw.keys().length, 2);
  assert.throws(() => a.writeSession({ scope: { chatId: 'chat', branchId: 'b' } }), /作用域不匹配/);
});

test('invalid before state is rejected and returns to awaiting_player', async () => {
  const [{ getAiReadContext }, { BattleController }] = await modules;
  const badAdjudicator = { async judge(request) {
    const before = { ...request.context.semanticState, statuses: ['not-the-current-status'] };
    return { summary: 'invalid', before, after: request.context.semanticState, reason: 'invalid test result', ruleRefs: ['mock.test'], publicEvents: [] };
  } };
  const controller = new BattleController({ storage: new MemoryStorage(), chatId: 'test-chat', branchId: 'invalid-before', adjudicator: badAdjudicator, narrator: { async generate() { return { text: 'unused' }; } } });
  controller.start();

  await assert.rejects(() => controller.submit({ actionId: 'bad-before', label: '会被拒绝' }), /before|当前状态/);
  assert.equal(controller.state.phase, 'awaiting_player');
  assert.equal(controller.state.history.filter((record) => ['committed', 'complete'].includes(record.status)).length, 0);
  assert.equal(getAiReadContext(controller.state).session.phase, 'awaiting_player');
});

test('restore of an interrupted judging state returns to a retryable phase', async () => {
  const [{ createInitialState, restoreBattle }] = await modules;
  const state = createInitialState({ sessionId: 'restore-session' });
  const restored = restoreBattle({ ...state, phase: 'judging', round: 1, roundId: 'restore-session-r1' });

  assert.equal(restored.phase, 'awaiting_player');
  assert.match(restored.lastError, /中断/);
  assert.equal(restored.pending, null);
});

test('autoNarrative false commits facts and exposes a scene packet without calling narrator', async () => {
  const [, , , { MockAdjudicator, MockNarrator }] = await modules;
  const adjudicator = new MockAdjudicator();
  const narrator = new MockNarrator();
  const { controller } = await makeController({ adjudicator, narrator });
  controller.setSettings({ mode: 'mock', autoNarrative: false });
  controller.start();

  const result = await controller.submit({ actionId: 'packet-only', label: '只提交裁定' });
  assert.equal(result.state.phase, 'awaiting_next');
  assert.equal(result.record.status, 'committed');
  assert.equal(result.record.narrativePacket.type, 'BATTLE_SCENE_PACKET');
  assert.equal(narrator.calls.length, 0);
});

test('default unconfigured controller refuses to submit instead of silently using mock', async () => {
  const [, { BattleController }] = await modules;
  const controller = new BattleController({ storage: new MemoryStorage(), chatId: 'test-chat', branchId: 'unconfigured' });
  controller.start();

  await assert.rejects(() => controller.submit({ actionId: 'unconfigured-action', label: '应被拒绝' }), /未配置裁定 AI/);
  assert.equal(controller.state.phase, 'awaiting_player');
});

test('stop prevents a late adjudication result from replacing the ended state', async () => {
  const [, { BattleController }] = await modules;
  let release;
  const adjudicator = { async judge(request) {
    return new Promise((resolve) => { release = () => resolve({ summary: 'late', before: request.context.semanticState, after: request.context.semanticState, reason: 'late result', ruleRefs: ['mock.late'] }); });
  } };
  const controller = new BattleController({ storage: new MemoryStorage(), chatId: 'test-chat', branchId: 'late', adjudicator, narrator: { async generate() { return { text: 'unused' }; } } });
  controller.start();
  const pending = controller.submit({ actionId: 'late-action', label: '异步行动' });
  while (!release) await new Promise((resolve) => setImmediate(resolve));
  controller.stop('用户停止');
  release();

  const result = await pending;
  assert.equal(result.stale, true);
  assert.equal(controller.state.phase, 'ended');
  assert.equal(controller.state.history.filter((record) => ['committed', 'complete'].includes(record.status)).length, 0);
});

test('host adapter receives final committed receipt and a main-story packet', async () => {
  const [, { BattleController }, , { MockAdjudicator }] = await modules;
  const calls = [];
  const hostAdapter = { scope: () => ({chatId:'test-chat',branchId:'host'}), persistReceipt: async (receipt) => { if (receipt) calls.push(['receipt',receipt]); return {persisted:true,confirmed:true}; }, injectScenePacket: async (packet) => { calls.push(['inject',packet]); return {queued:true}; }, clearScenePacket: () => calls.push(['clear']) };
  const controller = new BattleController({ storage: new MemoryStorage(), chatId: 'test-chat', branchId: 'host', adjudicator: new MockAdjudicator(), hostAdapter });
  await controller.ready;
  controller.state.characterPreparation = { status: 'confirmed', profileSchema: 'battle_combat_profile_v2' };
  controller.start();
  const result = await controller.submit({ actionId: 'host-action', label: '桥接行动' });
  assert.equal(result.state.phase, 'narrating');
  assert.equal(controller.state.phase, 'committed', 'missing native send keeps a retryable committed turn');
  assert.equal(calls.find((item) => item[0]==='receipt')[1].actionId,'host-action');
  assert.ok(calls.find((item) => item[0]==='inject'));
  assert.throws(() => controller.continueNext(), /等待主剧情/);
  controller.skipPendingNarrative(); controller.continueNext(); controller.stop();
  assert.equal(calls.at(-1)[0], 'clear');
});
