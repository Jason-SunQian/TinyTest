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

/* eslint-disable import/exports-last */
/* metaService: engine.service.page.usePage */
import { reactive, ref } from 'vue';
import {
    extend,
    isEqual as isValuesEqual
} from '@opentiny/vue-renderless/common/object';
import { constants } from '@opentiny/tiny-engine-utils';
import {
    useCanvas,
    useLayout,
    useBreadcrumb,
    useModal,
    useNotify,
    getMetaApi,
    META_SERVICE,
    getOptions
} from '@opentiny/tiny-engine-meta-register';

import { ensureOccupier, getEnsuredCanvasStatus } from '@/utils/pageStatus';

import http from '../http';
import { t } from '../../../services/i18nService';

const { ELEMENT_TAG, COMPONENT_NAME } = constants;

const DEFAULT_PAGE = {
    app: '',
    name: '',
    route: '',
    serviceName: '',
     
    page_content: {
        componentName: 'Page',
        css: '',
        props: {},
        lifeCycles: {},
        children: [],
        dataSource: {
            list: []
        },
        state: {},
        methods: {},
        utils: [],
        bridge: [],
        inputs: [],
        outputs: []
    },
    isHome: false,
    parentId: 'none',
    isBody: false,
    group: 'staticPages'
};

 
const selectedTemplateCard = ref(null);

export interface PageData {
    id: string | number;
    parentId: string | number;
    [x: string]: any;
}

export interface PageNode {
    id: string | number;
    parentId: string | number;
    children?: PageNode[];
}

export interface PageSettingState {
    currentPageDataCopy: PageData;
    currentPageData: PageData;
    pages: any[];
    oldParentId?: string | number | null;
    isNew: boolean;
    ROOT_ID: string;
    updateTreeData?: any;
    treeDataMapping: Record<string, any>;
    defaultPage?: any;
}

const pageSettingState = reactive<PageSettingState>({
    currentPageDataCopy: {} as PageData, // 记录当前页最开始的状态，当用户点击取消按钮的时候恢复到初始状态
    currentPageData: {} as PageData, // 当前配置页面的数据
    pages: [],
    oldParentId: null,
    isNew: false,
    ROOT_ID: '0', // 根节点ID
    updateTreeData: null,
    treeDataMapping: {},
    defaultPage: null // 当前页设置的默认页
});

const isTemporaryPage = reactive({
    saved: false
});

const STATIC_PAGE_GROUP_ID = 0;
const COMMON_PAGE_GROUP_ID = 1;

export interface PageOptions {
    pageBaseStyle: {
        className: string;
        style: string;
    };
}

export interface MaterialsOptions {
    useBaseStyle: any;
    blockBaseStyle: { className: string; style: string };
    componentBaseStyle: { className: string; style: string };
}

const generateCssString = (
    pageOptions: PageOptions,
    materialsOptions: MaterialsOptions
) => {
    if (
        !pageOptions?.pageBaseStyle?.className ||
        !pageOptions?.pageBaseStyle?.style
    ) {
        return '';
    }

    const formatCssRule = (className: string, style: string) =>
        `.${className} {\n  ${style.trim()}\n}\n`;
    const baseStyle = `.${pageOptions.pageBaseStyle.className}{\r\n ${pageOptions.pageBaseStyle.style}\r\n}\r\n`;

    if (!materialsOptions.useBaseStyle) {
        return baseStyle;
    }

    return [
        formatCssRule(
            pageOptions.pageBaseStyle.className,
            pageOptions.pageBaseStyle.style
        ),
        formatCssRule(
            materialsOptions.blockBaseStyle.className,
            materialsOptions.blockBaseStyle.style
        ),
        formatCssRule(
            materialsOptions.componentBaseStyle.className,
            materialsOptions.componentBaseStyle.style
        )
    ].join('\n');
};

const getDefaultPage = () => {
    const materialsOptions = getOptions('engine.plugins.materials');
    const pageOptions = getOptions('engine.plugins.appmanage');

    if (!materialsOptions || !pageOptions?.pageBaseStyle) {
        return { ...DEFAULT_PAGE };
    }

    return {
        ...DEFAULT_PAGE,
        page_content: {
            ...DEFAULT_PAGE.page_content,
            props: {
                ...DEFAULT_PAGE.page_content.props,
                className: pageOptions.pageBaseStyle.className
            },
            css: generateCssString(pageOptions, materialsOptions)
        }
    };
};

