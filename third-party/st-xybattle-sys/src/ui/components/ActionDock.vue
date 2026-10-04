<template>
  <section class="xy-action-dock" :class="{ 'is-busy': isBusy }">
    <!-- 顶部控制指令 (推进/继续/停战/战史) -->
    <div class="xy-action-topbar">
      <!-- 控制器阶段流转动作按钮 -->
      <div class="xy-action-controls">
        <button 
          class="xy-ctrl-btn btn-start" 
          :disabled="isBusy || !['idle', 'ended'].includes(phase)" 
          @click="$emit('start')"
        >
          <Icons name="play" />
          <span>启战 / 继续</span>
        </button>

        <button 
          class="xy-ctrl-btn btn-next" 
          :disabled="isBusy || !['awaiting_next', 'committed'].includes(phase)" 
          @click="$emit('next')"
        >
          <Icons name="next" />
          <span>进发下轮</span>
        </button>

        <button 
          class="xy-ctrl-btn btn-stop" 
          :disabled="['idle', 'ended'].includes(phase)" 
          @click="$emit('stop')"
        >
          <Icons name="stop" />
          <span>止戈停战</span>
        </button>

        <!-- 扩展操作 (重写正文、注入主剧情、跳过正文) -->
        <button 
          v-if="latestCommitted"
          class="xy-ctrl-btn btn-rewrite"
          :disabled="isBusy"
          @click="$emit('rewrite')"
          title="重写本轮正文 (保留已判决事实，不重裁)"
        >
          <Icons name="refresh" />
          <span>重写正文</span>
        </button>

        <button 
          v-if="latestCommitted"
          class="xy-ctrl-btn btn-inject"
          :disabled="isBusy"
          @click="$emit('queue')"
          title="注入酒馆主剧情下条提示词"
        >
          <Icons name="send" />
          <span>注为主剧情</span>
        </button>

        <button 
          v-if="hasBridgeQueued"
          class="xy-ctrl-btn btn-skip"
          @click="$emit('skip-narrative')"
        >
          <span>跳过本轮正文</span>
        </button>

        <button 
          v-if="hostSyncPending"
          class="xy-ctrl-btn btn-retry-host"
          @click="$emit('retry-host')"
        >
          <span>重试宿主同步</span>
        </button>

        <button 
          class="xy-ctrl-btn btn-history"
          @click="$emit('toggle-history')"
          title="演武战史与批注"
        >
          <Icons name="scroll" />
          <span>战史演进</span>
        </button>
      </div>
    </div>

    <!-- 核心行动输入琴台 (The Resonant Chord Console) -->
    <div class="xy-action-console">
      <!-- 功法拨片选择区 -->
      <div class="xy-technique-selector">
        <label class="xy-tech-picker-label">
          <span class="xy-picker-kicker">选用心法</span>
          <select 
            class="xy-tech-select"
            :value="selectedTechniqueId"
            :disabled="isBusy"
            @change="$emit('update:techniqueId', $event.target.value)"
          >
            <option value="">自由身法 (自由行动)</option>
            <option 
              v-for="opt in techniqueOptions" 
              :key="opt.id" 
              :value="opt.id"
              :disabled="!opt.available"
            >
              {{ opt.name }}{{ opt.available ? '' : ' (机缘未至)' }}
            </option>
          </select>
        </label>

        <button 
          v-if="selectedTechniqueId" 
          class="xy-clear-tech-btn"
          @click="$emit('update:techniqueId', '')"
          title="切为自由行动"
        >
          取消心法
        </button>
      </div>

      <!-- 描述主角行动的输入框 -->
      <div class="xy-input-box-wrapper">
        <textarea
          ref="textareaRef"
          class="xy-action-textarea xy-custom-scroll"
          :value="actionLabel"
          :disabled="isBusy"
          rows="2"
          placeholder="凝神运功，详述主角心意、起手引弦与应对之势…… (按 Ctrl+Enter 快速提交)"
          @input="$emit('update:actionLabel', $event.target.value)"
          @keydown.ctrl.enter="onSubmit"
        ></textarea>
        <span class="xy-textarea-deco"></span>
      </div>

      <!-- 大尺寸灵光提交按钮 -->
      <button 
        class="xy-submit-btn"
        :class="{ 'is-loading': isBusy }"
        :disabled="isBusy || phase !== 'awaiting_player'"
        @click="onSubmit"
      >
        <div class="xy-submit-bg"></div>
        <div class="xy-submit-ripple"></div>
        <div class="xy-submit-content">
          <Icons :name="isBusy ? 'sparkles' : 'send'" class="xy-submit-icon" />
          <span class="xy-submit-text">{{ submitButtonText }}</span>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import Icons from './Icons.vue';

