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
         
        MainImpl
    },
     
    setup() {
         
        const inst: any = (window as any).lowcodeI18n;
        if (inst) {
             
            provide(I18nInjectionKey as any, inst);
        } else {
            // 兜底：提供仅含 t 的最小实现，避免出现原始 key
             
            provide(I18nInjectionKey as any, { global: { t: designerT } });
        }
        return {};
    }
});
</script>
