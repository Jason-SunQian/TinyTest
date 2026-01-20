/* metaService: engine.plugins.customBridge.js-resource */
import { reactive } from 'vue';
import {
    useResource,
    useNotify,
    getMetaApi,
    META_SERVICE
} from '@opentiny/tiny-engine-meta-register';
import { isVsCodeEnv } from '@opentiny/tiny-engine-common/js/environments';

import { useDesignerI18n } from '../../../services/i18nService';

import {
    fetchResourceList,
    requestDeleteReSource,
    requestAddReSource,
    requestUpdateReSource,
    requestGenerateBridgeUtil
} from '../http';

/**
 * 规范化单个 utils item，确保所有数据都有正确的结构（避免 setUtils 报错）
 */
const normalizeUtilsItem = (item: any) => {
    // 过滤掉非对象类型的 item（如数组、null、undefined 等）
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
        // eslint-disable-next-line no-console
        console.warn('[Bridge] normalizeUtilsItem - Invalid item type, skipping:', item, 'type:', typeof item, 'isArray:', Array.isArray(item));
        return null; // 返回 null，后续会被过滤掉
    }
    
    // 确保 content 对象存在
    if (!item.content) {
        item.content = {};
    }
    
    // function 类型不需要 exportName，但为了兼容 setUtils 函数，确保 content 对象完整
    if (item.type === 'function') {
        return {
            ...item,
            content: {
                ...item.content,
                type: item.content.type || 'JSFunction',
                value: item.content.value || '',
                // 添加 exportName 字段（即使为 undefined），避免 setUtils 访问时报错
                exportName: item.content.exportName || undefined
            }
        };
    }
    
    // npm 类型需要 exportName
    if (item.type === 'npm' && !item.content.exportName) {
        item.content.exportName = '';
    }
    
    return item;
};

const state = reactive({
    actionType: '',
    type: '',
    category: '',
    resource: {},
    resources: [],
    resourceNames: {},
    refresh: false,
    id: ''
});

const DEFAULT_RESOURCE = {
    name: '',
    type: 'npm',
    content: {
        package: '',
        version: '',
        exportName: '',
        subName: '',
        destructuring: true,
        main: ''
    }
};

const DEFAULT_RESOURCE_FUNTION = {
    name: '',
    type: 'function',
    content: {
        type: 'JSFunction',
        value: ''
    }
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const TempBridge = [
    {
        name: 'clone',
        type: 'npm',
        category: 'utils',
        content: {
            package: 'lodash',
            version: '4.17.21',
            exportName: 'clone',
            subName: '',
            destructuring: false,
            main: '/lib/clone'
        }
    },
    {
        name: 'moment',
        type: 'npm',
        category: 'utils',
        content: {
            package: '@alifd/next',
            version: '0.0.1',
            exportName: 'Moment',
            subName: '',
            destructuring: true,
            main: ''
        }
    },
    {
        name: 'lowcode',
        type: 'npm',
        category: 'utils',
        content: {
            package: '@/lowcode',
            version: '0.0.1',
            exportName: 'lowcode',
            subName: '',
            destructuring: true,
            main: ''
        }
    }
];

const RESOURCE_TYPE = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Util: 'utils',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Bridge: 'bridge'
};

const RESOURCE_CATEGORY = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Npm: 'npm',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Function: 'function'
};

const RESOURCE_TIP_I18N = (t: (k: string) => string) => ({
    [RESOURCE_TYPE.Util]: t('designer.bridge.addUtil'),
    [RESOURCE_TYPE.Bridge]: t('designer.bridge.addBridge')
});

const ACTION_TYPE = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Read: 'read',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Edit: 'edit'
};

const getAppId = () => getMetaApi(META_SERVICE.GlobalService).getBaseInfo().id;

const getResources = () => {
    const id = getAppId();
    if (!state.resources.length) {
        fetchResourceList(id).then(data => {
            state.resources = data || TempBridge;
        });
    }
};

const getResourceNamesByType = type => state.resourceNames[type];

const setResourceNamesByType = (type, names) => {
    state.resourceNames[type] = names;
};

const getResourcesByType = type => {
    const id = getAppId();
    return fetchResourceList(id, type);
};

const getActionType = () => state.actionType;

const setActionType = type => {
    state.actionType = type;
};

const getResource = () => state.resource;

const setResource = (resourceParam = DEFAULT_RESOURCE) => {
    let resource = resourceParam;
    if (!resource) {
        resource =
            state.category === RESOURCE_CATEGORY.Function
                ? DEFAULT_RESOURCE_FUNTION
                : DEFAULT_RESOURCE;
    }
    state.resource = resource;
};

const getType = () => state.type;

const setType = type => {
    state.type = type;
};

