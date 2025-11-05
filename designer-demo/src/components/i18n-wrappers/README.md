# 国际化包装组件

## 📖 概述

这个目录包含对 `@opentiny/tiny-engine-common` 中含硬编码中文的组件的包装实现。

**主要文档**: 请查看 `designer-demo/I18N_WRAPPER_GUIDE.md` 获取完整指南。

### 为什么需要包装组件？

1. **保持官方依赖更新能力**：不直接修改 node_modules 中的代码
2. **集中管理国际化**：所有文本集中在 i18n 配置文件中
3. **最小化改动**：只包装必要的组件，其他组件保持原样
4. **易于维护**：清晰的目录结构和命名规范

---

## 🗂️ 目录结构

```
i18n-wrappers/
├── README.md                   # 本文档
├── index.ts                    # 统一导出
├── SearchEmpty/                # SearchEmpty 包装
│   └── index.vue
├── PluginPanel/                # PluginPanel 包装
│   └── index.vue
├── PluginSetting/              # PluginSetting 包装
│   └── index.vue
├── LifeCycles/                 # LifeCycles 包装
│   └── index.vue
└── shared/                     # 共享工具
    └── useI18nProps.ts
```

---

## 🚀 使用方法

### 1. 基本使用

```vue
<template>
  <search-empty :isShow="!data.length" />
</template>

<script setup>
// 方式一：从包装组件导入
import { SearchEmpty } from '@/components/i18n-wrappers'

// 方式二：直接导入单个组件
import SearchEmpty from '@/components/i18n-wrappers/SearchEmpty/index.vue'
</script>
```

### 2. 替换现有组件

**替换前：**
```vue
<script>
import { SearchEmpty } from '@opentiny/tiny-engine-common'
</script>
```

**替换后：**
```vue
<script>
import { SearchEmpty } from '@/components/i18n-wrappers'
// 或
import SearchEmpty from '@/components/i18n-wrappers/SearchEmpty/index.vue'
</script>
```

---

## 📝 包装组件清单

### ✅ 已完成

| 组件名 | 状态 | 中文数量 | 复杂度 | 说明 |
|-------|------|---------|--------|-----|
| SearchEmpty | ✅ | 1个 | ⭐ | 最简单的包装示例 |
| PluginPanel | ✅ | 4个 | ⭐⭐⭐ | 面板组件包装 |

### 🚧 待完成

| 组件名 | 优先级 | 中文数量 | 复杂度 | 预计工时 |
|-------|--------|---------|--------|---------|
| LifeCycles | ⭐⭐⭐⭐⭐ | 8个 | ⭐⭐⭐⭐ | 2-3小时 |
| PluginSetting | ⭐⭐⭐⭐ | 4个 | ⭐⭐ | 45分钟 |
| PluginBlockList | ⭐⭐⭐⭐ | 8个 | ⭐⭐⭐⭐ | 2小时 |
| MetaListItems | ⭐⭐ | 4个 | ⭐⭐⭐ | 1小时 |

---

## 🎯 包装原则

### 1. 完全兼容原组件

- **Props**: 保持所有 props 定义不变
- **Emits**: 保持所有事件定义不变
- **Slots**: 保持所有插槽定义不变
- **样式**: 保持所有样式定义不变

### 2. 只替换文本

- 只修改硬编码的中文文本
- 不修改组件逻辑
- 不修改样式

### 3. 使用国际化

```vue
<template>
  <div>{{ t('designer.components.searchEmpty.noData') }}</div>
</template>

<script setup>
import { useDesignerI18n } from '@/services/i18nService'
const { t } = useDesignerI18n()
</script>
```

---

## 📋 国际化 Key 命名规范

```
designer.components.[组件名].[功能].[文本]
```

### 示例：

```typescript
// SearchEmpty 组件
designer.components.searchEmpty.noData

// PluginPanel 组件
designer.components.pluginPanel.expand
designer.components.pluginPanel.collapse
designer.components.pluginPanel.pin
designer.components.pluginPanel.unpin

// LifeCycles 组件
designer.components.lifeCycles.addPageLifecycle
designer.components.lifeCycles.addBlockLifecycle
designer.components.lifeCycles.save
designer.components.lifeCycles.deleteConfirm
```

---

## 🔧 开发指南

### 创建新的包装组件

1. **创建组件目录**
```bash
mkdir -p src/components/i18n-wrappers/ComponentName
```

2. **复制原组件代码**
```bash
# 从 node_modules 复制原组件
cp node_modules/@opentiny/tiny-engine-common/component/ComponentName.vue \
   src/components/i18n-wrappers/ComponentName/index.vue
```

3. **替换硬编码文本**
```vue
<!-- 替换前 -->
<div>暂无数据</div>

<!-- 替换后 -->
<div>{{ t('designer.components.componentName.noData') }}</div>
```

4. **添加国际化支持**
```vue
<script setup>
import { useDesignerI18n } from '@/services/i18nService'
const { t } = useDesignerI18n()
</script>
```

5. **更新导出文件**
```typescript
// src/components/i18n-wrappers/index.ts
export { default as ComponentName } from './ComponentName/index.vue'
```

6. **添加国际化文本**
```json
// src/i18n/components.zh-CN.json
{
  "designer": {
    "components": {
      "componentName": {
        "noData": "暂无数据"
      }
    }
  }
}
```

```json
// src/i18n/components.en-US.json
{
  "designer": {
    "components": {
      "componentName": {
        "noData": "No Data"
      }
    }
  }
}
```

---

## 🧪 测试建议

### 1. 功能测试
- 验证所有 props 正常工作
- 验证所有事件正常触发
- 验证所有插槽正常渲染

### 2. 国际化测试
- 切换到中文，检查文本显示
- 切换到英文，检查文本显示
- 切换到其他语言，检查回退机制

### 3. 兼容性测试
- 在所有使用该组件的地方测试
- 确保替换后无报错
- 确保样式无变化

---

## 📚 相关文档

- [完整分析报告](../../i18n-wrapper-analysis.md)
- [国际化服务](../../services/i18nService.ts)
- [国际化配置](../../i18n/components.zh-CN.json)

---

## ❓ 常见问题

### Q: 为什么不直接修改官方组件？
A: 为了保持依赖的可更新性。使用包装模式可以在不修改官方代码的情况下实现国际化。

### Q: 包装组件性能如何？
A: 包装组件只是简单的透传，性能影响可以忽略不计。

### Q: 如何处理样式？
A: 直接复制原组件的样式，不做任何修改。

### Q: 如果官方组件更新了怎么办？
A: 1) 检查更新内容 2) 如果只是功能更新，无需改动 3) 如果文本有变化，同步更新包装组件

---

## 📝 更新日志

### 2025-11-05
- ✅ 创建项目结构
- ✅ 完成 SearchEmpty 包装组件
- ✅ 完成 PluginPanel 包装组件
- ✅ 创建国际化配置文件
- ✅ 编写文档

