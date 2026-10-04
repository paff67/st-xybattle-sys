(async () => {
  if (typeof document === 'undefined') return;
  const script = document.currentScript;
  const url = script && script.src ? new URL('./src/index.js', script.src).href : './src/index.js';
  const module = await import(url);
  module.mountBattleSystem();
})().catch((error) => console.error('[battle_v2] failed to mount', error));
