<template>
  <div class="xy-fighter-zone" :class="['zone-' + side, { 'is-active-target': isSelectedTarget }]">
    <!-- 1. 头顶小框展示人物buff状态 (Top Character Buff & Status Box) -->
    <div class="xy-buff-box-lane">
      <div class="xy-buff-card" :class="'buff-' + side">
        <div class="xy-buff-header">
          <span class="xy-buff-icon">{{ side === 'player' ? '✦' : '✧' }}</span>
          <span class="xy-buff-title">{{ side === 'player' ? '本尊加持与异常' : '敌修气机附着' }}</span>
        </div>

        <div class="xy-buff-content">
          <div v-if="effects.length" class="xy-buff-badges">
            <span 
              v-for="(eff, idx) in effects" 
              :key="idx" 
              class="xy-buff-pill"
              :class="{ 'is-field': eff.lane === 'field' }"
            >
              <span class="xy-pill-dot"></span>
              <span class="xy-pill-label">{{ eff.label }}</span>
              <small v-if="eff.remainingRounds !== undefined" class="xy-pill-round">{{ eff.remainingRounds }}轮</small>
            </span>
          </div>
          <div v-else class="xy-buff-empty">
            <span>灵息平稳 · 无异常灵息</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 中部核心对战层：人物立绘 + 招式弦羽 (Character Figure & Fanned Chord Wings) -->
    <div class="xy-zone-middle">
      <!-- 玩家侧：立绘在左，弦羽在右（指向中台） -->
      <template v-if="side === 'player'">
        <div class="xy-figure-wrapper">
          <CharacterFigure 
            side="player" 
            :name="actor.name || '主角'" 
            :avatar="actor.avatar || actor.portrait || ''" 
          />
        </div>

        <div class="xy-wings-wrapper">
          <ChordWings 
            side="player"
            :items="techniques" 
            :selected-term-id="selectedTermId"
            :is-modal-open="isModalOpen"
            @select-wing="$emit('select-petal', $event)"
          />
        </div>
      </template>

      <!-- 敌方侧：弦羽在左（指向中台），立绘在右 -->
      <template v-else>
        <div class="xy-wings-wrapper">
          <ChordWings 
            side="enemy"
            :items="techniques" 
            :selected-term-id="selectedTermId"
            :is-modal-open="isModalOpen"
            @select-wing="$emit('select-petal', $event)"
          />
        </div>

        <div class="xy-figure-wrapper">
          <CharacterFigure 
            side="enemy" 
            :name="actor.name || '敌手'" 
            :avatar="actor.avatar || actor.portrait || ''" 
          />
        </div>
      </template>
    </div>

    <!-- 3. 底部信息框：主角姓名与修为状态 / 敌人信息 (Bottom Info Box) -->
    <div class="xy-info-box-lane">
      <div class="xy-character-info-card" :class="'info-' + side">
        <!-- 角色主名号与阵营标识 -->
        <div class="xy-info-top">
          <div class="xy-info-title-group">
            <span class="xy-side-kicker">{{ side === 'player' ? 'DAOIST' : 'OPPONENT' }}</span>
            <h3 class="xy-actor-name">{{ actor.name || (side === 'player' ? '主角' : '敌手') }}</h3>
            <span class="xy-actor-id">#{{ actor.id }}</span>
          </div>

          <!-- 多敌方目标切换标签 (仅敌方且目标数 > 1) -->
          <div v-if="side === 'enemy' && targetCount > 1" class="xy-target-switchers">
            <button 
              v-for="e in enemiesList" 
              :key="e.id"
              class="xy-switch-btn"
              :class="{ active: e.id === actor.id }"
              @click="$emit('select-target', e.id)"
            >
              {{ e.name }}
            </button>
          </div>
        </div>

        <!-- 公开可见特征 (境界、装备、姿态、站位等) -->
        <div class="xy-traits-row">
          <span 
            v-for="(val, key) in filteredVisibleInfo" 
            :key="key" 
            class="xy-trait-item"
          >
            <b class="xy-trait-k">{{ key }}:</b>
            <span class="xy-trait-v">{{ formatValue(val) }}</span>
          </span>
          <span v-if="!hasVisibleTraits" class="xy-trait-none">平稳对峙 · 无显露法力特征</span>
        </div>

        <!-- 角色可用资源数值 -->
        <div v-if="hasResources" class="xy-resources-row">
          <span class="xy-res-label">气海机枢:</span>
          <div class="xy-res-chips">
            <span v-for="(v, k) in actor.resources" :key="k" class="xy-res-tag">
              <b>{{ k }}</b> {{ v }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import CharacterFigure from './CharacterFigure.vue';
import ChordWings from './ChordWings.vue';

const props = defineProps({
  actor: { type: Object, default: () => ({}) },
  side: { type: String, default: 'player' },
  effects: { type: Array, default: () => [] },
  techniques: { type: Array, default: () => [] },
  selectedTermId: { type: String, default: '' },
  isModalOpen: { type: Boolean, default: false },
  isSelectedTarget: { type: Boolean, default: false },
  enemiesList: { type: Array, default: () => [] }
});

defineEmits(['select-petal', 'select-target']);

const targetCount = computed(() => props.enemiesList?.length || 0);

const filteredVisibleInfo = computed(() => {
  const info = props.actor.visibleInfo;
  if (!info || typeof info !== 'object') return {};
  const ignored = [
    'techniques', 'abilities', 'skills', 'spells', '术法', '功法', '招式', 
    'observedTechniques', 'observedAbilities', '可观察招式'
  ];
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
.xy-fighter-zone {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  min-height: 0;
  gap: 12px;
}

/* 1. 头顶状态小框 (Top Buff Box) */
.xy-buff-box-lane {
  width: 100%;
  flex-shrink: 0;
}

.xy-buff-card {
  background: linear-gradient(135deg, rgba(14, 28, 48, 0.8) 0%, rgba(6, 14, 26, 0.9) 100%);
  border: 1px solid var(--xy-border-subtle);
  border-radius: 8px;
  padding: 8px 14px;
  backdrop-filter: blur(16px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
}

.buff-player {
  border-color: rgba(56, 189, 248, 0.25);
}

.buff-enemy {
  border-color: rgba(244, 63, 94, 0.25);
  background: linear-gradient(135deg, rgba(32, 14, 22, 0.8) 0%, rgba(14, 6, 10, 0.9) 100%);
}

.xy-buff-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.xy-buff-icon {
  font-size: 11px;
}

.buff-player .xy-buff-icon {
  color: var(--xy-cyan-400);
}

.buff-enemy .xy-buff-icon {
  color: var(--xy-crimson-400);
}

.xy-buff-title {
  font-family: var(--xy-font-serif);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--xy-text-muted);
}

.xy-buff-content {
  min-height: 24px;
  display: flex;
  align-items: center;
}

.xy-buff-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.xy-buff-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  background: rgba(14, 165, 233, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: var(--xy-cyan-200);
}

.buff-enemy .xy-buff-pill {
  background: rgba(244, 63, 94, 0.12);
  border-color: rgba(244, 63, 94, 0.35);
  color: var(--xy-crimson-300);
}

.xy-pill-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}

.xy-pill-round {
  font-size: 9px;
  font-family: var(--xy-font-mono);
  opacity: 0.8;
}

.xy-buff-empty {
  font-size: 11px;
  color: var(--xy-text-hint);
  font-style: italic;
}

/* 2. 中间核心层：立绘与招式羽翼 (Middle Figure & Wings) */
.xy-zone-middle {
  display: grid;
  grid-template-columns: 1fr 270px;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-height: 0;
  position: relative;
}

.zone-enemy .xy-zone-middle {
  grid-template-columns: 270px 1fr;
}

.xy-figure-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.xy-wings-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* 3. 底部信息框 (Bottom Info Card) */
.xy-info-box-lane {
  width: 100%;
  flex-shrink: 0;
}

.xy-character-info-card {
  background: linear-gradient(135deg, rgba(14, 28, 48, 0.9) 0%, rgba(6, 14, 26, 0.95) 100%);
  border: 1px solid var(--xy-border-gold);
  border-radius: 10px;
  padding: 12px 18px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(251, 191, 36, 0.12);
}

.info-player {
  border-color: rgba(251, 191, 36, 0.35);
}

.info-enemy {
  border-color: rgba(244, 63, 94, 0.3);
  background: linear-gradient(135deg, rgba(32, 14, 22, 0.9) 0%, rgba(14, 6, 10, 0.95) 100%);
}

.xy-info-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.xy-info-title-group {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.xy-side-kicker {
  font-size: 9px;
  font-family: var(--xy-font-mono);
  letter-spacing: 0.14em;
  color: var(--xy-gold-400);
}

.info-enemy .xy-side-kicker {
  color: var(--xy-crimson-400);
}

.xy-actor-name {
  margin: 0;
  font-family: var(--xy-font-serif);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--xy-text-title);
}

.xy-actor-id {
  font-size: 10px;
  font-family: var(--xy-font-mono);
  color: var(--xy-text-hint);
}

/* 敌方多目标切换 */
.xy-target-switchers {
  display: flex;
  gap: 5px;
}

.xy-switch-btn {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.25);
  color: var(--xy-text-muted);
  cursor: pointer;
  transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

.xy-switch-btn:hover {
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(225, 29, 72, 0.08) 100%);
  border-color: rgba(244, 63, 94, 0.4);
  color: #fca5a5;
  box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.35), 0 4px 12px rgba(244, 63, 94, 0.3);
  transform: translateY(-1px);
}

.xy-switch-btn.active {
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.35) 0%, rgba(225, 29, 72, 0.15) 100%);
  border-color: var(--xy-crimson-400);
  color: #ffffff;
  box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.4), 0 0 16px rgba(244, 63, 94, 0.35);
}

/* 特征行 */
.xy-traits-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  font-size: 11px;
  margin-bottom: 6px;
}

.xy-trait-item {
  display: inline-flex;
  gap: 5px;
}

.xy-trait-k {
  color: var(--xy-text-muted);
  font-weight: 500;
}

.xy-trait-v {
  color: var(--xy-cyan-200);
}

.info-enemy .xy-trait-v {
  color: #fed7aa;
}

.xy-trait-none {
  color: var(--xy-text-hint);
  font-style: italic;
  font-size: 11px;
}

/* 资源行 */
.xy-resources-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 6px;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
}

.xy-res-label {
  font-size: 10px;
  font-family: var(--xy-font-mono);
  color: var(--xy-text-muted);
}

.xy-res-chips {
  display: flex;
  gap: 6px;
}

.xy-res-tag {
  font-size: 10px;
  font-family: var(--xy-font-mono);
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--xy-gold-300);
}
</style>
