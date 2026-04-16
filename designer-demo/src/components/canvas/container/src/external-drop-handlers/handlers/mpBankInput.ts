import { allocateIndexedStateKey } from '@/composable/modelBindingShared';
import type { Node } from '@/components/canvas/types';

import type { ExternalDropServices } from '../types';
import { getClonedPageState } from '../utils';

/** MpBankInput：v-model + 拖拽即创建 state.mpBankInputN */
export function handleMpBankInputExternalDrop(
    insertData: Node,
    { getSchema, updateSchema }: ExternalDropServices
): void {
    const stateObj = getClonedPageState(getSchema);

    insertData.props = insertData.props || {};
    const mv = insertData.props.modelValue;

    let stateKey = '';
    if (
        mv &&
        typeof mv === 'object' &&
        (mv as { type?: string }).type === 'JSExpression'
    ) {
        const expr = String((mv as { value?: string }).value || '').trim();
        const m = /^this\.state\.(mpBankInput\d+)$/.exec(expr);
        const [, matchedKey = ''] = m || [];
        if (matchedKey) stateKey = matchedKey;
    }

    if (!stateKey) {
        stateKey = allocateIndexedStateKey(stateObj, 'mpBankInput');
    }

    const defaultVal =
        typeof mv === 'string' || typeof mv === 'number' ? String(mv) : '';
    if (!Object.prototype.hasOwnProperty.call(stateObj, stateKey)) {
        stateObj[stateKey] = defaultVal;
    }
    updateSchema({ state: stateObj });

    insertData.props.modelValue = {
        type: 'JSExpression',
        value: `this.state.${stateKey}`,
        model: true
    };
}
