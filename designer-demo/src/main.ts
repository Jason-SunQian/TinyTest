/**
 * 迁移自 src/main.js，无类型改动，保持行为一致
 */
import { configurators } from './configurators'
import 'virtual:svg-icons-register'
import { loadDesignerI18n } from './services/i18nService'

async function startApp() {
  const registry = await import('../registry')
  const { init } = await import('@opentiny/tiny-engine')

  init({
    // 合并多个注册表
    registry: [registry.default],
    configurators,
    createAppSignal: ['global_service_init_finish'],
    // 添加生命周期钩子
    lifeCycles: {
      beforeAppCreate: () => {
        console.log('🚀 designer-demo 开始初始化...')
        // 确保国际化在应用创建前加载
        loadDesignerI18n()
      },
      appCreated: ({ app }) => {
        console.log('✅ designer-demo 应用创建完成')
        // 可以在这里添加其他初始化逻辑
      }
    }
  })
}

startApp()


