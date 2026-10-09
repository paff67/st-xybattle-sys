<template>
  <div class="xy-settings-panel xy-custom-scroll" :inert="saving">
    <div class="xy-panel-header">
      <div>
        <span class="xy-panel-kicker">INDEPENDENT ADAPTER CONFIGURATION</span>
        <h2 class="xy-panel-title">独立机枢 · 模型与演算法</h2>
      </div>
      <p class="xy-panel-desc">
        {{ controller?.configStore ? '酒馆账号配置' : '离线开发配置' }} · {{ saveMessage }}
      </p>
    </div>

    <p class="xy-panel-desc">参数、提示词和密钥保存在当前酒馆账号设置中；另一设备需刷新后读取。密钥是普通设置字符串，不进入战报或普通导出。跨设备切换前请刷新，避免同时编辑。</p>
    <fieldset class="xy-config-card">
      <legend class="xy-card-legend">日常事务入口 · 开发阶段</legend>
      <p class="xy-panel-desc">默认关闭。开启后，普通输入直接续写；战斗沿用现有工作台。修炼突破、炼丹炼器、探查、疗伤、破阵、追逃与日常事务默认后台裁定，右上方显示具体任务与取消按钮。取消后不注入裁定结果，直接交给主 AI 续写。日志页可查看资料、依据摘要与结果。</p>
      <label class="xy-checkbox-label xy-mt-3">
        <input type="checkbox" v-model="form.eventAutoEnabled" class="xy-checkbox" />
        <span>启用自动分流与战斗准备（保存后生效）</span>
      </label>
      <small class="xy-field-hint">分流不会直接结算战斗。非战斗事务完成裁定后，将结果注入本轮正文；资料不足或请求失败会停止并保留输入。</small>
    </fieldset>

    <fieldset class="xy-config-card">
      <legend class="xy-card-legend">MVU 战斗状态监听</legend>
      <label class="xy-checkbox-label"><input type="checkbox" v-model="form.battleStateListenerEnabled" class="xy-checkbox" /><span>状态从其他有效值变为“待裁定”时自动准备战斗（默认关闭）</span></label>
      <p class="xy-panel-desc">独立于语义分流。只读取当前回复的 MVU，沿用人物准备与确认流程，不执行首轮行动、不自动发送正文。初次打开已有待裁定状态不会回放。缺少可关联的 MVU 更新接口时，日志会显示不可用，仍可手动开始。</p>
    </fieldset>

    <CoreRulesSettings v-if="controller" :controller="controller" :state="battleState" :preparing="preparing" />

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
            <span>API Key（酒馆账号设置）</span>
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

    <fieldset class="xy-config-card" data-testid="daily-api-settings">
      <legend class="xy-card-legend">非战斗裁定 API</legend>
      <label class="xy-checkbox-label">
        <input type="checkbox" v-model="form.dailyAdjudicator.inherit" @change="changeDailyInheritance" data-testid="daily-api-inherit" class="xy-checkbox" />
        <span>沿用战斗裁定 AI 的连接、模型、温度、输出上限与单次超时（默认）</span>
      </label>
      <p class="xy-panel-desc">用于自动分流、资料提取与非战斗裁定。关闭沿用后可独立配置；战斗开战后的裁定仍使用战斗 API。当前不自动重试失败请求。</p>
      <div class="xy-form-grid">
        <label class="xy-form-field"><span class="xy-field-label">模型标识 (Model)</span>
          <input v-model="dailyApi.model" :disabled="form.dailyAdjudicator.inherit" data-testid="daily-api-model" class="xy-input-text" /></label>
        <label class="xy-form-field xy-col-span-2"><span class="xy-field-label">服务接入点 (Endpoint)</span>
          <input v-model="dailyApi.endpoint" :disabled="form.dailyAdjudicator.inherit" data-testid="daily-api-endpoint" placeholder="https://api.example.com/v1" class="xy-input-text" /></label>
        <label class="xy-form-field xy-col-span-2"><span class="xy-field-label">API Key（酒馆账号设置）</span>
          <div class="xy-password-wrap">
            <input v-model="dailyApi.apiKey" :disabled="form.dailyAdjudicator.inherit" :type="showDailyKey ? 'text' : 'password'" autocomplete="off" data-testid="daily-api-key" class="xy-input-text" />
            <button type="button" class="xy-pwd-toggle" :aria-label="showDailyKey ? '隐藏非战斗 API Key' : '显示非战斗 API Key'" @click="showDailyKey = !showDailyKey"><Icons :name="showDailyKey ? 'eye-off' : 'eye'" /></button>
          </div></label>
        <label class="xy-form-field"><span class="xy-field-label">温度 (Temperature)</span>
          <input v-model.number="dailyApi.temperature" :disabled="form.dailyAdjudicator.inherit" data-testid="daily-api-temperature" type="number" min="0" max="2" step="0.1" class="xy-input-text" /></label>
        <label class="xy-form-field"><span class="xy-field-label">最大输出 (Max Tokens)</span>
          <input v-model.number="dailyApi.maxOutput" :disabled="form.dailyAdjudicator.inherit" data-testid="daily-api-output" type="number" min="1" step="1" class="xy-input-text" /></label>
        <label class="xy-form-field"><span class="xy-field-label">单次请求超时（毫秒）</span>
          <input v-model.number="dailyApi.timeoutMs" :disabled="form.dailyAdjudicator.inherit" data-testid="daily-api-timeout" type="number" min="100" step="1000" class="xy-input-text" /></label>
        <label class="xy-form-field"><span class="xy-field-label">整次事务总时限（毫秒）</span>
          <input v-model.number="form.dailyTotalTimeoutMs" data-testid="daily-total-timeout" type="number" min="100" step="1000" class="xy-input-text" /></label>
      </div>
      <p class="xy-field-hint">总时限独立设置，覆盖分流、资料提取及各行动裁定；任一时限到达即停止并报错。</p>
    </fieldset>

    <fieldset class="xy-config-card" data-testid="daily-prompt-settings">
      <legend class="xy-card-legend">非战斗裁定提示词</legend>
      <p class="xy-panel-desc">通用提示词与模块提示词</p>
      <details class="xy-mt-3">
        <summary>通用裁定提示词</summary>
        <label class="xy-form-field xy-mt-3"><span class="xy-field-label">非战斗通用提示词</span>
          <textarea v-model="form.dailyPrompts.common" data-testid="daily-common-prompt" rows="14" class="xy-input-textarea xy-prompt-editor"></textarea></label>
        <button type="button" class="xy-back-btn xy-mt-3" data-testid="daily-reset-common" @click="resetPrompt('dailyCommon')">恢复通用默认提示词</button>
      </details>
      <details v-for="domain in DAILY_DOMAINS" :key="domain" class="xy-mt-3">
        <summary>{{ domainContract(domain).label }}专项提示词</summary>
        <label class="xy-form-field xy-mt-3"><span class="xy-field-label">{{ domainContract(domain).label }}专项提示词</span>
          <textarea v-model="form.dailyPrompts.modules[domain]" :data-testid="'daily-prompt-' + domain" rows="5" class="xy-input-textarea"></textarea></label>
        <button type="button" class="xy-back-btn xy-mt-3" :data-testid="'daily-reset-' + domain" @click="resetPrompt(domain)">恢复本模块默认提示词</button>
      </details>
    </fieldset>

    <fieldset class="xy-config-card" data-testid="character-api-settings">
      <legend class="xy-card-legend">人物生成 API</legend>
      <label class="xy-checkbox-label">
        <input type="checkbox" v-model="form.characterGenerator.inherit" @change="changeCharacterInheritance" data-testid="character-api-inherit" class="xy-checkbox" />
        <span>沿用裁定 AI 的连接、模型、温度和超时（默认）</span>
      </label>
      <p class="xy-panel-desc">关闭沿用后可独立配置。此 API 识别参战人物并仅生成敌人档案；主角资料从 MVU 读取，功法由你从内容库手动选取激活。输出预算与重试次数单独设置。</p>
      <div class="xy-form-grid">
        <label class="xy-form-field"><span class="xy-field-label">模型标识 (Model)</span>
          <input v-model="characterApi.model" :disabled="form.characterGenerator.inherit" data-testid="character-api-model" class="xy-input-text" /></label>
        <label class="xy-form-field xy-col-span-2"><span class="xy-field-label">服务接入点 (Endpoint)</span>
          <input v-model="characterApi.endpoint" :disabled="form.characterGenerator.inherit" data-testid="character-api-endpoint" placeholder="https://api.example.com/v1" class="xy-input-text" /></label>
        <label class="xy-form-field xy-col-span-2"><span class="xy-field-label">API Key（酒馆账号设置）</span>
          <div class="xy-password-wrap">
            <input v-model="characterApi.apiKey" :disabled="form.characterGenerator.inherit" :type="showCharacterKey ? 'text' : 'password'" autocomplete="off" data-testid="character-api-key" class="xy-input-text" />
            <button type="button" class="xy-pwd-toggle" @click="showCharacterKey = !showCharacterKey"><Icons :name="showCharacterKey ? 'eye-off' : 'eye'" /></button>
          </div></label>
        <label class="xy-form-field"><span class="xy-field-label">温度 (Temperature)</span>
          <input v-model.number="characterApi.temperature" :disabled="form.characterGenerator.inherit" type="number" min="0" max="2" step="0.1" class="xy-input-text" /></label>
        <label class="xy-form-field"><span class="xy-field-label">单次请求及连续无进展超时（毫秒）</span>
          <input v-model.number="characterApi.timeoutMs" :disabled="form.characterGenerator.inherit" data-testid="character-api-timeout" type="number" min="1000" step="1000" class="xy-input-text" /></label>
      </div>
      <label class="xy-form-field xy-mt-3">
        <span class="xy-field-label">人物档案生成输出上限（独立于每轮裁定，默认 8000）</span>
        <input v-model.number="form.characterMaxOutput" type="number" min="1024" step="1024" class="xy-input-text" />
      </label>
      <label class="xy-form-field xy-mt-3">
        <span class="xy-field-label">人物生成失败重试次数（0~3，默认 0；超时不重试）</span>
        <input v-model.number="form.characterMaxRetries" type="number" min="0" max="3" step="1" class="xy-input-text" />
        <span>每次请求单独计时；成功返回后重置准备计时。单次请求超时立即报错且不重试。</span>
      </label>
      <label class="xy-form-field xy-mt-3">
        <span class="xy-field-label">发送给人物生成 AI 的上下文消息条数（1~100，默认 20）</span>
        <input v-model.number="form.characterMessageCount" type="number" min="1" max="100" step="1" class="xy-input-text" />
      </label>
      <label class="xy-form-field xy-mt-3">
        <span class="xy-field-label">候选人物补全提示词（仅生成敌人；主角从 MVU 与内容库读取）</span>
        <textarea v-model="form.characterCompletionPrompt" rows="12" class="xy-input-textarea xy-prompt-editor"></textarea>
      </label>

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
          <span class="xy-field-label">API Key（酒馆账号设置）</span>
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
        <span class="xy-field-label">战斗裁定提示词（保存后作为独立裁定 AI 的 system prompt）</span>
        <textarea v-model="form.adjudicationPrompt" rows="16" class="xy-input-textarea xy-prompt-editor"></textarea>
        <button class="xy-back-btn" @click="resetPrompt('adjudication')">恢复战斗默认提示词</button>
        <button class="xy-back-btn" @click="resetPrompt('character')">恢复人物默认提示词</button>
      </label>
    </div>

    <!-- 底部操作按钮 -->
    <div class="xy-settings-footer">
      <button class="xy-save-btn" :disabled="saving || preparing" @click="onSave">
        <Icons name="check" />
        <span>保存机枢设定</span>
      </button>
      <button v-if="controller?.configStore" class="xy-back-btn" :disabled="saving || preparing" @click="reloadHost">重新加载酒馆配置</button>
      <button v-if="controller?.configEnvelope" class="xy-back-btn" @click="exportBackup">导出配置（不含密钥）</button>
      <button v-if="controller?.configEnvelope" class="xy-back-btn" :disabled="saving" @click="verifySave">核对服务器保存</button>
      <label v-if="controller?.configStore" class="xy-back-btn">导入配置到草稿<input type="file" accept="application/json,.json" :disabled="saving" @change="importBackup" /></label>
      <button class="xy-back-btn" @click="$emit('back')">
        <span>返回战场</span>
      </button>
    </div>
    <section v-if="migrationSources.length">
      <h3>本地配置来源</h3>
      <select v-model.number="selectedSource" class="xy-input-select" :disabled="saving"><option v-for="(source, index) in migrationSources" :key="source.key" :value="index">{{ source.key }}</option></select>
      <p v-if="preview?.error">本地配置损坏，无法迁入</p>
      <table v-else-if="preview"><thead><tr><th>API</th><th>模型</th><th>地址</th><th>密钥</th><th>参数差异</th></tr></thead><tbody><tr v-for="(api, name) in preview.apis" :key="name"><td>{{ name }}</td><td>{{ api.parameters.model }}</td><td style="overflow-wrap:anywhere">{{ api.parameters.endpoint }}</td><td>{{ api.hasCredential ? '有' : '无' }}</td><td>{{ api.differs ? '不同' : '—' }}</td></tr></tbody></table>
      <p v-if="preview?.prompts">提示词差异：战斗 {{ preview.prompts.adjudication.differs ? '不同' : '相同' }}；人物 {{ preview.prompts.character.differs ? '不同' : '相同' }}；非战斗 {{ preview.prompts.daily.differs ? '不同' : '相同' }}</p>
      <button class="xy-back-btn" :disabled="saving || preparing || !!preview?.error" @click="migrateSelected">迁入酒馆配置</button>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import Icons from './Icons.vue';
