<template>
  <article class="xy-fighter-card" :class="['card-' + side, { 'is-active-target': isSelectedTarget }]">
    <!-- 顶部状态印记 (Buffs / Debuffs 持续效果) -->
    <div class="xy-status-lane" :class="'lane-' + side">
      <div v-if="effects.length" class="xy-effects-group">
        <span 
          v-for="(eff, idx) in effects" 
          :key="idx"
          class="xy-effect-badge"
          :class="{ 'is-field': eff.lane === 'field' }"
        >
          <span class="xy-effect-dot"></span>
          <span class="xy-effect-label">{{ eff.label }}</span>
          <small v-if="eff.remainingRounds !== undefined" class="xy-effect-round">{{ eff.remainingRounds }}轮</small>
        </span>
      </div>
      <div v-else class="xy-status-empty">
        <span>无异常灵息</span>
      </div>
    </div>

    <!-- 角色核心躯体面板 -->
    <div class="xy-fighter-core">
      <!-- 灵光法相头像 -->
      <div class="xy-avatar-frame" :class="'avatar-' + side">
        <div class="xy-avatar-halo"></div>
        <div class="xy-avatar-initial">{{ initialChar }}</div>
        <div class="xy-avatar-border-deco"></div>
      </div>

      <!-- 角色名号与公开洞察 -->
      <div class="xy-fighter-bio">
        <div class="xy-side-kicker">
          <span class="xy-kicker-side">{{ side === 'player' ? 'DAOIST' : 'OPPONENT' }}</span>
          <span class="xy-kicker-id">#{{ actor.id }}</span>
        </div>

        <h2 class="xy-fighter-name">
          <span class="xy-name-text">{{ actor.name || (side === 'player' ? '主角' : '敌手') }}</span>
          <span v-if="side === 'enemy' && targetCount > 1" class="xy-target-seal">目标锁定</span>
        </h2>

        <!-- 公开可见信息 (境界、装备、站位等) -->
        <div class="xy-visible-traits">
          <span 
            v-for="(val, key) in filteredVisibleInfo" 
            :key="key" 
            class="xy-trait-pill"
          >
            <b class="xy-trait-key">{{ key }}</b>
            <span class="xy-trait-val">{{ formatValue(val) }}</span>
          </span>
          <span v-if="!hasVisibleTraits" class="xy-trait-empty">无公开特征</span>
        </div>

        <!-- 角色可用灵力/资源数值 -->
        <div v-if="hasResources" class="xy-resources-bar">
          <span class="xy-resource-label">灵韵机枢</span>
          <div class="xy-resource-chips">
            <span v-for="(v, k) in actor.resources" :key="k" class="xy-res-chip">
              <span class="xy-res-name">{{ k }}</span>
              <span class="xy-res-num">{{ v }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 多敌方目标切换标签 -->
    <div v-if="side === 'enemy' && targetCount > 1" class="xy-enemy-switchers">
      <button 
        v-for="e in enemiesList" 
        :key="e.id"
        class="xy-target-tab"
        :class="{ active: e.id === actor.id }"
        @click="$emit('select-target', e.id)"
      >
        <span class="xy-target-dot"></span>
        <span>{{ e.name }}</span>
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  actor: { type: Object, default: () => ({}) },
  side: { type: String, default: 'player' },
  effects: { type: Array, default: () => [] },
  isSelectedTarget: { type: Boolean, default: false },
  enemiesList: { type: Array, default: () => [] }
});

defineEmits(['select-target']);

const targetCount = computed(() => props.enemiesList?.length || 0);

const initialChar = computed(() => {
  const name = props.actor.name || '';
  return name.slice(0, 1) || (props.side === 'player' ? '主' : '敌');
});

const filteredVisibleInfo = computed(() => {
  const info = props.actor.visibleInfo;
  if (!info || typeof info !== 'object') return {};
  const ignored = ['techniques', 'abilities', 'skills', 'spells', '术法', '功法', '招式', 'observedTechniques', 'observedAbilities', '可观察招式'];
  const res = {};
  for (const [k, v] of Object.entries(info)) {
    if (!ignored.includes(k) && v !== null && v !== undefined && v !== '') {
      res[k] = v;
    }
  }
  return res;
});

const hasVisibleTraits = computed(() => Object.keys(filteredVisibleInfo.value).length > 0);

const hasResources = computed(() => {
  const res = props.actor.resources;
  return res && typeof res === 'object' && Object.keys(res).length > 0;
});

function formatValue(v) {
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}
</script>

<style scoped>
.xy-fighter-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 顶部状态流 */
.xy-status-lane {
  display: flex;
  min-height: 26px;
  align-items: center;
}

