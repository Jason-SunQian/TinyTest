<template>
  <TinyButton class="reset-btn" @click="reset">{{ displayText }}</TinyButton>
  <span class="reset-desc">{{ t('designer.settings.styles.common.resetTip') }}</span>
</template>

<script>
/* metaService: engine.setting.styles.ResetButton */
import { computed } from 'vue'
import { Button } from '@opentiny/vue'
import { useDesignerI18n } from '@/services/i18nService'

export default {
  components: {
    TinyButton: Button
  },
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  emits: ['reset'],
  setup(props, { emit }) {
    const { t } = useDesignerI18n()
    const displayText = computed(() => (props.text ? props.text : t('designer.settings.styles.common.reset')))

    const reset = () => {
      emit('reset')
    }

    return {
      reset,
      displayText,
      t
    }
  }
}
</script>

<style lang="less" scoped>
.reset-btn.tiny-button {
  display: block;
  max-width: 100%;
  border: 0;
  color: var(--te-styles-common-text-color-primary);
  border: 1px solid var(--te-styles-common-border-color-active);
}
.reset-desc {
  display: block;
  padding: 8px 4px;
  color: var(--te-styles-common-text-color-secondary);
}
</style>
