# 酒馆助手扩展变量配置持久化实施方案

日期：2026-10-09。状态：设计完成，尚未修改运行时代码或部署。

## 1. 目标与选型

通过酒馆助手的扩展变量接口保存战斗扩展配置，由 SillyTavern 的用户设置持久化到 VPS。相同 ST 实例、相同账号的不同浏览器和设备，在重新加载宿主设置后使用同一份配置。

固定作用域：

```js
const CONFIG_SCOPE = Object.freeze({
  type: 'extension',
  extension_id: 'xybattleConfig',
});
```

使用 `TavernHelper.getVariables(CONFIG_SCOPE)` 读取，使用 `TavernHelper.replaceVariables(envelope, CONFIG_SCOPE)` 写入。当前扩展由 ST 的 `index.js` 加载，不存在隐含的酒馆助手脚本 ID，因此不使用小手机的 `{type:'script'}`。

本地留存的酒馆助手源码 `体系架构协作/测试输出/战斗系统/src/function/variables.ts` 表明：extension 类型映射到 `extension_settings[extension_id]`，写入会调用 `saveSettingsDebounced()`。这是本地接口依据，不是线上版本支持或 VPS 已落盘的证明。

无需新增数据库、独立服务或模型转发代理。API 请求仍按现有路径执行。

## 2. 本期范围

| 数据 | 本期处理 |
| --- | --- |
| 战斗裁定、人物生成、非战斗、正文 API 参数 | 迁至扩展变量 |
| 四类 API Key | 同一扩展变量内独立 credentials 字段 |
| 战斗、人物生成、非战斗通用及八个模块提示词 | 迁至扩展变量，保留用户原文 |
| 输出上限、消息条数、超时、重试、继承关系、自动入口开关 | 迁至扩展变量 |
| 角色卡绑定的世界书底则选择 | 继续使用已有 `extensionSettings.xybattleCoreRules`，不重复保存 |
| 战斗快照、人物确认、回合收据、聊天分支身份 | 继续走原有宿主保存，不放入配置 |
| IndexedDB 内容库、功法激活相关内容数据 | 本期不迁移，不宣称已跨设备同步 |
| 窗口位置、尺寸、折叠状态等纯 UI 偏好 | 继续本地保存 |

用户级配置跨角色卡复用。不同 ST 账号、me/yiyu 等不同实例默认隔离。不把 API 或密钥写进 MVU、聊天变量或消息正文。

## 3. 数据契约

