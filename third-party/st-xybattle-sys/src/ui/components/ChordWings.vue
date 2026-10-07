<template>
  <div class="xy-chord-wings" :class="['wings-' + side]">
    <!-- 背景流转灵弦轨迹线 (Harmonic Guiding Rays) -->
    <svg class="xy-wings-rays-svg" viewBox="0 0 380 400" preserveAspectRatio="none">
      <defs>
        <linearGradient :id="side + 'RayGrad'" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" :stop-color="side === 'player' ? '#38bdf8' : '#fb7185'" stop-opacity="0.7" />
          <stop offset="100%" :stop-color="side === 'player' ? '#2dd4bf' : '#fbbf24'" stop-opacity="0.1" />
        </linearGradient>
      </defs>

      <!-- 放射状灵弦光束 -->
      <path 
        v-for="(item, idx) in displayItems" 
        :key="'ray-' + idx"
        :d="computeRayPath(idx, displayItems.length)" 
        fill="none" 
        :stroke="`url(#${side}RayGrad)`" 
        stroke-width="1.5" 
        stroke-dasharray="5 7"
        opacity="0.6"
      />
    </svg>

    <!-- 扇形排列招式弦羽 (Fanned Technique Feathers) -->
    <div class="xy-wings-container">
      <button
        v-for="(item, idx) in displayItems"
        :key="item.id || idx"
        class="xy-wing-feather"
        :class="[
          'feather-' + side,
          { 
            'is-selected': isSelected(item),
            'is-shrunk': hasSelection && !isSelected(item),
            'is-locked': isLocked(item)
          }
        ]"
        :style="computeFeatherStyle(idx, displayItems.length, item)"
        :title="item.name + (isLocked(item) ? '（机缘未备·点击查阅密卷）' : '（本轮可用·点击查阅或起势）')"
        @click="onSelect(item)"
      >
        <!-- 羽端聚灵流光 (Tip Light Shimmer) -->
        <span class="xy-feather-tip"></span>

        <!-- 弦羽本体内容 -->
        <div class="xy-feather-inner">
          <span class="xy-feather-crest">◆</span>
          <span class="xy-feather-name">{{ item.name }}</span>
          
          <span v-if="isLocked(item)" class="xy-feather-lock" title="条件未足">🔒</span>
          <span v-else class="xy-feather-badge">{{ badgeText(item) }}</span>
        </div>

        <!-- 细密振动波纹 -->
        <span class="xy-feather-string" aria-hidden="true"></span>
      </button>

      <!-- 空白无招式提示 -->
      <div v-if="!items.length" class="xy-wings-empty">
        <span>{{ side === 'player' ? '未感应到可用功法弦羽' : '未见可察敌招' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  side: { type: String, default: 'player' },
  selectedTermId: { type: String, default: '' },
  isModalOpen: { type: Boolean, default: false }
});

const emit = defineEmits(['select-wing']);

// 最多展示 6 枚主要弦羽，保证视觉比例优雅挺拔
const displayItems = computed(() => {
  return props.items.slice(0, 6);
});

// 当弹窗开启且有选中招式时，触发草图动画（放大选中心法，收缩未选中心法）
const hasSelection = computed(() => {
  return props.isModalOpen && Boolean(props.selectedTermId);
});

function isSelected(item) {
  return props.selectedTermId === item.id;
}

function isLocked(item) {
  if (props.side === 'player') {
    return item.status && !item.status.available;
  }
  return false;
}


function badgeText(item) {
  if (props.side === 'player') {
    if (item.triggered) return '已发';
    if (item.status && !item.status.available) return '锁';
    return '可用';
  } else {
    const map = { known: '已知', inferred: '推测', unknown: '未知' };
    return map[item.status] || '观察';
  }
}

function onSelect(item) {
  emit('select-wing', { side: props.side, item });
}