const props = defineProps({
  phase: { type: String, default: 'idle' },
  isBusy: { type: Boolean, default: false },
  actionLabel: { type: String, default: '' },
  selectedTechniqueId: { type: String, default: '' },
  techniqueOptions: { type: Array, default: () => [] },
  latestCommitted: { type: Object, default: null },
  hasBridgeQueued: { type: Boolean, default: false },
  hostSyncPending: { type: Boolean, default: false }
});

const emit = defineEmits([
  'submit',
  'start',
  'next',
  'stop',
  'rewrite',
  'queue',
  'skip-narrative',
  'retry-host',
  'update:actionLabel',
  'update:techniqueId'
]);

const textareaRef = ref(null);

const submitButtonText = computed(() => {
  if (props.isBusy) {
    if (props.phase === 'judging') return '天道裁定中…';
    if (props.phase === 'narrating') return '正文撰刻中…';
    return '推演中…';
  }
  if (props.phase !== 'awaiting_player') return '静候机枢';
  return '提交裁定';
});

function onSubmit() {
  if (props.isBusy || props.phase !== 'awaiting_player') return;
  emit('submit');
}
</script>

<style scoped>
.xy-action-dock {
  position: sticky;
  bottom: 0;
  z-index: 20;
  padding: 10px 32px 14px;
  background: linear-gradient(180deg, rgba(8, 18, 32, 0.95) 0%, rgba(4, 9, 18, 0.99) 100%);
  border-top: 1px solid var(--xy-border-subtle);
  backdrop-filter: blur(24px);
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.6);
  user-select: none;
  flex-shrink: 0;
}

.xy-action-topbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 10px;
  max-width: 1840px;
  margin-left: auto;
  margin-right: auto;
}

/* 控制按钮群 (液态玻璃胶囊按钮 Liquid Glass Pills) */
.xy-action-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.xy-ctrl-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.25), inset 0 -1px 1px rgba(0, 0, 0, 0.35), 0 4px 14px rgba(0, 0, 0, 0.3);
  color: var(--xy-text-body);
  font-size: 12px;
  font-family: var(--xy-font-sans);
  cursor: pointer;
  transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

.xy-ctrl-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.05) 100%);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.32);
  box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.4), 0 6px 20px rgba(0, 0, 0, 0.4);
  transform: translateY(-1px);
}

.xy-ctrl-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none;
}

.btn-start {
  border-color: rgba(56, 189, 248, 0.4);
  color: #7dd3fc;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.18) 0%, rgba(14, 165, 233, 0.05) 100%);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.35), 0 4px 16px rgba(56, 189, 248, 0.2);
}
.btn-start:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.3) 0%, rgba(14, 165, 233, 0.12) 100%);
  border-color: #38bdf8;
  box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.5), 0 6px 22px rgba(56, 189, 248, 0.35);
}

.btn-next {
  border-color: rgba(251, 191, 36, 0.4);
  color: #fde68a;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.18) 0%, rgba(245, 158, 11, 0.05) 100%);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.35), 0 4px 16px rgba(251, 191, 36, 0.2);
}
.btn-next:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.12) 100%);
  border-color: #fbbf24;
  box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.5), 0 6px 22px rgba(251, 191, 36, 0.35);
}

.btn-stop {
  color: #fca5a5;
  border-color: rgba(244, 63, 94, 0.35);
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.18) 0%, rgba(225, 29, 72, 0.05) 100%);
}
.btn-stop:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.28) 0%, rgba(225, 29, 72, 0.12) 100%);
  border-color: #f43f5e;
  box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.45), 0 6px 22px rgba(244, 63, 94, 0.3);
}

