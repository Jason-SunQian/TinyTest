/**
 * MpMultiUploader: defineModel<UploadFileItem[]>() → v-model file list.
 * Bind this.state.mpMultiUploaderN = [] (never hardcode demo files in snippet).
 */

import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

const RE_FILES = /^this\.state\.(mpMultiUploader\d+)$/;

export function syncMpMultiUploaderModelValueAndState(
    props: Record<string, unknown>,
    rootState: Record<string, unknown>
): void {
    const mv = props.modelValue;

    if (isModelValueJsExpression(mv)) {
        const exprVal = (mv as Record<string, unknown>).value;
        if (typeof exprVal === 'string') {
            const m = RE_FILES.exec(exprVal.trim());
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

    const stateKey = allocateIndexedStateKey(rootState, 'mpMultiUploader');
    rootState[stateKey] = Array.isArray(mv) ? mv : [];
    props.modelValue = {
        type: 'JSExpression',
        value: `this.state.${stateKey}`,
        model: true
    };
}
