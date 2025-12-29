# VSCode 插件中 Mock 接口本地化实现方案

## 一、核心思路

在 VSCode 插件环境中，通过 `proxyHttpRequest` 将设计器的 HTTP 请求路由到插件端，插件端根据 URL 路径和请求方法，从本地文件系统读取或写入数据，返回与 mock 接口相同格式的数据。

## 二、当前架构分析

### 2.1 设计器端（designer-demo）

- **请求代理方式**：所有 HTTP 请求通过 `proxyHttpRequest` 代理到 VSCode 插件
- **实现位置**：`designer-demo/src/composable/http/index.ts` 的 `createVSCodeHttpAdapter()`
- **请求格式**：
  ```typescript
  { url, method, params, data, headers }
  ```
- **响应格式**：
  ```typescript
  { data: {...}, locale?: 'zh-cn' }
  ```

### 2.2 VSCode 插件端

- **当前实现**：`proxyHttpRequest` 处理器将请求转发到本地 mockServer（`http://localhost:8090`）
- **实现位置**：`packages/vscode/src/commands/webviewMessageCommands.ts`
- **需要改造**：不再转发到 mockServer，而是根据 URL 路径从本地文件读取或写入
## 三、需要实现的接口清单
### 3.1 应用级接口（App Level）

| 接口路径 | 方法 | 用途 | 数据来源/存储 | 状态 | 交互        |
|---------|------|------|--------------|------|-----------|
| `/app-center/api/apps/detail/:id` | GET | 获取应用详情 | 本地文件：app.json 或固定数据 | 需要 | appDetail |
| `/app-center/v1/api/apps/schema/:id` | GET | 获取应用 Schema（核心） | 本地文件：app-schema.json | 需要 | appSchema |
| `/app-center/api/apps/update/:id` | POST | 更新应用配置 | 写入本地文件 | 不确定 | appUpdate |
### 3.2 页面级接口（Page Level）

| 接口路径 | 方法 | 用途 | 数据来源/存储 | 状态 | 交互       |
|---------|------|------|--------------|------|----------|
| `/app-center/api/pages/list/:appId` | GET | 获取页面列表 | 扫描本地 PAGE 目录下的 JSON 文件 | 需要 | pageList |
| `/app-center/api/pages/detail/:id` | GET | 获取页面详情 | 读取对应的 JSON 文件（如 schama2.json） | 需要 | pageDetail |
| `/app-center/api/pages/create` | POST | 创建新页面 | 创建新的 JSON 文件 | 不要 |          |
| `/app-center/api/pages/update/:id` | POST | 更新页面 | 更新对应的 JSON 文件 | 需要 | pageUpdate |
| `/app-center/api/pages/delete/:id` | GET | 删除页面 | 删除对应的 JSON 文件 | 不要 |          |
| `/app-center/api/pages/copy` | POST | 复制页面 | 复制 JSON 文件并重命名 | 不要 |          |
| `/app-center/api/pages/histories` | GET | 获取页面历史列表 | 本地历史文件或固定数据 | 不要 |          |
| `/app-center/api/pages/histories/:id` | GET | 获取页面历史详情 | 读取历史文件 | 不要 |          |
| `/app-center/api/pageHistory/restore` | POST | 恢复页面历史 | 从历史文件恢复 | 不要 |          |
### 3.3 数据源接口（DataSource）

| 接口路径 | 方法 | 用途 | 数据来源/存储 | 状态 | 交互           |
|---------|------|------|--------------|------|--------------|
| `/app-center/api/sources/list/:appId` | GET | 获取数据源列表 | 从 app-schema.json 的 dataSource.list 读取 | 需要 | sourceList   |
| `/app-center/api/sources/detail/:id` | GET | 获取数据源详情 | 从 app-schema.json 的 dataSource.list 中查找 | 需要 | sourceDetail |
| `/app-center/api/sources/create` | POST | 创建数据源 | 更新 app-schema.json 的 dataSource.list | 需要 | sourceCreate |
| `/app-center/api/sources/update/:id` | POST | 更新数据源 | 更新 app-schema.json 的 dataSource.list | 需要 | sourceUpdate |
| `/app-center/api/sources/delete/:id` | GET | 删除数据源 | 从 app-schema.json 的 dataSource.list 中删除 | 需要 | sourceDelete |
### 3.4 其他接口

