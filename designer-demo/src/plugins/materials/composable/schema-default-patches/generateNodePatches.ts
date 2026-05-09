import { useCanvas } from '@opentiny/tiny-engine-meta-register';

import { syncMpMultiAmtModelPropsAndState } from '@/plugins/materials/component-defaults/strategies/mpMultiAmt';
import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

import type { SchemaNode } from './types';

/**
 * generateNode 阶段：在合并 snippet 后、返回节点前，补齐页面 state（如 MpTags 与 snippet 已绑 mpTags1）。
 */
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
            ?.modelValue;
        const mvExpr = isModelValueJsExpression(mv)
            ? (mv as Record<string, unknown>).value
            : undefined;
        const m =
            typeof mvExpr === 'string'
                ? /^this\.state\.(mpTags\d+)$/.exec(mvExpr.trim())
                : null;
        let stateKey = m?.[1] || '';
        if (!stateKey) {
            stateKey = allocateIndexedStateKey(rootState, 'mpTags');
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

function patchGenerateNodeMpCountryInput(schema: SchemaNode): void {
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

        const props =
            (schema.props as Record<string, unknown> | undefined) || {};
        if (!schema.props) schema.props = props;
        const mv = props.modelValue;
        const mvExpr = isModelValueJsExpression(mv)
            ? (mv as Record<string, unknown>).value
            : undefined;
        const m =
            typeof mvExpr === 'string'
                ? /^this\.state\.(mpCountryInput\d+)$/.exec(mvExpr.trim())
                : null;
        let stateKey = m?.[1] || '';
        if (!stateKey) {
            stateKey = allocateIndexedStateKey(rootState, 'mpCountryInput');
            props.modelValue = {
                type: 'JSExpression',
                value: `this.state.${stateKey}`,
                model: true
            };
        }
        if (
            stateKey &&
            !Object.prototype.hasOwnProperty.call(rootState, stateKey)
        ) {
            rootState[stateKey] = '';
        }
    } catch {
        /* 与原先 generateNode 一致：静默失败 */
    }
}

function patchGenerateNodeMpBankInput(schema: SchemaNode): void {
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

        const props =
            (schema.props as Record<string, unknown> | undefined) || {};
        if (!schema.props) schema.props = props;
        const mv = props.modelValue;
        const mvExpr = isModelValueJsExpression(mv)
            ? (mv as Record<string, unknown>).value
            : undefined;
        const m =
            typeof mvExpr === 'string'
                ? /^this\.state\.(mpBankInput\d+)$/.exec(mvExpr.trim())
                : null;
        let stateKey = m?.[1] || '';
        if (!stateKey) {
            stateKey = allocateIndexedStateKey(rootState, 'mpBankInput');
            props.modelValue = {
                type: 'JSExpression',
                value: `this.state.${stateKey}`,
                model: true
            };
        }
        if (
            stateKey &&
            !Object.prototype.hasOwnProperty.call(rootState, stateKey)
        ) {
            rootState[stateKey] = '';
        }
    } catch {
        /* 与原先 generateNode 一致：静默失败 */
    }
}

function patchGenerateNodeMpCityInput(schema: SchemaNode): void {
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

        const props =
            (schema.props as Record<string, unknown> | undefined) || {};
        if (!schema.props) schema.props = props;
        const mv = props.modelValue;
        const mvExpr = isModelValueJsExpression(mv)
            ? (mv as Record<string, unknown>).value
            : undefined;
        const m =
            typeof mvExpr === 'string'
                ? /^this\.state\.(mpCityInput\d+)$/.exec(mvExpr.trim())
                : null;
        let stateKey = m?.[1] || '';
        if (!stateKey) {
            stateKey = allocateIndexedStateKey(rootState, 'mpCityInput');
            props.modelValue = {
                type: 'JSExpression',
                value: `this.state.${stateKey}`,
                model: true
            };
        }
        if (
            stateKey &&
            !Object.prototype.hasOwnProperty.call(rootState, stateKey)
        ) {
            rootState[stateKey] = '';
        }
    } catch {
        /* 与原先 generateNode 一致：静默失败 */
    }
}

