/**
 * 代码提示关键字配置
 * 用于配置 script 插件中的代码提示关键字
 * 
 * 使用方式：
 * 1. 在 keyWords 数组中添加新的关键字，即可在编辑器中使用 this.xxx 的提示
 * 2. 例如：添加 'http' 后，可以在编辑器中使用 this.http 的提示
 * 
 * 注意：
 * - 这些关键字是全局的，所有项目都会生效
 * - 如果需要项目特定的工具方法，请使用 Bridge 插件创建，会出现在 this.utils.xxx 下
 */

/**
 * 扩展的关键字列表
 * 这些关键字会在代码提示中显示为 this.xxx 的形式
 */
export const customKeywords = [
  // 项目特定的关键字
  'http',    // HTTP 请求工具，如 this.http.post(), this.http.get()
  'router'   // 路由工具，如 this.router.push(), this.router.goBack()
]

/**
 * 获取所有关键字（包括原始关键字和自定义关键字）
 * 如果需要添加更多关键字，可以在这里扩展
 */
export const getAllKeywords = () => {
  // 原始关键字（来自 packages/common/js/completion.js）
  const originalKeywords = [
    'state',
    'stores',
    'props',
    'emit',
    'setState',
    'route',
    'i18n',
    'getLocale',
    'setLocale',
    'history',
    'utils',
    'bridge',
    'dataSourceMap'
  ]

  // 合并原始关键字和自定义关键字，去重
  return [...new Set([...originalKeywords, ...customKeywords])]
}
