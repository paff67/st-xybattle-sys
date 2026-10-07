import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';

import { BattleController } from '../src/battle-controller.js';
import { BattleStorage } from '../src/battle-storage.js';
import { TechniqueRegistry } from '../src/battle-registry.js';
import { MockAdjudicator, MockNarrator } from '../src/adapters.js';
import { createInitialState, startBattle, restoreBattle, buildAdjudicationRequest, judgeAndCommit } from '../src/battle-state.js';

const clone = (value) => structuredClone(value);
const knownRule = 'wave-core.1';

class MemoryStorage {
  items = new Map();
  getItem(key) { return this.items.get(key) ?? null; }
  setItem(key, value) { this.items.set(key, String(value)); }
  removeItem(key) { this.items.delete(key); }
  serialized() { return [...this.items.values()].join('\n'); }
}

function validResult(request, changes = {}, ruleRefs = [knownRule]) {
  const before = clone(request.context.semanticState);
  return {
    summary: '本轮形成可观察的潮线',
    before,
    after: { ...clone(before), ...changes },
    reason: '依据已注册功法规则和本轮站位。',
    ruleRefs,
    publicEvents: ['水面潮线改变'],
    exchange: { playerResult: '形成潮线', opponents: (request.context.actors?.enemies || []).map((e) => ({ actorId: e.id, response: '保持守势', techniques: [], result: '未受伤' })), environmentResult: '水面潮线改变', boundaries: ['未造成伤害'] },
    confidence: 0.9
  };
}

function configuredController(options = {}) {
  const controller = new BattleController({
    storage: options.storage ?? new MemoryStorage(),
    chatId: 'regression-chat',
    branchId: options.branchId ?? 'main',
    ...options
  });
  return controller;
}

async function withHttpFixture(handler, run) {
  const requests = [];
  const server = createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', async () => {
      try {
        const request = { path: req.url, headers: clone(req.headers), rawBody: body, body: JSON.parse(body) };
        requests.push(request);
        const response = await handler(request, requests);
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify(response));
      } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    return await run({ baseUrl: `http://127.0.0.1:${server.address().port}`, requests });
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}

test('unconfigured adjudication fails without committing facts or creating a mock result', async () => {
  const storage = new MemoryStorage();
  const controller = configuredController({ storage });
  controller.start();
  const before = clone(controller.state.semanticState);

  await assert.rejects(controller.submit({ actionId: 'unconfigured-v2', label: '观察潮线' }), /未配置/);

  assert.equal(controller.state.phase, 'awaiting_player');
  assert.equal(controller.state.pending, null);
  assert.equal(controller.state.history.filter((record) => ['committed', 'complete'].includes(record.status)).length, 0);
  assert.deepEqual(controller.state.semanticState, before);
  assert.equal(configuredController({ storage }).state.phase, 'awaiting_player');
});

test('zero temperature and zero repair attempts survive the adjudication request boundary', () => {
  const state = startBattle(createInitialState({ sessionId: 'zero-settings', registrySnapshot: new TechniqueRegistry().snapshot() }));
  const request = buildAdjudicationRequest(state, { label: '确定性试探' }, { temperature: 0, repairAttempts: 0, maxOutput: 12 });

  assert.equal(request.settings.temperature, 0);
  assert.equal(request.settings.repairAttempts, 0);
  assert.equal(request.settings.maxOutput, 12);
});

for (const rejectedRef of ['unregistered.rule', 'mock.production-bypass']) {
  test(`production adjudication rejects ruleRef ${rejectedRef} before commit`, async () => {
    let state = startBattle(createInitialState({ sessionId: `rule-${rejectedRef}`, registrySnapshot: new TechniqueRegistry().snapshot() }));
    let calls = 0;
    const adjudicator = { async judge(request) { calls += 1; return validResult(request, { control: '越权结果' }, [rejectedRef]); } };
    const before = clone(state.semanticState);

    await assert.rejects(judgeAndCommit(state, { actionId: rejectedRef, label: '校验规则引用' }, {
      adjudicator,
      narrator: new MockNarrator(),
      settings: { mode: 'http', repairAttempts: 0, autoNarrative: false },
      save: (next) => { state = next; }
    }), /ruleRef|规则/);

    assert.equal(calls, 1);
    assert.equal(state.phase, 'awaiting_player');
    assert.equal(state.history.filter((record) => ['committed', 'complete'].includes(record.status)).length, 0);
    assert.deepEqual(state.semanticState, before);
  });
}

