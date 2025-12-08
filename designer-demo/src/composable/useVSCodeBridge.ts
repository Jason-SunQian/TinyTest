/**
 * VSCode 通信服务
 * 用于处理设计器与 VSCode 插件之间的双向通信
 * 采用 RPC 风格，支持 callback 回调
 */

import { isVsCodeEnv } from '@opentiny/tiny-engine-common/js/environments';
import { setGlobalMonacoEditorTheme } from '@opentiny/tiny-engine-common';
import { switchLanguage, t as translate } from '../services/i18nService';
import { getMetaApi, META_SERVICE } from '@opentiny/tiny-engine-meta-register';

// 消息类型定义
interface VSCodeMessage {
    source: 'vscode' | 'designer';
    method: string; // 方法名
    requestId?: string; // 请求ID，用于 callback 匹配
    params?: any; // 参数
    result?: any; // 返回结果（用于 callback）
    error?: any; // 错误信息
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
const callbackMap = new Map<string, (result?: any, error?: any) => void>();

// 生成唯一请求ID
let requestIdCounter = 0;
const generateRequestId = (): string => {
    return `req_${Date.now()}_${++requestIdCounter}`;
};

/**
 * 向 VSCode 插件发送消息
 * 设计器在 iframe 中运行，需要通过 postMessage 与父窗口通信
 */
const sendMessageToVSCode = (message: Omit<VSCodeMessage, 'source'>) => {
    const fullMessage: VSCodeMessage = {
        source: 'designer',
        ...message
    };

    if (window.parent && window.parent !== window) {
        // 在 iframe 中，通过 postMessage 发送到父窗口
        window.parent.postMessage(fullMessage, '*');
    } else if (typeof window !== 'undefined' && (window as any).acquireVsCodeApi) {
        // 如果直接运行在 webview 中（非 iframe），使用 VSCode API
        const vscode = (window as any).acquireVsCodeApi();
        vscode.postMessage(fullMessage);
    }
};

/**
 * 处理来自 VSCode 的消息
 */
const handleVSCodeMessage = (event: MessageEvent) => {
    const message = event.data as VSCodeMessage;

    // 只处理来自 VSCode 的消息
    if (message.source !== 'vscode') {
        return;
    }

    const { method, requestId, params, result, error } = message;

    // 如果是 callback 响应
    if (requestId && callbackMap.has(requestId)) {
        const callback = callbackMap.get(requestId)!;
        callbackMap.delete(requestId);
        callback(result, error);
        return;
    }

    // 处理插件调用设计器的方法
    switch (method) {
        case 'setTheme':
            handleSetTheme(params?.theme);
            break;

        case 'setLanguage':
            handleSetLanguage(params?.language);
            break;

        default:
            // eslint-disable-next-line no-console
            console.warn(`${translate('designer.vscode.unknownMethodCall')}: ${method}`);
            break;
    }
};

/**
 * 处理设置主题
 */
const handleSetTheme = (theme: string) => {
    if (!theme) {
        // eslint-disable-next-line no-console
        console.warn(translate('designer.vscode.themeParamEmpty'));
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
        console.error(translate('designer.vscode.setThemeFailed'), error);
    }
};

/**
 * 处理设置语言
 */
const handleSetLanguage = (language: string) => {
    if (!language) {
        // eslint-disable-next-line no-console
        console.warn(translate('designer.vscode.languageParamEmpty'));
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
    if (!isVsCodeEnv) {
        // 非 VSCode 环境，直接返回空配置
        callback({});
        return;
    }

    const requestId = generateRequestId();
    callbackMap.set(requestId, (result, error) => {
        if (error) {
            // eslint-disable-next-line no-console
            console.error(translate('designer.vscode.getInitDataFailed'), error);
            callback({});
        } else {
            callback(result || {});
        }
    });

    sendMessageToVSCode({
        method: 'getInitData',
        requestId
    });
};

/**
 * 设计器调用插件：保存数据
 * @param data 要保存的数据
 * @param callback 可选的回调函数，接收保存结果
 */
export const goSave = (data: SaveData, callback?: (success: boolean, error?: any) => void) => {
    if (!isVsCodeEnv) {
        // eslint-disable-next-line no-console
        console.warn(translate('designer.vscode.vscodeEnvRequired'));
        callback?.(false, new Error(translate('designer.vscode.vscodeEnvRequired')));
        return;
    }

    const requestId = generateRequestId();
    callbackMap.set(requestId, (result, error) => {
        if (error) {
            // eslint-disable-next-line no-console
            console.error(translate('designer.vscode.goSaveFailed'), error);
            callback?.(false, error);
        } else {
            callback?.(true, undefined);
        }
    });

    sendMessageToVSCode({
        method: 'goSave',
        requestId,
        params: data
    });
};

/**
 * 设计器调用插件：预览
 * @param callback 可选的回调函数，接收预览结果
 */
export const goPreview = (callback?: (success: boolean, error?: any) => void) => {
    if (!isVsCodeEnv) {
        // eslint-disable-next-line no-console
        console.warn(translate('designer.vscode.vscodeEnvRequired'));
        callback?.(false, new Error(translate('designer.vscode.vscodeEnvRequired')));
        return;
    }

    const requestId = generateRequestId();
    callbackMap.set(requestId, (result, error) => {
        if (error) {
            // eslint-disable-next-line no-console
            console.error(translate('designer.vscode.goPreviewFailed'), error);
            callback?.(false, error);
        } else {
            callback?.(true, undefined);
        }
    });

    sendMessageToVSCode({
        method: 'goPreview',
        requestId
    });
};

/**
 * 初始化 VSCode 通信（在应用启动时调用）
 */
export const initVSCodeBridge = () => {
    if (!isVsCodeEnv) {
        return;
    }

    // 监听消息
    window.addEventListener('message', handleVSCodeMessage);

    // 延迟请求初始化数据
    setTimeout(() => {
        getInitData((data) => {
            // 处理初始化数据
            if (data.language) {
                const mappedLang = LANGUAGE_MAP[data.language] || data.language;
                switchLanguage(mappedLang);
            }

            if (data.theme) {
                handleSetTheme(data.theme);
            }
        });
    }, 1000);
};

/**
 * VSCode 通信 API（导出给外部使用）
 */
export const vscodeBridge = {
    getInitData,
    goSave,
    goPreview
};
