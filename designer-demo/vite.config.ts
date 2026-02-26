/* eslint-disable */
import path from 'node:path';
import fs from 'node:fs';

import { defineConfig, mergeConfig } from 'vite';
import { useTinyEngineBaseConfig } from '@opentiny/tiny-engine-vite-config';
import { viteMockServe } from 'vite-plugin-mock';
import dotenv from 'dotenv';

/** 保证 webview iframe（Origin 为 null / vscode-webview）能加载物料脚本/样式，避免 403 / CORS 导致 Failed to fetch dynamically imported module */
function mockMaterialsCorsPlugin() {
    return {
        name: 'mock-materials-cors',
        configureServer(server: any) {
            // 用 use 注册到最前，确保优先处理 /mock/materials/，避免被其他中间件或 Vite 默认逻辑返回 403
            const handler = (req: any, res: any, next: () => void) => {
                const raw = (req.originalUrl ?? req.url) || '';
                const url = raw.split('?')[0];
                if (!url.startsWith('/mock/materials/')) {
                    return next();
                }
                // CORS 预检
                const method = (req.method || 'GET').toUpperCase();
                if (method === 'OPTIONS') {
                    res.statusCode = 204;
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
                    res.setHeader('Access-Control-Allow-Headers', '*');
                    res.setHeader('Access-Control-Max-Age', '86400');
                    return res.end();
                }
                const publicDir = path.resolve(__dirname, 'public');
                const filePath = path.join(publicDir, url.replace(/^\//, ''));
                if (!filePath.startsWith(publicDir) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
                    return next();
                }
                // eslint-disable-next-line no-console
                console.log('[mock-materials-cors]', url);
                res.statusCode = 200;
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', '*');
                res.setHeader('Cache-Control', 'no-cache');
                const ext = path.extname(url).toLowerCase();
                if (ext === '.js') res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
                else if (ext === '.css') res.setHeader('Content-Type', 'text/css; charset=utf-8');
                fs.createReadStream(filePath).pipe(res);
            };
            // 必须在栈首处理，否则可能被 Vite 内置逻辑先处理导致 403
            return () => {
                const stack = server.middlewares.stack;
                if (Array.isArray(stack)) {
                    stack.unshift({ route: '', handle: handler });
                } else {
                    server.middlewares.use(handler);
                }
            };
        }
    };
}

export default defineConfig(configEnv => {
    // 手动加载环境变量
    dotenv.config({ path: './env/.env.local' });

    // 如果环境变量仍然未定义，直接设置
    if (!process.env.VITE_USE_MOCK) {
        process.env.VITE_USE_MOCK = 'true';
    }

    // 先加载环境变量
    const useMock = process.env.VITE_USE_MOCK === 'true';
    // eslint-disable-next-line no-console
    console.log('VITE_USE_MOCK:', process.env.VITE_USE_MOCK);
    // eslint-disable-next-line no-console
    console.log('使用 Mock 模式:', useMock);

    const baseConfig = useTinyEngineBaseConfig({
        viteConfigEnv: configEnv,
        root: __dirname,
        iconDirs: [
            path.resolve(
                __dirname,
                './node_modules/@opentiny/tiny-engine/assets/'
            )
        ],
        useSourceAlias: false,
        envDir: './env',
        registryPath: './registry.ts'
    });

    const customConfig = {
        envDir: './env',
        publicDir: path.resolve(__dirname, './public'),
        resolve: {
            alias: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '@': path.resolve(__dirname, './src')
            }
        },
        optimizeDeps: {
            exclude: ['source-map-js']
            // include: ['@opentiny/tiny-engine-common']
        },
        server: {
            port: 8090,
            // 插件 webview 内 iframe 请求物料脚本/样式时 Origin 可能为 null 或 vscode-webview，需放行避免 403
            cors: true,
            allowedHosts: ['localhost', '127.0.0.1', 'null']
        },
        plugins: [
            mockMaterialsCorsPlugin(),
            viteMockServe({
                mockPath: 'mock',
                enable: useMock,
                watchFiles: true,
                logger: true
            })
        ]
    };

    return mergeConfig(baseConfig, customConfig);
});
