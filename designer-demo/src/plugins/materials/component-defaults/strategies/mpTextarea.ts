import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

const RE_TEXTAREA = /^this\.state\.(mpTextarea\d+)$/;

export function syncMpTextareaModelValueAndState(
    props: Record<string, unknown>,
    rootState: Record<string, unknown>
): void {
    const mv = props.modelValue;

    if (isModelValueJsExpression(mv)) {
        const exprVal = (mv as Record<string, unknown>).value;
        if (typeof exprVal === 'string') {
            const m = RE_TEXTAREA.exec(exprVal.trim());
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

    const stateKey = allocateIndexedStateKey(rootState, 'mpTextarea');
    rootState[stateKey] = mv === undefined || mv === '' ? '' : mv;
    props.modelValue = {
        type: 'JSExpression',
        value: `this.state.${stateKey}`,
        model: true
    };
}
