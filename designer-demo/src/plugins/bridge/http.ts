/* metaService: engine.plugins.customBridge.http */
import { getMetaApi, META_SERVICE } from '@opentiny/tiny-engine-meta-register';
import {
    generateBridge,
    generateUtil
} from '@opentiny/tiny-engine-common/js/vscodeGenerateFile';

/**
 * 规范化 utils 数据，确保所有数据都有正确的结构（避免 setUtils 报错）
 * @param {Array} utils - utils 数据数组
 * @returns {Array} 规范化后的 utils 数据
 */
const normalizeUtils = (utils = []) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return utils.map((item: any) => {
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
    });
};

// 本地生成桥接工具类
const requestGenerateBridgeUtil = appId => {
    getMetaApi(META_SERVICE.Http)
        .get(`/app-center/api/apps/schema/${appId}`)
        .then(data => {
            generateBridge(data.bridge);
            // 规范化 utils 数据后再传递给 generateUtil
            const normalizedUtils = normalizeUtils(data.utils);
            generateUtil(normalizedUtils);
        })
        .catch(error => {
            // eslint-disable-next-line no-console
            console.error('[Bridge] requestGenerateBridgeUtil error:', error);
        });
};

// 资源管理 -- 获取列表
export const fetchResourceList = (appId, type) =>
    getMetaApi(META_SERVICE.Http).get(
        `/app-center/api/apps/extension/list?app=${appId}&category=${type}`
    );

// 资源管理 -- 获取资源详情
export const fetchResourceDetail = () =>
    getMetaApi(META_SERVICE.Http).get(`/app-center/api/apps/extension`);

// 资源管理 -- 新增
export const requestAddReSource = params =>
    getMetaApi(META_SERVICE.Http).post(
        '/app-center/api/apps/extension/create',
        params
    );

// 资源管理 -- 修改
export const requestUpdateReSource = params =>
    getMetaApi(META_SERVICE.Http).post(
        `/app-center/api/apps/extension/update`,
        params
    );

// 资源管理 -- 删除
export const requestDeleteReSource = params =>
    getMetaApi(META_SERVICE.Http).get(
        `/app-center/api/apps/extension/delete?${params}`
    );

// 本地生成桥接工具类
export { requestGenerateBridgeUtil };
