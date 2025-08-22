<template>
  <toolbar-base
    :content="isBlock() ? t('designer.toolbar.blockSetting') : t('designer.toolbar.pageSetting')"
    :icon="options.icon.default || options.icon"
    :options="options"
    @click-api="openSetting"
  >
  </toolbar-base>
</template>

<script lang="tsx">
/* metaService: engine.toolbars.setting.Main */
import { useCanvas, useLayout, useBlock, usePage, useModal, useNotify } from '@opentiny/tiny-engine-meta-register'
import { constants } from '@opentiny/tiny-engine-utils'
import { ToolbarBase } from '@opentiny/tiny-engine-common'
import { inject } from 'vue'
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n'

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
    // 获取国际化 t 函数
    const i18n: any = inject(I18nInjectionKey)
    const t = i18n?.global?.t || ((key: string) => key)
    
    const { pageState, isBlock } = useCanvas()
    const { getCurrentBlock } = useBlock()
    const { initCurrentPageData, isChangePageData } = usePage()
    const { PLUGIN_NAME, activePlugin, layoutState, isEmptyPage } = useLayout()
    const { confirm, message } = useModal()

    const openBlockSetting = () => {
      activePlugin(PLUGIN_NAME.BlockManage).then((api: any) => {
        api.openSettingPanel({ item: getCurrentBlock() })
      })
    }

    const openPageAndInit = async (api: any) => {
      const { currentPage } = pageState
      api.openPageSettingPanel()
      const page = await api.getPageById(currentPage.id)
      initCurrentPageData(page)
    }

    const openPageSetting = () => {
      const { pageStatus } = layoutState

      if (pageStatus.state === PAGE_STATUS.Lock) {
        const username = pageStatus.data?.username || ''
        message({
          message: t('designer.common.pageLocked', { username })
        })
        return
      }

      activePlugin(PLUGIN_NAME.AppManage).then((api: any) => {
        if (isChangePageData()) {
          confirm({
            title: t('designer.common.tip'),
            message: t('designer.common.pageNotSaved'),
            exec: () => {
              openPageAndInit(api)
            }
          })
          return
        }
        openPageAndInit(api)
      })
    }

    const openSetting = () => {
      if (isEmptyPage()) {
        useNotify({ type: 'warning', message: t('designer.common.createPageFirst') })

        return
      }

      if (isBlock()) {
        openBlockSetting()
        return
      }

      openPageSetting()
    }

    return {
      openSetting,
      isBlock,
      t
    }
  }
}
</script>
