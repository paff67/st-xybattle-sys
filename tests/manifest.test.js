import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('extension manifest and third-party entry are present', async () => {
  const manifest = JSON.parse(await readFile(new URL('../manifest.json', import.meta.url), 'utf8'));
  const releaseManifest = JSON.parse(await readFile(new URL('../third-party/st-xybattle-sys/manifest.json', import.meta.url), 'utf8'));
  assert.equal(manifest.js, 'index.js');
  assert.equal(releaseManifest.js, 'index.js');
  assert.match(await readFile(new URL('../third-party/st-xybattle-sys/index.js', import.meta.url), 'utf8'), /src\/index\.js/);
});
