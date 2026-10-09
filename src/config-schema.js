import { normalizeSettings } from './adapters.js';
import { DEFAULT_CHARACTER_COMPLETION_PROMPT, DEFAULT_ADJUDICATION_PROMPT } from './character-prompts.js';
import { DAILY_ADJUDICATION_PROMPT, DAILY_MODULE_PROMPTS } from './event-daily-prompts.js';
import { stripSecrets } from './common.js';

export const CONFIG_SCHEMA_VERSION = 1;
export const CONFIG_APIS = Object.freeze(['adjudicator', 'characterGenerator', 'dailyAdjudicator', 'narrator']);
const copy = value => structuredClone(value);
const object = (value, path) => {
  if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error(`${path}: expected object`);
};
const assertType = (value, type, path) => {
  if (typeof value !== type || type === 'number' && !Number.isFinite(value)) throw new Error(`${path}: invalid type`);
};
const prompts = Object.freeze({
  adjudication: DEFAULT_ADJUDICATION_PROMPT,
  character: DEFAULT_CHARACTER_COMPLETION_PROMPT,
  dailyCommon: DAILY_ADJUDICATION_PROMPT,
  ...DAILY_MODULE_PROMPTS,
});
const promptValue = (settings, name) => name === 'adjudication' ? settings.adjudicationPrompt
  : name === 'character' ? settings.characterCompletionPrompt : name === 'dailyCommon' ? settings.dailyPrompts?.common : settings.dailyPrompts?.modules?.[name];
const setPrompt = (settings, name, value) => {
  if (name === 'adjudication') settings.adjudicationPrompt = value;
  else if (name === 'character') settings.characterCompletionPrompt = value;
  else if (name === 'dailyCommon') settings.dailyPrompts.common = value;
  else settings.dailyPrompts.modules[name] = value;
};

export function builtinPromptPolicy() {
  const builtin = name => ({ mode: 'builtin', templateId: name, version: 1 });
  return { adjudication: builtin('adjudication'), character: builtin('character'), dailyCommon: builtin('dailyCommon'),
    dailyModules: Object.fromEntries(Object.keys(DAILY_MODULE_PROMPTS).map(name => [name, builtin(name)])) };
}

function validateSettings(settings) {
  object(settings, 'settings');
  if (Object.hasOwn(settings, 'apiKey')) throw new Error('Credentials must be stored separately');
  const defaults = normalizeSettings();
  for (const [name, value] of Object.entries(settings)) {
    if (CONFIG_APIS.includes(name)) {
      object(value, `settings.${name}`);
      if (Object.hasOwn(value, 'apiKey')) throw new Error('Credentials must be stored separately');
      for (const [key, field] of Object.entries(value)) {
        const type = ['mode', 'endpoint', 'model'].includes(key) ? 'string'
          : ['temperature', 'maxOutput', 'repairAttempts', 'timeoutMs'].includes(key) ? 'number'
            : ['inherit', 'jsonMode'].includes(key) ? 'boolean' : null;
        if (type) assertType(field, type, `settings.${name}.${key}`);
      }
    } else if (name === 'dailyPrompts') {
      object(value, 'settings.dailyPrompts');
      if (value.common !== undefined) assertType(value.common, 'string', 'settings.dailyPrompts.common');
      if (value.modules !== undefined) {
        object(value.modules, 'settings.dailyPrompts.modules');
        for (const key of Object.keys(DAILY_MODULE_PROMPTS)) if (value.modules[key] !== undefined) assertType(value.modules[key], 'string', `settings.dailyPrompts.modules.${key}`);
      }
    } else if (Object.hasOwn(defaults, name)) assertType(value, typeof defaults[name], `settings.${name}`);
  }
  normalizeSettings(settings);
}

