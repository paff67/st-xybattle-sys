# 定性战斗状态与 AI 接口（2026-10-08）

本次实现固定能力档案、动态人物状态、持久战场对象与单轮交锋结果分离。程序不计算伤害、固定扣点或自动恢复；只做结构、身份、引用、版本、对象依赖和重复提交检查。状态保存于扩展自己的会话快照，不回写 MVU 生命、灵力等数字。

**本次不修改人物生成与裁定提示词。** 新接口的代码、配置和发布包已经接入；现有默认提示词仍描述旧返回格式。上线使用新战斗前需另行适配提示词，并进行真实模型语义验收。旧提示词返回数值 resourceChanges 时，新战斗会明确拒绝，不静默扣点。本文是接口说明，不自动替换浏览器保存的提示词。

## 数据归属与兼容

| 数据 | 内容 | 修改时机 |
| --- | --- | --- |
| actor.profile | 境界、功法、招式、资源性质、恢复条件、弱点、行为倾向 | 战前生成/本地读取并确认；回合返回无权重写 |
| actor.state | 定性资源、伤势、持续状态、位置、revision | 本轮通过 actorChanges 原子提交 |
| combatLedger | 持续术式、资源批次、锚点、情报及依赖 | combatChanges 原子提交 |
| exchange | 本轮实际行动、交互、结果和边界 | 每轮生成，投影给正文 AI |
| history[].roundSummary | roundId、summary、exchange | 每轮保存；请求只附最近 4 轮摘要 |

内部仍保留 battle_v2 存档外壳与旧显示层字段以兼容宿主。新确认人物会编译成 `battle_actor_state_v1` 状态，固定档案为 `battle_combat_profile_v3_dynamic`。已有旧会话不在恢复时偷偷迁移，继续使用原来的资源协议；重新进行人物准备并确认后进入新协议。

旧人物生成格式仍可读取并确认：原数字存为 numericEvidence，资源性质来自原定义，余裕不换算百分比；原功法文字原样保留，程序不自动把“消耗8点”改写成新规则。后续应由新提示词生成定性消耗定义。主角来自 MVU，数字作为带来源的描述证据；不会生成 0~100 资源账户，功法仍由用户从内容库激活。

## 候选人物生成 AI

返回单个人物 JSON：`{"candidate":{"name":"顾澜","profile":{...},"initialState":{...},"initialCombatObjects":[]}}`。

用户主角仍为许妍；人物接口仅补全敌人。程序对主角使用本地读取路径，拒绝将许妍返回内容当作敌人采信。

### profile 固定档案

| 字段 | 类型与内容要求 |
| --- | --- |
| identity / cultivationRealm / combatStyle | 非空文字，明确身份、境界、战斗方式 |
| martialArts | 非空数组；每项 name、description、principle；limitations 为文字数组 |
| techniques | 非空数组；每项须属于 martialArts 中的一门功法 |
| resourceTraits | 非空数组；资源名称不重复；每项 name、description、depletionConsequences、recoveryConditions（文字或文字数组） |
| behavior | preference、tactics 非空；可附 opening、retreat |
| weaknesses | 非空文字数组，固定限制不能在回合中删除 |
| hidden | 对象，仅供裁定，禁止泄露到公开结果 |

每项 techniques：

```json
{
  "name": "重水棘阵",
  "school": "鲸波御水诀",
  "mechanism": "凝聚重水尖刺，从多个方向封锁目标",
  "conditions": ["附近存在可调动水源"],
  "limits": ["多目标操控加重神识负担"],
  "cost": {
    "resources": ["灵力", "神识"],
    "onUse": "凝炼重水消耗真元，分流控制占用神识",
    "sustaining": "持续维持结构与追踪目标会累积负担",
    "amplifiers": ["扩大范围", "提高密度", "增加目标", "强力对抗"],
    "overuseConsequences": ["控制失稳", "术式中断", "强撑可能反噬"]
  },
  "recovery": {
    "conditions": ["停止维持", "获得调息空间"],
    "effect": "解除神识占用，真元随调息逐渐恢复",
    "limits": ["释放控制不等于补回已经损耗的真元"]
  },
  "counterplay": ["打断施术", "干扰神识"],
  "visibility": "public"
}
```

不要求 current/min/max；不要求固定回合冷却、伤害或扣点公式。cost、recovery 的上述描述字段需要完整。系统把 mechanism 映射到注册表 originalDefinition/mechanics，并生成招式 ID 与 ruleRefs。

### initialState 当前事实

