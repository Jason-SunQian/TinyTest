import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

import type { RootStateBag, SchemaNode } from './types';

export function patchMpCountryInputModelBinding(
    schema: SchemaNode,
    rootState: RootStateBag
): void {
    const props = (schema.props as Record<string, unknown>) || {};
    if (!schema.props) schema.props = props;
    const mv = props.modelValue;

    if (isModelValueJsExpression(mv)) {
        const exprVal = (mv as Record<string, unknown>).value;
        if (typeof exprVal === 'string') {
            const m = /^this\.state\.(mpCountryInput\d+)$/.exec(exprVal.trim());
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

    const stateKey = allocateIndexedStateKey(rootState, 'mpCountryInput');
    rootState[stateKey] = mv === undefined || mv === '' ? '' : mv;
    props.modelValue = {
        type: 'JSExpression',
        value: `this.state.${stateKey}`,
        model: true
    };
}
