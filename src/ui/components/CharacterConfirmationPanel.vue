<template>
  <section class="xy-character-confirmation" data-testid="character-confirmation-panel" aria-labelledby="character-confirmation-title">
    <header class="xy-character-confirmation__header">
      <div>
        <span class="xy-character-confirmation__eyebrow">BATTLE PREPARATION</span>
        <h3 id="character-confirmation-title">战前敌方人物确认</h3>
        <p class="xy-character-confirmation__hint">
          资料只会在确认后写入战斗状态，并进入裁定器上下文。
        </p>
      </div>
      <span class="xy-character-confirmation__state" :data-status="preparation?.status || 'idle'">
        {{ statusLabel }}
      </span>
    </header>

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
            <span class="xy-character-candidate__id">{{ candidate.id }}</span>
            <h4>{{ candidate.name || candidate.id }}</h4>
          </div>
          <button
            type="button"
            class="xy-character-candidate__remove"
            :disabled="busy || preparation.status === 'confirmed'"
            :data-action="removedIds.has(candidate.id) ? 'restore' : 'remove'"
            @click="toggleRemoved(candidate.id)"
          >
            {{ removedIds.has(candidate.id) ? '恢复候选' : '删除候选' }}
          </button>
        </header>

        <label class="xy-character-candidate__json">
          <span>候选资料 JSON（可编辑）</span>
          <textarea
            :value="drafts[candidate.id]"
            rows="6"
            :disabled="busy || preparation.status === 'confirmed' || removedIds.has(candidate.id)"
            :data-candidate-json="candidate.id"
            @input="updateDraft(candidate.id, $event.target.value)"
          ></textarea>
        </label>
        <label class="xy-character-candidate__ack">
          <input type="checkbox" :checked="confirmedIds.has(candidate.id)" :disabled="busy || preparation.status === 'confirmed' || removedIds.has(candidate.id)" @change="toggleConfirmed(candidate.id, $event.target.checked)" />
          <span>我已逐项核对并确定此人物的全部字段、功法、招式与隐藏信息</span>
        </label>
        <p v-if="draftErrors[candidate.id]" class="xy-character-candidate__error" role="alert">
          {{ draftErrors[candidate.id] }}
        </p>

        <div class="xy-character-candidate__fields" aria-label="字段来源与冲突">
          <div v-for="field in fieldRows(candidate)" :key="field.path" class="xy-character-field" :data-field-path="field.path">
            <span class="xy-character-field__path">{{ field.path }}</span>
            <code class="xy-character-field__value">{{ displayValue(field.value) }}</code>
            <span class="xy-character-field__source">来源：{{ sourceLabel(field.source) }}</span>
          </div>
          <div v-for="conflict in candidate.conflicts || []" :key="`${candidate.id}:${conflict.path}`" class="xy-character-conflict" :data-conflict-path="conflict.path">
            <b>资料冲突 · {{ conflict.path }}</b>
            <span>当前草稿值：<code>{{ displayValue(conflict.draftValue ?? conflict.keptValue) }}</code></span>
            <span>全部候选来源（无自动优先级，请在上方 JSON 中手动决定）：</span>
            <span v-for="item in conflict.values || legacyConflictValues(conflict)" :key="`${item.source}:${displayValue(item.value)}`"><code>{{ sourceLabel(item.source) }}：{{ displayValue(item.value) }}</code></span>
          </div>
        </div>
      </article>

      <footer class="xy-character-confirmation__actions">
        <button type="button" data-action="cancel" :disabled="busy" @click="$emit('cancel')">取消</button>
        <button type="button" data-action="retry" :disabled="busy" @click="$emit('retry')">重新读取</button>
        <button
          type="button"
          class="is-primary"
          data-action="confirm"
          :disabled="confirmDisabled"
          @click="confirm"
        >
          {{ preparation.status === 'confirmed' ? '已确认' : '确认人物资料' }}
        </button>
      </footer>
      <p v-if="preparation.status !== 'confirmed'" class="xy-character-confirmation__notice">
        未点击“确认人物资料”的候选不会进入战斗裁定。
      </p>
    </template>
  </section>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';

const props = defineProps({
  preparation: { type: Object, default: null },
  busy: { type: Boolean, default: false }
});

const emit = defineEmits(['prepare', 'retry', 'confirm', 'cancel']);

const drafts = reactive({});
const draftErrors = reactive({});
const removedIds = reactive(new Set());
const confirmedIds = reactive(new Set());

const sourceNames = {
  mvu_dynamic: 'MVU 动态值',
  database: '数据库资料',
  context_explicit: '上下文明确事实',
  ai_extracted: 'AI 提取',
  ai_inferred: 'AI 推断',
  ai_completed: 'AI 构造草稿',
  user_confirmed: '用户确认'
};

function resetDrafts(preparation) {
  for (const key of Object.keys(drafts)) delete drafts[key];
  for (const key of Object.keys(draftErrors)) delete draftErrors[key];
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
  return props.preparation.status || '未知';
});

function sourceLabel(source) {
  return sourceNames[source] || source || '来源未知';
}