test('narrator failure retains the committed action and retry plus rewrite never rejudges it', async () => {
  let judgeCalls = 0;
  let narrativeCalls = 0;
  let rewriteCalls = 0;
  const controller = configuredController({
    adjudicator: { async judge(request) { judgeCalls += 1; return validResult(request, { control: '我方取得节奏' }); } },
    narrator: {
      async generate() { narrativeCalls += 1; throw new Error('fixture narrator unavailable'); },
      async rewrite() { rewriteCalls += 1; return { text: '只描写已提交的潮线变化。' }; }
    }
  });
  controller.start();

  await assert.rejects(controller.submit({ actionId: 'committed-narrator-failure', label: '建立潮线' }), /narrator unavailable/);
  const committed = clone(controller.state.history[0]);
  const after = clone(controller.state.semanticState);
  assert.equal(controller.state.phase, 'awaiting_next');
  assert.equal(committed.status, 'committed');
  assert.equal(committed.narrativePacket.actionId, committed.actionId);

  const retry = await controller.submit({ actionId: committed.actionId, label: '建立潮线' });
  assert.equal(retry.deduplicated, true);
  await controller.rewrite(committed.actionId);

  assert.equal(judgeCalls, 1);
  assert.equal(narrativeCalls, 1);
  assert.equal(rewriteCalls, 1);
  assert.deepEqual(controller.state.semanticState, after);
  assert.deepEqual(controller.state.history[0].adjudication, committed.adjudication);
  assert.equal(controller.state.history[0].narrative.text, '只描写已提交的潮线变化。');
});

for (const interruptedPhase of ['narrating', 'rewrite']) {
  test(`recovery from ${interruptedPhase} preserves a committed record and advances without a second judgment`, async () => {
    let state = startBattle(createInitialState({ sessionId: `restore-${interruptedPhase}`, chatId: 'regression-chat', registrySnapshot: new TechniqueRegistry().snapshot() }));
    const committed = await judgeAndCommit(state, { actionId: `restore-action-${interruptedPhase}`, label: '建立已提交潮线' }, {
      adjudicator: { async judge(request) { return validResult(request, { control: '已提交优势' }); } },
      settings: { autoNarrative: false }
    });
    const interrupted = { ...clone(committed.state), phase: interruptedPhase, pending: { actionId: committed.record.actionId, roundId: committed.record.roundId } };
    const restored = restoreBattle(interrupted);

    assert.equal(restored.phase, 'awaiting_next');
    assert.equal(restored.pending, null);
    assert.deepEqual(restored.semanticState, committed.state.semanticState);
    assert.deepEqual(restored.history, committed.state.history);

    const raw = new MemoryStorage();
    new BattleStorage(raw, restored.scope).writeSession(interrupted);
    let judgeCalls = 0;
    const controller = configuredController({ storage: raw, adjudicator: { async judge(request) { judgeCalls += 1; return validResult(request); } }, narrator: new MockNarrator() });
    const retry = await controller.submit({ actionId: committed.record.actionId, label: '原行动重试' });
    assert.equal(retry.deduplicated, true);
    assert.equal(judgeCalls, 0);
    controller.continueNext();
    assert.equal(controller.state.round, 2);
    assert.deepEqual(controller.state.semanticState, committed.state.semanticState);
  });
}

