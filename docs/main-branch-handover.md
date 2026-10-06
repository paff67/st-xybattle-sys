# st-xybattle-sys `main` 分支交接文档

> 基线提交：`6e43c36`（`feat: require confirmed AI-built opponents`）
>
> 发布目标分支：`origin/main`
>
> 本次进度更新：2026-10-06，确定战斗档案、主角接入与层级展示修复（具体发布提交以 Git 历史为准）
>
> 适用目录：`E:/RP/st-xybattle-sys`
>
> 文档目的：说明当前 `main` 的真实代码实现、运行边界、发布方式和后续接手注意事项。

## 0. 最新开发进度（2026-10-06）

本次修复基于已发布的 `a5bb7ad`。上一版只改善滚动和确认入口，仍将任意 AI 字段堆叠到人物中，主角没有进入准备流程，敌方招式与资源也没有完整接入规则表；这些是本次真实环境反馈暴露的主要缺口。

### 当前实现

- **确定战斗档案**：新增 `src/combat-profile.js`，使用 `battle_combat_profile_v2` 规范身份、境界、战斗方式、当前状态、功法完整设定、固定招式、资源、战斗偏好和弱点。完整构造结果整体成为待确认档案，原始来源与冲突留在审核元数据中，避免混入 `observed/generated` 等包装层。
- **补全提示词同步更新**：默认提示词明确每个功法的设定与原理、每招的效果/机制/消耗/范围/冷却/使用条件/反制，以及资源的数值边界。旧版默认提示词自动迁移；用户自定义提示词保留，发送请求时追加固定输出契约。主角按已有资料还原，敌方允许构造合理且固定的设定；缺失主角能力不得用演示功法代替。
- **输出额度与修复**：人物档案独立使用 `characterMaxOutput`，默认 8000，设置页可修改。检测输出截断；档案不完整时自动修复一次。仍不完整时保留已生成的部分供编辑，不能直接开战。
- **主角接入**：宿主模式先从最近聊天、用户人设、角色卡证据识别主角与敌人，再读取匹配的 MVU/数据库并分别生成档案。主角也必须核对确认，不能移除。确认时一起替换主角与敌方，避免演示主角留在正式对局。旧版确认记录在下一次启战时重新进入准备；进行中的旧战斗应先停止再启战。
- **写入与裁定闭环**：确认时完整性校验，原子写入 actors、当前 Registry snapshot 与 resourceRules。主角招式变为真实可选的 Registry 所有权引用；敌人保留固定招式定义。裁定 prompt 带完整战斗偏好、弱点、招式和资源规则，禁止每轮重新生成能力。资源结算同步当前值，站位按已提交 semanticState 投影；人物定义保持固定。
- **层级资料页**：只展示基本人物资料和影响战斗的要素；功法、招式、资源等分组和子条目默认折叠。普通资料区不展示内部编号、规则 ID、来源包装和未知技术字段；原始 JSON 留在高级区。支持直接编辑与添加列表条目，修改后撤销核对，缺失字段明确提示并阻止确认。
- **正式战场**：`BattleStage` 使用玩家视图中的敌人，不再读取内部敌方对象。角色卡只显示中文公开特征，中英同义字段去重，武器结构转换为可读文字；敌人资源不进入玩家界面。公开招式显示完整已确认定义、消耗、范围、冷却和反制；内部招式仍只供裁定使用，不自动公开。

### 验证与实机边界

- `npm test`：**114/114** 通过；`npm run lint` 和 `npm run build` 通过。
- 增加完整档案→双方确认→规则注册→裁定请求→资源结算/站位更新的代码回归；覆盖旧提示词迁移、自定义保留、结构修复、缺失字段拦截、层级折叠和内部字段隐藏。
- 按用户要求不执行 Playwright。本次未调用真实模型，也未验证真实宿主的布局和生成结果质量。
- 更新扩展并刷新后，已有旧战局请先停止，再启战重新读取双方资料。打开独立机枢检查候选人物补全提示词与输出上限；缺失提示需补全或重新生成。
- 待用户实机验收：角色识别与资料来源是否准确；固定功法招式是否完整且自洽；双方确认后战场显示、行动裁定、正文 extra/swipe 回写、下一回合与删除消息回滚。

## 1. 系统定位

`st-xybattle-sys` 是一个独立的 SillyTavern `battle_v2` 扩展。它在酒馆页面中挂载独立的 Vue 3 战斗工作台，自己维护战斗状态、功法 Registry、分支存档、裁定日志和可选的正文场景包桥接。

