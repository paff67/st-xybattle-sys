<template>
  <section class="xy-runtime-log" data-testid="runtime-log">
    <h3>扩展运行日志</h3>
    <p>覆盖当前页面的扩展操作。记录有容量限制，刷新后清空；导出包含全部已保留记录，筛选仅影响显示。</p>
    <div class="controls">
      <label><input type="checkbox" v-model="enabled" @change="logger.enabled = enabled" />采集日志</label>
      <label><input type="checkbox" v-model="debug" @change="logger.debug = debug" />采集 DEBUG</label>
      <button @click="togglePause">{{ paused ? '恢复显示' : '暂停显示' }}</button>
      <button @click="clear">清空日志</button><button @click="exportAll">导出完整诊断</button>
    </div>
    <div class="controls">
      <label>等级<select v-model="level"><option value="">全部</option><option v-for="v in ['ERROR','WARN','INFO','DEBUG']" :key="v">{{ v }}</option></select></label>
      <label>模块<select v-model="module"><option value="">全部</option><option v-for="v in modules" :key="v">{{ moduleLabels[v] || v }}</option></select></label>
      <label>操作<select v-model="runId"><option value="">全部</option><option v-for="run in runs" :key="run.id" :value="run.id">{{ run.label }} · {{ run.id.slice(-8) }}</option></select></label>
      <input v-model="keyword" placeholder="搜索阶段、标识或错误码" aria-label="日志关键词" />
    </div>
    <p role="status">{{ paused ? '已暂停显示，后台继续采集' : '实时显示' }} · 显示 {{ filtered.length }} / {{ rows.length }} 条 · 已淘汰 {{ dropped }} 条 {{ notice }}</p>
    <details open><summary>操作概览</summary>
      <ul><li v-for="run in filteredRuns" :key="run.id"><button @click="runId = run.id">{{ run.label }} · {{ run.id.slice(-8) }}</button> {{ labels[run.status] || run.status }} · {{ run.committed ? '有已提交记录' : '未记录已提交结果' }} · {{ run.duration ?? '—' }} ms</li></ul>
    </details>
    <div class="timeline"><details v-for="row in filtered" :key="row.id">
      <summary>{{ row.timestamp.slice(11,23) }} UTC · {{ row.level }} · {{ stageLabels[row.stage] || row.stage }} · {{ labels[row.status] || row.status }} · {{ row.message }}</summary>
      <dl v-if="row.data?.code && guidance[row.data.code]"><template v-for="(value,index) in guidance[row.data.code]" :key="index"><dt>{{ ['事实','影响','可能原因','建议步骤'][index] }}</dt><dd>{{ value }}</dd></template></dl>
      <details><summary>技术详情</summary><pre>{{ JSON.stringify(row, null, 2) }}</pre><button @click="copy(row)">复制详情</button></details>
    </details></div>
  </section>
