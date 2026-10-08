<template>
  <fieldset class="xy-core-card" :disabled="locked || busy || !config.characterKey">
    <legend>常驻底则 · 跟随角色卡</legend>
    <p>当前角色卡：{{ config.characterName || '未选择角色卡' }}。配置保存在当前酒馆账号，按角色卡文件绑定，同卡不同聊天共用。</p>
    <p>所选条目在战前冻结完整原文，每轮裁定作为独立系统规则发送。世界书的启用开关不影响这里的显式选择。</p>
    <p v-if="locked" role="status">战斗或人物准备期间已锁定。当前战斗使用已冻结的 {{ state.coreRules?.length || 0 }} 条底则。</p>
    <button type="button" @click="refreshBooks">读取世界书列表</button>
    <label class="xy-core-book">世界书
      <select v-model="book" aria-label="底则世界书" @change="loadEntries">
        <option value="">请选择世界书</option>
        <option v-for="name in books" :key="name" :value="name">{{ name }}</option>
      </select>
    </label>
    <div class="xy-core-entries" aria-label="可选世界书条目">
      <label v-for="entry in entries" :key="entry.uid">
        <input type="checkbox" :checked="chosen(book, entry.uid)" @change="toggle(book, entry.uid, $event.target.checked)" />
        [{{ entry.uid }}] {{ entry.comment || '未命名条目' }}
      </label>
    </div>
    <p>已选择 {{ selection.length }} 条。可切换世界书继续添加，UID 只在所属世界书内匹配。</p>
    <ul v-if="selection.length">
      <li v-for="item in selection" :key="JSON.stringify(item)">{{ item.book }} · UID {{ item.uid }}
        <button type="button" @click="toggle(item.book, item.uid, false)">移除</button>
      </li>
    </ul>
    <button type="button" @click="save">保存本角色卡底则</button>
    <p v-if="notice" role="status">{{ notice }}</p>
  </fieldset>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
const props = defineProps({ controller: { type: Object, required: true }, state: { type: Object, required: true }, preparing: Boolean });
const config = computed(() => { void props.state; return props.controller.coreRuleConfig(); });
const locked = computed(() => props.preparing || !['idle', 'ended'].includes(props.state.phase));
const selection = ref([]), books = ref([]), entries = ref([]), book = ref(''), notice = ref(''), busy = ref(false);
let readVersion = 0;
watch(() => config.value.characterKey, () => {
  readVersion++; selection.value = structuredClone(config.value.selection); book.value = ''; entries.value = []; books.value = []; notice.value = ''; busy.value = false;
}, { immediate: true });
function chosen(name, uid) { return selection.value.some(item => item.book === name && item.uid === uid); }
function toggle(name, uid, enabled) {
  if (locked.value) return;
  selection.value = selection.value.filter(item => item.book !== name || item.uid !== uid);
  if (enabled) selection.value.push({ book: name, uid });
}
async function refreshBooks() {
  const version = ++readVersion; busy.value = true; notice.value = '';
  try { const list = await props.controller.hostAdapter.listCoreWorldbooks(); if (version === readVersion) books.value = list; }
  catch (error) { if (version === readVersion) notice.value = error.message; }
  finally { if (version === readVersion) busy.value = false; }
}
async function loadEntries() {
  const version = ++readVersion; entries.value = [];
  if (!book.value) return;
  busy.value = true; notice.value = '';
  try {
    const data = await props.controller.hostAdapter.readCoreWorldbook(book.value);
    if (version === readVersion) entries.value = Object.values(data?.entries || {}).map(entry => ({ uid: Number(entry.uid), comment: entry.comment })).filter(entry => Number.isInteger(entry.uid)).sort((a, b) => a.uid - b.uid);
  } catch (error) { if (version === readVersion) notice.value = error.message; }
  finally { if (version === readVersion) busy.value = false; }
}
function save() {
  try { props.controller.saveCoreRuleConfig(selection.value, config.value.characterKey); notice.value = '角色卡底则已保存。请重新准备人物以加载本场原文。'; }
  catch (error) { notice.value = error.message; }
}
</script>

<style scoped>
.xy-core-card { border: 1px solid var(--xy-border-subtle); border-radius: 12px; padding: 20px; min-width: 0; color: var(--xy-text-main); }
.xy-core-card legend { color: var(--xy-cyan-400); padding: 0 8px; }
.xy-core-card p { font-size: 13px; line-height: 1.7; color: var(--xy-text-muted); }
.xy-core-card button, .xy-core-card select { background: var(--xy-bg-panel, #102536); color: var(--xy-text-main, #d7e9f2); border: 1px solid var(--xy-border-subtle); border-radius: 6px; padding: 8px 12px; max-width: 100%; }
.xy-core-card:disabled { opacity: .7; }
.xy-core-book { display: grid; gap: 8px; margin-top: 14px; }
.xy-core-entries { display: grid; gap: 8px; max-height: 260px; overflow: auto; margin-top: 12px; }
.xy-core-entries label { display: flex; align-items: start; gap: 8px; overflow-wrap: anywhere; }
.xy-core-card li { margin-bottom: 8px; overflow-wrap: anywhere; }
.xy-core-card li button { margin-left: 8px; }
</style>
