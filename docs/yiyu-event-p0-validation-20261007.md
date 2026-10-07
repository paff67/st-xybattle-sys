# yiyu 日常事件裁定扩展：落地前真实宿主验证

日期：2026-10-07（北京时间）。结论：**有条件可落地；主闸门应选正式 `generate_interceptor`，不能直接以 `GENERATION_AFTER_COMMANDS` 异步监听器实现完整接管。** 本轮是宿主可行性验证，不是日常裁定系统发布验收。

## 环境与证据边界

- 本地 HEAD 与 GitHub main 均为 `15396017ad09b1cb20f0f808004d3a1861c0f902`。没有修改产品 src、dist、third-party，也没有提交或推送。
- SSH：`ssh.paff-67.top`；目标 `sillytavern_yiyu`，SillyTavern **1.17.0**；桌面 Chrome 经仅本地监听的 SSH 隧道 `127.0.0.1:18004 → VPS 127.0.0.1:8004` 操作。
- 实际加载 TavernHelper **4.11.0**、Prompt Template **1.17.9**、ACU 和角色 MVU。`Mvu` 在欢迎页不存在，打开测试角色后存在；不能用欢迎页检查认定插件缺失。
- 保留当前 yiyu 插件与预设运行环境。创建 `codex-event-p0-20261007`、`codex-event-p0-empty-20261007` 两个虚构测试聊天及一个仅聊天绑定的扫描测试世界书。
- 宿主/浏览器/保存/扫描均为真实；模型端为容器回环 `127.0.0.1:19997` 上的确定性 mock，**记录到 9 次测试生成请求，真实路由/裁定/叙事模型质量测试 0 次**。不记录凭据或完整提示词。
- mock 不支持 SSE。首条无锚点发送因插件切换回流式产生空助手回复，随后非流式 regenerate 成功；这不是流式验收通过。
- 本轮未改正式 `me`，未重启任何 ST 容器。

## 实测结果

| 项目 | 结果与约束 |
|---|---|
| 前置事件异步等待 | 点击与 Enter 均进入 GAC；等待时主 mock 请求计数不增加。释放原调用后输入与事件包各 1 次、用户消息仅 1 条 |
| GAC 顺序 | `GENERATION_STARTED → GAC → 用户消息创建/渲染 → 提示词构建 → 主请求`。GAC 时尚无本次用户消息 |
| GAC 异常 | **失败**：抛错被 EventEmitter 捕获，主请求仍发出（mock #2）；不能用 throw 表示阻止发送 |
| GAC 停止 | `stopGeneration()` 后主请求不发出，但宿主仍创建用户消息并清空输入。暂停时原生停止按钮尚未显示 |
| GAC 辅助重入 | `TavernHelper.generateRaw({generation_id:...})` 实际回调参数为 `normal, {}, false`；未在参数暴露 generation_id。直接按 normal 路由会递归 |
| 正式 manifest 拦截器 | **通过关键能力验证**：`generate_interceptor` 可 await；在用户消息形成之后、提示词构建之前。暂停时原生停止按钮可见 |
| 正式拦截器内部辅助生成 | 主请求等待时调用 generateRaw 成功，辅助 mock #8 完成，正式拦截器没有再次进入；释放后主请求 #9 含事件包 1 次 |
| 正式拦截器失败关闭 | catch 后调用 `abort(true)`，主请求计数仍为 9；宿主恢复发送能力；没有助手正文 |
| 正式拦截器停止 | stop 事件不会自动结束扩展自己的 Promise；显式释放等待并 `abort(true)` 后结束，无额外主请求。必须由协调器取消辅助请求并唤醒等待 |
| 内部注入 | 主 mock #1/#3/#9 均收到一份包；用户正文无包；结束/停止后无残留 p0 prompt |
| 世界书扫描 | 注入精简公开关键词，`should_scan:true`；用户原文不含关键词，mock #3 实收 `P0_RULE_SCAN` 1 次。支持规划中的可扫描公开名称方案 |
| 辅助隔离 | mock #4/#5/#8 只含辅助标记，不含事件包、测试规则或聊天标记 |
| 无助手锚点 | 清空独立测试聊天消息后，聊天元数据事件身份在远端 JSONL 中以 0 条消息实际落盘；随后首条发送可进入主请求 |
| 元数据及 swipe | 用户 `extra.xy_event_v1`、助手 A/B `swipes_info` 保存成功；A→B→A 回读身份正确；服务器独立回读与整页刷新后重开角色均恢复 |
| 原生 regenerate | 回调类型为 regenerate，可单独识别；非流式重试未新增第二条用户输入。这里只验证宿主，不证明尚未实现的事件不重扣 |
| 纯命令 | `/echo P0_COMMAND_ONLY` 只产生 GENERATION_STARTED，不进入 GAC，无模型请求 |
| 通知去重 | 首条输入出现两次 USER_MESSAGE_RENDERED；dry-run 也产生提示词事件。不能用渲染次数或提示词事件次数结算 |

