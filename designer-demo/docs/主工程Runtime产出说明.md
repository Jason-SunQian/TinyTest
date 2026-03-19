# 主工程 Runtime 产出说明（设计器解耦）

## 背景

设计器画布需要运行时兼容层（`$t`、`$currency`、Pinia 桩等）以渲染业务组件。原先设计器内置 `designer-demo/src/runtime`，与主工程解耦后，**主工程在物料构建时产出 runtime**，设计器从 bundle 中加载，实现解耦。

## 设计器加载逻辑

1. 设计器在 `appCreated` 时调用 `loadRuntimeModule()`。
2. `loadRuntimeModule` 从 `engine.config.material`、`window.TINY_MATERIAL_BUNDLE_URLS`、URL 参数、环境变量等获取 bundle URL 列表（与 `getMaterialsRes` 一致）。
3. 依次请求各 bundle JSON，解析 `runtimeScript` 字段（支持顶层或 `data.runtimeScript`）。
4. 若找到 `runtimeScript`，则 `import(runtimeScriptUrl)` 动态加载；若无或加载失败，则回退到设计器内置 `@/runtime`。

## 主工程需产出的内容

### 1. bundle.json 增加 runtimeScript

在 bundle 根对象或 `data` 下增加 `runtimeScript`，值为 runtime 脚本的 **URL**（相对 bundle 根或绝对）：

```json
{
  "data": {
    "framework": "Vue",
    "materials": { ... }
  },
  "runtimeScript": "https://your-cdn.com/lowcode-materials/runtime.js"
}
```

或：

```json
{
  "data": {
    "materials": { ... },
    "runtimeScript": "runtime.js"
  }
}
```

相对路径会基于 bundle 的 base URL 解析（如 `http://localhost:3000/bundle.json` → base 为 `http://localhost:3000/`）。

### 2. runtime 模块导出签名

runtime 脚本需为 **ESM**，并导出 `installRuntimeCompat`，签名与设计器内置 runtime 一致：

```ts
import type { App } from 'vue';

export function installRuntimeCompat(app: App): void {
    // 全局属性：$t、$currency、$getCurrency、$getCurrencySymbol、$fd
    app.config.globalProperties.$t = t;
    app.config.globalProperties.$currency = currency;
    // ...
    app.use(pinia);  // Pinia + 桩 store（useAccountStore、usePaymentStore 等）
}
```

### 3. 构建配置示例

在主工程 `lowcode-materials` 构建中增加 runtime 入口：

```ts
// vite.lowcode-materials.config.ts
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                // 物料入口...
                runtime: 'lowcode-materials/entries/runtime.ts'
            },
            output: {
                entryFileNames: '[name].js'
            }
        }
    }
});
```

`lowcode-materials/entries/runtime.ts` 可从 `designer-demo/src/runtime` 复制或链接，或主工程自建与画布同签名的桩（见 `业务与原子组件导入方案.md` 12.3.2）。

### 4. 构建后 bundle.json 生成

构建脚本需在产出 `bundle.json` 时写入 `runtimeScript`，例如：

```js
// 构建后处理
const bundlePath = 'dist/lowcode-materials/bundle.json';
const bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf-8'));
bundle.runtimeScript = 'https://your-cdn.com/lowcode-materials/runtime.js';  // 或相对路径 "runtime.js"
fs.writeFileSync(bundlePath, JSON.stringify(bundle, null, 2));
```

## 验证

主工程完成上述配置后：

1. 执行 `pnpm run build:designer-materials`（或等价构建命令）
2. 启动静态服务：`npx serve dist/lowcode-materials -p 3000 --cors`
3. 设计器配置主工程 bundle URL（如 `engine.config.material` 或 `?materialBundle=http://localhost:3000/bundle.json`）
4. 启动设计器，打开控制台，应看到：`[loadRuntimeFromBundles] 从 bundle 加载 runtime: <url>` 和 `已从 bundle 加载 runtime 成功`

若仍显示「未找到 runtimeScript，使用设计器内置 runtime」，请检查：① 主工程 bundle.json 是否包含 `runtimeScript` 字段；② 设计器是否成功加载了主工程 bundle（控制台是否有 `[Materials] 已加载物料 bundle: http://localhost:3000/bundle.json`）；③ `runtime.js` 是否可访问（如 `http://localhost:3000/runtime.js`）。

## 兼容性

- **无 runtimeScript**：设计器使用内置 `@/runtime`，行为与解耦前一致。
- **有 runtimeScript 但加载失败**：控制台打 warning，回退到内置 runtime。
- **主工程暂未产出 runtime**：可不声明 `runtimeScript`，设计器继续用内置 runtime。
