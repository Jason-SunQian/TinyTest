/**
 * VSCode 通信服务
 * 用于处理设计器与 VSCode 插件之间的双向通信
 * 采用 RPC 风格，支持 callback 回调
 */

/* eslint-disable @typescript-eslint/no-explicit-any, no-inline-comments, line-comment-position, @typescript-eslint/naming-convention, camelcase, import/order, @typescript-eslint/no-use-before-define */
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
 * 设计器在 iframe 中运行，需要通过 postMessage 与父窗口通信
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
            vscode.postMessage(pluginMessage);
            // eslint-disable-next-line no-console
            console.log(`[VSCode Bridge] → ${command}`, data !== undefined ? { data } : '');
            return;
        }

        // 如果在 iframe 中运行（备用方案）
        if (window.parent && window.parent !== window) {
            const messageToSend = {
                source: 'designer',
                ...pluginMessage
            };
            window.parent.postMessage(messageToSend, '*');
            // eslint-disable-next-line no-console
            console.log(`[VSCode Bridge] → ${command} (iframe)`, data !== undefined ? { data } : '');
            return;
        }

        // eslint-disable-next-line no-console
        console.error('[VSCode Bridge] Failed to send message: No communication channel available');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[VSCode Bridge] Error sending message:', error);
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
    if (message.command && typeof message.command === 'string' && callbackMap.has(message.command)) {
        const callback = callbackMap.get(message.command)!;
        callbackMap.delete(message.command);
        // eslint-disable-next-line no-console
        console.log(`[VSCode Bridge] ← callback: ${message.command}`, message.data !== undefined ? { data: message.data } : '');
        try {
            callback(message.data, undefined);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('[VSCode Bridge] Error executing callback:', error);
        }
        return;
    }

    // 处理未匹配的 callback
    if (message.command && typeof message.command === 'string' && !callbackMap.has(message.command)) {
        // eslint-disable-next-line no-console
        console.warn('[VSCode Bridge] Unknown callback:', message.command);
        return;
    }

    // 处理插件调用设计器的方法（通过 webview HTML 转发）
    // 插件调用格式：{ source: 'vscode', method: string, params?: any }
    if (message.source === 'vscode' && message.method) {
        const vscodeMessage = message as VSCodeToDesignerMessage;
        // eslint-disable-next-line no-console
        console.log(`[VSCode Bridge] ← ${vscodeMessage.method}`, vscodeMessage.params ? { params: vscodeMessage.params } : '');
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
                    console.warn(`[VSCode Bridge] Unknown method: ${vscodeMessage.method}`);
                    break;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('[VSCode Bridge] Error processing command:', error);
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
        console.error('[VSCode Bridge] Failed to set theme:', error);
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
    // eslint-disable-next-line no-console
    console.log(`[VSCode Bridge] Language mapping: "${language}" → "${mappedLang}"`);
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
            console.error('[VSCode Bridge] getInitData error:', error);
            callback({});
        } else {
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
        callback?.(
            false,
            new Error('Not in VSCode environment, cannot save')
        );
        return;
    }

    const callbackId = generateRequestId();
    
    callbackMap.set(callbackId, (result, error) => {
        if (error) {
            // eslint-disable-next-line no-console
            console.error('[VSCode Bridge] goSave error:', error);
            callback?.(false, error);
        } else {
            callback?.(true, undefined);
        }
    });

    sendMessageToVSCode('goSave', callbackId, data);
};

/**
 * 设计器调用插件：预览
 * @param callback 可选的回调函数，接收预览结果
 */
export const goPreview = (
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
            console.error('[VSCode Bridge] goPreview error:', error);
            callback?.(false, error);
        } else {
            callback?.(true, undefined);
        }
    });

    sendMessageToVSCode('goPreview', callbackId);
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

    if ((window as any).vscodeBridge) {
        return true;
    }

    if (window.parent && window.parent !== window) {
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
        // eslint-disable-next-line no-console
        console.warn('[VSCode Bridge] Not in VSCode environment, communication disabled');
        return;
    }

    // 检查通信通道
    const vscode = getVSCodeApi();
    const communicationMethod = vscode ? 'window.vscode.postMessage' : 
                                 (window.parent && window.parent !== window ? 'window.parent.postMessage (iframe)' : 'none');
    
    // 监听消息
    window.addEventListener('message', handleVSCodeMessage);
    // eslint-disable-next-line no-console
    console.log('[VSCode Bridge] Initialized, communication method:', communicationMethod);

    // 立即请求初始化数据（不延迟，避免显示默认语言）
    // 使用 nextTick 确保消息监听器已注册
    Promise.resolve().then(() => {
        // eslint-disable-next-line no-console
        console.log('[VSCode Bridge] Requesting initial data...');
        getInitData(data => {
            // eslint-disable-next-line no-console
            console.log('[VSCode Bridge] getInitData callback received:', data);
            if (data.language) {
                const mappedLang = LANGUAGE_MAP[data.language] || data.language;
                // eslint-disable-next-line no-console
                console.log(`[VSCode Bridge] Language mapping: "${data.language}" → "${mappedLang}"`);
                // eslint-disable-next-line no-console
                console.log('[VSCode Bridge] Calling switchLanguage with:', mappedLang);
                
                // 获取当前语言（用于对比）
                const instance: any = (window as any).lowcodeI18n;
                const beforeLang = instance?.global?.locale?.value;
                // eslint-disable-next-line no-console
                console.log('[VSCode Bridge] Language before switchLanguage:', beforeLang);
                
                const result = switchLanguage(mappedLang);
                
                // 立即验证语言是否真的改变了
                const afterLang = instance?.global?.locale?.value;
                // eslint-disable-next-line no-console
                console.log('[VSCode Bridge] Language immediately after switchLanguage:', afterLang, 'Expected:', mappedLang, 'Match:', afterLang === mappedLang);
                
                // 延迟再次验证，看是否有其他地方覆盖了
                setTimeout(() => {
                    const finalLang = instance?.global?.locale?.value;
                    // eslint-disable-next-line no-console
                    console.log('[VSCode Bridge] Language 100ms after switchLanguage:', finalLang, 'Expected:', mappedLang, 'Match:', finalLang === mappedLang);
                    if (finalLang !== mappedLang) {
                        // eslint-disable-next-line no-console
                        console.warn('[VSCode Bridge] Language was changed after switchLanguage! Something is overriding it.');
                    }
                }, 100);
                
                // eslint-disable-next-line no-console
                console.log('[VSCode Bridge] switchLanguage result:', result);
            } else {
                // eslint-disable-next-line no-console
                console.warn('[VSCode Bridge] No language data received from VSCode');
            }

            if (data.theme) {
                // eslint-disable-next-line no-console
                console.log('[VSCode Bridge] Setting theme:', data.theme);
                handleSetTheme(data.theme);
            }
        });
    });
};

/**
 * VSCode 通信 API（导出给外部使用）
 */
export const vscodeBridge = {
    getInitData,
    goSave,
    goPreview
};
