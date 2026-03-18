# Ionic 组件导入与桩方案

> 本文档合并了原「Ionic画布样式问题根因」「Ionic组件桩方案」「主工程mr-segment桩实施指南」「桩样式自注入方案」及「组件导入注意事项」中 mr-segment 相关内容，作为 **Ionic 原子组件（MrSegment、MrSegmentButton、MrLabel 等）** 在设计器画布中的导入与桩实施统一说明。

---

## 经验总结：Vant 有样式、Ionic 无样式（提取样式无效）

主工程导出原子组件到设计器画布时：

| 组件来源 | 画布表现 | 提取样式 |
|----------|----------|----------|
| **Vant 组件** | 能正常显示，有样式 | 提取后可在画布生效 |
| **Ionic 组件** | 无样式或不可见 | **多次提取样式均无效** |

**原因**：Ionic 使用 Shadow DOM，外部 CSS 难以穿透；画布通过 `init_canvas_deps` → `importStyles` → `<link>` 注入的样式对 Ionic 组件不起作用。因此 Ionic 原子组件需采用**桩 + 样式自注入**，不能依赖「提取样式」方案。

---

## 一、为何采用桩

| 尝试方向 | 问题 |
|----------|------|
| 画布直接加载 ion-segment | Ionic 使用 Shadow DOM，外部 CSS 难以穿透；Vue 与 Ionic Web Components 的 ref 上下文不兼容 |
| 设计器注入 @ionic/core CSS | 主工程用 @mr/wise-core，与 @ionic/core 结构可能不一致 |
| 物料协议 npm.css | 画布 CSS 注入链路复杂易失效，调试成本高 |

**结论**：对 MrSegment、MrSegmentButton、MrLabel 等 Ionic 原子组件，采用**画布桩**，与 MpAccountInput、mp-account-picker 等复杂组件做法一致。

---

## 二、桩样式自注入（推荐）

画布通过 `init_canvas_deps` → `importStyles` → `<link>` 注入外部 CSS，链路复杂易失效。**桩在 `onMounted` 时自注入样式**，不依赖画布外部 CSS。

### 2.1 主工程实现

桩代码在主工程 `lowcode-materials/canvas-stubs/` 中，需包含：

- `utils/inject-stub-styles.js`：通用注入函数
- `styles/mr-segment-stub-styles.js`：样式常量（基于 token，fallback #333333 / #92949c）
- `components/mr-segment-canvas.vue`：`onMounted` 调用 `injectStubStyles`，`provide` 选中值
- `components/mr-segment-button-canvas.vue`：`onMounted` 调用 `injectStubStyles`，`inject` 父组件选中值
- `components/mr-label-canvas.vue`：`onMounted` 调用 `injectStubStyles`

入口：`entries/mr-components.js` 导出上述桩，manifest 中 MrSegment、MrSegmentButton、MrLabel 的 script 指向该入口。

### 2.2 默认选中配置

物料 schema 中为 MrSegment 配置 `value` 或 `modelValue`：`default` | `button` | `segment`。

### 2.3 无效果时排查

1. 桩的 `onMounted` 是否调用了 `injectStubStyles`
2. 主工程入口是否导出桩组件
3. 画布选中态（蓝色边框）是设计器选中态，不是桩样式；取消选中后下划线应可见

---

## 三、Ionic 提取脚本（可选）

mr-segment 桩采用样式自注入（`injectStubStyles` + `mr-segment-stub-styles.js`），不依赖外部 CSS。主工程已移除 `extract-ionic-overrides.cjs` 与 `ionic-overrides.css`。

---

## 四、与组件导入规则的衔接

- **原子组件（MR 开头）**：主工程用 Ionic 的，设计器 mr 入口导出对应桩；不手写另一套实现替代。
- **mr-segment / mr-segment-button / mr-label**：在 mr-components.js 中导出桩，manifest 增加物料条；MpTags 等依赖它们的业务组件才能正常渲染。
- **出码**：仍生成真实组件引用（`<mr-segment>`、`<ion-segment>` 等），桩仅用于设计态画布展示。

---

## 五、参考

- [业务与原子组件导入方案](./业务与原子组件导入方案.md)
- [组件导入注意事项](./组件导入注意事项.md)
