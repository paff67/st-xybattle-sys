import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{}'
  },
  plugins: [vue(), {
    name: 'xybattle-matched-styles',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const css = Object.values(bundle).filter((asset) => asset.type === 'asset' && asset.fileName.endsWith('.css')).map((asset) => String(asset.source)).join('\n');
      if (!css) throw new Error('Battle UI stylesheet missing from build');
      // ST loads manifest CSS separately and can retain the previous scoped hashes.
      // Carry matching CSS with each JS release, including cache-busted hot imports.
      const install = `if(typeof document!=="undefined"){let s=document.getElementById("xybattle-bundled-styles");if(!s){s=document.createElement("style");s.id="xybattle-bundled-styles";document.head.appendChild(s);}s.textContent=${JSON.stringify(css)};}\n`;
      for (const chunk of Object.values(bundle)) if (chunk.type === 'chunk' && chunk.isEntry) chunk.code = install + chunk.code;
    }
  }],
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
