/**
 * MpDatePopup: defineModel('show') + defineModel() + defineModel('endDate').
 * Bind to this.state.mpDatePopupFormN.{visible,date,endDate}.
 */

import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

const RE_VISIBLE = /^this\.state\.(mpDatePopupForm\d+)\.visible$/;
const RE_DATE = /^this\.state\.(mpDatePopupForm\d+)\.date$/;
const RE_END = /^this\.state\.(mpDatePopupForm\d+)\.endDate$/;

function getExpr(prop: unknown): string | undefined {
    if (!isModelValueJsExpression(prop)) return undefined;
    const v = (prop as { value?: unknown }).value;
    return typeof v === 'string' ? v.trim() : undefined;
}

function isManaged(
    showExpr: string | undefined,
    dateExpr: string | undefined,
    endExpr: string | undefined
): boolean {
    if (showExpr && !RE_VISIBLE.test(showExpr)) return false;
    if (dateExpr && !RE_DATE.test(dateExpr)) return false;
    if (endExpr && !RE_END.test(endExpr)) return false;
    return true;
}

function parseFormKey(
    showExpr: string | undefined,
    dateExpr: string | undefined,
    endExpr: string | undefined
): string | null {
    const keys = [
        showExpr?.match(RE_VISIBLE)?.[1],
        dateExpr?.match(RE_DATE)?.[1],
        endExpr?.match(RE_END)?.[1]
    ].filter(Boolean) as string[];
    if (!keys.length) return null;
    if (keys.some(k => k !== keys[0])) return null;
    return keys[0];
}

function ensureForm(rootState: Record<string, unknown>, formKey: string): void {
    const cur = rootState[formKey];
    if (!cur || typeof cur !== 'object' || Array.isArray(cur)) {
        rootState[formKey] = {
            visible: true,
            // Runtime defineModel expects Date | undefined — never "".
            // JSON state uses null; Page JS / confirm can assign new Date().
            date: null,
            endDate: null
        };
        return;
    }
    const o = cur as Record<string, unknown>;
    if (!Object.prototype.hasOwnProperty.call(o, 'visible')) o.visible = true;
    if (!Object.prototype.hasOwnProperty.call(o, 'date') || o.date === '')
        o.date = null;
    if (
        !Object.prototype.hasOwnProperty.call(o, 'endDate') ||
        o.endDate === ''
    ) {
        o.endDate = null;
    }
}

/**
 * @returns whether props were rewritten
 */
export function syncMpDatePopupModelPropsAndState(
    props: Record<string, unknown>,
    rootState: Record<string, unknown>
): boolean {
    const showExpr = getExpr(props.show);
    const dateExpr = getExpr(props.modelValue);
    const endExpr = getExpr(props.endDate);

    if (!isManaged(showExpr, dateExpr, endExpr)) {
        return false;
    }

    let formKey = parseFormKey(showExpr, dateExpr, endExpr);
    if (!formKey) {
        formKey = allocateIndexedStateKey(rootState, 'mpDatePopupForm');
    }
    ensureForm(rootState, formKey);

    props.show = {
        type: 'JSExpression',
        value: `this.state.${formKey}.visible`,
        model: { prop: 'show' }
    };
    props.modelValue = {
        type: 'JSExpression',
        value: `this.state.${formKey}.date`,
        model: true
    };
    props.endDate = {
        type: 'JSExpression',
        value: `this.state.${formKey}.endDate`,
        model: { prop: 'endDate' }
    };

    return true;
}
