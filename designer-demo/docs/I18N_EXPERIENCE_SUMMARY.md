# TinyEngine 设计器国际化（i18n）经验总结

## 📋 目录

- [概述](#概述)
- [国际化架构](#国际化架构)
- [不同场景的处理方法](#不同场景的处理方法)
- [常见问题与解决方案](#常见问题与解决方案)
- [最佳实践](#最佳实践)
- [调试技巧](#调试技巧)
- [避免的陷阱](#避免的陷阱)
- [维护指南](#维护指南)

---

## 概述

本文档总结了 TinyEngine 设计器在国际化（i18n）实现过程中的经验、教训和最佳实践。涵盖了物料面板、属性面板、事件面板、画布占位符、配置器组件等多个功能模块的国际化处理方案。

### 核心原则

1. **不修改 `packages` 文件夹**：`packages` 目录下的代码是官方源码，仅用于参考，不应直接修改
2. **在 `designer-demo` 中实现**：所有自定义和国际化逻辑应在 `designer-demo/src` 目录下实现
3. **多层级兜底策略**：数据层、显示层都要有翻译逻辑，确保万无一失
4. **精简翻译文本**：考虑显示空间限制，使用简洁明了的英文翻译

---

## 国际化架构

### 1. 翻译服务 (`i18nService.ts`)

**位置**：`designer-demo/src/services/i18nService.ts`

**核心功能**：
- 管理 i18n 实例和语言切换
- 提供 `useDesignerI18n()` 钩子函数
- 统一管理翻译词条

**使用方式**：
```typescript
import { useDesignerI18n } from '@/services/i18nService'

const { t, locale } = useDesignerI18n()
const text = t('designer.toolbar.save')
```

### 2. 翻译词条文件

**位置**：
- `designer-demo/src/i18n/zh-CN.json` - 中文翻译
- `designer-demo/src/i18n/en-US.json` - 英文翻译

**结构示例**：
```json
{
  "designer": {
    "toolbar": {
      "save": "保存"
    },
    "canvas": {
      "dragElementHere": "请将元素拖放到这里"
    },
    "configurators": {
      "htmlAttributes": {
        "headerTitle": "自定义属性",
        "noData": "无数据"
      }
    }
  }
}
```

### 3. 国际化包装组件

**位置**：`designer-demo/src/components/i18n-wrappers/`

**用途**：包装官方组件，替换硬编码的中文字符串

**示例**：`HtmlAttributesConfigurator` 包装组件

---

## 不同场景的处理方法

### 场景 1：物料面板组件名称国际化

#### 问题描述
物料面板中的组件名称显示为中文，需要根据当前语言显示英文名称。

#### 解决方案

**方法 1：在数据加载时添加翻译（推荐）**

**位置**：`designer-demo/src/plugins/materials/composable/useMaterial.ts`

```typescript
const addEnglishNameToSnippet = (snippet: any) => {
    if (!snippet || !snippet.name) return;
    
    if (typeof snippet.name === 'object' && snippet.name.zh_CN) {
        const existingEn = snippet.name.en_US || snippet.name['en-US'] || snippet.name.en;
        
        // 检查现有的 en_US 是否是中文
        const isChinese = (str: string) => {
            if (!str || typeof str !== 'string') return false;
            return /[\u4e00-\u9fa5]/.test(str);
        };
        const needsTranslation = !existingEn || isChinese(existingEn);
        
        if (existingEn && !needsTranslation) {
            return; // 已有有效英文翻译，跳过
        }
        
        // 翻译映射表
        const translations: Record<string, string> = {
            '行列容器': 'Row/Col',
            '弹性容器': 'Flex',
            '全宽居中布局': 'Full Width',
            '栅格布局': 'Grid',
            '搜索框': 'Search',
            // ... 更多翻译
        };
        
        const zhName = snippet.name.zh_CN;
        if (translations[zhName]) {
            snippet.name.en_US = translations[zhName];
        }
    }
};
```

**方法 2：在显示层添加翻译映射（兜底）**

**位置**：`designer-demo/src/plugins/materials/meta/component/src/Main.vue`

```typescript
const getComponentName = (child: any) => {
    const currentLocale = currentLocaleRef.value || i18n?.global?.locale?.value || 'zh_CN';
    
    if (child.name && typeof child.name === 'object') {
        const isEnglish = 
            currentLocale === 'en_US' || 
            currentLocale === 'en-US' || 
            currentLocale === 'en' ||
            String(currentLocale).toLowerCase().startsWith('en');
        
        if (isEnglish) {
            let enName = child.name.en_US || child.name['en-US'] || child.name.en;
            
            // 如果 en_US 不存在或者是中文，从翻译映射表获取
            if (!enName || /[\u4e00-\u9fa5]/.test(enName)) {
                const zhName = child.name.zh_CN;
                if (zhName && TRANSLATION_MAP[zhName]) {
                    enName = TRANSLATION_MAP[zhName];
                    // 动态更新，以便后续使用
                    if (!child.name.en_US || /[\u4e00-\u9fa5]/.test(child.name.en_US)) {
                        child.name.en_US = enName;
                    }
                }
            }
            
            if (enName && !/[\u4e00-\u9fa5]/.test(enName)) {
                return enName;
            }
            return child.name.zh_CN || child.name;
        }
        return child.name.zh_CN || child.name[currentLocale] || child.name;
    }
    return child.name;
};
```

**关键点**：
- 数据层和显示层都要有翻译逻辑
- 检查 `en_US` 是否为中文，避免错误翻译
- 动态更新 `en_US` 字段，提高后续性能

---

### 场景 2：画布占位符文本国际化

#### 问题描述
拖拽容器组件时，占位符文本（如"请将元素拖放到这里"）显示为中文。

#### 解决方案

**步骤 1：添加翻译词条**

在 `designer-demo/src/i18n/zh-CN.json` 和 `en-US.json` 中添加：

```json
{
  "designer": {
    "canvas": {
      "dragElementHere": "请将元素拖放到这里"
    }
  }
}
```

```json
{
  "designer": {
    "canvas": {
      "dragElementHere": "Please drag and drop elements here"
    }
  }
}
```

**步骤 2：修改占位符组件**

**位置**：`packages/canvas/render/src/builtin/CanvasPlaceholder.vue`

**注意**：如果不想修改 `packages`，可以创建包装组件。

```vue
<template>
  <div class="canvas-container">
    <div class="container-box">
      <div class="container-tip">
        <slot>{{ placeholderText }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n'

const props = defineProps<{
  placeholder?: string
}>()

const i18n = inject(I18nInjectionKey, null) as any
const windowI18n = typeof window !== 'undefined' ? (window as any).lowcodeI18n : null

const placeholderText = computed(() => {
  if (props.placeholder) {
    return props.placeholder
  }

  // 尝试从 i18n 获取
  if (i18n?.global?.t) {
    const text = i18n.global.t('designer.canvas.dragElementHere')
    if (text && text !== 'designer.canvas.dragElementHere') {
      return text
    }
  }

  // 回退文本
  const currentLocale = i18n?.global?.locale?.value || windowI18n?.global?.locale?.value || 'zh_CN'
  if (currentLocale === 'en_US' || currentLocale === 'en-US' || currentLocale === 'en') {
    return 'Please drag and drop elements here'
  }
  return '请将元素拖放到这里'
})
</script>
```

**步骤 3：更新文本替换器**

**位置**：`designer-demo/src/composable/setupCanvasI18nRenderer.ts`

```typescript
const textMappings = [
    { chinese: '页面分析加载中', english: analyzingText },
    { chinese: '从左侧面板拖入组件，以构建页面', english: englishText },
    { chinese: '请将元素拖放到这里', english: dragElementText } // 新增
];

const emptyTextElements = doc.querySelectorAll('p.empty-text, .empty-text, .container-tip');
```

---

### 场景 3：配置器组件国际化

#### 问题描述
配置器组件（如 `HtmlAttributesConfigurator`、`VariableConfigurator`）中有硬编码的中文字符串。

#### 解决方案：创建国际化包装组件

**步骤 1：创建包装组件**

**位置**：`designer-demo/src/components/i18n-wrappers/HtmlAttributesConfigurator/index.vue`

```vue
<template>
  <div class="attr-header">
    <span class="header-title">{{ t('designer.configurators.htmlAttributes.headerTitle') }}</span>
    <!-- ... 其他内容 ... -->
    <div v-if="!attrs.length" class="list-item">
      <div class="item-content">{{ t('designer.configurators.htmlAttributes.noData') }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { useDesignerI18n } from '@/services/i18nService'
// ... 其他导入 ...

export default {
  setup() {
    const { t } = useDesignerI18n()
    // ... 其他逻辑 ...
    return {
      t,
      // ... 其他返回值 ...
    }
  }
}
</script>
```

**步骤 2：注册包装组件**

**位置**：`designer-demo/src/configurators/index.ts`

```typescript
import { HtmlAttributesConfigurator } from '@/components/i18n-wrappers'

export const configurators = {
    // ... 其他配置器 ...
    HtmlAttributesConfigurator, // 覆盖官方组件
}
```

**步骤 3：在使用处导入包装组件**

**位置**：`designer-demo/src/settings/events/components/AdvanceConfig.vue`

```typescript
import { VariableConfigurator } from '@/components/i18n-wrappers' // 使用包装组件
```

---

### 场景 4：属性面板标签国际化

#### 问题描述
属性面板中的属性标签（如"Text内容"、"资源"、"原生属性"）显示为中文。

#### 解决方案

**方法 1：修改物料 JSON 文件**

**位置**：`materials/components/Img.json`、`designer-demo/src/components/canvas/render/src/builtin/builtin.json`

```json
{
  "schema": {
    "properties": [
      {
        "content": [
          {
            "property": "text",
            "label": {
              "text": {
                "zh_CN": "文本内容",
                "en_US": "Text Content"
              }
            }
          }
        ]
      }
    ]
  }
}
```

**方法 2：运行翻译脚本**

如果物料文件较多，可以使用翻译脚本批量处理：

```bash
pnpm translate:bundle  # 翻译 bundle.json
pnpm translate:builtin # 翻译 builtin.json
```

**位置**：`scripts/translateBundle.js`、`scripts/translateBuiltin.js`

---

## 常见问题与解决方案

### 问题 1：组件名称显示为中文，但 `en_US` 字段存在

**原因**：
- `en_US` 字段的值是中文（错误翻译）
- 显示层没有正确读取 `en_US` 字段
- 语言检测逻辑有问题

**解决方案**：
1. 检查 `en_US` 字段的值是否为中文
2. 在翻译函数中添加中文检测逻辑
3. 确保显示层正确读取当前语言

```typescript
// 检查 en_US 是否为中文
const isChinese = (str: string) => {
    if (!str || typeof str !== 'string') return false;
    return /[\u4e00-\u9fa5]/.test(str);
};

if (isChinese(existingEn)) {
    // 需要重新翻译
}
```

---

### 问题 2：内置组件无法国际化

**原因**：
- 内置组件来自 `@opentiny/tiny-engine-builtin-component` 包
- 编译后的包文件可能缺少 `en_US` 字段
- 翻译函数没有被正确调用

**解决方案**：
1. **不要修改 `packages` 文件夹**（重要！）
2. 在数据加载时添加翻译逻辑（`useMaterial.ts`）
3. 在显示层添加翻译映射表作为兜底（`Main.vue`）

```typescript
// 在 addComponentSnippets 中处理
snippetGroup.children?.forEach(child => {
    addEnglishNameToSnippet(child);
});

// 在 getComponentName 中添加翻译映射表
const TRANSLATION_MAP: Record<string, string> = {
    '行列容器': 'Row/Col',
    '弹性容器': 'Flex',
    // ...
};
```

---

### 问题 3：翻译文本过长，显示被截断

**原因**：
- 物料面板的显示空间有限
- 英文翻译过长

**解决方案**：
使用精简的英文翻译，保持清晰易懂：

| 原翻译 | 精简后 | 说明 |
|--------|--------|------|
| `Box Container` | `Box` | 容器概念已由上下文体现 |
| `Row/Column Container` | `Row/Col` | 使用缩写 |
| `Full Width Centered Container` | `Full Width` | 保留核心概念 |
| `Search Box` | `Search` | 简化 |
| `Navigation Bar` | `Nav Bar` | 使用常见缩写 |
| `Mutex Button Group` | `Mutex Buttons` | 更简洁 |

**原则**：
- 优先使用常见缩写（Nav、Col、Flex）
- 移除冗余词汇（Container、Box）
- 保持技术术语的准确性

---

### 问题 4：翻译函数没有被调用

**原因**：
- 函数调用时机不对
- 数据结构不符合预期
- 条件判断过于严格

**解决方案**：
1. 添加调试日志确认函数是否被调用
2. 检查数据结构和条件判断
3. 确保在正确的生命周期调用翻译函数

```typescript
// 添加调试日志
snippetGroup.children?.forEach(child => {
    console.log('[i18n] Before translation:', {
        snippetName: child.snippetName,
        name: child.name,
        hasZhCN: child.name?.zh_CN,
        hasEnUS: child.name?.en_US
    });
    
    addEnglishNameToSnippet(child);
    
    console.log('[i18n] After translation:', {
        snippetName: child.snippetName,
        after: child.name?.en_US
    });
});
```

---

## 最佳实践

### 1. 多层级翻译策略

```
数据源（JSON文件）
  ↓
数据加载层（useMaterial.ts）- 添加翻译
  ↓
显示层（Main.vue）- 翻译映射表兜底
  ↓
最终显示
```

**优势**：
- 即使数据源缺少翻译，也能在显示层补充
- 提高容错性和可维护性

---

### 2. 翻译映射表统一管理

**位置**：
- `designer-demo/src/plugins/materials/composable/useMaterial.ts` - 数据层
- `designer-demo/src/plugins/materials/meta/component/src/Main.vue` - 显示层

**建议**：
- 保持两个映射表同步
- 使用相同的翻译值
- 定期检查一致性

---

### 3. 翻译文本精简原则

1. **使用常见缩写**：
   - Navigation → Nav
   - Column → Col
   - Container → (省略)

2. **移除冗余词汇**：
   - Box Container → Box
   - Search Box → Search

3. **保持技术准确性**：
   - Router View（不是 Route View）
   - Mutex Buttons（不是 Exclusive Buttons）

4. **考虑显示空间**：
   - 控制在 10-15 个字符以内
   - 避免使用 "..." 截断

---

### 4. 语言检测逻辑

```typescript
const isEnglish = 
    currentLocale === 'en_US' || 
    currentLocale === 'en-US' || 
    currentLocale === 'en' ||
    String(currentLocale).toLowerCase().startsWith('en');
```

**注意**：
- 支持多种格式（en_US、en-US、en）
- 使用 `toLowerCase()` 处理大小写
- 使用 `startsWith()` 处理变体（如 en_GB）

---

## 调试技巧

### 1. 添加临时调试日志

```typescript
// 在翻译函数中添加
console.log('[i18n] Translation:', {
    zh_CN: snippet.name.zh_CN,
    before: beforeEn,
    after: afterEn,
    snippetName: snippet.snippetName
});

// 在显示函数中添加
console.log('[i18n] Component name issue:', {
    zh_CN: child.name.zh_CN,
    en_US: child.name.en_US,
    enName,
    currentLocale,
    snippetName: child.snippetName
});
```

### 2. 检查数据结构

```typescript
// 检查 name 字段的结构
console.log('name structure:', {
    name: child.name,
    nameType: typeof child.name,
    isObject: typeof child.name === 'object',
    hasZhCN: child.name?.zh_CN,
    hasEnUS: child.name?.en_US
});
```

### 3. 验证翻译映射

```typescript
// 检查翻译映射是否匹配
const zhName = snippet.name.zh_CN;
if (!translations[zhName]) {
    console.warn('[i18n] Missing translation for:', zhName);
}
```

### 4. 浏览器控制台检查

1. 打开浏览器控制台（F12）
2. 切换到英文语言
3. 查看 `[i18n]` 相关的日志
4. 检查组件名称是否正确显示

---

## 避免的陷阱

### ❌ 陷阱 1：修改 `packages` 文件夹

**错误做法**：
```typescript
// 修改 packages/builtinComponent/src/meta/index.js
import CanvasRowColContainer from './CanvasRowColContainer.json' with { type: 'json' }
```

**正确做法**：
- 在 `designer-demo/src` 中实现所有国际化逻辑
- 使用包装组件或翻译映射表
- `packages` 文件夹仅用于参考

---

### ❌ 陷阱 2：只在一个地方添加翻译

**错误做法**：
- 只在数据层添加翻译，显示层没有兜底
- 或只在显示层添加翻译，数据层没有处理

**正确做法**：
- 数据层和显示层都要有翻译逻辑
- 使用多层级兜底策略

---

### ❌ 陷阱 3：翻译文本过长

**错误做法**：
```typescript
'全宽居中容器': 'Full Width Centered Container' // 太长
```

**正确做法**：
```typescript
'全宽居中容器': 'Full Width' // 精简
```

---

### ❌ 陷阱 4：忽略中文检测

**错误做法**：
```typescript
if (!existingEn) {
    // 添加翻译
}
// 如果 existingEn 是中文，不会重新翻译
```

**正确做法**：
```typescript
const isChinese = (str: string) => /[\u4e00-\u9fa5]/.test(str);
const needsTranslation = !existingEn || isChinese(existingEn);

if (needsTranslation) {
    // 添加翻译
}
```

---

### ❌ 陷阱 5：翻译映射表不同步

**错误做法**：
- 数据层和显示层使用不同的翻译值
- 修改一处忘记修改另一处

**正确做法**：
- 保持两个映射表同步
- 使用相同的翻译值
- 定期检查一致性

---

## 维护指南

### 1. 添加新组件翻译

**步骤**：
1. 在 `useMaterial.ts` 的翻译映射表中添加
2. 在 `Main.vue` 的翻译映射表中添加
3. 确保翻译值一致
4. 测试验证

---

### 2. 发现未国际化的内容

**排查流程**：
1. 确认当前语言是否为英文
2. 检查是否有硬编码的中文字符串
3. 检查是否有翻译词条缺失
4. 检查翻译函数是否被调用
5. 添加调试日志定位问题

---

### 3. 更新翻译文本

**步骤**：
1. 修改翻译映射表
2. 同步更新数据层和显示层
3. 刷新浏览器验证
4. 检查是否有其他相关文件需要更新

---

### 4. 性能优化

**建议**：
- 翻译映射表使用 `const` 定义，避免重复创建
- 动态更新 `en_US` 字段，避免重复翻译
- 使用 `computed` 缓存翻译结果

---

## 相关文件清单

### 核心文件
- `designer-demo/src/services/i18nService.ts` - i18n 服务
- `designer-demo/src/i18n/zh-CN.json` - 中文词条
- `designer-demo/src/i18n/en-US.json` - 英文词条

### 物料相关
- `designer-demo/src/plugins/materials/composable/useMaterial.ts` - 物料数据层翻译
- `designer-demo/src/plugins/materials/meta/component/src/Main.vue` - 物料显示层翻译
- `scripts/translateBundle.js` - bundle.json 翻译脚本
- `scripts/translateBuiltin.js` - builtin.json 翻译脚本

### 配置器相关
- `designer-demo/src/components/i18n-wrappers/` - 国际化包装组件
- `designer-demo/src/configurators/index.ts` - 配置器注册

### 画布相关
- `designer-demo/src/composable/setupCanvasI18nRenderer.ts` - 画布文本替换
- `packages/canvas/render/src/builtin/CanvasPlaceholder.vue` - 占位符组件

---

## 总结

国际化是一个需要多层级、多角度考虑的系统工程。通过本文档总结的经验和最佳实践，可以：

1. **快速定位问题**：知道在哪里查找和修复国际化问题
2. **避免常见陷阱**：不修改 `packages` 文件夹，使用多层级兜底策略
3. **提高开发效率**：使用统一的翻译映射表和调试技巧
4. **保持代码质量**：遵循最佳实践，确保翻译文本精简且准确

希望这份文档能帮助后续开发人员更好地理解和维护设计器的国际化功能。

---

## 更新日志

- **2025-01-XX**：初始版本，总结物料面板、属性面板、事件面板、画布占位符、配置器组件的国际化经验

