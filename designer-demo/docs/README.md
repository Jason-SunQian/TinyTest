# 设计器文档索引

本文档目录包含了设计器相关的所有技术文档和指南。

## 📚 文档列表

### 核心功能文档

-   **[代码提示功能扩展指南](./CODE_COMPLETION_GUIDE.md)** ⭐ 新增
    -   如何添加和修改代码提示关键字
    -   代码提示功能的架构设计
    -   常见问题和维护建议

### 国际化相关

-   **[国际化体验总结](./I18N_EXPERIENCE_SUMMARY.md)**

    -   国际化功能的整体体验和总结

-   **[国际化包装器指南](./I18N_WRAPPER_GUIDE.md)**
    -   如何使用国际化包装器组件

### 插件相关

-   **[插件迁移指南](./PLUGIN_MIGRATION.md)**

    -   插件迁移的步骤和注意事项

-   **[单页面插件文档](./SINGLE_PAGE_PLUGIN.md)**

    -   单页面插件的使用说明

-   **[样式插件迁移](./styles-plugin-migration.md)**
    -   样式插件迁移指南

### 集成相关

-   **[VSCode 集成文档](./VSCode-Integration.md)**

    -   VSCode 插件集成说明

-   **[Mock 接口迁移](./MOCK_MIGRATION.md)**
    -   Mock 接口本地化实现方案

### 架构设计

-   **[设计器去依赖改造方案](./设计器去依赖改造方案.md)**
    -   设计器架构改造方案

-   **[设计器与 packages 边界约定](./设计器与packages边界约定.md)** ⚠️ 必读
    -   设计器改造不得修改 packages；packages 仅作参考，依赖由 npm 提供

## 🚀 快速开始

### 添加代码提示关键字

1. 打开 [代码提示功能扩展指南](./CODE_COMPLETION_GUIDE.md)
2. 按照文档中的步骤添加新关键字
3. 配置文件位置：`designer-demo/src/config/completion-keywords.ts`

### 国际化开发

1. 参考 [国际化包装器指南](./I18N_WRAPPER_GUIDE.md)
2. 查看 [国际化体验总结](./I18N_EXPERIENCE_SUMMARY.md)

### 插件开发

1. 参考 [插件迁移指南](./PLUGIN_MIGRATION.md)
2. 查看相关插件文档

## 📝 文档维护

-   所有文档都在 `designer-demo/docs/` 目录下
-   文档使用 Markdown 格式编写
-   新增文档时请更新本索引文件

## 🔍 文档查找

### 按功能查找

-   **代码提示** → [CODE_COMPLETION_GUIDE.md](./CODE_COMPLETION_GUIDE.md)
-   **国际化** → [I18N_WRAPPER_GUIDE.md](./I18N_WRAPPER_GUIDE.md)
-   **插件开发** → [PLUGIN_MIGRATION.md](./PLUGIN_MIGRATION.md)
-   **VSCode 集成** → [VSCode-Integration.md](./VSCode-Integration.md)

### 按问题查找

-   **设计器改造时能否修改 packages？** → [设计器与 packages 边界约定](./设计器与packages边界约定.md)（**不能**，packages 仅作参考）
-   **如何添加代码提示关键字？** → [CODE_COMPLETION_GUIDE.md](./CODE_COMPLETION_GUIDE.md#三如何添加新关键字)
-   **如何实现国际化？** → [I18N_WRAPPER_GUIDE.md](./I18N_WRAPPER_GUIDE.md)
-   **如何迁移插件？** → [PLUGIN_MIGRATION.md](./PLUGIN_MIGRATION.md)

---

**最后更新**：2025-01-XX
