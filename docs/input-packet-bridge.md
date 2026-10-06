# XY_BATTLE_PACKET 输入与显示桥

`HostInputBridge` 在已提交收据确认后，把一个 `BATTLE_SCENE_PACKET` 作为纯文本标记追加到当前 SillyTavern 输入框。标记身份由 `branchId`、持久化 `version` 和 `actionId` 共同决定；同一身份再次入队不会追加第二份，其他版本会被视为冲突。

输入桥只拥有它自己追加的尾缀。聊天、swipe、停止生成、页面隐藏或显式清理时，如果用户没有改写尾缀，桥会恢复原输入；用户编辑过输入时只在能精确识别尾缀的情况下移除它，否则保留用户内容。

`BattleHostAdapter` 在 `GENERATION_AFTER_COMMANDS` 前先确认输入仍包含完整标记。主机创建用户消息后，`USER_MESSAGE_RENDERED` 事件再次核对该用户消息的原文；只有原消息含有精确身份的标记，输入传输才标记为已验证。若主机重写或丢弃标记，则回退到一次性的 `injectPrompts`，不会同时保留两种传输。

`HostDisplayFolding` 只处理 `.mes_text` 的 DOM 投影。它可以跨越 `<em>`、`<code>`、`<br>` 等文本节点创建折叠的 `<details>`，并用 `textContent` 写入原始标记，因此不会执行包内 HTML，也不会修改 `context.chat[*].mes`、swipe 存储或发送给模型的原文。普通链接、事件和其他消息容器独立保留。

当前测试覆盖离线标记往返、特殊分隔符文本、输入事件、身份幂等、用户编辑保护、适配器发送时序、跨节点显示折叠和跨消息隔离。真实 SillyTavern 浏览器的事件顺序、正则配置和模型抓包仍需在目标实例上单独验收；正则只允许改变显示投影，不能作为保存或结算钩子。

