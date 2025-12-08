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
import { isVsCodeEnv } from '@opentiny/tiny-engine-common/js/environments';
import { goSave } from '../../../composable/useVSCodeBridge';
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
    
    // VSCode 环境下，使用 goSave 保存
    if (isVsCodeEnv) {
        isLoading.value = true;
        try {
            await new Promise<void>((resolve, reject) => {
                goSave(
                    {
                        pageId: currentPage.id,
                        pageSchema,
                        pageData: { ...currentPage, page_content: pageSchema }
                    },
                    (success, error) => {
                        if (success) {
                            resolve();
                        } else {
                            reject(error || new Error(translate('designer.vscode.saveFailed')));
                        }
                    }
                );
            });
            // 发布页面保存事件，通知其他组件进行相应处理
            publish({ topic: 'page-saved' });
        } catch (error) {
            useNotify()({
                type: 'error',
                title: translate('designer.vscode.saveFailed'),
                message: error instanceof Error ? error.message : translate('designer.vscode.saveFailed')
            });
            throw error;
        } finally {
            isLoading.value = false;
        }
        return;
    }

    // 非 VSCode 环境，使用原有方式保存
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    const params = { page_content: pageSchema };
    isLoading.value = true;
    const updateParams = {
        id: currentPage.id,
        params: { ...currentPage, ...params }
    };
    await handlePageUpdate(updateParams);
    isLoading.value = false;

    // 发布页面保存事件，通知其他组件进行相应处理
    publish({ topic: 'page-saved' });
};

export const saveCommon = (value?: string) => {
    const { pageSettingState, isTemporaryPage } = usePage();
    const {
        isBlock,
        canvasApi,
        pageState,
        resetBlockCanvasState,
        resetPageCanvasState
    } = useCanvas();
    const pageSchema = value ? JSON.parse(value) : useCanvas().getSchema();
    const { selectNode } = canvasApi.value;

    if (isBlock()) {
        resetBlockCanvasState({ ...pageState, pageSchema });
    } else {
        resetPageCanvasState({ ...pageState, pageSchema });
    }

    if (pageSettingState?.isAIPage) {
        if (isTemporaryPage.saved) isTemporaryPage.saved = false;
        isTemporaryPage.saved = true;
        // eslint-disable-next-line camelcase
        pageSettingState.currentPageData.page_content = pageSchema;
        return Promise.resolve();
    }

    selectNode(null);
    return isBlock() ? saveBlock(pageSchema) : savePage(pageSchema);
};

export const openCommon = async () => {
    const { isSaved, getSchema } = useCanvas();
    if (isSaved() || state.disabled) return;

    const { beforeSave, saveMethod, saved } = getOptions(
        'engine.toolbars.save'
    );

    try {
        if (typeof beforeSave === 'function') await beforeSave();
        if (typeof saveMethod === 'function') {
            const stop = await saveMethod();
            if (stop) return;
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
            title: '保存失败',
            message: ERR_MSG[curPageState]
        });
        return;
    }

    state.disabled = true;
    const pageSchema = getSchema();
    state.code = JSON.stringify(pageSchema || {}, null, 2);

    return saveCommon(state.code).finally(() => {
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
    });
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
