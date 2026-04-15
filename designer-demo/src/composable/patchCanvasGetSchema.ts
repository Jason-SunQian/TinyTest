import { useCanvas } from '@opentiny/tiny-engine-meta-register';

type SchemaNode = {
    componentName?: string;
    props?: Record<string, unknown>;
    children?: unknown;
};
type CanvasLike = {
    getSchema?: (...args: unknown[]) => unknown;
    // eslint-disable-next-line @typescript-eslint/naming-convention -- 历史私有标记名，避免重复打补丁
    __patchedGetSchemaMpIcon?: boolean;
};

function normalizeIconTag(v: unknown): string {
    const s = typeof v === 'string' ? v.trim() : '';
    return s.startsWith('i-') ? s : '';
}

function patchMpIconNode(node: SchemaNode): void {
    const name = node.componentName;
    if (name !== 'MpIcon' && name !== 'mp-icon') return;

    const props =
        node.props && typeof node.props === 'object' ? node.props : {};
    node.props = props;

    // 物料里已移除 testId，但历史 schema 里可能还残留；统一清掉避免出码带无效属性
    if ('testId' in props) delete props.testId;

    const iconTag = normalizeIconTag(props.iconTag);
    if (!iconTag) return;

    const iconChild = { componentName: iconTag, props: {} };
    const { children } = node;
    if (!children) {
        node.children = [iconChild];
    } else if (Array.isArray(children)) {
        const [first] = children;
        if (first && typeof first === 'object') {
            const firstNode = first as SchemaNode;
            firstNode.componentName = iconTag;
            if (!firstNode.props) firstNode.props = {};
        } else {
            children.unshift(iconChild);
        }
    } else {
        node.children = [iconChild];
    }

    delete props.iconTag;
}

function patchMpCellNode(node: SchemaNode): void {
    const name = node.componentName;
    if (name !== 'MpCell' && name !== 'mp-cell') return;
    const props =
        node.props && typeof node.props === 'object' ? node.props : {};
    node.props = props;
    if ('testId' in props) delete props.testId;
}

function walkSchema(node: unknown): void {
    if (!node || typeof node !== 'object') return;
    const schemaNode = node as SchemaNode;
    patchMpIconNode(schemaNode);
    patchMpCellNode(schemaNode);
    const { children } = schemaNode;
    if (Array.isArray(children)) children.forEach(walkSchema);
}

/**
 * 将 useCanvas().getSchema 包一层，保证任何出码/保存/预览取到的 schema 都不会包含无效的 MpIcon.props.iconTag，
 * 且会生成对应的 <i-*> 子节点。
 */
export function patchCanvasGetSchemaForMpIcon(): void {
    const canvas = useCanvas() as CanvasLike;
    const orig = canvas?.getSchema;
    if (typeof orig !== 'function') return;
    if (canvas.__patchedGetSchemaMpIcon) return;

    canvas.getSchema = (...args: unknown[]) => {
        const schema = orig.apply(canvas, args);
        try {
            // 仅对返回对象做就地修正（避免深拷贝带来的性能/引用问题）
            walkSchema(schema);
        } catch {
            /* ignore */
        }
        return schema;
    };

    canvas.__patchedGetSchemaMpIcon = true;
}
