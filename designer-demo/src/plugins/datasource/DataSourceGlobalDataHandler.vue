<template>
  <plugin-setting
    v-if="isOpen"
    :title="t('designer.datasource.globalSettings')"
    class="plugin-datasource global-data-handler"
    :align="align"
    :fixed-name="PLUGIN_NAME.Collections"
    @cancel="close"
    @save="saveGlobalDataHandle"
  >
    <template #header>
      <button-group>
        <tiny-button type="info" @click="saveGlobalDataHandle">{{ t('designer.common.save') }}</tiny-button>
        <svg-button name="close" @click="close"></svg-button>
      </button-group>
    </template>
    <template #content>
      <tiny-collapse v-model="activeNames">
        <tiny-collapse-item :title="t('designer.datasource.willFetchHandler')" name="willFetch">
          <data-handler-editor v-model="state.willFetchValue"></data-handler-editor>
        </tiny-collapse-item>
        <tiny-collapse-item :title="t('designer.datasource.dataHandler')" name="dataHandler">
          <data-handler-editor v-model="state.dataHandlerValue"></data-handler-editor>
        </tiny-collapse-item>
        <tiny-collapse-item :title="t('designer.datasource.errorHandler')" name="errorHandler">
          <data-handler-editor v-model="state.errorHandlerValue"></data-handler-editor>
        </tiny-collapse-item>
      </tiny-collapse>
    </template>
  </plugin-setting>
</template>

<script lang="ts">
/* metaService: engine.plugins.collections.DataSourceGlobalDataHandler */
import DataHandlerEditor from './RemoteDataAdapterForm.vue'
import { watch, ref, nextTick, reactive, computed } from 'vue'
import { requestGlobalDataHandler } from './js/http'
import { useLayout, useModal, useResource, getMetaApi, META_SERVICE } from '@opentiny/tiny-engine-meta-register'
import { PluginSetting, ButtonGroup, SvgButton } from '@opentiny/tiny-engine-common'
import { Collapse, CollapseItem, Button } from '@opentiny/vue'
import { constants } from '@opentiny/tiny-engine-utils'
import { useDesignerI18n } from '../../services/i18nService'

const { DEFAULT_INTERCEPTOR } = constants
const isOpen = ref(false)

export const open = () => {
  isOpen.value = true
}

export const close = () => {
  isOpen.value = false
}

export default {
  components: {
    DataHandlerEditor,
    PluginSetting,
    TinyCollapse: Collapse,
    TinyCollapseItem: CollapseItem,
    ButtonGroup,
    SvgButton,
    TinyButton: Button
  },
  setup() {
    const { t } = useDesignerI18n()
    const { confirm } = useModal()

    const { PLUGIN_NAME, getPluginByLayout } = useLayout()
    const align = computed(() => getPluginByLayout(PLUGIN_NAME.Collections))

    const state = reactive({
      dataHandlerValue: useResource().appSchemaState?.dataHandler?.value,
      willFetchValue: useResource().appSchemaState.willFetch?.value,
      errorHandlerValue: useResource().appSchemaState?.errorHandler?.value
    })

    const saveGlobalDataHandle = () => {
      const id = getMetaApi(META_SERVICE.GlobalService).getBaseInfo().id

      const handler = {
        dataHandler: { type: 'JSFunction', value: state.dataHandlerValue || DEFAULT_INTERCEPTOR.dataHandler.value },
        willFetch: { type: 'JSFunction', value: state.willFetchValue || DEFAULT_INTERCEPTOR.willFetch.value },
        errorHandler: { type: 'JSFunction', value: state.errorHandlerValue || DEFAULT_INTERCEPTOR.errorHandler.value }
      }

      requestGlobalDataHandler(id, { data_source_global: handler }).then((data) => {
        if (data) {
          useResource().appSchemaState.dataHandler = { type: 'JSFunction', value: state.dataHandlerValue }
          useResource().appSchemaState.willFetch = { type: 'JSFunction', value: state.willFetchValue }
          useResource().appSchemaState.errorHandler = { type: 'JSFunction', value: state.errorHandlerValue }
          confirm({
            title: t('designer.datasource.tip'),
            message: t('designer.datasource.globalHandlerSetSuccess')
          })
        }
      })
    }

    watch(
      () => isOpen.value,
      (value) => {
        nextTick(() => {
          if (value) {
            window.dispatchEvent(new Event('resize'))
          }
        })
      }
    )

    return {
      align,
      PLUGIN_NAME,
      isOpen,
      close,
      saveGlobalDataHandle,
      state,
      t
    }
  }
}
</script>
<style lang="less" scoped>
.global-data-handler {
  :deep(.plugin-setting) {
    .monaco-editor {
      height: calc(100% - 54px);
    }
    .plugin-setting-content {
      padding: 0;
    }
    .tiny-collapse-item__wrap {
      padding: 0 12px;
    }
    // 隐藏默认的保存按钮
    .plugin-save {
      display: none !important;
    }
  }
}
.tiny-collapse {
  height: 100%;
  display: flex;
  flex-direction: column;
  .tiny-collapse-item:first-child {
    border-top: 0;
  }
  :deep(.tiny-collapse-item__content) {
    padding: 0 0 12px;
  }
}
</style>
