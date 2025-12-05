<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <plugin-panel
        :title="t('designer.settings.events.panelTitle')"
        :fixed-panels="fixedPanels"
        :fixed-name="PLUGIN_NAME.Event"
        :header-margin-bottom="0"
        @close="$emit('close')"
    >
        <template #content>
            <tiny-collapse v-model="activeNames">
                <tiny-collapse-item
                    :title="t('designer.settings.events.sections.binding')"
                    name="bindEvent"
                >
                    <bind-events />
                </tiny-collapse-item>
                <tiny-collapse-item
                    :title="t('designer.settings.events.sections.advanced')"
                    name="advancedConfig"
                >
                    <advance-config />
                </tiny-collapse-item>
            </tiny-collapse>
        </template>
    </plugin-panel>
</template>

<!-- eslint-disable vue/block-lang, vue/require-default-prop, vue/define-props-declaration, vue/require-typed-object-prop, vue/define-emits-declaration -->
<script setup lang="ts">
/* metaService: engine.setting.event.Main */
import { ref, reactive, provide, defineProps, defineEmits } from 'vue';
import {
    Collapse as TinyCollapse,
    CollapseItem as TinyCollapseItem
} from '@opentiny/vue';
import { PluginPanel } from '@opentiny/tiny-engine-common';
import { useLayout } from '@opentiny/tiny-engine-meta-register';

import { useDesignerI18n } from '@/services/i18nService';

import AdvanceConfig from './components/AdvanceConfig.vue';
import BindEvents from './components/BindEvents.vue';

defineProps({
    // eslint-disable-next-line vue/require-default-prop
    fixedPanels: {
        type: Array,
        default: undefined
    }
});
const emit = defineEmits(['close']);
const activeNames = ref(['bindEvent', 'advancedConfig']);
const { PLUGIN_NAME } = useLayout();
const { t } = useDesignerI18n();

const panelState = reactive({
    emitEvent: emit
});

provide('panelState', panelState);
</script>
