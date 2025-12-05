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
    getOptions
} from '@opentiny/tiny-engine-meta-register';
import { ToolbarBase } from '@opentiny/tiny-engine-common';

import { useDesignerI18n } from '@/services/i18nService';

const REFRESH_PLUGIN_ID = 'engine.toolbars.refresh.custom';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ToolbarBase
    },
    props: {
        options: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        }
    },
    // eslint-disable-next-line vue/component-api-style
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
            // 第二个参数true表示不激活区块管理面板
            const api = await activePlugin(PLUGIN_NAME.BlockManage, true);
            await api.refreshBlockData(block);
            await initBlock(block, {}, true);
            refreshResource();
        };

        const refreshPage = async () => {
            if (isEmptyPage()) {
                return;
            }

            const { currentPage } = pageState;
            const api = await activePlugin(PLUGIN_NAME.AppManage, true);
            const page = await api.getPageById(currentPage.id);
            await initData(page.page_content, page);
            refreshResource();
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