/**
 * 更新配置页面数据
 */
const syncPageContent = () => {
    const { getBaseInfo } = getMetaApi(META_SERVICE.GlobalService);

    // 只有当前页面设置的ID与正在编辑的页面ID一致时才同步内容
    // 避免将正在编辑的页面内容错误同步到其他打开的页面设置中
    if (
        pageSettingState.currentPageData.id ===
        Number.parseInt(getBaseInfo().pageId)
    ) {
        const pageContent = useCanvas().getPageSchema();

        // 此处赋值是确保页面内容与当前画布保持同步。
        // 当用户在画布中编辑页面内容时，这些变更存储在Canvas内部状态，
        // 但pageSettingState中的currentPageData.page_content并不会自动更新。
        // 不同步会导致：
        // 1. 保存检测失效 - isCurrentDataSame()无法检测到真实变更
        // 2. 未保存提示缺失 - 用户离开页面时不会收到未保存变更警告
        pageSettingState.currentPageData.page_content = pageContent;
    }
};

/**
 * 在页面保存后更新页面设置状态
 * 当用户通过工具栏保存按钮保存页面时，需要调用此方法来同步currentPageDataCopy
 * 以确保isCurrentDataSame()能够正确判断页面是否被修改
 */
const updatePageSettingAfterSave = () => {
    syncPageContent();
    pageSettingState.currentPageDataCopy = extend(
        true,
        {},
        pageSettingState.currentPageData
    );
};

const isCurrentDataSame = () => {
    syncPageContent();

    const data: Record<string, any> = pageSettingState.currentPageData || {};
    const dataCopy: Record<string, any> =
        pageSettingState.currentPageDataCopy || {};
    let isEqual = true;

    // 获取所有需要比较的键，包括 data 和 dataCopy 中的所有键
    // 这样可以检测到新增字段（如 serviceName）的变化
    const allKeys = new Set([...Object.keys(data), ...Object.keys(dataCopy)]);

    allKeys.forEach(item => {
        // 页面比较是否更改，为了减少判断次数，不需要判断以下字段
        if (
            ['children', 'label', 'createdBy', 'assets', 'occupier'].includes(
                item
            )
        ) {
            return;
        } else if (item === 'page_content') {
            const obj = {
                inputs: dataCopy[item]?.inputs,
                outputs: dataCopy[item]?.outputs,
                lifeCycles: dataCopy[item]?.lifeCycles,
                children: dataCopy[item]?.children
            };
            const objCopy = {
                inputs: data[item]?.inputs,
                outputs: data[item]?.outputs,
                lifeCycles: data[item]?.lifeCycles,
                children: data[item]?.children
            };

            if (JSON.stringify(obj) !== JSON.stringify(objCopy)) {
                isEqual = false;
            }
        } else {
            // 对于其他字段，需要处理 undefined 的情况
            // 如果 dataCopy 中没有该字段，默认为 undefined 或空字符串
            const copyValue = dataCopy[item] ?? '';
            const currentValue = data[item] ?? '';

            if (!isValuesEqual(copyValue, currentValue)) {
                isEqual = false;
            }
        }
    });

    return isEqual;
};

const getParentNode = (parentId: string) => {
    return parentId === pageSettingState.ROOT_ID
        ? {
              id: pageSettingState.ROOT_ID,
              children: pageSettingState.pages[STATIC_PAGE_GROUP_ID].data
          }
        : pageSettingState.treeDataMapping[parentId];
};

const changeTreeData = (newParentId: string, oldParentId: string) => {
    if (
        newParentId &&
        oldParentId &&
        String(newParentId) !== String(oldParentId)
    ) {
        const folderData = getParentNode(newParentId);
        const parentData = getParentNode(oldParentId);

        if (!folderData || !parentData) {
            return;
        }

        const currentPageDataId = pageSettingState.currentPageData.id;
        const curDataIndex = parentData.children?.findIndex?.(
            ({ id }: { id: string }) => id === currentPageDataId
        );

        if (curDataIndex > -1) {
            const splicedPageData = parentData.children.splice(
                curDataIndex,
                1
            )[0];
            if (!folderData.children) {
                folderData.children = [];
            }
            folderData.children.unshift(splicedPageData);
        }
    }
};

const getPageContent = () => {
    return pageSettingState.currentPageData.page_content || {};
};

