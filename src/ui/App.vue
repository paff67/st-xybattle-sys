<template>
  <div id="xybattle-v2-root" class="xy-root-container">
    <!-- 悬浮灵符启动器 (Draggable Floating Daoist Seal Launcher) -->
    <button 
      ref="launcherRef"
      id="xybattle-v2-launcher"
      class="xy-launcher-seal"
      :class="{ 'is-active': isOpen, 'is-judging': isJudging }"
      :style="launcherStyle"
      aria-label="开启水·弦独立战斗工作台"
      @pointerdown="onLauncherPointerDown"
      @click="onLauncherClick"
    >
      <div class="xy-seal-ring"></div>
      <div class="xy-seal-inner">
        <span class="xy-seal-icon">⚔</span>
        <span class="xy-seal-text">战斗</span>
      </div>
      <span v-if="phaseBadge" class="xy-launcher-badge" :class="'bg-' + view.phase">
        {{ phaseBadge }}
      </span>
    </button>

    <!-- 主工作台窗口 (The Master Daoist Workbench Dialog) -->
    <Transition name="xy-modal-fade">
      <div 
        v-if="isOpen" 
        class="xy-modal-backdrop" 
        @click.self="close"
      >
        <section 
          id="xybattle-v2-panel" 
          class="xy-workbench-panel" 
          role="dialog" 
          aria-label="独立战斗工作台"
        >
          <!-- 顶部横额与导航标签 -->
          <StageHeader 
            :scene="view.scene"
            :semantic-state="view.semanticState"
            :round="view.round || 0"
            :version="view.version || 1"
            :phase="view.phase || 'idle'"
            :scope="view.scope || { chatId: '', branchId: '' }"
            :current-tab="currentTab"
            :adjudicator-mode="controller.settings?.adjudicator?.mode || 'unconfigured'"
            :log-count="controller.logs?.length || 0"
            @update:tab="currentTab = $event"
            @close="close"
          />

          <!-- 灵光通告 / 异常警示条 -->
          <Transition name="xy-notice-slide">
            <div 
              v-if="notification || state.lastError"
              class="xy-notice-banner"
              :class="{ 'is-error': !!state.lastError }"
              role="status"
            >
              <span class="xy-notice-icon">{{ state.lastError ? '⚠️' : '✨' }}</span>
              <span class="xy-notice-text">{{ notification || state.lastError || state.hostSync?.reason }}</span>
              <button class="xy-notice-dismiss" @click="notification = ''; state.lastError = ''">✕</button>
            </div>
          </Transition>

          <!-- 主内容区域 (按 Tab 切换) -->
          <div class="xy-content-body xy-custom-scroll" :class="{ 'is-scrollable': currentTab !== 'workbench' || preparingCharacters }">
            <!-- 1. 战场对决主舞台 -->
            <CharacterConfirmationPanel
              v-if="currentTab === 'workbench' && preparingCharacters"
              :preparation="characterPanel"
              :busy="characterBusy"
              @prepare="handlePrepareCharacters"
              @retry="handlePrepareCharacters"
              @confirm="handleConfirmCharacters"
              @cancel="handleCancelCharacters"
            />
            <BattleStage 
              v-show="currentTab === 'workbench' && !preparingCharacters"
              :view="view"
              :state="state"
              :controller="controller"
              @start="handleStart"
              @next="handleNext"
              @stop="handleStop"
              @rewrite="handleRewrite"
              @queue="handleQueue"
              @skip-narrative="handleSkipNarrative"
              @retry-host="handleRetryHost"
              @submit="handleSubmit"
            />

            <!-- 2. 独立机枢设置 -->
            <SettingsPanel 
              v-if="currentTab === 'settings'"
              :settings="controller.settings"
              @save="handleSaveSettings"
              @back="currentTab = 'workbench'"
            />

            <!-- 3. 演武经卷与存档 -->
            <DataPanel 
              v-else-if="currentTab === 'data'"
              :snapshot="currentSnapshot"
              @load-demo="handleLoadDemo"
              @export-full="handleExportFull"
              @export-public="handleExportPublic"
              @import-scene="handleImportScene"
              @import-registry="handleImportRegistry"
              @import-save="handleImportSave"
            />
            <ContentLibraryPanel
              v-else-if="currentTab === 'library'"
              :store="contentStore"
              @changed="handleContentChanged"
              @export="handleContentExport"
              @apply="handleContentApply"
            />

            <!-- 4. 天道秘录与审计 -->
            <DeveloperPanel 
              v-else-if="currentTab === 'developer'"
              :ai-context="currentAiContext"
              :logs="controller.logs || []"
              @copy-debug="handleCopyDebug"
              @export-debug="handleExportDebug"
              @export-public="handleExportPublicLogs"
            />
          </div>
        </section>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, shallowRef } from 'vue';
