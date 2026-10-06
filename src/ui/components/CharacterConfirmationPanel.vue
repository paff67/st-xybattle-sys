<template>
  <section class="xy-character-confirmation" data-testid="character-confirmation-panel" aria-labelledby="character-confirmation-title">
    <header class="xy-character-confirmation__header">
      <div>
        <span class="xy-character-confirmation__eyebrow">战前准备 · 核对人物</span>
        <h3 id="character-confirmation-title">战前人物档案确认</h3>
        <p class="xy-character-confirmation__hint">
          逐名核对并勾选资料，然后点击“确认并开始战斗”。资料可以直接修改，修改后需要重新勾选。
        </p>
      </div>
      <div class="xy-character-confirmation__header-actions">
        <span class="xy-character-confirmation__state" :data-status="preparation?.status || 'idle'">
          {{ statusLabel }}
        </span>
      </div>
    </header>

    <div class="xy-character-confirmation__body xy-custom-scroll" tabindex="0" aria-label="候选人物资料，可上下滚动">
      <div v-if="busy" class="xy-character-confirmation__busy" role="status" aria-live="polite">
        正在读取人物资料；确认操作暂不可用。
      </div>

      <div v-if="!preparation" class="xy-character-confirmation__empty">
        <p>尚未生成候选人物。先从当前上下文、MVU 和人物资料库读取候选。</p>
        <button type="button" data-action="prepare" :disabled="busy" @click="$emit('prepare')">读取候选人物</button>
      </div>

      <template v-else>
        <div class="xy-character-confirmation__sources" aria-label="资料来源状态">
          <span
            v-for="item in sourceStatuses"
            :key="item.key"
            class="xy-source-status"
            :class="`is-${item.tone}`"
            :data-source-status="item.key"
          >
            <b>{{ item.label }}</b>：{{ item.text }}
          </span>
        </div>

        <div v-if="preparation.candidates?.length" class="xy-character-confirmation__progress" role="status" aria-live="polite">
          <span class="xy-character-confirmation__progress-count">已核对 {{ confirmedCount }} / {{ activeCount }} 名人物</span>
          <span class="xy-character-confirmation__progress-hint">{{ confirmationHint }}</span>
        </div>

        <div v-if="!preparation.candidates?.length" class="xy-character-confirmation__empty">
          <p>没有可审核的敌方人物候选。</p>
        </div>

        <article
          v-for="candidate in preparation.candidates"
          :key="candidate.id"
          class="xy-character-candidate"
          :class="{ 'is-removed': removedIds.has(candidate.id) }"
          :data-candidate-id="candidate.id"
        >
          <header class="xy-character-candidate__header">
            <div>
              <span class="xy-character-candidate__id">{{ candidate.role === 'player' ? '主角资料' : '敌方资料' }}</span>
              <h4>{{ parsedFields(candidate).name || (candidate.role === 'player' ? '主角资料待补全' : '敌方资料待补全') }}</h4>
            </div>
            <button
              type="button"
              v-if="candidate.role !== 'player'"
              class="xy-character-candidate__remove"
              :disabled="busy || preparation.status === 'confirmed'"
              :data-action="removedIds.has(candidate.id) ? 'restore' : 'remove'"
              @click="toggleRemoved(candidate.id)"
            >
              {{ removedIds.has(candidate.id) ? '恢复候选' : '删除候选' }}
            </button>
          </header>

          <label class="xy-character-candidate__ack">
            <input type="checkbox" :checked="confirmedIds.has(candidate.id)" :disabled="busy || preparation.status === 'confirmed' || removedIds.has(candidate.id) || !!draftErrors[candidate.id] || Object.keys(fieldErrors[candidate.id] || {}).length > 0" @change="toggleConfirmed(candidate.id, $event.target.checked)" />
            <span>我已核对并接受此人物资料</span>
          </label>
          <p v-if="draftErrors[candidate.id]" class="xy-character-candidate__error" role="alert">
            {{ draftErrors[candidate.id] }}
          </p>

          <div v-if="profileIssues[candidate.id]?.length" class="xy-character-candidate__error" role="alert">
            <strong>资料尚未完整，补齐后才能开始战斗</strong>
            <ul><li v-for="issue in profileIssues[candidate.id]" :key="issue">{{ issue }}</li></ul>
          </div>
          <div v-if="!removedIds.has(candidate.id)" class="xy-character-candidate__sections" aria-label="人物资料">
            <details v-for="section in sectionsById[candidate.id]" :key="section.id" class="xy-character-section" :data-section="section.id">
              <summary>{{ section.label }}</summary>
              <CharacterFieldTree :nodes="section.children" :disabled="editingDisabled(candidate)" :errors="fieldErrors[candidate.id] || {}" @edit="updateField(candidate, $event.field, $event.input)" @add="addFieldItem(candidate, $event)" />
            </details>
          </div>

          <details v-if="!removedIds.has(candidate.id)" class="xy-character-candidate__raw">
            <summary>高级编辑：查看或修改原始人物资料 JSON</summary>
            <p>普通用户无需编辑这里；修改后请重新核对上方字段并勾选确认。</p>
            <textarea
              :value="drafts[candidate.id]"
              rows="10"
              :aria-label="`${candidate.name}的原始人物资料`"
              spellcheck="false"
              :disabled="busy || preparation.status === 'confirmed' || removedIds.has(candidate.id)"
              :data-candidate-json="candidate.id"
              @input="updateDraft(candidate.id, $event.target.value)"
            ></textarea>
          </details>

          <details v-if="candidate.conflicts?.length" class="xy-character-conflicts" aria-label="资料冲突">
            <summary>查看原始来源分歧</summary>
            <p>各来源没有自动优先级。请核对当前草稿，必要时修改上方资料。</p>
            <div v-for="conflict in candidate.conflicts || []" :key="`${candidate.id}:${conflict.path}`" class="xy-character-conflict" :data-conflict-path="conflict.path">
              <b>{{ friendlyPath(conflict.path) }}</b>
              <span>当前采用：<code>{{ displayValue(conflictValue(candidate, conflict.path)) }}</code></span>
              <span v-for="item in conflict.values || legacyConflictValues(conflict)" :key="`${item.source}:${displayValue(item.value)}`"><code>{{ sourceLabel(item.source) }}：{{ displayValue(item.value) }}</code></span>
            </div>
          </details>
        </article>

      </template>
    </div>
    <footer class="xy-character-confirmation__actions">
      <div class="xy-character-confirmation__notice" role="status" aria-live="polite">
        <strong>已核对 {{ confirmedCount }} / {{ activeCount }} 名人物</strong>
        <span>{{ confirmationHint }}</span>
      </div>
      <div class="xy-character-confirmation__buttons">
        <button type="button" data-action="cancel" :disabled="busy" @click="$emit('cancel')">取消</button>
        <button type="button" data-action="retry" :disabled="busy" @click="$emit('retry')">重新读取</button>
        <button type="button" class="is-primary xy-character-confirmation__confirm-button" data-action="confirm" :disabled="confirmDisabled" @click="confirm">{{ confirmLabel }}</button>
      </div>
    </footer>
  </section>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';
