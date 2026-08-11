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
 * - 主工程 composable 统一走 this.composables.<key>（见 completion-utils namespaces.composables）
 */

/**
 * 扩展的关键字列表
 * 这些关键字会在代码提示中显示为 this.xxx 的形式
 */
const customKeywords = [
    // HTTP 请求工具，如 this.http.post(), this.http.get()
    'http',
    // 路由工具，如 this.router.push(), this.router.goBack()
    'router',
    // 主工程 composable 桥接，如 this.composables.countdown.startCountdown()
    'composables'
];

/**
 * completion-utils 配置中“二级成员”定义
 */
interface CompletionMemberDefinition {
    name: string;
    detail?: string;
    signature?: string;
}

type TinyCompletionNamespaceDef = {
    members?: CompletionMemberDefinition[];
    children?: Record<string, { members?: CompletionMemberDefinition[] }>;
};

type TinyCompletionConfigV2 = {
    version?: string;
    namespaces?: Record<string, TinyCompletionNamespaceDef>;
    // 兼容老结构：{ utils: { members }, http: { members } }
    [k: string]: unknown;
};

const getTinyCompletionConfig = (): TinyCompletionConfigV2 | undefined => {
    if (typeof window === 'undefined') return undefined;
    /* eslint-disable @typescript-eslint/naming-convention -- window 注入键名 */
    return (
        window as unknown as {
            TINY_COMPLETION_CONFIG?: TinyCompletionConfigV2;
        }
    ).TINY_COMPLETION_CONFIG;
    /* eslint-enable @typescript-eslint/naming-convention */
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
    if (!namespace) return [];

    const cfg = getTinyCompletionConfig();
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
 * 三级补全：this.composables.countdown.| → children.countdown.members
 */
const getInjectedNamespaceChildMembers = (
    namespace: string,
    childKey: string
): CompletionMemberDefinition[] => {
    if (!namespace || !childKey) return [];

    const cfg = getTinyCompletionConfig();
    if (!cfg || typeof cfg !== 'object') return [];

    const children = cfg.namespaces?.[namespace]?.children;
    const members = children?.[childKey]?.members;
    if (Array.isArray(members) && members.length) {
        return members.filter(
            m => typeof m?.name === 'string'
        ) as CompletionMemberDefinition[];
    }

    return [];
};

/**
 * 从 TINY_COMPLETION_CONFIG 读取可作为 this.<ns> 一级提示的命名空间
 */
const getInjectedNamespaceKeywords = (): string[] => {
    const cfg = getTinyCompletionConfig();
    if (!cfg || typeof cfg !== 'object') return [];

    const names = new Set<string>();
    const namespaces = cfg.namespaces;
    if (namespaces && typeof namespaces === 'object') {
        for (const [ns, def] of Object.entries(namespaces)) {
            const members = def?.members;
            if (ns && Array.isArray(members) && members.length > 0) {
                names.add(ns);
            }
        }
    }

    // 兼容 v1：顶层 { utils: { members } }
    for (const [ns, def] of Object.entries(cfg)) {
        if (ns === 'version' || ns === 'namespaces') continue;
        const members = (def as { members?: unknown } | undefined)?.members;
        if (ns && Array.isArray(members) && members.length > 0) {
            names.add(ns);
        }
    }

    return Array.from(names);
};

/**
 * 获取所有关键字（包括原始关键字和自定义关键字）
 */
const getAllKeywords = () => {
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

    return [
        ...new Set([
            ...originalKeywords,
            ...customKeywords,
            ...getInjectedNamespaceKeywords()
        ])
    ];
};

export {
    customKeywords,
    getInjectedNamespaceMembers,
    getInjectedNamespaceChildMembers,
    getInjectedNamespaceKeywords,
    getAllKeywords
};
export type { CompletionMemberDefinition };
