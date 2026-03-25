# Ionic 组件导入与桩方案

> 本文档合并了原「Ionic 画布样式问题根因」「Ionic 组件桩方案」「主工程 mr-segment 桩实施指南」「桩样式自注入方案」及「组件导入注意事项」中 mr-segment 相关内容，作为 **Ionic 原子组件（MrSegment、MrSegmentButton、MrLabel 等）** 在设计器画布中的导入与桩实施统一说明。

---

## 经验总结：Vant 有样式、Ionic 无样式（提取样式无效）

主工程导出原子组件到设计器画布时：

| 组件来源       | 画布表现           | 提取样式               |
| -------------- | ------------------ | ---------------------- |
| **Vant 组件**  | 能正常显示，有样式 | 提取后可在画布生效     |
| **Ionic 组件** | 无样式或不可见     | **多次提取样式均无效** |

**原因**：Ionic 使用 Shadow DOM，外部 CSS 难以穿透；画布通过 `init_canvas_deps` → `importStyles` → `<link>` 注入的样式对 Ionic 组件不起作用。因此 Ionic 原子组件需采用**桩 + 样式自注入**，不能依赖「提取样式」方案。

---

## 一、为何采用桩

| 尝试方向                   | 问题                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| 画布直接加载 ion-segment   | Ionic 使用 Shadow DOM，外部 CSS 难以穿透；Vue 与 Ionic Web Components 的 ref 上下文不兼容 |
| 设计器注入 @ionic/core CSS | 主工程用 @mr/wise-core，与 @ionic/core 结构可能不一致                                     |
| 物料协议 npm.css           | 画布 CSS 注入链路复杂易失效，调试成本高                                                   |

**结论**：对 MrSegment、MrSegmentButton、MrLabel 等 Ionic 原子组件，采用**画布桩**，与 MpAccountInput、mp-account-picker 等复杂组件做法一致。

---

## 二、桩样式自注入（推荐）

画布通过 `init_canvas_deps` → `importStyles` → `<link>` 注入外部 CSS，链路复杂易失效。**桩在 `onMounted` 时自注入样式**，不依赖画布外部 CSS。

### 2.1 主工程实现

桩代码在主工程 `lowcode-materials/canvas-stubs/` 中，需包含：

-   `utils/inject-stub-styles.js`：通用注入函数
-   `styles/mr-segment-stub-styles.js`：样式常量（基于 token，fallback #333333 / #92949c）
-   `components/mr-segment-canvas.vue`：`onMounted` 调用 `injectStubStyles`，`provide` 选中值
-   `components/mr-segment-button-canvas.vue`：`onMounted` 调用 `injectStubStyles`，`inject` 父组件选中值
-   `components/mr-label-canvas.vue`：`onMounted` 调用 `injectStubStyles`

入口：`entries/mr-components.js` 导出上述桩，manifest 中 MrSegment、MrSegmentButton、MrLabel 的 script 指向该入口。

### 2.2 默认选中配置与属性协议

-   **value / v-model**：物料 schema 中为 MrSegment 配置 `value`，对应主工程的 v-model（如 `v-model="segmentValue"`）。可选值：`default` | `segment` | `button` 等，需与子按钮的 `value` 匹配才显示选中态。
-   **scrollable**：主工程常用 `:scrollable="scrollable"`，manifest 的 schemaExtra 需包含该属性。
-   **v-model 协议**：events 中需声明 `onUpdate:value`，当 value 绑定为变量时出码会生成 `v-model:value="state.xxx"`。

### 2.3 画布与出码的差异（重要）

| 场景           | 表现                                                                           |
| -------------- | ------------------------------------------------------------------------------ |
| **出码/预览**  | value 配置正确生效，选中态与切换正常                                           |
| **画布设计态** | 属性面板修改 value 后，画布桩可能不实时同步选中态（受 iframe/schema 同步限制） |

**最低要求**：属性可配置、出码正确。画布实时同步为锦上添花，当前以出码为准。

### 2.4 子按钮 value 唯一性

-   各 MrSegmentButton 的 `value` 必须唯一，否则出码后多个按钮会同时显示选中。
-   设计器在预览/出码前会执行 `patchSchemaWithMaterialDefaults`（`useMaterial.ts`），自动修复重复或空的 value（按 default、segment、button、tab1… 分配）。

### 2.5 子按钮 component-base-style 对齐覆盖

