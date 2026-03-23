# VSCode 插件集成方案

## 概述

本文档描述了设计器与 VSCode 插件之间的通信机制，采用 RPC 风格，支持 callback 回调方式实现双向数据交互和命令控制。

## 架构设计

### 通信流程

```
VSCode 插件 <--> Webview HTML <--> iframe (设计器)
```

1. **插件 → 设计器**：插件通过 `webview.postMessage()` 发送消息到 webview HTML，HTML 再通过 `iframe.contentWindow.postMessage()` 转发到设计器
2. **设计器 → 插件**：设计器通过 `window.parent.postMessage()` 发送消息到 webview HTML，HTML 再通过 `vscode.postMessage()` 转发到插件

### 消息格式

所有消息都包含 `source` 字段用于标识消息来源：

```typescript
interface VSCodeMessage {
    source: 'vscode' | 'designer'; // 消息来源
    method: string; // 方法名
    requestId?: string; // 请求ID，用于 callback 匹配
    params?: any; // 参数
    result?: any; // 返回结果（用于 callback）
    error?: any; // 错误信息
}
```

## API 设计

### 设计器调用插件的方法

#### 1. `getInitData(callback)`

获取初始化数据（语言、主题、物料包 URL 等）。设计器在初始化时主动调用，插件通过 callback 返回配置。

**参数：**

-   `callback: (data: InitData) => void` - 回调函数，接收初始化数据

**InitData 约定：**

| 字段                 | 类型     | 说明                                                                                                                            |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `language`           | string   | 语言（如 `en_US`、`zh_CN`）                                                                                                     |
| `theme`              | string   | 主题（如 `light`、`dark`）                                                                                                      |
| ~~materialBundleUrls~~ | ~~string[]~~ | 已移除。物料包 URL 由 ASSETMANAGER + lowcode.config.json 解析后注入 `window.TINY_MATERIAL_BUNDLE_URLS`。 |

**示例：**

```typescript
import { getInitData } from '@/composable/useVSCodeBridge';

getInitData(data => {
    console.log('语言:', data.language);
    console.log('主题:', data.theme);
    // 物料包 URL 由 HTML 注入 window.TINY_MATERIAL_BUNDLE_URLS，设计器直接读取
});
```

**VSCode 插件响应：**

```typescript
// 插件收到消息后，通过 callback 返回数据（语言、主题）
// 物料包 URL 将由 ASSETMANAGER + lowcode.config.json 实现后在 HTML 中注入 window.TINY_MATERIAL_BUNDLE_URLS
panel.webview.postMessage({
    source: 'vscode',
    method: 'getInitData',
    requestId: message.requestId,
    result: {
        language: 'en_US',
        theme: 'light'
    }
});
```

**本地联调（非插件）**：在 `env/.env.development` 或 `env/.env.local` 中配置：

```bash
# 逗号分隔多个 URL，例如主工程在 3000 端口 serve dist/lowcode-materials/bundle.json 时：
VITE_MATERIAL_BUNDLE_URLS=http://localhost:3000/bundle.json
```

设计器通过 `window.TINY_MATERIAL_BUNDLE_URLS` 获取物料包 URL；该变量由插件在 HTML 中注入（待 ASSETMANAGER + lowcode.config.json 实现），getInitData 不传递物料 URL。

#### 2. `goSave(data, callback?)`

保存数据到本地文件。

**参数：**

-   `data: SaveData` - 要保存的数据
    ```typescript
    interface SaveData {
        pageId?: string;
        pageSchema?: any;
        pageData?: any;
        [key: string]: any;
    }
    ```
-   `callback?: (success: boolean, error?: any) => void` - 可选的回调函数

**示例：**

```typescript
import { goSave } from '@/composable/useVSCodeBridge';

goSave(
    {
        pageId: '123',
        pageSchema: {
            /* schema 数据 */
        },
        pageData: {
            /* 页面数据 */
        }
    },
    (success, error) => {
        if (success) {
            console.log('保存成功');
        } else {
            console.error('保存失败:', error);
        }
    }
);
```

**VSCode 插件响应：**

```typescript
// 插件保存成功后，通过 callback 返回结果
panel.webview.postMessage({
    source: 'vscode',
    method: 'goSave',
    requestId: message.requestId,
    result: true // 或 { success: true }
});
```

#### 3. `goPreview(callback?)`

由插件发起预览。

**参数：**

-   `callback?: (success: boolean, error?: any) => void` - 可选的回调函数

**示例：**

```typescript
import { goPreview } from '@/composable/useVSCodeBridge';

goPreview((success, error) => {
    if (success) {
        console.log('预览已启动');
    } else {
        console.error('预览失败:', error);
    }
});
```

