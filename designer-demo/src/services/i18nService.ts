import { shallowRef } from 'vue';
import type { Ref } from 'vue';

import designerI18n from '../i18n';
import {
    getEnabledLanguages,
    getLanguageByCode,
    isLanguageSupported
} from '../config/languages';
import type { LanguageConfig } from '../config/languages';

/* eslint-disable @typescript-eslint/no-explicit-any, no-console */
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
export const whenI18nReady = (): Promise<any> => {
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

export const loadDesignerI18n = () => {
    const tryLoadI18n = (): boolean => {
        const instance: any = getI18nInstance();
        if (!instance) {
            setTimeout(tryLoadI18n, 100);
            return false;
        }

        try {
            // 合并自定义翻译到TinyEngine的国际化系统中
            Object.keys(designerI18n).forEach(locale => {
                instance.global.mergeLocaleMessage(
                    locale,
                    (designerI18n as any)[locale]
                );
                console.log(`✅ 已加载语言: ${locale}`);
            });
            console.log('✅ 设计器界面国际化配置已加载');

            if (import.meta.env.MODE === 'development') {
                (window as any).testDesignerI18n = () => {
                    console.log('=== 测试设计器界面国际化 ===');
                    console.log('当前语言:', instance.global.locale.value);
                    console.log(
                        '页面:',
                        instance.global.t('designer.toolbar.page')
                    );
                    console.log(
                        '保存:',
                        instance.global.t('designer.toolbar.save')
                    );
                    console.log(
                        '物料:',
                        instance.global.t('designer.leftPanel.materials')
                    );
                    console.log(
                        '中英文切换:',
                        instance.global.t(
                            'designer.toolbar.chineseEnglishSwitch'
                        )
                    );
                };
                (window as any).switchToEnglish = () => {
                    instance.global.locale.value = 'en_US';
                    console.log('已切换到英文');
                    (window as any).testDesignerI18n();
                };
                (window as any).switchToChinese = () => {
                    instance.global.locale.value = 'zh_CN';
                    console.log('已切换到中文');
                    (window as any).testDesignerI18n();
                };

                console.log('🎯 开发环境国际化测试功能已启用:');
                console.log('  - testDesignerI18n() - 测试国际化');
                console.log('  - switchToEnglish() - 切换到英文');
                console.log('  - switchToChinese() - 切换到中文');
            }

            return true;
        } catch (error) {
            console.warn('❌ 加载设计器界面国际化配置失败:', error);
            return false;
        }
    };

    return tryLoadI18n();
};

export const switchLanguage = (locale: string) => {
    try {
        // 检查语言是否支持
        if (!isLanguageSupported(locale)) {
            console.warn(`不支持的语言: ${locale}`);
            return false;
        }

        const instance: any = getI18nInstance();
        if (instance?.global?.locale) {
            instance.global.locale.value = locale;
            const langConfig = getLanguageByCode(locale);
            console.log(`语言已切换到: ${langConfig?.name || locale}`);
            return true;
        }
        console.warn('i18n实例未初始化');
        return false;
    } catch (error) {
        console.error('切换语言失败:', error);
        return false;
    }
};

export const getCurrentLanguage = (): string => {
    try {
        const instance: any = getI18nInstance();
        const current = instance?.global?.locale?.value;
        return current && isLanguageSupported(current) ? current : 'zh_CN';
    } catch (error) {
        console.error('获取当前语言失败:', error);
        return 'zh_CN';
    }
};

export const getSupportedLanguages = (): LanguageConfig[] => {
    return getEnabledLanguages();
};

// 统一对外：在组件中使用国际化
export const useDesignerI18n = () => {
    const instance = getI18nInstance();

    // localeRef 默认先占位，实例就绪后切到真实的 vue-i18n ref
    const localeRef: Ref<string> | any = shallowRef<string>('zh_CN');

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
export const t = (key: string, params: Record<string, any> = {}) => {
    const inst: any = getI18nInstance();
    if (!inst?.global) return key;

    const te = inst.global.te?.bind(inst.global);
    const tt = inst.global.t?.bind(inst.global);

    if (te?.(key)) {
        return tt ? tt(key, params) : key;
    }
    return key;
};
