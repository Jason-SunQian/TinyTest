/**
 * 保证画布状态计算时一定存在占用者，避免出现 Release 状态触发锁定弹窗。
 */
import { getCanvasStatus } from '@opentiny/tiny-engine-common/js/canvas';
import { constants } from '@opentiny/tiny-engine-utils';
import { getMetaApi, META_SERVICE } from '@opentiny/tiny-engine-meta-register';

import { ENABLE_PAGE_LOCK_GUARD } from '@/config/featureFlags';

const FALLBACK_OCCUPIER = {
    id: '__local__',
    username: '本地用户'
};
const { PAGE_STATUS } = constants;

 
export const ensureOccupier = (occupier?: Record<string, any>) => {
    const userInfo = getMetaApi(META_SERVICE.GlobalService).getState()
        ?.userInfo;

    return occupier || userInfo || FALLBACK_OCCUPIER;
};

 
export const getEnsuredCanvasStatus = (occupier?: Record<string, any>) => {
    const ensured = ensureOccupier(occupier);
    const status = getCanvasStatus(ensured);

    if (
        ENABLE_PAGE_LOCK_GUARD &&
        ![PAGE_STATUS.Lock, PAGE_STATUS.Guest].includes(status.state)
    ) {
        status.state = PAGE_STATUS.Occupy;
    }

    return status;
};
