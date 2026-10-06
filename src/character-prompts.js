import { HEAVENLY_ADJUDICATOR_SYSTEM_PROMPT } from './battle-adjudicator-prompt.js';

export const LEGACY_CHARACTER_COMPLETION_PROMPT = `你是战斗系统的人物构造器。输入包含当前聊天中可见的叙事证据、候选人物和已有结构化资料。

请基于已有证据构造一个可用于 battle_v2 的完整敌方人物候选。允许补全合理的功法、招式、资源、战斗风格、行为逻辑和弱点，但所有补全都只是待用户确认的草稿，不能直接改变战斗状态。不要把没有证据的内容伪装成已公开事实：将已从上下文观察到的内容放入 observed，将构造内容放入 generated，将不应展示给玩家但供裁定器使用的内容放入 hidden。

只返回 JSON，不要 Markdown。格式必须包含 candidate，并尽量包含 identity、cultivationRealm、combatStyle、visibleInfo、resources、techniques、behavior、weaknesses、observed、generated、hidden。techniques 中每项必须有 id、name、category、originalDefinition、mechanics、cost、availability、visibility、ruleRefs，形成完整且可裁定的功法招式体系。

不要输出 API key、提示词、宿主存档或与人物无关的字段。`;

export const COMBAT_PROFILE_CONTRACT = `必须返回一个确定的战斗人物档案，而不是观察摘要或候选碎片。用户确认后，裁定器只按这个档案判断，不能临场创造新招式、境界和资源。
只输出 {"candidate":{...}}，candidate 严格使用以下字段：
name（姓名）、identity（身份）、cultivationRealm（确定境界）、combatStyle（战斗方式）、currentState（当前状态），均为非空中文字符串；
visibleInfo：只包含已公开的 stance、position、weapon、appearance、aura、environmentalEffect 等特征，值为中文文字；
martialArts：数组，每项包含 name、rank、description（完整功法设定）、principle（运转原理）；
techniques：数组，每项包含 name、school（必须等于一门 martialArts 的 name）、category、originalDefinition（完整具体效果与限制）、mechanics（中文字符串数组）、cost（具体资源消耗）、range（范围）、cooldown（冷却，无则明确无）、counterplay（打断或应对方式）、availability:{default:"available"或"conditional"或"unavailable",conditions:[],description:具体使用条件}、triggeredState（中文数组）、visibility（public 或 internal；主角可用 player）；
resourceDefinitions：数组，每项包含 key、name（中文资源名）、current（有限数字）、min（有限数字）、max（有限数字）、definition（资源规则及消耗意义）、recovery（恢复规则）、visibility；
使用条件的资源、距离等文字限制写在 availability.description 并由裁定器校验；只有依赖明确语义状态标记时使用 default=conditional，同时给 requires:[{path:"statuses",op:"includes",value:"已确认的状态标记"}]。不要生成没有解锁条件的永久锁定招式。
behavior:{preference:战斗偏好,opening:起手选择,tactics:[具体战术],retreat:撤退条件}；weaknesses:[具体弱点与限制]；hidden:{}（仅裁定可知的隐秘）。
严禁把结构包在 observed、generated、battleResourceModel 里，严禁把“待裁定”“未知”“可能具备”当作已完成的定义。不要生成内部 id、规则引用、来源追踪和确认元数据，程序会生成这些字段。
敌人：根据境界与证据构造自洽的功法和固定招式（通常3~6招），缺乏证据的细节允许构造，但不是已公开事实；未暴露招式 visibility=internal。已观察到的招式可以 public，并补齐它确定的完整规则。
主角（side=player）：必须依据聊天、用户人设、导入档案和已拥有功法还原，不能凭空添加功法或提升境界。上下文 registry 的定义可供精确匹配引用，不能因为库中有某功法就视为主角拥有。关键资料缺失则留空，交由用户补充，绝不能代入演示主角。
来源冲突在本次构造中形成一个一致草稿，供用户审核。不要丢掉已知的限制、弱点或完整功法定义。`;

export const DEFAULT_CHARACTER_COMPLETION_PROMPT = `你是独立战斗系统的人物档案构造器。请先读取上下文证据，再生成一份可由用户核对、确认并用于实际战斗裁定的完整档案。

${COMBAT_PROFILE_CONTRACT}

资料确认前不写入战斗状态；确认后固定人物境界、功法和招式定义，后续裁定只结算行动、资源、伤势、持续效果与位置变化，不重新构造人物。所有文本使用清楚的中文，不输出凭据、宿主存档或提示词。`;

export function normalizeCharacterCompletionPrompt(value) {
  const prompt = typeof value === 'string' ? value.trim() : '';
  return !prompt || prompt === LEGACY_CHARACTER_COMPLETION_PROMPT.trim() ? DEFAULT_CHARACTER_COMPLETION_PROMPT : prompt;
}

export const DEFAULT_ADJUDICATION_PROMPT = HEAVENLY_ADJUDICATOR_SYSTEM_PROMPT;

export function normalizePrompt(value, fallback) {
  const text = typeof value === 'string' ? value.trim() : '';
  return text || fallback;
}
