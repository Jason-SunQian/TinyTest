/**
 * 从物料面板拖入画布（外部拖入、无 sourceId）时，按组件名补 v-model / state 等演示语义。
 */

import type { Node } from '@/components/canvas/types';

export interface ExternalDropServices {
    getSchema: () => unknown;
    updateSchema: (partial: {
        state?: Record<string, unknown>;
        methods?: Record<string, unknown>;
    }) => void;
}

export type ExternalDropHandler = (
    insertData: Node,
    services: ExternalDropServices
) => void;
