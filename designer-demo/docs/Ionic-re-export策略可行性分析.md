# Ionic 原子组件 re-export 策略可行性分析

> 本文分析：**在不使用画布桩的情况下**，能否通过 re-export 策略在设计器画布上正确显示带样式的 Ionic mr 原子组件。  
> 结论供后续改造决策参考，**暂不修改任何代码**。

---

## 一、问题背景

### 1.1 当前状况

- **主工程**：通过 resolver 将 `@mr/wise-core` 的 Ionic 组件映射为 mr 前缀（如 `mr-segment` → `IonSegment`）
- **样式来源**：
  - 原子组件样式在 `wise-core/css/`（含 `ionic.bundle.css`、`ionic-swiper.css` 等）
  - 主工程在 `src/assets/styles/` 中覆盖部分样式（base.scss 的 `--ion-background-color`、`--van-*` 等）
- **多次尝试**：直接 re-export Ionic 组件到画布，**无样式**，归因于 Shadow DOM 问题

### 1.2 主工程样式加载链路（已核实）

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

**注意**：主工程 main.scss **未** import `ionic.bundle.css`，只 import 了 core/normalize/structure/typography。`ionic.bundle.css` 可能由 MrWiseVue 或其它入口加载，或组件结构样式在 Web Component JS 内联。

### 1.3 wise-core 样式结构（已核实）

| 文件 | 内容 |
|------|------|
| `core.css` | `:root` 的 `--ion-*` 变量、`body`、`ion-modal`、`.ion-color-*` 等，**无 @import** |
| `ionic.bundle.css` | 约 22KB，含 `ion-label` 等，**不含** `ion-segment`（grep 为 0） |
| `theme.css` | 约 12KB |

- ion-segment 的结构样式可能在 Web Component 的 JS 定义中（Shadow DOM 内联），而非外部 CSS

### 1.4 wise-core 与官方 @ionic/core 的差异（已核实，主工程 mobilebanking）

**已确认：wise-core 与官方 Ionic 不同。**

| 核实项 | 核实结果 |
|--------|----------|
| **wise-core 来源** | `@mr/wise-core@1.0.1`，内部包；`package.json` 中 `"@ionic/vue": "npm:mr-ionic-vue@8.3.0-4"`，即使用 **mr-ionic-vue**（内部 fork），非官方 @ionic/vue |
| **与 @ionic/core 关系** | 基于 mr-ionic-vue / mr-ionic-core，与官方 @ionic/core 结构可能不一致；设计器注入 @ionic/core CDN 无效即佐证 |
| **MrWiseVue 注册** | `main.ts`: `app.use(MrWiseVue, { mode: 'ios', hardwareBackButton, backButtonIcon, backButtonText })`；core.css 有 `html.ios { --ion-default-font: ... }`，说明需 `html.ios` 或 `html.md` class |
| **主工程样式加载** | `main.scss` 只 import：`core.css`、`normalize.css`、`structure.css`、`typography.css`；**未** import `ionic.bundle.css`；core.css 本身**无** @import |
| **ionic.bundle.css 加载** | 主工程未显式 import，可能由 mr-ionic-vue 在组件首次加载时动态注入，或通过 Vite 依赖解析打进主 bundle |
| **theme.scss / base.scss** | theme.scss 大量覆盖 `--ion-color-primary: var(--mr-color-primary)` 等；base.scss 定义 `--ion-background-color: var(--mr-color-bg-200)` |
| **wise-core/css 目录** | 含 core.css、ionic.bundle.css、theme.css、ionic-swiper.css、normalize.css 等；ionic.bundle.css 约 22KB |

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

因此，**只要在画布 document 的 `:root` 上正确设置 Ionic 变量，理论上可让 re-export 的 Ionic 组件获得样式**。

---

## 三、为何此前 re-export 无效果（可能原因）

### 3.1 文档中已尝试的方向

| 尝试 | 结果 | 可能原因 |
|------|------|----------|
| 画布直接加载 ion-segment | 无样式 | 未注入 wise-core 样式链 |
| 设计器注入 @ionic/core CSS | 无效 | 主工程用 @mr/wise-core，与 @ionic/core 结构可能不一致 |
| 物料协议 npm.css | 复杂易失效 | 画布 CSS 注入链路、URL 解析、加载顺序等问题 |

