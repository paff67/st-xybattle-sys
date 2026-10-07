<template>
  <div v-if="termData" class="xy-term-inspector-wrap">
    <div class="xy-inspector-card">
      <!-- 卷轴装饰顶缘 -->
      <div class="xy-scroll-header">
        <div class="xy-scroll-meta">
          <span class="xy-scroll-crest">📜</span>
          <span class="xy-scroll-side">{{ isPlayer ? '主角传承' : '敌手破招' }}</span>
          <span class="xy-scroll-dot">·</span>
          <span class="xy-scroll-gongfa">{{ parentName }}</span>
        </div>

        <button class="xy-inspector-close" @click="$emit('close')" aria-label="收起典籍" title="收起 (Esc)">
          <Icons name="close" />
        </button>
      </div>

      <!-- 招式名与可用度徽记 -->
      <div class="xy-inspector-title-row">
        <h3 class="xy-technique-title">
          <span class="xy-bracket">【</span>
          <span class="xy-tech-name">{{ termData.name }}</span>
          <span class="xy-bracket">】</span>
        </h3>

        <div class="xy-status-tag" :class="statusTagTone">
          <span class="xy-tag-dot"></span>
          <span>{{ statusTagLabel }}</span>
        </div>
      </div>

      <!-- 原始经文经义 -->
      <blockquote class="xy-ancient-quote">
        <p class="xy-quote-text">“{{ rawDefinition }}”</p>
      </blockquote>

      <!-- 四维机枢网格 (Mechanics, Triggers, Conditions, RuleRefs) -->
      <div class="xy-mechanics-grid">
        <!-- 运行机制 -->
        <div class="xy-mech-card" v-if="mechanics.length">
          <span class="xy-mech-title">
            <span class="xy-mech-icon">⚙</span>
            <span>演化机制</span>
          </span>
          <ul class="xy-mech-list">
            <li v-for="(m, i) in mechanics" :key="i">{{ m }}</li>
          </ul>
        </div>

        <!-- 触发后生变 -->
        <div class="xy-mech-card" v-if="triggeredStates.length">
          <span class="xy-mech-title">
            <span class="xy-mech-icon">⚡</span>
            <span>触发后态势</span>
          </span>
          <ul class="xy-mech-list">
            <li v-for="(t, i) in triggeredStates" :key="i">{{ t }}</li>
          </ul>
        </div>

        <!-- 本轮前置条件 (仅主角) -->
        <div class="xy-mech-card" v-if="isPlayer">
          <span class="xy-mech-title">
            <span class="xy-mech-icon">⚖</span>
            <span>本轮判明</span>
          </span>
          <p class="xy-condition-note" :class="isAvailable ? 'cond-pass' : 'cond-fail'">
            {{ conditionReason }}
          </p>
        </div>

        <!-- 天道规制出处 (ruleRefs / Source) -->
        <div class="xy-mech-card">
          <span class="xy-mech-title">
            <span class="xy-mech-icon">💠</span>
            <span>规制出处</span>
          </span>
          <div class="xy-rulerefs-chips">
            <span v-for="r in ruleRefs" :key="r" class="xy-rule-chip">{{ r }}</span>
            <span v-if="!ruleRefs.length" class="xy-no-rules">未注明规则出处</span>
          </div>
        </div>
      </div>

      <!-- 来源与可见性说明 -->
      <div class="xy-inspector-footer">
        <span v-if="isPlayer" class="xy-footer-note">
          功法数据源于结构化 Registry · 遵循语义裁定机枢
        </span>
        <span v-else class="xy-footer-note xy-enemy-protect">
          观测来源：{{ termData.source || '公开战况可观察行为' }} · 置信度：{{ termData.confidence || '未定' }} · 敌方内部资源与 Hidden 战术已被天道法则严格屏蔽
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Icons from './Icons.vue';

const props = defineProps({
  termData: { type: Object, default: null },
  isPlayer: { type: Boolean, default: true },
  parentName: { type: String, default: '' },
  availabilityStatus: { type: Object, default: () => ({ available: true, reason: '' }) }
});

defineEmits(['close']);

const rawDefinition = computed(() => {
  if (!props.termData) return '';
  return props.termData.rawDescription || props.termData.originalDefinition || props.termData.description || '暂无古籍阐发';
});

const mechanics = computed(() => {
  if (!props.termData) return [];
  return props.termData.mechanics || [];
});

const triggeredStates = computed(() => {
  if (!props.termData) return [];
  return props.termData.triggeredState || [];
});

const isAvailable = computed(() => {
  if (!props.isPlayer) return true;
  return props.availabilityStatus?.available ?? true;
});

const conditionReason = computed(() => {
  if (!props.isPlayer) return '公开观察到的招式特征';
  return props.availabilityStatus?.reason || (isAvailable.value ? '契合当前环境，随时可发' : '前置弦势未足');
});

