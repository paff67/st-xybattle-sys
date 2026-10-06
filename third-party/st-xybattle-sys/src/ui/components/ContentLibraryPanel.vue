<template>
  <section class="xy-content-library xy-custom-scroll" aria-label="功法与法宝内容库">
    <header class="xy-library-header">
      <div>
        <span class="xy-panel-kicker">TECHNIQUE & TREASURE LIBRARY</span>
        <h2 class="xy-panel-title">功法与法宝 · 内容库</h2>
        <p class="xy-panel-desc">标准 JSON 先预览后写入浏览器内容库。编辑内容库不会改动已开始战斗的 registry snapshot。</p>
      </div>
      <div class="xy-library-actions">
        <button type="button" @click="refresh">刷新</button>
        <button type="button" @click="newDraft('technique')">新建功法模板</button>
        <button type="button" @click="newDraft('treasure')">新建法宝模板</button>
        <label class="xy-upload-button">上传 JSON<input type="file" accept="application/json,.json" @change="loadFile" /></label>
        <button type="button" :disabled="!selected" @click="exportSelected">导出选中</button>
        <button type="button" :disabled="!records.length" @click="exportAll">导出全部</button>
      </div>
    </header>

    <div v-if="notice" class="xy-library-notice" :class="{ error: noticeType === 'error' }">{{ notice }}</div>

    <div class="xy-library-grid">
      <aside class="xy-library-list" aria-label="内容列表">
        <div class="xy-library-toolbar">
          <input v-model="query" type="search" placeholder="搜索名称或 ID" />
          <select v-model="typeFilter">
            <option value="">全部</option>
            <option value="technique">功法</option>
            <option value="treasure">法宝</option>
          </select>
        </div>
        <button v-for="item in filteredRecords" :key="item.id" type="button" class="xy-library-item" :class="{ active: selectedId === item.id }" @click="select(item.id)">
          <strong>{{ item.name }}</strong>
          <small>{{ item.contentType === 'treasure' ? '法宝' : '功法' }} · {{ item.id }}</small>
        </button>
        <p v-if="!filteredRecords.length" class="xy-library-empty">内容库暂无匹配条目</p>
      </aside>

      <div class="xy-library-editor">
        <textarea v-model="jsonText" rows="18" spellcheck="false" placeholder="粘贴单条、数组或 xybattle-content-export-v1 JSON"></textarea>
        <div v-if="preview" class="xy-library-preview">
          <strong>导入预览</strong>
          <span>{{ preview.count }} 条 · {{ preview.ids.join('、') }}</span>
          <span v-if="preview.conflicts?.length" class="warning">已有同 ID：{{ preview.conflicts.map((item) => item.id).join('、') }}</span>
        </div>
        <div class="xy-library-buttons">
          <button type="button" @click="previewImport">预览校验</button>
          <button type="button" :disabled="!preview" @click="commitImport">新增导入</button>
          <button type="button" :disabled="!preview" @click="replaceImport">覆盖导入</button>
          <button type="button" :disabled="!selected" @click="saveEdit">保存编辑</button>
          <button type="button" :disabled="!selected" @click="copySelected">复制</button>
          <button type="button" class="danger" :disabled="!selected" @click="removeSelected">删除</button>
          <button type="button" :disabled="!selected" @click="applySelected">应用到本场</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { exportContentJson, importContent, previewContentImport } from '../../content-importer.js';

const props = defineProps({ store: { type: Object, required: true } });
const emit = defineEmits(['changed', 'error', 'export', 'apply']);
const records = ref([]);
const selectedId = ref('');
const jsonText = ref('');
const query = ref('');
const typeFilter = ref('');
const preview = ref(null);
const busy = ref(false);
const notice = ref('');
const noticeType = ref('');

const selected = computed(() => records.value.find((item) => item.id === selectedId.value));
const filteredRecords = computed(() => records.value.filter((item) => (!typeFilter.value || item.contentType === typeFilter.value) && (!query.value || `${item.name} ${item.id}`.toLowerCase().includes(query.value.toLowerCase()))));

