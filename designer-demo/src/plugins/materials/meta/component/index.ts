import { t } from '../../../../services/i18nService';

import entry from './src/Main.vue';
import metaData from './meta';

export default {
    ...metaData,
    entry,
    options: {
        get title() {
            return t('designer.materials.component');
        }
    }
};