test('export/import and storage reload restore the complete registry and round history', async () => {
  const extra = new TechniqueRegistry().snapshot()[0];
  extra.id = 'gongfa.regression-other';
  extra.name = '回归测试功法';
  extra.version = '2.4.0';
  extra.ruleRefs = ['regression.other-core'];
  extra.techniques = extra.techniques.map((item) => ({ ...item, id: `extra-${item.id}`, ruleRefs: [`regression.other-${item.id}`] }));
  const registry = new TechniqueRegistry([...new TechniqueRegistry().snapshot(), extra]);
  const source = configuredController({ registry, adjudicator: { async judge(request) { return validResult(request, { control: `第${request.context.session.round}轮已提交` }, ['regression.other-core']); } }, narrator: new MockNarrator() });
  source.start();
  await source.submit({ actionId: 'export-round-1', label: '第一轮' });
  source.continueNext();
  await source.submit({ actionId: 'export-round-2', label: '第二轮' });

  const raw = new MemoryStorage();
  const target = configuredController({ storage: raw });
  target.importData(source.exportData());
  assert.deepEqual(target.registry.snapshot(), registry.snapshot());
  assert.deepEqual(target.state.registrySnapshot, source.state.registrySnapshot);
  assert.deepEqual(target.state.history, source.state.history);
  assert.deepEqual(target.logs, source.logs);

  const reloaded = configuredController({ storage: raw });
  assert.deepEqual(reloaded.registry.snapshot(), registry.snapshot());
  assert.deepEqual(reloaded.state.history, source.state.history);
  assert.deepEqual(reloaded.logs, source.logs);
  reloaded.continueNext();
  const request = buildAdjudicationRequest(reloaded.state, { label: '恢复后的第三轮' });
  assert.equal(request.context.priorCommittedFacts.length, 2);
  assert.deepEqual(request.context.registry, source.state.registrySnapshot);
  assert.equal(request.context.semanticState.control, '第2轮已提交');
});

test('semantic effects carry through the second round and expire at the next round boundary', async () => {
  const requests = [];
  const effect = { id: 'wave-traction', label: '弦势已建立', techniqueId: 'xianshi', remainingRounds: 2, visibility: 'player', ruleRefs: [knownRule] };
  const controller = configuredController({
    semanticState: { statuses: ['初始站稳'], effects: [], positions: { player: '远距' }, control: '均势' },
    adjudicator: { async judge(request) {
      requests.push(clone(request));
      return validResult(request, requests.length === 1 ? { statuses: ['初始站稳', 'xianshi:triggered'], effects: [effect], positions: { player: '中距' }, control: '我方取得牵引' } : { control: '牵引优势延续' });
    } },
    narrator: new MockNarrator()
  });
  controller.start();
  await controller.submit({ actionId: 'carry-first', label: '建立弦势', techniqueId: 'xianshi' });
  assert.equal(controller.state.semanticState.effects[0].remainingRounds, 2);

  controller.continueNext();
  await controller.submit({ actionId: 'carry-second', label: '利用前轮弦势', techniqueId: 'dielang' });
  assert.equal(requests[1].context.semanticState.effects[0].remainingRounds, 1);
  assert.equal(requests[1].context.semanticState.control, '我方取得牵引');
  assert.deepEqual(requests[1].context.semanticState.positions, { player: '中距' });
  assert.equal(requests[1].context.priorCommittedFacts.length, 1);
  assert.deepEqual(controller.state.history[0].after.effects, [effect]);
  assert.equal(controller.state.history[1].after.effects[0].remainingRounds, 1);

  controller.continueNext();
  assert.equal(controller.state.round, 3);
  assert.deepEqual(controller.state.semanticState.effects, []);
  assert.equal(controller.state.semanticState.control, '牵引优势延续');
  assert.deepEqual(controller.state.history[0].after.effects, [effect]);
});

