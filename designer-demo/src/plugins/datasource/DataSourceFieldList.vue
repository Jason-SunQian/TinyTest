<template>
    <data-source-field-form
        v-for="(field, index) in state.fields"
        :key="field.name"
        class="form-item-border"
        :field="field"
        :is-row="true"
        :editable="field.editable"
        @cancel="closeFieldForm(index)"
        @save="saveFieldForm"
    >
        <div class="icon-and-text">
            <div class="field-cell-type">
                <component :is="getFieldType(field.type, 'icon')" />
            </div>
            <div class="field-cell-name">
                <span class="field-name">{{ field.name }}</span>
                <span class="description">({{ getFieldType(field.type, 'name') }})</span>
            </div>
        </div>
        <div v-if="!field.editable" class="field-operation">
            <div class="field-handler" @click="openFieldForm(index)">
                <svg-button
                    name="to-edit"
                    :hover-bg-color="false"
                    @click="handleEdit(data)"
                />
            </div>
            <div class="field-handler" @click="deleteField($event, field)">
                <svg-button :hover-bg-color="false" name="delete" />
            </div>
        </div>
    </data-source-field-form>
</template>

<script lang="ts">
/* metaService: engine.plugins.collections.DataSourceFieldList */
import { reactive, watchEffect } from 'vue';
import { IconDel } from '@opentiny/vue-icon';
import { SvgButton } from '@opentiny/tiny-engine-common';

import fieldTypes from './config';
import DataSourceFieldForm from './DataSourceFieldForm.vue';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        SvgButton,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSourceFieldForm,
        // eslint-disable-next-line @typescript-eslint/naming-convention, new-cap
        IconDel: IconDel()
    },
    props: {
        modelValue: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        }
    },
    emits: ['update:modelValue'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const state = reactive({
            fields: null
        });

        watchEffect(() => {
            state.fields = props.modelValue.map(item => {
                item.editable = false;
                return item;
            });
        });

        const getFieldType = (type, key) => {
            const fieldType = fieldTypes.filter(item => item.type === type);
            if (fieldType && fieldType.length === 1) {
                return fieldType[0][key];
            }
            return fieldTypes[0][key];
        };

        const openFieldForm = index => {
            state.fields = state.fields.map((item, i) => {
                if (index === i) {
                    item.editable = true;
                } else {
                    item.editable = false;
                }
                return item;
            });
        };

        const reset = () => {
            state.fields = state.fields.map(item => {
                item.editable = false;
                return item;
            });
        };

        const closeFieldForm = index => {
            state.fields[index].editable = false;
        };

        const saveFieldForm = field => {
            const { name, title } = field;
            const editableFields = state.fields.map(item => item.editable);
            const index = editableFields.indexOf(true);

            if (name && title && index > -1) {
                Object.assign(state.fields[index], field, { editable: false });
            }
        };

        const deleteField = (e, field) => {
            e.stopPropagation();
            const index = state.fields.findIndex(
                item => item.name === field.name && item.title === field.title
            );
            state.fields.splice(index, 1);
            emit('update:modelValue', state.fields);
        };

        return {
            state,
            reset,
            getFieldType,
            openFieldForm,
            closeFieldForm,
            saveFieldForm,
            deleteField
        };
    }
};
</script>

<style lang="scss" scoped>
.form-item-border {
    margin-bottom: 8px;
    .icon-and-text {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        .field-cell-type {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
        }
        .field-cell-name {
            margin-left: 5px;
            .field-name {
                color: var(--te-datasource-common-text-color-primary);
            }
            .description {
                color: var(--te-datasource-tip-text-color);
                margin-left: 5px;
            }
        }
        svg {
            color: var(--te-datasource-toolbar-icon-color);
        }
    }
}
.field-operation {
    display: none;

    .field-handler {
        cursor: pointer;
        font-size: 16px;
    }
}
.form-item-border:hover {
    background: var(--te-datasource-box-bg-color);
    .field-operation {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .field-handler {
            cursor: pointer;
            font-size: 16px;
        }
    }
}
</style>
