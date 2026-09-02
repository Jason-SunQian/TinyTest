import { effectScope, watch } from 'vue';
import { useLayout } from '@opentiny/tiny-engine-meta-register';
import { constants } from '@opentiny/tiny-engine-utils';

import { ensureOccupier, getEnsuredCanvasStatus } from '@/utils/pageStatus';
import { ENABLE_PAGE_LOCK_GUARD } from '@/config/featureFlags';

const { PAGE_STATUS } = constants;
// eslint-disable-next-line @typescript-eslint/init-declarations
let scope: ReturnType<typeof effectScope> | undefined;

/**
 * When lock toolbar is hidden, any non-Occupy / non-Guest status is forced to Occupy.
 * Includes Lock (FALLBACK occupier id ≠ userInfo.id used to leave Lock and open tip).
 */
const shouldForceOccupy = (state?: string) =>
    Boolean(state) &&
    state !== PAGE_STATUS.Occupy &&
    state !== PAGE_STATUS.Guest;

export const startPageStatusGuard = () => {
    if (!ENABLE_PAGE_LOCK_GUARD) {
        return;
    }
    if (scope) {
        return;
    }

    scope = effectScope();
    scope.run(() => {
        watch(
            () => useLayout().layoutState.pageStatus,
            pageStatus => {
                if (!pageStatus) {
                    useLayout().layoutState.pageStatus =
                        getEnsuredCanvasStatus();
                    return;
                }

                if (shouldForceOccupy(pageStatus.state)) {
                    useLayout().layoutState.pageStatus = getEnsuredCanvasStatus(
                        ensureOccupier(pageStatus.data)
                    );
                }
            },
            // sync: rewrite Release/Lock before DesignCanvas watcher opens modal when possible
            { immediate: true, deep: true, flush: 'sync' }
        );
    });
};
