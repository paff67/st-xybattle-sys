<template>
  <div class="xy-effects-strip">
    <!-- 场地环境效果 (居中显现) -->
    <div class="xy-field-effects">
      <span class="xy-strip-label">
        <span class="xy-label-icon">☯</span>
        <span>天地气象</span>
      </span>

      <div class="xy-field-chips" v-if="fieldEffects.length">
        <span v-for="(eff, i) in fieldEffects" :key="i" class="xy-field-chip">
          <span class="xy-chip-pulse"></span>
          <span class="xy-chip-name">{{ eff.label }}</span>
          <small v-if="eff.remainingRounds !== undefined" class="xy-chip-round">{{ eff.remainingRounds }}轮</small>
        </span>
      </div>
      <div v-else class="xy-field-empty">
        <span>天地肃穆 · 水平如镜</span>
      </div>
    </div>

    <!-- 语义关键标签流 (潮眼、回弦、破绽等动态态势) -->
    <div class="xy-semantic-tags" v-if="hasSemanticKeys">
      <span v-for="tag in semanticTags" :key="tag.key" class="xy-sem-pill" :class="tag.active ? 'is-active' : 'is-idle'">
        <span class="xy-sem-key">{{ tag.key }}</span>
        <span class="xy-sem-val">{{ tag.val }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  effects: { type: Array, default: () => [] },
  semanticState: { type: Object, default: () => ({}) }
});

const fieldEffects = computed(() => {
  return props.effects.filter(e => e.lane === 'field');
});

const semanticTags = computed(() => {
  const s = props.semanticState;
  const list = [];
  const importantKeys = ['潮眼', '回弦', '站位', '破绽'];
  for (const k of importantKeys) {
    if (s[k] !== undefined && s[k] !== null) {
      const active = Boolean(s[k]);
      let val = s[k];
      if (typeof val === 'boolean') val = val ? '已凝显' : '潜隐';
      else if (Array.isArray(val)) val = val.length ? val.join('、') : '无破绽';
      list.push({ key: k, val: String(val), active });
    }
  }
  return list;
});

const hasSemanticKeys = computed(() => semanticTags.value.length > 0);
</script>

<style scoped>
.xy-effects-strip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px 0 6px;
  user-select: none;
}

.xy-field-effects {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 16px;
  border-radius: 999px;
  background: rgba(8, 18, 32, 0.6);
  border: 1px solid rgba(56, 189, 248, 0.14);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.xy-strip-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-family: var(--xy-font-serif);
  color: var(--xy-gold-400);
  letter-spacing: 0.1em;
}

.xy-label-icon {
  font-size: 11px;
}

.xy-field-chips {
  display: flex;
  gap: 6px;
}

.xy-field-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  color: var(--xy-gold-200);
}

.xy-chip-pulse {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--xy-gold-400);
  animation: xy-pulse-glow 2s infinite;
}

.xy-chip-round {
  font-size: 9px;
  font-family: var(--xy-font-mono);
  color: var(--xy-text-muted);
}

.xy-field-empty {
  font-size: 11px;
  color: var(--xy-text-hint);
  font-style: italic;
}

/* 语义状态标签 */
.xy-semantic-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.xy-sem-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-family: var(--xy-font-mono);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}

.xy-sem-pill.is-active {
  background: rgba(45, 212, 191, 0.1);
  border-color: rgba(45, 212, 191, 0.35);
  color: var(--xy-jade-300);
}

.xy-sem-pill.is-idle {
  color: var(--xy-text-muted);
}

.xy-sem-key {
  color: var(--xy-text-muted);
}

.is-active .xy-sem-key {
  color: var(--xy-jade-400);
}
</style>
