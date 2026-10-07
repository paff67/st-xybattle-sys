<template>
  <div class="xy-settings-panel xy-custom-scroll">
    <div class="xy-panel-header">
      <div>
        <span class="xy-panel-kicker">INDEPENDENT ADAPTER CONFIGURATION</span>
        <h2 class="xy-panel-title">独立机枢 · 模型与演算法</h2>
      </div>
      <p class="xy-panel-desc">
        裁定 AI 与正文生成可分别调配独立接入点与参数；凭据保存到当前浏览器本地，仅用于本机请求，不写入聊天、战报或导出文件。
      </p>
    </div>

    <fieldset class="xy-config-card">
      <legend class="xy-card-legend">日常事务入口 · 开发阶段</legend>
      <p class="xy-panel-desc">自动分流与资料准备框架已加入，尚未接入自动裁定。当前默认关闭，不会自动接管聊天；原手动战斗入口继续可用。</p>
    </fieldset>

    <!-- 裁定 AI 配置区 -->
    <fieldset class="xy-config-card">
      <legend class="xy-card-legend">
        <span class="xy-legend-icon">⚖</span>
        <span>战斗裁定 AI (Adjudicator)</span>
      </legend>

      <div class="xy-form-grid">
        <label class="xy-form-field">
          <span class="xy-field-label">推理模式</span>
          <select v-model="form.judge.mode" class="xy-input-select">
            <option value="unconfigured">未配置 (拒绝请求，安全保护)</option>
            <option value="mock">离线 Mock 演示 (免 API Key 极速验算)</option>
            <option value="http">真实 OpenAI-Compatible 接口</option>
          </select>
        </label>

        <label class="xy-form-field">
          <span class="xy-field-label">模型标识 (Model)</span>
          <input v-model="form.judge.model" placeholder="例如: gpt-4o, claude-3-5-sonnet..." class="xy-input-text" />
        </label>

        <label class="xy-form-field xy-col-span-2">
          <span class="xy-field-label">服务接入点 (Endpoint)</span>
          <input v-model="form.judge.endpoint" placeholder="https://api.openai.com/v1/chat/completions" class="xy-input-text" />
        </label>

        <label class="xy-form-field xy-col-span-2">
          <span class="xy-field-label">
            <span>API Key (浏览器本地保存)</span>
            <small class="xy-field-hint">保存后刷新页面仍可使用；清空并保存即可移除</small>
          </span>
          <div class="xy-password-wrap">
            <input 
              v-model="form.judge.apiKey" 
              :type="showJudgeKey ? 'text' : 'password'" 
              placeholder="sk-..." 
              autocomplete="off" 
              class="xy-input-text" 
            />
            <button type="button" class="xy-pwd-toggle" @click="showJudgeKey = !showJudgeKey">
              <Icons :name="showJudgeKey ? 'eye-off' : 'eye'" />
            </button>
          </div>
        </label>

        <label class="xy-form-field">
          <span class="xy-field-label">最大输出 (Max Tokens)</span>
          <input v-model.number="form.judge.maxOutput" type="number" min="10" class="xy-input-text" />
        </label>

        <label class="xy-form-field">
          <span class="xy-field-label">发散温度 (Temperature)</span>
          <input v-model.number="form.judge.temperature" type="number" min="0" max="2" step="0.1" class="xy-input-text" />
        </label>

        <label class="xy-form-field">
          <span class="xy-field-label">结构容错修复次数</span>
          <input v-model.number="form.judge.repairAttempts" type="number" min="0" max="3" class="xy-input-text" />
        </label>

        <label class="xy-form-field">
          <span class="xy-field-label">请求超时 (毫秒)</span>
          <input v-model.number="form.judge.timeoutMs" type="number" min="1000" step="1000" class="xy-input-text" />
        </label>
      </div>
    </fieldset>

    <!-- 正文演进 / 叙事桥接配置区 -->
    <fieldset class="xy-config-card">
      <legend class="xy-card-legend">
        <span class="xy-legend-icon">📜</span>
        <span>正文演化与主剧情桥接 (Narrator)</span>
      </legend>

      <div class="xy-form-grid">
        <label class="xy-form-field">
          <span class="xy-field-label">桥接模式</span>
          <select v-model="form.narrator.mode" class="xy-input-select">
            <option value="main_story">酒馆主剧情注入 (推荐，沿用酒馆设定)</option>
            <option value="packet">仅生成场景包 (供剪贴板与第三方调用)</option>
            <option value="http">独立 OpenAI-Compatible 正文模型</option>
            <option value="mock">离线 Mock 演进</option>
            <option value="unconfigured">未配置</option>
          </select>
        </label>

        <label class="xy-form-field">
          <span class="xy-field-label">模型标识 (Model)</span>
          <input v-model="form.narrator.model" placeholder="正文生成模型名..." class="xy-input-text" />
        </label>

        <label class="xy-form-field xy-col-span-2">
          <span class="xy-field-label">独立接入点 (Endpoint)</span>
          <input v-model="form.narrator.endpoint" placeholder="https://..." class="xy-input-text" />
        </label>

        <label class="xy-form-field xy-col-span-2">
          <span class="xy-field-label">API Key (浏览器本地保存)</span>
          <div class="xy-password-wrap">
            <input 
              v-model="form.narrator.apiKey" 
              :type="showNarratorKey ? 'text' : 'password'" 
              placeholder="sk-..." 
              autocomplete="off" 
              class="xy-input-text" 
            />
            <button type="button" class="xy-pwd-toggle" @click="showNarratorKey = !showNarratorKey">
              <Icons :name="showNarratorKey ? 'eye-off' : 'eye'" />
            </button>
          </div>
        </label>

        <label class="xy-form-field">
          <span class="xy-field-label">最大输出 (Max Tokens)</span>
          <input v-model.number="form.narrator.maxOutput" type="number" min="50" class="xy-input-text" />
        </label>

        <label class="xy-form-field">
          <span class="xy-field-label">发散温度 (Temperature)</span>
          <input v-model.number="form.narrator.temperature" type="number" min="0" max="2" step="0.1" class="xy-input-text" />
        </label>
      </div>
    </fieldset>

    <!-- 全局与宿主桥接选项 -->
    <div class="xy-config-card">
      <h3 class="xy-card-title">宿主桥接与输入契约</h3>

      <div class="xy-toggle-row">
        <label class="xy-checkbox-label">
          <input type="checkbox" v-model="form.autoNarrative" class="xy-checkbox" />
          <span>裁定提交后自动生成正文（主剧情模式：注入场景包并自动发送）</span>
        </label>
      </div>

      <label class="xy-form-field xy-mt-3">
        <span class="xy-field-label">独立 HTTP 模式下的原始 Prompt（主剧情模式自动保留宿主日常输入）</span>
        <textarea v-model="form.originalPrompt" rows="2" class="xy-input-textarea" placeholder="我抬起弦弓，观察水面与对手的节奏。"></textarea>
      </label>

      <label class="xy-form-field xy-mt-3">
        <span class="xy-field-label">人物档案生成输出上限（独立于每轮裁定，默认 8000）</span>
        <input v-model.number="form.characterMaxOutput" type="number" min="1024" step="1024" class="xy-input-text" />
      </label>
      <label class="xy-form-field xy-mt-3">
        <span class="xy-field-label">候选人物补全提示词（固定境界、功法、招式、资源与战斗偏好；确认后生效）</span>
        <textarea v-model="form.characterCompletionPrompt" rows="12" class="xy-input-textarea xy-prompt-editor"></textarea>
      </label>

      <label class="xy-form-field xy-mt-3">
        <span class="xy-field-label">战斗裁定提示词（保存后作为独立裁定 AI 的 system prompt）</span>
        <textarea v-model="form.adjudicationPrompt" rows="16" class="xy-input-textarea xy-prompt-editor"></textarea>
      </label>
    </div>

    <!-- 底部操作按钮 -->
    <div class="xy-settings-footer">
      <button class="xy-save-btn" @click="onSave">
        <Icons name="check" />
        <span>保存机枢设定</span>
      </button>
      <button class="xy-back-btn" @click="$emit('back')">
        <span>返回战场</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import Icons from './Icons.vue';