import CoreRulesSettings from './CoreRulesSettings.vue';
import { DAILY_ADJUDICATION_PROMPT, DAILY_MODULE_PROMPTS, DAILY_DOMAINS, normalizeDailyPrompts } from '../../event-daily-prompts.js';
import { domainContract } from '../../event-domain-contracts.js';
import { migrationEnvelope, migrationPreview } from '../../config-migration.js';
import { builtinPromptPolicy, exportConfig, createConfigEnvelope, runtimeConfig } from '../../config-schema.js';
import { DEFAULT_ADJUDICATION_PROMPT, DEFAULT_CHARACTER_COMPLETION_PROMPT } from '../../character-prompts.js';
import { downloadJson } from '../../utils.js';

const props = defineProps({
  settings: { type: Object, default: () => ({}) },
  controller: { type: Object, default: null },
  battleState: { type: Object, default: () => ({ phase: 'idle' }) },
  preparing: Boolean,
  events: { type: Object, default: null }
});

const emit = defineEmits(['save', 'back']);
const saving = ref(false), saveMessage = ref('未保存修改'), baseWriteId = ref(null);
const resetPolicies = reactive({});
const importedPatch = ref(null);
const migrationSources = computed(() => props.controller?.localConfigSources ?? []);
const selectedSource = ref(0);
const preview = computed(() => {
  const source = migrationSources.value[selectedSource.value];
  if (!source) return null;
  try { return migrationPreview(source, props.controller?.configEnvelope); } catch { return { error: true }; }
});
function reloadHost() {
  if (props.controller?.inFlight || props.controller?.configBusy?.()) { saveMessage.value = '事务处理中，不能重新加载'; return; }
  if (globalThis.confirm('重新加载页面会丢弃未保存修改，继续？')) globalThis.location.reload();
}
function exportBackup() { downloadJson('xybattle-config.json', JSON.stringify(exportConfig(props.controller.configEnvelope), null, 2)); }
async function verifySave() {
  try {
    const result = await props.controller.configStore.verifyPersisted(props.controller.configEnvelope.writeId);
    saveMessage.value = result.status === 'confirmed' ? '已确认服务器保存' : '服务器保存尚未确认，请保持页面并检查连接';
  } catch { saveMessage.value = '服务器核对失败，请检查连接'; }
}
async function importBackup(event) {
  try {
    const file = event.target.files?.[0]; if (!file) return;
    const data = JSON.parse(await file.text());
    if (data.schemaVersion !== 1) throw new Error();
    const envelope = createConfigEnvelope(data.settings, { previous: props.controller.configEnvelope, credentials: data.credentials ?? {}, promptPolicy: data.promptPolicy });
    loadForm(runtimeConfig(envelope));
    importedPatch.value = data.settings;
    Object.assign(resetPolicies, envelope.promptPolicy, envelope.promptPolicy.dailyModules);
    delete resetPolicies.dailyModules;
    saveMessage.value = '配置已导入草稿，检查后点击保存；未提供的密钥继续保留';
  } catch { saveMessage.value = '配置文件无效，未修改运行时'; }
  finally { event.target.value = ''; }
}
function resetPrompt(name) {
  const policy = builtinPromptPolicy();
  resetPolicies[name] = policy[name] ?? policy.dailyModules[name];
  if (name === 'adjudication') form.adjudicationPrompt = DEFAULT_ADJUDICATION_PROMPT;
  else if (name === 'character') form.characterCompletionPrompt = DEFAULT_CHARACTER_COMPLETION_PROMPT;
  else if (name === 'dailyCommon') form.dailyPrompts.common = DAILY_ADJUDICATION_PROMPT;
  else form.dailyPrompts.modules[name] = DAILY_MODULE_PROMPTS[name];
}
function submitDraft(settings, options = {}) {
  if (saving.value) return;
  saving.value = true; saveMessage.value = '正在提交配置';
  emit('save', settings, { baseWriteId: baseWriteId.value, ...options }, (error, result) => {
    if (error) { saving.value = false; saveMessage.value = /conflict/.test(error.message) ? '配置冲突，草稿保留' : '保存失败或结果未确认，草稿保留'; return; }
    loadForm(props.controller.settings);
    saving.value = false;
    baseWriteId.value = props.controller?.configEnvelope?.writeId ?? null;
    saveMessage.value = result?.status === 'confirmed' ? '已确认服务器保存' : '已提交，服务器保存待确认';
    if (result?.entryError) saveMessage.value += '；入口启用失败';
  });
}
function migrateSelected() {
  const source = migrationSources.value[selectedSource.value];
  if (!source || source.error) return;
  const envelope = migrationEnvelope(source, { previous: props.controller.configEnvelope });
  submitDraft(source.settings, { credentials: source.credentials, promptPolicy: envelope.promptPolicy, migration: envelope.migration });
}

