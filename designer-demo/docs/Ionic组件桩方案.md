# Ionic 原子组件桩方案

> 当直接加载 Ionic 真实组件在设计器画布中难以生效（Shadow DOM、样式穿透、Vue ref 上下文等）时，可参考复杂组件的做法，**通过画布桩展示**。桩内引用 wise-core 及主工程覆盖后的样式，在设计器中呈现与主工程一致的视觉效果。

---

## 一、为何采用桩

| 尝试方向 | 问题 |
|----------|------|
| 画布直接加载 ion-segment | Ionic 使用 Shadow DOM，外部 CSS 难以穿透；Vue 与 Ionic Web Components 的 ref 上下文不兼容，控制台报 `Missing ref owner context` |
| 设计器自包含 @ionic/core CSS | 样式加载成功但组件仍无效果；主工程用 @mr/wise-core，与 @ionic/core 结构可能不一致 |
| 物料协议 npm.css | 需主工程 bundle 正确配置，且仍受上述 Shadow DOM / Vue 兼容性限制 |

**结论**：对 MrSegment、MrSegmentButton、MrLabel 等 Ionic 原子组件，采用**画布桩**更稳妥，与 MpAccountInput、mp-account-picker 等复杂组件的做法一致。

---

## 二、桩方案思路

### 2.1 与复杂组件桩的对应关系

| 复杂组件 | 做法 | Ionic 原子组件 |
|----------|------|----------------|
| mp-account-picker | canvas-stub 替换子组件为占位，保留结构/类名 | MrSegment、MrSegmentButton |
| 样式来源 | shared-stub.css、design token、主工程类名 | wise-core 提取 CSS + 主工程覆盖样式 |
| 物料入口 | 导出 xxx-canvas.vue 桩 | 导出 mr-segment-canvas.vue 等桩 |

### 2.2 桩的职责

- **画布展示**：用纯 Vue 组件 + HTML 结构模拟 ion-segment 的外观
- **样式**：引用主工程提取的 wise-core 及覆盖样式（如 `mr-bank.css`、`ionic-overrides.css`）
- **出码**：仍生成真实组件引用（`<mr-segment>`、`<ion-segment>`），不输出桩代码

---

## 三、实施步骤（主工程侧）

### 3.1 提取 wise-core 与主工程样式

在主工程 `lowcode-materials/scripts/` 下增加 `extract-wise-core-css.cjs`（或沿用已有脚本）：

- 从 `@mr/wise-core` 或主工程实际 Ionic 包提取核心 CSS
- 合并主工程对 Ionic 的覆盖样式（如 `base.scss`、`theme`、`colorful-light.css` 中相关部分）
- 输出为 `dist/lowcode-materials/wise-canvas.css`（或按需命名）

### 3.2 创建画布桩组件

在 `lowcode-materials/canvas-stubs/` 下新增：

**mr-segment-canvas.vue**（示例）：

```vue
<template>
  <div class="ion-segment-stub ion-segment ion-segment-md" :class="$attrs.class">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  value: { type: String, default: 'default' },
  mode: { type: String, default: 'md' }
});
</script>

<style scoped>
/* 若 wise-canvas.css 已全局注入，可无需额外样式；否则在此补充最小样式 */
.ion-segment-stub {
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  /* 与主工程 ion-segment 外观一致 */
}
</style>
```

**mr-segment-button-canvas.vue**（示例）：

```vue
<template>
  <div class="ion-segment-button-stub ion-segment-button" :class="{ 'segment-button-selected': selected }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  value: { type: String, default: '' },
  selected: { type: Boolean, default: false }
});
</script>
```

桩的**类名**需与 wise-core / 主工程实际使用的类名一致，以便 `wise-canvas.css` 生效。

### 3.3 物料入口与样式注入

- **入口**：`entries/mr-segment.js` 等导出桩组件（画布用），出码映射仍指向真实 `mr-segment`
- **样式**：在 bundle 的 `packages` 或组件 `npm.css` 中声明 `wise-canvas.css` 的 URL，使画布加载物料时自动注入
- **manifest**：MrSegment、MrSegmentButton 的 `script` 指向桩入口，`exportName` 与桩组件名一致

### 3.4 与 generate-canvas-stub 的集成

若主工程已有 `generate-canvas-stub.cjs`，可在 `STUB_CONFIG` 中为 MrSegment、MrSegmentButton 增加配置，从真实 ion-segment 的 DOM 结构提取模板，替换为桩可用的简化结构，减少手写维护。

---

## 四、设计器侧

- **无需**再注入 ionic-canvas、copy-ionic-canvas-css 等
- 画布只加载主工程物料包，样式由物料的 `npm.css` 提供（wise-canvas.css）
- 保持现有 runtime、block 解析、CORS 等逻辑即可

---

## 五、小结

| 项目 | 说明 |
|------|------|
| **可行性** | 与 MpAccountInput、mp-account-picker 等复杂组件桩方案一致，已在主工程实践 |
| **样式** | 桩 + wise-core 提取 CSS + 主工程覆盖样式，保证画布与主工程视觉一致 |
| **维护** | 桩结构尽量从真实组件提取，样式依赖一份共享 CSS，避免逐个手写 |
| **出码** | 仍生成真实组件，桩仅用于设计态展示 |

---

## 六、参考文档

- [业务与原子组件导入方案](./业务与原子组件导入方案.md) 第 9.7 节「画布桩：全部使用源码样式」
- [组件导入注意事项](./组件导入注意事项.md) 第 2（续）节「MpTags 画布不显示」中的设计态包装提示
