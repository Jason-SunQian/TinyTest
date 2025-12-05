<!-- eslint-disable vue/no-root-v-if -->
<template>
    <plugin-setting
        v-if="panel.created"
        v-show="panel.show"
        :title="state.title"
        class="version-list-panel"
    >
        <template #header>
            <button-group>
                <tiny-button type="primary" @click="handleConfirm">{{
                    t('designer.common.confirm')
                }}</tiny-button>
                <svg-button name="close" @click="closePanel" />
            </button-group>
        </template>
        <template #content>
            <tiny-grid
                ref="versionGrid"
                :data="state.backupList"
                :highlight-hover-row="false"
            >
                <tiny-grid-column type="radio" width="40" />
                <tiny-grid-column
                    field="version"
                    :title="t('designer.block.versionNumber')"
                />
                <tiny-grid-column :title="t('designer.block.publishTime')">
                    <template #default="{ row }">
                        <span>{{
                            format(row.updated_at, 'yyyy/MM/dd hh:mm:ss')
                        }}</span>
                    </template>
                </tiny-grid-column>
                <tiny-grid-column
                    field="message"
                    :title="t('designer.block.publishDescription')"
                />
                <template #empty>
                    <search-empty :is-show="true" />
                </template>
            </tiny-grid>
        </template>
    </plugin-setting>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
/* metaService: engine.plugins.materials.block.BlockVersionSelect */
import { reactive, watch, ref } from 'vue';
import { Grid, GridColumn, Button } from '@opentiny/vue';
import { format } from '@opentiny/vue-renderless/common/date';
import {
    PluginSetting,
    SearchEmpty,
    ButtonGroup,
    SvgButton
} from '@opentiny/tiny-engine-common';
import {
    useBlock,
    useModal,
    useMaterial,
    useCanvas
} from '@opentiny/tiny-engine-meta-register';

import { useDesignerI18n } from '@/services/i18nService';

import { fetchBlockById, requestGroupBlockVersion } from './http';
import { useVersionSelectPanel } from './js/usePanel';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyGrid: Grid,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyGridColumn: GridColumn,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyButton: Button,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PluginSetting,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        SearchEmpty,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ButtonGroup,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        SvgButton
    },
    // eslint-disable-next-line vue/component-api-style
    setup() {
        const { t } = useDesignerI18n();
        const { confirm } = useModal();
        const { selectedBlock, isRefresh } = useBlock();
        const { panel, closePanel } = useVersionSelectPanel();
        const { message } = useModal();

        const state = reactive({
            backupList: [],
            title: ''
        });
        // eslint-disable-next-line vue/require-typed-ref
        const versionGrid = ref(null);

        const fetchHistories = () => {
            fetchBlockById(selectedBlock.value.id)
                .then(data => {
                    state.backupList = data.histories?.reverse?.() || [];
                    state.backupList.forEach((item, index) => {
                        if (
                            item.version === selectedBlock.value.current_version
                        ) {
                            versionGrid.value?.setRadioRow(
                                state.backupList[index]
                            );
                        }
                    });
                })
                .catch(error => {
                    message({
                        message: t('designer.block.blockVersionGetFailed', {
                            error: error.message || error
                        }),
                        title: t('designer.block.blockVersionGetFailed')
                    });
                });
        };

        const handleChangeVersion = selectedRow => {
            if (selectedRow) {
                confirm({
                    title: t('designer.block.changeBlockVersion'),
                    message: t('designer.block.confirmChangeBlockVersion'),
                    exec: () => {
                        const params = {
                            groupId: selectedBlock.value.groupId,
                            blockId: selectedRow.block_id,
                            blockVersion: selectedRow.version
                        };

                        requestGroupBlockVersion(params)
                            .then(() => {
                                isRefresh.value = true;
                                closePanel();
                                // 刷新缓存
                                useMaterial().updateBlockCompileCache();
                                // 刷新画布
                                useCanvas().canvasApi.value?.updateCanvas();
                            })
                            .catch(error => {
                                message({
                                    title: t(
                                        'designer.block.blockVersionSwitchFailed',
                                        {
                                            label: selectedBlock.value.label,
                                            error: error.message || error
                                        }
                                    ),
                                    message: t(
                                        'designer.block.blockVersionSwitchFailed',
                                        {
                                            label: selectedBlock.value.label,
                                            error: error.message || error
                                        }
                                    )
                                });
                            });
                    }
                });
            }
        };

        const handleConfirm = () => {
            const selectVersion = versionGrid.value?.getRadioRow();
            if (!selectVersion) {
                message({
                    title: t('designer.block.selectVersion'),
                    message: t('designer.block.pleaseSelectVersion')
                });
                return;
            }
            handleChangeVersion(selectVersion);
        };

        watch([() => panel.show, () => selectedBlock.value], ([panelShow]) => {
            if (panelShow) {
                state.title = t('designer.block.selectVersionTitle', {
                    label: selectedBlock.value.label
                });
                versionGrid.value?.clearRadioRow();
                fetchHistories();
            }
        });

        const isCurrentVersion = blockHistory => {
            return (
                blockHistory?.version === selectedBlock.value.current_version
            );
        };

        return {
            state,
            selectedBlock,
            versionGrid,
            panel,
            closePanel,
            format,
            isCurrentVersion,
            handleChangeVersion,
            handleConfirm,
            t
        };
    }
};
</script>
