<template>
  <Transition name="xy-modal-pop">
    <div 
      v-if="isOpen && termData" 
      class="xy-skill-modal-backdrop" 
      role="dialog"
      aria-modal="true"
      @click.self="onBackdropClick"
    >
      <div class="xy-skill-modal-card">
        <!-- 弹窗流光装饰角标 (Ornate Daoist Corner Decos) -->
        <span class="xy-card-corner top-left"></span>
        <span class="xy-card-corner top-right"></span>
        <span class="xy-card-corner bottom-left"></span>
        <span class="xy-card-corner bottom-right"></span>

        <!-- 顶部卷轴元信息与关闭按钮 -->
        <div class="xy-modal-header">
          <div class="xy-modal-crest">
            <span class="xy-crest-icon">📜</span>
            <span class="xy-crest-side">{{ isPlayer ? '主角传承' : '敌修破招' }}</span>
            <span class="xy-crest-dot">·</span>
            <span class="xy-crest-origin">{{ parentName }}</span>
          </div>

          <button 
            class="xy-modal-close-btn" 
            @click="$emit('close')" 
            aria-label="关闭弹窗" 
            title="关闭 (Esc / 点击空白处)"
          >
            ✕
          </button>
        </div>

        <!-- 招式名号与机枢判明状态 -->
        <div class="xy-modal-title-row">
          <h3 class="xy-modal-title">
            <span class="xy-bracket">【</span>
            <span class="xy-tech-name-glow">{{ termData.name }}</span>
            <span class="xy-bracket">】</span>
          </h3>

          <div class="xy-modal-status-badge" :class="statusTone">
            <span class="xy-status-dot"></span>
            <span>{{ statusText }}</span>
          </div>
        </div>

        <!-- 古籍真言典故阐义 -->
        <blockquote class="xy-modal-ancient-quote">
          <p class="xy-quote-text">“{{ rawDefinition }}”</p>
        </blockquote>

        <!-- 四维机枢推演网格 (Mechanics, Triggers, Conditions, RuleRefs) -->
        <div class="xy-modal-grid">
          <!-- 演化机制 -->
          <div class="xy-grid-cell" v-if="mechanics.length">
            <span class="xy-cell-title">
              <span class="xy-cell-icon">⚙</span>
              <span>演化机制</span>
            </span>
            <ul class="xy-cell-list">
              <li v-for="(m, i) in mechanics" :key="i">{{ m }}</li>
            </ul>
          </div>

          <!-- 触发后生变 -->
          <div class="xy-grid-cell" v-if="triggeredStates.length">
            <span class="xy-cell-title">
              <span class="xy-cell-icon">⚡</span>
              <span>触发态势</span>
            </span>
            <ul class="xy-cell-list">
              <li v-for="(t, i) in triggeredStates" :key="i">{{ t }}</li>
            </ul>
          </div>

          <!-- 本轮前置机缘 (仅主角) -->
          <div class="xy-grid-cell" v-if="isPlayer">
            <span class="xy-cell-title">
              <span class="xy-cell-icon">⚖</span>
              <span>本轮机缘</span>
            </span>
            <p class="xy-condition-note" :class="isAvailable ? 'cond-pass' : 'cond-fail'">
              {{ conditionReason }}
            </p>
          </div>

          <!-- 规制出处 -->
          <div class="xy-grid-cell">
            <span class="xy-cell-title">
              <span class="xy-cell-icon">💠</span>
              <span>规制出处</span>
            </span>
            <div class="xy-rulerefs-tags">
              <span v-for="r in ruleRefs" :key="r" class="xy-rule-chip">{{ r }}</span>
              <span v-if="!ruleRefs.length" class="xy-no-rules">未注明规则出处</span>
            </div>
          </div>
        </div>

        <!-- 底部行动区 -->
        <div class="xy-modal-footer">
          <span class="xy-footer-hint">
            {{ isPlayer ? '功法源于结构化 Registry · 遵循语义裁定机枢' : '敌方内部资源与 Hidden 战术已被天道法则严格屏蔽' }}
          </span>

          <div class="xy-footer-btns">
            <button class="xy-footer-dismiss-btn" @click="$emit('close')">
              返回战场
            </button>
            <button 
              v-if="isPlayer" 
              class="xy-footer-apply-btn" 
              :class="{ 'is-locked': !isAvailable }"
              :disabled="!isAvailable"
              :title="isAvailable ? '选用此招并起势' : (conditionReason || '机缘未备，尚未满足施展条件')"
              @click="isAvailable && $emit('apply', termData.id)"
            >
              <span v-if="!isAvailable" class="xy-btn-lock">🔒</span>
              <span>选用此招并起势</span>
              <span v-if="isAvailable" class="xy-btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  termData: { type: Object, default: null },
  isPlayer: { type: Boolean, default: true },
  parentName: { type: String, default: '' },
  availabilityStatus: { type: Object, default: () => ({ available: true, reason: '' }) }
});

