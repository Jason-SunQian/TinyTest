# 代码提示功能扩展指南

## 一、功能概述

代码提示功能为设计器中的 Monaco Editor 提供了智能代码补全能力，帮助开发者在编写页面 JS、生命周期函数、变量表达式等代码时，能够快速输入常用的 Lowcode API。

### 1.1 功能特点

-   ✅ **智能提示**：输入 `this.` 时自动显示可用的 API 列表
-   ✅ **项目特定关键字**：支持添加项目特定的关键字（如 `this.http`, `this.router`）
-   ✅ **动态工具方法**：自动读取 Bridge 插件中创建的工具方法（`this.utils.xxx`, `this.bridge.xxx`）
-   ✅ **配置化管理**：通过配置文件轻松添加和修改关键字
-   ✅ **不修改 packages**：所有扩展都在 `designer-demo` 目录下，不影响核心代码

### 1.2 支持的提示类型

1. **内置 API 提示**：`this.state`, `this.props`, `this.emit`, `this.http`, `this.router` 等
2. **动态工具方法提示**：`this.utils.xxx`, `this.bridge.xxx`, `this.dataSourceMap.xxx.load()` 等
3. **代码片段提示**：函数模板等

## 二、架构设计

### 2.1 设计思路

为了在不修改 `packages` 目录下核心代码的前提下扩展代码提示功能，我们采用了**覆盖扩展**的方式：

1. **自定义实现**：在 `designer-demo/src/composable/completion.ts` 中创建自定义的代码提示实现
2. **配置分离**：将关键字配置独立到 `designer-demo/src/config/completion-keywords.ts`
3. **统一替换**：将所有使用原始 `initCompletion` 的地方替换为自定义版本

### 2.2 文件结构

```
designer-demo/
├── src/
│   ├── composable/
│   │   └── completion.ts              # 自定义代码提示实现（核心逻辑）
│   ├── config/
│   │   └── completion-keywords.ts     # 关键字配置文件（扩展点）
│   └── plugins/
│       └── script/
│           └── Main.vue              # Script 插件（已使用自定义 completion）
```

### 2.3 核心文件说明

#### `completion.ts` - 代码提示核心实现

**位置**：`designer-demo/src/composable/completion.ts`

**职责**：

-   实现 Monaco Editor 的代码提示逻辑
-   读取配置文件中的关键字
-   从 `appSchemaState` 中读取动态工具方法
-   生成代码提示建议列表

**关键函数**：

-   `initCompletion()`: 初始化代码提示提供者
-   `getApiSuggestions()`: 生成内置 API 提示
-   `getUserSuggestions()`: 生成动态工具方法提示
-   `getSnippetsSuggestions()`: 生成代码片段提示

#### `completion-keywords.ts` - 关键字配置

**位置**：`designer-demo/src/config/completion-keywords.ts`

**职责**：

-   定义项目特定的关键字列表
-   提供关键字合并和去重功能

**关键变量**：

-   `customKeywords`: 自定义关键字数组（扩展点）
-   `getAllKeywords()`: 获取所有关键字（原始 + 自定义）

## 三、如何添加新关键字

### 3.1 快速添加

**步骤**：

1. 打开配置文件：`designer-demo/src/config/completion-keywords.ts`

2. 在 `customKeywords` 数组中添加新关键字：

```typescript
export const customKeywords = [
    'http', // HTTP 请求工具
    'router', // 路由工具
    'api', // ← 在这里添加新关键字
    'utils' // ← 或者这里
];
```

3. 保存文件，重新编译项目

4. 在设计器中测试：打开 Script 插件，输入 `this.` 查看是否出现新关键字的提示

### 3.2 示例：添加 `api` 关键字

**修改前**：

```typescript
export const customKeywords = ['http', 'router'];
```

**修改后**：

```typescript
export const customKeywords = [
    'http',
    'router',
    'api' // 新增：API 工具
];
```

