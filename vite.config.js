import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{}'
  },
  plugins: [vue()],
  server: {
    port: 8787,
    host: '127.0.0.1'
  },
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(import.meta.dirname, 'src/ui/mount.js'),
      name: 'XYBattleUI',
      fileName: () => 'battle-ui.bundle.js',
      formats: ['es']
    },
    outDir: 'dist',
    emptyOutDir: false
  }
});
