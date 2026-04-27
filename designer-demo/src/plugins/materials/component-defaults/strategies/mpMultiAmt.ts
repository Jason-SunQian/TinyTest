/**
 * MpMultiAmt 在设计器中的绑定策略（拖拽落盘 / generateNode / 保存补丁共用）。
 * 归档在 materials/component-defaults 下，明确这是组件默认演示配置的一部分。
 */

import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

const RE_FORM_PAYER = /^this\.state\.(mpMultiAmtForm\d+)\.payerAmount$/;
const RE_FORM_PAYEE = /^this\.state\.(mpMultiAmtForm\d+)\.payeeAmount$/;
const RE_LEGACY_PAYEE = /^this\.state\.(mpMultiAmt\d+)$/;
const RE_LIMIT_RULE = /^this\.state\.(mpMultiAmtLimitRule\d+)$/;
// 默认拖拽时保持空值，避免组件初始 immediate 校验直接显示错误文案
const DEFAULT_PAYER_AMOUNT = '';
const DEFAULT_PAYEE_AMOUNT = '';

export function getMpMultiAmtJsExpressionValue(
    prop: unknown
): string | undefined {
    if (!isModelValueJsExpression(prop)) return undefined;
    const v = (prop as { value?: unknown }).value;
    return typeof v === 'string' ? v.trim() : undefined;
}

export function isManagedMpMultiAmtPayerExpression(expr: string): boolean {
    return RE_FORM_PAYER.test(expr);
}

export function isManagedMpMultiAmtPayeeExpression(expr: string): boolean {
    return RE_FORM_PAYEE.test(expr) || RE_LEGACY_PAYEE.test(expr);
}

export function isManagedMpMultiAmtLimitRuleExpression(expr: string): boolean {
    return RE_LIMIT_RULE.test(expr);
}

/** 已绑定到业务 state（如 payBillInfo）等非托管路径时不改写，避免覆盖用户出码 */
export function shouldSkipMpMultiAmtAutoBind(
    payerExpr: string | undefined,
    payeeExpr: string | undefined
): boolean {
    if (payeeExpr && !isManagedMpMultiAmtPayeeExpression(payeeExpr)) return true;
    if (payerExpr && !isManagedMpMultiAmtPayerExpression(payerExpr)) return true;
    return false;
}

export function parseMpMultiAmtFormKey(
    payerExpr: string | undefined,
    payeeExpr: string | undefined
): string | null {
    const fkP = payerExpr?.match(RE_FORM_PAYER)?.[1];
    const fkPy = payeeExpr?.match(RE_FORM_PAYEE)?.[1];
    if (fkP && fkPy && fkP !== fkPy) return null;
    return fkP || fkPy || null;
}

export function parseMpMultiAmtLimitRuleKey(
    limitExpr: string | undefined
): string | null {
    if (!limitExpr) return null;
    return limitExpr.match(RE_LIMIT_RULE)?.[1] ?? null;
}

export function defaultMpMultiAmtLimitRule(): Record<string, unknown> {
    return {
        amount: { max: '99999999999', min: '0', ccy: 'KES' }
    };
}

export function ensureMpMultiAmtFormState(
    rootState: Record<string, unknown>,
    formKey: string
): void {
    const cur = rootState[formKey];
    if (!cur || typeof cur !== 'object' || Array.isArray(cur)) {
        rootState[formKey] = {
            payerAmount: DEFAULT_PAYER_AMOUNT,
            payeeAmount: DEFAULT_PAYEE_AMOUNT
        };
        return;
    }
    const o = cur as Record<string, unknown>;
    if (!Object.prototype.hasOwnProperty.call(o, 'payerAmount')) {
        o.payerAmount = DEFAULT_PAYER_AMOUNT;
    }
    if (!Object.prototype.hasOwnProperty.call(o, 'payeeAmount')) {
        o.payeeAmount = DEFAULT_PAYEE_AMOUNT;
    }
}

export function ensureMpMultiAmtLimitRuleState(
    rootState: Record<string, unknown>,
    ruleKey: string
): void {
    if (!Object.prototype.hasOwnProperty.call(rootState, ruleKey)) {
        rootState[ruleKey] = defaultMpMultiAmtLimitRule();
    }
}

/**
 * 为画布/保存补丁同步 props 与 page state；调用方负责把 rootState 写回 schema。
 * @returns 是否改写了 props（托管绑定路径）
 */
export function syncMpMultiAmtModelPropsAndState(
    props: Record<string, unknown>,
    rootState: Record<string, unknown>
): boolean {
    const payerExpr = getMpMultiAmtJsExpressionValue(props.payerVal);
    const payeeExpr = getMpMultiAmtJsExpressionValue(props.payeeVal);
    const limitExpr = getMpMultiAmtJsExpressionValue(props.limitRule);

    if (shouldSkipMpMultiAmtAutoBind(payerExpr, payeeExpr)) {
        return false;
    }

    let formKey = parseMpMultiAmtFormKey(payerExpr, payeeExpr);
    if (!formKey) {
        formKey = allocateIndexedStateKey(rootState, 'mpMultiAmtForm');
    }
    ensureMpMultiAmtFormState(rootState, formKey);
    props.payerVal = {
        type: 'JSExpression',
        value: `this.state.${formKey}.payerAmount`,
        model: { prop: 'payerVal' }
    };
    props.payeeVal = {
        type: 'JSExpression',
        value: `this.state.${formKey}.payeeAmount`,
        model: { prop: 'payeeVal' }
    };

    // 不再为 limitRule 自动创建默认 state（例如 mpMultiAmtLimitRule1）。
    // 该规则应由页面业务逻辑显式提供，避免出码出现来源不明的初始化配置。
    // 若用户已手动绑定 props.limitRule，这里保持原值不改写。
    void limitExpr;

    return true;
}
