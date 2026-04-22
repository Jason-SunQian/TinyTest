# 公共样式与 UnoCSS 导入设计器方案

> 目的：把主工程（`/Users/mac/Desktop/Project/2025/mobilebanking`）中为 UI/物料服务的公共样式能力（设计 token、主题 token、公共覆盖、UnoCSS utilities 等）以“可交付产物”的形式，通过 VSCode 插件导入设计器，使开发者在设计器属性面板配置 `Class Name`（如 `flex items-center text-h3 text-color-secondary`）后：
>
> -   画布上能立刻看到对应效果（所见即所得）
> -   出码后能生成与主工程一致的 class 写法（如图 1 所示）

约束：

-   设计器（`designer-demo`）与主工程解耦；设计器侧仅消费“注入/可访问的资源 URL”，不直接依赖主工程源码。
-   不修改 `packages/`，所有改造都在 `designer-demo` 与插件侧完成。

**定位与当前诉求（避免误解）**：

-   设计器**独立部署、独立运行**；与主工程的同步方式是：**主工程在本地 `build` 后，将产物（物料 bundle、style bundle）通过插件或 URL 导入设计器**，并随主工程迭代**反复执行**这一过程。
-   公共样式能力采用 **主工程预构建 `tokens.css` + `utilities.css` + `styles.json`**，由设计器在画布依赖中加载；**不采用**浏览器内 UnoCSS runtime 动态生成 CSS——这不是“未完成的技术债”，而是与上述交付方式一致、**可维护且可控**的正式选型。

---

## 1. 现状梳理：设计器如何加载“物料相关样式”

当前物料链路里，主工程会在 `dist/lowcode-materials/` 产出并提供：

-   `bundle.json`
-   组件 ESM 脚本（`mr-components.js`、`mp-*.js`）
-   物料样式（如 `mr-bank.css`，包含设计 token/base overrides 等）

设计器侧在画布依赖注入中：

-   会把 `scripts/styles` 归一化成绝对 URL，避免 `vscode-webview:` 这类 URL 在 iframe 内导致 403（见 `designer-demo/src/composable/canvasDepsNormalizer.ts` 的 `normalizeCanvasDeps` 逻辑）。
-   iframe CSP 已对 `localhost:3000/3060` 等常见物料服务器 origin 放行（见 `CanvasContainer.vue` 中对 `script-src/style-src/connect-src` 的拼装）。

结论：

-   **设计器具备“加载外部 CSS/JS 资源到画布”的基础设施**。
-   现在缺少的是：把“公共 utilities/主题 token/覆盖样式”也做成同类可交付产物，并通过插件注入到设计器画布依赖中。

---

## 2. 需求拆解：要让 `Class Name` 在画布生效，最少需要什么

要实现“属性面板填 class → 画布立刻生效”，需要同时满足：

1. **DSL 节点确实携带 className**  
   属性面板已有 `Class Name` 输入框（截图 2），说明“写入 schema 的 class”能力大概率已具备或接近具备。
2. **画布中存在与 class 对应的 CSS 规则**  
   这才是核心缺口：你输入的 `flex/items-center/text-h3/...` 必须能被解析成真实样式。
3. **主题/Token 与主工程一致**（可选但强相关）  
   `text-color-secondary` 等通常依赖 CSS 变量或主题 token；若 token 未同步，画布会“有样式类但颜色不对”。

因此“公共样式导入”的本质是：把 **token CSS（默认主题）+ UnoCSS 预生成的 utilities CSS** 作为可加载依赖注入画布（组件级覆盖仍由物料 `mr-bank.css` 等承担）。

---

## 3. 是否复用现有“物料样式通道”？——评估与建议

### 3.1 可复用的部分（强烈建议复用）

设计器侧的能力应复用既有机制：

-   “插件在 webview HTML 注入全局变量”
-   “设计器读取注入数据并合并来源”
-   “将 CSS URL 加入画布依赖 styles，并被归一化为可访问的绝对 URL”

这些机制已经在 **物料 bundle URL** 上跑通（`window.TINY_MATERIAL_BUNDLE_URLS`）。

### 3.2 建议区分的部分（建议拆开管理）

公共样式与物料样式有两个关键差异，建议作为**独立配置源**管理：

-   **生命周期不同**：物料 bundle 更偏“组件资产包”；公共样式更偏“项目设计体系（UnoCSS + token）”。
-   **更新节奏不同**：物料随组件变更；style bundle 随主工程 `build:lowcode-styles` 与版本发布更新，与主工程保持同一套 `uno.config.ts` 与主题 token。

