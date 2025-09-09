import { META_SERVICE, META_APP } from '@opentiny/tiny-engine-meta-register'
import engineConfig from './engine.config'
import { HttpService } from './src/composable'
import CustomPage from './src/plugins/custom-page'
import SimpleLanguageSwitcher from './src/components/SimpleLanguageSwitcher.vue'
import CustomLang from './src/toolbars/lang/Main.vue'
import CustomSave from './src/toolbars/save/Main.vue'
import CustomOutlineTree from './src/plugins/tree/Main.vue'
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
  // 禁用官方Lang插件
  [META_APP.Lang]: false,
  // 使用自定义Lang插件
  'engine.toolbars.customLang': {
    id: 'engine.toolbars.customLang',
    title: 'Lang',
    icon: 'cn-en',
    entry: CustomLang
  },
  // 禁用官方 OutlineTree 并注册自定义版本
  [META_APP.OutlineTree]: false,
  'engine.plugins.customOutlineTree': {
    id: 'engine.plugins.customOutlineTree',
    title: 'OutlineTree',
    type: 'plugins',
    icon: 'plugin-icon-tree',
    widthResizable: true,
    entry: CustomOutlineTree
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
        // 放置自定义 OutlineTree 于原位置
        'engine.plugins.customOutlineTree': {
          insertAfter: META_APP.Materials
        },
        [META_APP.Save]: {
          insertBefore: META_APP.ThemeSwitch
        },
        'engine.toolbars.customLang': {
          insertAfter: META_APP.Breadcrumb
        },
        [META_APP.Page]: {
          insertBefore: META_APP.Schema
        }
      }
    }
  }
}


