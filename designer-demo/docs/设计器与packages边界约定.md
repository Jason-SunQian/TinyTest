# 设计器与 packages 边界约定

> **本文档约定设计器改造的架构边界，所有涉及设计器的开发与改造均需遵守。**

---

## 一、核心原则

**设计器（designer-demo）的改造一律不得修改 `packages` 目录下的任何文件。**

---

## 二、原因说明

| 要点              | 说明                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **依赖来源**      | 设计器实际依赖的是通过 **npm 安装** 的 `@opentiny/tiny-engine-*`、`@opentiny/tiny-engine-common` 等包，而非本仓库的 `packages` 源码。 |
| **packages 定位** | `packages` 是 TinyEngine 官方源码的本地副本，**仅用于参考和阅读**，不参与设计器的构建与运行。                                         |
| **维护成本**      | 若修改 packages，会导致与 npm 包版本不一致；升级依赖时改动会丢失，且无法随设计器独立迭代。                                            |

---

## 三、正确做法

1. **插件迁移**：从 `packages/plugins/*` **复制**到 `designer-demo/src/plugins/*`，在 `registry.ts` 中注册自定义入口并禁用官方插件；不直接修改 packages 内的插件。
2. **功能扩展**：在 `designer-demo/src/` 内实现覆盖或包装逻辑，通过 Registry 覆盖官方入口。
3. **参考实现**：需要了解行为时，阅读 `packages` 源码，但**不直接修改**。

---

## 四、相关文档

-   [插件迁移指南](./PLUGIN_MIGRATION.md) - 插件迁移（复制到 designer-demo，不修改 packages）
-   [代码提示功能扩展指南](./CODE_COMPLETION_GUIDE.md) - 代码提示扩展（不修改 packages）
-   [样式插件迁移](./styles-plugin-migration.md) - 样式插件迁移（避免修改 packages）
-   [国际化体验总结](./I18N_EXPERIENCE_SUMMARY.md) - 国际化（packages 仅作参考）
-   [设计器去依赖改造方案](./设计器去依赖改造方案.md) - 插件迁移实践案例

---

## 五、设计器结构概览

-   **designer-demo**：设计器主工程，所有改造与扩展均在此目录内完成。
-   **packages**：TinyEngine 源码参考，**只读**，不参与设计器构建。
-   **物料**：由主工程产出 bundle，设计器通过 URL 加载；设计器本地 `materials-src` 仅作过渡。