**VSCode 插件响应：**

```typescript
// 插件启动预览后，通过 callback 返回结果
panel.webview.postMessage({
    source: 'vscode',
    method: 'goPreview',
    requestId: message.requestId,
    result: true
});
```

### 插件调用设计器的方法

#### 1. `setTheme(theme)`

设置设计器主题。

**参数：**

-   `theme: string` - 主题名称，如 `'light'` 或 `'dark'`

**VSCode 插件调用：**

```typescript
panel.webview.postMessage({
    command: 'sendToDesigner',
    data: {
        source: 'vscode',
        method: 'setTheme',
        params: {
            theme: 'dark'
        }
    }
});
```

#### 2. `setLanguage(language)`

设置设计器语言。

**参数：**

-   `language: string` - 语言代码，支持简写（`zh`, `en`）或完整代码（`zh_CN`, `en_US`）

**VSCode 插件调用：**

```typescript
panel.webview.postMessage({
    command: 'sendToDesigner',
    data: {
        source: 'vscode',
        method: 'setLanguage',
        params: {
            language: 'en_US'
        }
    }
});
```

## 语言代码映射

支持完整代码和简写：

| 简写 | 完整代码 |
| ---- | -------- |
| zh   | zh_CN    |
| en   | en_US    |
| ja   | ja_JP    |
| ko   | ko_KR    |

## 实现细节

### Callback 机制

设计器使用 `requestId` 来匹配请求和响应：

1. 设计器发送请求时生成唯一的 `requestId`
2. 将 `requestId` 和 `callback` 存储在 `callbackMap` 中
3. 插件响应时携带相同的 `requestId`
4. 设计器根据 `requestId` 找到对应的 `callback` 并执行

### 自动初始化

在 `main.ts` 的 `beforeAppCreate` 生命周期中，会自动调用 `initVSCodeBridge()`：

1. 监听来自 VSCode 的消息
2. 延迟 1 秒后调用 `getInitData()` 获取初始化配置
3. 根据配置设置语言和主题

### 集成点

#### 保存功能

在 `designer-demo/src/toolbars/save/js/index.ts` 中，`savePage` 函数已集成 `goSave`：

-   VSCode 环境：使用 `goSave` 保存到本地文件
-   非 VSCode 环境：使用原有的 `handlePageUpdate` API

#### 预览功能

在 `packages/toolbars/preview/src/Main.vue` 中，预览功能已集成 `goPreview`：

-   VSCode 环境：使用 `goPreview` 由插件发起预览
-   非 VSCode 环境：使用原有的 `previewPage` 函数

## VSCode 插件端实现示例

### Webview HTML 中的消息转发

```javascript
// 监听来自 VSCode 扩展的消息
window.addEventListener('message', event => {
    const message = event.data;

    if (message.command === 'sendToDesigner') {
        // 转发消息到 iframe
        const iframe = document.getElementById('designerFrame');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(message.data, '*');
        }
    }
});

// 监听来自 iframe 的消息
window.addEventListener('message', event => {
    const message = event.data;

    if (message.source === 'designer') {
        // 转发到 VSCode 扩展
        vscode.postMessage({
            command: 'designerMessage',
            data: message
        });
    }
});
```

### 插件端处理设计器请求

```typescript
// 处理来自设计器的消息
this._panel.webview.onDidReceiveMessage(message => {
    if (message.command === 'designerMessage') {
        const { method, requestId, params } = message.data;

        switch (method) {
            case 'getInitData':
                // 获取初始化数据
                const initData = {
                    language: vscode.workspace
                        .getConfiguration()
                        .get('designer.language', 'en_US'),
                    theme: vscode.workspace
                        .getConfiguration()
                        .get('designer.theme', 'light')
                };

                // 通过 callback 返回数据
                this._panel.webview.postMessage({
                    command: 'sendToDesigner',
                    data: {
                        source: 'vscode',
                        method: 'getInitData',
                        requestId: requestId,
                        result: initData
                    }
                });
                break;

            case 'goSave':
                // 保存数据到本地文件
                this._handleSave(params)
                    .then(() => {
                        this._panel.webview.postMessage({
                            command: 'sendToDesigner',
                            data: {
                                source: 'vscode',
                                method: 'goSave',
                                requestId: requestId,
                                result: true
                            }
                        });
                    })
                    .catch(error => {
                        this._panel.webview.postMessage({
                            command: 'sendToDesigner',
                            data: {
                                source: 'vscode',
                                method: 'goSave',
                                requestId: requestId,
                                error: error.message
                            }
                        });
                    });
                break;

            case 'goPreview':
                // 启动预览
                this._handlePreview().then(() => {
                    this._panel.webview.postMessage({
                        command: 'sendToDesigner',
                        data: {
                            source: 'vscode',
                            method: 'goPreview',
                            requestId: requestId,
                            result: true
                        }
                    });
                });
                break;
        }
    }
});
```