const emit = defineEmits(['close', 'apply']);

function onBackdropClick() {
  emit('close');
}

function handleKeyDown(e) {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close');
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

const rawDefinition = computed(() => {
  if (!props.termData) return '';
  return props.termData.rawDescription || props.termData.originalDefinition || props.termData.description || '暂无古籍阐发';
});

const mechanics = computed(() => props.termData?.mechanics || []);
const triggeredStates = computed(() => props.termData?.triggeredState || []);
const ruleRefs = computed(() => props.termData?.ruleRefs || []);

const isAvailable = computed(() => {
  if (!props.isPlayer) return true;
  return props.availabilityStatus?.available ?? true;
});

const conditionReason = computed(() => {
  if (!props.isPlayer) return '公开观察到的招式特征';
  return props.availabilityStatus?.reason || (isAvailable.value ? '契合当前环境，随时可发' : '前置弦势未足');
});

const statusTone = computed(() => {
  if (props.isPlayer) {
    return isAvailable.value ? 'tone-emerald' : 'tone-amber';
  } else {
    const s = props.termData?.status;
    if (s === 'known') return 'tone-emerald';
    if (s === 'inferred') return 'tone-amber';
    return 'tone-slate';
  }
});

const statusText = computed(() => {
  if (props.isPlayer) {
    return isAvailable.value ? '本轮可用' : '机缘未备';
  } else {
    const m = { known: '已明悟', inferred: '推测中', unknown: '未知虚实' };
    return m[props.termData?.status] || '公开可察招式';
  }
});
</script>

<style scoped>
/* 背景毛玻璃遮罩 (Frosted Glass Backdrop) */
.xy-skill-modal-backdrop {
  position: absolute;
  inset: 0;
  z-index: 100;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  background: rgba(2, 6, 14, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}

/* 核心圆角材质弹窗卡片 (Rounded Glassmorphic Modal Card) */
.xy-skill-modal-card {
  position: relative;
  width: 100%;
  max-width: 660px;
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(14, 28, 52, 0.96) 0%, rgba(6, 14, 28, 0.98) 100%);
  border: 1px solid var(--xy-border-glow);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 40px rgba(56, 189, 248, 0.18);
  backdrop-filter: blur(32px);
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-sizing: border-box;
  animation: card-spring-in 0.35s var(--xy-ease-out-expo);
}

/* 四角古法金丝角标 */
.xy-card-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  pointer-events: none;
}
.xy-card-corner.top-left {
  top: 6px; left: 6px;
  border-top: 1px solid var(--xy-gold-400);
  border-left: 1px solid var(--xy-gold-400);
  border-top-left-radius: 14px;
}
.xy-card-corner.top-right {
  top: 6px; right: 6px;
  border-top: 1px solid var(--xy-gold-400);
  border-right: 1px solid var(--xy-gold-400);
  border-top-right-radius: 14px;
}
.xy-card-corner.bottom-left {
  bottom: 6px; left: 6px;
  border-bottom: 1px solid var(--xy-gold-400);
  border-left: 1px solid var(--xy-gold-400);
  border-bottom-left-radius: 14px;
}
.xy-card-corner.bottom-right {
  bottom: 6px; right: 6px;
  border-bottom: 1px solid var(--xy-gold-400);
  border-right: 1px solid var(--xy-gold-400);
  border-bottom-right-radius: 14px;
}

/* 顶部栏 */
.xy-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.xy-modal-crest {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-family: var(--xy-font-serif);
  color: var(--xy-gold-300);
  letter-spacing: 0.08em;
}

.xy-crest-icon {
  font-size: 14px;
}

.xy-crest-side {
  color: var(--xy-cyan-300);
  font-weight: 500;
}

.xy-crest-dot {
  color: var(--xy-text-muted);
}

.xy-crest-origin {
  color: var(--xy-cyan-100);
}

.xy-modal-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.25), 0 4px 10px rgba(0, 0, 0, 0.3);
  color: var(--xy-text-muted);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

.xy-modal-close-btn:hover {
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.25) 0%, rgba(225, 29, 72, 0.1) 100%);
  border-color: rgba(244, 63, 94, 0.5);
  color: #fca5a5;
  box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.4), 0 4px 16px rgba(244, 63, 94, 0.35);
  transform: rotate(90deg) scale(1.05);
}

/* 标题行 */
.xy-modal-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.xy-modal-title {
  margin: 0;
  font-family: var(--xy-font-serif);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.06em;
  display: flex;
  align-items: baseline;
}

.xy-tech-name-glow {
  background: linear-gradient(135deg, #ffffff 0%, #e0f2fe 50%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
}

.xy-bracket {
  color: var(--xy-cyan-400);
  opacity: 0.6;
}

.xy-modal-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-family: var(--xy-font-mono);
}

.xy-status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

