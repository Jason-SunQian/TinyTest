/**
 * MpDictMultipleInput: defineModel<string[]>() → v-model selected fieldValue keys.
 * Bind this.state.mpDictMultipleInputN = [] (never hardcode demo keys in snippet).
 */

import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

const RE_KEYS = /^this\.state\.(mpDictMultipleInput\d+)$/;

export function syncMpDictMultipleInputModelValueAndState(
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

    const stateKey = allocateIndexedStateKey(rootState, 'mpDictMultipleInput');
    rootState[stateKey] = Array.isArray(mv) ? mv : [];
    props.modelValue = {
        type: 'JSExpression',
        value: `this.state.${stateKey}`,
        model: true
    };
}
