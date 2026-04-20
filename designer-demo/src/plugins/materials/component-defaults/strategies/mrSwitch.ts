import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

export function syncMrSwitchModelValueAndState(
    props: Record<string, unknown>,
    rootState: Record<string, unknown>
): void {
    const mv = props.modelValue;
    if (!isModelValueJsExpression(mv)) {
        const stateKey = allocateIndexedStateKey(rootState, 'mrSwitch');
        rootState[stateKey] = mv === undefined || mv === '' ? false : mv;
        props.modelValue = {
            type: 'JSExpression',
            value: `this.state.${stateKey}`,
            model: true
        };
    }
}
