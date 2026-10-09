// Run in the target ST page, never in an unrelated browser or account.
export async function inspectHostConfigContract({ helper = globalThis.TavernHelper, context = globalThis.SillyTavern?.getContext?.(), fetchImpl = globalThis.fetch } = {}) {
  if (!helper?.getVariables || !helper?.replaceVariables || !context?.extensionSettings || !context?.getRequestHeaders) {
    throw new Error('Host configuration interfaces are not ready');
  }
  const scope = { type: 'extension', extension_id: 'xybattleConfigProbe20261009' };
  const readPersisted = async () => {
    const response = await fetchImpl('/api/settings/get', {
      method: 'POST', headers: context.getRequestHeaders(), body: '{}', cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Settings read failed (${response.status})`);
    const data = await response.json();
    if (typeof data.settings !== 'string') throw new Error('Unexpected settings response');
    const settings = JSON.parse(data.settings);
    if (!settings.extension_settings || typeof settings.extension_settings !== 'object') throw new Error('Invalid extension settings');
    // Return only the probe, never credentials or the full user settings.
    return { present: Object.hasOwn(settings.extension_settings, scope.extension_id), value: settings.extension_settings[scope.extension_id] };
  };
  const inspect = async () => {
    const persisted = await readPersisted();
    return { scope, persisted, memory: helper.getVariables(scope) };
  };
  const waitFor = async (matches, timeoutMs = 15000) => {
    const deadline = Date.now() + timeoutMs;
    do {
      const result = await readPersisted();
      if (matches(result)) return result;
      await new Promise(resolve => setTimeout(resolve, 250));
    } while (Date.now() < deadline);
    throw new Error('Probe persistence was not confirmed before timeout');
  };
  const roundTrip = async ({ onPersisted = async () => {}, timeoutMs = 15000 } = {}) => {
    const original = await readPersisted();
    const memoryPresent = Object.hasOwn(context.extensionSettings, scope.extension_id);
    const memory = helper.getVariables(scope);
    if (memoryPresent !== original.present || (memoryPresent && JSON.stringify(memory) !== JSON.stringify(original.value))) {
      throw new Error('Probe differs between memory and server; reload before testing');
    }
    const marker = { writeId: globalThis.crypto.randomUUID(), createdAt: new Date().toISOString(), purpose: 'config-contract-probe' };
    let restoration;
    try {
      helper.replaceVariables(marker, scope);
      await waitFor(result => result.value?.writeId === marker.writeId, timeoutMs);
      // Pause here to reload A and independently inspect B before restoration.
      await onPersisted({ scope, marker });
    } finally {
      // Do not overwrite another test's write or restore the whole settings object.
      const current = helper.getVariables(scope);
      const persisted = await readPersisted();
      if (current?.writeId !== marker.writeId || persisted.value?.writeId !== marker.writeId) {
        throw new Error('Probe changed or submission is unconfirmed; inspect before restoration');
      }
      if (original.present) helper.replaceVariables(original.value, scope);
      else {
        delete context.extensionSettings[scope.extension_id];
        context.saveSettingsDebounced();
      }
      restoration = await waitFor(result => result.present === original.present && (!original.present || JSON.stringify(result.value) === JSON.stringify(original.value)), timeoutMs);
    }
    return { writeId: marker.writeId, serverReadback: true, restored: restoration.present === original.present };
  };
  return { inspect, roundTrip };
}
