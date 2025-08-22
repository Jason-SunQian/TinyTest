<template>
  <toolbar-base
    :content="t('designer.toolbar.chineseEnglishSwitch')"
    :icon="options.icon.default || options.icon"
    :options="options"
    @click-api="changeLang"
  >
  </toolbar-base>
</template>

<script lang="ts">
/* metaService: engine.toolbars.lang.Main */
import { ref, watch, inject } from 'vue'
import { useBroadcastChannel } from '@vueuse/core'
import { ToolbarBase } from '@opentiny/tiny-engine-common'
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n'

import { constants } from '@opentiny/tiny-engine-utils'

const { BROADCAST_CHANNEL } = constants

export default {
  components: {
    ToolbarBase
  },
  props: {
    langChannel: {
      type: String,
      default: BROADCAST_CHANNEL.CanvasLang
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const i18n: any = inject(I18nInjectionKey)
    const t = i18n?.global?.t || ((key: string) => key)
    const langVal = ref('zh_CN')
    const { post, data } = useBroadcastChannel({ name: props.langChannel })

    watch(data, () => {
      langVal.value = data.value
    })

    const langOptions = [
      {
        value: 'zh_CN',
        label: '中文'
      },
      {
        value: 'en_US',
        label: 'English'
      }
    ]
    const changeLang = () => {
      langVal.value = langVal.value === langOptions[0].value ? langOptions[1].value : langOptions[0].value
      post(langVal.value)
      console.log(langVal.value)
    }
    return {
      langOptions,
      langVal,
      changeLang,
      t
    }
  }
}
</script>
<style scoped lang="less">
.change-lang-box {
  svg {
    color: var(--te-toolbars-lang-text-color);
    width: 18px;
    height: 18px;
    &:hover {
      opacity: 0.75;
    }
  }
}
.icon {
  color: var(--te-toolbars-lang-icon-color);
}
</style>
