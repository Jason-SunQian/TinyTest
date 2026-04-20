import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

type SchemaNodeLike = {
    componentName?: string;
    props?: Record<string, unknown>;
    children?: SchemaNodeLike[] | unknown;
    loop?: unknown;
    loopArgs?: string[];
};

export function syncMrCollapseModelValueAndState(
    props: Record<string, unknown>,
    rootState: Record<string, unknown>
): void {
    const mv = props.modelValue;
    if (!isModelValueJsExpression(mv)) {
        const stateKey = allocateIndexedStateKey(rootState, 'mrCollapse');
        rootState[stateKey] = Array.isArray(mv) ? mv : ['0'];
        props.modelValue = {
            type: 'JSExpression',
            value: `this.state.${stateKey}`,
            model: true
        };
    }
}

/** 仅供外部拖拽：保留历史 loop 示例注入行为 */
export function applyMrCollapseExternalDropLoopDemo(
    insertData: SchemaNodeLike,
    rootState: Record<string, unknown>
): void {
    let i = 1;
    let stateKey = `mrCollapse${i}`;
    while (Object.prototype.hasOwnProperty.call(rootState, stateKey)) {
        i += 1;
        stateKey = `mrCollapse${i}`;
    }
    const listStateKey = `mrCollapseItems${i}`;

    insertData.props = insertData.props || {};
    const mv = insertData.props.modelValue;
    rootState[stateKey] = Array.isArray(mv) ? mv : ['0'];
    rootState[listStateKey] = [
        { id: '1', title: 'Item 1', value: 'Value 1', content: 'Content 1' },
        { id: '2', title: 'Item 2', value: 'Value 2', content: 'Content 2' }
    ];
    insertData.props.modelValue = {
        type: 'JSExpression',
        value: `this.state.${stateKey}`,
        model: true
    };

    const firstChild = Array.isArray(insertData.children)
        ? insertData.children[0]
        : undefined;
    if (firstChild && firstChild.componentName === 'MrCollapseItem') {
        firstChild.loop = {
            type: 'JSExpression',
            value: `this.state.${listStateKey}`
        };
        firstChild.loopArgs = ['item', 'index'];
        firstChild.props = firstChild.props || {};
        firstChild.props.key = {
            type: 'JSExpression',
            value: 'item.id || index'
        };
        firstChild.props.name = {
            type: 'JSExpression',
            value: 'item.id'
        };
        firstChild.props.title = {
            type: 'JSExpression',
            value: 'item.title'
        };
        firstChild.props.value = {
            type: 'JSExpression',
            value: 'item.value'
        };
        if (Array.isArray(firstChild.children) && firstChild.children[0]) {
            const [textNode] = firstChild.children;
            if (textNode.componentName === 'Text') {
                textNode.props = textNode.props || {};
                textNode.props.text = {
                    type: 'JSExpression',
                    value: 'item.content'
                };
            }
        }
    }
}
