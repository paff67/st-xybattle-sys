# 运行日志与失败放行交付验证（2026-10-10）

## 结果

- 全量 `npm test`：334/334 通过，0 失败、0 跳过。包含已有业务回归与新增日志测试。
- 随后补充 Cookie 脱敏和将拦截器终态记录放在正文清理之后；最终针对相关文件运行 `node --test tests/operation-log*.test.js tests/event-p0-p1.test.js`：55/55 通过。
- `npm run lint`：所有源模块语法检查通过。
- `npm run build`：Vite 生产构建成功，`third-party/st-xybattle-sys` 安装包已同步。
- 检查本次修改的源文件、JS/CSS 构建产物与安装包一致（忽略 CRLF/LF 差异）。
- `git diff --check`：通过。测试曾暴露旧用例仍要求记录原始模型内容，已改为校验默认省略；另将事件测试的固定 100 次轮询改为有时间上限的等待，避免并发跑测试时误判。

## 交付入口

- `src/operation-log.js`：统一日志、等级、状态、错误建议、脱敏、容量、订阅与关联。
- `src/ui/components/RuntimeLog.vue`：操作概览 / 时间线 / 技术详情；独立采集开关、筛选、暂停、复制、清空、导出。
- `src/event-coordinator.js`、`src/event-store.js`、`src/host-generation-gate.js`：失败放行、取消、保存限时、迟到写入守卫和终态。
- 控制器、配置、内容库、人物模型、自动日常/战斗提案、正文回调、MVU 监听、战斗入口与启动均有对应埋点；详细阶段/写入边界见 `operation-logging.md`。
- `docs/operation-log-examples.json`：50 条由真实业务入口生成的脱敏示例，明确标记模拟模型/内存存储。

## 线上验收边界

本次发布包含实现代码和已构建安装包；GitHub 更新与宿主部署分别进行，尚未部署到 `sillytavern_me`。没有重发“尘世命轨”的原剧情消息，没有把离线验证计为线上实测。当前线上版本不能因本地测试通过而认定已修复。

后续实际宿主需验证：强制刷新后加载新版；真实模型超时/取消时同一次正文继续；服务器读回失败后可用性；已提交结果正文失败后仅重试正文；真实 MVU/ACU 更新顺序；iPad/WebKit；跨设备配置确认。日志为当前页面有限内存，刷新前需导出。

宿主 `saveChat` 不能取消已经发起的保存；15 秒超时停止等待，不代表服务器拒绝写入。对于结果未确认的裁定提交仍保留 pending，不允许自动重裁。仅未提交裁定的失败可放行正文。

## 产物 SHA-256

- `dist/battle-ui.bundle.js`：`9076d5186bff19d32e03bcef40bcd4a4c526db0be86287da4578dce5c17d4e3f`
- `dist/st-xybattle-sys.css`：`cbeb12085cdd1d3d2b3ec76b157060c551f3e4d7e1a1d35e288b769a06789cd8`
