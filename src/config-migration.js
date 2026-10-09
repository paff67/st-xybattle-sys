import { createConfigEnvelope, CONFIG_APIS, runtimeConfig } from './config-schema.js';
import { CREDENTIAL_STORAGE_KEY } from './credential-store.js';

export function scanLocalConfig(storage) {
  const sources = [];
  if (!storage) return sources;
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key !== 'battle_v2.settings' && !key?.startsWith('battle_v2.settings.')) continue;
    const raw = storage.getItem(key);
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw new Error();
      sources.push({ key, raw, settings: parsed });
    } catch { sources.push({ key, raw, error: 'invalid_local_settings' }); }
  }
  const rawCredentials = storage.getItem(CREDENTIAL_STORAGE_KEY);
  let credentials = {};
  if (rawCredentials !== null) {
    try {
      const parsed = JSON.parse(rawCredentials);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error();
      for (const api of CONFIG_APIS) if (parsed[api] !== undefined) {
        if (!parsed[api] || typeof parsed[api].apiKey !== 'string') throw new Error();
        credentials[api] = { apiKey: parsed[api].apiKey };
      }
    } catch {
      if (!sources.length) sources.push({ key: CREDENTIAL_STORAGE_KEY });
      return sources.map(source => ({ ...source, rawCredentials, error: source.error ?? 'invalid_local_credentials' }));
    }
    if (!sources.length) sources.push({ key: CREDENTIAL_STORAGE_KEY, settings: {} });
  }
  return sources.map(source => ({ ...source, rawCredentials, credentials: structuredClone(credentials) }));
}

export function migrationEnvelope(source, { previous, writeId, updatedAt } = {}) {
  if (source.error) throw new Error('Local configuration cannot be migrated');
  const promptPolicy = { dailyModules: {} };
  for (const [name, value] of Object.entries({ adjudication: source.settings.adjudicationPrompt, character: source.settings.characterCompletionPrompt, dailyCommon: source.settings.dailyPrompts?.common })) {
    if (typeof value === 'string' && value.trim()) promptPolicy[name] = { mode: 'custom' };
  }
  for (const [name, value] of Object.entries(source.settings.dailyPrompts?.modules ?? {})) if (typeof value === 'string' && value.trim()) promptPolicy.dailyModules[name] = { mode: 'custom' };
  return createConfigEnvelope(source.settings, { previous, credentials: source.credentials, promptPolicy, writeId, updatedAt,
    migration: { source: source.key, status: 'pending' } });
}

// Safe for UI/logs: values of credentials never enter a preview.
export function migrationPreview(source, hostEnvelope) {
  if (source.error) return { source: source.key, error: source.error };
  const envelope = migrationEnvelope(source);
  const runtime = runtimeConfig(envelope);
  const host = hostEnvelope ? runtimeConfig(hostEnvelope) : null;
  return { source: source.key,
    apis: Object.fromEntries(CONFIG_APIS.map(api => {
      const apiKey = runtime[api].apiKey;
      const parameters = Object.fromEntries(['mode', 'endpoint', 'model', 'temperature', 'maxOutput', 'repairAttempts', 'timeoutMs', 'inherit', 'jsonMode'].filter(key => runtime[api][key] !== undefined).map(key => [key, runtime[api][key]]));
      return [api, { parameters, hasCredential: !!apiKey, differs: !!host && JSON.stringify(parameters) !== JSON.stringify(Object.fromEntries(Object.entries(host[api]).filter(([key]) => key !== 'apiKey'))) }];
    })),
    prompts: { adjudication: { differs: !!host && runtime.adjudicationPrompt !== host.adjudicationPrompt, length: runtime.adjudicationPrompt.length },
      character: { differs: !!host && runtime.characterCompletionPrompt !== host.characterCompletionPrompt, length: runtime.characterCompletionPrompt.length },
      daily: { differs: !!host && JSON.stringify(runtime.dailyPrompts) !== JSON.stringify(host.dailyPrompts) } } };
}
