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
      '@local/mr-components': path.resolve(__dirname, 'materials-src/mr-components.js'),
      '@local/runtime': path.resolve(__dirname, 'src/runtime'),
      'vue-router': path.resolve(__dirname, 'src/runtime/vueRouterStub.ts'),
      'vue-i18n': path.resolve(__dirname, 'src/runtime/i18nStub.ts')
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
        // vue、mr-components 由画布/引擎侧提供；pinia 不 external，否则浏览器画布 iframe 无法解析裸模块 "pinia" 导致所有物料加载失败
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