const props = defineProps({
  settings: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['save', 'back']);

const showJudgeKey = ref(false);
const showNarratorKey = ref(false);

const form = reactive({
  judge: {
    mode: 'unconfigured',
    endpoint: '',
    model: '',
    apiKey: '',
    maxOutput: 800,
    temperature: 0.2,
    repairAttempts: 2,
    timeoutMs: 60000
  },
  narrator: {
    mode: 'main_story',
    endpoint: '',
    model: '',
    apiKey: '',
    maxOutput: 1200,
    temperature: 0.8,
    repairAttempts: 1,
    timeoutMs: 60000
  },
  autoNarrative: true,
  originalPrompt: '',
  characterCompletionPrompt: '',
  characterMaxOutput: 8000,
  adjudicationPrompt: ''
});

watch(() => props.settings, (s) => {
  if (!s) return;
  if (s.adjudicator) Object.assign(form.judge, s.adjudicator);
  if (s.narrator) Object.assign(form.narrator, s.narrator);
  form.autoNarrative = !!s.autoNarrative;
  form.originalPrompt = s.originalPrompt || '';
  form.characterCompletionPrompt = s.characterCompletionPrompt || '';
  form.characterMaxOutput = s.characterMaxOutput || 8000;
  form.adjudicationPrompt = s.adjudicationPrompt || '';
}, { immediate: true, deep: true });

function onSave() {
  emit('save', {
    adjudicator: { ...form.judge },
    narrator: { ...form.narrator },
    autoNarrative: form.autoNarrative,
    originalPrompt: form.originalPrompt,
    characterCompletionPrompt: form.characterCompletionPrompt,
    characterMaxOutput: form.characterMaxOutput,
    adjudicationPrompt: form.adjudicationPrompt
  });
}
</script>

<style scoped>
.xy-settings-panel {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 28px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.xy-panel-header {
  border-bottom: 1px solid var(--xy-border-subtle);
  padding-bottom: 14px;
}

.xy-panel-kicker {
  font-size: 10px;
  letter-spacing: 0.18em;
  font-family: var(--xy-font-mono);
  color: var(--xy-cyan-400);
}

.xy-panel-title {
  margin: 4px 0 6px;
  font-family: var(--xy-font-serif);
  font-size: 24px;
  font-weight: 500;
  color: var(--xy-text-title);
  letter-spacing: 0.04em;
}

.xy-panel-desc {
  margin: 0;
  font-size: 12px;
  color: var(--xy-text-muted);
  line-height: 1.6;
}

.xy-config-card {
  border: 1px solid var(--xy-border-subtle);
  border-radius: 12px;
  background: rgba(12, 26, 46, 0.75);
  backdrop-filter: blur(16px);
  padding: 18px 22px;
  margin: 0;
}

.xy-card-legend, .xy-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--xy-font-serif);
  font-size: 15px;
  font-weight: 500;
  color: var(--xy-gold-300);
  padding: 0 6px;
}

