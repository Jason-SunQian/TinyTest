import { getMetaApi, META_SERVICE } from '@opentiny/tiny-engine-meta-register';

export const fetchBlockList = params =>
    getMetaApi(META_SERVICE.Http).get('/material-center/api/blocks', {
        params
    });
export const requestDeleteBlock = blockId =>
    getMetaApi(META_SERVICE.Http).get(
        `/material-center/api/block/delete/${blockId}`
    );
export const requestUpdateBlock = (blockId, params, config = {}) =>
    getMetaApi(META_SERVICE.Http).post(
        `/material-center/api/block/update/${blockId}`,
        params,
        config
    );
export const requestDeployBlock = params =>
    getMetaApi(META_SERVICE.Http).post(
        '/material-center/api/block/deploy',
        params
    );
export const requestSearchBlock = searchKey =>
    getMetaApi(META_SERVICE.Http).get(
        `/material-center/api/block?label_contains=${searchKey}`
    );
export const fetchBackupList = blockId =>
    getMetaApi(META_SERVICE.Http).get(
        `/material-center/api/block-history?block=${blockId}`
    );
export const requestCreateBlock = params =>
    getMetaApi(META_SERVICE.Http).post(
        '/material-center/api/block/create',
        params
    );
export const requestInitBlocks = params =>
    getMetaApi(META_SERVICE.Http).post('/generate/api/initBlocks', params);
export const requestBlocks = () =>
    getMetaApi(META_SERVICE.Http).get(`/material-center/api/block`);
export const fetchBlockContent = blockId =>
    getMetaApi(META_SERVICE.Http).get(
        `/material-center/api/block/detail/${blockId}`
    );
export const fetchBlockContentByLabel = label =>
    getMetaApi(META_SERVICE.Http).get(
        `/material-center/api/block?label=${label}`
    );
export const fetchComponentsMap = appId =>
    getMetaApi(META_SERVICE.Http).get(
        `/app-center/api/apps/schema/components/${appId}`
    );
export const fetchCategories = params =>
    getMetaApi(META_SERVICE.Http).get('/material-center/api/block-categories', {
        params
    });
export const updateCategory = ({ id, ...params }) =>
    getMetaApi(META_SERVICE.Http).put(
        `/material-center/api/block-categories/${id}`,
        params
    );
export const createCategory = params =>
    getMetaApi(META_SERVICE.Http).post(
        `/material-center/api/block-categories`,
        params
    );
export const deleteCategory = id =>
    getMetaApi(META_SERVICE.Http).delete(
        `/material-center/api/block-categories/${id}`
    );
export const fetchGroups = params =>
    getMetaApi(META_SERVICE.Http).get(`/material-center/api/block-groups`, {
        params: { ...params, from: 'block' }
    });
export const updateGroup = ({ id, ...params }) =>
    getMetaApi(META_SERVICE.Http).post(
        `/material-center/api/block-groups/update/${id}`,
        params
    );
export const createGroup = params =>
    getMetaApi(META_SERVICE.Http).post(
        '/material-center/api/block-groups/create',
        params
    );
export const deleteGroup = groupId =>
    getMetaApi(META_SERVICE.Http).get(
        `/material-center/api/block-groups/delete/${groupId}`
    );