下列是结构示意，API 参数和 settings 的实际字段沿用当前 `normalizeSettings()`，不在本次重命名业务字段。

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "writeId": "程序生成的唯一写入标识",
  "updatedAt": "ISO-8601 时间",
  "settings": {
    "adjudicator": {},
    "characterGenerator": {},
    "dailyAdjudicator": {},
    "narrator": {},
    "characterMaxOutput": 8000,
    "characterMaxRetries": 0,
    "characterMessageCount": 20,
    "dailyTotalTimeoutMs": 240000,
    "adjudicationPrompt": "用户保存的原文",
    "characterCompletionPrompt": "用户保存的原文",
    "dailyPrompts": { "common": "用户保存的原文", "modules": {} },
    "eventAutoEnabled": false,
    "battleStateListenerEnabled": false
  },
  "credentials": {
    "adjudicator": { "apiKey": "" },
    "characterGenerator": { "apiKey": "" },
    "dailyAdjudicator": { "apiKey": "" },
    "narrator": { "apiKey": "" }
  },
  "promptPolicy": {
    "adjudication": { "mode": "custom" },
    "character": { "mode": "custom" },
    "dailyCommon": { "mode": "custom" },
    "dailyModules": {}
  },
  "migration": { "source": "browser-local-v1", "completedAt": "ISO-8601 时间" }
}
```

- envelope 属于专用命名空间，不能替换整份 ST `extension_settings`。
- settings 不含 apiKey；加载后仅在运行时组合 credentials，供现有请求适配器使用。
- credentials 中字段缺省表示更新时保留；明确空字符串表示删除。继承 API 的开关不清除用户独立配置。
- `revision` 和 `writeId` 用于版本比较与写入核对，不是服务端原子锁。
- 八个模块固定为 cultivation、alchemy、crafting、perception、recovery、formation、pursuit、daily。
- 缺少新增字段可以补默认；现有字段类型错误、版本高于支持版本必须明确报错，不能按空配置处理。
- 保留未知字段，防止一次局部保存删除其他版本写入的兼容字段；不支持的 schema 禁止保存。
- 不在宿主设置内追加完整配置历史或大量战报，避免整份用户设置不断膨胀。历史恢复作为后续独立能力。

## 4. 存储适配层

新增 `src/host-config-store.js`，只封装宿主配置，不承担战斗计算。

```ts
interface HostConfigStore {
  ready(): Promise<Capabilities>;
  load(): Promise<{ kind: 'missing' | 'present'; envelope?: ConfigEnvelope }>;
  save(next: ConfigEnvelope, expectedWriteId: string | null): Promise<SaveResult>;
  verifyPersisted(writeId: string): Promise<VerificationResult>;
}
```

约定：

1. 通过注入 helper/context 依赖支持单元测试；生产使用当前宿主提供的 TavernHelper。
2. 启动等待使用真实宿主就绪信号；无信号时有界等待，例如 15 秒，到期展示“酒馆助手配置接口未就绪”并允许重试。
3. 缺接口、读取异常、配置损坏与“命名空间不存在”是不同结果。
4. 生产不静默退回 localStorage 并宣称已同步。离线开发/测试显式注入内存存储。
5. 同一页面写入串行化，保存前再次比较当前 writeId。等待过程中账号变化、页面卸载或新加载代次出现，旧回调不得应用。
6. `verifyPersisted` 的实现必须来自实际宿主版本确认过的保存完成能力或服务端读取能力，不能杜撰接口。

## 5. 启动时序

```text
挂载加载界面
→ 等待 ST 用户设置与酒馆助手就绪
→ 读取扩展配置并校验
→ 如缺配置，进入本地迁移/首次设置流程
→ 获得有效运行时 settings + credentials
→ 创建 BattleController 并完成原有聊天快照恢复
→ 配置非战斗入口与战界状态监听
→ 显示正常工作台
```

配置没有就绪之前不得发送模型请求或启动自动唤起。普通宿主聊天保持可用。配置缺失时可展示默认表单，但不能仅因渲染表单就保存默认值。

建议保留 `mountBattleSystem()` 的外部句柄形式，新增 `api.ready`；句柄 open/close 可操作加载界面，依赖控制器的方法等待 ready 或抛出明确未就绪错误。控制器构造改为接收已加载的 initialSettings/configStore，不再自行把浏览器配置当作权威。配置初始化与原有 `controller.ready` 的聊天恢复顺序明确分开。

## 6. 保存与运行时生效

1. 设置页持有独立草稿和打开页面时的 baseWriteId；修改不会立即覆盖运行时。
2. 点击保存后校验全量合并结果，包括继承 API、参数、提示词和入口启用条件。白名单投影敏感字段，不能先调用 stripSecrets 再丢失待保存凭据。
3. 战斗裁定、人物准备、非战斗事务任一请求正在执行时拒绝保存；配置锁必须覆盖三条链路，而不只检查 controller.inFlight。
4. 锁住新的自动入口触发，记录当前启用状态；串行提交扩展变量，再核对宿主内存中的 writeId/内容。失败保留草稿和旧运行时配置。
5. 成功交付宿主后应用新的运行时配置，按新设置重新配置入口。若入口启用失败，分别显示“配置已提交，入口启用失败”，不要把两个结果混为一谈。
6. 保存确认超时属于“结果未确认”，不得盲目写回旧配置；先读回核对，避免覆盖可能已保存的新数据。
7. App 的保存处理必须 await，不再无条件显示本地保存成功。

保存状态及界面文案：

| 状态 | 文案与含义 |
| --- | --- |
| dirty | 有未保存修改 |
| saving | 正在提交配置 |
| submitted | 已提交酒馆保存，服务器保存待确认 |
| confirmed | 已确认服务器保存（必须有对应写入证据） |
| error | 保存失败，草稿保留；展示可理解的错误 |
| conflict | 检测到配置变化，请重新加载或比较修改 |

`replaceVariables()` 返回、同页 `getVariables()` 回读成功以及本地增加 revision，都不等于 VPS 保存确认。其内部 saveSettingsDebounced 可能尚未开始请求。无可靠确认能力时，允许正常使用 submitted 配置，但文案保持 submitted，使用重新加载和第二设备回读完成验收。

## 7. 本地配置迁移

读取现有 `battle_v2.settings`、旧版本聊天作用域配置（发现时明确列出来源）和 `xybattle.credentials.v1`，只读取目标扩展的键。先保留原始数据，再做规范化。不能把多个聊天或不同浏览器配置无提示混成一份。

| 宿主状态 | 本地状态 | 行为 |
| --- | --- | --- |
| 缺失 | 存在 | 展示迁移预览，用户点击“迁入酒馆配置”后提交 |
| 缺失 | 缺失 | 打开首次配置页，由用户主动保存 |
| 存在 | 相同或没有 | 加载宿主，忽略旧本地配置 |
| 存在 | 不同 | 默认用宿主；提供比较和主动迁入，不自动覆盖 |
| 不可读取或损坏 | 任意 | 显示错误，不能视为宿主缺失 |

迁移预览仅展示 endpoint/model/参数、提示词差异和密钥“有/无”，不展示密钥正文。DebugProfile 的存储无法从普通 Chrome 页面读取，需要在对应浏览器上下文执行迁移，或由用户显式导入配置。不能宣称已恢复其他浏览器中不可访问的数据。

迁移标记以服务器确认结果为准，未确认标记 pending；重试先核对 writeId，避免重复覆盖。默认保留原本地数据，不再日常双写；之后提供明确的“清理已迁移本地配置”操作。已经被覆盖且没有副本的提示词，迁移不能自动找回。

## 8. 提示词保真与升级

修改 `normalizeCharacterCompletionPrompt()` 和裁定提示词规范化流程，移除按内容猜测旧模板并替换的行为。

- 旧配置中的所有非空提示词均按 custom 迁入，包括看起来与旧内置模板相同的文本。
- custom 原文按字节对应的字符串保留，不 trim 后回写。执行时如需处理空白，应与持久化原文分离。
- 首次无配置的新用户按 builtin 初始化；builtin 存储模板 ID/版本，运行时取该版本默认值。
- 内置模板升级不能借规范化静默覆盖已保存文本；显示可用更新，用户主动采用。
- 用户编辑后设为 custom；“恢复默认”只修改草稿及对应 promptPolicy，保存后生效。
- 空白自定义提示词保存时明确报错或要求用户使用恢复默认按钮，不能静默替换。
- 不以本次持久化改造修改提示词的业务内容或模型返回协议。

## 9. 凭据与导入导出

采用小手机同类宿主保存机制，密钥是用户设置中的普通字符串，没有新增加密服务。需要同步修正 UI 中“凭据仅保存在浏览器”的文案。

凭据不得进入 battle state、request logs、MVU、聊天正文、普通配置导出或错误对象。保存 envelope 时使用明确的持久化序列化；日志/导出时使用另一套脱敏投影。配置备份默认不含密钥，导入缺少 credentials 表示保留已有凭据，不能抹空。

当前 `BattleController.importData()` 会采纳导入存档的 settings。改造后导入战斗存档默认只导入战斗数据，不隐式修改用户级 API 配置；如需采纳存档设置，走单独的配置预览和同一保存入口。

## 10. 跨设备语义与限制

本期承诺“服务端保存后，其他设备重新加载可恢复”，不承诺实时推送。设置页提供重新加载操作；有草稿或请求执行中不能自动覆盖运行时。

宿主扩展变量读写是内存读改写并延迟保存，可能保存整份 ST 用户设置。两个设备各自持有旧设置时，单纯 revision 不能实现跨设备原子比较交换，甚至其他设置保存也可能带回旧配置。

因此本期：

- 单设备串行保存；跨设备切换前刷新，避免同时编辑。
- 若确认有服务端最新读取能力，保存前检测远端 writeId，降低已知冲突风险，但仍不声称原子保护。
- 没有可靠远端读取时明确标注并发限制，不用同页 getVariables 冒充远端冲突检查。
- 若要求多设备同时修改也绝不覆盖，必须另加宿主服务端条件写入能力；不属于纯扩展变量方案能独立保证的范围。

## 11. 文件改动清单

| 文件 | 改动 |
| --- | --- |
| 新增 `src/host-config-store.js` | helper 能力探测、专用 namespace 读写、状态与保存核对 |
| 新增 `src/config-schema.js` | envelope 校验、纯迁移、运行时合并、凭据拆分和导出投影 |
| 新增 `src/config-migration.js` | 本地来源扫描、差异预览、显式迁入及迁移标记 |
| `src/ui/mount.js` | 配置就绪屏障、加载/失败 UI、顺序恢复入口 |
| `src/battle-controller.js` | initialSettings 注入、异步保存、配置锁、导入边界 |
| `src/battle-storage.js` | 旧 settings 仅供迁移；session/logs 保持原路径 |
| `src/credential-store.js` | 旧本地凭据仅供迁移；生产凭据由宿主配置提供 |
| `src/adapters.js`、`src/character-prompts.js`、`src/event-daily-prompts.js` | 参数规范化与提示词原文保存分离，取消内容猜测覆盖 |
| `src/ui/App.vue` | await 保存、统一入口应用与保存状态通知 |
| `src/ui/components/SettingsPanel.vue` | 来源/保存状态、迁移预览、重新加载、忙时禁止保存 |
| `docs/event-daily-settings.md` 等配置说明 | 更新保存范围、密钥处理、跨设备及并发限制 |
| 构建输出及 third-party 镜像 | 使用现有 build 流程同步，不手工修改 bundle |

## 12. 实施顺序与验收

### 阶段 A：确认真实宿主契约

核对目标实例酒馆助手版本、公开 extension 变量接口、ST 用户身份与持久卷。使用独立的无凭据探针 namespace 写入唯一标记；验证重新加载、另一浏览器和服务器用户设置持久数据一致，再恢复探针原值。检查保存完成能力与失败表现，不改动正式配置来试错。

输出接口记录：版本、支持能力、保存确认等级、数据所在用户范围；不记录真实密钥。实例不支持 extension 时先解决兼容性，不改用 global/chat 变量绕过。

### 阶段 B：实现存储与迁移

先做 schema/store/migration，再接控制器和启动屏障，最后改界面。单次保存中参数、提示词与凭据保持同一版本；自定义提示词不改内容。

### 阶段 C：自动化验证

- 宿主优先、缺失/异常区分、就绪延迟时不启动入口。
- 四类 API、继承关系、所有提示词和参数完整往返。
- 自定义提示词包含旧模板关键句也不被替换，空白与未知版本明确处理。
- 首次迁入、重复迁入、两份本地差异、宿主已有数据保护。
- 密钥缺省保留、明确清空删除、普通导出及日志不泄漏。
- 保存拒绝、延迟、确认超时、入口重配失败时界面与实际状态一致。
- 战斗/人物/非战斗请求期间配置锁；旧异步回调不污染新加载周期。
- 单页面并行点击串行化；同内存版本冲突检测不冒称跨设备 CAS。
- 导入战斗存档不隐式覆盖全局配置；原聊天/分支保存回归。
- 执行 `npm test`、`npm run lint`、`npm run build`，检查构建镜像同步。

### 阶段 D：真实 ST 验收与发布

1. 浏览器 A 保存测试模型参数和独特提示词，刷新后完全一致。
2. 浏览器 B/手机登录同账号，加载后参数和提示词一致；密钥可使用且不在日志中暴露。
3. B 修改并保存，A 主动刷新后读取新版本；不同账号不串用。
4. 断网提交、恢复联网、重新加载，分别核对 submitted/error/confirmed，不能假报服务器成功。
5. 扩展升级后自定义提示词保留；继承与独立 API 配置均保持。
6. 控制重启或等价持久存储检查验证数据不在临时容器层；不为验证而无授权中断共享实例。
7. 检查双设备过期设置覆盖行为并写入限制说明，不把该测试当作已具备防丢更新能力。

本验收不需要完整重跑战斗模型；如验证密钥有效性需真实请求，使用最小请求并单独报告。离线测试、宿主保存验证、模型请求成功分开记录。

发布前保留现有部署版本和服务器配置备份，不纳入 Git。回滚不删除新 namespace；如旧版只能读本地配置，在需要的设备显式恢复本地兼容副本，避免误以为回滚后服务器配置也会自动读取。

## 13. 完成标准

仅当真实宿主支持确认、自动化回归通过、至少两个浏览器独立加载恢复通过，才能宣称配置已支持跨浏览器保存。跨手机设备、服务器重启持久性若未实测，单列为待验证。

交付包含实现提交、迁移 UI、配置说明及验收记录。方案文档本身不表示代码已落地，也不表示测试时丢失的旧提示词已经找回。
