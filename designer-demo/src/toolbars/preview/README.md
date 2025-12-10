# 自定义预览组件

## 📖 概述

这是从 `@opentiny/tiny-engine-toolbars` 迁移而来的预览组件，针对国际化进行了完整优化，并集成了 VSCode 插件支持。

## 🎯 为什么要迁移？

### 原组件问题

1. **无法自定义**: 位于官方依赖中，无法修改逻辑
2. **VSCode 集成不完善**: 需要更好的 VSCode 环境支持
3. **国际化不统一**: 需要与设计器的国际化系统保持一致

### 迁移版本优势

✅ **完全可定制**: 代码在本地，可以随时调整  
✅ **VSCode 集成**: 支持通过 `goPreview` 在 VSCode 环境中预览  
✅ **统一国际化**: 使用 `useDesignerI18n()` 统一管理翻译  
✅ **向后兼容**: 非 VSCode 环境仍使用原有的 `previewPage` 方式

---

## 📂 文件结构

```
preview/
├── Main.vue                    # 主组件
└── README.md                   # 本文档
```

---

## 🚀 核心实现

### Main.vue

```typescript
import { useDesignerI18n } from '../../services/i18nService';
import { goPreview } from '../../composable/useVSCodeBridge';

// VSCode 环境下，使用 goPreview 由插件发起预览
if (isVsCodeEnv) {
    goPreview((success, error) => {
        if (!success) {
            useNotify({
                type: 'error',
                message: error?.message || t('designer.vscode.previewFailed')
            });
        }
    });
    return;
}

// 非 VSCode 环境，使用原有预览方式
previewPage();
```

---

## 🔧 注册配置

### registry.ts

```typescript
import CustomPreview from './src/toolbars/preview/Main.vue';

export default {
    // 禁用官方Preview插件
    [META_APP.Preview]: false,
    // 使用自定义Preview插件
    'engine.toolbars.customPreview': {
        id: 'engine.toolbars.preview',
        title: 'Preview',
        icon: 'preview',
        entry: CustomPreview,
        options: {
            icon: {
                default: 'preview'
            },
            renderType: 'icon',
            previewUrl: ''
        }
    }
};
```

---

## 🌐 国际化配置

### zh-CN.json / en-US.json

```json
{
    "designer": {
        "toolbar": {
            "preview": "预览" // 或 "Preview"
        },
        "vscode": {
            "previewFailed": "预览失败" // 或 "Preview failed"
        },
        "common": {
            "createPageFirst": "请先创建页面" // 或 "Please create a page first"
        }
    }
}
```

---

## ✨ 特性

### 1. VSCode 环境支持

-   **VSCode 环境**: 使用 `goPreview` 由插件发起预览
-   **浏览器环境**: 使用原有的 `previewPage` 函数

### 2. 统一的国际化

```typescript
// ✅ 使用统一的国际化钩子
const { t } = useDesignerI18n();
const previewText = t('designer.toolbar.preview');
```

### 3. 生命周期钩子支持

支持 `beforePreview`、`previewMethod`、`afterPreview` 等配置选项：

```typescript
const { beforePreview, previewMethod, afterPreview } = getOptions(
    'engine.toolbars.preview'
);
```

---

## 📝 注意事项

1. **依赖 useDesignerI18n**: 确保 `i18nService.ts` 正确配置
2. **VSCode Bridge**: 确保 `useVSCodeBridge.ts` 中的 `goPreview` 方法可用
3. **环境检测**: 使用 `isVsCodeEnv` 自动检测运行环境

---

## 🐛 调试

### 检查 VSCode 环境

```javascript
// 开发者工具 Console
import { isVsCodeEnv } from '@opentiny/tiny-engine-common/js/environments';
console.log('Is VSCode:', isVsCodeEnv);
```

### 检查预览功能

```javascript
// 开发者工具 Console
import { goPreview } from '@/composable/useVSCodeBridge';
goPreview((success, error) => {
    console.log('Preview result:', success, error);
});
```

---

**创建时间**: 2025-01-XX  
**状态**: ✅ 已完成并验证
