import { projectScenePacket } from './scene-packet.js';
import { stableStringify } from './common.js';
/**
 * A small, host-agnostic bridge for carrying a committed battle packet in the
 * normal user message.  The marker is deliberately plain text: SillyTavern's
 * prompt and message pipelines can carry it without requiring a regex or a
 * prompt-template hook.  Display code may fold the marker later, but it must
 * never remove it from the source message.
 */

export const XY_BATTLE_PACKET_VERSION = 1;
export const XY_BATTLE_PACKET_OPEN = `[[XY_BATTLE_PACKET v${XY_BATTLE_PACKET_VERSION} `;
export const XY_BATTLE_PACKET_CLOSE = '[[/XY_BATTLE_PACKET]]';

const clone = (value) => value == null ? value : JSON.parse(JSON.stringify(value));
const integer = (value) => Number.isInteger(Number(value)) && Number(value) >= 0 ? Number(value) : null;

function packetScope(packet, scope = {}) {
  const source = packet?.scope || {};
  return {
    chatId: source.chatId ?? scope.chatId,
    branchId: source.branchId ?? scope.branchId,
    messageId: source.messageId ?? scope.messageId,
    swipeId: source.swipeId ?? scope.swipeId,
    messageUid: source.messageUid ?? scope.messageUid
  };
}

function packetHeader(packet, scope = {}) {
  const resolvedScope = packetScope(packet, scope);
  const actionId = String(packet?.actionId ?? '').trim();
  const branchId = String(resolvedScope.branchId ?? '').trim();
  const version = integer(packet?.version ?? scope.version);
  if (!actionId) throw new Error('BATTLE_SCENE_PACKET requires actionId');
  if (!branchId) throw new Error('BATTLE_SCENE_PACKET requires scope.branchId');
  if (version == null) throw new Error('BATTLE_SCENE_PACKET requires a non-negative integer version');
  return { actionId, version, branchId };
}

export function battlePacketKey(packet, scope = {}) {
  const header = packetHeader(packet, scope);
  return JSON.stringify([header.branchId, header.version, header.actionId]);
}

export function battlePacketIdentity(packet, scope = {}) {
  const header = packetHeader(packet, scope);
  return JSON.stringify([header.branchId, header.actionId]);
}

function assertPacket(packet, scope = {}) {
  if (!packet || typeof packet !== 'object' || Array.isArray(packet)) throw new Error('BATTLE_SCENE_PACKET must be an object');
  if (packet.type !== 'BATTLE_SCENE_PACKET') throw new Error('Expected a BATTLE_SCENE_PACKET');
  const header = packetHeader(packet, scope);
  const packetBranch = packet.scope?.branchId;
  if (packetBranch != null && String(packetBranch) !== header.branchId) throw new Error('BATTLE_SCENE_PACKET scope.branchId is inconsistent');
  if (scope.branchId != null && String(scope.branchId) !== header.branchId) throw new Error('BATTLE_SCENE_PACKET branchId does not match the active scope');
  return header;
}

/**
 * Serialize a packet as a line-delimited marker.  Header values are encoded so
 * an action or branch containing `]]` cannot terminate the marker header.
 */
export function serializeBattlePacket(packet, scope = {}) {
  const header = assertPacket(packet, scope);
  const token = encodeURIComponent(JSON.stringify(header));
  // Escape the closing token inside JSON string values. JSON.parse restores
  // the original characters while the outer delimiter stays unambiguous.
  const bodyPacket = { ...projectScenePacket(packet), version: header.version };
  const body = JSON.stringify(bodyPacket).replaceAll(XY_BATTLE_PACKET_CLOSE, '\\u005b\\u005b/XY_BATTLE_PACKET]]');
  return `${XY_BATTLE_PACKET_OPEN}${token}]]\n${body}\n${XY_BATTLE_PACKET_CLOSE}`;
}

