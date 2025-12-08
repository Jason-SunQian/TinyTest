/**
 * 迁移自 src/main.js，无类型改动，保持行为一致
 */
import { configurators } from './configurators';
import 'virtual:svg-icons-register';
import { loadDesignerI18n, switchLanguage } from './services/i18nService';
import { startPageStatusGuard } from './composable/pageStatusGuard';
import {DEFAULT_LANGUAGE} from "@/config/languages";

async function startApp() {
    const registry = await import('../registry');
    const { init } = await import('@opentiny/tiny-engine');

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
            },
            appCreated: () => {
                // 强制设置为英文
                switchLanguage(DEFAULT_LANGUAGE);
                startPageStatusGuard();
            }
        }
    });
}

startApp();
