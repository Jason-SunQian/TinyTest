import path from 'node:path'
import { defineConfig, mergeConfig } from 'vite'
import { useTinyEngineBaseConfig } from '@opentiny/tiny-engine-vite-config'
import { viteMockServe } from 'vite-plugin-mock'
import dotenv from 'dotenv'

export default defineConfig((configEnv) => {
  // 手动加载环境变量
  dotenv.config({ path: './env/.env.local' })
  
  // 如果环境变量仍然未定义，直接设置
  if (!process.env.VITE_USE_MOCK) {
    process.env.VITE_USE_MOCK = 'true'
  }
  
  // 先加载环境变量
  const useMock = process.env.VITE_USE_MOCK === 'true'
  console.log('VITE_USE_MOCK:', process.env.VITE_USE_MOCK)
  console.log('使用 Mock 模式:', useMock)
  
  const baseConfig = useTinyEngineBaseConfig({
    viteConfigEnv: configEnv,
    root: __dirname,
    iconDirs: [path.resolve(__dirname, './node_modules/@opentiny/tiny-engine/assets/')],
    useSourceAlias: false,
    envDir: './env',
    registryPath: './registry.js'
  })

  const customConfig = {
    envDir: './env',
    publicDir: path.resolve(__dirname, './public'),
    server: {
      port: 8090
    },
    plugins: [
      viteMockServe({
        mockPath: 'mock',
        enable: useMock,
        watchFiles: true,
        logger: true
      })
    ]
  }

  return mergeConfig(baseConfig, customConfig)
})
