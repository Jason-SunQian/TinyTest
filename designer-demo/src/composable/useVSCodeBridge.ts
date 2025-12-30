/**
 * VSCode 通信服务
 * 用于处理设计器与 VSCode 插件之间的双向通信
 * 采用 RPC 风格，支持 callback 回调
 */

/* eslint-disable @typescript-eslint/no-explicit-any, no-inline-comments, line-comment-position, @typescript-eslint/naming-convention, camelcase, import/order, @typescript-eslint/no-use-before-define, no-console */
import { setGlobalMonacoEditorTheme } from '@opentiny/tiny-engine-common';

import { getMetaApi, META_SERVICE } from '@opentiny/tiny-engine-meta-register';

import { switchLanguage } from '../services/i18nService';

// 插件调用设计器的消息格式（通过 webview HTML 转发）
interface VSCodeToDesignerMessage {
    source: 'vscode';
    method: string;
    params?: any;
}

// 初始化配置类型
interface InitData {
    language?: string;
    theme?: string;
    [key: string]: any;
}

// 保存数据类型
interface SaveData {
    pageId?: string;
    pageSchema?: any;
    pageData?: any;
    [key: string]: any;
}

// 语言代码映射（VSCode 可能使用简写）
// eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
const LANGUAGE_MAP: Record<string, string> = {
    zh: 'zh_CN',
    en: 'en_US',
    ja: 'ja_JP',
    ko: 'ko_KR',
    zh_CN: 'zh_CN',
    en_US: 'en_US',
    ja_JP: 'ja_JP',
    ko_KR: 'ko_KR'
};

// Callback 映射表：requestId -> callback
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const callbackMap = new Map<string, (result?: any, error?: any) => void>();

/**
 * 获取 VSCode API 实例
 * 插件已经在 webview HTML 中调用了 acquireVsCodeApi() 并保存到 window.vscode
 * 设计器应该直接使用 window.vscode，而不是再次调用 acquireVsCodeApi()
 */
const getVSCodeApi = () => {
    if (typeof window !== 'undefined' && (window as any).vscode) {
        return (window as any).vscode;
    }
    return null;
};

// 生成唯一请求ID
let requestIdCounter = 0;
const generateRequestId = (): string => {
    return `req_${Date.now()}_${++requestIdCounter}`;
};

/**
 * 向 VSCode 插件发送消息
 * 设计器直接运行在 VSCode webview 中（不是 iframe），通过 window.vscode.postMessage 直接通信
 * 消息格式需要匹配插件期望的 WebviewMessage 格式：{ command, callback }
 * 如果需要传递数据，可以通过扩展属性传递（虽然类型定义中没有，但运行时可以传递）
 */
const sendMessageToVSCode = (command: string, callback: string, data?: any) => {
    const pluginMessage: { command: string; callback: string; data?: any } = {
        command,
        callback,
        ...(data !== undefined && { data })
    };

    try {
        const vscode = getVSCodeApi();
        if (vscode) {
            // 对于 HTTP 请求相关的 command，打印更详细的信息
            if (data?.url) {
                const {url} = data;
                const method = data.method || 'unknown';
                // eslint-disable-next-line no-console
                console.log(
                    `[VSCode Bridge] → ${command} ${method.toUpperCase()} ${url}`,
                    {
                        command,
                        callback,
                        url,
                        method,
                        params: data.params,
                        requestData: data.data
                    }
                );
            } else {
                // 其他 command（如 getInitData、goSave 等），使用简单格式
                // eslint-disable-next-line no-console
                console.log(
                    `[VSCode Bridge] → ${command}`,
                    callback,
                    data !== undefined ? { data } : ''
                );
            }
            vscode.postMessage(pluginMessage);
            return;
        }

        // eslint-disable-next-line no-console
        console.error(
            '[VSCode Bridge] Failed to send message: VSCode API not available'
        );
    } catch (error) {
        // eslint-disable-next-line no-console
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        console.error('[VSCode Bridge] Error sending message:', errorMessage);
        throw error;
    }
};

/**
 * 处理来自 VSCode 的消息
 */
