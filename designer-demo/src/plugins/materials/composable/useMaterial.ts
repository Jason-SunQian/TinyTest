/**
 * Copyright (c) 2023 - present TinyEngine Authors.
 * Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.
 *
 * Use of this source code is governed by an MIT-style license.
 *
 * THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,
 * BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR
 * A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.
 *
 */

/* eslint-disable max-lines */
/* metaService: engine.service.material.useMaterial */
import { reactive } from 'vue';
import { utils, constants } from '@opentiny/tiny-engine-utils';
import { meta as BuiltinComponentMaterials } from '@opentiny/tiny-engine-builtin-component';
import {
    getOptions,
    useCanvas,
    useBlock,
    useMessage,
    useResource,
    getMetaApi,
    META_SERVICE
} from '@opentiny/tiny-engine-meta-register';

import { getMaterialContentsFromExtension } from '@/composable/useVSCodeBridge';
import { normalizeCanvasDeps } from '@/composable/canvasDepsNormalizer';
import {
    getDesignerMaterialBaseUrl,
    toAbsoluteMaterialUrl
} from '@/utils/designerOrigin';
import {
    getBundleUrls,
    getMaterialsBaseFromBundleUrls
} from '@/composable/loadRuntimeFromBundles';

import {
    BASE_STYLE_CLASS_NAME,
    COMPONENTS_SKIP_BASE_STYLE
} from '../constants';
import meta from '../meta';

import {
    getBlockCompileRes,
    getBlockByName,
    updateBlockCompileCache
} from './block-compile';
import type {
    Block,
    BlockResource,
    Component,
    Dependency,
    InitMaterialOptions,
    Material,
    MaterialState,
    Property,
    Resource,
    Schema,
    Snippet
} from './types';
import { syncSlotStringChildrenWithPropsChildren } from './slotChildrenPropsSync';

const { camelize, capitalize, deepClone } = utils;
const { MATERIAL_TYPE } = constants;

// 这里存放所有TinyVue组件、原生HTML、内置组件的缓存，包含了物料插件面板里所有显示的组件，也包含了没显示的一些联动组件
const resource = new Map<string, Resource>();

// 这里涉及到区块发布后的更新问题，所以需要单独缓存区块
const blockResource = new Map<string, BlockResource>();

/** 组件名 -> 其所在 bundle 的 base URL（用于解析脚本绝对路径，避免主工程物料脚本被错误拼到设计器 origin） */
const componentBundleBaseMap = new Map<string, string>();

/** 远程 bundle 加载时的时间戳，用于脚本/样式 URL 加 _t 避免强缓存导致用旧 chunk 名 404 */
let materialBundleLoadTimestamp: number | null = null;

// 这里存放的是物料插件面板里所有显示的组件
// 物料依赖的包
const materialState = reactive<MaterialState>({
    components: [],
    blocks: [],
    componentsDepsMap: { scripts: [], styles: new Set() },
    packages: []
});

const getSnippet = (component: string) => {
    let schema: Schema = {};
    materialState.components.some(({ children }) => {
        const child = children.find(
            ({ snippetName }) => snippetName === component
        );
        if (child?.schema) {
            const { schema: childSchema } = child;
            schema = childSchema;
            return true;
        }
        return false;
    });

    return schema;
};

/**
 * 获取物料组件的配置信息
 * @returns
 */
const getConfigureMap = () => {
    const entries = Object.entries(Object.fromEntries(resource)).map(
        ([key, value]) => {
            return [key, value.content?.configure || value.configure];
        }
    );
    return Object.fromEntries(entries);
};

/**
 * 附加基础属性，基础属性可以通过注册表配置
 * @param schemaProperties
 * @returns
 */
const patchBaseProps = (schemaProperties?: Property[]) => {
    if (!Array.isArray(schemaProperties)) {
        return;
    }

    const { properties = [], insertPosition = 'end' } =
        getOptions(meta.id).basePropertyOptions || {};

    for (const basePropGroup of properties) {
        const group = schemaProperties.find(item => {
            // 如果存在了包含'其他'字符串的分组，统一为'其他'分组

            if (item.label.zh_CN?.includes('其他')) {
                item.label.zh_CN = '其他';
            }

            return (
                (basePropGroup.group && basePropGroup.group === item.group) ||
                basePropGroup.label.zh_CN === item.label.zh_CN
            );
        });

        if (group) {
            const targetInsertContent = basePropGroup.content.filter(
                (item: { property: string }) =>
                    !group.content.some(prop => prop.property === item.property)
            );

            if (insertPosition === 'start') {
                group.content.splice(0, 0, ...deepClone(targetInsertContent));
            } else {
                group.content.push(...deepClone(targetInsertContent));
            }
        } else {
            schemaProperties.push(deepClone(basePropGroup));
        }
    }
};

/**
 * 将component里的内容注册到resource变量中
 * @param data
 */
const registerComponentToResource = (data: Component, bundleBase?: string) => {
    patchBaseProps(data.schema?.properties);
    const shouldReplaceBase = (name: string, nextBase?: string) => {
        if (!nextBase) return false;
        const current = componentBundleBaseMap.get(name);
        if (!current) return true;
        const currentHttp =
            current.startsWith('http://') || current.startsWith('https://');
        const nextHttp =
            nextBase.startsWith('http://') || nextBase.startsWith('https://');
        // 已有 HTTP base 时，不允许被非 HTTP（如 vscode-webview/mock）覆盖
        if (currentHttp && !nextHttp) return false;
        return true;
    };

    if (Array.isArray(data.component)) {
        const { component, ...others } = data;
        component.forEach(item => {
            resource.set(item, {
                item,
                ...others,
                type: MATERIAL_TYPE.Component
            });
            if (shouldReplaceBase(item, bundleBase)) {
                componentBundleBaseMap.set(item, bundleBase as string);
            }
        });
    } else {
        resource.set(data.component, {
            ...data,
            type: MATERIAL_TYPE.Component
        });
        if (data.component && shouldReplaceBase(data.component, bundleBase)) {
            componentBundleBaseMap.set(data.component, bundleBase as string);
        }
    }
};

const clearMaterials = () => {
    materialState.components = [];
    materialState.blocks = [];
    resource.clear();
    componentBundleBaseMap.clear();
};

const clearBlockResources = () => {
    blockResource.clear();
};

/**
 * 生成组件依赖映射
 * @param components 组件物料列表
 */
const generateThirdPartyDeps = (components: Component[]) => {
    const styles: string[] = [];
    const scripts: Array<{
        package: string;
        script?: string;
        components: Record<
            string,
            { exportName?: string; destructuring: boolean }
        >;
    }> = [];

    components.forEach(item => {
        // 兼容顶层 npm 与 content.npm（主工程 bundle 可能用 content.npm）
        const npm =
            item.npm ??
            (item as { content?: { npm?: typeof item.npm } })?.content?.npm;
        const { component } = item;

        if (!npm || !Object.keys(npm).length) return;

        const {
            package: pkgRaw,
            script,
            exportName,
            css,
            destructuring = true
        } = npm;
        // 主工程 bundle 可能无 package，用组件名做占位以便仍进入 materialsDeps 被画布预加载
        const pkg = pkgRaw || (script ? `@local/${component}` : '');
        if (!pkg || !script) return;
        const currentPkg = scripts.find(pkgItem => pkgItem.package === pkg);

        if (currentPkg) {
            // 保存组件id和导出组件名的对应关系 TinyButton： Button
            currentPkg.components[component] = {
                exportName,
                destructuring
            };
        } else {
            scripts.push({
                package: pkg,
                script,
                components: {
                    [component]: {
                        destructuring,
                        exportName
                    }
                }
            });
        }

        if (css) {
            styles.push(css);
        }
    });

    return { styles, scripts };
};

/**
 * 为组件名称添加英文翻译（如果不存在或值是中文）
 */
