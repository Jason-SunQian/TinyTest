import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

const RE_DISABLED = /^this\.state\.(mpAgreementContentDisabled\d+)$/;

/**
 * MpAgreementContent uses defineModel('disabled') → outcode v-model:disabled.
 * Bind props.disabled to this.state.mpAgreementContentDisabledN (default true:
 * runtime stays locked until user scrolls PDF to the end).
 */
export function syncMpAgreementContentDisabledAndState(
    props: Record<string, unknown>,
    rootState: Record<string, unknown>
): void {
    const disabledProp = props.disabled;

    if (isModelValueJsExpression(disabledProp)) {
        const exprVal = (disabledProp as Record<string, unknown>).value;
        if (typeof exprVal === 'string') {
            const m = RE_DISABLED.exec(exprVal.trim());
            const [, stateKey] = m ?? [];
            if (
                typeof stateKey === 'string' &&
                stateKey &&
                !Object.prototype.hasOwnProperty.call(rootState, stateKey)
            ) {
                rootState[stateKey] = true;
            }
        }
        return;
    }

    const stateKey = allocateIndexedStateKey(rootState, 'mpAgreementContentDisabled');
    rootState[stateKey] =
        disabledProp === undefined || disabledProp === ''
            ? true
            : Boolean(disabledProp);
    props.disabled = {
        type: 'JSExpression',
        value: `this.state.${stateKey}`,
        model: { prop: 'disabled' }
    };
}
