<template>
  <plugin-panel
    :title="t('designer.bridge.title')"
    class="plugin-bridge"
    :fixed-name="PLUGIN_NAME.Bridge"
    :fixedPanels="fixedPanels"
    :docsContent="t('designer.bridge.docs')"
    :isShowDocsIcon="true"
    @close="closePanel"
  >
    <template #header>
      <svg-button name="add-utils" placement="left" :tips="tips" @click="addResource('npm')"></svg-button>
    </template>
    <template #content>
      <bridge-manage ref="utilsRef" :name="RESOURCE_TYPE.Util" @open="openBridgePanel"></bridge-manage>
      <bridge-setting @refresh="refreshList"></bridge-setting>
    </template>
  </plugin-panel>
  
</template>

<script lang="ts">
/* metaService: engine.plugins.bridge.custom.Main */
import { ref, reactive, computed, provide } from 'vue'
import { PluginPanel, SvgButton } from '@opentiny/tiny-engine-common'
import { useLayout } from '@opentiny/tiny-engine-meta-register'
import { RESOURCE_TYPE } from './js/resource'
import BridgeManage from './BridgeManage.vue'
import BridgeSetting, { openPanel, closePanel } from './BridgeSetting.vue'
import { RESOURCE_TIP_I18N } from './js/resource'
import { useDesignerI18n } from '../../services/i18nService'

export default {
  components: {
    PluginPanel,
    SvgButton,
    BridgeManage,
    BridgeSetting
  },
  props: {
    fixedPanels: {
      type: Array
    }
  },
  setup(props, { emit }) {
    const { t } = useDesignerI18n()
    const activedName = ref(RESOURCE_TYPE.Util)
    const utilsRef = ref(null)
    const tips = computed(() => RESOURCE_TIP_I18N(t)[activedName.value])

    const { PLUGIN_NAME } = useLayout()

    const panelState = reactive({
      emitEvent: emit
    })
    provide('panelState', panelState)

    const openBridgePanel = () => openPanel()
    const refreshList = (type) => utilsRef.value.refresh(type)
    const addResource = (type) => utilsRef.value.add(type)

    return {
      t,
      PLUGIN_NAME,
      addResource,
      RESOURCE_TYPE,
      activedName,
      openBridgePanel,
      closePanel,
      refreshList,
      utilsRef,
      tips
    }
  }
}
</script>

<style lang="less" scoped>
::deep(.tiny-button) {
  border-radius: 4px;
  height: 24px;
  line-height: 24px;
}
</style>


