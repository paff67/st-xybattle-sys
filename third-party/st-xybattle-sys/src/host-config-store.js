import { validateConfigEnvelope } from './config-schema.js';

export const CONFIG_SCOPE = Object.freeze({ type: 'extension', extension_id: 'xybattleConfig' });
export class ConfigStoreError extends Error {
  constructor(code) { super(code); this.name = 'ConfigStoreError'; this.code = code; }
}
const stable = value => JSON.stringify(value, (_, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);

// Supported by ST 1.17.0. Inject this only for a host whose contract was verified.
export function createServerConfigReader({ contextProvider, fetchImpl = globalThis.fetch, timeoutMs = 5000 }) {
  return async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl('/api/settings/get', { method: 'POST', headers: contextProvider().getRequestHeaders(),
        body: '{}', cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new ConfigStoreError('server_read_failed');
      const data = await response.json();
      if (typeof data.settings !== 'string') throw new ConfigStoreError('server_response_invalid');
      const settings = JSON.parse(data.settings);
      if (!settings.extension_settings || typeof settings.extension_settings !== 'object' || Array.isArray(settings.extension_settings)) throw new ConfigStoreError('server_response_invalid');
      const fields = settings.extension_settings;
      return Object.hasOwn(fields, CONFIG_SCOPE.extension_id) ? { kind: 'present', envelope: fields[CONFIG_SCOPE.extension_id] } : { kind: 'missing' };
    } catch { throw new ConfigStoreError('server_read_failed'); }
    finally { clearTimeout(timer); }
  };
}

export class HostConfigStore {
  constructor({ helperProvider = () => globalThis.TavernHelper, contextProvider = () => globalThis.SillyTavern?.getContext?.(),
    hostReady, readServer, timeoutMs = 15000, identityProvider } = {}) {
    this.helperProvider = helperProvider;
    this.contextProvider = contextProvider;
    this.hostReady = hostReady;
    this.readServer = readServer;
    this.timeoutMs = timeoutMs;
    this.identityProvider = identityProvider ?? (() => contextProvider()?.extensionSettings);
    this.generation = 0;
    this.queue = Promise.resolve();
  }
  invalidate() { this.generation += 1; this.readyPromise = null; }
  guard(epoch, identity) {
    if (epoch !== this.generation || identity !== this.identityProvider()) throw new ConfigStoreError('stale_host_context');
  }
  ready() {
    if (!this.readyPromise) {
      const promise = this.waitReady().catch(error => { if (this.readyPromise === promise) this.readyPromise = null; throw error; });
      this.readyPromise = promise;
    }
    return this.readyPromise;
  }
  async waitReady() {
    const epoch = this.generation;
    if (!this.hostReady) throw new ConfigStoreError('host_ready_signal_required');
    let timer;
    try {
      await Promise.race([Promise.resolve().then(() => this.hostReady()), new Promise((_, reject) => {
        timer = setTimeout(() => reject(new ConfigStoreError('host_not_ready')), this.timeoutMs);
      })]);
      const deadline = Date.now() + this.timeoutMs;
      while (Date.now() < deadline) {
        if (epoch !== this.generation) throw new ConfigStoreError('stale_host_context');
        const helper = this.helperProvider(), context = this.contextProvider();
        if (typeof helper?.getVariables === 'function' && typeof helper?.replaceVariables === 'function' && context?.extensionSettings) {
          return { extensionVariables: true, serverReadback: typeof this.readServer === 'function', atomicCompareAndSwap: false };
        }
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      throw new ConfigStoreError('host_not_ready');
    } finally { clearTimeout(timer); }
  }
  readMemory() {
    const fields = this.contextProvider()?.extensionSettings;
    if (!fields) throw new ConfigStoreError('host_not_ready');
    let value;
    try { value = this.helperProvider().getVariables(CONFIG_SCOPE); }
    catch { throw new ConfigStoreError('host_read_failed'); }
    // getVariables returns {} both for absent and for a corrupt empty envelope.
    return Object.hasOwn(fields, CONFIG_SCOPE.extension_id) ? { kind: 'present', envelope: validateConfigEnvelope(value) } : { kind: 'missing' };
  }
  async load() {
    const epoch = this.generation;
    await this.ready();
    if (epoch !== this.generation) throw new ConfigStoreError('stale_host_context');
    return this.readMemory();
  }
  save(next, expectedWriteId) {
    const epoch = this.generation, identity = this.identityProvider();
    const envelope = validateConfigEnvelope(next);
    const operation = this.queue.then(async () => {
      await this.ready(); this.guard(epoch, identity);
      const current = this.readMemory();
      if ((current.envelope?.writeId ?? null) !== expectedWriteId) throw new ConfigStoreError('config_conflict');
      if (envelope.revision !== (current.envelope?.revision ?? 0) + 1 || envelope.writeId === expectedWriteId) throw new ConfigStoreError('invalid_write_identity');
      if (this.readServer) {
        const remote = await this.readServer(); this.guard(epoch, identity);
        if (remote.kind === 'present') validateConfigEnvelope(remote.envelope);
        if ((remote.envelope?.writeId ?? null) !== expectedWriteId) throw new ConfigStoreError('config_conflict');
      }
      // Recheck after the remote await. This is not cross-device atomic CAS.
      if ((this.readMemory().envelope?.writeId ?? null) !== expectedWriteId) throw new ConfigStoreError('config_conflict');
      try { await this.helperProvider().replaceVariables(envelope, CONFIG_SCOPE); }
      catch { throw new ConfigStoreError('submission_unconfirmed'); }
      this.guard(epoch, identity);
      const loaded = this.readMemory();
      if (stable(loaded.envelope) !== stable(envelope)) throw new ConfigStoreError('submission_unconfirmed');
      return { status: 'submitted', envelope: loaded.envelope };
    });
    this.queue = operation.catch(() => {});
    return operation;
  }
  async verifyPersisted(writeId) {
    if (!this.readServer) return { status: 'submitted', reason: 'server_readback_unavailable' };
    const epoch = this.generation, identity = this.identityProvider();
    await this.ready(); this.guard(epoch, identity);
    const local = this.readMemory();
    if (local.envelope?.writeId !== writeId) return { status: 'conflict' };
    let remote;
    try { remote = await this.readServer(); }
    catch { this.guard(epoch, identity); return { status: 'submitted', reason: 'server_read_failed' }; }
    this.guard(epoch, identity);
    if (remote.envelope?.writeId !== writeId) return { status: 'submitted', reason: 'server_write_not_observed' };
    if (stable(validateConfigEnvelope(remote.envelope)) !== stable(local.envelope)) throw new ConfigStoreError('persisted_content_mismatch');
    return { status: 'confirmed', writeId };
  }
}
