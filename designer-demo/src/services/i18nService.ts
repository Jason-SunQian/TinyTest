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
const setDefaultLocale = (instance: any) => {
    if (!instance?.global?.locale) {
        return;
    }
    // 直接强制设置为英文
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

            // 合并自定义翻译到TinyEngine的国际化系统中
            Object.keys(designerI18n).forEach(locale => {
                const localeData = (designerI18n as any)[locale];
                instance.global.mergeLocaleMessage(locale, localeData);
                console.log(`✅ 已加载语言: ${locale}`);

                // 验证关键翻译是否存在
                const messages = instance.global.messages[locale];
                const hasSearchPlaceholder = instance.global.te?.(
                    'designer.leftPanel.searchPlaceholder',
                    locale
                );
                if (hasSearchPlaceholder) {
                    const translated = instance.global.t(
                        'designer.leftPanel.searchPlaceholder',
                        locale
                    );
                    console.log(
                        `✅ ${locale} leftPanel.searchPlaceholder: "${translated}"`
                    );
                } else {
                    console.warn(
                        `⚠️ ${locale} leftPanel.searchPlaceholder 未找到`
                    );
                    console.log(
                        '合并前的数据:',
                        localeData?.designer?.leftPanel
                    );
                    console.log('合并后的数据:', messages?.designer?.leftPanel);

                    // 如果 mergeLocaleMessage 没有深度合并，手动合并 leftPanel
                    if (localeData?.designer?.leftPanel && messages?.designer) {
                        messages.designer.leftPanel = {
                            ...messages.designer.leftPanel,
                            ...localeData.designer.leftPanel
                        };
                        console.log(
                            '手动合并后的 leftPanel:',
                            messages.designer.leftPanel
                        );
                    }
                }
            });
            console.log('✅ 设计器界面国际化配置已加载');

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
            return false;
        }

        const instance: any = getI18nInstance();
        if (instance?.global?.locale) {
            instance.global.locale.value = locale;
            const STORAGE_KEY = 'tiny-engine-designer-locale';
            localStorage.setItem(STORAGE_KEY, locale);
            return true;
        }
        return false;
    } catch (error) {
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