test('scene import installs scene, actors, semantic state and registry as an isolated new session', () => {
  const controller = configuredController();
  const oldSessionId = controller.state.sessionId;
  const scene = {
    schema: 'battle_v2_scene',
    scene: { location: '临潮台', time: '夜间', initiative: 'player' },
    actors: {
      player: { id: 'p2', name: '试验主角', visibleInfo: { stance: 'guard' }, resources: { qi: '未定量' }, techniques: [{ registryId: 'gongfa.dielang-xuanchaojue', techniqueIds: ['xianshi'] }] },
      enemies: [{ id: 'e2', name: '试验敌手', visibleInfo: { stance: 'side' }, hidden: { tactic: 'enemy-import-hidden' }, resources: { qi: 77 }, techniques: [] }]
    },
    semanticState: { statuses: ['临潮'], effects: [], positions: { p2: '台阶上' }, control: '均势' },
    registry: new TechniqueRegistry().snapshot()
  };
  const expected = clone(scene);
  controller.importScene(scene);

  assert.notEqual(controller.state.sessionId, oldSessionId);
  assert.equal(controller.state.scope.chatId, 'regression-chat');
  assert.equal(controller.state.scope.branchId, 'main');
  assert.equal(controller.state.phase, 'idle');
  assert.equal(controller.state.round, 0);
  assert.deepEqual(controller.state.history, []);
  assert.equal(controller.state.scene.location, '临潮台');
  assert.equal(controller.state.scene.time, '夜间');
  assert.equal(controller.state.scene.initiative, 'player');
  assert.deepEqual(controller.state.actors, expected.actors);
  assert.deepEqual(controller.state.semanticState, expected.semanticState);
  assert.deepEqual(controller.registry.snapshot(), expected.registry);
  scene.actors.enemies[0].hidden.tactic = 'mutated-source';
  scene.semanticState.positions.p2 = 'mutated-source';
  scene.registry[0].name = 'mutated-source';
  assert.equal(controller.state.actors.enemies[0].hidden.tactic, 'enemy-import-hidden');
  assert.equal(controller.state.semanticState.positions.p2, '台阶上');
  assert.notEqual(controller.registry.list()[0].name, 'mutated-source');

  controller.start();
  const activeState = clone(controller.state);
  assert.throws(() => controller.importScene(expected), /idle|ended|停止|进行|状态/);
  assert.deepEqual(controller.state, activeState);
});

test('independent adjudicator and narrator HTTP settings control both model requests', async () => {
  let controller;
  await withHttpFixture((request) => request.path === '/judge'
    ? { choices: [{ message: { content: JSON.stringify(validResult({ context: { semanticState: controller.state.semanticState, actors: controller.state.actors } })) } }] }
    : { choices: [{ message: { content: '独立正文配置已生效。' } }] }, async ({ baseUrl, requests }) => {
    controller = configuredController();
    controller.setSettings({
      adjudicator: { mode: 'http', endpoint: `${baseUrl}/judge`, apiKey: 'judge-runtime-key', model: 'judge-only-model', maxOutput: 321, temperature: 0, repairAttempts: 0 },
      narrator: { mode: 'http', endpoint: `${baseUrl}/story`, apiKey: 'story-runtime-key', model: 'story-only-model', maxOutput: 654, temperature: 0 },
      autoNarrative: true,
      originalPrompt: '保留用户原叙事要求'
    });
    controller.start();
    await controller.submit({ actionId: 'separate-config', label: '分别验证裁定和正文' });

    assert.deepEqual(requests.map((request) => request.path), ['/judge', '/story']);
    assert.equal(requests[0].headers.authorization, 'Bearer judge-runtime-key');
    assert.equal(requests[1].headers.authorization, 'Bearer story-runtime-key');
    assert.equal(requests[0].body.model, 'judge-only-model');
    assert.equal(requests[1].body.model, 'story-only-model');
    assert.equal(requests[0].body.temperature, 0);
    assert.equal(requests[1].body.temperature, 0);
    assert.equal(requests[0].body.max_tokens, 321);
    assert.equal(requests[1].body.max_tokens, 654);
    assert.match(requests[1].body.messages[1].content, /保留用户原叙事要求/);
    assert.match(requests[1].body.messages.map((message) => message.content).join('\n'), /BATTLE_SCENE_PACKET/);
    assert.equal(controller.state.history[0].narrative.text, '独立正文配置已生效。');
  });
});