export function validateConfigEnvelope(input) {
  object(input, 'config');
  if (input.schemaVersion !== CONFIG_SCHEMA_VERSION) throw new Error('Unsupported configuration schema');
  if (!Number.isInteger(input.revision) || input.revision < 1) throw new Error('Invalid configuration revision');
  if (typeof input.writeId !== 'string' || !input.writeId || typeof input.updatedAt !== 'string' || !Number.isFinite(Date.parse(input.updatedAt))) throw new Error('Invalid configuration identity');
  validateSettings(input.settings);
  object(input.credentials, 'credentials');
  for (const api of CONFIG_APIS) if (input.credentials[api] !== undefined) {
    object(input.credentials[api], `credentials.${api}`);
    if (input.credentials[api].apiKey !== undefined) assertType(input.credentials[api].apiKey, 'string', `credentials.${api}.apiKey`);
  }
  object(input.promptPolicy, 'promptPolicy');
  const policy = input.promptPolicy;
  if (policy.dailyModules !== undefined) object(policy.dailyModules, 'promptPolicy.dailyModules');
  for (const name of Object.keys(prompts)) {
    const entry = ['adjudication', 'character', 'dailyCommon'].includes(name) ? policy[name] : policy.dailyModules?.[name];
    if (entry === undefined) continue;
    object(entry, `promptPolicy.${name}`);
    if (!['custom', 'builtin'].includes(entry.mode)) throw new Error('Invalid prompt policy');
    if (entry.mode === 'builtin' && (entry.templateId !== name || entry.version !== 1)) throw new Error('Unsupported builtin prompt version');
    if (entry.mode === 'custom' && (typeof promptValue(input.settings, name) !== 'string' || !promptValue(input.settings, name).trim())) throw new Error('Custom prompt must not be blank');
  }
  // Old envelopes without a policy entry retain their nonempty saved text.
  for (const name of Object.keys(prompts)) {
    const value = promptValue(input.settings, name);
    if (value !== undefined && !value.trim()) throw new Error('Saved prompt must not be blank');
  }
  return copy(input);
}

export function runtimeConfig(input) {
  const envelope = validateConfigEnvelope(input);
  const runtime = normalizeSettings(envelope.settings);
  for (const api of CONFIG_APIS) runtime[api].apiKey = envelope.credentials[api]?.apiKey ?? '';
  for (const name of Object.keys(prompts)) {
    const entry = ['adjudication', 'character', 'dailyCommon'].includes(name) ? envelope.promptPolicy[name] : envelope.promptPolicy.dailyModules?.[name];
    const value = entry?.mode === 'builtin' ? prompts[name] : promptValue(envelope.settings, name) ?? prompts[name];
    setPrompt(runtime, name, value);
  }
  return runtime;
}

function merge(base, patch) {
  const result = copy(base);
  for (const [key, value] of Object.entries(patch)) {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) throw new Error('Invalid configuration field');
    if (value === undefined) continue;
    if (value && typeof value === 'object' && !Array.isArray(value) && result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) result[key] = merge(result[key], value);
    else result[key] = copy(value);
  }
  return result;
}

export function createConfigEnvelope(settingsPatch = {}, { previous, credentials = {}, promptPolicy, migration, writeId = globalThis.crypto.randomUUID(), updatedAt = new Date().toISOString() } = {}) {
  if (previous) validateConfigEnvelope(previous);
  object(settingsPatch, 'settings patch');
  object(credentials, 'credentials patch');
  const patch = copy(settingsPatch);
  const credentialPatch = copy(credentials);
  if (Object.hasOwn(patch, 'apiKey')) {
    credentialPatch.adjudicator = { ...credentialPatch.adjudicator, apiKey: patch.apiKey };
    delete patch.apiKey;
  }
  for (const api of CONFIG_APIS) if (patch[api] && Object.hasOwn(patch[api], 'apiKey')) {
    credentialPatch[api] = { ...credentialPatch[api], apiKey: patch[api].apiKey };
    delete patch[api].apiKey;
  }
  const baseSettings = previous?.settings ?? normalizeSettings();
  const settings = merge(baseSettings, patch);
  let policy = merge(previous?.promptPolicy ?? builtinPromptPolicy(), promptPolicy ?? {});
  for (const name of Object.keys(prompts)) if (promptValue(patch, name) !== undefined) {
    const explicit = ['adjudication', 'character', 'dailyCommon'].includes(name) ? promptPolicy?.[name] : promptPolicy?.dailyModules?.[name];
    if (!explicit && promptValue(patch, name) !== promptValue(previous ? runtimeConfig(previous) : normalizeSettings(), name)) {
      if (['adjudication', 'character', 'dailyCommon'].includes(name)) policy[name] = { mode: 'custom' };
      else policy.dailyModules[name] = { mode: 'custom' };
    }
  }
  const envelope = { ...copy(previous ?? {}), schemaVersion: 1, revision: (previous?.revision ?? 0) + 1, writeId, updatedAt, settings,
    credentials: merge(previous?.credentials ?? {}, credentialPatch), promptPolicy: policy,
    ...(migration !== undefined ? { migration: copy(migration) } : {}) };
  return validateConfigEnvelope(envelope);
}

export function exportConfig(input) {
  const envelope = validateConfigEnvelope(input);
  delete envelope.credentials;
  return stripSecrets(envelope, CONFIG_APIS.map(api => input.credentials[api]?.apiKey).filter(Boolean));
}
