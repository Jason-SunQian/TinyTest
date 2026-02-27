/**
 * 物料构建配置：原子组件入口（mr-components）、业务组件（mp-card 等）
 * 直接输出到 public/mock/materials/，供设计器 dev 时通过 /mock/materials/xxx.js 访问，无需再复制
 * 新增组件时：在此文件的 build.lib.entry 中增加一条入口即可
 */
import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  root: __dirname,
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
      entry: {
        'mr-components': path.resolve(__dirname, 'materials-src/mr-components.js'),
        'mp-card': path.resolve(__dirname, 'materials-src/mp-card/index.js'),
        'mp-progress': path.resolve(__dirname, 'materials-src/mp-progress/index.js')
      },
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
