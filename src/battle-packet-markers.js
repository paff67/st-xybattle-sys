/**
 * Public marker/parser names kept separate from the input bridge so display
 * integrations can depend on the protocol without owning a textarea.
 * `host-input-bridge.js` is the single implementation of the wire format.
 */
import {
  XY_BATTLE_PACKET_VERSION,
  XY_BATTLE_PACKET_OPEN,
  XY_BATTLE_PACKET_CLOSE,
  battlePacketKey,
  battlePacketIdentity,
  serializeBattlePacket,
  parseBattlePackets,
  parseBattlePacket,
  splitBattlePacketDisplay
} from './host-input-bridge.js';

export const XY_BATTLE_PACKET_MARKER = 'XY_BATTLE_PACKET';
export const XY_BATTLE_PACKET_FORMAT = XY_BATTLE_PACKET_VERSION;
export { XY_BATTLE_PACKET_VERSION, XY_BATTLE_PACKET_OPEN, XY_BATTLE_PACKET_CLOSE, battlePacketKey, battlePacketIdentity, serializeBattlePacket, parseBattlePacket, splitBattlePacketDisplay };

export function parseBattlePacketMarkers(source) { return parseBattlePackets(source); }
export function battlePacketDisplaySegments(source) { return splitBattlePacketDisplay(source); }
export function sameBattlePacketIdentity(left, right) {
  const a = typeof left === 'string' ? left : left?.key || battlePacketKey(left?.packet || left, left?.header || {});
  const b = typeof right === 'string' ? right : right?.key || battlePacketKey(right?.packet || right, right?.header || {});
  return !!a && a === b;
}
export function foldBattlePacketText(source, { placeholder = '【战斗场景包已折叠】' } = {}) {
  return splitBattlePacketDisplay(source).map((segment) => segment.type === 'battle-packet' ? `${placeholder}${segment.packet?.actionId ? ` · ${segment.packet.actionId}` : ''}` : segment.text).join('');
}

