import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

import type { RootStateBag, SchemaNode } from './types';

export function patchMrSwitchModelBinding(
    schema: SchemaNode,
    rootState: RootStateBag
): void {
    const props = (schema.props as Record<string, unknown>) || {};
    if (!schema.props) schema.props = props;
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
