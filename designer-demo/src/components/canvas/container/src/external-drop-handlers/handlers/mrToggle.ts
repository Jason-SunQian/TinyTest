import type { Node } from '@/components/canvas/types';
import { allocateIndexedStateKey } from '@/composable/modelBindingShared';

import type { ExternalDropServices } from '../types';
import { getClonedPageState } from '../utils';

/** MrToggle：同 MrSwitch */
export function handleMrToggleExternalDrop(
    insertData: Node,
    { getSchema, updateSchema }: ExternalDropServices
): void {
    const stateObj = getClonedPageState(getSchema);
    const stateKey = allocateIndexedStateKey(stateObj, 'mrToggle');
    stateObj[stateKey] =
        insertData.props?.modelValue === undefined
            ? false
            : insertData.props.modelValue;
    updateSchema({ state: stateObj });

    insertData.props = insertData.props || {};
    insertData.props.modelValue = {
        type: 'JSExpression',
        value: `this.state.${stateKey}`,
        model: true
    };
}