| 接口路径 | 方法 | 用途 | 实现方式 | 状态 | 交互                              |
|---------|------|------|---------|------|---------------------------------|
| `/platform-center/api/user/me` | GET | 获取用户信息 | 返回固定 mock 数据 | 不要 |                                 |
| `/app-center/api/apps/canvas/lock` | GET | 画布锁定状态 | 返回固定数据 { locked: false } | 不要 |                                 |
| `/app-center/api/schema2code` | POST | 代码生成 | 可暂不实现或返回固定数据 | 不要 |                                 |
| `/app-center/api/preview/metadata` | GET | 预览元数据 | 返回固定数据 | 不要 |                                 |
| `/app-center/api/i18n/entries/*` | GET/POST | i18n 相关 | 从 app-schema.json 的 i18n 读取/更新 | 需要 | i18nCreate/i18nUpdate           |
| `/app-center/api/apps/extension/*` | GET/POST | Bridge/Utils 相关 | 从 app-schema.json 的 bridge、utils 读取/更新 | 需要 | extensionCreate/extensionUpdate |
## 四、数据格式要求
### 4.1 应用 Schema 数据格式（/app-center/v1/api/apps/schema/:id）

```typescript
{
    data: {
        meta: {
            name: string,
            tenant: number,
            git_group: string,
            project_name: string,
            description: string,
            branch: string,
            is_demo: boolean | null,
            global_state: Array<any>,
            appId: string,
            creator: string,
            gmt_create: string,
            gmt_modified: string
        },
        dataSource: {
            list: Array<{
                id: number,
                name: string,
                data: any,
                tpl: any,
                app: string,
                desc: string | null,
                created_at: string,
                updated_at: string
            }>,
            dataHandler?: {
                type: 'JSFunction',
                value: string
            }
        },
        bridge: {
            list: Array<any>
        },
        i18n: {
            list: Array<any>
        },
        utils: Array<any>,
        componentsTree: Array<any>,  // 页面树结构
        componentsMap: Array<{      // 组件映射
            componentName: string,
            package: string,
            version: string,
            exportName: string,
            destructuring: boolean
        }>
    },
    locale?: 'zh-cn'
}
```
### 4.2 页面列表数据格式（/app-center/api/pages/list/:appId）

```typescript
{
    data: Array<{
        name: string,              // 页面名称
        id: string,                // 页面ID（对应文件名）
        app: string,               // 应用ID
        route: string,             // 页面路由
        page_content?: {           // 页面 Schema（可选，列表可能不包含完整内容）
            componentName: 'Page',
            // ... 其他 schema 字段
        },
        isHome: boolean,
        parentId: string,
        isBody: boolean,
        group: string,
        isPage: boolean,
        occupier?: {
            id: number,
            username: string
        }
    }>
}
```
### 4.3 页面详情数据格式（/app-center/api/pages/detail/:id）

```typescript
{
    data: {
        name: string,
        id: string,
        app: string,
        route: string,
        page_content: {
            // 完整的页面 Schema（必需）
            componentName: 'Page',
            fileName: string,
            css: string,
            props: Record<string, any>,
            children: Array<any>,   // 组件树
            methods: Record<string, any>,
            state: Record<string, any>,
            lifeCycles: Record<string, any>,
            dataSource: {
                list: Array<any>
            },
            inputs: Array<any>,
            outputs: Array<any>,
            utils: Array<any>,
            bridge: Array<any>
        },
        isHome: boolean,
        parentId: string,
        isBody: boolean,
        group: string,
        occupier?: {
            id: number,
            username: string
        }
    }
}
```
## 五、文件存储结构建议

