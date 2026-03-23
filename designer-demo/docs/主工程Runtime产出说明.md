# 主工程 Runtime 产出说明（设计器解耦）

## 背景

设计器画布需要运行时兼容层（`$t`、`$currency`、Pinia 桩等）以渲染业务组件。原先设计器内置 `designer-demo/src/runtime`，与主工程解耦后，**主工程在物料构建时产出 runtime**，设计器从 bundle 中加载，实现解耦。

## 设计器加载逻辑

1. 设计器在 `appCreated` 时调用 `loadRuntimeModule()`。
2. `loadRuntimeModule` 从 `engine.config.material`、`window.TINY_MATERIAL_BUNDLE_URLS`、URL 参数、环境变量等获取 bundle URL 列表（与 `getMaterialsRes` 一致）。
3. 依次请求各 bundle JSON，解析 `runtimeScript` 字段（支持顶层或 `data.runtimeScript`）。
4. 若找到 `runtimeScript`，则 `import(runtimeScriptUrl)` 动态加载；若无或加载失败，则回退到设计器内置 `@/runtime`。

---

## 主工程需产出的内容

### 1. bundle.json 增加 runtimeScript

在 bundle 根对象或 `data` 下增加 `runtimeScript`，值为 runtime 脚本的 **URL**（相对 bundle 根或绝对）：

```json
{
  "runtimeScript": "runtime.js",
  "data": {
    "materials": { ... }
  }
}
```

相对路径会基于 bundle 的 base URL 解析（如 `http://localhost:3000/bundle.json` → base 为 `http://localhost:3000/`）。

### 2. runtime 模块导出签名

runtime 脚本需为 **ESM**，并导出 `installRuntimeCompat`，签名与设计器内置 runtime 一致：

```ts
import type { App } from 'vue';

export function installRuntimeCompat(app: App): void {
    app.config.globalProperties.$t = t;
    app.config.globalProperties.$currency = currency;
    app.config.globalProperties.$getCurrency = getCurrency;
    app.config.globalProperties.$getCurrencySymbol = getCurrencySymbol;
    app.config.globalProperties.$fd = fd;
    app.use(createPinia());
}
```

### 3. 构建配置（必须单独构建 runtime）

**重要**：runtime 必须用**独立构建**，将 vue、pinia 打包进去，且不能 external。设计器通过 `import(runtime.js)` 动态加载时，浏览器无法解析 bare specifier（如 `'vue'`），否则会报 `Failed to resolve module specifier "vue"`。

推荐使用单独的 `vite.runtime.config.ts`：

```ts
// vite.runtime.config.ts
import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const ROOT = path.resolve(__dirname, '.');

export default defineConfig({
    plugins: [vue(), nodePolyfills()],
    root: ROOT,
    define: {
        'process.env.NODE_ENV': JSON.stringify('production')
    },
    build: {
        outDir: 'dist/lowcode-materials',
        emptyOutDir: false,
        lib: {
            entry: path.join(ROOT, 'lowcode-materials/entries/runtime.js'),
            name: 'RuntimeCompat',
            formats: ['es'],
            fileName: () => 'runtime.js'
        },
        rollupOptions: {
            external: [], // 不 external vue/pinia，全部打包
            output: { entryFileNames: 'runtime.js' }
        }
    },
    resolve: { alias: { '@': path.join(ROOT, 'src') } }
});
```

构建顺序：先执行物料构建（`vite build --config vite.lowcode-materials.config.ts`），再执行 runtime 构建（`vite build --config vite.runtime.config.ts`）覆盖 `runtime.js`，最后执行 `generate-bundle.cjs` 生成 bundle.json。

### 4. 构建后 bundle.json 写入 runtimeScript

在 `generate-bundle.cjs` 中，给 output 对象增加 `runtimeScript` 字段：

```js
const output = {
  runtimeScript: 'runtime.js',
  data: { materials: { ... } }
};
```

---

## Runtime 定制规则

### 必须保留的