结论（推荐）：

-   **复用注入与加载机制**（同类实现）
-   **区分配置对象与产物目录**（单独维护与版本化）

---

## 4. UnoCSS 与「动态 class」：当前采用预构建方式

UnoCSS 在主工程侧通常是**扫描源码 + 按需生成**；设计器里还可能输入**尚未出现在主工程源码**中的 class。业界有两种思路：

| 思路                 | 说明                                                                                      | 本项目是否采用                                                            |
| -------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **浏览器内 runtime** | 在 iframe 里动态生成 CSS，任意 class 理论上即时生效                                       | **未采用**（复杂度高、与「独立设计器 + 主工程构建导入」的交付方式不一致） |
| **构建期预生成**     | 主工程 `build:lowcode-styles`：扫描源码 + 维护 `safelist.extra.txt`，产出 `utilities.css` | **采用**                                                                  |

**当前做法**：

-   主工程 **`pnpm run build:lowcode-styles`** 使用与线上一致的 **`uno.config.ts`**，生成 **`utilities.css`**（含预置常用类 + 源码扫描 + 手工 safelist）。
-   若设计器里某 class 未命中生成结果，在 **`lowcode-styles/safelist.extra.txt`** 中补充后**重新执行构建**即可；这与「主工程发版、设计器重新导入产物」的工作流一致，**不是技术债**，而是**显式、可版本化的样式交付**。

**可选增强**（与 runtime 无关）：在属性面板做 class 补全、或对未命中类给出提示，改善体验，仍基于预构建产物。

---

## 5. 推荐落地架构：Style Bundle（样式资产包）+ 插件注入 + 设计器消费

### 5.1 主工程产物（建议）

新增一个独立的“样式资产包”产物目录（示例命名）：

```
dist/lowcode-styles/
├── styles.json                # 样式清单（协议文件）
├── tokens.css                 # 默认主题 token（与 extract-design-tokens 一致）
├── themes/                    # 可选：多主题时再引入
│   ├── default-light.css
│   └── ...
└── utilities.css              # 预生成 UnoCSS utilities（主工程 build）
```

`styles.json` 建议字段（**当前实现以 `prebuilt` 为准**）：

```json
{
    "version": "1.0.0",
    "tokens": ["./tokens.css"],
    "utilities": {
        "mode": "prebuilt",
        "css": "./utilities.css"
    }
}
```

说明：

-   **`utilities.mode` 使用 `prebuilt`**：仅加载 `utilities.css`，不额外引入画布内脚本。
-   若将来协议需要扩展（例如多主题 `themes`），可在 `styles.json` 中增加字段；**与是否采用 runtime 无关**。
-   即使复用 `dist/lowcode-materials/mr-bank.css` 里的 token，也建议在 style bundle 里“显式声明”，便于解耦与版本控制。
-   **`overrides` 字段与独立 `overrides.css` 不作为默认产物**；若将来确有「页面级全局基线」需求，再扩展协议即可。

### 5.2 VSCode 插件注入协议（建议）

仿照物料 URL 注入，新增一个全局变量（命名示例）：

-   `window.TINY_STYLE_BUNDLE_URLS = ['http://localhost:3456/styles.json']`

插件职责：

-   把本地目录 `dist/lowcode-styles` serve 成可访问 URL
-   注入 `styles.json` 的 URL（支持多个来源）

### 5.2.1 私服/静态发布建议（与物料一致）

推荐将样式包与物料包采用**同一套静态发布策略**：

-   物料：`.../<buildId>/bundle.json` + 同目录的 `mr-components.js`、`mp-*.js`、`mr-bank.css` 等
-   样式：`.../<buildId>/styles.json` + 同目录的 `tokens.css`、`utilities.css`

这样设计器/插件只需要注入两个 URL（同 buildId）：

-   `.../<buildId>/bundle.json`
-   `.../<buildId>/styles.json`

并通过 URL 的 buildId 进行缓存隔离与快速回滚。

### 5.2.2 当前阶段的决策（避免误解）

受限于当前**缺少静态发布工具/权限**，团队暂时按以下方式推进：

-   **短期（当前）**：继续使用本地 `serve` 联调主工程产物，并通过 URL 注入给设计器验证。
    -   示例：`npx serve dist/lowcode-materials -p 3000 --cors`
    -   设计器配置：`VITE_STYLE_BUNDLE_URLS=http://localhost:3000/styles.json` 或插件注入 `window.TINY_STYLE_BUNDLE_URLS`
