# 自定义面包屑组件

## 📖 概述

这是从 `@opentiny/tiny-engine-toolbars` 迁移而来的面包屑组件，针对国际化进行了完整优化。

## 🎯 为什么要迁移？

### 原组件问题

1. **i18n 不响应**: 在 `computed` 内部使用 `inject(I18nInjectionKey)`，语言切换时不会自动更新
2. **SessionStorage 缓存**: 缓存的是翻译后的文本，刷新后显示旧语言的文本
3. **无法自定义**: 位于官方依赖中，无法修改逻辑

### 迁移版本优势

✅ **完全响应式**: 使用 `useDesignerI18n()`，语言切换立即生效  
✅ **智能缓存**: 监听 `locale` 变化，自动更新面包屑文本  
✅ **易于维护**: 代码在本地，可以随时调整  

---

## 📂 文件结构

```
breadcrumb/
├── Main.vue                    # 主组件
├── composable/
│   └── useBreadcrumb.ts       # 响应式 Composable
└── README.md                   # 本文档
```

---

## 🚀 核心实现

### useBreadcrumb.ts

```typescript
import { ref, computed, watch } from 'vue'
import { useDesignerI18n } from '@/services/i18nService'

const { t, locale } = useDesignerI18n()

// 响应式常量
const CONSTANTS = computed(() => ({
  PAGETEXT: t('designer.components.breadcrumb.page'),
  BLOCKTEXT: t('designer.components.breadcrumb.block')
}))

// 监听语言切换
watch(locale, () => {
  // 自动更新面包屑
  const pageInfo = sessionStorage.getItem('pageInfo')
  if (pageInfo) {
    breadcrumbData.value = [CONSTANTS.value.PAGETEXT, ...JSON.parse(pageInfo)]
  }
})
```

---

## 🔧 注册配置

### registry.ts

```typescript
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

---

## 🌐 国际化配置

### components.zh-CN.json
```json
{
  "designer": {
    "components": {
      "breadcrumb": {
        "page": "页面",
        "block": "区块"
      }
    }
  }
}
```

### components.en-US.json
```json
{
  "designer": {
    "components": {
      "breadcrumb": {
        "page": "Page",
        "block": "Block"
      }
    }
  }
}
```

---

## ✨ 特性

### 1. 响应式国际化

```typescript
// ❌ 不响应（官方版本）
const text = t('key')

// ✅ 响应式（迁移版本）
const text = computed(() => t('key'))
```

### 2. 智能 SessionStorage

```typescript
// 保存时使用 JSON.stringify
sessionStorage.setItem('pageInfo', JSON.stringify(value))

// 读取时兼容旧版本
try {
  const value = JSON.parse(pageInfo)
} catch (e) {
  // 兼容旧版本直接存字符串的情况
  const value = pageInfo
}
```

### 3. 自动更新

- 切换语言 → 面包屑立即更新
- 刷新页面 → 根据当前语言显示
- 进入页面/区块 → 正确显示对应文本

---

## 🎨 效果展示

### 中文环境
```
页面：CreateVm
区块：MyBlock
```

### 英文环境
```
Page: CreateVm
Block: MyBlock
```

---

## 📝 注意事项

1. **依赖 useDesignerI18n**: 确保 `i18nService.ts` 正确配置
2. **SessionStorage 格式**: 新版本使用 JSON 格式，向下兼容字符串格式
3. **响应式 CONSTANTS**: 必须通过 `.value` 访问

---

## 🐛 调试

### 检查 SessionStorage

```javascript
// 开发者工具 Console
sessionStorage.getItem('pageInfo')
sessionStorage.getItem('blockInfo')
```

### 检查当前语言

```javascript
// 开发者工具 Console
import { useDesignerI18n } from '@/services/i18nService'
const { locale } = useDesignerI18n()
console.log(locale.value)
```

---

**创建时间**: 2025-11-06  
**状态**: ✅ 已完成并验证

