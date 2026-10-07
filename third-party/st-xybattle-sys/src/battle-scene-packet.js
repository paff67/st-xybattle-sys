import { createScenePacket, projectScenePacket } from './scene-packet.js';

export function createBattleScenePacket(state, record) {
  if (record?.narrativePacket) return projectScenePacket(record.narrativePacket);
  if (record?.adjudication) return createScenePacket(state, record);
  return projectScenePacket({ scope: state.scope, sessionId: state.sessionId });
}
export function buildMainStoryRequest(packet, originalPrompt = '') {
  return { preserveUserPrompt: originalPrompt, injection: projectScenePacket(packet) };
}
export class MainStoryAdapterContract {
  async generateFromBattlePacket() { throw new Error('主剧情适配器未接入：实现 generateFromBattlePacket(packet, originalPrompt)'); }
}
export class MockMainStoryAdapter extends MainStoryAdapterContract {
  async generateFromBattlePacket(packet, originalPrompt = '') {
    const safe = projectScenePacket(packet);
    return { text: `${originalPrompt ? `${originalPrompt}\n` : ''}${safe.exchange?.playerResult || (safe.committedFacts || []).join('；')}（模拟主剧情桥接，未调用真实主剧情）` };
  }
}
