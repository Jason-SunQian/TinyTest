<template>
  <div class="home">
    <tiny-checkbox class="selectHome" v-model="state.checked" :disabled="state.selectDisable" @change="settingHome"
      >{{ t('designer.page.setAsHome') }}</tiny-checkbox
    >
    <div class="tip">
      <span>{{ t('designer.page.currentHomePage') }}</span>
      <span class="home-page">【{{ homePage }}】</span>
    </div>
  </div>
</template>

<script lang="ts">
/* metaService: engine.plugins.appmanage.PageHome */
import { computed, reactive, watchEffect, inject } from 'vue'
import { Checkbox } from '@opentiny/vue'
import { usePage, useModal, useNotify } from '@opentiny/tiny-engine-meta-register'
import { isVsCodeEnv } from '@opentiny/tiny-engine-common/js/environments'
import { generateRouter } from '@opentiny/tiny-engine-common/js/vscodeGenerateFile'
import http from './http'
import { useDesignerI18n } from '../../services/i18nService'

export default {
  components: {
    TinyCheckbox: Checkbox
  },
  setup() {
    const { t } = useDesignerI18n()
    const { pageSettingState, STATIC_PAGE_GROUP_ID } = usePage()
    const { handleRouteHomeUpdate } = http
    const { confirm } = useModal()
    const state = reactive({
      checked: false,
      selectDisable: false
    })
    watchEffect(() => {
      const isChecked = Boolean(pageSettingState.currentPageData?.isHome)
      state.checked = isChecked
      state.selectDisable = isChecked
    })
    const homePage = computed(() => {
      let home = t('designer.page.noHomePage')
      if (pageSettingState.pages[STATIC_PAGE_GROUP_ID]) {
        const data = pageSettingState.pages[STATIC_PAGE_GROUP_ID].data
        const homeData = data.filter((item) => item.isHome)

        if (homeData[0]) {
          home = homeData[0].name
        }
      }

      return home
    })

    const openSettingPanel = inject('openSettingPanel')

    const settingHome = () => {
      confirm({
        title: t('designer.common.tip'),
        type: 'warning ',
        message: t('designer.page.confirmSetHome'),
        exec: () => {
          const { id } = pageSettingState.currentPageData
          const params = { ...pageSettingState.currentPageData }

          params.isHome = true

          handleRouteHomeUpdate(id, params)
            .then(() => {
              pageSettingState.updateTreeData()
              openSettingPanel(pageSettingState.currentPageData)
              pageSettingState.isNew = false
              if (isVsCodeEnv) {
                generateRouter({
                  pageId: id,
                  componentsTree: params
                })
              }
              useNotify({ message: t('designer.page.setHomeSuccess'), type: 'success' })
            })
            .catch(() => {
              useNotify({ message: t('designer.page.setHomeFailed'), type: 'error' })
            })
        },
        cancel: () => {
          state.checked = false
        }
      })
    }
    return {
      pageSettingState,
      settingHome,
      homePage,
      state,
      t
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  color: var(--te-page-manage-text-color);
  line-height: 24px;
  .homeTitle {
    margin: 10px 0 0 5px;
    display: inline-block;
  }

  .tip {
    color: var(--te-page-manage-tip-text-color);
    margin-top: 4px;
    margin-bottom: 12px;
    font-size: 11px;
    line-height: 16px;
    span {
      color: var(--te-page-manage-tip-text-color);
    }
    .home-page {
      display: inline-block;
    }
  }
  .tiny-button {
    max-width: 300px;
    max-height: 50px;
    height: 33px;
    padding: 0px 20px;
    margin-top: 12px;
    display: flex;
    align-items: center;
    .icon-home {
      display: inline-block;
      margin-right: 8px;
    }
  }
}
</style>
