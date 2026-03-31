# 公共样式与UnoCSS导入设计器方案

> 目的：把主工程（`/Users/mac/Desktop/Project/2025/mobilebanking`）中为 UI/物料服务的公共样式能力（设计 token、主题 token、公共覆盖、UnoCSS utilities 等）以“可交付产物”的形式，通过 VSCode 插件导入设计器，使开发者在设计器属性面板配置 `Class Name`（如 `flex items-center text-h3 text-color-secondary`）后：
>
> - 画布上能立刻看到对应效果（所见即所得）
> - 出码后能生成与主工程一致的 class 写法（如图 1 所示）

约束：

- 设计器（`designer-demo`）与主工程解耦；设计器侧仅消费“注入/可访问的资源 URL”，不直接依赖主工程源码。
- 不修改 `packages/`，所有改造都在 `designer-demo` 与插件侧完成。

---

## 1. 现状梳理：设计器如何加载“物料相关样式”

当前物料链路里，主工程会在 `dist/lowcode-materials/` 产出并提供：

- `bundle.json`
- 组件 ESM 脚本（`mr-components.js`、`mp-*.js`）
- 物料样式（如 `mr-bank.css`，包含设计 token/base overrides 等）

设计器侧在画布依赖注入中：

- 会把 `scripts/styles` 归一化成绝对 URL，避免 `vscode-webview:` 这类 URL 在 iframe 内导致 403（见 `designer-demo/src/composable/canvasDepsNormalizer.ts` 的 `normalizeCanvasDeps` 逻辑）。
- iframe CSP 已对 `localhost:3000/3060` 等常见物料服务器 origin 放行（见 `CanvasContainer.vue` 中对 `script-src/style-src/connect-src` 的拼装）。

结论：

- **设计器具备“加载外部 CSS/JS 资源到画布”的基础设施**。
- 现在缺少的是：把“公共 utilities/主题 token/覆盖样式”也做成同类可交付产物，并通过插件注入到设计器画布依赖中。

---

## 2. 需求拆解：要让 `Class Name` 在画布生效，最少需要什么

要实现“属性面板填 class → 画布立刻生效”，需要同时满足：

1. **DSL 节点确实携带 className**  
   属性面板已有 `Class Name` 输入框（截图 2），说明“写入 schema 的 class”能力大概率已具备或接近具备。
2. **画布中存在与 class 对应的 CSS 规则**  
   这才是核心缺口：你输入的 `flex/items-center/text-h3/...` 必须能被解析成真实样式。
3. **主题/Token 与主工程一致**（可选但强相关）  
   `text-color-secondary` 等通常依赖 CSS 变量或主题 token；若 token 未同步，画布会“有样式类但颜色不对”。

因此“公共样式导入”的本质是：把 **(utilities CSS + token CSS + 覆盖 CSS + 主题 CSS)** 作为可加载依赖注入画布。

---

## 3. 是否复用现有“物料样式通道”？——评估与建议

### 3.1 可复用的部分（强烈建议复用）

设计器侧的能力应复用既有机制：

- “插件在 webview HTML 注入全局变量”
- “设计器读取注入数据并合并来源”
- “将 CSS URL 加入画布依赖 styles，并被归一化为可访问的绝对 URL”

这些机制已经在 **物料 bundle URL** 上跑通（`window.TINY_MATERIAL_BUNDLE_URLS`）。

### 3.2 建议区分的部分（建议拆开管理）

公共样式与物料样式有两个关键差异，建议作为**独立配置源**管理：

- **生命周期不同**：物料 bundle 更偏“组件资产包”；公共样式更偏“项目设计体系/主题体系”。
- **加载策略不同**：物料 CSS 往往“固定且较小”；utilities（UnoCSS）可能“动态生成或需要 runtime”。

结论（推荐）：

- **复用注入与加载机制**（同类实现）
- **区分配置对象与产物目录**（单独维护与版本化）

---

## 4. 关键难点：UnoCSS 是“按需生成”，设计器如何支持动态 class？

