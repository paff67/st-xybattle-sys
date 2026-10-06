# st-xybattle-sys `main` 分支交接文档

> 基线提交：`6e43c36`（`feat: require confirmed AI-built opponents`）
>
> 发布目标分支：`origin/main`
>
> 本次进度更新：2026-10-06，人物确认页可用性修复（具体发布提交以 Git 历史为准）
>
> 适用目录：`E:/RP/st-xybattle-sys`
>
> 文档目的：说明当前 `main` 的真实代码实现、运行边界、发布方式和后续接手注意事项。

## 0. 最新开发进度（2026-10-06）

本次审阅以 `6e43c36` 为代码基线，并保留、完善了工作区已有的未提交人物确认页修订。

### 已完成的修复

- **确认入口与滚动**：原确认页沿用战场的 `overflow: hidden` 布局，长资料会把底部操作挤出可见区域。现改为确认面板内部单独滚动，标题和底部操作栏不参与资料滚动；“确认并开始战斗”与已核对人数始终在操作栏内。
- **资料展示**：身份与状态、可见情报与行动倾向、功法招式、资源装备与弱点、构造补充与裁定专用资料分组展示。嵌套数组逐项展示，长文本换行，不再把对象压成 JSON 字符串。常用字段和状态值使用中文名称；未识别的英文字段以编号补充资料展示，原始字段名仍完整保留在高级 JSON 中，不猜测其含义。
- **直接编辑**：文本、数字和布尔字段提供“修改”入口，保留数据类型。原始 JSON 默认折叠；编号、规则引用等技术字段仍可通过高级编辑核查。
- **确认边界**：编辑任何字段或 JSON 都会撤销该人物的核对勾选。数值错误、无效 JSON、未核对的保留人物、全部删除候选时均禁止确认。候选删除可以恢复；冲突区显示当前编辑后的草稿值，来源无自动优先级。
- **重新读取**：重新读取前清空旧面板，避免失败后仍显示已被控制器作废的候选。
- **构建分发**：源码修改通过 `npm run build` 同步到 `dist`、根样式和 `third-party/st-xybattle-sys`，不手改 bundle。

### 当前验证边界

- 基线 101 项自动化测试通过；本次增加 5 项人物确认组件/展示回归测试，总计 **106/106**。
- 新测试编译实际 Vue 组件，在 jsdom 中触发勾选、编辑和删除事件；确认数据交给实际控制器后可进入 `awaiting_player`，隐藏资料仍不进入玩家投影。
- `npm run lint`、`npm run build` 通过。lint 负责源码语法检查，Vue 模板另由组件测试和构建校验。
- **依用户要求，本次不运行 Playwright，也不宣称完成浏览器滚动、窄屏或真实模型闭环验收。** CSS 在真实 SillyTavern 宿主样式下的表现由用户测试。

### 尚待用户实机验证

1. 更新扩展并刷新页面，读取候选后，资料可滚至末尾，底部按钮保持可见；窄屏可完整查看字段。
2. 修改资料后核对勾选会撤销；逐名核对后，点击“确认并开始战斗”进入待行动阶段。
3. 提交行动 → 真实裁定 → 场景包 → 酒馆正文生成 → extra/swipe 回写 → 下一回合。
4. 分别测试删除消息后仍有助手锚点的 checkpoint 恢复，以及没有可用锚点时的清理；核查条件技能解锁随回滚恢复。

审阅确认两阶段裁定、人物确认边界、内容库快照、分支隔离和场景包桥接均已有代码及自动化测试覆盖；上述真实宿主闭环仍是当前开发验收的主要剩余项。`mount.js` 检查的是 Vue `App.vue` 实际渲染的 `xybattle-v2-root`，不是外层 wrapper；仅凭两个 ID 不同不能认定重复挂载防护失效。

## 1. 系统定位

`st-xybattle-sys` 是一个独立的 SillyTavern `battle_v2` 扩展。它在酒馆页面中挂载独立的 Vue 3 战斗工作台，自己维护战斗状态、功法 Registry、分支存档、裁定日志和可选的正文场景包桥接。

核心原则：

- 战斗裁定与主剧情正文分两阶段处理。
- 战斗状态按 `chatId + branchId` 隔离。
- 敌方人物必须经过 AI 构造、用户逐项确认后，才能进入裁定上下文。
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
| `src/character-presentation.js` | 人物资料的中文标签、嵌套分组、值展示和保留类型的表单编辑 |
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

## 4. 敌方人物准备流程

战斗开始前，`BattleController.prepareCharacters()` 会构造只读上下文：

1. 当前 `chatId`、`branchId`、消息/swipe 作用域。
2. 最近最多 20 条聊天消息，每条最多 4000 字符。
3. 由显式上下文提取的敌方候选。
4. MVU 动态值和 `AutoCardUpdaterAPI` 数据库资料（只读）。
5. AI 候选提取结果。
6. 对每个候选单独调用候选人物补全模型。

候选合并在 `character-preparation.js` 完成：

- `explicitFacts`、`inferred`、`ai_completed` 等来源逐叶合并；
- 所有来源优先级目前均为 `0`，不会自动判定谁优先；
- 冲突保留全部来源值，UI 明确显示“无自动优先级”；
- AI 构造内容标为“AI 构造草稿”，不是已发生事实；
- `hidden` 只供内部裁定使用，不能进入玩家投影；
- 候选只有被用户勾选并点击“确认并开始战斗”后，才写入 `state.actors.enemies`；
- 未确认候选不能进入 `buildAdjudicationRequest()`。

确认接口是：

~~~js
controller.confirmCharacters(edits, { removeIds })
~~~

`edits` 是用户编辑后的候选字段，`removeIds` 用于删除旧候选或错误候选。确认后会在人物记录中写入 `confirmation.status = 'confirmed'`，并保存作用域和时间。

### AI 人物调用

`createHttpCharacterInference()` 使用 OpenAI-compatible `/chat/completions`：

- 候选提取：只提取人物和上下文事实；
- 候选补全：依据 `characterCompletionPrompt` 生成完整人物、功法、招式、资源、行为和弱点草稿；
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
- 候选人物补全提示词；
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
