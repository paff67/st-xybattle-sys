<template>
  <div class="xy-center-stage">
    <!-- 顶部仪轨横额：回合、气象与张力谐波 (Top Resonator & Harmonic Tension) -->
    <div class="xy-center-head">
      <div class="xy-pillar-crest">
        <span class="xy-pillar-crest-dot">☯</span>
        <span class="xy-pillar-title">战状核心枢纽</span>
      </div>

      <!-- 动态声学正弦波 / 灵弦张力可视化仪轨 -->
      <HarmonicGauge 
        :round="round" 
        :semantic-state="semanticState" 
      />

      <!-- 天地气象条 (Weather & Environment) -->
      <div class="xy-center-weather">
        <span class="xy-weather-dot">●</span>
        <span class="xy-weather-text">{{ weatherText }}</span>
      </div>
    </div>

    <!-- 中部内容动态切换：心法玉简检视 VS 战况实录推演 (Dynamic Center Content) -->
    <div class="xy-center-body xy-custom-scroll">
      <!-- 模式 A：选中功法羽翼时，呈现玉简密卷检视 -->
      <Transition name="center-fade" mode="out-in">
        <div v-if="selectedTermData" class="xy-term-scroll-view" key="term">
          <div class="xy-scroll-top-bar">
            <div class="xy-scroll-badge">
              <span>📜 {{ selectedTermSide === 'player' ? '主角传承' : '敌手破招' }}</span>
              <span class="xy-badge-sep">·</span>
              <span class="xy-badge-origin">{{ selectedTermParentName }}</span>
            </div>

            <button class="xy-scroll-close-btn" @click="$emit('clear-term')" title="返回战况">✕</button>
          </div>

          <h4 class="xy-scroll-tech-title">
            <span class="xy-bracket">【</span>
            <span class="xy-tech-name-glow">{{ selectedTermData.name }}</span>
            <span class="xy-bracket">】</span>
            <span class="xy-tech-status-chip" :class="termStatusTone">
              {{ termStatusText }}
            </span>
          </h4>

          <!-- 古经阐义 -->
          <blockquote class="xy-scroll-quote">
            <p>{{ termQuoteText }}</p>
          </blockquote>

          <!-- 机制与触发 -->
          <div class="xy-scroll-details">
            <div v-if="termMechanics.length" class="xy-detail-block">
              <span class="xy-detail-label">⚙ 演化机制</span>
              <ul class="xy-detail-list">
                <li v-for="(m, i) in termMechanics" :key="i">{{ m }}</li>
              </ul>
            </div>

            <div v-if="termTriggers.length" class="xy-detail-block">
              <span class="xy-detail-label">⚡ 触发态势</span>
              <ul class="xy-detail-list">
                <li v-for="(t, i) in termTriggers" :key="i">{{ t }}</li>
              </ul>
            </div>

            <div v-if="selectedTermSide === 'player'" class="xy-detail-block">
              <span class="xy-detail-label">⚖ 本轮机缘</span>
              <p class="xy-cond-text" :class="isTermAvailable ? 'pass' : 'fail'">
                {{ termConditionReason }}
              </p>
            </div>

            <div v-if="termRuleRefs.length" class="xy-detail-block">
              <span class="xy-detail-label">💠 规制出处</span>
              <div class="xy-rule-tags">
                <span v-for="r in termRuleRefs" :key="r" class="xy-rule-tag">{{ r }}</span>
              </div>
            </div>
          </div>

          <!-- 快捷选用按钮 -->
          <div v-if="selectedTermSide === 'player' && isTermAvailable" class="xy-scroll-action">
            <button class="xy-pick-tech-btn" @click="$emit('apply-technique', selectedTermData.id)">
              <span>选用此招并起势</span>
              <span class="xy-btn-arrow">→</span>
            </button>
          </div>
        </div>

        <!-- 模式 B：未选中心法时，呈现当前阵位与最新战状判词推演 -->
        <div v-else class="xy-situation-view" key="situation">
          <!-- 阵位对峙图示 (Positions & Distance) -->
          <div class="xy-positions-card">
            <div class="xy-pos-header">
              <span class="xy-pos-crest">⚔</span>
              <span>两仪站位与间距</span>
            </div>
            <div class="xy-pos-clash">
              <div class="xy-pos-node player">
                <span class="xy-node-name">{{ player?.name || '主角' }}</span>
                <span class="xy-node-val">{{ playerPos }}</span>
              </div>
              <div class="xy-pos-bridge">
                <span class="xy-bridge-dist">{{ distanceText }}</span>
                <span class="xy-bridge-line"></span>
              </div>
              <div class="xy-pos-node enemy">
                <span class="xy-node-name">{{ currentEnemy?.name || '敌修' }}</span>
                <span class="xy-node-val">{{ enemyPos }}</span>
              </div>
            </div>
          </div>

          <!-- 灵力关键态势标签 (潮眼、回弦等) -->
          <div class="xy-semantic-grid" v-if="semanticTags.length">
            <div v-for="tag in semanticTags" :key="tag.key" class="xy-sem-card" :class="{ active: tag.active }">
              <span class="xy-sem-k">{{ tag.key }}</span>
              <span class="xy-sem-v">{{ tag.val }}</span>
            </div>
          </div>

          <!-- 最新裁定批词 / 战史推演 (Latest Committed Narrative Record) -->
          <div class="xy-verdict-card">
            <div class="xy-verdict-header">
              <span class="xy-verdict-title">天道裁定战状判词</span>
              <span v-if="latestRecord" class="xy-verdict-round">第 {{ latestRecord.round }} 回合</span>
            </div>

            <div v-if="latestRecord" class="xy-verdict-body">
              <p class="xy-verdict-action">
                <b>行止动作:</b> {{ latestRecord.actionLabel || latestRecord.techniqueId || '自由出招' }}
              </p>
              <div v-if="latestRecord.narrative?.text" class="xy-verdict-prose">
                <p>{{ latestRecord.narrative.text }}</p>
              </div>
              <p v-else-if="latestRecord.outcomeSummary" class="xy-verdict-summary">
                <b>战局变化:</b> {{ latestRecord.outcomeSummary }}
              </p>
              <p v-else class="xy-verdict-await">
                裁定已落，正文撰刻中……
              </p>
            </div>
            <div v-else class="xy-verdict-empty">
              <span>战局未启 · 请修士在下方输入心念行止并提交裁定</span>
            </div>
          </div>

          <!-- 查看战史抽屉入口 -->
          <button class="xy-view-timeline-btn" @click="$emit('open-history')">
            <span>📜 查阅完整战史演进与天道批注</span>
          </button>
        </div>
      </Transition>
    </div>

    <!-- 底部天道印记状态 (Bottom Pillar Footer) -->
    <div class="xy-center-footer">
      <span class="xy-footer-pulse"></span>
      <span class="xy-footer-status">{{ footerStatusText }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import HarmonicGauge from './HarmonicGauge.vue';

const props = defineProps({
  round: { type: Number, default: 0 },
  phase: { type: String, default: 'idle' },
  semanticState: { type: Object, default: () => ({}) },
  allEffects: { type: Array, default: () => [] },
  player: { type: Object, default: () => ({}) },
  currentEnemy: { type: Object, default: () => ({}) },
  latestRecord: { type: Object, default: null },
  selectedTermData: { type: Object, default: null },
  selectedTermSide: { type: String, default: 'player' },
  selectedTermParentName: { type: String, default: '' },
  selectedTermAvailability: { type: Object, default: () => ({ available: true, reason: '' }) }
});

defineEmits(['clear-term', 'apply-technique', 'open-history']);

// 天地气象
const weatherText = computed(() => {
  const fieldEffects = props.allEffects?.filter(e => e.lane === 'field') || [];
  if (fieldEffects.length) {
    return fieldEffects.map(e => e.label).join(' · ');
  }
  return '天地肃穆 · 水平如镜';
});

// 站位
const playerPos = computed(() => {
  return props.semanticState.positions?.[props.player?.id] || props.player?.visibleInfo?.position || props.semanticState['主角站位'] || '站位未明';
});

const enemyPos = computed(() => {
  const eId = props.currentEnemy?.id || 'enemy-1';
  return props.semanticState.positions?.[eId] || props.currentEnemy?.visibleInfo?.position || props.semanticState['敌方站位'] || '站位未明';
});

const distanceText = computed(() => {
  return props.semanticState['间距'] || props.semanticState.distance || '距离未明';
});

// 关键语义标签
const semanticTags = computed(() => {
  const s = props.semanticState;
  const list = [];
  const importantKeys = ['潮眼', '回弦', '破绽'];
  for (const k of importantKeys) {
    if (s[k] !== undefined && s[k] !== null) {
      const active = Boolean(s[k]);
      let val = s[k];
      if (typeof val === 'boolean') val = val ? '已凝显' : '潜隐';
      else if (Array.isArray(val)) val = val.length ? val.join('、') : '无破绽';
      list.push({ key: k, val: String(val), active });
    }
  }
  return list;
});

// 玉简属性计算
const termQuoteText = computed(() => {
  const t = props.selectedTermData;
  if (!t) return '';
  return t.rawDescription || t.originalDefinition || t.description || '暂无古籍阐发';
});

const termMechanics = computed(() => props.selectedTermData?.mechanics || []);
const termTriggers = computed(() => props.selectedTermData?.triggeredState || []);
const termRuleRefs = computed(() => props.selectedTermData?.ruleRefs || []);

const isTermAvailable = computed(() => {
  if (props.selectedTermSide !== 'player') return true;
  return props.selectedTermAvailability?.available ?? true;
});

const termConditionReason = computed(() => {
  return props.selectedTermAvailability?.reason || (isTermAvailable.value ? '契合当前环境，随时可发' : '前置弦势未足');
});

const termStatusTone = computed(() => {
  if (props.selectedTermSide === 'player') {
    return isTermAvailable.value ? 'status-pass' : 'status-fail';
  }
  return 'status-observe';
});

const termStatusText = computed(() => {
  if (props.selectedTermSide === 'player') {
    return isTermAvailable.value ? '本轮可用' : '机缘未备';
  }
  return '公开可察招式';
});

const footerStatusText = computed(() => {
  if (props.phase === 'judging') return '天道推演裁定中……';
  if (props.phase === 'narrating') return '正文撰刻中……';
  if (props.phase === 'awaiting_player') return '天道神念就绪 · 请修士落子起弦';
  if (props.phase === 'awaiting_next') return '裁定已确立 · 静候进发下一轮';
  return '灵台安宁 · 待启战局';
});
</script>

<style scoped>
.xy-center-stage {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: linear-gradient(180deg, rgba(10, 22, 38, 0.95) 0%, rgba(5, 12, 22, 0.98) 100%);
  border: 1px solid var(--xy-border-subtle);
  border-radius: 12px;
  backdrop-filter: blur(24px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;
  user-select: none;
}

/* 顶部仪轨 */
.xy-center-head {
  padding: 12px 16px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
  background: rgba(7, 16, 30, 0.5);
}

.xy-pillar-crest {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--xy-font-serif);
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--xy-gold-400);
}