**效果**：在设计器中输入 `this.api` 时会显示代码提示。

### 3.3 注意事项

⚠️ **关键字命名规范**：

-   使用小写字母和下划线
-   避免与 JavaScript 保留字冲突
-   建议使用有意义的名称，如 `http`, `router`, `api` 等

⚠️ **关键字作用域**：

-   添加的关键字是**全局的**，所有项目都会生效
-   如果需要项目特定的工具方法，请使用 Bridge 插件创建（会出现在 `this.utils.xxx` 下）

⚠️ **运行时支持**：

-   代码提示只是**编辑器提示**，不会自动在运行时注入
-   如果需要在生成代码时使用这些关键字，需要修改 `lowcode.ts` 模板文件（需要修改 packages，请谨慎操作）

## 四、使用场景

### 4.1 Script 插件

**位置**：设计器左侧面板 → Script 插件

**使用方式**：

1. 打开 Script 插件
2. 在代码编辑器中输入 `this.`
3. 自动显示可用的 API 列表
4. 选择 `this.http` 或 `this.router` 等关键字

**示例代码**：

```javascript
function onClick(event) {
    this.http.post('/api/user/login', { username: 'admin' });
}

function navigate() {
    this.router.push({ path: '/home' });
}
```

### 4.2 生命周期函数编辑器

**位置**：组件属性面板 → 生命周期

**使用方式**：

1. 打开生命周期配置
2. 在生命周期函数编辑器中输入 `this.`
3. 同样会显示代码提示

### 4.3 变量表达式编辑器

**位置**：组件属性面板 → 变量绑定

**使用方式**：

1. 打开变量配置器
2. 在表达式编辑器中输入 `this.`
3. 显示代码提示（部分关键字可能被过滤）

## 五、扩展说明

### 5.1 修改提示逻辑

如果需要修改代码提示的逻辑（如添加新的提示类型、修改提示格式等），可以编辑：

**文件**：`designer-demo/src/composable/completion.ts`

**关键函数**：

-   `getApiSuggestions()`: 修改内置 API 提示的生成逻辑
-   `getUserSuggestions()`: 修改动态工具方法提示的生成逻辑
-   `getSnippetsSuggestions()`: 修改代码片段提示的生成逻辑

### 5.2 添加代码片段

如果需要添加新的代码片段（如函数模板），可以编辑：

**文件**：`designer-demo/src/composable/completion.ts`

**位置**：`snippets` 数组

**示例**：

```typescript
const snippets = [
    {
        lable: 'new function',
        type: 'Function',
        insertText: `function \${1:funName} (\${2}) {
  \${3}
}`,
        detail: 'create new function'
    },
    // 添加新的代码片段
    {
        lable: 'http request',
        type: 'Function',
        insertText: `this.http.post('\${1:url}', \${2:data})`,
        detail: 'HTTP POST request'
    }
];
```

### 5.3 支持项目特定配置

如果需要支持按项目加载不同的关键字配置，可以：

1. **创建项目配置文件**：

    ```
    designer-demo/src/config/projects/
    ├── project-a-keywords.ts
    ├── project-b-keywords.ts
    └── default-keywords.ts
    ```

2. **修改 `completion-keywords.ts`**：

    ```typescript
    import { getProjectId } from '@/utils/project';

    const projectKeywords = {
        'project-a': ['http', 'router', 'api'],
        'project-b': ['http', 'router', 'custom'],
        default: ['http', 'router']
    };

    export const getAllKeywords = () => {
        const projectId = getProjectId();
        const keywords =
            projectKeywords[projectId] || projectKeywords['default'];
        // ... 合并逻辑
    };
    ```

## 六、常见问题

### Q1: 添加关键字后，为什么没有显示提示？

**A**: 请检查：

1. 是否保存了配置文件
2. 是否重新编译了项目
3. 是否在正确的编辑器中使用（Script 插件、生命周期编辑器等）
4. 是否输入了 `this.` 触发提示

