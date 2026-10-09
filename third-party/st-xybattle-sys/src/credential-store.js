const STORAGE_KEY = 'xybattle.credentials.v1';

function resolveStorage(storage) {
  if (storage !== undefined) return storage && typeof storage.getItem === 'function' && typeof storage.setItem === 'function' ? storage : null;
  try {
    const candidate = globalThis?.localStorage;
    return candidate && typeof candidate.getItem === 'function' && typeof candidate.setItem === 'function' ? candidate : null;
  } catch {
    return null;
  }
}

function emptyCredentials() {
  return { adjudicator: { apiKey: '' }, narrator: { apiKey: '' }, characterGenerator: { apiKey: '' }, dailyAdjudicator: { apiKey: '' } };
}

export function readCredentialSettings(storage) {
  const target = resolveStorage(storage);
  if (!target) return emptyCredentials();
  try {
    const raw = target.getItem(STORAGE_KEY);
    if (!raw) return emptyCredentials();
    const parsed = JSON.parse(raw);
    return {
      adjudicator: { apiKey: typeof parsed?.adjudicator?.apiKey === 'string' ? parsed.adjudicator.apiKey : '' },
      narrator: { apiKey: typeof parsed?.narrator?.apiKey === 'string' ? parsed.narrator.apiKey : '' },
      dailyAdjudicator: { apiKey: typeof parsed?.dailyAdjudicator?.apiKey === 'string' ? parsed.dailyAdjudicator.apiKey : '' },
      characterGenerator: { apiKey: typeof parsed?.characterGenerator?.apiKey === 'string' ? parsed.characterGenerator.apiKey : '' }
    };
  } catch {
    return emptyCredentials();
  }
}

export function writeCredentialSettings(settings, storage) {
  const target = resolveStorage(storage);
  if (!target) return false;
  const payload = {
    version: 1,
    adjudicator: { apiKey: String(settings?.adjudicator?.apiKey || '') },
    narrator: { apiKey: String(settings?.narrator?.apiKey || '') },
    dailyAdjudicator: { apiKey: String(settings?.dailyAdjudicator?.apiKey || '') },
    characterGenerator: { apiKey: String(settings?.characterGenerator?.apiKey || '') }
  };
  try {
    if (!payload.adjudicator.apiKey && !payload.narrator.apiKey && !payload.characterGenerator.apiKey && !payload.dailyAdjudicator.apiKey) {
      target.removeItem?.(STORAGE_KEY);
    } else {
      target.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
    return true;
  } catch {
    return false;
  }
}

export function clearCredentialSettings(storage) {
  const target = resolveStorage(storage);
  if (!target) return false;
  try {
    target.removeItem?.(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export const CREDENTIAL_STORAGE_KEY = STORAGE_KEY;
