import type { Node } from '@/components/canvas/types';
import { allocateIndexedStateKey } from '@/composable/modelBindingShared';
import type { ExternalDropServices } from '../types';
import { getClonedPageState } from '../utils';

/** MrForm：子 MpInput/MrField 绑定到嵌套 state + 演示 methods */
export function handleMrFormExternalDrop(
    insertData: Node,
    { getSchema, updateSchema }: ExternalDropServices
): void {
    const rootSchema = getSchema();
    const stateObj = getClonedPageState(getSchema);
    const stateKey = allocateIndexedStateKey(stateObj, 'mrForm');

    const formState: Record<string, unknown> = {};
    if (Array.isArray(insertData.children)) {
        insertData.children.forEach((child: any, idx: number) => {
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
    stateObj[stateKey] = formState;
    stateObj.demoFormTargetKey = stateKey;
    stateObj.formDemoSubmitEnabled = false;
    stateObj.formDemoLastSubmit = null;

    const methodsPrev =
        rootSchema &&
        typeof rootSchema === 'object' &&
        (rootSchema as any).methods &&
        typeof (rootSchema as any).methods === 'object'
            ? { ...(rootSchema as any).methods }
            : {};
    if (!(methodsPrev as any).onDemoFormRecalculateSubmit) {
        (methodsPrev as any).onDemoFormRecalculateSubmit = {
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
    if (!(methodsPrev as any).onDemoFormSubmit) {
        (methodsPrev as any).onDemoFormSubmit = {
            type: 'JSFunction',
            value:
                'function onDemoFormSubmit(values) {\n' +
                '  this.state.formDemoLastSubmit = values || {};\n' +
                "  console.log('[demo] mr-form submit', values);\n" +
                '}\n'
        };
    }

    updateSchema({ state: stateObj, methods: methodsPrev });
}
