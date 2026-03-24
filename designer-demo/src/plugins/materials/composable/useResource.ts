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

/* metaService: engine.service.resource.useResource */
import { reactive, toRaw, watch } from 'vue';
import { constants } from '@opentiny/tiny-engine-utils';
import {
    useCanvas,
    useTranslate,
    useBreadcrumb,
    useLayout,
    useBlock,
    useMaterial,
    getMetaApi,
    META_APP,
    useMessage,
    META_SERVICE
} from '@opentiny/tiny-engine-meta-register';

import { ensureOccupier, getEnsuredCanvasStatus } from '@/utils/pageStatus';

const { COMPONENT_NAME, DEFAULT_INTERCEPTOR } = constants;

interface AppSchemaState {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataSource: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pageTree: any[];
    langs: {
        locales: Array<{
            lang: string;
        }>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        messages: any;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    utils: Array<{ [x: string]: any; type: string }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalState: any[];
    materialsDeps: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        scripts: any[];
        styles: Set<unknown>;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentsMap?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataHandler?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    willFetch?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errorHandler?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bridge?: any;
    isDemo?: boolean;
}

/**
 * 规范化单个 utils item，确保所有数据都有正确的结构（避免 setUtils 报错）
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeUtilsItem = (item: any) => {
    // 过滤掉非对象类型的 item（如数组、null、undefined 等）
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
        // eslint-disable-next-line no-console
        console.warn(
            '[useResource] normalizeUtilsItem - Invalid item type, skipping:',
            item,
            'type:',
            typeof item,
            'isArray:',
            Array.isArray(item)
        );
        // 返回 null，后续会被过滤掉
        return null;
    }

    // 确保 content 对象存在
    if (!item.content) {
        // eslint-disable-next-line no-console
        console.log(
            '[useResource] normalizeUtilsItem - Item has no content, creating empty content:',
            item
        );
        item.content = {};
    }

    // function 类型不需要 exportName，但为了兼容 setUtils 函数，确保 content 对象完整
    if (item.type === 'function') {
        const normalizedItem = {
            ...item,
            content: {
                ...item.content,
                type: item.content.type || 'JSFunction',
                value: item.content.value || '',
                // 添加 exportName 字段（即使为 undefined），避免 setUtils 访问时报错
                exportName: item.content.exportName || undefined
            }
        };
        // eslint-disable-next-line no-console
        console.log(
            '[useResource] normalizeUtilsItem - Normalized function item:',
            normalizedItem
        );
        return normalizedItem;
    }

    // npm 类型需要 exportName
    if (item.type === 'npm' && !item.content.exportName) {
        item.content.exportName = '';
    }

    return item;
};

const appSchemaState = reactive<AppSchemaState>({
    dataSource: [],
    pageTree: [],
    langs: { locales: [], messages: {} },
    utils: [],
    globalState: [],
    materialsDeps: { scripts: [], styles: new Set() }
});

// 监听 utils 数组的变化，确保每次变化时都规范化数据
// 注意：使用 watch 可能会在数据更新时触发，但画布可能已经读取了旧数据
// 所以我们还需要在数据被访问时进行规范化
let isNormalizing = false;
watch(
    () => appSchemaState.utils,
    newUtils => {
        if (!Array.isArray(newUtils) || isNormalizing) {
            return;
        }
        isNormalizing = true;
        // eslint-disable-next-line no-console
        console.log(
            '[useResource] watch utils - utils changed, normalizing:',
            newUtils
        );
        // 规范化每个 item
        const normalizedUtils = newUtils.map((item, index) => {
            const normalized = normalizeUtilsItem(item);
            // 如果数据有变化，更新原数组中的该项
            if (JSON.stringify(normalized) !== JSON.stringify(item)) {
                // eslint-disable-next-line no-console
                console.log(
                    '[useResource] watch utils - Item at index',
                    index,
                    'needs normalization'
                );
                // 直接修改原数组项，避免触发新的 watch
                Object.assign(newUtils[index], normalized);
                // 确保 content 对象被正确设置
                if (normalized.content) {
                    newUtils[index].content = normalized.content;
                }
            }
            return normalized;
        });
        isNormalizing = false;
        // eslint-disable-next-line no-console
        console.log(
            '[useResource] watch utils - normalization complete:',
            normalizedUtils
        );
    },
    { deep: true, immediate: true }
);

function goPage(pageId: string) {
    if (!pageId) {
        return;
    }

    getMetaApi(META_SERVICE.GlobalService).updatePageId(pageId);
}

interface PageInfo {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta: any;
    id: string;
    fileName: string;
    componentName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: any;
}

const initPage = (pageInfo: PageInfo) => {
    try {
        // 有id，说明不是临时的页面
        if (pageInfo?.id || typeof pageInfo?.id === 'number') {
            const occupier = ensureOccupier(pageInfo.occupier);
            pageInfo.occupier = occupier;
            useLayout().layoutState.pageStatus =
                getEnsuredCanvasStatus(occupier);
            goPage(pageInfo.id);
        } else {
            useLayout().layoutState.pageStatus = {
                state: 'empty',
                data: {}
            };
        }
    } catch (error) {
        console.log(error); // eslint-disable-line
    }

    useCanvas().initData(pageInfo?.page_content || {}, pageInfo);
    useBreadcrumb().setBreadcrumbPage([pageInfo?.name || '']);
};

/**
 * 根据区块 id 初始化应用
 * @param {string} blockId 区块 id
 */
const initBlock = async (blockId: string) => {
    const blockApi = getMetaApi(META_APP.BlockManage);
    const blockContent = await blockApi.getBlockById(blockId);

    // eslint-disable-next-line camelcase
    if (blockContent.public_scope_tenants?.length) {
        // eslint-disable-next-line camelcase
        blockContent.public_scope_tenants =
            blockContent.public_scope_tenants.map((e: { id: string }) => e.id);
    }

    const occupier = ensureOccupier(blockContent?.occupier);
    blockContent.occupier = occupier;
    useLayout().layoutState.pageStatus = getEnsuredCanvasStatus(occupier);

    // 请求区块详情
    useBlock().initBlock(blockContent, {}, true);
};

const initPageOrBlock = async () => {
    const { pageId, blockId } = getMetaApi(
        META_SERVICE.GlobalService
    ).getBaseInfo();
    const pagePluginApi = getMetaApi(META_APP.AppManage);

    if (pageId) {
        const data = await pagePluginApi.getPageById(pageId);
        initPage(data);
        return;
    }

    if (blockId) {
        await initBlock(blockId);

        return;
    }

    // url 没有 pageid 或 blockid，到页面首页或第一页
    const pageInfo = appSchemaState.pageTree.find(page => page?.meta?.isHome) ||
        appSchemaState.pageTree.find(
            page =>
                page.componentName === COMPONENT_NAME.Page &&
                page?.meta?.group !== 'publicPages'
        ) || {
            // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
            page_content: {
                componentName: COMPONENT_NAME.Page
            }
        };

    if (pageInfo.meta?.id) {
        // 这里重新请求一遍页面详情数据，是因为 appSchemaState 的页面信息存在字段转换，比如 route 被转换成了 router 字段，导致调用页面保存接口的时候报错
        const data = await pagePluginApi.getPageById(pageInfo.meta.id);
        initPage(data);
    } else {
        initPage(toRaw(pageInfo));
    }
};

const handlePopStateEvent = async () => {
    const { id, type } = getMetaApi(META_SERVICE.GlobalService).getBaseInfo();

    await initPageOrBlock();

    // 国际化貌似有 app 和区块之分，但是目前其实都存到了 app 里面，需要确认是否需要修复
    await useTranslate().initI18n({ host: id, hostType: type });
};

const fetchAppState = async () => {
    const { id } = getMetaApi(META_SERVICE.GlobalService).getBaseInfo();
    const appData = await getMetaApi(META_SERVICE.Http).get(
        `/app-center/v1/api/apps/schema/${id}`
    );
    appSchemaState.pageTree = appData.componentsTree;
    appSchemaState.componentsMap = appData.componentsMap;
    appSchemaState.dataSource = appData.dataSource?.list;
    appSchemaState.dataHandler =
        appData.dataSource?.dataHandler || DEFAULT_INTERCEPTOR.dataHandler;
    appSchemaState.willFetch =
        appData.dataSource?.willFetch || DEFAULT_INTERCEPTOR.willFetch;
    appSchemaState.errorHandler =
        appData.dataSource?.errorHandler || DEFAULT_INTERCEPTOR.errorHandler;

    appSchemaState.bridge = appData.bridge;
    // 规范化 utils 数据，确保所有数据都有正确的结构（避免 setUtils 报错）
    // eslint-disable-next-line no-console
    console.log('[useResource] fetchAppState - raw utils data:', appData.utils);
    // 规范化并过滤掉无效的 item（如数组、null 等）
    const normalizedUtils = (appData.utils || [])
        .map(normalizeUtilsItem)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item: any) => item !== null && item !== undefined);
    appSchemaState.utils = normalizedUtils;
    // eslint-disable-next-line no-console
    console.log(
        '[useResource] fetchAppState - normalized utils (after filtering):',
        appSchemaState.utils
    );
    appSchemaState.isDemo = appData?.meta?.isDemo || appData?.meta?.is_demo;
    appSchemaState.globalState =
        appData?.meta?.globalState || appData?.meta?.global_state;

    // 词条语言为空时使用默认的语言
    const defaultLocales = [
        { lang: 'zh_CN', label: 'zh_CN' },
        { lang: 'en_US', label: 'en_US' }
    ];
    const locales = Object.keys(appData.i18n).length
        ? Object.keys(appData.i18n).map(key => ({ lang: key, label: key }))
        : defaultLocales;

    appSchemaState.langs = {
        locales,
        messages: appData.i18n
    };

    return appData;
};

