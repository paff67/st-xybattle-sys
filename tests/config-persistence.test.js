import test from 'node:test';
import assert from 'node:assert/strict';
import { createConfigEnvelope, runtimeConfig, validateConfigEnvelope, exportConfig, CONFIG_APIS } from '../src/config-schema.js';
import { HostConfigStore, createServerConfigReader } from '../src/host-config-store.js';
import { scanLocalConfig, migrationEnvelope, migrationPreview } from '../src/config-migration.js';
import { LEGACY_CHARACTER_COMPLETION_PROMPT } from '../src/character-prompts.js';
import { LEGACY_ADJUDICATOR_SYSTEM_PROMPT } from '../src/legacy-adjudicator-prompt.js';
import { BattleController } from '../src/battle-controller.js';
import { EventOperationLock } from '../src/event-lock.js';

function fixture({ readServer = false } = {}) {
  const fields = {}, disk = {};
  const context = { extensionSettings: fields };
  const helper = { getVariables: scope => structuredClone(fields[scope.extension_id] ?? {}),
    replaceVariables: (value, scope) => { fields[scope.extension_id] = structuredClone(value); } };
  const remote = async () => disk.value ? { kind: 'present', envelope: structuredClone(disk.value) } : { kind: 'missing' };
  const store = new HostConfigStore({ helperProvider: () => helper, contextProvider: () => context, hostReady: async () => {}, ...(readServer ? { readServer: remote } : {}) });
  return { fields, disk, context, helper, store };
}

test('all API credentials and custom prompts roundtrip without trimming or template guessing', () => {
  const apis = Object.fromEntries(CONFIG_APIS.map(api => [api, { model: `${api}-model`, endpoint: 'https://example.test/v1', apiKey: `secret-${api}`, inherit: false }]));
  const input = { ...apis, characterCompletionPrompt: `\n ${LEGACY_CHARACTER_COMPLETION_PROMPT}\n `,
    adjudicationPrompt: `\n${LEGACY_ADJUDICATOR_SYSTEM_PROMPT}\n`, dailyPrompts: { common: '  common\n', modules: { daily: '\n daily  ' } } };
  const envelope = createConfigEnvelope(input);
  const runtime = runtimeConfig(envelope);
  for (const api of CONFIG_APIS) {
    assert.equal(runtime[api].apiKey, input[api].apiKey);
    assert.equal(runtime[api].model, input[api].model);
    assert.equal(Object.hasOwn(envelope.settings[api], 'apiKey'), false);
  }
  assert.equal(runtime.characterCompletionPrompt, input.characterCompletionPrompt);
  assert.equal(runtime.adjudicationPrompt, input.adjudicationPrompt);
  assert.equal(runtime.dailyPrompts.common, input.dailyPrompts.common);
  assert.equal(runtime.dailyPrompts.modules.daily, input.dailyPrompts.modules.daily);
  assert.doesNotMatch(JSON.stringify(exportConfig(envelope)), /secret-/);
});

test('credential omission retains, explicit empty clears, unknown fields survive updates', () => {
  const first = createConfigEnvelope({ adjudicator: { apiKey: 'secret', futureOption: { a: 1 } } });
  first.futureEnvelope = { version: 3 };
  const next = createConfigEnvelope({ adjudicator: { model: 'new' } }, { previous: first });
  assert.equal(runtimeConfig(next).adjudicator.apiKey, 'secret');
  assert.deepEqual(next.futureEnvelope, first.futureEnvelope);
  assert.deepEqual(next.settings.adjudicator.futureOption, { a: 1 });
  assert.equal(runtimeConfig(createConfigEnvelope({ adjudicator: { apiKey: '' } }, { previous: next })).adjudicator.apiKey, '');
  assert.equal(next.revision, 2);
});

test('invalid stored types, blank custom prompts and unknown schema/templates fail closed', () => {
  const base = createConfigEnvelope();
  for (const mutate of [e => { e.schemaVersion = 2; }, e => { e.settings.eventAutoEnabled = 'false'; },
    e => { e.settings.adjudicator.timeoutMs = '60000'; }, e => { e.settings.adjudicator.apiKey = 'secret'; },
    e => { e.credentials.adjudicator = { apiKey: 1 }; }, e => { e.promptPolicy.character.version = 2; }]) {
    const value = structuredClone(base); mutate(value); assert.throws(() => validateConfigEnvelope(value));
  }
  assert.throws(() => createConfigEnvelope({ characterCompletionPrompt: ' \n ' }));
  assert.throws(() => createConfigEnvelope({ dailyPrompts: { modules: { daily: '' } } }));
});