const handleVSCodeMessage = (event: MessageEvent) => {
    const message = event.data;

    // 处理插件返回的回调消息（通过 webview HTML 转发）
    // 插件返回格式：{ command: callbackId, data?: unknown }
    // 注意：不在这里输出日志，让各个方法的回调自己决定如何输出详细日志
    if (
        message.command &&
        typeof message.command === 'string' &&
        callbackMap.has(message.command)
    ) {
        const callback = callbackMap.get(message.command)!;
        callbackMap.delete(message.command);

        // 检查响应中是否包含错误
        const hasError =
            message.data &&
            typeof message.data === 'object' &&
            'error' in message.data;

        try {
            callback(message.data, hasError ? message.data : undefined);
        } catch (error) {
            // eslint-disable-next-line no-console
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            console.error(
                '[VSCode Bridge] Error executing callback:',
                errorMessage
            );
        }
        return;
    }

    // 处理未匹配的 callback
    if (
        message.command &&
        typeof message.command === 'string' &&
        !callbackMap.has(message.command)
    ) {
        // 静默忽略未知回调，避免日志噪音
        return;
    }

    // 处理插件调用设计器的方法（通过 webview HTML 转发）
    // 插件调用格式：{ source: 'vscode', method: string, params?: any }
    if (message.source === 'vscode' && message.method) {
        const vscodeMessage = message as VSCodeToDesignerMessage;
        // eslint-disable-next-line no-console
        console.log(
            `[VSCode Bridge] ← ${vscodeMessage.method}`,
            vscodeMessage.params ? { params: vscodeMessage.params } : ''
        );
        try {
            switch (vscodeMessage.method) {
                case 'setTheme':
                    handleSetTheme(vscodeMessage.params?.theme);
                    break;

                case 'setLanguage':
                    handleSetLanguage(vscodeMessage.params?.language);
                    break;

                default:
                    // eslint-disable-next-line no-console
                    console.warn(
                        `[VSCode Bridge] Unknown method: ${vscodeMessage.method}`
                    );
                    break;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            console.error(
                '[VSCode Bridge] Error processing command:',
                errorMessage
            );
        }
        return;
    }
};

/**
 * 处理设置主题
 */
const handleSetTheme = (theme: string) => {
    if (!theme) {
        return;
    }

    try {
        const appId = getMetaApi(META_SERVICE.GlobalService)?.getBaseInfo()?.id;
        if (appId) {
            localStorage.setItem(`tiny-engine-theme-${appId}`, theme);
        }

        document.documentElement.setAttribute('data-theme', theme);

        // 切换 Monaco Editor 主题
        const editorTheme = theme?.includes('dark') ? 'vs-dark' : 'vs';
        setGlobalMonacoEditorTheme(editorTheme);

        // 通知主题服务（如果存在）
        const themeService = getMetaApi(META_SERVICE.ThemeSwitch);
        if (themeService?.themeChange) {
            themeService.themeChange(theme);
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        console.error('[VSCode Bridge] Failed to set theme:', errorMessage);
    }
};

/**
 * 处理设置语言
 */
const handleSetLanguage = (language: string) => {
    if (!language) {
        return;
    }

    const mappedLang = LANGUAGE_MAP[language] || language;
    switchLanguage(mappedLang);
};

/**
 * 设计器调用插件：获取初始化数据
 * @param callback 回调函数，接收初始化数据
 */
export const getInitData = (callback: (data: InitData) => void) => {
    const isVSCode = checkIsVSCodeEnvironment();
    if (!isVSCode) {
        callback({});
        return;
    }

    const callbackId = generateRequestId();

    callbackMap.set(callbackId, (result, error) => {
        if (error) {
            // eslint-disable-next-line no-console
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            console.error(`[VSCode Bridge] getInitData ← error:`, errorMessage);
            callback({});
        } else {
            // eslint-disable-next-line no-console
            console.log(`[VSCode Bridge] getInitData ← success:`, result);
            callback((result as InitData) || {});
        }
    });

    sendMessageToVSCode('getInitData', callbackId);
};

/**
 * 设计器调用插件：保存数据
 * @param data 要保存的数据
 * @param callback 可选的回调函数，接收保存结果
 */
export const goSave = (
    data: SaveData,
    callback?: (success: boolean, error?: any) => void
) => {
    const isVSCode = checkIsVSCodeEnvironment();
    if (!isVSCode) {
        callback?.(false, new Error('Not in VSCode environment, cannot save'));
        return;
    }

    const callbackId = generateRequestId();

    callbackMap.set(callbackId, (result, error) => {
        if (error) {
            // eslint-disable-next-line no-console
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            console.error(`[VSCode Bridge] goSave ← error:`, errorMessage);
            callback?.(false, error);
        } else {
            // eslint-disable-next-line no-console
            console.log(`[VSCode Bridge] goSave ← success`);
            callback?.(true, undefined);
        }
    });

    sendMessageToVSCode('goSave', callbackId, data);
};

/**
 * 设计器调用插件：预览
 * @param data 要预览的页面数据（格式与 goSave 相同）
 * @param callback 可选的回调函数，接收预览结果
 */
export const goPreview = (
    data: SaveData,
    callback?: (success: boolean, error?: any) => void
) => {
    const isVSCode = checkIsVSCodeEnvironment();
    if (!isVSCode) {
        callback?.(
            false,
            new Error('Not in VSCode environment, cannot preview')
        );
        return;
    }

    const callbackId = generateRequestId();

    callbackMap.set(callbackId, (result, error) => {
        if (error) {
            // eslint-disable-next-line no-console
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            console.error(`[VSCode Bridge] goPreview ← error:`, errorMessage);
            callback?.(false, error);
        } else {
            // eslint-disable-next-line no-console
            console.log(`[VSCode Bridge] goPreview ← success`);
            callback?.(true, undefined);
        }
    });

    sendMessageToVSCode('goPreview', callbackId, data);
};

/**
 * 检测是否在 VSCode 环境中
 * 根据插件代码分析：
 * 1. 插件将设计器 HTML 直接设置为 webview 内容（不是 iframe）
 * 2. 插件在 HTML 中注入了脚本，调用 acquireVsCodeApi() 并保存到 window.vscode
 * 3. 设计器应该检查 window.vscode 是否存在
 */
export const checkIsVSCodeEnvironment = (): boolean => {
    if (typeof window !== 'undefined' && (window as any).vscode) {
        return true;
    }

    // 兼容旧版本的 vscodeBridge（如果存在）
    if ((window as any).vscodeBridge) {
        return true;
    }

    return false;
};

/**
 * 初始化 VSCode 通信（在应用启动时调用）
 */
export const initVSCodeBridge = () => {
    const isVSCode = checkIsVSCodeEnvironment();

    if (!isVSCode) {
        // 只在开发环境输出 debug 信息，避免生产环境警告
        if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.debug(
                '[VSCode Bridge] Not in VSCode environment, communication disabled'
            );
        }
        return;
    }

    // 监听消息
    window.addEventListener('message', handleVSCodeMessage);

    // 立即请求初始化数据（不延迟，避免显示默认语言）
    // 使用 nextTick 确保消息监听器已注册
    Promise.resolve().then(() => {
        getInitData(data => {
            if (data.language) {
                const mappedLang = LANGUAGE_MAP[data.language] || data.language;
                switchLanguage(mappedLang);
            }

            if (data.theme) {
                handleSetTheme(data.theme);
            }
        });
    });
};

/**
 * 设计器调用插件：通用命令调用
 * 在VSCode环境中，通过插件执行指定的命令
 * @param command 命令名称（如 appDetail、pageList 等）
 * @param data 传递给插件的数据
 * @returns Promise<响应数据>
 */
export const callVSCodeCommand = (
    command: string,
    data?: any
): Promise<any> => {
    const isVSCode = checkIsVSCodeEnvironment();

    if (!isVSCode) {
        return Promise.reject(
            new Error('Not in VSCode environment, cannot call command')
        );
    }

    return new Promise((resolve, reject) => {
        const callbackId = generateRequestId();

        callbackMap.set(callbackId, (result, error) => {
            // 从 data 中提取 URL 信息用于日志
            const url = data?.url || 'unknown';
            const method = data?.method || 'unknown';

            if (error) {
                // eslint-disable-next-line no-console
                const errorMessage =
                    error instanceof Error ? error.message : String(error);
                console.error(
                    `[VSCode Bridge] ${command} ← error: ${method.toUpperCase()} ${url}`,
                    {
                        command,
                        url,
                        method,
                        error: errorMessage
                    }
                );
                reject(error);
            } else {
                // eslint-disable-next-line no-console
                console.log(
                    `[VSCode Bridge] ${command} ← success: ${method.toUpperCase()} ${url}`,
                    {
                        command,
                        url,
                        method,
                        result
                    }
                );
                resolve(result);
            }
        });

        sendMessageToVSCode(command, callbackId, data);
    });
};

/**
 * 设计器调用插件：HTTP请求代理（保留向后兼容）
 * 在VSCode环境中，通过插件代理HTTP请求到本地mockServer，解决跨域问题
 * @param config HTTP请求配置
 * @returns Promise<响应数据>
 */
export const proxyHttpRequest = (config: {
    url: string;
    method?: string;
    params?: any;
    data?: any;
    headers?: any;
}): Promise<any> => {
    // 使用新的通用函数，保持向后兼容
    return callVSCodeCommand('proxyHttpRequest', config);
};

/**
 * VSCode 通信 API（导出给外部使用）
 */
export const vscodeBridge = {
    getInitData,
    goSave,
    goPreview,
    proxyHttpRequest,
    callVSCodeCommand
};
