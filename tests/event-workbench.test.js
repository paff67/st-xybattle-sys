import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorkbenchEventRouter, createNarrativeBattleObserver } from '../src/event-workbench.js';
import { battlefieldProjection } from '../src/event-battlefield-state.js';
import { BattleController } from '../src/battle-controller.js';
import { fullCombatProfile } from './fixtures/combat-profile.js';
import { createEventRuntime } from '../src/event-runtime.js';

const response = (text, domain = 'combat') => ({ decision: 'adjudicate', missingInformation: [], actions: [{ localKey: 'one', domain,
  intent: text, source: { id: 'input', quote: text }, execution: 'now', dependsOn: [], opponentNames: ['顾澜'],
  worldSignal: { kind: 'attack_observed', purpose: 'combat', confrontation: 'linked', evidence: [{ id: 'input', quote: text }] } }] });

test('delayed controller initialization cannot hand a routed battle into another chat', async () => {
  let context = { chatId: 'A', chat: [] }, release, opened = 0;
  const controller = { ready: new Promise(resolve => { release = resolve; }), onBattleEntry: () => { opened++; } };
  const runtime = createEventRuntime({ contextProvider: () => context, windowRef: {}, controller });
  runtime.configureAutomaticAdjudication({ request: async () => ({ decision: 'pass', actions: [], missingInformation: [] }) });
  runtime.gate.enabled = true;
  const pending = runtime.gate.onCombatHandoff({ chatId: 'A' });
  context = { chatId: 'B', chat: [] }; release(); await pending;
  assert.equal(opened, 0); runtime.destroy();
});

test('host combat and linked battlefield registration hand off without a second roster request or execution', async () => {
  for (const domain of ['combat', 'battlefield']) {
    let requests = 0;
    const text = '许妍与顾澜在太平洋战界对战';
    const route = createWorkbenchEventRouter({ captureContext: async () => ({ input: { id: 'input', text }, history: [], sources: [], battlefield: battlefieldProjection(null, null) }),
      request: async () => { requests++; return response(text, domain); } });
    const result = await route({});
    assert.equal(result.decision, 'handoff'); assert.equal(result.execution, undefined);
    assert.equal(result.preparation, null); assert.equal(requests, 1);
  }
});

test('ordinary conversation passes and completed narrative observer checks semantic evidence', async () => {
  const text = '许妍与顾澜在太平洋战界对战';
  const observer = createNarrativeBattleObserver({ request: async (_prompt, input) => {
    assert.equal(input.input.text, text); return response(text);
  } });
  assert.equal((await observer({ message: { mes: `<think>厉沧海在湖心${'思考'.repeat(4000)}</think>${text}` }, input: { mes: '创建场景' } })).decision, 'handoff');
  const pass = createNarrativeBattleObserver({ request: async () => ({ decision: 'pass', actions: [], missingInformation: [] }) });
  assert.equal(await pass({ message: { mes: '介绍战界备案规则' }, input: { mes: '聊聊设定' } }), null);
});

test('candidate flow strips reasoning, discards cached actor hints and applies current scene only after confirmation', async () => {
  const scope = { chatId: 'batter--test', branchId: 'message:1:swipe:0', messageUid: 'current', messageId: 1, available: true };
  const hostAdapter = { scope: () => scope, context: () => ({ name1: '许妍', chat: [{ is_user: false, mes: `<think>${'旧演示'.repeat(3000)}</think>许妍和顾澜，金丹初期，在太平洋战界` }] }) };
  const controller = new BattleController({ hostAdapter });
  await controller.ready;
  controller.state.actors.player.name = '旧人物';
  const panel = await controller.prepareCharacters({ inference: {
    inferParticipants: async context => {
      assert.equal(context.playerCandidate, undefined);
      assert.match(context.recentMessages[0].text, /许妍和顾澜/); assert.doesNotMatch(context.recentMessages[0].text, /旧演示/);
      return { player: { name: '许妍' }, candidates: [{ id: 'gulan', name: '顾澜' }], scene: { location: '太平洋战界' } };
    },
    completeCandidate: async ({ candidate }) => ({ ...fullCombatProfile(candidate.name), cultivationRealm: '金丹初期' })
  } });
  assert.deepEqual(panel.candidates.map(c => c.name), ['许妍', '顾澜']);
  assert.equal(controller.state.actors.player.name, '旧人物');
  assert.throws(() => controller.start(), /确认/);
  controller.confirmCharacters(); controller.start();
  assert.equal(controller.state.scene.location, '太平洋战界');
  assert.equal(controller.state.actors.enemies[0].name, '顾澜');
  assert.equal(controller.state.phase, 'awaiting_player');
  controller.dispose();
});
