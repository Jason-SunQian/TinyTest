import type { Node } from '@/components/canvas/types';
import { allocateIndexedStateKey } from '@/composable/modelBindingShared';
import type { ExternalDropServices } from '../types';
import { getClonedPageState } from '../utils';

/** MrRadioGroup：v-model + 默认选中首项 name */
export function handleMrRadioGroupExternalDrop(
    insertData: Node,
    { getSchema, updateSchema }: ExternalDropServices
): void {
    const stateObj = getClonedPageState(getSchema);
    const stateKey = allocateIndexedStateKey(stateObj, 'mrRadioGroup');

    const firstRadioName = Array.isArray(insertData.children)
        ? insertData.children.find(
              (child: any) => child?.componentName === 'MrRadio'
          )?.props?.name
        : undefined;
    stateObj[stateKey] = firstRadioName ?? '';
    updateSchema({ state: stateObj });

    insertData.props = insertData.props || {};
    insertData.props.modelValue = {
        type: 'JSExpression',
        value: `this.state.${stateKey}`,
        model: true
    };
}
