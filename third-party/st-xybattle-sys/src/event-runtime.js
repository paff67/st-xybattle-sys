import { HostEventStore } from './event-store.js';
import { EventOperationLock } from './event-lock.js';
import { EventCoordinator } from './event-coordinator.js';
import { HostGenerationGate } from './host-generation-gate.js';
import { createAutomaticEventPreparation } from './event-preparation.js';
import { createEventCombatPipeline } from './event-combat.js';
import { createWorkbenchEventRouter, createNarrativeBattleObserver } from './event-workbench.js';

export function createEventRuntime({ contextProvider = () => globalThis.SillyTavern?.getContext(), windowRef = globalThis, controller, ...options } = {}) {
  const lock = options.lock || new EventOperationLock();
  const store = options.store || new HostEventStore({ contextProvider });
  const coordinator = new EventCoordinator({ store, lock, router: options.router, onStatus: options.onStatus, timeoutMs: options.timeoutMs });
  const gate = new HostGenerationGate({ coordinator, contextProvider, windowRef, onStatus: options.onStatus,
    isLegacySend: () => !!controller?.bridgeQueuedAction && !!(controller?.hostAdapter?.packet || controller?.hostAdapter?.activePacket) });
  gate.start();
  if (controller) controller.eventOperationLock = lock;
  return { gate, coordinator, store, lock,
    capability: () => gate.capability(),
    // Explicit development API; there is no production keyword/pass fallback.
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
      coordinator.router = controller ? createWorkbenchEventRouter(configured) : createEventCombatPipeline(configured);
      if (controller) {
        const handoff = async route => {
          const captured = contextProvider(), chat = captured?.chat, chatId = captured?.chatId;
          try {
            await controller.ready;
            if (!gate.enabled || contextProvider()?.chat !== chat || contextProvider()?.chatId !== chatId || route.chatId && route.chatId !== chatId) return;
            await controller.onBattleEntry?.(route);
          }
          catch (error) { coordinator.status('battle_preparation_failed', error.message); }
        };
        gate.onCombatHandoff = handoff;
        const observe = createNarrativeBattleObserver(configured);
        gate.afterNarrative = async completed => {
          if (completed.event.status !== 'passed') return;
          const context = contextProvider(), chat = context.chat, epoch = coordinator.epoch;
          const text = completed.message.mes, swipe = completed.message.swipe_id || 0;
          try {
            const route = await observe(completed);
            if (!route || completed.signal?.aborted || !gate.enabled || epoch !== coordinator.epoch || contextProvider().chat !== chat || !chat.includes(completed.message) || completed.message.mes !== text || (completed.message.swipe_id || 0) !== swipe) return;
            await handoff(route);
          } catch (error) { if (epoch === coordinator.epoch) coordinator.status('battle_observation_failed', error.message); }
        };
      }
      coordinator.timeoutMs = timeoutMs;
      return { mode: controller ? 'battle-workbench-handoff' : 'automatic-adjudication', executableDomains: ['combat'], liveVerified: false, enabled: gate.enabled };
    },
    enable: () => gate.setEnabled(true), disable: () => gate.setEnabled(false),
    retryPersistence: () => coordinator.retryPersistence(),
    recover: () => coordinator.recover(),
    destroy() { gate.dispose(); if (controller?.eventOperationLock === lock) controller.eventOperationLock = null; },
  };
}