### 插件端调用设计器方法

```typescript
// 切换主题
public switchTheme(theme: 'light' | 'dark') {
    this._panel.webview.postMessage({
        command: 'sendToDesigner',
        data: {
            source: 'vscode',
            method: 'setTheme',
            params: {
                theme: theme
            }
        }
    });
}

// 切换语言
public switchLanguage(language: string) {
    this._panel.webview.postMessage({
        command: 'sendToDesigner',
        data: {
            source: 'vscode',
            method: 'setLanguage',
            params: {
                language: language
            }
        }
    });
}
```

## 使用示例

### 在组件中使用

```vue
<script setup>
import { getInitData, goSave, goPreview } from '@/composable/useVSCodeBridge';

// 获取初始化数据
getInitData(data => {
    console.log('初始化数据:', data);
});

// 保存数据
const handleSave = () => {
    goSave(
        {
            pageId: '123',
            pageSchema: {
                /* ... */
            }
        },
        (success, error) => {
            if (success) {
                console.log('保存成功');
            }
        }
    );
};

// 预览
const handlePreview = () => {
    goPreview(success => {
        if (success) {
            console.log('预览已启动');
        }
    });
};
</script>
```

## 固定 Mock 与物料包（插件环境）

在 VSCode 插件环境中，设计器通过「固定 Mock」从本地 mock 文件读取数据，不经过插件转发。凡以 `/mock/` 开头的请求都会走固定 Mock（见 `src/composable/http/index.ts` 中 `isFixedMockRoute`）。

与物料相关的固定 Mock 包括：

| 请求 URL                            | Mock 数据来源                                                            | 说明                |
| ----------------------------------- | ------------------------------------------------------------------------ | ------------------- |
| `GET /mock/bundle.json`             | `mock/app-center.ts` 中对应路由，动态导入 `mock/bundle.json`             | 基础物料包          |
| `GET /mock/business-materials.json` | `mock/app-center.ts` 中对应路由，动态导入 `mock/business-materials.json` | 业务/原子组件物料包 |

业务/原子组件物料包的 **图标** 与 **国际化** 约定（面板分类 MR Components / MP Components、组件名中英文）：见 `docs/业务与原子组件导入方案.md` 第 **4.7** 节。

若在插件环境中出现「固定 Mock 接口未找到数据」或物料面板加载不全，请确认：

1. **`mock/business-materials.json` 存在**且内容为 `{ "data": { "materials": { "components": [...], "snippets": [...] } } }`（该文件为唯一数据来源，mock 路由通过 `import('./business-materials.json')` 读取）。
2. **`mock/app-center.ts`** 中已注册 `/mock/business-materials.json` 的 GET 路由，并在 `getMockData` 合并的 mock 列表内（通过 `appCenterMock` 引入）。

新增其他物料包时，同样需要在 `mock/` 下放置对应 JSON，并在 `mock/app-center.ts` 中增加一条 GET 路由，返回格式需包含顶层 `data`，以便 HTTP 拦截器正确解析。

### 为什么导入的物料在插件中需要「绝对 URL」？（与内置组件的差异）

**现象**：内置组件（如容器、按钮、TinyVue 等）在浏览器和插件里都能正常拖拽和渲染；通过物料包导入的组件（如 MpCard）在浏览器里正常，在插件里画布会报「区块 xxx 加载错误」。

**根本原因**：两类组件的 **script 来源不同**，最终进画布 iframe 的 URL 形式不同：

| 来源           | script URL 从哪来                                                     | 在画布 iframe 中的形式                                                             | 插件环境下  |
| -------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------- |
| **内置组件**   | 设计器内部 `getImportUrl(pkg)`，用环境变量（CDN / BASE_URL）拼出地址  | **始终是绝对 URL**（如 `https://cdn.../index.mjs` 或 `http://localhost:8090/...`） | ✅ 能加载   |
| **导入的物料** | 物料包 JSON 里配置的 `script` 字段（如 `/mock/materials/mp-card.js`） | **原样写入 importMap / componentsDeps**，是相对路径                                | ❌ 解析错误 |

画布运行在 **iframe（srcdoc）** 里。在插件环境中，该 iframe 的 document 的 base URL 是 **`vscode-webview://...`**，而不是设计器前端的 `http://localhost:8090`。因此：

-   相对路径 `/mock/materials/mp-card.js` 在 iframe 里会被解析成 `vscode-webview://.../mock/materials/mp-card.js`，请求失败；
-   脚本加载失败 → 组件未注册到 `window.TinyLowcodeComponent` → 画布回退到请求 `GET /material-center/api/block?label=MpCard` → 该接口返回 404，出现「区块 MpCard 加载错误」。

