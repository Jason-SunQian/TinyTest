# 属性设置面板

## 📖 概述

从 `@opentiny/tiny-engine-settings/props` 迁移的属性设置面板，支持完整的国际化。

## 🎯 硬编码问题

**官方组件的3处硬编码**：
1. 面板标题：`title="属性"`
2. 空状态提示1：`"您还未拖拽组件至画布中"`
3. 空状态提示2：`"请在画布中选择组件"`

## ✅ 国际化改造

### Main.vue

**改造前**：
```vue
<plugin-panel title="属性" ... />
```

**改造后**：
```vue
<plugin-panel :title="t('designer.settings.props.title')" ... />
```

### Empty.vue

**改造前**：
```javascript
const EMPTY_COMPONENT = '您还未拖拽组件至画布中'
const EMPTY_SELECTION = '请在画布中选择组件'
```

**改造后**：
```javascript
const tipsDesc = ref(t('designer.settings.props.emptyComponent'))

watch(() => getSchema()?.children?.length, (len) => {
  tipsDesc.value = len 
    ? t('designer.settings.props.emptySelection') 
    : t('designer.settings.props.emptyComponent')
})
```

## 🌐 翻译配置

### zh-CN.json
```json
{
  "settings": {
    "props": {
      "title": "属性",
      "emptyComponent": "您还未拖拽组件至画布中",
      "emptySelection": "请在画布中选择组件"
    }
  }
}
```

### en-US.json
```json
{
  "settings": {
    "props": {
      "title": "Properties",
      "emptyComponent": "You haven't dragged any components to the canvas yet",
      "emptySelection": "Please select a component on the canvas"
    }
  }
}
```

## 🔧 注册配置

### registry.ts

```typescript
import CustomProps from './src/settings/props/Main.vue'

export default {
  'engine.setting.props': {
    id: 'engine.setting.props.custom',
    title: 'Properties',
    type: 'plugins',
    name: 'props',
    icon: 'form',
    entry: CustomProps
  }
}
```

## ✨ 效果

### 中文环境
- 面板标题：**属性**
- 空画布提示：**您还未拖拽组件至画布中**
- 选择提示：**请在画布中选择组件**

### 英文环境
- 面板标题：**Properties**
- 空画布提示：**You haven't dragged any components to the canvas yet**
- 选择提示：**Please select a component on the canvas**

---

**创建时间**: 2025-11-06  
**状态**: ✅ 已完成