```
workspace-root/
├── .lowcode/                    # 低代码配置目录（可选，用于存储应用级数据）
│   ├── app.json                 # 应用基本信息
│   └── app-schema.json          # 应用 Schema（dataSource, bridge, i18n, utils等）
└── PAGE/                        # 页面目录（已存在）
    ├── module1/
    │   └── page1.json
    ├── module2/
    │   └── page2.json
    ├── schama2.json             # 页面 Schema 文件
    └── schama3.json
```
或者更简单的方案（推荐）：
应用级数据：存储在 app-schema.json（与现有结构兼容）
页面数据：直接使用现有的 PAGE 目录下的 JSON 文件
页面 ID 映射：通过文件名映射（如 schama2.json → id: "schama2" 或通过文件内容中的 id 字段）
## 六、实现方案

### 6.1 设计器端改造（核心改动）

**改造思路：**
- **URL 区分工作从插件端移到设计器端**：设计器根据 URL 和 method 判断是调用插件还是使用 mock 数据
- **需要插件处理的接口**：使用对应的 command（如 `appDetail`、`pageList` 等）调用插件
- **不需要插件处理的接口**：设计器直接从 mock 文件读取数据返回

**实现位置：**
- `designer-demo/src/composable/http/index.ts` - HTTP adapter 实现
- `designer-demo/src/composable/useVSCodeBridge.ts` - VSCode 通信函数
- `designer-demo/src/utils/mockData.ts` - Mock 数据工具函数

**实现结构：**

```typescript
// 在 createVSCodeHttpAdapter 中实现 URL 路由逻辑
const createVSCodeHttpAdapter = () => {
    return async (config: InternalAxiosRequestConfig) => {
        const url = config.url;
        const method = config.method || 'get';
        
        // 1. 根据 URL 和 method 查找对应的 command
        const command = findCommandForUrl(url, method);
        
        if (command) {
            // 2. 需要插件处理的接口：使用对应的 command 调用插件
            const { callVSCodeCommand } = await import('../useVSCodeBridge');
            const result = await callVSCodeCommand(command, {
                url,
                method,
                params: config.params,
                data: config.data,
                headers: config.headers
            });
            return { data: result, status: 200, ... };
        } else {
            // 3. 不需要插件处理的接口：从 mock 文件读取数据
            const { getMockData } = await import('@/utils/mockData');
            const mockResult = await getMockData(url, method, config.params, config.data);
            return { data: mockResult, status: 200, ... };
        }
    };
};
```

**URL 到 Command 的映射关系：**

在 `http/index.ts` 中定义了 `urlRoutes` 数组，包含所有需要插件处理的接口映射：

```typescript
const urlRoutes: UrlRoute[] = [
    // 应用级接口
    { pattern: /^\/app-center\/api\/apps\/detail\/(.+)$/, method: 'get', command: 'appDetail' },
    { pattern: /^\/app-center\/v1\/api\/apps\/schema\/(.+)$/, method: 'get', command: 'appSchema' },
    { pattern: /^\/app-center\/api\/apps\/update\/(.+)$/, method: 'post', command: 'appUpdate' },
    // 页面级接口
    { pattern: /^\/app-center\/api\/pages\/list\/(.+)$/, method: 'get', command: 'pageList' },
    { pattern: /^\/app-center\/api\/pages\/detail\/(.+)$/, method: 'get', command: 'pageDetail' },
    { pattern: /^\/app-center\/api\/pages\/update\/(.+)$/, method: 'post', command: 'pageUpdate' },
    // 数据源接口
    { pattern: /^\/app-center\/api\/sources\/list\/(.+)$/, method: 'get', command: 'sourceList' },
    { pattern: /^\/app-center\/api\/sources\/detail\/(.+)$/, method: 'get', command: 'sourceDetail' },
    { pattern: /^\/app-center\/api\/sources\/create$/, method: 'post', command: 'sourceCreate' },
    { pattern: /^\/app-center\/api\/sources\/update\/(.+)$/, method: 'post', command: 'sourceUpdate' },
    { pattern: /^\/app-center\/api\/sources\/delete\/(.+)$/, method: 'get', command: 'sourceDelete' },
    // i18n 接口
    { pattern: /^\/app-center\/api\/i18n\/entries\/create$/, method: 'post', command: 'i18nCreate' },
    { pattern: /^\/app-center\/api\/i18n\/entries\/update$/, method: 'post', command: 'i18nUpdate' },
    // extension 接口
    { pattern: /^\/app-center\/api\/apps\/extension\/create$/, method: 'post', command: 'extensionCreate' },
    { pattern: /^\/app-center\/api\/apps\/extension\/update$/, method: 'post', command: 'extensionUpdate' }
];
```