你希望在属性面板随手输入 class，画布就能看到效果。对 UnoCSS 来说，关键在于：

- 主工程构建时的 UnoCSS 通常是“扫描源码 class → 生成 CSS”，它不会自动覆盖“设计器里临时输入的新 class”。

因此有三种策略（从稳妥到体验最佳）：

### 方案 A：预生成 utilities.css（基于扫描 + safelist）

做法：

- 统计主工程代码中出现的 class（含模板/脚本字符串等）
- 配一个 `safelist` 覆盖设计器常用类
- 构建产物输出 `utilities.css`（体积可控、但覆盖有限）

优点：实现简单、稳定；缺点：**设计器输入的新类可能没效果**（体验会“时灵时不灵”）。

### 方案 B：在画布中启用 UnoCSS runtime（推荐）

做法：

- 把 UnoCSS runtime（或等价的运行时生成器）作为画布依赖脚本注入
- runtime 监听 DOM/class 变化，动态生成对应 CSS 并注入到 iframe
- 同步主工程的 UnoCSS 配置（preset、transformer、theme、shortcuts、variants…）

优点：**体验最佳**（输入即生效）；缺点：要处理 CSP/性能/配置同步与版本兼容。

### 方案 C：限制 class 输入为“可选列表”（配合补全）

做法：

- 设计器侧只允许从“已知 class 列表”里选（可提供搜索/补全）
- 不支持任意输入（或任意输入会给 warning）

优点：可控、不会出现“无效 class”；缺点：与“随手写 class”目标不完全一致。

推荐结论：

- 若目标是“像写主工程一样写 class，并且立刻生效”，**优先方案 B（UnoCSS runtime）**。
- 若你们对性能/安全特别敏感，可以先用 **A 跑通链路**，再平滑升级到 B。

---

## 5. 推荐落地架构：Style Bundle（样式资产包）+ 插件注入 + 设计器消费

### 5.1 主工程产物（建议）

新增一个独立的“样式资产包”产物目录（示例命名）：

```
dist/lowcode-styles/
├── styles.json                # 样式清单（协议文件）
├── tokens.css                 # 设计 token / css variables（与物料一致或复用）
├── overrides.css              # 公共覆盖（base overrides）
├── themes/
│   ├── default-light.css
│   ├── default-dark.css
│   └── ...                    # 其它主题
├── utilities.css              # 方案A：预生成 UnoCSS utilities（可选）
└── unocss-runtime.js          # 方案B：UnoCSS runtime（可选）
```

`styles.json` 建议字段：

```json
{
  "version": "1.0.0",
  "tokens": ["./tokens.css"],
  "overrides": ["./overrides.css"],
  "themes": {
    "default-light": "./themes/default-light.css",
    "default-dark": "./themes/default-dark.css"
  },
  "utilities": {
    "mode": "runtime",
    "css": "./utilities.css",
    "runtimeScript": "./unocss-runtime.js"
  }
}
```

说明：

- `mode=runtime` 表示启用 runtime；`mode=prebuilt` 表示仅加载 `utilities.css`。
- 即使复用 `dist/lowcode-materials/mr-bank.css` 里的 token，也建议在 style bundle 里“显式声明”，便于解耦与版本控制。

### 5.2 VSCode 插件注入协议（建议）

仿照物料 URL 注入，新增一个全局变量（命名示例）：

- `window.TINY_STYLE_BUNDLE_URLS = ['http://localhost:3456/styles.json']`

插件职责：

- 把本地目录 `dist/lowcode-styles` serve 成可访问 URL
- 注入 `styles.json` 的 URL（支持多个来源）

### 5.3 设计器消费点（建议）

设计器职责（只消费 URL 与清单，不关心来源）：

