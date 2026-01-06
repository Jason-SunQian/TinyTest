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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PluginPanel,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        SvgButton,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        BridgeManage,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        BridgeSetting
    },
    props: {
        fixedPanels: {
            type: Array as () => string[],
            default: () => []
        }
    },
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const activedName = ref(RESOURCE_TYPE.Util);
        // eslint-disable-next-line vue/require-typed-ref
        const utilsRef = ref(null);
        // eslint-disable-next-line new-cap
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
                    emit(eventName as any, ...args);
                }
            }
        });
        provide('panelState', panelState);

        const openBridgePanel = () => openPanel();
        const refreshList = type => utilsRef.value.refresh(type);
        const addResource = type => utilsRef.value.add(type);

        return {
            t,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            PLUGIN_NAME,
            addResource,
            // eslint-disable-next-line @typescript-eslint/naming-convention
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