const ruleRefs = computed(() => {
  if (!props.termData) return [];
  return props.termData.ruleRefs || [];
});

const statusTagTone = computed(() => {
  if (props.isPlayer) {
    return isAvailable.value ? 'tag-emerald' : 'tag-amber';
  } else {
    const s = props.termData?.status;
    if (s === 'known') return 'tag-emerald';
    if (s === 'inferred') return 'tag-amber';
    return 'tag-slate';
  }
});

const statusTagLabel = computed(() => {
  if (props.isPlayer) {
    return isAvailable.value ? '本轮可用' : '机缘未备';
  } else {
    const m = { known: '已明悟', inferred: '推测中', unknown: '未知虚实' };
    return m[props.termData?.status] || '观察中';
  }
});
</script>

<style scoped>
.xy-term-inspector-wrap {
  width: 100%;
  max-width: 1680px;
  margin: 0 auto;
  padding: 0 32px 10px;
  box-sizing: border-box;
  animation: inspector-pop 0.25s var(--xy-ease-out-expo);
  flex-shrink: 0;
}

@keyframes inspector-pop {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.xy-inspector-card {
  position: relative;
  background: linear-gradient(180deg, rgba(14, 28, 48, 0.96) 0%, rgba(9, 18, 32, 0.98) 100%);
  border: 1px solid var(--xy-border-glow);
  border-radius: 12px;
  padding: 12px 18px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
}

.xy-scroll-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.xy-scroll-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-family: var(--xy-font-serif);
  color: var(--xy-cyan-300);
}

.xy-scroll-crest {
  font-size: 12px;
}

.xy-scroll-side {
  color: var(--xy-gold-400);
  font-weight: 500;
}

.xy-scroll-dot {
  color: var(--xy-text-muted);
}

.xy-scroll-gongfa {
  color: var(--xy-cyan-200);
}

.xy-inspector-close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: var(--xy-text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.xy-inspector-close:hover {
  background: rgba(244, 63, 94, 0.15);
  color: var(--xy-crimson-400);
  border-color: rgba(244, 63, 94, 0.3);
}

/* 标题栏 */
.xy-inspector-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.xy-technique-title {
  margin: 0;
  display: flex;
  align-items: baseline;
  font-family: var(--xy-font-serif);
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.06em;
}

.xy-bracket {
  color: var(--xy-cyan-400);
  opacity: 0.6;
}

.xy-tech-name {
  background: linear-gradient(135deg, #ffffff 0%, #e0f2fe 60%, #7dd3fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.xy-status-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-family: var(--xy-font-mono);
}

.xy-tag-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}

.tag-emerald {
  background: rgba(45, 212, 191, 0.12);
  border: 1px solid rgba(45, 212, 191, 0.4);
  color: var(--xy-jade-300);
}

.tag-amber {
  background: rgba(251, 191, 36, 0.12);
  border: 1px solid rgba(251, 191, 36, 0.4);
  color: var(--xy-gold-300);
}

.tag-slate {
  background: rgba(148, 163, 184, 0.1);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}

/* 经文名句 */
.xy-ancient-quote {
  margin: 0 0 10px;
  padding: 6px 14px;
  border-left: 3px solid var(--xy-gold-400);
  background: rgba(251, 191, 36, 0.04);
  border-radius: 0 6px 6px 0;
}

.xy-quote-text {
  margin: 0;
  font-family: var(--xy-font-serif);
  font-size: 13px;
  line-height: 1.5;
  color: var(--xy-cyan-100);
  letter-spacing: 0.04em;
}

/* 四维网格 */
.xy-mechanics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 8px;
}

.xy-mech-card {
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(7, 16, 30, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.xy-mech-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-family: var(--xy-font-serif);
  color: var(--xy-gold-300);
  margin-bottom: 4px;
}

.xy-mech-icon {
  font-size: 10px;
}

.xy-mech-list {
  margin: 0;
  padding-left: 14px;
  font-size: 11px;
  color: var(--xy-text-body);
  line-height: 1.5;
}

.xy-condition-note {
  margin: 0;
  font-size: 11px;
  line-height: 1.4;
}

.cond-pass {
  color: var(--xy-jade-300);
}

.cond-fail {
  color: var(--xy-gold-300);
}

.xy-rulerefs-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.xy-rule-chip {
  padding: 1px 5px;
  border-radius: 3px;
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.25);
  color: var(--xy-cyan-300);
  font-family: var(--xy-font-mono);
  font-size: 9px;
}

.xy-no-rules {
  font-size: 10px;
  color: var(--xy-text-hint);
  font-style: italic;
}

.xy-inspector-footer {
  padding-top: 6px;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
}

.xy-footer-note {
  font-size: 10px;
  color: var(--xy-text-muted);
}

.xy-enemy-protect {
  color: var(--xy-crimson-300);
}
</style>
