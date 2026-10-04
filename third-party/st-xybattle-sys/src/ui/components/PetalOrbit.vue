<template>
  <div class="xy-petal-orbit" :class="'orbit-' + side">
    <div class="xy-orbit-rail" aria-hidden="true">
      <svg class="xy-orbit-arc-svg" viewBox="0 0 400 240">
        <path 
          :d="side === 'player' ? 'M 30 200 C 180 180, 320 120, 380 20' : 'M 370 200 C 220 180, 80 120, 20 20'" 
          fill="none" 
          :stroke="side === 'player' ? 'url(#playerArcGrad)' : 'url(#enemyArcGrad)'" 
          stroke-width="1"
          stroke-dasharray="3 5"
        />
        <defs>
          <linearGradient id="playerArcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#2dd4bf" stop-opacity="0.05" />
          </linearGradient>
          <linearGradient id="enemyArcGrad" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#fb7185" stop-opacity="0.05" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- 花瓣/音羽词条项 -->
    <div class="xy-petals-container">
      <button
        v-for="(item, index) in items"
        :key="item.id"
        class="xy-petal"
        :class="[
          'petal-' + side,
          toneClass(item),
          { 'is-selected': isSelected(item), 'is-disabled': isDisabled(item) }
        ]"
        :disabled="isDisabled(item)"
        :title="item.description || item.rawDescription || item.originalDefinition || ''"
        :style="{ '--petal-i': index }"
        @click="onSelect(item)"
      >
        <!-- 琴弦共振外环 -->
        <span class="xy-petal-glow"></span>

        <!-- 词条名与状态 -->
        <div class="xy-petal-content">
          <div class="xy-petal-top">
            <span class="xy-petal-name">{{ item.name }}</span>
            <span v-if="isDisabled(item)" class="xy-petal-lock-icon">🔒</span>
          </div>
          <div class="xy-petal-badge">
            {{ stateBadge(item) }}
          </div>
        </div>

        <!-- 细微振动粒子效果 -->
        <span class="xy-string-vibe" aria-hidden="true"></span>
      </button>

      <div v-if="!items.length" class="xy-orbit-empty">
        <span>{{ side === 'player' ? '未装配可用功法' : '未见可察敌招' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: { type: Array, default: () => [] },
  side: { type: String, default: 'player' },
  selectedTermId: { type: String, default: '' }
});

const emit = defineEmits(['select-petal']);

function isSelected(item) {
  return props.selectedTermId === item.id;
}

function isDisabled(item) {
  if (props.side === 'player') {
    return item.status && !item.status.available;
  }
  return false;
}

function toneClass(item) {
  if (props.side === 'player') {
    if (item.status && !item.status.available) return 'tone-locked';
    if (item.triggered) return 'tone-triggered';
    return 'tone-ready';
  } else {
    if (item.status === 'unknown') return 'tone-unknown';
    if (item.status === 'inferred') return 'tone-inferred';
    return 'tone-known';
  }
}

function stateBadge(item) {
  if (props.side === 'player') {
    if (item.status && !item.status.available) return '条件不足';
    if (item.triggered) return '已触发';
    return '可用';
  } else {
    const map = { known: '已知', inferred: '推测', unknown: '未知' };
    return map[item.status] || '观察中';
  }
}

function onSelect(item) {
  emit('select-petal', { side: props.side, item });
}
</script>

<style scoped>
.xy-petal-orbit {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 110px;
  padding: 12px 0 6px;
}

.xy-orbit-rail {
  position: absolute;
  inset: -10px -20px 0 -20px;
  pointer-events: none;
  overflow: hidden;
  opacity: 0.7;
}

.xy-orbit-arc-svg {
  width: 100%;
  height: 100%;
}

.xy-petals-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-width: 100%;
}

.orbit-player .xy-petals-container {
  justify-content: flex-start;
  padding-right: 5%;
}

.orbit-enemy .xy-petals-container {
  justify-content: flex-end;
  padding-left: 5%;
}

/* 花瓣单项样式 */
.xy-petal {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 108px;
  max-width: 154px;
  padding: 9px 14px;
  border-radius: 20px 8px 18px 8px;
  border: 1px solid var(--xy-border-subtle);
  background: linear-gradient(135deg, rgba(14, 28, 48, 0.92) 0%, rgba(8, 16, 28, 0.95) 100%);
  color: var(--xy-text-body);
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(12px);
  transition: all 0.22s var(--xy-ease-out-expo);
  transform-origin: center;
}

.orbit-enemy .xy-petal {
  border-radius: 8px 20px 8px 18px;
}

.xy-petal:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 8px 24px var(--xy-cyan-glow);
  border-color: var(--xy-cyan-400);
}

.xy-petal.is-selected {
  transform: translateY(-5px) scale(1.05);
  background: linear-gradient(135deg, rgba(20, 48, 80, 0.95) 0%, rgba(12, 28, 50, 0.98) 100%);
  border-color: var(--xy-gold-400);
  box-shadow: 0 0 20px var(--xy-gold-glow), 0 8px 25px rgba(0, 0, 0, 0.5);
  z-index: 3;
}

.xy-petal.is-selected .xy-petal-name {
  color: #ffffff;
  text-shadow: 0 0 10px var(--xy-gold-300);
}

.xy-petal.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
  border-style: dashed;
}

/* 主角花瓣色彩 */
.petal-player.tone-ready {
  border-color: rgba(56, 189, 248, 0.35);
}
.petal-player.tone-ready:hover {
  border-color: var(--xy-cyan-300);
}

/* 敌方花瓣色彩 */
.petal-enemy {
  background: linear-gradient(135deg, rgba(38, 18, 28, 0.92) 0%, rgba(24, 10, 18, 0.95) 100%);
  border-color: rgba(244, 63, 94, 0.28);
}
.petal-enemy:hover {
  border-color: var(--xy-crimson-400);
  box-shadow: 0 8px 24px var(--xy-crimson-glow);
}
.petal-enemy.is-selected {
  border-color: var(--xy-crimson-400);
  box-shadow: 0 0 20px var(--xy-crimson-glow);
}
.petal-enemy.tone-unknown {
  border-style: dashed;
  opacity: 0.65;
}
.petal-enemy.tone-inferred {
  border-style: dotted;
}

/* 内容排版 */
.xy-petal-content {
  position: relative;
  z-index: 1;
}

.xy-petal-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}

.xy-petal-name {
  font-family: var(--xy-font-serif);
  font-size: 13px;
  font-weight: 500;
  color: var(--xy-cyan-100);
  letter-spacing: 0.05em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.petal-enemy .xy-petal-name {
  color: var(--xy-crimson-300);
}

.xy-petal-lock-icon {
  font-size: 10px;
}

.xy-petal-badge {
  margin-top: 4px;
  font-size: 9px;
  font-family: var(--xy-font-mono);
  color: var(--xy-text-muted);
  letter-spacing: 0.08em;
}

.tone-ready .xy-petal-badge { color: var(--xy-cyan-400); }
.tone-locked .xy-petal-badge { color: #94a3b8; }
.tone-known .xy-petal-badge { color: var(--xy-crimson-400); }
.tone-inferred .xy-petal-badge { color: var(--xy-gold-400); }
.tone-unknown .xy-petal-badge { color: var(--xy-text-muted); }

.xy-orbit-empty {
  padding: 12px 18px;
  font-size: 12px;
  color: var(--xy-text-muted);
  font-style: italic;
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: 8px;
}
</style>