-   **现象**：后拖入的 MrSegmentButton 比 snippet 内默认按钮多出 `component-base-style`，带 `margin-top`，导致出码后对齐错位。
-   **原因**：设计器对拖入组件默认加 `component-base-style` 做间距；MrSegmentButton 是 ion-segment 的 flex 子项，额外 margin 会破坏水平对齐。
-   **处理**：在 `designer-demo/src/plugins/materials/constants.ts` 中配置 `COMPONENTS_SKIP_BASE_STYLE`，useMaterial 与 container 据此排除/移除该类名，不修改 packages。

### 2.6 MrLabel 文本属性（重要，经验总结）

**现象**：设计器中设置 MrLabel「文本」为 123 后，运行/预览时 `<ion-label>` 尺寸 0x0，不显示。

**根因**：`ion-label` / `mr-label` 使用 **默认 slot** 显示内容，不支持 `label` 属性。源码写法为 `<mr-label>{{ tab.label }}</mr-label>`，内容必须在 slot（即 schema 的 `children`）中。

| 错误配置                                                | 正确配置                                   |
| ------------------------------------------------------- | ------------------------------------------ |
| `property: "label"` + InputConfigurator                 | `property: "children"` + InputConfigurator |
| 出码：`<mr-label label="123"></mr-label>`（0x0 不显示） | 出码：`<mr-label>123</mr-label>`           |

**主工程 manifest 正确配置**（lowcode-materials/manifest.json）：

1. **schemaExtra**：使用 `property: "children"` + `InputConfigurator`（单行输入，避免 HtmlTextConfigurator 大区域），使属性面板写入 slot 内容：

```json
{
    "property": "children",
    "label": { "text": { "zh_CN": "文本", "en_US": "Text" } },
    "widget": { "component": "InputConfigurator", "props": {} }
}
```

2. **snippetSchema**：拖入时默认带 `children`，保证画布与运行都能显示：

```json
{
    "componentName": "MrLabel",
    "props": {},
    "children": "Label"
}
```

**兼容旧 schema**：若已有页面使用 `props.label`，设计器在预览/出码前会通过 `patchSchemaWithMaterialDefaults`（useMaterial）和 `patchMrLabelPropsToChildren`（vue-generator parseSchemaPlugin）自动将 `props.label` 转为 `children`，保证出码正确。建议主工程 manifest 按上述配置，从源头正确。

**文本配置器选择**：MrLabel、MrButton 等 slot 文本仅需单行输入时，用 `InputConfigurator` 替代 `HtmlTextConfigurator`，避免属性面板展示过大区域。

#### 2.6.1 属性面板「文本」为空，画布与 input.json 正常（MrLabel / MrButton / MrTitle）

> 与上文「ion-label 必须用 slot、manifest 配 `property: children`」是两件不同的事：manifest 配对了，仍可能出现**面板不显示、JSON 里却是顶层 `children` 字符串**的情况。

**现象**

-   画布上 MrLabel / MrButton 文字正常，保存后的 `input.json` 里也有文案。
-   JSON 中常见结构为：节点顶层 **`"children": "234"`**（字符串），而 **`props` 里只有 `className` 等**，没有 `props.children`。
-   选中组件后，右侧属性面板里「Text」/「Button Text」**输入框为空**。
-   对比：**MpProgress**、**MpAccountInput** 等把业务字段写在 **`props`**（如 `percentage`、`label`）里的组件，面板能正常回显。

**根因（设计器协议，非 manifest 配错）**

1.  TinyEngine 属性面板在 `packages/settings/props/src/composable/useProperties.ts` 中通过 **`mergeProps(toRaw(schema.props), 物料分组)`** 生成表单项；**只从 `schema.props[prop.property]` 取值**。物料里 Text 对应的是 **`property: "children"`**，即读 **`props.children`**。
2.  引擎在不少场景下会把「纯文本 slot」持久化为**节点上的 `children` 字符串**（与 `props` 同级），**不自动写回 `props.children`**。画布与出码链路会读节点 `children`，故显示正常；**属性面板只认 `props`，故为空**。
3.  仅在保存/预览前做 `patchSchemaWithMaterialDefaults`、或在 `fillNodePropsWithMaterialDefaults` 里 **`setProp('children', …)`**，仍可能**不生效**：`getProps` 在「同一节点再次选中」时会对 `mergeProps` **短路**，不会重新合并，`pageState.properties` 不会随 `props` 更新而刷新。

**设计器侧处理（designer-demo）**

| 环节 | 说明 |
| ---- | ---- |
| **同步规则** | `slotChildrenPropsSync.ts`：`syncSlotStringChildrenWithPropsChildren` 在 **`schema.children`（字符串）与 `props.children`（及误配的 `props.text`）之间做对齐**，与 MrTitle 同类问题一致。 |
| **选中即生效** | `patchPropertiesGetProps.ts`：在应用 **`getProps` → `mergeProps` 之前** 调用上述同步（在 `main.ts` 的 `appCreated` 里安装补丁）。这样**第一次选中**即可在面板看到文案。 |
| **保存/预览** | `useMaterial.ts` 中 `patchSchemaWithMaterialDefaults` 对整棵树调用同一同步，保证落盘与出码前节点上字段一致。 |