test('host missing differs from corrupt empty namespace and read failure', async () => {
  const { fields, helper, store } = fixture();
  assert.equal((await store.load()).kind, 'missing');
  fields.xybattleConfig = {};
  await assert.rejects(store.load(), /schema/);
  helper.getVariables = () => { throw new Error('sensitive host response'); };
  await assert.rejects(store.load(), error => error.code === 'host_read_failed' && !error.message.includes('sensitive'));
});

test('same-page writes serialize and stale base conflicts instead of overwriting', async () => {
  const { store, fields } = fixture();
  const first = createConfigEnvelope(), second = createConfigEnvelope();
  const results = await Promise.allSettled([store.save(first, null), store.save(second, null)]);
  assert.equal(results[0].value.status, 'submitted');
  assert.equal(results[1].reason.code, 'config_conflict');
  assert.equal(fields.xybattleConfig.writeId, first.writeId);
  assert.equal((await store.verifyPersisted(first.writeId)).status, 'submitted');
});

test('server confirmation requires exact persisted content; remote conflict prevents write', async () => {
  const { store, disk, fields } = fixture({ readServer: true });
  const first = createConfigEnvelope();
  await store.save(first, null);
  assert.equal((await store.verifyPersisted(first.writeId)).status, 'submitted');
  disk.value = structuredClone(first);
  assert.equal((await store.verifyPersisted(first.writeId)).status, 'confirmed');
  disk.value.settings.adjudicator.model = 'changed';
  await assert.rejects(store.verifyPersisted(first.writeId), /persisted_content_mismatch/);
  disk.value = createConfigEnvelope();
  await assert.rejects(store.save(createConfigEnvelope({}, { previous: first }), first.writeId), /config_conflict/);
  assert.equal(fields.xybattleConfig.writeId, first.writeId);
});

test('invalidation during delayed host readiness prevents old writes', async () => {
  const { store, fields } = fixture();
  let release;
  store.hostReady = () => new Promise(resolve => { release = resolve; });
  const pending = store.save(createConfigEnvelope(), null);
  await new Promise(resolve => setTimeout(resolve, 0));
  store.invalidate(); release();
  await assert.rejects(pending, /stale_host_context/);
  assert.equal(Object.hasOwn(fields, 'xybattleConfig'), false);
});

test('host readiness is required and bounded; no fallback to browser storage', async () => {
  await assert.rejects(new HostConfigStore().ready(), /host_ready_signal_required/);
  await assert.rejects(new HostConfigStore({ hostReady: () => new Promise(() => {}), timeoutMs: 5 }).ready(), /host_not_ready/);
});

test('local sources remain separate and raw data is preserved with redacted preview', () => {
  const entries = new Map([['battle_v2.settings', JSON.stringify({ adjudicator: { model: 'one' }, characterCompletionPrompt: '  custom\n' })],
    ['battle_v2.settings.old-chat', JSON.stringify({ adjudicator: { model: 'two' } })],
    ['xybattle.credentials.v1', JSON.stringify({ adjudicator: { apiKey: 'SECRET' } })], ['unrelated.settings', 'bad']]);
  const storage = { length: entries.size, key: index => [...entries.keys()][index], getItem: key => entries.get(key) ?? null };
  const sources = scanLocalConfig(storage);
  assert.equal(sources.length, 2);
  assert.equal(sources[0].raw, entries.get('battle_v2.settings'));
  assert.equal(runtimeConfig(migrationEnvelope(sources[0])).characterCompletionPrompt, '  custom\n');
  assert.equal(migrationEnvelope(sources[0]).migration.status, 'pending');
  assert.equal(migrationPreview(sources[0]).apis.adjudicator.hasCredential, true);
  assert.doesNotMatch(JSON.stringify(migrationPreview(sources[0])), /SECRET/);
  assert.equal(entries.size, 4);
});

