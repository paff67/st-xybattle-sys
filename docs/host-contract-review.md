# SillyTavern 宿主契约审查（battle_v2）

日期：2026-10-04。本文只记录本地可审计证据和已做的真实宿主复测；没有调用真实模型，也没有改动 `me`。

## 证据等级

- **本地宿主源码快照**：`E:\RP\体系架构协作\测试输出\战斗系统\src\function\chat_message.ts`、`src\function\inject.ts`、`@types\function\*.d.ts`、`@types\iframe\exported.mvu.d.ts`。这些是已安装助手/宿主接口的源码与类型快照，能证明函数形状和实现细节，但不证明当前浏览器缓存版本。
- **真实隔离实例复测**：`测试报告.md`、`协议与接口.md`、`yiyu-真实集成测试.md`。2026-10-03 在独立 `yiyu` 实例中实际验证了 MVU 定向写、消息 `extra`、A/B swipe 往返、整页刷新落盘、正文 `injects` 隔离和 `stopGenerationById`。请求全部为容器内 mock，真实模型调用为 0；A/B 切换后 SP 摘要仍可能停在 A，因此不能把三种存储视为自动同步。
- **扩展加载夹具**：`小手机评估\remote-extension\manifest.json` 与 `index.js`，以及 `remote-evidence.json`。夹具以 `/scripts/extensions/third-party` 挂载；生产/隔离浏览器曾停在白名单 403，未证明当前浏览器实际加载了该扩展。

## 扩展包必须满足的加载契约

目录应部署为 `public/scripts/extensions/third-party/<extension-id>/`，至少包含：

```text
manifest.json
index.js
```

夹具 manifest 的已见字段是 `display_name`、`loading_order`、`requires`、`js`、`version`（见 `小手机评估\remote-extension\manifest.json`）。`js` 指向入口文件；这里是 `index.js`。`index.js` 再以相对自身 URL 动态 import `src/index.js`，不要依赖打包器别名或 Node 全局。

宿主源码分析记录的加载链为：认证后的 `/api/extensions/discover` 返回扩展目录名；随后请求 `/scripts/extensions/${name}/manifest.json`，再以 `/scripts/extensions/${name}/${manifest.js}` 注入 script 或 dynamic import。相关分析见 `E:\st gateway\plan_c_optimization.md:15-31` 和 `plan_c_evaluation.md:65-81`。因此 `st-xybattle-sys/index.js` 不能只作为 npm 入口；需要同时提供可被浏览器直接加载的扩展入口和 manifest。加载顺序应放在普通 UI 之后（夹具使用 `loading_order:10000`），`requires` 仅声明确实存在的扩展。

## 正常用户生成时追加已提交场景包

战斗控制器先完成裁定、保存 `prepared`/`committed` 收据并确认回读，再把**公开** `BATTLE_SCENE_PACKET` 作为本轮附加上下文。不要把 packet 写进用户可见正文，也不要用 regex/Prompt Template 的渲染回调触发扣费或提交。

最稳妥的公开接口是 TavernHelper 的 `injectPrompts`（实现调用宿主 `setExtensionPrompt`）：

```js
const { uninject } = injectPrompts([
  { id: `battle_v2:${actionId}`, role: 'system', position: 'in_chat', depth: 0,
    should_scan: false, content: packetText },
], { once: true });
```

实现证据：`src/function/inject.ts:21-40`；`once` 在 `GENERATION_ENDED`、`GENERATION_STOPPED`（iframe 与宿主事件）及 `pagehide` 清理，见 `src/function/inject.ts:44-50`。类型文档明确指出跨聊天需监听 `tavern_events.CHAT_CHANGED`，在每次生成前可监听 `tavern_events.GENERATION_AFTER_COMMANDS` 再注入，见 `@types/function/inject.d.ts:27-31`。因此推荐流程是：在 `GENERATION_AFTER_COMMANDS` 回调中读取当前作用域并只注入一次；若该回调发现 scope/version 已变化则立即 `uninject` 并放弃正文。

