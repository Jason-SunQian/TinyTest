import { getMetaApi } from '@opentiny/tiny-engine-meta-register';

type SchemaNode = {
    componentName?: string;
    props?: Record<string, unknown>;
    children?: unknown;
};
type GenerateCodeServiceLike = {
    generatePageCode?: (
        schema: unknown,
        componentsMap: unknown,
        opts?: unknown
    ) => unknown;
    // eslint-disable-next-line @typescript-eslint/naming-convention -- 历史私有标记名，避免重复打补丁
    __patchedMpIcon?: boolean;
};

function normalizeIconTag(v: unknown): string {
    const s = typeof v === 'string' ? v.trim() : '';
    return s.startsWith('i-') ? s : '';
}

function patchMpIconNode(node: SchemaNode): void {
    if (!node || typeof node !== 'object') return;
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

    // 运行态 mp-icon 不认 iconTag，出码前移除
    delete props.iconTag;
}

function patchMpCellNode(node: SchemaNode): void {
    if (!node || typeof node !== 'object') return;
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
 * 出码服务补丁：
 * - toolbar「出码」/ block 编译等路径可能不走 useMaterial 的保存/预览补丁
 * - 在 generatePageCode 前统一把 MpIcon.props.iconTag 转成 children 的 <i-*> 节点
 */
export function patchGenerateCodeServiceForMpIcon(): void {
    const svc = getMetaApi(
        'engine.service.generateCode'
    ) as GenerateCodeServiceLike;
    if (!svc || typeof svc.generatePageCode !== 'function') return;
    if (svc.__patchedMpIcon === true) return;

    const orig = svc.generatePageCode.bind(svc);
    svc.generatePageCode = (
        schema: unknown,
        componentsMap: unknown,
        opts?: unknown
    ) => {
        try {
            walkSchema(schema);
        } catch {
            // 静默：不影响出码主流程
        }
        return orig(schema, componentsMap, opts);
    };
    svc.__patchedMpIcon = true;
}
