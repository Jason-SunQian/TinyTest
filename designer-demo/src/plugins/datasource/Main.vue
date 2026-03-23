<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <plugin-panel
        :title="t('designer.datasource.title')"
        class="plugin-datasource"
        fixed-name="engine.plugins.customCollections"
        :fixed-panels="fixedPanels"
        :docs-url="docsUrl"
        :docs-content="docsContent"
        :is-show-docs-icon="true"
        @close="$emit('close')"
    >
        <template #header>
            <svg-button
                class="set-data-source"
                :tips="t('designer.datasource.globalSettings')"
                name="global-setting"
                @click="openGlobalDataHanderPanel"
            />
            <svg-button
                class="refresh-data-source"
                :tips="t('designer.datasource.refreshDataSource')"
                name="flow-refresh"
                @click="refreshDataSource"
            />
        </template>
        <template #content>
            <tiny-button
                class="add-data-source"
                @click="openDataSourceFormPanel()"
            >
                <svg-icon name="add" />{{
                    t('designer.datasource.addDataSource')
                }}
            </tiny-button>
            <data-source-list @edit="openDataSourceFormPanel" />
        </template>
    </plugin-panel>
    <data-source-form
        v-model="state.currentDataSource"
        :editable="state.editable"
        :active-tab-name="state.activeTabName"
        @render-remote-data="renderRemoteData"
        @active-tab="activeTabChange"
        @save="refreshDataSource"
    />
    <data-source-setting-remote-result
        v-if="isOpenRemoteResult"
        v-model="state.remoteFields"
        :remote-data="state.remoteData"
        @active-tab="activeTabChange"
    />
    <data-source-global-data-handler />
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
/* metaService: engine.plugins.collections.Main */
import { reactive, watch, provide, computed } from 'vue';
import { Button } from '@opentiny/vue';
import { SvgButton } from '@opentiny/tiny-engine-common';
import {
    useDataSource,
    useHelp,
    useLayout
} from '@opentiny/tiny-engine-meta-register';

import PluginPanel from '@/components/i18n-wrappers/PluginPanel/index.vue';

import { useDesignerI18n } from '../../services/i18nService';

import DataSourceList, {
    refresh as refreshDataSourceList,
    clearActive
} from './DataSourceList.vue';
import DataSourceForm, {
    open as openDataSourceForm,
    close as closeDataSourceForm
} from './DataSourceForm.vue';
import { close as closeRecordForm } from './DataSourceRecordForm.vue';
import DataSourceSettingRemoteResult, {
    close as closeRemoteResult,
    open as openRemoteResult,
    isOpen as isOpenRemoteResult
} from './DataSourceSettingRemoteResult.vue';
import { requestUpdateDataSource } from './js/http';
import DataSourceGlobalDataHandler, {
    open as openGlobalDataHander,
    close as closeGlobalDataHandler
} from './DataSourceGlobalDataHandler.vue';

export default {
    components: {
         
        TinyButton: Button,
         
        DataSourceList,
         
        DataSourceGlobalDataHandler,
         
        PluginPanel,
         
        DataSourceForm,
         
        SvgButton,
         
        DataSourceSettingRemoteResult
    },
    props: {
        fixedPanels: {
            type: Array as () => string[],
            default: () => []
        }
    },
    emits: ['close', 'fixPanel'],
     
    setup(props, { emit }) {
        const { t } = useDesignerI18n();

        const docsUrl = useHelp().getDocsUrl('datasource');
        const docsContent = computed(() =>
            t('designer.datasource.docsContent')
        );
        const state = reactive({
            editable: true,
            currentDataSource: {
                name: 'untitled',
                data: { type: 'remote', columns: [] }
            },
            remoteFields: [],
            remoteData: {},
            remoteResponData: {},
            activeTabName: 'remote'
        });

        const { PLUGIN_NAME, changeLeftFixedPanels } = useLayout();

        // 使用实际注册的插件 ID
        const pluginId = 'engine.plugins.customCollections';

        // 直接实现固定面板功能
        const handleFixPanel = () => {
            changeLeftFixedPanels(pluginId);
        };

        const panelState = reactive({
            emitEvent: (eventName: string, ...args: unknown[]) => {
                // 如果是 fixPanel 事件，直接调用 changeLeftFixedPanels
                if (eventName === 'fixPanel' || eventName === 'fix-panel') {
                    handleFixPanel();
                } else {
                    // 其他事件正常 emit
                     
                    (emit as (event: string, ...args: unknown[]) => void)(
                        eventName,
                        ...args
                    );
                }
            }
        });

        provide('panelState', panelState);

        const { dataSourceState, saveDataSource } = useDataSource();

        watch(
            () => state.remoteFields,
            value => {
                const {
                    id,
                    name,
                    data,
                    data: { columns, type }
                } = state.currentDataSource;
                state.currentDataSource = {
                    id,
                    name,
                    data: { ...data, type, columns: [...columns, ...value] }
                };
            }
        );

        const getRomoteReponseData = data => {
            state.remoteResponData = data;
        };

        const activeTabChange = name => {
            state.activeTabName = name;
        };

        const openDataSourceFormPanel = data => {
            if (!data || data?.data?.type === 'remote') {
                activeTabChange('remote');
            } else {
                activeTabChange('field');
            }

            // 先设置数据源状态
            state.editable = data !== undefined;
            dataSourceState.dataSource = data;
            if (data) {
                state.currentDataSource = data;
            } else {
                clearActive();
                state.currentDataSource = {
                    name: 'untitled',
                    data: { type: 'remote', columns: [] }
                };
            }

            // 先关闭其他面板
            closeRecordForm();
            closeGlobalDataHandler();
            closeRemoteResult();

            // 先打开面板，确保用户可以看到设置界面
            openDataSourceForm();

            // 然后尝试保存数据源（如果有未保存的更改）
            // 使用 setTimeout 确保面板已经打开后再处理保存
            setTimeout(() => {
                const savePromise = saveDataSource(requestUpdateDataSource);
                if (savePromise && typeof savePromise.then === 'function') {
                    savePromise.catch(() => {
                        // 保存失败时静默处理，不影响面板显示
                    });
                }
            }, 0);
        };

        const openGlobalDataHanderPanel = () => {
            openGlobalDataHander();
            closeDataSourceForm();
            closeRecordForm();
            closeRemoteResult();
        };

        const refreshDataSource = () => {
            refreshDataSourceList();
            closeRemoteResult();
            activeTabChange(state.activeTabName);
        };

        const renderRemoteData = remoteData => {
            state.remoteData = remoteData;
            openRemoteResult();
        };

        return {
             
            PLUGIN_NAME,
            state,
            open,
            openDataSourceFormPanel,
            getRomoteReponseData,
            refreshDataSource,
            openGlobalDataHanderPanel,
            docsUrl,
            docsContent,
            renderRemoteData,
            isOpenRemoteResult,
            openRemoteResult,
            activeTabChange,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.plugin-datasource {
    height: 100%;
}
.add-data-source {
    margin: 0 12px 12px 12px;
    width: calc(100% - 24px);
}
:deep(.help-box) {
    position: absolute;
    left: 48px;
    top: 12px;
}
:deep(.tiny-button) {
    border-radius: 4px;
    height: 24px;
    line-height: 24px;
}
</style>