import CharacterFieldTree from './CharacterFieldTree.vue';
import { combatProfileIssues, normalizeCombatProfile } from '../../combat-profile.js';
import { characterTree, characterPathLabel as friendlyPath, characterValueLabel as displayValue, editCharacterField } from '../../character-presentation.js';

const props = defineProps({
  preparation: { type: Object, default: null },
  busy: { type: Boolean, default: false }
});

const emit = defineEmits(['prepare', 'retry', 'confirm', 'cancel']);

const drafts = reactive({});
const draftErrors = reactive({});
const fieldErrors = reactive({});
const removedIds = reactive(new Set());
const confirmedIds = reactive(new Set());

const sourceNames = {
  mvu_dynamic: 'MVU 动态值',
  database: '数据库资料',
  context_explicit: '上下文明确事实',
  ai_extracted: 'AI 提取',
  ai_inferred: 'AI 推断',
  ai_completed: 'AI 构造草稿',
  user_confirmed: '用户确认',
  user_edited: '用户修改，待确认',
  unknown: '来源未标注'
};

function resetDrafts(preparation) {
  for (const key of Object.keys(drafts)) delete drafts[key];
  for (const key of Object.keys(draftErrors)) delete draftErrors[key];
  for (const key of Object.keys(fieldErrors)) delete fieldErrors[key];
  removedIds.clear();
  confirmedIds.clear();
  for (const candidate of preparation?.candidates || []) drafts[candidate.id] = JSON.stringify(candidate.fields || {}, null, 2);
}

watch(() => props.preparation, resetDrafts, { immediate: true });

