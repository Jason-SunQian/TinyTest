import { allocateIndexedStateKey, isModelValueJsExpression } from '@/composable/modelBindingShared';

import type { RootStateBag, SchemaNode } from './types';

const MR_FORM_FIELD_EXPR = /^this\.state\.(mrForm\d+)\.(.+)$/;

export function patchMrFormModelBinding(
    schema: SchemaNode,
    rootState: RootStateBag
): void {
    const children = schema.children as Array<SchemaNode> | undefined;

    const getStateKeyFromChild = (ch: SchemaNode): string | null => {
        const component = ch?.componentName;
        if (component !== 'MpInput' && component !== 'MrField') return null;

        const mv = (ch.props as Record<string, unknown> | undefined)
            ?.modelValue;
        if (!isModelValueJsExpression(mv)) return null;

        const { value } = mv as Record<string, unknown>;
        if (typeof value !== 'string') return null;

        const m = MR_FORM_FIELD_EXPR.exec(value.trim());
        const [, candidate] = m ?? [];
        return typeof candidate === 'string' && candidate ? candidate : null;
    };

    let stateKey: string | null = null;
    if (Array.isArray(children)) {
        for (const ch of children) {
            const candidate = getStateKeyFromChild(ch);
            if (candidate) {
                stateKey = candidate;
                break;
            }
        }
    }
    if (!stateKey) {
        stateKey = allocateIndexedStateKey(rootState, 'mrForm');
    }

    const prevNest =
        rootState[stateKey] &&
        typeof rootState[stateKey] === 'object' &&
        !Array.isArray(rootState[stateKey])
            ? { ...(rootState[stateKey] as Record<string, unknown>) }
            : {};
    const formState: Record<string, unknown> = { ...prevNest };
    let touched = false;
    if (Array.isArray(children)) {
        children.forEach((child, idx) => {
            if (
                child?.componentName !== 'MpInput' &&
                child?.componentName !== 'MrField'
            )
                return;
            const childProps = (child.props as Record<string, unknown>) || {};
            if (!child.props) child.props = childProps;
            const fieldName =
                typeof childProps.name === 'string' && childProps.name.trim()
                    ? childProps.name.trim()
                    : `field${idx + 1}`;
            const mv = childProps.modelValue;
            if (!isModelValueJsExpression(mv)) {
                touched = true;
                childProps.modelValue = {
                    type: 'JSExpression',
                    value: `this.state.${stateKey}.${fieldName}`,
                    model: true
                };
                if (!(fieldName in formState)) {
                    formState[fieldName] =
                        mv === undefined || mv === null ? '' : mv;
                }
            }
            if (!(fieldName in formState)) {
                formState[fieldName] = isModelValueJsExpression(mv)
                    ? ''
                    : mv === undefined || mv === null
                    ? ''
                    : mv;
            }
        });
    }
    if (touched || Object.keys(formState).length > 0) {
        rootState[stateKey] = formState;
    }
    if (stateKey) {
        if (
            rootState.demoFormTargetKey === undefined ||
            rootState.demoFormTargetKey === ''
        ) {
            rootState.demoFormTargetKey = stateKey;
        }
        if (rootState.formDemoSubmitEnabled === undefined) {
            rootState.formDemoSubmitEnabled = false;
        }
        if (rootState.formDemoLastSubmit === undefined) {
            rootState.formDemoLastSubmit = null;
        }
    }
}