### 3.2 可能的根因（部分已核实）

1. **mr-bank.css 已含 --ion-* 变量（已核实）**
   - 物料构建产物 `dist/lowcode-materials/mr-bank.css` 含 **179 处** `ion-`/`--ion-` 相关内容
   - 含 theme.scss 的 `--ion-color-primary`、`--ion-color-medium` 等覆盖（来自 design-tokens、base-overrides 或业务组件的 import 链）
   - 含 mp-tags 对 `ion-segment`、`ion-segment-button::part(native)` 的样式
   - **但** `mr-components.js` 未 import wise-core 的 core.css，故 **wise-core 的 core.css、ionic.bundle.css 未进入 mr-bank.css**

2. **wise-core 组件结构样式的来源**
   - `ionic.bundle.css` 中 **无** `ion-segment`（grep 为 0），仅有 `ion-label` 等
   - ion-segment 的结构样式很可能在 **Web Component 的 JS 定义** 中（Shadow DOM 内联），加载组件即自带
   - 若如此，画布只需：加载 mr-bank.css（提供 --ion-* 变量）+ 正确渲染 IonSegment 组件

3. **画布可能缺失的环节**
   - **html.ios / html.md**：core.css 有 `html.ios { --ion-default-font: ... }`，主工程由 MrWiseVue 设置 `mode: 'ios'` 可能给 html 加 class
   - **body 背景**：core.css 有 `body { background: var(--ion-background-color); color: var(--ion-text-color) }`，若画布未加载 core.css，body 无此样式
   - **画布 CSS 注入**：需确认 mr-bank.css 是否被正确注入画布 iframe，以及加载顺序

---

## 四、re-export 无桩方案的可行路径（理论）

### 4.1 必要条件

1. **画布加载完整 wise-core 样式链**
   - 至少包含：`core.css`、`normalize.css`、`structure.css`、`typography.css`、`ionic.bundle.css`（或 wise-core 实际使用的等价文件）
   - 需确认 wise-core 的样式入口与依赖关系

2. **画布 :root 具备主工程变量覆盖**
   - `design-tokens.css`（已有）
   - `base-overrides.css` 扩展：加入 `--ion-*` 等 Ionic 变量覆盖
   - 加载顺序：design-tokens → base-overrides → wise-core 样式

3. **物料 bundle 声明 npm.css**
   - mr-components 的 `hasCss: true` 已指向 `mr-bank.css`
   - 需保证 `mr-bank.css` 构建时包含 wise-core 的 Ionic 样式，或单独提供 `ionic-canvas.css` 并在物料中声明

4. **画布 iframe 正确注入上述样式**
   - `init_canvas_deps` → `importStyles` → 将样式 URL 转为 `<link>` 注入画布 document
   - 插件环境下相对路径需转为绝对 URL，避免 403

### 4.2 需要验证的点

| 验证项 | 方法 |
|--------|------|
| wise-core 样式入口 | 查看 wise-core 的 package.json exports、main 入口，以及 core.css 是否 import ionic.bundle |
| mr-bank.css 内容 | 检查物料构建产物，是否包含 Ionic 相关样式 |
| 变量继承 | 在画布 iframe 内手动添加 `:root { --ion-color-primary: red }`，观察 ion-segment 是否变色 |
| MrWiseVue 依赖 | 在画布创建 app 时 `app.use(MrWiseVue, { mode: 'ios' })`，对比有无样式差异 |

---

## 五、风险与不确定性

### 5.1 技术风险

- **wise-core 闭源或结构不明**：若无法确认样式入口与变量定义，难以复现主工程环境
- **构建耦合**：物料构建是否、以及如何把 wise-core 样式打进 mr-bank.css，依赖当前 Vite 配置
- **版本漂移**：wise-core 升级可能改变样式结构，需持续跟进

### 5.2 与桩方案的对比

