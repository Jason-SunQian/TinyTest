import { useProperties } from '@opentiny/tiny-engine-meta-register';

import { syncSlotStringChildrenWithPropsChildren } from '@/plugins/materials/composable/slotChildrenPropsSync';

let patched = false;

/** 与 useMaterial.patchSchemaWithMaterialDefaults 中 MrBackButton 分支一致；manifest 故意 defaultValue 为空以免出码省略 */
const MR_BACK_BUTTON_DEFAULT_HREF = 'javascript:void(0)';

function syncMrBackButtonDefaultHrefBeforeMergeProps(
    schema: Record<string, unknown>
): void {
    if (schema.componentName !== 'MrBackButton') return;
    const props = (schema.props as Record<string, unknown>) || {};
    if (!schema.props) schema.props = props;
    const dh = props.defaultHref;
    if (dh === undefined || dh === '') {
        props.defaultHref = MR_BACK_BUTTON_DEFAULT_HREF;
    }
}

/**
 * mergeProps 只读 schema.props。须在 getProps → mergeProps 之前：
 * - 把节点 schema.children（字符串）同步到 props（slot 文案）
 * - 为单独拖入的 MrBackButton 补全 defaultHref（整段 snippet 会带齐子节点 props，手动拖入常缺省）
 * 仅依赖 setProp / fillNodePropsWithMaterialDefaults 无法可靠刷新面板：getProps 在「同一节点再次选中」时会短路。
 */
export function patchPropertiesGetPropsForSlotChildrenSync(): void {
    if (patched) return;
    patched = true;
    const api = useProperties();
    const orig = api.getProps.bind(api);
    api.getProps = (schema: unknown, parent: unknown) => {
        if (schema) {
            const node = Array.isArray(schema) ? schema[0] : schema;
            if (node && typeof node === 'object') {
                const n = node as Record<string, unknown>;
                syncSlotStringChildrenWithPropsChildren(n);
                syncMrBackButtonDefaultHrefBeforeMergeProps(n);
            }
        }
        return orig(schema, parent);
    };
}
