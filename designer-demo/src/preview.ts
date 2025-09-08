/**
 * 迁移自 src/preview.js
 */
import { defineEntry } from '@opentiny/tiny-engine-meta-register'
import 'virtual:svg-icons-register'

async function startApp() {
  const { initHook, HOOK_NAME, META_SERVICE, initPreview } = await import('@opentiny/tiny-engine')
  const { HttpService } = await import('./composable')

  const beforeAppCreate = () => {
    initHook(HOOK_NAME.useEnv, import.meta.env)
  }

  const registry: any = {
    [META_SERVICE.Http]: HttpService,
    'engine.config': {
      id: 'engine.config',
      theme: 'light',
      material: ['/mock/bundle.json']
    }
  }

  defineEntry(registry)

  initPreview({
    registry,
    lifeCycles: {
      beforeAppCreate
    }
  })
}

startApp()


