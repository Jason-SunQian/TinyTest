/* metaService: engine.plugins.bridge.js-resource */
import { reactive } from 'vue';
import {
    useResource,
    useNotify,
    getMetaApi,
    META_SERVICE
} from '@opentiny/tiny-engine-meta-register';
import { isVsCodeEnv } from '@opentiny/tiny-engine-common/js/environments';

import {
    fetchResourceList,
    requestDeleteReSource,
    requestAddReSource,
    requestUpdateReSource,
    requestGenerateBridgeUtil
} from '../http';

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

    try {
        if (isEdit) {
            data.id = state.resource.id;
            const result = await requestUpdateReSource(data);

            if (result) {
                const index = useResource().appSchemaState[
                    data.category
                ].findIndex(item => item.name === result.name);

                if (index === -1) {
                    useNotify({ type: 'error', message: '修改失败' });
                    return;
                }

                useResource().appSchemaState[data.category][index] = result;
            }
        } else {
            const result = await requestAddReSource(data);
            if (result) {
                useResource().appSchemaState[data.category].push(result);
            }
        }

        // 更新画布工具函数环境，保证渲染最新工具类返回值, 并触发画布的强制刷新
        generateBridgeUtil(getAppId());
        useNotify({
            type: 'success',
            message: `${isEdit ? '修改' : '创建'}成功`
        });
        emit('refresh', state.type);
        state.refresh = true;
        callback();
    } catch (error) {
        useNotify({
            type: 'error',
            message: `工具类${isEdit ? '修改' : '创建'}失败：${error.message}`
        });
    }
};

const deleteData = (name, callback, emit) => {
    const params = `app=${getAppId()}&id=${state.resource?.id}`;
    requestDeleteReSource(params).then(data => {
        if (data) {
            const index = useResource().appSchemaState[state.type].findIndex(
                item => item.name === data.name
            );
            if (index === -1) {
                useNotify({ type: 'error', message: '删除失败' });
                return;
            }
            useResource().appSchemaState[state.type].splice(index, 1);
            generateBridgeUtil(getAppId());
            useNotify({ type: 'success', message: '删除成功' });
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
