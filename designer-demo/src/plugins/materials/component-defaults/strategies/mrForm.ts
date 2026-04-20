import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

type MethodMap = Record<
    string,
    {
        type: 'JSFunction';
        value: string;
    }
>;

type SchemaNodeLike = {
    componentName?: string;
    props?: Record<string, unknown>;
    children?: SchemaNodeLike[] | unknown;
};

const MR_FORM_FIELD_EXPR = /^this\.state\.(mrForm\d+)\.(.+)$/;

/** 外部拖拽 MrForm 时：注入嵌套 state + demo methods（保留历史行为） */
export function buildMrFormExternalDropPatch(
    insertData: SchemaNodeLike,
    rootState: Record<string, unknown>,
    currentMethods?: unknown
): { nextState: Record<string, unknown>; nextMethods: MethodMap } {
    const stateKey = allocateIndexedStateKey(rootState, 'mrForm');
    const formState: Record<string, unknown> = {};
    if (Array.isArray(insertData.children)) {
        insertData.children.forEach((child, idx) => {
            if (
                child?.componentName !== 'MpInput' &&
                child?.componentName !== 'MrField'
            )
                return;
            const fieldName =
                typeof child?.props?.name === 'string' &&
                child.props.name.trim()
                    ? child.props.name.trim()
                    : `field${idx + 1}`;
            formState[fieldName] = child?.props?.modelValue ?? '';
            child.props = child.props || {};
            child.props.modelValue = {
                type: 'JSExpression',
                value: `this.state.${stateKey}.${fieldName}`,
                model: true
            };
        });
    }

    const nextState = {
        ...rootState,
        [stateKey]: formState,
        demoFormTargetKey: stateKey,
        formDemoSubmitEnabled: false,
        formDemoLastSubmit: null
    };

    const methodsPrev =
        currentMethods && typeof currentMethods === 'object'
            ? { ...(currentMethods as MethodMap) }
            : {};
    if (!methodsPrev.onDemoFormRecalculateSubmit) {
        methodsPrev.onDemoFormRecalculateSubmit = {
            type: 'JSFunction',
            value:
                'function onDemoFormRecalculateSubmit(value) {\n' +
                '  var key = this.state.demoFormTargetKey;\n' +
                '  var form = key && this.state[key] ? this.state[key] : {};\n' +
                "  var fullName = String(form.fullName != null ? form.fullName : '').trim();\n" +
                "  var email = String(form.email != null ? form.email : '').trim();\n" +
                "  var amount = String(form.amount != null ? form.amount : '').trim();\n" +
                '  var emailOk = email.length > 0 && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);\n' +
                '  this.state.formDemoSubmitEnabled = !!(fullName && emailOk && amount);\n' +
                '}\n'
        };
    }
    if (!methodsPrev.onDemoFormSubmit) {
        methodsPrev.onDemoFormSubmit = {
            type: 'JSFunction',
            value:
                'function onDemoFormSubmit(values) {\n' +
                '  this.state.formDemoLastSubmit = values || {};\n' +
                "  console.log('[demo] mr-form submit', values);\n" +
                '}\n'
        };
    }

    return { nextState, nextMethods: methodsPrev };
}

/** 保存/预览补丁：兜底子字段绑定与 state */
export function syncMrFormModelValueAndState(
    schema: SchemaNodeLike,
    rootState: Record<string, unknown>
): void {
    const children = schema.children as SchemaNodeLike[] | undefined;

    const getStateKeyFromChild = (ch: SchemaNodeLike): string | null => {
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
