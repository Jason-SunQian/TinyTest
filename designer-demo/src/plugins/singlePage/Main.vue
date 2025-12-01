<template>
  <div class="plugin-single-page">
    <plugin-panel
      :title="t('designer.page.title')"
      :fixed-name="'engine.plugins.singlePage'"
      :fixedPanels="fixedPanels"
      @close="pluginPanelClosed"
    >
      <template #content>
        <page-setting-content :isFolder="false" @openNewPage="openNewPage"></page-setting-content>
      </template>
    </plugin-panel>
  </div>
</template>

<script lang="tsx">
/* metaService: engine.plugins.singlePage.Main */
import { ref, reactive, onMounted, onActivated, watch, provide, nextTick } from 'vue'
import { useCanvas, usePage, useLayout, useNotify, getMetaApi, META_SERVICE } from '@opentiny/tiny-engine-meta-register'
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n'
import { extend } from '@opentiny/vue-renderless/common/object'
import PluginPanel from '@/components/i18n-wrappers/PluginPanel/index.vue'
import PageSettingContent from './PageSettingContent.vue'
import { openPageSettingPanel, closePageSettingPanel } from './PageSetting.vue'
import { fetchPageDetail, requestCreatePage } from './http'
import { useDesignerI18n, t as designerT } from '../../services/i18nService'

export const api = {
  getPageById: async (id) => {
    if (id) {
      return fetchPageDetail(id)
    }
    return undefined
  },
  openPageSettingPanel
}

export default {
  components: {
    PluginPanel,
    PageSettingContent
  },
  props: {
    title: {
      type: String,
      default: '页面'
    },
    fixedPanels: {
      type: Array
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { t } = useDesignerI18n()
    const { pageState } = useCanvas()
    const { pageSettingState, getDefaultPage, initCurrentPageData, switchPage } = usePage()
    const { PLUGIN_NAME } = useLayout()

    // 提供国际化注入
    const inst: any = (window as any).lowcodeI18n
    if (inst) {
      provide(I18nInjectionKey as any, inst)
    } else {
      provide(I18nInjectionKey as any, { global: { t: designerT } })
    }

    const panelState = reactive({
      emitEvent: emit
    })

    provide('panelState', panelState)

    // 获取当前页面ID
    const getCurrentPageId = () => {
      const baseInfo = getMetaApi(META_SERVICE.GlobalService).getBaseInfo()
      return baseInfo?.pageId || pageState?.currentPage?.id
    }

    // 加载当前页面
    const loadCurrentPage = async () => {
      const pageId = getCurrentPageId()
      
      if (pageId) {
        // 有页面ID，加载页面详情
        try {
          const pageDetail = await fetchPageDetail(pageId)
          // 确保设置为非新建状态，并初始化当前页面数据
          // 注意：必须在 initCurrentPageData 之前设置 isNew，确保数据正确显示
          pageSettingState.isNew = false
          initCurrentPageData(pageDetail)
          console.log('[singlePage] 已加载当前页面:', pageDetail.name, pageDetail.id)
          // singlePage 使用 PluginPanel，不需要调用 openPageSettingPanel
        } catch (error) {
          console.error('加载页面失败:', error)
          // 如果加载失败，创建新页面
          createEmptyPage()
        }
      } else {
        // 没有页面ID，创建新页面
        console.log('[singlePage] 没有当前页面ID，创建新页面')
        createEmptyPage()
      }
    }

    // 创建空页面
    const createEmptyPage = async () => {
      try {
        const defaultPage = getDefaultPage()
        if (!defaultPage) {
          throw new Error('Failed to get default page configuration')
        }

        const appId = getMetaApi(META_SERVICE.GlobalService).getBaseInfo().appId
        if (!appId) {
          throw new Error('App ID is required')
        }

        // 创建新页面
        const newPageData = {
          ...defaultPage,
          app: appId,
          parentId: pageSettingState.ROOT_ID,
          route: '',
          name: 'Untitled',
          page_content: {
            componentName: 'Page',
            css: '',
            props: {},
            lifeCycles: {},
            children: [],
            dataSource: {
              list: []
            },
            state: {},
            methods: {},
            utils: [],
            bridge: [],
            inputs: [],
            outputs: []
          },
          group: 'staticPages'
        }

        const createdPage = await requestCreatePage(newPageData)
        
        // 初始化页面数据
        pageSettingState.isNew = false
        initCurrentPageData(createdPage)
        // singlePage 使用 PluginPanel，不需要调用 openPageSettingPanel

        // 切换到新创建的页面
        if (switchPage) {
          switchPage(createdPage.id)
        } else {
          // 如果 switchPage 不可用，直接更新全局状态
          getMetaApi(META_SERVICE.GlobalService).updatePageId(createdPage.id)
        }
      } catch (error) {
        console.error('创建页面失败:', error)
        useNotify({
          type: 'error',
          message: t('designer.page.createPageFailed')
        })
      }
    }

    // 监听页面ID变化，自动加载
    watch(
      () => getCurrentPageId(),
      (newPageId, oldPageId) => {
        // 当页面ID变化时，重新加载页面数据
        if (newPageId && newPageId !== oldPageId) {
          console.log('[singlePage] 页面ID变化:', oldPageId, '->', newPageId)
          loadCurrentPage()
        }
      },
      { immediate: false }
    )

    // 插件打开时自动加载当前页面
    onMounted(() => {
      // 使用 nextTick 确保在组件完全渲染后再加载数据
      nextTick(() => {
        loadCurrentPage()
      })
    })

    // 插件激活时也重新加载当前页面（使用 keep-alive 时）
    onActivated(() => {
      // 确保显示的是当前页面的设置，而不是之前的状态
      loadCurrentPage()
    })

    const pluginPanelClosed = () => {
      emit('close')
      closePageSettingPanel()
    }

    const openNewPage = (data) => {
      // singlePage 模式下不需要切换页面功能
      console.log('openNewPage called:', data)
    }

    return {
      PLUGIN_NAME,
      pageState,
      openNewPage,
      pluginPanelClosed,
      t
    }
  }
}
</script>

<style lang="less" scoped>
.plugin-single-page {
  height: 100%;
}
</style>
