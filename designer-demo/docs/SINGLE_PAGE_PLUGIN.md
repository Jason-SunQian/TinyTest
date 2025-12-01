# SinglePage 插件文档

## 概述

`singlePage` 插件是一个简化版的页面管理插件，基于原有的 `page` 插件改造而来。它的主要特点是只管理当前页面，不显示页面列表、不提供新建文件夹和新建页面功能，直接展示当前页面的设置内容。

## 创建背景

原有的 `page` 插件功能完整，包含：
- 左侧页面树（显示静态页面和公共页面）
- 页面设置面板
- 文件夹管理功能
- 新建页面/文件夹功能

但在某些场景下，我们只需要管理当前页面，不需要查看页面列表或创建新页面。因此创建了 `singlePage` 插件来满足这个需求。

## 文件结构

```
designer-demo/src/plugins/singlePage/
├── Main.vue                    # 插件主入口，使用 PluginPanel 作为容器
├── PageSettingContent.vue      # 页面设置内容组件（从 PageSetting 提取）
├── PageSetting.vue             # 保留原 PageSetting（用于兼容）
├── PageGeneral.vue             # 页面基本设置组件
├── PageInputOutput.vue         # 输入输出配置组件
├── PageHistory.vue             # 历史备份组件（已隐藏）
├── PageFolderSetting.vue       # 文件夹设置组件（未使用）
├── PageTree.vue                # 页面树组件（未使用）
├── Tree.vue                    # 树组件（未使用）
├── LayerLines.vue              # 图层线条组件
├── meta.ts                     # 插件元数据配置
├── http.ts                     # HTTP 请求封装
├── composable/
│   ├── index.ts                # 导出 PageService
│   └── usePage.ts              # 页面服务逻辑（复用自 page 插件）
├── mcp/
│   └── tools/                  # MCP 工具函数
└── styles/
    └── vars.less               # 样式变量
```

## 核心功能

### 1. 自动加载当前页面

插件打开时自动获取当前页面ID，如果存在则加载页面详情，如果不存在则自动创建一个空页面。

```typescript
// Main.vue
const loadCurrentPage = async () => {
  const pageId = getCurrentPageId()
  
  if (pageId) {
    // 有页面ID，加载页面详情
    const pageDetail = await fetchPageDetail(pageId)
    initCurrentPageData(pageDetail)
  } else {
    // 没有页面ID，创建新页面
    createEmptyPage()
  }
}
```

### 2. 使用 PluginPanel 作为主容器

与其他插件（如 Materials、BlockManage）保持一致，使用 `PluginPanel` 作为主面板容器，确保面板能够紧贴左侧菜单栏。

```vue
<template>
  <plugin-panel
    :title="t('designer.page.title')"
    :fixed-name="'engine.plugins.singlePage'"
    :fixedPanels="fixedPanels"
    @close="pluginPanelClosed"
  >
    <template #content>
      <page-setting-content :isFolder="false"></page-setting-content>
    </template>
  </plugin-panel>
</template>
```

### 3. 简化的设置面板

`PageSettingContent.vue` 从 `PageSetting.vue` 提取了核心内容，去掉了 `PluginSetting` 包装，直接放在 `PluginPanel` 的 content 中。

## 与 page 插件的区别

| 功能 | page 插件 | singlePage 插件 |
|------|----------|----------------|
| 页面树 | ✅ 显示 | ❌ 不显示 |
| 文件夹管理 | ✅ 支持 | ❌ 不支持 |
| 新建页面 | ✅ 支持 | ❌ 不支持（自动创建） |
| 新建文件夹 | ✅ 支持 | ❌ 不支持 |
| 页面设置 | ✅ 二级面板 | ✅ 主面板内容 |
| 历史备份 | ✅ 显示 | ❌ 已隐藏 |
| 页面类型选择 | ✅ 显示 | ❌ 已隐藏 |
| 顶部操作按钮 | ✅ 显示 | ❌ 已隐藏 |

## 已隐藏的功能

以下功能在 `singlePage` 插件中已被隐藏（使用注释标记，方便后续恢复）：

### 1. 顶部操作按钮

位置：`PageSettingContent.vue` 第 3-15 行

```vue
<!-- 暂时隐藏顶部操作按钮 -->
<!-- <div class="page-setting-header-actions">
  <button-group>
    <tiny-button type="primary" @click="savePageSetting">保存</tiny-button>
    <svg-button name="text-copy-page" @click="copyPage"></svg-button>
    <svg-button name="delete" @click="deletePage"></svg-button>
  </button-group>
</div> -->
```

