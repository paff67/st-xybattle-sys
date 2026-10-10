import test from 'node:test';
import assert from 'node:assert/strict';
import { OperationLogger, operationLog, bindTrace } from '../src/operation-log.js';
import { createCharacterJsonRequest, createHttpCharacterInference } from '../src/character-source-adapters.js';
import { BattleController } from '../src/battle-controller.js';
import { ContentStore } from '../src/content-store.js';
import { importContent } from '../src/content-importer.js';
import { readFile } from 'node:fs/promises';
import { MockAdjudicator } from '../src/adapters.js';

test('logger bounds UTF-8 bytes, rows, depth, cycles and never executes accessors or exports credentials', () => {
  const logger = new OperationLogger({ maxRecords: 12, maxBytes: 4000, maxRecordBytes: 1000, secrets: () => ['unique-secret'] });
  const value = { cookie: 'session-cookie-private', apiKey: 'unique-secret', body: 'full prompt', rawResponse: 'full reply', nested: { password: 'password' } };
  value.self = value; Object.defineProperty(value, 'boom', { enumerable: true, get() { throw new Error('getter executed'); } });
  value.exception = new Error('unique-secret full prompt');
  for (let i = 0; i < 4000; i++) logger.emit({ data: value, message: '中文 unique-secret ' + i });
  assert.ok(logger.snapshot().length <= 12); assert.ok(logger.totalBytes <= 4000); assert.ok(logger.dropped > 0);
  for (const row of logger.snapshot()) assert.ok(Buffer.byteLength(JSON.stringify(row)) <= 1000);
  assert.doesNotMatch(logger.export(), /unique-secret|session-cookie-private|full prompt|full reply|getter executed/);
  logger.secrets = () => { throw new Error('broken logger'); };
  assert.doesNotThrow(() => logger.emit({ data: value }));
});

test('collection levels, subscriptions, batching and display snapshots are independent', async () => {
  const logger = new OperationLogger({ batchMs: 1, maxRecords: 10 }); let notifications = 0;
  const unsub = logger.subscribe(() => notifications++);
  logger.emit({ level: 'DEBUG' }); assert.equal(logger.snapshot().length, 0);
  logger.debug = true; logger.emit({ level: 'DEBUG' });
  const pausedSnapshot = logger.snapshot();
  for (let i = 0; i < 500; i++) logger.emit({ level: i % 2 ? 'ERROR' : 'INFO' });
  await new Promise(resolve => setTimeout(resolve, 5));
  assert.equal(notifications, 1); assert.equal(pausedSnapshot.length, 1); assert.equal(logger.snapshot().length, 10);
  assert.equal(JSON.parse(logger.export()).records.length, 10);
  logger.enabled = false; logger.emit({ level: 'ERROR' }); assert.equal(logger.snapshot().length, 10);
  unsub(); assert.equal(logger.listeners.size, 0);
});

test('real model request entry distinguishes request, parse, timeout and cancellation without raw payload', async () => {
  for (const scenario of ['success','http','parse','timeout','cancel']) {
    const logger = new OperationLogger(), trace = logger.start('model-test'), abort = new AbortController(); bindTrace(abort.signal, trace);
    const request = createCharacterJsonRequest({ endpoint: 'https://example.invalid', model: 'fixture', timeoutMs: 8,
      fetchImpl: async () => scenario === 'timeout' || scenario === 'cancel' ? new Promise(() => {}) : ({ ok: scenario !== 'http', status: scenario === 'http' ? 503 : 200,
        json: async () => { if (scenario === 'parse') throw new SyntaxError('raw private response'); return { choices:[{message:{content:'{"ok":true}'}}] }; } }) });
    const pending = request('private prompt', { text:'private chat' }, 8, abort.signal);
    if (scenario === 'cancel') abort.abort();
    if (scenario === 'success') { await pending; trace.end('success'); }
    else { await assert.rejects(pending); trace.end(scenario === 'cancel' ? 'cancelled' : 'failed'); }
    const rows = logger.snapshot(); assert.equal(rows.at(-1).stage, 'end');
    if (scenario === 'parse') assert.ok(rows.some(r => r.stage === 'request' && r.status === 'success') && rows.some(r => r.data.code === 'PARSE_FAILED'));
    if (scenario === 'timeout') assert.ok(rows.some(r => r.data.code === 'TIMEOUT'));
    assert.doesNotMatch(logger.export(), /private prompt|private chat|raw private response/);
  }
});

test('concurrent requests and inference retries retain separate runs and explicit attempts', async () => {
  const logger = new OperationLogger();
  const traces = [logger.start('characters', { chatId:'A', branchId:'one' }),logger.start('characters', { chatId:'B', branchId:'two' })];
  await Promise.all(traces.map(async trace => {
    let count = 0; const abort = new AbortController(); bindTrace(abort.signal,trace);
    const inference = createHttpCharacterInference({ endpoint:'https://example.invalid',maxRetries:1,
      fetchImpl:async()=>({ok:true,status:200,json:async()=>{ if (++count === 1) throw new SyntaxError('bad'); return {choices:[{message:{content:'{"candidates":[],"scene":{}}'}}]}; }}) });
    await inference.inferParticipants({recentMessages:[]},{signal:abort.signal}); trace.end('success');
  }));
  for (const trace of traces) {
    const rows=logger.snapshot().filter(r=>r.runId===trace.runId);
    assert.deepEqual(rows.filter(r=>r.stage==='request'&&r.status==='running').map(r=>r.data.attempt),[1,2]);
    assert.equal(new Set(rows.map(r=>r.chatId)).size,1); assert.equal(rows.at(-1).status,'success');
  }
});

