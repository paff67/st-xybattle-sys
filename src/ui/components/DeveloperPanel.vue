<template>
  <div class="xy-dev-panel xy-custom-scroll">
    <div class="xy-panel-header">
      <div>
        <span class="xy-panel-kicker">TIANDAO AUDIT & MODEL PROMPTS</span>
        <h2 class="xy-panel-title">天道秘录 · 裁定审计与日志</h2>
      </div>
      <p class="xy-panel-desc">
        完整记录裁定模型接收的结构化上下文、原始输入输出、规则校验及宿主契约收据。敏感凭据已自动脱敏。
      </p>
    </div>

    <!-- 顶部操作条 -->
    <div class="xy-dev-actions">
      <button class="xy-dev-btn" @click="$emit('copy-debug')">
        <Icons name="copy" />
        <span>复制完整开发审计 JSON</span>
      </button>

      <button class="xy-dev-btn" @click="$emit('export-debug')">
        <Icons name="scroll" />
        <span>导出开发审计文件 (JSON)</span>
      </button>

      <button class="xy-dev-btn" @click="$emit('export-public')">
        <Icons name="eye" />
        <span>导出公开脱敏战报</span>
      </button>
    </div>

    <!-- AI 实际读取上下文快照 (AI Read Context) -->
    <details class="xy-log-section" open>
      <summary class="xy-sec-summary">
        <span class="xy-sec-tag">AI READ CONTEXT</span>
        <span>当前裁定器实际读取的完整结构化上下文 (含敌方 Hidden 信息)</span>
      </summary>
      <pre class="xy-log-pre xy-custom-scroll">{{ formattedAiContext }}</pre>
    </details>

    <!-- 逐条调用日志记录 -->
    <div class="xy-log-list-container">
      <h3 class="xy-list-title">模型与程序事件流水 ({{ logs.length }})</h3>

      <div v-if="logs.length" class="xy-log-items">
        <details 
          v-for="(item, idx) in reversedLogs" 
          :key="idx" 
          class="xy-log-detail-item"
        >
          <summary class="xy-item-summary">
            <span class="xy-item-kind" :class="'kind-' + item.kind">{{ item.kind }}</span>
            <span class="xy-item-action" v-if="item.actionId">#{{ item.actionId.slice(-6) }}</span>
            <span class="xy-item-time">{{ item.at }}</span>
          </summary>
          <pre class="xy-item-pre xy-custom-scroll">{{ formatJson(item) }}</pre>
        </details>
      </div>

      <div v-else class="xy-empty-logs">
        <span>尚无调用日志。进行裁定、正文生成或宿主同步后将自动记述于此。</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Icons from './Icons.vue';

const props = defineProps({
  aiContext: { type: Object, default: () => ({}) },
  logs: { type: Array, default: () => [] }
});

defineEmits(['copy-debug', 'export-debug', 'export-public']);

const formattedAiContext = computed(() => {
  return JSON.stringify(props.aiContext, null, 2);
});

const reversedLogs = computed(() => {
  return props.logs.slice().reverse();
});

function formatJson(data) {
  return JSON.stringify(data, null, 2);
}
</script>

<style scoped>
.xy-dev-panel {
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

.xy-dev-actions {
  display: flex;
  gap: 10px;
}

.xy-dev-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(14, 28, 48, 0.7);
  color: var(--xy-text-title);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.xy-dev-btn:hover {
  background: rgba(20, 42, 72, 0.9);
  border-color: var(--xy-cyan-400);
  box-shadow: 0 0 14px var(--xy-cyan-glow);
}

.xy-log-section {
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 10px;
  background: rgba(8, 18, 32, 0.85);
  padding: 12px 16px;
}

.xy-sec-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-family: var(--xy-font-serif);
  color: var(--xy-cyan-200);
  cursor: pointer;
}

.xy-sec-tag {
  font-family: var(--xy-font-mono);
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(56, 189, 248, 0.2);
  color: var(--xy-cyan-300);
}

.xy-log-pre {
  margin: 12px 0 0;
  padding: 14px;
  border-radius: 6px;
  background: rgba(3, 7, 13, 0.95);
  color: #7dd3fc;
  font-family: var(--xy-font-mono);
  font-size: 11px;
  line-height: 1.6;
  max-height: 300px;
  overflow: auto;
}

/* 事件流水 */
.xy-log-list-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.xy-list-title {
  margin: 0;
  font-family: var(--xy-font-serif);
  font-size: 15px;
  color: var(--xy-gold-300);
}

.xy-log-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.xy-log-detail-item {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: rgba(10, 22, 38, 0.7);
  overflow: hidden;
}

.xy-item-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 12px;
}

.xy-item-kind {
  font-family: var(--xy-font-mono);
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
}
.kind-adjudication { background: rgba(56, 189, 248, 0.2); color: var(--xy-cyan-300); }
.kind-host_persistence { background: rgba(251, 191, 36, 0.2); color: var(--xy-gold-300); }
.kind-host_injection { background: rgba(45, 212, 191, 0.2); color: var(--xy-jade-300); }
.kind-narrative { background: rgba(167, 139, 250, 0.2); color: #c4b5fd; }

.xy-item-action {
  font-family: var(--xy-font-mono);
  color: var(--xy-text-muted);
}

.xy-item-time {
  margin-left: auto;
  font-family: var(--xy-font-mono);
  font-size: 10px;
  color: var(--xy-text-hint);
}

.xy-item-pre {
  margin: 0;
  padding: 12px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(4, 9, 16, 0.95);
  color: #bae6fd;
  font-family: var(--xy-font-mono);
  font-size: 11px;
  line-height: 1.6;
  max-height: 280px;
  overflow: auto;
}

.xy-empty-logs {
  padding: 24px;
  text-align: center;
  color: var(--xy-text-hint);
  font-size: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: 8px;
}
</style>