```json
{
  "resources": [{
    "name": "神识",
    "condition": "具体余裕未明确，仍在维持尖刺",
    "burden": "当前多向操控负担",
    "limitations": [],
    "basis": "当前正文中的施术表现",
    "visibility": "internal"
  }],
  "injuries": [],
  "statuses": [],
  "position": "海面浪峰之上"
}
```

resources 的 name 必须属于 profile.resourceTraits，不能重复；未列出的资源初始化为“当前余裕未明确”，不自动满额。伤势、状态可用文字或 `{label,description,visibility,basis}`；程序在确认时赋 ID。空数组表示没有记录，不能据此宣称完全健康。visibility 使用 public/player/internal，敌人缺省为 internal。

### initialCombatObjects：确认时登记已形成的术式

存在跨回合持续术式时，在 candidate 同级返回数组，或放在 initialState.combatObjects：

```json
[{
  "key": "spikes",
  "technique": "重水棘阵",
  "kind": "effect",
  "label": "已形成的重水尖刺",
  "description": "正在封锁许妍周围空间",
  "basis": "当前正文已明确形成并维持尖刺",
  "visibility": "public",
  "positionOrTarget": "许妍周围",
  "dependsOn": []
}]
```

key 是本人物范围内唯一关联键，系统据会话、人物、key 生成内部 ID；technique 必须精确匹配已确认且拥有的招式名称。kind 为 resource/effect/anchor/intel。按依赖先后排列；dependsOn 引用本数组 key 或已有对象 ID。resource 批次键由程序生成；intel 另需 knownTo 人物 ID 数组。没有证据不能为潜在能力创建已生效对象。

初始化有专门提交收据，再次确认不会重建同一批对象，已消散的对象不会复活。程序不会从“正在施术”一句话猜出具体对象和依赖；模型需要返回这部分结构，用户确认后才落账。

## 裁定 AI 输入

新战斗的 user 消息为 `BATTLE_CURRENT_SNAPSHOT` JSON，包含 version、roundId、action 和 context：

- actors.player/enemies：id、name、固定 profile、当前 state、numericEvidence、activatedTechniques。
- scene：环境、战界和本场已知事实。
- combatLedger：revision、对象当前状态及依赖。终结对象保留历史身份，不能重新激活。
- registry/resourceRules：程序注册的能力与有效 ruleRefs。
- priorCommittedFacts：最近最多 4 轮 summary/exchange，不携带旧 after 状态供重新应用。
- session/scope、causalState、规则关联与反例：原有运行环境和因果信息。

当前 state 和账本是状态依据。连续施术、干扰、休整、回收的后果由 AI 判断；不能因为换回合就恢复，也不能把历史效果重新当作当前效果。固定档案中已有的限制持续生效。

## 裁定 AI 返回

新战斗必需 summary、reason、ruleRefs、actorChanges、combatChanges、exchange。publicEvents 可省略（默认空数组）；before/after 可省略，若返回旧 after 则只能保持原样，不能用它修改定性状态。

```json
{
  "summary": "顾澜维持封锁，但控制精度下降",
  "reason": "持续多向操控并抵抗干扰加重神识负担",
  "ruleRefs": ["输入中已有的规则ID"],
  "actorChanges": [{
    "actorId": "输入中的顾澜ID",
    "resources": [{
      "resourceId": "输入中的神识资源ID",
      "condition": "仍能维持主要封锁，难以兼顾外围尖刺",
      "burden": "多向控制与抗干扰负担加重",
      "limitations": ["继续扩大范围会增加失控风险"],
      "reason": "本轮持续施术并承受干扰",
      "ruleRefs": ["输入中的对应规则ID"]
    }]
  }],
  "combatChanges": {"baseRevision": 3, "operations": []},
  "exchange": {
    "playerResult": "对主要封锁形成干扰",
    "techniques": [],
    "opponents": [{
      "actorId": "输入中的顾澜ID",
      "response": "收缩控制范围，维持主要封锁",
      "techniques": [{
        "techniqueId": "输入中的重水棘阵ID",
        "manifestation": "尖刺微颤后重新聚拢",
        "interaction": "集中控制抵抗干扰"
      }],
      "result": "控制精度下降，尚未失去封锁"
    }],
    "environmentResult": "没有额外环境变化",
    "boundaries": ["未形成直接伤势"]
  }
}
```

本例 operations=[] 表示没有持久对象变化。若声称“外围尖刺散开”“术式中断”，必须提交对象 update/retire；文字不能替代状态操作。是否遗漏操作涉及语义，程序不能只靠 JSON 证明文字与事实一致。

