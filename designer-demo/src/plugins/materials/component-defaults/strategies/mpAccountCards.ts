/**
 * MpAccountCards: defineModel() PaymentValue + defineModel('ccy') + defineModel('balance').
 * Bind this.state.mpAccountCardsFormN.{account,ccy,balance}
 * (account: {}, ccy/balance: ''; never hardcode demo account in snippet).
 */

import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

const RE_ACCOUNT = /^this\.state\.(mpAccountCardsForm\d+)\.account$/;
const RE_CCY = /^this\.state\.(mpAccountCardsForm\d+)\.ccy$/;
const RE_BALANCE = /^this\.state\.(mpAccountCardsForm\d+)\.balance$/;

function getExpr(prop: unknown): string | undefined {
    if (!isModelValueJsExpression(prop)) return undefined;
    const v = (prop as { value?: unknown }).value;
    return typeof v === 'string' ? v.trim() : undefined;
}

function isManaged(
    accountExpr: string | undefined,
    ccyExpr: string | undefined,
    balanceExpr: string | undefined
): boolean {
    if (accountExpr && !RE_ACCOUNT.test(accountExpr)) return false;
    if (ccyExpr && !RE_CCY.test(ccyExpr)) return false;
    if (balanceExpr && !RE_BALANCE.test(balanceExpr)) return false;
    return true;
}

function parseFormKey(
    accountExpr: string | undefined,
    ccyExpr: string | undefined,
    balanceExpr: string | undefined
): string | null {
    const keys = [
        accountExpr?.match(RE_ACCOUNT)?.[1],
        ccyExpr?.match(RE_CCY)?.[1],
        balanceExpr?.match(RE_BALANCE)?.[1]
    ].filter(Boolean) as string[];
    if (!keys.length) return null;
    if (keys.some(k => k !== keys[0])) return null;
    return keys[0];
}

function ensureForm(rootState: Record<string, unknown>, formKey: string): void {
    const cur = rootState[formKey];
    if (!cur || typeof cur !== 'object' || Array.isArray(cur)) {
        rootState[formKey] = { account: {}, ccy: '', balance: '' };
        return;
    }
    const o = cur as Record<string, unknown>;
    if (
        !Object.prototype.hasOwnProperty.call(o, 'account') ||
        !o.account ||
        typeof o.account !== 'object' ||
        Array.isArray(o.account)
    ) {
        o.account = {};
    }
    if (!Object.prototype.hasOwnProperty.call(o, 'ccy')) o.ccy = '';
    if (!Object.prototype.hasOwnProperty.call(o, 'balance')) o.balance = '';
}

/**
 * @returns whether props were rewritten
 */
export function syncMpAccountCardsModelPropsAndState(
    props: Record<string, unknown>,
    rootState: Record<string, unknown>
): boolean {
    const accountExpr = getExpr(props.modelValue);
    const ccyExpr = getExpr(props.ccy);
    const balanceExpr = getExpr(props.balance);

    if (!isManaged(accountExpr, ccyExpr, balanceExpr)) {
        return false;
    }

    let formKey = parseFormKey(accountExpr, ccyExpr, balanceExpr);
    if (!formKey) {
        formKey = allocateIndexedStateKey(rootState, 'mpAccountCardsForm');
    }
    ensureForm(rootState, formKey);

    props.modelValue = {
        type: 'JSExpression',
        value: `this.state.${formKey}.account`,
        model: true
    };
    props.ccy = {
        type: 'JSExpression',
        value: `this.state.${formKey}.ccy`,
        model: { prop: 'ccy' }
    };
    props.balance = {
        type: 'JSExpression',
        value: `this.state.${formKey}.balance`,
        model: { prop: 'balance' }
    };

    return true;
}