/* 核心行动输入琴台 */
.xy-action-console {
  display: grid;
  grid-template-columns: 210px 1fr 140px;
  gap: 12px;
  align-items: stretch;
  max-width: 1840px;
  margin-left: auto;
  margin-right: auto;
}

/* 功法下拉选择 (液态玻璃容器) */
.xy-technique-selector {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: 8px 14px;
  border-radius: 14px;
  border: 1px solid rgba(56, 189, 248, 0.22);
  background: linear-gradient(135deg, rgba(16, 36, 64, 0.55) 0%, rgba(8, 20, 38, 0.65) 100%);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.2), inset 0 -1px 2px rgba(0, 0, 0, 0.35), 0 8px 24px rgba(0, 0, 0, 0.3);
  transition: all 0.25s var(--xy-ease-smooth);
}

.xy-technique-selector:hover {
  border-color: rgba(56, 189, 248, 0.4);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 8px 28px rgba(0, 0, 0, 0.35);
}

.xy-tech-picker-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.xy-picker-kicker {
  font-size: 10px;
  font-family: var(--xy-font-serif);
  color: var(--xy-cyan-300);
  letter-spacing: 0.1em;
}

.xy-tech-select {
  border: 0;
  background: transparent;
  color: var(--xy-text-title);
  font-size: 13px;
  font-family: var(--xy-font-serif);
  padding: 4px 0;
  outline: none;
  cursor: pointer;
}

.xy-tech-select option {
  background: #0b1728;
  color: #e2e8f0;
}

.xy-clear-tech-btn {
  border: 0;
  background: transparent;
  color: var(--xy-gold-400);
  font-size: 10px;
  cursor: pointer;
  text-align: left;
  padding: 0;
  text-decoration: underline;
}

/* 输入框包装 (液态玻璃质感) */
.xy-input-box-wrapper {
  position: relative;
  display: flex;
}

.xy-action-textarea {
  width: 100%;
  min-height: 64px;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid rgba(56, 189, 248, 0.2);
  background: linear-gradient(135deg, rgba(10, 24, 46, 0.55) 0%, rgba(6, 15, 30, 0.68) 100%);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.16), inset 0 -1px 2px rgba(0, 0, 0, 0.35), 0 8px 24px rgba(0, 0, 0, 0.25);
  color: var(--xy-text-title);
  font-family: var(--xy-font-sans);
  font-size: 13px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  transition: all 0.25s var(--xy-ease-smooth);
}

.xy-action-textarea:focus {
  border-color: rgba(56, 189, 248, 0.55);
  background: linear-gradient(135deg, rgba(14, 32, 58, 0.72) 0%, rgba(8, 20, 38, 0.8) 100%);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.28), 0 0 24px rgba(56, 189, 248, 0.3), 0 8px 30px rgba(0, 0, 0, 0.4);
}

/* 提交按钮 (液态苍澜水魄玻璃纽) */
.xy-submit-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  border: 1px solid rgba(186, 230, 253, 0.45);
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.85) 0%, rgba(2, 132, 199, 0.75) 50%, rgba(3, 105, 161, 0.85) 100%);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  color: #ffffff;
  cursor: pointer;
  overflow: hidden;
  box-shadow: inset 0 1.5px 2px rgba(255, 255, 255, 0.65), inset 0 -1.5px 2px rgba(0, 0, 0, 0.45), 0 8px 28px rgba(2, 132, 199, 0.45), 0 0 20px rgba(56, 189, 248, 0.35);
  transition: all 0.25s var(--xy-ease-out-expo);
}

.xy-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.95) 0%, rgba(14, 165, 233, 0.85) 50%, rgba(2, 132, 199, 0.9) 100%);
  border-color: #bae6fd;
  box-shadow: inset 0 2px 3px rgba(255, 255, 255, 0.8), 0 12px 36px rgba(56, 189, 248, 0.6), 0 0 28px rgba(56, 189, 248, 0.5);
}

.xy-submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.xy-submit-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.xy-submit-icon {
  font-size: 16px;
}

.xy-submit-text {
  font-family: var(--xy-font-serif);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.1em;
}

.xy-submit-btn.is-loading .xy-submit-icon {
  animation: xy-pulse-glow 1s infinite;
}
</style>
