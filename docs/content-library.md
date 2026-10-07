# 功法与法宝内容库

内容库使用版本化 JSON 协议 `xybattle-content-v1` 保存单条内容，批量交换使用 `xybattle-content-export-v1`。`entry` 保持现有 `battle-technique.schema.json` 结构，因此导入内容可以直接进入 `TechniqueRegistry`。

浏览器中完整内容记录写入 IndexedDB（数据库 `st-xybattle-content`、对象仓 `contents`）；`localStorage` 只保存 `xybattle.content.index` 元数据索引和内容库设置。若浏览器禁用 IndexedDB，`ContentStore.status()` 会返回 `durable: false`，并明确提示当前内容只在本次运行期间保留。

典型调用：

```js
import { ContentStore } from './src/content-store.js';
import { previewContentImport, importContent } from './src/content-importer.js';

const store = new ContentStore();
const preview = previewContentImport(jsonText);
await importContent(jsonText, { store, mode: 'reject' });
await store.update('gongfa.example', { name: '修订后的名称' });
await store.copy('gongfa.example');
const exported = await store.exportData();
```

导入默认拒绝同 ID 覆盖；编辑和“覆盖导入”必须显式调用 `mode: 'replace'` 或 `update`。批量导入在写入前完成整批校验，IndexedDB 使用单一事务，失败时不产生部分内容。复制会生成新的 registry ID，并重写该条目内部招式 ID，避免 `findTechnique()` 发生歧义。

内容库不会自动注入正式六法或法宝。默认 `battle_v2` registry 仍只有叠浪玄潮诀演示条目；用户在“内容库”中选择条目并点击“应用到本场”后，控制器才会把选中的快照应用到尚未开始的新战局。已经开始的战斗继续使用自身的 `registrySnapshot`。
