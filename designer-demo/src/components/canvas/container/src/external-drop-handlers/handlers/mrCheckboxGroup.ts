import type { Node } from '@/components/canvas/types';
import type { ExternalDropServices } from '../types';
import { allocateIndexedKey, getClonedPageState } from '../utils';

/** MrCheckboxGroup：v-model 绑定数组 state */
export function handleMrCheckboxGroupExternalDrop(
    insertData: Node,
    { getSchema, updateSchema }: ExternalDropServices
): void {
    const stateObj = getClonedPageState(getSchema);
    const stateKey = allocateIndexedKey(stateObj, 'mrCheckboxGroup');

    stateObj[stateKey] = [];
    updateSchema({ state: stateObj });

    insertData.props = insertData.props || {};
    insertData.props.modelValue = {
        type: 'JSExpression',
        value: `this.state.${stateKey}`,
        model: true
    };
}
