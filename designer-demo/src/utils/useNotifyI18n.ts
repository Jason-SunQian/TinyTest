/**
 * 国际化的 useNotify 包装函数
 * 自动将中文消息翻译为当前语言
 */
import { Notify } from '@opentiny/vue';

import { useDesignerI18n } from '@/services/i18nService';

const durationMap = {
    info: 5000,
    success: 5000,
    warning: 10000,
    error: 10000
};

/* eslint-disable import/exports-last, @typescript-eslint/no-explicit-any, no-inline-comments, line-comment-position, @typescript-eslint/naming-convention, new-cap, @typescript-eslint/no-confusing-void-expression */

interface NotifyOptions {
    [key: string]: unknown;
    title?: string;
    message: string;
    type?: keyof typeof durationMap;
    customClass?: string;
    position?: string;
}

/**
 * 翻译常见的中文提示消息
 */
const translateMessage = (text: string, locale: string): string => {
    // 非英文模式，直接返回原文
    if (locale !== 'en_US') {
        return text;
    }

    // 常见的中文提示映射表
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const translateMap: Record<string, string> = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '保存成功!': 'Save successful!',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        保存成功: 'Save successful',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        保存失败: 'Save failed',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        接口报错: 'API Error',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '报错接口:': 'Error API:',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '报错信息:': 'Error message:'
    };

    // 完全匹配
    if (translateMap[text]) {
        return translateMap[text];
    }

    // 部分匹配（处理 "报错接口: xxx" 这种格式）
    for (const [zh, en] of Object.entries(translateMap)) {
        if (text.includes(zh)) {
            return text.replace(new RegExp(zh, 'g'), en);
        }
    }

    return text;
};

const useNotifyI18n = (config: NotifyOptions) => {
    const { locale, t } = useDesignerI18n();
    const {
        customClass,
        title,
        type = 'info',
        position = 'top-right',
        message,
        ...otherConfig
    } = config;

    // 调试日志
    if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[useNotifyI18n] 收到通知:', {
            title,
            message,
            locale: locale.value
        });
    }

    // 翻译 title
    let translatedTitle = title;
    if (translatedTitle) {
        // 先尝试使用 i18n key
        if (translatedTitle.startsWith('designer.')) {
            const translated = t(translatedTitle);
            if (translated !== translatedTitle) {
                translatedTitle = translated;
            } else {
                translatedTitle = translateMessage(
                    translatedTitle,
                    locale.value
                );
            }
        } else {
            translatedTitle = translateMessage(translatedTitle, locale.value);
        }
    }

    // 翻译 message
    let translatedMessage = message;
    if (translatedMessage) {
        // 先尝试使用 i18n key
        if (translatedMessage.startsWith('designer.')) {
            const translated = t(translatedMessage);
            if (translated !== translatedMessage) {
                translatedMessage = translated;
            } else {
                translatedMessage = translateMessage(
                    translatedMessage,
                    locale.value
                );
            }
        } else {
            translatedMessage = translateMessage(
                translatedMessage,
                locale.value
            );
        }
    }

    // eslint-disable-next-line new-cap
    Notify({
        duration: durationMap[type],
        ...otherConfig,
        position,
        title: translatedTitle,
        message: translatedMessage,
        type,
        customClass: `${customClass}`,
        verticalOffset: 46
    });
};

// 兼容 useNotify() 的调用方式（返回函数）
// 当调用 useNotify() 时，返回一个函数；当调用 useNotify(config) 时，直接执行
const useNotifyI18nWrapper = (...args: NotifyOptions[]) => {
    if (args.length === 0) {
        // 返回函数本身，用于 useNotify()() 的调用方式
        return useNotifyI18n;
    }
    // 直接调用，用于 useNotify(config) 的调用方式
    useNotifyI18n(args[0]);
};

export default useNotifyI18nWrapper;
export type { NotifyOptions };