test('zero repair attempts make one failed HTTP call and preserve the pre-commit state', async () => {
  await withHttpFixture(() => ({ choices: [{ message: { content: 'fixture invalid JSON' } }] }), async ({ baseUrl, requests }) => {
    const controller = configuredController();
    controller.setSettings({ adjudicator: { mode: 'http', endpoint: baseUrl, model: 'judge-invalid', temperature: 0, repairAttempts: 0 }, narrator: { mode: 'packet' }, autoNarrative: false });
    controller.start();
    const before = clone(controller.state.semanticState);
    await assert.rejects(controller.submit({ actionId: 'zero-repair-failure', label: '触发无修复错误' }), /JSON|裁定|响应/);

    assert.equal(requests.length, 1);
    assert.equal(requests[0].body.temperature, 0);
    assert.equal(controller.state.phase, 'awaiting_player');
    assert.equal(controller.state.history.filter((record) => ['committed', 'complete'].includes(record.status)).length, 0);
    assert.deepEqual(controller.state.semanticState, before);
  });
});

test('debug logs retain exact model input and output while credentials never enter storage or exports', async () => {
  const hidden = 'enemy-private-debug-sentinel';
  const judgeKey = 'fixture-judge-sensitive-key';
  const storyKey = 'fixture-story-sensitive-key';
  const wireResponses = [];
  let controller;
  await withHttpFixture((request) => {
    const payload = request.path === '/judge'
      ? { model: 'fixture-judge-response', choices: [{ message: { content: JSON.stringify({ ...validResult({ context: { semanticState: controller.state.semanticState, actors: controller.state.actors } }), reason: `内部因果参考：${hidden}` }) } }], usage: { total_tokens: 17 } }
      : { model: 'fixture-story-response', choices: [{ message: { content: '公开正文只描写潮线。' } }], usage: { total_tokens: 11 } };
    wireResponses.push(JSON.stringify(payload));
    return payload;
  }, async ({ baseUrl, requests }) => {
    const storage = new MemoryStorage();
    controller = configuredController({ storage, initialEnemies: [{ id: 'private-enemy', name: '敌手', visibleInfo: { stance: 'guard' }, hidden: { tactic: hidden }, resources: { qi: 999 }, techniques: [] }] });
    controller.setSettings({
      adjudicator: { mode: 'http', endpoint: `${baseUrl}/judge`, apiKey: judgeKey, model: 'exact-judge', repairAttempts: 0 },
      narrator: { mode: 'http', endpoint: `${baseUrl}/story`, apiKey: storyKey, model: 'exact-story' },
      originalPrompt: '原始用户要求：描写可见潮线。',
      developerLogs: true
    });
    controller.start();
    await controller.submit({ actionId: 'exact-debug', label: '保留精确审计输入输出' });
    const logs = JSON.parse(controller.debugLogExport());
    const modelRequests = logs.filter((entry) => entry.kind === 'model_request');
    const modelResponses = logs.filter((entry) => entry.kind === 'model_response');
    const adjudicationRequest = logs.find((entry) => entry.kind === 'adjudication_request');

    assert.equal(modelRequests.length, 2);
    assert.equal(modelResponses.length, 2);
    assert.deepEqual(modelRequests.map((entry) => entry.body), requests.map((request) => request.body));
    assert.deepEqual(modelResponses.map((entry) => entry.rawResponse), wireResponses);
    assert.equal(adjudicationRequest.request.prompt, requests[0].body.messages[1].content);
    assert.equal(adjudicationRequest.request.context.actors.enemies[0].hidden.tactic, hidden);
    assert.deepEqual(logs.find((entry) => entry.kind === 'ai_raw_response').rawResponse, controller.state.history[0].adjudication);

    controller.log({ kind: 'fixture_secret_echo', apiKey: judgeKey, authorization: `Bearer ${storyKey}`, nested: { cookie: storyKey, accessToken: judgeKey }, text: `provider echoed ${judgeKey} and ${storyKey}` });
    for (const serialized of [storage.serialized(), controller.exportData(), controller.logExport(), controller.debugLogExport()]) {
      assert.doesNotMatch(serialized, new RegExp(`${judgeKey}|${storyKey}`));
      assert.doesNotMatch(serialized, /"apiKey"|"authorization"|"accessToken"/i);
    }
    const publicLogs = controller.logExport();
    assert.doesNotMatch(publicLogs, new RegExp(hidden));
    assert.doesNotMatch(publicLogs, /"hidden"|"aiRead"|"rawResponse"|"prompt"|"body"/);
    assert.doesNotMatch(JSON.stringify(controller.playerView()), new RegExp(hidden));
    assert.match(controller.debugLogExport(), new RegExp(hidden));
  });
});