核心原则：

- 战斗裁定与主剧情正文分两阶段处理。
- 战斗状态按 `chatId + branchId` 隔离。
- 正式宿主战斗中，主角和敌方都必须生成完整档案并由用户确认，才进入本场裁定上下文。
- AI 返回值必须经过程序校验，不能直接修改完整战斗状态。
- 玩家视图、公开战报和场景包不暴露敌方 `hidden`、内部资源或运行时凭据。
- 同一 `actionId` 重试时返回已有记录，不重复裁定。

## 2. 目录与职责

### 2.1 入口和发布产物

| 路径 | 职责 |
| --- | --- |
| `index.js` | SillyTavern 加载入口，调用 `mountBattleSystem()` |
| `src/index.js` | 导出挂载函数、控制器、宿主适配器、内容库和桥接 API |
| `src/ui/mount.js` | 创建独立根节点、创建 `BattleController`、挂载 Vue App，并暴露 `globalThis.XYBattle` |
| `dist/battle-ui.bundle.js` | Vite 生成的、内嵌 Vue 运行时的独立浏览器 bundle |
| `third-party/st-xybattle-sys/` | 同步后的可直接复制到 SillyTavern 的分发目录 |
| `scripts_sync.mjs` | 将根目录源码、样例、schema、dist 同步到分发目录 |
| `manifest.json` | 扩展名称、版本、入口和样式声明 |

分发目录中的 `src/battle-ui.js` 被构建脚本写成：

~~~js
export { mountBattleSystem } from '../dist/battle-ui.bundle.js';
~~~

因此酒馆不需要安装 Vue，也不会遇到浏览器裸模块 `import 'vue'` 解析错误。

### 2.2 领域核心

| 路径 | 职责 |
| --- | --- |
| `src/battle-controller.js` | 生命周期编排、作用域切换、人物准备、提交、宿主持久化、场景包注入 |
| `src/battle-state.js` | `battle_v2` 状态机、裁定请求、裁定校验、历史记录、正文场景包 |
| `src/battle-storage.js` | 按聊天和分支保存 session、logs、settings |
| `src/causal-state.js` | 分支作用域因果状态、时间推进、持续关系、幂等行动记录 |
| `src/battle-registry.js` | 功法/招式 Registry、快照、查找、可用性判断 |
| `src/canonical-techniques.js` | 内置正式功法集合和兼容别名 |
| `src/battle-context.js` | 从公开角色和战报生成玩家可见敌方招式视图 |
| `src/common.js` | 深拷贝、稳定序列化、脱敏、endpoint 标准化、Abort 检查 |

### 2.3 AI 与提示词

| 路径 | 职责 |
| --- | --- |
| `src/adapters.js` | Mock、OpenAI-compatible HTTP、主剧情桥接、场景包适配器 |
| `src/battle-adjudicator-prompt.js` | 独立裁定 system prompt、结构化裁定 prompt、正文场景包指令 |
| `src/character-prompts.js` | 候选人物补全提示词和默认裁定提示词 |
| `src/character-source-adapters.js` | AI 候选提取/补全、MVU 读取、数据库只读读取 |
| `src/combat-profile.js` | 固定战斗档案规范化、完整性校验、规则注册与公开投影 |
| `src/character-presentation.js` | 人物资料中文标签、折叠树、值展示与表单编辑 |
| `src/character-preparation.js` | 候选合并、来源追踪、冲突展示、用户确认边界 |
| `src/credential-store.js` | 浏览器本地 API Key 存储，Key 不进入普通设置和导出 |

### 2.4 宿主与内容库

| 路径 | 职责 |
| --- | --- |
| `src/host-adapter.js` | SillyTavern 作用域、消息锚点、extra 持久化、主剧情事件订阅 |
| `src/host-input-bridge.js` | 向输入框追加、验证、去重和清理 `BATTLE_SCENE_PACKET` |
| `src/host-display-folding.js` | 只在 DOM 投影层折叠场景包，不修改聊天原文 |
| `src/battle-packet-markers.js` | 场景包 marker、身份、版本和分支校验 |
| `src/content-store.js` | IndexedDB 内容库；无 IndexedDB 时退化为内存存储 |
| `src/content-protocol.js` | 功法/法宝内容 JSON 协议和 schema 校验 |
| `src/content-importer.js` | 预览、冲突检查、原子导入 |

### 2.5 Vue UI

入口是 `src/ui/App.vue`，主要组件如下：

