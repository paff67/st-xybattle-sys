<template>
  <aside v-if="visible" class="xy-event-progress" data-testid="event-progress" :class="{ 'is-error': failed }" aria-label="自动事务判定进度">
    <div role="status" aria-live="polite">
      <div class="xy-event-heading"><span class="xy-event-dot" :class="{ active: busy }"></span><strong>{{ title }}</strong><small v-if="busy">{{ elapsed }}s</small></div>
      <p>{{ description }}</p>
    </div>
    <div class="xy-event-actions">
      <button @click="$emit('details')">查看详情</button>
      <button v-if="progress.canCancel && !cancelRequested" class="xy-event-cancel" @click="cancel">取消裁定，继续正文</button>
      <span v-else-if="cancelRequested && busy">正在取消…</span>
      <button v-if="!busy" aria-label="关闭判定提示" @click="visible = false">关闭</button>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, watch, onUnmounted } from 'vue';
import { EVENT_DOMAINS } from '../../event-domain-contracts.js';
const props = defineProps({ progress: { type: Object, default: () => ({}) } });
const emit = defineEmits(['details', 'cancel']);
const visible = ref(false), domain = ref(''), cancelRequested = ref(false), elapsed = ref(0);
let dismissTimer, elapsedTimer, started = 0;
const busy = computed(() => ['battle_preparing', 'capturing', 'routing', 'extracting', 'rules_loaded', 'prepared', 'adjudicating', 'validating', 'evaluated', 'persisting'].includes(props.progress.status));
const failed = computed(() => ['battle_failed', 'battle_needs_context', 'battle_unavailable', 'battle_mvu_not_ready', 'rejected', 'blocked', 'needs_input', 'unsupported', 'persistence_pending', 'binding_pending', 'narrative_failed'].includes(props.progress.status));
const label = computed(() => domain.value === 'pursuit' ? '追踪 / 追逃' : EVENT_DOMAINS[domain.value]?.label || '事务');
const title = computed(() => {
  const status = props.progress.status;
  if (props.progress.reason === 'adjudication_failed_open') return '裁定失败 · 已放行正文';
  if (status === 'battle_preparing') return '正在准备战斗人物';
  if (status === 'battle_accepted') return '战斗资料已接管';
  if (status === 'battle_cancelled') return '战斗准备已取消';
  if (status?.startsWith('battle_')) return '战斗状态监听需要关注';
  if (props.progress.reason === 'user_skipped_adjudication') return '已取消判定 · 正文继续生成';
  if (status === 'capturing' || status === 'routing') return '正在识别本次行动';
  if (status === 'extracting' || status === 'prepared' || status === 'rules_loaded') return `正在准备${label.value}判定`;
  if (status === 'adjudicating') return `正在进行${label.value}判定`;
  if (status === 'validating' || status === 'evaluated') return `正在校验${label.value}判定`;
  if (status === 'persisting') return `正在保存${label.value}处理结果`;
  if (failed.value) return `${label.value}处理需要关注`;
  if (status === 'handed_off') return '已转交战斗工作台';
  if (status === 'cancelled') return '判定已停止';
  return '处理完成 · 正文继续生成';
});
const description = computed(() => props.progress.status?.startsWith('battle_') ? props.progress.reason || '只准备战斗资料，不追加正文。' : failed.value ? '查看运行日志了解失败阶段；已提交结果不会重复执行。' : busy.value ? '后台处理中。取消判定将直接交给主 AI 续写。' : ['user_skipped_adjudication','adjudication_failed_open'].includes(props.progress.reason) ? '本次不注入裁定结果，诊断已记录在运行日志。' : '处理记录已保存在日志页。');
function cancel() { cancelRequested.value = true; emit('cancel'); }
watch(() => props.progress, value => {
  clearTimeout(dismissTimer);
  if (value.status === 'ready') { visible.value = false; clearInterval(elapsedTimer); return; }
  if (['capturing', 'battle_preparing'].includes(value.status)) { domain.value = ''; cancelRequested.value = false; started = Date.now(); elapsed.value = 0; }
  if (value.domain) domain.value = value.domain;
  visible.value = true;
  clearInterval(elapsedTimer);
  if (busy.value) { started ||= Date.now(); elapsedTimer = setInterval(() => { elapsed.value = Math.floor((Date.now() - started) / 1000); }, 1000); }
  else if (!failed.value) dismissTimer = setTimeout(() => { visible.value = false; }, 4500);
}, { immediate: true });
onUnmounted(() => { clearTimeout(dismissTimer); clearInterval(elapsedTimer); });
</script>

<style scoped>
.xy-event-progress { position: fixed; top: max(56px, env(safe-area-inset-top)); right: max(20px, env(safe-area-inset-right)); width: min(340px, calc(100vw - 32px)); box-sizing: border-box; z-index: 2147483001; padding: 15px 17px 12px; border: 1px solid rgba(95, 202, 221, .38); border-radius: 12px; background: rgba(10, 23, 34, .96); color: #e5f3f5; box-shadow: 0 10px 32px #0005; font: 13px/1.5 system-ui, sans-serif; pointer-events: auto; }
.xy-event-heading { display: flex; align-items: center; gap: 9px; }
.xy-event-heading strong { font-weight: 600; flex: 1; }
.xy-event-heading small, .xy-event-progress p { color: #a5bcc5; }
.xy-event-progress p { margin: 7px 0 12px; font-size: 12px; }
.xy-event-dot { width: 7px; height: 7px; border-radius: 50%; background: #60d4c7; }
.xy-event-dot.active { animation: xy-event-pulse 1.5s ease-in-out infinite; }
.xy-event-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; font-size: 12px; }
.xy-event-actions button { border: 1px solid #7899a644; border-radius: 6px; padding: 5px 10px; background: #203c4b; color: #d8edf4; cursor: pointer; font: inherit; }
.xy-event-actions .xy-event-cancel { background: transparent; color: #e2ccaa; }
.xy-event-actions button:hover, .xy-event-actions button:focus-visible { outline: 1px solid #7dd3fc; }
.is-error { border-color: #dca570; }
@keyframes xy-event-pulse { 50% { opacity: .35; } }
@media (prefers-reduced-motion: reduce) { .xy-event-dot.active { animation: none; } }
@media (max-width: 600px) { .xy-event-progress { top: 48px; right: 16px; } }
</style>
