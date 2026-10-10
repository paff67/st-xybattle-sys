# 扩展运行日志与自动事务异常恢复

## 调查与埋点清单

参考 SP spv9.2.5 `useLogViewer` 的采集开关、等级/模块/关键词筛选、暂停和导出交互；本项目使用自己的结构化业务事件，不复制其业务处理。参考源码：https://gcore.jsdelivr.net/gh/AlbusKen/shujuku@spv9.2.5/index.js 。

| 业务 | 异步链及埋点 | 写入边界 / 既有日志 |
| --- | --- | --- |
| 启动 | mount → helper/config ready → load → controller ready | 配置只读；原来只显示错误提示，现在独立记录启动失败，可直接导出 |
| 配置/迁移 | setSettings → validate → namespace save → server readback → entry enable | envelope 整体提交；submitted 与 confirmed 分开，入口失败单列 |
| 自动事务 | native interceptor → capture → save/readback → context → route → extract → model → parse → validation → commit → injection → native narrative → finish | 原先仅 event receipts/audit/onStatus；新增独立运行日志，不依赖聊天保存成功 |
| 手动战斗 | submit → context → judge/repair attempts → parse → validation → commit → host receipt → narrative | 原先 controller.log/battle-state logger；保留现有状态提交顺序和 actionId 幂等 |
| 人物准备 | prepareCharacters → context/core rules → infer/complete/retry → validation → draft → confirmCharacters | 自动生成只产生候选；确认才写人物状态 |
| 正文重写 | rewrite → model → parse → narrative → host receipt | 只重写叙述，不重做已提交裁定；原操作 actionId 保留 |
| 内容库 | import → preview/validation → conflicts → putMany；put/remove/clear/export | IndexedDB 原子事务边界不改变；应用内容到战斗是独立入口 |
| 聊天/分支 | switchScope、reconcileTranscript、rollback | 每次操作携带起始 chatId/branchId；切换使旧事务失效，不向新聊天放行 |
| 恢复 | retryPersistence / retryHostPersistence | 只重试保存；不重新执行模型裁定 |
| 战界监听 | HostMvuObserver → 精确消息/MVU/服务器快照核对 → BattleEntryCoordinator.observe/request → 人物准备 | 记录监听能力降级、等待超时、分支失效、边沿选择、重复入口跳过；不把 MVU 回调当成落盘确认 |
| 正文后的入口识别 | finish → afterNarrative → createNarrativeBattleObserver → handoff | 与原正文通过 parentRunId/eventId 关联，独立报告后续识别结果 |

原先 `BattleController.log → BattleStorage.appendLog` 主要记录手动战斗，自动流程写入 `event.audit` 和聊天收据，启动/监听部分异常只有 console/onStatus。新的运行日志独立于这些业务存储：聊天保存失败也能记录失败。既有聊天收据、领域审计与状态导入导出继续保留原职责；“完整诊断/开发审计导出”统一使用脱敏运行日志，而“导出存档”仍是业务数据备份，不应当作公开诊断文件分享。

## 数据约定

统一入口 `operation-log.js`。记录包含 id、timestamp（UTC ISO）、level、module、event、runId、stage、status、message、data；阶段及操作耗时为 durationMs。必要时附带 chatId、branchId、messageId、requestId、eventId、actionId、activationId、writeId；`data.attempt` 标识同一操作内的模型调用序号，`data.proposalId` 标识分离的候选提案。异步模型调用通过 AbortSignal 的 WeakMap 绑定 trace；不用全局“当前操作”变量。操作有 trigger/end；已结束操作的宿主回调启动新 run，以 parentRunId 和 actionId/eventId 关联原操作。控制器关联表最多保留 200 项；刷新后仍可凭持久业务标识关联，旧 runId 不保证可用。

ERROR 表示阶段/操作失败；WARN 表示取消、降级或未确认风险；INFO 表示业务过程；DEBUG 表示按需诊断。默认采集前三者。status 独立使用 running/success/failed/cancelled/skipped/degraded。候选模型结果不是状态提交；只有 commit 明确记录提交边界，后续生成失败不得改写此前提交结果。

稳定错误码：TIMEOUT、MODEL_HTTP、PARSE_FAILED、VALIDATION_FAILED、PERSISTENCE_FAILED、NARRATIVE_FAILED、CANCELLED、UNEXPECTED。界面按代码展示事实、影响、可能原因和建议；没有证据时不输出推测为定论。上游异常文本可能包含提示词或凭据，因此只采集异常类别/错误码，默认不收集堆栈和原始异常正文。DEBUG 可增加请求参数等诊断元数据，也不记录请求体。

