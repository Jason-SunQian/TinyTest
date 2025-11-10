<template>
  <div class="display-row">
    <div :class="['display-label', { selected: picked }]" @click="openDisplayModal($event)">
      <span>{{ t('designer.settings.styles.layout.title') }}</span>
    </div>
    <div class="display-content">
      <tabs-group-configurator
        :options="layoutOpts"
        :modelValue="picked"
        @update:modelValue="select"
      ></tabs-group-configurator>
    </div>
  </div>

  <modal-mask v-if="showModal" @close="showModal = false">
    <reset-button @reset="reset" />
  </modal-mask>
</template>

<script>
/* metaService: engine.setting.styles.LayoutGroup */
import { ref, computed } from 'vue'
import { DISPLAY_TYPE } from '../../js/cssType'
import { TabsGroupConfigurator } from '@opentiny/tiny-engine-configurator'
import useEvent from '../../js/useEvent'
import ResetButton from '../inputs/ResetButton.vue'
import ModalMask, { useModal } from '../inputs/ModalMask.vue'
import { useDesignerI18n } from '@/services/i18nService'

export default {
  components: {
    TabsGroupConfigurator,
    ModalMask,
    ResetButton
  },
  props: {
    effect: {
      type: String,
      default: 'dark'
    },
    placement: {
      type: String,
      default: 'top'
    },
    display: {
      type: String,
      default: null
    },
    disabled: {
      type: Object,
      default: () => ({})
    }
  },
  emits: useEvent(),
  setup(props, { emit }) {
    const { setPosition } = useModal()
    const { t } = useDesignerI18n()

    const picked = computed(() => props.display)
    const showModal = ref(false)

    const layoutOptionDefs = [
      { value: DISPLAY_TYPE.Block, label: 'Block' },
      { value: DISPLAY_TYPE.Flex, label: 'Flex' },
      { value: DISPLAY_TYPE.Grid, label: 'Grid', collapsed: true },
      { value: DISPLAY_TYPE.InlineBlock, label: 'Inline Block', collapsed: true },
      { value: DISPLAY_TYPE.Inline, label: 'Inline', collapsed: true },
      { value: DISPLAY_TYPE.Invisible, label: 'Hidden', collapsed: true }
    ]

    const layoutOpts = computed(() =>
      layoutOptionDefs.map((item) => ({
        ...item,
        content: item.label
      }))
    )

    const select = (type) => {
      picked.value = type
      if (type && !props.disabled[type]) {
        emit('update', { display: type })
      }
    }

    const openDisplayModal = (event) => {
      if (props.display) {
        setPosition(event)
        showModal.value = true
      }
    }

    const reset = () => {
      picked.value = null
      emit('update', { display: null })
      showModal.value = false
    }

    return {
      layoutOpts,
      picked,
      reset,
      select,
      showModal,
      openDisplayModal,
      t
    }
  }
}
</script>

<style lang="less" scoped>
.display-row {
  display: flex;
  align-items: center;

  .display-label {
    flex: 0 0 50px;
    line-height: 24px;
    color: var(--te-styles-common-text-color-secondary);
    span {
      padding: 2px;
    }
    &.selected {
      span {
        cursor: pointer;
        border-radius: 2px;
        color: var(--te-styles-common-setting-text-color);
        background-color: var(--te-styles-common-setting-bg-color);
      }
    }
  }

  .display-content {
    flex: auto;
    display: flex;
  }
}
</style>
