# st-xybattle-sys · 独立 battle_v2

这是一个独立的 SillyTavern 扩展原型。它自行创建可拖动悬浮按钮和横向战斗工作台，战斗设置存放在自己的设置面板，不调用旧“小手机”入口、DOM 或状态。

## 快速运行

在仓库根目录执行：

```powershell
npm test
npm run lint
```

将仓库作为扩展目录加载 `index.js`（或使用 `third-party/st-xybattle-sys/manifest.json` 目录）。点击悬浮的“⚔ 战斗”按钮打开工作台。默认状态是“未配置（阻止请求）”；要离线演示，请在独立设置选择“离线 Mock 演示”。真实模型请选择 `OpenAI-compatible HTTP`，填写 endpoint、model 和仅驻留内存的 API key。请求失败时状态回到可重试的玩家阶段。

## 交付边界

`battle_v2` 会话按 `chatId + branchId` 隔离保存，状态机包含 idle、awaiting_player、judging、committed、narrating、awaiting_next、ended、rewrite，行动拥有 actionId/roundId/version 并做幂等检查。裁定 AI 读取完整结构化上下文，程序校验 before/after、作用域和 ruleRefs；玩家视图会移除敌方 hidden、资源和敌方功法。正文桥接通过 `BATTLE_SCENE_PACKET`，保留用户原 prompt、已提交事实、公开事件和“禁止复判”约束。

内置 `sample-data/dielang-xuanchaojue.json` 展示叠浪玄潮诀六法。`TechniqueRegistry.register()` 可导入更多相同 schema 的功法；界面词条折叠显示原始定义、本轮动态可用状态和已触发状态。

详细实现、测试结果、宿主适配限制和迁移步骤见 [docs/独立战斗系统-v1-交付报告.md](docs/独立战斗系统-v1-交付报告.md) 与 [docs/host-contract-review.md](docs/host-contract-review.md)。当前真实 SillyTavern 主生成闭环和消息 extra/swipe 的实机写回尚未验证；`src/host-adapter.js` 提供显式适配接口，不把未验证能力描述为完成。
