import { HostEventStore } from './event-store.js';
import { EventOperationLock } from './event-lock.js';
import { EventCoordinator } from './event-coordinator.js';
import { HostGenerationGate } from './host-generation-gate.js';
import { createAutomaticEventPreparation } from './event-preparation.js';
import { createEventCombatPipeline } from './event-combat.js';
import { createWorkbenchEventRouter, createNarrativeBattleObserver } from './event-workbench.js';
import { stripSecrets } from './common.js';
import { DAILY_DOMAINS } from './event-daily-prompts.js';
import { freezeCoreRules, coreSelectionKey } from './core-rules.js';
import { isWorldbookAbility, assertWorldbookAbility } from './worldbook-abilities.js';
import { HostMvuObserver } from './host-mvu-observer.js';
import { BattleEntryCoordinator } from './battle-entry-coordinator.js';
import { activationFingerprint, selectedMvu } from './battle-state-observer.js';
import { copyEvent } from './event-state.js';

export function createEventRuntime({ contextProvider = () => globalThis.SillyTavern?.getContext(), windowRef = globalThis, controller, ...options } = {}) {
  const lock = options.lock || new EventOperationLock();
  const store = options.store || new HostEventStore({ contextProvider });
  const listeners = new Set();
  let latest = { status: 'ready' }, secrets = [];
  const inspect = () => {
    let receipts = [];
    try { receipts = Object.values(store.local(store.scope())?.events || {}); } catch { /* No selected chat. */ }
    const task = coordinator.active;
    if (task?.event && task.epoch === coordinator.epoch) receipts = [...receipts.filter(e => e.eventId !== task.event.eventId), task.event];
    let activations = [];
    try { activations = Object.values(store.local(store.scope())?.battleActivation?.records || {}).slice(-80).reverse(); } catch { /* No selected chat. */ }
    return stripSecrets({ ...latest, activations, stateListener: stateObserver?.capability(), receipts: receipts.slice(-80).reverse().map(event => ({ ...event, persistencePending: !!store.pending })), canCancel: !!entry?.active || !!task && !task.finalizing && !task.generating && ['captured', 'routing'].includes(task.event?.status) }, secrets);
  };
  const publish = value => {
    latest = stripSecrets({ ...value, at: new Date().toISOString() }, secrets);
    try { options.onStatus?.(latest); } catch { /* UI observers cannot interrupt transactions. */ }
    for (const listener of listeners) { try { listener(inspect()); } catch { /* Isolate observers. */ } }
  };
  const coordinator = new EventCoordinator({ store, lock, router: options.router, onStatus: publish, timeoutMs: options.timeoutMs });
  const gate = new HostGenerationGate({ coordinator, contextProvider, windowRef, onStatus: publish,
    isLegacySend: () => !!controller?.bridgeQueuedAction && !!(controller?.hostAdapter?.packet || controller?.hostAdapter?.activePacket) });
  gate.start();
  if (controller) controller.eventOperationLock = lock;
  const entry = controller ? new BattleEntryCoordinator({ store, lock, controller, onStatus: publish }) : null;
  const stateObserver = entry ? new HostMvuObserver({ contextProvider, windowRef, coordinator, gate,
    onObservation: input => entry.observe(input), onInvalidate: reason => entry.cancel(reason), onStatus: publish, waitMs: options.mvuWaitMs }) : null;
  const invalidateEntry = () => entry?.cancel('host_context_changed');
  const hostEvents = contextProvider(), entryDisposers = [];
  for (const key of ['MESSAGE_SENT', 'CHAT_CHANGED', 'MESSAGE_SWIPED', 'MESSAGE_EDITED', 'MESSAGE_DELETED', 'GENERATION_STOPPED']) {
    const event = hostEvents?.eventTypes?.[key];
    if (event && hostEvents.eventSource?.on) {
      hostEvents.eventSource.on(event, invalidateEntry);
      entryDisposers.push(() => (hostEvents.eventSource.removeListener || hostEvents.eventSource.off).call(hostEvents.eventSource, event, invalidateEntry));
    }
  }
  return { gate, coordinator, store, lock, entry, stateObserver,
    inspect,
    subscribe(listener) { listeners.add(listener); listener(inspect()); return () => listeners.delete(listener); },
    cancelAdjudication() { if (entry?.cancel()) return true; const skipped = coordinator.skipAdjudication(); if (skipped) gate.clearPacket(); return skipped; },
    cancelBattlePreparation: () => entry?.cancel(),
    setStateListenerEnabled(enabled) { return stateObserver?.setEnabled(enabled); },
    recoverBattleEntries: () => entry?.recover(),
    capability: () => gate.capability(),
    // Explicit development API; there is no production keyword/pass fallback.
    configurationBusy: () => !!coordinator.active || !!entry?.active,
    configureRouter(router) { if (gate.enabled || coordinator.active) throw new Error('请先停用事件入口'); coordinator.router = router; },
    configureAutomaticPreparation(config = {}) {
      if (gate.enabled || coordinator.active) throw new Error('请先停用事件入口');
      const timeoutMs = config.totalTimeoutMs ?? 180000;
      if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new Error('事件准备超时设置无效');
      coordinator.router = createAutomaticEventPreparation({ contextProvider, mvu: () => windowRef.Mvu, database: () => windowRef.AutoCardUpdaterAPI, ...config });
      coordinator.timeoutMs = timeoutMs;
      return { mode: 'automatic-preparation', domainsExecutable: false, liveVerified: false, enabled: gate.enabled };
    },
    configureAutomaticAdjudication(config = {}) {
      if (gate.enabled || coordinator.active) throw new Error('请先停用事件入口');
      const timeoutMs = config.totalTimeoutMs ?? 240000;
      if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new Error('事件裁定超时设置无效');
      const configured = { contextProvider, mvu: () => windowRef.Mvu, database: () => windowRef.AutoCardUpdaterAPI, ...config };
      if (controller && !configured.readDailyDefinitions) configured.readDailyDefinitions = async snapshot => {
        await controller.ready;
        const selected = controller.coreRuleConfig?.() || { selection: [], characterKey: null };
        const selectionKey = coreSelectionKey(selected.selection);
        const coreRules = await freezeCoreRules(selected.selection, name => controller.hostAdapter.readCoreWorldbook(name));
        const current = controller.coreRuleConfig?.() || selected;
        if (current.characterKey !== selected.characterKey || coreSelectionKey(current.selection) !== selectionKey) throw new Error('日常准备期间底则配置已改变');
        // Mention matching retrieves definitions only; it never grants ownership.
        const contextText = JSON.stringify(snapshot.sources);
        const abilities = (controller.registry?.snapshot?.() || []).filter(entry => isWorldbookAbility(entry) && (contextText.includes(entry.name) || contextText.includes(entry.id)));
        abilities.forEach(assertWorldbookAbility);
        return { coreRules, abilities: abilities.map(entry => ({ name: entry.name, registryId: entry.id, ...entry.abilitySource })) };
      };
      secrets = [config.apiKey].filter(Boolean);
      coordinator.secrets = secrets;
      coordinator.router = controller ? createWorkbenchEventRouter(configured) : createEventCombatPipeline(configured);
      if (controller) {
        const handoff = async (route, completed) => {
          const captured = contextProvider(), chat = captured?.chat, chatId = captured?.chatId;
          try {
            await controller.ready;
            if (!gate.enabled || contextProvider()?.chat !== chat || contextProvider()?.chatId !== chatId || route.chatId && route.chatId !== chatId) return;
            const scope = store.scope(), event = completed?.event || route;
            const message = completed?.message || [...chat].reverse().find(row => row.is_user === false && !row.is_system);
            const text = message?.mes, swipe = message?.swipe_id || 0;
            const snapshot = copyEvent(selectedMvu(message)), snapshotHash = activationFingerprint(snapshot);
            const inputMessage = completed?.input || chat.at(-1), inputText = inputMessage?.mes;
            const identity = completed ? coordinator.observedIdentity(message) : null;
            await entry.request({ source: completed ? 'narrative-observer' : 'semantic-input', parentEventId: event.eventId,
              requestId: event.requestId, branchUid: event.branchUid, ...identity, message,
              snapshot, messageFingerprint: activationFingerprint([text, swipe, event.requestId]),
              scope, signal: completed?.signal, guard: () => {
                store.assertScope(scope);
                if (activationFingerprint(selectedMvu(message)) !== snapshotHash) throw new DOMException('战斗资料来源已更新', 'AbortError');
                if (!gate.enabled || message && (!chat.includes(message) || message.mes !== text || (message.swipe_id || 0) !== swipe) || chat.at(-1) !== (completed ? message : inputMessage) || inputMessage?.mes !== inputText) throw new DOMException('战斗来源已过期', 'AbortError');
              } });
          }
          catch (error) { coordinator.status('battle_preparation_failed', error.message); }
        };
        gate.onCombatHandoff = handoff;
        const observe = createNarrativeBattleObserver(configured);
        gate.afterNarrative = async completed => {
          if (completed.event.status !== 'passed' || completed.event.reasonCode === 'user_skipped_adjudication') return;
          const context = contextProvider(), chat = context.chat, epoch = coordinator.epoch;
          const text = completed.message.mes, swipe = completed.message.swipe_id || 0;
          try {
            const route = await observe(completed);
            if (!route || completed.signal?.aborted || !gate.enabled || epoch !== coordinator.epoch || contextProvider().chat !== chat || !chat.includes(completed.message) || completed.message.mes !== text || (completed.message.swipe_id || 0) !== swipe) return;
            await handoff(route, completed);
          } catch (error) { if (epoch === coordinator.epoch) coordinator.status('battle_observation_failed', error.message); }
        };
      }
      coordinator.timeoutMs = timeoutMs;
      return { mode: controller ? 'battle-workbench-handoff' : 'automatic-adjudication', executableDomains: ['combat', ...DAILY_DOMAINS], liveVerified: false, enabled: gate.enabled };
    },
    enable: () => gate.setEnabled(true), disable: () => { entry?.cancel('semantic_entry_disabled'); return gate.setEnabled(false); },
    retryPersistence: () => coordinator.retryPersistence(),
    recover: () => coordinator.recover(),
    destroy() { stateObserver?.dispose(); entry?.cancel('destroyed'); for (const dispose of entryDisposers) dispose(); gate.dispose(); listeners.clear(); if (controller?.eventOperationLock === lock) controller.eventOperationLock = null; },
  };
}
