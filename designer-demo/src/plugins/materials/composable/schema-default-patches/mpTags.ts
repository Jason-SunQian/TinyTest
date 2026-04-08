import type { RootStateBag, SchemaNode } from './types';

export function patchMpTagsModelBinding(
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
    if (isExpr) {
        const exprVal = (mv as Record<string, unknown>).value;
        if (typeof exprVal === 'string') {
            const m = /^this\.state\.(mpTags\d+)$/.exec(exprVal.trim());
            const [, stateKey] = m ?? [];
            if (
                typeof stateKey === 'string' &&
                stateKey &&
                !Object.prototype.hasOwnProperty.call(rootState, stateKey)
            ) {
                rootState[stateKey] = '1';
            }
        }
    }
    if (!isExpr) {
        let i = 1;
        let stateKey = `mpTags${i}`;
        while (Object.prototype.hasOwnProperty.call(rootState, stateKey)) {
            i += 1;
            stateKey = `mpTags${i}`;
        }
        rootState[stateKey] = mv === undefined || mv === '' ? '1' : mv;
        props.modelValue = {
            type: 'JSExpression',
            value: `this.state.${stateKey}`,
            model: true
        };
    }
}
