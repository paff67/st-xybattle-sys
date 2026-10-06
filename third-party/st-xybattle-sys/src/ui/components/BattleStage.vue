<template>
  <div class="xy-battle-stage">
    <!-- 背景流光与水波灵澜氛围 (Ambient Water & Chord Vortex) -->
    <AtmosphereBackground />

    <!-- 核心三栏战场主舞台 (The Master 3-Column Arena) -->
    <div class="xy-stage-arena">
      <div class="xy-arena-columns">
        <!-- 1. 左侧：主角区 (Protagonist Zone: Buffs -> Silhouette & Fanned Wings -> Info Box) -->
        <FighterZone 
          side="player" 
          :actor="player" 
          :effects="playerEffects" 
          :techniques="playerTechniques" 
          :selected-term-id="selectedTermId" 
          :is-modal-open="isSkillModalOpen"
          @select-petal="onSelectWing" 
        />

        <!-- 2. 中央：战状展示区 (Center Pillar: Gauge -> Clashes -> Status) -->
        <CenterStage 
          :round="view.round || 0" 
          :phase="view.phase || 'idle'" 
          :semantic-state="semanticState" 
          :all-effects="allEffects" 
          :player="player" 
          :current-enemy="currentEnemy" 
          :latest-record="latestCommittedRecord" 
          :selected-term-data="null" 
          :selected-term-side="selectedTermSide" 
          :selected-term-parent-name="selectedTermParentName" 
          :selected-term-availability="selectedTermAvailability" 
          @clear-term="selectedTermId = ''" 
          @apply-technique="onApplyTechniqueFromCenter" 
          @open-history="showHistoryDrawer = true" 
        />

        <!-- 3. 右侧：敌手区 (Opponent Zone: Buffs -> Fanned Wings & Silhouette -> Info Box) -->
        <FighterZone 
          side="enemy" 
          :actor="currentEnemy || {}" 
          :effects="enemyEffects" 
          :techniques="enemyTechniques" 
          :selected-term-id="selectedTermId" 
          :is-modal-open="isSkillModalOpen"
          :is-selected-target="true" 
          :enemies-list="enemies" 
          @select-petal="onSelectWing" 
          @select-target="onSelectEnemyTarget" 
        />
      </div>
    </div>

    <!-- 4. 底部贯穿横条：输入区 (Full-Width Anchored Action Dock / Console) -->
    <ActionDock 
      :phase="view.phase" 
      :is-busy="isBusy" 
      :action-label="draftLabel" 
      :selected-technique-id="draftTechniqueId" 
      :technique-options="techniqueSelectOptions" 
      :latest-committed="latestCommittedRecord" 
      :has-bridge-queued="hasBridgeQueued" 
      :host-sync-pending="hostSyncPending" 
      @start="$emit('start')" 
      @next="$emit('next')" 
      @stop="$emit('stop')" 
      @rewrite="$emit('rewrite')" 
      @queue="$emit('queue')" 
      @skip-narrative="$emit('skip-narrative')" 
      @retry-host="$emit('retry-host')" 
      @toggle-history="showHistoryDrawer = !showHistoryDrawer" 
      @submit="$emit('submit', { label: draftLabel, techniqueId: draftTechniqueId })" 
      @update:actionLabel="draftLabel = $event" 
      @update:techniqueId="onUpdateTechniqueId" 
    />

    <!-- 5. 技能圆角毛玻璃浮层弹窗 (Skill Modal with Frosted Glass Backdrop) -->
    <SkillModal
      :is-open="isSkillModalOpen"
      :term-data="selectedTermData"
      :is-player="selectedTermSide === 'player'"
      :parent-name="selectedTermParentName"
      :availability-status="selectedTermAvailability"
      @close="closeSkillModal"
      @apply="onApplySkillFromModal"
    />

    <!-- 6. 右侧滑出式战史抽屉 (Slide-Out History Drawer) -->
    <TimelineDrawer 
      :is-open="showHistoryDrawer" 
      :timeline="view.timeline || []" 
      :public-events="view.scene?.publicEvents || []" 
      @close="showHistoryDrawer = false" 
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import AtmosphereBackground from './AtmosphereBackground.vue';
import FighterZone from './FighterZone.vue';
import CenterStage from './CenterStage.vue';
import SkillModal from './SkillModal.vue';
import ActionDock from './ActionDock.vue';
import TimelineDrawer from './TimelineDrawer.vue';
import { splitEffects, extractEnemyTechniques } from '../../battle-context.js';

const props = defineProps({
  view: { type: Object, default: () => ({}) },
  state: { type: Object, default: () => ({}) },
  controller: { type: Object, default: null }
});

const emit = defineEmits([
  'start',
  'next',
  'stop',
  'rewrite',
  'queue',
  'skip-narrative',
  'retry-host',
  'submit'
]);

const draftLabel = ref('');
const draftTechniqueId = ref('');
const selectedTermId = ref('');
const selectedTermSide = ref('player');
const selectedEnemyId = ref('');
const showHistoryDrawer = ref(false);
const isSkillModalOpen = ref(false);