const fetchResource = async ({ isInit = true } = {}) => {
    const { id, type } = getMetaApi(META_SERVICE.GlobalService).getBaseInfo();
    useMessage().publish({ topic: 'app_id_changed', data: id });

    let appData: Record<string, unknown> = {};
    try {
        appData = (await fetchAppState()) as Record<string, unknown>;
    } catch (error) {
        // 插件环境或无 app 接口时 fetchAppState 可能失败，不阻断物料拉取（见文档 十二、阶段一）
        // eslint-disable-next-line no-console
        console.warn(
            '[useResource] fetchAppState failed, will still load materials:',
            error
        );
    }

    useMaterial().initMaterial({ isInit, appData });

    try {
        await useMaterial().fetchMaterial();

        if (isInit) {
            await initPageOrBlock();
        }

        await useTranslate().initI18n({ host: id, hostType: type, init: true });
    } catch (error) {
        console.log(error); // eslint-disable-line
    }
};

// 获取工具类的依赖，用于预览加载。格式和物料依赖一致，便于处理
const getUtilsDeps = () => {
    return appSchemaState.utils
        .filter(item => item.type === 'npm')
        .map(item => {
            return {
                ...item,
                package: item.content?.package,
                script: item.content?.cdnLink
            };
        });
};

// eslint-disable-next-line func-names
export default function useResourceExport() {
    return {
        appSchemaState,
        getUtilsDeps,
        fetchResource,
        initPageOrBlock,
        handlePopStateEvent,
        fetchAppState
    };
}