| 维度 | re-export 无桩 | 画布桩 + 样式自注入 |
|------|----------------|---------------------|
| 维护成本 | 依赖 wise-core 样式链，需与主工程同步 | 桩样式独立，与 wise-core 解耦 |
| 一致性 | 理论上有机会与主工程完全一致 | 需人工对齐视觉，可能有偏差 |
| 实现难度 | 需打通样式注入全链路，不确定性高 | 已验证可行，文档完善 |
| 新增 Ionic 组件 | 若样式链正确，可直接 re-export | 每个组件需单独桩 |

---

## 六、建议的探索顺序（若坚持尝试 re-export）

1. **最小验证**：在画布 iframe 内通过控制台或临时脚本，向 `document.head` 注入一段 `:root { --ion-color-primary: red; --ion-color-medium: #666; }`，再拖入 **IonSegment**（需先将 mr-components 中 MrSegment 改为 re-export IonSegment），观察是否有样式变化。
2. ~~**样式链验证**~~：已核实，见上文 1.2、1.3、3.2。
3. ~~**mr-bank.css 验证**~~：已核实，含 179 处 ion/--ion，含 --ion-* 变量，但**不含** wise-core 的 core.css。
4. **按需扩展**：若变量验证有效，可考虑在物料构建中显式 import `@mr/wise-core/css/core.css`，或将其提取并合并进 mr-bank.css，确保画布有 body、html.ios 等基础样式。

若第 1 步无效果，则变量继承或组件实现可能有问题，re-export 无桩方案的成功率较低。

---

## 七、结论与是否尝试第一步

### 7.1 已核实结论（含主工程 mobilebanking）

| 项 | 结果 |
|----|------|
| wise-core 与官方 | **已确认不同**：使用 mr-ionic-vue@8.3.0-4（内部 fork），非 @ionic/vue |
| 主工程 wise-core 加载 | main.scss 只 import core/normalize/structure/typography，**未** import ionic.bundle.css |
| ionic.bundle.css 加载 | 主工程未显式 import，可能由 mr-ionic-vue 按需注入或 Vite 打进主 bundle |
| wise-core core.css | 含 `:root` --ion-* 变量、`html.ios`/`html.md`、body、ion-modal 等，无 @import |
| ionic.bundle.css | 含 ion-label 等，ion-segment 结构样式可能在 Web Component JS 内联 |
| mr-bank.css | 含 theme 的 --ion-* 覆盖（来自业务组件 import 链），**不含** wise-core 的 core.css |
| 画布当前方案 | MrSegment/MrSegmentButton/MrLabel 均为**桩**（MrSegmentCanvas 等），非 re-export |

### 7.2 是否值得尝试第一步最小验证

**建议：可尝试，但需接受 wise-core 与官方不同带来的不确定性。**

| 因素 | 说明 |
|------|------|
| **wise-core 已核实** | 使用 mr-ionic-vue，与官方不同；设计器注入 @ionic/core CDN 无效是预期结果 |
| **画布需补齐** | html 加 `ios`/`md` class、加载 core.css（或至少 body + :root 变量）、mr-bank.css 已含 --ion-* 变量 |
| **验证成本** | 低：画布控制台注入 `:root { --ion-color-primary: red }` + 临时将 MrSegment 改为 re-export IonSegment |
| **若验证有效** | 说明变量继承正常，可继续投入打通 core.css 注入、html class 等 |
| **若验证无效** | 可能原因：mr-bank.css 未注入画布、html 缺 ios/md、或 mr-ionic-vue 的 Shadow DOM 实现与预期不符；可继续维持桩方案 |

### 7.3 若验证失败

继续使用画布桩 + 样式自注入仍是当前最稳妥方案。

---

## 八、主工程关键路径（mobilebanking）

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

## 九、相关文档

- [Ionic 组件导入与桩方案](./Ionic组件导入与桩方案.md)
- [组件导入注意事项](./组件导入注意事项.md)
- [物料导入快速参考](./物料导入快速参考.md)
- [Ionic CSS Variables 官方文档](https://ionicframework.com/docs/v7/theming/css-variables)
- [Ionic Shadow Parts 官方文档](https://ionicframework.com/docs/v7/theming/css-shadow-parts)
