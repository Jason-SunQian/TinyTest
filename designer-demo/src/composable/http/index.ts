import { createApp } from 'vue';
import { HttpService } from '@opentiny/tiny-engine';
import { useBroadcastChannel } from '@vueuse/core';
import { constants } from '@opentiny/tiny-engine-utils';

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
    globalNotify({
        type: 'error',
        title: '接口报错',
        message: `报错接口: ${url} \n报错信息: ${message ?? ''}`
    });
};

// VSCode环境下的HTTP请求代理adapter
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let vscodeHttpAdapter: any = null;

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
    vscodeHttpAdapter = async (config: any) => {
        try {
            // 动态导入，避免循环依赖
            const { proxyHttpRequest } = await import('../useVSCodeBridge');
            
            // 构建完整的URL（axios可能已经处理了baseURL，但我们需要确保URL格式正确）
            let requestUrl = config.url || '';
            
            // 如果URL是绝对路径（以/开头），保持原样；否则可能需要添加baseURL
            // 在VSCode环境下，baseURL通常是空字符串，所以相对路径就是相对于根路径
            if (!requestUrl.startsWith('http://') && !requestUrl.startsWith('https://')) {
                // 确保URL以/开头（相对路径）
                if (!requestUrl.startsWith('/')) {
                    requestUrl = '/' + requestUrl;
                }
            }
            
            // eslint-disable-next-line no-console
            console.log(`[HTTP Service] Proxying ${config.method?.toUpperCase() || 'GET'} ${requestUrl} via VSCode Bridge`);
            
            const response = await proxyHttpRequest({
                url: requestUrl,
                method: config.method || 'get',
                params: config.params,
                data: config.data,
                headers: config.headers
            });
            
            // mockServer返回的格式通常是 { data: {...}, locale: 'zh-cn' }
            // 我们需要保持这个格式，让preResponse拦截器处理
            // 返回符合axios响应格式的数据
            return {
                data: response, // response 已经是 { data: {...}, locale: 'zh-cn' } 格式
                status: 200,
                statusText: 'OK',
                headers: {},
                config: config
            };
        } catch (error: any) {
            // eslint-disable-next-line no-console
            console.error(`[HTTP Service] ${config.method?.toUpperCase() || 'GET'} ${config.url} failed:`, error?.message || error);
            // 如果代理失败，返回错误响应
            const errorResponse = {
                data: { error: error?.message || 'Request failed' },
                status: error?.status || 500,
                statusText: error?.statusText || 'Internal Server Error',
                headers: {},
                config: config
            };
            return Promise.reject(errorResponse);
        }
    };

    return vscodeHttpAdapter;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const preRequest = (config: any) => {
    const isDevelopEnv = import.meta.env.MODE?.includes('dev');

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
            if (adapter && (http.defaults as any).adapter !== adapter) {
                (http.defaults as any).adapter = adapter;
            }
        }
        
        // 如果config中没有adapter，尝试设置（某些情况下axios会使用config.adapter而不是defaults.adapter）
        if (!config.adapter) {
            const adapter = createVSCodeHttpAdapter();
            if (adapter) {
                config.adapter = adapter;
            }
        }
    }

    return config;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const preResponse = (res: any) => {
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
            (axiosConfig as any).adapter = adapter;
            // eslint-disable-next-line no-console
            console.log('[HTTP Service] VSCode adapter created and set in axiosConfig');
        } else {
            // eslint-disable-next-line no-console
            console.warn('[HTTP Service] Failed to create VSCode adapter');
        }
    }

    const options = {
        axiosConfig,
        interceptors: {
            request: [preRequest],
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
                    if ((http.defaults as any).adapter !== adapter) {
                        (http.defaults as any).adapter = adapter;
                        // eslint-disable-next-line no-console
                        console.log('[HTTP Service] VSCode adapter set on axios instance');
                    }
                }
            } else {
                // 如果HttpService还没初始化，稍后重试
                setTimeout(ensureAdapter, 50);
            }
        };
        
        // 立即尝试设置，如果失败则延迟重试
        ensureAdapter();
    }

    return HttpService;
};

export default customizeHttpService();
