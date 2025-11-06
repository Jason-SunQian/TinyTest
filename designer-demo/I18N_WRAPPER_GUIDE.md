# 组件包装器国际化方案指南

## 📖 方案概述

通过创建包装组件的方式，将 `@opentiny/tiny-engine-common` 中含硬编码中文的组件进行国际化，**不修改官方依赖代码**，保持版本更新能力。

---

## ✅ 已完成成果

### 包装的组件（5个）

| 组件 | 中文数量 | 主要功能 | 效果 |
|------|---------|---------|------|
| SearchEmpty | 1处 | 空数据提示 | "暂无数据" → "No Data" |
| LifeCycles | 8处 | 生命周期管理 | "添加页面生命周期" → "Add Page Lifecycle" |
| BlockHistoryList | 8处 | 历史记录列表 | 表头和按钮全部国际化 |
| LinkButton | 1处 | 帮助链接 | "查看详情" → "View Details" |
| PluginPanel | 4处 | 插件面板 | Tooltip 完全国际化 |

### 迁移的 Toolbar 组件（2个）

| 组件 | 位置 | 主要功能 | 硬编码数量 | 解决问题 |
|------|------|---------|-----------|---------|
| Breadcrumb | toolbars | 面包屑导航 | 2处 | 响应式国际化 + SessionStorage 同步 |
| Clean | toolbars | 清除屏幕 | 3处 | 按钮文字 + 确认弹窗国际化 |

### 迁移的 Settings 组件（1个）

| 组件 | 位置 | 主要功能 | 硬编码数量 | 解决问题 |
|------|------|---------|-----------|---------|
| Props | settings | 属性设置面板 | 3处 | 面板标题 + 空状态提示国际化 |

### 已替换文件（14个）

**PluginPanel**（10个插件）:
- Page, Block, State, Schema, Script
- Bridge, Datasource, I18n, Materials, OutlineTree

**其他组件**（4个）:
- BridgeManage.vue（SearchEmpty）
- PageSetting.vue（LifeCycles）
- PageHistory.vue（BlockHistoryList）
- Page/Main.vue（PluginPanel）

**总计**: 25+ 处中文已国际化

---

## 📂 文件结构

```
designer-demo/
├── registry.ts                              # 覆盖配置 + 注册自定义组件
├── vite.config.ts                           # 添加 @ 别名配置
│
└── src/
    ├── i18n/
    │   ├── components.zh-CN.json            # 组件中文翻译
    │   ├── components.en-US.json            # 组件英文翻译
    │   └── index.ts                         # 合并配置
    │
    ├── components/i18n-wrappers/
    │   ├── README.md                        # 组件使用文档
    │   ├── index.ts                         # 统一导出
    │   ├── SearchEmpty/index.vue
    │   ├── LifeCycles/index.vue
    │   ├── BlockHistoryList/index.vue
    │   ├── LinkButton/index.vue
    │   └── PluginPanel/index.vue
    │
    ├── toolbars/
    │   ├── breadcrumb/
    │   │   ├── Main.vue                     # 面包屑主组件
    │   │   └── composable/
    │   │       └── useBreadcrumb.ts         # 响应式 Composable
    │   └── clean/
    │       └── Main.vue                     # 清除屏幕组件
    │
    └── settings/
        └── props/
            ├── Main.vue                     # 属性设置面板
            └── components/
                ├── Empty.vue                # 空状态组件
                └── index.ts                 # 组件导出
```

---

## 🚀 使用方法

### 导入包装组件

```vue
<script setup>
// 方式1: 从统一入口导入
import { SearchEmpty, PluginPanel, LifeCycles } from '@/components/i18n-wrappers'

// 方式2: 单独导入
import SearchEmpty from '@/components/i18n-wrappers/SearchEmpty/index.vue'
</script>
```

### 使用示例

```vue
<template>
  <!-- SearchEmpty -->
  <search-empty :isShow="!data.length" />
  
  <!-- LifeCycles -->
  <life-cycles 
    :bindLifeCycles="lifecycles"
    @updatePageLifeCycles="update"
  />
  
  <!-- PluginPanel -->
  <plugin-panel
    :title="title"
    :fixedName="fixedName"
    :docsContent="docsContent"
    @close="handleClose"
  >
    <template #content>
      <!-- 内容 -->
    </template>
  </plugin-panel>
</template>
```

---

## 🔧 核心技术要点

### 1. Vite 别名配置

**vite.config.ts**:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src')
  }
}
```

### 2. 依赖导入策略

**从包入口导入**（推荐）:
```javascript
import { MetaListItems, VueMonaco, SvgButton } from '@opentiny/tiny-engine-common'
```

**避免相对路径**:
```javascript
// ❌ 错误
import MetaListItems from './MetaListItems.vue'

