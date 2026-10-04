import { createApp } from 'vue';
import App from './App.vue';
import { BattleController } from '../battle-controller.js';
import { BattleHostAdapter } from '../host-adapter.js';

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
    const cssHref = new URL('../../style.css', import.meta.url).href;
    if (!documentRef.querySelector(`link[href*="style.css"]`)) {
      const link = documentRef.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssHref;
      documentRef.head.appendChild(link);
    }
  } catch {}

  const host = hostAdapter || (globalThis.SillyTavern?.getContext ? new BattleHostAdapter({ contextProvider: () => globalThis.SillyTavern.getContext() }) : null);
  const controller = providedController || new BattleController({ storage, chatId, branchId, hostAdapter: host });

  const app = createApp(App, {
    controller,
    hostAdapter: host
  });

  const vm = app.mount(root);

  const api = {
    controller,
    root,
    app,
    vm,
    open: () => vm.open?.(),
    close: () => vm.close?.(),
    render: () => { controller.emit(); },
    destroy: () => {
      controller.dispose();
      app.unmount();
      root.remove();
      delete globalThis.XYBattle;
    }
  };

  globalThis.XYBattle = api;
  return api;
}