function decodeHeader(token) {
  if (!token || /[\r\n]/.test(token)) throw new Error('Malformed XY_BATTLE_PACKET header');
  let value;
  try { value = JSON.parse(decodeURIComponent(token)); } catch { throw new Error('Malformed XY_BATTLE_PACKET header'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Malformed XY_BATTLE_PACKET header');
  return packetHeader({ actionId: value.actionId, version: value.version, scope: { branchId: value.branchId } });
}

const headerPattern = new RegExp(`^\\[\\[XY_BATTLE_PACKET v${XY_BATTLE_PACKET_VERSION} ([^\\r\\n]+)\\]\\]$`, 'gm');

function parseMarker(headerToken, body, source, index, end) {
  const header = decodeHeader(headerToken);
  let packet;
  try { packet = JSON.parse(body); } catch { throw new Error('Malformed XY_BATTLE_PACKET payload'); }
  const actual = assertPacket(packet, { branchId: header.branchId });
  if (actual.actionId !== header.actionId || actual.version !== header.version || actual.branchId !== header.branchId) throw new Error('XY_BATTLE_PACKET header does not match payload');
  return { packet, header, key: JSON.stringify([header.branchId, header.version, header.actionId]), identity: JSON.stringify([header.branchId, header.actionId]), raw: source.slice(index, end), start: index, end };
}

/** Return every valid marker in source. Invalid markers are left untouched. */
export function parseBattlePackets(source) {
  if (typeof source !== 'string' || !source) return [];
  const results = [];
  headerPattern.lastIndex = 0;
  let match;
  while ((match = headerPattern.exec(source))) {
    let bodyStart = match.index + match[0].length;
    if (source.slice(bodyStart, bodyStart + 2) === '\r\n') bodyStart += 2;
    else if (source[bodyStart] === '\n') bodyStart += 1;
    const closeStart = source.indexOf(XY_BATTLE_PACKET_CLOSE, bodyStart);
    if (closeStart < 0) continue;
    let bodyEnd = closeStart;
    if (source[bodyEnd - 2] === '\r' && source[bodyEnd - 1] === '\n') bodyEnd -= 2;
    else if (source[bodyEnd - 1] === '\n') bodyEnd -= 1;
    const end = closeStart + XY_BATTLE_PACKET_CLOSE.length;
    try { results.push(parseMarker(match[1], source.slice(bodyStart, bodyEnd), source, match.index, end)); } catch { /* Keep malformed user text visible. */ }
    headerPattern.lastIndex = end;
  }
  return results;
}

/** Return the first valid marker, or null when source has no valid marker. */
export function parseBattlePacket(source) {
  return parseBattlePackets(source)[0] || null;
}

export const extractBattlePacket = parseBattlePacket;

export function splitBattlePacketDisplay(source) {
  if (typeof source !== 'string') return [];
  const packets = parseBattlePackets(source);
  if (!packets.length) return [{ type: 'text', text: source }];
  const segments = [];
  let cursor = 0;
  for (const packet of packets) {
    if (packet.start > cursor) segments.push({ type: 'text', text: source.slice(cursor, packet.start) });
    segments.push({ type: 'battle-packet', text: packet.raw, packet: clone(packet.packet), key: packet.key, header: packet.header });
    cursor = packet.end;
  }
  if (cursor < source.length) segments.push({ type: 'text', text: source.slice(cursor) });
  return segments;
}

/**
 * Append a marker without changing any existing user text. A matching key is
 * idempotent; an older/newer version for the same action and branch is a
 * conflict and is never silently duplicated.
 */
export function appendBattlePacket(source, packet, scope = {}) {
  const text = typeof source === 'string' ? source : '';
  const header = assertPacket(packet, scope);
  const key = JSON.stringify([header.branchId, header.version, header.actionId]);
  const identity = JSON.stringify([header.branchId, header.actionId]);
  const existing = parseBattlePackets(text);
  const same = existing.find((item) => item.key === key);
  if (same) {
    const expected = { ...projectScenePacket(packet), version: header.version };
    if (stableStringify(projectScenePacket(same.packet)) !== stableStringify(expected)) throw new Error('Input already contains different facts for this XY_BATTLE_PACKET');
    if (stableStringify(same.packet) === stableStringify(expected)) return { text, marker: same.raw, match: same, packet: clone(same.packet), key, identity, deduplicated: true, appended: false };
    // Upgrade a legacy marker already in the input, preserving surrounding user
    // text. Cleanup must not put the old bloated marker back into the composer.
    const marker = serializeBattlePacket(packet, scope);
    return { text: text.slice(0, same.start) + marker + text.slice(same.end), marker, packet: expected, key, identity, deduplicated: false, appended: false, replaced: true, previousValue: text.slice(0, same.start) + text.slice(same.end) };
  }
  const conflict = existing.find((item) => item.identity === identity);
  if (conflict) throw new Error('An XY_BATTLE_PACKET for this action and branch already has a different version');
  const marker = serializeBattlePacket(packet, scope);
  const separator = text && !text.endsWith('\n') ? '\n\n' : text ? '\n' : '';
  const next = `${text}${separator}${marker}`;
  return { text: next, marker, packet: clone(packet), key, identity, deduplicated: false, appended: true, start: text.length + separator.length, end: next.length };
}

function readElement(element) {
  if (!element) return '';
  if ('value' in element && typeof element.value === 'string') return element.value;
  return typeof element.textContent === 'string' ? element.textContent : '';
}

function writeElement(element, value) {
  if (!element) return false;
  if ('value' in element) {
    const prototype = Object.getPrototypeOf(element);
    const setter = prototype && Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    if (setter) setter.call(element, value); else element.value = value;
  } else element.textContent = value;
  return true;
}

function dispatchInput(element, eventTypes = ['input', 'change']) {
  if (!element?.dispatchEvent) return;
  const EventCtor = element.ownerDocument?.defaultView?.Event || globalThis.Event;
  for (const type of eventTypes) {
    try {
      const event = typeof EventCtor === 'function' ? new EventCtor(type, { bubbles: true }) : { type, bubbles: true };
      element.dispatchEvent(event);
    } catch { /* A test double or an older host may not expose Event. */ }
  }
}

function defaultInputElement(context, documentRef) {
  if (context?.textarea && (typeof context.textarea === 'object' || typeof context.textarea === 'function')) return context.textarea;
  if (context?.input && (typeof context.input === 'object' || typeof context.input === 'function')) return context.input;
  return documentRef?.querySelector?.('#send_textarea, textarea#send_textarea, textarea[data-testid="send-textarea"], textarea');
}

/**
 * Inject and remove a packet from an input element. This class deliberately
 * knows nothing about SillyTavern's message storage or rendering. A host can
 * use the existing injectPrompts path when `append()` reports unavailable.
 */
export class HostInputBridge {
  constructor({ contextProvider = () => globalThis.SillyTavern?.getContext?.() || {}, getInputElement, documentRef = globalThis.document, eventEmitter, eventTypes, windowRef = globalThis, dispatch = dispatchInput, bindPageLifecycle = true } = {}) {
    Object.assign(this, { contextProvider, getInputElement, documentRef, eventEmitter, eventTypes, windowRef, dispatch, bindPageLifecycle });
    this.active = null;
    this.disposers = [];
    this.boundEmitter = null;
    this.disposed = false;
    this.start();
  }

  context() { return this.contextProvider?.() || {}; }
  inputElement() { return this.getInputElement ? this.getInputElement(this.context(), this.documentRef) : defaultInputElement(this.context(), this.documentRef); }
  read(element = this.inputElement()) { return readElement(element); }
  write(element, value) { const result = writeElement(element, value); if (result) this.dispatch(element); return result; }
  dispatch(element) { this.dispatchInput?.(element); }
  dispatchInput(element) { this.dispatch(element); }
  capability() { const element = this.inputElement(); return { input: element ? 'available' : 'unavailable', mode: 'input-box', source: element ? 'context-or-dom' : 'none' }; }

  append(packet, scope = {}) {
    if (this.disposed) return { queued: false, injected: false, reason: 'HostInputBridge is disposed', capability: this.capability() };
    let key;
    try { key = battlePacketKey(packet, scope); } catch (error) { return { queued: false, injected: false, reason: error.message, capability: this.capability() }; }
    if (this.active?.key === key) return { queued: true, injected: true, deduplicated: true, key, capability: this.capability() };
    if (this.active) {
      const cleared = this.clear();
      if (!cleared.cleared && !cleared.preservedUserEdit) return { queued: false, injected: false, reason: 'A previous battle packet is still attached to the input', key, capability: this.capability() };
    }
    const element = this.inputElement();
    if (!element) return { queued: false, injected: false, reason: 'Input element is unavailable', key, capability: this.capability() };
    const previousValue = this.read(element);
    let appended;
    try { appended = appendBattlePacket(previousValue, packet, scope); } catch (error) {
      return { queued: false, injected: false, conflict: /already has a different version|already contains/i.test(error.message), reason: error.message, key, capability: this.capability() };
    }
    if (appended.deduplicated) {
      this.active = { key, identity: appended.identity, packet: clone(packet), marker: appended.marker, element, owns: false, scope: clone(scope) };
      return { queued: true, injected: true, deduplicated: true, key, capability: this.capability() };
    }
    this.write(element, appended.text);
    this.active = { key, identity: appended.identity, packet: clone(packet), marker: appended.marker, element, previousValue: appended.replaced ? appended.previousValue : previousValue, injectedValue: appended.text, scope: clone(scope), owns: true };
    return { queued: true, injected: true, deduplicated: false, key, capability: this.capability() };
  }

  inject(packet, scope = {}) { return this.append(packet, scope); }
  queue(packet, scope = {}) { return this.append(packet, scope); }
  verify(packet, scope = {}) {
    let key;
    try { key = battlePacketKey(packet, scope); } catch { return { valid: false, reason: 'Packet identity is incomplete' }; }
    const marker = parseBattlePackets(this.read(this.inputElement())).find((entry) => entry.key === key);
    return marker ? { valid: true, key, marker: marker.raw, packet: clone(marker.packet) } : { valid: false, key, reason: 'Exact packet marker is absent from the input' };
  }

  clear() {
    const active = this.active;
    if (!active) return { cleared: false, preservedUserEdit: false };
    this.active = null;
    if (!active.owns) return { cleared: false, preservedUserEdit: true, key: active.key };
    const current = this.read(active.element);
    if (current === active.injectedValue) {
      this.write(active.element, active.previousValue);
      return { cleared: true, preservedUserEdit: false, key: active.key };
    }
    if (typeof current === 'string' && current.endsWith(active.marker)) {
      let next = current.slice(0, -active.marker.length);
      next = next.replace(/\n{1,2}$/, '');
      this.write(active.element, next);
      return { cleared: true, preservedUserEdit: true, key: active.key };
    }
    return { cleared: false, preservedUserEdit: true, key: active.key };
  }

  clearScenePacket() { return this.clear(); }
  state() { return this.active ? { key: this.active.key, identity: this.active.identity, scope: clone(this.active.scope), owns: this.active.owns } : null; }

  start() {
    if (this.disposed) return this.capability();
    const emitter = this.eventEmitter || this.context()?.eventSource;
    if (!emitter?.on || emitter === this.boundEmitter) return this.capability();
    if (this.disposers.length) this.stop();
    this.boundEmitter = emitter;
    const events = this.eventTypes || this.context()?.event_types || {};
    const names = ['CHAT_CHANGED', 'MESSAGE_SWIPED', 'MESSAGE_SWIPE_DELETED', 'MESSAGE_DELETED', 'GENERATION_ENDED', 'GENERATION_STOPPED'];
    for (const key of names) {
      const name = events[key] || key;
      const handler = () => this.clear();
      emitter.on(name, handler);
      this.disposers.push(() => (emitter.off || emitter.removeListener)?.call(emitter, name, handler));
    }
    if (this.bindPageLifecycle && this.windowRef?.addEventListener) {
      const handler = () => this.clear();
      this.windowRef.addEventListener('pagehide', handler);
      this.disposers.push(() => this.windowRef.removeEventListener?.('pagehide', handler));
    }
    return this.capability();
  }

  stop() { for (const dispose of this.disposers.splice(0)) dispose(); this.boundEmitter = null; }
  dispose() { this.clear(); this.stop(); this.disposed = true; }
}

export function createHostInputBridge(options) { return new HostInputBridge(options); }

