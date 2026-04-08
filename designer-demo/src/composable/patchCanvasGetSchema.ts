import { useCanvas } from '@opentiny/tiny-engine-meta-register';

type AnyObj = Record<string, any>;

function normalizeIconTag(v: unknown): string {
    const s = typeof v === 'string' ? v.trim() : '';
    return s.startsWith('i-') ? s : '';
}

function patchMpIconNode(node: AnyObj): void {
    const name = node.componentName;
    if (name !== 'MpIcon' && name !== 'mp-icon') return;

    const props = (node.props && typeof node.props === 'object' ? node.props : {}) as AnyObj;
    node.props = props;

    // 物料里已移除 testId，但历史 schema 里可能还残留；统一清掉避免出码带无效属性
    if ('testId' in props) delete props.testId;

    const iconTag = normalizeIconTag(props.iconTag);
    if (!iconTag) return;

    const iconChild = { componentName: iconTag, props: {} };
    const children = node.children;
    if (!children) {
        node.children = [iconChild];
    } else if (Array.isArray(children)) {
        const first = children[0];
        if (first && typeof first === 'object') {
            first.componentName = iconTag;
            if (!first.props) first.props = {};
        } else {
            children.unshift(iconChild);
        }
    } else {
        node.children = [iconChild];
    }

    delete props.iconTag;
}

function patchMpCellNode(node: AnyObj): void {
    const name = node.componentName;
    if (name !== 'MpCell' && name !== 'mp-cell') return;
    const props = (node.props && typeof node.props === 'object' ? node.props : {}) as AnyObj;
    node.props = props;
    if ('testId' in props) delete props.testId;
}

function walkSchema(node: any): void {
    if (!node || typeof node !== 'object') return;
    patchMpIconNode(node as AnyObj);
    patchMpCellNode(node as AnyObj);
    const children = (node as AnyObj).children;
    if (Array.isArray(children)) children.forEach(walkSchema);
}

/**
 * 将 useCanvas().getSchema 包一层，保证任何出码/保存/预览取到的 schema 都不会包含无效的 MpIcon.props.iconTag，
 * 且会生成对应的 <i-*> 子节点。
 */
export function patchCanvasGetSchemaForMpIcon(): void {
    const canvas = useCanvas() as any;
    const orig = canvas?.getSchema;
    if (typeof orig !== 'function') return;
    if ((canvas as AnyObj).__patchedGetSchemaMpIcon) return;

    canvas.getSchema = (...args: any[]) => {
        const schema = orig.apply(canvas, args);
        try {
            // 仅对返回对象做就地修正（避免深拷贝带来的性能/引用问题）
            walkSchema(schema);
        } catch {
            /* ignore */
        }
        return schema;
    };

    (canvas as AnyObj).__patchedGetSchemaMpIcon = true;
}