### 2. 页面类型选择

位置：`PageGeneral.vue` 第 14-21 行

```vue
<!-- 暂时隐藏页面类型选择 -->
<!-- <tiny-form-item prop="group" :label="t('designer.page.pageType')">
  <tiny-radio v-model="pageSettingState.currentPageData.group" label="staticPages">
    {{ t('designer.page.staticPages') }}
  </tiny-radio>
  <tiny-radio v-model="pageSettingState.currentPageData.group" label="publicPages">
    {{ t('designer.page.publicPages') }}
  </tiny-radio>
</tiny-form-item> -->
```

### 3. 历史备份

位置：`PageSettingContent.vue` 第 45-47 行

```vue
<!-- 暂时隐藏历史备份 -->
<!-- <tiny-collapse-item class="history-source" :title="t('designer.page.historyBackup')">
  <page-history @restorePage="restorePage"></page-history>
</tiny-collapse-item> -->
```

## 注册配置

在 `registry.ts` 中注册插件：

```typescript
import SinglePage, { api as SinglePageApi } from './src/plugins/singlePage/Main.vue'
import { PageService as SinglePageService } from './src/plugins/singlePage/composable/index'
import SinglePageGeneral from './src/plugins/singlePage/PageGeneral.vue'
import singlePageMcp from './src/plugins/singlePage/mcp'

// 注册 singlePage 插件
'engine.plugins.singlePage': {
  id: 'engine.plugins.singlePage',
  title: 'Page',
  type: 'plugins',
  icon: 'plugin-icon-page',
  entry: SinglePage,
  apis: SinglePageApi,
  options: {
    pageBaseStyle: {
      className: 'page-base-style',
      style: 'padding: 24px;background: #FFFFFF;'
    }
  },
  components: {
    PageGeneral: SinglePageGeneral
  },
  metas: [SinglePageService],
  mcp: singlePageMcp
}
```

在 `layoutConfig` 中配置插件位置：

```typescript
layoutConfig: {
  plugins: {
    left: {
      top: [
        // ...
        'engine.plugins.singlePage',  // 替换原来的 'engine.plugins.customAppManage'
        // ...
      ]
    }
  }
}
```

## 切换回原 page 插件

如果需要切换回原来的 `page` 插件，只需在 `registry.ts` 的 `layoutConfig` 中将 `'engine.plugins.singlePage'` 改回 `'engine.plugins.customAppManage'` 即可。

原 `page` 插件代码保留在 `designer-demo/src/plugins/page/` 目录中，未做任何修改。

## 技术要点

### 1. 面板定位

使用 `PluginPanel` 组件确保面板紧贴左侧菜单栏（40px），与其他插件保持一致。

### 2. 自动页面创建

当没有当前页面时，自动创建一个空页面，确保用户始终可以编辑页面。

### 3. 页面切换监听

监听页面ID变化，自动加载新页面的设置内容。

```typescript
watch(
  () => getCurrentPageId(),
  (newPageId, oldPageId) => {
    if (newPageId && newPageId !== oldPageId) {
      loadCurrentPage()
    }
  }
)
```

## 维护注意事项

1. **保留原 page 插件代码**：原 `page` 插件代码未做修改，保留在 `designer-demo/src/plugins/page/` 目录中，方便后续切换。

2. **隐藏功能的恢复**：已隐藏的功能使用注释标记，如需恢复，取消注释即可。

3. **组件复用**：`singlePage` 插件复用了 `page` 插件的多个组件（如 `PageGeneral`、`PageInputOutput` 等），修改这些组件时需要注意是否影响 `page` 插件。

4. **国际化**：所有文本都使用 `useDesignerI18n` 进行国际化，确保多语言支持。

## 未来改进方向

1. 考虑将隐藏的功能通过配置项控制，而不是直接注释代码
2. 优化自动创建页面的逻辑，支持自定义默认页面配置
3. 考虑添加页面切换功能（虽然当前只管理单个页面）

## 相关文件

- `designer-demo/src/plugins/page/` - 原 page 插件（未修改）
- `designer-demo/src/plugins/singlePage/` - singlePage 插件
- `designer-demo/registry.ts` - 插件注册配置
- `designer-demo/src/composable/pageStatusGuard.ts` - 页面状态守卫（相关功能）

## 更新日志

### 2025-01-XX
- 创建 singlePage 插件
- 基于 page 插件复制并简化
- 使用 PluginPanel 作为主容器
- 隐藏顶部操作按钮、页面类型选择、历史备份功能
- 实现自动加载当前页面功能