**结论**

-   **主工程 manifest**：继续采用 **`property: "children"` + `InputConfigurator` + snippet 默认 `children`** 即可，无需为「面板回显」再改成别的 property 名。
-   **数据形态**：页面 JSON 中出现顶层 **`children: "..."` 字符串** 是引擎常见写法；设计器通过上述同步把「面板可读」的 **`props.children`** 与之一致，而不是要求业务手工改 JSON 结构。

### 2.7 MrButton 经验总结（Vant 按钮）

**来源**：主工程 `mr-button` 对应 Vant 的 `Button`（`types/components.d.ts` 中 `MrButton: typeof import('vant/es')['Button']`），无需桩，直接 re-export。

**配置要点**：

| 配置项               | 说明                                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **children**         | 按钮文字在 slot 中，用 `property: "children"` + `InputConfigurator`（单行输入，避免 HtmlTextConfigurator 大区域） |
| **snippetSchema**    | 默认 `children: "Button"`，`props: { type: "primary" }`                                                           |
| **type / size 选项** | SelectConfigurator 的 options 的 `label` 一律用**英文**（Default、Primary、Large、Normal 等），项目规定           |

**vite 配置**：`vantToMr` 中增加 `Button: 'MrButton'`，业务组件 chunk 中 `import { Button } from 'vant'` 会替换为 `import { MrButton } from '@local/mr-components'`。

### 2.8 MrHeader / MrBackButton：整段拖拽 vs 清空后单独拖子组件

**现象**

-   **整段拖拽**推荐 snippet（MrHeader 内已含 MrToolbar、MrBackButton、MrTitle 等）时，子节点 **MrBackButton** 的「Default Href」常为 **`javascript:void(0)`**，画布返回箭头与出码正常。
-   **先拖 MrHeader，清空子节点，再逐个拖入** MrToolbar、MrBackButton、MrTitle 时，**单独拖入的 MrBackButton** 面板上 **Default Href 为空**；画布上可能缺少返回箭头，**出码后** `ion-back-button` 也可能因缺少有效 `default-href` 而不显示。
    
**补测结论**：在完成 `defaultHref` 补全与相关修补后，上述“清空后逐个拖入”流程已验证可用，推荐仍以该结构组装 Header。

**原因**

1.  **物料约定**：manifest 里 MrBackButton 的 `defaultHref` 的 **`defaultValue` 故意为 `""`**（见主工程 `manifest.json` 说明），避免与「运行时占位」等同而被出码逻辑整块省略；真正运行/设计态占位由 **`javascript:void(0)`** 承担。`patchSchemaWithMaterialDefaults`（保存/预览前）会为节点补上该值。
2.  **snippet 与单拖差异**：整段 snippet 往往在子节点 schema 里**已写入** `props.defaultHref`；**单独从物料面板拖入**的 MrBackButton 常只有空 `props`，不会自动带上 snippet 里的默认值。
3.  **属性面板**：`mergeProps` 只读 `schema.props`；空则与物料 `defaultValue: ""` 合并，面板显示为空。仅靠 `fillNodePropsWithMaterialDefaults` 里 `setProp` 补全，仍会遇到与 **§2.6.1** 相同的 **`getProps` 短路**，首次选中不一定刷新出 `javascript:void(0)`。

**设计器处理**

-   在 **`patchPropertiesGetProps.ts`** 中，于 **`getProps` → `mergeProps` 之前** 对 **MrBackButton** 就地写入：若 `defaultHref` 为空则设为 **`javascript:void(0)`**，与 `useMaterial.ts` 里保存/预览前的修补一致。
-   这样**第一次选中**单独拖入的 MrBackButton，面板即可见 Default Href，且节点引用被就地更新，画布与后续保存/出码一致。

**主工程 manifest**：无需为「单独拖拽」再改协议；保持 `defaultHref` + 说明文案即可。

### 2.9 MrButtons：拖入后选中圈不显示/无法在画布命中（空 children）

**现象**

-   将 `MrButtons` 拖入 `MrToolbar` 内后，从左侧 tree 插件里选中 `MrButtons`，画布上不会出现选中圈（蓝色边框/轮廓）。
-   仍能正常点击/选择其它组件；但 `MrButtons` 本身没有选中态表现。