**结论**：不是给「导入的组件」做特殊逻辑，而是让**所有进画布的物料 script/样式 URL 在需要时都变成可解析的地址**。内置组件已经通过 `getImportUrl` 得到绝对 URL；导入的物料在插件环境下需要把相对路径转成「设计器前端绝对 URL」（如 `http://localhost:8090`），这样 iframe 内请求会发到正确域名。

**当前实现**：设计器在 VSCode 环境下通过两处保证「最终进画布的均为绝对 URL」：（1）**`src/composable/canvasDepsNormalizer.ts`** 订阅 `init_canvas_deps`，将 payload 中的相对路径（如 `/mock/materials/mp-card.js`）转为绝对 URL 后重新发布，这样由 npm 包 materials 发布的相对路径也会被归一化；（2）**`src/utils/designerOrigin.ts`**、**`useMaterial.getCanvasDeps`**、**`CanvasContainer` 的 `beforeCanvasReady`** 等确保设计器侧自己发布 `init_canvas_deps` 时也带上绝对 URL（或 data URL）。与内置组件「最终都用绝对 URL」的行为一致。

若端口不是 8090，可设置环境变量 `VITE_ORIGIN=http://localhost:你的端口`，设计器会以此作为物料 base。

**若插件里仍报「区块 MpCard 加载错误」或 `Failed to fetch dynamically imported module`**，可按下面排查清单逐项检查：

1. **物料文件**：在 designer-demo 下执行 `pnpm run build:materials`，确认 `public/mock/materials/` 下有 `mp-card.js`、`mr-components.js`、`style.css`。
2. **扩展侧（若使用 data URL 方案）**：在 lowcode-kit 的 packages/vscode 下执行 `pnpm run copy-materials`，或手动将上述 3 个文件拷到 `resource/mock/materials/`。
3. **设计器与端口**：designer-demo 运行 `pnpm run dev`，浏览器直连 `http://localhost:8090` 能正常打开设计器。
4. **扩展重载**：F5 启动 Extension Development Host 后，在新窗口执行「Developer: Reload Window」或关掉窗口再 F5。
5. **仍失败时**：在 webview 开发者工具 → Network 筛 `mock` 或 `mp-card`：若请求是 `http://localhost:8090/...` 且 403，检查 vite 的 mock-materials-cors 与 CORS 配置；若请求仍是 vscode-webview，说明 normalizer 未生效，检查 designer-demo 的 `canvasDepsNormalizer` 是否在 `main.ts` 的 appCreated 中注册。

### 插件环境下如何看到设计器日志

设计器运行在 **VSCode 的 webview** 里，`console.log` 只会出现在 **该 webview 的开发者工具** 中，不会出现在 VS Code 的「调试控制台」或「Extension Host」输出里。

**正确步骤：**

1. 在 Extension Development Host 窗口中，**把焦点放在设计器页面**（左侧或中间显示画布、物料面板的那块区域）。
2. **右键点击设计器内容区域**（画布或物料面板均可），在菜单里选择 **「审查」或「Inspect」**（或「打开 Webview 开发者工具」等类似项）。
3. 会弹出一个**独立的 Chrome DevTools 窗口**，其中的 **Console** 即为设计器所在 webview 的控制台。
4. 设计器相关日志（如 HTTP Service、VSCode Bridge 等）会出现在该 Console 中。

若打开的窗口没有设计器相关输出，说明当前不是 webview 的控制台，请确认是「右键设计器区域 → 审查」弹出的窗口。

## 注意事项

1. **环境检测**：只有在 VSCode 环境中才会初始化通信，非 VSCode 环境返回空实现或使用原有方式
2. **消息过滤**：只处理 `source === 'vscode'` 的消息，避免处理其他来源的消息
3. **延迟初始化**：使用 `setTimeout` 延迟请求配置，确保设计器已完全加载
4. **错误处理**：所有操作都包含 try-catch，避免影响主流程
5. **Callback 清理**：使用 `requestId` 匹配后立即从 `callbackMap` 中删除，避免内存泄漏

## 扩展性

### 添加新的设计器调用插件的方法

1. 在 `useVSCodeBridge.ts` 中添加新的导出函数
2. 使用 `generateRequestId()` 生成请求 ID
3. 将 callback 存储到 `callbackMap`
4. 调用 `sendMessageToVSCode` 发送请求
5. 在文档中更新 API 说明

### 添加新的插件调用设计器的方法

1. 在 `handleVSCodeMessage` 中添加新的 case
2. 实现对应的处理函数
3. 在文档中更新 API 说明