-   **中期（待定）**：与 VSCode 插件开发者对齐 ASSETMANAGER 能力后，再决定最终分发方案：
    -   **静态发布**：版本化目录托管（URL 直接访问 `styles.json/tokens.css/utilities.css`）
    -   **npm 私服分发**：发布为 npm 包，由插件安装后本地 serve，再注入 URL

> 说明：设计器侧协议始终是“URL 列表”，不关心来源。是否走静态还是 npm，将由插件侧能力与团队权限共同决定；因此本节只记录推荐形态与阶段性选择，避免误导为“当前必须上私服发布”。

### 5.3 设计器消费点（建议）

设计器职责（只消费 URL 与清单，不关心来源）：

1. 读取 `window.TINY_STYLE_BUNDLE_URLS`
2. 拉取每个 `styles.json`，合并得到“要加载的 CSS URL 列表”
3. 将 CSS URL 加到画布依赖 `styles` 中（依赖归一化由现有逻辑处理：相对路径 → 绝对 URL）
4. （若协议未来扩展脚本类依赖，再按需加入 `scripts`；**当前主工程产物为纯 CSS**）
5. **主题切换（可选）**：仅当设计器或插件提供「画布主题」能力时，才根据当前主题选择 `themes[themeId]` 并更新画布。若设计器暂无画布主题切换 UI，可**只注入一套默认主题**（见第 9.2.1 节），不必先做多套 `themes/*.css` 的切换逻辑。

> 关键点：这条链路与物料加载很像，但**协议文件从 `bundle.json` 变成 `styles.json`**，避免把“公共样式体系”强塞进“物料资产包协议”。

### 5.4 `designer-demo` 已实现的最小验证版（当前仓库状态）

为便于先小步验证链路，`designer-demo` 已加入一个 **Style Bundle deps 增强器**，通过订阅 `init_canvas_deps` 的方式把公共样式合并进画布依赖（不侵入物料加载逻辑）。

当前支持的配置来源（优先级为合并去重，不区分先后覆盖）：

-   `window.TINY_STYLE_BUNDLE_URLS: string[]`（VSCode 插件注入）
-   `import.meta.env.VITE_STYLE_BUNDLE_URLS: string`（逗号分隔，非插件本地联调）
-   `engine.config.styleBundles`（可选，保持与 engine.config.material 类似风格）

以上均未配置时，**不会**自动加载本地 mock；需通过插件或 env 显式提供 `styles.json` URL。

对应实现文件：

-   `designer-demo/src/composable/styleBundleDeps.ts`
-   `designer-demo/src/main.ts`（在 `appCreated` 内注册订阅）

说明：此前为了最小流程验证曾在 `designer-demo/public/mock/` 放过示例 `styles.json` 与 CSS；在插件链路跑通后建议移除，避免误用与混淆。

---

## 6. 体验增强（可选）：让 ClassName 输入更好用

为了让开发者更顺畅：

-   **class 自动补全**：从 `styles.json` 或额外 `classes.json` 提供可选 class 列表，给属性面板输入框做提示（类似 code completion，但在属性面板）。
-   **常用组合 snippets**：提供“一键插入 class 组合”的模板（例如 `flex items-center justify-between`），降低记忆成本。
-   **无效 class 提示**（可选）：当 class 在 `utilities.css` 中不存在时给出 warning，提示用户主工程补 safelist 并重新生成产物；或检查 style bundle 是否加载成功（Network/CSP）。

---

## 7. 风险点与验证清单

### 7.1 风险点

-   **CSP 放行**：style bundle 与物料静态资源的 **CSS URL** 的 origin 需在 iframe CSP 允许范围内（当前已覆盖常见 localhost 物料域；端口/域名变化时需同步）。
-   **主题一致性**：token/主题变量若与主工程不一致，会出现“类生效但颜色/字号不一致”。
-   **版本兼容**：主工程升级 UnoCSS preset 或 token 命名时，需重新执行 `build:lowcode-styles` 并重新导入；可通过 `styles.json` 的 `version` 做对齐说明。

### 7.2 验证清单（建议按顺序）

1. 仅加载 `tokens.css`：物料组件在画布上的基础视觉一致（组件覆盖仍主要由 `mr-bank.css` 等物料样式承担）
2. 加载 `utilities.css`：输入 `flex items-center` 等常用类能生效
3. **（可选）** 若已做多主题：切换主题后 `text-color-secondary` 等依赖 token 的类随主题变化；若仅单主题，则验证与主工程默认主题（如 `default-light`）一致即可
4. 出码一致性：属性面板 className → 出码生成的 class 与主工程写法一致

