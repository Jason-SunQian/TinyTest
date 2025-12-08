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
    source: 'vscode' | 'designer';  // 消息来源
    method: string;                 // 方法名
    requestId?: string;              // 请求ID，用于 callback 匹配
    params?: any;                    // 参数
    result?: any;                    // 返回结果（用于 callback）
    error?: any;                     // 错误信息
}
```

## API 设计

### 设计器调用插件的方法

#### 1. `getInitData(callback)`

获取初始化数据（语言、主题等）。

**参数：**
- `callback: (data: InitData) => void` - 回调函数，接收初始化数据

**示例：**
```typescript
import { getInitData } from '@/composable/useVSCodeBridge';

getInitData((data) => {
    console.log('语言:', data.language);
    console.log('主题:', data.theme);
});
```

**VSCode 插件响应：**
```typescript
// 插件收到消息后，通过 callback 返回数据
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

#### 2. `goSave(data, callback?)`

保存数据到本地文件。

**参数：**
- `data: SaveData` - 要保存的数据
  ```typescript
  interface SaveData {
      pageId?: string;
      pageSchema?: any;
      pageData?: any;
      [key: string]: any;
  }
  ```
- `callback?: (success: boolean, error?: any) => void` - 可选的回调函数

**示例：**
```typescript
import { goSave } from '@/composable/useVSCodeBridge';

goSave({
    pageId: '123',
    pageSchema: { /* schema 数据 */ },
    pageData: { /* 页面数据 */ }
}, (success, error) => {
    if (success) {
        console.log('保存成功');
    } else {
        console.error('保存失败:', error);
    }
});
```

**VSCode 插件响应：**
```typescript
// 插件保存成功后，通过 callback 返回结果
panel.webview.postMessage({
    source: 'vscode',
    method: 'goSave',
    requestId: message.requestId,
    result: true  // 或 { success: true }
});
```

#### 3. `goPreview(callback?)`

由插件发起预览。

**参数：**
- `callback?: (success: boolean, error?: any) => void` - 可选的回调函数

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
- `theme: string` - 主题名称，如 `'light'` 或 `'dark'`

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
- `language: string` - 语言代码，支持简写（`zh`, `en`）或完整代码（`zh_CN`, `en_US`）

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
|------|----------|
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

- VSCode 环境：使用 `goSave` 保存到本地文件
- 非 VSCode 环境：使用原有的 `handlePageUpdate` API

#### 预览功能

在 `packages/toolbars/preview/src/Main.vue` 中，预览功能已集成 `goPreview`：

- VSCode 环境：使用 `goPreview` 由插件发起预览
- 非 VSCode 环境：使用原有的 `previewPage` 函数

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
this._panel.webview.onDidReceiveMessage(
    message => {
        if (message.command === 'designerMessage') {
            const { method, requestId, params } = message.data;
            
            switch (method) {
                case 'getInitData':
                    // 获取初始化数据
                    const initData = {
                        language: vscode.workspace.getConfiguration().get('designer.language', 'en_US'),
                        theme: vscode.workspace.getConfiguration().get('designer.theme', 'light')
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
                    this._handleSave(params).then(() => {
                        this._panel.webview.postMessage({
                            command: 'sendToDesigner',
                            data: {
                                source: 'vscode',
                                method: 'goSave',
                                requestId: requestId,
                                result: true
                            }
                        });
                    }).catch(error => {
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
    }
);
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
getInitData((data) => {
    console.log('初始化数据:', data);
});

// 保存数据
const handleSave = () => {
    goSave({
        pageId: '123',
        pageSchema: { /* ... */ }
    }, (success, error) => {
        if (success) {
            console.log('保存成功');
        }
    });
};

// 预览
const handlePreview = () => {
    goPreview((success) => {
        if (success) {
            console.log('预览已启动');
        }
    });
};
</script>
```

## 注意事项

1. **环境检测**：只有在 VSCode 环境中才会初始化通信，非 VSCode 环境返回空实现或使用原有方式
2. **消息过滤**：只处理 `source === 'vscode'` 的消息，避免处理其他来源的消息
3. **延迟初始化**：使用 `setTimeout` 延迟请求配置，确保设计器已完全加载
4. **错误处理**：所有操作都包含 try-catch，避免影响主流程
5. **Callback 清理**：使用 `requestId` 匹配后立即从 `callbackMap` 中删除，避免内存泄漏

## 扩展性

### 添加新的设计器调用插件的方法

1. 在 `useVSCodeBridge.ts` 中添加新的导出函数
2. 使用 `generateRequestId()` 生成请求ID
3. 将 callback 存储到 `callbackMap`
4. 调用 `sendMessageToVSCode` 发送请求
5. 在文档中更新 API 说明

### 添加新的插件调用设计器的方法

1. 在 `handleVSCodeMessage` 中添加新的 case
2. 实现对应的处理函数
3. 在文档中更新 API 说明
