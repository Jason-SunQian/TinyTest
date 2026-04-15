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

    const firstRadio = Array.isArray(insertData.children)
        ? (insertData.children.find(
              (childRaw: unknown) =>
                  (childRaw as { componentName?: string })?.componentName ===
                  'MrRadio'
          ) as { props?: { name?: unknown } } | undefined)
        : undefined;
    const firstRadioName = firstRadio?.props?.name;
    stateObj[stateKey] = firstRadioName ?? '';
    updateSchema({ state: stateObj });

    insertData.props = insertData.props || {};
    insertData.props.modelValue = {
        type: 'JSExpression',
        value: `this.state.${stateKey}`,
        model: true
    };
}