import StageHeader from './components/StageHeader.vue';
import BattleStage from './components/BattleStage.vue';
import SettingsPanel from './components/SettingsPanel.vue';
import DataPanel from './components/DataPanel.vue';
import DeveloperPanel from './components/DeveloperPanel.vue';
import ContentLibraryPanel from './components/ContentLibraryPanel.vue';
import CharacterConfirmationPanel from './components/CharacterConfirmationPanel.vue';
import { downloadJson } from '../utils.js';
import { getAiReadContext } from '../battle-state.js';
import { stripSecrets } from '../common.js';
import demoScene from '../../sample-data/demo-scene.json' with { type: 'json' };
import { ContentStore } from '../content-store.js';

const props = defineProps({
  controller: { type: Object, required: true },
  hostAdapter: { type: Object, default: null }
});

const isOpen = ref(false);
const currentTab = ref('workbench');
const notification = ref('');
const contentStore = new ContentStore();
const preparingCharacters = ref(false);
const characterBusy = ref(false);
const characterPanel = shallowRef(null);

// 响应式状态快照
const view = shallowRef(props.controller.playerView());
const state = shallowRef(props.controller.state);

function updateViews() {
  view.value = props.controller.playerView();
  state.value = props.controller.state;
}

// 绑定控制器状态变化
props.controller.onChange = () => {
  updateViews();
};

const isJudging = computed(() => {
  return view.value.phase === 'judging';
});

const phaseBadge = computed(() => {
  const p = view.value.phase;
  if (p === 'judging') return '裁定中';
  if (p === 'narrating') return '正文中';
  if (p === 'awaiting_next') return '待下轮';
  return '';
});

// 悬浮启动器拖动逻辑
const launcherPos = reactive({ x: null, y: null });
let dragStart = null;
let hasDragged = false;

const launcherStyle = computed(() => {
  if (launcherPos.x === null || launcherPos.y === null) return {};
  return {
    left: `${launcherPos.x}px`,
    top: `${launcherPos.y}px`,
    right: 'auto',
    bottom: 'auto'
  };
});

function onLauncherPointerDown(e) {
  dragStart = {
    startX: e.clientX,
    startY: e.clientY,
    initialLeft: e.currentTarget.offsetLeft,
    initialTop: e.currentTarget.offsetTop
  };
  hasDragged = false;
  e.currentTarget.setPointerCapture?.(e.pointerId);

  const onMove = (moveEvent) => {
    if (!dragStart) return;
    const dx = moveEvent.clientX - dragStart.startX;
    const dy = moveEvent.clientY - dragStart.startY;
    if (Math.abs(dx) + Math.abs(dy) > 5) {
      hasDragged = true;
      const maxX = window.innerWidth - 70;
      const maxY = window.innerHeight - 70;
      launcherPos.x = Math.max(10, Math.min(maxX, dragStart.initialLeft + dx));
      launcherPos.y = Math.max(10, Math.min(maxY, dragStart.initialTop + dy));
    }
  };

  const onUp = (upEvent) => {
    dragStart = null;
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
  };

  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
}

function onLauncherClick() {
  if (hasDragged) {
    hasDragged = false;
    return;
  }
  isOpen.value = !isOpen.value;
}

function close() {
  isOpen.value = false;
}

// 键盘 Esc 关闭
function onKeydown(e) {
  if (e.key === 'Escape' && isOpen.value) {
    close();
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
  contentStore.ready().then(() => props.controller.hydrateContentStore?.(contentStore)).then(() => {
    if (contentStore.status().warning) notification.value = contentStore.status().warning;
  }).catch((error) => {
    notification.value = `内容库读取失败：${error.message}`;
  });
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown);
});

// 动作指令处理器
async function handleStart() {
  try {
    notification.value = '';
    if (props.controller.hostAdapter && props.controller.state.characterPreparation?.status !== 'confirmed') {
      preparingCharacters.value = true;
      await handlePrepareCharacters();
      return;
    }
    props.controller.start();
    updateViews();
  } catch (err) {
    notification.value = err.message;
  }
}

async function handlePrepareCharacters() {
  characterBusy.value = true;
  characterPanel.value = null;
  try {
    notification.value = '';
    characterPanel.value = await props.controller.prepareCharacters();
  } catch (error) {
    notification.value = error.message;
  } finally {
    characterBusy.value = false;
  }
}

