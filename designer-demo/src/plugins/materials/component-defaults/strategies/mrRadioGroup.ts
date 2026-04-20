import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

type SchemaNodeLike = {
    componentName?: string;
    props?: Record<string, unknown>;
    children?: SchemaNodeLike[] | unknown;
};

export function syncMrRadioGroupModelValueAndState(
    schema: SchemaNodeLike,
    rootState: Record<string, unknown>
): void {
    const props = (schema.props as Record<string, unknown>) || {};
    if (!schema.props) schema.props = props;
    const mv = props.modelValue;
    if (!isModelValueJsExpression(mv)) {
        const stateKey = allocateIndexedStateKey(rootState, 'mrRadioGroup');
        const children = schema.children as SchemaNodeLike[] | undefined;
        const firstRadioNode = Array.isArray(children)
            ? children.find(c => c?.componentName === 'MrRadio')
            : undefined;
        const firstRadioName = firstRadioNode?.props
            ? (firstRadioNode.props as Record<string, unknown>).name
            : undefined;
        rootState[stateKey] =
            mv === undefined || mv === '' ? firstRadioName ?? '' : mv;
        props.modelValue = {
            type: 'JSExpression',
            value: `this.state.${stateKey}`,
            model: true
        };
    }
}