const showJudgeKey = ref(false);
const showNarratorKey = ref(false);
const showCharacterKey = ref(false);
const showDailyKey = ref(false);
const dailyApi = computed(() => form.dailyAdjudicator.inherit ? form.judge : form.dailyAdjudicator);
function changeDailyInheritance() {
  if (!form.dailyAdjudicator.inherit && !form.dailyAdjudicator.endpoint && !form.dailyAdjudicator.model) {
    Object.assign(form.dailyAdjudicator, form.judge, { inherit: false, mode: 'http', repairAttempts: 0 });
  }
}
const characterApi = computed(() => form.characterGenerator.inherit ? form.judge : form.characterGenerator);
function changeCharacterInheritance() {
  if (!form.characterGenerator.inherit && !form.characterGenerator.endpoint && !form.characterGenerator.model) {
    Object.assign(form.characterGenerator, form.judge, { inherit: false, mode: 'http' });
  }
}

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
  characterGenerator: { inherit: true, mode: 'http', endpoint: '', model: '', apiKey: '', temperature: 0.2, timeoutMs: 60000 },
  dailyAdjudicator: { inherit: true, mode: 'http', endpoint: '', model: '', apiKey: '', temperature: 0.2, maxOutput: 1600, timeoutMs: 60000 },
  dailyTotalTimeoutMs: 240000,
  dailyPrompts: normalizeDailyPrompts(),
  autoNarrative: true,
  eventAutoEnabled: false,
  battleStateListenerEnabled: false,
  originalPrompt: '',
  characterCompletionPrompt: '',
  characterMaxOutput: 8000,
  characterMaxRetries: 0,
  characterMessageCount: 20,
  adjudicationPrompt: ''
});

