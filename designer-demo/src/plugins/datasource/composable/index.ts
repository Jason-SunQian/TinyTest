import { HOOK_NAME } from '@opentiny/tiny-engine-meta-register';

import useDataSource from './useDataSource';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const DataSourceService = {
    id: 'engine.service.dataSource',
    type: 'MetaService',
    apis: useDataSource(),
    composable: {
        name: HOOK_NAME.useDataSource
    }
};