</template>
<script setup>
import { computed, ref, shallowRef, onUnmounted } from 'vue';
import { operationLog, ERROR_GUIDANCE } from '../../operation-log.js';
import { downloadJson } from '../../utils.js';
const props = defineProps({ logger: { type: Object, default: () => operationLog } });
const logger = props.logger, guidance = ERROR_GUIDANCE;
const rows = shallowRef(logger.snapshot()), paused = ref(false), enabled = ref(logger.enabled), debug = ref(logger.debug), dropped = ref(logger.dropped);
const level = ref(''), module = ref(''), runId = ref(''), keyword = ref(''), notice = ref('');
const moduleLabels = { configuration:'配置', startup:'启动', automatic:'自动事务', characters:'人物准备', battle:'战斗操作', 'battle-adjudication':'战斗裁定', 'narrative-rewrite':'正文重写', content:'内容库', 'content-import':'内容导入', 'host-save':'宿主保存', 'host-save-retry':'重试宿主保存', 'host-narrative':'正文结果', 'host-narrative-send':'正文发送', 'battle-entry':'战斗入口', 'battle-observation':'战界边沿观察', 'mvu-observation':'MVU 状态观察', 'mvu-listener':'MVU 监听', 'battle-recovery':'战斗入口恢复', 'narrative-observation':'正文入口识别', 'event-save-retry':'重试事件保存', 'entry-restore':'自动入口恢复', 'entry-configuration':'自动入口配置' };
const operationLabels = { start:'开始战斗',stop:'停止战斗',continueNext:'进入下一轮',confirmCharacters:'确认人物',applyContentEntries:'应用内容',importData:'导入存档',importScene:'导入场景',importRegistry:'导入能力',switchScope:'切换聊天/分支',reconcileTranscript:'核对聊天与回滚',skipPendingNarrative:'跳过正文',recordPacketSent:'登记发送',saveCoreRuleConfig:'保存常驻底则',put:'保存内容',putMany:'批量保存内容',remove:'删除内容',clear:'清空内容',copy:'复制内容',update:'编辑内容',exportContents:'导出内容','settings-save':'保存配置','local-settings-save':'保存本机配置',migration:'迁移配置' };
const stageLabels = { trigger:'触发',context:'上下文准备',capture:'捕获输入',identity:'确认消息与分支',route:'选择路径',request:'模型请求',parse:'响应解析',validation:'业务校验',commit:'状态提交',injection:'结果注入',narrative:'正文生成',fallback:'失败放行',end:'操作结束','host-save':'宿主保存','server-confirmation':'服务器确认','entry-enable':'入口启用',proposal:'候选提案',storage:'存储能力' };
const labels = { running:'进行中',success:'成功',failed:'失败',cancelled:'已取消',skipped:'已跳过',degraded:'已降级' };
const refresh = () => { if (!paused.value) { rows.value = logger.snapshot(); dropped.value = logger.dropped; } };
const unsubscribe = logger.subscribe(refresh); onUnmounted(unsubscribe);
function togglePause() { paused.value = !paused.value; refresh(); }
function clear() { logger.clear(); rows.value = []; dropped.value = 0; }
function exportAll() { downloadJson('xybattle-runtime-log.json', logger.export()); }
async function copy(row) { try { await navigator.clipboard.writeText(JSON.stringify(row,null,2)); notice.value = '已复制'; } catch { notice.value = '复制失败，可使用导出'; } }
const modules = computed(() => [...new Set(rows.value.map(r => r.module))]);
const filtered = computed(() => rows.value.filter(r => (!level.value || r.level === level.value) && (!module.value || r.module === module.value) && (!runId.value || r.runId === runId.value) && (!keyword.value || JSON.stringify(r).toLowerCase().includes(keyword.value.toLowerCase()))));
const runs = computed(() => {
  const map = new Map();
  for (const row of rows.value) {
    const run = map.get(row.runId) || { id: row.runId, module: row.module, label: operationLabels[row.operation] || moduleLabels[row.module] || row.module, status: 'running', committed: false };
    if (row.stage === 'end') { run.status = row.status; run.duration = row.durationMs; }
    if (row.data?.committed === true) run.committed = true;
    map.set(row.runId,run);
  }
  return [...map.values()].reverse();
});
const filteredRuns = computed(() => { const ids = new Set(filtered.value.map(r => r.runId)); return runs.value.filter(r => ids.has(r.id)); });
</script>
<style scoped>
.xy-runtime-log{padding:16px;border:1px solid #567;border-radius:8px;margin-bottom:20px;color:var(--xy-text-body)}
.controls{display:flex;gap:10px;flex-wrap:wrap;margin:10px 0;align-items:center}.controls label{display:flex;gap:5px;align-items:center}
button,select,input{color:inherit;background:var(--xy-bg-card,#17212a);border:1px solid #567;border-radius:4px;padding:5px}input[type=checkbox]{width:auto}
.timeline{max-height:600px;overflow:auto}.timeline>details{padding:7px;border-bottom:1px solid #5675}pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:300px;overflow:auto}dt{font-weight:bold}dd{margin:0 0 6px}summary,button{cursor:pointer}
</style>