.xy-pillar-crest-dot {
  font-size: 13px;
}

.xy-center-weather {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.16);
  font-size: 10px;
  color: var(--xy-cyan-200);
}

.xy-weather-dot {
  color: var(--xy-cyan-400);
  font-size: 6px;
}

/* 中部滑动区域 */
.xy-center-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 模式 A：玉简经文检视 */
.xy-term-scroll-view {
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: view-in 0.2s var(--xy-ease-out-expo);
}

.xy-scroll-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.xy-scroll-badge {
  font-size: 10px;
  font-family: var(--xy-font-serif);
  color: var(--xy-gold-400);
  display: flex;
  gap: 5px;
}

.xy-scroll-close-btn {
  background: transparent;
  border: 0;
  color: var(--xy-text-muted);
  font-size: 14px;
  cursor: pointer;
  padding: 2px 6px;
}

.xy-scroll-close-btn:hover {
  color: var(--xy-crimson-400);
}

.xy-scroll-tech-title {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--xy-font-serif);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.06em;
}

.xy-tech-name-glow {
  background: linear-gradient(135deg, #ffffff 0%, #bae6fd 60%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.xy-bracket {
  color: var(--xy-cyan-400);
  opacity: 0.6;
}

.xy-tech-status-chip {
  font-size: 10px;
  font-family: var(--xy-font-mono);
  padding: 2px 7px;
  border-radius: 999px;
}

.status-pass {
  background: rgba(45, 212, 191, 0.15);
  border: 1px solid rgba(45, 212, 191, 0.4);
  color: var(--xy-jade-300);
}

.status-fail {
  background: rgba(251, 191, 36, 0.15);
  border: 1px solid rgba(251, 191, 36, 0.4);
  color: var(--xy-gold-300);
}

.status-observe {
  background: rgba(244, 63, 94, 0.15);
  border: 1px solid rgba(244, 63, 94, 0.4);
  color: var(--xy-crimson-300);
}

.xy-scroll-quote {
  margin: 0;
  padding: 8px 12px;
  border-left: 2px solid var(--xy-gold-400);
  background: rgba(251, 191, 36, 0.05);
  border-radius: 0 6px 6px 0;
  font-family: var(--xy-font-serif);
  font-size: 12px;
  line-height: 1.6;
  color: var(--xy-cyan-100);
}

.xy-scroll-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.xy-detail-block {
  background: rgba(7, 16, 30, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  padding: 8px 10px;
}

.xy-detail-label {
  font-family: var(--xy-font-serif);
  font-size: 10px;
  color: var(--xy-gold-300);
  display: block;
  margin-bottom: 4px;
}

.xy-detail-list {
  margin: 0;
  padding-left: 14px;
  font-size: 11px;
  line-height: 1.5;
  color: var(--xy-text-body);
}

.xy-cond-text {
  margin: 0;
  font-size: 11px;
}
.xy-cond-text.pass { color: var(--xy-jade-300); }
.xy-cond-text.fail { color: var(--xy-gold-300); }

.xy-rule-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.xy-rule-tag {
  font-family: var(--xy-font-mono);
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 3px;
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: var(--xy-cyan-200);
}

.xy-scroll-action {
  margin-top: 4px;
}

.xy-pick-tech-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid var(--xy-cyan-400);
  background: linear-gradient(135deg, rgba(2, 132, 199, 0.8) 0%, rgba(3, 105, 161, 0.9) 100%);
  color: #ffffff;
  font-family: var(--xy-font-serif);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px var(--xy-cyan-glow);
}

.xy-pick-tech-btn:hover {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  transform: translateY(-1px);
}

/* 模式 B：战况推演与对峙 */
.xy-situation-view {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.xy-positions-card {
  background: rgba(7, 16, 30, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px 12px;
}

.xy-pos-header {
  font-family: var(--xy-font-serif);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--xy-gold-400);
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
}

.xy-pos-clash {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.xy-pos-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.xy-node-name {
  font-size: 10px;
  color: var(--xy-text-muted);
}

.xy-node-val {
  font-family: var(--xy-font-serif);
  font-size: 13px;
  font-weight: 500;
}

.xy-pos-node.player .xy-node-val { color: var(--xy-cyan-300); }
.xy-pos-node.enemy .xy-node-val { color: var(--xy-crimson-400); }

.xy-pos-bridge {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 0 12px;
}

.xy-bridge-dist {
  font-family: var(--xy-font-mono);
  font-size: 9px;
  color: var(--xy-gold-300);
  margin-bottom: 3px;
}

.xy-bridge-line {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, #38bdf8 0%, #fbbf24 50%, #fb7185 100%);
  opacity: 0.6;
}

/* 语义状态标签流 */
.xy-semantic-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.xy-sem-card {
  padding: 5px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.xy-sem-card.active {
  background: rgba(45, 212, 191, 0.08);
  border-color: rgba(45, 212, 191, 0.3);
}

.xy-sem-k {
  font-size: 9px;
  color: var(--xy-text-muted);
}

.xy-sem-v {
  font-family: var(--xy-font-mono);
  font-size: 10px;
  color: var(--xy-text-body);
}

.xy-sem-card.active .xy-sem-v {
  color: var(--xy-jade-300);
}

/* 战况判词卡 */
.xy-verdict-card {
  background: rgba(7, 16, 30, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.xy-verdict-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--xy-font-serif);
  font-size: 11px;
  color: var(--xy-gold-400);
}

.xy-verdict-round {
  font-family: var(--xy-font-mono);
  font-size: 9px;
  color: var(--xy-text-muted);
}

.xy-verdict-body {
  font-size: 11px;
  line-height: 1.5;
  color: var(--xy-text-body);
}

.xy-verdict-action {
  margin: 0 0 4px;
  color: var(--xy-cyan-200);
}

.xy-verdict-prose p {
  margin: 0;
  color: #e2e8f0;
}

.xy-verdict-summary {
  margin: 0;
  color: #cbd5e1;
}

.xy-verdict-await {
  margin: 0;
  color: var(--xy-text-muted);
  font-style: italic;
}

.xy-verdict-empty {
  font-size: 11px;
  color: var(--xy-text-hint);
  font-style: italic;
  text-align: center;
  padding: 10px 0;
}

.xy-view-timeline-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: var(--xy-text-muted);
  font-size: 11px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.xy-view-timeline-btn:hover {
  background: rgba(56, 189, 248, 0.1);
  border-color: rgba(56, 189, 248, 0.3);
  color: var(--xy-cyan-200);
}

/* 底部状态 */
.xy-center-footer {
  padding: 8px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(4, 9, 18, 0.6);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: var(--xy-text-muted);
  flex-shrink: 0;
}

.xy-footer-pulse {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--xy-cyan-400);
  animation: xy-pulse-glow 2s infinite;
}

@keyframes view-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