**你这次验证的结论**

-   当 `MrButtons` 仍处于“空容器”（未向其内部继续拖入子组件）时，更容易出现上述不高亮/不易命中的问题。
-   一旦继续把可见子组件拖入 `MrButtons` 内（使其内部产生渲染内容/尺寸），一般就能恢复正常选中效果。

**原因（与画布选中机制相关）**

画布选中态依赖节点对应 DOM 的 `getBoundingClientRect()` 矩形区域。`MrButtons` 在画布中使用真实 `IonButtons` 时，即便内部有子节点，也存在得到 0 宽高的情况（导致选中圈不绘制）。因此建议与 `MrToolbar/MrBackButton/MrTitle` 一样使用**画布桩**，保证始终有可计算尺寸。

**建议做法**

1. 设计时确保 `MrButtons` 内至少包含一个可见子组件（例如 `MrBackButton` 或可见的按钮文本节点），避免“空容器不可选”的问题。
2. **推荐**：在主工程 `lowcode-materials/entries/mr-components.js` 将 `MrButtons` 改为导出 `mr-buttons-canvas.vue` 画布桩（与 header 其它子组件一致），避免选中框依赖真实 `IonButtons` 的不稳定尺寸。

### 2.10 MpAgreementButton 经验总结（业务组件 i18n 文案）

**现象**：画布中 MpAgreementButton 显示 `common.agree` 而非 "Agree and continue"。

**根因**：组件源码用 `$t('common.agree')`，`$t` 来自 `app.config.globalProperties.$t`（runtime 注入）。设计器画布可能用内置 runtime，其 `lowcodeI18n` 无主工程 key，故返回 key 本身。

**正确做法**（与 mp-account-input 一致）：

1. **做 canvas 桩**：`canvas-stubs/components/mp-agreement-button-canvas.vue`，在桩内 `import { t as $t } from '../vue-i18n'`，不依赖 runtime 的 globalProperties。
2. **entry 导出桩**：`entries/mp-agreement-button.js` 导出 canvas 桩，出码仍引用主工程真实组件。
3. **FALLBACK 补充**：在 `canvas-stubs/vue-i18n.ts` 的 FALLBACK 中增加 `common.agree`、`common.agreeTip` 等主工程 key。

**规则**：业务组件若在模板中用 `$t('xxx')`，且设计器无该 key，需做 canvas 桩并直接 import vue-i18n 的 t。

### 2.11 无效果时排查

1. 桩的 `onMounted` 是否调用了 `injectStubStyles`
2. 主工程入口是否导出桩组件
3. 画布选中态（蓝色边框）是设计器选中态，不是桩样式；取消选中后下划线应可见
4. 出码异常时检查子按钮 value 是否重复
5. 子按钮对齐错位时检查 `constants.ts` 中 `COMPONENTS_SKIP_BASE_STYLE` 是否包含该组件
6. MrLabel 运行时不显示：检查是否误用 `label` 属性；设计器已做 `props.label` → `children` 自动转换，出码应正确；manifest 建议改为 `children` + InputConfigurator
7. 业务组件画布显示 i18n key：组件用 `$t` 时，做 canvas 桩并 `import { t as $t } from '../vue-i18n'`，在 FALLBACK 中补充 key；详见 2.10 节
8. 单独拖入的 MrBackButton 无返回箭头 / Default Href 为空：见 **§2.8**；确认设计器已加载 `patchPropertiesGetProps` 对 MrBackButton 的补全
9. `MrTitle` 放到 `MrContent` 内不显示：确认 `mr-title-stub` 不再在非 Header 场景绝对定位；本次已修复设计器画布里 `mr-content + MrTitle` 可正常渲染

---

## 三、Ionic 提取脚本（可选）

mr-segment 桩采用样式自注入（`injectStubStyles` + `mr-segment-stub-styles.js`），不依赖外部 CSS。主工程已移除 `extract-ionic-overrides.cjs` 与 `ionic-overrides.css`。

---

## 四、与组件导入规则的衔接

-   **原子组件（MR 开头）**：主工程用 Ionic 的，设计器 mr 入口导出对应桩；不手写另一套实现替代。
-   **mr-segment / mr-segment-button / mr-label**：在 mr-components.js 中导出桩，manifest 增加物料条；MpTags 等依赖它们的业务组件才能正常渲染。
-   **出码**：仍生成真实组件引用（`<mr-segment>`、`<ion-segment>` 等），桩仅用于设计态画布展示。

---

## 五、参考

-   [业务与原子组件导入方案](./业务与原子组件导入方案.md)
-   [组件导入注意事项](./组件导入注意事项.md)
