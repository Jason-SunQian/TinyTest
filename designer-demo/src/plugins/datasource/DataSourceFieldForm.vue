<template>
  <div v-if="state.isOpen" class="step-select-second" :id="defaultStyle">
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
          <tiny-button plain @click.stop="handleCancel">{{ t('designer.common.cancel') }}</tiny-button>
          <tiny-button type="primary" @click.stop="saveField">{{ t('designer.common.confirm') }}</tiny-button>
        </button-group>
      </span>
    </div>
    <div v-if="editable">
      <tiny-form ref="form" label-position="top" :rules="rules" :model="state.field" validate-type="text">
        <tiny-form-item class="title-content" prop="title" :label="t('designer.datasource.fieldName')" label-width="150px">
          <i18n-input v-model="state.field.title"></i18n-input>
        </tiny-form-item>
        <tiny-form-item class="name-content" prop="name" :label="t('designer.datasource.fieldId')" label-width="150px">
          <tiny-input class="filedName" v-model="state.field.name" :placeholder="t('designer.datasource.fieldUniqueId')"></tiny-input>
        </tiny-form-item>
        <!--不同的字段类型对应不同的校验规则-->
        <data-source-field-check :type="state.field.type"></data-source-field-check>
      </tiny-form>
    </div>
  </div>
</template>

<script lang="ts">
/* metaService: engine.plugins.collections.DataSourceFieldForm */
import { reactive, watchEffect, ref, provide, computed } from 'vue'
import { Button, Input, FormItem, Form } from '@opentiny/vue'
import { ButtonGroup, I18nInput } from '@opentiny/tiny-engine-common'
import DataSourceFieldCheck from './DataSourceFieldCheck.vue'
import { useDesignerI18n } from '../../services/i18nService'

export const formDataInjectionSymbols = Symbol('DataSourceFieldFormData')

export default {
  components: {
    ButtonGroup,
    TinyButton: Button,
    TinyInput: Input,
    TinyForm: Form,
    TinyFormItem: FormItem,
    I18nInput,
    DataSourceFieldCheck
  },
  props: {
    field: {
      type: Object,
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
      type: Array,
      default: () => []
    }
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {
    const { t } = useDesignerI18n()
    
    const state = reactive({
      field: null,
      isOpen: null
    })

    const form = ref(null)

    watchEffect(() => {
      if (props.field) {
        state.field = { ...props.field }
      }
    })

    watchEffect(() => {
      state.isOpen = props.isOpen === undefined ? true : props.isOpen
    })

    const defaultStyle = computed(() => (props.isRow && !props.editable ? 'default-item' : ''))

    const open = () => {
      state.isOpen = true
    }

    const close = () => {
      state.isOpen = false
    }

    const handleCancel = () => {
      emit('cancel')
    }
    const uniqueName = () => {
      return props.modelValue.some((item) => item.name === state.field.name)
    }
    const saveField = () => {
      form.value.validate((valid) => {
        if (valid) {
          state.field.field = state.field.name
          emit('save', state.field)
        }
      })
    }

    provide(formDataInjectionSymbols, state.field)

    const validateIsReserveValue = (rule, value, callback) => {
      if (value === '_id') {
        callback(new Error(t('designer.datasource.idReservedField')))

        return
      }
      if (uniqueName() && rule.field === 'name') {
        callback(new Error(t('designer.datasource.fieldAlreadyExists')))
        return
      }
      callback()
    }

    return {
      state,
      handleCancel,
      saveField,
      open,
      close,
      defaultStyle,
      form,
      rules: computed(() => ({
        title: [{ required: true, message: t('designer.datasource.required'), trigger: 'change' }, { validator: validateIsReserveValue }],
        name: [{ required: true, message: t('designer.datasource.required'), trigger: 'change' }, { validator: validateIsReserveValue }],
        'format.min': [
          {
            validator: (rule, value, callback) => {
              if (value < 0) {
                callback(new Error(t('designer.datasource.mustNotLessThanZero')))
              } else {
                form.value.validateField('format.max')
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        'format.max': [
          {
            validator: (rule, value, callback) => {
              if (value < state.field.format.min) {
                callback(new Error(t('designer.datasource.mustNotLessThan', { min: state.field.format.min })))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      })),
      t
    }
  }
}
</script>

<style lang="less" scoped>
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
