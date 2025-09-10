<template>
  <MainImpl v-bind="$attrs" />
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import MainImpl from './MainImpl.vue'
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n'
import { t as designerT } from '../../services/i18nService'

export default defineComponent({
  name: 'CustomBlockManage',
  components: { MainImpl },
  setup() {
    const inst: any = (window as any).lowcodeI18n
    if (inst) {
      provide(I18nInjectionKey as any, inst)
    } else {
      // 兜底：提供仅含 t 的最小实现，避免出现原始 key
      provide(I18nInjectionKey as any, { global: { t: designerT } })
    }
    return {}
  }
})
</script>