const initCurrentPageData = (pageDetail: PageData) => {
    // 确保 pageDetail 包含所有必需字段，包括 serviceName
    // 如果服务器返回的数据没有 serviceName，设置为空字符串
    const normalizedPageDetail = {
        ...DEFAULT_PAGE,
        ...pageDetail,
        // 确保 serviceName 字段存在，如果不存在则设置为空字符串
        serviceName: pageDetail.serviceName ?? ''
    };

    pageSettingState.currentPageData = normalizedPageDetail;
    pageSettingState.currentPageDataCopy = extend(
        true,
        {},
        normalizedPageDetail
    );
    pageSettingState.oldParentId = normalizedPageDetail.parentId;
};

const resetPageData = () => {
    pageSettingState.currentPageData = {} as PageData;
    pageSettingState.currentPageDataCopy = {} as PageData;
    pageSettingState.oldParentId = null;
    pageSettingState.defaultPage = null;
};

// 判断当前页面内容是否有修改
const isChangePageData = () =>
    !isValuesEqual(
        pageSettingState.currentPageData,
        pageSettingState.currentPageDataCopy
    );

const generateTree = (data: PageData[]) => {
    const { ROOT_ID } = pageSettingState;

    const treeDataMapping: Record<string, PageNode> = {
        [ROOT_ID]: { id: ROOT_ID, parentId: '' }
    };

    data.forEach(item => {
        treeDataMapping[item.id] = item;
    });

    data.forEach(item => {
        const parentNode = treeDataMapping[item.parentId];

        if (!parentNode) {
            return;
        }

        parentNode.children = parentNode.children || [];
        parentNode.children.push(item);
    });

    return treeDataMapping;
};

interface GroupData {
    groupName: string;
    groupId: number;
    data: PageData[];
}

const getPageList = async (appId?: string) => {
    const pagesData: any[] = await http.fetchPageList(
        appId || getMetaApi(META_SERVICE.GlobalService).getBaseInfo().id
    );

    const firstGroupData: GroupData = {
        groupName: t('designer.page.staticPages'),
        groupId: STATIC_PAGE_GROUP_ID,
        data: []
    };
    const secondGroupData: GroupData = {
        groupName: t('designer.page.publicPages'),
        groupId: COMMON_PAGE_GROUP_ID,
        data: []
    };

    pagesData.forEach(item => {
        const namedNode = item.name
            ? item
            : { ...item, name: item.folderName, group: 'staticPages' };
        const node = item.meta
            ? {
                  ...item,
                  ...item.meta,
                  name: item.fileName,
                  isPage: true,
                  isBody: item.meta.rootElement === ELEMENT_TAG.Body
              }
            : namedNode;

        const { children, ...other } = node;

        if (node.group === 'staticPages') {
            firstGroupData.data.push(other);
        } else {
            secondGroupData.data.push(other);
        }
    });

    const firstGroupTreeData = generateTree(firstGroupData.data);
    const secondGroupTreeData = generateTree(secondGroupData.data);
    pageSettingState.treeDataMapping = {
        ...firstGroupTreeData,
        ...secondGroupTreeData
    };
    firstGroupData.data =
        firstGroupTreeData[pageSettingState.ROOT_ID].children || [];
    pageSettingState.pages = [firstGroupData, secondGroupData];
    return pageSettingState.pages;
};

const getAncestorsRecursively = (id: string): any[] => {
    if (id === pageSettingState.ROOT_ID) {
        return [];
    }

    const pageNode = pageSettingState.treeDataMapping[id];

    return [pageNode].concat(getAncestorsRecursively(pageNode.parentId));
};

/**
 * @param {string | number} id page Id
 * @param {boolean} withFolders default `false`
 * @returns {(string | number)[]}
 */
const getAncestors = async (id: string, withFolders?: boolean) => {
    if (pageSettingState.pages.length === 0) {
        await getPageList();
    }

    if (!pageSettingState.treeDataMapping[id]) {
        return null;
    }

    const ancestorsWithSelf = getAncestorsRecursively(id);
    const ancestors = ancestorsWithSelf.slice(1).reverse();

    const predicate = withFolders
        ? () => true
        : (item: { isPage: boolean }) => item.isPage;

    return ancestors.filter(predicate).map(item => item.id);
};

/**
 * 打平数组内的文件夹，确保返回的数组每个都是页面而不是文件夹
 * @param {Array<{isPage: boolean, children?: any[]} & Record<string, any>} pagesOrFolders 页面或者文件夹数组
 * @returns
 */
