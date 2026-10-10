import { storyText } from './story-context.js';
import { withCharacterDeadline } from './character-deadline.js';
import { preparationRegistry, createRuleMemory } from './authoritative-rules.js';
import { rollbackFromAction } from './battle-rollback.js';
import { TechniqueRegistry } from './battle-registry.js';
import { MockAdjudicator, MockNarrator, UnconfiguredAdjudicator, UnconfiguredNarrator, HttpJsonAdjudicator, HttpJsonNarrator, MainStoryNarrator, PacketNarrator, normalizeSettings, characterApiSettings } from './adapters.js';
import { BattleStorage } from './battle-storage.js';
import { readCredentialSettings, writeCredentialSettings } from './credential-store.js';
import { clone, stripSecrets, publicLog, abortIfNeeded } from './common.js';
import { createInitialState, startBattle, stopBattle, nextRound, restoreBattle, judgeAndCommit, rewriteNarrative, getPlayerView } from './battle-state.js';
import { prepareEnemyCandidates, confirmEnemyCandidates, applyConfirmedEnemies, buildCharacterConfirmationPanel } from './character-preparation.js';
import { createHttpCharacterInference, createReadOnlyCharacterSourceAdapters } from './character-source-adapters.js';
import { freezeCoreRules, coreSelectionKey, coreRulesLocked } from './core-rules.js';
import { createConfigEnvelope, runtimeConfig } from './config-schema.js';
import { dailyRuntimeSettings } from './adapters.js';
import { operationLog, observeOperation, observeMethods, bindTrace } from './operation-log.js';
export function adaptersFromSettings(input = {}) {
  const settings = normalizeSettings(input); const a = settings.adjudicator; const n = settings.narrator;
  return { adjudicator: a.mode === 'mock' ? new MockAdjudicator() : a.mode === 'http' ? new HttpJsonAdjudicator(a) : new UnconfiguredAdjudicator(), narrator: n.mode === 'mock' ? new MockNarrator() : n.mode === 'http' ? new HttpJsonNarrator(n) : n.mode === 'main_story' ? new MainStoryNarrator() : n.mode === 'packet' ? new PacketNarrator() : new UnconfiguredNarrator() };
}
export class BattleController {
  coreRuleConfig() { return this.hostAdapter?.coreRuleConfig?.() || { characterKey: '', characterName: '', selection: [] }; }
  saveCoreRuleConfig(selection, characterKey) {
    if (coreRulesLocked(this.state) || this.preparationAbort || this.inFlight) throw new Error('战斗或人物准备期间不能修改常驻底则');
    if (!this.hostAdapter?.saveCoreRuleConfig) throw new Error('请在已选择角色卡的酒馆中配置');
    const result = this.hostAdapter.saveCoreRuleConfig(selection, characterKey);
    this.cancelCharacterPreparation();
    this.state = { ...this.state, coreRules: [], coreRulesSelectionKey: null, version: this.state.version + 1 };
    this.emit(); return result;
  }
  constructor({ storage, credentialStorage, initialSettings, configStore, configEnvelope = null, chatId = 'default-chat', branchId = 'main', adjudicator, narrator, hostAdapter, registry = new TechniqueRegistry(), onChange = () => {}, initialScene = {}, initialPlayer, initialEnemies = [], semanticState } = {}) {
    this.configStore = configStore; this.configEnvelope = configEnvelope; this.configurationSaving = false;
    this.storage = storage instanceof BattleStorage ? storage : new BattleStorage(storage,{chatId,branchId}); this.credentialStorage=credentialStorage; this.registry=registry;
    const persistedSettings=initialSettings ?? (configStore ? {} : this.storage.readSettings());
    const credentials=initialSettings || configStore ? {} : readCredentialSettings(this.credentialStorage);
    this.settings=normalizeSettings({...persistedSettings,adjudicator:{...persistedSettings.adjudicator,...credentials.adjudicator},narrator:{...persistedSettings.narrator,...credentials.narrator},characterGenerator:{...persistedSettings.characterGenerator,...credentials.characterGenerator},dailyAdjudicator:{...persistedSettings.dailyAdjudicator,...credentials.dailyAdjudicator}}); const configured=adaptersFromSettings(this.settings); this.adjudicator=adjudicator||configured.adjudicator; this.narrator=narrator||configured.narrator; this.customAdapters={adjudicator,narrator}; this.hostAdapter=hostAdapter; this.onChange=onChange; this.epoch=0; this.inFlight=null; this.checkpoints=Promise.resolve(); this.bridgeQueuedAction=null; this.characterPreparation=null; this.characterPreparationRequest=0;
    this.initialOptions={registrySnapshot:registry.snapshot(),player:initialPlayer||this.defaultPlayer(),enemies:initialEnemies,...initialScene,semanticState}; const restored=hostAdapter?null:this.storage.readSession(); this.state=restored?restoreBattle(restored):createInitialState({...this.initialOptions,chatId,branchId}); if(restored)this.registry=new TechniqueRegistry(this.state.registrySnapshot); this.logs=this.storage.readLogs();
    this.operationRuns = new Map();
    this.ready=Promise.resolve(); if(hostAdapter){hostAdapter.start?.();this.unsubScope=hostAdapter.subscribeScopeChange?.((scope)=>{this.ready=this.switchScope(scope);});this.unsubNarrative=hostAdapter.subscribeNarrative?.((result)=>this.recordHostNarrative(result));this.unsubTranscript=hostAdapter.subscribeTranscriptChange?.(()=>{this.ready=this.reconcileTranscript();return this.ready;});this.unsubSent=hostAdapter.subscribePacketSent?.((event)=>this.recordPacketSent(event));this.ready=this.initializeHost();}
    this.unregisterLogSecrets = operationLog.registerSecrets(() => this.secrets());
    observeMethods(this, 'configuration', ['saveCoreRuleConfig'], () => ({ chatId: this.state.scope.chatId, branchId: this.state.scope.branchId }));
    observeMethods(this, 'battle', ['start', 'stop', 'continueNext', 'confirmCharacters', 'applyContentEntries', 'importData', 'importScene', 'importRegistry', 'switchScope', 'reconcileTranscript', 'skipPendingNarrative', 'recordPacketSent'], () => ({ chatId: this.state.scope.chatId, branchId: this.state.scope.branchId }));
  }
  recordPacketSent(event) {
    if (event.scope.chatId !== this.state.scope.chatId || event.scope.branchId !== this.state.scope.branchId) return;
    const record = this.state.history.find((item) => item.actionId === event.actionId);
    if (!record || record.storyLink?.transport === 'input-box') return;
    record.storyLink = { transport: 'input-box', sent: true };
    this.emit();
  }
  async reconcileTranscript() {
    if (!this.hostAdapter?.hasSentPacket) return;
    const scope = this.hostAdapter.scope();
    if (!scope.available || scope.chatId !== this.state.scope.chatId || scope.branchId !== this.state.scope.branchId) return;
    const index = this.state.history.findIndex((record) => {
      if (!['committed', 'complete'].includes(record.status)) return false;
      const sent = record.storyLink?.sent && record.storyLink.transport === 'input-box';
      const legacySent = !record.storyLink && record.narrative?.metadata?.source === 'SillyTavern normal generation' && !this.hostAdapter.hasNarrative(record);
      return (sent || legacySent) && !this.hostAdapter.hasSentPacket(record);
    });
    if (index < 0) return;
    this.cancelPending();
    this.hostAdapter.clearScenePacket();
    this.state = rollbackFromAction(this.state, index);
    this.registry = new TechniqueRegistry(this.state.registrySnapshot);
    this.log({ kind: 'host_message_rollback', actionId: this.state.rollback.removedActionIds[0], capability: this.state.rollback });
    this.emit();
    await this.checkpoints;
  }
  defaultPlayer(){const entry=this.registry.findEntry?.('gongfa.dielang-xuanchaojue')||this.registry.list().find((item)=>item.id==='gongfa.dielang-xuanchaojue')||this.registry.list()[0];return{id:'player',name:'主角',visibleInfo:'导入真实场景后再裁定',resources:{},techniques:entry?[{registryId:entry.id,techniqueIds:entry.techniques.map((item)=>item.id)}]:[]};}
  async initializeHost(){await this.hostAdapter.ready?.();await this.switchScope(this.hostAdapter.scope?.()||this.state.scope,false);await this.reconcileTranscript();return this;}
  async switchScope(scope, cancel = true) {
    if (cancel) { this.cancelPending(); this.cancelCharacterPreparation(); this.hostAdapter?.clearScenePacket?.(); }
    const chatId = String(scope?.chatId || this.state.scope.chatId), branchId = String(scope?.branchId || 'main');
    const previousStorage = this.storage;
    const changed = this.state.scope.chatId !== chatId || this.state.scope.branchId !== branchId || this.state.scope.messageUid !== scope.messageUid;
    this.storage = this.storage.withScope({ chatId, branchId, messageUid: scope.messageUid });
    let cached = this.storage.readSession();
    // Migrate only a proven identical anchor. Keep old floor-only caches intact
    // for recovery; never attach them to a replacement assistant at that index.
    const legacy = previousStorage.withScope({ chatId, branchId }).readSession();
    if (!cached && scope.messageUid && legacy?.scope?.messageUid === scope.messageUid) cached = legacy;
    if (cached && scope.messageUid && cached.scope?.messageUid !== scope.messageUid) cached = null;
    if (scope.available === false || changed) {
      this.cancelCharacterPreparation();
      this.state = cached && scope.available !== false ? restoreBattle(cached) : createInitialState({ ...this.initialOptions, chatId, branchId });
      this.logs = cached ? this.storage.readLogs() : [];
    }
    if (scope.available === false) {
      this.state.hostSync = { status: 'unavailable', reason: null };
      this.registry = new TechniqueRegistry(this.state.registrySnapshot);
      this.emit({ persistHost: false }); return;
    }
    const epoch = this.epoch;
    const loaded = await this.hostAdapter?.loadSession?.(scope);
    if (epoch !== this.epoch) return;
    if (loaded?.loaded && loaded.state) {
      const hostState = restoreBattle(loaded.state);
      if (!cached || hostState.sessionId === this.state.sessionId && hostState.version >= this.state.version || Date.parse(hostState.updatedAt) > Date.parse(this.state.updatedAt)) this.state = hostState;
      else this.log({ kind: 'host_local_ahead', capability: { reason: '本地 checkpoint 比宿主新，将重试持久化' } });
    }
    this.state.scope = { ...this.state.scope, ...scope };
    const pendingStory = this.state.history.at(-1);
    if (this.state.phase !== 'ended' && pendingStory?.narrative?.pending && pendingStory.narrative.metadata?.mode === 'main_story') this.bridgeQueuedAction = pendingStory.actionId;
    this.registry = new TechniqueRegistry(this.state.registrySnapshot);
    this.emit(); await this.reconcileTranscript();
  }
  assertPrepared() {
    if (this.hostAdapter && (this.state.characterPreparation?.status !== 'confirmed' || this.state.characterPreparation?.profileSchema !== 'battle_combat_profile_v2')) throw new Error('请先通过开始战斗生成并确认本场人物资料');
  }
  emit({persistHost=true}={}){this.storage.writeSession(stripSecrets(this.state,this.secrets()));this.onChange(this.state,getPlayerView(this.state));if(this.hostAdapter&&persistHost){const state=clone(this.state),scope=clone(this.hostAdapter.scope?.()||this.state.scope),epoch=this.epoch;if(scope.available===false)return;this.checkpoints=this.checkpoints.catch(()=>{}).then(async()=>{if(epoch!==this.epoch)return{persisted:false,confirmed:false,stale:true};const result=await this.persistToHost(null,state,scope);if(epoch===this.epoch&&this.state.version===state.version){this.state.hostSync={status:result?.persisted&&result?.confirmed?'confirmed':'pending',reason:result?.reason||null};this.storage.writeSession(stripSecrets(this.state,this.secrets()));this.onChange(this.state,getPlayerView(this.state));}return result;});}}
  secrets(){return[this.settings.adjudicator.apiKey,this.settings.narrator.apiKey,this.settings.characterGenerator.apiKey,this.settings.dailyAdjudicator.apiKey];}
  log(entry){try { this.logs=this.storage.appendLog(operationLog.sanitize(stripSecrets(entry,this.secrets()))); } catch { /* logs cannot interrupt commits */ }}
  rememberRun(scope, actionId, runId) {
    const key = JSON.stringify([scope?.chatId,scope?.branchId,actionId]); this.operationRuns.set(key,runId);
    if (this.operationRuns.size > 200) this.operationRuns.delete(this.operationRuns.keys().next().value);
  }
  runFor(scope, actionId) { return this.operationRuns.get(JSON.stringify([scope?.chatId,scope?.branchId,actionId])); }
  traceBattleEntry(trace, entry) {
    if (!trace) return;
    if (entry.actionId) { trace.identify({ actionId: entry.actionId }); this.rememberRun(this.state.scope, entry.actionId, trace.runId); }
    if (entry.kind === 'commit') trace.result.committed = true;
    const stage = entry.kind === 'adjudication_failed' ? (entry.code === 'PARSE_FAILED' ? 'parse' : 'request') : ({ adjudication_request: 'context', model_request: 'request', model_response: 'request', ai_raw_response: 'parse', program_validation: 'validation', commit: 'commit', narrative_result: 'narrative', rewrite: 'narrative', narrative_packet: 'narrative', narrative_failed: 'narrative' })[entry.kind] || entry.kind;
    const failed = entry.kind === 'adjudication_failed' || entry.kind === 'narrative_failed' || entry.validation?.valid === false || entry.metadata?.status >= 400;
    trace.write(stage, failed ? 'failed' : entry.narrative?.pending ? 'skipped' : entry.kind === 'model_request' ? 'running' : 'success', entry.kind,
      { actionId: entry.actionId, attempt: entry.repairAttempt ?? entry.validation?.repairAttempt, httpStatus: entry.metadata?.status, committed: entry.kind === 'commit', code: entry.code || (failed ? 'VALIDATION_FAILED' : undefined) }, failed ? 'ERROR' : 'INFO');
  }
  setSettings(patch, options){if(!this.configStore)return observeOperation('configuration',{chatId:this.state.scope.chatId,operation:'local-settings-save'},trace=>{const result=this.setSettingsLocal(patch);trace.write('commit','success','本机配置保存完成',{committed:true,confirmedByServer:false});return result;});if(this.configStore)return observeOperation('configuration', { chatId: this.state.scope.chatId, operation: options?.migration ? 'migration' : 'settings-save' }, trace => this.saveSettings(patch, { ...options, trace }));}
  setSettingsLocal(patch){if(this.inFlight||this.preparationAbort)throw new Error('请求中不能更换模型设置');const merged={...this.settings,...patch};if(patch.adjudicator)merged.adjudicator={...this.settings.adjudicator,...patch.adjudicator};if(patch.narrator)merged.narrator={...this.settings.narrator,...patch.narrator};if(patch.characterGenerator)merged.characterGenerator={...this.settings.characterGenerator,...patch.characterGenerator};if(patch.dailyAdjudicator)merged.dailyAdjudicator={...this.settings.dailyAdjudicator,...patch.dailyAdjudicator};if(patch.dailyPrompts)merged.dailyPrompts={...this.settings.dailyPrompts,...patch.dailyPrompts,modules:{...this.settings.dailyPrompts.modules,...patch.dailyPrompts.modules}};if(patch.mode!==undefined){delete merged.adjudicator;delete merged.narrator;}this.settings=normalizeSettings(merged);this.storage.writeSettings(this.settings);writeCredentialSettings(this.settings,this.credentialStorage);this.setAdapters(adaptersFromSettings(this.settings));this.emit();return this.settings;}
  async saveSettings(patch, { baseWriteId = this.configEnvelope?.writeId ?? null, promptPolicy, migration, credentials, trace } = {}) {
    if (this.configurationSaving || this.inFlight || this.preparationAbort || this.eventOperationLock?.owner || this.configBusy?.()) throw new Error('战斗、人物或非战斗事务处理中，不能保存配置');
    if (baseWriteId !== (this.configEnvelope?.writeId ?? null)) throw new Error('config_conflict');
    const envelope = createConfigEnvelope(patch, { previous: this.configEnvelope, promptPolicy, migration, credentials });
    const settings = runtimeConfig(envelope);
    if (settings.eventAutoEnabled) dailyRuntimeSettings(settings);
    this.configurationSaving = true;
    try {
      return await this.withEventOperationLock(async () => {
        const result = trace ? await trace.span('commit', () => this.configStore.save(envelope, baseWriteId)) : await this.configStore.save(envelope, baseWriteId);
        if (this.disposed) throw new Error('stale_host_context');
        if (trace) trace.result.committed=true;
        this.configEnvelope = result.envelope;
        this.settings = runtimeConfig(result.envelope);
        this.setAdapters(adaptersFromSettings(this.settings));
        let entryError = false;
        try { await this.applyConfigEntries?.(this.settings); } catch { entryError = true; }
        this.emit({ persistHost: false });
        let verification;
        try { verification = await this.configStore.verifyPersisted(envelope.writeId); }
        catch { verification = { status: 'submitted', reason: 'verification_failed' }; }
        trace?.write('server-confirmation', verification.status === 'confirmed' ? 'success' : 'degraded', '配置服务器核对结果', { status: verification.status, writeId: envelope.writeId }, verification.status === 'confirmed' ? 'INFO' : 'WARN');
        if (entryError) trace?.write('entry-enable', 'failed', '配置已提交，但自动入口启用失败', { code: 'UNEXPECTED' }, 'ERROR');
        this.configSaveResult = { ...verification, entryError };
        return this.configSaveResult;
      });
    } finally { this.configurationSaving = false; }
  }
  setAdapters({adjudicator,narrator}={}){if(adjudicator)this.adjudicator=adjudicator;if(narrator)this.narrator=narrator;}
  /** Attach the browser catalogue. It is deliberately not auto-applied. */
  async hydrateContentStore(contentStore) {
    if (!contentStore?.list) throw new Error('内容库不可用');
    this.contentStore = contentStore;
    return contentStore.listRecords ? contentStore.listRecords() : contentStore.list();
  }
  /** Explicitly make selected catalogue entries the next battle registry. */
  applyContentEntries(entries = []) {
    this.assertIdleRequest();
    if (!['idle', 'ended'].includes(this.state.phase)) throw new Error('活动战斗中不能替换本场功法');
    if (!Array.isArray(entries) || !entries.length) throw new Error('至少选择一条内容');
    const incoming = new TechniqueRegistry(entries).snapshot();
    const ids = new Set(incoming.map((entry) => entry.id));
    const merged = [...this.registry.snapshot().filter((entry) => !ids.has(entry.id)), ...incoming];
    const registry = new TechniqueRegistry(merged);
    this.registry = registry;
    this.state = { ...this.state, registrySnapshot: registry.snapshot(), ruleMemory: createRuleMemory(registry.snapshot()), version: this.state.version + 1, updatedAt: new Date().toISOString() };
    this.initialOptions.registrySnapshot = registry.snapshot();
    this.emit();
    return registry.snapshot();
  }
  requestBattleEntry(input) {
    this.entryRequests ||= new Map();
    if (this.entryRequests.has(input.activationId)) return this.entryRequests.get(input.activationId);
    const promise = this.requestBattleEntryOwned(input).finally(() => this.entryRequests.delete(input.activationId));
    this.entryRequests.set(input.activationId, promise);
    return promise;
  }
  async requestBattleEntryOwned(input) {
    await this.ready;
    input.guard?.(); abortIfNeeded(input.signal);
    const previous = this.state.battleEntry;
    if (previous?.activationId === input.activationId && previous.status === 'accepted') {
      if (this.hostAdapter && this.state.hostSync?.status !== 'confirmed') return { status: 'needs_context', reason: '已生成人物资料，但宿主保存仍待确认；请重试保存' };
      this.characterPreparation ||= clone(previous.preparation || null);
      this.onBattleEntry?.({ status: 'accepted' });
      return { status: 'already_accepted', sessionId: this.state.sessionId };
    }
    if (!['idle', 'ended'].includes(this.state.phase) || this.characterPreparation) {
      const sameId = previous?.battlefieldId && previous.battlefieldId !== '无' && previous.battlefieldId === input.after?.战界ID;
      const causal = previous?.parentEventId && [input.parentEventId, input.predecessorEventId].includes(previous.parentEventId);
      if (!sameId && !causal) return { status: 'needs_context', reason: '当前已有战斗，无法证明属于同一战局；请在工作台处理' };
      if (previous?.battlefieldId && input.after?.战界ID && previous.battlefieldId !== input.after.战界ID) return { status: 'needs_context', reason: '当前活动战斗的战界 ID 不同' };
      this.onBattleEntry?.({ status: 'accepted' });
      return { status: 'already_accepted', sessionId: this.state.sessionId };
    }
    if (input.before?.战斗状态 === '进行中') return { status: 'needs_context', reason: '未找到可恢复的同一战斗，请手动确认场景' };
    if (input.message && this.hostAdapter?.selectPreparationSource) {
      this.hostAdapter.selectPreparationSource(input.message);
      await this.ready;
      input.guard?.(); abortIfNeeded(input.signal);
    }
    if (this.state.phase === 'ended') {
      const scope = clone(this.state.scope);
      this.state = createInitialState({ ...this.initialOptions, chatId: scope.chatId, branchId: scope.branchId, registrySnapshot: this.registry.snapshot() });
      this.state.scope = scope;
    }
    this.onBattleEntry?.({ status: 'preparing' });
    try {
      const apply = async operation => {
        const commit = async () => {
          input.guard?.(); abortIfNeeded(input.signal);
          const panel = operation();
          if (!panel?.candidates?.some(candidate => candidate.role !== 'player')) {
            this.characterPreparation = null;
            const error = new Error('当前上下文没有可确认的敌方人物，请补充正文或手动准备');
            error.code = 'needs_context'; throw error;
          }
          this.state.battleEntry = { activationId: input.activationId, status: 'accepted', parentEventId: input.parentEventId,
            battlefieldId: input.after?.战界ID || null, preparation: clone(this.characterPreparation) };
          this.emit(); await this.checkpoints;
          input.guard?.(); abortIfNeeded(input.signal);
          if (this.hostAdapter && this.state.hostSync?.status !== 'confirmed') throw new Error('战斗准备已生成，但宿主保存待确认；请重试保存，不重新生成人物');
          return panel;
        };
        return input.apply ? input.apply(commit) : commit();
      };
      const mvu = input.snapshot ? { getMvuData: () => { input.guard?.(); return clone(input.snapshot); } } : undefined;
      await this.prepareCharacters({ context: input.message ? { sourceMessageId: this.hostAdapter?.context?.()?.chat?.indexOf(input.message) } : undefined, mvu,
        signal: input.signal, guard: input.guard, apply, trace: input.trace });
      this.onBattleEntry?.({ status: 'accepted' });
      return { status: 'accepted', sessionId: this.state.sessionId };
    } catch (error) {
      this.onBattleEntry?.({ status: 'failed', reason: error.message });
      if (error.code === 'needs_context') return { status: 'needs_context', reason: error.message };
      throw error;
    }
  }
  characterConfirmationPanel(){this.characterPreparation ||= clone(this.state.battleEntry?.status === 'accepted' ? this.state.battleEntry.preparation || null : null);return this.characterPreparation ? buildCharacterConfirmationPanel(this.characterPreparation) : null;}
  async prepareCharacters(options = {}) {
    if (options.trace) return this.prepareCharactersLogged(options);
    return observeOperation('characters', { chatId: this.state.scope.chatId, branchId: this.state.scope.branchId }, trace => this.prepareCharactersLogged({ ...options, trace }));
  }
  async prepareCharactersLogged(options = {}) {
    await this.ready;
    const claim = {};
    const acquire = () => {
      if (this.preparationAdmission || this.preparationAbort) throw new Error('人物准备正在进行，请等待或取消');
      this.preparationAdmission = claim;
    };
    const host = this.hostAdapter?.context?.() || {};
    const avatar = host.characters?.[host.characterId]?.avatar || this.state.scope.avatar || '';
    if (this.eventOperationLock) await this.eventOperationLock.queued(`${avatar}:${host.chatId || this.state.scope.chatId}`, 'character-admission', acquire, { signal: options.signal });
    else acquire();
    try { return await this.prepareCharactersOwned(options); }
    finally { if (this.preparationAdmission === claim) this.preparationAdmission = null; }
  }
  async prepareCharactersOwned({ context, mvu, database, inference, signal, guard, apply, trace } = {}) {
    trace?.write('context', 'running', '开始准备角色和场景上下文');
    guard?.(); abortIfNeeded(signal);
    if (this.preparationAbort) throw new Error('人物准备正在进行，请等待或取消');
    this.assertIdleRequest();
    if (!['idle','ended'].includes(this.state.phase)) throw new Error('只能在战斗开始前准备敌方人物');
    const scope = clone(this.hostAdapter?.scope?.() || this.state.scope);
    if (scope.available === false) throw new Error('当前聊天没有可用的助手消息锚点；请先生成新的正文消息。');
    if (scope.chatId !== this.state.scope.chatId || scope.branchId !== this.state.scope.branchId) throw new Error('当前聊天分支已改变');
    const hostContext = this.hostAdapter?.context?.() || {};
    const messageCount = this.settings.characterMessageCount || 20;
    const sourceChat = Number.isInteger(context?.sourceMessageId) ? hostContext.chat.slice(0, context.sourceMessageId + 1) : hostContext.chat;
    const recentMessages = Array.isArray(sourceChat) ? sourceChat.slice(-messageCount).map((message) => ({ role: message.role || (message.is_user ? 'user' : 'assistant'), text: storyText(message.mes || message.message) })) : [];
    const card = hostContext.characters?.[hostContext.characterId];
    const sourceContext = { ...clone(context || {}), scope, recentMessages,
      playerId: this.state.actors.player.id,
      playerCandidate: context?.playerCandidate || context?.player || (!this.hostAdapter && !['主角', '演示主角', 'player'].includes(this.state.actors.player.name) ? this.state.actors.player : undefined),
      persona: { name: hostContext.name1 || '', description: hostContext.powerUserSettings?.persona_description || hostContext.persona?.description || '' },
      characterCard: card ? { name: card.name, description: card.description || card.data?.description, scenario: card.scenario || card.data?.scenario } : undefined,
      registry: this.hostAdapter ? preparationRegistry(this.registry.snapshot()) : this.registry.snapshot(),
      enemies: clone(context?.enemies || (this.hostAdapter ? [] : this.state.actors.enemies)) };
    const configured = characterApiSettings(this.settings);
    let markProgress = () => {};
    const ai = inference || (configured.mode === 'http' && configured.endpoint && configured.model ? createHttpCharacterInference({ endpoint: configured.endpoint, model: configured.model, apiKey: configured.apiKey || '', timeoutMs: configured.timeoutMs, maxRetries: this.settings.characterMaxRetries, maxOutput: this.settings.characterMaxOutput, messageCount, temperature: configured.temperature, characterCompletionPrompt: this.settings.characterCompletionPrompt, onRequestSuccess: () => markProgress() }) : null);
    const adapters = createReadOnlyCharacterSourceAdapters({ mvu, database, inference: ai });
    const epoch = this.epoch;
    const request = ++this.characterPreparationRequest;
    this.characterPreparation = null;
    const abort = new AbortController();
    bindTrace(abort.signal, trace);
    this.preparationAbort = abort;
    const cancel = () => abort.abort();
    signal?.addEventListener('abort', cancel, { once: true });
    try {
      const coreConfig = this.coreRuleConfig();
      const coreRules = await freezeCoreRules(coreConfig.selection, name => this.hostAdapter.readCoreWorldbook(name));
      abortIfNeeded(abort.signal);
      const preparation = await withCharacterDeadline((signal, progress) => {
        trace?.write('context', 'success', '上下文就绪，开始人物资料生成');
        markProgress = progress;
        const source = adapters.inference;
        const tracked = source && Object.fromEntries(['inferParticipants', 'inferCandidates', 'completeCandidate', 'fill', 'fillMissingFields'].filter((key) => typeof source[key] === 'function').map((key) => [key, async (...args) => {
          const result = await source[key](...args);
          progress();
          return result;
        }]));
        return prepareEnemyCandidates(sourceContext, { ...adapters, ...(tracked ? { inference: tracked } : {}), signal, requireProfiles: !!this.hostAdapter, includePlayer: !!this.hostAdapter });
      }, { timeoutMs: configured.timeoutMs, signal: abort.signal, label: '战前人物准备', resetOnProgress: true });
      if (request !== this.characterPreparationRequest || epoch !== this.epoch || this.state.scope.chatId !== scope.chatId || this.state.scope.branchId !== scope.branchId || this.state.scope.messageUid !== scope.messageUid) throw new Error('人物读取期间聊天分支已改变或读取已取消，请重新读取');
      if (this.coreRuleConfig().characterKey !== coreConfig.characterKey || coreSelectionKey(this.coreRuleConfig().selection) !== coreSelectionKey(coreConfig.selection)) throw new Error('底则配置或角色卡在准备期间改变，请重新读取');
      preparation.coreRules = coreRules;
      preparation.coreRulesSelectionKey = coreSelectionKey(coreConfig.selection);
      trace?.write('validation', 'success', '人物候选通过校验，等待用户确认', { candidateCount: preparation.candidates?.length, committed: false });
      const commit = () => { guard?.(); abortIfNeeded(signal); this.characterPreparation = preparation; return this.characterConfirmationPanel(); };
      return apply ? await apply(commit) : commit();
    } finally { signal?.removeEventListener('abort', cancel); if (this.preparationAbort === abort) this.preparationAbort = null; }
  }
  confirmCharacters(edits = {}, options = {}) {
    this.assertIdleRequest();
    if (!this.characterPreparation) throw new Error('请先读取敌方人物资料');
    const scope = this.hostAdapter?.scope?.() || this.state.scope;
    if (scope.chatId !== this.state.scope.chatId || scope.branchId !== this.state.scope.branchId) throw new Error('当前聊天分支已改变');
    const confirmed = confirmEnemyCandidates(this.characterPreparation, edits, options);
    if (this.characterPreparation.coreRulesSelectionKey && this.characterPreparation.coreRulesSelectionKey !== coreSelectionKey(this.coreRuleConfig().selection)) throw new Error('底则配置已改变，请重新准备人物');
    const next = applyConfirmedEnemies(this.state, confirmed);
    next.coreRules = clone(this.characterPreparation.coreRules || []);
    next.coreRulesSelectionKey = this.characterPreparation.coreRulesSelectionKey;
    this.registry = new TechniqueRegistry(next.registrySnapshot);
    this.state = next;
    this.characterPreparation = null;
    if (this.state.battleEntry) delete this.state.battleEntry.preparation;
    this.emit();
    return this.state;
  }
  cancelCharacterPreparation(){this.preparationAbort?.abort();this.preparationAbort=null;this.characterPreparationRequest+=1;this.characterPreparation=null;if(this.state?.battleEntry?.preparation){delete this.state.battleEntry.preparation;this.state.battleEntry.status='cancelled';this.storage.writeSession(stripSecrets(this.state,this.secrets()));}}
  start(){this.assertIdleRequest();if(this.coreRuleConfig().selection.length && this.state.coreRulesSelectionKey!==coreSelectionKey(this.coreRuleConfig().selection))throw new Error('常驻底则尚未加载，请重新准备人物');if(this.characterPreparation?.status && this.characterPreparation.status !== 'confirmed')throw new Error('请先在人物确认页逐项确认全部候选人物');const scope=this.hostAdapter?.scope?.();if(scope?.available===false)throw new Error('当前聊天没有可用的助手消息锚点；请先生成新的正文消息。');this.assertPrepared();this.state=startBattle(this.state);this.emit();return this.state;}
  cancelPending(){this.epoch+=1;this.inFlight?.abort();this.inFlight=null;this.bridgeQueuedAction=null;}
  stop(reason='用户停止'){this.cancelPending();this.hostAdapter?.clearScenePacket?.();this.state=stopBattle({...this.state,history:this.state.history.map((record)=>record.status==='prepared'?{...record,status:'interrupted',error:reason}:record)},reason);this.emit();return this.state;}
  continueNext(options = {}){this.assertIdleRequest();if(this.bridgeQueuedAction)throw new Error('本轮场景包仍等待主剧情生成；请先生成正文或跳过本轮正文');this.state=nextRound(this.state, options);this.emit();return this.state;}
  assertIdleRequest(){if(this.configurationSaving)throw new Error('正在保存配置，请稍后重试');if(this.inFlight)throw new Error('正在处理本轮请求，请等待或停止');}
  async persistToHost(record,state,scope,trace){
    if (!trace) return observeOperation('host-save', { chatId:scope?.chatId, branchId:scope?.branchId, actionId:record?.actionId || state.pending?.actionId || state.history?.at(-1)?.actionId, version:state.version, parentRunId:this.runFor(scope,record?.actionId || state.pending?.actionId || state.history?.at(-1)?.actionId) }, next => this.persistToHost(record,state,scope,next));
    const started=Date.now(); trace.write('host-save','running','开始保存宿主收据');
    const report=result=>{const confirmed=!!(result?.persisted&&result?.confirmed); trace.write('host-save',confirmed?'success':'degraded',confirmed?'宿主保存已确认':'宿主保存未确认',{confirmed,code:confirmed?undefined:'PERSISTENCE_FAILED'},confirmed?'INFO':'WARN',{durationMs:Date.now()-started});return result;};
if(!this.hostAdapter)return report({persisted:true,confirmed:true,localOnly:true});try{const result=await this.hostAdapter.persistReceipt?.(stripSecrets(record,this.secrets()),stripSecrets(state,this.secrets()),scope);this.log({kind:'host_persistence',actionId:record?.actionId,capability:result});return report(result||{persisted:false,confirmed:false,reason:'宿主未返回保存确认'});}catch(error){const result={persisted:false,confirmed:false,reason:error.message};this.log({kind:'host_persistence',capability:result});return report(result);}}
  async queueMainStory(record, scope, trace) {
    if (!trace) return observeOperation('host-narrative-send', { chatId:scope?.chatId, branchId:scope?.branchId, actionId:record.actionId, parentRunId:this.runFor(scope,record.actionId) }, next => this.queueMainStory(record,scope,next));
    trace.result.committed = true;
    if (!this.hostAdapter) return { queued: false, reason: '宿主不可用；可复制场景包或使用独立正文API' };
    if (this.bridgeQueuedAction === record.actionId && this.hostAdapter?.activePacket) return { queued: true, sendRequested: true, deduplicated: true };
    this.bridgeQueuedAction = record.actionId;
    this.state = { ...this.state, phase: 'narrating', pending: { actionId: record.actionId, roundId: record.roundId } };
    this.onChange(this.state, getPlayerView(this.state));
    await this.checkpoints;
    const saved = await this.persistToHost(record, this.state, scope, trace);
    if (this.hostAdapter && (!saved?.persisted || !saved?.confirmed)) {
      this.state.hostSync = { status: 'pending', reason: saved?.reason };
      this.state.phase = 'committed';
      this.storage.writeSession(stripSecrets(this.state, this.secrets()));
      this.log({ kind: 'host_injection', actionId: record.actionId, capability: { queued: false, reason: '宿主保存未确认，已保留本地提交；重试保存不会重新裁定' } });
      return { queued: false, pending: true };
    }
    if (!this.hostAdapter) { this.state.phase = 'committed'; return { queued: false, reason: '宿主不可用；可复制场景包或使用独立正文API' }; }
    try {
      const userAction = [record.action?.label, record.action?.intent].filter((value, index, values) => typeof value === 'string' && value.trim() && values.indexOf(value) === index).join('\n');
      const result = await this.hostAdapter.injectScenePacket?.(record.narrativePacket, scope, { userAction });
      this.log({ kind: 'host_injection', actionId: record.actionId, capability: result });
      trace.write('injection',result?.queued?'success':'failed','场景包注入结果',{queued:!!result?.queued},result?.queued?'INFO':'ERROR');
      if (!result?.queued) { this.state.phase = 'committed'; this.state.lastError = result?.reason || '场景包注入失败'; this.emit(); return result; }
      this.bridgeQueuedAction = record.actionId;
      // Set the action before native send; completion can arrive immediately.
      const send = this.hostAdapter.sendQueuedScenePacket?.(scope) || { requested: false, reason: '宿主不支持自动发送，场景包已保留' };
      this.log({ kind: 'host_auto_send', actionId: record.actionId, capability: send });
      trace.write('narrative',send.requested?'running':'skipped','原生正文发送请求',{requested:!!send.requested});
      this.state.lastError = send.requested ? null : send.reason;
      if (!send.requested) this.state.phase = 'committed';
      this.storage.writeSession(stripSecrets(this.state, this.secrets()));
      this.onChange(this.state, getPlayerView(this.state));
      return { ...result, sendRequested: send.requested, reason: send.reason };
    } catch (error) {
      this.state.phase = 'committed'; this.state.lastError = error.message; this.emit();
      this.log({ kind: 'host_injection', capability: { queued: false, reason: error.message } });
      return { queued: false, reason: error.message };
    }
  }
  async withEventOperationLock(operation) {
    if (!this.eventOperationLock) return operation();
    const context = this.hostAdapter?.context?.();
    const avatar = context?.characters?.[context.characterId]?.avatar || 'local';
    const chatId = context?.chatId || this.state.scope.chatId;
    return this.eventOperationLock.run(`${avatar}:${chatId}`, 'manual-battle', operation);
  }
  async submit(action){return observeOperation('battle-adjudication', { chatId: this.state.scope.chatId, branchId: this.state.scope.branchId, actionId: action?.actionId }, trace => this.withEventOperationLock(() => this.submitUnlocked(action, trace)));}
  async submitUnlocked(action, trace){await this.ready;await this.checkpoints;this.assertPrepared();const existing=action?.actionId?this.state.history.find((record)=>record.actionId===action.actionId):null;if(existing)return{state:this.state,record:clone(existing),deduplicated:true};this.assertIdleRequest();const epoch=this.epoch;const controller=new AbortController();this.inFlight=controller;bindTrace(controller.signal,trace);const scope=clone(this.hostAdapter?.scope?.()||this.state.scope);const save=async(state)=>{if(epoch!==this.epoch)throw new DOMException('作用域已变化','AbortError');this.state=state;this.emit();await this.checkpoints;};
    try{const result=await judgeAndCommit(this.state,action,{adjudicator:this.adjudicator,narrator:this.narrator,settings:this.settings,signal:controller.signal,save,logger:(entry)=>{if(epoch===this.epoch){this.traceBattleEntry(trace,entry);this.log(entry);}},onCommit:async(record,state)=>{if(epoch!==this.epoch)return;const saved=await this.persistToHost(record,state,scope,trace);abortIfNeeded(controller.signal);return{allowed:!this.hostAdapter||!!(saved?.persisted&&saved?.confirmed),reason:saved?.reason};}});if(epoch!==this.epoch)return{stale:true,state:this.state};this.state=result.state;this.emit();await this.checkpoints;const saved=await this.persistToHost(result.record,this.state,scope,trace);if(this.settings.autoNarrative&&this.settings.narrator.mode==='main_story'&&saved?.persisted&&saved?.confirmed)await this.queueMainStory(result.record,scope,trace);else if(this.settings.narrator.mode==='main_story'&&this.hostAdapter)this.state.hostSync={status:'pending',reason:saved?.reason};this.storage.writeSession(stripSecrets(this.state,this.secrets()));this.onChange(this.state,getPlayerView(this.state));return result;}catch(error){if(epoch!==this.epoch||controller.signal.aborted)return{stale:true,state:this.state};throw error;}finally{if(this.inFlight===controller)this.inFlight=null;}}
  async rewrite(actionId){return observeOperation('narrative-rewrite', { chatId: this.state.scope.chatId, branchId: this.state.scope.branchId, actionId }, trace => this.withEventOperationLock(() => this.rewriteUnlocked(actionId, trace)));}
  async rewriteUnlocked(actionId, trace){await this.ready;this.assertIdleRequest();this.hostAdapter?.clearScenePacket?.();const epoch=this.epoch;const controller=new AbortController();this.inFlight=controller;bindTrace(controller.signal,trace);const scope=clone(this.hostAdapter?.scope?.()||this.state.scope);const save=async(state)=>{if(epoch!==this.epoch)throw new DOMException('作用域已变化','AbortError');this.state=state;this.emit();await this.checkpoints;};try{const result=await rewriteNarrative(this.state,actionId,this.narrator,{signal:controller.signal,save,logger:(entry)=>{if(epoch===this.epoch){this.traceBattleEntry(trace,entry);this.log(entry);}},originalPrompt:this.settings.originalPrompt});if(epoch!==this.epoch)return{stale:true,state:this.state};this.state=result.state;await this.persistToHost(result.record,this.state,scope,trace);this.emit();await this.checkpoints;if(this.settings.narrator.mode==='main_story')await this.queueMainStory(result.record,scope,trace);return result;}catch(error){if(epoch!==this.epoch||controller.signal.aborted)return{stale:true,state:this.state};throw error;}finally{if(this.inFlight===controller)this.inFlight=null;}}
  async retryHostPersistence(trace){if(!trace)return observeOperation('host-save-retry',{chatId:this.state.scope.chatId,branchId:this.state.scope.branchId},next=>this.retryHostPersistence(next));await this.checkpoints;const scope=this.hostAdapter?.scope?.()||this.state.scope;const record=this.state.history.filter((item)=>['committed','complete'].includes(item.status)).at(-1);const result=await this.persistToHost(record,this.state,scope,trace);this.state.hostSync={status:result?.persisted&&result?.confirmed?'confirmed':'pending',reason:result?.reason};this.storage.writeSession(stripSecrets(this.state,this.secrets()));if(result?.persisted&&result?.confirmed&&record&&!record.narrative?.text&&record.narrative?.metadata?.mode!=='skipped'&&this.state.phase!=='ended'&&this.settings.narrator.mode==='main_story')await this.queueMainStory(record,scope,trace);this.onChange(this.state,getPlayerView(this.state));return result;}
  skipPendingNarrative(){this.hostAdapter?.clearScenePacket?.();this.bridgeQueuedAction=null;const record=this.state.history.filter((item)=>['committed','complete'].includes(item.status)).at(-1);if(record)record.narrative={...record.narrative,pending:false,metadata:{mode:'skipped',reason:'玩家跳过正文，裁定事实保留'}};this.state={...this.state,phase:'awaiting_next',pending:null,version:this.state.version+1};this.emit();}
  async recordHostNarrative(result,trace){
    if(!trace)return observeOperation('host-narrative',{chatId:result.scope?.chatId,branchId:result.scope?.branchId,actionId:result.actionId,parentRunId:this.runFor(result.scope,result.actionId)},next=>this.recordHostNarrative(result,next));
    if(result.scope?.chatId!==this.state.scope.chatId||result.scope?.branchId!==this.state.scope.branchId||this.bridgeQueuedAction!==result.actionId)return;
    const record=this.state.history.find((item)=>item.actionId===result.actionId);if(!record||!record.narrativePacket)return;
    if(result.transport)record.storyLink={transport:result.transport,sent:result.transport==='input-box'&&result.inputVerified===true};
    const complete=result.status==='complete'&&typeof result.text==='string'&&!!result.text.trim();
    if(complete){this.bridgeQueuedAction=null;record.narrative={text:result.text,metadata:{source:'SillyTavern normal generation'}};record.status='complete';delete record.narrativeError;}
    else record.narrativeError='主剧情生成已停止或未返回正文；裁定事实保留，可重试发送或跳过正文';
    this.state={...this.state,version:this.state.version+1,phase:complete?'awaiting_next':'committed',pending:null,lastError:complete?null:record.narrativeError,updatedAt:new Date().toISOString()};
    trace.result.committed=true; trace.write('narrative',complete?'success':'failed',complete?'原生正文已生成':'正文未完成，裁定事实保留',{committed:true,code:complete?undefined:'NARRATIVE_FAILED'},complete?'INFO':'ERROR');
    this.log({kind:'host_narrative_result',actionId:record.actionId,narrative:record.narrative,capability:{status:result.status}});this.emit();await this.persistToHost(record,this.state,result.scope,trace); trace.end(complete?'success':'failed');
  }
  importScene(input){this.assertIdleRequest();if(!['idle','ended'].includes(this.state.phase))throw new Error('活动战斗中不能导入新场景，请先停止');const data=typeof input==='string'?JSON.parse(input):clone(input);const entries=data.registry||this.registry.snapshot();const registry=new TechniqueRegistry(entries);if(!data.scene||!data.actors?.player||!Array.isArray(data.actors.enemies))throw new Error('场景需 scene、actors.player、actors.enemies');for(const actor of [data.actors.player,...data.actors.enemies])if(!actor.id||!actor.name)throw new Error('角色需id/name');if(new Set([data.actors.player,...data.actors.enemies].map((a)=>a.id)).size!==data.actors.enemies.length+1)throw new Error('角色id重复');this.cancelPending();this.characterPreparationRequest+=1;this.characterPreparation=null;this.hostAdapter?.clearScenePacket?.();const priorVersion=this.state.version;this.registry=registry;this.state=createInitialState({chatId:this.state.scope.chatId,branchId:this.state.scope.branchId,scene:data.scene,player:data.actors.player,enemies:data.actors.enemies,semanticState:data.semanticState,causalState:data.causalState,combatLedger:data.combatLedger,resourceRules:data.resourceRules,registrySnapshot:registry.snapshot()});this.state.version=priorVersion+1;this.logs=[];this.storage.replaceLogs([]);this.emit();return this.state;}
  importRegistry(raw){this.assertIdleRequest();if(!['idle','ended'].includes(this.state.phase))throw new Error('活动战斗中不能替换功法');const input=typeof raw==='string'?JSON.parse(raw):raw;const registry=new TechniqueRegistry(Array.isArray(input)?input:input.registry||[input]);this.registry=registry;this.state={...this.state,registrySnapshot:registry.snapshot(),ruleMemory:createRuleMemory(registry.snapshot()),version:this.state.version+1};this.emit();return registry.snapshot();}
  exportData(){return JSON.stringify(stripSecrets({schema:'battle_v2_export',exportedAt:new Date().toISOString(),state:this.state,logs:this.logs,settings:this.settings,registry:this.registry.snapshot()},this.secrets()),null,2);}
  importData(raw){this.assertIdleRequest();const parsed=typeof raw==='string'?JSON.parse(raw):clone(raw);const state=restoreBattle(parsed.state||parsed);if(state.scope.chatId!==this.state.scope.chatId||state.scope.branchId!==this.state.scope.branchId)throw new Error('导入文件作用域与当前聊天/分支不一致');this.cancelPending();this.hostAdapter?.clearScenePacket?.();this.state={...state,version:Math.max(state.version,this.state.version)+1};this.registry=new TechniqueRegistry(state.registrySnapshot);this.logs=stripSecrets(Array.isArray(parsed.logs)?parsed.logs:[],this.secrets());this.storage.replaceLogs(this.logs);this.emit();return this.state;}
  playerView(){return getPlayerView(this.state);}
  logExport(){return JSON.stringify(this.logs.map(publicLog),null,2);}
  debugLogExport(){return operationLog.export();}
  dispose(){this.unregisterLogSecrets?.();this.disposed=true;this.configStore?.invalidate();this.cancelPending();this.cancelCharacterPreparation();this.unsubScope?.();this.unsubNarrative?.();this.unsubTranscript?.();this.unsubSent?.();this.hostAdapter?.dispose?.();}
}
