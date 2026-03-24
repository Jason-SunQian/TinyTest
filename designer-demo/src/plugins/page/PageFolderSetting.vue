<!-- eslint-disable vue/no-root-v-if, vue/max-lines-per-block -->
<template>
    <plugin-setting
        v-if="isShow"
        :fixed-name="PLUGIN_NAME.AppManage"
        :align="align"
        :title="state.title"
        class="pageFolder-plugin-setting"
    >
        <template #header>
            <button-group>
                <tiny-button type="primary" @click="saveFolderSetting">{{
                    t('designer.page.save')
                }}</tiny-button>
                <svg-button
                    v-if="!pageSettingState.isNew"
                    name="delete"
                    placement="bottom"
                    :tips="t('designer.page.delete')"
                    @click="deleteFolder"
                />
                <svg-button
                    class="close-plugin-setting-icon"
                    name="close"
                    @click="closeFolderSetting"
                />
            </button-group>
        </template>

        <template #content>
            <div class="page-setting-content">
                <tiny-collapse v-model="state.activeName">
                    <tiny-collapse-item
                        :title="t('designer.page.basicSettings')"
                        name="folderGeneralRef"
                    >
                        <component
                            :is="pageGeneral"
                            ref="folderGeneralRef"
                            :is-folder="isFolder"
                        />
                    </tiny-collapse-item>
                </tiny-collapse>
            </div>
        </template>
    </plugin-setting>
</template>

<!-- eslint-disable vue/max-lines-per-block, vue/component-api-style -->
<script lang="ts">
/* metaService: engine.plugins.appmanage.PageFolderSetting */
import { reactive, ref, computed } from 'vue';
import { Button, Collapse, CollapseItem } from '@opentiny/vue';
import {
    PluginSetting,
    SvgButton,
    ButtonGroup
} from '@opentiny/tiny-engine-common';
import {
    usePage,
    useLayout,
    useModal,
    useNotify,
    getMergeMeta,
    getMetaApi,
    META_SERVICE
} from '@opentiny/tiny-engine-meta-register';
import { isEqual } from '@opentiny/vue-renderless/common/object';
import throttle from '@opentiny/vue-renderless/common/deps/throttle';

import { useDesignerI18n } from '../../services/i18nService';

import meta from './meta';
import http from './http';

const isShow = ref(false);
export const openFolderSettingPanel = () => {
    isShow.value = true;
};

export const closeFolderSettingPanel = () => {
    isShow.value = false;

    const { resetPageData } = usePage();

    resetPageData();
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
    // eslint-disable-next-line vue/component-api-style
    setup() {
        const { t } = useDesignerI18n();
        const state = reactive({
            activeName: ['folderGeneralRef'],
            title: computed(() => t('designer.page.folderSettings'))
        });
        const { requestCreatePage, requestUpdatePage, requestDeletePage } =
            http;
        const { pageSettingState, changeTreeData } = usePage();
        const { confirm } = useModal();
        const registry = getMergeMeta(meta.id);
        const pageGeneral = registry.components.PageGeneral;
        // eslint-disable-next-line vue/require-typed-ref
        const folderGeneralRef = ref(null);

        const { PLUGIN_NAME, getPluginByLayout } = useLayout();
        const align = computed(() => getPluginByLayout(PLUGIN_NAME.AppManage));

        const closeFolderSetting = () => {
            if (
                isEqual(
                    pageSettingState.currentPageData,
                    pageSettingState.currentPageDataCopy
                )
            ) {
                closeFolderSettingPanel();
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
                        closeFolderSettingPanel();
                    }
                });
            }
        };

        const createFolder = () => {
            const data = pageSettingState.currentPageData;
            const createParams = {
                ...data,
                app: getMetaApi(META_SERVICE.GlobalService).getBaseInfo().id,
                isPage: false
            };

            requestCreatePage(createParams)
                .then(() => {
                    pageSettingState.updateTreeData();
                    pageSettingState.isNew = false;
                    closeFolderSettingPanel();
                    useNotify({
                        type: 'success',
                        message: t('designer.page.createFolderSuccess')
                    });
                })
                .catch(error => {
                    useNotify({
                        type: 'error',
                        title: t('designer.page.createFolderFailed'),
                        message: JSON.stringify(error?.message || error)
                    });
                });
        };

        const updateFolder = () => {
            const { id } = pageSettingState.currentPageData;

            requestUpdatePage(id, {
                ...pageSettingState.currentPageData,
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                page_content: null
            })
                .then(() => {
                    pageSettingState.updateTreeData();
                    pageSettingState.isNew = false;
                    closeFolderSettingPanel();
                    useNotify({
                        type: 'success',
                        message: t('designer.page.updateFolderSuccess')
                    });
                })
                .catch(error => {
                    useNotify({
                        type: 'error',
                        title: t('designer.page.updateFolderFailed'),
                        message: JSON.stringify(error?.message || error)
                    });
                });
        };

        const saveFolderSetting = () => {
            folderGeneralRef.value.validGeneralForm().then(() => {
                if (pageSettingState.isNew) {
                    createFolder();
                } else {
                    updateFolder();
                }
            });
        };

        const deleteFolder = () => {
            if (
                pageSettingState.treeDataMapping[
                    pageSettingState.currentPageData.id
                ]?.children?.length
            ) {
                useNotify({
                    type: 'error',
                    message: t('designer.page.folderNotEmpty')
                });

                return;
            }

            confirm({
                title: t('designer.page.tip'),
                message: t('designer.page.deleteFolderConfirm'),
                exec: () => {
                    const id = pageSettingState.currentPageData?.id || '';

                    requestDeletePage(id)
                        .then(() => {
                            pageSettingState.updateTreeData();
                            closeFolderSettingPanel();
                            useNotify({
                                type: 'success',
                                message: t('designer.page.deleteFolderSuccess')
                            });
                        })
                        .catch(error => {
                            useNotify({
                                type: 'error',
                                title: t('designer.page.deleteFolderFailed'),
                                message: JSON.stringify(error?.message || error)
                            });
                        });
                }
            });
        };

        return {
            align,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            PLUGIN_NAME,
            saveFolderSetting,
            deleteFolder: throttle(5000, true, deleteFolder),
            pageGeneral,
            folderGeneralRef,
            closeFolderSettingPanel,
            isShow,
            state,
            pageSettingState,
            closeFolderSetting,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.pageFolder-plugin-setting {
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
</style>
