/**
 * Copyright (c) 2023 - present TinyEngine Authors.
 * Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.
 *
 * Use of this source code is governed by an MIT-style license.
 *
 * THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,
 * BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR
 * A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.
 *
 */

import { createApp } from 'vue'
import initSvgs from '@opentiny/tiny-engine-svgs'
import i18n, { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n'
import { initMonitor } from '@opentiny/tiny-engine-common/js/monitor'
import { injectGlobalComponents, setGlobalMonacoEditorTheme, Modal, Notify } from '@opentiny/tiny-engine-common'
import TinyThemeTool from '@opentiny/vue-theme/theme-tool'
import { defaultThemeList } from '@opentiny/tiny-engine-theme-base'
import {
  mergeRegistry,
  getMergeMeta,
  getMetaApi,
  META_SERVICE,
  initServices,
  initHook,
  HOOK_NAME,
  useMessage
} from '@opentiny/tiny-engine-meta-register'
import { utils } from '@opentiny/tiny-engine-utils'
import App from './App.vue'
import defaultRegistry from '../registry.js'
import { registerConfigurators } from './registerConfigurators'
// 导入设计器界面的国际化配置
import designerI18n from './i18n'

const { guid } = utils

// 加载设计器界面的国际化配置
const loadDesignerI18n = () => {
  try {
    // 合并英文国际化配置
    i18n.global.mergeLocaleMessage('en_US', designerI18n.en_US)
    // 合并中文国际化配置
    i18n.global.mergeLocaleMessage('zh_CN', designerI18n.zh_CN)
    console.log('设计器界面国际化配置已加载')
    
    // 在开发环境下添加测试功能
    if (process.env.NODE_ENV === 'development') {
      // 将测试函数暴露到全局，方便在控制台调试
      window.testDesignerI18n = () => {
        console.log('=== 测试设计器界面国际化 ===')
        console.log('当前语言:', i18n.global.locale.value)
        console.log('页面:', i18n.global.t('designer.toolbar.page'))
        console.log('保存:', i18n.global.t('designer.toolbar.save'))
        console.log('物料:', i18n.global.t('designer.leftPanel.materials'))
        console.log('中英文切换:', i18n.global.t('designer.toolbar.chineseEnglishSwitch'))
      }
      
      window.switchToEnglish = () => {
        i18n.global.locale.value = 'en_US'
        console.log('已切换到英文')
        window.testDesignerI18n()
      }
      
      window.switchToChinese = () => {
        i18n.global.locale.value = 'zh_CN'
        console.log('已切换到中文')
        window.testDesignerI18n()
      }
      
      console.log('🎯 开发环境国际化测试功能已启用:')
      console.log('  - testDesignerI18n() - 测试国际化')
      console.log('  - switchToEnglish() - 切换到英文')
      console.log('  - switchToChinese() - 切换到中文')
    }
  } catch (error) {
    console.warn('加载设计器界面国际化配置失败:', error)
  }
}

const defaultLifeCycles = {
  beforeAppCreate: ({ registry }) => {
    // 合并用户自定义注册表
    mergeRegistry(defaultRegistry, ...(Array.isArray(registry) ? registry : [registry]))

    const appId = getMetaApi(META_SERVICE.GlobalService).getBaseInfo().id
    const config = getMergeMeta('engine.config')

    if (process.env.NODE_ENV === 'development') {
      console.log('custom registry:', registry) // eslint-disable-line
      console.log('default registry:', defaultRegistry) // eslint-disable-line
    }

    // 初始化所有服务
    initServices()

    initHook(HOOK_NAME.useEnv, import.meta.env)
    initHook(HOOK_NAME.useNotify, Notify, { useDefaultExport: true })
    initHook(HOOK_NAME.useModal, Modal)

    // 加载设计器界面的国际化配置 - 移到这里确保在组件渲染前加载
    loadDesignerI18n()

    const theme = config?.theme || 'light'
    document.documentElement?.setAttribute?.('data-theme', theme)

    if (import.meta.env.VITE_ERROR_MONITOR === 'true' && import.meta.env.VITE_ERROR_MONITOR_URL) {
      initMonitor(import.meta.env.VITE_ERROR_MONITOR_URL)
    }

    // 这里暴露到 window 是为了让 canvas 可以读取
    window.TinyGlobalConfig = config || {}
  },
  appCreated: ({ app }) => {
    initSvgs(app)
    window.lowcodeI18n = i18n
    
    // 国际化配置已在 beforeAppCreate 阶段加载，这里不需要重复加载
    
    // 提供 I18nInjectionKey 给所有子组件使用
    app.provide(I18nInjectionKey, i18n)
    
    app.use(i18n).use(injectGlobalComponents)

    const appId = getMetaApi(META_SERVICE.GlobalService).getBaseInfo().id
    const theme = localStorage.getItem(`tiny-engine-theme-${appId}`) || getMergeMeta('engine.config').theme
    const editorTheme = theme?.includes('dark') ? 'vs-dark' : 'vs'
    setGlobalMonacoEditorTheme(editorTheme)
  }
}

const subscribeSignalFinish = (createAppSignal, timeout = 30000) => {
  return new Promise((resolve, reject) => {
    let finishCount = new Set()
    const len = new Set(createAppSignal).size

    const signalTopicAndSubscriber = createAppSignal.map((name) => ({
      topic: name,
      subscriber: `createAppSignal_${name}_${guid}`
    }))

    const initTimeout = setTimeout(() => {
      // 取消订阅
      signalTopicAndSubscriber.forEach(({ topic, subscriber }) => {
        useMessage().unsubscribe({
          topic,
          subscriber
        })
      })

      reject(new Error(`Signal initialization timeout after ${Math.floor(timeout / 1000)}s.`))
    }, timeout)

    signalTopicAndSubscriber.forEach(({ topic, subscriber }) => {
      useMessage().subscribe({
        topic,
        subscriber,
        callback: () => {
          finishCount.add(topic)

          // 取消订阅
          useMessage().unsubscribe({
            topic,
            subscriber
          })

          if (finishCount.size === len) {
            clearTimeout(initTimeout)
            resolve()
          }
        }
      })
    })
  })
}

export const init = async ({
  selector = '#app',
  registry = [],
  lifeCycles = {},
  configurators = {},
  createAppSignal = [],
  initTimeout = 30000
} = {}) => {
  const { beforeAppCreate, appCreated, appMounted } = lifeCycles

  registerConfigurators(configurators)

  defaultLifeCycles.beforeAppCreate({ registry })
  beforeAppCreate?.({ registry })

  if (Array.isArray(createAppSignal) && createAppSignal.length) {
    if (typeof initTimeout !== 'number' || initTimeout <= 0) {
      throw new Error('initTimeout must be a positive number')
    }
    await subscribeSignalFinish(createAppSignal, initTimeout)
  }

  const app = createApp(App)
  defaultLifeCycles.appCreated({ app })
  appCreated?.({ app })

  app.mount(selector)
  appMounted?.({ app })
}