const flatternFolder = (
    pagesOrFolders: Array<
        { isPage: boolean; children?: any[] } & Record<string, any>
    >
) => {
    // 页面数组中没有文件夹，无需处理
    if (pagesOrFolders.every(item => item.isPage)) {
        return pagesOrFolders;
    }

    const flattened = pagesOrFolders
        .map(page => {
            if (page.isPage) {
                return page;
            }
            // 如果是文件夹，返回子节点数组，后面flat会打平这一层
            return (page.children || []).map(child => ({
                ...child,
                routePath: `${page.routePath || page.route}/${child.route}`
            }));
        })
        .flat();

    return flatternFolder(flattened);
};

/**
 * 获取所有的页面直接子节点，如果子节点是文件夹，则文件夹下的节点也算直接子节点
 * @param {string | number} id
 * @returns
 */
const getPageChildren = async (id: string) => {
    if (pageSettingState.pages.length === 0) {
        await getPageList();
    }

    const pageNode = pageSettingState.treeDataMapping[id];

    if (!Array.isArray(pageNode?.children)) {
        return [];
    }

    return flatternFolder(pageNode.children);
};

const clearCurrentState = () => {
    const { pageState } = useCanvas();

    pageState.currentVm = null;
    pageState.hoverVm = null;
    pageState.properties = {};
    pageState.pageSchema = null;
};

const switchPage = (pageId: string | number, clearPreview = false) => {
    // 切换页面时清空 选中节点信息状态
    clearCurrentState();

    // pageId !== 0 防止 pageId 为 0 的时候判断不出来
    if (pageId !== 0 && !pageId) {
        if (clearPreview) {
            getMetaApi(META_SERVICE.GlobalService).updateParams({
                pageId: '',
                previewId: ''
            });
        } else {
            getMetaApi(META_SERVICE.GlobalService).updatePageId('');
        }
        useCanvas().initData(
            { componentName: COMPONENT_NAME.Page, props: {} },
            {}
        );
        useLayout().layoutState.pageStatus = {
            state: 'empty',
            data: {}
        };

        return;
    }

    return http
        .fetchPageDetail(pageId)
        .then(
            (data: {
                [x: string]: any;
                isPage: boolean;
                name: string;
                occupier: any;
            }) => {
                if (data.isPage) {
                    // 应该改成让 Breadcrumb 插件去监听变化
                    useBreadcrumb().setBreadcrumbPage([data.name]);
                }

                if (clearPreview) {
                    getMetaApi(META_SERVICE.GlobalService).updateParams({
                        pageId,
                        previewId: ''
                    });
                } else {
                    getMetaApi(META_SERVICE.GlobalService).updatePageId(pageId);
                }
                useLayout().closePlugin();
                const currentUser = getMetaApi(
                    META_SERVICE.GlobalService
                ).getState().userInfo;
                const occupier = ensureOccupier(data.occupier || currentUser);
                const pageData =
                    !data.occupier && occupier ? { ...data, occupier } : data;
                pageData.occupier = occupier;
                useLayout().layoutState.pageStatus =
                    getEnsuredCanvasStatus(occupier);
                useCanvas().initData(pageData.page_content, pageData);
            }
        )
        .catch(() => {
            useNotify({
                type: 'error',
                message: '切换页面失败，目标页面不存在'
            });
        });
};

const switchPageWithConfirm = (pageId: string, clearPreview = false) => {
    const checkPageSaved = () => {
        const { isSaved, isBlock } = useCanvas();

        return new Promise(resolve => {
            if (isSaved()) {
                resolve(true);
                return;
            }

            useModal().confirm({
                title: '提示',
                message: `${
                    isBlock() ? '区块' : '页面'
                }尚未保存，是否要继续切换?`,
                exec: () => {
                    resolve(true);
                },
                cancel: () => {
                    resolve(false);
                }
            });
        });
    };

    checkPageSaved().then(proceed => {
        if (proceed) {
            switchPage(pageId, clearPreview);
        }
    });
};

const updatePageContent = (
    familyPages: Array<{ id: any; page_content: any }>,
    currentPage: { id: string; page_content?: any } | null
) => {
    // 防御性检查：如果 currentPage 为 null，直接返回
    if (!currentPage?.id) {
        if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.warn(
                '[updatePageContent] currentPage is null or has no id, skipping update'
            );
        }
        return;
    }

    const currentPageSchema = familyPages.find(
        item => item.id === currentPage.id
    );
    // 替换为当前页面最新的 schema
    if (currentPageSchema) {
        currentPageSchema.page_content = currentPage.page_content;
    }
};

