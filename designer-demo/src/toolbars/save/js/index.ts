/* eslint-disable import/order */
import { reactive, ref } from 'vue';

import {
    useBlock,
    useCanvas,
    useLayout,
    useNotify,
    usePage,
    getOptions,
    getMetaApi,
    useMessage
} from '@opentiny/tiny-engine-meta-register';
import { constants } from '@opentiny/tiny-engine-utils';
import { handlePageUpdate } from '@opentiny/tiny-engine-common/js/http';

// import {
//     goSave,
//     checkIsVSCodeEnvironment
// } from '../../../composable/useVSCodeBridge';
import { checkIsVSCodeEnvironment } from '../../../composable/useVSCodeBridge';
import { t as translate } from '../../../services/i18nService';

const { publish } = useMessage();
const { PAGE_STATUS, AUTO_SAVED } = constants;

const state = reactive({
    visible: false,
    code: '',
    originalCode: '',
    disabled: false
});

const isLoading = ref(false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveBlock = async (pageSchema: any) => {
    const api = getMetaApi('engine.plugins.customBlockManage');
    const { getCurrentBlock } = useBlock();
    const block = getCurrentBlock();
    block.label = pageSchema.fileName;
    block.content = pageSchema;
    isLoading.value = true;
    block.screenshot = await api.getBlockBase64();
    await api.saveBlock?.(block);
    isLoading.value = false;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const savePage = async (pageSchema: any) => {
    const { currentPage } = useCanvas().pageState;

    let pageId: string | null = currentPage?.id || null;
    if (!pageId) {
        const paramsMap = new URLSearchParams(window.location.search);
        pageId = paramsMap.get('pageid');
    }

    if (!pageId) {
        const errorMessage =
            translate('designer.vscode.saveFailed') ||
            '无法获取页面 ID，保存失败';
        useNotify()({
            type: 'error',
            title: translate('designer.vscode.saveFailed'),
            message: errorMessage
        });
        throw new Error(errorMessage);
    }

    // // 检测是否在 VSCode 环境中
    // const isVSCode = checkIsVSCodeEnvironment();
    //
    // // VSCode 环境下，使用 goSave 保存
    // if (isVSCode) {
    //     isLoading.value = true;
    //     try {
    //         await new Promise<void>((resolve, reject) => {
    //             goSave(
    //                 {
    //                     pageId: pageId,
    //                     pageSchema,
    //                     // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    //                     pageData: { ...(currentPage || {}), page_content: pageSchema }
    //                 },
    //                 (success, error) => {
    //                     if (success) {
    //                         resolve();
    //                     } else {
    //                         reject(
    //                             error ||
    //                                 new Error(
    //                                     translate('designer.vscode.saveFailed')
    //                                 )
    //                         );
    //                     }
    //                 }
    //             );
    //         });
    //         // 发布页面保存事件，通知其他组件进行相应处理
    //         publish({ topic: 'page-saved' });
    //     } catch (error) {
    //         useNotify()({
    //             type: 'error',
    //             title: translate('designer.vscode.saveFailed'),
    //             message:
    //                 error instanceof Error
    //                     ? error.message
    //                     : translate('designer.vscode.saveFailed')
    //         });
    //         throw error;
    //     } finally {
    //         isLoading.value = false;
    //     }
    //     return;
    // }

    // 非 VSCode 环境，使用原有方式保存
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    const params = { page_content: pageSchema };
    isLoading.value = true;

    // 确保 currentPage 不为 null，如果为 null 则使用空对象
    const safeCurrentPage = currentPage || {};

    const updateParams = {
        id: pageId,
        params: { ...safeCurrentPage, id: pageId, ...params },
        isCurEditPage: true
    };

    try {
        await handlePageUpdate(updateParams);
        isLoading.value = false;
        publish({ topic: 'page-saved' });
    } catch (error) {
        isLoading.value = false;
        useNotify()({
            type: 'error',
            title: translate('designer.vscode.saveFailed'),
            message: error instanceof Error ? error.message : '保存失败，请重试'
        });
        throw error;
    }
};

export const saveCommon = (value?: string) => {
    const { pageSettingState, isTemporaryPage } = usePage();
    const {
        isBlock,
        canvasApi,
        pageState,
        resetBlockCanvasState,
        resetPageCanvasState,
        getSchema
    } = useCanvas();

    // 获取最新的 schema（包含刚更新的 state）
    let pageSchema = getSchema();
    if (value && value !== 'undefined' && value.trim() !== '') {
        try {
            pageSchema = JSON.parse(value);
        } catch (error) {
            pageSchema = getSchema();
        }
    }

    // 防御性检查：确保 pageSchema 存在且有效
    if (!pageSchema || typeof pageSchema !== 'object') {
        throw new Error('Schema is invalid, cannot save');
    }

    const { clearSelect } = canvasApi.value;
    const savedCurrentPage = pageState.currentPage ?? null;

    // 深拷贝 pageSchema，确保不会丢失 state 等数据
    let schemaToSave = pageSchema;
    try {
        if (pageSchema && typeof pageSchema === 'object') {
            const stringified = JSON.stringify(pageSchema);
            if (stringified && stringified !== 'undefined') {
                schemaToSave = JSON.parse(stringified);
            }
        } else {
            schemaToSave = pageSchema;
        }
    } catch (error) {
        schemaToSave = pageSchema;
    }

    const materialApi = getMetaApi('engine.service.material') as {
        patchSchemaWithMaterialDefaults?: (s: unknown) => void;
    };
    if (typeof materialApi?.patchSchemaWithMaterialDefaults === 'function') {
        materialApi.patchSchemaWithMaterialDefaults(schemaToSave);
    }

    if (pageSettingState?.isAIPage) {
        if (isTemporaryPage.saved) isTemporaryPage.saved = false;
        isTemporaryPage.saved = true;
        // eslint-disable-next-line camelcase
        pageSettingState.currentPageData.page_content = schemaToSave;
        return Promise.resolve();
    }

    // 先保存数据，保存成功后再重置画布状态
    const savePromise = isBlock()
        ? saveBlock(schemaToSave)
        : savePage(schemaToSave);

    return savePromise
        .then(() => {
            try {
                clearSelect?.();
            } catch (error) {
                // 忽略清除选择状态的错误
            }

            if (isBlock()) {
                resetBlockCanvasState({
                    ...pageState,
                    pageSchema: schemaToSave,
                    loading: false
                });
            } else {
                try {
                    resetPageCanvasState({
                        ...pageState,
                        pageSchema: schemaToSave,
                        currentPage: savedCurrentPage,
                        loading: false
                    });
                } catch (error) {
                    // 重置失败不应该影响保存成功的结果
                }
            }
        })
        .catch(error => {
            throw error;
        });
};

export const openCommon = async () => {
    const { isSaved, getSchema } = useCanvas();
    // 在 VSCode 环境中，允许随时保存，不检查是否有改动
    const isVSCode = checkIsVSCodeEnvironment();
    if ((!isVSCode && isSaved()) || state.disabled) {
        return;
    }

    const { beforeSave, saveMethod, saved } = getOptions(
        'engine.toolbars.save'
    );

    try {
        if (typeof beforeSave === 'function') {
            await beforeSave();
        }
        if (typeof saveMethod === 'function') {
            const stop = await saveMethod();
            if (stop) {
                return;
            }
        }
    } catch (error) {
        useNotify()({ type: 'error', message: `Error in saving: ${error}` });
    }

    const pageStatus = useLayout().layoutState?.pageStatus;
    const curPageState = pageStatus?.state;
    const pageInfo = pageStatus?.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ERR_MSG: Record<string, string> = {
        [PAGE_STATUS.Release]: '当前页面未锁定，请先锁定再保存',
        [PAGE_STATUS.Empty]: '当前应用无页面，请先新建页面再保存',
        [PAGE_STATUS.Guest]: '官网演示应用不能保存页面，如需体验请切换应用',
        [PAGE_STATUS.Lock]: `当前页面被 ${
            pageInfo?.username || ''
        } 锁定，如需编辑请先联系他解锁文件，然后再锁定该页面后编辑！`
    };

    if (
        [
            PAGE_STATUS.Release,
            PAGE_STATUS.Empty,
            PAGE_STATUS.Guest,
            PAGE_STATUS.Lock
        ].includes(curPageState)
    ) {
        useNotify()({
            type: 'error',
            title: translate('designer.vscode.saveFailed'),
            message: ERR_MSG[curPageState]
        });
        return;
    }

    state.disabled = true;

    try {
        const pageSchema = getSchema();
        state.code = JSON.stringify(pageSchema || {}, null, 2);
        await saveCommon(state.code);
        return;
    } catch (error) {
        useNotify()({
            type: 'error',
            message: error instanceof Error ? error.message : String(error)
        });
        throw error;
    } finally {
        state.disabled = false;
        if (typeof saved === 'function') {
            try {
                saved();
            } catch (error) {
                useNotify()({
                    type: 'error',
                    message: `Error in saved: ${error}`
                });
            }
        }
    }
};

export const getAutoSaveStatus = () => {
    try {
        return JSON.parse(localStorage.getItem(AUTO_SAVED) ?? '') ?? false;
    } catch {
        return false;
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setAutoSaveStatus = (status: any) => {
    try {
        localStorage.setItem(AUTO_SAVED, JSON.stringify(status));
        return true;
    } catch {
        return false;
    }
};

export { isLoading };
