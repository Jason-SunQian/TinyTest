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

            const method = config.method || 'get';
            const command = findCommandForUrl(requestUrl, method);

            let response: { data: any; locale?: string };

            if (command) {
                // 需要插件处理的接口：使用对应的 command 调用插件
                // eslint-disable-next-line no-console
                console.log(
                    `[HTTP Service] Calling VSCode command: ${command} for ${
                        method.toUpperCase()
                    } ${requestUrl}`
                );

                const { callVSCodeCommand } = await import('../useVSCodeBridge');
                
                // 构建传递给插件的数据
                const commandData = {
                    url: requestUrl,
                    method,
                    params: config.params,
                    data: config.data,
                    headers: config.headers
                };

                const result = await callVSCodeCommand(command, commandData);
                
                // 插件返回的数据格式应该是 { data: {...}, locale?: 'zh-cn' }
                response = result || { data: null };
            } else {
                // 不需要插件处理的接口：从 mock 文件读取数据
                // eslint-disable-next-line no-console
                console.log(
                    `[HTTP Service] Using mock data for ${
                        method.toUpperCase()
                    } ${requestUrl}`
                );

                const mockResult = await getMockData(
                    requestUrl,
                    method,
                    config.params,
                    config.data
                );

                if (mockResult) {
                    response = mockResult;
                } else {
                    // 如果 mock 文件中没有找到，返回默认响应
                    // eslint-disable-next-line no-console
                    console.warn(
                        `[HTTP Service] No mock data found for ${method.toUpperCase()} ${requestUrl}, returning empty response`
                    );
                    response = { data: null };
                }
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

        // 确保adapter已经设置（防止某些请求在adapter设置之前发送）
        const http = HttpService.apis.getHttp();
        if (http) {
            const adapter = createVSCodeHttpAdapter();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (adapter && (http.defaults as any).adapter !== adapter) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (http.defaults as any).adapter = adapter;
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

    // 如果result是undefined或null，可能是数据格式问题
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
                '[HTTP Service] VSCode adapter created and set in axiosConfig'
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
                            '[HTTP Service] VSCode adapter set on axios instance'
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
