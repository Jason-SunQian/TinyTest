/**
 * MpTransSummary: required transactionInfo object prop (not v-model).
 * Bind this.state.mpTransSummaryN = {} (never hardcode demo txn in snippet).
 */

import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

const RE_KEYS = /^this\.state\.(mpTransSummary\d+)$/;

export function syncMpTransSummaryTransactionInfoAndState(
    props: Record<string, unknown>,
    rootState: Record<string, unknown>
): void {
    const info = props.transactionInfo;

    if (isModelValueJsExpression(info)) {
        const exprVal = (info as Record<string, unknown>).value;
        if (typeof exprVal === 'string') {
            const m = RE_KEYS.exec(exprVal.trim());
            const [, stateKey] = m ?? [];
            if (
                typeof stateKey === 'string' &&
                stateKey &&
                !Object.prototype.hasOwnProperty.call(rootState, stateKey)
            ) {
                rootState[stateKey] = {};
            }
        }
        return;
    }

    const stateKey = allocateIndexedStateKey(rootState, 'mpTransSummary');
    rootState[stateKey] =
        info && typeof info === 'object' && !Array.isArray(info) ? info : {};
    // Not v-model — omit model: true
    props.transactionInfo = {
        type: 'JSExpression',
        value: `this.state.${stateKey}`
    };
}
