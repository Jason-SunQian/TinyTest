<template>
  <div class="toolbar-lang">
    <toolbar-base :content="label" :icon="options.icon || 'cn-en'" :options="options" @click-api="toggle">
      <template #default>
        <tiny-popover :visible-arrow="false" width="160" trigger="click">
          <template #reference>
            <span class="lang-btn">{{ label }}</span>
          </template>
          <div class="lang-panel">
            <tiny-button size="mini" @click="switchTo('zh_CN')">中文</tiny-button>
            <tiny-button size="mini" @click="switchTo('en_US')">English</tiny-button>
          </div>
        </tiny-popover>
      </template>
    </toolbar-base>
  </div>
  
</template>

<script lang="ts">
import { computed } from 'vue'
import { Button, Popover } from '@opentiny/vue'
import { ToolbarBase } from '@opentiny/tiny-engine-common'
import { useDesignerI18n, switchLanguage, getCurrentLanguage } from '../../services/i18nService'

export default {
  name: 'CustomLangToolbar',
  components: {
    TinyButton: Button,
    TinyPopover: Popover,
    ToolbarBase
  },
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const { t } = useDesignerI18n()
    const label = computed(() => t('designer.toolbar.chineseEnglishSwitch') || '中英文切换')

    const toggle = () => {}
    const switchTo = (locale: 'zh_CN' | 'en_US') => switchLanguage(locale)

    return { label, toggle, switchTo }
  }
}
</script>

<style scoped>
.lang-btn {
  padding: 0 6px;
}
.lang-panel { display: flex; gap: 8px; }
</style>


