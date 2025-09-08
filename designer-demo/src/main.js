/**
 * Copyright (c) 2023 - present TinyEngine Authors.
 * Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.
 *
 * Use of this source code is governed by an MIT-style license.
 *
 * THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,
 * BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR
 * A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.
 *
 */
import { configurators } from './configurators/'
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
