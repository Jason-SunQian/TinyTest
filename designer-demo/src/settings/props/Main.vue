<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <plugin-panel
        :title="t('designer.settings.props.title')"
        :fixed-panels="fixedPanels"
        :fixed-name="PLUGIN_NAME.Props"
        :show-bottom-border="showEmptyTips"
        @close="$emit('close')"
    >
        <template #content>
            <config-render :data="properties">
                <template #prefix="{ data }">
                    <block-link-field v-if="isBlock" :data="data" />
                </template>
            </config-render>
            <block-description v-if="isBlock" class="block-description" />
            <empty :show-empty-tips="showEmptyTips" />
        </template>
    </plugin-panel>
</template>

<!-- eslint-disable vue/block-lang, vue/require-explicit-emits, vue/component-api-style, @typescript-eslint/naming-convention, vue/require-default-prop, vue/require-typed-object-prop -->
<script lang="ts">
/* metaService: engine.setting.props.Main */
import { computed, watchEffect, ref, reactive, provide } from 'vue';
import {
    BlockDescription,
    BlockLinkField,
    PluginPanel
} from '@opentiny/tiny-engine-common';
import { ConfigRender } from '@/components/i18n-wrappers';
import {
    useCanvas,
    useProperty,
    useLayout
} from '@opentiny/tiny-engine-meta-register';

import { useDesignerI18n } from '@/services/i18nService';

import Empty from './components/Empty.vue';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ConfigRender,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        BlockLinkField,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        BlockDescription,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Empty,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PluginPanel
    },
    props: {
        // eslint-disable-next-line vue/require-default-prop, vue/require-typed-object-prop
        fixedPanels: {
            type: Array,
            default: undefined
        }
    },
    emits: ['close'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const { pageState } = useCanvas();
        const { properties } = useProperty().getProperty({ pageState });
        const showEmptyTips = ref(false);

        const { PLUGIN_NAME } = useLayout();

        const panelState = reactive({
            emitEvent: emit
        });
        provide('panelState', panelState);

        const isBlock = computed(() => pageState.isBlock);

        watchEffect(() => {
            showEmptyTips.value = !properties.value?.length;
        });

        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            PLUGIN_NAME,
            isBlock,
            properties,
            showEmptyTips,
            t
        };
    }
};
</script>

<!-- eslint-disable-next-line vue/block-lang -->
<style lang="less" scoped>
.block-description {
    margin: 12px;
}
</style>
