import { cp, mkdir, writeFile } from 'node:fs/promises';
await mkdir('third-party/st-xybattle-sys', { recursive: true });
try {
  await cp('dist/st-xybattle-sys.css', 'style.css');
} catch {}
for(const directory of ['src','sample-data','schema','dist']) {
  try {
    await cp(directory,`third-party/st-xybattle-sys/${directory}`,{recursive:true,force:true});
  } catch {}
}
for(const file of ['index.js','manifest.json','style.css','battle-stage.css']) {
  try {
    await cp(file,`third-party/st-xybattle-sys/${file}`);
  } catch {}
}
// 将发布目录中的 battle-ui.js 重定向到已内嵌 Vue 运行时的独立 bundle，确保浏览器原生加载时不发生裸模块导入错误
await writeFile(
  'third-party/st-xybattle-sys/src/battle-ui.js',
  "export { mountBattleSystem } from '../dist/battle-ui.bundle.js';\n",
  'utf8'
);
console.log('Extension package synchronized: third-party/st-xybattle-sys (bundled entry applied)');
