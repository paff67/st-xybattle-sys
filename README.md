# st-xybattle-sys · 独立 battle_v2

这是一个独立的 SillyTavern 扩展原型。它自行创建可拖动悬浮按钮和横向战斗工作台，战斗设置存放在自己的设置面板，不调用旧“小手机”入口、DOM 或状态。主战斗页采用左主角、右敌人的横板对战布局；主角功法和敌方公开招式以可点击的花瓣词条展开，增益/负面效果位于对应角色上方，场地效果位于中央，行动输入固定在底部。

## 快速运行

在仓库根目录执行：

```powershell
npm test
npm run lint
```

将仓库作为扩展目录加载 `index.js`（或使用 `third-party/st-xybattle-sys/manifest.json` 目录）。点击悬浮的“⚔ 战斗”按钮打开工作台。默认裁定状态是“未配置（阻止请求）”；要离线演示，请在独立设置选择“离线 Mock 演示”。裁定和正文分别配置模式、endpoint、model、最大输出、温度和仅驻留内存的 API key；温度 `0` 和修复次数 `0` 都会保留。

裁定提交前的请求或校验失败会回到玩家阶段。正文失败会保留已提交裁定，允许只重写正文；用相同 `actionId` 重试不会重新裁定。

## 交付边界

`battle_v2` 会话按 `chatId + branchId` 隔离保存，状态机包含 idle、awaiting_player、judging、committed、narrating、awaiting_next、ended、rewrite，行动拥有 actionId/roundId/version 并做幂等检查。裁定 AI 读取完整结构化上下文，程序校验 before/after、作用域和已注册 ruleRefs；生产模式会拒绝未知引用和 `mock.*` 引用。玩家视图和公开日志移除敌方 hidden、资源和敌方功法。正文桥接通过 `BATTLE_SCENE_PACKET`，保留用户原 prompt、已提交事实、公开事件和“禁止复判”约束。

语义状态会进入下一轮的裁定上下文。对象形式的持续效果使用 `remainingRounds`：进入下一轮减一，归零时到期；历史裁定保留当时的效果快照。

内置 `sample-data/dielang-xuanchaojue.json` 使用叠浪玄潮诀六法的演示摘录验证 registry 和 UI；正式功法原文需从用户确认的世界书来源导入。`TechniqueRegistry.register()` 可导入更多相同 schema 的功法；界面词条折叠显示定义、本轮动态可用状态和已触发状态。

`BattleController.importScene({scene, actors, semanticState, registry})` 可在未开始或已结束时导入场景，建立新会话。完整会话导出/导入会恢复 registry 和已提交历史，仅接受当前聊天及分支的作用域。重载会恢复数据和中断状态，不会自动发送模型请求。

敌方花瓣由 `src/battle-context.js` 从公开角色资料、可观察招式和公开战报提取，并标注“已知 / 推测 / 未知”及来源；未发现公开定义时显示明确的“招式未识别”，不会凭空生成能力，也不会读取 `hidden`、内部资源或内部词条。点击花瓣会在战场下方展开原始定义、机制、来源和可见性说明。

公开日志使用 `logExport()`；开发者审计使用 `debugLogExport()`，保留精确裁定输入、模型 messages/request body、原始返回和程序校验。开发者日志及完整会话导出可以包含裁定所需的 hidden 上下文，公开日志采用独立的玩家投影。两类日志、设置持久化和会话导出都会移除 API key、授权字段及运行时 key 字符串。

详细实现、测试结果、宿主适配限制和迁移步骤见 [docs/独立战斗系统-v1-交付报告.md](docs/独立战斗系统-v1-交付报告.md) 与 [docs/host-contract-review.md](docs/host-contract-review.md)。默认测试使用显式 Mock 或本地 HTTP 夹具，不调用真实模型。当前真实 SillyTavern 主生成闭环和消息 extra/swipe 的实机写回尚未验证；`src/host-adapter.js` 提供显式适配接口，实机验收须独立记录。
