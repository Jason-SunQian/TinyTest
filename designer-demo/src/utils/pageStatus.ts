/**
 * Keep canvas status as Occupy when page-lock UI is disabled,
 * so npm DesignCanvas does not open the "please lock" confirm.
 */
import { getCanvasStatus } from '@opentiny/tiny-engine-common/js/canvas';
import { constants } from '@opentiny/tiny-engine-utils';
import { getMetaApi, META_SERVICE } from '@opentiny/tiny-engine-meta-register';

import { ENABLE_PAGE_LOCK_GUARD } from '@/config/featureFlags';

const FALLBACK_OCCUPIER = {
    id: '__local__',
    username: 'Local User'
};
const { PAGE_STATUS } = constants;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ensureOccupier = (occupier?: Record<string, any>) => {
    const userInfo = getMetaApi(META_SERVICE.GlobalService).getState()
        ?.userInfo;

    // Lock UI hidden: always treat current user as occupier so status is Occupy.
    if (ENABLE_PAGE_LOCK_GUARD) {
        return userInfo || FALLBACK_OCCUPIER;
    }

    return occupier || userInfo || FALLBACK_OCCUPIER;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getEnsuredCanvasStatus = (occupier?: Record<string, any>) => {
    const ensured = ensureOccupier(occupier);
    const status = getCanvasStatus(ensured);

    if (ENABLE_PAGE_LOCK_GUARD && status.state !== PAGE_STATUS.Guest) {
        status.state = PAGE_STATUS.Occupy;
        status.data = ensured;
    }

    return status;
};
