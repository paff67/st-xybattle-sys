<template>
  <header class="xy-header">
    <div class="xy-header-left">
      <div class="xy-brand-seal">
        <span class="xy-seal-symbol">弦</span>
      </div>
      <div class="xy-header-titles">
        <div class="xy-kicker">
          <span>XY BATTLE SYSTEM</span>
          <span class="xy-kicker-dot">·</span>
          <span>叠浪玄潮决</span>
          <span class="xy-kicker-dot">·</span>
          <span class="xy-scope-pill" :title="'作用域: ' + scope.chatId + ' / ' + scope.branchId">
            {{ scope.chatId }} / {{ scope.branchId }}
          </span>
        </div>
        <h1 class="xy-title">
          <span class="xy-title-text">{{ scene.location || '待定战场' }}</span>
          <span class="xy-round-seal" v-if="round > 0">第 {{ round }} 回合</span>
        </h1>
        <p class="xy-subtitle">
          <span>{{ scene.time || '时辰未定' }}</span>
          <span class="xy-sep">|</span>
          <span>{{ scene.initiative || '均势先发' }}</span>
          <span class="xy-sep">|</span>
          <span class="xy-control-state" :class="controlTone">{{ semanticState['压制'] || semanticState.control || '均势' }}</span>
        </p>
      </div>
    </div>

    <!-- 中部标签页导航 (Award-Winning Clean Navigation) -->
    <nav class="xy-nav-tabs">
      <button 
        v-for="t in tabs" 
        :key="t.id"
        class="xy-tab-btn"
        :class="{ active: currentTab === t.id }"
        @click="$emit('update:tab', t.id)"
      >
        <Icons :name="t.icon" class="xy-tab-icon" />
        <span>{{ t.label }}</span>
        <span v-if="t.id === 'developer' && logCount > 0" class="xy-tab-badge">{{ logCount }}</span>
      </button>
    </nav>

    <!-- 右侧状态指示与控制 -->
    <div class="xy-header-right">
      <div class="xy-phase-indicator" :class="'phase-' + phase">
        <span class="xy-phase-pulse"></span>
        <span class="xy-phase-name">{{ phaseLabel }}</span>
      </div>

      <div class="xy-meta-tag">
        <span class="xy-meta-mode">{{ modeLabel }}</span>
        <span class="xy-meta-ver">v{{ version }}</span>
      </div>

      <button class="xy-close-btn" @click="$emit('close')" aria-label="关闭工作台" title="关闭 (Esc)">
        <Icons name="close" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import Icons from './Icons.vue';

const props = defineProps({
  scene: { type: Object, default: () => ({}) },
  semanticState: { type: Object, default: () => ({}) },
  round: { type: Number, default: 0 },
  version: { type: Number, default: 1 },
  phase: { type: String, default: 'idle' },
  scope: { type: Object, default: () => ({ chatId: '', branchId: '' }) },
  currentTab: { type: String, default: 'workbench' },
  adjudicatorMode: { type: String, default: 'unconfigured' },
  logCount: { type: Number, default: 0 }
});

defineEmits(['update:tab', 'close']);

const tabs = [
  { id: 'workbench', label: '战场对决', icon: 'swords' },
  { id: 'settings', label: '独立机枢', icon: 'settings' },
  { id: 'data', label: '演武经卷', icon: 'scroll' },
  { id: 'developer', label: '天道秘录', icon: 'search' }
];

const phaseMap = {
  idle: '待战 (IDLE)',
  awaiting_player: '玩家决策中',
  judging: '天道裁定中…',
  committed: '裁定已确立',
  narrating: '正文演进中…',
  awaiting_next: '待启下一回合',
  ended: '战局已终',
  rewrite: '重写裁定记录'
};

const phaseLabel = computed(() => phaseMap[props.phase] || props.phase);

const modeLabel = computed(() => {
  const m = {
    http: '真实模型',
    mock: '离线演示',
    main_story: '主剧情桥接',
    packet: '场景包',
    unconfigured: '未配模型'
  };
  return m[props.adjudicatorMode] || props.adjudicatorMode;
});

const controlTone = computed(() => {
  const ctrl = props.semanticState['压制'] || props.semanticState.control || '';
  if (ctrl.includes('主角') || ctrl.includes('胜')) return 'tone-player';
  if (ctrl.includes('敌') || ctrl.includes('劣')) return 'tone-enemy';
  return 'tone-neutral';
});
</script>

<style scoped>
.xy-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 32px 10px;
  background: linear-gradient(180deg, rgba(8, 18, 32, 0.95) 0%, rgba(5, 12, 22, 0.8) 100%);
  border-bottom: 1px solid var(--xy-border-subtle);
  backdrop-filter: blur(16px);
  user-select: none;
  flex-shrink: 0;
}