test('private effects remain available to adjudication and never enter the player projection or public log', async () => {
  const hidden = 'private-effect-sentinel';
  const controller = configuredController({
    adjudicator: { async judge(request) { return validResult(request, { effects: [
      { id: 'public-wave', label: '可见潮线', remainingRounds: 2, visibility: 'player', ruleRefs: [knownRule] },
      { id: 'private-wave', label: hidden, remainingRounds: 2, visibility: 'internal', ruleRefs: [knownRule] }
    ] }); } },
    narrator: new MockNarrator()
  });
  controller.start();
  await controller.submit({ actionId: 'private-effect', label: '记录两种可见性效果' });
  controller.continueNext();
  const request = buildAdjudicationRequest(controller.state, { label: '读取跨轮效果' });

  assert.equal(request.context.semanticState.effects.length, 2);
  assert.equal(request.playerVisibleContext.semanticState.effects.length, 1);
  assert.doesNotMatch(JSON.stringify(controller.playerView()), new RegExp(hidden));
  assert.doesNotMatch(controller.logExport(), new RegExp(hidden));
});

test('an AI attempt to publish an enemy hidden value is rejected before facts commit', async () => {
  const hidden = 'enemy-hidden-publication-sentinel';
  const controller = configuredController({
    initialEnemies: [{ id: 'hidden-e', name: '敌手', visibleInfo: {}, hidden: { tactic: hidden }, resources: {}, techniques: [] }],
    adjudicator: { async judge(request) { return { ...validResult(request), publicEvents: [`公开回声：${hidden}`] }; } },
    narrator: new MockNarrator()
  });
  controller.start();

  await assert.rejects(controller.submit({ actionId: 'hidden-reject', label: '尝试公开隐藏敌情' }), /隐藏|hidden/);
  assert.equal(controller.state.phase, 'awaiting_player');
  assert.equal(controller.state.history.filter((record) => ['committed', 'complete'].includes(record.status)).length, 0);
  assert.doesNotMatch(controller.logExport(), new RegExp(hidden));
});

test('a provider echo of a runtime API key is redacted before host message persistence', async () => {
  const apiKey = 'fixture-host-echo-sensitive-key';
  const writes = [];
  const hostAdapter = {
    scope: () => ({ chatId: 'regression-chat', branchId: 'main' }),
    async persistReceipt(receipt, state) { writes.push({ receipt: clone(receipt), state: clone(state) }); return { persisted: true, confirmed: true }; }
  };
  const storage = new MemoryStorage();
  const controller = configuredController({ storage, hostAdapter });
  await controller.ready;
  controller.setSettings({ adjudicator: { mode: 'http', model: 'credential-echo', endpoint: 'https://example.invalid', apiKey }, narrator: { mode: 'mock' } });
  controller.setAdapters({
    adjudicator: { async judge(request) { return { ...validResult(request), reason: `provider error detail echoed ${apiKey}` }; } },
    narrator: new MockNarrator()
  });
  controller.state.characterPreparation = { status: 'confirmed', profileSchema: 'battle_combat_profile_v2' };
  controller.start();
  await controller.submit({ actionId: 'host-secret-redaction', label: '验证宿主落盘脱敏' });

  assert.ok(writes.length > 0);
  assert.equal(JSON.stringify(writes).includes(apiKey), false, 'runtime API key reached host receipt/state');
  assert.doesNotMatch(storage.serialized(), new RegExp(apiKey));
  assert.doesNotMatch(controller.exportData(), new RegExp(apiKey));
  controller.dispose();
});
