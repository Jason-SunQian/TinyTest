<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <plugin-panel
        :title="t('designer.bridge.title')"
        class="plugin-bridge"
        fixed-name="engine.plugins.customBridge"
        :fixed-panels="fixedPanels"
        :docs-content="docsContent"
        :is-show-docs-icon="true"
        @close="closePanel"
    >
        <template #header>
            <svg-button
                name="add-utils"
                placement="left"
                :tips="tips"
                @click="addResource('npm')"
            />
        </template>
        <template #content>
            <bridge-manage
                ref="utilsRef"
                :name="RESOURCE_TYPE.Util"
                @open="openBridgePanel"
            />
            <bridge-setting @refresh="refreshList" />
        </template>
    </plugin-panel>
</template>

<script lang="ts">
/* metaService: engine.plugins.bridge.custom.Main */
import { ref, reactive, computed, provide } from 'vue';
import { SvgButton } from '@opentiny/tiny-engine-common';
import { useLayout } from '@opentiny/tiny-engine-meta-register';

import PluginPanel from '@/components/i18n-wrappers/PluginPanel/index.vue';

import { useDesignerI18n } from '../../services/i18nService';

import { RESOURCE_TYPE, RESOURCE_TIP_I18N } from './js/resource';
import BridgeManage from './BridgeManage.vue';
import BridgeSetting, { openPanel, closePanel } from './BridgeSetting.vue';

export default {
    components: {
         
        PluginPanel,
         
        SvgButton,
         
        BridgeManage,
         
        BridgeSetting
    },
    props: {
        fixedPanels: {
            type: Array as () => string[],
            default: () => []
        }
    },
     
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const activedName = ref(RESOURCE_TYPE.Util);
         
        const utilsRef = ref(null);
         
        const tips = computed(() => RESOURCE_TIP_I18N(t)[activedName.value]);
        const docsContent = computed(() => t('designer.bridge.docs'));

        const { PLUGIN_NAME, changeLeftFixedPanels } = useLayout();

        // 使用实际注册的插件 ID
        const pluginId = 'engine.plugins.customBridge';

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

        const openBridgePanel = () => openPanel();
        // refreshList 接收的 type 应该是 category ('utils' 或 'bridge')
        // BridgeManage 的 refresh 方法期望接收 name prop，即 RESOURCE_TYPE.Util ('utils') 或 RESOURCE_TYPE.Bridge ('bridge')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const refreshList = category => {
            // category 已经是 'utils' 或 'bridge'，直接传递给 refresh
            // 因为 BridgeManage 的 name prop 就是 RESOURCE_TYPE.Util ('utils')
            if (utilsRef.value) {
                utilsRef.value.refresh(RESOURCE_TYPE.Util);
            }
        };
        const addResource = type => utilsRef.value.add(type);

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
            tips,
            docsContent
        };
    }
};
</script>

<style lang="scss" scoped>
::deep(.tiny-button) {
    border-radius: 4px;
    height: 24px;
    line-height: 24px;
}
</style>
