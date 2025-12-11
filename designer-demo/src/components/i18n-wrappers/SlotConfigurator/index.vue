<template>
  <div>
    <div v-for="(slot, index) in slotList" :key="slot.name" class="slot-list">
      <div class="slot-name">
        <span>
          {{ getSlotLabel(slot) }}
        </span>
        <tiny-popover v-if="getSlotDescription(slot)" placement="top" trigger="hover" :content="getSlotDescription(slot)">
          <template #reference>
            <div>
              <icon-help-circle class="help-icon"></icon-help-circle>
            </div>
          </template>
        </tiny-popover>
      </div>
      <div class="slot-switch">
        <div :class="['e__switch', { 'e_is-checked': slot.bind }]">
          <span class="e__switch-core" @click="toggleSlot(slot, index)"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watchEffect, nextTick } from 'vue';
import { Popover } from '@opentiny/vue';
import { useProperties, useModal, useCanvas, useMaterial } from '@opentiny/tiny-engine-meta-register';
import { iconHelpCircle } from '@opentiny/vue-icon';
import { useDesignerI18n } from '@/services/i18nService';
import { getLocalizedText, formatPropertyName, containsChinese, translateChinesePropertyName } from '@/utils/i18nHelper';

export default {
  name: 'i18n-slot-configurator',
  components: {
    TinyPopover: Popover,
    IconHelpCircle: iconHelpCircle()
  },
  props: {
    slots: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const { locale } = useDesignerI18n();
    const slotList = ref([]);

    watchEffect(() => {
      const slots = {};
      const children = useProperties().getSchema()?.children;
      if (Array.isArray(children)) {
        children.forEach((child) => {
          if (child.componentName === 'Template' && child.props?.slot) {
            const slotName = child.props.slot?.name || child.props.slot;
            slots[slotName] = child.props.slot;
          }
        });
      }
      slotList.value = Object.keys(props.slots).map((name) => {
        const { label, description, params } = props.slots[name] || {};
        return {
          label,
          description,
          name,
          params,
          bind: Boolean(slots[name])
        };
      });
    });

    const getSlotLabel = (slot) => {
      const currentLang = locale.value;
      if (slot.label) {
        const text = getLocalizedText(slot.label, currentLang);
        if (text) {
          // 如果文本是中文且当前是英文，尝试使用映射表翻译
          if (currentLang === 'en_US' && containsChinese(text)) {
            const translated = translateChinesePropertyName(text);
            if (translated) {
              return translated;
            }
            // 如果映射表没有，使用格式化的 slot.name
            return formatPropertyName(slot.name, currentLang) || slot.name;
          }
          return text;
        }
        // 如果 label 是对象但没有当前语言的翻译，尝试从 zh_CN 翻译
        if (currentLang === 'en_US' && typeof slot.label === 'object' && slot.label.zh_CN) {
          const translated = translateChinesePropertyName(slot.label.zh_CN);
          if (translated) {
            return translated;
          }
        }
      }
      // 如果没有翻译，格式化 slot.name（首字母大写，如 "label" -> "Label"）
      const formatted = formatPropertyName(slot.name, currentLang);
      return formatted || slot.name;
    };

    const getSlotDescription = (slot) => {
      const currentLang = locale.value;
      // 如果 description 存在（即使是 null，也要检查）
      if (slot.description !== undefined && slot.description !== null) {
        // 先尝试获取当前语言的翻译
        let desc = getLocalizedText(slot.description, currentLang);
        
        // 如果当前是英文但没有英文翻译，尝试使用映射表翻译中文
        if (!desc && currentLang === 'en_US' && typeof slot.description === 'object' && slot.description.zh_CN) {
          // 尝试使用映射表翻译
          const translated = translateChinesePropertyName(slot.description.zh_CN);
          if (translated) {
            return translated;
          }
          // 如果映射表没有，回退到中文（仅用于 description 提示）
          return slot.description.zh_CN;
        }
        
        if (desc) {
          return desc;
        }
      }
      return '';
    };

    const toggleSlot = ({ name = 'default', params, bind }, i) => {
      const schema = useProperties().getSchema();
      const { operateNode } = useCanvas();

      if (!bind) {
        slotList.value[i].bind = !slotList.value[i].bind;

        const template = {
          componentName: 'Template',
          props: {
            slot: {
              name
            }
          },
          children: []
        };

        // 如果有作用域插槽参数
        if (params?.length) {
          template.props.slot.params = params;
        }

        operateNode({
          type: 'updateAttributes',
          id: schema.id,
          value: { children: [...(schema.children || []), template] }
        });
      } else {
        useModal().confirm({
          title: locale.value === 'en_US' ? 'Hint' : '提示',
          message: locale.value === 'en_US' 
            ? 'After closing, the content in the slot will be cleared. Do you want to continue?'
            : '关闭后插槽内的内容将被清空，是否继续？',
          exec: () => {
            slotList.value[i].bind = !slotList.value[i].bind;

            const newChildren = schema.children.filter(
              ({ componentName, props }) =>
                componentName !== 'Template' || (props?.slot !== name && props?.slot?.name !== name)
            );

            operateNode({ type: 'updateAttributes', id: schema.id, value: { children: [...newChildren] } });
          },
          cancel: () => {}
        });
      }
      const config = useMaterial().getMaterial(schema.componentName);
      const isPopper = config?.configure?.isPopper;

      if (isPopper) {
        const showProp = typeof isPopper === 'string' ? isPopper : 'modelValue';

        schema.props[showProp] = false;
        nextTick(() => {
          schema.props[showProp] = true;
        });
      }

      useCanvas().canvasApi.value.updateRect();
    };

    return {
      toggleSlot,
      slotList,
      getSlotLabel,
      getSlotDescription
    };
  }
};
</script>

<style lang="less" scoped>
.slot-list {
  display: flex;
  justify-content: center;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: var(--te-common-vertical-item-spacing-normal);
  }
  .slot-name {
    width: 30%;
    color: var(--te-configurator-common-text-color-primary);
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    margin-right: 5px;
  }
  .slot-switch {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .help-icon {
    margin-left: 3px;
    cursor: help;
    width: 14px;
    height: 14px;
  }
}
.e__switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  font-size: 14px;
  line-height: 20px;
  height: 20px;
  vertical-align: middle;
  cursor: pointer;
}

.e__switch-core {
  margin: 0;
  position: relative;
  width: 40px;
  height: 20px;
  border: none;
  outline: 0;
  border-radius: 10px;
  box-sizing: border-box;
  background-color: var(--te-configurator-common-switch-bg-color);
  transition: border-color 0.3s, background-color 0.3s;
  vertical-align: middle;
}

.e__switch-core::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 1px;
  transform: translateY(-50%);
  border-radius: 100%;
  transition: all 0.3s;
  width: 16px;
  height: 16px;
  background-color: var(--te-configurator-common-bg-color);
}

.e__switch.e_is-checked .e__switch-core {
  background-color: var(--te-configurator-common-switch-bg-color-checked);
}

.e__switch.e_is-checked .e__switch-core::after {
  left: 100%;
  margin-left: -17px;
  transform: translateY(-50%);
}
</style>