// 放射弦线几何计算
function computeRayPath(idx, total) {
  if (total <= 1) {
    return props.side === 'player' ? 'M 0 200 L 380 200' : 'M 380 200 L 0 200';
  }
  const ratio = idx / (total - 1);
  const startY = 70 + ratio * 260;
  const endY = 40 + ratio * 320;

  if (props.side === 'player') {
    return `M 10 ${startY} C 140 ${startY}, 250 ${endY}, 375 ${endY}`;
  } else {
    return `M 370 ${startY} C 240 ${startY}, 130 ${endY}, 5 ${endY}`;
  }
}

// 扇形羽片倾角与动态位移样式计算
function computeFeatherStyle(idx, total, item) {
  if (total <= 1) return {};
  const ratio = idx / (total - 1);
  
  // 基础放射倾角：-20deg 到 +20deg
  const angle = (ratio - 0.5) * 36;
  // 横向拱形微弧
  const arch = Math.sin(ratio * Math.PI) * 20;

  const style = {
    '--angle': `${angle}deg`,
    '--arch': `${arch}px`
  };

  // 默认正常姿态
  if (!hasSelection.value) {
    if (props.side === 'player') {
      style.transform = `rotate(${angle}deg) translateX(${arch}px)`;
    } else {
      style.transform = `rotate(${-angle}deg) translateX(${-arch}px)`;
    }
  } else if (isSelected(item)) {
    // 1. 被点击技能放大（按草图要求向中台突出并显著放大）
    if (props.side === 'player') {
      style.transform = `rotate(${angle}deg) translateX(${arch + 42}px) scale(1.22)`;
    } else {
      style.transform = `rotate(${-angle}deg) translateX(${-(arch + 42)}px) scale(1.22)`;
    }
  } else {
    // 2. 未被点击技能丝滑收缩变小（按草图要求向人物内敛收拢）
    if (props.side === 'player') {
      style.transform = `rotate(${angle * 0.7}deg) translateX(${arch - 28}px) scale(0.68)`;
    } else {
      style.transform = `rotate(${-angle * 0.7}deg) translateX(${-(arch - 28)}px) scale(0.68)`;
    }
  }

  return style;
}
</script>

<style scoped>
.xy-chord-wings {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 250px;
  max-width: 320px;
  height: 100%;
  min-height: 340px;
  user-select: none;
}

.xy-wings-rays-svg {
  position: absolute;
  inset: -15px;
  width: calc(100% + 30px);
  height: calc(100% + 30px);
  pointer-events: none;
  z-index: 0;
  overflow: visible;
}

.xy-wings-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}

/* 弦羽单片基础造型 (Slanted Radiant Blade) - 尺寸显著增大 */
.xy-wing-feather {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 13px 20px;
  min-height: 52px;
  border-radius: 10px;
  border: 1px solid var(--xy-border-subtle);
  background: linear-gradient(135deg, rgba(14, 30, 54, 0.94) 0%, rgba(6, 14, 26, 0.98) 100%);
  backdrop-filter: blur(16px);
  color: var(--xy-text-title);
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  /* 丝滑合理的动效曲线 (Award-Winning Cubic-Bezier) */
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), 
              opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
              filter 0.4s ease, 
              box-shadow 0.3s ease, 
              border-color 0.3s ease;
  transform-origin: center left;
  outline: none;
  box-sizing: border-box;
}

.wings-enemy .xy-wing-feather {
  transform-origin: center right;
  flex-direction: row-reverse;
  background: linear-gradient(135deg, rgba(42, 16, 28, 0.94) 0%, rgba(20, 6, 14, 0.98) 100%);
  border-color: rgba(244, 63, 94, 0.28);
}

/* 主角羽片日常悬停 (未激活收缩时) */
.feather-player:hover:not(:disabled):not(.is-shrunk) {
  border-color: var(--xy-cyan-300);
  background: linear-gradient(135deg, rgba(18, 46, 82, 0.98) 0%, rgba(8, 22, 40, 1) 100%);
  box-shadow: 0 8px 30px var(--xy-cyan-glow), inset 0 0 16px rgba(56, 189, 248, 0.35);
}

