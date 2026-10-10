<template>
  <div class="xy-dev-panel xy-custom-scroll">
    <div class="xy-panel-header">
      <div>
        <span class="xy-panel-kicker">TIANDAO AUDIT & MODEL PROMPTS</span>
        <h2 class="xy-panel-title">天道秘录 · 裁定审计与日志</h2>
      </div>
      <p class="xy-panel-desc">
        查看战斗模型调用与自动事务审计：资料来源、处理阶段、依据摘要、裁定结果及宿主收据。敏感凭据已自动脱敏。
      </p>
    </div>

    <RuntimeLog />
    <p v-if="events.some(event => event.persistencePending)">事件保存待确认。请先等待正文完成，再重试保存；不会重新执行模型裁定。</p>
    <button v-if="events.some(event => event.persistencePending)" @click="$emit('retry-event-save')">重试事件保存确认</button>
    <!-- 顶部操作条 -->
    <div class="xy-dev-actions">
      <button class="xy-dev-btn" @click="$emit('copy-debug')">
        <Icons name="copy" />
        <span>复制脱敏运行日志 JSON</span>
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

    <div class="xy-log-list-container" data-testid="event-audit">
      <h3 class="xy-list-title">自动事务 · 当前聊天最近 {{ events.length }} 条</h3>
      <p class="xy-panel-desc">按输入和分支保留资料提取、判定依据摘要、消耗与结果。审计中的候选结果仅在 committed 状态下生效；取消与异常不提交候选结果。</p>
      <details v-for="event in events" :key="event.eventId" class="xy-log-detail-item">
        <summary class="xy-item-summary">
          <span class="xy-item-kind">{{ eventLabel(event) }}</span>
          <span>{{ statusLabel(event) }}</span>
          <span class="xy-item-time">#{{ event.eventId.slice(-8) }}</span>
        </summary>
        <div class="xy-event-result">
          <p v-if="event.reasonCode || event.error">{{ event.error || event.reasonCode }}</p>
          <p v-if="event.route?.missingInformation?.length">缺少资料：{{ event.route.missingInformation.join('；') }}</p>
          <div v-for="record in event.execution?.records || []" :key="record.actionKey" class="xy-event-verdict">
            <p><strong>{{ outcomeLabel(record.outcome) }}</strong> · {{ record.summary }}</p>
            <p v-if="record.duration">阶段 / 耗时：{{ record.duration }}</p>
            <p v-if="record.publicFacts?.length">可见结果：{{ record.publicFacts.join('；') }}</p>
            <p v-if="record.costs?.length">实际代价：{{ record.costs.join('；') }}</p>
            <p v-if="record.effects?.length">持续后果：{{ record.effects.join('；') }}</p>
            <details v-if="record.basis?.length"><summary>裁定依据摘要</summary><p v-for="(basis, index) in record.basis" :key="index">{{ basis.reason }} · {{ basis.sourceId }}{{ basis.pointer }}</p></details>
          </div>
          <ol v-if="event.audit?.length" class="xy-event-stages"><li v-for="(stage, index) in event.audit" :key="index">{{ stageLabel(stage.stage) }}<span v-if="stage.domain"> · {{ EVENT_DOMAINS[stage.domain]?.label }}</span> <time>{{ stage.at?.slice(11, 19) }} UTC</time></li></ol>
          <p v-if="event.reasonCode === 'user_skipped_adjudication'">用户已取消：未注入裁定结果，正文交给主 AI。</p>
          <details><summary>处理细节、来源与完整结果</summary><pre class="xy-item-pre xy-custom-scroll">{{ formatJson(event) }}</pre></details>
        </div>
      </details>
      <div v-if="!events.length" class="xy-empty-logs">尚无自动事务记录。</div>
    </div>

    <section class="xy-log-list-container" data-testid="battle-activation-audit">
      <h3 class="xy-list-title">战斗状态唤起 · {{ activations.length }} 条</h3>
      <details v-for="entry in activations" :key="entry.activationId" class="xy-log-detail-item">
        <summary>{{ entry.status }} · {{ entry.before?.战斗状态 || '语义入口' }} → {{ entry.after?.战斗状态 || '战斗准备' }}</summary>
        <p>{{ entry.reason }} · {{ entry.sessionId || '尚未接管' }}</p>
        <pre class="xy-item-pre xy-custom-scroll">{{ formatJson(entry) }}</pre>
      </details>
    </section>

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
import RuntimeLog from './RuntimeLog.vue';
import { EVENT_DOMAINS } from '../../event-domain-contracts.js';

const props = defineProps({
  aiContext: { type: Object, default: () => ({}) },
  events: { type: Array, default: () => [] },
  activations: { type: Array, default: () => [] },
  logs: { type: Array, default: () => [] }
});

defineEmits(['copy-debug', 'export-debug', 'export-public', 'retry-event-save']);
function eventLabel(event) { return [...new Set((event.route?.actions || event.audit || []).map(a => EVENT_DOMAINS[a.domain]?.label).filter(Boolean))].join(' / ') || '输入分流'; }
function statusLabel(event) { return event.persistencePending ? '等待保存确认' : ({ captured: '已捕获', routing: '处理中', passed: '已放行', committed: '已提交', handed_off: '战斗接管', needs_input: '缺少资料', unsupported: '暂不支持', rejected: '校验失败', cancelled: '已停止', rolled_back: '已失效' })[event.status] || event.status; }
function outcomeLabel(outcome) { return ({ success: '成功', partial: '部分完成', failure: '失败', blocked: '受阻', in_progress: '仍在进行', needs_context: '资料不足', skipped: '未执行' })[outcome] || outcome; }
function stageLabel(stage) { return ({ extracting: '提取资料', rules_loaded: '读取规则原文', prepared: '核对资料引用', adjudicating: 'AI 裁定', validating: '程序校验', evaluated: '候选结果就绪', user_skipped_adjudication: '用户取消并放行正文' })[stage] || stage; }

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
.xy-event-result { padding: 0 14px 14px; font-size: 12px; color: var(--xy-text-muted); overflow-wrap: anywhere; }
.xy-event-verdict { border-bottom: 1px solid #7dd3fc22; padding-bottom: 10px; margin-bottom: 10px; }
.xy-event-verdict strong { color: var(--xy-cyan-200); }
.xy-event-stages { padding-left: 18px; line-height: 1.8; }
.xy-event-stages time { opacity: .65; font-size: 10px; }
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
