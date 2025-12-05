<template>
    <div class="right-item">
        <tiny-form
            ref="dataSourceNameRef"
            :rules="rules"
            label-position="top"
            label-width="55%"
            validate-type="text"
            :model="state.dataSource"
        >
            <tiny-form-item
                prop="name"
                :label="t('designer.datasource.dataSourceName')"
            >
                <tiny-input
                    v-model="state.dataSource.name"
                    :placeholder="t('designer.datasource.enterDataSourceName')"
                    @input="modifyName"
                />
            </tiny-form-item>
        </tiny-form>
    </div>
</template>

<script lang="ts">
/* metaService: engine.plugins.collections.DataSourceName */
import { reactive, watchEffect, ref, computed } from 'vue';
import { Form, FormItem, Input } from '@opentiny/vue';

import { useDesignerI18n } from '../../services/i18nService';

// eslint-disable-next-line vue/require-typed-ref
const dataSourceNameRef = ref(null);

export const getDataSourceName = () => {
    return dataSourceNameRef.value;
};

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyForm: Form,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyFormItem: FormItem,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyInput: Input
    },
    props: {
        modelValue: {
            type: String,
            default: ''
        }
    },
    emits: ['update:modelValue'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { t } = useDesignerI18n();

        const state = reactive({
            dataSource: {
                name: null
            }
        });

        const rules = computed(() => ({
            name: [
                {
                    required: true,
                    message: t('designer.datasource.dataSourceNameRequired'),
                    trigger: 'change'
                },
                {
                    type: 'string',
                    message: t('designer.datasource.dataSourceNameRule'),
                    pattern: /^[a-zA-Z][_a-zA-Z0-9]+$/,
                    trigger: 'change'
                }
            ]
        }));

        watchEffect(() => {
            state.dataSource.name = props.modelValue || '';
        });

        const modifyName = e => {
            emit('update:modelValue', e.target.value);
        };

        return {
            state,
            rules,
            modifyName,
            dataSourceNameRef,
            t
        };
    }
};
</script>
