import { getMetaApi } from '@opentiny/tiny-engine-meta-register';

type AnyObj = Record<string, any>;

function normalizeIconTag(v: unknown): string {
    const s = typeof v === 'string' ? v.trim() : '';
    return s.startsWith('i-') ? s : '';
}

function patchMpIconNode(node: AnyObj): void {
    if (!node || typeof node !== 'object') return;
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

    // 运行态 mp-icon 不认 iconTag，出码前移除
    delete props.iconTag;
}

function patchMpCellNode(node: AnyObj): void {
    if (!node || typeof node !== 'object') return;
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
 * 出码服务补丁：
 * - toolbar「出码」/ block 编译等路径可能不走 useMaterial 的保存/预览补丁
 * - 在 generatePageCode 前统一把 MpIcon.props.iconTag 转成 children 的 <i-*> 节点
 */
export function patchGenerateCodeServiceForMpIcon(): void {
    const svc = getMetaApi('engine.service.generateCode') as any;
    if (!svc || typeof svc.generatePageCode !== 'function') return;
    if ((svc as AnyObj).__patchedMpIcon === true) return;

    const orig = svc.generatePageCode.bind(svc);
    svc.generatePageCode = (schema: any, componentsMap: any, opts?: any) => {
        try {
            walkSchema(schema);
        } catch {
            // 静默：不影响出码主流程
        }
        return orig(schema, componentsMap, opts);
    };
    (svc as AnyObj).__patchedMpIcon = true;
}

