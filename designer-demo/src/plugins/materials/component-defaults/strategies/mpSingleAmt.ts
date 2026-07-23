/**
 * MpSingleAmt designer binding: dual defineModel (modelValue + ccy).
 * Bind to this.state.mpSingleAmtFormN.{amount,ccy} with model / model:{prop:'ccy'}.
 */

import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

const RE_FORM_AMOUNT = /^this\.state\.(mpSingleAmtForm\d+)\.amount$/;
const RE_FORM_CCY = /^this\.state\.(mpSingleAmtForm\d+)\.ccy$/;
const DEFAULT_AMOUNT = '';
const DEFAULT_CCY = 'OMR';

function getExprValue(prop: unknown): string | undefined {
    if (!isModelValueJsExpression(prop)) return undefined;
    const v = (prop as { value?: unknown }).value;
    return typeof v === 'string' ? v.trim() : undefined;
}

function isManagedAmount(expr: string): boolean {
    return RE_FORM_AMOUNT.test(expr);
}

function isManagedCcy(expr: string): boolean {
    return RE_FORM_CCY.test(expr);
}

/** Skip when user already bound custom business state. */
function shouldSkip(
    amountExpr: string | undefined,
    ccyExpr: string | undefined
): boolean {
    if (amountExpr && !isManagedAmount(amountExpr)) return true;
    if (ccyExpr && !isManagedCcy(ccyExpr)) return true;
    return false;
}

function parseFormKey(
    amountExpr: string | undefined,
    ccyExpr: string | undefined
): string | null {
    const a = amountExpr?.match(RE_FORM_AMOUNT)?.[1];
    const c = ccyExpr?.match(RE_FORM_CCY)?.[1];
    if (a && c && a !== c) return null;
    return a || c || null;
}

function ensureFormState(
    rootState: Record<string, unknown>,
    formKey: string
): void {
    const cur = rootState[formKey];
    if (!cur || typeof cur !== 'object' || Array.isArray(cur)) {
        rootState[formKey] = {
            amount: DEFAULT_AMOUNT,
            ccy: DEFAULT_CCY
        };
        return;
    }
    const o = cur as Record<string, unknown>;
    if (!Object.prototype.hasOwnProperty.call(o, 'amount')) {
        o.amount = DEFAULT_AMOUNT;
    }
    if (!Object.prototype.hasOwnProperty.call(o, 'ccy')) {
        o.ccy = DEFAULT_CCY;
    }
}

/**
 * Sync props + page state for MpSingleAmt. Caller writes rootState back to schema.
 * @returns whether props were rewritten
 */
export function syncMpSingleAmtModelPropsAndState(
    props: Record<string, unknown>,
    rootState: Record<string, unknown>
): boolean {
    const amountExpr = getExprValue(props.modelValue);
    const ccyExpr = getExprValue(props.ccy);

    if (shouldSkip(amountExpr, ccyExpr)) {
        return false;
    }

    let formKey = parseFormKey(amountExpr, ccyExpr);
    if (!formKey) {
        formKey = allocateIndexedStateKey(rootState, 'mpSingleAmtForm');
    }
    ensureFormState(rootState, formKey);

    props.modelValue = {
        type: 'JSExpression',
        value: `this.state.${formKey}.amount`,
        model: true
    };
    props.ccy = {
        type: 'JSExpression',
        value: `this.state.${formKey}.ccy`,
        model: { prop: 'ccy' }
    };

    return true;
}
