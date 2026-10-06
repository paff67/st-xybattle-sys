# 文档索引

- [架构契约](./architecture.md)：独立挂载、两阶段裁定/正文流程、registry、分支存储、可见性和验证边界。
- [main 分支交接文档](./main-branch-handover.md)：以远端 `main` 的 `6e43c36` 为基线，说明当前实现、候选人物确认、宿主桥接、存储安全、发布和实机验证边界。

## 开发验证

在仓库根目录运行：

```powershell
npm test
npm run lint
```

当前最低契约测试覆盖 mock 闭环、`actionId` 幂等、hidden 投影、分支键隔离、错误裁定回退、恢复中断回合、无正文模式场景包、默认未配置保护和停止后的迟到结果；存储测试覆盖凭据剔除及作用域拒绝。测试默认使用本地 fixture 或显式 mock，不要求访问真实模型服务。生产适配器使用 OpenAI-compatible endpoint；未配置时由保护适配器拒绝提交，不会静默切换 mock。当前版本的 API Key 按用户要求保存在浏览器本地 `xybattle.credentials.v1`，但不会进入普通设置、战报、导出或日志。

早期接口版本曾记录为 16/16；2026-10-06 人物确认页修复后的代码验证为 `106/106` 通过，`npm run lint` 和 `npm run build` 通过。本次未执行 Playwright，长资料滚动、窄屏及真实宿主闭环由用户验收。以仓库根目录实际命令结果为准。

真实 SillyTavern 主生成桥属于单独的实机集成范围。除非有目标实例中的加载、生成和回写证据，否则测试和发布说明只能报告独立战斗系统及 `BATTLE_SCENE_PACKET` 契约已验证。

## 接口重写期间

架构文档刻意描述稳定契约，不锁定 `src/` 的临时函数名。`tests/state.test.cjs` 和 `tests/storage.test.cjs` 只依赖公开契约；后续接口变更应更新契约测试，不要为了让旧测试通过而恢复已废弃的内部字段。