### actorChanges 规则

只列变化的人物，actorId 不重复；允许 resources、injuries、statuses、position，不允许 profile/境界/功法等字段。resources 每项整体替换该资源的 condition、burden、limitations，未列出的资源不变；身份、可见性保持不变。每项必须有 reason 和非空有效 ruleRefs，禁止未知/重复 resourceId。

伤势 injuries 与持续状态 statuses 是操作数组：

```json
[
  {"type":"add","operationId":"right-arm-cut","label":"右臂裂伤","description":"牵动时持印受限","visibility":"public","reason":"本轮受击","ruleRefs":["有效规则ID"]},
  {"type":"update","operationId":"worsen","id":"已有状态ID","label":"右臂裂伤","description":"强撑后牵扯加剧","visibility":"public","reason":"强行持印","ruleRefs":["有效规则ID"]},
  {"type":"remove","operationId":"heal","id":"已有状态ID","reason":"本轮治疗完成","ruleRefs":["有效规则ID"]}
]
```

以上展示不同回合的操作形式，不是同轮连续指令。add 不传 id，由程序生成；update/remove 引用当前快照中的稳定 id。同一人物同一类状态不允许重复操作同一 ID，也不允许新增同名伤势，应更新原 ID。异名重复伤势仍需语义验收。

位置：`position:{value:"后撤至浪峰",reason:"本轮规避",ruleRefs:["有效规则ID"]}`。

### combatChanges 规则

沿用对象账本接口。baseRevision 必须等于输入 combatLedger.revision；operations 无变化也返回 []。每项须 operationId、type、reason、ruleRefs。

| type | 额外字段 | 校验 |
| --- | --- | --- |
| create | object:{id,kind,label,description,ownerId,sourceTechniqueId,visibility,positionOrTarget,dependsOn} | 来源招式已拥有、引用其规则、依赖有效且不成环；resource 另需唯一 resourceKey，intel 另需 knownTo |
| update | objectId、patch:{description?,positionOrTarget?,dependsOn?,status?} | 不改归属或来源；status 只允许空闲 resource 从 active 变 dispersed |
| retire | objectId、status:interrupted/expired/consumed/destroyed | 明确终结原因；依赖该对象的活动对象随之失效 |
| reclaim | objectId、techniqueId | 资源须 dispersed 且无活动占用，回收招式已拥有且有 recovery.effect 定义（兼容既有太一回流招式） |

回收对象仅改变占用/回收状态，不自动恢复任何人物资源。实际恢复若成立，另写有依据的 actorChanges。已终结对象不能复活或重复回收。对象 ID 延续已有接口由模型引用/为新对象指定，程序检查全场唯一。

### exchange 与其他字段

- playerResult、environmentResult 非空，boundaries 是文字数组。
- opponents 覆盖每个敌人（未行动也说明维持状态），每项 actorId、response、techniques、result。
- 实际使用招式填 techniqueId、manifestation、interaction；敌人只能使用自己的已确认招式。主角额外实际招式可写 exchange.techniques，必须已手动激活。
- 无实际招式才返回空数组。程序可验证 ID 和所有权，无法从自由文字判断是否漏报了招式。
- battleStatus 可选 ongoing/ended；ended 需要 battleEndReason。causalChanges 沿用原因果事件接口。
- 禁止 resourceChanges 数值结算，禁止返回 actors/profile/registry/combatLedger 等整份替换。
- 无需模型复制版本和旧存档；程序将本次请求 version/actionId 绑定提交。若模型提供 baseVersion/version/actionId，必须匹配。对象版本仍由 baseRevision 核对。
- 正文只接收本轮公开 exchange 与玩家原行动；隐藏档案、内部状态与数值证据不进入场景包。

## 配置与验收

人物生成配置新增 characterMessageCount：1~100，默认 20，按最近消息条数截取，包含用户/助手消息（不等于对话轮数），参与人物识别和敌人补全。characterMaxOutput 直接作为 max_tokens，已移除 4000 截断；沿用裁定 API 时输出预算仍独立。

本地回归覆盖新人物接口、配置实际请求体、多轮消耗/恢复保存、稳定伤势 ID、越权与重复拒绝、旧版本拒绝、战场对象初始化、回收不增加资源、恢复/回滚与公开投影。仍需后续真实模型验收：连续施术负担是否合理，打断是否解除控制但不回满，调息是否具有实际条件，回收是否保留既有损耗，叙述与 actorChanges/operations 是否一致。