### 6.2 VSCode 插件端改造

**改造思路：**
- 插件端不再需要根据 URL 路由，直接根据 command 处理对应的逻辑
- 每个 command 对应一个处理函数，从本地文件读取或写入数据

**实现位置：**
- `packages/vscode/src/commands/webviewMessageCommands.ts`

**实现结构：**

```typescript
// 插件端处理不同的 command
const handleWebviewMessage = (message: WebviewMessage) => {
    const { command, callback, data } = message;
    
    switch (command) {
        case 'appDetail':
            // 读取 app.json 或返回固定数据
            handleAppDetail(data, callback);
            break;
        case 'appSchema':
            // 读取 app-schema.json
            handleAppSchema(data, callback);
            break;
        case 'pageList':
            // 扫描 PAGE 目录，读取所有 JSON 文件
            handlePageList(data, callback);
            break;
        case 'pageDetail':
            // 根据 pageId 读取对应的 JSON 文件
            handlePageDetail(data, callback);
            break;
        case 'pageUpdate':
            // 更新对应的 JSON 文件
            handlePageUpdate(data, callback);
            break;
        // ... 其他 command
        default:
            // 未知 command，返回错误
            break;
    }
};
```
### 6.3 Mock 数据工具函数

**实现位置：**
- `designer-demo/src/utils/mockData.ts`

**功能：**
- 从 mock 文件中根据 URL 和 method 匹配并执行对应的 response 函数
- 支持路径参数模式（如 `/app-center/api/pages/detail/:id`）
- 返回标准格式：`{ data: any, locale?: string }`

**使用方式：**

```typescript
import { getMockData } from '@/utils/mockData';

// 获取 mock 数据
const mockResult = await getMockData(
    '/platform-center/api/user/me',
    'get',
    params,
    data
);

// 返回格式：{ data: {...}, locale?: 'zh-cn' }
```

### 6.4 VSCode 通信函数改造

**实现位置：**
- `designer-demo/src/composable/useVSCodeBridge.ts`

**新增函数：**
- `callVSCodeCommand(command: string, data?: any)` - 通用命令调用函数，支持传入不同的 command

**保留函数：**
- `proxyHttpRequest(config)` - 保留向后兼容，内部调用 `callVSCodeCommand('proxyHttpRequest', config)`

### 6.5 文件操作函数设计（插件端）

插件端需要实现的核心函数：

- `handleAppDetail(data, callback)` - 读取应用详情
- `handleAppSchema(data, callback)` - 读取应用 Schema
- `handleAppUpdate(data, callback)` - 更新应用配置
- `handlePageList(data, callback)` - 读取页面列表
- `handlePageDetail(data, callback)` - 读取页面详情
- `handlePageUpdate(data, callback)` - 更新页面
- `handleSourceList(data, callback)` - 读取数据源列表
- `handleSourceDetail(data, callback)` - 读取数据源详情
- `handleSourceCreate(data, callback)` - 创建数据源
- `handleSourceUpdate(data, callback)` - 更新数据源
- `handleSourceDelete(data, callback)` - 删除数据源
- `handleI18nCreate(data, callback)` - 创建 i18n 条目
- `handleI18nUpdate(data, callback)` - 更新 i18n 条目
- `handleExtensionCreate(data, callback)` - 创建 extension
- `handleExtensionUpdate(data, callback)` - 更新 extension

### 6.6 页面 ID 与文件名的映射策略

**方案 A（推荐）：通过文件内容中的 id 字段映射**

