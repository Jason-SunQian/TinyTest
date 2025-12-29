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

### 6.1 VSCode 插件端改造

在 `webviewMessageCommands.ts` 的 `proxyHttpRequest` 处理器中：

1. 解析请求 URL，提取路径和参数
2. 根据 URL 路径路由到对应的处理函数
3. 处理函数从本地文件读取或写入数据
4. 返回与 mock 接口相同格式的响应

**实现结构：**

```typescript
// 伪代码示例
proxyHttpRequest: async (message, webviewId) => {
    const { url, method, params, data } = message.data;
    
    // 路由到对应的处理函数
    let responseData;
    
    if (url.match(/^\/app-center\/v1\/api\/apps\/schema\/(.+)$/)) {
        // 读取 app-schema.json
        responseData = await readAppSchema(appId);
    } else if (url.match(/^\/app-center\/api\/pages\/list\/(.+)$/)) {
        // 扫描 PAGE 目录，读取所有 JSON 文件
        responseData = await readPageList(appId);
    } else if (url.match(/^\/app-center\/api\/pages\/detail\/(.+)$/)) {
        // 根据 pageId 读取对应的 JSON 文件
        responseData = await readPageDetail(pageId);
    } else if (url.match(/^\/app-center\/api\/pages\/update\/(.+)$/)) {
        // 更新对应的 JSON 文件
        responseData = await updatePage(pageId, data);
    } else if (url === '/platform-center/api/user/me') {
        // 返回固定 mock 数据
        responseData = { id: 1, username: 'Developer', ... };
    }
    // ... 其他接口
    
    // 返回响应（保持 mock 格式）
    sendMessageToWebview(webviewId, message.callback, {
        data: responseData,
        locale: 'zh-cn'  // 可选
    });
}
```
### 6.2 文件操作函数设计

需要实现的核心函数：

- `readAppSchema(appId: string)` - 读取应用 Schema
- `readPageList(appId: string)` - 读取页面列表
- `readPageDetail(pageId: string)` - 读取页面详情
- `updatePage(pageId: string, pageData: any)` - 更新页面
- `createPage(pageData: any)` - 创建页面
- `deletePage(pageId: string)` - 删除页面
- `updateAppSchema(appId: string, schemaData: any)` - 更新应用 Schema

### 6.3 页面 ID 与文件名的映射策略

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

- **设计器端无需改动**：所有请求仍通过 `proxyHttpRequest`，只是数据来源变为本地文件
- **数据格式保持一致**：返回格式与 mock 接口相同，设计器逻辑无需修改
- **易于维护**：接口一一对应，便于定位和调试
- **可扩展**：新增接口只需在插件端添加对应的处理函数

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

---

该方案保持设计器端逻辑不变，只需在插件端实现文件读写逻辑，即可实现 mock 接口的本地化替代。