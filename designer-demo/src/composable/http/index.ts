/* eslint-disable max-lines */
import { createApp } from 'vue';
import { HttpService } from '@opentiny/tiny-engine';
import { useBroadcastChannel } from '@vueuse/core';
import { constants } from '@opentiny/tiny-engine-utils';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

import { useDesignerI18n } from '@/services/i18nService';
import { getMockData } from '@/utils/mockData';

import Login from './Login.vue';

const LOGIN_EXPIRED_CODE = 401;
const { BROADCAST_CHANNEL } = constants;

const { post: globalNotify } = useBroadcastChannel({
    name: BROADCAST_CHANNEL.Notify
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const procession: any = {
    promiseLogin: null,
    mePromise: {}
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let loginVM: any = null;

const showError = (url?: string, message?: string) => {
    const { locale } = useDesignerI18n();
    const isEn = locale.value === 'en_US';
    globalNotify({
        type: 'error',
        title: isEn ? 'API Error' : '接口报错',
        message: isEn
            ? `Error API: ${url}\nError message: ${message ?? ''}`
            : `报错接口: ${url} \n报错信息: ${message ?? ''}`
    });
};

// 固定 Mock 接口列表（必须走本地 mock，不走插件）
// 这4个接口在插件环境下固定返回本地 mock 数据，脱离对 mockServer 的依赖
interface FixedMockRoute {
    pattern: RegExp;
    method: string;
}

const FIXED_MOCK_ROUTES: FixedMockRoute[] = [
    {
        pattern: /^\/platform-center\/api\/user\/me$/,
        method: 'get'
    },
    {
        pattern: /^\/app-center\/api\/apps\/canvas\/lock$/,
        method: 'get'
    },
    {
        pattern: /^\/app-center\/api\/schema2code$/,
        method: 'post'
    },
    {
        pattern: /^\/app-center\/api\/preview\/metadata$/,
        method: 'get'
    }
];

/**
 * 检查是否是固定 Mock 接口
 * @param url 请求 URL
 * @param method 请求方法
 * @returns 如果是固定 Mock 接口返回 true，否则返回 false
 */
const isFixedMockRoute = (url: string, method: string): boolean => {
    const normalizedMethod = method.toLowerCase();

    // 1. 检查是否在固定 Mock 列表中
    if (
        FIXED_MOCK_ROUTES.some(
            route =>
                route.method === normalizedMethod && route.pattern.test(url)
        )
    ) {
        return true;
    }

    // 2. 检查是否是以 /mock/ 开头的路径（本地 mock 文件）
    // 这些路径都应该走本地 mock，不需要插件处理
    if (url.startsWith('/mock/')) {
        return true;
    }

    // 3. VSCode 环境下：material-center 接口固定走本地 mock，避免插件代理未配置导致无限报错 toast，
    // 进而淹没真正的物料 import 失败原因（区块加载错误的根因通常在 import()）。
    // designer-demo 已提供 mock/material-center.ts 覆盖这些路径。
    const win = window as Window & {
        vscode?: unknown;
        vscodeBridge?: unknown;
    };
    const isVsCodeEnv = !!(win.vscode || win.vscodeBridge);
    if (isVsCodeEnv && url.startsWith('/material-center/')) {
        return true;
    }

    return false;
};

// URL 到 command 的映射关系（需要插件处理的接口）
// 根据 MOCK_MIGRATION.md 第三章表格定义
interface UrlRoute {
    pattern: RegExp;
    method: string;
    command: string;
}

const urlRoutes: UrlRoute[] = [
    // 应用级接口
    {
        pattern: /^\/app-center\/api\/apps\/detail\/(.+)$/,
        method: 'get',
        command: 'appDetail'
    },
    {
        pattern: /^\/app-center\/v1\/api\/apps\/schema\/(.+)$/,
        method: 'get',
        command: 'appSchema'
    },
    {
        pattern: /^\/app-center\/api\/apps\/update\/(.+)$/,
        method: 'post',
        command: 'appUpdate'
    },
    // 页面级接口
    {
        pattern: /^\/app-center\/api\/pages\/list\/(.+)$/,
        method: 'get',
        command: 'pageList'
    },
    {
        pattern: /^\/app-center\/api\/pages\/detail\/(.+)$/,
        method: 'get',
        command: 'pageDetail'
    },
    {
        pattern: /^\/app-center\/api\/pages\/update\/(.+)$/,
        method: 'post',
        command: 'pageUpdate'
    },
    // 数据源接口
    {
        pattern: /^\/app-center\/api\/sources\/list\/(.+)$/,
        method: 'get',
        command: 'sourceList'
    },
    {
        pattern: /^\/app-center\/api\/sources\/detail\/(.+)$/,
        method: 'get',
        command: 'sourceDetail'
    },
    {
        pattern: /^\/app-center\/api\/sources\/create$/,
        method: 'post',
        command: 'sourceCreate'
    },
    {
        pattern: /^\/app-center\/api\/sources\/update\/(.+)$/,
        method: 'post',
        command: 'sourceUpdate'
    },
    {
        pattern: /^\/app-center\/api\/sources\/delete\/(.+)$/,
        method: 'get',
        command: 'sourceDelete'
    },
    // i18n 接口
    {
        pattern: /^\/app-center\/api\/i18n\/entries\/create$/,
        method: 'post',
        command: 'i18nCreate'
    },
    {
        pattern: /^\/app-center\/api\/i18n\/entries\/update$/,
        method: 'post',
        command: 'i18nUpdate'
    },
    // extension 接口
    {
        pattern: /^\/app-center\/api\/apps\/extension\/list$/,
        method: 'get',
        command: 'extensionList'
    },
    {
        pattern: /^\/app-center\/api\/apps\/extension\/create$/,
        method: 'post',
        command: 'extensionCreate'
    },
    {
        pattern: /^\/app-center\/api\/apps\/extension\/update$/,
        method: 'post',
        command: 'extensionUpdate'
    }
];

/**
 * 根据 URL 和 method 查找对应的 command
 * @param url 请求 URL
 * @param method 请求方法
 * @returns command 名称，如果不需要插件处理则返回 null
 */
const findCommandForUrl = (url: string, method: string): string | null => {
    const normalizedMethod = method.toLowerCase();

    for (const route of urlRoutes) {
        if (route.method === normalizedMethod && route.pattern.test(url)) {
            return route.command;
        }
    }

    return null;
};

// VSCode环境下的HTTP请求代理adapter
let vscodeHttpAdapter:
    | ((config: InternalAxiosRequestConfig) => Promise<unknown>)
    | null = null;

// 初始化VSCode HTTP adapter
const createVSCodeHttpAdapter = () => {
    if (vscodeHttpAdapter) {
        return vscodeHttpAdapter;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isVsCodeEnv = (window as any).vscode || (window as any).vscodeBridge;

    if (!isVsCodeEnv) {
        return null;
    }

    // 创建自定义adapter
    vscodeHttpAdapter = async (config: InternalAxiosRequestConfig) => {
        try {
            // 构建完整的URL（axios可能已经处理了baseURL，但我们需要确保URL格式正确）
            let requestUrl = config.url || '';

            // 如果URL是绝对路径（以/开头），保持原样；否则可能需要添加baseURL
            // 在VSCode环境下，baseURL通常是空字符串，所以相对路径就是相对于根路径
            if (
                !requestUrl.startsWith('http://') &&
                !requestUrl.startsWith('https://')
            ) {
                // 确保URL以/开头（相对路径）
                if (!requestUrl.startsWith('/')) {
                    requestUrl = `/${requestUrl}`;
                }
            }

            // 提取URL路径部分（去掉查询参数和hash），用于路由匹配
            // 例如：/app-center/api/apps/extension/list?app=1&category=utils -> /app-center/api/apps/extension/list
            let pathForMatching = requestUrl;
            const queryIndex = pathForMatching.indexOf('?');
            const hashIndex = pathForMatching.indexOf('#');

            if (queryIndex !== -1 || hashIndex !== -1) {
                const endIndex =
                    queryIndex !== -1 && hashIndex !== -1
                        ? Math.min(queryIndex, hashIndex)
                        : queryIndex !== -1
                        ? queryIndex
                        : hashIndex;
                pathForMatching = pathForMatching.substring(0, endIndex);
            }

            const method = config.method || 'get';

            // 按优先级处理请求：
            // 1. 固定 Mock 接口 → 本地 mock
            // 2. 插件接口 → 调用插件
            // 3. 未知接口 → 默认走插件（通过通用 proxyHttpRequest command）

            const isFixedMock = isFixedMockRoute(pathForMatching, method);
            const command = findCommandForUrl(pathForMatching, method);

            // 调试用：查看请求走固定 Mock 还是插件（便于排查插件环境下接口与物料加载）
            // eslint-disable-next-line no-console
            console.log(
                `[HTTP Service] 请求处理: ${method.toUpperCase()} ${requestUrl}`,
                {
                    isFixedMock,
                    command:
                        command ||
                        (isFixedMock ? 'fixed-mock' : 'proxyHttpRequest'),
                    normalizedUrl: requestUrl
                }
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let response: { data: any; locale?: string } = { data: null };

            if (isFixedMock) {
                const mockResult = await getMockData(
                    requestUrl,
                    method,
                    config.params,
                    config.data
                );

                if (mockResult) {
                    response = mockResult;
                    // eslint-disable-next-line no-console
                    console.log(
                        `[HTTP Service] 固定 Mock 返回: ${method.toUpperCase()} ${requestUrl}`
                    );
                } else {
                    // eslint-disable-next-line no-console
                    console.warn(
                        `[HTTP Service] 固定 Mock 未找到数据: ${method.toUpperCase()} ${requestUrl}，返回空响应`
                    );
                    response = { data: null };
                }
            } else if (command) {
                const { callVSCodeCommand } = await import(
                    '../useVSCodeBridge'
                );

                // 构建传递给插件的数据
                const commandData = {
                    url: requestUrl,
                    method,
                    params: config.params,
                    data: config.data,
                    headers: config.headers
                };

                const result = await callVSCodeCommand(command, commandData);

                response = result || { data: null };
                // eslint-disable-next-line no-console
                console.log(
                    `[HTTP Service] 插件接口返回: ${method.toUpperCase()} ${requestUrl}`,
                    { command }
                );
            } else {
                const { callVSCodeCommand } = await import(
                    '../useVSCodeBridge'
                );

                // 构建传递给插件的数据
                const commandData = {
                    url: requestUrl,
                    method,
                    params: config.params,
                    data: config.data,
                    headers: config.headers,
                    // 如果是图片请求，指定 responseType
                    responseType:
                        config.responseType ||
                        (requestUrl.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)/i)
                            ? 'arraybuffer'
                            : undefined)
                };

                // 使用通用的 proxyHttpRequest command
                const result = await callVSCodeCommand(
                    'proxyHttpRequest',
                    commandData
                );

                response = result || { data: null };
                // eslint-disable-next-line no-console
                console.log(
                    `[HTTP Service] 插件返回(未知接口): ${method.toUpperCase()} ${requestUrl}`
                );
            }

            // 返回符合axios响应格式的数据
            return {
                data: response,
                status: 200,
                statusText: 'OK',
                headers: {},
                config
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            // eslint-disable-next-line no-console
            console.error(
                `[HTTP Service] ${config.method?.toUpperCase() || 'GET'} ${
                    config.url
                } failed:`,
                error?.message || error
            );
            // 如果代理失败，返回错误响应
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errorResponse = {
                data: { error: error?.message || 'Request failed' },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                status: (error as any)?.status || 500,
                statusText:
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (error as any)?.statusText || 'Internal Server Error',
                headers: {},
                config
            };
            return Promise.reject(errorResponse);
        }
    };

    return vscodeHttpAdapter;
};

const preRequest = (
    config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
    const isDevelopEnv = (import.meta.env.MODE as string | undefined)?.includes(
        'dev'
    );

    if (isDevelopEnv && config.url.match(/\/generate\//)) {
        config.baseURL = '';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isVsCodeEnv = (window as any).vscode || (window as any).vscodeBridge;

    if (isVsCodeEnv) {
        config.baseURL = '';

        // 在 VSCode 环境中，所有请求都应该被 adapter 拦截
        // 如果看到网络请求，说明 adapter 没有正确设置

        // 确保adapter已经设置（防止某些请求在adapter设置之前发送）
        const http = HttpService.apis.getHttp();
        if (http) {
            const adapter = createVSCodeHttpAdapter();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (adapter && (http.defaults as any).adapter !== adapter) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (http.defaults as any).adapter = adapter;
                // eslint-disable-next-line no-console
                console.log(
                    '[HTTP Service] VSCode adapter 已设置，请求将走拦截'
                );
            }
        }

        // 如果config中没有adapter，尝试设置（某些情况下axios会使用config.adapter而不是defaults.adapter）
        if (!config.adapter) {
            const adapter = createVSCodeHttpAdapter();
            if (adapter) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                config.adapter = adapter;
            }
        }
    } else if (config.url?.includes('/platform-center/api/user/me')) {
        // eslint-disable-next-line no-console
        console.log(
            `[HTTP Service] 非 VSCode 环境: ${
                config.method?.toUpperCase() || 'GET'
            } ${config.url} 将发往服务器`
        );
    }

    return config;
};

const preResponse = (
    res: AxiosResponse<{ data?: unknown; error?: { message?: string } }>
) => {
    if (res.data?.error) {
        showError(res.config?.url, res?.data?.error?.message);
        return Promise.reject(res.data.error);
    }

    // 返回 res.data.data，这是mockServer的标准格式
    const result = res.data?.data;

    if (result === undefined || result === null) {
        // eslint-disable-next-line no-console
        console.warn(`[HTTP Service] Empty response for ${res.config?.url}`);
    }

    return result;
};

const openLogin = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).lowcode) {
        const loginDom = document.createElement('div');
        document.body.appendChild(loginDom);
        loginVM = createApp(Login).mount(loginDom);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).lowcode = {
            platformCenter: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                Session: {
                    rebuiltCallback() {
                        loginVM.closeLogin();

                        procession.mePromise.resolve('login ok');
                        procession.promiseLogin = null;
                        procession.mePromise = {};
                    }
                }
            }
        };
    }

    return new Promise((resolve, reject) => {
        if (!procession.promiseLogin) {
            procession.promiseLogin = loginVM.openLogin(
                procession,
                '/api/rebuildSession'
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            procession.promiseLogin.then((response: any) => {
                HttpService.apis
                    .request(response.config)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .then(resolve as any, reject as any);
            });
        }
    });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorResponse = (error: any) => {
    const { response } = error;

    if (response?.status === LOGIN_EXPIRED_CODE) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).vscodeBridge || (window as any).vscode) {
            return Promise.resolve(true);
        }

        if (response?.headers['x-login-url']) {
            return openLogin();
        }
    }

    showError(error.config?.url, error?.message);

    return response?.data.error
        ? Promise.reject(response.data.error)
        : Promise.reject(error.message);
};

