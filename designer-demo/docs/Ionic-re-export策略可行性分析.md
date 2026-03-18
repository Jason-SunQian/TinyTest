# Ionic 原子组件 re-export 策略可行性分析

> 综合分析：**在不使用画布桩的情况下**，能否通过 re-export 策略在设计器画布上正确显示带样式的 Ionic mr 原子组件。  
> 含根因分析、可行方案与验证结论，供后续改造决策参考。

---

## 一、问题背景

### 1.1 当前状况

- **主工程**：通过 resolver 将 `@mr/wise-core` 的 Ionic 组件映射为 mr 前缀（如 `mr-segment` → `IonSegment`）
- **样式来源**：
  - 原子组件样式在 `wise-core/css/`（含 `ionic.bundle.css`、`ionic-swiper.css` 等）
  - 主工程在 `src/assets/styles/` 中覆盖部分样式（base.scss 的 `--ion-background-color`、`--van-*` 等）
- **多次尝试**：直接 re-export Ionic 组件到画布，**无样式**，归因于 Shadow DOM 与 iframe 渲染上下文问题

### 1.2 Ionic 官方对样式的要求

[Ionic Global Stylesheets](https://ionicframework.com/docs/layout/global-stylesheets) 明确说明：

> **core.css** - This file is the only stylesheet that is **required** in order for Ionic components to work properly. It includes app specific styles, and allows the `color` property to work across components. **If this file is not included the colors will not show up and some elements may not appear properly.**

即：**没有 core.css，颜色不会显示，部分元素可能异常**。仅靠 `:root` 变量不足以让 Ionic 组件正常显示。

[Add Ionic Vue to Existing Project](https://ionicframework.com/docs/vue/add-to-existing) 要求样式必须在**与组件相同的 document** 中加载，通常通过应用入口 import。理论上只要在画布 iframe 的 document 中正确加载 core.css，就能让 Ionic 组件有样式，不依赖「应用工程配置」。

### 1.3 主工程样式加载链路（已核实）

```
main.scss
  ├── @mr/wise-core/css/core.css      ← 含 :root --ion-* 变量、body、ion-modal 等
  ├── @mr/wise-core/css/normalize.css
  ├── @mr/wise-core/css/structure.css
  ├── @mr/wise-core/css/typography.css
  ├── theme.scss                      ← 大量 --ion-* 覆盖（--ion-color-primary: var(--mr-color-primary) 等）
  ├── base.scss                       ← :root { --ion-background-color }, --van-*
  ├── component.scss
  └── modal.scss
```

**注意**：主工程 main.scss **未** import `ionic.bundle.css`，只 import 了 core/normalize/structure/typography。

### 1.4 wise-core 与官方 @ionic/core 的差异（已核实）

| 核实项 | 核实结果 |
|--------|----------|
| **wise-core 来源** | `@mr/wise-core@1.0.1`，内部包；`package.json` 中 `"@ionic/vue": "npm:mr-ionic-vue@8.3.0-4"`，即使用 **mr-ionic-vue**（内部 fork），非官方 @ionic/vue |
| **与 @ionic/core 关系** | 基于 mr-ionic-vue / mr-ionic-core，与官方 @ionic/core 结构可能不一致；设计器注入 @ionic/core CDN 无效即佐证 |
| **MrWiseVue 注册** | `main.ts`: `app.use(MrWiseVue, { mode: 'ios', ... })`；core.css 有 `html.ios { --ion-default-font: ... }`，说明需 `html.ios` 或 `html.md` class |
| **wise-core/css 目录** | 含 core.css、ionic.bundle.css、theme.css、ionic-swiper.css、normalize.css 等 |

---

## 二、Ionic 与 Shadow DOM 的样式机制

### 2.1 Shadow DOM 的约束

- 外部样式表（`<link>` 或 document 中的 `<style>`）**无法穿透** Shadow DOM 选择内部元素
- 例如：`ion-segment .segment-button-inner { color: red }` 在外部无效

### 2.2 可穿透的方式

| 方式 | 是否穿透 | 说明 |
|------|----------|------|
| **CSS 变量** | ✅ 可穿透 | `:root { --ion-color-primary: #xxx }` 会继承进 Shadow DOM |
| **宿主选择器** | ✅ 可穿透 | `ion-segment { --background: ... }` 作用于宿主，在 Shadow 外 |
| **::part()** | ✅ 可穿透 | 组件暴露 `part` 时，`ion-segment::part(native) { ... }` 有效 |
| **普通选择器** | ❌ 不穿透 | `.segment-button-inner { ... }` 无法命中 Shadow 内元素 |

### 2.3 Ionic 的典型做法

- 组件内部用 `var(--ion-color-primary)` 等变量
- 主题通过 `:root` 或宿主上的变量覆盖
- 部分组件暴露 `::part()` 供外部定制

因此，**理论上**只要在画布 document 的 `:root` 上正确设置 Ionic 变量，并加载 core.css，可让 re-export 的 Ionic 组件获得样式。

---

## 三、根因分析：为何 re-export 无效果

### 3.1 画布与主工程的 document 分离

- 画布在 **iframe** 中，有独立的 document
- 主工程 main.scss 中的 `@use '@mr/wise-core/css/core.css'` 只影响主应用，**不会**进入画布
- 画布样式来自：`init_canvas_deps` → `importStyles` → 物料声明的 `npm.css` 等

### 3.2 core.css 从未进入画布

- 物料构建时，`mr-components.js` 未 import wise-core 的 CSS
- `mr-bank.css` 来自业务组件、theme、design-tokens 等，**不包含** wise-core 的 `core.css`
- 即使用 `http://localhost:3000/mr-bank.css` 可访问，画布也**拿不到 core.css**
- 按 Ionic 官方文档，**无 core.css 则 colors will not show up**

### 3.3 wise-core 与官方不同，CDN 无效

- 主工程用的是 **@mr/wise-core**（mr-ionic-vue），不是官方 @ionic/core
- 设计器注入 @ionic/core CDN 无效，需使用 **wise-core 的 core.css**，不能用 @ionic/core 的 CDN 替代

### 3.4 wise-core 样式结构（已核实）

| 文件 | 内容 |
|------|------|
| `core.css` | `:root` 的 `--ion-*` 变量、`body`、`ion-modal`、`.ion-color-*` 等，**无 @import** |
| `ionic.bundle.css` | 约 22KB，含 `ion-label` 等，**不含** `ion-segment`（grep 为 0） |

- ion-segment 的结构样式可能在 Web Component 的 JS 定义中（Shadow DOM 内联），而非外部 CSS

### 3.5 iframe 内 Vue 渲染上下文问题（2025-03 发现）

画布在 iframe 内独立运行 Vue 应用，Ionic 组件（含 Shadow DOM）依赖正确的 ref 与渲染上下文。控制台出现：

- `Missing ref owner context, ref cannot be used on hoisted vnodes`（涉及 IonSegment、IonSegmentButton）
- `withDirectives can only be used inside render functions`

这些警告很可能导致 Ionic 组件内部 DOM 或样式未正确挂载，表现为画布上组件**无样式**或显示异常。

---

## 四、可行方案（理论 vs 实践）

### 4.1 理论可行路径

1. **画布加载完整 wise-core 样式链**：至少 core.css、normalize/structure/typography
2. **画布 :root 具备主工程变量覆盖**：design-tokens、base-overrides 扩展 `--ion-*`
3. **物料 bundle 声明 npm.css**：mr-bank.css 包含 core.css，或单独提供 core.css URL
4. **画布 iframe 正确注入上述样式**：`init_canvas_deps` → `importStyles` → `<link>`，插件环境下相对路径需转为绝对 URL

### 4.2 高概率可行方案（基于 Ionic 官方文档）

在画布 iframe 的 document 中，以 `<link>` 或内联方式加载 **wise-core 的 core.css**：

| 步骤 | 说明 |
|------|------|
| 1. 主工程物料构建产出 core.css | 在 mr-components.js 中 `import '@mr/wise-core/css/core.css'`，或复制到 dist 并声明 URL |
| 2. 物料协议声明该样式 | 让 mr-components 的 `npm.css` 包含 core.css 的 URL |
| 3. 画布加载 | 通过现有 `init_canvas_deps` → `importStyles` → `<link>` 链路加载 |

**已尝试**：在 mr-components.js 中 import core.css 打进 mr-bank.css，画布仍无样式。根因可能为 **iframe 内 Vue 渲染上下文问题**（见 3.5），而非仅样式缺失。

### 4.3 与桩方案的对比

| 维度 | re-export 无桩 | 画布桩 + 样式自注入 |
|------|----------------|---------------------|
| 维护成本 | 依赖 wise-core 样式链，需与主工程同步 | 桩样式独立，与 wise-core 解耦 |
| 一致性 | 理论上有机会与主工程完全一致 | 需人工对齐视觉，可能有偏差 |
| 实现难度 | 需打通样式注入 + 解决 iframe/Vue 上下文问题 | 已验证可行，文档完善 |
| 新增 Ionic 组件 | 若样式链正确，可直接 re-export | 每个组件需单独桩 |

---

## 五、验证结论与尝试记录（2025-03）

### 5.1 re-export 尝试

**已尝试**：re-export IonSegment/IonSegmentButton + mr-components.js 中 `import '@mr/wise-core/css/core.css'` 打进 mr-bank.css + 画布内联 Ionic 变量 + `html.ios` class。

**结果**：画布仍无样式，组件呈默认 HTML 外观。

**结论**：re-export 方案在当前 wise-core/mr-ionic-vue 与设计器画布加载模型下不可行，**已恢复桩方案**（MrSegmentCanvas、MrSegmentButtonCanvas）。

### 5.2 init-canvas 迁移

将 `packages/canvas/init-canvas` 迁移至 `designer-demo`，使画布 HTML 生成在设计器内可维护、可扩展。详见 [init-canvas 迁移文档](./init-canvas-migration.md)。

**403 问题**：VSCode 插件环境下，画布 iframe 加载 `canvas-entry` 时报 403。**修复**：`initCanvas` 增加 `baseUrl` 参数，将 canvas 脚本 URL 转为绝对路径。

**Vue 警告**：画布加载后出现 `Missing ref owner context`、`withDirectives` 等警告，涉及 IonSegment/IonSegmentButton，很可能导致无样式。**建议**：继续使用桩组件。

### 5.3 最终建议

- **桩方案**（MrSegmentCanvas、MrSegmentButtonCanvas）为普通 Vue 组件，无 ref/iframe 问题，**推荐继续使用**。
- **re-export 方案**：若必须使用真实 Ionic 组件，需排查画布 iframe 的 Vue 应用初始化方式及 Ionic 对 iframe 渲染的支持。

---

## 六、主工程关键路径（mobilebanking）

| 文件 | 说明 |
|------|------|
| `src/main.ts` | `app.use(MrWiseVue, { mode: 'ios', ... })` |
| `src/assets/main.scss` | `@use '@mr/wise-core/css/core.css'` 等，未 import ionic.bundle.css |
| `src/assets/styles/theme.scss` | `--ion-color-primary: var(--mr-color-primary)` 等覆盖 |
| `src/assets/styles/base.scss` | `--ion-background-color: var(--mr-color-bg-200)` |
| `lowcode-materials/entries/mr-components.js` | 导出 MrSegmentCanvas（桩）、MrImg（IonImg 包装）等 |
| `lowcode-materials/canvas-stubs/components/mr-segment-canvas.vue` | 桩实现，`injectStubStyles` 自注入样式 |
| `vite.lowcode-materials.config.ts` | `replaceWiseCoreWithMrComponents` 将 IonSegment 等改为 @local/mr-components |
| `node_modules/@mr/wise-core` | 依赖 mr-ionic-vue，css/ 含 core.css、ionic.bundle.css 等 |

---

## 七、参考链接

- [Ionic Global Stylesheets](https://ionicframework.com/docs/layout/global-stylesheets) - core.css 为必需
- [Ionic Vue Add to Existing](https://ionicframework.com/docs/vue/add-to-existing) - 样式 import 方式
- [Ionic CSS Variables](https://ionicframework.com/docs/theming/css-variables) - 变量与主题
- [Ionic Shadow Parts](https://ionicframework.com/docs/theming/css-shadow-parts)

---

## 八、相关文档

- [init-canvas 迁移文档](./init-canvas-migration.md)
- [Ionic 组件导入与桩方案](./Ionic组件导入与桩方案.md)
- [组件导入注意事项](./组件导入注意事项.md)
- [物料导入快速参考](./物料导入快速参考.md)