// ✅ 正确
import { MetaListItems } from '@opentiny/tiny-engine-common'
```

### 3. 响应式国际化

**错误方式**:
```javascript
const docsContent = t('designer.page.docs')  // ❌ 不会响应语言切换
```

**正确方式**:
```javascript
const docsContent = computed(() => t('designer.page.docs'))  // ✅ 响应式
```

### 4. 覆盖官方配置

**registry.ts**:
```typescript
'engine.config': {
  ...engineConfig,
  lifeCycleTips: {
    Vue: ''  // 隐藏硬编码的中文提示
  }
}
```

---

## 📋 国际化 Key 命名规范

```
designer.components.[组件名].[功能]
designer.common.[通用文本]
```

**示例**:
```
designer.components.lifeCycles.addPageLifecycle
designer.components.searchEmpty.noData
designer.common.viewDetails
```

---

## ⚠️ 注意事项

### 1. 只包装有视觉效果的组件
- ✅ 界面上能直接看到的中文
- ❌ 不要包装看不到效果的组件

### 2. 仔细处理依赖关系
- ✅ 所有依赖从包入口导入
- ❌ 避免相对路径导入

### 3. 使用 computed 确保响应式
- ✅ docsContent = computed(() => t(...))
- ❌ docsContent = t(...)

---

## �� 常见问题

### Q1: "Cannot find module '@/components/...'"
**A**: 检查 vite.config.ts 中是否配置了 alias

### Q2: 显示 "designer.xxx.xxx" key 本身
**A**: 检查国际化配置文件中是否有该 key

### Q3: 切换语言后文本不更新
**A**: 确保使用 `computed(() => t(...))`

### Q4: "computed is not defined"
**A**: 在文件顶部导入：`import { computed } from 'vue'`

---

## 📊 效果展示

### 英文环境
- "添加页面生命周期" → **"Add Page Lifecycle"**
- "暂无数据" → **"No Data"**
- "查看详情" → **"View Details"**
- Tooltip 主文字 → **英文描述**

### 中文环境
- 所有文本保持中文
- 切换语言实时更新

---

## 🎯 方案优势

1. ✅ **不修改官方依赖** - 保持更新能力
2. ✅ **完全兼容** - API 100% 兼容原组件
3. ✅ **效果直观** - 用户立即能看到变化
4. ✅ **易于维护** - 集中管理国际化文本
5. ✅ **可扩展** - 新增组件成本低

---

## 📞 获取帮助

- **组件文档**: `src/components/i18n-wrappers/README.md`
- **问题反馈**: 查看 Console 错误信息

---

**创建时间**: 2025-11-05  
**版本**: v1.0  
**状态**: ✅ 已完成并验证

---

## 🔥 Toolbar 组件迁移：面包屑

### 为什么要迁移面包屑？

**问题**:
- 官方面包屑使用 `inject(I18nInjectionKey)` 在 `computed` 内部
- 语言切换时，i18n 对象不会自动更新
- SessionStorage 缓存导致刷新后文本不一致

**解决方案**: 完整迁移到 `designer-demo`

### 核心改进

**1. 响应式 i18n**
```typescript
// ❌ 官方版本（不响应）
const CONSTANTS = computed(() => {
  const i18n = inject(I18nInjectionKey)
  const t = i18n?.global?.t || ((key) => key)
  return {
    PAGETEXT: t('designer.toolbar.page'),
    BLOCKTEXT: t('designer.leftPanel.blockManagement')
  }
})

// ✅ 迁移版本（完全响应）
const { t, locale } = useDesignerI18n()
const CONSTANTS = computed(() => ({
  PAGETEXT: t('designer.components.breadcrumb.page'),
  BLOCKTEXT: t('designer.components.breadcrumb.block')
}))
```

**2. 监听语言切换**
```typescript
watch(locale, () => {
  // 自动更新 SessionStorage 中的面包屑数据
  const pageInfo = sessionStorage.getItem('pageInfo')
  if (pageInfo) {
    breadcrumbData.value = [CONSTANTS.value.PAGETEXT, ...JSON.parse(pageInfo)]
  }
})
```

**3. Registry 注册**
```typescript
// registry.ts
import CustomBreadcrumb from './src/toolbars/breadcrumb/Main.vue'

export default {
  [META_APP.Breadcrumb]: {
    id: 'engine.toolbars.breadcrumb.custom',
    title: 'Breadcrumb',
    icon: 'breadcrumb',
    entry: CustomBreadcrumb
  }
}
```

### 效果

✅ 切换语言，面包屑立即更新  
✅ 刷新页面，面包屑显示当前语言  
✅ 进入页面/区块，面包屑正确显示

---

## 🧹 Toolbar 组件迁移：清除屏幕

### 硬编码文字位置

**官方组件中的3处硬编码**：
1. **按钮文字**：`content="清除屏幕"`
2. **弹窗标题**：`title: '提示'`
3. **确认消息**：`您确定要清除屏幕吗？`

### 国际化改造

**改造前**（官方版本）：
```vue
<toolbar-base content="清除屏幕" ... />

confirm({
  title: '提示',
  message: () => <span>您确定要清除屏幕吗？</span>
})
```

**改造后**（自定义版本）：
```vue
<toolbar-base :content="t('designer.toolbar.clean')" ... />

confirm({
  title: t('designer.common.tip'),
  message: () => <span>{t('designer.toolbar.cleanConfirm')}</span>
})
```

### 翻译配置

**zh-CN.json**:
```json
{
  "toolbar": {
    "clean": "清除屏幕",
    "cleanConfirm": "您确定要清除屏幕吗？"
  }
}
```

**en-US.json**:
```json
{
  "toolbar": {
    "clean": "Clear Screen",
    "cleanConfirm": "Are you sure you want to clear the screen?"
  }
}
```

### 效果

- **中文环境**: 按钮显示"清除屏幕"，弹窗显示"您确定要清除屏幕吗？"
- **英文环境**: 按钮显示"Clear Screen"，弹窗显示"Are you sure you want to clear the screen?"

