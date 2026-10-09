// One writer in this JS runtime plus an origin-wide Web Lock where available.
// This cannot provide a cross-device CAS; server revision checks remain required.
export class EventOperationLock {
  constructor({ locks = globalThis.navigator?.locks } = {}) { this.locks = locks; this.owner = null; }
  async acquire(key, owner) {
    if (this.owner) throw new Error('当前聊天正在处理另一项事务');
    this.owner = owner;
    let releaseRemote = () => {};
    try {
      if (this.locks?.request) await new Promise((resolve, reject) => {
        this.locks.request(`xy-event:${key}`, { mode: 'exclusive', ifAvailable: true }, async lock => {
          if (!lock) { reject(new Error('另一标签页正在处理当前聊天')); return; }
          await new Promise(release => { releaseRemote = release; resolve(); });
        }).catch(reject);
      });
    } catch (error) { this.owner = null; throw error; }
    let released = false;
    return () => { if (released) return; released = true; releaseRemote(); if (this.owner === owner) this.owner = null; };
  }
  async run(key, owner, operation) {
    const release = await this.acquire(key, owner);
    try { return await operation(); } finally { release(); }
  }
  async queued(key, owner, operation, { signal, timeoutMs = 30000 } = {}) {
    const end = Date.now() + timeoutMs;
    while (true) {
      if (signal?.aborted) throw new DOMException('排队已取消', 'AbortError');
      if (Date.now() >= end) throw new Error('战斗准备等待共享锁超时');
      let release;
      try { release = await this.acquire(key, owner); }
      catch (error) {
        if (!/另一|当前聊天/.test(error.message)) throw error;
        await new Promise(resolve => setTimeout(resolve, 50)); continue;
      }
      try { if (signal?.aborted) throw new DOMException('排队已取消', 'AbortError'); return await operation(); }
      finally { release(); }
    }
  }
}
