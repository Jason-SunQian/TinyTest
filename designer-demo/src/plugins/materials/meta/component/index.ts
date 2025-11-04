import entry from './src/Main.vue'
import metaData from './meta'
import { t } from '../../../../services/i18nService'

export default {
  ...metaData,
  entry,
  options: {
    get title() {
      return t('designer.materials.component')
    }
  }
}
