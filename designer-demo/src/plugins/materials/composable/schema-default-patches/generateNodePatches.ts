import { useCanvas } from '@opentiny/tiny-engine-meta-register';

import type { SchemaNode } from './types';

/**
 * generateNode 阶段：在合并 snippet 后、返回节点前，补齐页面 state（如 MpTags 与 snippet 已绑 mpTags1）。
 */
export function applyGenerateNodeModelPatches(
    component: string,
    schema: SchemaNode
): void {
    if (component === 'MpTags') {
        patchGenerateNodeMpTags(schema);
    }
}

function patchGenerateNodeMpTags(schema: SchemaNode): void {
    try {
        const pageSchema = useCanvas().getSchema?.() as
            | { state?: Record<string, unknown> }
            | undefined;
        const rootState =
            pageSchema?.state &&
            typeof pageSchema.state === 'object' &&
            !Array.isArray(pageSchema.state)
                ? pageSchema.state
                : pageSchema
                ? ((pageSchema.state = {}) as Record<string, unknown>)
                : {};

        const mv = (schema.props as Record<string, unknown> | undefined)
            ?.modelValue as Record<string, unknown> | undefined;
        const mvExpr =
            mv && mv.type === 'JSExpression' ? mv.value : undefined;
        const m =
            typeof mvExpr === 'string'
                ? /^this\.state\.(mpTags\d+)$/.exec(mvExpr.trim())
                : null;
        let stateKey = m?.[1] || '';
        if (!stateKey) {
            let i = 1;
            stateKey = `mpTags${i}`;
            while (
                Object.prototype.hasOwnProperty.call(rootState, stateKey)
            ) {
                i += 1;
                stateKey = `mpTags${i}`;
            }
            (schema.props as Record<string, unknown>).modelValue = {
                type: 'JSExpression',
                value: `this.state.${stateKey}`,
                model: true
            };
        }
        if (
            stateKey &&
            !Object.prototype.hasOwnProperty.call(rootState, stateKey)
        ) {
            rootState[stateKey] = '1';
        }
    } catch {
        /* 与原先 generateNode 一致：静默失败 */
    }
}
