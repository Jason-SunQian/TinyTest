import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

const RE_POPUP_SHOW = /^this\.state\.(mpPopup\d+)$/;

/**
 * MpPopup uses defineModel('show') → outcode v-model:show.
 * Bind props.show to this.state.mpPopupN (default true for easier first preview).
 */
export function syncMpPopupShowAndState(
    props: Record<string, unknown>,
    rootState: Record<string, unknown>
): void {
    const showProp = props.show;

    if (isModelValueJsExpression(showProp)) {
        const exprVal = (showProp as Record<string, unknown>).value;
        if (typeof exprVal === 'string') {
            const m = RE_POPUP_SHOW.exec(exprVal.trim());
            const [, stateKey] = m ?? [];
            if (
                typeof stateKey === 'string' &&
                stateKey &&
                !Object.prototype.hasOwnProperty.call(rootState, stateKey)
            ) {
                rootState[stateKey] = true;
            }
        }
        return;
    }

    const stateKey = allocateIndexedStateKey(rootState, 'mpPopup');
    rootState[stateKey] =
        showProp === undefined || showProp === '' ? true : Boolean(showProp);
    props.show = {
        type: 'JSExpression',
        value: `this.state.${stateKey}`,
        model: { prop: 'show' }
    };
}
