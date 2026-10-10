const signals = new WeakMap();
export const bindTrace = (signal, trace) => { if (signal && trace) signals.set(signal, trace); };
export const signalTrace = signal => signal && signals.get(signal);
const bytes = value => new TextEncoder().encode(value).byteLength;
export const ERROR_GUIDANCE = Object.freeze({
  TIMEOUT: ['阶段超过等待上限', '本阶段未确认完成', '可能是网络或服务响应过慢', '检查连接；先核对提交状态再重试'],
  MODEL_HTTP: ['模型 HTTP 请求失败', '未获得本次模型结果', '可能是接口、权限或上游服务异常', '检查接口与凭据，查看 HTTP 状态'],
  PARSE_FAILED: ['响应解析失败', '该响应未作为有效结果使用', '可能是输出截断或格式不符合要求', '检查输出上限与接口格式'],
  VALIDATION_FAILED: ['业务校验失败', '候选结果未通过本阶段校验', '可能是字段、资料引用或状态版本不匹配', '核对当前分支与资料；勿手动重复提交'],
  PERSISTENCE_FAILED: ['宿主保存或读回未确认', '不能宣称服务器已提交', '可能是网络、版本冲突或宿主保存失败', '核对服务器记录后重试保存'],
  NARRATIVE_FAILED: ['后续正文未完成', '已提交的裁定结果保留', '可能是用户停止、宿主生成失败或未返回正文', '核对提交阶段后仅重试正文或跳过正文'],
  CANCELLED: ['操作已取消', '未完成的步骤停止继续', '用户停止或聊天作用域改变', '查看已提交阶段，按需重新发起'],
  UNEXPECTED: ['阶段出现异常', '参见失败阶段及已提交记录', '原因尚未确定', '导出运行日志供排查'],
});
export function errorCode(error, stage = '') {
  if (/TIMEOUT/.test(error?.code || '') || /超时|timeout/i.test(error?.message || '')) return 'TIMEOUT';
  if (error?.name === 'AbortError') return 'CANCELLED';
  if (error?.name === 'EventPersistenceError' || stage === 'commit') return 'PERSISTENCE_FAILED';
  if (error?.code && ERROR_GUIDANCE[error.code]) return error.code;
  if (stage === 'parse' || error instanceof SyntaxError) return 'PARSE_FAILED';
  if (stage === 'validation') return 'VALIDATION_FAILED';
  if (stage === 'request') return 'MODEL_HTTP';
  return 'UNEXPECTED';
}

export class OperationLogger {
  constructor({ maxRecords = 1000, maxBytes = 1024 * 1024, maxRecordBytes = 8192, maxDepth = 5, batchMs = 80, secrets = () => [] } = {}) {
    Object.assign(this, { maxRecords, maxBytes, maxRecordBytes, maxDepth, batchMs, secrets });
    this.secretSources = new Set(); this.records = []; this.totalBytes = 0; this.dropped = 0; this.listeners = new Set(); this.enabled = true; this.debug = false;
  }
  sanitize(value) {
    const seen = new WeakSet(); let nodes = 0;
    const redact = text => {
      let result = String(text).replace(/Bearer\s+\S+|\bsk-[\w-]+/gi, '[REDACTED]');
      for (const secret of [this.secrets(), ...[...this.secretSources].map(source => source())].flat().filter(Boolean)) result = result.split(secret).join('[REDACTED]');
      return result.slice(0, 1600);
    };
    const visit = (item, depth) => {
      if (++nodes > 300) return '[truncated]';
      if (typeof item === 'string') return redact(item);
      if (item == null || typeof item === 'boolean' || typeof item === 'number') return item;
      if (typeof item !== 'object') return String(typeof item);
      if (seen.has(item)) return '[circular]';
      if (depth >= this.maxDepth) return '[depth limit]';
      seen.add(item);
      // Never export arbitrary exception text/stack: upstreams may echo prompts or keys.
      if (item instanceof Error) return { name: redact(item.name), code: errorCode(item) };
      if (Array.isArray(item)) return item.slice(0, 30).map(v => visit(v, depth + 1));
      const out = {};
      for (const key of Object.keys(item).slice(0, 40)) {
        if (/api.?key|authorization|cookie|token|password|secret|credential|prompt|content|messages|history|raw|body|response|input|output|text|reasoning|endpoint|aiRead|playerVisible|^record$|^packet$|^narrative$|^request$|^error$/i.test(key)) { out[redact(key)] = '[omitted]'; continue; }
        const descriptor = Object.getOwnPropertyDescriptor(item, key);
        out[redact(key)] = descriptor && 'value' in descriptor ? visit(descriptor.value, depth + 1) : '[accessor]';
      }
      return out;
    };
    return visit(value, 0);
  }
  registerSecrets(source) { this.secretSources.add(source); return () => this.secretSources.delete(source); }
  emit(fields) {
    try {
      if (!this.enabled || fields.level === 'DEBUG' && !this.debug) return;
      let record = this.sanitize({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), level: 'INFO', module: 'runtime', event: 'stage', runId: 'system', stage: 'runtime', status: 'running', message: '', data: {}, ...fields });
      let json = JSON.stringify(record);
      if (bytes(json) > this.maxRecordBytes) { record.data = { truncated: true }; json = JSON.stringify(record); }
      const size = bytes(json);
      if (size > this.maxRecordBytes || size > this.maxBytes) { this.dropped++; return; }
      this.records.push({ record, size }); this.totalBytes += size;
      while (this.records.length > this.maxRecords || this.totalBytes > this.maxBytes) { this.totalBytes -= this.records.shift().size; this.dropped++; }
      this.notify();
    } catch { /* Observability must never interrupt business. */ }
  }
  notify() {
    if (this.timer) return;
    this.timer = setTimeout(() => { this.timer = null; for (const fn of this.listeners) { try { fn(); } catch { /* isolate UI */ } } }, this.batchMs);
    this.timer.unref?.();
  }
  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  snapshot() { return structuredClone(this.records.map(v => v.record)); }
  clear() { this.records = []; this.totalBytes = 0; this.dropped = 0; this.notify(); }
  export() { return JSON.stringify({ schema: 'xy_operation_log_v1', exportedAt: new Date().toISOString(), enabled: this.enabled, debug: this.debug, dropped: this.dropped, limits: { records: this.maxRecords, bytes: this.maxBytes, perRecord: this.maxRecordBytes, depth: this.maxDepth }, records: this.snapshot() }, null, 2); }
  start(module, identity = {}) {
    try {
      const context = globalThis.SillyTavern?.getContext?.();
      identity = { chatId: context?.chatId, ...identity };
    } catch { /* Hosts may not yet be ready. */ }
    const runId = crypto.randomUUID(), started = Date.now(); let ended = false, attempt = 0;
    const write = (stage, status, message, data = {}, level = 'INFO', extra = {}) => this.emit({ ...identity, runId, module, stage, status, message, data, level, event: stage, ...extra });
    const trace = { runId, write, result: {},
      identify: fields => { identity = { ...identity, ...fields }; },
      nextAttempt: () => ++attempt,
      fail: (stage, error, data = {}) => { const code = errorCode(error, stage); write(stage, code === 'CANCELLED' ? 'cancelled' : 'failed', ERROR_GUIDANCE[code][0], { ...data, code, errorName: error?.name }, code === 'CANCELLED' ? 'WARN' : 'ERROR'); },
      async span(stage, operation, data = {}) {
        const at = Date.now(); write(stage, 'running', `${stage} 开始`, data);
        try { const value = await operation(); write(stage, 'success', `${stage} 完成`, data, 'INFO', { durationMs: Date.now() - at }); return value; }
        catch (error) { const code = errorCode(error, stage); write(stage, code === 'CANCELLED' ? 'cancelled' : 'failed', ERROR_GUIDANCE[code][0], { ...data, code }, code === 'CANCELLED' ? 'WARN' : 'ERROR', { durationMs: Date.now() - at }); throw error; }
      },
      end: (status, data = {}) => { if (ended) return; ended = true; write('end', status, '操作结束', { ...trace.result, ...data }, ['failed'].includes(status) ? 'ERROR' : ['degraded','cancelled'].includes(status) ? 'WARN' : 'INFO', { durationMs: Date.now() - started }); },
    };
    write('trigger', 'running', '操作已触发'); return trace;
  }
}
export const operationLog = new OperationLogger();

