# Ionic 画布样式问题：根因分析与方案

> **状态**：直接加载 Ionic 真实组件的方案已还原。推荐改用 **桩方案**，见 [Ionic组件桩方案.md](./Ionic组件桩方案.md)。
>
> 现象：`ionic.bundle.css` 已成功加载（Network 200 OK），但画布上的 Segment 等 Ionic 组件仍无样式。本文从物料协议与主工程产出角度分析根因，供参考。

---

## 一、问题现象

- **Network**：`http://localhost:8090/ionic-canvas/ionic.bundle.css` 返回 200，样式已加载
- **画布**：MrSegment、MrSegmentButton 等拖入后表现为纯文本/灰框，无 Ionic 分段控件样式
- **目标**：画布效果应与主工程出码一致，且应通过**物料资产包协议**解决，而非设计器侧硬编码

---

## 二、物料协议对样式的支持（标准路径）

根据 [TinyEngine 物料资产包协议](https://www.opentiny.design/tiny-engine#/protocol) 与 [设计器中引入第三方组件库](https://docs.opentiny.design/tiny-engine/dev/third-party-library-in-designer.html)：

| 字段 | 说明 |
|------|------|
| `npm.script` | 组件脚本 CDN/URL，画布动态 import |
| `npm.css` | 组件样式 CDN/URL，设计器收集后注入画布 |

**标准流程**：

1. 物料包中每个组件配置 `npm.css`（如 ElInput 示例：`"css": "https://unpkg.com/element-plus@2.3.8/dist/index.css"`）
2. 设计器 `parseMaterialsDependencies` / `generateThirdPartyDeps` 遍历 `components`，将 `item.npm.css` 加入 `materialsDeps.styles`
3. `getCanvasDeps` 将 `materialsDeps.styles` 与 import map 一并发布到 `init_canvas_deps`
4. 画布 HTML 的 `<!--%IMPORT_STYLE%-->` 被替换为 `<link rel="stylesheet" href="...">`，样式随画布加载

**文档明确建议**（业务与原子组件导入方案.md 第 213 行）：

> **样式**：Vant、Ionic 的样式均需在设计器/预览中加载；可通过物料 `npm.css` 或预览入口统一引入。

---

## 三、当前实现与缺口

### 3.1 设计器侧已做

- `getCanvasDeps` 中**强制追加** `getIonicCanvasStyleUrls(designerOrigin)`，即 `/ionic-canvas/ionic.bundle.css` 等
- `CanvasContainer.canvasReady` 中再次注入 Ionic 样式、设置 `html.ios` / `html.md`
- 构建脚本 `copy-ionic-canvas-css.cjs` 从 `@ionic/core/css` 复制 5 个 CSS 到 `public/ionic-canvas/`

### 3.2 物料侧缺口（根因）

- **mock bundle**（`designer-demo/public/mock/bundle.json`）：56 个组件中仅 1 个配置了 `npm.css`（van-button）
- **主工程 bundle**（`http://localhost:3000/bundle.json`）：需主工程仓库确认，**MrSegment、MrSegmentButton、MrImg 等 Ionic 原子组件的 `npm` 中是否包含 `css`**

若主工程物料生成脚本（如 `lowcode-materials/scripts/generate-bundle`）**未**为 Ionic 组件输出 `npm.css`，则：

- 设计器 `generateThirdPartyDeps` 不会从物料中收集到 Ionic 样式
- 当前生效的只有设计器侧「硬编码」的 `getIonicCanvasStyleUrls`，属于**协议外补丁**

### 3.3 为何 CSS 加载了仍无效果？

可能原因：

1. **Ionic Web Components 与 Shadow DOM**  
   - ion-segment 等使用 Shadow DOM，组件内部样式由**组件定义**提供，外部 CSS 主要提供 CSS 变量（`--ion-color-*`）和 `html.ios` / `html.md` 等 mode 选择器
   - `ionic.bundle.css` 以变量和全局规则为主，组件视觉样式多来自 Stencil 构建进组件的 Shadow DOM

2. **@ionic/core vs @mr/wise-core**  
   - 主工程使用 `@mr/wise-core`，设计器加载 `@ionic/core` 的 CSS
   - 若 wise-core 对 Ionic 有封装或样式覆盖，DOM 结构或类名可能不一致，导致 `@ionic/core` 的 CSS 无法完全匹配

3. **组件未正确渲染为 ion-segment**  
   - 若 mr-components.js 导出的是 Vue 包装组件，且未正确渲染 `<ion-segment>`，则 Ionic 样式不会作用到预期元素

---

## 四、推荐方案：从物料生成源头补齐

### 4.1 主工程物料配置（优先）

**方式 A：组件级别 `npm.css`**

在主工程 `lowcode-materials/manifest.json` 或生成 bundle 的脚本中，为 **Ionic 原子组件**（MrSegment、MrSegmentButton、MrLabel、MrImg 等）补充 `npm.css`：

```json
{
  "component": "MrSegment",
  "npm": {
    "package": "@local/mr-components",
    "script": "http://localhost:3000/materials/mr-components.js",
    "exportName": "MrSegment",
    "css": "http://localhost:3000/ionic-canvas/ionic.bundle.css"
  }
}
```

**方式 B：packages 级别（推荐，一次配置全局生效）**

物料协议支持 `packages` 数组，用于声明共享依赖。若 mr-components 作为共享包，可在 `packages` 中声明 `css`，所有使用该包的组件自动获得样式：

```json
{
  "packages": [
    {
      "package": "@local/mr-components",
      "script": "http://localhost:3000/materials/mr-components.js",
      "css": "http://localhost:3000/ionic-canvas/ionic.bundle.css"
    }
  ],
  "components": [...]
}
```

设计器 `parseMaterialsDependencies` 会遍历 `packages`，将 `pkg.css` 加入 `materialsDeps.styles`，与 `components[].npm.css` 等效。

**要点**：

- 所有共用 mr-components 的 Ionic 原子组件可共用同一 `npm.css`（组件级）或 `packages[].css`（包级）
- `css` 需为设计器可访问的**绝对 URL**（或相对 bundle base 可解析的路径）
- 生成 bundle 的脚本需在输出时包含 `css` 字段（组件 npm 或 packages）

### 4.2 设计器侧保持兼容

- 若主工程 bundle 已包含 `npm.css`，`generateThirdPartyDeps` 会自动收集，`getCanvasDeps` 会下发到画布
- 设计器侧可**保留** `getIonicCanvasStyleUrls` 作为 fallback：当物料中无 Ionic 样式时，仍能通过设计器自包含的 `/ionic-canvas/` 加载
- 后续主工程全面补齐后，可考虑移除该 fallback，完全依赖协议

### 4.3 验证步骤

1. 主工程执行 `pnpm run build:designer-materials`（或等价命令），检查生成的 `bundle.json` 中 MrSegment 等是否包含 `npm.css`
2. 设计器加载主工程 bundle，在控制台过滤 `[Materials]`，确认 `materialsDeps.styles` 中包含 Ionic 样式 URL
3. 画布 Network 中确认对应 CSS 已加载，且 `<html>` 有 `ios` 或 `md` class
4. 若仍无样式，在画布 iframe 内检查：`<ion-segment>` 是否真实渲染、Shadow DOM 内是否有样式

---

## 五、为何不应依赖「每个组件都打桩」

- **Ionic 为现成组件库**：应通过 `npm.script` + `npm.css` 声明依赖，由协议统一加载
- **主工程样式覆盖**：可通过主工程物料中的 `npm.css` 指向主工程构建出的样式（如 wise-core 或合并后的 theme.css），无需为每个组件单独造桩
- **打桩成本高**：成百个组件时，逐个维护桩不现实；协议化配置可批量生成、易于维护

---

## 六、小结

| 项目 | 结论 |
|------|------|
| **根因** | 主工程物料包中 Ionic 原子组件很可能未配置 `npm.css`，协议流程未收集到样式 |
| **标准做法** | 在主工程 manifest / 生成脚本中为 MrSegment 等补充 `npm.css`，指向 Ionic/wise-core 样式 URL |
| **设计器** | 保留当前 fallback 作为过渡，待主工程补齐后可收敛为纯协议驱动 |
| **验证** | 检查主工程 bundle 结构 → 确认 materialsDeps.styles → 检查画布 DOM 与 Shadow DOM |

---

## 七、主工程自检清单

在主工程仓库执行：

```bash
# 1. 检查 bundle 中 MrSegment 的 npm 配置
node -e "
const b = require('./dist/lowcode-materials/bundle.json');
const c = (b.data?.materials?.components || []).find(x => x.component === 'MrSegment');
console.log('MrSegment npm:', JSON.stringify(c?.npm, null, 2));
"

# 2. 若使用 designer-demo 的校验脚本
cd /path/to/TinyTest/designer-demo
pnpm run validate:bundle-structure -- http://localhost:3000/bundle.json
```

若 `npm.css` 为空或缺失，需在物料生成逻辑中补充。
