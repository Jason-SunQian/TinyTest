<template>
    <div class="page-setting-content-wrapper">
        <!-- 暂时隐藏顶部操作按钮 -->
        <div class="page-setting-header-actions">
            <button-group>
                <tiny-button type="primary" @click="savePageSetting">{{
                    t('designer.page.save')
                }}</tiny-button>
                <!--        <svg-button -->
                <!--          v-if="!pageSettingState.isNew" -->
                <!--          name="text-copy-page" -->
                <!--          placement="bottom" -->
                <!--          :tips="t('designer.page.copyPage')" -->
                <!--          @click="copyPage" -->
                <!--        ></svg-button> -->
                <!--        <svg-button v-if="!pageSettingState.isNew" name="delete" :tips="t('designer.page.deletePage')" @click="deletePage"></svg-button> -->
            </button-group>
        </div>
        <div class="page-setting-content">
            <tiny-collapse
                v-model="state.activeName"
                class="page-setting-collapse"
            >
                <tiny-collapse-item
                    :title="t('designer.page.basicSettings')"
                    :name="PAGE_SETTING_SESSION.general"
                >
                    <component
                        :is="pageGeneral"
                        ref="pageGeneralRef"
                        :is-folder="isFolder"
                    />
                </tiny-collapse-item>

                <tiny-collapse-item
                    v-if="pageSettingState.currentPageData.group !== 'public'"
                    class="base-setting"
                    :title="t('designer.page.inputOutput')"
                    :name="PAGE_SETTING_SESSION.inputOutput"
                >
                    <page-input-output />
                </tiny-collapse-item>
                <tiny-collapse-item
                    v-if="pageSettingState.currentPageData.group !== 'public'"
                    class="input-output"
                    :title="t('designer.page.lifecycleConfig')"
                    :name="PAGE_SETTING_SESSION.lifeCycles"
                >
                    <div class="life-cycles-container">
                        <life-cycles
                            :bind-life-cycles="
                                pageSettingState.currentPageData.page_content
                                    ?.lifeCycles
                            "
                            @update-page-life-cycles="updatePageLifeCycles"
                        />
                    </div>
                </tiny-collapse-item>

                <!-- 暂时隐藏历史备份 -->
                <!--
                    <tiny-collapse-item class="history-source" :title="t('designer.page.historyBackup')" :name="PAGE_SETTING_SESSION.history">
                    <page-history @restorePage="restorePage"></page-history>
                    </tiny-collapse-item> 
                -->
            </tiny-collapse>
        </div>
    </div>
</template>

<!-- eslint-disable vue/max-lines-per-block, vue/block-lang -->
<script lang="jsx">
/* metaService: engine.plugins.singlePage.PageSettingContent */
import { reactive, ref, computed, onActivated, onDeactivated } from 'vue';
import { Button, Collapse, CollapseItem } from '@opentiny/vue';
import { ButtonGroup, SvgButton } from '@opentiny/tiny-engine-common';
import {
    useLayout,
    usePage,
    useCanvas,
    useModal,
    useNotify,
    getMergeMeta,
    useMessage
} from '@opentiny/tiny-engine-meta-register';
import { extend, isEqual } from '@opentiny/vue-renderless/common/object';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { constants } from '@opentiny/tiny-engine-utils';
import { isVsCodeEnv } from '@opentiny/tiny-engine-common/js/environments';
import { handlePageUpdate } from '@opentiny/tiny-engine-common/js/http';
import { generatePage } from '@opentiny/tiny-engine-common/js/vscodeGenerateFile';

import LifeCycles from '@/components/i18n-wrappers/LifeCycles/index.vue';

import { useDesignerI18n } from '../../services/i18nService';

import PageHistory from './PageHistory.vue';
import meta from './meta';
import http from './http';
import PageInputOutput from './PageInputOutput.vue';