const statusLabel = computed(() => {
  if (!props.preparation) return '待读取';
  if (props.busy || props.preparation.status === 'loading') return '读取中';
  if (props.preparation.status === 'confirmed') return '已确认';
  if (props.preparation.status === 'awaiting_confirmation') return '待确认';
  return '等待处理';
});

function sourceLabel(source) {
  return sourceNames[source] || '来源未标注';
}

function parsedFields(candidate) {
  try {
    const value = JSON.parse(drafts[candidate.id] || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : candidate.fields || {};
  } catch {
    return candidate.fields || {};
  }
}

const sectionsById = computed(() => Object.fromEntries((props.preparation?.candidates || []).map((candidate) => [
  candidate.id, characterTree(parsedFields(candidate), candidate.provenance, candidate.fields)
])));

const profileIssues = computed(() => Object.fromEntries((props.preparation?.candidates || []).map((candidate) => [candidate.id,
  props.preparation.requiresCompleteProfiles ? combatProfileIssues(normalizeCombatProfile(parsedFields(candidate), { id: candidate.id, side: candidate.role || 'enemy' })) : []
])));

function addFieldItem(candidate, node) {
  const fields = parsedFields(candidate);
  const target = node.keys.reduce((value, key) => value[key], fields);
  if (!Array.isArray(target)) return;
  const template = normalizeCombatProfile({ techniques: [{}], martialArts: [{}], resourceDefinitions: [{ current: 0, min: 0, max: 0 }] });
  const item = template[node.keys.at(-1)]?.[0] || '';
  if (node.keys.at(-1) === 'resourceDefinitions') {
    let index = target.length + 1;
    while (target.some((resource) => resource.key === `resource-${index}`)) index += 1;
    item.key = `resource-${index}`;
  }
  target.push(item);
  updateDraft(candidate.id, JSON.stringify(fields, null, 2));
}

function conflictValue(candidate, path) {
  return path.split('.').reduce((value, key) => value?.[key], parsedFields(candidate));
}

function editingDisabled(candidate) {
  return props.busy || props.preparation?.status !== 'awaiting_confirmation' || removedIds.has(candidate.id) || !!draftErrors[candidate.id];
}

function updateField(candidate, field, input) {
  if (editingDisabled(candidate)) return;
  confirmedIds.delete(candidate.id);
  fieldErrors[candidate.id] ||= {};
  try {
    drafts[candidate.id] = JSON.stringify(editCharacterField(parsedFields(candidate), field.keys, input), null, 2);
    delete fieldErrors[candidate.id][field.path];
  } catch (error) {
    fieldErrors[candidate.id][field.path] = error.message;
  }
}

function legacyConflictValues(conflict) {
  return [
    { source: conflict.ignored, value: conflict.ignoredValue },
    { source: conflict.kept, value: conflict.keptValue }
  ].filter((item) => item.source);
}

function sourceStatusText(item) {
  const status = item?.status;
  if (status === 'available' || status === 'ok' || status === 'success' || status === 'matched') return { text: '已读取', tone: 'ok' };
  if (status === 'missing' || status === 'not_found') return { text: '未找到', tone: 'missing' };
  if (status === 'failed' || status === 'error' || status === 'read_failed') return { text: `读取失败${item.error ? `：${item.error}` : ''}`, tone: 'error' };
  if (status === 'not_configured') return { text: '未配置', tone: 'unknown' };
  if (status === 'not_requested') return { text: '未请求', tone: 'unknown' };
  return { text: '状态未知', tone: 'unknown' };
}

const sourceStatuses = computed(() => {
  const candidates = props.preparation?.candidates || [];
  const aggregate = (key) => candidates.find((item) => item.sourceStatus?.[key]?.status === 'read_failed')?.sourceStatus[key]
    || candidates.find((item) => item.sourceStatus?.[key]?.status === 'matched')?.sourceStatus[key]
    || candidates[0]?.sourceStatus?.[key];
  const scope = props.preparation?.scope;
  const branch = scope?.branchId ? { status: 'available' } : { status: 'unknown' };
  const rows = [
    ['branch', '分支作用域', branch],
    ['mvu_dynamic', 'MVU 动态值', aggregate('mvu_dynamic')],
    ['database', '数据库资料', aggregate('database')],
    ['ai_extract', 'AI 提取', aggregate('ai_extract')],
    ['ai_complete', 'AI 构造', aggregate('ai_complete')],
    ['ai_fill', 'AI 补全', aggregate('ai_fill')]
  ];
  return rows.map(([key, label, item]) => {
    const result = sourceStatusText(item);
    if (key === 'branch' && !scope?.branchId) return { key, label, text: '未知（未绑定聊天分支）', tone: 'unknown' };
    return { key, label, ...result };
  });
});

function updateDraft(id, value) {
  drafts[id] = value;
  confirmedIds.delete(id);
  fieldErrors[id] = {};
  try {
    const fields = JSON.parse(value);
    if (!fields || typeof fields !== 'object' || Array.isArray(fields)) throw new Error('资料必须是对象');
    delete draftErrors[id];
  } catch {
    draftErrors[id] = '原始资料格式有误。请在高级编辑区修正；上方暂显示读取时的资料。';
  }
}

function toggleRemoved(id) {
  if (removedIds.has(id)) removedIds.delete(id); else removedIds.add(id);
  confirmedIds.delete(id);
}

function toggleConfirmed(id, value) {
  if (value && !draftErrors[id] && !Object.keys(fieldErrors[id] || {}).length) confirmedIds.add(id); else confirmedIds.delete(id);
}

const hasErrors = computed(() => (props.preparation?.candidates || []).some((candidate) => !removedIds.has(candidate.id) && (draftErrors[candidate.id] || Object.keys(fieldErrors[candidate.id] || {}).length || profileIssues.value[candidate.id]?.length)));

const confirmDisabled = computed(() => {
  const preparation = props.preparation;
  return hasErrors.value || props.busy || !preparation || preparation.status !== 'awaiting_confirmation' || !preparation.candidates?.length || [...removedIds].length >= preparation.candidates.length || !preparation.candidates.some((candidate) => candidate.role !== 'player' && !removedIds.has(candidate.id)) || preparation.candidates.some((candidate) => !removedIds.has(candidate.id) && !confirmedIds.has(candidate.id));
});

const activeCount = computed(() => (props.preparation?.candidates || []).filter((candidate) => !removedIds.has(candidate.id)).length);
const confirmedCount = computed(() => [...confirmedIds].filter((id) => !removedIds.has(id)).length);
const confirmLabel = computed(() => props.preparation?.status === 'confirmed' ? '已确认' : '确认并开始战斗');
const confirmationHint = computed(() => {
  if (props.preparation?.status === 'confirmed') return '人物资料已确认，可以进入战斗。';
  if (props.busy) return '正在读取资料，请稍候。';
  if (hasErrors.value) return '请补齐缺失的战斗设定，并修正资料错误后重新勾选。';
  if (!(props.preparation?.candidates || []).some((candidate) => candidate.role !== 'player' && !removedIds.has(candidate.id))) return '至少保留一名敌方人物。';
  if (confirmedCount.value < activeCount.value) return `请逐名勾选并核对人物资料，还差 ${activeCount.value - confirmedCount.value} 名。`;
  return '所有保留人物都已核对，可以确认并开始战斗。';
});

function confirm() {
  if (confirmDisabled.value) return;
  const edits = {};
  let invalid = false;
  for (const candidate of props.preparation.candidates || []) {
    if (removedIds.has(candidate.id)) continue;
    try {
      edits[candidate.id] = JSON.parse(drafts[candidate.id]);
      if (!edits[candidate.id] || typeof edits[candidate.id] !== 'object' || Array.isArray(edits[candidate.id])) throw new Error('必须是 JSON 对象');
    } catch (error) {
      draftErrors[candidate.id] = `JSON 无效：${error.message}`;
      invalid = true;
    }
  }
  if (invalid) return;
  emit('confirm', { edits, removeIds: [...removedIds] });
}
</script>

<style scoped>
.xy-character-confirmation { display: flex; flex-direction: column; gap: 0; flex: 1 1 0; min-height: 0; min-width: 0; overflow: hidden; box-sizing: border-box; padding: 0; color: var(--xy-text-body, #e5eef8); background: rgba(7, 16, 30, .96); border: 1px solid rgba(56, 189, 248, .28); border-radius: 14px; }
.xy-character-confirmation__header, .xy-character-candidate__header, .xy-character-confirmation__actions { display: flex; align-items: center; justify-content: space-between; gap: 14px; }
.xy-character-confirmation__header { flex: none; padding: 16px 24px; background: #091525; border-bottom: 1px solid rgba(56,189,248,.15); }
.xy-character-confirmation__body { flex: 1 1 0; min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable; padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
.xy-character-confirmation__body > * { flex-shrink: 0; }
.xy-character-confirmation__header-actions { display: flex; align-items: center; justify-content: flex-end; gap: 10px; flex-wrap: wrap; }
.xy-character-confirmation__eyebrow, .xy-character-candidate__id { color: #7dd3fc; font: 11px/1.2 var(--xy-font-mono, monospace); letter-spacing: .08em; }
.xy-character-confirmation h3, .xy-character-candidate h4 { margin: 4px 0; color: #f8fafc; }
.xy-character-confirmation h3 { font-size: 20px; }
.xy-character-confirmation__hint, .xy-character-confirmation__notice, .xy-character-confirmation__empty p { margin: 0; color: #a9b8c9; font-size: 12px; line-height: 1.6; }
.xy-character-confirmation__state, .xy-source-status { padding: 5px 9px; border: 1px solid rgba(255,255,255,.18); border-radius: 999px; font-size: 12px; white-space: normal; overflow-wrap: anywhere; }
.xy-character-confirmation__busy { padding: 10px 12px; color: #fde68a; background: rgba(251,191,36,.12); border: 1px solid rgba(251,191,36,.3); border-radius: 8px; }
.xy-character-confirmation__sources { display: flex; flex-wrap: wrap; gap: 8px; }
.xy-source-status.is-ok { color: #99f6e4; border-color: rgba(45,212,191,.35); }
.xy-source-status.is-missing, .xy-source-status.is-unknown { color: #cbd5e1; }
.xy-source-status.is-error { color: #fda4af; border-color: rgba(244,63,94,.38); }
.xy-character-confirmation__progress { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 10px 12px; border: 1px solid rgba(56,189,248,.22); border-radius: 9px; background: rgba(14,165,233,.08); }
.xy-character-confirmation__progress-count { color: #e0f2fe; font-weight: 600; }
.xy-character-confirmation__progress-hint { color: #a9b8c9; font-size: 12px; }
.xy-character-candidate { display: flex; flex-direction: column; gap: 12px; padding: 16px; border: 1px solid rgba(148,163,184,.24); border-radius: 11px; background: rgba(15, 30, 52, .72); }
.xy-character-candidate.is-removed { opacity: .55; }
.xy-character-candidate__header { align-items: flex-start; }
.xy-character-candidate__remove, .xy-character-confirmation button { padding: 8px 12px; color: inherit; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.2); border-radius: 7px; cursor: pointer; }
.xy-character-confirmation button.is-primary { color: #07101e; background: linear-gradient(135deg, #bae6fd, #38bdf8); border-color: #7dd3fc; font-weight: 700; box-shadow: 0 4px 18px rgba(56,189,248,.24); }
.xy-character-confirmation button.is-primary:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
.xy-character-confirmation button:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; }
.xy-character-candidate__ack { display: flex; gap: 9px; align-items: center; padding: 9px 10px; color: #bae6fd; font-size: 12px; border: 1px solid rgba(56,189,248,.2); border-radius: 7px; background: rgba(56,189,248,.07); }
.xy-character-candidate__ack input { width: 16px; height: 16px; accent-color: #38bdf8; }
.xy-character-candidate__error { margin: 0; color: #fda4af; font-size: 12px; }
.xy-character-candidate__sections { display: grid; gap: 12px; }
.xy-character-section { padding: 11px; border: 1px solid rgba(148,163,184,.16); border-radius: 8px; background: rgba(2,6,23,.28); }
.xy-character-section > summary { cursor: pointer; padding: 8px 0; color: #d4e4ef; font-size: 15px; }
.xy-character-section > .xy-character-tree { padding-top: 12px; }
.xy-character-section h5, .xy-character-conflicts h5 { margin: 0 0 9px; color: #bae6fd; font-size: 13px; font-weight: 650; }
.xy-character-section__rows { display: grid; gap: 6px; }
.xy-character-field { display: grid; grid-template-columns: minmax(130px, .7fr) minmax(0, 2fr) minmax(100px, .8fr); gap: 10px; align-items: start; padding: 12px 10px; background: rgba(2,6,23,.38); border-radius: 6px; font-size: 14px; }
.xy-character-field__label { display: grid; gap: 3px; color: #e0f2fe; }
.xy-character-field__label small { color: #a9b8c9; font-size: 11px; font-weight: 400; }
.xy-character-field__value { color: #f8fafc; overflow-wrap: anywhere; white-space: pre-wrap; line-height: 1.5; }
.xy-character-field__source { color: #94a3b8; font-size: 11px; }
.xy-character-candidate__empty-fields { margin: 0; color: #94a3b8; font-size: 12px; }
.xy-character-candidate__raw { border: 1px solid rgba(148,163,184,.2); border-radius: 8px; background: rgba(2,6,23,.3); }
.xy-character-candidate__raw summary { padding: 10px 12px; color: #bae6fd; cursor: pointer; font-size: 12px; user-select: none; }
.xy-character-candidate__raw p { margin: 0; padding: 0 12px 8px; color: #94a3b8; font-size: 11px; }
.xy-character-candidate__raw textarea { display: block; width: calc(100% - 24px); min-height: 180px; margin: 0 12px 12px; color: #e2e8f0; background: rgba(2, 6, 23, .75); border: 1px solid rgba(148,163,184,.3); border-radius: 7px; padding: 10px; font: 12px/1.5 var(--xy-font-mono, monospace); box-sizing: border-box; resize: vertical; }
.xy-character-conflicts { padding: 11px; border: 1px solid rgba(251,191,36,.35); border-radius: 8px; background: rgba(251,191,36,.06); }
.xy-character-conflict { display: grid; gap: 5px; padding: 8px 9px; border-bottom: 1px solid rgba(251,191,36,.2); color: #fde68a; font-size: 11px; }
.xy-character-conflict + .xy-character-conflict { margin-top: 7px; }
.xy-character-conflict span { color: #cbd5e1; }
.xy-character-conflict code { color: #f8fafc; overflow-wrap: anywhere; white-space: pre-wrap; }
.xy-character-confirmation__actions { flex: none; padding: 14px 24px; background: #091525; border-top: 1px solid rgba(56,189,248,.25); }
.xy-character-confirmation__buttons { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.xy-character-confirmation__notice { display: grid; gap: 4px; color: #b4c7d9; }
.xy-character-confirmation__notice strong { color: #e0f2fe; font-size: 14px; }
.xy-character-confirmation__confirm-button { min-width: 180px; }
.xy-character-confirmation button { min-height: 44px; font: inherit; }
.xy-character-confirmation :is(button, input, textarea, select, summary):focus-visible { outline: 2px solid #bae6fd; outline-offset: 3px; }
.xy-character-field__label, .xy-character-field__value { min-width: 0; overflow-wrap: anywhere; }
.xy-character-field__edit { margin-top: 6px; }
.xy-character-field__edit summary { color: #bae6fd; cursor: pointer; font-size: 12px; padding: 6px 0; }
.xy-character-field__edit label { display: grid; gap: 6px; }
.xy-character-field__edit :is(input, textarea, select) { width: 100%; min-width: 0; box-sizing: border-box; padding: 10px; color: #e2e8f0; background: #07101e; border: 1px solid #50627a; border-radius: 6px; font: inherit; line-height: 1.6; }
.xy-character-field__edit textarea { resize: vertical; }
.xy-character-conflicts p { color: #cbd5e1; font-size: 12px; }
@media (max-width: 900px) {
  .xy-character-field { grid-template-columns: minmax(115px,.8fr) minmax(0,2fr); }
  .xy-character-field__source { grid-column: 2; }
  .xy-character-confirmation__actions { align-items: stretch; flex-direction: column; gap: 8px; }
  .xy-character-confirmation__buttons { justify-content: flex-end; }
}
@media (max-width: 600px) {
  .xy-character-confirmation__header { padding: 10px 12px; gap: 8px; }
  .xy-character-confirmation__header h3 { font-size: 17px; }
  .xy-character-confirmation__eyebrow, .xy-character-confirmation__hint { display: none; }
  .xy-character-confirmation__body { padding: 12px; }
  .xy-character-candidate { padding: 12px; }
  .xy-character-field { grid-template-columns: minmax(0,1fr); }
  .xy-character-field__source { grid-column: auto; }
  .xy-character-confirmation__actions { padding: 10px 12px; }
  .xy-character-confirmation__buttons { display: grid; grid-template-columns: auto auto minmax(0,1fr); gap: 6px; }
  .xy-character-confirmation__confirm-button { min-width: 0; }
  .xy-character-confirmation button { font-size: 12px; padding: 8px; }
}
</style>
