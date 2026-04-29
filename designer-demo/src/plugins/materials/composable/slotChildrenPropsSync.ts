/**
 * 画布 slot 文案常在节点 schema.children（字符串），属性面板 mergeProps 只读 schema.props
 * （packages/settings/props useProperties）。须在 getProps → mergeProps 之前把字符串同步到 props。
 */
export const COMPONENTS_SLOT_TEXT_BINDS_TO_PROPS_CHILDREN = new Set([
    'MrTitle',
    'MrLabel',
    'MrButton',
    'MrToggle'
]);

export const syncSlotStringChildrenWithPropsChildren = (
    schema: Record<string, unknown>,
    options?: { setProp?: (name: string, value: unknown) => void }
): void => {
    const componentName = schema.componentName as string | undefined;
    const props = (schema.props as Record<string, unknown>) || {};
    if (!schema.props) schema.props = props;
    const ch = schema.children;
    const setProp = options?.setProp;
    const applyChildren = (value: string) => {
        if (setProp) setProp('children', value);
        else props.children = value;
    };
    const isJsExpression = (value: unknown): boolean =>
        Boolean(
            value &&
                typeof value === 'object' &&
                (value as Record<string, unknown>).type === 'JSExpression'
        );

    const isTextLikeValue = (value: unknown): boolean =>
        typeof value === 'string' || isJsExpression(value);

    // 兼容未来新增的 slot-text 组件：
    // 除了白名单组件外，只要节点存在 children/text 的“文本或表达式”形态，就走统一同步。
    const shouldSync =
        Boolean(componentName) &&
        (COMPONENTS_SLOT_TEXT_BINDS_TO_PROPS_CHILDREN.has(componentName) ||
            isTextLikeValue(ch) ||
            isTextLikeValue(props.children) ||
            isTextLikeValue(props.text));
    if (!shouldSync) return;

    // 优先保证表达式绑定不被纯文本覆盖（如 MrLabel 重新选中后丢失 Bound 展示）
    if (isJsExpression(ch)) {
        if (props.children !== ch) {
            if (setProp) setProp('children', ch);
            else props.children = ch;
        }
        if (
            (componentName === 'MrLabel' || componentName === 'MrButton') &&
            (props.text === undefined || props.text === '')
        ) {
            if (setProp) setProp('text', ch);
            else props.text = ch;
        }
        return;
    }

    if (isJsExpression(props.children)) {
        if (
            ch === undefined ||
            ch === null ||
            ch === '' ||
            (typeof ch === 'string' && ch.trim() === '')
        ) {
            schema.children = props.children;
        }
        return;
    }

    if (typeof ch === 'string' && ch.trim() !== '') {
        // 只要节点 children 有值，就以它为准回写 props.children，避免面板回显被旧默认值覆盖
        if (props.children !== ch) applyChildren(ch);
        if (
            (componentName === 'MrLabel' || componentName === 'MrButton') &&
            (props.text === undefined || props.text === '')
        ) {
            if (setProp) setProp('text', ch);
            else props.text = ch;
        }
    } else if (
        typeof props.children === 'string' &&
        props.children !== '' &&
        (ch === undefined ||
            ch === null ||
            ch === '' ||
            (typeof ch === 'string' && ch.trim() === ''))
    ) {
        schema.children = props.children;
    } else if (
        (componentName === 'MrLabel' || componentName === 'MrButton') &&
        typeof props.text === 'string' &&
        props.text !== '' &&
        (ch === undefined ||
            ch === null ||
            ch === '' ||
            (typeof ch === 'string' && ch.trim() === ''))
    ) {
        schema.children = props.text;
        if (props.children === undefined || props.children === '') {
            applyChildren(props.text as string);
        }
    }
};
