/**
 * MpCountryMultipleInput: defineModel<string[]>() → v-model country codes.
 * Bind this.state.mpCountryMultipleInputN = [] (never hardcode demo codes in snippet).
 */

import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

const RE_KEYS = /^this\.state\.(mpCountryMultipleInput\d+)$/;

export function syncMpCountryMultipleInputModelValueAndState(
    props: Record<string, unknown>,
    rootState: Record<string, unknown>
): void {
    const mv = props.modelValue;

    if (isModelValueJsExpression(mv)) {
        const exprVal = (mv as Record<string, unknown>).value;
        if (typeof exprVal === 'string') {
            const m = RE_KEYS.exec(exprVal.trim());
            const [, stateKey] = m ?? [];
            if (
                typeof stateKey === 'string' &&
                stateKey &&
                !Object.prototype.hasOwnProperty.call(rootState, stateKey)
            ) {
                rootState[stateKey] = [];
            }
        }
        return;
    }

    const stateKey = allocateIndexedStateKey(rootState, 'mpCountryMultipleInput');
    rootState[stateKey] = Array.isArray(mv) ? mv : [];
    props.modelValue = {
        type: 'JSExpression',
        value: `this.state.${stateKey}`,
        model: true
    };
}
