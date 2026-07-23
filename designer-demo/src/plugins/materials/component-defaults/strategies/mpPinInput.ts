/**
 * MpPinInput: defineModel('uid') → v-model:uid string (native secure keyboard).
 * Bind this.state.mpPinInputUidN = '' (session id; never invent PIN text).
 * Distinct from MpPinInputSimpleUid (system keyboard + eye).
 */

import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

const RE_UID = /^this\.state\.(mpPinInputUid\d+)$/;

export function syncMpPinInputUidAndState(
    props: Record<string, unknown>,
    rootState: Record<string, unknown>
): void {
    const uidProp = props.uid;

    if (isModelValueJsExpression(uidProp)) {
        const exprVal = (uidProp as Record<string, unknown>).value;
        if (typeof exprVal === 'string') {
            const m = RE_UID.exec(exprVal.trim());
            const [, stateKey] = m ?? [];
            if (
                typeof stateKey === 'string' &&
                stateKey &&
                !Object.prototype.hasOwnProperty.call(rootState, stateKey)
            ) {
                rootState[stateKey] = '';
            }
        }
        return;
    }

    const stateKey = allocateIndexedStateKey(rootState, 'mpPinInputUid');
    rootState[stateKey] =
        uidProp === undefined || uidProp === null ? '' : String(uidProp);
    props.uid = {
        type: 'JSExpression',
        value: `this.state.${stateKey}`,
        model: { prop: 'uid' }
    };
}