| 内容                                                                    | 说明                                                                                    |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `installRuntimeCompat(app)`                                             | 设计器调用入口，必须导出且签名一致                                                      |
| 全局属性 `$t`、`$currency`、`$getCurrency`、`$getCurrencySymbol`、`$fd` | 物料组件模板中可能使用                                                                  |
| Pinia + 桩 store（`useAccountStore`、`usePaymentStore` 等）             | 物料组件若依赖 store，需与主工程 store id 一致（如 `common.account`、`common.payment`） |

### 可精简的

主工程可从 `designer-demo/src/runtime` 复制后，按需删除：

| 文件/内容                                | 是否必须                | 说明                                                                                                                                                                 |
| ---------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `globals.ts`                             | 必须                    | `$t`、`$currency`、`$fd` 等                                                                                                                                          |
| `stores/account.ts`、`stores/payment.ts` | 按需                    | 物料若不用对应 store，可删除；或复用主工程 `canvas-stubs/stores`                                                                                                     |
| `vueRouterStub.ts`、`i18nStub.ts`        | **不属于 runtime 产出** | 用于**物料构建**时的 alias（`vue-router`、`vue-i18n`），应放在 `canvas-stubs/`，由 `vite.lowcode-materials.config.ts` 的 resolve.alias 指向，**不**需打入 runtime.js |

### 可扩展的

-   **新增全局方法**：在 `globals.ts` 中实现，在 `installRuntimeCompat` 中挂到 `app.config.globalProperties`。
-   **新增 Pinia 桩**：在 `stores/` 下新增，`defineStore('主工程 store id', ...)`，与主工程 store id 一致。
-   **替换实现**：主工程可替换 globals 或 store 的实现，只要对外签名与设计器约定一致即可。

### 与物料构建的区分

| 用途                                          | 位置                                               | 说明                                                                                        |
| --------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **runtime.js**（设计器加载）                  | `lowcode-materials/runtime/`、`entries/runtime.js` | 仅包含 `installRuntimeCompat`、globals、Pinia 桩                                            |
| **物料构建 alias**（vue-router、vue-i18n 等） | `canvas-stubs/`                                    | 在 `vite.lowcode-materials.config.ts` 中 alias，物料组件构建时替换，**不**产出到 runtime.js |

### 与设计器旧配置的区分

设计器仓库曾使用 `vite.materials.config.ts` 构建本地物料（designer-demo 本地 materials-src），该文件已删除。主工程使用 `vite.lowcode-materials.config.ts`（物料）和 `vite.runtime.config.ts`（runtime）。

---

## 后续更新流程

主工程 runtime 有变更时，可按以下步骤处理：

1. **修改 runtime 源码**：`lowcode-materials/runtime/` 或 `canvas-stubs/stores/`。
2. **重新构建**：`pnpm run build:designer-materials`（含 runtime 构建）。
3. **验证**：设计器控制台应看到 `已从 bundle 加载 runtime 成功`。
4. **精简**：若不再使用某 store 或全局方法，可从 runtime 中移除对应文件/导出，并同步更新 `installRuntimeCompat`。

---

## 验证

主工程完成上述配置后：

1. 执行 `pnpm run build:designer-materials`
2. 启动静态服务：`npx serve dist/lowcode-materials -p 3000 --cors`
3. 设计器配置主工程 bundle URL
4. 启动设计器，控制台应看到：`[loadRuntimeFromBundles] 从 bundle 加载 runtime: http://localhost:3000/runtime.js` 和 `已从 bundle 加载 runtime 成功`

若失败，请检查：① bundle.json 是否包含 `runtimeScript`；② runtime.js 是否自包含（无 bare import）；③ 是否使用 `nodePolyfills` 解决 `process is not defined`。

---

## 兼容性

-   **无 runtimeScript**：设计器使用内置 `@/runtime`，行为与解耦前一致。
-   **有 runtimeScript 但加载失败**：控制台打 warning，回退到内置 runtime。