const PAGE_SETTING_SESSION = {
    general: 'general',
    inputOutput: 'inputOutput',
    lifeCycles: 'lifeCycles',
    history: 'history'
};

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyButton: Button,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyCollapse: Collapse,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyCollapseItem: CollapseItem,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PageInputOutput,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        LifeCycles,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PageHistory,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        SvgButton,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ButtonGroup
    },
    props: {
        isFolder: {
            type: Boolean,
            default: false
        }
    },
    emits: ['openNewPage'],
    // eslint-disable-next-line vue/component-api-style
    setup() {
        const { t } = useDesignerI18n();
        const { requestDeletePage } = http;
        const {
            pageSettingState,
            changeTreeData,
            isCurrentDataSame,
            updatePageSettingAfterSave
        } = usePage();
        const { pageState, initData } = useCanvas();
        const { confirm } = useModal();
        const registry = getMergeMeta(meta.id);
        const pageGeneral = registry.components.PageGeneral;
        const pageGeneralRef = ref(null);

        const { PLUGIN_NAME } = useLayout();
        const { subscribe, unsubscribe } = useMessage();

        // 初始化订阅
        let subscriber = null;

        // 组件激活时订阅
        onActivated(() => {
            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
            const subscribeResult = subscribe({
                topic: 'page-saved',
                callback: () => {
                    // 当收到页面保存事件时，更新页面设置状态
                    updatePageSettingAfterSave();
                }
            });
            subscriber = subscribeResult;
        });

        // 组件卸载或失活时取消订阅
        onDeactivated(() => {
            if (subscriber) {
                unsubscribe(subscriber);
            }
        });

        const state = reactive({
            activeName: Object.values(PAGE_SETTING_SESSION),
            title: computed(() => t('designer.page.pageSettings')),
            historyMessage: ''
        });

        const cancelPageSetting = () => {
            if (
                isEqual(
                    pageSettingState.currentPageData,
                    pageSettingState.currentPageDataCopy
                )
            ) {
                // 已保存，直接关闭
                return;
            }
            confirm({
                title: t('designer.page.tip'),
                message: t('designer.page.closeWithoutSave'),
                exec: () => {
                    if (!pageSettingState.isNew) {
                        changeTreeData(
                            pageSettingState.oldParentId,
                            pageSettingState.currentPageData.parentId
                        );
                        Object.assign(
                            pageSettingState.currentPageData,
                            pageSettingState.currentPageDataCopy
                        );
                    }
                }
            });
        };

        const createHistoryMessage = () => {
            if (isCurrentDataSame()) {
                useNotify({
                    message: t('designer.page.noChangesToSave'),
                    type: 'info'
                });
                return;
            }

            const { id } = pageSettingState.currentPageData;

            if (!id) {
                useNotify({
                    message: t('designer.page.pageIdMissing'),
                    type: 'error'
                });
                return;
            }

            // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
            const {
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                page_content: page_content_state,
                ...pageSettingStateOther
            } = pageSettingState.currentPageData;

            const params = {
                ...pageSettingStateOther,
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                page_content: page_content_state,
                fileName: pageSettingState.currentPageData.name
            };

            const routerChange =
                pageSettingState.currentPageDataCopy.route !==
                pageSettingState.currentPageData.route;
            const isCurEditPage = pageState?.currentPage?.id === id;

            const updateParams = {
                id,
                params,
                routerChange,
                isCurEditPage,
                isUpdateTree: true
            };

            handlePageUpdate(updateParams).then(data => {
                if (data) {
                    // 合并保存后的数据，确保保留当前编辑的 serviceName 等字段
                    // 因为服务器返回的数据可能不包含所有字段
                    pageSettingState.currentPageData = {
                        ...pageSettingState.currentPageData,
                        ...data,
                        // 确保 serviceName 字段被保留（如果服务器没有返回，使用当前值）
                        serviceName:
                            data.serviceName ??
                            pageSettingState.currentPageData.serviceName ??
                            ''
                    };

                    if (pageState?.currentPage?.id === data?.id) {
                        initData(data.page_content, data);
                    }

                    // 更新 currentPageDataCopy，确保包含所有字段（包括 serviceName）
                    pageSettingState.currentPageDataCopy = extend(
                        true,
                        {},
                        pageSettingState.currentPageData
                    );
                    const {
                        id: pageId,
                        name,
                        // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                        page_content
                    } = pageSettingState.currentPageData;

                    const pageContent = {
                        ...pageSettingState.currentPageData,
                        // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                        page_content
                    };

                    if (isVsCodeEnv()) {
                        generatePage({
                            pageId,
                            pageName: name,
                            pageContent
                        });
                    }
                }
            });
        };

        const savePageSetting = () => {
            pageGeneralRef.value.validGeneralForm().then(createHistoryMessage);
        };

        const copyPage = () => {
            const { id } = pageSettingState.currentPageData;
            http.requestCopyPage({ id }).then(() => {
                pageSettingState.updateTreeData();
                useNotify({
                    message: t('designer.page.copySuccess'),
                    type: 'success'
                });
            });
        };

        const deletePage = () => {
            if (
                pageSettingState.treeDataMapping[
                    pageSettingState.currentPageData.id
                ]?.children?.length
            ) {
                useNotify({
                    message: t('designer.page.deletePageWithChildren'),
                    type: 'warning'
                });
                return;
            }

            confirm({
                title: t('designer.common.tip'),
                message: t('designer.page.confirmDeletePage'),
                exec: () => {
                    requestDeletePage(pageId)
                        .then(() => {
                            pageSettingState.updateTreeData();
                            useNotify({
                                message: t('designer.page.deleteSuccess'),
                                type: 'success'
                            });
                        })
                        .catch(() => {
                            useNotify({
                                message: t('designer.page.deleteFailed'),
                                type: 'error'
                            });
                        });
                }
            });
        };

        const updatePageLifeCycles = lifeCycles => {
            pageSettingState.currentPageData.page_content.lifeCycles =
                lifeCycles;
        };

        const restorePage = historyId => {
            http.requestRestorePageHistory({ historyId }).then(() => {
                useNotify({
                    message: t('designer.page.restoreSuccess'),
                    type: 'success'
                });
            });
        };

        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            PLUGIN_NAME,
            state,
            savePageSetting,
            copyPage,
            pageSettingState,
            pageGeneral,
            pageGeneralRef,
            deletePage,
            cancelPageSetting,
            updatePageLifeCycles,
            restorePage,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            PAGE_SETTING_SESSION,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.page-setting-content-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.page-setting-header-actions {
    padding: 12px;
    border-bottom: 1px solid var(--te-component-common-border-color-divider);
}

.page-setting-content {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
}

.page-setting-collapse {
    :deep(.tiny-collapse-item__header) {
        &,
        &.is-active {
            &::before {
                border: none;
            }
        }

        .svg-icon {
            margin-right: 6px;
        }
    }
    :deep(.tiny-collapse-item__content) {
        padding: 0 12px 12px;
    }
}
</style>
