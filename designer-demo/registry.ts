import { META_SERVICE, META_APP } from '@opentiny/tiny-engine-meta-register'
import engineConfig from './engine.config'
import { HttpService } from './src/composable'
// import CustomPage from './src/plugins/custom-page'
import SimpleLanguageSwitcher from './src/components/SimpleLanguageSwitcher.vue'
import CustomLang from './src/toolbars/lang/Main.vue'
import CustomSave from './src/toolbars/save/Main.vue'
import CustomOutlineTree from './src/plugins/tree/Main.vue'
import CustomBlockManage from './src/plugins/block/Main.vue'
import CustomDatasource from './src/plugins/datasource/Main.vue'
import CustomBridge from './src/plugins/bridge/Main.vue'
import CustomI18n, { TranslateService } from './src/plugins/i18n/index'
import CustomState from './src/plugins/state/index'
import CustomScript, { api as ScriptApi } from './src/plugins/script/Main.vue'
import CustomSchema from './src/plugins/schema/Main.vue'
import CustomPage, { api as PageApi } from './src/plugins/page/Main.vue'
import { PageService } from './src/plugins/page/composable/index'
import PageGeneral from './src/plugins/page/PageGeneral.vue'
import mcp from './src/plugins/page/mcp'
import SaveNewBlock from './src/plugins/block/SaveNewBlock.vue'
import { BlockService } from './src/plugins/block/composable/index'
import CustomMaterials, { ResourceService, MaterialService } from './src/plugins/materials/index'
import MaterialHeader from './src/plugins/materials/components/header/Main.vue'
import MaterialLayout from './src/plugins/materials/meta/layout/index'
import MaterialBlock from './src/plugins/materials/meta/block/index'
import MaterialComponent from './src/plugins/materials/meta/component/index'
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
  // 禁用官方 BlockManage 并注册自定义版本
  [META_APP.BlockManage]: false,
  'engine.plugins.customBlockManage': {
    id: 'engine.plugins.customBlockManage',
    title: 'BlockManage', // 这个会在 MainImpl.vue 中被 t('designer.leftPanel.blockManagement') 覆盖
    type: 'plugins',
    icon: 'plugin-icon-symbol',
    entry: CustomBlockManage,
    metas: [BlockService],
    components: { SaveNewBlock },
    options: { mergeCategoriesAndGroups: true }
  },
  // 禁用官方 Collections 并注册自定义版本
  [META_APP.Collections]: false,
  'engine.plugins.customCollections': {
    id: 'engine.plugins.customCollections',
    title: 'Collections', // 这个会在 Main.vue 中被 t('designer.datasource.title') 覆盖
    type: 'plugins',
    icon: 'plugin-icon-data',
    entry: CustomDatasource
  },
  // 禁用官方 Bridge 并注册自定义版本
  [META_APP.Bridge]: false,
  'engine.plugins.customBridge': {
    id: 'engine.plugins.customBridge',
    title: 'Bridge',
    type: 'plugins',
    icon: 'plugin-icon-sresources',
    entry: CustomBridge
  },
  // 禁用官方 I18n 并注册自定义版本
  [META_APP.I18n]: false,
  'engine.plugins.customI18n': {
    id: 'engine.plugins.customI18n',
    title: 'I18n',
    type: 'plugins',
    icon: 'plugin-icon-i18n',
    entry: CustomI18n.entry,
    metas: [TranslateService]
  },
  // 禁用官方 State 并注册自定义版本
  [META_APP.State]: false,
  'engine.plugins.customState': {
    id: 'engine.plugins.customState',
    title: 'State',
    type: 'plugins',
    icon: 'plugin-icon-var',
    entry: CustomState.entry
  },
  // 禁用官方 Page(Script) 并注册自定义版本（按照 block 插件的模式）
  [META_APP.Page]: false,
  'engine.plugins.customScript': {
    id: 'engine.plugins.customScript',
    title: 'Script',
    type: 'plugins',
    icon: 'plugin-icon-js',
    width: 600,
    widthResizable: true,
    confirm: 'close',
    entry: CustomScript,
    apis: ScriptApi
  },
  // 禁用官方 Schema 并注册自定义版本
  [META_APP.Schema]: false,
  'engine.plugins.customSchema': {
    id: 'engine.plugins.customSchema',
    title: 'Schema',
    type: 'plugins',
    icon: 'plugin-icon-page-schema',
    width: 600,
    widthResizable: true,
    entry: CustomSchema
  },
  // 禁用官方 AppManage 并注册自定义版本
  [META_APP.AppManage]: false,
  'engine.plugins.customAppManage': {
    id: 'engine.plugins.customAppManage',
    title: 'Page',
    type: 'plugins',
    icon: 'plugin-icon-page',
    entry: CustomPage,
    apis: PageApi,
    options: {
      pageBaseStyle: {
        className: 'page-base-style',
        style: 'padding: 24px;background: #FFFFFF;'
      }
    },
    components: {
      PageGeneral
    },
    metas: [PageService],
    mcp
  },
  // 禁用官方 Materials 并注册自定义版本
  [META_APP.Materials]: false,
  // 注册 Materials 子模块 - Layout
  'engine.plugins.customMaterials.layout': {
    ...MaterialLayout
  },
  // 注册 Materials 子模块 - Component
  'engine.plugins.customMaterials.component': {
    ...MaterialComponent
  },
  // 注册 Materials 子模块 - Block
  'engine.plugins.customMaterials.block': {
    ...MaterialBlock
  },
  // 注册 Materials 主插件
  'engine.plugins.customMaterials': {
    id: 'engine.plugins.customMaterials',
    title: 'Materials',
    type: 'plugins',
    icon: 'plugin-icon-materials',
    entry: CustomMaterials.entry,
    layout: MaterialLayout,
    options: {
      defaultTabId: 'engine.plugins.customMaterials.component',
      displayComponentIds: ['engine.plugins.customMaterials.component', 'engine.plugins.customMaterials.block'],
      basePropertyOptions: CustomMaterials.options.basePropertyOptions,
      useBaseStyle: true,
      blockBaseStyle: {
        className: 'block-base-style',
        style: 'margin: 16px;'
      },
      componentBaseStyle: {
        className: 'component-base-style',
        style: 'margin: 8px;'
      },
      hiddenBuiltinMaterials: []
    },
    components: {
      header: MaterialHeader
    },
    apis: CustomMaterials.apis,
    metas: [ResourceService, MaterialService],
    mcp: CustomMaterials.mcp
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
        // 放置自定义 OutlineTree 于原位置
        'engine.plugins.customOutlineTree': {
          insertAfter: META_APP.Materials
        },
        'engine.plugins.customBlockManage': {
          insertAfter: 'engine.plugins.customOutlineTree'
        },
        'engine.plugins.customCollections': {
          insertAfter: 'engine.plugins.customBlockManage'
        },
        'engine.plugins.customBridge': {
          insertAfter: 'engine.plugins.customCollections'
        },
        'engine.plugins.customI18n': {
          insertAfter: 'engine.plugins.customBridge'
        },
        'engine.plugins.customState': {
          insertAfter: 'engine.plugins.customI18n'
        },
        'engine.plugins.customScript': {
          insertAfter: 'engine.plugins.customState'
        },
        'engine.plugins.customSchema': {
          insertAfter: 'engine.plugins.customScript'
        },
        'engine.plugins.customMaterials': {
          insertAfter: 'engine.plugins.customSchema'
        },
        'engine.plugins.customAppManage': {
          insertBefore: 'engine.plugins.customSchema'
        },
        [META_APP.Save]: {
          insertBefore: META_APP.ThemeSwitch
        },
        'engine.toolbars.customLang': {
          insertAfter: META_APP.Breadcrumb
        }
      }
    }
  }
}