.xy-legend-icon {
  font-size: 14px;
}

.xy-form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-top: 12px;
}

.xy-col-span-2 {
  grid-column: span 2;
}

.xy-form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.xy-field-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: var(--xy-text-muted);
  font-family: var(--xy-font-sans);
}

.xy-field-hint {
  font-size: 9px;
  color: var(--xy-gold-400);
}

.xy-input-text, .xy-input-select, .xy-input-textarea {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(56, 189, 248, 0.2);
  background: linear-gradient(135deg, rgba(8, 18, 36, 0.6) 0%, rgba(4, 10, 22, 0.75) 100%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 -1px 1px rgba(0, 0, 0, 0.3);
  color: var(--xy-text-title);
  font-family: var(--xy-font-sans);
  font-size: 13px;
  outline: none;
  transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

.xy-input-text:focus, .xy-input-select:focus, .xy-input-textarea:focus {
  border-color: rgba(56, 189, 248, 0.55);
  background: linear-gradient(135deg, rgba(12, 26, 48, 0.75) 0%, rgba(6, 16, 32, 0.85) 100%);
  box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.25), 0 0 16px rgba(56, 189, 248, 0.25);
}

.xy-password-wrap {
  position: relative;
  display: flex;
}

.xy-password-wrap input {
  width: 100%;
  padding-right: 36px;
}

.xy-pwd-toggle {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: var(--xy-text-muted);
  cursor: pointer;
  padding: 4px;
}

.xy-pwd-toggle:hover {
  color: var(--xy-cyan-300);
}

.xy-toggle-row {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.xy-checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--xy-text-body);
  cursor: pointer;
}

.xy-checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--xy-cyan-500);
}

.xy-mt-3 {
  margin-top: 12px;
}

.xy-settings-footer {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.xy-save-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 26px;
  border-radius: 999px;
  border: 1px solid rgba(186, 230, 253, 0.45);
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.85) 0%, rgba(2, 132, 199, 0.75) 50%, rgba(3, 105, 161, 0.85) 100%);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  color: #ffffff;
  font-size: 14px;
  font-family: var(--xy-font-serif);
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  box-shadow: inset 0 1.5px 2px rgba(255, 255, 255, 0.65), inset 0 -1.5px 2px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(2, 132, 199, 0.4), 0 0 16px rgba(56, 189, 248, 0.3);
  transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

.xy-save-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.95) 0%, rgba(14, 165, 233, 0.85) 50%, rgba(2, 132, 199, 0.9) 100%);
  border-color: #bae6fd;
  box-shadow: inset 0 2px 3px rgba(255, 255, 255, 0.8), 0 12px 32px rgba(56, 189, 248, 0.55), 0 0 24px rgba(56, 189, 248, 0.4);
}

.xy-back-btn {
  padding: 10px 22px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.22), 0 4px 12px rgba(0, 0, 0, 0.25);
  color: var(--xy-text-body);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

.xy-back-btn:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
  box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.35), 0 6px 18px rgba(0, 0, 0, 0.35);
  transform: translateY(-1px);
}
</style>
