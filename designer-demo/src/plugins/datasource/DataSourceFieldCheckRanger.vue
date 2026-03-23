<!-- 录入数据的字符范围 -->
<template>
    <div class="collection-field-num">
        <div class="collection-field-item">
            <tiny-form-item
                prop="format.min"
                :label="
                    type === 'string'
                        ? t('designer.datasource.minInputChars')
                        : t('designer.datasource.minValue')
                "
                label-width="300px"
            >
                <tiny-numeric
                    v-model="formData.format.min"
                    controls-position="right"
                />
            </tiny-form-item>
        </div>
        <div class="collection-field-item">
            <tiny-form-item
                prop="format.max"
                :label="
                    type === 'string'
                        ? t('designer.datasource.maxInputChars')
                        : t('designer.datasource.maxValue')
                "
                label-width="300px"
            >
                <tiny-numeric
                    v-model="formData.format.max"
                    controls-position="right"
                />
            </tiny-form-item>
        </div>
    </div>
</template>

<script lang="ts">
/* metaService: engine.plugins.collections.DataSourceFieldCheckRanger */
import { inject } from 'vue';
import { Numeric, FormItem } from '@opentiny/vue';

import { useDesignerI18n } from '../../services/i18nService';

import { formDataInjectionSymbols } from './DataSourceFieldForm.vue';
export default {
    components: {
         
        TinyNumeric: Numeric,
         
        TinyFormItem: FormItem
    },
    props: {
        type: {
            type: String,
            default: 'string'
        }
    },
     
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
    width: 50%;
    .field-item-tip {
        padding-left: 5px;
        color: var(--te-datasource-description-text-color-error);
        padding-right: 5px;
        padding-top: 5px;
        font-size: 12px;
    }
}
.collection-field-item:first-child {
    margin-right: 12px;
}
.collection-field-item-label {
    color: var(--te-datasource-dialog-font-text-color);
}
.collection-field-num {
    display: flex;
    justify-content: space-between;
}
</style>