function handleConfirmCharacters({ edits, removeIds }) {
  try {
    props.controller.confirmCharacters(edits, { removeIds });
    characterPanel.value = null;
    preparingCharacters.value = false;
    props.controller.start();
    updateViews();
  } catch (error) {
    notification.value = error.message;
  }
}

function handleCancelCharacters() {
  props.controller.cancelCharacterPreparation();
  characterPanel.value = null;
  preparingCharacters.value = false;
}

async function handleNext() {
  try {
    notification.value = '';
    props.controller.continueNext();
    updateViews();
  } catch (err) {
    notification.value = err.message;
  }
}

function handleStop() {
  try {
    notification.value = '';
    props.controller.stop();
    updateViews();
  } catch (err) {
    notification.value = err.message;
  }
}

async function handleSubmit({ label, techniqueId }) {
  try {
    notification.value = '';
    await props.controller.submit({ label, techniqueId: techniqueId || null });
    updateViews();
  } catch (err) {
    notification.value = err.message;
  }
}

async function handleRewrite() {
  try {
    notification.value = '';
    const latest = state.value.history?.filter(r => ['committed', 'complete'].includes(r.status)).at(-1);
    if (!latest) return;
    await props.controller.rewrite(latest.actionId);
    updateViews();
  } catch (err) {
    notification.value = err.message;
  }
}

async function handleQueue() {
  try {
    notification.value = '';
    const latest = state.value.history?.filter(r => ['committed', 'complete'].includes(r.status)).at(-1);
    if (!latest) return;
    const scope = props.hostAdapter?.scope?.() || state.value.scope;
    await props.controller.queueMainStory(latest, scope);
    notification.value = '场景包已交给宿主适配器；请在酒馆正常发送下一条 Prompt。';
    updateViews();
  } catch (err) {
    notification.value = err.message;
  }
}

function handleSkipNarrative() {
  try {
    props.controller.skipPendingNarrative();
    notification.value = '已跳过本轮正文，裁定事实已完整保留';
    updateViews();
  } catch (err) {
    notification.value = err.message;
  }
}

async function handleRetryHost() {
  try {
    const saved = await props.controller.retryHostPersistence();
    notification.value = saved?.confirmed ? '宿主持久化已确认' : `保存待确认：${saved?.reason || '无宿主能力'}`;
    updateViews();
  } catch (err) {
    notification.value = err.message;
  }
}

// 设置与数据
function handleSaveSettings(newSettings) {
  try {
    props.controller.setSettings(newSettings);
    notification.value = '独立机枢设定已保存；凭据仅保存在当前浏览器本地，不写入战报或导出';
    updateViews();
  } catch (err) {
    notification.value = err.message;
  }
}

function handleLoadDemo() {
  try {
    props.controller.importScene(demoScene);
    notification.value = '已成功载入《叠浪玄潮决》演示场景';
    updateViews();
  } catch (err) {
    notification.value = err.message;
  }
}

function handleExportFull() {
  downloadJson(`battle-v2-save-${Date.now()}.json`, props.controller.exportData());
}

function handleExportPublic() {
  downloadJson(`battle-v2-public-${Date.now()}.json`, JSON.stringify(props.controller.playerView(), null, 2));
}

function handleExportPublicLogs() {
  downloadJson(`battle-v2-public-logs-${Date.now()}.json`, props.controller.logExport());
}

function handleExportDebug() {
  downloadJson(`battle-v2-developer-logs-${Date.now()}.json`, props.controller.debugLogExport());
}

async function handleCopyDebug() {
  await navigator.clipboard.writeText(props.controller.debugLogExport());
  notification.value = '已复制完整天道开发审计日志';
}

function handleImportScene(json) {
  try {
    props.controller.importScene(json);
    notification.value = '场景已成功导入';
    updateViews();
  } catch (err) {
    notification.value = err.message;
  }
}

function handleImportRegistry(json) {
  try {
    props.controller.importRegistry(json);
    notification.value = '功法 Registry 已成功导入';
    updateViews();
  } catch (err) {
    notification.value = err.message;
  }
}

function handleImportSave(json) {
  try {
    props.controller.importData(json);
    notification.value = '当前分支战局存档已恢复';
    updateViews();
  } catch (err) {
    notification.value = err.message;
  }
}

function handleContentChanged(result) {
  notification.value = `内容库已更新；已开始的战斗仍使用各自的 registry snapshot`;
  if (result?.action === 'delete') updateViews();
}

function handleContentExport(text) {
  downloadJson(`xybattle-content-${Date.now()}.json`, text);
}

