import type { SchemaNode } from './types';

function normalizeIconTag(v: unknown): string {
    const s = typeof v === 'string' ? v.trim() : '';
    // 仅允许 i- 开头，避免把普通字符串变成组件名污染 schema
    return s.startsWith('i-') ? s : '';
}

/**
 * MpIcon（画布占位）：
 * - 用户在属性面板填写 props.iconTag（如 i-mr-more）
 * - 保存/预览前把它同步成 children 的组件节点，确保出码生成 <i-*> 标签
 */
export function patchMpIconIconTagToChild(schema: SchemaNode): void {
    const props = (schema.props as Record<string, unknown>) || {};
    if (!schema.props) schema.props = props;

    const { iconTag: rawIconTag } = props;
    const iconTag = normalizeIconTag(rawIconTag);
    if (!iconTag) return;

    const { children } = schema;
    const node = { componentName: iconTag, props: {} } as Record<
        string,
        unknown
    >;

    if (!children) {
        schema.children = [node];
        return;
    }

    if (Array.isArray(children)) {
        const [firstNode] = children;
        const first = firstNode as Record<string, unknown> | undefined;
        if (first && typeof first === 'object') {
            first.componentName = iconTag;
            if (!first.props) first.props = {};
        } else {
            children.unshift(node);
        }
        return;
    }

    // children 若为 string 或 object，直接替换为数组节点，保证可预测出码
    schema.children = [node];

    // 运行态 mp-icon 不认 iconTag，避免出码生成无效属性
    if (schema.props && typeof schema.props === 'object') {
        delete (schema.props as Record<string, unknown>).iconTag;
    }
}
