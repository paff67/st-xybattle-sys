import { mountBattleSystem } from './src/index.js';
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => mountBattleSystem(), { once: true });
  else mountBattleSystem();
}