`committed:true` 表示对应边界已执行，需结合 stage/target 阅读：本地战斗状态、内容库写入、配置提交与服务器确认不是一回事。服务器读回在 `host-save/server-confirmation` 单列 `confirmed` 或 status。自动事务提交结果不确定时，终态为 `failed`、`committed:false`、`uncertain:true`；这不意味着可以重裁或撤销。分离战斗提案始终标记 `committed:false`，只在外层事件保存确认后记录正式提交。

## 存储与界面

运行日志使用当前页面内存环形缓冲区：默认最多 1000 条、1 MiB、单条 8 KiB，深度 5，对象节点 300、数组 30 项、对象 40 键、字符串 1600 字符。限制按 UTF-8 字节计算；循环引用和访问器不会被执行。超限截断或淘汰，导出包含 dropped 和限制参数。刷新不跨页面保留日志，排障应先导出。

采集前统一脱敏；默认不记录完整聊天、提示词、请求体、原始响应、API 密钥或 Authorization。DEBUG 也不能绕过脱敏。旧 controller 流水新增记录同样经过投影，完整开发诊断导出改为安全运行日志。

订阅以 80ms 批量通知；界面卸载退订。暂停只冻结显示快照，后台缓冲仍按上限淘汰，不另建无限队列。等级、模块、操作、关键词筛选只影响显示；导出始终包含整个有限缓冲区。UI 用 Vue 文本插值，不解释日志 HTML。

## 异常恢复边界

未提交裁定时，捕获失败、模型失败、超时、无可执行路径可以降级为同一次原生正文请求，不能注入候选结果。宿主停止、输入修改、聊天切换不能被当成放行许可。已提交裁定、或裁定提交结果不确定时不盲目放行/回滚；保留保存恢复路径，避免重复结算。捕获等待有上限并可取消；宿主 API 无法真正取消的保存仍需按身份和版本核对。

## 验证记录

代表性样例：[operation-log-examples.json](operation-log-examples.json)。这些记录由真正的 `BattleController.setSettings/start/submit/continueNext` 与 `importContent` 入口生成，模型/存储使用离线替身，文件内明确标注 fixture。可查看 `fixture-success` 的成功提交，以及 `fixture-after-commit-failure` 的“commit 成功 → narrative 失败 → end 失败且 committed:true”。内容导入示例同时展示内存存储降级。

| 验收项 | 入口与证据 | 验证性质 |
| --- | --- | --- |
| 成功、超时、HTTP/解析失败、取消 | createCharacterJsonRequest；EventCoordinator + HostGenerationGate | 真实生产代码入口，注入模拟网络/宿主 |
| 业务校验失败、无提交 | BattleController.submit；automatic preparation | 真实入口，模拟模型 |
| 保存失败放行、捕获中取消、迟到回调 | native gate 的 GENERATION_STARTED/MESSAGE_SENT/intercept/finish 链；检查不注入、不写迟到结果、释放锁 | 模拟 ST 事件总线与服务器读回 |
| 取消收据也保存失败 | skipAdjudication → 取消保存失败 → 原生正文继续 | 模拟宿主故障 |
| 提交不确定 | 已生成有效提案，最终读回不确认；禁止盲目放行，日志 uncertain | 模拟宿主故障 |
| 提交后正文失败、重试不重裁 | submit → narrative 抛错；重复 actionId；recordHostNarrative 停止回调及 parentRunId | 模拟模型/宿主；断言已提交事实保留 |
| 配置提交成功而入口启用失败 | setSettings → save → verifyPersisted → entryError | 模拟配置后端，区分提交与启用结果 |
| 重试与并发操作不串日志 | 两个 inference 并发，各自失败后重试；断言 run/chat/branch/attempt | 模拟模型 |
| 聊天/分支、改输入、停止、幂等 | 既有事件与战界测试 | 模拟宿主；这些路径不会被误当成失败放行 |
| 暂停、洪峰、筛选、导出、卸载重挂 | 编译真实 RuntimeLog.vue 在 jsdom 挂载，1000 次洪峰；底层另有 4000 次容量测试 | 真实 Vue 组件 + 模拟 DOM |
| 脱敏与安全渲染 | 多控制器密钥、循环对象、异常、访问器、HTML 字符串、导出不含原始输入输出 | 单元 + 业务入口 + Vue DOM |

最终命令与汇总记录见 [operation-logging-validation.md](operation-logging-validation.md)。本次没有向线上角色卡“尘世命轨”重发用户原剧情消息，也未宣称真实模型或移动端已验收。尚待宿主验证：当前 SillyTavern/TavernHelper 的生成拦截与恢复顺序、实际网络失败后的 saveChat 读回、真实 MVU/ACU 回调顺序、iPad/WebKit 的取消与重新生成、跨设备配置服务器确认。宿主 saveChat 没有取消 API，超时仅停止等待；迟到保存仍需服务器记录核对。