.tone-emerald {
  background: rgba(45, 212, 191, 0.14);
  border: 1px solid rgba(45, 212, 191, 0.4);
  color: var(--xy-jade-300);
}

.tone-amber {
  background: rgba(251, 191, 36, 0.14);
  border: 1px solid rgba(251, 191, 36, 0.4);
  color: var(--xy-gold-300);
}

.tone-slate {
  background: rgba(148, 163, 184, 0.14);
  border: 1px solid rgba(148, 163, 184, 0.35);
  color: #cbd5e1;
}

/* 经义古文引用 */
.xy-modal-ancient-quote {
  margin: 0;
  padding: 10px 16px;
  border-left: 3px solid var(--xy-gold-400);
  background: rgba(251, 191, 36, 0.06);
  border-radius: 0 8px 8px 0;
}

.xy-quote-text {
  margin: 0;
  font-family: var(--xy-font-serif);
  font-size: 13px;
  line-height: 1.6;
  color: var(--xy-cyan-100);
  letter-spacing: 0.04em;
}

/* 四格机枢 */
.xy-modal-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.xy-grid-cell {
  background: rgba(7, 16, 30, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  padding: 10px 14px;
}

.xy-cell-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: var(--xy-font-serif);
  font-size: 11px;
  color: var(--xy-gold-300);
  margin-bottom: 6px;
}

.xy-cell-icon {
  font-size: 11px;
}

.xy-cell-list {
  margin: 0;
  padding-left: 16px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--xy-text-body);
}

.xy-condition-note {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}

.cond-pass {
  color: var(--xy-jade-300);
}

.cond-fail {
  color: var(--xy-gold-300);
}

.xy-rulerefs-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.xy-rule-chip {
  font-family: var(--xy-font-mono);
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(56, 189, 248, 0.14);
  border: 1px solid rgba(56, 189, 248, 0.35);
  color: var(--xy-cyan-200);
}

.xy-no-rules {
  font-size: 11px;
  color: var(--xy-text-hint);
  font-style: italic;
}

/* 底部操作与提示 */
.xy-modal-footer {
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.xy-footer-hint {
  font-size: 10px;
  color: var(--xy-text-muted);
}

.xy-footer-btns {
  display: flex;
  align-items: center;
  gap: 10px;
}

.xy-footer-dismiss-btn {
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.22), 0 4px 12px rgba(0, 0, 0, 0.25);
  color: var(--xy-text-body);
  font-size: 13px;
  font-family: var(--xy-font-sans);
  cursor: pointer;
  transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

.xy-footer-dismiss-btn:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
  box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.35), 0 6px 18px rgba(0, 0, 0, 0.35);
  transform: translateY(-1px);
}

.xy-footer-apply-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 22px;
  border-radius: 999px;
  border: 1px solid rgba(186, 230, 253, 0.45);
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.85) 0%, rgba(2, 132, 199, 0.75) 50%, rgba(3, 105, 161, 0.85) 100%);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--xy-font-serif);
  cursor: pointer;
  transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: inset 0 1.5px 2px rgba(255, 255, 255, 0.65), inset 0 -1.5px 2px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(2, 132, 199, 0.4), 0 0 16px rgba(56, 189, 248, 0.3);
}

.xy-footer-apply-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.95) 0%, rgba(14, 165, 233, 0.85) 50%, rgba(2, 132, 199, 0.9) 100%);
  border-color: #bae6fd;
  box-shadow: inset 0 2px 3px rgba(255, 255, 255, 0.8), 0 12px 32px rgba(56, 189, 248, 0.55), 0 0 24px rgba(56, 189, 248, 0.4);
}

.xy-footer-apply-btn:disabled,
.xy-footer-apply-btn.is-locked {
  cursor: not-allowed;
  opacity: 0.45;
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: var(--xy-text-muted);
  box-shadow: none;
  transform: none !important;
}

.xy-btn-lock {
  font-size: 13px;
  margin-right: 4px;
}

.xy-btn-arrow {
  font-size: 14px;
}

/* 动效过渡 */
.xy-modal-pop-enter-active, .xy-modal-pop-leave-active {
  transition: opacity 0.3s var(--xy-ease-smooth);
}
.xy-modal-pop-enter-active .xy-skill-modal-card,
.xy-modal-pop-leave-active .xy-skill-modal-card {
  transition: transform 0.35s var(--xy-ease-out-expo), opacity 0.3s var(--xy-ease-smooth);
}
.xy-modal-pop-enter-from, .xy-modal-pop-leave-to {
  opacity: 0;
}
.xy-modal-pop-enter-from .xy-skill-modal-card,
.xy-modal-pop-leave-to .xy-skill-modal-card {
  transform: scale(0.92) translateY(12px);
  opacity: 0;
}

@keyframes card-spring-in {
  from { transform: scale(0.92) translateY(12px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}
</style>
