/* eslint-disable max-lines */
<!-- eslint-disable vue/no-root-v-if, vue/html-self-closing, vue/attribute-hyphenation, vue/attributes-order, vue/v-on-event-hyphenation -->
<template>
    <plugin-setting
        v-if="isShow"
        :fixed-name="PLUGIN_NAME.AppManage"
        :align="align"
        :title="state.title"
        class="page-plugin-setting"
    >
        <template #header>
            <button-group>
                <tiny-button type="primary" @click="savePageSetting">{{
                    t('designer.page.save')
                }}</tiny-button>
                <svg-button
                    v-if="!pageSettingState.isNew"
                    name="text-copy-page"
                    placement="bottom"
                    :tips="t('designer.page.copyPage')"
                    @click="copyPage"
                />
                <svg-button
                    v-if="!pageSettingState.isNew"
                    name="delete"
                    :tips="t('designer.page.deletePage')"
                    @click="deletePage"
                />
                <svg-button name="close" @click="cancelPageSetting" />
            </button-group>
        </template>

        <template #content>
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
                        v-if="
                            pageSettingState.currentPageData.group !== 'public'
                        "
                        class="base-setting"
                        :title="t('designer.page.inputOutput')"
                        :name="PAGE_SETTING_SESSION.inputOutput"
                    >
                        <page-input-output />
                    </tiny-collapse-item>
                    <tiny-collapse-item
                        v-if="
                            pageSettingState.currentPageData.group !== 'public'
                        "
                        class="input-output"
                        :title="t('designer.page.lifecycleConfig')"
                        :name="PAGE_SETTING_SESSION.lifeCycles"
                    >
                        <div class="life-cycles-container">
                            <life-cycles
                                :bind-life-cycles="
                                    pageSettingState.currentPageData
                                        .page_content?.lifeCycles
                                "
                                @update-page-life-cycles="updatePageLifeCycles"
                            />
                        </div>
                    </tiny-collapse-item>

                    <tiny-collapse-item
                        class="history-source"
                        :title="t('designer.page.historyBackup')"
                        :name="PAGE_SETTING_SESSION.history"
                    >
                        <page-history @restore-page="restorePage" />
                    </tiny-collapse-item>
                </tiny-collapse>
            </div>
        </template>
    </plugin-setting>
</template>

<!-- eslint-disable vue/max-lines-per-block, vue/block-lang, vue/component-api-style -->
<script lang="tsx">
/* eslint-disable max-lines */
/* metaService: engine.plugins.appmanage.PageSetting */
import { reactive, ref, computed, onActivated, onDeactivated, h } from 'vue';
import { Button, Collapse, CollapseItem, Input } from '@opentiny/vue';
import {
    PluginSetting,
    ButtonGroup,
    SvgButton
} from '@opentiny/tiny-engine-common';
import {
    useLayout,
    usePage,
    useCanvas,
    useModal,
    useNotify,
    getMergeMeta,
    getMetaApi,
    META_SERVICE,
    useMessage
} from '@opentiny/tiny-engine-meta-register';
import { extend, isEqual } from '@opentiny/vue-renderless/common/object';
import { constants } from '@opentiny/tiny-engine-utils';
import { isVsCodeEnv } from '@opentiny/tiny-engine-common/js/environments';
import { handlePageUpdate } from '@opentiny/tiny-engine-common/js/http';
import { generatePage } from '@opentiny/tiny-engine-common/js/vscodeGenerateFile';

import LifeCycles from '@/components/i18n-wrappers/LifeCycles/index.vue';

import { useDesignerI18n } from '../../services/i18nService';

import PageHistory from './PageHistory.vue';
import PageInputOutput from './PageInputOutput.vue';
import meta from './meta';
import http from './http';

const { COMPONENT_NAME } = constants;
const isShow = ref(false);

// eslint-disable-next-line
export const openPageSettingPanel = () => {
    isShow.value = true;
};