function displayValue(value) {
  if (value === undefined) return '未提供';
  if (typeof value === 'string') return value;
  try { return JSON.stringify(value); } catch { return String(value); }
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

function fieldRows(candidate) {
  const provenance = candidate.provenance || {};
  const rows = [];
  const visit = (value, path) => {
    if (value && typeof value === 'object' && Object.keys(value).length) {
      for (const [key, child] of Object.entries(value)) visit(child, path ? `${path}.${key}` : key);
    } else if (path) rows.push({ path, value, source: provenance[path]?.source || 'unknown' });
  };
  visit(candidate.fields || {}, '');
  return rows;
}

function updateDraft(id, value) {
  drafts[id] = value;
  delete draftErrors[id];
}

function toggleRemoved(id) {
  if (removedIds.has(id)) removedIds.delete(id); else removedIds.add(id);
  confirmedIds.delete(id);
}

function toggleConfirmed(id, value) {
  if (value) confirmedIds.add(id); else confirmedIds.delete(id);
}

const confirmDisabled = computed(() => {
  const preparation = props.preparation;
  return props.busy || !preparation || preparation.status !== 'awaiting_confirmation' || !preparation.candidates?.length || [...removedIds].length >= preparation.candidates.length || preparation.candidates.some((candidate) => !removedIds.has(candidate.id) && !confirmedIds.has(candidate.id));
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
.xy-character-confirmation { display: flex; flex-direction: column; gap: 14px; padding: 20px; color: var(--xy-text-body, #e5eef8); background: rgba(7, 16, 30, .96); border: 1px solid rgba(56, 189, 248, .28); border-radius: 14px; }
.xy-character-confirmation__header, .xy-character-candidate__header, .xy-character-confirmation__actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.xy-character-confirmation__eyebrow, .xy-character-candidate__id { color: #7dd3fc; font: 11px/1.2 var(--xy-font-mono, monospace); letter-spacing: .08em; }
.xy-character-confirmation h3, .xy-character-candidate h4 { margin: 3px 0; }
.xy-character-confirmation__hint, .xy-character-confirmation__notice, .xy-character-confirmation__empty p { margin: 0; color: #a9b8c9; font-size: 12px; }
.xy-character-confirmation__state, .xy-source-status { padding: 4px 8px; border: 1px solid rgba(255,255,255,.18); border-radius: 999px; font-size: 11px; white-space: nowrap; }
.xy-character-confirmation__busy { padding: 9px 12px; color: #fde68a; background: rgba(251,191,36,.12); border: 1px solid rgba(251,191,36,.3); border-radius: 8px; }
.xy-character-confirmation__sources { display: flex; flex-wrap: wrap; gap: 8px; }
.xy-source-status.is-ok { color: #99f6e4; border-color: rgba(45,212,191,.35); }
.xy-source-status.is-missing, .xy-source-status.is-unknown { color: #cbd5e1; }
.xy-source-status.is-error { color: #fda4af; border-color: rgba(244,63,94,.38); }
.xy-character-candidate { display: flex; flex-direction: column; gap: 10px; padding: 14px; border: 1px solid rgba(148,163,184,.24); border-radius: 10px; background: rgba(15, 30, 52, .66); }
.xy-character-candidate.is-removed { opacity: .55; }
.xy-character-candidate__remove, .xy-character-confirmation button { padding: 7px 11px; color: inherit; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.2); border-radius: 7px; cursor: pointer; }
.xy-character-confirmation button.is-primary { color: #07101e; background: #7dd3fc; border-color: #7dd3fc; }
.xy-character-confirmation button:disabled { opacity: .45; cursor: not-allowed; }
.xy-character-candidate__json { display: flex; flex-direction: column; gap: 6px; color: #cbd5e1; font-size: 12px; }
.xy-character-candidate__json textarea { width: 100%; min-height: 100px; color: #e2e8f0; background: rgba(2, 6, 23, .75); border: 1px solid rgba(148,163,184,.3); border-radius: 7px; padding: 9px; font: 12px/1.5 var(--xy-font-mono, monospace); box-sizing: border-box; resize: vertical; }
.xy-character-candidate__ack { display: flex; gap: 8px; align-items: center; color: #bae6fd; font-size: 12px; }
.xy-character-candidate__error { margin: 0; color: #fda4af; font-size: 12px; }
.xy-character-candidate__fields { display: grid; gap: 7px; }
.xy-character-field, .xy-character-conflict { display: grid; grid-template-columns: minmax(100px, .7fr) minmax(120px, 1.2fr) minmax(140px, 1fr); gap: 8px; align-items: baseline; padding: 7px 8px; background: rgba(2,6,23,.35); border-radius: 6px; font-size: 11px; }
.xy-character-field__path { color: #bae6fd; }
.xy-character-field__value, .xy-character-conflict code { color: #f8fafc; overflow-wrap: anywhere; white-space: pre-wrap; }
.xy-character-field__source { color: #94a3b8; }
.xy-character-conflict { grid-template-columns: 1fr; border-left: 2px solid #fbbf24; color: #fde68a; }
.xy-character-conflict span { color: #cbd5e1; }
.xy-character-confirmation__actions { justify-content: flex-end; }
@media (max-width: 720px) { .xy-character-field { grid-template-columns: 1fr; } .xy-character-confirmation__header { align-items: flex-start; flex-direction: column; } }
</style>
