import { HOOK_NAME } from '@opentiny/tiny-engine-meta-register';

import useBlock from './useBlock';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const BlockService = {
    id: 'engine.service.block',
    type: 'MetaService',
    apis: useBlock(),
    composable: {
        name: HOOK_NAME.useBlock
    }
};
