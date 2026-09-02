/**
 * Wrap registered Modal.confirm: when page-lock UI is disabled, swallow DesignCanvas
 * "please lock page" confirms (hardcoded Chinese in npm @opentiny/tiny-engine-canvas).
 *
 * Why not only pageStatusGuard: DesignCanvas watches pageStatus and can open the
 * modal in the same tick before the guard rewrites Release → Occupy (race).
 *
 * Call from beforeAppCreate AFTER engine default initHook(useModal, Modal).
 */
import { useModal } from '@opentiny/tiny-engine-meta-register';

import { ENABLE_PAGE_LOCK_GUARD } from '@/config/featureFlags';

interface ConfirmOptions {
    title?: string;
    status?: string;
    message?: string | (() => unknown);
    exec?: (...args: unknown[]) => unknown;
    cancel?: (...args: unknown[]) => unknown;
    hide?: (...args: unknown[]) => unknown;
    showFooter?: boolean;
}

const LOCK_TIP_RE =
    /未锁定|点击右上角[\s\S]*锁定|被[\s\S]*锁定|请先锁定|画布未锁定/;

function messageToText(message: ConfirmOptions['message']): string {
    if (typeof message === 'string') {
        return message;
    }
    return '';
}

function isPageLockTip(options: ConfirmOptions): boolean {
    return LOCK_TIP_RE.test(messageToText(options.message));
}

/**
 * Returns a partial Modal API for Object.assign via initHook(HOOK_NAME.useModal, …).
 */
export function createPageLockAwareModal(): {
    confirm: (options: ConfirmOptions) => void;
} {
    const registered = useModal() as {
        confirm: (options: ConfirmOptions) => void;
    };
    const baseConfirm = registered.confirm.bind(registered);

    return {
        confirm(options: ConfirmOptions) {
            if (ENABLE_PAGE_LOCK_GUARD && isPageLockTip(options)) {
                // Reset DesignCanvas local showModal; do NOT run cancel/exec
                // (those undo the edit — editing must work without lock UI).
                options.hide?.();
                // eslint-disable-next-line no-console
                console.info(
                    '[designer] suppressed page-lock confirm:',
                    messageToText(options.message)
                );
                return;
            }
            baseConfirm(options);
        }
    };
}
