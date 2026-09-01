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
    // eslint-disable-next-line @typescript-eslint/naming-convention -- patch guard
    __patchedGenerateCode?: boolean;
};

/** Slot-text materials: label lives in default slot, not a real Vue `children` prop. */
const SLOT_TEXT_COMPONENTS = new Set([
    'MrButton',
    'MrLabel',
    'MrToggle',
    'MrTitle'
]);

function cloneJson<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

function isChildrenEmpty(ch: unknown): boolean {
    return (
        ch === undefined ||
        ch === null ||
        ch === '' ||
        (Array.isArray(ch) && ch.length === 0)
    );
}

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

/**
 * MrButton / MrLabel 等：属性面板用 props.children 回显，但出码若带上会变成
 * children="..." / :children="..." 落到原生 <button>，触发 Vue warn。
 * 出码前把文案留在节点 children（slot），删掉 props.children。
 */
function patchSlotTextNode(node: SchemaNode): void {
    if (!node || typeof node !== 'object') return;
    const name = node.componentName;
    if (!name || !SLOT_TEXT_COMPONENTS.has(name)) return;

    const props =
        node.props && typeof node.props === 'object' ? node.props : {};
    node.props = props;
    if (!('children' in props)) return;

    const propChildren = props.children;
    if (
        isChildrenEmpty(node.children) &&
        propChildren !== undefined &&
        propChildren !== null &&
        propChildren !== ''
    ) {
        node.children = propChildren;
    }
    delete props.children;
}

/** Same strip as dsl-vue sfc-post-processor (Save 走 generate；此处兜底 toolbar 出码路径). */
function stripSlotTextChildrenAttrsInCode(code: string): string {
    const tags = ['mr-button', 'mr-label', 'mr-toggle', 'mr-title'];
    let next = code;
    for (const tag of tags) {
        const openRe = new RegExp(`<${tag}(\\s[^>]*)?(\\/?)>`, 'gi');
        next = next.replace(openRe, (_m, attrs = '', selfClose = '') => {
            let a = attrs as string;
            a = a.replace(
                /\s+(?:v-bind:|:)?children\s*=\s*(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*')/g,
                ''
            );
            if (tag === 'mr-button') {
                a = a.replace(/\s+text\s*=\s*(?:"Button"|'Button')/g, '');
            } else if (tag === 'mr-label' || tag === 'mr-title') {
                a = a.replace(
                    /\s+text\s*=\s*(?:"Label"|'Label'|"Title"|'Title')/g,
                    ''
                );
            }
            return `<${tag}${a}${selfClose}>`;
        });
    }
    return next;
}

function postProcessGeneratedCode(result: unknown): unknown {
    if (typeof result === 'string') {
        return stripSlotTextChildrenAttrsInCode(result);
    }
    return result;
}

function walkSchema(node: unknown): void {
    if (!node || typeof node !== 'object') return;
    const schemaNode = node as SchemaNode;
    patchMpIconNode(schemaNode);
    patchMpCellNode(schemaNode);
    patchSlotTextNode(schemaNode);
    const { children } = schemaNode;
    if (Array.isArray(children)) children.forEach(walkSchema);
}

/**
 * 出码服务补丁：
 * - MpIcon.iconTag → children <i-*>
 * - MrButton 等：出码前去掉 props.children，避免 children 属性落到原生 button
 * - 对生成字符串再剥一层 mr-button 的 children/text 误属性
 */
export function patchGenerateCodeServiceForMpIcon(): void {
    const svc = getMetaApi(
        'engine.service.generateCode'
    ) as GenerateCodeServiceLike;
    if (!svc || typeof svc.generatePageCode !== 'function') return;
    if (svc.__patchedGenerateCode === true) return;

    const orig = svc.generatePageCode.bind(svc);
    svc.generatePageCode = (
        schema: unknown,
        componentsMap: unknown,
        opts?: unknown
    ) => {
        let schemaForCode = schema;
        try {
            schemaForCode = cloneJson(schema);
            walkSchema(schemaForCode);
        } catch {
            // 静默：不影响出码主流程；clone 失败则尽量对原 schema walk
            try {
                walkSchema(schema);
                schemaForCode = schema;
            } catch {
                // ignore
            }
        }
        const result = orig(schemaForCode, componentsMap, opts);
        try {
            return postProcessGeneratedCode(result);
        } catch {
            return result;
        }
    };
    svc.__patchedGenerateCode = true;
}
