<template>
  <div class="xy-harmonic-gauge">
    <!-- 顶部回合印章 -->
    <div class="xy-gauge-round">
      <span class="xy-round-roman">ROUND</span>
      <b class="xy-round-num">{{ round > 0 ? (round < 10 ? '0' + round : round) : '—' }}</b>
    </div>

    <!-- 动态声学正弦波 / 灵弦张力可视化仪轨 -->
    <div class="xy-wave-resonator">
      <svg class="xy-wave-svg" viewBox="0 0 120 70" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveCyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" />
            <stop offset="50%" stop-color="#2dd4bf" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#fb7185" stop-opacity="0.8" />
          </linearGradient>
        </defs>

        <!-- 谐波弦 1 (动态起伏) -->
        <path 
          class="xy-sine-path p1" 
          d="M 0 35 Q 30 18, 60 35 T 120 35" 
          fill="none" 
          stroke="url(#waveCyanGrad)" 
          stroke-width="1.8" 
        />
        <!-- 谐波弦 2 (反相) -->
        <path 
          class="xy-sine-path p2" 
          d="M 0 35 Q 30 52, 60 35 T 120 35" 
          fill="none" 
          stroke="rgba(251, 191, 36, 0.5)" 
          stroke-width="1.2" 
        />
        <!-- 中枢节点 -->
        <circle cx="60" cy="35" r="3.5" fill="#fbbf24" class="xy-center-node" />
      </svg>
    </div>

    <!-- VS 核心灵符印记 -->
    <div class="xy-vs-emblem">
      <span class="xy-vs-text">VS</span>
      <div class="xy-vs-aura"></div>
    </div>

    <!-- 战局控制势态 -->
    <div class="xy-dominance-pill" :class="dominanceTone">
      <span class="xy-dom-label">{{ dominanceText }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  round: { type: Number, default: 0 },
  semanticState: { type: Object, default: () => ({}) }
});

const dominanceText = computed(() => {
  return props.semanticState['压制'] || props.semanticState.control || '均势对峙';
});

const dominanceTone = computed(() => {
  const d = dominanceText.value;
  if (d.includes('主角') || d.includes('胜')) return 'dom-player';
  if (d.includes('敌') || d.includes('劣')) return 'dom-enemy';
  return 'dom-neutral';
});
</script>

<style scoped>
.xy-harmonic-gauge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  user-select: none;
  min-width: 100px;
}

.xy-gauge-round {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--xy-font-mono);
  line-height: 1.1;
}

.xy-round-roman {
  font-size: 8px;
  letter-spacing: 0.22em;
  color: var(--xy-text-muted);
}

.xy-round-num {
  font-size: 14px;
  color: var(--xy-gold-300);
  font-weight: 600;
  text-shadow: 0 0 10px var(--xy-gold-glow);
}

.xy-wave-resonator {
  width: 90px;
  height: 28px;
}

.xy-wave-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.xy-sine-path.p1 {
  animation: sine-wave-pulse 3s ease-in-out infinite alternate;
}

.xy-sine-path.p2 {
  animation: sine-wave-pulse 2.2s ease-in-out infinite alternate-reverse;
}

@keyframes sine-wave-pulse {
  0% { transform: scaleY(0.7); }
  100% { transform: scaleY(1.3); }
}

.xy-center-node {
  animation: xy-pulse-glow 2s infinite;
}

.xy-vs-emblem {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, rgba(25, 45, 75, 0.9), rgba(8, 16, 28, 0.95));
  border: 1px solid var(--xy-border-gold);
  box-shadow: 0 0 16px var(--xy-gold-glow), 0 4px 12px rgba(0, 0, 0, 0.5);
}

.xy-vs-text {
  font-family: var(--xy-font-serif);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.08em;
  background: linear-gradient(135deg, #fef08a 0%, #f59e0b 60%, #d97706 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 8px rgba(251, 191, 36, 0.3);
}

.xy-vs-aura {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1px dashed rgba(251, 191, 36, 0.3);
  animation: vs-rotate 20s linear infinite;
}

@keyframes vs-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.xy-dominance-pill {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-family: var(--xy-font-sans);
  letter-spacing: 0.08em;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  white-space: nowrap;
}

.dom-neutral {
  color: var(--xy-gold-300);
  border-color: rgba(251, 191, 36, 0.25);
}

.dom-player {
  color: var(--xy-cyan-300);
  border-color: rgba(56, 189, 248, 0.35);
  background: rgba(56, 189, 248, 0.08);
  text-shadow: 0 0 8px var(--xy-cyan-glow);
}

.dom-enemy {
  color: var(--xy-crimson-300);
  border-color: rgba(244, 63, 94, 0.35);
  background: rgba(244, 63, 94, 0.08);
  text-shadow: 0 0 8px var(--xy-crimson-glow);
}
</style>