function show(message, type = '') { notice.value = message; noticeType.value = type; }
function invalidatePreview() { preview.value = null; }
function newDraft(contentType) {
  const id = `${contentType === 'treasure' ? 'fabao' : 'gongfa'}.new-${Date.now().toString(36)}`;
  const isTreasure = contentType === 'treasure';
  jsonText.value = JSON.stringify({ id, name: isTreasure ? '未命名法宝' : '未命名功法', rank: '天阶', element: '水', corePrinciple: '', mechanics: [], techniques: [], synergies: [], narrativeGuidance: [], ruleRefs: ['user-authored.1'], version: '1.0.0', visibility: 'player' }, null, 2);
  selectedId.value = ''; invalidatePreview(); show('已生成空白模板，请补齐必填字段后预览校验');
}
async function loadFile(event) {
  const file = event.target.files?.[0]; event.target.value = '';
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { show('JSON 文件不能超过 5 MiB', 'error'); return; }
  try { jsonText.value = await file.text(); invalidatePreview(); show(`已载入 ${file.name}，请先预览校验`); }
  catch (error) { show(`文件读取失败：${error.message}`, 'error'); }
}
async function refresh() {
  records.value = await props.store.listRecords();
  if (selectedId.value && !records.value.some((item) => item.id === selectedId.value)) selectedId.value = '';
}
async function select(id) {
  selectedId.value = id;
  const value = await props.store.get(id);
  if (value) jsonText.value = JSON.stringify(value, null, 2);
  invalidatePreview();
}
async function previewImport() {
  if (busy.value) return;
  try {
    const next = previewContentImport(jsonText.value);
    next.conflicts = [];
    for (const record of next.records) if (await props.store.getRecord(record.id)) next.conflicts.push({ id: record.id });
    preview.value = next;
    show(`校验通过：${next.count} 条内容`);
  } catch (error) { preview.value = null; show(error.message, 'error'); emit('error', error); }
}
async function commitImport() { await commit('reject'); }
async function replaceImport() { await commit('replace'); }
async function commit(mode) {
  if (busy.value || !preview.value) return;
  const previewText = jsonText.value;
  busy.value = true;
  try {
    const result = await importContent(previewText, { store: props.store, mode });
    await refresh();
    preview.value = null;
    show(`已导入 ${result.imported.length} 条内容`);
    emit('changed', result);
  } catch (error) { show(error.message, 'error'); emit('error', error); }
  finally { busy.value = false; }
}
async function saveEdit() {
  if (!selected.value) return;
  try {
    const value = JSON.parse(jsonText.value);
    await props.store.update(selected.value.id, value);
    await refresh(); show('编辑已保存'); emit('changed', { id: selected.value.id, action: 'update' });
  } catch (error) { show(error.message, 'error'); emit('error', error); }
}
async function applySelected() {
  if (!selected.value) return;
  emit('apply', [selected.value.entry]);
}
async function copySelected() {
  if (!selected.value) return;
  try { const copy = await props.store.copy(selected.value.id); await refresh(); await select(copy.id); show(`已复制：${copy.name}`); emit('changed', { id: copy.id, action: 'copy' }); }
  catch (error) { show(error.message, 'error'); emit('error', error); }
}
async function removeSelected() {
  if (!selected.value) return;
  try { const id = selected.value.id; await props.store.remove(id); selectedId.value = ''; jsonText.value = ''; await refresh(); show(`已删除：${id}`); emit('changed', { id, action: 'delete' }); }
  catch (error) { show(error.message, 'error'); emit('error', error); }
}
async function exportSelected() {
  try { const text = await exportContentJson(props.store, selectedId.value); emit('export', text); show('已生成选中内容导出 JSON'); }
  catch (error) { show(error.message, 'error'); emit('error', error); }
}
async function exportAll() {
  try { const text = await exportContentJson(props.store); emit('export', text); show('已生成全部内容导出 JSON'); }
  catch (error) { show(error.message, 'error'); emit('error', error); }
}
onMounted(refresh);
// Editing the textarea after validation must require a fresh preview.
watch(jsonText, invalidatePreview);
defineExpose({ refresh, previewImport, commitImport, replaceImport });
</script>

