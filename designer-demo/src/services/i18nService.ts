import { shallowRef } from 'vue';
import type { Ref } from 'vue';

import designerI18n from '../i18n';
import {
    DEFAULT_LANGUAGE,
    getEnabledLanguages,
    isLanguageSupported
} from '../config/languages';
import type { LanguageConfig } from '../config/languages';

/* eslint-disable @typescript-eslint/no-explicit-any, no-console, import/exports-last */
let warned = false;
const getI18nInstance = () => {
    const inst = (window as any).lowcodeI18n;
    if (!inst && import.meta.env.DEV && !warned) {
        warned = true;
    }
    return inst || null;
};

// 单例：等待 i18n 实例就绪
let i18nReadyPromise: Promise<any> | null = null;
const whenI18nReady = (): Promise<any> => {
    if (i18nReadyPromise) return i18nReadyPromise;
    i18nReadyPromise = new Promise(resolve => {
        const tryGet = () => {
            const inst = getI18nInstance();
            if (inst) {
                resolve(inst);
                return;
            }
            setTimeout(tryGet, 50);
        };
        tryGet();
    });
    return i18nReadyPromise;
};

// 强制设置默认语言为英文
// 注意：在 VSCode 环境中，这个函数不应该被调用，因为语言由 VSCode 插件控制
const setDefaultLocale = (instance: any) => {
    if (!instance?.global?.locale) {
        return;
    }
    // 检查是否在 VSCode 环境中
    const isVSCode =
        typeof window !== 'undefined' &&
        ((window as any).vscode ||
            (window as any).vscodeBridge ||
            (window.parent && window.parent !== window));

    // 如果在 VSCode 环境中，不强制设置默认语言，让 VSCode 插件来控制
    if (isVSCode) {
        // eslint-disable-next-line no-console
        console.log(
            '[i18nService] VSCode environment detected, skipping default locale setting'
        );
        return;
    }

    // 直接强制设置为英文（仅非 VSCode 环境）
    instance.global.locale.value = DEFAULT_LANGUAGE;
};

const loadDesignerI18n = () => {
    const tryLoadI18n = (): boolean => {
        const instance: any = getI18nInstance();
        if (!instance) {
            setTimeout(tryLoadI18n, 100);
            return false;
        }

        try {
            // 先设置默认语言，确保在加载翻译之前就设置好语言
            setDefaultLocale(instance);

            // 配置 i18n 警告选项，减少不必要的警告
            // vue-i18n 在找不到 key 时会回退到其他语言，这是正常行为
            // 我们只在生产环境完全禁用警告，开发环境保留但减少噪音
            if (instance.global && import.meta.env.PROD) {
                // 生产环境：完全禁用缺失 key 的警告
                instance.global.missingWarn = false;
                instance.global.fallbackWarn = false;
            }

            // 合并自定义翻译到TinyEngine的国际化系统中
            Object.keys(designerI18n).forEach(locale => {
                const localeData = (designerI18n as any)[locale];
                instance.global.mergeLocaleMessage(locale, localeData);

                // 只在开发环境输出详细日志
                if (import.meta.env.DEV) {
                    console.log(`✅ 已加载语言: ${locale}`);
                }
            });

            if (import.meta.env.DEV) {
                console.log('✅ 设计器界面国际化配置已加载');
            }

            // 再次确保语言设置正确（在加载翻译后）
            setDefaultLocale(instance);

            // if (import.meta.env.MODE === 'development') {
            //     (window as any).testDesignerI18n = () => {
            //         console.log('=== 测试设计器界面国际化 ===');
            //         console.log('当前语言:', instance.global.locale.value);
            //         console.log(
            //             '页面:',
            //             instance.global.t('designer.toolbar.page')
            //         );
            //         console.log(
            //             '保存:',
            //             instance.global.t('designer.toolbar.save')
            //         );
            //         console.log(
            //             '物料:',
            //             instance.global.t('designer.leftPanel.materials')
            //         );
            //         console.log(
            //             '搜索占位符:',
            //             instance.global.t('designer.leftPanel.searchPlaceholder')
            //         );
            //         console.log(
            //             '搜索:',
            //             instance.global.t('designer.common.search')
            //         );
            //         console.log(
            //             '中英文切换:',
            //             instance.global.t(
            //                 'designer.toolbar.chineseEnglishSwitch'
            //             )
            //         );
            //         // 检查 leftPanel 对象
            //         const messages = instance.global.messages[instance.global.locale.value];
            //         console.log('leftPanel 对象:', messages?.designer?.leftPanel);
            //     };
            //     (window as any).switchToEnglish = () => {
            //         instance.global.locale.value = 'en_US';
            //         console.log('已切换到英文');
            //         (window as any).testDesignerI18n();
            //     };
            //     (window as any).switchToChinese = () => {
            //         instance.global.locale.value = 'zh_CN';
            //         console.log('已切换到中文');
            //         (window as any).testDesignerI18n();
            //     };
            // }

            return true;
        } catch (error) {
            console.warn('❌ 加载设计器界面国际化配置失败:', error);
            return false;
        }
    };

    return tryLoadI18n();
};