- `StageHeader.vue`：作用域、战场、回合、phase 和导航。
- `BattleStage.vue`：主战场、角色卡、中央战状、行动台。
- `CharacterConfirmationPanel.vue`：战前敌方候选人物读取、编辑、逐项确认。
- `SettingsPanel.vue`：裁定 AI、正文模式、超时、候选补全提示词、裁定提示词。
- `DataPanel.vue`：演示场景、场景 JSON、完整存档、Registry 导入导出。
- `ContentLibraryPanel.vue`：IndexedDB 内容库管理和显式应用到新战局。
- `DeveloperPanel.vue`：AI 上下文、公开日志和开发者审计日志。

## 3. 状态机

代码中的 phase 定义位于 `src/battle-state.js`：

~~~text
idle
  -> awaiting_player       startBattle()
  -> judging               submit() / judgeAndCommit()
  -> committed             裁定通过并写入语义状态
  -> narrating             正文适配器工作中
  -> awaiting_next         正文完成、场景包待生成或宿主保存待确认
  -> ended                 stopBattle() 或下一回合准备
  -> awaiting_player       nextRound()
~~~

恢复时如果检测到 `judging`、`narrating`、`rewrite`、`active` 或 `committed` 中断：

- 已经提交的事实保留；
- 未完成的请求不会自动重发；
- 状态恢复为 `awaiting_next` 或 `awaiting_player`；
- `lastError` 标记“上次操作中断”。

这就是删除消息、刷新页面或请求被取消后的回滚基础：恢复最近一个持久化 checkpoint，而不是简单清空为“等待新的正文消息”。宿主没有可用消息锚点时，`switchScope({ available: false })` 才会清理该作用域的本地 session/logs 并建立空状态。

## 4. 人物准备流程

战斗开始前，`BattleController.prepareCharacters()` 会构造只读上下文：

1. 当前 `chatId`、`branchId`、消息/swipe 作用域。
2. 最近最多 20 条聊天消息，每条最多 4000 字符。
3. 由显式上下文提取的敌方候选。
4. MVU 动态值和 `AutoCardUpdaterAPI` 数据库资料（只读）。
5. AI 识别实际主角与敌方候选，主角人设与角色卡仅作为资料证据。
6. 对主角和每个敌方候选单独调用候选人物补全模型，校验固定战斗档案。

候选合并在 `character-preparation.js` 完成：

- `explicitFacts`、`inferred`、`ai_completed` 等来源逐叶合并；
- 所有来源优先级目前均为 `0`，不会自动判定谁优先；
- 冲突保留全部来源值，UI 明确显示“无自动优先级”；
- AI 构造内容标为“AI 构造草稿”，不是已发生事实；
- `hidden` 只供内部裁定使用，不能进入玩家投影；
- 主角和保留敌方都被用户勾选并点击“确认并开始战斗”后，经完整性校验一起写入 `state.actors`、Registry 和资源规则；
- 未确认候选不能进入 `buildAdjudicationRequest()`。

确认接口是：

~~~js
controller.confirmCharacters(edits, { removeIds })
~~~

`edits` 是用户编辑后的候选字段，`removeIds` 用于删除旧候选或错误候选。确认后会在人物记录中写入 `confirmation.status = 'confirmed'`，并保存作用域和时间。

### AI 人物调用

`createHttpCharacterInference()` 使用 OpenAI-compatible `/chat/completions`：

- 候选提取：只提取人物和上下文事实；
- 候选补全：依据 `characterCompletionPrompt` 与固定输出契约生成完整档案；缺失会修复一次，仍缺失禁止确认；
- 人物生成输出额度 `characterMaxOutput` 默认 8000，与裁定 `maxOutput` 分离；
- 响应要求 JSON object；
- 请求被 Abort 或超时会保留已有可审阅候选，并显示 `AI 构造` 读取失败；
- `timeoutMs` 来自独立机枢设置。代码默认值是 `60000` ms，浏览器可在设置中调整到更长时间。

## 5. 一次战斗行动的数据流

### 5.1 玩家提交

`BattleController.submit({ label, techniqueId, intent })`：

1. 等待宿主初始化和上一轮 checkpoint。
2. 创建 `AbortController`。
3. `buildAdjudicationRequest()` 生成结构化上下文。
4. phase 进入 `judging`，先保存一次 pending attempt。
5. 调用裁定 adapter。

如果带 `techniqueId`，程序会检查：

- Registry 中存在该招式；
- 主角拥有该招式；
- 当前 `semanticState` 满足条件；
- 未满足时直接拒绝，不调用 AI。

