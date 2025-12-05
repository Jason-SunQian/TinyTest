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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const preRequest = (config: any) => {
    const isDevelopEnv = import.meta.env.MODE?.includes('dev');

    if (isDevelopEnv && config.url.match(/\/generate\//)) {
        config.baseURL = '';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isVsCodeEnv = (window as any).vscodeBridge;

    if (isVsCodeEnv) {
        config.baseURL = '';
    }

    return config;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const preResponse = (res: any) => {
    if (res.data?.error) {
        showError(res.config?.url, res?.data?.error?.message);

        return Promise.reject(res.data.error);
    }

    return res.data?.data;
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
        if ((window as any).vscodeBridge) {
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
    const options = {
        axiosConfig: getConfig(),
        interceptors: {
            request: [preRequest],
            response: [[preResponse, errorResponse]]
        }
    };

    HttpService.apis.setOptions(options);

    return HttpService;
};

export default customizeHttpService();
