import { HostEventStore } from './event-store.js';
import { EventOperationLock } from './event-lock.js';
import { EventCoordinator } from './event-coordinator.js';
import { HostGenerationGate } from './host-generation-gate.js';
import { createAutomaticEventPreparation } from './event-preparation.js';
import { createEventCombatPipeline } from './event-combat.js';

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
      coordinator.router = createEventCombatPipeline({ contextProvider, mvu: () => windowRef.Mvu, database: () => windowRef.AutoCardUpdaterAPI, ...config });
      coordinator.timeoutMs = timeoutMs;
      return { mode: 'automatic-adjudication', executableDomains: ['combat'], liveVerified: false, enabled: gate.enabled };
    },
    enable: () => gate.setEnabled(true), disable: () => gate.setEnabled(false),
    retryPersistence: () => coordinator.retryPersistence(),
    recover: () => coordinator.recover(),
    destroy() { gate.dispose(); if (controller?.eventOperationLock === lock) controller.eventOperationLock = null; },
  };
}