1. 读取 `window.TINY_STYLE_BUNDLE_URLS`
2. 拉取每个 `styles.json`，合并得到“要加载的 CSS/JS URL 列表”
3. 将 CSS URL 加到画布依赖 `styles` 中；将 runtime 脚本（如果有）加入画布依赖 `scripts` 中
4. 依赖归一化由现有逻辑处理（相对路径 → 绝对 URL）
5. 主题切换时（如果插件调用 `setTheme`）：选择对应 `themes[themeId]` 的 CSS 并更新画布

> 关键点：这条链路与物料加载很像，但**协议文件从 `bundle.json` 变成 `styles.json`**，避免把“公共样式体系”强塞进“物料资产包协议”。

### 5.4 `designer-demo` 已实现的最小验证版（当前仓库状态）

为便于先小步验证链路，`designer-demo` 已加入一个 **Style Bundle deps 增强器**，通过订阅 `init_canvas_deps` 的方式把公共样式合并进画布依赖（不侵入物料加载逻辑）。

当前支持的配置来源（优先级为合并去重，不区分先后覆盖）：

- `window.TINY_STYLE_BUNDLE_URLS: string[]`（VSCode 插件注入）
- `import.meta.env.VITE_STYLE_BUNDLE_URLS: string`（逗号分隔，非插件本地联调）
- `engine.config.styleBundles`（可选，保持与 engine.config.material 类似风格）
- **开发态兜底**：若以上均未提供，开发环境默认加载 `'/mock/styles.json'`（用于快速验证）

对应实现文件：

- `designer-demo/src/composable/styleBundleDeps.ts`
- `designer-demo/src/main.ts`（在 `appCreated` 内注册订阅）

说明：此前为了最小流程验证曾在 `designer-demo/public/mock/` 放过示例 `styles.json` 与 CSS；在插件链路跑通后建议移除，避免误用与混淆。

---

## 6. 体验增强（可选）：让 ClassName 输入更好用

为了让开发者更顺畅：

- **class 自动补全**：从 `styles.json` 或额外 `classes.json` 提供可选 class 列表，给属性面板输入框做提示（类似 code completion，但在属性面板）。
- **常用组合 snippets**：提供“一键插入 class 组合”的模板（例如 `flex items-center justify-between`），降低记忆成本。
- **无效 class 提示**：
  - 方案A：当 class 在 `utilities.css` 中不存在时给出 warning
  - 方案B：runtime 生成失败或被 CSP 拦截时给出提示（引导用户检查 style bundle 是否加载成功）

---

## 7. 风险点与验证清单

### 7.1 风险点

- **CSP 放行**：runtime 脚本与 CSS 的 origin 必须在 iframe CSP 允许列表内（当前已覆盖常见 localhost 物料域；后续若端口/域名变化要同步）。
- **性能**（方案B）：runtime 扫描 DOM + 动态生成 CSS 需要限流与缓存，避免画布频繁重渲染时卡顿。
- **主题一致性**：token/主题变量若与主工程不一致，会出现“类生效但颜色/字号不一致”。
- **版本兼容**：主工程升级 UnoCSS preset 或 token 命名时，需要通过 `styles.json version` 做兼容策略。

### 7.2 验证清单（建议按顺序）

1. 仅加载 `tokens.css + overrides.css`：物料组件在画布上的基础视觉一致
2. 加载 `utilities.css`（方案A）：输入 `flex items-center` 等常用类能生效
3. 启用 runtime（方案B）：输入一个主工程里没出现过的类也能立刻生效
4. 切换主题：`text-color-secondary` 等依赖 token 的类随主题切换正确变化
5. 出码一致性：属性面板 className → 出码生成的 class 与主工程写法一致

---

## 8. 结论（推荐落地顺序）

1. 先定义 style bundle 产物结构与 `styles.json` 协议（本文件第 5 节）
2. 先跑通方案 A（预生成 utilities.css），保证链路正确、快速可用
3. 再评估并升级到方案 B（UnoCSS runtime），满足“任意输入 class 即生效”的最终体验
4. 最后做体验增强：class 自动补全、组合 snippets、无效 class 提示

---

文档维护者：开发团队
最后更新：2026-03-31