function handleContentApply(entries) {
  try {
    props.controller.applyContentEntries(entries);
    notification.value = '已将选中内容应用到本场注册表；正在进行的战斗不会被改写';
    updateViews();
  } catch (error) { notification.value = error.message; }
}

const currentSnapshot = computed(() => {
  return {
    scene: state.value.scene,
    actors: state.value.actors,
    semanticState: state.value.semanticState,
    resourceRules: state.value.resourceRules
  };
});

const currentAiContext = computed(() => {
  return stripSecrets(getAiReadContext(state.value), props.controller.secrets());
});

defineExpose({
  open: () => { isOpen.value = true; },
  close: () => { isOpen.value = false; }
});
</script>

<style>
@import './styles/theme.css';

/* 悬浮启动器徽章 */
.xy-root-container {
  position: relative;
  z-index: 2147483000;
  font-family: var(--xy-font-sans);
  color: var(--xy-text-body);
}

.xy-launcher-seal {
  position: fixed;
  right: 28px;
  bottom: 28px;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 1px solid var(--xy-border-glow);
  background: radial-gradient(circle at 35% 35%, rgba(14, 165, 233, 0.95), rgba(7, 16, 30, 0.98));
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px var(--xy-cyan-glow);
  cursor: grab;
  touch-action: none;
  z-index: 2147483000;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s var(--xy-ease-out-expo), box-shadow 0.2s;
  user-select: none;
}

.xy-launcher-seal:hover {
  transform: scale(1.08);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.7), 0 0 28px rgba(56, 189, 248, 0.6);
}

.xy-launcher-seal.is-judging {
  border-color: var(--xy-gold-400);
  box-shadow: 0 0 24px var(--xy-gold-glow);
  animation: xy-pulse-glow 1.5s infinite;
}

.xy-seal-ring {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1px dashed rgba(56, 189, 248, 0.4);
  animation: xy-rotate-slow 24s linear infinite;
  pointer-events: none;
}

.xy-seal-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.1;
}

.xy-seal-icon {
  font-size: 16px;
  color: #ffffff;
}

.xy-seal-text {
  font-family: var(--xy-font-serif);
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.08em;
}

.xy-launcher-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  font-size: 9px;
  font-family: var(--xy-font-mono);
  padding: 1px 6px;
  border-radius: 999px;
  background: var(--xy-gold-500);
  color: #000000;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

/* 模态弹窗工作台 */
.xy-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 12, 0.92);
  backdrop-filter: blur(20px);
  z-index: 2147483000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  box-sizing: border-box;
}

.xy-workbench-panel {
  position: relative;
  width: 100%;
  max-width: 1920px;
  height: 100%;
  max-height: 100%;
  background: var(--xy-bg-abyss);
  border: 1px solid var(--xy-border-subtle);
  border-radius: 12px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(56, 189, 248, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

/* 警示条 */
.xy-notice-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 24px;
  background: rgba(251, 191, 36, 0.12);
  border-bottom: 1px solid rgba(251, 191, 36, 0.3);
  color: var(--xy-gold-200);
  font-size: 12px;
  flex-shrink: 0;
}

.xy-notice-banner.is-error {
  background: rgba(244, 63, 94, 0.14);
  border-bottom-color: rgba(244, 63, 94, 0.35);
  color: var(--xy-crimson-300);
}

.xy-notice-text {
  flex: 1;
}

.xy-notice-dismiss {
  border: 0;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  padding: 2px 6px;
  font-size: 14px;
}

/* 主内容容器 */
.xy-content-body {
  flex: 1;
  min-height: 0;
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow-y: hidden;
  overflow-x: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.xy-content-body.is-scrollable {
  overflow-y: auto;
}

/* 弹窗渐隐过渡 */
.xy-modal-fade-enter-active, .xy-modal-fade-leave-active {
  transition: opacity 0.3s var(--xy-ease-smooth);
}
.xy-modal-fade-enter-from, .xy-modal-fade-leave-to {
  opacity: 0;
}

.xy-modal-fade-enter-active .xy-workbench-panel {
  transition: transform 0.35s var(--xy-ease-out-expo), opacity 0.3s var(--xy-ease-smooth);
}
.xy-modal-fade-enter-from .xy-workbench-panel {
  transform: scale(0.96) translateY(12px);
  opacity: 0;
}

/* 通告栏过渡 */
.xy-notice-slide-enter-active, .xy-notice-slide-leave-active {
  transition: all 0.25s var(--xy-ease-out-expo);
}
.xy-notice-slide-enter-from, .xy-notice-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