export function observeOperation(module, identity, operation) {
  const trace = operationLog.start(module, identity);
  const success = value => { trace.end(value?.stale || ['cancelled','obsolete'].includes(value?.status) ? 'cancelled' : value?.status === 'failed' ? 'failed' : trace.result.temporary || value?.entryError || value?.status === 'submitted' || value?.confirmed === false || value?.queued === false || value?.sendRequested === false || value?.record?.narrativeError || value?.status === 'needs_context' ? 'degraded' : value?.record?.narrative?.pending || value?.deduplicated ? 'skipped' : 'success', { stale: !!value?.stale, awaitingHostNarrative: !!value?.record?.narrative?.pending }); return value; };
  const failure = error => { trace.fail(module, error); trace.end(error?.name === 'AbortError' ? 'cancelled' : 'failed'); throw error; };
  try { const value = operation(trace); return value?.then ? value.then(success, failure) : success(value); }
  catch (error) { return failure(error); }
}

// Instrument the public business boundary, retaining sync/async return contracts.
export function observeMethods(target, module, methods, identity = () => ({})) {
  for (const name of methods) {
    const original = target[name];
    if (typeof original !== 'function') continue;
    target[name] = function (...args) {
      const inherited = args.at(-1)?.trace;
      const invoke = trace => {
        trace.write(name, 'running', '业务入口开始');
        const callArgs = [...args];
        const optionIndex = module === 'content' ? ({put:1,putMany:1,update:2,copy:1,exportContents:1})[name] : undefined;
        if (optionIndex !== undefined) callArgs[optionIndex] = { ...callArgs[optionIndex], trace };
        const result = original.apply(this, callArgs);
        const done = value => {
          if (value !== false && ['put','putMany','remove','clear','update','copy','saveCoreRuleConfig','confirmCharacters','applyContentEntries','importData','importScene','importRegistry','start','stop','continueNext','skipPendingNarrative'].includes(name)) { trace.result.committed = true; trace.write('commit','success','本地状态写入完成',{target:module==='content'?'catalogue':'local-state',confirmedByServer:false,committed:true}); }
          if (module === 'content' && this.durability === 'temporary') { trace.result.temporary = true; trace.write('storage','degraded','内容仅保存在当前页面内存',{reasonCode:'indexeddb_unavailable'},'WARN'); }
          trace.write(name, value?.confirmed === false ? 'degraded' : 'success', '业务入口返回', { confirmed: value?.confirmed, status: value?.status }); return value; };
        return result?.then ? result.then(done) : done(result);
      };
      return inherited ? invoke(inherited) : observeOperation(module, { ...identity(args), operation: name }, invoke);
    };
  }
}