/* 敌方羽片日常悬停 */
.feather-enemy:hover:not(:disabled):not(.is-shrunk) {
  border-color: var(--xy-crimson-400);
  background: linear-gradient(135deg, rgba(54, 22, 36, 0.98) 0%, rgba(26, 8, 18, 1) 100%);
  box-shadow: 0 8px 30px var(--xy-crimson-glow), inset 0 0 16px rgba(244, 63, 94, 0.35);
}

/* 1. 被点击技能放大状态 (The Expanded State in Sketch) */
.xy-wing-feather.is-selected {
  border-color: var(--xy-gold-400);
  background: linear-gradient(135deg, rgba(30, 58, 96, 1) 0%, rgba(14, 30, 54, 1) 100%);
  box-shadow: 0 0 32px var(--xy-gold-glow), 0 12px 36px rgba(0, 0, 0, 0.7);
  z-index: 25;
}

.wings-enemy .xy-wing-feather.is-selected {
  border-color: var(--xy-crimson-400);
  background: linear-gradient(135deg, rgba(64, 24, 42, 1) 0%, rgba(28, 10, 20, 1) 100%);
  box-shadow: 0 0 32px var(--xy-crimson-glow), 0 12px 36px rgba(0, 0, 0, 0.7);
}

/* 2. 未被点击技能丝滑收缩变小 (The Shrunk State in Sketch) */
.xy-wing-feather.is-shrunk {
  opacity: 0.22;
  filter: blur(0.8px);
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.xy-wing-feather.is-locked {
  opacity: 0.65;
  cursor: pointer;
  border-style: dashed;
}

.feather-player.is-locked:hover:not(.is-shrunk) {
  opacity: 0.95;
  border-color: var(--xy-cyan-400);
  background: linear-gradient(135deg, rgba(14, 34, 60, 0.95) 0%, rgba(6, 16, 32, 1) 100%);
  box-shadow: 0 6px 24px rgba(56, 189, 248, 0.25), inset 0 0 12px rgba(56, 189, 248, 0.2);
}

/* 剑羽尖芒 */
.xy-feather-tip {
  position: absolute;
  top: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  transition: all 0.3s;
}

.feather-player .xy-feather-tip {
  right: -3px;
  background: var(--xy-cyan-400);
  box-shadow: 0 0 10px var(--xy-cyan-glow);
}

.feather-enemy .xy-feather-tip {
  left: -3px;
  background: var(--xy-crimson-400);
  box-shadow: 0 0 10px var(--xy-crimson-glow);
}

.xy-wing-feather.is-selected .xy-feather-tip {
  width: 8px;
  height: 8px;
  background: var(--xy-gold-400);
  box-shadow: 0 0 16px var(--xy-gold-glow);
}

/* 内部文字布局 */
.xy-feather-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
}

.xy-feather-crest {
  font-size: 10px;
  color: var(--xy-gold-400);
  opacity: 0.8;
}

.xy-feather-name {
  font-family: var(--xy-font-serif);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--xy-cyan-100);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.feather-enemy .xy-feather-name {
  color: #fed7aa;
}

.xy-wing-feather.is-selected .xy-feather-name {
  color: #ffffff;
  text-shadow: 0 0 12px var(--xy-gold-300);
}

.xy-feather-badge {
  font-size: 10px;
  font-family: var(--xy-font-mono);
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--xy-text-muted);
}

.feather-player .xy-feather-badge {
  color: var(--xy-cyan-300);
  background: rgba(56, 189, 248, 0.15);
}

.feather-enemy .xy-feather-badge {
  color: var(--xy-crimson-300);
  background: rgba(244, 63, 94, 0.15);
}

.xy-feather-lock {
  font-size: 12px;
}

.xy-wings-empty {
  padding: 20px;
  text-align: center;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-size: 12px;
  color: var(--xy-text-muted);
  font-style: italic;
}
</style>