const isBusy = computed(() => {
  return ['judging', 'narrating', 'rewrite'].includes(props.view.phase);
});

const player = computed(() => props.view.player || {});

const semanticState = computed(() => props.view.semanticState || {});

const allEffects = computed(() => semanticState.value.effects || []);

const splitEff = computed(() => splitEffects(allEffects.value));
const playerEffects = computed(() => splitEff.value.player || []);
const enemyEffects = computed(() => splitEff.value.enemy || []);

// 敌方列表与当前敌人
const enemies = computed(() => props.view.enemies || []);

const currentEnemy = computed(() => {
  if (!enemies.value.length) return null;
  if (selectedEnemyId.value) {
    const found = enemies.value.find(e => e.id === selectedEnemyId.value);
    if (found) return found;
  }
  return enemies.value[0];
});

watch(currentEnemy, (e) => {
  if (e && !selectedEnemyId.value) {
    selectedEnemyId.value = e.id;
  }
}, { immediate: true });

function onSelectEnemyTarget(id) {
  selectedEnemyId.value = id;
}

// 主角功法列表计算
const playerTechniques = computed(() => {
  if (!props.controller?.registry) return [];
  const entries = props.controller.registry.list().filter(e => ['public', 'player'].includes(e.visibility));
  const playerTechGroups = props.state.actors?.player?.techniques || [];

  return entries.flatMap(entry => {
    return entry.techniques
      .filter(t => ['public', 'player'].includes(t.visibility) && playerTechGroups.some(g => g.registryId === entry.id && g.techniqueIds?.includes(t.id)))
      .map(t => {
        const status = props.controller.registry.availability(entry.id, t.id, semanticState.value);
        return {
          ...t,
          entry,
          status
        };
      });
  });
});

// 敌方招式列表计算
const enemyTechniques = computed(() => {
  if (!currentEnemy.value) return [];
  return extractEnemyTechniques(currentEnemy.value, props.view);
});

// 下拉框选项
const techniqueSelectOptions = computed(() => {
  return playerTechniques.value.map(t => ({
    id: t.id,
    name: t.name,
    available: t.status?.available ?? true
  }));
});

// 弦羽点击交互 (触发草图：点击技能放大，未点击技能丝滑收缩，弹出圆角毛玻璃浮层)
function onSelectWing({ side, item }) {
  selectedTermId.value = item.id;
  selectedTermSide.value = side;
  isSkillModalOpen.value = true;
}

function closeSkillModal() {
  isSkillModalOpen.value = false;
  selectedTermId.value = '';
}

function onApplySkillFromModal(id) {
  draftTechniqueId.value = id;
  selectedTermId.value = '';
  selectedTermSide.value = 'player';
  isSkillModalOpen.value = false;
}

function onUpdateTechniqueId(id) {
  draftTechniqueId.value = id;
  if (id) {
    selectedTermId.value = id;
    selectedTermSide.value = 'player';
  } else {
    selectedTermId.value = '';
  }
}

function onApplyTechniqueFromCenter(id) {
  draftTechniqueId.value = id;
  selectedTermId.value = id;
  selectedTermSide.value = 'player';
}

// 选中项详情
const selectedTermData = computed(() => {
  if (!selectedTermId.value) return null;
  if (selectedTermSide.value === 'player') {
    return playerTechniques.value.find(t => t.id === selectedTermId.value) || null;
  } else {
    return enemyTechniques.value.find(t => t.id === selectedTermId.value) || null;
  }
});

const selectedTermParentName = computed(() => {
  if (selectedTermSide.value === 'player') {
    return selectedTermData.value?.entry?.name || '叠浪玄潮决';
  } else {
    return currentEnemy.value?.name || '对手功法';
  }
});

const selectedTermAvailability = computed(() => {
  return selectedTermData.value?.status || { available: true, reason: '' };
});

// 最新已提交记录
const latestCommittedRecord = computed(() => {
  const h = props.state.history || [];
  return h.filter(r => ['committed', 'complete'].includes(r.status)).at(-1) || null;
});

const hasBridgeQueued = computed(() => {
  return Boolean(props.controller?.bridgeQueuedAction);
});

const hostSyncPending = computed(() => {
  return props.controller?.state?.hostSync?.status === 'pending';
});
</script>

<style scoped>
.xy-battle-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 0;
  background: var(--xy-bg-abyss);
  overflow: hidden;
  justify-content: space-between;
}

/* 主擂台三栏布局 (左主角 - 中战状 - 右敌手) */
.xy-stage-arena {
  position: relative;
  z-index: 2;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 14px 24px;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  box-sizing: border-box;
}

.xy-arena-columns {
  display: grid;
  grid-template-columns: minmax(380px, 1.2fr) minmax(320px, 380px) minmax(380px, 1.2fr);
  gap: 24px;
  align-items: stretch;
  height: 100%;
  min-height: 0;
}
</style>