// eslint-disable-next-line
export const closePageSettingPanel = () => {
    isShow.value = false;

    const { resetPageData } = usePage();

    resetPageData();
};

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
        PluginSetting,
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
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const { requestCreatePage, requestDeletePage } = http;
        const {
            getDefaultPage,
            pageSettingState,
            changeTreeData,
            isCurrentDataSame,
            initCurrentPageData,
            isTemporaryPage,
            STATIC_PAGE_GROUP_ID,
            updatePageSettingAfterSave
        } = usePage();
        const { pageState, initData } = useCanvas();
        const { confirm } = useModal();
        const registry = getMergeMeta(meta.id);
        const pageGeneral = registry.components.PageGeneral;
        const beforeCreatePage = registry?.options?.beforeCreatePage;
        const pageGeneralRef = ref(null);

        const { PLUGIN_NAME, getPluginByLayout } = useLayout();
        const align = computed(() => getPluginByLayout(PLUGIN_NAME.AppManage));
        const { subscribe, unsubscribe } = useMessage();

        // 初始化订阅
        let subscriber = null;

        // 组件激活时订阅
        onActivated(() => {
            const subscribeConfig = {
                topic: 'page-saved',
                callback: () => {
                    // 当收到页面保存事件时，更新页面设置状态
                    updatePageSettingAfterSave();
                }
            };
            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
            const subscribeResult = subscribe(subscribeConfig);
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
                closePageSettingPanel();
            } else {
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
                        closePageSettingPanel();
                    }
                });
            }
        };

        const createPage = async () => {
            // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
            const { page_content, ...other } = getDefaultPage();
            // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
            const {
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                page_content: page_content_state,
                ...pageSettingStateOther
            } = pageSettingState.currentPageData;
            const createParams = {
                ...other,
                ...pageSettingStateOther,
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                page_content: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                    ...page_content,
                    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                    ...page_content_state,
                    fileName: pageSettingState.currentPageData.name
                },
                app: getMetaApi(META_SERVICE.GlobalService).getBaseInfo().id,
                isPage: true
            };

            if (createParams.id) {
                delete createParams.id;
                delete createParams._id;
            }
            if (beforeCreatePage) {
                await beforeCreatePage(createParams);
            }

            try {
                const data = await requestCreatePage(createParams);

                await pageSettingState.updateTreeData();
                pageSettingState.isNew = false;
                isTemporaryPage.saved = false;
                emit('openNewPage', data);
                closePageSettingPanel();
                useLayout().closePlugin();
                useNotify({
                    type: 'success',
                    message: t('designer.page.createPageSuccess')
                });
                if (isVsCodeEnv) {
                    generatePage(data);
                }
            } catch (err) {
                useNotify({
                    type: 'error',
                    title: t('designer.page.createPageFailed'),
                    message: JSON.stringify(err?.message || err)
                });
            }
        };

        const updatePage = (id, params, isUpdateTree = true) => {
            const routerChange =
                pageSettingState.currentPageDataCopy.route !==
                pageSettingState.currentPageData.route;
            const isCurEditPage = pageState?.currentPage?.id === id;
            const updateParams = {
                id,
                params,
                routerChange,
                isCurEditPage,
                isUpdateTree
            };

            return handlePageUpdate(updateParams);
        };

        const restorePage = pageData => {
            const currentData = {
                ...pageData,
                id: pageData.page
            };

            const unnecessaryFields = [
                'page',
                'backupTime',
                'backupTitle',
                'time'
            ];
            unnecessaryFields.forEach(key => delete currentData[key]);

            const params = {
                ...pageSettingState.currentPageData,
                ...currentData,
                message: t('designer.page.restorePage')
            };

            updatePage(currentData.id, params).then(data => {
                // 还原的页面是当前页，需要同步更新画布
                if (pageState?.currentPage?.id === data?.id) {
                    initData(data.page_content, data);
                }
                initCurrentPageData(data);
            });
        };

        const editPage = async () => {
            // 更新页面
            // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
            const { id, name, page_content } = pageSettingState.currentPageData;
            const params = {
                ...pageSettingState.currentPageData,
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                page_content: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                    ...page_content,
                    fileName: name
                }
            };

            const res = await updatePage(id, params);

            initCurrentPageData(res);
        };

        const updatePageLifeCycles = val => {
            if (!val) {
                return;
            }

            const pageContent = pageSettingState.currentPageData.page_content;

            pageContent.lifeCycles = {
                ...(pageContent.lifeCycles || {}),
                ...val
            };
        };

        const copyPageData = () => {
            const data = pageSettingState.currentPageData;
            const copyData = extend(true, {}, data);

            pageSettingState.isNew = true;
            copyData.name = `${copyData.name}Copy`;
            copyData.route = `${copyData.route}Copy`;
            pageSettingState.currentPageData = copyData;
            pageSettingState.currentPageDataCopy = extend(true, {}, copyData);
            pageSettingState.defaultPage = null;
        };

        const copyPage = () => {
            if (!isCurrentDataSame()) {
                confirm({
                    title: t('designer.page.tip'),
                    message: t('designer.page.copyWithoutSave'),
                    exec: () => {
                        changeTreeData(
                            pageSettingState.oldParentId,
                            pageSettingState.currentPageData.parentId
                        );
                        Object.assign(
                            pageSettingState.currentPageData,
                            pageSettingState.currentPageDataCopy
                        );
                        copyPageData();
                    }
                });
            } else {
                copyPageData();
            }
        };

        const settingDefaultPage = () => {
            const params = { ...pageSettingState.defaultPage, isDefault: true };
            updatePage(pageSettingState.defaultPage?.id, params, false).then(
                res => {
                    if (res) {
                        editPage();
                    }
                }
            );
        };

        const createHistoryMessage = () => {
            if (pageSettingState.isNew) {
                pageSettingState.currentPageData.message = 'Page auto save';
                createPage();
            } else {
                const title = t('designer.page.createHistoryBackup');
                const messageRender = {
                    render: () => {
                        return h(Input, {
                            placeholder: t('designer.page.historyBackupInfo'),
                            modelValue: state.historyMessage,
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            'onUpdate:modelValue': (value: string) => {
                                state.historyMessage = value;
                            }
                        });
                    }
                };
                const exec = () => {
                    pageSettingState.currentPageData.message =
                        state.historyMessage.trim() || 'Page auto save';
                    if (pageSettingState.defaultPage?.id) {
                        settingDefaultPage();
                    } else {
                        editPage();
                    }
                    state.historyMessage = '';
                };

                confirm({ title, message: messageRender, exec });
            }
        };

        const savePageSetting = () => {
            pageGeneralRef.value.validGeneralForm().then(createHistoryMessage);
        };

        const collectAllPage = (staticPageList = []) => {
            if (!Array.isArray(staticPageList)) {
                return [];
            }

            const pageList = [];

            staticPageList.forEach(pageItem => {
                if (pageItem?.isPage) {
                    pageList.push(pageItem);

                    return;
                }

                if (!pageItem?.isPage && pageItem?.children?.length) {
                    pageList.push(...collectAllPage(pageItem.children));
                }
            });

            return pageList;
        };

        const deletePage = () => {
            if (
                pageSettingState.treeDataMapping[
                    pageSettingState.currentPageData.id
                ]?.children?.length
            ) {
                useNotify({
                    type: 'error',
                    message: t('designer.page.pageHasChildren')
                });

                return;
            }

            confirm({
                title: t('designer.page.tip'),
                message: t('designer.page.deletePageConfirm'),
                exec: () => {
                    const id = pageSettingState.currentPageData?.id || '';
                    requestDeletePage(id)
                        .then(() => {
                            pageSettingState.updateTreeData().then(pages => {
                                if (pageState?.currentPage?.id !== id) {
                                    return;
                                }

                                const staticPageList =
                                    (pages || []).find(
                                        ({ groupId }) =>
                                            groupId === STATIC_PAGE_GROUP_ID
                                    )?.data || [];
                                const pageList = collectAllPage(staticPageList);

                                const pageHome = pageList.find(
                                    page => page.isHome
                                );
                                const firstPage = pageList?.[0];
                                const defaultPage = {
                                    componentName: COMPONENT_NAME.Page
                                };

                                emit(
                                    'openNewPage',
                                    pageHome || firstPage || defaultPage
                                );
                            });

                            closePageSettingPanel();
                            useNotify({
                                message: t('designer.page.deletePageSuccess'),
                                type: 'success'
                            });
                        })
                        .catch(() => {
                            useNotify({
                                message: t('designer.page.deletePageFailed'),
                                type: 'error'
                            });
                        });
                }
            });
        };

        return {
            align,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            PLUGIN_NAME,
            state,
            isShow,
            savePageSetting,
            copyPage,
            pageSettingState,
            pageGeneral,
            pageGeneralRef,
            deletePage,
            cancelPageSetting,
            closePageSettingPanel,
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
.block-add-content {
    display: flex;
    flex-direction: column;
    height: calc(100% - 45px);
}

.page-plugin-setting {
    :deep(.plugin-setting-header) {
        border: 0;
    }

    :deep(.plugin-setting-content) {
        padding: 0 0 16px 0;
    }

    :deep(.tiny-collapse) {
        border-bottom: 0;
    }
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
