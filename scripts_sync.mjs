import { cp, mkdir } from 'node:fs/promises';
await mkdir('third-party/st-xybattle-sys', { recursive: true });
for(const directory of ['src','sample-data','schema'])await cp(directory,`third-party/st-xybattle-sys/${directory}`,{recursive:true,force:true});
for(const file of ['index.js','manifest.json','style.css','battle-stage.css'])await cp(file,`third-party/st-xybattle-sys/${file}`);
console.log('Extension package synchronized: third-party/st-xybattle-sys');
