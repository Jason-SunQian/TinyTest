/**
 * 迁移自 src/main.js，无类型改动，保持行为一致
 */
/* eslint-disable import/order */
import { DEFAULT_LANGUAGE } from '@/config/languages';

import { configurators } from './configurators';
import 'virtual:svg-icons-register';
import { loadDesignerI18n, switchLanguage } from './services/i18nService';
import { startPageStatusGuard } from './composable/pageStatusGuard';
import { setupCanvasI18nRenderer } from './composable/setupCanvasI18nRenderer';
import {
    initVSCodeBridge,
    checkIsVSCodeEnvironment
} from './composable/useVSCodeBridge';
import useNotifyI18n from './utils/useNotifyI18n';

async function startApp() {
    const registry = await import('../registry');
    const { init, initHook, HOOK_NAME } = await import('@opentiny/tiny-engine');

    init({
        // 合并多个注册表
        registry: [registry.default],
        configurators,
        createAppSignal: ['global_service_init_finish'],
        // 添加生命周期钩子
        lifeCycles: {
            beforeAppCreate: () => {
                // eslint-disable-next-line no-console
                console.log('🚀 designer-demo 开始初始化...');
                // 确保国际化在应用创建前加载
                loadDesignerI18n();
                // 覆盖 useNotify hook，使用国际化版本
                initHook(HOOK_NAME.useNotify, useNotifyI18n, {
                    useDefaultExport: true
                });
                // 初始化 VSCode 通信（如果是在 VSCode 环境中）
                initVSCodeBridge();
            },
            appCreated: () => {
                // 在 VSCode 环境中，先设置为英文（避免显示中文），然后等待 VSCode 插件配置
                // 如果不在 VSCode 环境中，则使用默认语言
                if (checkIsVSCodeEnvironment()) {
                    // VSCode 环境：先设置为英文，避免初始化时显示中文
                    // getInitData 回调会在收到 VSCode 配置后更新语言（如果有的话）
                    switchLanguage(DEFAULT_LANGUAGE);
                } else {
                    // 非 VSCode 环境，使用默认语言
                    switchLanguage(DEFAULT_LANGUAGE);
                }

                startPageStatusGuard();
                // 设置国际化的 Canvas Renderer（用于空画布提示）
                setupCanvasI18nRenderer();
            }
        }
    });
}

startApp();