### 5.2 独立裁定

裁定模型必须返回：

~~~json
{
  "summary": "本轮摘要",
  "before": {},
  "after": {},
  "reason": "因果解释",
  "ruleRefs": ["registry.rule.id"],
  "publicEvents": ["玩家可观察事实"],
  "confidence": 0.9
}
~~~

程序会验证：

- `before` 与当前 `semanticState` 完全一致；
- `after` 保留所有原有语义字段，不允许越权字段；
- 字段类型和资源边界正确；
- `ruleRefs` 来自当前 Registry 或资源规则；
- 持续效果的 `visibility`、`remainingRounds` 和规则引用合法；
- `resourceChanges` 有角色、资源规则、before/after 和权威 ruleRefs；
- 因果变更的 `scope` 与当前分支一致；
- 公开结果不包含敌方 hidden 值。

校验失败时可按 `repairAttempts` 请求结构修复；修复仍失败则回到可重试阶段，不提交裁定。

### 5.3 提交与场景包

校验通过后：

- 更新 `semanticState`、资源和 `causalState`；
- 将 record 写入 `history`，状态为 `committed`；
- 创建 `BATTLE_SCENE_PACKET`；
- 场景包包含 `committedFacts`、`publicEvents`、`playerVisibleContext`、原始行动和“禁止复判”约束；
- 通过宿主适配器保存收据。

若宿主持久化未确认，事实仍保留在本地，phase 进入 `awaiting_next`，并设置 `hostSync.pending`；重试保存不会重新裁定。

### 5.4 正文阶段

正文模式包括：

- `main_story`：场景包交给宿主普通正文生成；
- `packet`：只准备场景包；
- `http`：使用独立正文模型；
- `mock`：明确标注为离线演示。

正文失败不会撤销已经提交的裁定，可单独“重写正文”。重写使用原有已提交 packet，不重新调用裁定器。

## 6. SillyTavern 宿主桥接

`BattleHostAdapter` 依赖 `SillyTavern.getContext()`，主要能力包括：

- 读取当前聊天、消息、swipe 和 assistant anchor；
- 以 `extra` 保存 `battle_v2` 会话/收据；
- 监听聊天切换、删除、swipe、生成完成和停止；
- 载入宿主 checkpoint 并与本地 checkpoint 比较版本/更新时间；
- 把已确认的 scene packet 交给 `HostInputBridge`；
- 接收主剧情完成事件，回填 `record.narrative`。

`HostInputBridge` 的 marker 身份由：

~~~text
[branchId, version, actionId]
~~~

共同决定。相同身份重复追加会去重；相同 action 不同版本会拒绝冲突追加。用户编辑了输入框后，清理逻辑只在能精确识别自有尾缀时移除 packet，否则保留用户内容。

`HostDisplayFolding` 只改 DOM 显示投影，用 `<details>` 折叠 packet 文本，不修改聊天存储或发送给模型的原始文本。

## 7. 存储与安全

### 7.1 战斗存档

`BattleStorage` 使用以下逻辑键：

~~~text
battle_v2.session.<chatId + branchId>
battle_v2.logs.<chatId + branchId>
battle_v2.settings
~~~

写 session 前会验证 state scope 与 storage scope 一致，防止跨分支串写。session、logs、settings 都经过 `stripSecrets()`。

### 7.2 API Key

当前代码使用 `src/credential-store.js` 将 API Key 保存在浏览器 `localStorage`：

~~~text
xybattle.credentials.v1
~~~

普通设置和导出不保存 Key；运行时由 `BattleController` 合并读取。清空输入并保存会删除本地凭据记录。不要把该 Key 放进 git、聊天消息、完整存档、开发者导出或截图。

### 7.3 公开/内部视图

- `getAiReadContext()`：供裁定器使用，可包含敌方 hidden。
- `getPlayerView()`：供 UI 和公开日志使用，只包含敌方 `visibleInfo`。
- `logExport()`：公开审计摘要。
- `debugLogExport()`：开发者审计，可包含裁定请求/响应，但会脱敏凭据。

## 8. 功法 Registry 与内容库

Registry 是会话创建时的快照。战斗开始后修改内容库不会静默改变当前战局；新战局才会使用新快照。

内容库：

- 数据库：IndexedDB `st-xybattle-content` / `contents`；
- 索引和设置：localStorage；
- 无 IndexedDB 时退化为内存模式，并通过 `ContentStore.status()` 报告非持久化；
- 导入默认拒绝同 ID 覆盖；覆盖必须显式选择；
- 内容库不会自动把正式功法注入当前战斗，必须用户选择“应用到本场”。

