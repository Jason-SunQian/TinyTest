/**
 * 国际化包装组件统一导出
 *
 * 这些组件是对 @opentiny/tiny-engine-common 中组件的包装
 * 主要目的是替换硬编码的中文文本为国际化文本
 *
 * 使用方式：
 * import { SearchEmpty, PluginPanel } from '@/components/i18n-wrappers'
 */

export { default as SearchEmpty } from './SearchEmpty/index.vue';
export { default as LifeCycles } from './LifeCycles/index.vue';
export { default as BlockHistoryList } from './BlockHistoryList/index.vue';
export { default as LinkButton } from './LinkButton/index.vue';
export { default as PluginPanel } from './PluginPanel/index.vue';
// export { default as PluginSetting } from './PluginSetting/index.vue'
// export { default as PluginBlockList } from './PluginBlockList/index.vue'
// export { default as MetaListItems } from './MetaListItems/index.vue'
