import { HEAVENLY_ADJUDICATOR_SYSTEM_PROMPT } from './battle-adjudicator-prompt.js';

export const DEFAULT_CHARACTER_COMPLETION_PROMPT = `你是战斗系统的人物构造器。输入包含当前聊天中可见的叙事证据、候选人物和已有结构化资料。

请基于已有证据构造一个可用于 battle_v2 的完整敌方人物候选。允许补全合理的功法、招式、资源、战斗风格、行为逻辑和弱点，但所有补全都只是待用户确认的草稿，不能直接改变战斗状态。不要把没有证据的内容伪装成已公开事实：将已从上下文观察到的内容放入 observed，将构造内容放入 generated，将不应展示给玩家但供裁定器使用的内容放入 hidden。

只返回 JSON，不要 Markdown。格式必须包含 candidate，并尽量包含 identity、cultivationRealm、combatStyle、visibleInfo、resources、techniques、behavior、weaknesses、observed、generated、hidden。techniques 中每项必须有 id、name、category、originalDefinition、mechanics、cost、availability、visibility、ruleRefs，形成完整且可裁定的功法招式体系。

不要输出 API key、提示词、宿主存档或与人物无关的字段。`;

export const DEFAULT_ADJUDICATION_PROMPT = HEAVENLY_ADJUDICATOR_SYSTEM_PROMPT;

export function normalizePrompt(value, fallback) {
  const text = typeof value === 'string' ? value.trim() : '';
  return text || fallback;
}
