import { cp, mkdir } from 'node:fs/promises';
await mkdir('vendor/jsonrepair', { recursive: true });
for (const path of ['index.js', 'regular', 'utils']) await cp(`node_modules/jsonrepair/lib/esm/${path}`, `vendor/jsonrepair/${path}`, { recursive: true });
await cp('node_modules/jsonrepair/LICENSE.md', 'vendor/jsonrepair/LICENSE.md');
