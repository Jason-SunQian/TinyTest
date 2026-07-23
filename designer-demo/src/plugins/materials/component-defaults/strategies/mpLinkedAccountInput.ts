/**
 * MpLinkedAccountInput: defineModel<AccountItem>() → v-model object.
 * Bind this.state.mpLinkedAccountInputN = {} (never null string).
 */

import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

const RE_ACCOUNT = /^this\.state\.(mpLinkedAccountInput\d+)$/;

export function syncMpLinkedAccountInputModelValueAndState(
    props: Record<string, unknown>,
    rootState: Record<string, unknown>
): void {
    const mv = props.modelValue;

    if (isModelValueJsExpression(mv)) {
        const exprVal = (mv as Record<string, unknown>).value;
        if (typeof exprVal === 'string') {
            const m = RE_ACCOUNT.exec(exprVal.trim());
            const [, stateKey] = m ?? [];
            if (
                typeof stateKey === 'string' &&
                stateKey &&
                !Object.prototype.hasOwnProperty.call(rootState, stateKey)
            ) {
                rootState[stateKey] = {};
            }
        }
        return;
    }

    const stateKey = allocateIndexedStateKey(rootState, 'mpLinkedAccountInput');
    rootState[stateKey] =
        mv && typeof mv === 'object' && !Array.isArray(mv) ? mv : {};
    props.modelValue = {
        type: 'JSExpression',
        value: `this.state.${stateKey}`,
        model: true
    };
}
