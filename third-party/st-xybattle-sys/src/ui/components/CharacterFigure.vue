<template>
  <div class="xy-figure-container" :class="['figure-' + side]">
    <!-- 水镜灵韵光环 (Water-Mirror Aura Halo) -->
    <div class="xy-figure-halo" aria-hidden="true"></div>

    <!-- 自定义立绘头像 (若有) -->
    <div v-if="hasCustomAvatar" class="xy-figure-custom">
      <img :src="customAvatar" :alt="name" class="xy-custom-img" />
      <div class="xy-custom-frame-deco"></div>
    </div>

    <!-- 默认国风仙侠意境法相立绘 (Default Ethereal Xianxia Daoist Silhouette) -->
    <div v-else class="xy-figure-silhouette" :class="side">
      <svg class="xy-daoist-svg" viewBox="0 0 220 380" preserveAspectRatio="xMidYMid meet">
        <defs>
          <!-- 主角青苍水灵渐变 -->
          <linearGradient id="playerRobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
            <stop offset="40%" stop-color="#0284c7" stop-opacity="0.8" />
            <stop offset="85%" stop-color="#082f49" stop-opacity="0.95" />
            <stop offset="100%" stop-color="#03070d" stop-opacity="1" />
          </linearGradient>

          <!-- 敌手幽冥朱砂渐变 -->
          <linearGradient id="enemyRobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fb7185" stop-opacity="0.9" />
            <stop offset="40%" stop-color="#be123c" stop-opacity="0.8" />
            <stop offset="85%" stop-color="#4c0519" stop-opacity="0.95" />
            <stop offset="100%" stop-color="#03070d" stop-opacity="1" />
          </linearGradient>

          <!-- 灵光核心 -->
          <radialGradient :id="side + 'CoreGrad'" cx="50%" cy="50%" r="50%">
            <stop offset="0%" :stop-color="side === 'player' ? '#e0f2fe' : '#ffe4e6'" stop-opacity="1" />
            <stop offset="40%" :stop-color="side === 'player' ? '#38bdf8' : '#f43f5e'" stop-opacity="0.8" />
            <stop offset="100%" :stop-color="side === 'player' ? '#0369a1' : '#881337'" stop-opacity="0" />
          </radialGradient>

          <!-- 灵弦发光 -->
          <filter :id="side + 'Glow'" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- 底座水波灵纹 -->
        <g class="xy-base-ripples" transform="translate(110, 350)">
          <ellipse cx="0" cy="0" rx="75" ry="14" fill="none" :stroke="themeColor" stroke-opacity="0.3" stroke-width="1.2" />
          <ellipse cx="0" cy="0" rx="55" ry="10" fill="none" :stroke="themeColor" stroke-opacity="0.5" stroke-width="1" />
          <ellipse cx="0" cy="0" rx="30" ry="6" fill="none" :stroke="themeColor" stroke-opacity="0.7" stroke-width="1.5" />
        </g>

        <!-- 环身悬浮灵弦 (Harmonic Strings Surrounding Body) -->
        <g class="xy-orbiting-chords">
          <path 
            :d="side === 'player' 
              ? 'M 20 280 C 10 160, 200 120, 195 240 C 190 320, 40 330, 25 240' 
              : 'M 200 280 C 210 160, 20 120, 25 240 C 30 320, 180 330, 195 240'" 
            fill="none" 
            :stroke="themeColor" 
            stroke-width="1.5" 
            stroke-dasharray="6 4"
            opacity="0.6"
            :filter="`url(#${side}Glow)`"
          />
          <path 
            :d="side === 'player'
              ? 'M 45 220 C 30 140, 180 90, 175 190 C 170 270, 60 280, 48 200'
              : 'M 175 220 C 190 140, 40 90, 45 190 C 50 270, 160 280, 172 200'"
            fill="none"
            :stroke="accentColor"
            stroke-width="1"
            opacity="0.4"
          />
        </g>

        <!-- 仙修法相剪影主体 (Ethereal Xianxia Figure Body) -->
        <g class="xy-figure-body-group" :filter="`url(#${side}Glow)`">
          <!-- 仙袍广袖下摆 (Flowing Robes) -->
          <path 
            d="M 110 95 
               C 135 110, 165 170, 175 260 
               C 180 305, 165 345, 150 355 
               C 125 345, 95 345, 70 355 
               C 55 345, 40 305, 45 260 
               C 55 170, 85 110, 110 95 Z" 
            :fill="`url(#${side}RobeGrad)`" 
            stroke="rgba(255,255,255,0.2)"
            stroke-width="0.8"
          />

          <!-- 左袖与右袖飘逸褶纹 (Sleeve Drapery) -->
          <path 
            d="M 85 130 C 55 160, 30 220, 38 270 C 45 275, 62 250, 72 210 Z" 
            :fill="side === 'player' ? '#075985' : '#9f1239'" 
            opacity="0.8" 
          />
          <path 
            d="M 135 130 C 165 160, 190 220, 182 270 C 175 275, 158 250, 148 210 Z" 
            :fill="side === 'player' ? '#075985' : '#9f1239'" 
            opacity="0.8" 
          />

          <!-- 领襟与道袍中轴 (Lapel & Inner Gown) -->
          <path 
            d="M 110 98 L 95 150 L 110 240 L 125 150 Z" 
            fill="rgba(255,255,255,0.08)" 
            stroke="rgba(255,255,255,0.25)" 
            stroke-width="0.8" 
          />

          <!-- 灵台气海核心 (Resonant Core in Dantian) -->
          <circle cx="110" cy="180" r="14" :fill="`url(#${side}CoreGrad)`" />
          <circle cx="110" cy="180" r="4" fill="#ffffff" opacity="0.9" />

          <!-- 首丘与道冠头顶 (Head & Crown Silhouette) -->
          <ellipse cx="110" cy="72" rx="16" ry="21" :fill="`url(#${side}RobeGrad)`" stroke="rgba(255,255,255,0.3)" stroke-width="0.8" />
          
          <!-- 道簪 / 云冠发髻 (Hair Crown) -->
          <path d="M 103 52 L 110 42 L 117 52 Z" :fill="accentColor" />
          <line x1="94" y1="48" x2="126" y2="48" :stroke="accentColor" stroke-width="1.5" />
          
          <!-- 脑后神光圆轮 (Celestial Halo Circle) -->
          <circle cx="110" cy="68" r="32" fill="none" :stroke="themeColor" stroke-width="1" stroke-dasharray="4 6" opacity="0.6" />
        </g>
      </svg>

      <!-- 悬浮微芒粒子 -->
      <div class="xy-figure-sparkles">
        <span class="xy-f-dot d1"></span>
        <span class="xy-f-dot d2"></span>
        <span class="xy-f-dot d3"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  side: { type: String, default: 'player' },
  name: { type: String, default: '' },
  avatar: { type: String, default: '' }
});

