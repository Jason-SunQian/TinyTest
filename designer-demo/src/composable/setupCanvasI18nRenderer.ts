import { h, nextTick } from 'vue'
import { useDesignerI18n } from '@/services/i18nService'
import { useCanvas } from '@opentiny/tiny-engine-meta-register'
import I18nCanvasEmpty from '@/components/canvas/CanvasEmpty.vue'

/**
 * 设置国际化的 Canvas Renderer
 * 用于国际化空画布的提示文字
 * 
 * 注意：此函数需要在应用初始化完成后调用，以便通过 useCanvas API 访问 renderer
 */
export const setupCanvasI18nRenderer = () => {
  // 延迟执行，确保 useCanvas 可用
  setTimeout(() => {
    try {
      const { t } = useDesignerI18n()
      const canvasApi = useCanvas()?.canvasApi?.value
      
      if (!canvasApi || typeof canvasApi.getRenderer !== 'function' || typeof canvasApi.setRenderer !== 'function') {
        console.warn('[setupCanvasI18nRenderer] Canvas API not available, skip i18n renderer setup')
        return
      }

      const defaultRenderer = canvasApi.getRenderer()
      if (!defaultRenderer || typeof defaultRenderer !== 'function') {
        console.warn('[setupCanvasI18nRenderer] Default renderer not available')
        return
      }
      
      // 创建国际化的 renderer，包装默认 renderer
      const i18nRenderer = (schema, refreshKey, entry, active, isPage = true) => {
        // 调用默认 renderer 获取结果
        const result = defaultRenderer(schema, refreshKey, entry, active, isPage)
        
        // 如果结果是数组，检查并替换 CanvasEmpty 组件
        if (Array.isArray(result)) {
          return result.map(item => {
            // 检查是否是 CanvasEmpty 组件
            // CanvasEmpty 通常是一个简单的文本组件，可以通过检查其结构来判断
            if (item && item.type) {
              // 检查组件类型名称或文件名
              const componentName = item.type?.name || item.type?.__name || item.type?.__file?.match(/CanvasEmpty/)?.[0]
              
              // 或者检查组件是否有特定的 props（placeholderText）
              if (componentName === 'CanvasEmpty' || 
                  (item.props && 'placeholderText' in item.props) ||
                  (item.type && (item.type.toString().includes('CanvasEmpty') || item.type === 'CanvasEmpty'))) {
                return h(I18nCanvasEmpty, { placeholderText: t('designer.canvas.dragComponentHere') })
              }
            }
            return item
          })
        }
        
        // 如果结果是单个 VNode，检查是否是 CanvasEmpty
        if (result && result.type) {
          const componentName = result.type?.name || result.type?.__name
          if (componentName === 'CanvasEmpty' || 
              (result.props && 'placeholderText' in result.props)) {
            return h(I18nCanvasEmpty, { placeholderText: t('designer.canvas.dragComponentHere') })
          }
        }
        
        return result
      }

      // 设置自定义 renderer
      canvasApi.setRenderer(i18nRenderer)
      console.log('[setupCanvasI18nRenderer] Canvas i18n renderer setup successfully')
      
    } catch (error) {
      console.warn('[setupCanvasI18nRenderer] Failed to setup i18n renderer:', error)
    }
  }, 100) // 延迟 100ms 确保 canvas 已经初始化
}

