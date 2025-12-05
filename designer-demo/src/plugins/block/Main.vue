<template>
    <MainImpl v-bind="$attrs" />
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue';
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n';

import { t as designerT } from '../../services/i18nService';

import MainImpl from './MainImpl.vue';

export default defineComponent({
    name: 'custom-block-manage',
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        MainImpl
    },
    // eslint-disable-next-line vue/component-api-style
    setup() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const inst: any = (window as any).lowcodeI18n;
        if (inst) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            provide(I18nInjectionKey as any, inst);
        } else {
            // 兜底：提供仅含 t 的最小实现，避免出现原始 key
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            provide(I18nInjectionKey as any, { global: { t: designerT } });
        }
        return {};
    }
});
</script>
