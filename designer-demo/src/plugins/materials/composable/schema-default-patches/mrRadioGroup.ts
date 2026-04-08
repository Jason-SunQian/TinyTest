import type { RootStateBag, SchemaNode } from './types';

export function patchMrRadioGroupModelBinding(
    schema: SchemaNode,
    rootState: RootStateBag
): void {
    const props = (schema.props as Record<string, unknown>) || {};
    if (!schema.props) schema.props = props;
    const mv = props.modelValue;
    const isExpr =
        mv &&
        typeof mv === 'object' &&
        (mv as Record<string, unknown>).type === 'JSExpression';
    if (!isExpr) {
        let i = 1;
        let stateKey = `mrRadioGroup${i}`;
        while (Object.prototype.hasOwnProperty.call(rootState, stateKey)) {
            i += 1;
            stateKey = `mrRadioGroup${i}`;
        }
        const children = schema.children as Array<SchemaNode> | undefined;
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
