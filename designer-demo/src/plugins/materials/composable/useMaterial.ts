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
    getBundleUrls,
    getMaterialsBaseFromBundleUrls
} from '@/composable/loadRuntimeFromBundles';
import {
    materialsDiag,
    materialsDiagCaller,
    summarizeMaterialPayload,
    summarizeSnippetPanel
} from '@/composable/materialsDiag';
import {
    awaitMaterialsSessionGate,
    awaitMaterialsStartupOwnership,
    dedupeSnippetGroups,
    isMaterialsSessionReady,
    isMaterialsWriteBlocked,
    markMaterialsSessionReady,
    registerMaterialsSessionHandlers,
    resetMaterialsSession,
    runExclusiveColdStart as runExclusiveColdStartSession,
    runInMaterialsSessionGate
} from '@/composable/materialsSession';
import {
    getDesignerMaterialBaseUrl,
    toAbsoluteMaterialUrl
} from '@/utils/designerOrigin';
import {
    applyGenerateNodeModelPatches,
    applyModelBindingSchemaPatch
} from '@/plugins/materials/component-defaults/schema-patches';

import { BASE_STYLE_CLASS_NAME } from '../constants';
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

/**
 * Force a process-wide singleton. Vite can evaluate this module twice (alias vs
 * relative), which previously left panel writes on one state and clear on another
 * → Materials panel 2x/3x and hasMainProject:false.
 */
const MATERIAL_STORE_KEY = '__TINY_ENGINE_MATERIAL_STORE__';
type MaterialStore = {
    resource: Map<string, Resource>;
    blockResource: Map<string, BlockResource>;
    componentBundleBaseMap: Map<string, string>;
    materialBundleLoadTimestamp: number | null;
    hasBuiltinMaterials: boolean;
    materialState: MaterialState;
};
const getMaterialStore = (): MaterialStore => {
    const g = globalThis as typeof globalThis & {
        [MATERIAL_STORE_KEY]?: MaterialStore;
    };
    if (!g[MATERIAL_STORE_KEY]) {
        g[MATERIAL_STORE_KEY] = {
            resource: new Map<string, Resource>(),
            blockResource: new Map<string, BlockResource>(),
            componentBundleBaseMap: new Map<string, string>(),
            materialBundleLoadTimestamp: null,
            hasBuiltinMaterials: false,
            materialState: reactive<MaterialState>({
                components: [],
                blocks: [],
                componentsDepsMap: { scripts: [], styles: new Set() },
                packages: []
            })
        };
    }
    return g[MATERIAL_STORE_KEY]!;
};
const materialStore = getMaterialStore();

const { resource, blockResource, componentBundleBaseMap, materialState } =
    materialStore;

/** Session lock lives in materialsSession.ts (shared with materialStartupLoader). */
const getHasBuiltinMaterials = () => materialStore.hasBuiltinMaterials;
const setHasBuiltinMaterials = (v: boolean) => {
    materialStore.hasBuiltinMaterials = v;
};

const applyDedupeToPanel = () => {
    const next = dedupeSnippetGroups(materialState.components as any);
    materialState.components.splice(
        0,
        materialState.components.length,
        ...(next as typeof materialState.components)
    );
};

const runExclusiveColdStart = async (work: () => Promise<void>) => {
    // clear / getPanel / dedupe come from registerMaterialsSessionHandlers
    await runExclusiveColdStartSession(work);
    setHasBuiltinMaterials(true);
};