---

## 8. 结论（推荐落地顺序）

1. 定义 style bundle 产物结构与 `styles.json` 协议（本文件第 5 节），**utilities 以 `prebuilt` 为准**。
2. 主工程 **`pnpm run build:lowcode-styles`** 稳定产出 `tokens.css` + `utilities.css`，与物料同目录或单独 serve 后，由插件/env 注入设计器。
3. 设计器侧验证画布与出码；缺类时维护 **`safelist.extra.txt`** 并重新构建，与主工程发版节奏一致。
4. **可选**体验增强：class 自动补全、组合 snippets、未命中 class 提示（均不依赖 runtime）。

---

## 9. 主工程 CSS 提取策略（建议）

本节回答一个核心问题：**为了让设计器里 `Class Name` 与 Styles 面板“像开发 Vue 页面一样好用”，主工程到底要提取哪些 CSS，哪些不需要提取？**

### 9.1 设计器的主要使用场景

设计器侧主要有两类“用到公共样式”的方式：

1. **组件属性面板 → `Class Name`**
    - 开发者输入 utilities / 语义类（如 `flex items-center text-h3 text-color-secondary`）
    - 期望：画布即时生效、出码保留 class、运行态表现与主工程一致
2. **Styles 面板 → Global Styles**
    - 开发者配置页面级/全局级样式（可能仍然以类名与 token 为主）
    - 期望：在画布中能看到效果、并与主工程的设计体系一致

以上两种场景的共同依赖是：

-   **utilities（UnoCSS 生成的类）**
-   **theme tokens（utilities 引用的 CSS 变量/主题色/字号等）**

### 9.2 必须提取（强建议）

#### A. UnoCSS utilities → `utilities.css`

目的：保证 `Class Name` 里写的 utilities 在画布中一定有对应 CSS 规则。

推荐做法：

-   **预生成** `utilities.css`（主工程 `build:lowcode-styles`）
-   生成方式建议由两部分组成：
    -   **扫描主工程源码**：收集模板/脚本中出现过的 class
    -   **维护 safelist**：覆盖设计器“可编辑输入但不一定出现在主工程源码”的常用 utilities（例如布局类、排版类、色彩类的常见组合）

为什么要 safelist：

-   UnoCSS 默认是“扫描 → 生成”，设计器里手动输入的新 class **可能主工程没出现过**
-   没 safelist 时就会出现“有时生效、有时不生效”的体验断层

> 若需覆盖新 class（如设计器里首次使用的类名），在 **`safelist.extra.txt`** 补充后重新执行 `pnpm run build:lowcode-styles` 即可。

#### B. themes/styles token（颜色与设计变量）

目的：保证 utilities 与语义色（例如 `text-color-secondary`）引用的 **CSS 变量** 在设计器内存在且与主工程一致。

##### 9.2.1 主题怎么处理？——推荐先「单主题精简」，多主题延后

与主工程一致的事实是：

-   运行态 App **同一时间只跑一套主题**；多套主题文件在 `themes/styles` 里存在，但**切换发生在主工程配置/运行时**，不是页面里随便混用多套。
-   设计器侧若**没有**「画布主题」切换入口，则画布只需要 **固定一套 token**，与主工程**默认主题**对齐即可（你们当前多为 **`default-light`** 或与之一致的 token 集）。

因此提取策略可以**再精简一档**（推荐作为第一版落地）：

| 策略                   | 做法                                                                                                                                                                                                                     | 适用                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| **单主题（推荐首版）** | 构建时只把**默认主题**对应的 token CSS（如 `default-light.css`）与「跨主题不变」的基础变量合并进 **一份 `tokens.css`**（或 `theme-default.css`）；`styles.json` 里 **`themes` 可省略或只保留一项**，设计器始终加载这一份 | 设计器无画布主题切换、与主工程默认主题对齐即可 |
| **多主题（后续增强）** | 保留 `themes/<id>.css` + `styles.json.themes` 映射；由插件注入当前主题 id 或设计器提供切换后再动态换 CSS                                                                                                                 | 需要在设计器里预览 dark/colorful 等            |

**不处理多主题可以吗？**

-   **可以。** 首版只保证「画布颜色与主工程默认主题一致」，不实现设计器内主题切换，复杂度最低。
-   若业务方要求在画布预览非默认主题，再补：**插件/设计器约定主题 id → 换一份 theme CSS URL**（或换整个 style bundle 的 `styles.json` 指向）。