const addEnglishNameToComponent = (component: Component) => {
    const componentName = component.name as any;
    if (
        componentName &&
        typeof componentName === 'object' &&
        componentName.zh_CN
    ) {
        const existingEn =
            componentName.en_US || componentName['en-US'] || componentName.en;

        // 检查现有的 en_US 是否是中文（包含中文字符）
        const isChinese = (str: string) => /[\u4e00-\u9fa5]/.test(str);
        const needsTranslation = !existingEn || isChinese(existingEn);

        // 如果已经有有效的英文翻译，跳过
        if (existingEn && !needsTranslation) {
            return;
        }

        // 简单的翻译映射
        const translations: Record<string, string> = {
            盒子容器: 'Box',
            行列容器: 'Row/Col',
            弹性容器: 'Flex',
            全宽居中容器: 'Full Width',
            全宽居中布局: 'Full Width',
            文本: 'Text',
            图标: 'Icon',
            图片: 'Image',
            段落: 'Paragraph',
            链接: 'Link',
            分隔线: 'Divider',
            标题: 'Title',
            视频: 'Video',
            按钮: 'Button',
            按钮组: 'Button Group',
            互斥按钮组: 'Mutex Buttons',
            搜索框: 'Search',
            插槽: 'Slot',
            路由视图: 'Router View',
            路由链接: 'Router Link',
            导航条: 'Nav Bar',
            纵向导航: 'Vertical Nav',
            数据源容器: 'Data Source',
            栅格布局: 'Grid'
        };

        const zhName = componentName.zh_CN;
        if (translations[zhName]) {
            componentName.en_US = translations[zhName];
        } else {
            // 如果没有映射，使用组件名作为回退

            componentName.en_US = component.component || zhName;
        }
    }
};

/**
 * 为 snippet 添加英文翻译（如果不存在或值是中文）
 */

const addEnglishNameToSnippet = (snippet: any) => {
    if (!snippet?.name) return;

    if (typeof snippet.name === 'object' && snippet.name.zh_CN) {
        const nameAny = snippet.name as any;

        const { en_US: enUs, 'en-US': enUsHyphen, en } = nameAny;
        const existingEn = enUs || enUsHyphen || en;

        // 检查现有的 en_US 是否是中文（包含中文字符）
        const isChinese = (str: string) => {
            if (!str || typeof str !== 'string') return false;
            return /[\u4e00-\u9fa5]/.test(str);
        };
        const needsTranslation = !existingEn || isChinese(existingEn);

        // 如果已经有有效的英文翻译，跳过
        if (existingEn && !needsTranslation) {
            return;
        }

        const translations: Record<string, string> = {
            盒子容器: 'Box',
            行列容器: 'Row/Col',
            弹性容器: 'Flex',
            全宽居中容器: 'Full Width',
            全宽居中布局: 'Full Width',
            文本: 'Text',
            图标: 'Icon',
            图片: 'Image',
            段落: 'Paragraph',
            链接: 'Link',
            分隔线: 'Divider',
            标题: 'Title',
            视频: 'Video',
            按钮: 'Button',
            按钮组: 'Button Group',
            互斥按钮组: 'Mutex Buttons',
            搜索框: 'Search',
            插槽: 'Slot',
            路由视图: 'Router View',
            路由链接: 'Router Link',
            导航条: 'Nav Bar',
            纵向导航: 'Vertical Nav',
            数据源容器: 'Data Source',
            栅格布局: 'Grid'
        };

        const zhName = snippet.name.zh_CN;
        if (translations[zhName]) {
            (snippet.name as any).en_US = translations[zhName];
        } else if (snippet.snippetName) {
            // 如果没有映射，尝试从 snippetName 生成英文名
            const componentName = snippet.snippetName.replace('Canvas', '');

            (snippet.name as any).en_US = componentName || zhName;
        } else {
            // 最后回退

            (snippet.name as any).en_US = snippet.component || zhName;
        }
    }

    // 处理 label

    if (
        snippet.label &&
        typeof snippet.label === 'object' &&
        snippet.label.zh_CN &&
        !(snippet.label as any).en_US
    ) {
        const translations: Record<string, string> = {
            布局与容器: 'Layout and Containers',
            基础元素: 'Basic Elements',
            高级元素: 'Advanced Elements'
        };

        const zhLabel = snippet.label.zh_CN;
        if (translations[zhLabel]) {
            (snippet.label as any).en_US = translations[zhLabel];
        }
    }
};

/**
 * 添加组件snippets(分组相同则合并)
 * @param componentSnippets 待添加的组件snippets
 * @param snippetsData 当前snippets
 * @returns snippetsData 合并后的snippets
 */
const addComponentSnippets = (
    componentSnippets: Snippet[] | undefined,
    snippetsData: Snippet[]
) => {
    if (!componentSnippets) return;

    const snippetsMap = new Map<string, Snippet>();
    snippetsData.forEach(snippetGroup =>
        snippetsMap.set(snippetGroup.group, snippetGroup)
    );
    componentSnippets.forEach(snippetGroup => {
        // 为分组 label 添加英文翻译

        const groupLabel = (snippetGroup as any).label;
        if (
            groupLabel &&
            typeof groupLabel === 'object' &&
            groupLabel.zh_CN &&
            !groupLabel.en_US
        ) {
            const translations: Record<string, string> = {
                布局与容器: 'Layout and Containers',
                基础元素: 'Basic Elements',
                高级元素: 'Advanced Elements'
            };
            const zhLabel = groupLabel.zh_CN;
            if (translations[zhLabel]) {
                groupLabel.en_US = translations[zhLabel];
            }
        }

        // 为每个 snippet 添加英文翻译（在克隆之前修改，确保修改生效）
        snippetGroup.children?.forEach(child => {
            addEnglishNameToSnippet(child);
        });

        if (snippetsMap.has(snippetGroup.group)) {
            // 确保翻译已应用到 children 后再 push
            snippetsMap
                .get(snippetGroup.group)!
                .children.push(...snippetGroup.children);
        } else {
            // 先应用翻译，再克隆
            const snippetGroupClone = deepClone(snippetGroup);
            snippetsData.push(snippetGroupClone);
            snippetsMap.set(snippetGroup.group, snippetGroupClone);
        }
    });

    return snippetsData;
};

// 业务物料依赖顺序：被依赖的包（如 mr-components）需先于依赖方（如 mp-card）加载，避免在 webview 中嵌套 import 失败
const MATERIAL_LOAD_ORDER = ['@local/mr-components', '@local/mp-card'];

