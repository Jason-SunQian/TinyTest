<template>
  <div class="property-setting-container">
    <div class="property-title" @click="handleCancelEdit">
      <icon-chevron-left></icon-chevron-left>
      {{ propertyName }}
    </div>
    <tiny-form class="property-form" label-position="left" label-width="110px">
      <tiny-form-item :label="t('designer.block.propertyName')">
        <tiny-input v-model="propertyName"></tiny-input>
      </tiny-form-item>
      <tiny-form-item :label="t('designer.block.propertyValueType')">
        <tiny-select v-model="type" :options="typeList" @change="changeType"></tiny-select>
      </tiny-form-item>
      <tiny-form-item :label="t('designer.block.propertyPanelComponent')">
        <tiny-select
          v-model="widgetComponent"
          :options="widgetComponentList"
          @change="handleChangeWidgetComponent"
        ></tiny-select>
        <div class="global-desc-info">
          {{ t('designer.block.propertyPanelComponentDescription') }}
        </div>
      </tiny-form-item>
      <tiny-form-item :label="t('designer.block.propertyPanelComponentProps')">
        <meta-code-editor
          :modelValue="widgetProps"
          :title="t('designer.block.propertyPanelComponentProps')"
          :button-text="t('designer.common.set')"
          language="json"
          :tips="componentPropsTips"
          @save="handleSaveWidgetProps"
        >
        </meta-code-editor>
      </tiny-form-item>
      <tiny-form-item v-if="showArrayItemConfig" :label="t('designer.block.configItems')">
        <meta-list-items class="config-list" :optionsList="arrayConfig">
          <template #content="{ data }">
            <div :class="{ 'item-text': true }">
              {{ data?.property }}
            </div>
          </template>
          <template #operate="{ data }">
            <div class="operate-right-container">
              <tiny-tooltip class="item" effect="light" :content="t('designer.common.edit')" placement="top">
                <span class="item-icon" @click.stop="handleEdit(data)">
                  <svg-icon name="to-edit"></svg-icon>
                </span>
              </tiny-tooltip>
              <tiny-tooltip class="item" effect="light" :content="t('designer.common.delete')" placement="top">
                <span class="item-icon" @click="del(data)">
                  <svg-icon name="delete"></svg-icon>
                </span>
              </tiny-tooltip>
            </div>
          </template>
        </meta-list-items>
        <span class="add-item-btn" @click="handleAddItem">
          <icon-plus-circle class="icon"></icon-plus-circle>
          <span class="text">{{ t('designer.block.addItem') }}</span>
        </span>
        <teleport to=".block-manage">
          <div v-if="showPropertyConfigItem" class="config-item-container" @click.stop>
            <div v-for="(data, idx) in itemConfig" :key="idx" class="meta-config-item">
              <config-item
                :key="idx"
                :property="data"
                :data-prop-index="idx"
                :data-group-index="index"
                @update:modelValue="handleConfigItemChange(data.property, $event)"
              >
                <slot name="prefix" :data="data"></slot>
                <slot name="suffix" :data="data"></slot>
              </config-item>
            </div>
          </div>
        </teleport>
      </tiny-form-item>
      <tiny-form-item :label="t('designer.block.defaultValue')">
        <config-item
          :property="defaultValueProperty"
          :onlyEdit="true"
          @update:modelValue="updateDefaultValue"
        ></config-item>
      </tiny-form-item>
      <tiny-form-item :label="t('designer.block.propertyDisplayName')">
        <tiny-input v-model="label"></tiny-input>
      </tiny-form-item>
      <tiny-form-item :label="t('designer.block.getPropertyValue')">
        <meta-code-editor
          :modelValue="getterValue"
          :title="t('designer.block.getPropertyValue')"
          button-text="getter"
          language="javascript"
          single
          @save="(...args) => saveAccessor('getter', ...args)"
        ></meta-code-editor>
      </tiny-form-item>
      <tiny-form-item :label="t('designer.block.setPropertyValue')">
        <meta-code-editor
          :modelValue="setterValue"
          :title="t('designer.block.setPropertyValue')"
          button-text="setter"
          language="javascript"
          single
          @save="(...args) => saveAccessor('setter', ...args)"
        ></meta-code-editor>
      </tiny-form-item>
      <div v-if="property.linked" class="linked-info">
        {{ t('designer.block.linkedToComponent') }}: {{ property.linked.componentName }} {{ t('designer.block.property') }}: {{ property.linked.property }}
      </div>
    </tiny-form>
  </div>
</template>