## 9. 配置项

独立机枢设置包括：

- 裁定模式：未配置、HTTP、Mock；
- 裁定 endpoint、model、max output、temperature、repair attempts、timeout；
- 正文模式：主剧情、HTTP、packet、Mock；
- 自动正文开关；
- 原始用户 prompt；
- 候选人物补全提示词和独立输出上限；
- 独立战斗裁定提示词；
- 开发者日志开关。

默认裁定模式是 `unconfigured`，不会静默调用 Mock。生产使用必须显式选择 HTTP 并配置 endpoint/model。

## 10. 开发、构建和发布

~~~powershell
cd E:\\RP\\st-xybattle-sys
npm install
npm test
npm run lint
npm run build
~~~

`npm run build` 会：

1. 用 Vite 构建 `dist/battle-ui.bundle.js`；
2. 生成 CSS；
3. 执行 `scripts_sync.mjs`；
4. 更新 `third-party/st-xybattle-sys/`。

发布前检查：

~~~powershell
git status --short
git log --oneline -1
git ls-remote origin refs/heads/main
~~~

SillyTavern 端更新分发目录后刷新页面。若浏览器仍显示旧 UI，先确认 `third-party/st-xybattle-sys/dist/battle-ui.bundle.js` 已同步，再刷新扩展或页面。

## 11. 当前验证结论

### 已验证

- 原交接基线为 `6e43c36`；本次增量及验证见第 0 节。
- 自动化测试在该功能批次完成时为 `101/101` 通过。
- `npm run lint` 通过。
- `npm run build` 通过并同步分发目录。
- 浏览器真实环境已加载新 UI、独立设置和两个可编辑提示词。
- 浏览器本地凭据保存机制可读取；设置刷新后仍可使用。
- 真实 AI 候选提取能够从聊天正文识别出厉沧海。
- AI 候选补全能够返回完整身份、资源、弱点、行为和多招式体系草稿。
- 旧版实机曾显示上下文候选、AI 候选、删除和勾选控件，但长资料时底部确认入口不可达；新版已修复布局，仍待用户实机验收。
- 无自动来源优先级和来源冲突展示已在真实页面出现。
- 真实 AI 请求可能耗时数分钟；超时值可在设置中提高，实机测试时曾使用 `400000` ms。

### 尚未完成的实机闭环

- 前一轮最后一次实机测试在确认人物前停止，未完成“勾选确认 -> 启战 -> 提交行动 -> 真实裁定 -> 正文生成 -> 回合推进”的完整链路。
- 真实 SillyTavern 主剧情生成后的 extra/swipe 回写仍应单独验收。
- 删除消息后，如果宿主没有可用 assistant anchor，代码会进入 `available: false` 分支并清理该作用域；这与“有剩余正文消息时恢复历史状态”是两种情况，必须分别测试。
- 真实模型可能返回格式错误 JSON；HTTP 适配器有修复重试，但不能保证第三方模型始终合规。

## 12. 推荐接手顺序

1. 先运行 `npm test`、`npm run lint`、`npm run build`。
2. 阅读 `src/battle-controller.js`、`src/battle-state.js`，掌握生命周期和提交边界。
3. 阅读 `src/character-preparation.js`、`src/character-source-adapters.js`，掌握候选人物确认边界。
4. 阅读 `src/host-adapter.js`、`src/host-input-bridge.js`、`src/host-display-folding.js`，再改宿主桥接。
5. 任何状态字段变更都同步更新 `restoreBattle()`、`getPlayerView()`、导出/导入和测试。
6. 任何提示词变更都同时检查 JSON schema、脱敏和公开信息边界。
7. 修改 `src/ui/` 后必须重新执行 `npm run build`，不要直接手改分发 bundle。

## 13. 高风险修改点

- 不要绕过 `confirmEnemyCandidates()` 直接写入 `state.actors.enemies`。
- 不要把 `getAiReadContext()` 直接渲染到玩家 UI。
- 不要在正文阶段重新调用裁定器或重写 `before/after`。
- 不要删除 `actionId`、`roundId`、`version` 或 scope 校验。
- 不要把 API Key 写入 `BattleStorage`、chat extra、导出 JSON 或 debug 输出。
- 不要把内容库变更自动应用到已开始战斗的 Registry snapshot。
- 不要用 `git reset --hard` 或覆盖用户已有的浏览器/聊天数据排查问题。