const setCategory = category => {
    state.category = category;
};

const setStatus = () => {
    state.refresh = true;
};

const getCategory = () => state.category;

// VS Code环境生成本地util
const generateBridgeUtil = (...args) => {
    if (isVsCodeEnv) {
        requestGenerateBridgeUtil(...args);
    }
};

const saveResource = async (data, callback, emit) => {
    const isEdit = getActionType() === ACTION_TYPE.Edit;
    const { t } = useDesignerI18n();

    try {
        if (isEdit) {
            data.id = state.resource.id;
            const result = await requestUpdateReSource(data);

            if (result) {
                const index = useResource().appSchemaState[
                    data.category
                ].findIndex(item => item.name === result.name);

                if (index === -1) {
                    useNotify({
                        type: 'error',
                        message: t('designer.bridge.modifyFailed')
                    });
                    return;
                }

                useResource().appSchemaState[data.category][index] = result;
            }
        } else {
            const result = await requestAddReSource(data);
            if (result) {
                // 规范化返回的数据
                const normalizedResult = normalizeUtilsItem(result);
                if (normalizedResult) {
                    // 先添加到 appSchemaState，确保立即显示
                    const resourceApi = useResource();
                    const targetArray = data.category === 'utils' 
                        ? resourceApi.appSchemaState.utils 
                        : resourceApi.appSchemaState[data.category];
                    
                    if (Array.isArray(targetArray)) {
                        // 检查是否已存在同名项
                        const existingIndex = targetArray.findIndex(
                            (item: any) => item && item.name === normalizedResult.name
                        );
                        if (existingIndex === -1) {
                            targetArray.push(normalizedResult);
                        } else {
                            // 如果已存在，更新它
                            targetArray[existingIndex] = normalizedResult;
                        }
                    }
                }
            }
        }

        // 更新画布工具函数环境，保证渲染最新工具类返回值, 并触发画布的强制刷新
        generateBridgeUtil(getAppId());
        
        // 重新获取最新的 schema 数据，确保 appSchemaState.utils 被更新
        const resourceApi = useResource();
        if (resourceApi && typeof resourceApi.fetchAppState === 'function') {
            resourceApi.fetchAppState().then(() => {
                // 检查新添加的项是否在返回的数据中
                if (!isEdit && data.name) {
                    const foundInNewData = resourceApi.appSchemaState.utils.some(
                        (item: any) => item.name === data.name
                    );
                    
                    // 如果新添加的项不在返回的数据中，手动添加它
                    if (!foundInNewData) {
                        const normalizedItem = normalizeUtilsItem({
                            name: data.name,
                            type: data.type,
                            category: data.category,
                            content: data.content
                        });
                        if (normalizedItem) {
                            resourceApi.appSchemaState.utils.push(normalizedItem);
                        }
                    }
                }
            }).catch((error: any) => {
                console.error('[Bridge] saveResource - failed to refresh appSchemaState:', error);
            });
        }
        useNotify({
            type: 'success',
            message: isEdit
                ? t('designer.bridge.modifySuccess')
                : t('designer.bridge.createSuccess')
        });
        // 刷新列表：传递 data.category（'utils' 或 'bridge'），而不是 state.type
        emit('refresh', data.category);
        state.refresh = true;
        callback();
    } catch (error) {
        useNotify({
            type: 'error',
            message: isEdit
                ? t('designer.bridge.modifyFailedWithError', {
                      error: error.message
                  })
                : t('designer.bridge.createFailedWithError', {
                      error: error.message
                  })
        });
    }
};

const deleteData = (name, callback, emit) => {
    const { t } = useDesignerI18n();
    const params = `app=${getAppId()}&id=${state.resource?.id}`;
    requestDeleteReSource(params).then(data => {
        if (data) {
            const index = useResource().appSchemaState[state.type].findIndex(
                item => item.name === data.name
            );
            if (index === -1) {
                useNotify({
                    type: 'error',
                    message: t('designer.bridge.deleteFailed')
                });
                return;
            }
            useResource().appSchemaState[state.type].splice(index, 1);
            generateBridgeUtil(getAppId());
            useNotify({
                type: 'success',
                message: t('designer.bridge.deleteSuccess')
            });
            emit('refresh', state.type);
            state.refresh = true;
            callback();
        }
    });
};

export {
    RESOURCE_TYPE,
    RESOURCE_CATEGORY,
    RESOURCE_TIP_I18N,
    ACTION_TYPE,
    getResources,
    getResourceNamesByType,
    setResourceNamesByType,
    getResourcesByType,
    getActionType,
    setActionType,
    getResource,
    setResource,
    getType,
    setType,
    setCategory,
    setStatus,
    getCategory,
    saveResource,
    deleteData
};
