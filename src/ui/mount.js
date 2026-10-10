import { dailyRuntimeSettings } from '../adapters.js';
import { createApp } from 'vue';
import App from './App.vue';
import { BattleController } from '../battle-controller.js';
import { BattleHostAdapter } from '../host-adapter.js';
import { createEventRuntime } from '../event-runtime.js';
import { HostConfigStore, createServerConfigReader } from '../host-config-store.js';
import { runtimeConfig } from '../config-schema.js';
import { scanLocalConfig } from '../config-migration.js';
import { operationLog } from '../operation-log.js';
import { downloadJson } from '../utils.js';

export function mountBattleSystem(options = {}) {
  const documentRef = options.documentRef ?? globalThis.document;
  if (!documentRef) return null;
  if (globalThis.XYBattle) return globalThis.XYBattle;
  if (options.controller || options.offline === true) return mountReadySystem(options);
  const contextProvider = () => globalThis.SillyTavern.getContext();
  const configStore = options.configStore ?? new HostConfigStore({ contextProvider,
    hostReady: async () => {
      // settingsReady is the exported flag observed in ST 1.17.0, before APP_READY.
      const scriptUrl = '/script.js';
      const hostModule = await import(/* @vite-ignore */ scriptUrl);
      if (hostModule.settingsReady) return;
      const deadline = Date.now() + 15000;
      while (!hostModule.settingsReady && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 50));
      if (!hostModule.settingsReady) throw new Error('host_not_ready');
    }, readServer: createServerConfigReader({ contextProvider }) });
  const root = documentRef.createElement('div');
  root.id = 'xybattle-config-loading';
  root.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:10000;background:#171b20;color:#fff;padding:16px;max-width:320px;border:1px solid #59626d;border-radius:6px';
  const message = documentRef.createElement('p'), retry = documentRef.createElement('button');
  retry.textContent = '重试加载'; retry.hidden = true;
  const diagnostic = documentRef.createElement('button'); diagnostic.textContent = '导出启动日志';
  diagnostic.onclick = () => downloadJson('xybattle-startup-log.json', operationLog.export());
  root.append(message, retry, diagnostic); documentRef.body.append(root);
  let mounted, destroyed = false;
  const api = { root, configStore,
    get controller() { return mounted?.controller; }, get events() { return mounted?.events; },
    open: () => mounted ? mounted.open() : root.hidden = false,
    close: () => mounted ? mounted.close() : root.hidden = true,
    render: () => mounted?.render(),
    destroy: () => { destroyed = true; configStore.invalidate(); mounted?.destroy(); root.remove(); delete globalThis.XYBattle; } };
  const load = async () => {
    const trace = operationLog.start('startup');
    retry.hidden = true; message.textContent = '正在读取酒馆配置';
    try {
      const loaded = await trace.span('config-load', () => configStore.load());
      if (destroyed) { trace.end('cancelled'); return; }
      mounted = mountReadySystem({ ...options, configStore, configEnvelope: loaded.envelope ?? null,
        initialSettings: loaded.kind === 'present' ? runtimeConfig(loaded.envelope) : {} });
      root.remove(); globalThis.XYBattle = api;
      await mounted.controller.ready;
      if (loaded.kind === 'missing') mounted.vm.openSettings?.();
      trace.end('success', { configuration: loaded.kind });
      return mounted;
    } catch (error) {
      trace.fail('startup', error); trace.end('failed');
      message.textContent = '酒馆配置读取失败或接口未就绪，请重试。'; retry.hidden = false;
      throw new Error('host_config_load_failed');
    }
  };
  retry.onclick = () => { configStore.invalidate(); api.ready = load(); api.ready.catch(() => {}); };
  globalThis.XYBattle = api;
  api.ready = load(); api.ready.catch(() => {});
  return api;
}

function mountReadySystem({
  documentRef = globalThis.document,
  storage = globalThis.localStorage,
  hostAdapter,
  controller: providedController,
  initialSettings, configStore, configEnvelope,
  chatId = 'demo-local',
  branchId = 'main'
} = {}) {
  if (!documentRef) return null;
  if (documentRef.getElementById('xybattle-v2-root')) return globalThis.XYBattle;

  const root = documentRef.createElement('div');
  root.id = 'xybattle-v2-root-wrapper';
  documentRef.body.appendChild(root);

  // Vite injects styles in development. Production bundles install their own
  // matching CSS; an unrelated host style.css must never suppress this step.

  const host = hostAdapter || (globalThis.SillyTavern?.getContext ? new BattleHostAdapter({ contextProvider: () => globalThis.SillyTavern.getContext() }) : null);
  // Keep the battle bootstrap opt-in: the default registry is the existing
  //叠浪玄潮诀 demo only. Catalogue entries are loaded by the content library
  // and applied to a new battle explicitly by the user.
  const controller = providedController || new BattleController({ storage, chatId, branchId, hostAdapter: host, initialSettings, configStore, configEnvelope });
  controller.localConfigSources = configStore ? scanLocalConfig(storage) : [];
  const events = globalThis.SillyTavern?.getContext ? createEventRuntime({ controller }) : null;
  controller.configBusy = () => events?.configurationBusy?.();
  controller.applyConfigEntries = async settings => {
    if (!events) return;
    await events.disable();
    events.setStateListenerEnabled(settings.battleStateListenerEnabled);
    if (settings.eventAutoEnabled) {
      events.configureAutomaticAdjudication(dailyRuntimeSettings(settings));
      await events.enable();
    }
  };
  if (events && controller.settings?.battleStateListenerEnabled) {
    void controller.ready.then(() => {
      events.setStateListenerEnabled(true);
      return events.recoverBattleEntries();
    }).catch(error => console.warn('[xybattle] 状态监听恢复需要关注:', error));
  }
  let restoringEntry = false, restoreTimer, unsubscribeEntry, restoreAttempts = 0;
  if (events && controller.settings?.eventAutoEnabled) {
    try {
      events.configureAutomaticAdjudication(dailyRuntimeSettings(controller.settings));
      const restoreEntry = () => {
        const context = host?.context?.();
        if (!controller.settings.eventAutoEnabled || events.gate.enabled || restoringEntry || !context?.chatId || context.groupId) return;
        restoringEntry = true;
        const trace=operationLog.start('entry-restore',{attempt:restoreAttempts+1});
        void trace.span('entry-enable',()=>events.enable()).then(()=>trace.end('success')).catch(error => {
          trace.end('failed');
          console.warn('[xybattle] 自动事务入口未能恢复:', error);
          if (++restoreAttempts < 3) { clearTimeout(restoreTimer); restoreTimer = setTimeout(restoreEntry, 500); }
        }).finally(() => { restoringEntry = false; });
      };
      // ST may load extensions on its welcome page before selecting a chat.
      // Restore after that selection rather than failing once at bootstrap.
      unsubscribeEntry = host?.subscribeScopeChange?.(() => { clearTimeout(restoreTimer); restoreAttempts = 0; restoreTimer = setTimeout(restoreEntry, 300); });
      restoreEntry();
    } catch (error) { const trace=operationLog.start('entry-configuration');trace.fail('validation',error);trace.end('failed');console.warn('[xybattle] 自动事务入口配置无效:', error); }
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
    ready: controller.ready,
    open: () => vm.open?.(),
    close: () => vm.close?.(),
    render: () => { controller.emit(); },
    destroy: () => {
      clearTimeout(restoreTimer);
      unsubscribeEntry?.();
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
