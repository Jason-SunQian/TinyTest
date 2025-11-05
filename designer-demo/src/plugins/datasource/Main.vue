<template>
  <plugin-panel
    :title="t('designer.datasource.title')"
    class="plugin-datasource"
    :fixed-name="PLUGIN_NAME.Collections"
    :fixedPanels="fixedPanels"
    :docsUrl="docsUrl"
    :docsContent="docsContent"
    :isShowDocsIcon="true"
    @close="$emit('close')"
  >
    <template #header>
      <svg-button
        class="set-data-source"
        :tips="t('designer.datasource.globalSettings')"
        name="global-setting"
        @click="openGlobalDataHanderPanel"
      ></svg-button>
      <svg-button
        class="refresh-data-source"
        :tips="t('designer.datasource.refreshDataSource')"
        name="flow-refresh"
        @click="refreshDataSource"
      ></svg-button>
    </template>
    <template #content>
      <tiny-button class="add-data-source" @click="openDataSourceFormPanel()">
        <svg-icon name="add"></svg-icon>{{ t('designer.datasource.addDataSource') }}
      </tiny-button>
      <data-source-list @edit="openDataSourceFormPanel"></data-source-list>
    </template>
  </plugin-panel>
  <data-source-form
    v-model="state.currentDataSource"
    :editable="state.editable"
    :activeTabName="state.activeTabName"
    @renderRemoteData="renderRemoteData"
    @activeTab="activeTabChange"
    @save="refreshDataSource"
  ></data-source-form>
  <data-source-setting-remote-result
    v-if="isOpenRemoteResult"
    :remoteData="state.remoteData"
    @activeTab="activeTabChange"
    v-model="state.remoteFields"
  >
  </data-source-setting-remote-result>
  <data-source-global-data-handler></data-source-global-data-handler>
</template>

<script lang="ts">
/* metaService: engine.plugins.collections.Main */
import { reactive, watch, provide, computed } from 'vue'
import { Button } from '@opentiny/vue'
import DataSourceList, { refresh as refreshDataSourceList, clearActive } from './DataSourceList.vue'
import { SvgButton } from '@opentiny/tiny-engine-common'
import PluginPanel from '@/components/i18n-wrappers/PluginPanel/index.vue'
import DataSourceForm, { open as openDataSourceForm, close as closeDataSourceForm } from './DataSourceForm.vue'
import { close as closeRecordForm } from './DataSourceRecordForm.vue'
import DataSourceSettingRemoteResult, {
  close as closeRemoteResult,
  open as openRemoteResult,
  isOpen as isOpenRemoteResult
} from './DataSourceSettingRemoteResult.vue'
import { useDataSource, useHelp, useLayout } from '@opentiny/tiny-engine-meta-register'
import { requestUpdateDataSource } from './js/http'
import DataSourceGlobalDataHandler, {
  open as openGlobalDataHander,
  close as closeGlobalDataHandler
} from './DataSourceGlobalDataHandler.vue'
import { useDesignerI18n } from '../../services/i18nService'

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
      type: Array
    }
  },
  setup(props, { emit }) {
    const { t } = useDesignerI18n()
    
    const docsUrl = useHelp().getDocsUrl('datasource')
    const docsContent = computed(() => t('designer.datasource.docsContent'))
    const state = reactive({
      editable: true,
      currentDataSource: { name: 'untitled', data: { type: 'remote', columns: [] } },
      remoteFields: [],
      remoteData: {},
      remoteResponData: {},
      activeTabName: 'remote'
    })

    const { PLUGIN_NAME } = useLayout()

    const panelState = reactive({
      emitEvent: emit
    })

    provide('panelState', panelState)

    const { dataSourceState, saveDataSource } = useDataSource()

    watch(
      () => state.remoteFields,
      (value) => {
        const {
          id,
          name,
          data,
          data: { columns, type }
        } = state.currentDataSource
        state.currentDataSource = { id, name, data: { ...data, type, columns: [...columns, ...value] } }
      }
    )

    const getRomoteReponseData = (data) => {
      state.remoteResponData = data
    }

    const activeTabChange = (name) => {
      state.activeTabName = name
    }

    const openDataSourceFormPanel = (data) => {
      if (!data || data?.data?.type === 'remote') {
        activeTabChange('remote')
      } else {
        activeTabChange('field')
      }
      saveDataSource(requestUpdateDataSource).then(() => {
        state.editable = data !== undefined
        dataSourceState.dataSource = data
        if (data) {
          state.currentDataSource = data
        } else {
          clearActive()
          state.currentDataSource = { name: 'untitled', data: { type: 'remote', columns: [] } }
        }
        closeRecordForm()
        openDataSourceForm()
        closeGlobalDataHandler()
        closeRemoteResult()
      })
    }

    const openGlobalDataHanderPanel = () => {
      openGlobalDataHander()
      closeDataSourceForm()
      closeRecordForm()
      closeRemoteResult()
    }

    const refreshDataSource = () => {
      refreshDataSourceList()
      closeRemoteResult()
      activeTabChange(state.activeTabName)
    }

    const renderRemoteData = (remoteData) => {
      state.remoteData = remoteData
      openRemoteResult()
    }

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
    }
  }
}
</script>
<style lang="less" scoped>
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