.lane-player {
  justify-content: flex-start;
}

.lane-enemy {
  justify-content: flex-end;
}

.xy-effects-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.xy-effect-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  background: rgba(14, 165, 233, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: var(--xy-cyan-200);
}

.card-enemy .xy-effect-badge {
  background: rgba(244, 63, 94, 0.12);
  border-color: rgba(244, 63, 94, 0.35);
  color: var(--xy-crimson-300);
}

.xy-effect-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}

.xy-effect-round {
  font-size: 9px;
  font-family: var(--xy-font-mono);
  opacity: 0.8;
  margin-left: 2px;
}

.xy-status-empty {
  font-size: 11px;
  color: var(--xy-text-hint);
  font-style: italic;
}

/* 核心卡体 */
.xy-fighter-core {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 18px 22px;
  background: linear-gradient(145deg, rgba(14, 28, 48, 0.85) 0%, rgba(8, 17, 30, 0.95) 100%);
  border: 1px solid var(--xy-border-subtle);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.card-player .xy-fighter-core {
  border-color: rgba(56, 189, 248, 0.25);
}

.card-enemy .xy-fighter-core {
  flex-direction: row-reverse;
  text-align: right;
  border-color: rgba(244, 63, 94, 0.25);
  background: linear-gradient(145deg, rgba(32, 14, 22, 0.85) 0%, rgba(18, 8, 14, 0.95) 100%);
}

/* 头像框架 */
.xy-avatar-frame {
  position: relative;
  width: 76px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.6);
}

.avatar-player {
  background: radial-gradient(circle at 40% 30%, #38bdf8 0%, #0369a1 60%, #082f49 100%);
  border: 1px solid var(--xy-cyan-300);
}

.avatar-enemy {
  background: radial-gradient(circle at 40% 30%, #fb7185 0%, #be123c 60%, #4c0519 100%);
  border: 1px solid var(--xy-crimson-400);
}

.xy-avatar-initial {
  font-family: var(--xy-font-serif);
  font-size: 34px;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
  z-index: 2;
}

.avatar-player .xy-avatar-initial {
  text-shadow: 0 0 16px var(--xy-cyan-400);
}

.avatar-enemy .xy-avatar-initial {
  text-shadow: 0 0 16px var(--xy-crimson-400);
}

/* 个人介绍 */
.xy-fighter-bio {
  flex: 1;
  min-width: 0;
}

.xy-side-kicker {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  letter-spacing: 0.16em;
  font-family: var(--xy-font-mono);
  color: var(--xy-text-muted);
}

.card-enemy .xy-side-kicker {
  justify-content: flex-end;
}

.xy-fighter-name {
  margin: 3px 0 8px;
  font-family: var(--xy-font-serif);
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: var(--xy-text-title);
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-enemy .xy-fighter-name {
  justify-content: flex-end;
}

.xy-target-seal {
  font-size: 10px;
  font-family: var(--xy-font-sans);
  color: var(--xy-crimson-300);
  background: rgba(244, 63, 94, 0.15);
  border: 1px solid var(--xy-border-crimson);
  padding: 1px 6px;
  border-radius: 4px;
}

/* 特征标签 */
.xy-visible-traits {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  font-size: 11px;
}

.card-enemy .xy-visible-traits {
  justify-content: flex-end;
}

.xy-trait-pill {
  display: inline-flex;
  gap: 5px;
  align-items: baseline;
  color: var(--xy-text-body);
}

.xy-trait-key {
  color: var(--xy-text-muted);
  font-weight: 500;
}

.xy-trait-val {
  color: var(--xy-cyan-200);
}

.card-enemy .xy-trait-val {
  color: #fed7aa;
}

.xy-trait-empty {
  color: var(--xy-text-hint);
  font-style: italic;
}

/* 资源数值 */
.xy-resources-bar {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-enemy .xy-resources-bar {
  justify-content: flex-end;
}

.xy-resource-label {
  font-size: 9px;
  font-family: var(--xy-font-mono);
  color: var(--xy-text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.xy-resource-chips {
  display: flex;
  gap: 6px;
}

.xy-res-chip {
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 10px;
  color: var(--xy-cyan-300);
  font-family: var(--xy-font-mono);
}

/* 敌方多目标切换 */
.xy-enemy-switchers {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 4px;
}

.xy-target-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: var(--xy-text-muted);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.xy-target-tab:hover {
  background: rgba(244, 63, 94, 0.1);
  color: var(--xy-text-title);
}

.xy-target-tab.active {
  background: rgba(244, 63, 94, 0.2);
  border-color: var(--xy-crimson-400);
  color: var(--xy-crimson-300);
}

.xy-target-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}
</style>
