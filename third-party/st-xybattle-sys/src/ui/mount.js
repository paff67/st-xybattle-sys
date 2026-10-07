import { createApp } from 'vue';
import App from './App.vue';
import { BattleController } from '../battle-controller.js';
import { BattleHostAdapter } from '../host-adapter.js';
import { createEventRuntime } from '../event-runtime.js';

export function mountBattleSystem({
  documentRef = globalThis.document,
  storage = globalThis.localStorage,
  hostAdapter,
  controller: providedController,
  chatId = 'demo-local',
  branchId = 'main'
} = {}) {
  if (!documentRef) return null;
  if (documentRef.getElementById('xybattle-v2-root')) return globalThis.XYBattle;

  const root = documentRef.createElement('div');
  root.id = 'xybattle-v2-root-wrapper';
  documentRef.body.appendChild(root);

  try {
    const cssHref = new URL(['..', '..', 'style.css'].join('/'), import.meta.url).href;
    if (!documentRef.querySelector(`link[href*="style.css"]`)) {
      const link = documentRef.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssHref;
      documentRef.head.appendChild(link);
    }
  } catch {}

  const host = hostAdapter || (globalThis.SillyTavern?.getContext ? new BattleHostAdapter({ contextProvider: () => globalThis.SillyTavern.getContext() }) : null);
  // Keep the battle bootstrap opt-in: the default registry is the existing
  //叠浪玄潮诀 demo only. Catalogue entries are loaded by the content library
  // and applied to a new battle explicitly by the user.
  const controller = providedController || new BattleController({ storage, chatId, branchId, hostAdapter: host });
  const events = globalThis.SillyTavern?.getContext ? createEventRuntime({ controller }) : null;
  if (events && controller.settings?.eventAutoEnabled) {
    const judge = controller.settings.adjudicator;
    if (judge?.mode === 'http' && judge.endpoint && judge.model) {
      try {
        events.configureAutomaticAdjudication({ endpoint: judge.endpoint, model: judge.model, apiKey: judge.apiKey || '',
          requestTimeoutMs: judge.timeoutMs, totalTimeoutMs: Math.max(judge.timeoutMs * 4, 120000), maxOutput: judge.maxOutput });
        void events.enable().catch(error => console.warn('[xybattle] 自动事务入口未能恢复:', error));
      } catch (error) { console.warn('[xybattle] 自动事务入口配置无效:', error); }
    }
  }

  const app = createApp(App, {
    controller,
    hostAdapter: host,
    events
  });

  const vm = app.mount(root);

  const api = {
    controller,
    events,
    root,
    app,
    vm,
    open: () => vm.open?.(),
    close: () => vm.close?.(),
    render: () => { controller.emit(); },
    destroy: () => {
      events?.destroy();
      controller.dispose();
      app.unmount();
      root.remove();
      delete globalThis.XYBattle;
    }
  };

  globalThis.XYBattle = api;
  return api;
}
