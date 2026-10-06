export const clone = (value) => value === undefined ? undefined : JSON.parse(JSON.stringify(value));
export function normalizeChatCompletionsEndpoint(endpoint) {
  const value = String(endpoint || '').trim().replace(/\/+$/, '');
  if (!value || /\/chat\/completions$/i.test(value)) return value;
  return /\/v1$/i.test(value) ? `${value}/chat/completions` : value;
}
export function stableStringify(value) { if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`; if (value && typeof value === 'object') return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`; return JSON.stringify(value); }
export function abortIfNeeded(signal) { if (signal?.aborted) throw new DOMException('操作已停止或聊天作用域已变化', 'AbortError'); }
export function stripSecrets(value, secrets = []) {
  if (typeof value === 'string') return secrets.filter(Boolean).reduce((text, secret) => text.split(secret).join('[REDACTED]'), value);
  if (Array.isArray(value)) return value.map((item) => stripSecrets(item, secrets));
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).filter(([key]) => !/^(api[-_]?key|authorization|access[-_]?token|password|credential|secret)$/i.test(key)).map(([key, item]) => [key, stripSecrets(item, secrets)]));
}
export function publicLog(entry) {
  return stripSecrets({ kind: entry.kind, at: entry.at, actionId: entry.actionId || entry.request?.actionId || entry.internal?.requestMetadata?.actionId, roundId: entry.roundId || entry.request?.roundId, requestMetadata: entry.internal?.requestMetadata, playerVisible: entry.playerVisible, validation: entry.validation || entry.internal?.programValidation, commit: entry.kind === 'commit' ? { status: 'committed', version: entry.record?.version } : undefined, bridge: entry.kind.startsWith('host_') ? entry.capability : undefined });
}