## 必须调整的落地设计

1. **主闸门采用 manifest `generate_interceptor`**。GAC 可做轻量请求捕获，不能在其内无来源区分地启动同接口路由请求。正式拦截器的本次源代码实现见 `public/scripts/extensions.js:1734`、`public/script.js:4475`；本轮实际加载临时扩展验证，不只是读源码。
2. **明确取消语义**：正式闸门时原输入已是用户消息。建议保留输入消息并标记 cancelled/rejected，不结算、不出成功卡；重试复用该输入身份。若必须恢复为编辑框草稿，要另外开发并验证附件、消息撤回和依赖链行为。本轮未证明这种恢复方案。
3. **异常必须显式 abort，不能依赖 throw**。stop handler 必须取消相关辅助 generation、释放所有等待，并再次检查聊天作用域/请求身份。`abort(true)` 也不会撤销此前已经执行的插件副作用。
4. **身份从用户消息/事务来，不能只用宿主事件参数**。generateRaw 的 GAC 形状与正常发送相似；dry-run/重复渲染/流式完成顺序各异。本轮未发现可直接当全链路 requestId 使用的统一字段。
5. **持久化必须独立回读**。实际日志出现 `Timeout waiting for chat to save`；`saveChatConditional()` 会记录警告后返回、并捕获保存异常，Promise fulfilled 不代表成功。需要服务器回读/版本校验与 persistence_pending，不应凭保存返回即开始正文。
6. **谨慎映射 swipe 元数据**：本次 TavernHelper 的 `swipes_info[i].xy_event_v1` 对应远端 `swipe_info[i].xy_event_v1`，当前页同时体现在 `message.extra`。不能想当然只读 `swipe_info[i].extra.xy_event_v1`。
7. **旧 DC/自动脚本执行权必须迁移**。现场 `[DICE][GACHA] MESSAGE_SENT` 报 `processPendingEffectRuns is not defined`，日志称骰运仍继续；说明旧骰子在正式 interceptor 前已经处理消息。默认事件接管必须逐域停用旧执行路径，不能仅改提示词。
8. 世界书扫描路径可用，但只扫描公开名称。正式事件/路由应各自装配必要规则，不能把一次成功扫描等同于所有功法、当前新世界书与预设兼容。

## 未覆盖，禁止据此宣布完成

- 分流语义、六法/日常探查裁定、100/30 条模型集、费用与 P50/P95；本次控制等待不是性能测量。
- 附件、双击并发、多标签/跨设备、切聊天迟到返回、保存失败注入及重试、所有快捷键/第三方自动发送、群聊。
- 新事件依赖链删除回滚、原生 UI 所有 swipe 路径、DOM 裁定卡及卸载恢复；本轮仅证明元数据存储基础。
- MVU 对指定正文的更新归属、消耗终值、删除恢复、ACU/SP 分支一致性。只确认接口存在和真实脚本在运行，未写 MVU 资源。
- 当前 st-xybattle-sys 产品扩展未在 yiyu 部署；本轮临时闸门不等于现有战斗功能真实兼容回归。未改运行源码，未重复用 npm 测试冒充宿主验证。

## 推进决定

可以开始 **P0 宿主适配 + P1 事务身份** 开发，并优先落实上述调整；**不应直接开启默认接管或宣布 P0 全项通过**。取消恢复、插件唯一执行权、请求绑定与持久化确认应成为 P0 补充出口条件，再进入 P3 路由/战斗复用。

## 证据与清理

- `artifacts/yiyu-p0-20261007/`：现场宿主源码快照、可重放临时 interceptor、脱敏 mock 请求计数、服务器存档审计、清理脚本及结果。
- 请求 #1 正常 GAC；#2 GAC 抛错意外放行；#3 世界书扫描；#4/#5 辅助来源；#6 流式夹具失败；#7 非流式重试；#8 正式 interceptor 内辅助；#9 正式 interceptor 恢复。取消和失败关闭不应产生新请求。
- 服务器设置原件仅存 `/opt/sillytavern/backups/yiyu-p0-20261007/settings.json`，不复制到项目。仅恢复本次修改的连接字段。
- 测试聊天与专用测试世界书保留作为复查证据；临时 manifest 扩展、mock 进程与远端入口文件在测试结束后移除。以 `cleanup-result.json` 和 `server-audit-final.json` 为最终核对。
