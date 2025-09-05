import { MockMethod } from 'vite-plugin-mock'

// 调试接口 - 用于记录所有请求
export default [
  {
    url: '/debug/requests',
    method: 'get',
    response: () => {
      return {
        data: {
          message: 'Debug endpoint - 检查控制台日志查看所有请求',
          timestamp: new Date().toISOString()
        }
      }
    }
  }
] as MockMethod[]
