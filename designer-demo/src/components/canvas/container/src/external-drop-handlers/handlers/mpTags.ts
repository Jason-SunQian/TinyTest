import type { Node } from '@/components/canvas/types';
import { allocateIndexedStateKey } from '@/composable/modelBindingShared';
import type { ExternalDropServices } from '../types';
import { getClonedPageState } from '../utils';

/** MpTags：v-model + 拖拽即创建 state.mpTagsN（与 patch 兜底一致） */
export function handleMpTagsExternalDrop(
    insertData: Node,
    { getSchema, updateSchema }: ExternalDropServices
): void {
    const stateObj = getClonedPageState(getSchema);

    insertData.props = insertData.props || {};
    const mv = insertData.props.modelValue;

    let stateKey = '';
    if (mv && typeof mv === 'object' && (mv as { type?: string }).type === 'JSExpression') {
        const expr = String((mv as { value?: string }).value || '').trim();
        const m = /^this\.state\.(mpTags\d+)$/.exec(expr);
        if (m?.[1]) stateKey = m[1];
    }

    if (!stateKey) {
        stateKey = allocateIndexedStateKey(stateObj, 'mpTags');
    }

    const defaultVal =
        typeof mv === 'string' || typeof mv === 'number' ? String(mv) : '1';
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
