# 设计器文档索引

本文档目录包含了设计器相关的所有技术文档和指南。

## 📚 文档列表

### 核心功能文档

-   **[代码提示功能扩展指南](./CODE_COMPLETION_GUIDE.md)** ⭐ 新增
    -   如何添加和修改代码提示关键字
    -   代码提示功能的架构设计
    -   常见问题和维护建议
-   **[主工程 utils 工具提示导入思路](./主工程utils工具提示导入思路.md)**
    -   主工程 `utils/` 工具方法 → 清单 JSON → 插件注入 → 设计器 Monaco 补全
-   **[主工程 store 导入思路](./主工程store导入思路.md)**
    -   主工程 Pinia store → `this.stores.<短名>` 运行态 + `namespaces.stores` 设计器补全

### 国际化相关

-   **[国际化体验总结](./I18N_EXPERIENCE_SUMMARY.md)**

    -   国际化功能的整体体验和总结

-   **[国际化包装器指南](./I18N_WRAPPER_GUIDE.md)**
    -   如何使用国际化包装器组件

### 插件相关

-   **[插件迁移指南](./PLUGIN_MIGRATION.md)**

    -   插件迁移的步骤和注意事项

-   **[迁移插件功能失效排查指南](./迁移插件功能失效排查指南.md)** ⭐ 排障必读

    -   迁完后按钮「没反应」：官方 `META_APP.*` vs 自定义 `custom*` ID 不一致
    -   Locate Code / `activePlugin` / `getMetaApi` 排查步骤与自检清单
    -   **画布一直转圈（三色点）**：语法错误（块注释里的 `*/`）、Vite/物料/initData 排查方向

-   **[单页面插件文档](./SINGLE_PAGE_PLUGIN.md)**

    -   单页面插件的使用说明

-   **[样式插件迁移](./styles-plugin-migration.md)**
    -   样式插件迁移指南

### 集成相关

-   **[主工程低代码资源操作手册](./主工程低代码资源操作手册.md)** ⭐ 日常必读

    -   三类资源（物料 / 样式 / utils·stores）：文件夹、命令、成果物、设计器怎么吃到；对着 package.json 的命令速查

-   **[主工程低代码集成指南-OAB](./主工程低代码集成指南-OAB.md)** ⭐ OAB 主工程必读

    -   OAB 集成入口：仓库地图、路由/i18n、物料构建、**问题→改哪里**、精简开发要求；细节链到注意事项与进度文档

-   **[VSCode 集成文档](./VSCode-Integration.md)**

    -   VSCode 插件集成说明

-   **[Mock 接口迁移](./MOCK_MIGRATION.md)**
    -   Mock 接口本地化实现方案

### 物料相关

-   **[物料导入快速参考](./物料导入快速参考.md)** ⭐ 改造前必读

    -   设计器如何从主工程导入物料资产包、协议要点、痛点与改造方向、文档链接

-   **[物料导入进度跟踪](./物料导入进度跟踪.md)**

    -   原 **mobilebanking** 主工程 `mr-*` / `mp-*` 导入与联调进度

-   **[物料导入进度跟踪-OAB](./物料导入进度跟踪-OAB.md)** ⭐ OAB 主工程

    -   **OAB** 源码组件使用 vs `lowcode-materials` 缺口；低代码开发 OAB 业务时的导入优先级（P0 页面壳 / P1 表单等）

-   **[插件与设计器物料导入对接与排障](./插件与设计器物料导入对接与排障.md)** ⭐ 新增

    -   插件 AM 导入 + 静态服务 + 设计器加载的对接链路、成功判定、调试与排障流程

-   **[公共样式与 UnoCSS 导入设计器方案](./公共样式与UnoCSS导入设计器方案.md)**

    -   主工程公共样式（token/主题/覆盖/UnoCSS）作为产物通过插件导入设计器；支持属性面板 `Class Name` 即时生效

-   **[Ionic re-export 策略可行性分析](./Ionic-re-export策略可行性分析.md)**

    -   不用画布桩、纯 re-export 显示 Ionic 组件的可行性；Shadow DOM 与 CSS 变量；建议验证步骤

-   **[组件导入注意事项](./组件导入注意事项.md)** ⭐ 导入/画布桩必读
    -   原子/业务组件导入规则、画布桩约定、**MpMultiAmt / MpTextAmt / MpSingleAmt** 等迁移踩坑与验收清单
    -   表单桩：**先读运行态 padding 清零与否**，再定横向/垂直 inset；OMR 跟 `mp-text-amt` 的 `1em`

-   **[Ionic 组件导入与桩方案](./Ionic组件导入与桩方案.md)**
    -   画布桩、MrLabel/MrButton 的 `children` 与 manifest；**2.6.1**（属性面板 Text 为空）、**2.8**（单独拖入 MrBackButton 时 Default Href 为空）的设计器侧说明与修复要点

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

-   **物料导入** → [物料导入快速参考](./物料导入快速参考.md)
-   **代码提示** → [CODE_COMPLETION_GUIDE.md](./CODE_COMPLETION_GUIDE.md)
-   **国际化** → [I18N_WRAPPER_GUIDE.md](./I18N_WRAPPER_GUIDE.md)
-   **插件开发** → [PLUGIN_MIGRATION.md](./PLUGIN_MIGRATION.md)
-   **VSCode 集成** → [VSCode-Integration.md](./VSCode-Integration.md)

### 按问题查找

-   **发资源 / package.json 命令看懵了？** → [主工程低代码资源操作手册](./主工程低代码资源操作手册.md)
-   **新主工程 / OAB 低代码怎么接、改哪里？** → [主工程低代码集成指南-OAB](./主工程低代码集成指南-OAB.md)
-   **物料如何从主工程导入设计器？** → [物料导入快速参考](./物料导入快速参考.md)
-   **AM 导入后如何判断成功并排障？** → [插件与设计器物料导入对接与排障](./插件与设计器物料导入对接与排障.md)
-   **设计器改造时能否修改 packages？** → [设计器与 packages 边界约定](./设计器与packages边界约定.md)（**不能**，packages 仅作参考）
-   **画布 Class Name 不生效 / 组件无法选中？** → [组件导入注意事项](./组件导入注意事项.md)（**MpTextAmt** 第 F 节：勿写死 color、`v-bind="attrs"`）
-   **金额输入画布相对 Text 缩进 / label 偏小 / OMR 过大？** → [组件导入注意事项](./组件导入注意事项.md)（**MpSingleAmt** 第 F2 节）
-   **如何添加代码提示关键字？** → [CODE_COMPLETION_GUIDE.md](./CODE_COMPLETION_GUIDE.md#三如何添加新关键字)
-   **Page JS 如何用主工程 utils？** → [主工程 utils 工具提示导入思路](./主工程utils工具提示导入思路.md)
-   **Page JS 如何用主工程 store？** → [主工程 store 导入思路](./主工程store导入思路.md)
-   **如何实现国际化？** → [I18N_WRAPPER_GUIDE.md](./I18N_WRAPPER_GUIDE.md)
-   **如何迁移插件？** → [PLUGIN_MIGRATION.md](./PLUGIN_MIGRATION.md)

---

**最后更新**：2026-07-24
