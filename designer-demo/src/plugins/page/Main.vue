<!-- eslint-disable vue/multi-word-component-names, vue/max-lines-per-block -->
<template>
    <div class="plugin-page">
        <plugin-panel
            :title="t('designer.page.title')"
            :fixed-name="PLUGIN_NAME.AppManage"
            :fixed-panels="fixedPanels"
            :docs-url="docsUrl"
            :docs-content="docsContent"
            :is-show-docs-icon="true"
            @close="pluginPanelClosed"
        >
            <template #header>
                <svg-button
                    class="add-folder-icon"
                    name="add-folder"
                    placement="bottom"
                    :tips="t('designer.page.newFolder')"
                    @click="createNewFolder()"
                />
                <svg-button
                    class="new-page-icon"
                    name="new-page"
                    placement="bottom"
                    :tips="t('designer.page.newPage')"
                    @click="createNewPage('staticPages')"
                />
            </template>
            <template #content>
                <page-tree
                    ref="pageTreeRef"
                    :is-folder="state.isFolder"
                    @add="createNewPage('publicPages')"
                    @open-setting-panel="openSettingPanel"
                    @create-page="createNewPage"
                    @create-folder="createNewFolder"
                    @setting-home="settingHome"
                />
            </template>
        </plugin-panel>
        <page-setting
            :is-folder="state.isFolder"
            @open-new-page="openNewPage"
        />
        <page-folder-setting :is-folder="state.isFolder" />
    </div>
</template>

<!-- eslint-disable vue/max-lines-per-block, vue/block-lang, vue/component-api-style -->
<script lang="tsx">
/* metaService: engine.plugins.appmanage.Main */
import { reactive, ref, watchEffect, provide, computed } from 'vue';
import {
    useCanvas,
    usePage,
    useHelp,
    useModal,
    useNotify,
    useLayout
} from '@opentiny/tiny-engine-meta-register';
import { SvgButton } from '@opentiny/tiny-engine-common';
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n';
import { extend } from '@opentiny/vue-renderless/common/object';

import PluginPanel from '@/components/i18n-wrappers/PluginPanel/index.vue';

import { useDesignerI18n, t as designerT } from '../../services/i18nService';

import PageSetting, {
    openPageSettingPanel,
    closePageSettingPanel
} from './PageSetting.vue';
import PageFolderSetting, {
    openFolderSettingPanel,
    closeFolderSettingPanel
} from './PageFolderSetting.vue';
import PageTree from './PageTree.vue';
import { fetchPageDetail, handleRouteHomeUpdate } from './http';

export const api = {
    getPageById: id => {
        if (id) {
            return fetchPageDetail(id);
        }

        return undefined;
    },
    openPageSettingPanel
};

/* metaComponent: engine.plugins.page */
export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PageSetting,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PluginPanel,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        SvgButton,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PageFolderSetting,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PageTree
    },
    props: {
        title: {
            type: String,
            default: '页面'
        },
        fixedPanels: {
            type: Array as () => string[],
            default: () => []
        }
    },
    emits: ['close'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const { confirm } = useModal();
        const { pageState } = useCanvas();
        const {
            pageSettingState,
            getDefaultPage,
            isTemporaryPage,
            initCurrentPageData
        } = usePage();

        const { PLUGIN_NAME } = useLayout();

        // 提供国际化注入
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const inst: any = (window as any).lowcodeI18n;
        if (inst) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            provide(I18nInjectionKey as any, inst);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            provide(I18nInjectionKey as any, { global: { t: designerT } });
        }

        const panelState = reactive({
            emitEvent: emit
        });

        provide('panelState', panelState);

        const pageTreeRef = ref(null);
        const { ROOT_ID } = pageSettingState;
        const docsUrl = useHelp().getDocsUrl('page');
        const docsContent = computed(() => t('designer.page.docs'));

        const state = reactive({
            isFolder: false
        });

        const createNewPage = (group, parentId = ROOT_ID) => {
            closeFolderSettingPanel();
            pageSettingState.isNew = true;
            try {
                const defaultPage = getDefaultPage();
                if (!defaultPage) {
                    throw new Error('Failed to get default page configuration');
                }
                pageSettingState.currentPageData = {
                    ...getDefaultPage(),
                    ...defaultPage,
                    parentId,
                    route: '',
                    name: 'Untitled',
                    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                    page_content: {
                        lifeCycles: {}
                    },
                    group
                };
            } catch (error) {
                throw new Error(error);
                // console.error('Failed to create new page:', error)
            }
            pageSettingState.currentPageDataCopy = extend(
                true,
                {},
                pageSettingState.currentPageData
            );
            state.isFolder = false;
            openPageSettingPanel();
        };

        const createNewFolder = (parentId = ROOT_ID) => {
            closePageSettingPanel();
            pageSettingState.isNew = true;
            pageSettingState.currentPageData = {
                parentId,
                route: '',
                name: 'untitled'
            };
            pageSettingState.currentPageDataCopy = extend(
                true,
                {},
                pageSettingState.currentPageData
            );
            state.isFolder = true;
            openFolderSettingPanel();
        };

        const settingHome = node => {
            confirm({
                title: t('designer.common.tip'),
                type: 'warning ',
                message: t('designer.page.confirmSetHome'),
                exec: () => {
                    const params = { ...node.rawData, isHome: true };

                    handleRouteHomeUpdate(node.id, params)
                        .then(() => {
                            pageSettingState.updateTreeData();
                            pageSettingState.isNew = false;
                            useNotify({
                                message: t('designer.page.setHomeSuccess'),
                                type: 'success'
                            });
                        })
                        .catch(() => {
                            useNotify({
                                message: t('designer.page.setHomeFailed'),
                                type: 'error'
                            });
                        });
                }
            });
        };

        watchEffect(() => {
            if (isTemporaryPage.saved) {
                openPageSettingPanel();
            }
        });

        const openSettingPanel = async pageData => {
            state.isFolder = !pageData.isPage;
            pageSettingState.isNew = false;

            const isPageChange =
                pageData.id !== pageSettingState.currentPageData.id;

            if (state.isFolder) {
                if (isPageChange) {
                    closePageSettingPanel();
                }
                openFolderSettingPanel();
            } else {
                if (isPageChange) {
                    closeFolderSettingPanel();
                }
                openPageSettingPanel();
            }
            const pageDetail = await fetchPageDetail(pageData?.id);
            initCurrentPageData(pageDetail);
        };

        provide('openSettingPanel', openSettingPanel);

        const pluginPanelClosed = () => {
            emit('close');
            closePageSettingPanel();
            closeFolderSettingPanel();
        };

        const openNewPage = data => {
            pageTreeRef.value.switchPage(data);
        };

        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            PLUGIN_NAME,
            state,
            pageState,
            openNewPage,
            pageTreeRef,
            pluginPanelClosed,
            openSettingPanel,
            createNewFolder,
            createNewPage,
            docsUrl,
            docsContent,
            settingHome,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
:deep(.tiny-button) {
    border-radius: 4px;
    height: 24px;
    line-height: 24px;
}
.plugin-page {
    height: 100%;
}
</style>
