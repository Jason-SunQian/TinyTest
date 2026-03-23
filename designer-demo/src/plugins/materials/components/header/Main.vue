<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <svg-button
        class="item icon-sidebar"
        :name="panelFixed ? 'fixed-solid' : 'fixed'"
        :tips="
            panelFixed
                ? t('designer.common.unfixPanel')
                : t('designer.common.fixPanel')
        "
        @click="$emit('fix-panel', PLUGIN_NAME.Materials)"
    />
</template>

<script lang="ts">
import { computed } from 'vue';
import { SvgButton } from '@opentiny/tiny-engine-common';
import { useLayout } from '@opentiny/tiny-engine-meta-register';

import { useDesignerI18n } from '@/services/i18nService';

export default {
    components: {
         
        SvgButton
    },
    props: {
        fixedPanels: {
            type: Array as () => string[],
            default: () => []
        }
    },
    emits: ['fix-panel'],
     
    setup(props) {
        // 获取国际化 t 函数
        const { t } = useDesignerI18n();

         
        const { PLUGIN_NAME } = useLayout();
        const panelFixed = computed(() =>
            props.fixedPanels?.includes(PLUGIN_NAME.Materials)
        );

        return {
             
            PLUGIN_NAME,
            panelFixed,
            t
        };
    }
};
</script>
