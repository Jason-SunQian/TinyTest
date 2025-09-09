import { META_SERVICE, META_APP } from '@opentiny/tiny-engine-meta-register'
import engineConfig from './engine.config'
import { HttpService } from './src/composable'
import CustomPage from './src/plugins/custom-page'
import SimpleLanguageSwitcher from './src/components/SimpleLanguageSwitcher.vue'
import CustomSave from './src/toolbars/save/Main.vue'
import { loadDesignerI18n } from './src/services/i18nService'

export default {
  [META_SERVICE.Http]: HttpService,
  'engine.config': {
    ...engineConfig
  },
  'engine.hooks.i18n': {
    beforeAppCreate: () => {
      console.log('🚀 开始初始化designer-demo国际化配置...')
      loadDesignerI18n()
    }
  },
  [META_APP.Robot]: false,
  [META_APP.Help]: {
    id: 'engine.plugins.editorhelp',
    title: '国际化测试',
    icon: 'cn-en',
    entry: SimpleLanguageSwitcher
  },
  [META_APP.Save]: {
    id: 'engine.toolbars.customSave',
    title: 'Save',
    icon: 'save',
    entry: CustomSave
  },
  [META_APP.Layout]: {
    options: {
      relativeLayoutConfig: {
        [META_APP.Script]: {
          insertBefore: META_APP.AppManage
        },
        [META_APP.Materials]: {
          insertAfter: META_APP.State
        },
        [META_APP.Schema]: {
          insertBefore: META_APP.Materials
        },
        [META_APP.Save]: {
          insertBefore: META_APP.ThemeSwitch
        },
        [META_APP.Lang]: {
          insertAfter: META_APP.Breadcrumb
        },
        [META_APP.Page]: {
          insertBefore: META_APP.Schema
        }
      }
    }
  }
}


