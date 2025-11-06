<template>
  <div class="toolbar-itm-clean">
    <toolbar-base :content="t('designer.toolbar.clean')" :icon="options.icon.default || options.icon" :options="options" @click-api="clean">
    </toolbar-base>
  </div>
</template>

<script lang="tsx">
/* metaService: engine.toolbars.clean.custom.Main */
import { ref, watch } from 'vue'
import { useCanvas, useLayout, useModal } from '@opentiny/tiny-engine-meta-register'
import { constants } from '@opentiny/tiny-engine-utils'
import { ToolbarBase } from '@opentiny/tiny-engine-common'
import { useDesignerI18n } from '@/services/i18nService'

const { PAGE_STATUS } = constants
export default {
  components: {
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
    const { pageState, clearCanvas } = useCanvas()
    const isLock = ref(pageState.isLock)
    const { confirm } = useModal()

    watch(
      () => pageState.isLock,

      (value) => (isLock.value = value)
    )

    const clean = () => {
      if (![PAGE_STATUS.Occupy, PAGE_STATUS.Guest].includes(useLayout().layoutState?.pageStatus?.state)) {
        return
      }

      if (!isLock.value) {
        confirm({
          title: t('designer.common.tip'),
          message: () => {
            return [
              <div class="modal-content">
                {
                  <div class="wrap">
                    <span>{t('designer.toolbar.cleanConfirm')}</span>
                  </div>
                }
              </div>
            ]
          },
          exec: () => {
            clearCanvas()
          }
        })
      }
    }

    return {
      clean,
      isLock,
      t
    }
  }
}
</script>

