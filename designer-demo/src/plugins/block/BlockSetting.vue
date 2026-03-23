<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <plugin-setting
        v-if="isOpen"
        class="plugin-block-setting"
        :title="t('designer.block.blockSetting')"
        :align="align"
        :fixed-name="PLUGIN_NAME.BlockManage"
        @mouseleave="onMouseLeave"
        @click="handleClick"
    >
        <template #header>
            <button-group>
                <tiny-button @click="updateBlock">{{
                    t('designer.common.save')
                }}</tiny-button>
                <tiny-button
                    type="primary"
                    :disabled="globalConfig.dslMode === 'Angular'"
                    class="publish-btn"
                    @click="showDeployBlockDialog"
                    >{{ t('designer.common.publish') }}
                </tiny-button>
                <svg-button
                    name="delete"
                    :tips="t('designer.common.delete')"
                    placement="top"
                    @click="deleteBlock"
                />
                <close-icon @click="closePanel" />
            </button-group>
        </template>
        <template #content>
            <tiny-collapse v-model="state.activeName">
                <tiny-collapse-item
                    :title="t('designer.block.basicSettings')"
                    name="base"
                >
                    <block-config ref="blockConfigForm" />
                </tiny-collapse-item>
                <tiny-collapse-item name="attribute">
                    <template #title>
                        <div class="title-wrapper">
                            <span>{{
                                t('designer.block.attributeSettings')
                            }}</span>
                        </div>
                    </template>
                    <div class="block-attribute">
                        <block-property :show-video="state.showAttributeGuide">
                            <template #video>
                                <div
                                    class="video-close"
                                    @click.stop="
                                        handleShowGuide('showAttributeGuide')
                                    "
                                >
                                    <span class="close-text">{{
                                        t('designer.common.collapse')
                                    }}</span>
                                    <close-icon />
                                </div>
                            </template>
                        </block-property>
                    </div>
                </tiny-collapse-item>
                <tiny-collapse-item
                    :title="t('designer.block.eventSettings')"
                    name="event"
                >
                    <template #title>
                        <div class="title-wrapper">
                            <span>{{ t('designer.block.eventSettings') }}</span>
                        </div>
                    </template>
                    <div class="block-event">
                        <block-event :show-video="state.showEventGuide">
                            <template #video>
                                <div
                                    class="video-close"
                                    @click.stop="
                                        handleShowGuide('showEventGuide')
                                    "
                                >
                                    <span class="close-text">{{
                                        t('designer.common.collapse')
                                    }}</span>
                                    <close-icon />
                                </div>
                            </template>
                        </block-event>
                    </div>
                </tiny-collapse-item>
                <tiny-collapse-item
                    :title="t('designer.block.lifecycleSettings')"
                    name="lifeCycle"
                >
                    <div class="life-cycles-container">
                        <life-cycles
                            :is-page="false"
                            :bind-life-cycles="state.bindLifeCycles"
                            @bind="bindLifeCycles"
                        />
                    </div>
                </tiny-collapse-item>
                <tiny-collapse-item
                    :title="t('designer.block.versionList')"
                    name="history"
                >
                    <block-history-list
                        :is-block-manage="true"
                        :history="state.backupList"
                        :last-version="state.lastVersion"
                        @preview="previewHistory"
                    />
                </tiny-collapse-item>
            </tiny-collapse>
        </template>
    </plugin-setting>
    <block-deploy-dialog
        v-model:visible="state.showDeployBlock"
        :block="publishBlock"
        @change-schema="handleChangeSchema"
    />
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
/* metaService: engine.plugins.blockmanage.BlockSetting */
import { reactive, ref, watch, watchEffect, computed, inject } from 'vue';
import {
    Button as TinyButton,
    Collapse as TinyCollapse,
    CollapseItem as TinyCollapseItem
} from '@opentiny/vue';
import {
    useLayout,
    useModal,
    getMergeMeta,
    useBlock
} from '@opentiny/tiny-engine-meta-register';
import {
    BlockHistoryList,
    PluginSetting,
    CloseIcon,
    SvgButton,
    ButtonGroup,
    LifeCycles,
    BlockDeployDialog
} from '@opentiny/tiny-engine-common';
import { previewPage } from '@opentiny/tiny-engine-common/js/preview';
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n';

import BlockEvent from './BlockEvent.vue';
import BlockConfig from './BlockConfig.vue';
import BlockProperty from './BlockProperty.vue';
import {
    getEditBlock,
    delBlock,
    saveBlock,
    getBlockBase64,
    setConfigItemVisible,
    saveArrayConfig
} from './js/blockSetting';

const isOpen = ref(false);

const removeBlock = delBlock(() => {
    isOpen.value = false;
});

const closePanel = () => {
    isOpen.value = false;
};

const openPanel = () => {
    isOpen.value = true;
};