##### 9.2.2 若采用多主题时的产物形态（参考）

-   `tokens.css`：跨主题不变的基础变量（若有）
-   `themes/<themeId>.css`：各主题变量集
-   `styles.json.themes`：主题 id → 相对路径映射；设计器/插件在有能力切换时再消费

首版若走单主题，可将上述合并为「**仅 `tokens.css` + `utilities.css`**」，`themes` 目录可暂不产出。

### 9.3 不建议提取（通常无需重复）

#### C. `assets/styles` 下覆盖 Vant/Ionic 的样式（通常不需要再抽一份）

主工程常见有一批用于 **覆盖 Vant/Ionic 组件外观** 的 SCSS（例如 `src/assets/styles/*.scss`）。

这类样式通常：

-   **并不会在页面上通过 class 直接引用**（开发者也不会在设计器 `Class Name` 输入这些 selector）
-   已经通过主工程物料构建链路进入 `dist/lowcode-materials`（例如 `mr-bank.css` 与各物料组件自身的 CSS/依赖 CSS）

因此建议策略是：

-   **优先依赖物料链路提供的 `mr-bank.css`/组件 CSS** 来还原“组件外观一致性”
-   Style Bundle 只负责“utilities + tokens”，不要重复搬运组件覆盖样式

### 9.4 一句话落地清单（用于实施）

主工程产物 `dist/lowcode-styles/`（或你们约定目录）建议至少包含：

-   ✅ `styles.json`
-   ✅ `utilities.css`（UnoCSS 预生成，含 safelist）
-   ✅ **主题 token（二选一）**
    -   **精简首版**：仅 `tokens.css`（已含默认主题 + 若有则含基础变量），不强制 `themes/` 目录
    -   **多主题版**：`tokens.css`（可选）+ `themes/*.css` + `styles.json.themes` 映射

并明确约束：

-   ❌ 不把 Vant/Ionic 的大量覆盖 SCSS 再抽一份到 Style Bundle（避免重复与冲突）

---

## 10. 主工程已实现：构建样式产物与验证方式

主工程（`mobilebanking`）已提供脚本 **`pnpm run build:lowcode-styles`**（见根目录 `package.json`）。

> 相关命令的完整说明见《物料导入快速参考》中的 **「四点六、主工程脚本命令速查」**，避免重复与口径不一致。

### 10.1 生成内容

-   先执行 `lowcode-materials/scripts/extract-design-tokens.cjs`，生成 **`tokens.css`**（`:root[theme='default']` → `:root`，与画布物料 token 同源）。
-   使用 **`uno.config.ts`** + `UnoCSS createGenerator` 预生成 **`utilities.css`**；输入包含：
    -   `lowcode-styles/safelist.extra.txt` 手动补充
    -   对 `src/**/*.{vue,ts,tsx,js,jsx}` 的 class 字符串启发式扫描
    -   少量常用类预设（flex / text-h* / text-color-* 等）

输出目录：

-   **`dist/lowcode-styles/`**：规范产物目录（`styles.json`、`tokens.css`、`utilities.css`）。
-   若存在 **`dist/lowcode-materials/`**，脚本会把上述文件 **同步复制一份到该目录**，便于与现有「单目录静态服务」共用（例如与 `bundle.json` 同端口访问）。

### 10.2 本地验证步骤（你来执行）

1. 在主工程根目录执行：`pnpm run build:lowcode-styles`
2. 用静态服务托管 **`dist/lowcode-materials`**（或同时托管包含 `styles.json` 的目录），确认浏览器能打开：
    - `http://<host>:<port>/styles.json` → 200 JSON
    - `http://<host>:<port>/tokens.css` → 200
    - `http://<host>:<port>/utilities.css` → 200
3. 在设计器插件环境配置 **`VITE_STYLE_BUNDLE_URLS=http://localhost:3000/styles.json`**（或插件注入 `window.TINY_STYLE_BUNDLE_URLS` 指向同一 URL）。
4. 打开设计器 DevTools → **Network**，确认拉取的是 **`styles.json`** 且后续 CSS 来自 `localhost:3000`。
5. 在组件 **Class Name** 输入：`flex items-center text-h3 text-color-secondary`，画布与出码应与主工程一致。

### 10.3 补充类名覆盖

若某类在画布不生效，可将该 class 逐行加入主工程 **`lowcode-styles/safelist.extra.txt`** 后重新执行 `pnpm run build:lowcode-styles`。

