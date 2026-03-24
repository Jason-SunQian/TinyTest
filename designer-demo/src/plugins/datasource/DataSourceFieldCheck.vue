<template>
    <data-source-field-check-multiple-line v-if="showMultiple" />

    <data-source-field-check-ranger v-if="showRanger" :type="type" />

    <tiny-form-item v-if="showTimeSelector" prop="format.dateTime">
        <div class="collection-field-item">
            <tiny-checkbox
                v-model="formData.format.dateTime"
                @change="change"
                >{{
                    t('designer.datasource.includeTimeSelector')
                }}</tiny-checkbox>
        </div>
    </tiny-form-item>

    <tiny-form-item v-if="showRequire" prop="format.required">
        <div class="collection-field-item">
            <tiny-checkbox
                v-model="formData.format.required"
                @change="change"
                >{{ t('designer.datasource.fieldRequired') }}</tiny-checkbox>
        </div>
    </tiny-form-item>
</template>

<script lang="ts">
/* metaService: engine.plugins.collections.DataSourceFieldCheck */
import { computed, inject } from 'vue';
import { FormItem, Checkbox } from '@opentiny/vue';

import { useDesignerI18n } from '@/services/i18nService';

import DataSourceFieldCheckMultipleLine from './DataSourceFieldCheckMultipleLine.vue';
import DataSourceFieldCheckRanger from './DataSourceFieldCheckRanger.vue';
import { formDataInjectionSymbols } from './DataSourceFieldForm.vue';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSourceFieldCheckMultipleLine,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSourceFieldCheckRanger,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyCheckbox: Checkbox,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyFormItem: FormItem
    },
    props: {
        type: {
            type: String,
            default: 'string'
        }
    },
    // eslint-disable-next-line vue/component-api-style
    setup(props) {
        const { t } = useDesignerI18n();
        const formData = inject(formDataInjectionSymbols);

        /** 当前不同字段显示的配置规则， type取值：string、date、number、link、switch、slider
         *
         * string： 单行/多行、最大输入字符/最小输入字符、该字段是否必选
         * date: 是否包含时间选择器、该字段是否必选
         * number：最大值/最小值、格式化类型、是否容许负数、该字段是否必选
         * link: 该字段是否必选
         * switch、slider： 无
         */
        return {
            showTimeSelector: computed(() => props.type === 'date'),
            showRequire: computed(() =>
                ['string', 'date', 'number', 'link'].includes(props.type)
            ),
            showMultiple: computed(() => props.type === 'string'),
            showRanger: computed(() =>
                ['string', 'number'].includes(props.type)
            ),
            formData,
            t
        };
    }
};
</script>

<style scoped lang="scss">
.collection-field-item {
    .tiny-checkbox {
        color: var(--te-datasource-dialog-font-text-color);
    }
}
</style>
