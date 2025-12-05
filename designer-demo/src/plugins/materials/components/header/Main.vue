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
import { computed, inject } from 'vue';
import { SvgButton } from '@opentiny/tiny-engine-common';
import { useLayout } from '@opentiny/tiny-engine-meta-register';
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        SvgButton
    },
    props: {
        fixedPanels: {
            type: Array as () => string[],
            default: () => []
        }
    },
    emits: ['fix-panel'],
    // eslint-disable-next-line vue/component-api-style
    setup(props) {
        // 获取国际化 t 函数
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const i18n: any = inject(I18nInjectionKey);
        const t = i18n?.global?.t || ((key: string) => key);

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { PLUGIN_NAME } = useLayout();
        const panelFixed = computed(() =>
            props.fixedPanels?.includes(PLUGIN_NAME.Materials)
        );

        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            PLUGIN_NAME,
            panelFixed,
            t
        };
    }
};
</script>
