import CustomVantButton from './src/CustomVantButton.vue'
import BusinessCard from './src/BusinessCard.vue'

// 导出所有自定义组件
export {
  CustomVantButton,
  BusinessCard
}

// 默认导出
export default {
  CustomVantButton,
  BusinessCard
}

// 全局注册组件（用于预览环境）
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('BusinessCard', BusinessCard)
  window.Vue.component('CustomVantButton', CustomVantButton)
} 