export default {
    components: {
         
        TinyButton,
         
        TinyCollapse,
         
        TinyCollapseItem,
         
        BlockEvent,
         
        BlockConfig,
         
        PluginSetting,
         
        BlockProperty,
         
        BlockHistoryList,
         
        LifeCycles,
         
        CloseIcon,
         
        BlockDeployDialog,
         
        SvgButton,
         
        ButtonGroup
    },
    props: {
        modelValue: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        }
    },
     
    setup() {
        // 获取国际化 t 函数
         
        const i18n: any = inject(I18nInjectionKey);
        const t = i18n?.global?.t || ((key: string) => key);

        const { confirm } = useModal();
        const editBlock = computed(getEditBlock);
        const publishBlock = computed(() => {
            const currentBlock = useBlock().getCurrentBlock();
            const currentEditBlock = getEditBlock();

            if (currentBlock?.id === currentEditBlock?.id) {
                return currentBlock;
            }

            return currentEditBlock;
        });
         
        const blockConfigForm = ref(null);

        const { PLUGIN_NAME, getPluginByLayout } = useLayout();
        const align = computed(() =>
            getPluginByLayout(PLUGIN_NAME.BlockManage)
        );

        const state = reactive({
            activeName: ['base', 'attribute', 'event', 'lifeCycle', 'history'],
            backupList: [],
            lastVersion: {},
            showDeployBlock: false,
            bindLifeCycles: {},
            showAttributeGuide: false,
            showEventGuide: false
        });

        watchEffect(() => {
            state.bindLifeCycles = getEditBlock()?.content?.lifeCycles || {};
        });

        watch(
            () => {
                const block = getEditBlock();
                return [block?.id, block?.histories?.length];
            },
            () => {
                const block = getEditBlock();

                if (block?.id) {
                    state.backupList = block.histories;
                    state.lastVersion = block.last_build_info;
                }
            }
        );

        const deleteBlock = () => {
            const title = t('designer.block.deleteBlock');
            const message = t('designer.block.confirmDeleteBlock');

            confirm({ title, message, exec: removeBlock });
        };

        const updateBlock = () => {
            saveArrayConfig();
            blockConfigForm.value.validateForm().then(() => {
                const block = getEditBlock();

                if (
                    block.content?.schema?.properties?.[0]?.content.length > 1
                ) {
                    const contentList =
                        block.content.schema.properties[0].content;
                    const propertyList = contentList.map(e => e.property);
                    if (new Set(propertyList).size !== propertyList.length) {
                        useModal().message({
                            message: t('designer.block.duplicatePropertyError'),
                            status: 'error'
                        });
                        return false;
                    }
                }
                const title = t('designer.block.saveBlock');
                const message = t('designer.block.confirmSaveBlock');

                confirm({
                    title,
                    message,
                    exec: async () => {
                        const currentId = useBlock().getCurrentBlock()?.id;
                        if (block.id === currentId) {
                            // 获取区块截图
                            block.screenshot = await getBlockBase64();
                        }
                        saveBlock(block);
                    }
                });

                return undefined;
            });
        };

        const showDeployBlockDialog = () => {
            saveArrayConfig();
            blockConfigForm.value.validateForm().then(() => {
                state.showDeployBlock = true;
            });
        };

        const bindLifeCycles = lifeCycles => {
            const block = getEditBlock();
            if (!block?.content) {
                return;
            }

            block.content.lifeCycles = lifeCycles;
        };

        const previewHistory = item => {
            if (item) {
                 
                const page_content = item.content;
                previewPage(
                    {
                         
                        page_content,
                        id: item.blockId || item.block_id,
                        history: item.id,
                        name: item.label
                    },
                    true
                );
            }
        };

        const onMouseLeave = () => {
            blockConfigForm.value?.clearValidateForm();
        };

        const handleShowGuide = type => {
            state[type] = !state[type];
        };

        const handleClick = () => {
            setConfigItemVisible(false);
        };

        const handleChangeSchema = newSchema => {
            // 如果是当前正在画布编辑的区块，需要重新 importSchema
            if (getEditBlock()?.id === useBlock().getCurrentBlock()?.id) {
                useBlock().initBlock({
                    ...useBlock().getCurrentBlock(),
                    content: newSchema
                });
            }
        };

        return {
            align,
             
            PLUGIN_NAME,
            state,
            isOpen,
            showDeployBlockDialog,
            closePanel,
            deleteBlock,
            updateBlock,
            bindLifeCycles,
            previewHistory,
            editBlock,
            blockConfigForm,
            globalConfig: getMergeMeta('engine.config'),
            onMouseLeave,
            handleClick,
            handleShowGuide,
            handleChangeSchema,
            publishBlock,
            t
        };
    }
};

export { openPanel, closePanel };
</script>

<style lang="scss" scoped>
.plugin-block-setting {
    :deep(.plugin-setting-header) {
        border: 0;
        .close-plugin-setting-icon {
            margin-left: 4px;
        }
    }

    .video-close {
        font-size: 16px;
        cursor: pointer;
        .close-text {
            display: inline-block;
            vertical-align: top;
            font-size: 14px;
        }
    }
    :deep(.plugin-setting-content) {
        padding: 0 0 16px 0;
    }

    :deep(.tiny-col) {
        padding-left: 0;
    }

    :deep(.block-guide) {
        width: 100%;

        .content {
            .guide-video {
                width: 100%;
                height: auto;
            }
        }
    }

    .block-attribute,
    .block-event {
        position: relative;
        :deep(.tiny-col) {
            position: inherit;
        }

        :deep(.show-video-text) {
            position: absolute;
            z-index: 100;
            top: -23px;
            right: 40px;
        }
    }

    :deep(.title-wrapper) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .show-video-text {
            display: inline-block;
            cursor: pointer;
            font-size: 12px;

            .svg-icon {
                vertical-align: middle;
                display: inline-block;
                font-size: 20px;
                margin-right: 3px;
            }

            color: var(--te-block-video-tip-text-color);
        }
    }
    :deep(.tiny-collapse-item__content) {
        padding: 0 12px 12px;
    }
}
</style>
