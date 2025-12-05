<template>
    <tiny-alert
        v-show="showVideo"
        type="simple"
        :description="t('designer.block.propertyGuideDescription')"
        class="block-alert"
    />
    <div class="property-container">
        <block-property-list v-if="!isEdit" />
        <block-property-form v-else />
    </div>
    <block-guide
        v-show="showVideo"
        :title="t('designer.block.propertyGuideTitle')"
    >
        <template #video>
            <slot name="video" />
        </template>
    </block-guide>
</template>

<script lang="ts">
/* metaService: engine.plugins.blockmanage.BlockProperty */
import { computed, inject } from 'vue';
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n';
import { Alert } from '@opentiny/vue';

import BlockGuide from './BlockGuide.vue';
import BlockPropertyList from './BlockPropertyList.vue';
import BlockPropertyForm from './BlockPropertyForm.vue';
import { getEditProperty } from './js/blockSetting';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        BlockGuide,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        BlockPropertyList,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        BlockPropertyForm,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyAlert: Alert
    },
    props: {
        showVideo: {
            type: Boolean,
            default: false
        }
    },
    // eslint-disable-next-line vue/component-api-style
    setup() {
        // 获取国际化 t 函数
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const i18n: any = inject(I18nInjectionKey);
        const t = i18n?.global?.t || ((key: string) => key);

        return {
            isEdit: computed(() => Boolean(getEditProperty())),
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.block-alert {
    color: var(--te-block-alert-text-color);
    height: 28px;
    padding: 6px;
    border: 0;
    font-size: 11px;
    margin-bottom: 12px;
    :deep(.tiny-alert__close) {
        top: 7px;
    }
}
</style>