const getFilenameFromPath = (pathOrUrl: string) =>
    pathOrUrl.replace(/^.*\//, '');

/** 从当前物料依赖中收集需要请求的脚本/样式文件名（用于插件 data URL 或 URL 加载），新增业务组件无需改此处 */
const getMaterialFilenamesFromDeps = (): string[] => {
    const { scripts, styles } = useResource().appSchemaState.materialsDeps;
    const set = new Set<string>();
    const scriptsList = Array.isArray(scripts) ? scripts : [];
    for (const item of scriptsList) {
        if (item?.script) set.add(getFilenameFromPath(item.script));
        if (item?.css) {
            const cssList = Array.isArray(item.css) ? item.css : [item.css];
            for (const u of cssList) set.add(getFilenameFromPath(String(u)));
        }
    }
    const stylesList = Array.isArray(styles)
        ? styles
        : Array.from(styles || []);
    for (const s of stylesList) {
        if (typeof s === 'string') set.add(getFilenameFromPath(s));
    }
    return Array.from(set);
};

const toDataUrl = (content: string, mime: string) =>
    `data:${mime};base64,${
        typeof btoa !== 'undefined'
            ? btoa(unescape(encodeURIComponent(content)))
            : ''
    }`;

/** 取组件所在 bundle 的 base URL，解析脚本时用该 base 拼绝对路径（主工程物料来自 3060 等时不会误用 8090） */
const getBundleBaseUrlForComponent = (name: string): string | null =>
    componentBundleBaseMap.get(name) ??
    componentBundleBaseMap.get(capitalize(camelize(name))) ??
    null;

/** 返回用于缓存破坏的查询串（如 _t=123），供 block 按需加载脚本时拼到 URL */
const getMaterialCacheBustParam = (): string => {
    const t = materialBundleLoadTimestamp ?? Date.now();
    return `_t=${t}`;
};

/** 主工程物料包样式 fallback：当 bundle 来自远程 URL 且物料未声明 npm.css 时，强制追加 mr-bank.css */
const MAIN_PROJECT_STYLE_FALLBACK = 'mr-bank.css';

const getCanvasDeps = (materialContents?: Record<string, string> | null) => {
    const { scripts, styles } = useResource().appSchemaState.materialsDeps;
    // 避免 base 为空时发布相对路径，iframe 会按 vscode-webview 解析导致 403；有物料脚本时强制用 origin 回退
    let base = getDesignerMaterialBaseUrl();
    if (!base && scripts?.length && typeof window !== 'undefined') {
        const win = window as any;
        base = (
            win.TINY_DESIGNER_ORIGIN ||
            (import.meta.env as any).VITE_ORIGIN ||
            'http://localhost:8090'
        ).replace(/\/$/, '');
    }
    const scriptsList = [...scripts].filter(item => item.script);

    // 收集远程 bundle 的 base URL，用于样式 fallback（主工程 bundle 可能未声明 npm.css）
    const remoteBundleBases = new Set<string>();
    // 1) 从 scripts 中提取（有预加载的远程 bundle）
    scriptsList.forEach(item => {
        const [firstComp] = Object.keys(item.components || {});
        const itemBase = firstComp
            ? getBundleBaseUrlForComponent(firstComp)
            : null;
        const scriptUrl = item.script || '';
        const resolvedBase =
            itemBase ||
            (scriptUrl.startsWith('http')
                ? scriptUrl.replace(/\/[^/]*$/, '')
                : null);
        if (
            resolvedBase &&
            (resolvedBase.startsWith('http://') ||
                resolvedBase.startsWith('https://'))
        ) {
            remoteBundleBases.add(resolvedBase.replace(/\/$/, ''));
        }
    });
    // 2) 从全部物料 URL 来源补充（远程 bundle 可能 skipScriptPreload，scripts 中无记录）
    const materialUrls = getBundleUrls();
    materialUrls.forEach((u: string) => {
        if (u.startsWith('http://') || u.startsWith('https://')) {
            const urlBase = u
                .replace(/\/[#?].*$/, '')
                .replace(/\/[^/]*$/, '')
                .replace(/\/$/, '');
            if (urlBase) remoteBundleBases.add(urlBase);
        }
    });

    // 为主工程等远程 bundle 追加 mr-bank.css fallback（桩样式等）
    const styleFallbacks: string[] = [];
    remoteBundleBases.forEach(b => {
        const fallbackUrl = `${b}/${MAIN_PROJECT_STYLE_FALLBACK}`;
        const alreadyInStyles = [...styles].some(
            s =>
                typeof s === 'string' &&
                (s === fallbackUrl || s.includes(MAIN_PROJECT_STYLE_FALLBACK))
        );
        if (!alreadyInStyles) styleFallbacks.push(fallbackUrl);
    });
    const allStyles = [...styles, ...styleFallbacks];

    scriptsList.sort((a, b) => {
        const i = MATERIAL_LOAD_ORDER.indexOf(a.package);
        const j = MATERIAL_LOAD_ORDER.indexOf(b.package);
        if (i !== -1 && j !== -1) return i - j;
        if (i !== -1) return -1;
        if (j !== -1) return 1;
        return 0;
    });

    // 只要有 base、materialContents，或任一脚本/样式是相对路径，都做绝对化，避免 iframe 按 vscode-webview 解析相对路径导致 403
    const isRelativePath = (u: string) =>
        typeof u === 'string' &&
        !u.startsWith('http://') &&
        !u.startsWith('https://') &&
        !u.startsWith('data:') &&
        !u.startsWith('vscode-webview:');
    const hasRelative =
        !base &&
        !materialContents &&
        [...scriptsList.map(s => s.script), ...allStyles].some(
            (u): u is string => isRelativePath(u)
        );
    const effectiveBase =
        (
            base ||
            (typeof window !== 'undefined' &&
                (window as any).TINY_DESIGNER_ORIGIN) ||
            'http://localhost:8090'
        )
            ?.toString()
            .replace(/\/$/, '') || '';
    const [firstFromSet] =
        remoteBundleBases.size > 0
            ? Array.from(remoteBundleBases)
            : [undefined];
    const firstRemoteBase =
        (firstFromSet ?? getMaterialsBaseFromBundleUrls()) || '';
    const safeDefaultBase =
        (firstRemoteBase?.startsWith('http')
            ? firstRemoteBase
            : effectiveBase) || '';
    const absolutize = (u: string): string => {
        if (
            !u ||
            u.startsWith('http://') ||
            u.startsWith('https://') ||
            u.startsWith('data:')
        ) {
            return u;
        }
        // webview 样式地址（尤其 mr-bank.css）在 iframe 内常返回 403，优先改写回远程 bundle 地址
        if (
            u.startsWith('vscode-webview:') &&
            getFilenameFromPath(u) === MAIN_PROJECT_STYLE_FALLBACK &&
            firstRemoteBase
        ) {
            return `${firstRemoteBase.replace(
                /\/$/,
                ''
            )}/${MAIN_PROJECT_STYLE_FALLBACK}`;
        }
        const b = safeDefaultBase.replace(/\/$/, '');
        return b
            ? toAbsoluteMaterialUrl(u, b) ?? `${b}/${u.replace(/^\//, '')}`
            : u;
    };

    const appendCacheBust = (u: string) => {
        if (!u.startsWith('http://') && !u.startsWith('https://')) return u;
        const t = materialBundleLoadTimestamp ?? Date.now();
        return `${u}${u.includes('?') ? '&' : '?'}_t=${t}`;
    };
    const scriptUrl = (
        item: {
            script?: string;
            css?: string;
            components?: Record<string, unknown>;
        },
        url: string,
        isCss: boolean,
        baseOverride?: string | null
    ) => {
        const filename = getFilenameFromPath(url);
        if (materialContents?.[filename]) {
            return toDataUrl(
                materialContents[filename],
                isCss ? 'text/css' : 'application/javascript'
            );
        }
        const b = (baseOverride || safeDefaultBase || effectiveBase).replace(
            /\/$/,
            ''
        );
        const u = b ? toAbsoluteMaterialUrl(url, b) ?? url : url;
        return appendCacheBust(u);
    };

    if (base || materialContents || hasRelative) {
        return {
            scripts: scriptsList.map(item => {
                const [firstComp] = Object.keys(item.components || {});
                const itemBase = firstComp
                    ? getBundleBaseUrlForComponent(firstComp) ?? effectiveBase
                    : effectiveBase;
                return {
                    ...item,
                    script: absolutize(
                        scriptUrl(item, item.script!, false, itemBase)
                    ),
                    ...(item.css && {
                        css: absolutize(
                            scriptUrl(item, item.css, true, itemBase)
                        )
                    })
                };
            }),
            styles: [...allStyles].map(s => {
                if (typeof s !== 'string') return s;
                if (materialContents?.[getFilenameFromPath(s)])
                    return toDataUrl(
                        materialContents[getFilenameFromPath(s)],
                        'text/css'
                    );
                // 主工程样式（如 mr-bank.css）使用远程 bundle 的 base，否则会误用 design 的 origin 导致 404
                const [firstRemoteForStyle] =
                    remoteBundleBases.size > 0
                        ? Array.from(remoteBundleBases)
                        : [undefined];
                const styleBase =
                    getFilenameFromPath(s) === MAIN_PROJECT_STYLE_FALLBACK &&
                    remoteBundleBases.size > 0
                        ? firstRemoteForStyle
                        : effectiveBase;
                return appendCacheBust(
                    absolutize(
                        styleBase ? toAbsoluteMaterialUrl(s, styleBase) ?? s : s
                    )
                );
            })
        };
    }
    // 最终兜底：发布给画布前，保证 import-map 中 script 地址不是裸相对路径；
    // 否则浏览器会把该 specifier 记为 null，出现“blocked by a null value”。
    return {
        scripts: scriptsList.map(item => ({
            ...item,
            script: item.script ? absolutize(item.script) : item.script,
            ...(item.css && { css: absolutize(item.css) })
        })),
        styles: [...allStyles].map(s => {
            if (typeof s !== 'string') return s;
            if (materialContents?.[getFilenameFromPath(s)])
                return toDataUrl(
                    materialContents[getFilenameFromPath(s)],
                    'text/css'
                );
            const baseForStyle =
                getFilenameFromPath(s) === MAIN_PROJECT_STYLE_FALLBACK &&
                firstRemoteBase
                    ? firstRemoteBase
                    : safeDefaultBase;
            const abs =
                baseForStyle && !s.startsWith('http')
                    ? toAbsoluteMaterialUrl(s, baseForStyle) ??
                      `${baseForStyle.replace(/\/$/, '')}/${s.replace(
                          /^\//,
                          ''
                      )}`
                    : s;
            return appendCacheBust(abs);
        })
    };
};

/**
 * 组装画布的依赖，通知画布更新。在插件环境下优先向扩展请求物料文件内容，用 data URL 注入以避免 403。
 */
const updateCanvasDeps = async () => {
    let deps: ReturnType<typeof getCanvasDeps> = getCanvasDeps();
    try {
        const files = getMaterialFilenamesFromDeps();
        const contents = await getMaterialContentsFromExtension(files);
        if (contents && Object.keys(contents).length > 0) {
            deps = getCanvasDeps(contents);
        }
    } catch {
        deps = getCanvasDeps();
    }
    // 在源头先做一次归一化，避免先发布 webview 相对/伪绝对 URL 再二次修正导致双请求（一个 403 一个 200）。
    deps = normalizeCanvasDeps(deps).normalized as ReturnType<
        typeof getCanvasDeps
    >;
    /* eslint-disable no-console -- 诊断画布样式注入 */
    if (console?.log && deps.styles?.length) {
        console.log(
            '[Materials] 画布样式已下发，共',
            deps.styles.length,
            '个:',
            deps.styles.slice(0, 5).map((s: string) => (s || '').slice(-60))
        );
    }
    /* eslint-enable no-console */
    useMessage().publish({
        topic: 'init_canvas_deps',
        data: deps
    });
};

//
/**
 * @param materialBundle 物料包
 * @param options.skipScriptPreload 为 true 时不把该 bundle 的组件脚本加入预加载列表，改为拖拽时按需加载（避免远程 bundle 里一个脚本报错拖垮所有组件）
 */
const parseMaterialsDependencies = (
    materialBundle: Material,
    options?: { skipScriptPreload?: boolean; bundleBase?: string }
) => {
    const { packages, components } = materialBundle;
    const skipPreload = options?.skipScriptPreload === true;
    const bundleBase = options?.bundleBase || null;

    const { scripts: scriptsDeps, styles: stylesDeps } =
        useResource().appSchemaState.materialsDeps;

    packages?.forEach(pkg => {
        if (!pkg.script || !pkg.package) {
            return;
        }

        // 远程 bundle 的 package 依赖若使用相对路径（如 mr-components.js），需要按该 bundle 的 base 绝对化，
        // 否则后续预加载会按设计器 origin（8090）解析，导致 404。
        const normalizedScript =
            typeof pkg.script === 'string' && bundleBase
                ? toAbsoluteMaterialUrl(pkg.script, bundleBase) || pkg.script
                : pkg.script;
        const normalizedCss = Array.isArray(pkg.css)
            ? pkg.css.map(css =>
                  typeof css === 'string' && bundleBase
                      ? toAbsoluteMaterialUrl(css, bundleBase) || css
                      : css
              )
            : typeof pkg.css === 'string' && bundleBase
            ? toAbsoluteMaterialUrl(pkg.css, bundleBase) || pkg.css
            : pkg.css;

        const existingDep = scriptsDeps.find(
            item => item.package === pkg.package
        );
        if (existingDep) {
            const currentScript = existingDep.script || '';
            const nextScript = normalizedScript || '';
            const currentHttp =
                currentScript.startsWith('http://') ||
                currentScript.startsWith('https://');
            const nextHttp =
                nextScript.startsWith('http://') ||
                nextScript.startsWith('https://');
            // 同包冲突时，优先保留 HTTP 远程地址，不允许被本地 webview/mock 相对地址回写覆盖。
            if (!(currentHttp && !nextHttp)) {
                existingDep.script = normalizedScript;
            }
            if (normalizedCss !== undefined) {
                const currentCss = existingDep.css;
                const currentCssHttp =
                    typeof currentCss === 'string' &&
                    (currentCss.startsWith('http://') ||
                        currentCss.startsWith('https://'));
                const nextCssHttp =
                    typeof normalizedCss === 'string' &&
                    (normalizedCss.startsWith('http://') ||
                        normalizedCss.startsWith('https://'));
                if (!(currentCssHttp && !nextCssHttp)) {
                    existingDep.css = normalizedCss;
                }
            }
            const pkgComponents =
                (pkg as unknown as { components?: Record<string, unknown> })
                    .components || {};
            existingDep.components = {
                ...(existingDep.components || {}),
                ...pkgComponents
            };
        } else {
            scriptsDeps.push({
                ...pkg,
                script: normalizedScript,
                css: normalizedCss
            });
        }

        if (!normalizedCss) {
            return;
        }

        if (Array.isArray(normalizedCss)) {
            normalizedCss.forEach(item => stylesDeps.add(item));
        } else {
            stylesDeps.add(normalizedCss);
        }
    });

    const { scripts, styles } = generateThirdPartyDeps(components);
    if (!skipPreload) {
        scripts.forEach(item => {
            const existingDep = scriptsDeps.find(
                dep => dep.package === item.package
            );
            if (existingDep) {
                existingDep.components = {
                    ...existingDep.components,
                    ...(item.components || {})
                };
            } else {
                scriptsDeps.push(item);
            }
        });
    }

    if (!styles) return;
    if (Array.isArray(styles)) {
        styles.forEach(item => stylesDeps.add(item));
    } else {
        stylesDeps.add(styles);
    }
};

/**
 * 添加物料Bundle文件中的组件类型物料
 * @param materialBundle 物料包Bundle.json文件对象
 * @param bundleBase 该 bundle 的 base URL（用于解析组件脚本地址）
 * @param fromRemoteBundle 是否来自远程 URL（主工程等），为 true 时组件脚本不预加载，拖拽时按需加载
 */
const addComponents = (
    materialBundle: Material,
    bundleBase?: string,
    fromRemoteBundle?: boolean
) => {
    const { snippets, components } = materialBundle;
    parseMaterialsDependencies(materialBundle, {
        skipScriptPreload: fromRemoteBundle === true,
        bundleBase
    });

    // 诊断：已进入 materialsDeps 的脚本（画布会据此预加载并注册到 TinyLowcodeComponent）
    const { scripts: scriptsDeps } = useResource().appSchemaState.materialsDeps;
    /* eslint-disable no-console -- 诊断 materialsDeps 更新 */
    if (console?.log && scriptsDeps?.length) {
        const compNames = scriptsDeps.flatMap(
            (s: { components?: Record<string, unknown> }) =>
                Object.keys(s.components || {})
        );
        const unique = compNames.filter(
            (n: string, i: number, a: string[]) => a.indexOf(n) === i
        );
        console.log(
            '[Materials] materialsDeps.scripts 已更新，将同步到画布预加载。组件名:',
            unique
        );
    }
    /* eslint-enable no-console */

    // 为组件添加英文翻译（如果不存在）
    components.forEach(component => {
        addEnglishNameToComponent(component);
    });

    // 注册组件到map中（传入 bundleBase 以便解析脚本时用正确 origin）
    components.forEach(c => {
        registerComponentToResource(c, bundleBase);
    });
    // 添加组件snippets
    addComponentSnippets(snippets, materialState.components);
};

/**
 * 添加物料Bundle文件中的区块类型物料
 * @param blocks 物料包Bundle.json文件中blocks对象
 */
const addBlocks = (blocks?: Block[]) => {
    if (!Array.isArray(blocks) || !blocks.length) {
        return;
    }

    // 提前构建区块
    blocks.map(item => getBlockCompileRes(item));

    // 默认区块都会展示在默认分组中
    if (!materialState.blocks?.[0]?.children) {
        materialState.blocks.push({
            groupId: useBlock().DEFAULT_GROUP_ID,
            groupName: useBlock().DEFAULT_GROUP_NAME,
            children: []
        });
    }

    // 区块存到物料列表
    materialState.blocks[0].children.unshift(...blocks);
};

/**
 * 将 bundle 内的相对资源地址（components/packages 的 script/css）按 bundleBase 绝对化。
 * 这样后续无论走预加载链路还是拖拽按需加载，都不会回落到设计器 origin（8090）。
 */
const normalizeMaterialAssetUrls = (
    materials: Material,
    bundleBase?: string
): Material => {
    if (!bundleBase) return materials;
    const toAbsString = (u: string) =>
        toAbsoluteMaterialUrl(u, bundleBase) || u;

    const components = (materials.components || []).map(component => {
        const npm = component.npm
            ? {
                  ...component.npm,
                  script: component.npm.script
                      ? toAbsString(component.npm.script)
                      : component.npm.script,
                  css:
                      typeof component.npm.css === 'string'
                          ? toAbsString(component.npm.css)
                          : component.npm.css
              }
            : component.npm;
        const contentNpm = (
            component as {
                content?: {
                    npm?: { script?: string; css?: string | string[] };
                };
            }
        ).content?.npm;
        const content =
            contentNpm &&
            (component as { content?: Record<string, unknown> }).content
                ? {
                      ...(component as { content?: Record<string, unknown> })
                          .content,
                      npm: {
                          ...contentNpm,
                          script:
                              typeof contentNpm.script === 'string'
                                  ? toAbsString(contentNpm.script)
                                  : contentNpm.script,
                          css:
                              typeof contentNpm.css === 'string'
                                  ? toAbsString(contentNpm.css)
                                  : contentNpm.css
                      }
                  }
                : (component as { content?: Record<string, unknown> }).content;
        return {
            ...component,
            npm,
            ...(content ? { content } : {})
        };
    });

    const packages = (materials.packages || []).map(pkg => ({
        ...pkg,
        script: pkg.script ? toAbsString(pkg.script) : pkg.script,
        css: typeof pkg.css === 'string' ? toAbsString(pkg.css) : pkg.css
    }));

    return {
        ...materials,
        components,
        packages
    };
};

/**
 * 获取到符合物料协议的bundle.json之后，处理组件与区块物料
 * @param materials 物料包内容
 * @param bundleUrl 该 bundle 的 URL（如 http://localhost:3060/bundle.json），用于解析组件脚本 base
 */
const addMaterials = (materials: Material, bundleUrl?: string) => {
    if (bundleUrl) materialBundleLoadTimestamp = Date.now();
    /* eslint-disable no-console -- 诊断远程 bundle 加载 */
    if (bundleUrl && console?.log) {
        console.log(
            '[Materials] 远程 bundle，组件将按需加载（不预加载脚本）',
            bundleUrl
        );
    }
    /* eslint-enable no-console */
    const bundleBase =
        typeof bundleUrl === 'string'
            ? bundleUrl.replace(/\/[#?].*$/, '').replace(/\/[^/]*$/, '')
            : undefined;
    const normalized = normalizeMaterialAssetUrls(materials, bundleBase);
    addComponents(normalized, bundleBase, !!bundleUrl);
    addBlocks(normalized.blocks);
};

const getMaterial = (name?: string): Partial<Resource & BlockResource> => {
    if (name) {
        // 先读取组件缓存，再读取区块缓存
        return (
            resource.get(name) ||
            resource.get(capitalize(camelize(name))) ||
            blockResource.get(name) ||
            blockResource.get(capitalize(camelize(name))) ||
            {}
        );
    }
    return {};
};

const setMaterial = (name: string, data: Resource) => {
    resource.set(name, data);
};

/**
 * 获取物料，并返回符合物料协议的bundle.json内容
 * @returns getMaterialsRes: () =>  Promise<Materials>
 */
const getMaterialsRes = async () => {
    const bundleUrls = getBundleUrls();
    const materials = await Promise.allSettled(
        bundleUrls.map((url: any) =>
            typeof url === 'string'
                ? getMetaApi(META_SERVICE.Http).get(url)
                : url
        )
    );
    return materials;
};

const fetchMaterial = async () => {
    const bundleUrls = getBundleUrls();
    const materials = await getMaterialsRes();
    materials.forEach((response, index) => {
        if (response.status !== 'fulfilled' || !response.value) return;
        const materialsPayload =
            response.value.materials ||
            (response.value as { data?: { materials?: Material } })?.data
                ?.materials;
        const bundleUrl =
            typeof bundleUrls[index] === 'string'
                ? bundleUrls[index]
                : undefined;
        if (materialsPayload) addMaterials(materialsPayload, bundleUrl);
    });
    updateCanvasDeps();
};

/**
 * 获取区块保存的依赖信息，合并到appSchemaState.thirdPartyDeps
 * @param {object} dependencies 区块保存的依赖信息
 */
const getBlockDeps = (
    dependencies: { scripts?: Dependency[]; styles?: any[] } = {}
) => {
    const { scripts = [], styles = [] } = dependencies;

    if (scripts.length) {
        scripts.forEach(npm => {
            const { package: pkg, script, css, components } = npm;
            const npmInfo = materialState.componentsDepsMap.scripts.find(
                item => item.package === pkg
            );

            if (!npmInfo?.script) {
                materialState.componentsDepsMap.scripts.push({
                    package: pkg,
                    script,
                    css,
                    components
                });
            } else {
                const existingComponents = npmInfo.components || {};

                npmInfo.components = {
                    ...existingComponents,
                    ...npm.components
                };
            }
        });
    }

    if (Array.isArray(styles)) {
        styles.forEach(item =>
            materialState.componentsDepsMap.styles.add(item)
        );
    }
};

/**
 * 过滤内置物料，用户配置隐藏的内置物料，不显示在物料面板
 * @param materials 物料
 * @returns 过滤后的物料
 */
const filterBuiltinMaterials = (materials: Material) => {
    const hiddenBuiltinMaterials =
        getOptions(meta.id).hiddenBuiltinMaterials || [];

    return {
        ...materials,
        components: materials.components?.map(component => {
            // 确保组件的 name 字段被正确保留
            return component;
        }),
        snippets: materials.snippets?.map(item => {
            return {
                ...item,
                children: item.children
                    ?.filter(
                        child =>
                            !hiddenBuiltinMaterials.includes(child.snippetName)
                    )
                    .map(child => {
                        // 确保 child 的 name 字段被正确保留（包括 en_US）
                        return child;
                    })
            };
        })
    };
};

const initBuiltinMaterial = () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- 画布 API 内置物料键名
    const { Builtin } = useCanvas().canvasApi.value;
    const builtinMaterials = filterBuiltinMaterials(Builtin!.data.materials);
    const builtinComponentMaterials = filterBuiltinMaterials(
        BuiltinComponentMaterials
    );

    // 添加画布物料
    addMaterials(builtinMaterials);
    // 添加builtin-component NPM包物料
    addMaterials(builtinComponentMaterials);
};

const initMaterial = ({
    isInit = true,
    appData = {}
}: InitMaterialOptions = {}) => {
    initBuiltinMaterial();
    if (isInit) {
        appData.componentsMap?.forEach(component => {
            if (component.dependencies) {
                getBlockDeps(component.dependencies);
            }
        });
    }
};
/**
 * 从物料 schema 中提取默认 props（property + defaultValue），用于拖入画布时节点带默认值
 * 这样面板里配置的默认值（如 sceneType: 'D10100'）会在新节点上生效，且出码/预览能拿到该 prop
 */
const getDefaultPropsFromMaterialSchema = (material: Partial<Resource>) => {
    const schema =
        material.schema ||
        (material as { content?: { schema?: { properties?: unknown[] } } })
            .content?.schema;
    const properties = schema?.properties;
    if (!Array.isArray(properties)) return {};
    const defaults: Record<string, unknown> = {};
    properties.forEach(
        (group: {
            content?: Array<{ property?: string; defaultValue?: unknown }>;
        }) => {
            (group.content || []).forEach(
                (item: { property?: string; defaultValue?: unknown }) => {
                    if (
                        item.property !== undefined &&
                        item.property !== null &&
                        item.defaultValue !== undefined
                    ) {
                        defaults[item.property] = item.defaultValue;
                    }
                }
            );
        }
    );
    /** MrBackButton：物料里 defaultValue 置空以便出码不把 defaultHref 与「默认值」等同而省略；运行态仍用 javascript:void(0) */
    const matComp = (material as { component?: string }).component;
    if (matComp === 'MrBackButton') {
        const dh = defaults.defaultHref;
        if (dh === undefined || dh === '') {
            defaults.defaultHref = 'javascript:void(0)';
        }
    }
    return defaults;
};

/**
 * 将节点上缺失的 props 用物料默认值写入（会调用 setProp，仅填缺失或空字符串）
 * 用于属性面板打开时，保证节点 schema 与面板展示一致，画布/预览渲染能拿到 sceneType 等
 */
const fillNodePropsWithMaterialDefaults = (
    nodeSchema:
        | { componentName?: string; props?: Record<string, unknown> }
        | null
        | undefined,
    setProp: (name: string, value: unknown) => void
): void => {
    if (!nodeSchema?.componentName || typeof setProp !== 'function') return;
    if (nodeSchema.componentName === 'MrBackButton') {
        const p = nodeSchema.props || {};
        const cur = p.defaultHref;
        if (cur === undefined || cur === '') {
            setProp('defaultHref', 'javascript:void(0)');
        }
        return;
    }
    const material = getMaterial(nodeSchema.componentName);
    const defaultProps = getDefaultPropsFromMaterialSchema(material);
    const props = nodeSchema.props || {};
    Object.entries(defaultProps).forEach(([key, defaultValue]) => {
        const current = props[key];
        if (current === undefined || current === '') {
            setProp(key, defaultValue);
        }
    });
};

/** 用于 MrSegment 子按钮的唯一 value 候选，避免出码时多个按钮同 value 导致全选 */
const SEGMENT_BUTTON_VALUE_CANDIDATES = [
    'default',
    'segment',
    'button',
    'tab1',
    'tab2',
    'tab3'
];

/**
 * 用物料 schema 的默认 props 补全节点树上缺失的字段（不覆盖已有值）
 * 用于预览/出码前保证所有节点都有完整 props，避免「面板显示默认值但节点未写入」导致运行时拿不到
 */
const patchSchemaWithMaterialDefaults = (
    schema: Record<string, unknown> | null | undefined,
    /** 递归子节点时传入，保证 MrForm/MrSwitch 等写入的是页面根 state，而非子节点上的空 state */
    sharedPageState?: Record<string, unknown>
): void => {
    if (!schema || typeof schema !== 'object') return;

    const isRootVisit = sharedPageState === undefined;

    // root state（用于 MrSwitch 等需要 v-model 语义的组件自动生成 state 变量）
    const rootState: Record<string, unknown> =
        sharedPageState ??
        ((schema as any).state &&
        typeof (schema as any).state === 'object' &&
        !Array.isArray((schema as any).state)
            ? { ...(schema as any).state }
            : {});

    const componentName = schema.componentName as string | undefined;
    if (componentName) {
        const material = getMaterial(componentName);
        const defaultProps = getDefaultPropsFromMaterialSchema(material);
        if (Object.keys(defaultProps).length > 0) {
            const props = (schema.props as Record<string, unknown>) || {};
            const merged: Record<string, unknown> = { ...defaultProps };
            Object.keys(props).forEach(k => {
                if (props[k] !== undefined && props[k] !== '')
                    merged[k] = props[k];
            });
            schema.props = merged;
        }
    }
    // MrLabel：ion-label 使用 slot 显示内容，不支持 label 属性。若 schema 误用 props.label，转为 children
    if (componentName === 'MrLabel') {
        const props = schema.props as Record<string, unknown> | undefined;
        const labelVal = props?.label;
        const { children } = schema;
        const hasChildren = Array.isArray(children)
            ? children.length > 0
            : children !== undefined && children !== null && children !== '';
        if (typeof labelVal === 'string' && labelVal !== '' && !hasChildren) {
            schema.children = labelVal;
            if (props) delete props.label;
        }
    }
    // MrTitle / MrLabel / MrButton：slot 文案在 schema.children 字符串与 props.children（及误配的 props.text）间对齐
    syncSlotStringChildrenWithPropsChildren(schema);
    // MrBackButton：节点上显式写入 defaultHref，避免出码与「物料 defaultValue」相同而被省略
    if (componentName === 'MrBackButton') {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        const dh = props.defaultHref;
        if (dh === undefined || dh === '') {
            props.defaultHref = 'javascript:void(0)';
        }
    }

    // MpTags：modelValue 需具备 v-model 语义，否则出码会变成 modelValue="1" 这种常量字符串
    if (componentName === 'MpTags') {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        const mv = props.modelValue;
        const isExpr =
            mv &&
            typeof mv === 'object' &&
            (mv as Record<string, unknown>).type === 'JSExpression';
        if (isExpr) {
            const exprVal = (mv as Record<string, unknown>).value;
            if (typeof exprVal === 'string') {
                const m = /^this\.state\.(mpTags\d+)$/.exec(exprVal.trim());
                const [, stateKey] = m ?? [];
                if (
                    typeof stateKey === 'string' &&
                    stateKey &&
                    !Object.prototype.hasOwnProperty.call(rootState, stateKey)
                ) {
                    // snippetSchema 可能已绑定 this.state.mpTags1，但页面根 state 尚未创建该字段
                    rootState[stateKey] = '1';
                }
            }
        }
        if (!isExpr) {
            let i = 1;
            let stateKey = `mpTags${i}`;
            while (Object.prototype.hasOwnProperty.call(rootState, stateKey)) {
                i += 1;
                stateKey = `mpTags${i}`;
            }
            rootState[stateKey] = mv === undefined || mv === '' ? '1' : mv;
            props.modelValue = {
                type: 'JSExpression',
                value: `this.state.${stateKey}`,
                model: true
            };
        }
    }

    // MrSwitch：若 modelValue 为常量（true/false），自动转为 this.state.xxx 的双向绑定，避免出码后“点不动/回弹”
    if (componentName === 'MrSwitch') {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        const mv = props.modelValue;
        const isExpr =
            mv &&
            typeof mv === 'object' &&
            (mv as Record<string, unknown>).type === 'JSExpression';
        if (!isExpr) {
            let i = 1;
            let stateKey = `mrSwitch${i}`;
            while (Object.prototype.hasOwnProperty.call(rootState, stateKey)) {
                i += 1;
                stateKey = `mrSwitch${i}`;
            }
            rootState[stateKey] = mv === undefined || mv === '' ? false : mv;
            props.modelValue = {
                type: 'JSExpression',
                value: `this.state.${stateKey}`,
                model: true
            };
        }
    }

    // MrToggle：若 modelValue 为常量（true/false），自动转为 this.state.xxx 的双向绑定，避免出码后“点不动/不回写”
    if (componentName === 'MrToggle') {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        const mv = props.modelValue;
        const isExpr =
            mv &&
            typeof mv === 'object' &&
            (mv as Record<string, unknown>).type === 'JSExpression';
        if (!isExpr) {
            let i = 1;
            let stateKey = `mrToggle${i}`;
            while (Object.prototype.hasOwnProperty.call(rootState, stateKey)) {
                i += 1;
                stateKey = `mrToggle${i}`;
            }
            rootState[stateKey] = mv === undefined || mv === '' ? false : mv;
            props.modelValue = {
                type: 'JSExpression',
                value: `this.state.${stateKey}`,
                model: true
            };
        }
    }

    // MrForm：给 MpInput 子项自动补 this.state.xxx.yyy 绑定，避免输入值在重渲染时丢失
    if (componentName === 'MrForm') {
        const MR_FORM_FIELD_EXPR = /^this\.state\.(mrForm\d+)\.(.+)$/;
        const children = schema.children as
            | Array<Record<string, unknown>>
            | undefined;

        const getStateKeyFromChild = (
            ch: Record<string, unknown>
        ): string | null => {
            const component = ch?.componentName;
            if (component !== 'MpInput' && component !== 'MrField') return null;

            const mv = (ch.props as Record<string, unknown> | undefined)
                ?.modelValue as Record<string, unknown> | undefined;
            if (!mv || typeof mv !== 'object') return null;
            if (mv.type !== 'JSExpression') return null;

            const { value } = mv as Record<string, unknown>;
            if (typeof value !== 'string') return null;

            const m = MR_FORM_FIELD_EXPR.exec(value.trim());
            const [, candidate] = m ?? [];
            return typeof candidate === 'string' && candidate
                ? candidate
                : null;
        };

        let stateKey: string | null = null;
        if (Array.isArray(children)) {
            for (const ch of children) {
                const candidate = getStateKeyFromChild(ch);
                if (candidate) {
                    stateKey = candidate;
                    break;
                }
            }
        }
        if (!stateKey) {
            let i = 1;
            let k = `mrForm${i}`;
            while (Object.prototype.hasOwnProperty.call(rootState, k)) {
                i += 1;
                k = `mrForm${i}`;
            }
            stateKey = k;
        }

        const prevNest =
            rootState[stateKey] &&
            typeof rootState[stateKey] === 'object' &&
            !Array.isArray(rootState[stateKey])
                ? { ...(rootState[stateKey] as Record<string, unknown>) }
                : {};
        const formState: Record<string, unknown> = { ...prevNest };
        let touched = false;
        if (Array.isArray(children)) {
            children.forEach((child, idx) => {
                if (
                    child?.componentName !== 'MpInput' &&
                    child?.componentName !== 'MrField'
                )
                    return;
                const childProps =
                    (child.props as Record<string, unknown>) || {};
                if (!child.props) child.props = childProps;
                const fieldName =
                    typeof childProps.name === 'string' &&
                    childProps.name.trim()
                        ? childProps.name.trim()
                        : `field${idx + 1}`;
                const mv = childProps.modelValue;
                const isExpr =
                    mv &&
                    typeof mv === 'object' &&
                    (mv as Record<string, unknown>).type === 'JSExpression';
                if (!isExpr) {
                    touched = true;
                    childProps.modelValue = {
                        type: 'JSExpression',
                        value: `this.state.${stateKey}.${fieldName}`,
                        model: true
                    };
                    if (!(fieldName in formState)) {
                        formState[fieldName] =
                            mv === undefined || mv === null ? '' : mv;
                    }
                }
                if (!(fieldName in formState)) {
                    formState[fieldName] = isExpr
                        ? ''
                        : mv === undefined || mv === null
                        ? ''
                        : mv;
                }
            });
        }
        if (touched || Object.keys(formState).length > 0) {
            rootState[stateKey] = formState;
        }
        // @complete 演示：指回当前表单 state key，并提供提交开关/上次提交结果占位
        if (stateKey) {
            if (
                rootState.demoFormTargetKey === undefined ||
                rootState.demoFormTargetKey === ''
            ) {
                rootState.demoFormTargetKey = stateKey;
            }
            if (rootState.formDemoSubmitEnabled === undefined) {
                rootState.formDemoSubmitEnabled = false;
            }
            if (rootState.formDemoLastSubmit === undefined) {
                rootState.formDemoLastSubmit = null;
            }
        }
    }

    // MrCollapse：若 modelValue 为常量/空，自动转为 this.state.xxx 的双向绑定，避免出码后折叠交互不生效
    if (componentName === 'MrCollapse') {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        const mv = props.modelValue;
        const isExpr =
            mv &&
            typeof mv === 'object' &&
            (mv as Record<string, unknown>).type === 'JSExpression';
        if (!isExpr) {
            let i = 1;
            let stateKey = `mrCollapse${i}`;
            while (Object.prototype.hasOwnProperty.call(rootState, stateKey)) {
                i += 1;
                stateKey = `mrCollapse${i}`;
            }
            rootState[stateKey] = Array.isArray(mv) ? mv : ['0'];
            props.modelValue = {
                type: 'JSExpression',
                value: `this.state.${stateKey}`,
                model: true
            };
        }
    }
    // MrRadioGroup：若 modelValue 为常量/空，自动转为 this.state.xxx 的双向绑定，避免出码后无法切换
    if (componentName === 'MrRadioGroup') {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        const mv = props.modelValue;
        const isExpr =
            mv &&
            typeof mv === 'object' &&
            (mv as Record<string, unknown>).type === 'JSExpression';
        if (!isExpr) {
            let i = 1;
            let stateKey = `mrRadioGroup${i}`;
            while (Object.prototype.hasOwnProperty.call(rootState, stateKey)) {
                i += 1;
                stateKey = `mrRadioGroup${i}`;
            }
            const children = schema.children as
                | Array<Record<string, unknown>>
                | undefined;
            const firstRadioNode = Array.isArray(children)
                ? children.find(c => c?.componentName === 'MrRadio')
                : undefined;
            const firstRadioName = firstRadioNode?.props
                ? (firstRadioNode.props as Record<string, unknown>).name
                : undefined;
            rootState[stateKey] =
                mv === undefined || mv === '' ? firstRadioName ?? '' : mv;
            props.modelValue = {
                type: 'JSExpression',
                value: `this.state.${stateKey}`,
                model: true
            };
        }
    }
    // MrCheckboxGroup：若 modelValue 为常量/空，自动转为 this.state.xxx 的双向绑定，避免出码后无法勾选
    if (componentName === 'MrCheckboxGroup') {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        const mv = props.modelValue;
        const isExpr =
            mv &&
            typeof mv === 'object' &&
            (mv as Record<string, unknown>).type === 'JSExpression';
        if (!isExpr) {
            let i = 1;
            let stateKey = `mrCheckboxGroup${i}`;
            while (Object.prototype.hasOwnProperty.call(rootState, stateKey)) {
                i += 1;
                stateKey = `mrCheckboxGroup${i}`;
            }
            rootState[stateKey] = Array.isArray(mv) ? mv : [];
            props.modelValue = {
                type: 'JSExpression',
                value: `this.state.${stateKey}`,
                model: true
            };
        }
    }
    // Header 工具栏链：与 generateNode 跳过列表一致，清理历史 schema 上误带的 component-base-style
    if (
        COMPONENTS_SKIP_BASE_STYLE.includes(componentName || '') &&
        schema.props &&
        typeof schema.props === 'object'
    ) {
        const p = schema.props as Record<string, unknown>;
        const cn = p.className;
        if (
            typeof cn === 'string' &&
            cn.split(/\s+/).includes(BASE_STYLE_CLASS_NAME)
        ) {
            const rest = cn
                .split(/\s+/)
                .filter(c => c && c !== BASE_STYLE_CLASS_NAME)
                .join(' ');
            p.className = rest || '';
        }
    }
    // MrSegment 子按钮 value 唯一性修复 + 移除 component-base-style（见 constants.ts）
    if (componentName === 'MrSegment') {
        const children = schema.children as
            | Array<Record<string, unknown>>
            | undefined;
        if (Array.isArray(children)) {
            const values = children
                .filter(c => c?.componentName === 'MrSegmentButton')
                .map(c =>
                    String((c.props as Record<string, unknown>)?.value ?? '')
                );
            const hasDup =
                values.length !== new Set(values).size || values.some(v => !v);
            children.forEach((child, i) => {
                if (
                    child?.componentName === 'MrSegmentButton' &&
                    child.props &&
                    typeof child.props === 'object'
                ) {
                    if (hasDup) {
                        (child.props as Record<string, unknown>).value =
                            SEGMENT_BUTTON_VALUE_CANDIDATES[i] ?? `tab${i}`;
                    }
                    const cn = (child.props as Record<string, unknown>)
                        .className;
                    if (
                        typeof cn === 'string' &&
                        cn.split(/\s+/).includes(BASE_STYLE_CLASS_NAME)
                    ) {
                        const rest = cn
                            .split(/\s+/)
                            .filter(c => c && c !== BASE_STYLE_CLASS_NAME)
                            .join(' ');
                        (child.props as Record<string, unknown>).className =
                            rest || '';
                    }
                }
            });
        }
    }
    const children = schema.children as
        | Array<Record<string, unknown>>
        | undefined;
    if (Array.isArray(children)) {
        children.forEach(child => {
            patchSchemaWithMaterialDefaults(child, rootState);
        });
    }

    // 仅页面根 schema 持有 state，避免子节点递归时用空对象覆盖/污染
    if (isRootVisit) {
        (schema as any).state = rootState;
    }
};

const generateNode = ({ type, component }) => {
    const snippet = getSnippet(component) || {};
    const material = getMaterial(component);
    const materialUseBaseStyle = material.configure?.useBaseStyle;
    const globalUseBaseStyle = getOptions(meta.id).useBaseStyle;
    const skipBaseStyle = COMPONENTS_SKIP_BASE_STYLE.includes(component);
    const useBaseStyle =
        globalUseBaseStyle && materialUseBaseStyle !== false && !skipBaseStyle;
    const defaultPropsFromSchema = getDefaultPropsFromMaterialSchema(material);
    const schema = {
        componentName: component,
        ...snippet,
        props: {
            ...defaultPropsFromSchema,
            ...snippet.props,
            className: useBaseStyle
                ? getOptions(meta.id).componentBaseStyle.className
                : ''
        }
    };

    // MpTags：拖拽落盘时就创建 page state（对齐 MrRadioGroup 等组件的体验）
    if (component === 'MpTags') {
        try {
            const pageSchema = useCanvas().getSchema?.() as
                | { state?: Record<string, unknown> }
                | undefined;
            const rootState =
                pageSchema?.state &&
                typeof pageSchema.state === 'object' &&
                !Array.isArray(pageSchema.state)
                    ? pageSchema.state
                    : (pageSchema ? ((pageSchema.state = {}) as Record<
                          string,
                          unknown
                      >) : {});

            // 若 snippetSchema 已绑定 this.state.mpTags1，但 state 未创建，这里补齐
            const mv = (schema.props as Record<string, unknown>)?.modelValue as
                | Record<string, unknown>
                | undefined;
            const mvExpr =
                mv && mv.type === 'JSExpression' ? mv.value : undefined;
            const m =
                typeof mvExpr === 'string'
                    ? /^this\.state\.(mpTags\d+)$/.exec(mvExpr.trim())
                    : null;
            let stateKey = m?.[1] || '';
            if (!stateKey) {
                let i = 1;
                stateKey = `mpTags${i}`;
                while (
                    Object.prototype.hasOwnProperty.call(rootState, stateKey)
                ) {
                    i += 1;
                    stateKey = `mpTags${i}`;
                }
                (schema.props as Record<string, unknown>).modelValue = {
                    type: 'JSExpression',
                    value: `this.state.${stateKey}`,
                    model: true
                };
            }
            if (
                stateKey &&
                !Object.prototype.hasOwnProperty.call(rootState, stateKey)
            ) {
                rootState[stateKey] = '1';
            }
        } catch {
            // ignore
        }
    }

    if (type === 'block') {
        schema.componentType = 'Block';
        schema.props.className = getOptions(meta.id).useBaseStyle
            ? getOptions(meta.id).blockBaseStyle.className
            : '';
    }

    return schema;
};
const refreshMaterial = async () => {
    clearMaterials();
    initMaterial();
    await fetchMaterial();
};

/**
 * 根据组名获取指定分组组件
 * @param components 所有组件
 * @param groupName 组件分组名
 * @returns
 */
const getComponentsByGroup = (components: Component[], groupName: string) => {
    if (!Array.isArray(components)) return [];
    return components.filter(item => item.group === groupName);
};

/**
 * 增加区块缓存
 * @param id 区块 id，也就是 label 字段
 * @param blockResourceData 区块信息，区块详情中的 content 字段
 */
const addBlockResources = (id: string, blockResourceData: BlockResource) => {
    blockResource.set(id, blockResourceData);
};

const getComponentList = () => {
    return Array.from(resource.values())
        .filter(item => item.type === MATERIAL_TYPE.Component)
        .map(dataItem => {
            return {
                component: dataItem.component,
                name: dataItem.name
            };
        });
};

const getComponentDetail = name => {
    const data = resource.get(name);

    const props = data.schema.properties
        .map(item => {
            return item.content.map(content => {
                return {
                    property: content.property,
                    description: content.description,
                    type: content.type,
                    defaultValue: content.defaultValue
                };
            });
        })
        .flat();

    const events = Object.entries(data.schema.events || {}).map(
        ([key, value]) => {
            return {
                name: key,
                description: value?.description || ''
            };
        }
    );

    const slots = Object.entries(data.schema.slots || {}).map(
        ([key, value]) => {
            return {
                name: key,
                description: value?.description || ''
            };
        }
    );

    return {
        component: data.component,
        name: data.name,
        configure: data.configure,
        props,
        events,
        slots
    };
};

// 存放着组件、物料侧区块、第三方依赖信息
// 物料模块初始化
// 请求物料并进行处理
// 获取物料，并返回符合物料协议的bundle.json内容，getMaterialsRes: () =>  Promise<Materials>
// 根据 包含{ type, componentName }的组件信息生成组件schema节点，结构：
// 清空物料
// 清空区块缓存，以便更新最新版区块
// 获取单个物料，(property) getMaterial: (name: string) => Material
// 设置单个物料 (property) setMaterial: (name: string, data: Material) => void
// 添加多个物料
// 组装画布依赖，包含物料和工具类的依赖。
// 通知画布更新依赖
// 获取物料组件的配置信息

export default function useMaterialExport() {
    return {
        materialState,
        initMaterial,
        fetchMaterial,
        getMaterialsRes,
        generateNode,
        clearMaterials,
        clearBlockResources,
        getMaterial,
        setMaterial,
        getBundleBaseUrlForComponent,
        getMaterialCacheBustParam,
        addMaterials,
        getCanvasDeps,
        updateCanvasDeps,
        getConfigureMap,
        getBlockByName,
        getBlockCompileRes,
        addBlockResources,
        updateBlockCompileCache,
        getComponentsByGroup,
        refreshMaterial,
        getComponentList,
        getComponentDetail,
        patchSchemaWithMaterialDefaults,
        fillNodePropsWithMaterialDefaults
    };
}

export { getMaterialsRes, addBlockResources };
