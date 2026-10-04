<template>
  <Transition name="xy-drawer-slide">
    <aside v-if="isOpen" class="xy-timeline-drawer-backdrop" @click.self="$emit('close')">
      <div class="xy-timeline-drawer-panel">
        <div class="xy-drawer-header">
          <div class="xy-drawer-title">
            <span class="xy-d-icon">⏳</span>
            <span>演武战史与天道批注</span>
            <span class="xy-count-badge">{{ timeline.length }}</span>
          </div>
          <button class="xy-close-drawer-btn" @click="$emit('close')" aria-label="收起战史">✕</button>
        </div>

        <div class="xy-drawer-body xy-custom-scroll">
          <!-- 历史交锋流 -->
          <div v-if="timeline.length" class="xy-timeline-stream">
            <article 
              v-for="item in timeline.slice().reverse()" 
              :key="item.actionId || item.roundId" 
              class="xy-timeline-card"
            >
              <div class="xy-t-head">
                <span class="xy-t-round">{{ item.roundId }}</span>
                <span class="xy-t-status" :class="'st-' + item.status">{{ statusLabel(item.status) }}</span>
                <span class="xy-t-action-id" v-if="item.actionId">#{{ item.actionId.slice(-6) }}</span>
              </div>

              <h4 class="xy-t-label">【行动】{{ item.label }}</h4>

              <div class="xy-t-outcome">
                <b>裁定结果：</b>
                <span>{{ item.outcome || '天道判定无明文' }}</span>
              </div>

              <div class="xy-t-narrative" v-if="item.narrative">
                <b>正文演化：</b>
                <p>{{ item.narrative }}</p>
              </div>
              <div v-else class="xy-t-narrative-empty">
                <span>裁定已确立；等待主剧情推进演化……</span>
              </div>
            </article>
          </div>

          <div v-else class="xy-timeline-empty">
            <span>战端初起，尚无回合记录。</span>
          </div>

          <!-- 公开可观测战报 -->
          <div class="xy-public-events-section" v-if="publicEvents.length">
            <h5 class="xy-pe-title">可观测天地变数 ({{ publicEvents.length }})</h5>
            <ol class="xy-pe-list">
              <li v-for="(ev, idx) in publicEvents.slice(-8)" :key="idx">{{ ev }}</li>
            </ol>
          </div>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<script setup>
defineProps({
  isOpen: { type: Boolean, default: false },
  timeline: { type: Array, default: () => [] },
  publicEvents: { type: Array, default: () => [] }
});

defineEmits(['close']);

function statusLabel(s) {
  const m = {
    complete: '演进圆满',
    committed: '裁定已定',
    interrupted: '行动中断',
    prepared: '预备就绪'
  };
  return m[s] || s;
}
</script>

<style scoped>
.xy-timeline-drawer-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(3, 7, 13, 0.5);
  backdrop-filter: blur(8px);
  z-index: 50;
  display: flex;
  justify-content: flex-end;
}

.xy-timeline-drawer-panel {
  width: 440px;
  max-width: 90vw;
  height: 100%;
  background: linear-gradient(180deg, rgba(10, 22, 38, 0.98) 0%, rgba(6, 14, 26, 0.99) 100%);
  border-left: 1px solid var(--xy-border-glow);
  box-shadow: -16px 0 50px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
}

.xy-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(8, 18, 32, 0.9);
}

.xy-drawer-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--xy-font-serif);
  font-size: 14px;
  font-weight: 500;
  color: var(--xy-cyan-200);
}

.xy-d-icon {
  font-size: 15px;
}

.xy-count-badge {
  font-size: 10px;
  font-family: var(--xy-font-mono);
  padding: 1px 7px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.15);
  color: var(--xy-cyan-300);
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.xy-close-drawer-btn {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.25);
  color: var(--xy-text-muted);
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

.xy-close-drawer-btn:hover {
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.25) 0%, rgba(225, 29, 72, 0.1) 100%);
  border-color: rgba(244, 63, 94, 0.5);
  color: #fca5a5;
  box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.4), 0 4px 14px rgba(244, 63, 94, 0.3);
  transform: rotate(90deg) scale(1.05);
}

.xy-drawer-body {
  flex: 1;
  padding: 16px 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.xy-timeline-stream {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.xy-timeline-card {
  padding: 12px 14px;
  border-radius: 8px;
  background: rgba(14, 28, 48, 0.85);
  border: 1px solid rgba(56, 189, 248, 0.15);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
}

.xy-t-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  font-family: var(--xy-font-mono);
  margin-bottom: 6px;
}

.xy-t-round {
  color: var(--xy-gold-400);
  font-weight: 600;
}

.xy-t-status {
  padding: 1px 6px;
  border-radius: 3px;
}
.st-complete { background: rgba(45, 212, 191, 0.15); color: var(--xy-jade-300); }
.st-committed { background: rgba(56, 189, 248, 0.15); color: var(--xy-cyan-300); }
.st-interrupted { background: rgba(244, 63, 94, 0.15); color: var(--xy-crimson-400); }

.xy-t-action-id {
  color: var(--xy-text-hint);
  margin-left: auto;
}

.xy-t-label {
  margin: 0 0 6px;
  font-family: var(--xy-font-serif);
  font-size: 13px;
  color: var(--xy-text-title);
}

.xy-t-outcome, .xy-t-narrative {
  font-size: 12px;
  line-height: 1.6;
  color: var(--xy-text-body);
}

.xy-t-outcome b, .xy-t-narrative b {
  color: var(--xy-cyan-300);
  font-weight: 500;
}

.xy-t-narrative p {
  margin: 4px 0 0;
  color: #e2e8f0;
}

.xy-t-narrative-empty {
  font-size: 11px;
  color: var(--xy-text-muted);
  font-style: italic;
  margin-top: 4px;
}

.xy-timeline-empty {
  padding: 30px 0;
  text-align: center;
  color: var(--xy-text-hint);
  font-size: 12px;
}

.xy-public-events-section {
  padding-top: 14px;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
}

.xy-pe-title {
  margin: 0 0 8px;
  font-size: 11px;
  font-family: var(--xy-font-serif);
  color: var(--xy-gold-300);
}

.xy-pe-list {
  margin: 0;
  padding-left: 16px;
  font-size: 11px;
  color: var(--xy-text-body);
  line-height: 1.7;
}

/* 抽屉滑动过渡 */
.xy-drawer-slide-enter-active, .xy-drawer-slide-leave-active {
  transition: opacity 0.25s var(--xy-ease-smooth);
}
.xy-drawer-slide-enter-from, .xy-drawer-slide-leave-to {
  opacity: 0;
}

.xy-drawer-slide-enter-active .xy-timeline-drawer-panel {
  transition: transform 0.3s var(--xy-ease-out-expo);
}
.xy-drawer-slide-leave-active .xy-timeline-drawer-panel {
  transition: transform 0.25s var(--xy-ease-smooth);
}
.xy-drawer-slide-enter-from .xy-timeline-drawer-panel {
  transform: translateX(100%);
}
.xy-drawer-slide-leave-to .xy-timeline-drawer-panel {
  transform: translateX(100%);
}
</style>
