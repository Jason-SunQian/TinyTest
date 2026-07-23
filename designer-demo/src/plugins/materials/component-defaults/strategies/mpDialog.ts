import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

const RE_DIALOG_SHOW = /^this\.state\.(mpDialog\d+)$/;

/**
 * MpDialog uses defineModel('show') → outcode v-model:show.
 * Bind props.show to this.state.mpDialogN (default true for easier first preview).
 */
export function syncMpDialogShowAndState(
    props: Record<string, unknown>,
    rootState: Record<string, unknown>
): void {
    const showProp = props.show;

    if (isModelValueJsExpression(showProp)) {
        const exprVal = (showProp as Record<string, unknown>).value;
        if (typeof exprVal === 'string') {
            const m = RE_DIALOG_SHOW.exec(exprVal.trim());
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

    const stateKey = allocateIndexedStateKey(rootState, 'mpDialog');
    rootState[stateKey] =
        showProp === undefined || showProp === '' ? true : Boolean(showProp);
    props.show = {
        type: 'JSExpression',
        value: `this.state.${stateKey}`,
        model: { prop: 'show' }
    };
}
