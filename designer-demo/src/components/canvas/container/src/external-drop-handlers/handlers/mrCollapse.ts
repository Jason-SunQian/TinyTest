import type { Node } from '@/components/canvas/types';

import type { ExternalDropServices } from '../types';
import { getClonedPageState } from '../utils';

/** MrCollapse：v-model + 列表示例 state + 首个子项 loop */
export function handleMrCollapseExternalDrop(
    insertData: Node,
    { getSchema, updateSchema }: ExternalDropServices
): void {
    const stateObj = getClonedPageState(getSchema);

    let i = 1;
    let stateKey = `mrCollapse${i}`;
    while (Object.prototype.hasOwnProperty.call(stateObj, stateKey)) {
        i += 1;
        stateKey = `mrCollapse${i}`;
    }

    const listStateKey = `mrCollapseItems${i}`;
    stateObj[stateKey] = Array.isArray(insertData.props?.modelValue)
        ? insertData.props.modelValue
        : ['0'];
    stateObj[listStateKey] = [
        {
            id: '1',
            title: 'Item 1',
            value: 'Value 1',
            content: 'Content 1'
        },
        {
            id: '2',
            title: 'Item 2',
            value: 'Value 2',
            content: 'Content 2'
        }
    ];
    updateSchema({ state: stateObj });

    insertData.props = insertData.props || {};
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