const fetchPageDetailIfNeeded = async (page: {
    page_content: any;
    id: string;
}) => {
    if (!page.page_content) {
        try {
            const pageDetail = await http.fetchPageDetail(page.id);
            page.page_content = pageDetail.page_content;
        } catch (error) {
            page.page_content = {};
            throw new Error(String(error));
        }
    }
};

const updateParentId = (
    page: { parentId: any },
    pages: any[],
    index: number,
    ROOT_ID: string
) => {
    if (
        page.parentId !== ROOT_ID &&
        !pages.find(item => item.id === page.parentId)
    ) {
        page.parentId = pages[index - 1]?.id ? pages[index - 1].id : ROOT_ID;
    }
};

const handlePageDetail = async (pages: any[]) => {
    const { ROOT_ID } = pageSettingState;

    if (pages.length > 0) {
        await Promise.all(
            pages.map(async (page, index) => {
                await fetchPageDetailIfNeeded(page);
                updateParentId(page, pages, index, ROOT_ID);
            })
        );
    }
};

const getFamily = async (currentPage: { id: string } | null) => {
    // 防御性检查：如果 currentPage 为 null，直接返回
    if (!currentPage?.id) {
        if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.warn(
                '[getFamily] currentPage is null or has no id, returning empty array'
            );
        }
        return [];
    }

    if (pageSettingState.pages.length === 0) {
        await getPageList();
    }

    const familyPages = getAncestorsRecursively(currentPage.id)
        .filter(item => item.isPage)
        .reverse()
        .map(item => ({
            id: item.id,
            page_content: item.page_content,
            name: item.name,
            parentId: item.parentId,
            route: item.route,
            isPage: item.isPage,
            isBody: item.isBody,
            isHome: item.isHome,
            group: item.group,
            isDefault: item.isDefault,
            depth: item.depth
        }));

    await handlePageDetail(familyPages);

    updatePageContent(familyPages, currentPage);

    return familyPages;
};

const createNewPage = async ({
    name = 'Untitled',
    route = '',
    group = 'staticPages',
    parentId = pageSettingState.ROOT_ID
}) => {
    try {
        const defaultPage = getDefaultPage();
        const params = {
            ...defaultPage,
            parentId,
            route,
            name,
            group,
            app: getMetaApi(META_SERVICE.GlobalService).getBaseInfo().id,
            isPage: true
        };

        const data = await http.requestCreatePage(params);

        pageSettingState.updateTreeData?.();
        useNotify({
            type: 'success',
            message: '新建页面成功!'
        });

        return {
            success: true,
            data
        };
    } catch (error) {
        return {
            success: false,
            error: JSON.stringify(error?.message || error)
        };
    }
};

const deletePage = async id => {
    try {
        await http.requestDeletePage(id);
        await pageSettingState.updateTreeData?.();
        // TODO: 删除页面后，如果当前页面是删除的页面，则需要切换到上一个页面删除页面后，如果当前页面是删除的页面，则需要切换到上一个页面
        // if (pageState?.currentPage?.id !== id) {
        //   return {
        //     success: true
        //   }
        // }

        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: JSON.stringify(error?.message || error)
        };
    }
};

const updatePageById = async (id, params) => {
    try {
        const pageDetail = await http.fetchPageDetail(id);
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(
                ([_, value]) => value !== undefined && value !== null
            )
        );
        const res = await http.requestUpdatePage(id, {
            ...pageDetail,
            ...filteredParams
        });

        return {
            success: true,
            data: res
        };
    } catch (error) {
        return {
            success: false,
            error: JSON.stringify(error?.message || error)
        };
    }
};

export default () => {
    return {
        getDefaultPage,
        selectedTemplateCard,
        pageSettingState,
        isTemporaryPage,
        isCurrentDataSame,
        changeTreeData,
        getPageContent,
        resetPageData,
        initCurrentPageData,
        isChangePageData,
        getPageList,
        getAncestors,
        switchPage,
        switchPageWithConfirm,
        getFamily,
        getPageChildren,
        updatePageSettingAfterSave,
        STATIC_PAGE_GROUP_ID,
        COMMON_PAGE_GROUP_ID,
        createNewPage,
        deletePage,
        updatePageById
    };
};