<style scoped>
.xy-content-library { padding: 24px 28px 40px; color: var(--xy-text-body); }
.xy-library-header, .xy-library-actions, .xy-library-toolbar, .xy-library-buttons { display: flex; gap: 10px; align-items: center; }
.xy-library-header { justify-content: space-between; border-bottom: 1px solid var(--xy-border-subtle); padding-bottom: 14px; }
.xy-panel-kicker { color: var(--xy-cyan-400); font: 10px var(--xy-font-mono); letter-spacing: .16em; }
.xy-panel-title { margin: 4px 0 6px; color: var(--xy-text-title); font: 500 24px var(--xy-font-serif); }
.xy-panel-desc { margin: 0; font-size: 12px; color: var(--xy-text-muted); }
.xy-library-grid { display: grid; grid-template-columns: minmax(220px, 30%) 1fr; gap: 16px; margin-top: 18px; }
.xy-library-list, .xy-library-editor { border: 1px solid var(--xy-border-subtle); border-radius: 10px; background: var(--xy-bg-card); padding: 12px; }
.xy-library-toolbar input, .xy-library-toolbar select, .xy-library-editor textarea { box-sizing: border-box; width: 100%; border: 1px solid var(--xy-border-subtle); border-radius: 7px; background: var(--xy-bg-void); color: var(--xy-text-body); padding: 8px; }
.xy-library-toolbar { align-items: stretch; } .xy-library-toolbar input { flex: 1; } .xy-library-toolbar select { width: 86px; }
.xy-library-item { display: flex; flex-direction: column; width: 100%; margin-top: 8px; padding: 9px; text-align: left; border: 1px solid transparent; border-radius: 7px; background: transparent; color: var(--xy-text-body); cursor: pointer; }
.xy-library-item.active, .xy-library-item:hover { border-color: var(--xy-border-glow); background: var(--xy-bg-surface-2); } .xy-library-item small { color: var(--xy-text-muted); margin-top: 3px; }
.xy-library-editor textarea { min-height: 300px; resize: vertical; font: 12px/1.5 var(--xy-font-mono); }
.xy-library-buttons { flex-wrap: wrap; margin-top: 10px; } button { border: 1px solid var(--xy-border-subtle); border-radius: 7px; background: var(--xy-bg-surface-2); color: var(--xy-text-body); padding: 8px 12px; cursor: pointer; } button:disabled { opacity: .4; cursor: not-allowed; } button.danger { color: var(--xy-crimson-300); }
.xy-upload-button { display: inline-flex; align-items: center; border: 1px solid var(--xy-border-subtle); border-radius: 7px; background: var(--xy-bg-surface-2); color: var(--xy-text-body); padding: 8px 12px; cursor: pointer; }
.xy-upload-button input { display: none; }
.xy-library-notice { margin-top: 12px; padding: 8px 10px; border: 1px solid var(--xy-border-glow); border-radius: 7px; } .xy-library-notice.error { border-color: var(--xy-border-crimson); color: var(--xy-crimson-300); }
.xy-library-preview { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; color: var(--xy-jade-300); font-size: 12px; } .xy-library-preview .warning { color: var(--xy-gold-300); } .xy-library-empty { color: var(--xy-text-muted); font-size: 12px; }
@media (max-width: 900px) {
  .xy-library-header { display: block; }
  .xy-library-actions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 14px; }
  .xy-library-actions button, .xy-upload-button { justify-content: center; min-width: 0; text-align: center; }
  .xy-library-grid { grid-template-columns: minmax(0, 1fr); }
  .xy-library-list, .xy-library-editor { min-width: 0; }
}
@media (max-width: 600px) {
  .xy-content-library { padding: 16px 14px 28px; }
  .xy-panel-title { font-size: 20px; }
  .xy-library-actions { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .xy-library-buttons { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .xy-library-toolbar input { min-width: 0; }
  .xy-library-toolbar select { flex: none; }
}
</style>