<script lang="ts">
/* metaService: engine.plugins.blockmanage.BlockPropertyForm */
import { computed, ref, watch, inject } from 'vue'
import {
  Input as TinyInput,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Select as TinySelect,
  Tooltip as TinyTooltip
} from '@opentiny/vue'
import { iconChevronLeft, iconPlusCircle } from '@opentiny/vue-icon'
import { ConfigItem, MetaListItems, MetaCodeEditor } from '@opentiny/tiny-engine-common'
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n'
import { getEditProperty, DEFAULT_ARRAY_CONFIG, META_COMPONENTS_ENUM } from './js/blockSetting'
import {
  itemConfig,
  arrayConfig,
  showArrayItemConfig,
  type,
  label,
  propertyName,
  widgetComponent,
  saveAccessor,
  handleConfigItemChange,
  handleAddItem,
  del,
  handleSaveWidgetProps,
  updateDefaultValue,
  handleChangeWidgetComponent,
  handleEdit,
  handleCancelEdit,
  changeType,
  widgetComponentList,
  typeList,
  showPropertyConfigItem
} from './js/blockPropertyForm'

export default {
  components: {
    TinyForm,
    TinyInput,
    TinySelect,
    TinyFormItem,
    ConfigItem,
    MetaCodeEditor,
    IconChevronLeft: iconChevronLeft(),
    IconPlusCircle: iconPlusCircle(),
    MetaListItems,
    TinyTooltip
  },
  setup() {
    // 获取国际化 t 函数
    const i18n: any = inject(I18nInjectionKey)
    const t = i18n?.global?.t || ((key: string) => key)

    const property = computed(() => getEditProperty() || {})
    const getterValue = computed(() => property.value?.accessor?.getter?.value || 'function getter() {}')
    const setterValue = computed(() => property.value?.accessor?.setter?.value || 'function setter() {}')
    const defaultValueProperty = ref({
      ...property.value,
      widget: {
        props: {
          ...property.value.widget.props
        },
        component:
          property.value.widget.component === META_COMPONENTS_ENUM.ArrayItemConfigurator
            ? META_COMPONENTS_ENUM.CodeConfigurator
            : property.value.widget.component
      }
    })

    const componentPropsTips = ref({
      title: t('designer.block.componentPropsTipsTitle'),
      demo: t('designer.block.componentPropsTipsDemo')
    })
    watch(
      () => getEditProperty(),
      (property) => {
        if (!property) {
          return
        }

        const {
          defaultValue,
          widget: { props, component },
          ...otherProperty
        } = property

        const newDefaultValueProperty = {
          ...otherProperty,
          widget: {
            props: {
              ...props,
              modelValue: defaultValue
            },
            component:
              component === META_COMPONENTS_ENUM.ArrayItemConfigurator
                ? META_COMPONENTS_ENUM.CodeConfigurator
                : component
          }
        }

        Object.assign(defaultValueProperty.value, newDefaultValueProperty)
      },
      {
        deep: true
      }
    )

    const widgetProps = computed(() => property.value?.widget?.props || {})

    return {
      type,
      label,
      property,
      typeList,
      getterValue,
      setterValue,
      propertyName,
      changeType,
      saveAccessor,
      updateDefaultValue,
      handleCancelEdit,
      widgetProps,
      handleSaveWidgetProps,
      widgetComponent,
      widgetComponentList,
      handleChangeWidgetComponent,
      arrayConfig,
      DEFAULT_ARRAY_CONFIG,
      handleEdit,
      del,
      handleAddItem,
      showPropertyConfigItem,
      handleConfigItemChange,
      itemConfig,
      defaultValueProperty,
      showArrayItemConfig,
      componentPropsTips,
      t
    }
  }
}
</script>

<style lang="less" scoped>
.property-setting-container {
  padding: 12px 15px;
}

.property-title {
  margin-bottom: 12px;
  cursor: pointer;
  fill: currentcolor;
}

.property-form {
  :deep(.tiny-form-item__label) {
    font-size: 12px;
  }
}

.add-item-btn {
  display: inline-block;
  margin-top: 6px;
  font-size: 12px;
  color: var(--te-block-property-add-item-text-color);
  cursor: pointer;

  .text {
    margin-left: 4px;
  }
}

.linked-info {
  margin-top: 10px;
  padding: 15px 0px;
}

.handle {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.config-item-container {
  position: absolute;
  right: calc(-280px - var(--base-collection-panel-width));
  top: 0;
  width: 280px;
  height: 100%;
  padding: 20px;
  background-color: var(--te-block-property-config-item-bg-color);
  border-right: 1px solid var(--te-block-property-config-item-border-color);
}

.config-list {
  :deep(.operate-right-container) {
    .item-icon {
      cursor: pointer;
      padding: 2px;
    }

    .item + .item {
      margin-left: 8px;
    }
  }
}
</style>
