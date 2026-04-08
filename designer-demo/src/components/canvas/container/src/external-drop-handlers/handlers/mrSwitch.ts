import type { Node } from '@/components/canvas/types';
import type { ExternalDropServices } from '../types';
import { allocateIndexedKey, getClonedPageState } from '../utils';

/** MrSwitch：v-model 语义 + 自动创建 page state（否则画布点动回弹） */
export function handleMrSwitchExternalDrop(
    insertData: Node,
    { getSchema, updateSchema }: ExternalDropServices
): void {
    const stateObj = getClonedPageState(getSchema);
    const stateKey = allocateIndexedKey(stateObj, 'mrSwitch');
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
