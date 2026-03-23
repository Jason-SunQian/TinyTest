<template>
    <tiny-form
        ref="serviceFormRef"
        class="create-form"
        label-position="top"
        label-width="15%"
        :model="state.serviceForm"
        :rules="rules"
        validate-type="text"
    >
        <tiny-form-item :label="t('designer.datasource.apiUrl')" prop="uri">
            <div class="textarea-warp">
                <tiny-select
                    v-model="state.serviceForm.method"
                    class="selectResType"
                    :placeholder="t('designer.common.pleaseSelect')"
                    :options="state.requestData"
                />
                <tiny-input
                    v-model="state.serviceForm.uri"
                    class="border-input"
                    resize="none"
                    :placeholder="t('designer.datasource.enterApiUrl')"
                />
            </div>
        </tiny-form-item>
        <tiny-form-item
            :label="t('designer.datasource.requestDescription')"
            prop="description"
        >
            <tiny-input
                v-model="state.serviceForm.description"
                type="textarea"
                :placeholder="t('designer.datasource.enterRequestDescription')"
            />
        </tiny-form-item>
    </tiny-form>
</template>

<script lang="ts">
/* metaService: engine.plugins.collections.DataSourceRemoteForm */
import { reactive, watchEffect, ref, computed } from 'vue';
import { Form, FormItem, Input, Select } from '@opentiny/vue';

import { useDesignerI18n } from '../../services/i18nService';

 
const serviceFormRef = ref(null);

export const getServiceForm = () => {
    return serviceFormRef.value;
};

export default {
    components: {
         
        TinyForm: Form,
         
        TinyFormItem: FormItem,
         
        TinyInput: Input,
         
        TinySelect: Select
    },
    props: {
        modelValue: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        }
    },
     
    setup(props) {
        const { t } = useDesignerI18n();

        const state = reactive({
            serviceForm: {},
            requestData: [
                { label: 'JSONP', value: 'JSONP' },
                { label: 'GET', value: 'GET' },
                { label: 'POST', value: 'POST' },
                { label: 'PUT', value: 'PUT' },
                { label: 'DELETE', value: 'DELETE' }
            ]
        });

        watchEffect(() => {
            state.serviceForm = props.modelValue;
            state.serviceForm.method =
                state.serviceForm.method || state.requestData[0].value;
        });

        const rules = computed(() => ({
            uri: [
                {
                    required: true,
                    message: t('designer.datasource.dataSourceNameRequired'),
                    trigger: ['blur']
                }
            ],
            method: {
                required: true,
                message: t('designer.datasource.required'),
                trigger: ['blur']
            }
        }));

        return {
            state,
            rules,
            serviceFormRef,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.create-form {
    .error-tip {
        color: var(--te-datasource-error-text-color);
        margin-top: 4px;
        font-size: 12px;
    }
    :deep(.tiny-form-item__label) {
        color: var(--te-datasource-label-text-color);
    }
    .textarea-warp {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .selectResType {
            width: 100px;
            border: none;
        }
        :deep(.tiny-input-suffix) {
            width: 100px;
            .tiny-input__inner {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }
        }
        :deep(.tiny-input-group__append) {
            border: none;
            background: var(--te-datasource-respones-bg-color);
        }
        :deep(.border-input) {
            input {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                border-left: none;
            }
        }
    }
    .tiny-button-group {
        width: 100%;
    }
    :deep(.tiny-group-item) {
        display: flex;
        width: 100%;
        button {
            position: relative;
            min-width: inherit;
            padding: 0 4px;
            margin: 0;
            width: 100%;
        }
        li {
            flex: 1 1 0;
            &:not(:last-child) {
                button:before {
                    content: '';
                    display: inline-block;
                    width: 1px;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    right: 0;
                    z-index: 99;
                }
            }
        }
    }

    :deep(.tiny-form-item__label) {
        height: 30px;
        line-height: 30px;
    }
}
</style>
