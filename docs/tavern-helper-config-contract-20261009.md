# 配置持久化阶段 A：真实宿主契约记录

日期：2026-10-09。状态：阶段 A 的服务器、双浏览器探针与清理已完成；阶段 B/C 本地实现中，尚未发布。

## 现场核对

- 仓库 origin 为 `https://github.com/paff67/st-xybattle-sys.git`，本地基线 `b4272d73876875f0a749d558d06ea4fe594c1568`。
- 目标测试实例：`ssh.paff-67.top` 的 `sillytavern_yiyu`，ST 1.17.0，酒馆助手 4.11.0。未触碰 me 实例。
- 数据 bind mount：`/opt/sillytavern/yiyu_data` → `/home/node/app/data`；插件及扩展也为独立 bind mount。
- 设置路径：`/opt/sillytavern/yiyu_data/default-user/settings.json`；两浏览器与该用户文件的探针 writeId 一致。测试前后正式 `extension_settings.xybattleConfig` 均不存在。
- 酒馆助手线上 `src/function/variables.ts` 和 `dist/index.js` 都有 extension 分支：读取 `extension_settings[extension_id]`，写入后调用 `saveSettingsDebounced()`。
- TavernHelper `replaceVariables` 不提供该写入的服务器完成结果。
- ST `saveSettings()` 将整份用户设置 POST 到 `/api/settings/save`；失败被捕获并提示。成功后的 `SETTINGS_UPDATED` 没有 writeId，不能单独用作本配置保存确认。
- `/api/settings/get` 使用 `request.user.directories.root` 读取设置文件，响应的 `settings` 是 JSON 字符串。这是该版本真实的服务器读回能力；不要把 helper 内存回读当成此接口。
- `SillyTavern.getContext()` 暴露 `extensionSettings`、`getRequestHeaders`、`saveSettingsDebounced`、`eventSource`、`eventTypes`。浏览器观察到 SETTINGS_LOADED / APP_READY；helper 出现早于设置加载，不能作为设置已就绪的证明。ST `/script.js` 导出活绑定 `settingsReady`，在 SETTINGS_LOADED 前设为 true，初始化按此标志有界等待。

线上源码 SHA-256：

```text
JS-Slash-Runner/dist/index.js
3c8f9d0fd4dce6ce78c11fa1af97c30fcaf68fa6549204c2b2131e5554791132
JS-Slash-Runner/src/function/variables.ts
4bb8008e68a6ff7c9e21a6e5e4fc7d08157593c82f562c855e4e3d416fd3c2a4
```

## 探针与剩余验收

`scripts/host-config-probe.mjs` 是供目标 ST 页面执行的独立工具，不参与扩展启动。`inspectHostConfigContract()` 本身不写入；返回的 `inspect()` 只输出专用探针值。`roundTrip()` 显式写入无凭据唯一标记，并以服务器读回核对，随后恢复原探针值。没有原键时只删除探针键并调用宿主保存，不写入整个设置对象。检测到探针变化或未确认写入时停止恢复，避免盲目覆盖。

浏览器执行前记录账号和 helper 实际加载状态；可在 `onPersisted` 回调中等待人工完成以下检查，再允许恢复。浏览器 A 刷新会终止原页面回调，因此需要在刷新后的页面显式恢复探针，不能依赖旧页面 finally。原值应在测试前保存为只含探针的临时记录。

1. A 写入后读回 `/api/settings/get`，并在 VPS 只输出探针 namespace 对照。
2. A 刷新后独立读取，B 使用独立浏览器上下文登录同账号读取同一 writeId。
3. 恢复原探针值或删除原本不存在的键，确认服务器读回和 VPS 文件一致。
4. 核对断网提交、恢复联网以及就绪事件行为；不能将一次成功写入当作失败行为验证。

## 已执行的浏览器证据

- 用户建立本地 18004 隧道后，独立会话 config-verify-a 写入探针 `xybattleConfigProbe20261009`，writeId 为 `b86f2c81-e11e-4f14-9c1f-08b03db89ea9`，创建时间 `2026-10-09T14:27:33.181Z`。
- `/api/settings/get` 返回 200；VPS 用户设置文件、A 刷新后 helper、独立会话 config-verify-b 的 helper 均返回相同 writeId。
- A 断网后 replaceVariables 正常修改内存为另一个测试标记；服务器仍保留上面的 writeId。恢复联网并刷新后重新得到服务器标记。由此确认 replaceVariables 返回不等于保存成功。
- 清理时本地隧道中断，保存先报 ERR_CONNECTION_RESET，后报 ERR_CONNECTION_REFUSED；重建隧道后重试宿主保存，VPS 文件确认探针键已不存在。两测试浏览器已关闭，正式 namespace 未写入，无真实模型请求。
- 手机、不同账号、服务器重启和本次完整配置实现的阶段 D 验收尚未完成。阶段 A 的无凭据探针不能替代这些验收。
