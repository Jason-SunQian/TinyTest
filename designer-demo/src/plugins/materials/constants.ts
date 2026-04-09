/**
 * 物料相关常量配置
 * 集中管理，便于维护与扩展
 */

/**
 * component-base-style 相关常量。
 *
 * 当前物料插件已关闭自动注入 base style（见 `plugins/materials/index.ts` 的 options.useBaseStyle）。
 * 这里保留类名常量供历史 schema/剪贴板文本节点等场景使用。
 */
export const BASE_STYLE_CLASS_NAME = 'component-base-style';

// 兼容保留（避免历史 import 报错）；当前默认不再依赖该列表做跳过/清理逻辑
export const COMPONENTS_SKIP_BASE_STYLE: string[] = [];
