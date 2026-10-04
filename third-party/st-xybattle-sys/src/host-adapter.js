export class BattleHostAdapter {
  constructor({ contextProvider = () => ({}), extensionName = 'st-xybattle-sys' } = {}) { this.contextProvider = contextProvider; this.extensionName = extensionName; this.injected = false; this.packet = null; }
  scope() { const context = this.contextProvider() || {}; return { chatId: String(context.chatId || context.chat?.id || 'default-chat'), branchId: String(context.swipeId || context.branchId || 'main') }; }
  async persistReceipt(receipt) { const context = this.contextProvider() || {}; const message = context.message; if (!message?.extra) return { persisted: false, reason: 'host message extra API unavailable' }; message.extra.battle_v2 = receipt; return { persisted: true }; }
  async injectScenePacket(packet) {
    this.packet = packet; this.injected = true; const helper = globalThis.TavernHelper;
    if (helper?.setExtensionPrompt && helper?.extension_prompt_types) { helper.setExtensionPrompt(this.extensionName, JSON.stringify(packet), 1, helper.extension_prompt_types.IN_CHAT || 1); return { injected: true, adapter: 'TavernHelper.setExtensionPrompt' }; }
    return { injected: false, adapter: 'interface-only', reason: 'TavernHelper is unavailable; packet retained for explicit host integration' };
  }
  clearScenePacket() { const helper = globalThis.TavernHelper; if (helper?.setExtensionPrompt) helper.setExtensionPrompt(this.extensionName, '', 0); this.injected = false; this.packet = null; }
}
export function createHostAdapter(contextProvider) { return new BattleHostAdapter({ contextProvider }); }