test('controller and content business entries emit real operation logs without serializing game state', async () => {
  operationLog.clear();
  const controller = new BattleController({storage:null,credentialStorage:null});
  controller.setSettings({mode:'mock',autoNarrative:false}); controller.start();
  await controller.submit({actionId:'logging-test',label:'秘密行动正文'});
  const content = JSON.parse(await readFile(new URL('../sample-data/dielang-xuanchaojue.json',import.meta.url),'utf8'));
  const store = new ContentStore({memory:true,dbName:'operation-log-test',localStorage:null});
  await importContent(content,{store});
  const rows=operationLog.snapshot();
  assert.ok(rows.some(r=>r.module==='battle-adjudication'&&r.stage==='commit'&&r.data.committed));
  assert.ok(rows.some(r=>r.module==='content-import'&&r.stage==='commit'&&r.status==='success'));
  assert.doesNotMatch(operationLog.export(),/秘密行动正文/);
  controller.dispose();
});

test('post-commit narrative failure keeps commit logs and a failed terminal; retry does not rejudge',async()=>{
  operationLog.clear(); const judge=new MockAdjudicator();
  const controller=new BattleController({storage:null,credentialStorage:null});
  controller.setSettings({mode:'mock'});
  controller.setAdapters({adjudicator:judge,narrator:{async generate(){throw new Error('private upstream reply');}}});
  controller.start();
  try {
    await assert.rejects(controller.submit({actionId:'post-commit',label:'private action'}));
    const rows=operationLog.snapshot().filter(r=>r.module==='battle-adjudication');
    assert.ok(rows.some(r=>r.stage==='commit'&&r.data.committed));
    assert.ok(rows.some(r=>r.stage==='narrative'&&r.status==='failed'));
    assert.equal(rows.at(-1).stage,'end');assert.equal(rows.at(-1).status,'failed');assert.equal(rows.at(-1).data.committed,true);
    assert.equal(controller.state.history.at(-1).status,'committed');
    await controller.submit({actionId:'post-commit',label:'private action'});
    assert.equal(judge.calls.length,1);assert.doesNotMatch(operationLog.export(),/private action|private upstream reply/);
  }finally{controller.dispose();}
});

test('controller validation failure has no commit; two controller credentials remain redacted',async()=>{
  operationLog.clear();
  const a=new BattleController({storage:null,credentialStorage:null}),b=new BattleController({storage:null,credentialStorage:null});
  try {
    a.setSettings({mode:'mock'});b.setSettings({mode:'mock'});
    a.settings.adjudicator.apiKey='credential-A-unique';b.settings.adjudicator.apiKey='credential-B-unique';
    a.setAdapters({adjudicator:{isMock:true,async judge(){return {invalid:true};}}});a.start();
    await assert.rejects(a.submit({actionId:'validation',label:'test'}));
    const rows=operationLog.snapshot().filter(r=>r.module==='battle-adjudication');
    assert.ok(rows.some(r=>r.stage==='validation'&&r.status==='failed'));
    assert.ok(!rows.some(r=>r.data.committed));assert.equal(rows.at(-1).status,'failed');
    operationLog.emit({message:'credential-A-unique credential-B-unique'});
    assert.doesNotMatch(operationLog.export(),/credential-[AB]-unique/);
  }finally{a.dispose();b.dispose();}
});

test('native narrative callback links to its committed action run and reports failure separately',async()=>{
  operationLog.clear();const controller=new BattleController({storage:null,credentialStorage:null});
  try {
    controller.setSettings({mode:'mock',autoNarrative:false});controller.start();
    await controller.submit({actionId:'native-callback',label:'test'});
    const original=operationLog.snapshot().find(r=>r.module==='battle-adjudication');
    controller.bridgeQueuedAction='native-callback';
    await controller.recordHostNarrative({scope:controller.state.scope,actionId:'native-callback',status:'stopped'});
    const rows=operationLog.snapshot().filter(r=>r.module==='host-narrative');
    assert.equal(rows.at(-1).status,'failed');assert.equal(rows.at(-1).data.committed,true);
    assert.ok(rows.every(r=>r.parentRunId===original.runId&&r.actionId==='native-callback'));
  }finally{controller.dispose();}
});

test('host configuration save records confirmation and entry failure after commit',async()=>{
  operationLog.clear();const controller=new BattleController({storage:null,credentialStorage:null,configStore:{
    async save(envelope){return {envelope};},async verifyPersisted(){return {status:'confirmed'};},invalidate(){}
  }});
  controller.applyConfigEntries=async()=>{throw new Error('entry failed');};
  try {
    const result=await controller.setSettings({adjudicator:{mode:'mock'}});
    assert.equal(result.entryError,true);
    const rows=operationLog.snapshot().filter(r=>r.module==='configuration');
    assert.ok(rows.some(r=>r.stage==='server-confirmation'&&r.status==='success'));
    assert.ok(rows.some(r=>r.stage==='entry-enable'&&r.status==='failed'));
    assert.equal(rows.at(-1).status,'degraded');assert.equal(rows.at(-1).data.committed,true);
  }finally{controller.dispose();}
});
