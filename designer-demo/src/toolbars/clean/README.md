# 自定义清除屏幕组件

## 📖 概述

从 `@opentiny/tiny-engine-toolbars` 迁移的清除屏幕工具栏组件，支持完整的国际化。

## 🎯 硬编码问题

**官方组件的3处硬编码**：
1. 按钮文字：`"清除屏幕"`
2. 弹窗标题：`"提示"`
3. 确认消息：`"您确定要清除屏幕吗？"`

## ✅ 国际化改造

### 代码对比

**改造前**：
```vue
<toolbar-base content="清除屏幕" ... />

confirm({
  title: '提示',
  message: () => <span>您确定要清除屏幕吗？</span>
})
```

**改造后**：
```vue
<toolbar-base :content="t('designer.toolbar.clean')" ... />

confirm({
  title: t('designer.common.tip'),
  message: () => <span>{t('designer.toolbar.cleanConfirm')}</span>
})
```

### 翻译配置

| Key | 中文 | 英文 |
|-----|------|------|
| `designer.toolbar.clean` | 清除屏幕 | Clear Screen |
| `designer.common.tip` | 提示 | Tip |
| `designer.toolbar.cleanConfirm` | 您确定要清除屏幕吗？ | Are you sure you want to clear the screen? |

## 🔧 注册配置

### registry.ts

```typescript
import CustomClean from './src/toolbars/clean/Main.vue'

export default {
  [META_APP.Clean]: {
    id: 'engine.toolbars.clean.custom',
    title: 'Clean',
    icon: 'clean',
    entry: CustomClean
  }
}
```

## ✨ 效果

### 中文环境
- 按钮：**清除屏幕**
- 弹窗：**提示** - 您确定要清除屏幕吗？

### 英文环境
- 按钮：**Clear Screen**
- 弹窗：**Tip** - Are you sure you want to clear the screen?

---

**创建时间**: 2025-11-06  
**状态**: ✅ 已完成

