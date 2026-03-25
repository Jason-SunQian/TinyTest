/**
 * 画布 slot 文案常在节点 schema.children（字符串），属性面板 mergeProps 只读 schema.props
 * （packages/settings/props useProperties）。须在 getProps → mergeProps 之前把字符串同步到 props。
 */
export const COMPONENTS_SLOT_TEXT_BINDS_TO_PROPS_CHILDREN = new Set([
    'MrTitle',
    'MrLabel',
    'MrButton'
]);

export const syncSlotStringChildrenWithPropsChildren = (
    schema: Record<string, unknown>,
    options?: { setProp?: (name: string, value: unknown) => void }
): void => {
    const componentName = schema.componentName as string | undefined;
    if (!componentName || !COMPONENTS_SLOT_TEXT_BINDS_TO_PROPS_CHILDREN.has(componentName)) {
        return;
    }
    const props = (schema.props as Record<string, unknown>) || {};
    if (!schema.props) schema.props = props;
    const ch = schema.children;
    const setProp = options?.setProp;
    const applyChildren = (value: string) => {
        if (setProp) setProp('children', value);
        else props.children = value;
    };
    if (typeof ch === 'string' && ch.trim() !== '') {
        if (props.children === undefined || props.children === '') {
            applyChildren(ch);
        }
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
