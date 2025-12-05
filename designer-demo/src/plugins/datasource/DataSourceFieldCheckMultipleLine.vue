<!-- eslint-disable vue/no-root-v-if -->
<template>
    <tiny-form-item
        v-if="showTimeSelector"
        prop="format.text"
        :label="t('designer.datasource.includeTimeSelector')"
    >
        <div class="collection-field-item">
            <tiny-radio v-model="formData.format.text" label="text">{{
                t('designer.datasource.singleLineText')
            }}</tiny-radio>
        </div>
        <div class="collection-field-item">
            <tiny-radio v-model="formData.format.text" label="textarea">{{
                t('designer.datasource.multiLineText')
            }}</tiny-radio>
        </div>
    </tiny-form-item>
</template>

<script lang="ts">
/* metaService: engine.plugins.collections.DataSourceFieldCheckMultipleLine */
import { inject } from 'vue';
import { Radio, FormItem } from '@opentiny/vue';

import { useDesignerI18n } from '@/services/i18nService';

import { formDataInjectionSymbols } from './DataSourceFieldForm.vue';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyRadio: Radio,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyFormItem: FormItem
    },
    // eslint-disable-next-line vue/component-api-style
    setup() {
        const { t } = useDesignerI18n();
        const formData = inject(formDataInjectionSymbols);

        return {
            formData,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.collection-field-item {
    .tiny-radio {
        color: var(--te-datasource-dialog-font-text-color);
    }
}
</style>
