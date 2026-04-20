import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

const RE_MOBILE_INPUT = /^this\.state\.(mpMobileInput\d+)$/;

export function syncMpMobileInputModelValueAndState(
    props: Record<string, unknown>,
    rootState: Record<string, unknown>
): void {
    const mv = props.modelValue;

    if (isModelValueJsExpression(mv)) {
        const exprVal = (mv as Record<string, unknown>).value;
        if (typeof exprVal === 'string') {
            const m = RE_MOBILE_INPUT.exec(exprVal.trim());
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

    const stateKey = allocateIndexedStateKey(rootState, 'mpMobileInput');
    rootState[stateKey] = mv === undefined || mv === '' ? '' : mv;
    props.modelValue = {
        type: 'JSExpression',
        value: `this.state.${stateKey}`,
        model: true
    };
}
