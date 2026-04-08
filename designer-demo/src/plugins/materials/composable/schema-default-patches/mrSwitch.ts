import type { RootStateBag, SchemaNode } from './types';

export function patchMrSwitchModelBinding(
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
        let stateKey = `mrSwitch${i}`;
        while (Object.prototype.hasOwnProperty.call(rootState, stateKey)) {
            i += 1;
            stateKey = `mrSwitch${i}`;
        }
        rootState[stateKey] = mv === undefined || mv === '' ? false : mv;
        props.modelValue = {
            type: 'JSExpression',
            value: `this.state.${stateKey}`,
            model: true
        };
    }
}
