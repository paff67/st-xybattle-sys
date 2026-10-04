import { readdir } from 'node:fs/promises';import { spawnSync } from 'node:child_process';
for(const file of ['index.js',...(await readdir('src')).filter((f)=>f.endsWith('.js')).map((f)=>`src/${f}`)]){const result=spawnSync(process.execPath,['--check',file],{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);}console.log('Syntax checks passed for all source modules.');
