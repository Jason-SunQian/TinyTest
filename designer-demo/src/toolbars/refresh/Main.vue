<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <div class="toolbar-refresh">
        <toolbar-base
            :content="t('designer.toolbar.refreshCanvas')"
            :icon="options?.icon?.default || options?.icon"
            :options="options"
            @click-api="refresh"
        />
    </div>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
/* metaService: engine.toolbars.refresh.custom.Main */
import {
    useMaterial,
    useCanvas,
    useModal,
    useLayout,
    useBlock,
    useNotify,
    useMessage,
    getOptions,
    getMetaApi,
    META_SERVICE
} from '@opentiny/tiny-engine-meta-register';
import { ToolbarBase } from '@opentiny/tiny-engine-common';

import { useDesignerI18n } from '@/services/i18nService';

const REFRESH_PLUGIN_ID = 'engine.toolbars.refresh.custom';

export default {
    components: {
         
        ToolbarBase
    },
    props: {
        options: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        }
    },
     
    setup() {
        const { t } = useDesignerI18n();
        const { confirm } = useModal();
        const { isBlock, isSaved, pageState, initData } = useCanvas();
        const { PLUGIN_NAME, activePlugin, isEmptyPage } = useLayout();
        const { getCurrentBlock, initBlock } = useBlock();
        const { beforeRefresh } = getOptions(REFRESH_PLUGIN_ID) || {};
        const { publish } = useMessage();

        const refreshResource = () => {
            // 清空区块缓存(不能清空组件缓存)，保证画布刷新后可以重新注册最新的区块资源
            useMaterial().clearBlockResources();
            // 因为webcomponents无法重复注册，所以需要刷新内部iframe
            useCanvas().canvasApi.value.getDocument().location.reload();
            // 通知画布更新完成
            publish({ topic: 'canvas_refreshed' });
        };

        const refreshBlock = async () => {
            const block = getCurrentBlock();
            if (!block?.id) {
                useNotify({
                    type: 'warning',
                    message: t('designer.toolbar.refreshBlockError', {
                        defaultValue: '当前没有选中的区块，无法刷新'
                    })
                });
                return;
            }
            try {
                // 第二个参数true表示不激活区块管理面板
                const api = await activePlugin(PLUGIN_NAME.BlockManage, true);
                await api.refreshBlockData(block);
                await initBlock(block, {}, true);
                refreshResource();
            } catch (error) {
                useNotify({
                    type: 'error',
                    message: t('designer.toolbar.refreshBlockFailed', {
                        defaultValue: '刷新区块失败',
                        error:
                            error instanceof Error
                                ? error.message
                                : String(error)
                    })
                });
            }
        };

        const refreshPage = async () => {
            if (isEmptyPage()) {
                return;
            }

            // 优先使用 pageState.currentPage，如果没有则从 URL 参数获取 pageId
            const { currentPage } = pageState;
            let pageId: string | number | null | undefined = currentPage?.id;

            // 如果 currentPage 不存在，尝试从 URL 参数获取 pageId
            if (!pageId) {
                const baseInfo = getMetaApi(
                    META_SERVICE.GlobalService
                ).getBaseInfo();
                pageId = baseInfo?.pageId;
            }

            // 如果仍然没有 pageId，无法刷新
            if (!pageId) {
                useNotify({
                    type: 'warning',
                    message: t('designer.toolbar.refreshPageError', {
                        defaultValue: '当前没有选中的页面，无法刷新'
                    })
                });
                return;
            }

            try {
                const api = await activePlugin(PLUGIN_NAME.AppManage, true);
                const page = await api.getPageById(pageId);
                if (!page?.page_content) {
                    useNotify({
                        type: 'error',
                        message: t('designer.toolbar.refreshPageNotFound', {
                            defaultValue: '页面不存在或数据异常'
                        })
                    });
                    return;
                }
                await initData(page.page_content, page);
                refreshResource();
            } catch (error) {
                useNotify({
                    type: 'error',
                    message: t('designer.toolbar.refreshPageFailed', {
                        defaultValue: '刷新页面失败',
                        error:
                            error instanceof Error
                                ? error.message
                                : String(error)
                    })
                });
            }
        };

        const refresh = async () => {
            try {
                if (typeof beforeRefresh === 'function') {
                    const stop = await beforeRefresh();

                    if (stop) {
                        return;
                    }
                }
            } catch (error) {
                useNotify({
                    type: 'error',
                    message: `Error in beforeRefresh: ${error}`
                });
            }

            if (isSaved()) {
                if (isBlock()) {
                    refreshBlock();
                } else {
                    refreshPage();
                }
            } else {
                const type = isBlock()
                    ? t('designer.common.block')
                    : t('designer.common.page');
                confirm({
                    title: t('designer.common.tip'),
                    message: t('designer.toolbar.refreshConfirm', { type }),
                    exec: () => {
                        if (isBlock()) {
                            refreshBlock();
                        } else {
                            refreshPage();
                        }
                    }
                });
            }
        };

        return {
            refresh,
            t
        };
    }
};
</script>