const getConfig = (env = import.meta.env) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseURL = (env as any).VITE_ORIGIN;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dev = (env as any).MODE?.includes('dev');
    const getTenant = () => new URLSearchParams(location.search).get('tenant');

    return {
        baseURL,
        withCredentials: dev,
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            ...(dev && { 'x-lowcode-mode': 'develop' }),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'x-lowcode-org': getTenant()
        }
    };
};

const customizeHttpService = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isVsCodeEnv = (window as any).vscode || (window as any).vscodeBridge;

    const axiosConfig = getConfig();

    // 在VSCode环境中，设置自定义adapter来代理HTTP请求
    if (isVsCodeEnv) {
        const adapter = createVSCodeHttpAdapter();
        if (adapter) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (axiosConfig as any).adapter = adapter;
            // eslint-disable-next-line no-console
            console.log(
                '[HTTP Service] VSCode adapter 已创建并设置到 axiosConfig'
            );
        } else {
            // eslint-disable-next-line no-console
            console.warn('[HTTP Service] Failed to create VSCode adapter');
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = {
        axiosConfig,
        interceptors: {
            request: [preRequest],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            response: [[preResponse, errorResponse]]
        }
    };

    HttpService.apis.setOptions(options);

    // 在设置options后，确保adapter被正确设置（因为HttpService可能在setOptions后才初始化）
    if (isVsCodeEnv) {
        // 使用更可靠的方式确保adapter被设置
        const ensureAdapter = () => {
            const http = HttpService.apis.getHttp();
            if (http) {
                const adapter = createVSCodeHttpAdapter();
                if (adapter) {
                    // 检查是否已经设置了adapter
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if ((http.defaults as any).adapter !== adapter) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (http.defaults as any).adapter = adapter;
                        // eslint-disable-next-line no-console
                        console.log(
                            '[HTTP Service] VSCode adapter 已设置到 axios 实例'
                        );
                    }
                }
            } else {
                // 如果HttpService还没初始化，稍后重试
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setTimeout(ensureAdapter, 50);
            }
        };

        // 立即尝试设置，如果失败则延迟重试
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ensureAdapter();
    }

    return HttpService;
};

export default customizeHttpService();