function patchGenerateNodeMpDictInput(schema: SchemaNode): void {
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

        const props =
            (schema.props as Record<string, unknown> | undefined) || {};
        if (!schema.props) schema.props = props;
        const mv = props.modelValue;
        const mvExpr = isModelValueJsExpression(mv)
            ? (mv as Record<string, unknown>).value
            : undefined;
        const m =
            typeof mvExpr === 'string'
                ? /^this\.state\.(mpDictInput\d+)$/.exec(mvExpr.trim())
                : null;
        let stateKey = m?.[1] || '';
        if (!stateKey) {
            stateKey = allocateIndexedStateKey(rootState, 'mpDictInput');
            props.modelValue = {
                type: 'JSExpression',
                value: `this.state.${stateKey}`,
                model: true
            };
        }
        if (
            stateKey &&
            !Object.prototype.hasOwnProperty.call(rootState, stateKey)
        ) {
            rootState[stateKey] = '';
        }
    } catch {
        /* 与原先 generateNode 一致：静默失败 */
    }
}

function patchGenerateNodeMpTextarea(schema: SchemaNode): void {
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

        const props =
            (schema.props as Record<string, unknown> | undefined) || {};
        if (!schema.props) schema.props = props;
        const mv = props.modelValue;
        const mvExpr = isModelValueJsExpression(mv)
            ? (mv as Record<string, unknown>).value
            : undefined;
        const m =
            typeof mvExpr === 'string'
                ? /^this\.state\.(mpTextarea\d+)$/.exec(mvExpr.trim())
                : null;
        let stateKey = m?.[1] || '';
        if (!stateKey) {
            stateKey = allocateIndexedStateKey(rootState, 'mpTextarea');
            props.modelValue = {
                type: 'JSExpression',
                value: `this.state.${stateKey}`,
                model: true
            };
        }
        if (
            stateKey &&
            !Object.prototype.hasOwnProperty.call(rootState, stateKey)
        ) {
            rootState[stateKey] = '';
        }
    } catch {
        /* 与原先 generateNode 一致：静默失败 */
    }
}

function patchGenerateNodeMpMobileInput(schema: SchemaNode): void {
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

        const props =
            (schema.props as Record<string, unknown> | undefined) || {};
        if (!schema.props) schema.props = props;
        const mv = props.modelValue;
        const mvExpr = isModelValueJsExpression(mv)
            ? (mv as Record<string, unknown>).value
            : undefined;
        const m =
            typeof mvExpr === 'string'
                ? /^this\.state\.(mpMobileInput\d+)$/.exec(mvExpr.trim())
                : null;
        let stateKey = m?.[1] || '';
        if (!stateKey) {
            stateKey = allocateIndexedStateKey(rootState, 'mpMobileInput');
            props.modelValue = {
                type: 'JSExpression',
                value: `this.state.${stateKey}`,
                model: true
            };
        }
        if (
            stateKey &&
            !Object.prototype.hasOwnProperty.call(rootState, stateKey)
        ) {
            rootState[stateKey] = '';
        }
    } catch {
        /* 与原先 generateNode 一致：静默失败 */
    }
}

function patchGenerateNodeMpMultiAmt(schema: SchemaNode): void {
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

        const props =
            (schema.props as Record<string, unknown> | undefined) || {};
        if (!schema.props) schema.props = props;
        syncMpMultiAmtModelPropsAndState(props, rootState);
    } catch {
        /* 与原先 generateNode 一致：静默失败 */
    }
}

function applyGenerateNodeModelPatches(
    component: string,
    schema: SchemaNode
): void {
    if (component === 'MpTags') {
        patchGenerateNodeMpTags(schema);
    } else if (component === 'MpMultiAmt') {
        patchGenerateNodeMpMultiAmt(schema);
    } else if (component === 'MpMobileInput') {
        patchGenerateNodeMpMobileInput(schema);
    } else if (component === 'MpTextarea') {
        patchGenerateNodeMpTextarea(schema);
    } else if (component === 'MpDictInput') {
        patchGenerateNodeMpDictInput(schema);
    } else if (component === 'MpBankInput') {
        patchGenerateNodeMpBankInput(schema);
    } else if (component === 'MpCityInput') {
        patchGenerateNodeMpCityInput(schema);
    } else if (component === 'MpCountryInput') {
        patchGenerateNodeMpCountryInput(schema);
    }
}

export { applyGenerateNodeModelPatches };
