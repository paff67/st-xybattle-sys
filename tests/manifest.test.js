import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('extension manifest and third-party entry are present', async () => {
  const manifest = JSON.parse(await readFile(new URL('../manifest.json', import.meta.url), 'utf8'));
  const releaseManifest = JSON.parse(await readFile(new URL('../third-party/st-xybattle-sys/manifest.json', import.meta.url), 'utf8'));
  assert.equal(manifest.js, 'index.js');
  assert.equal(releaseManifest.js, 'index.js');
  assert.match(await readFile(new URL('../third-party/st-xybattle-sys/index.js', import.meta.url), 'utf8'), /src\/index\.js/);
  const rootUi = await readFile(new URL('../src/battle-ui.js', import.meta.url), 'utf8');
  assert.match(rootUi, /battle-ui\.bundle\.js/);
  const releaseUi = await readFile(new URL('../third-party/st-xybattle-sys/src/battle-ui.js', import.meta.url), 'utf8');
  assert.match(releaseUi, /battle-ui\.bundle\.js/);
  const bundle = await readFile(new URL('../third-party/st-xybattle-sys/dist/battle-ui.bundle.js', import.meta.url), 'utf8');
  assert.ok(bundle.length > 1000);
  assert.equal(bundle.includes('data:text/css;base64'), false);
  assert.match(bundle, /style\.css/);
});
