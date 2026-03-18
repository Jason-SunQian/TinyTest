/**
 * 物料相关常量配置
 * 集中管理，便于维护与扩展
 */

/** 设计器基础样式类名（与 options.componentBaseStyle.className 一致） */
export const BASE_STYLE_CLASS_NAME = 'component-base-style';

/**
 * 不应用 component-base-style 的组件列表
 * 这些组件作为布局子项（如 ion-segment 内按钮），margin 会破坏 flex 对齐
 */
export const COMPONENTS_SKIP_BASE_STYLE = ['MrSegmentButton', 'mr-segment-button'];
