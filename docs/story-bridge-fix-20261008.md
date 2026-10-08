# 主剧情桥接修复（2026-10-08）

现场：me_sillytavern / batter--test，actionId battle-1791377872237-bks4o-a1。

## 根因与证据

- 裁定记录保存了行动“许妍使用起弦在敌人周围留下多道弦势”，宿主用户消息 #2 却仅含 XY_BATTLE_PACKET。queueMainStory 没有把战斗 UI 的 action.label/intent 传给输入框桥接。
- MainStoryNarrator 返回 pending=true，只代表准备交给宿主生成。judgeAndCommit/rewriteNarrative 却立即置为 awaiting_next，早于注入和正文完成。
- 读取现场时 #3 已有正文，回合记录已收到了宿主 completion；这是提前展示完成状态，并非最终无正文。

## 修改

- 将已提交行动与意图追加到酒馆原有草稿后，再添加场景包；保留原草稿，不重复追加相同行动。
- main_story pending 阶段保持 narrating，收到同作用域、同 actionId 的非空正文后才切换 awaiting_next。
- 发送失败、停止或无正文回到 committed，保留裁定和待处理标记；用户可重试或显式跳过正文。
- 等待正文时禁用下一轮；刷新恢复保留待正文状态；同步重试不复活已跳过或已停战的旧正文。

## 验证

238 项本地回归通过，包括原草稿与行动同时发送、空输入框行动保留、单一场景包、延迟宿主完成、无关 completion 忽略、停止生成与显式跳过、存档与删除回滚。未重放用户真实回合或修改现有聊天消息。