test('server reader projects only namespace and rejects bad response without body leakage', async () => {
  const envelope = createConfigEnvelope();
  const reader = createServerConfigReader({ contextProvider: () => ({ getRequestHeaders: () => ({}) }),
    fetchImpl: async () => ({ ok: true, json: async () => ({ settings: JSON.stringify({ extension_settings: { xybattleConfig: envelope, other: 'SECRET' } }) }) }) });
  assert.deepEqual(await reader(), { kind: 'present', envelope });
  const invalid = createServerConfigReader({ contextProvider: () => ({ getRequestHeaders: () => ({}) }), fetchImpl: async () => { throw new Error('SECRET'); } });
  await assert.rejects(invalid(), error => error.code === 'server_read_failed' && !error.message.includes('SECRET'));
});

test('controller uses loaded host configuration, blocks all request lanes, and never writes legacy settings', async () => {
  const f = fixture();
  const legacy = new Map([['battle_v2.settings', JSON.stringify({ adjudicator: { model: 'obsolete' } })]]);
  const storage = { getItem: key => legacy.get(key), setItem: (key, value) => legacy.set(key, value) };
  const initial = createConfigEnvelope({ adjudicator: { model: 'host', apiKey: 'private' } });
  f.fields.xybattleConfig = initial;
  const controller = new BattleController({ storage, initialSettings: runtimeConfig(initial), configEnvelope: initial, configStore: f.store });
  controller.eventOperationLock = new EventOperationLock({ locks: null });
  assert.equal(controller.settings.adjudicator.model, 'host');
  for (const field of ['inFlight', 'preparationAbort']) {
    controller[field] = {};
    await assert.rejects(controller.setSettings({ adjudicator: { model: 'bad' } }), /不能保存/);
    controller[field] = null;
  }
  controller.configBusy = () => true;
  await assert.rejects(controller.setSettings({}), /不能保存/);
  controller.configBusy = () => false;
  let release;
  const original = f.helper.replaceVariables;
  f.helper.replaceVariables = async (...args) => { await new Promise(resolve => { release = resolve; }); original(...args); };
  const pending = controller.setSettings({ adjudicator: { model: 'new' } });
  while (!release) await new Promise(resolve => setTimeout(resolve, 1));
  assert.throws(() => controller.assertIdleRequest(), /保存配置/);
  await assert.rejects(controller.eventOperationLock.acquire('test', 'daily'), /另一项事务/);
  await assert.rejects(controller.setSettings({}), /不能保存/);
  assert.equal(controller.settings.adjudicator.model, 'host');
  release();
  assert.equal((await pending).status, 'submitted');
  assert.equal(controller.settings.adjudicator.model, 'new');
  assert.equal(controller.settings.adjudicator.apiKey, 'private');
  assert.equal(JSON.parse(legacy.get('battle_v2.settings')).adjudicator.model, 'obsolete');
  assert.equal(legacy.has('xybattle.credentials.v1'), false);
  const before = controller.settings;
  controller.importData({ state: controller.state, settings: { adjudicator: { model: 'imported' } } });
  assert.equal(controller.settings, before);
  controller.dispose();
});

test('failed submission preserves runtime; entry activation failure is separate from successful submission', async () => {
  const f = fixture();
  const controller = new BattleController({ storage: null, configStore: f.store, initialSettings: {} });
  const original = f.helper.replaceVariables;
  f.helper.replaceVariables = () => { throw new Error('private'); };
  const old = controller.settings;
  await assert.rejects(controller.setSettings({ adjudicator: { model: 'new' } }), /submission_unconfirmed/);
  assert.equal(controller.settings, old);
  f.helper.replaceVariables = original;
  controller.applyConfigEntries = async () => { throw new Error('entry unavailable'); };
  const result = await controller.setSettings({ adjudicator: { model: 'new' } });
  assert.equal(result.status, 'submitted');
  assert.equal(result.entryError, true);
  assert.equal(controller.settings.adjudicator.model, 'new');
  controller.dispose();
});

test('malformed credentials alone remain a visible migration error; builtin-looking legacy text remains custom', () => {
  const sources = scanLocalConfig({ length: 1, key: () => 'xybattle.credentials.v1', getItem: () => '{bad' });
  assert.equal(sources[0].error, 'invalid_local_credentials');
  const defaults = runtimeConfig(createConfigEnvelope());
  const migrated = migrationEnvelope({ key: 'battle_v2.settings', settings: defaults });
  assert.equal(migrated.promptPolicy.character.mode, 'custom');
  assert.equal(migrated.settings.characterCompletionPrompt, defaults.characterCompletionPrompt);
});
