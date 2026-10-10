import { bindTrace, signalTrace } from './operation-log.js';
export const isCharacterTimeout = (error) => error?.code === 'CHARACTER_TIMEOUT';

// Host fetch wrappers/body readers may ignore abort. Reject independently too.
export async function withCharacterDeadline(operation, { timeoutMs, signal, label = '人物 AI 请求', resetOnProgress = false }) {
  const controller = new AbortController();
  bindTrace(controller.signal, signalTrace(signal));
  let timer, rejectStop;
  const stopped = new Promise((_, reject) => { rejectStop = reject; });
  const stop = (reason) => { rejectStop(reason); controller.abort(reason); };
  const abort = () => stop(isCharacterTimeout(signal?.reason) ? signal.reason : new DOMException('人物准备已取消', 'AbortError'));
  const startTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(() => stop(Object.assign(new Error(`${label}超时（${resetOnProgress ? '连续无进展' : '上限'} ${timeoutMs / 1000} 秒），已停止；请手动重试。`), { code: 'CHARACTER_TIMEOUT' })), timeoutMs);
  };
  const progress = () => { if (resetOnProgress && !controller.signal.aborted) startTimer(); };
  try {
    if (signal?.aborted) abort();
    else {
      signal?.addEventListener('abort', abort, { once: true });
      startTimer();
    }
    return await Promise.race([stopped, Promise.resolve().then(() => {
      if (controller.signal.aborted) throw controller.signal.reason;
      return operation(controller.signal, progress);
    })]);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
  }
}
