# P0 宿主适配与 P1 事务身份

开发分支：`feat/event-p0-p1`。基于 yiyu ST 1.17.0 的前置验证；本阶段不包含 AI 分流提示词、领域裁定或资源提交。

## 已实现的边界

- manifest 注册 `xyEventGenerationInterceptor`。扩展挂载时安装一次，与面板开关无关；销毁时撤销监听和全局入口。
- 默认不启用自动入口，不提供关键词分流或默认 pass。开发者注入路由函数并显式启用后，正常发送由正式 interceptor 等待；非 pass、异常、超时、取消、落盘未确认均显式 `abort(true)`。
- 保留原用户消息和附件；失败/取消后消息留在聊天中。下一次原生 regenerate 可重试该输入，不模拟按钮二次发送。
- 消息及 swipe 的 UID、输入 SHA-256/修订号、分支谱系、请求/事件 ID 均由程序管理，位于 `xy_event_v1`；不修改 MVU 定义或资源。
- 聊天元数据保存索引及修订，用户消息保存事件回执，助手消息保存正文关联。数组下标只用于找到通知指向的消息。
- 服务器 `/api/chats/get` 独立回读验证事件版本与消息身份；没有确认就进入 persistence_pending。重试使用同一候选写入，不重复路由。
- 同运行时互斥与 Web Locks 覆盖自动入口、手动 submit/rewrite。远端版本冲突拒绝覆盖；不宣称跨设备 CAS，仍要求同聊天单写入者。
- 正文重试复用 passed 路由；新发送的相同文字产生新事件。编辑输入使旧修订及依赖失效，删除助手不撤销输入事件。
- 刷新恢复 captured/routing 为 needs_input，未完成正文关联为 narrative_failed；不自动发请求。A/B 前置助手分支独立，同一输入切回 A 可找回 A 的事件。

## 模块

| 文件 | 职责 |
|---|---|
| `event-state.js` | 元数据协议、输入指纹、状态转移与依赖失效 |
| `event-store.js` | 保存、服务器回读、版本拒绝与原候选重试 |
| `event-lock.js` | 自动/手动操作锁和同源多标签互斥 |
| `event-coordinator.js` | 身份捕获、路由契约、取消、恢复和正文绑定 |
| `host-generation-gate.js` | manifest 拦截、宿主通知适配、精确输入关联与卸载 |
| `event-runtime.js` | 生命周期装配及开发 API |

## 开发接口

真实宿主挂载后使用 `XYBattle.events`。启用配置只在内存中存在，刷新后默认关闭；这不是生产自动接管设置。

```js
// 只用于明确的隔离测试聊天。P3 应在此传入真正的 AI 分流适配器。
XYBattle.events.configureRouter(async ({ input, event, signal }) => {
  return await testRouter({ input, requestId: event.requestId, signal });
});
await XYBattle.events.enable();
XYBattle.events.capability();
await XYBattle.events.disable();

// 保存失败只重试原候选；不会自动恢复正文。
await XYBattle.events.retryPersistence();
// 在无活动请求时检查存档；不调用路由器。
await XYBattle.events.recover();
```

路由仅接受 `pass / needs_context / unsupported / adjudicate`。P1 对 adjudicate 返回 unsupported/domain_not_implemented；不会执行战斗或临时猜测规则。辅助适配器应遵守 AbortSignal，独立调用 TavernHelper 时应自行关联 generation_id 并在 signal 取消时 stopGenerationById。

`capability().liveVerified` 保持 false：单次隔离模块实测不能自动授予任意宿主/插件组合正式能力认证。

## 必须保留的限制

后续开发已加入[自动分流与资料准备框架](./event-automatic-preparation.md)，并新增 `configureAutomaticPreparation()`。下方 P0/P1 开发验收保留为当时记录；P2/P3 目前仅有准备框架，领域执行和真实模型语义验收仍未完成。

- 未完成 P2 到战斗领域档案的转换、P3 战斗提案/提交拆分与模型验收、P4 事件包/裁定卡/资源回滚/MVU 对账、P5 探查执行器。新增的领域提示词与资料引用不代表这些出口已通过。
- P1 的 rolled_back 仅使事件身份和依赖失效，不代表领域资源已经回滚；本阶段没有资源提交。
- 原生 quiet/impersonate/continue 不新建用户事件；群聊不启用，未知正常发送来源拒绝接管。第三方自动入口尚未全覆盖。
- 正文只按本次原生请求及 MESSAGE_RECEIVED 的实际 ID 绑定；ENDED 可先于 RECEIVED。10 秒内缺失关联则标记失败并释放锁，不猜测最新消息。
- Web Locks 只提供当前浏览器同源互斥；不同设备及未参与锁的第三方插件仍可能保存整份聊天。
- 旧骰子/ACU/伴生脚本仍由原宿主管理；进入 P3 前需处理逐域唯一执行权。本阶段未停用旧规则。
- 没有自动销毁或覆写不兼容存档；版本冲突与同聊天待保存消息被修改时，要求重新加载并检查恢复状态。

## 验证

新增 `tests/event-p0-p1.test.js`，覆盖正常首条输入、异步等待、重复回调、停止/超时、无效路由、保存假成功、同候选重试、远端冲突、跨聊天迟到输出、正文失败、刷新恢复、编辑/删除失效、附件修订、A/B 谱系、原生新 swipe、索引漂移及多标签锁。

离线结果、最终构建和本轮实装测试结果见本文件后续验收记录。旧 `docs/yiyu-event-p0-validation-20261007.md` 是实施前探针证据，不能替代新代码测试。

### 2026-10-07 开发验收记录

- 新增 30 项 P0/P1 测试，全量 `npm test` **172/172**；`npm run lint`、`npm run build`、`git diff --check` 通过。构建已同步 dist 和 third-party。
- 将本次六个实际源码模块通过临时 manifest 载入 yiyu，使用新聊天 `codex-event-dev-20261007`，保留当前 MVU/ACU/伴生脚本环境。默认关闭状态已检查。
- 原生按钮发送进入捕获/保存/路由；未释放的异步夹具达到 30 秒超时后 rejected，未生成助手消息，锁与待保存候选均释放。
- 换成明确 pass 测试夹具后，第二条输入完成 `capturing → routing → generating_story → completed`，用户消息保留原文，助手正文正常生成，`pending=false`。服务器独立回读见 `artifacts/yiyu-event-dev-20261007/server-result.json`。
- 本次只使用容器内 mock，没有调用真实路由或裁定模型；临时加载的是事件模块测试入口，并非整个战斗 Vue 产品的完整线上部署验收。
- 临时扩展已移除、标签页已关闭、yiyu 连接字段核对恢复；保留虚构测试聊天和服务器设置备份。me 未修改或重启。
- 现场仍出现旧骰子异常和宿主保存等待，已如实保留为后续兼容风险，没有停用或修改这些第三方脚本。

最终回归补充：原生 regenerate 会在 manifest 拦截前删除旧助手消息，已保留该请求身份并新增针对性回归；此最后修正在离线测试验证，未再次部署 yiyu。
