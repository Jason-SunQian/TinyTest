<template>
  <div class="meta-array-wrap">
    <meta-list>
      <template #title>
        <label>{{ labelText }}</label>
      </template>
      <template #items>
        <vue-draggable-next
          :list="itemsOptions.optionsList"
          :disabled="disableDrag"
          handle=".tiny-svg-size"
          @change="dragEnd"
        >
          <div v-for="(item, index) in itemsOptions.optionsList" :key="index">
            <meta-list-item
              :item="item"
              :index="index"
              :dataScource="itemsOptions"
              :currentIndex="state.currentIndex"
              :expand="expand"
              @changeItem="changeItem"
              @deleteItem="deleteItem"
              @editItem="editItem"
            >
              <template #content>
                <span>{{ translate(item[itemsOptions.textField]) || item.type }}</span>
              </template>
              <template #metaForm>
                <meta-child-item
                  type="array"
                  :meta="meta"
                  :index="index"
                  :arrayIndex="state.currentIndex"
                  @update:modelValue="onValueChange(index, $event)"
                ></meta-child-item>
              </template>
            </meta-list-item>
          </div>
        </vue-draggable-next>
      </template>
      <template #bottom>
        <div class="add" @click="addItem">
          <svg-icon name="add"></svg-icon>
          <span>{{ addButtonText }}</span>
        </div>
      </template>
    </meta-list>
  </div>
</template>

<script>
import { computed, reactive } from 'vue';
import { iconDel, iconEdit } from '@opentiny/vue-icon';
import { MetaList, MetaListItem, MetaChildItem } from '@opentiny/tiny-engine-common';
import { useTranslate } from '@opentiny/tiny-engine-meta-register';
import { VueDraggableNext } from 'vue-draggable-next';
import { useDesignerI18n } from '@/services/i18nService';
import { getLocalizedText, containsChinese } from '@/utils/i18nHelper';

export default {
  name: 'i18n-array-item-configurator',
  components: {
    MetaList,
    MetaListItem,
    MetaChildItem,
    VueDraggableNext
  },
  inheritAttrs: false,
  props: {
    meta: {
      type: Object,
      default: () => ({})
    },
    expand: {
      type: Boolean,
      default: false
    },
    disableDrag: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const { locale } = useDesignerI18n();
    const { translate } = useTranslate();
    
    // 获取标签文本，支持国际化
    const labelText = computed(() => {
      const labelObj = props.meta?.label?.text;
      const currentLang = locale.value;
      
      if (!labelObj) {
        return '';
      }
      
      // 如果是对象，尝试获取当前语言的文本
      if (typeof labelObj === 'object') {
        const text = getLocalizedText(labelObj, currentLang);
        if (text) {
          return text;
        }
        
        // 英文环境下，如果没有翻译，不回退到中文
        if (currentLang === 'en_US') {
          return '';
        }
      }
      
      // 如果是字符串
      if (typeof labelObj === 'string') {
        // 英文环境下，如果是中文，不回退
        if (currentLang === 'en_US' && containsChinese(labelObj)) {
          return '';
        }
        return labelObj;
      }
      
      return '';
    });
    
    // 获取"新增一列"按钮文本
    const addButtonText = computed(() => {
      // 如果国际化 key 不存在，根据当前语言返回对应文本
      const currentLang = locale.value;
      if (currentLang === 'en_US') {
        return 'Add Column';
      }
      return '新增一列';
    });

    const columnsList = computed(() => {
      return props.meta.widget.props.modelValue?.value || props.meta.widget.props.modelValue || [];
    });

    const itemsOptions = computed(() => {
      const currentLang = locale.value;
      return {
        valueField: 'field',
        textField: props.meta.widget.props.textField || 'value',
        btnList: [
          {
            title: currentLang === 'en_US' ? 'Edit' : '编辑',
            type: 'edit',
            icon: iconEdit()
          },
          {
            title: currentLang === 'en_US' ? 'Delete' : '删除',
            type: 'delete',
            icon: iconDel()
          }
        ],
        optionsList: columnsList.value,
        name: props.name,
        draggable: true
      };
    });

    const state = reactive({
      currentIndex: -1
    });

    const editItem = (data) => {
      state.currentIndex = data.index;
    };

    const updatedColumns = () => {
      emit('update:modelValue', [...columnsList.value]);
    };

    const addItem = () => {
      const defaultValue = props.meta.defaultValue?.[0] || null;
      const newOption = ['string', 'boolean', 'number'].includes(props.meta.widget.props.type)
        ? defaultValue
        : { ...defaultValue };

      columnsList.value.push(newOption);
      state.currentIndex = columnsList.value.length - 1;
      updatedColumns();
    };

    const deleteItem = (params) => {
      columnsList.value.splice(params.index, 1);
      updatedColumns();
    };

    const changeItem = (item) => {
      columnsList.value[item.index] = item.data;
      updatedColumns();
    };

    const onValueChange = (index, { propertyKey, propertyValue }) => {
      if (propertyValue === '' || propertyValue === undefined || propertyValue === null) {
        delete columnsList.value[index][propertyKey];
      } else {
        columnsList.value[index][propertyKey] = propertyValue;
      }
      updatedColumns();
    };

    const dragEnd = () => {
      updatedColumns();
    };

    return {
      state,
      itemsOptions,
      columnsList,
      editItem,
      addItem,
      deleteItem,
      changeItem,
      onValueChange,
      translate,
      dragEnd,
      labelText,
      addButtonText
    };
  }
};
</script>

<style lang="less" scoped>
.meta-array-wrap {
  font-size: 12px;
  display: block;
}
.add {
  display: flex;
  align-items: center;
  color: var(--te-configurator-common-text-color-emphasize);
  margin-top: 4px;
  &:hover {
    cursor: pointer;
  }

  & .svg-icon {
    margin-right: 4px;
  }
}
</style>

