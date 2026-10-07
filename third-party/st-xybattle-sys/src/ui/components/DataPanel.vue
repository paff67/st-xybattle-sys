<template>
  <div class="xy-data-panel xy-custom-scroll">
    <div class="xy-panel-header">
      <div>
        <span class="xy-panel-kicker">SCENE & PRESET MANAGEMENT</span>
        <h2 class="xy-panel-title">演武经卷 · 场景与道藏存档</h2>
      </div>
      <p class="xy-panel-desc">
        可导入特定世界观战场、角色卡快照与功法 Registry；支持当前分支存档无损导入导出。
      </p>
    </div>

    <!-- 预设与快捷操作 -->
    <div class="xy-quick-actions-bar">
      <button class="xy-action-btn btn-demo" @click="$emit('load-demo')">
        <Icons name="sparkles" />
        <span>载入《叠浪玄潮决》演示场景</span>
      </button>

      <button class="xy-action-btn" @click="$emit('export-full')">
        <Icons name="copy" />
        <span>导出完整战局存档 (JSON)</span>
      </button>

      <button class="xy-action-btn" @click="$emit('export-public')">
        <Icons name="scroll" />
        <span>导出公开战报摘要</span>
      </button>
    </div>

    <!-- JSON 文本与文件导入控制台 -->
    <div class="xy-import-console">
      <div class="xy-console-header">
        <span class="xy-console-title">经卷解析与录入 (JSON)</span>
        <label class="xy-file-upload-btn">
          <span>选择本地 JSON 文件</span>
          <input type="file" accept="application/json,.json" @change="onFileChange" class="xy-hidden-input" />
        </label>
      </div>

      <textarea 
        v-model="jsonText"
        class="xy-json-textarea xy-custom-scroll"
        rows="10"
        placeholder="粘贴 battle_v2_scene、battle_v2_export 或 registry JSON 文本……"
      ></textarea>

      <div class="xy-import-btns">
        <button class="xy-imp-btn" :disabled="!jsonText.trim()" @click="$emit('import-scene', jsonText)">
          <span>导入为新场景</span>
        </button>

        <button class="xy-imp-btn" :disabled="!jsonText.trim()" @click="$emit('import-registry', jsonText)">
          <span>导入功法 Registry</span>
        </button>

        <button class="xy-imp-btn btn-danger" :disabled="!jsonText.trim()" @click="$emit('import-save', jsonText)">
          <span>恢复分支存档</span>
        </button>
      </div>
    </div>

    <!-- 当前战场快照展开审计 -->
    <details class="xy-snapshot-details">
      <summary class="xy-snapshot-summary">
        <span>当前环境与角色快照 (包含内部状态与裁定器上下文)</span>
      </summary>
      <pre class="xy-snapshot-pre xy-custom-scroll">{{ formattedSnapshot }}</pre>
    </details>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import Icons from './Icons.vue';

const props = defineProps({
  snapshot: { type: Object, default: () => ({}) }
});

const emit = defineEmits([
  'load-demo',
  'export-full',
  'export-public',
  'import-scene',
  'import-registry',
  'import-save'
]);

const jsonText = ref('');

const formattedSnapshot = computed(() => {
  return JSON.stringify(props.snapshot, null, 2);
});

async function onFileChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  jsonText.value = await file.text();
}
</script>

<style scoped>
.xy-data-panel {
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
}

.xy-quick-actions-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.xy-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(14, 28, 48, 0.7);
  color: var(--xy-text-title);
  font-size: 13px;
  font-family: var(--xy-font-sans);
  cursor: pointer;
  transition: all 0.2s;
}

.xy-action-btn:hover {
  background: rgba(20, 42, 72, 0.9);
  border-color: var(--xy-cyan-400);
  box-shadow: 0 0 16px var(--xy-cyan-glow);
}

.btn-demo {
  border-color: rgba(251, 191, 36, 0.4);
  background: rgba(251, 191, 36, 0.08);
  color: var(--xy-gold-300);
}
.btn-demo:hover {
  background: rgba(251, 191, 36, 0.18);
  border-color: var(--xy-gold-400);
  box-shadow: 0 0 16px var(--xy-gold-glow);
}

/* 导入控制台 */
.xy-import-console {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px 22px;
  border-radius: 12px;
  background: rgba(12, 26, 46, 0.75);
  border: 1px solid var(--xy-border-subtle);
  backdrop-filter: blur(16px);
}

.xy-console-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.xy-console-title {
  font-family: var(--xy-font-serif);
  font-size: 14px;
  color: var(--xy-cyan-200);
}

.xy-file-upload-btn {
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid rgba(56, 189, 248, 0.25);
  background: rgba(56, 189, 248, 0.08);
  color: var(--xy-cyan-300);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.xy-file-upload-btn:hover {
  background: rgba(56, 189, 248, 0.18);
}

.xy-hidden-input {
  display: none;
}

.xy-json-textarea {
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(6, 14, 26, 0.9);
  color: #bae6fd;
  font-family: var(--xy-font-mono);
  font-size: 12px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
}

.xy-json-textarea:focus {
  border-color: var(--xy-cyan-400);
  box-shadow: 0 0 12px var(--xy-cyan-glow);
}

.xy-import-btns {
  display: flex;
  gap: 10px;
}

.xy-imp-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  color: var(--xy-text-title);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.xy-imp-btn:hover:not(:disabled) {
  background: rgba(56, 189, 248, 0.15);
  border-color: var(--xy-cyan-400);
}

.xy-imp-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.btn-danger {
  border-color: rgba(244, 63, 94, 0.3);
  color: var(--xy-crimson-300);
}
.btn-danger:hover:not(:disabled) {
  background: rgba(244, 63, 94, 0.15);
  border-color: var(--xy-crimson-400);
}

/* 快照查看 */
.xy-snapshot-details {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: rgba(6, 14, 26, 0.6);
  padding: 10px 14px;
}

.xy-snapshot-summary {
  font-size: 12px;
  color: var(--xy-text-muted);
  cursor: pointer;
  outline: none;
}

.xy-snapshot-pre {
  margin: 10px 0 0;
  padding: 12px;
  border-radius: 6px;
  background: rgba(3, 7, 13, 0.95);
  color: #7dd3fc;
  font-family: var(--xy-font-mono);
  font-size: 11px;
  line-height: 1.6;
  max-height: 320px;
  overflow: auto;
}
</style>