const hasCustomAvatar = computed(() => Boolean(props.avatar));
const customAvatar = computed(() => props.avatar);

const themeColor = computed(() => props.side === 'player' ? '#38bdf8' : '#f43f5e');
const accentColor = computed(() => props.side === 'player' ? '#2dd4bf' : '#fbbf24');
</script>

<style scoped>
.xy-figure-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 260px;
  max-height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  overflow: hidden;
}

.xy-figure-halo {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(40px);
  opacity: 0.28;
  z-index: 0;
}

.figure-player .xy-figure-halo {
  background: radial-gradient(circle, #0284c7 0%, #38bdf8 50%, transparent 75%);
}

.figure-enemy .xy-figure-halo {
  background: radial-gradient(circle, #e11d48 0%, #fb7185 50%, transparent 75%);
}

/* 自定义立绘 */
.xy-figure-custom {
  position: relative;
  z-index: 1;
  width: 180px;
  height: 280px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--xy-border-subtle);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
}

.xy-custom-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 默认国风神相立绘 */
.xy-figure-silhouette {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: figure-sway 8s ease-in-out infinite alternate;
}

@keyframes figure-sway {
  0% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-6px) scale(1.01); }
  100% { transform: translateY(2px) scale(0.995); }
}

.xy-daoist-svg {
  width: 100%;
  max-width: 200px;
  height: 100%;
  max-height: 340px;
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.5));
}

.xy-orbiting-chords {
  animation: chord-rotate 24s linear infinite;
  transform-origin: 110px 220px;
}

@keyframes chord-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 微光粒子浮现 */
.xy-figure-sparkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.xy-f-dot {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  animation: dot-rise 4s ease-in-out infinite;
}

.figure-player .xy-f-dot {
  background: #38bdf8;
  box-shadow: 0 0 8px #38bdf8;
}

.figure-enemy .xy-f-dot {
  background: #fb7185;
  box-shadow: 0 0 8px #fb7185;
}

.d1 { left: 35%; top: 60%; animation-delay: 0s; }
.d2 { left: 65%; top: 40%; animation-delay: 1.5s; }
.d3 { left: 50%; top: 75%; animation-delay: 2.8s; }

@keyframes dot-rise {
  0% { opacity: 0; transform: translateY(10px) scale(0.5); }
  50% { opacity: 0.8; transform: translateY(-15px) scale(1.2); }
  100% { opacity: 0; transform: translateY(-30px) scale(0.4); }
}
</style>
