import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

export function syncMrSliderModelValueAndState(
    props: Record<string, unknown>,
    rootState: Record<string, unknown>
): void {
    const mv = props.modelValue;
    if (!isModelValueJsExpression(mv)) {
        const stateKey = allocateIndexedStateKey(rootState, 'mrSlider');
        const initial =
            mv === undefined || mv === '' || mv === null ? 50 : Number(mv);
        rootState[stateKey] = Number.isFinite(initial) ? initial : 50;
        props.modelValue = {
            type: 'JSExpression',
            value: `this.state.${stateKey}`,
            model: true
        };
    }
}
