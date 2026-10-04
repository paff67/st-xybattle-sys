import { cp, mkdir } from 'node:fs/promises';
await mkdir('third-party/st-xybattle-sys', { recursive: true });
await cp('src', 'third-party/st-xybattle-sys/src', { recursive: true, force: true });
await cp('sample-data', 'third-party/st-xybattle-sys/sample-data', { recursive: true, force: true });
await cp('index.js', 'third-party/st-xybattle-sys/index.js');
await cp('manifest.json', 'third-party/st-xybattle-sys/manifest.json');
