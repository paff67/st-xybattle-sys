<template>
  <div class="xy-atmosphere" aria-hidden="true">
    <!-- 背景流光与水雾 -->
    <div class="xy-water-mist"></div>

    <!-- 灵弦波纹 SVG 动态背景 -->
    <svg class="xy-string-canvas" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 800">
      <defs>
        <linearGradient id="stringGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.02" />
          <stop offset="35%" stop-color="#38bdf8" stop-opacity="0.25" />
          <stop offset="65%" stop-color="#2dd4bf" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.02" />
        </linearGradient>
        <linearGradient id="stringGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#fbbf24" stop-opacity="0" />
          <stop offset="50%" stop-color="#fbbf24" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#fbbf24" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="vortexGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.12" />
          <stop offset="100%" stop-color="#07101e" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- 琴弦共振线 1 -->
      <path class="xy-chord-line chord-1" d="M 0 320 Q 360 280 720 320 T 1440 320" fill="none" stroke="url(#stringGrad1)" stroke-width="1.2" />
      <!-- 琴弦共振线 2 -->
      <path class="xy-chord-line chord-2" d="M 0 460 Q 400 500 720 460 T 1440 460" fill="none" stroke="url(#stringGrad1)" stroke-width="1" />
      <!-- 琴弦共振线 3 (金色谐波) -->
      <path class="xy-chord-line chord-3" d="M 0 390 Q 380 430 720 390 T 1440 390" fill="none" stroke="url(#stringGrad2)" stroke-width="0.9" />

      <!-- 中央潮眼同心灵轮 -->
      <ellipse cx="720" cy="400" rx="340" ry="110" fill="none" stroke="url(#vortexGrad)" stroke-width="1.5" stroke-dasharray="6 8" class="xy-vortex-ring" />
      <ellipse cx="720" cy="400" rx="200" ry="65" fill="none" stroke="rgba(56, 189, 248, 0.08)" stroke-width="1" />
      <ellipse cx="720" cy="400" rx="80" ry="26" fill="rgba(56, 189, 248, 0.03)" stroke="rgba(251, 191, 36, 0.15)" stroke-width="1" />
    </svg>

    <!-- 微尘灵光粒子 -->
    <div class="xy-particles">
      <span class="xy-sparkle s1"></span>
      <span class="xy-sparkle s2"></span>
      <span class="xy-sparkle s3"></span>
      <span class="xy-sparkle s4"></span>
      <span class="xy-sparkle s5"></span>
    </div>
  </div>
</template>

<script setup>
// Pure visual ambient component
</script>

<style scoped>
.xy-atmosphere {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.xy-water-mist {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 50% 40%, rgba(14, 165, 233, 0.12) 0%, transparent 65%),
    radial-gradient(circle at 18% 30%, rgba(45, 212, 191, 0.07) 0%, transparent 50%),
    radial-gradient(circle at 82% 35%, rgba(244, 63, 94, 0.06) 0%, transparent 50%),
    linear-gradient(180deg, rgba(7, 16, 30, 0.3) 0%, rgba(3, 7, 13, 0.85) 100%);
}

.xy-string-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
}

.xy-chord-line {
  will-change: transform;
}

.chord-1 {
  animation: xy-sine-drift 9s ease-in-out infinite alternate;
}

.chord-2 {
  animation: xy-sine-drift 11s ease-in-out infinite alternate-reverse;
}

.chord-3 {
  animation: xy-sine-drift 7s ease-in-out infinite alternate;
}

.xy-vortex-ring {
  transform-origin: 720px 400px;
  animation: xy-rotate-slow 60s linear infinite;
}

@keyframes xy-sine-drift {
  0% { transform: translateY(-4px) scaleY(0.96); }
  50% { transform: translateY(5px) scaleY(1.05); }
  100% { transform: translateY(-2px) scaleY(1); }
}

@keyframes xy-rotate-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.xy-particles {
  position: absolute;
  inset: 0;
}

.xy-sparkle {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 8px #38bdf8;
  opacity: 0.3;
  animation: xy-sparkle-float 6s ease-in-out infinite;
}

.s1 { top: 22%; left: 24%; animation-delay: 0s; }
.s2 { top: 38%; left: 76%; animation-delay: 1.5s; background: #fbbf24; box-shadow: 0 0 8px #fbbf24; }
.s3 { top: 65%; left: 45%; animation-delay: 3s; }
.s4 { top: 15%; left: 60%; animation-delay: 2.2s; }
.s5 { top: 78%; left: 30%; animation-delay: 4.1s; background: #2dd4bf; }

@keyframes xy-sparkle-float {
  0%, 100% { transform: translateY(0) scale(0.8); opacity: 0.2; }
  50% { transform: translateY(-16px) scale(1.4); opacity: 0.7; }
}
</style>
