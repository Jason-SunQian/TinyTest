<template>
  <p v-if="showEmptyTips" class="empty-tips">{{ tipsDesc }}</p>
</template>

<script>
/* metaService: engine.setting.props.Empty */
import { computed } from 'vue'
import { useCanvas } from '@opentiny/tiny-engine-meta-register'
import { useDesignerI18n } from '@/services/i18nService'

export default {
  props: {
    showEmptyTips: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { t } = useDesignerI18n()
    const { getSchema } = useCanvas()
    
    // 使用 computed 确保响应式（自动响应语言切换）
    const tipsDesc = computed(() => {
      const len = getSchema()?.children?.length
      return len 
        ? t('designer.settings.props.emptySelection') 
        : t('designer.settings.props.emptyComponent')
    })

    return {
      tipsDesc
    }
  }
}
</script>

<style lang="less" scoped>
.empty-tips {
  color: var(--te-props-common-text-color-weaken);
  text-align: center;
  margin-top: 50px;
  font-size: 12px;
}
</style>

