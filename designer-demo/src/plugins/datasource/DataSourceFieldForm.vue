<!-- eslint-disable vue/no-root-v-if -->
<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <div v-if="state.isOpen" :id="defaultStyle" class="step-select-second">
        <div class="field-row">
            <slot>
                <div class="icon-and-text">
                    <div class="field-cell-type">
                        <svg-icon :name="field.icon" class="type-icon" />
                    </div>
                    <div class="field-cell-name">
                        <span>{{ t('designer.datasource.newField') }}</span>
                    </div>
                </div>
            </slot>
            <span v-if="editable">
                <button-group>
                    <tiny-button plain @click.stop="handleCancel">{{
                        t('designer.common.cancel')
                    }}</tiny-button>
                    <tiny-button type="primary" @click.stop="saveField">{{
                        t('designer.common.confirm')
                    }}</tiny-button>
                </button-group>
            </span>
        </div>
        <div v-if="editable">
            <tiny-form
                ref="form"
                label-position="top"
                :rules="rules"
                :model="state.field"
                validate-type="text"
            >
                <tiny-form-item
                    class="title-content"
                    prop="title"
                    :label="t('designer.datasource.fieldName')"
                    label-width="150px"
                >
                    <i18n-input
                        v-model="state.field.title"
                        :placeholder="t('designer.common.pleaseInputContent')"
                    />
                </tiny-form-item>
                <tiny-form-item
                    class="name-content"
                    prop="name"
                    :label="t('designer.datasource.fieldId')"
                    label-width="150px"
                >
                    <tiny-input
                        v-model="state.field.name"
                        class="filedName"
                        :placeholder="t('designer.datasource.fieldUniqueId')"
                    />
                </tiny-form-item>
                <!-- 不同的字段类型对应不同的校验规则 -->
                <data-source-field-check :type="state.field.type" />
            </tiny-form>
        </div>
    </div>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
/* metaService: engine.plugins.collections.DataSourceFieldForm */
import { reactive, watchEffect, ref, provide, computed } from 'vue';
import { Button, Input, FormItem, Form } from '@opentiny/vue';
import { ButtonGroup } from '@opentiny/tiny-engine-common';
import { I18nInput } from '@/components/i18n-wrappers';

import { useDesignerI18n } from '../../services/i18nService';

import DataSourceFieldCheck from './DataSourceFieldCheck.vue';

export const formDataInjectionSymbols = Symbol('DataSourceFieldFormData');

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ButtonGroup,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyButton: Button,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyInput: Input,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyForm: Form,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyFormItem: FormItem,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        I18nInput,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSourceFieldCheck
    },
    props: {
        field: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        },
        editable: {
            type: Boolean,
            default: false
        },
        isRow: {
            type: Boolean,
            default: false
        },
        isOpen: {
            type: Boolean,
            default: true
        },
        modelValue: {
            type: Array as () => unknown[],
            default: () => []
        }
    },
    emits: ['save', 'cancel'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { t } = useDesignerI18n();

        const state = reactive({
            field: null,
            isOpen: null
        });

        // eslint-disable-next-line vue/require-typed-ref
        const form = ref(null);

        watchEffect(() => {
            if (props.field) {
                state.field = { ...props.field };
            }
        });

        watchEffect(() => {
            state.isOpen = props.isOpen === undefined ? true : props.isOpen;
        });

        const defaultStyle = computed(() =>
            props.isRow && !props.editable ? 'default-item' : ''
        );

        const open = () => {
            state.isOpen = true;
        };

        const close = () => {
            state.isOpen = false;
        };

        const handleCancel = () => {
            emit('cancel');
        };
        const uniqueName = () => {
            return props.modelValue.some(
                item => item.name === state.field.name
            );
        };
        const saveField = () => {
            form.value.validate(valid => {
                if (valid) {
                    state.field.field = state.field.name;
                    emit('save', state.field);
                }
            });
        };

        provide(formDataInjectionSymbols, state.field);

        const validateIsReserveValue = (rule, value, callback) => {
            if (value === '_id') {
                callback(new Error(t('designer.datasource.idReservedField')));

                return;
            }
            if (uniqueName() && rule.field === 'name') {
                callback(
                    new Error(t('designer.datasource.fieldAlreadyExists'))
                );
                return;
            }
            callback();
        };

        return {
            state,
            handleCancel,
            saveField,
            open,
            close,
            defaultStyle,
            form,
            rules: computed(() => ({
                title: [
                    {
                        required: true,
                        message: t('designer.datasource.required'),
                        trigger: 'change'
                    },
                    { validator: validateIsReserveValue }
                ],
                name: [
                    {
                        required: true,
                        message: t('designer.datasource.required'),
                        trigger: 'change'
                    },
                    { validator: validateIsReserveValue }
                ],
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'format.min': [
                    {
                        validator: (rule, value, callback) => {
                            if (value < 0) {
                                callback(
                                    new Error(
                                        t(
                                            'designer.datasource.mustNotLessThanZero'
                                        )
                                    )
                                );
                            } else {
                                form.value.validateField('format.max');
                                callback();
                            }
                        },
                        trigger: 'change'
                    }
                ],
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'format.max': [
                    {
                        validator: (rule, value, callback) => {
                            if (value < state.field.format.min) {
                                callback(
                                    new Error(
                                        t(
                                            'designer.datasource.mustNotLessThan',
                                            { min: state.field.format.min }
                                        )
                                    )
                                );
                            } else {
                                callback();
                            }
                        },
                        trigger: 'change'
                    }
                ]
            })),
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.step-select-second {
    border: 1px solid var(--te-datasource-common-border-color);
    border-radius: 4px;
    padding: 12px;
    margin-bottom: 16px;
    .field-row {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 12px;
        -webkit-box-shadow: none;
        box-shadow: none;
        justify-content: space-between;
        align-items: center;
        .tiny-button {
            border: 1px solid var(--te-datasource-common-text-color-primary);
            margin-right: 0px;
        }
    }

    .icon-and-text {
        display: flex;
        align-items: center;
        .field-cell-type {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
        }
        .field-cell-name {
            margin-left: 5px;
            font-weight: bold;
            font-size: var(--te-base-font-size-base);
            .description {
                color: var(--te-datasource-input-icon-color);
                margin-left: 5px;
            }
        }
    }
    svg {
        color: var(--te-datasource-toolbar-icon-color);
    }
    .title-content {
        :deep(.tiny-input__inner) {
            padding-right: 30px;
        }
    }
}
#default-item {
    height: 24px;
    padding: 0;
    border: none;
    border-top: 1px solid var(--te-datasource-common-border-color);
    margin-bottom: 0;
    border-radius: 0;
    .field-row {
        margin-bottom: 0;
        height: 24px;
        .field-operation {
            display: none;
        }
    }
}

#default-item:last-child {
    border-bottom: 1px solid var(--te-datasource-common-border-color);
}
</style>