### Q2: 关键字提示和 Bridge 插件创建的工具方法有什么区别？

**A**:

-   **关键字提示**（`this.http`）：全局配置，所有项目共享，仅提供编辑器提示
-   **Bridge 工具方法**（`this.utils.xxx`）：项目特定，保存在数据库中，运行时可用

### Q3: 如何让关键字在运行时可用？

**A**: 需要修改 `lowcode.ts` 模板文件，在 `lowcodeWrap` 函数中添加对应的属性：

```typescript
// packages/vue-generator/src/templates/vue-template/templateFiles/src/lowcodeConfig/lowcode.js
Object.defineProperties(global, {
    // ... 其他属性
    http: { get: () => http }, // 添加 http
    router: { get: () => router } // 添加 router
});
```

⚠️ **注意**：这需要修改 `packages` 目录下的文件，请谨慎操作。

### Q4: 如何移除某个关键字？

**A**: 在 `completion-keywords.ts` 的 `customKeywords` 数组中删除对应的关键字即可。

### Q5: 关键字会影响性能吗？

**A**: 不会。关键字列表很小（通常 < 20 个），Monaco Editor 的代码提示机制已经过优化，不会影响编辑器性能。

## 七、技术细节

### 7.1 Monaco Editor 集成

代码提示功能基于 Monaco Editor 的 `CompletionItemProvider` API：

```typescript
monacoInstance.languages.registerCompletionItemProvider(lang, {
  provideCompletionItems(model, position, context, token) {
    // 返回提示建议列表
    return { suggestions: [...] }
  },
  triggerCharacters: ['.']  // 触发字符
})
```

### 7.2 提示匹配逻辑

代码提示使用前缀匹配：

-   输入 `this.h` → 显示 `this.http`, `this.history` 等
-   输入 `this.http.` → 显示 `this.http.post`, `this.http.get` 等（需要运行时支持）

### 7.3 动态数据读取

动态工具方法（`this.utils.xxx`）从 `appSchemaState` 中读取：

```typescript
const {
    bridge = [],
    dataSource = [],
    utils = []
} = useResource().appSchemaState;
```

这些数据来自：

-   Bridge 插件创建的工具方法
-   应用 Schema 中的配置
-   数据库中的扩展数据

## 八、维护建议

### 8.1 代码审查

在添加新关键字时，建议：

1. 确认关键字名称符合命名规范
2. 确认关键字不会与现有关键字冲突
3. 添加注释说明关键字的用途
4. 更新本文档

### 8.2 版本管理

-   关键字配置的变更应该提交到版本控制系统
-   建议在提交信息中说明添加的关键字及其用途

### 8.3 测试

添加新关键字后，建议测试：

1. 在 Script 插件中测试提示是否正常显示
2. 在生命周期编辑器中测试
3. 在变量表达式中测试（如果适用）

## 九、相关文件清单

### 核心文件

-   `designer-demo/src/composable/completion.ts` - 代码提示实现
-   `designer-demo/src/config/completion-keywords.ts` - 关键字配置

### 使用文件

-   `designer-demo/src/plugins/script/Main.vue` - Script 插件
-   `designer-demo/src/components/i18n-wrappers/LifeCycles/index.vue` - 生命周期编辑器
-   `designer-demo/src/plugins/state/CreateVariable.vue` - 变量创建编辑器

### 参考文件

-   `packages/common/js/completion.js` - 原始实现（参考用，不要修改）
-   `packages/vue-generator/src/templates/vue-template/templateFiles/src/lowcodeConfig/lowcode.js` - 运行时注入参考

## 十、更新日志

### 2025-01-XX - 初始版本

-   ✅ 创建自定义代码提示实现
-   ✅ 添加 `http` 和 `router` 关键字
-   ✅ 创建配置文件管理系统
-   ✅ 更新所有编辑器使用自定义 completion

---

**文档维护者**：开发团队  
**最后更新**：2025-01-XX  
**版本**：1.0.0