.xy-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.xy-brand-seal {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.25), rgba(7, 16, 30, 0.95));
  border: 1px solid var(--xy-border-glow);
  box-shadow: 0 0 16px var(--xy-cyan-glow), inset 0 0 10px rgba(56, 189, 248, 0.2);
  flex-shrink: 0;
}

.xy-seal-symbol {
  font-family: var(--xy-font-serif);
  font-size: 24px;
  font-weight: 600;
  color: var(--xy-cyan-300);
  text-shadow: 0 0 8px var(--xy-cyan-400);
}

.xy-kicker {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.16em;
  color: var(--xy-cyan-400);
  text-transform: uppercase;
  font-family: var(--xy-font-mono);
}

.xy-kicker-dot {
  color: var(--xy-text-muted);
}

.xy-scope-pill {
  color: var(--xy-text-muted);
  font-size: 9px;
  background: rgba(255, 255, 255, 0.04);
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.xy-title {
  margin: 2px 0 3px;
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.xy-title-text {
  font-family: var(--xy-font-serif);
  font-size: 24px;
  font-weight: 500;
  color: var(--xy-text-title);
  letter-spacing: 0.06em;
  background: linear-gradient(135deg, #ffffff 0%, #bae6fd 60%, #7dd3fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.xy-round-seal {
  font-family: var(--xy-font-serif);
  font-size: 11px;
  color: var(--xy-gold-300);
  padding: 2px 8px;
  border: 1px solid var(--xy-border-gold);
  border-radius: 4px;
  background: rgba(251, 191, 36, 0.08);
  letter-spacing: 0.1em;
}

.xy-subtitle {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--xy-text-muted);
}

.xy-sep {
  color: rgba(255, 255, 255, 0.12);
}

.xy-control-state {
  font-weight: 500;
}
.tone-player { color: var(--xy-cyan-300); text-shadow: 0 0 6px var(--xy-cyan-glow); }
.tone-enemy { color: var(--xy-crimson-400); text-shadow: 0 0 6px var(--xy-crimson-glow); }
.tone-neutral { color: var(--xy-gold-300); }

/* Navigation Tabs (液态玻璃导航胶囊 Liquid Glass Tabs) */
.xy-nav-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, rgba(8, 20, 38, 0.6) 0%, rgba(4, 12, 24, 0.75) 100%);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  padding: 4px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.18), inset 0 -1px 2px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.35);
}

.xy-tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--xy-text-muted);
  font-size: 13px;
  font-family: var(--xy-font-sans);
  cursor: pointer;
  transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

.xy-tab-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.xy-tab-btn.active {
  color: #ffffff;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.35) 0%, rgba(14, 165, 233, 0.15) 100%);
  border: 1px solid rgba(125, 211, 252, 0.4);
  box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.4), 0 4px 16px rgba(56, 189, 248, 0.25);
}

.xy-tab-badge {
  font-size: 10px;
  font-family: var(--xy-font-mono);
  background: rgba(56, 189, 248, 0.2);
  color: var(--xy-cyan-300);
  padding: 1px 6px;
  border-radius: 999px;
}

/* Header Right */
.xy-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.xy-phase-indicator {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-family: var(--xy-font-mono);
  letter-spacing: 0.08em;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.xy-phase-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.phase-idle { color: var(--xy-text-muted); }
.phase-awaiting_player {
  color: var(--xy-cyan-400);
  border-color: var(--xy-border-glow);
  background: rgba(56, 189, 248, 0.08);
}
.phase-awaiting_player .xy-phase-pulse {
  animation: xy-pulse-glow 2s infinite;
}

.phase-judging {
  color: var(--xy-gold-400);
  border-color: var(--xy-border-gold);
  background: rgba(251, 191, 36, 0.1);
}
.phase-judging .xy-phase-pulse {
  animation: xy-pulse-glow 1s infinite;
}

.phase-committed {
  color: var(--xy-jade-400);
  border-color: rgba(45, 212, 191, 0.3);
  background: rgba(45, 212, 191, 0.08);
}

.phase-narrating {
  color: #a78bfa;
  border-color: rgba(167, 139, 250, 0.3);
  background: rgba(167, 139, 250, 0.08);
}

.xy-meta-tag {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 10px;
  color: var(--xy-text-muted);
  font-family: var(--xy-font-mono);
  line-height: 1.3;
}

.xy-meta-mode {
  color: var(--xy-cyan-300);
}

.xy-close-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.25), 0 4px 12px rgba(0, 0, 0, 0.3);
  color: var(--xy-text-muted);
  cursor: pointer;
  transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

.xy-close-btn:hover {
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.25) 0%, rgba(225, 29, 72, 0.1) 100%);
  border-color: rgba(244, 63, 94, 0.5);
  color: #fca5a5;
  box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.4), 0 6px 18px rgba(244, 63, 94, 0.35);
  transform: translateY(-1px);
}
</style>
