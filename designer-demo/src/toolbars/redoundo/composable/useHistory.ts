/* metaService: engine.service.history.useHistory */
import { reactive, isProxy, toRaw } from 'vue';
import { useCanvas } from '@opentiny/tiny-engine-meta-register';

const schema2String = (schema: unknown): string => {
    const rawSchema = isProxy(schema) ? toRaw(schema) : schema;
    return JSON.stringify(rawSchema);
};

const string2Schema = (value: string): Record<string, unknown> => {
    try {
        return JSON.parse(value) as Record<string, unknown>;
    } catch {
        return {};
    }
};

const list: string[] = [];
const maxLength = 20;
const historyState = reactive({
    index: 0,
    back: false,
    forward: false
});

const refreshNavState = () => {
    historyState.back = historyState.index > 0;
    historyState.forward = historyState.index < list.length - 1;
};

const push = (schema: unknown) => {
    const nextSnapshot = schema2String(schema);

    if (historyState.index < list.length - 1) {
        list.splice(historyState.index + 1);
    }
    const { length } = list;

    if (length >= maxLength) {
        list.splice(0, length - maxLength + 1);
    }

    if (list[list.length - 1] === nextSnapshot) {
        refreshNavState();
        return;
    }

    list.push(nextSnapshot);
    historyState.index = list.length - 1;
    refreshNavState();
};

const go = (addend: number, valid?: boolean) => {
    const nextIndex = historyState.index + addend;
    if (nextIndex < 0 || nextIndex >= list.length) {
        refreshNavState();
        return;
    }

    historyState.index = nextIndex;
    const canvas = useCanvas();
    const { pageState } = canvas as { pageState?: Record<string, unknown> };
    const pageSchema = string2Schema(list[historyState.index]);

    canvas.resetCanvasState({
        ...(pageState || {}),
        pageSchema,
        loading: false
    });

    // 与官方语义保持一致：用于 lock 弹窗场景
    if (typeof valid === 'boolean') {
        list.splice(1, 1);
    }

    refreshNavState();
};

const back = () => {
    if (historyState.back) {
        go(-1);
    }
};

const forward = () => {
    if (historyState.forward) {
        go(1);
    }
};

const clear = () => {
    list.splice(0);
    Object.assign(historyState, {
        index: 0,
        back: false,
        forward: false
    });
    refreshNavState();
};

const addHistory = (schema?: unknown) => {
    if (!schema) {
        push(useCanvas().getSchema());
    } else {
        clear();
        push(schema);
    }
};

const useCustomHistory = () => {
    refreshNavState();
    return {
        historyServiceSource: 'custom-redoundo-history',
        historyState,
        back,
        forward,
        go,
        addHistory
    };
};

export default useCustomHistory;