---

## 11. 实践验证总结（已测通）

以下结论来自在 **VSCode 插件 Extension Development Host** 中打开设计器、并配合主工程 **`pnpm run build:lowcode-styles`** 产物的联调验证。

### 11.1 已验证能力

1. **组件属性 → Class Name**

    - 可直接填写主工程习惯的 **UnoCSS utilities**（如 `flex`、`items-center`、`text-h3`、`py-12px`）及 **语义色 / token 相关类**（如 `text-color-secondary`、`bg-color-*` 等，具体以 `uno.config.ts` 与生成 `utilities.css` 为准）。
    - 画布预览与出码均能保留 class，视觉与主工程开发方式一致。

2. **Styles 面板**

    - **Global Styles**：可选用全局类（如工具类、带 `bg-color-*` 语义的类），与 Class Name 链路共用同一套注入的 `tokens.css` + `utilities.css`。
    - **CSS Editor（自定义 CSS）**：可在规则中书写 **`color: var(--mr-color-primary-500);`** 等 **主题变量**，说明 `tokens.css` 中的 `--mr-color-*` 已在画布 iframe 内生效，设计器侧可像主工程一样引用 token。

3. **主工程产物链路**
    - 静态服务与物料同目录时（如 `http://localhost:3000/styles.json`），设计器通过 **`VITE_STYLE_BUNDLE_URLS` 或 `window.TINY_STYLE_BUNDLE_URLS`** 拉取 `styles.json`，再加载其引用的 `tokens.css`、`utilities.css`，无需再依赖设计器内 `public/mock` 兜底。

### 11.2 实施过程中值得记录的点

| 问题                                         | 原因                                                                             | 处理思路                                                                                                                                |
| -------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `styles.json` 拉取报 CSP / `Failed to fetch` | Webview 内相对路径会落到 `vscode-webview://`，`fetch` 受 `connect-src` 限制      | 使用 **可访问的 http(s) 绝对 URL**；设计器侧用 **`TINY_DESIGNER_ORIGIN` 等** 将 `/mock/...` 或相对路径转为设计器真实 HTTP origin 再请求 |
| 画布长时间加载、依赖重复下发                 | 仅在消息层补丁 `init_canvas_deps`，画布回传 deps 时丢失样式 → 反复判定「缺样式」 | 将 style bundle 的 **styles 写入 `materialsDeps` 源数据**，与 `getCanvasDeps` 同源，避免循环重载                                        |
| 个别 class 不生效                            | UnoCSS 按需生成，设计器里新输入的类未必出现在主工程源码扫描结果中                | 维护 **`safelist.extra.txt`** 并重新生成 `utilities.css`                                                                                |
| `!` 前缀类（如 `!bg-200`）设计器不生效       | 当前链路是 **prebuilt utilities.css**；若产物中没有该变体，设计器无法“动态补全” | 在主工程 `lowcode-styles/scripts/build.mjs` 中把需要的 utility 同步生成 `!` 变体，再执行 `pnpm run build:lowcode-styles` 并重新导入样式产物 |

### 11.3 协议与产物取舍

-   **样式交付方式为预构建**：`utilities.mode` 为 **`prebuilt`**，**不采用**画布内 UnoCSS runtime；与「主工程 build → 导入设计器」的流程一致，**非技术债**。
-   **默认不产出 `overrides.css`**：组件级覆盖继续依赖物料 **`mr-bank.css`** 等；style bundle 聚焦 **tokens + utilities**。
-   **主题**：首版以 **默认主题 token**（`extract-design-tokens` → `:root`）与主工程一致即可；设计器内无画布主题切换时再扩展多主题。

### 11.4 建议的回归检查（发版前）

-   [ ] Network：`styles.json` → `tokens.css`、`utilities.css` 均为 200，且来源为主工程静态服务。
-   [ ] Class Name：`flex items-center text-h3 text-color-secondary` 与一组长尾类（如 `py-12px`、`bg-color-*`）画布可见。
-   [ ] `!` 变体：`!bg-200`、`!px-16px` 等重要级 class 在画布与预览均生效（依赖主工程 prebuilt 产物，非设计器动态生成）。
-   [ ] CSS Editor：任意写一条 `var(--mr-color-primary-500)` 类规则，画布可见。
-   [ ] 出码：上述 class 与自定义 CSS 能正确落盘。

---

文档维护者：开发团队
最后更新：2026-04-20（补充 `!` 前缀 class 的 prebuilt 产物策略与回归项）