function loadForm(s) {
  if (!s) return;
  baseWriteId.value = props.controller?.configEnvelope?.writeId ?? null;
  if (s.adjudicator) Object.assign(form.judge, s.adjudicator);
  if (s.narrator) Object.assign(form.narrator, s.narrator);
  Object.assign(form.characterGenerator, s.characterGenerator || { inherit: true });
  Object.assign(form.dailyAdjudicator, s.dailyAdjudicator || { inherit: true });
  form.dailyTotalTimeoutMs = s.dailyTotalTimeoutMs ?? Math.max(form.judge.timeoutMs * 4, 120000);
  form.dailyPrompts = normalizeDailyPrompts(s.dailyPrompts);
  form.autoNarrative = !!s.autoNarrative;
  form.eventAutoEnabled = s.eventAutoEnabled === true;
  form.battleStateListenerEnabled = s.battleStateListenerEnabled === true;
  form.originalPrompt = s.originalPrompt || '';
  form.characterCompletionPrompt = s.characterCompletionPrompt || '';
  form.characterMaxOutput = s.characterMaxOutput || 8000;
  form.characterMaxRetries = s.characterMaxRetries ?? 0;
  form.characterMessageCount = s.characterMessageCount ?? 20;
  form.adjudicationPrompt = s.adjudicationPrompt || '';
}
watch(() => props.settings, (s, previous) => {
  if (previous) return;
  loadForm(s);
}, { immediate: true });
watch(form, () => { if (!saving.value) saveMessage.value = '有未保存修改'; }, { deep: true, flush: 'sync' });

