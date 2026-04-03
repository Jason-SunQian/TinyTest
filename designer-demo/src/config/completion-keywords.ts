/**
 * 代码提示关键字配置
 * 用于配置 script 插件中的代码提示关键字
 *
 * 使用方式：
 * 1. 在 keyWords 数组中添加新的关键字，即可在编辑器中使用 this.xxx 的提示
 * 2. 例如：添加 'http' 后，可以在编辑器中使用 this.http 的提示
 *
 * 注意：
 * - 这些关键字是全局的，所有项目都会生效
 * - 如果需要项目特定的工具方法，请使用 Bridge 插件创建，会出现在 this.utils.xxx 下
 */

/**
 * 扩展的关键字列表
 * 这些关键字会在代码提示中显示为 this.xxx 的形式
 */
const customKeywords = [
    // 项目特定的关键字
    // HTTP 请求工具，如 this.http.post(), this.http.get()
    'http',
    // 路由工具，如 this.router.push(), this.router.goBack()
    'router'
];

/**
 * completion-utils 配置中“二级成员”定义
 */
interface CompletionMemberDefinition {
    name: string;
    detail?: string;
    signature?: string;
}

type TinyCompletionConfigV2 = {
    version?: string;
    namespaces?: Record<
        string,
        {
            members?: CompletionMemberDefinition[];
        }
    >;
    // 兼容老结构：{ utils: { members }, http: { members } }
    [k: string]: unknown;
};

/**
 * 读取 window 注入的二级成员（namespace -> members）
 * 兼容两种结构：
 * - v2：TINY_COMPLETION_CONFIG.namespaces[namespace].members
 * - v1：TINY_COMPLETION_CONFIG[namespace].members
 */
const getInjectedNamespaceMembers = (
    namespace: string
): CompletionMemberDefinition[] => {
    if (!namespace || typeof window === 'undefined') return [];

    /* eslint-disable @typescript-eslint/naming-convention -- window 注入键名 */
    const cfg = (
        window as unknown as {
            TINY_COMPLETION_CONFIG?: TinyCompletionConfigV2;
        }
    ).TINY_COMPLETION_CONFIG;
    /* eslint-enable @typescript-eslint/naming-convention */

    if (!cfg || typeof cfg !== 'object') return [];

    const fromNamespaces = cfg.namespaces?.[namespace]?.members;
    if (Array.isArray(fromNamespaces) && fromNamespaces.length) {
        return fromNamespaces.filter(
            m => typeof m?.name === 'string'
        ) as CompletionMemberDefinition[];
    }

    const legacyNs = cfg[namespace] as { members?: unknown } | undefined;
    const fromLegacy = legacyNs?.members;
    if (Array.isArray(fromLegacy) && fromLegacy.length) {
        return fromLegacy.filter(
            m => typeof m?.name === 'string'
        ) as CompletionMemberDefinition[];
    }

    return [];
};

/**
 * 获取所有关键字（包括原始关键字和自定义关键字）
 * 如果需要添加更多关键字，可以在这里扩展
 */
const getAllKeywords = () => {
    // 原始关键字（来自 packages/common/js/completion.js）
    const originalKeywords = [
        'state',
        'stores',
        'props',
        'emit',
        'setState',
        'route',
        'i18n',
        'getLocale',
        'setLocale',
        'history',
        'utils',
        'bridge',
        'dataSourceMap'
    ];

    // 合并原始关键字和自定义关键字，去重
    return [...new Set([...originalKeywords, ...customKeywords])];
};

export { customKeywords, getInjectedNamespaceMembers, getAllKeywords };
export type { CompletionMemberDefinition };