const markColdStartComplete = () => {
    markMaterialsSessionReady();
    setHasBuiltinMaterials(true);
    applyDedupeToPanel();
    materialsDiag('markColdStartComplete', {
        panel: summarizeSnippetPanel(materialState.components)
    });
};

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
    setHasBuiltinMaterials(false);
    resetMaterialsSession();
};
registerMaterialsSessionHandlers({
    clear: clearMaterials,
    getPanelGroups: () => materialState.components as any,
    applyDedupe: () => {
        applyDedupeToPanel();
    }
});

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
            // 同名组件（snippetName/component）用后加载的数据覆盖先加载的数据，
            // 以便远程主工程 bundle 正确覆盖内置 mock（含 icon/script 等字段）
            const target = snippetsMap.get(snippetGroup.group)!;
            snippetGroup.children.forEach(nextChild => {
                const nextKey =
                    nextChild.snippetName ||
                    nextChild.component ||
                    (nextChild as { schema?: { componentName?: string } })
                        .schema?.componentName;
                const idx = target.children.findIndex(existing => {
                    const existingKey =
                        existing.snippetName ||
                        existing.component ||
                        (existing as { schema?: { componentName?: string } })
                            .schema?.componentName;
                    return existingKey && existingKey === nextKey;
                });
                if (idx >= 0) {
                    target.children.splice(idx, 1, nextChild);
                } else {
                    target.children.push(nextChild);
                }
            });
            // Collapse any accidental duplicate keys left in the group
            const seen = new Set<string>();
            target.children = target.children.filter(child => {
                const key =
                    child.snippetName ||
                    child.component ||
                    (child as { schema?: { componentName?: string } }).schema
                        ?.componentName;
                if (!key) return true;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
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
/** 主工程物料包样式 fallback：当 bundle 来自远程 URL 且物料未声明 npm.css 时，强制追加 mr-bank.css */
const MAIN_PROJECT_STYLE_FALLBACK = 'mr-bank.css';

const getFilenameFromPath = (pathOrUrl: string) =>
    pathOrUrl.replace(/^.*\//, '');

const getPureFilename = (pathOrUrl: string) =>
    getFilenameFromPath(pathOrUrl).replace(/[?#].*$/, '');

const getStyleLayerPriority = (styleUrl: string): number => {
    const file = getPureFilename(styleUrl);
    if (file === 'tokens.css') return 10;
    if (file === MAIN_PROJECT_STYLE_FALLBACK) return 20;
    if (file === 'utilities.css') return 30;
    return 40;
};

const sortCanvasStylesByLayer = (styles: string[]): string[] => {
    const withIndex = styles.map((value, index) => ({ value, index }));
    withIndex.sort((a, b) => {
        const pa = getStyleLayerPriority(a.value);
        const pb = getStyleLayerPriority(b.value);
        if (pa !== pb) return pa - pb;
        // 同层保持原相对顺序，避免无关样式抖动
        return a.index - b.index;
    });
    return withIndex.map(item => item.value);
};

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
    const t = materialStore.materialBundleLoadTimestamp ?? Date.now();
    return `_t=${t}`;
};

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
    // 样式分层顺序（确定性）：tokens -> mr-bank.css -> utilities -> others
    // 目标：让 utilities（如 mt-20px）稳定覆盖组件基础样式（如 .van-button{margin:0}）
    // 不依赖异步注入时序，避免同一个 class 偶发失效。
    const allStyles = sortCanvasStylesByLayer([
        ...new Set([...styles, ...styleFallbacks])
    ]);

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
        const t = materialStore.materialBundleLoadTimestamp ?? Date.now();
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
                    )
                };
            }),
            styles: [...allStyles].map(s => {
                if (typeof s !== 'string') return s;
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
            script: item.script ? absolutize(item.script) : item.script
        })),
        styles: [...allStyles].map(s => {
            if (typeof s !== 'string') return s;
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
    // 无论是否远程 bundle，都必须下发 scriptsDeps（用于画布 iframe 预加载 + import map 映射）。
    // 否则主工程物料脚本里出现 @local/mr-components 等 bare specifier 时，iframe 无 import map 会直接报
    // “Failed to resolve module specifier”，最终表现为区块大片飘红。
    //
    // skipPreload 仅用于将来优化“远程 bundle 是否按需加载”策略；当前先保证功能正确。
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
    const snippets = Array.isArray(materialBundle?.snippets)
        ? materialBundle.snippets
        : [];
    const components = Array.isArray(materialBundle?.components)
        ? materialBundle.components
        : [];
    parseMaterialsDependencies(materialBundle, {
        skipScriptPreload: fromRemoteBundle === true,
        bundleBase
    });

    // 为组件添加英文翻译（如果不存在）
    components.forEach(component => {
        addEnglishNameToComponent(component);
    });

    // 注册组件到map中（传入 bundleBase 以便解析脚本时用正确 origin）
    components.forEach(c => {
        registerComponentToResource(c, bundleBase);
    });

    // snippets 若未配置 icon，则回填 components 中对应组件的 icon（支持主工程随 bundle 下发图标）
    const componentIconMap = new Map<string, string>();
    components.forEach(component => {
        if (
            typeof component?.component === 'string' &&
            typeof component?.icon === 'string' &&
            component.icon.trim()
        ) {
            componentIconMap.set(component.component, component.icon);
        }
    });
    snippets.forEach(group => {
        group?.children?.forEach(child => {
            if (child?.icon && String(child.icon).trim()) return;
            const key = child?.snippetName || child?.component;
            if (typeof key === 'string' && componentIconMap.has(key)) {
                child.icon = componentIconMap.get(key) as string;
            }
        });
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
    const isLikelyAssetUrl = (value?: string) => {
        const icon = value?.trim();
        if (!icon) return false;
        return (
            icon.startsWith('http://') ||
            icon.startsWith('https://') ||
            icon.startsWith('data:') ||
            icon.startsWith('/') ||
            icon.startsWith('./') ||
            icon.startsWith('../') ||
            /\.(svg|png|jpe?g|webp|gif|ico)$/i.test(icon)
        );
    };

    // 回填：packages 里声明的 script/css -> components.npm（常见：组件只写 npm.package，不写 npm.script）
    const pkgAssetMap = new Map<
        string,
        { script?: string; css?: string | string[] }
    >();
    (materials.packages || []).forEach(pkg => {
        if (!pkg || typeof pkg !== 'object') return;
        const p = pkg as unknown as {
            package?: string;
            packageName?: string;
            name?: string;
            script?: string;
            css?: string | string[];
        };
        const pkgKey = p.package || p.packageName || p.name;
        if (!pkgKey) return;
        pkgAssetMap.set(pkgKey, {
            script:
                typeof p.script === 'string' ? toAbsString(p.script) : p.script,
            css: Array.isArray(p.css)
                ? p.css.map(c => (typeof c === 'string' ? toAbsString(c) : c))
                : typeof p.css === 'string'
                ? toAbsString(p.css)
                : p.css
        });
    });

    const patchNpm = <
        T extends {
            package?: string;
            packageName?: string;
            script?: string;
            css?: any;
        }
    >(
        npm: T | undefined
    ): T | undefined => {
        if (!npm || typeof npm !== 'object') return npm;
        const pkg = npm.package || npm.packageName;
        if (!pkg) return npm;
        const assets = pkgAssetMap.get(pkg);
        if (!assets) return npm;
        return {
            ...npm,
            script:
                typeof npm.script === 'string'
                    ? toAbsString(npm.script)
                    : npm.script || assets.script,
            css:
                typeof npm.css === 'string'
                    ? toAbsString(npm.css)
                    : npm.css || assets.css
        };
    };

    const components = (materials.components || []).map(component => {
        const normalizedIcon =
            typeof component.icon === 'string' &&
            isLikelyAssetUrl(component.icon)
                ? toAbsString(component.icon)
                : component.icon;
        const npm = component.npm
            ? patchNpm({
                  ...component.npm,
                  script: component.npm.script
                      ? toAbsString(component.npm.script)
                      : component.npm.script,
                  css:
                      typeof component.npm.css === 'string'
                          ? toAbsString(component.npm.css)
                          : component.npm.css
              })
            : component.npm;
        const contentNpm = (
            component as {
                content?: {
                    npm?: { script?: string; css?: string | string[] };
                };
            }
        ).content?.npm;
        const content =
            contentNpm && (component as any)?.content
                ? (() => {
                      const patched = patchNpm(contentNpm);
                      // 注意：不改变 content 的结构类型，只在存在时回填/绝对化 npm 字段
                      return {
                          ...(component as any).content,
                          npm: {
                              ...(patched || contentNpm),
                              script:
                                  typeof contentNpm.script === 'string'
                                      ? toAbsString(contentNpm.script)
                                      : patched?.script,
                              css:
                                  typeof contentNpm.css === 'string'
                                      ? toAbsString(contentNpm.css)
                                      : patched?.css
                          }
                      };
                  })()
                : (component as any)?.content;
        return {
            ...component,
            icon: normalizedIcon,
            npm,
            ...(content ? { content } : {})
        };
    });

    const packages = (materials.packages || []).map(pkg => ({
        ...pkg,
        script: pkg.script ? toAbsString(pkg.script) : pkg.script,
        // 保持原类型：Package.css 在 types 里多为 string；这里只做 string 场景的绝对化
        css:
            typeof pkg.css === 'string'
                ? toAbsString(pkg.css)
                : (pkg as any).css
    }));

    const snippets = (materials.snippets || []).map(group => ({
        ...group,
        children: (group.children || []).map(child => ({
            ...child,
            icon:
                typeof child.icon === 'string' && isLikelyAssetUrl(child.icon)
                    ? toAbsString(child.icon)
                    : child.icon
        }))
    }));

    return {
        ...materials,
        components,
        snippets,
        packages
    };
};

/**
 * 获取到符合物料协议的bundle.json之后，处理组件与区块物料
 * @param materials 物料包内容
 * @param bundleUrl 该 bundle 的 URL（如 http://localhost:3060/bundle.json），用于解析组件脚本 base
 */
const addMaterials = (materials: Material, bundleUrl?: string) => {
    if (isMaterialsWriteBlocked()) {
        materialsDiag(
            'addMaterials: blocked (startup ownership / session ready)',
            {
                bundleUrl: bundleUrl ?? '(builtin/no-url)',
                payload: summarizeMaterialPayload(materials),
                caller: materialsDiagCaller()
            }
        );
        return;
    }
    materialsDiag('addMaterials', {
        bundleUrl: bundleUrl ?? '(builtin/no-url)',
        payload: summarizeMaterialPayload(materials),
        panelBefore: summarizeSnippetPanel(materialState.components),
        caller: materialsDiagCaller()
    });
    if (bundleUrl) materialStore.materialBundleLoadTimestamp = Date.now();
    const bundleBaseFromUrl =
        typeof bundleUrl === 'string'
            ? bundleUrl.replace(/\/[#?].*$/, '').replace(/\/[^/]*$/, '')
            : undefined;
    const remoteMaterialBase = getMaterialsBaseFromBundleUrls() || undefined;
    const isHttpMaterialBase =
        !!bundleBaseFromUrl &&
        (bundleBaseFromUrl.startsWith('http://') ||
            bundleBaseFromUrl.startsWith('https://'));
    const hasExplicitBundleUrl = typeof bundleUrl === 'string';
    // 内置 /mock 等「非 HTTP」bundle 的 base 不能用来解析 icons/*.svg，否则会落到 webview 相对路径 403。
    // 仅当本次确实在加载某个 bundle（如 /mock/bundle.json）且其 base 非 HTTP 时，才用远程 HTTP base 做资源归一化；
    // 未传 bundleUrl 的内置物料初始化不得套用远程 base，避免误改写内置脚本地址。
    const bundleBaseForNormalize =
        isHttpMaterialBase && bundleBaseFromUrl
            ? bundleBaseFromUrl
            : hasExplicitBundleUrl && bundleBaseFromUrl && !isHttpMaterialBase
            ? remoteMaterialBase || bundleBaseFromUrl
            : bundleBaseFromUrl || undefined;
    const bundleBase = bundleBaseFromUrl || undefined;
    const normalized = normalizeMaterialAssetUrls(
        materials,
        bundleBaseForNormalize
    );
    addComponents(normalized, bundleBase, !!bundleUrl);
    addBlocks(normalized.blocks);
    applyDedupeToPanel();
    materialsDiag('addMaterials: after', {
        bundleUrl: bundleUrl ?? '(builtin/no-url)',
        panelAfter: summarizeSnippetPanel(materialState.components)
    });
};

const getMaterial = (
    name?: string
): Partial<Resource & BlockResource> | undefined => {
    if (name) {
        // 先读取组件缓存，再读取区块缓存
        return (
            resource.get(name) ||
            resource.get(capitalize(camelize(name))) ||
            blockResource.get(name) ||
            blockResource.get(capitalize(camelize(name))) ||
            undefined
        );
    }
    return undefined;
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
    const fetchBundleJson = async (u: string) => {
        const res = await fetch(u, { cache: 'no-store' });
        const ct = res.headers.get('content-type') || '';
        const raw = await res.text();
        if (!res.ok) {
            throw new Error(
                `HTTP ${res.status}: ${
                    res.statusText
                }; content-type=${ct}; body=${raw.slice(0, 200)}`
            );
        }
        try {
            return JSON.parse(raw) as unknown;
        } catch (e) {
            throw new Error(
                `Invalid JSON; content-type=${ct}; body=${raw.slice(0, 200)}`
            );
        }
    };

    const shouldBypassHttpService = (u: string) =>
        /^(https?:\/\/|vscode-webview:|vscode-resource:|data:)/.test(u);

    const materials = await Promise.allSettled(
        bundleUrls.map((url: any) => {
            if (typeof url !== 'string') return url;
            // VSCode webview 环境下 HttpService 会被设置为走插件 adapter（proxyHttpRequest）。
            // 对主工程静态资源（http(s) bundle.json）应直接 fetch，避免被插件代理失败而导致物料无法写入 store。
            return shouldBypassHttpService(url)
                ? fetchBundleJson(url)
                : getMetaApi(META_SERVICE.Http).get(url);
        })
    );
    /* eslint-disable no-console -- 诊断远程 bundle 拉取/解析失败原因 */
    if (console?.warn) {
        materials.forEach((r, i) => {
            const u = bundleUrls[i];
            if (r.status === 'rejected') {
                const reason =
                    r.reason instanceof Error
                        ? r.reason.message
                        : String(r.reason);
                console.warn('[Materials] bundle 拉取失败:', u, reason);
            } else if (!r.value) {
                console.warn('[Materials] bundle 返回空:', u);
            }
        });
    }
    /* eslint-enable no-console */
    return materials;
};

const fetchMaterial = async () => {
    // VSCode + HTTP: wait for startup exclusive so we don't load once then stack again
    await awaitMaterialsStartupOwnership();
    if (isMaterialsSessionReady()) {
        materialsDiag('fetchMaterial: skip (session ready)');
        return;
    }
    await runInMaterialsSessionGate(async () => {
        const bundleUrls = getBundleUrls();
        materialsDiag('fetchMaterial: start', {
            bundleUrls,
            caller: materialsDiagCaller(),
            panelBefore: summarizeSnippetPanel(materialState.components)
        });
        const materials = await getMaterialsRes();
        materials.forEach((response, index) => {
            if (response.status !== 'fulfilled' || !response.value) {
                materialsDiag('fetchMaterial: url not fulfilled', {
                    url: bundleUrls[index],
                    status: response.status,
                    reason:
                        response.status === 'rejected'
                            ? String((response as PromiseRejectedResult).reason)
                            : null
                });
                return;
            }
            const pickMaterialsPayload = (v: any): Material | undefined => {
                if (!v || typeof v !== 'object') return undefined;
                const candidate =
                    v.materials ||
                    v?.data?.materials ||
                    v?.data?.data?.materials ||
                    v?.data?.data?.data?.materials ||
                    v?.data ||
                    v?.data?.data;
                const isMaterialLike = (x: any) =>
                    x &&
                    typeof x === 'object' &&
                    (Array.isArray(x.components) ||
                        Array.isArray(x.blocks) ||
                        Array.isArray(x.packages));
                if (isMaterialLike(v)) return v as Material;
                if (isMaterialLike(candidate)) return candidate as Material;
                return undefined;
            };
            const materialsPayload = pickMaterialsPayload(response.value);
            const bundleUrl =
                typeof bundleUrls[index] === 'string'
                    ? bundleUrls[index]
                    : undefined;
            materialsDiag('fetchMaterial: each url', {
                url: bundleUrl,
                payload: summarizeMaterialPayload(materialsPayload)
            });
            if (materialsPayload) {
                try {
                    addMaterials(materialsPayload, bundleUrl);
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.warn(
                        '[Materials] addMaterials 失败:',
                        bundleUrl,
                        e
                    );
                }
            } else {
                const keys =
                    response.value && typeof response.value === 'object'
                        ? Object.keys(response.value as any)
                        : [];
                // eslint-disable-next-line no-console
                console.warn(
                    '[Materials] bundle 结构不符合预期，未找到 materials:',
                    bundleUrl,
                    'keys=',
                    keys
                );
            }
        });
        updateCanvasDeps();
        applyDedupeToPanel();
        materialsDiag('fetchMaterial: done', {
            panelAfter: summarizeSnippetPanel(materialState.components)
        });
    });
};

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
    materialsDiag('initMaterial', {
        isInit,
        caller: materialsDiagCaller(),
        panelBefore: summarizeSnippetPanel(materialState.components),
        hasBuiltinMaterials: getHasBuiltinMaterials(),
        sessionReady: isMaterialsSessionReady(),
        writeBlocked: isMaterialsWriteBlocked()
    });
    if (!getHasBuiltinMaterials()) {
        if (isMaterialsWriteBlocked()) {
            materialsDiag('initMaterial: skip builtins (write blocked)');
        } else {
            initBuiltinMaterial();
            setHasBuiltinMaterials(true);
        }
    }
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
const getDefaultPropsFromMaterialSchema = (material?: Partial<Resource>) => {
    if (!material) return {};
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

    // 全局：彻底移除 component-base-style，避免画布与出码产生额外间距误导
    // 说明：不做“针对组件”的补丁，只做统一归一化规则
    if (schema.props && typeof schema.props === 'object') {
        const p = schema.props as Record<string, unknown>;
        const cn = p.className;
        if (typeof cn === 'string' && cn.includes(BASE_STYLE_CLASS_NAME)) {
            const rest = cn
                .split(/\s+/)
                .filter(c => c && c !== BASE_STYLE_CLASS_NAME)
                .join(' ');
            p.className = rest || '';
        }
    }
    // MrBackButton：节点上显式写入 defaultHref，避免出码与「物料 defaultValue」相同而被省略
    if (componentName === 'MrBackButton') {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        const dh = props.defaultHref;
        if (dh === undefined || dh === '') {
            props.defaultHref = 'javascript:void(0)';
        }
    }

    applyModelBindingSchemaPatch(componentName, schema, rootState);
    // MrSegment 子按钮 value 唯一性修复（见 constants.ts）
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
    const defaultPropsFromSchema = getDefaultPropsFromMaterialSchema(material);
    const schema = {
        componentName: component,
        ...snippet,
        props: {
            ...defaultPropsFromSchema,
            ...snippet.props,
            // 为避免画布排版误导，默认不再注入 component-base-style（即使引擎/插件 options.useBaseStyle 为 true）
            // 若物料 snippet 自己显式配置了 className，则以 snippet 为准
            className: (snippet.props as Record<string, unknown> | undefined)
                ?.className
                ? String(
                      (snippet.props as Record<string, unknown>).className || ''
                  )
                : ''
        }
    };

    applyGenerateNodeModelPatches(component, schema);

    if (type === 'block') {
        schema.componentType = 'Block';
        // 同上：默认不注入 block-base-style（避免区块拖拽产生额外外边距）
        schema.props.className = (
            snippet.props as Record<string, unknown> | undefined
        )?.className
            ? String((snippet.props as Record<string, unknown>).className || '')
            : '';
    }

    return schema;
};
const refreshMaterial = async () => {
    materialsDiag('refreshMaterial: start', {
        caller: materialsDiagCaller(),
        panelBefore: summarizeSnippetPanel(materialState.components)
    });
    try {
        updateBlockCompileCache();
    } catch {
        // ignore
    }
    await awaitMaterialsSessionGate();
    resetMaterialsSession();
    setHasBuiltinMaterials(false);
    await runExclusiveColdStart(async () => {
        setHasBuiltinMaterials(false);
        initMaterial();
        // Bypass session-ready short-circuit: load bundles inside exclusive work
        const bundleUrls = getBundleUrls();
        const materials = await getMaterialsRes();
        materials.forEach((response, index) => {
            if (response.status !== 'fulfilled' || !response.value) return;
            const v: any = response.value;
            const candidate =
                v.materials ||
                v?.data?.materials ||
                v?.data?.data?.materials ||
                v?.data?.data?.data?.materials ||
                v?.data ||
                v?.data?.data;
            const isMaterialLike = (x: any) =>
                x &&
                typeof x === 'object' &&
                (Array.isArray(x.components) ||
                    Array.isArray(x.blocks) ||
                    Array.isArray(x.packages));
            const materialsPayload = isMaterialLike(v)
                ? (v as Material)
                : isMaterialLike(candidate)
                ? (candidate as Material)
                : undefined;
            const bundleUrl =
                typeof bundleUrls[index] === 'string'
                    ? bundleUrls[index]
                    : undefined;
            if (materialsPayload) {
                addMaterials(materialsPayload, bundleUrl);
            }
        });
        updateCanvasDeps();
    });
    materialsDiag('refreshMaterial: done', {
        panelAfter: summarizeSnippetPanel(materialState.components)
    });
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
        dedupePanelSnippets: applyDedupeToPanel,
        getCanvasDeps,
        updateCanvasDeps,
        getConfigureMap,
        getBlockByName,
        getBlockCompileRes,
        addBlockResources,
        updateBlockCompileCache,
        getComponentsByGroup,
        refreshMaterial,
        markColdStartComplete,
        runExclusiveColdStart,
        getComponentList,
        getComponentDetail,
        patchSchemaWithMaterialDefaults,
        fillNodePropsWithMaterialDefaults
    };
}

export { getMaterialsRes, addBlockResources };
