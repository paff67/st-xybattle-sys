// Disposable host-capability probe, not an event adjudicator.
// Inert outside the explicitly armed disposable chat. No resource writes.
const state = { armed: false, trace: [], mode: 'pass', release: null };
globalThis.codexYiyuP0 = state;
globalThis.codexYiyuP0Interceptor = async (_chat, _size, abort, type) => {
  const c = SillyTavern.getContext();
  if (c.chatId !== 'codex-event-p0-empty-20261007') return;
  state.trace.push({ event: 'interceptor_seen', type, time: Date.now(), length: c.chat.length });
  if (!state.armed) return;
  state.armed = false;
  state.trace.push({ event: 'hold', time: Date.now(), type });
  try {
    await new Promise(resolve => { state.release = resolve; });
    if (state.mode === 'throw') throw new Error('P0 intentional internal failure');
    if (state.mode === 'abort') { abort(true); state.trace.push({ event: 'explicit_abort', time: Date.now() }); return; }
    TavernHelper.injectPrompts([{id:'p0-interceptor-packet',role:'system',position:'in_chat',depth:0,should_scan:false,content:'P0_PACKET_20261007 interceptor probe'}],{once:true});
    state.trace.push({ event: 'resume', time: Date.now() });
  } catch (error) {
    abort(true);
    state.trace.push({ event: 'caught_failure_abort', time: Date.now(), error: String(error) });
  } finally { state.release = null; }
};
