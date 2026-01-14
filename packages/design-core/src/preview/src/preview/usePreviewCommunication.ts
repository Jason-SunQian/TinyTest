import { previewState } from './usePreviewData'

interface PreviewCommunicationOptions {
  onSchemaReceived: (data: any) => Promise<void>
  loadInitialData: () => Promise<void>
}

let onSchemaReceivedAction: PreviewCommunicationOptions['onSchemaReceived'] | null = null
// 创建 BroadcastChannel 实例，与主页面通信
let previewChannel: BroadcastChannel | null = null

const handleMessage = async (event: MessageEvent) => {
  const parsedOrigin = new URL(event.origin)
  const parsedHost = new URL(window.location.href)

  if (parsedOrigin.origin === parsedHost.origin || parsedOrigin.host === parsedHost.host) {
    const { type, data, source } = event.data || {}

    if (source === 'designer' && type === 'schema' && data && onSchemaReceivedAction) {
      await onSchemaReceivedAction(data)
    }
  }
}

const handleBroadcastMessage = async (event: MessageEvent) => {
  const { event: eventType, source } = event.data || {}
  // 初始化了，重新建立连接
  if (source === 'designer' && eventType === 'connect' && window.opener) {
    window.opener.postMessage({ event: 'connect', source: 'preview' }, window.opener.origin || window.location.origin)
  }
}

let loadInitialData: PreviewCommunicationOptions['loadInitialData'] | null = null

const sendReadyMessage = () => {
  // 尝试获取父窗口引用
  const opener = window.opener

  const fallbackHandler = async () => {
    const logger = console
    logger.warn('无法获取主窗口引用，将使用 URL 参数初始化预览')
    if (loadInitialData) {
      try {
        await loadInitialData()
      } catch (error) {
        logger.error('预览初始化失败:', error)
        // 显示错误信息给用户
        const app = document.getElementById('app')
        if (app) {
          app.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; color: #666;">
              <h2 style="color: #f56c6c; margin-bottom: 16px;">预览加载失败</h2>
              <p style="margin-bottom: 8px;">${error instanceof Error ? error.message : '未知错误'}</p>
              <p style="font-size: 12px; color: #999;">请检查：</p>
              <ul style="text-align: left; font-size: 12px; color: #999;">
                <li>URL 中是否包含有效的 pageid 或 blockid 参数</li>
                <li>后端服务是否正常运行</li>
                <li>网络连接是否正常</li>
              </ul>
            </div>
          `
        }
      }
    }
  }

  if (opener) {
    try {
      opener.postMessage({ event: 'onMounted', source: 'preview' }, opener.origin || window.location.origin)
      // 设置超时，如果主窗口没有响应，则使用 fallback
      setTimeout(() => {
        if (loadInitialData && previewState.currentPage === null) {
          console.warn('主窗口未响应，使用 URL 参数初始化预览')
          fallbackHandler()
        }
      }, 2000)
    } catch (error) {
      fallbackHandler()
    }
    return
  }

  fallbackHandler()
}

const cleanupCommunication = () => {
  // 移除消息监听器
  window.removeEventListener('message', handleMessage)

  // 关闭 BroadcastChannel
  if (previewChannel) {
    previewChannel.close()
    previewChannel = null
  }
}

const initCommunication = () => {
  // 注册消息监听器
  window.addEventListener('message', handleMessage)

  // 发送就绪消息给主页面
  sendReadyMessage()

  const isHistory = new URLSearchParams(location.search).get('history')

  if (!isHistory && window.opener) {
    // 初始化 BroadcastChannel
    previewChannel = new BroadcastChannel('tiny-engine-preview-channel')
    previewChannel.onmessage = handleBroadcastMessage
  }
}

export const usePreviewCommunication = ({
  onSchemaReceived,
  loadInitialData: loadInitialDataFn
}: PreviewCommunicationOptions) => {
  onSchemaReceivedAction = onSchemaReceived
  loadInitialData = loadInitialDataFn

  return {
    initCommunication,
    cleanupCommunication
  }
}
