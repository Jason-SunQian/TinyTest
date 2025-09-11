import Main from './src/Main.vue'
import { TranslateService } from './src/composable/index'
import './src/styles/vars.less'

export default {
  id: 'engine.plugins.i18n',
  title: '国际化',
  type: 'plugins',
  width: 600,
  icon: 'plugin-icon-i18n',
  entry: Main,
  options: {
    batchImportTempDownloadUrl: '',
    batchImportTempDownMethod: ''
  },
  metas: [TranslateService]
}

export { TranslateService }