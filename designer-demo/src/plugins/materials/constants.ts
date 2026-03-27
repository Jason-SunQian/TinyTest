/**
 * 物料相关常量配置
 * 集中管理，便于维护与扩展
 */

/** 设计器基础样式类名（与 options.componentBaseStyle.className 一致） */
export const BASE_STYLE_CLASS_NAME = 'component-base-style';

/**
 * 不应用 component-base-style 的组件列表
 * 这些组件作为布局子项（如 ion-segment 内按钮），margin 会破坏 flex 对齐
 * Header 工具栏内子项同理：设计器拖入时若每层都带 margin，会破坏绝对定位与居中
 */
export const COMPONENTS_SKIP_BASE_STYLE = [
    'MrSegmentButton',
    'mr-segment-button',
    'MrToolbar',
    'mr-toolbar',
    'MrBackButton',
    'mr-back-button',
    'MrTitle',
    'mr-title',
    'MrButtons',
    'mr-buttons',
    'MrFooter',
    'mr-footer',
    'MrSwitch',
    'mr-switch',
    'MrCollapse',
    'mr-collapse',
    'MrCollapseItem',
    'mr-collapse-item',
    'MrItem',
    'mr-item',
    'MrItemSliding',
    'mr-item-sliding',
    'MrItemOptions',
    'mr-item-options',
    'MrItemOption',
    'mr-item-option',
    'MrAccordionGroup',
    'mr-accordion-group',
    'MrAccordion',
    'mr-accordion',
    'MrRadio',
    'mr-radio',
    'MrCheckbox',
    'mr-checkbox'
];
