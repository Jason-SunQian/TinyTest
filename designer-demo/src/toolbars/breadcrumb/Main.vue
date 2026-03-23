<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <toolbar-base :options="options">
        <template #default>
            <div class="top-panel-breadcrumb">
                <div
                    :class="[
                        'top-panel-breadcrumb-title',
                        {
                            'top-panel-breadcrumb-title-block':
                                currentType === 'block'
                        }
                    ]"
                >
                    <tiny-breadcrumb separator="：" @select="open">
                        <tiny-breadcrumb-item
                            v-for="item in breadcrumbData.slice(0, 2)"
                            :key="item"
                            >{{ item }}
                        </tiny-breadcrumb-item>
                    </tiny-breadcrumb>
                </div>

                <tiny-button
                    v-if="currentType === 'block' && currentBlock?.id"
                    class="publish"
                    type="primary"
                    size="small"
                    @click="publishBlock()"
                    >{{ t('designer.common.publish') }}
                </tiny-button>
            </div>
            <block-deploy-dialog
                v-model:visible="state.showDeployBlock"
                :block="currentBlock"
                @change-schema="handleChangeSchema"
            />
        </template>
    </toolbar-base>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
/* metaService: engine.toolbars.breadcrumb.custom.Main */
import { reactive, computed, ref } from 'vue';
import { Breadcrumb, BreadcrumbItem, Button } from '@opentiny/vue';
import {
    useLayout,
    useBlock,
    useBreadcrumb
} from '@opentiny/tiny-engine-meta-register';
import { ToolbarBase, BlockDeployDialog } from '@opentiny/tiny-engine-common';

import { useDesignerI18n } from '@/services/i18nService';

export default {
    components: {
         
        TinyBreadcrumb: Breadcrumb,
         
        TinyBreadcrumbItem: BreadcrumbItem,
         
        BlockDeployDialog,
         
        TinyButton: Button,
         
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

        // 在 Main.vue 内部直接定义 CONSTANTS（简单直接）
        const CONSTANTS = computed(() => ({
             
            PAGETEXT: t('designer.toolbar.page'),
             
            BLOCKTEXT: t('designer.leftPanel.blockManagement')
        }));

        const PLUGINS_ID = {
             
            PAGEID: 'engine.plugins.appmanage',
             
            BLOCKID: 'engine.plugins.blockmanage'
        };

        const { layoutState } = useLayout();
        const { plugins } = layoutState || {};

        const state = reactive({
            showDeployBlock: false
        });

        const { getBreadcrumbData } = useBreadcrumb();
        const rawData = getBreadcrumbData();

        // 在 Main.vue 内部管理类型（最可靠）
        const currentType = ref<'page' | 'block'>('page');

        // 初始化：从 sessionStorage 读取
        const initType = sessionStorage.getItem('breadcrumbType');
        if (initType) {
            currentType.value = initType as 'page' | 'block';
        }

        // 监听 sessionStorage 变化（其他地方调用 setBreadcrumbPage/Block 时）
        const updateType = () => {
            const type = sessionStorage.getItem('breadcrumbType');
            if (type) {
                currentType.value = type as 'page' | 'block';
            }
        };

        // 定期检查（简单粗暴但有效）
        setInterval(updateType, 100);

        // 组装显示数据：根据类型添加国际化前缀
        const breadcrumbData = computed(() => {
            const prefix =
                currentType.value === 'page'
                    ? CONSTANTS.value.PAGETEXT
                    : CONSTANTS.value.BLOCKTEXT;
            const data =
                rawData.value && rawData.value.length > 0 ? rawData.value : [];

            // 跳过第一个元素（官方存储的数据中第一个元素是国际化 key）
            const actualData = data.length > 1 ? data.slice(1) : data;

            return [prefix, ...actualData];
        });

        const publishBlock = () => {
            state.showDeployBlock = true;
        };

        const open = () => {
            if (!plugins) return;
            plugins.render =
                currentType.value === 'page'
                    ? PLUGINS_ID.PAGEID
                    : PLUGINS_ID.BLOCKID;
        };

        const currentBlock = computed(() => useBlock?.()?.getCurrentBlock?.());

        const handleChangeSchema = newSchema => {
            useBlock().initBlock({
                ...useBlock().getCurrentBlock(),
                content: newSchema
            });
        };

        return {
            breadcrumbData,
            currentType,
            publishBlock,
            state,
            open,
            currentBlock,
            handleChangeSchema,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.top-panel-breadcrumb {
    padding-left: 12px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: auto;
    height: 100%;
    margin-right: 3px;
    cursor: pointer;
    &-title {
        height: 28px;
        padding: 0 8px;
        background-color: var(--te-toolbars-breadcrumb-bg-color);
        display: flex;
        border-radius: 4px;
        :deep(.reference-wrapper) {
            line-height: 22px;
        }
    }

    .tiny-breadcrumb {
        line-height: var(--base-top-panel-breadcrumb-line-height);
        padding-right: 4px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 12px;
        cursor: inherit;
    }

    .tiny-breadcrumb__item {
        cursor: inherit;
        user-select: none;

        :deep(.tiny-breadcrumb__inner) {
            color: var(--te-toolbars-breadcrumb-text-color);
            text-decoration: none;
            cursor: pointer;
        }

        :deep(.tiny-breadcrumb__separator) {
            padding: 0;
            margin: 0 4px 0 0;
        }

        &:last-child :deep(.tiny-breadcrumb__inner) {
            font-weight: normal;
            color: var(--te-toolbars-breadcrumb-text-color);
        }
    }

    &-title-block {
        background-color: var(--te-toolbars-breadcrumb-block-bg-color);
        .tiny-breadcrumb__item {
            :deep(.tiny-breadcrumb__inner) {
                color: var(--te-toolbars-breadcrumb-block-text-color);
            }
            &:last-child :deep(.tiny-breadcrumb__inner) {
                color: var(--te-toolbars-breadcrumb-block-text-color);
            }
        }
    }

    &-title-block:hover {
        background-color: var(--te-toolbars-breadcrumb-block-bg-color-hover);
    }

    .publish {
        margin: 0 8px;
        height: 24px;
        line-height: 24px;
        min-width: 40px;
        font-size: 12px;
    }
}
</style>
