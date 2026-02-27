/**
 * 物料构建配置：原子组件入口（mr-components）、业务组件（mp-card 等）
 * 直接输出到 public/mock/materials/，供设计器 dev 时通过 /mock/materials/xxx.js 访问，无需再复制
 * entry 由 scripts/get-material-entries.js 扫描 materials-src 自动生成，新增组件只需在 materials-src 下加目录（含 index.js）或顶层 .js 文件即可
 */
import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { getMaterialEntries } from './scripts/get-material-entries.js';

export default defineConfig({
  plugins: [vue()],
  root: __dirname,
  define: {
    // echarts 等库在浏览器中会访问 process.env，需注入避免 "process is not defined"
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{"NODE_ENV":"production"}',
    'process': '{"env":{"NODE_ENV":"production"}}'
  },
  resolve: {
    alias: {
      '@local/mr-components': path.resolve(__dirname, 'materials-src/mr-components.js')
    }
  },
  publicDir: false,
  build: {
    outDir: 'public/mock/materials',
    emptyOutDir: true,
    lib: {
      entry: getMaterialEntries(),
      formats: ['es']
    },
    rollupOptions: {
      external: (id) => {
        // mp-card 入口需要 external，避免打进业务包；mr-components 不 external vant，打包进产物
        if (id === 'vue' || id === '@local/mr-components') {
          return true;
        }
        return false;
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name].[ext]'
      }
    },
    sourcemap: false,
    minify: false
  }
});