function onSave() {
  const policy = { dailyModules: {} };
  for (const [name, entry] of Object.entries(resetPolicies)) {
    const value = name === 'adjudication' ? form.adjudicationPrompt : name === 'character' ? form.characterCompletionPrompt : name === 'dailyCommon' ? form.dailyPrompts.common : form.dailyPrompts.modules[name];
    const builtin = name === 'adjudication' ? DEFAULT_ADJUDICATION_PROMPT : name === 'character' ? DEFAULT_CHARACTER_COMPLETION_PROMPT : name === 'dailyCommon' ? DAILY_ADJUDICATION_PROMPT : DAILY_MODULE_PROMPTS[name];
    if (value !== builtin) continue;
    if (['adjudication', 'character', 'dailyCommon'].includes(name)) policy[name] = entry;
    else policy.dailyModules[name] = entry;
  }
  submitDraft({
    ...(importedPatch.value ?? {}),
    adjudicator: { ...form.judge },
    narrator: { ...form.narrator },
    characterGenerator: { ...form.characterGenerator },
    dailyAdjudicator: { ...form.dailyAdjudicator },
    dailyTotalTimeoutMs: form.dailyTotalTimeoutMs,
    dailyPrompts: { common: form.dailyPrompts.common, modules: { ...form.dailyPrompts.modules } },
    autoNarrative: form.autoNarrative,
    eventAutoEnabled: form.eventAutoEnabled,
    battleStateListenerEnabled: form.battleStateListenerEnabled,
    originalPrompt: form.originalPrompt,
    characterCompletionPrompt: form.characterCompletionPrompt,
    characterMaxOutput: form.characterMaxOutput,
    characterMaxRetries: form.characterMaxRetries,
    characterMessageCount: form.characterMessageCount,
    adjudicationPrompt: form.adjudicationPrompt
  }, { promptPolicy: policy });
}
</script>

<style scoped>
.xy-settings-panel {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
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
  min-width: 0;
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
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 12px;
}

.xy-col-span-2 {
  grid-column: span 2;
}

.xy-form-field {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.xy-field-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 11px;
  color: var(--xy-text-muted);
  font-family: var(--xy-font-sans);
}

.xy-field-hint {
  font-size: 9px;
  color: var(--xy-gold-400);
}

.xy-input-text, .xy-input-select, .xy-input-textarea {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  margin: 0;
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
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  accent-color: var(--xy-cyan-500);
}

.xy-mt-3 {
  margin-top: 12px;
}

.xy-settings-footer {
  display: flex;
  flex-wrap: wrap;
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
.xy-input-textarea { resize: vertical; line-height: 1.6; }
.xy-input-text:disabled { opacity: .65; cursor: not-allowed; }
@media (max-width: 1000px) {
  .xy-form-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 600px) {
  .xy-settings-panel { padding: 16px 12px 24px; }
  .xy-config-card { padding: 14px 12px; }
  .xy-form-grid { grid-template-columns: minmax(0, 1fr); }
  .xy-col-span-2 { grid-column: auto; }
}
</style>
