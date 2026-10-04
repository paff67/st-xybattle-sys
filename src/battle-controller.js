import { TechniqueRegistry } from './battle-registry.js';
import { MockAdjudicator, MockNarrator, UnconfiguredAdjudicator, UnconfiguredNarrator, HttpJsonAdjudicator, HttpJsonNarrator } from './adapters.js';
import { BattleStorage } from './battle-storage.js';
import { createInitialState, startBattle, stopBattle, nextRound, restoreBattle, judgeAndCommit, rewriteNarrative, getPlayerView } from './battle-state.js';

export function adaptersFromSettings(settings = {}) {
  if (settings.mode === 'mock') return { adjudicator: new MockAdjudicator(), narrator: new MockNarrator() };
  if (settings.mode === 'http') return { adjudicator: new HttpJsonAdjudicator(settings), narrator: new HttpJsonNarrator(settings) };
  return { adjudicator: new UnconfiguredAdjudicator(), narrator: new UnconfiguredNarrator() };
}

function publicLog(value, parentKey = '') {
  if (Array.isArray(value)) return value.map((item) => publicLog(item, parentKey));
  if (!value || typeof value !== 'object') return value;
  const result = {};
  for (const [key, item] of Object.entries(value)) {
    if (key === 'hidden' || key === 'apiKey' || key === 'authorization' || (key === 'resources' && parentKey === 'enemies') || (key === 'techniques' && parentKey === 'enemies')) continue;
    result[key] = publicLog(item, key);
  }
  return result;
}

export class BattleController {
  constructor({ storage, chatId = 'default-chat', branchId = 'main', adjudicator, narrator, hostAdapter, registry = new TechniqueRegistry(), onChange = () => {}, initialScene = {}, initialPlayer, initialEnemies = [], semanticState } = {}) {
    this.storage = storage instanceof BattleStorage ? storage : new BattleStorage(storage, { chatId, branchId }); this.registry = registry; this.settings = this.storage.readSettings();
    const configured = adaptersFromSettings(this.settings); this.adjudicator = adjudicator || configured.adjudicator; this.narrator = narrator || configured.narrator; this.hostAdapter = hostAdapter; this.onChange = onChange; this.epoch = 0; this.inFlight = null;
    const restored = this.storage.readSession(); this.state = restored ? restoreBattle(restored) : createInitialState({ chatId, branchId, registrySnapshot: registry.snapshot(), player: initialPlayer || this.defaultPlayer(), enemies: initialEnemies, ...initialScene, semanticState }); this.logs = this.storage.readLogs();
  }
  defaultPlayer() { return { id: 'player', name: '主角', visibleInfo: '可见', resources: { focus: '由世界规则定义，非固定扣费' }, techniques: [{ registryId: 'gongfa.dielang-xuanchaojue', techniqueIds: this.registry.list()[0]?.techniques.map((item) => item.id) || [] }] }; }
  emit() { this.storage.writeSession(this.state); this.onChange(this.state, getPlayerView(this.state)); }
  log(entry) { this.logs = this.storage.appendLog(entry); }
  setSettings(patch) { this.settings = { ...this.settings, ...patch }; this.storage.writeSettings(this.settings); this.setAdapters(adaptersFromSettings(this.settings)); this.emit(); return this.settings; }
  setAdapters({ adjudicator, narrator } = {}) { if (adjudicator) this.adjudicator = adjudicator; if (narrator) this.narrator = narrator; }
  start() { this.state = startBattle(this.state); this.emit(); return this.state; }
  stop(reason = '用户停止') { this.epoch += 1; this.inFlight?.abort(); this.inFlight = null; this.hostAdapter?.clearScenePacket?.(); this.state = stopBattle(this.state, reason); this.emit(); return this.state; }
  continueNext() { this.state = nextRound(this.state); this.emit(); return this.state; }
  async submit(action) {
    const startEpoch = this.epoch; const abortController = new AbortController(); this.inFlight = abortController;
    const save = async (state) => { if (startEpoch !== this.epoch) return; this.state = state; this.emit(); };
    try {
      const result = await judgeAndCommit(this.state, action, { adjudicator: this.adjudicator, narrator: this.narrator, settings: this.settings, signal: abortController.signal, save, logger: (entry) => { if (startEpoch === this.epoch) this.log(entry); } });
      if (startEpoch !== this.epoch) return { stale: true, state: this.state, deduplicated: true };
      this.state = result.state; this.emit();
      if (this.hostAdapter && !result.stale) {
        try { await this.hostAdapter.persistReceipt?.({ schema: 'battle_v2_receipt', actionId: result.record.actionId, roundId: result.record.roundId, version: result.state.version, adjudication: result.record.adjudication, narrativePacket: result.record.narrativePacket }); await this.hostAdapter.injectScenePacket?.(result.record.narrativePacket); }
        catch (error) { this.log({ kind: 'host_adapter_error', internal: { message: error.message } }); }
      }
      return result;
    } finally { if (this.inFlight === abortController) this.inFlight = null; }
  }
  async rewrite(actionId) {
    const startEpoch = this.epoch; const abortController = new AbortController(); this.inFlight = abortController; const save = async (state) => { if (startEpoch !== this.epoch) return; this.state = state; this.emit(); };
    try { const result = await rewriteNarrative(this.state, actionId, this.narrator, { signal: abortController.signal, save, logger: (entry) => { if (startEpoch === this.epoch) this.log(entry); } }); if (startEpoch !== this.epoch) return { stale: true, state: this.state }; this.state = result.state; this.emit(); this.hostAdapter?.clearScenePacket?.(); return result; } finally { if (this.inFlight === abortController) this.inFlight = null; }
  }
  exportData() { return JSON.stringify({ schema: 'battle_v2_export', exportedAt: new Date().toISOString(), state: this.state, logs: this.logs, settings: { ...this.settings, apiKey: undefined }, registry: this.registry.snapshot() }, null, 2); }
  importData(raw) { const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw; const imported = restoreBattle(parsed.state || parsed); if (imported.scope.chatId !== this.state.scope.chatId || imported.scope.branchId !== this.state.scope.branchId) throw new Error('导入文件作用域与当前聊天/分支不一致'); this.state = imported; this.logs = Array.isArray(parsed.logs) ? parsed.logs : []; this.emit(); return this.state; }
  playerView() { return getPlayerView(this.state); }
  logExport() { return JSON.stringify(this.logs.map((entry) => publicLog(entry)), null, 2); }
}
