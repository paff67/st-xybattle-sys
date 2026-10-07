# 战前人物确认与因果状态接入说明

`App.vue` 已在 SillyTavern 宿主的战斗开始流程中挂载 `CharacterConfirmationPanel.vue`。组件只展示和编辑待确认草稿；控制器负责只读来源查询、作用域校验和确认后写入战斗状态。

## 面板契约

组件文件：`src/ui/components/CharacterConfirmationPanel.vue`

```vue
<CharacterConfirmationPanel
  :preparation="controller.characterConfirmationPanel()"
  :busy="preparationBusy"
  @prepare="prepareCharacters"
  @retry="prepareCharacters"
  @confirm="confirmCharacters"
  @cancel="cancelPreparation"
/>
```

`preparation` 使用 `buildCharacterConfirmationPanel()` 的可序列化结果：

```text
{
  schema, status: "awaiting_confirmation" | "confirmed",
  candidates: [{
    id, name, fields,
    editableFields,
    provenance: { "field.path": { source, priority } },
    conflicts: [{ path, kept, keptValue, ignored, ignoredValue }],
    sourceStatus: { mvu_dynamic, database, ai_extract, ai_fill },
    confirmation: { status: "pending" | "confirmed", required: true }
  }]
}
```

面板发出的事件只有四种：

- `prepare`：请求控制器读取当前上下文、MVU 和数据库资料。
- `retry`：重新读取并替换待审核草稿。
- `confirm`：参数为 `{ edits, removeIds }`。`edits` 的键是候选 id，值是候选资料 JSON 对象；`removeIds` 是用户删除的候选 id 列表。
- `cancel`：关闭审核步骤，不改变控制器状态。

`busy=true` 或准备状态不是 `awaiting_confirmation` 时，确认按钮保持禁用。JSON 解析失败只显示字段错误，不发出 `confirm`。所有候选都被删除时也不能确认。面板显示每个字段的实际合并值、来源以及冲突双方的实际值；缺少的来源状态显示“未找到/未配置”，读取异常显示“读取失败”，没有 `scope.branchId` 显示“未知（未绑定聊天分支）”。

## 当前挂载顺序

控制器负责读写和作用域校验，主窗口只维护加载状态：

```js
const preparationBusy = ref(false);

async function prepareCharacters() {
  preparationBusy.value = true;
  try {
    characterPanel.value = await controller.prepareCharacters();
  } finally {
    preparationBusy.value = false;
  }
}

function confirmCharacters({ edits, removeIds }) {
  controller.confirmCharacters(edits, { removeIds });
  controller.start();
}
```

宿主 UI 在 `controller.start()` 前检查 `state.characterPreparation?.status === "confirmed"`；没有已确认资料时进入确认面板。读取中的草稿保留在控制器内存中，确认成功后才写入 `state.actors.enemies`。临时候选不得写入 MVU、数据库、`actors`、`getAiReadContext()` 或裁定请求。非宿主的独立演示流程仍可直接从已导入场景开始。

## 来源与作用域

字段合并优先级固定为：

```text
MVU 动态值 > 数据库资料 > 上下文明确事实 > AI 推断
```

这是字段级优先级，不是整个人物记录替换。每个候选应保留 `provenance` 与 `conflicts` 供审核。控制器在确认时还需把准备草稿的 `scope.chatId/branchId` 与当前状态作用域比较；不一致时拒绝写入并要求重新读取。MVU 和数据库适配器只提供读取方法，任何回写都必须由其他明确的宿主持久化流程完成。

## causalState 接口边界

`src/causal-state.js` 的 `causalState` 是 `battle_v2` 顶层独立结构，不应塞入 `semanticState`。它包含 `anchors`、`relations`、`debts`、`cooldowns`、`ledger`、`appliedActions` 和自己的 `schema/version/scope`。裁定器可提出 `causalChanges`，程序在提交前调用 `applyCausalChanges()` 校验作用域并按 `actionId` 幂等落账；重试和正文重写不能再次写 ledger。进入下一回合时只调用一次 `advanceCausalState()`，跨聊天、分支或 swipe 恢复前必须重新校验 scope。

因果变更应先在副本上试算，确认 operation、实体引用和作用域有效后，再和语义状态一起提交。试算失败应回到 `awaiting_player` 并保留可重试错误，不能让状态停在 `judging`。主剧情场景包只携带已经提交且允许公开的事实；因果内部账本和未确认人物资料不得进入正文桥接。

## 最小验收清单

1. 加载中不能点击确认；无准备草稿只能点击读取。
2. 编辑候选 JSON、删除候选后，`confirm` 事件参数准确反映 `edits/removeIds`。
3. 冲突行同时显示采用值和未采用值，并分别标明来源。
4. MVU/数据库缺失、失败和分支未知均有明确状态文字。
5. 未确认草稿不出现在演员状态、裁定上下文和任何宿主写入中。
6. 相同 `actionId` 的因果提交只产生一个 ledger entry；正文重写、保存重试和 A/B 分支切换都不重复结算。