const switchLanguage = (locale: string) => {
    try {
        if (!isLanguageSupported(locale)) {
            // eslint-disable-next-line no-console
            console.warn(
                '[i18nService] switchLanguage: Language not supported:',
                locale
            );
            return false;
        }

        const instance: any = getI18nInstance();
        if (instance?.global?.locale) {
            const oldLocale = instance.global.locale.value;
            instance.global.locale.value = locale;
            const STORAGE_KEY = 'tiny-engine-designer-locale';
            localStorage.setItem(STORAGE_KEY, locale);
            // eslint-disable-next-line no-console
            console.log(
                `[i18nService] switchLanguage: ${oldLocale} → ${locale}, current value:`,
                instance.global.locale.value
            );
            return true;
        }
        // eslint-disable-next-line no-console
        console.warn(
            '[i18nService] switchLanguage: i18n instance not available'
        );
        return false;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[i18nService] switchLanguage error:', error);
        return false;
    }
};

const getCurrentLanguage = (): string => {
    try {
        const instance: any = getI18nInstance();
        const current = instance?.global?.locale?.value;
        return current && isLanguageSupported(current)
            ? current
            : DEFAULT_LANGUAGE;
    } catch (error) {
        return DEFAULT_LANGUAGE;
    }
};

const getSupportedLanguages = (): LanguageConfig[] => {
    return getEnabledLanguages();
};

// 统一对外：在组件中使用国际化
const useDesignerI18n = () => {
    const instance = getI18nInstance();

    // localeRef 默认先占位，实例就绪后切到真实的 vue-i18n ref
    const localeRef: Ref<string> | any = shallowRef<string>(DEFAULT_LANGUAGE);

    if (instance?.global?.locale) {
        // 初始化时同步一次当前语言
        localeRef.value = instance.global.locale.value;
        // 定时同步（避免跨实例 watch 复杂度）
        setTimeout(() => {
            localeRef.value = instance.global.locale.value;
        }, 0);
    } else {
        // 实例未就绪时，等待后同步当前语言
        whenI18nReady().then(inst => {
            localeRef.value = inst.global.locale.value;
        });
    }

    const t = (key: string, params: Record<string, any> = {}) => {
        const inst: any = getI18nInstance();
        if (!inst?.global) return key;

        const te = inst.global.te?.bind(inst.global);
        const tt = inst.global.t?.bind(inst.global);

        // 调试信息
        if (import.meta.env.DEV && key === 'designer.toolbar.save') {
            console.log('🔍 翻译调试:', {
                key,
                currentLocale: inst.global.locale?.value,
                hasKey: te ? te(key) : false,
                messages: inst.global.messages
            });
        }

        if (te?.(key)) {
            return tt ? tt(key, params) : key;
        }
        return key;
    };

    return { t, locale: localeRef };
};

// 为了兼容现有代码（例如 useI18n.ts）继续提供命名导出 t
const t = (key: string, params: Record<string, any> = {}) => {
    const inst: any = getI18nInstance();
    if (!inst?.global) return key;

    const te = inst.global.te?.bind(inst.global);
    const tt = inst.global.t?.bind(inst.global);

    if (te?.(key)) {
        return tt ? tt(key, params) : key;
    }
    return key;
};

// 所有导出语句放在文件末尾
export {
    whenI18nReady,
    loadDesignerI18n,
    switchLanguage,
    getCurrentLanguage,
    getSupportedLanguages,
    useDesignerI18n,
    t
};
