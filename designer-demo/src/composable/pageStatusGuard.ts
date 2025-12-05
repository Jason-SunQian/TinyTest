import { effectScope, watch } from 'vue';
import { useLayout } from '@opentiny/tiny-engine-meta-register';
import { constants } from '@opentiny/tiny-engine-utils';

import { ensureOccupier, getEnsuredCanvasStatus } from '@/utils/pageStatus';
import { ENABLE_PAGE_LOCK_GUARD } from '@/config/featureFlags';

const { PAGE_STATUS } = constants;
// eslint-disable-next-line @typescript-eslint/init-declarations
let scope: ReturnType<typeof effectScope> | undefined;

const shouldForceOccupy = (state?: string) =>
    state &&
    ![PAGE_STATUS.Occupy, PAGE_STATUS.Lock, PAGE_STATUS.Guest].includes(state);

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
                // eslint-disable-next-line no-console
                console.info('[designer-demo] pageStatus update', pageStatus);

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
            { immediate: true, deep: true }
        );
    });
};