1. 读取 PAGE 目录下所有 JSON 文件
2. 解析每个文件的 `id` 字段
3. 建立 `id → 文件路径` 的映射关系

**方案 B：通过文件名映射**

- 约定：`{pageId}.json` 或 `schema{pageId}.json`
- 简单但不够灵活
## 七、关键实现点

### 7.1 URL 路径解析

使用正则表达式或 URL 解析库提取路径参数

例如：`/app-center/api/pages/detail/1` → `{ path: '/app-center/api/pages/detail/:id', id: '1' }`

### 7.2 数据格式转换

- 确保从文件读取的数据格式与 mock 接口返回格式一致
- 特别注意：响应外层需要包裹 `{ data: {...} }` 结构

### 7.3 错误处理

- 文件不存在 → 返回 404 错误
- JSON 解析失败 → 返回 500 错误
- 文件写入失败 → 返回 500 错误

### 7.4 数据同步

- 更新页面时，同时更新应用 Schema 中的 `componentsTree`（如果页面在树中）
- 创建/删除页面时，同步更新页面列表
## 八、优势

- **职责分离**：URL 路由逻辑在设计器端，插件端只需处理具体的业务逻辑
- **易于扩展**：新增接口只需在设计器端添加 URL 映射，插件端添加对应的 command 处理函数
- **数据格式保持一致**：返回格式与 mock 接口相同，设计器逻辑无需修改
- **灵活处理**：不需要插件处理的接口可以直接使用 mock 数据，减少插件复杂度
- **向后兼容**：保留 `proxyHttpRequest` 函数，确保现有代码不受影响

## 九、注意事项

- **文件路径处理**：使用 VSCode 的 `vscode.workspace.fs` API 进行文件操作
- **并发控制**：多个请求同时访问同一文件时需要考虑锁机制
- **数据验证**：写入前验证数据格式，避免损坏文件
- **性能优化**：页面列表可以缓存，减少文件扫描次数

## 十、实施优先级

### 第一阶段（核心功能）

- `/app-center/v1/api/apps/schema/:id` - 应用 Schema
- `/app-center/api/pages/list/:appId` - 页面列表
- `/app-center/api/pages/detail/:id` - 页面详情
- `/app-center/api/pages/update/:id` - 页面更新

### 第二阶段（完整功能）

- `/app-center/api/pages/create` - 创建页面
- `/app-center/api/pages/delete/:id` - 删除页面
- `/app-center/api/sources/*` - 数据源相关接口

### 第三阶段（辅助功能）

- 其他辅助接口（历史、锁定等）

## 十一、改造完成情况

### 已完成的设计器端改造

1. ✅ **Mock 数据工具函数** (`src/utils/mockData.ts`)
   - 实现了从 mock 文件中根据 URL 和 method 匹配并执行 response 函数
   - 支持路径参数模式匹配
   - 支持动态导入 mock 文件

2. ✅ **VSCode 通信函数改造** (`src/composable/useVSCodeBridge.ts`)
   - 新增 `callVSCodeCommand(command, data)` 通用函数，支持传入不同的 command
   - 保留 `proxyHttpRequest` 函数，保持向后兼容

3. ✅ **HTTP Adapter 改造** (`src/composable/http/index.ts`)
   - 实现了 URL 路由逻辑，根据 URL 和 method 判断是调用插件还是使用 mock 数据
   - 定义了 URL 到 command 的映射关系（`urlRoutes`）
   - 需要插件处理的接口：使用对应的 command 调用插件
   - 不需要插件处理的接口：从 mock 文件读取数据返回

### 待完成的插件端改造

插件端需要根据不同的 command 实现对应的处理函数，从本地文件读取或写入数据。

---

**改造说明：**
- 该方案将 URL 区分工作从插件端移到设计器端，设计器根据 URL 判断是调用插件（使用对应的 command）还是使用 mock 数据
- 需要插件处理的接口使用对应的 command（如 `appDetail`、`pageList` 等）调用插件
- 不需要插件处理的接口直接从 mock 文件读取数据返回
- 插件端不再需要根据 URL 路由，直接根据 command 处理对应的业务逻辑