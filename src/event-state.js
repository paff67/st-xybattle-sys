// Program-owned metadata. Never adds fields to the user's MVU schema.
export const EVENT_NAMESPACE = 'xy_event_v1';
export const copyEvent = value => value == null ? value : JSON.parse(JSON.stringify(value));
export function canonicalEvent(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalEvent).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalEvent(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
export const newEventId = () => globalThis.crypto.randomUUID();
export function inputSnapshot(message) {
  const extra = message?.extra || {};
  // Compare the actual host attachment descriptors, not the editable composer.
  return copyEvent({ text: message?.mes ?? '', attachments: Object.fromEntries(
    ['media', 'image', 'file', 'attachments'].filter(key => extra[key] !== undefined).map(key => [key, extra[key]])
  ) });
}
export async function inputDigest(message) {
  const bytes = new TextEncoder().encode(canonicalEvent(inputSnapshot(message)));
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, '0')).join('');
}
export function emptyEventStore(chatId, id = newEventId) {
  return { schema: 'event_store_v1', chatId, revision: 0, writeId: null, rootBranchUid: id(), branches: {}, events: {} };
}
export function validateEventStore(store, chatId) {
  if (!store || store.schema !== 'event_store_v1' || store.chatId !== chatId || !Number.isSafeInteger(store.revision) || store.revision < 0 || !store.events || !store.branches || !store.rootBranchUid) {
    throw new Error('事件存档格式或聊天身份不匹配');
  }
  return store;
}
const transitions = {
  captured: ['routing', 'cancelled', 'needs_input', 'rejected'],
  routing: ['passed', 'committed', 'handed_off', 'needs_input', 'unsupported', 'cancelled', 'rejected'],
  handed_off: ['rolled_back'],
  committed: ['rolled_back'],
  passed: ['rolled_back'], needs_input: ['routing', 'cancelled', 'rolled_back'],
  unsupported: ['routing', 'cancelled', 'rolled_back'], rejected: ['routing', 'cancelled', 'rolled_back'],
  cancelled: ['routing', 'rolled_back'], rolled_back: [],
};
export function transitionEvent(event, status, reasonCode = null) {
  if (event.status !== status && !transitions[event.status]?.includes(status)) throw new Error(`不允许的事件状态迁移: ${event.status} → ${status}`);
  return { ...event, status, reasonCode };
}
export function createEventRecord({ requestId, chatId, branchUid, inputMessageUid, inputRevision, originalInputHash, parentEventId = null, baseRevision, generationKind = 'normal', id = newEventId }) {
  return { schema: 'event_v1', eventId: id(), requestId, chatId, branchUid, inputMessageUid,
    inputRevision, originalInputHash, generationKind, origin: 'native-user', parentEventId,
    baseRevision, status: 'captured', attempts: 0, route: null, generationBindings: [],
    mvuObservation: 'pending', reasonCode: null };
}
// P1 has no resource commits. Invalidate identities and their dependent chains;
// domain-state rollback is deliberately not represented as implemented here.
export function invalidateEventChain(store, eventId, reasonCode) {
  const invalid = new Set([eventId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const event of Object.values(store.events)) if (invalid.has(event.parentEventId) && !invalid.has(event.eventId)) { invalid.add(event.eventId); changed = true; }
  }
  for (const key of invalid) if (store.events[key]) store.events[key] = { ...store.events[key], status: 'rolled_back', reasonCode };
  return [...invalid];
}