`generate({ injects })` 可用于控制器自己的正文桥接；`generateRaw({ ordered_prompts, injects })` 可用于独立裁定。类型证据在 `@types/function/generate.d.ts:147-201,279-322`。裁定和正文必须使用不同请求的 injects，且给每个请求设置 `generation_id`，取消时调用 `stopGenerationById(id)`（同文件 `:201-218,230-267`）。真实复测证明正文请求能收到短规则/事实标记，而紧随其后的辅助 `generateRaw` 不含这些标记；这证明传输隔离，不证明模型遵守规则。

## 聊天消息与 swipe 分支持久化

`getChatMessages(range,{include_swipes:true})` 返回固定楼层的 `message_id`、`swipe_id`、`swipes`、`swipes_data`、`swipes_info`；不要用“最后一楼”代替已固定的 `chat/message/swipe`。源码证据 `src/function/chat_message.ts:71-168`。

战斗收据的权威副本放在当前分支的 `message.extra.battle_v1`，并同步放在同一楼层 `swipe_info[swipe_id].battle_v1`；保留所有其他 `extra` 字段。写入必须携带原消息合并后的完整字段并调用：

```js
const [m] = getChatMessages(messageId, { include_swipes: true });
const info = m.swipes_info.map((x) => ({ ...x }));
info[m.swipe_id] = { ...info[m.swipe_id], battle_v1: receipt };
await setChatMessages([{
  message_id: m.message_id,
  swipe_id: m.swipe_id,
  swipes: m.swipes,
  swipes_data: m.swipes_data,
  swipes_info: info,
}], { refresh: 'none' });
```

已测版本的 `extra-only` 更新不生效；必须携带原 message/swipe 结构。实现把 `extra` 映射到当前 `swipe_info`，并在刷新路径调用保存，见 `src/function/chat_message.ts:212-319`；类型示例也明确使用原消息 `data` 再 `setChatMessages`，见 `@types/function/chat_message.d.ts:101-150`。真实复测确认 A 分支收据/变量为 A，切到 B 后不带 A，切回 A 后恢复；整页刷新仍可读回。删除/插入楼层会使数字 ID 漂移，收据还应保存稳定 `actionId`/`battleId`，并在读取时核对 `chat/message/swipe/version`。

## MVU、SP 与当前工程的适配边界

- MVU：用 `Mvu.getMvuData({type:'message',message_id})` 读取当前分支，克隆后只改控制器拥有的资源字段，再 `Mvu.replaceMvuData`；接口和 `VARIABLE_UPDATE_ENDED`/`BEFORE_MESSAGE_UPDATE` 事件见 `@types/iframe/exported.mvu.d.ts:90-188`。事件结束不等于服务器落盘确认，仍需回读消息。
- SP/AutoCardUpdater：只写当前允许的摘要投影；行号和锁索引不同（数据 CRUD 首行为 1，`lockTableRow` 首行索引为 0，内部 `sheetKey` 不是显示表名），所有 false/异常/忙状态都要处理并回读。`协议与接口.md` 的 SP 表格和 `yiyu-真实集成测试.md` 是实测出处。
- SP 摘要不是历史分支权威。A→B 的真实 `setChatMessages` 切换中，MVU/消息收据切换正确，但 SP 仍保留 A 摘要。摘要行必须携带 `chat/message/swipe/battle/actionId/version`；不匹配时标记 pending/只读，禁止据此结算。
- 当前 `st-xybattle-sys/src/battle-storage.js` 仅使用 `localStorage` 保存 settings/session/logs。这只能作为 UI 缓存或离线 fallback；正式宿主适配器必须改为上述消息 `extra` + MVU 定向投影，不能把 localStorage 当聊天跨设备存档。敏感 API key 不写任何持久层或日志。

## 接入验收（真实宿主仍需补做）

1. 将 `manifest.json`/入口安装到独立实例的 third-party 目录，确认 `/api/extensions/discover`、manifest、`index.js` 均 200，并在浏览器控制台确认挂载一次。
2. 真实用户发送一条普通 prompt；在 `GENERATION_AFTER_COMMANDS` 注入一次 packet，抓取最终请求确认原 prompt 保留、packet 只出现一次；生成结束/停止后确认注入已清理。
3. 在同一楼层创建 A/B swipe，分别提交并刷新，确认 `extra.battle_v1`、`swipe_info`、MVU 数据互不串分支；切换到旧楼层时必须只读。
4. SP 写入/锁/忙/回读及跨标签并发仍未由现有证据覆盖，完成前不得宣称跨组件原子提交。

