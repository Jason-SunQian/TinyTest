import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

import type { RootStateBag, SchemaNode } from './types';

export function patchMrCollapseModelBinding(
    schema: SchemaNode,
    rootState: RootStateBag
): void {
    const props = (schema.props as Record<string, unknown>) || {};
    if (!schema.props) schema.props = props;
    const mv = props.modelValue;
    if (!isModelValueJsExpression(mv)) {
        const stateKey = allocateIndexedStateKey(rootState, 'mrCollapse');
        rootState[stateKey] = Array.isArray(mv) ? mv : ['0'];
        props.modelValue = {
            type: 'JSExpression',
            value: `this.state.${stateKey}`,
            model: true
        };
    }
}
