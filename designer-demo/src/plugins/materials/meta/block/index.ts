import { t } from '../../../../services/i18nService';

import entry from './src/Main.vue';
import metaData from './meta';
import { fetchGroups, fetchGroupBlocksByIds } from './src/http';

export default {
    ...metaData,
    entry,
    apis: {
        fetchGroups,
        fetchGroupBlocksByIds
    },
    options: {
        get title() {
            return t('designer.materials.block');
        }
    }
};
