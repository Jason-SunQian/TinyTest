<template>
  <div class="toolbar-save toolbar-helpGuid">
    <toolbar-base
      :content="t('designer.toolbar.preview')"
      :icon="options.icon?.default || options?.icon"
      :options="options"
      @click-api="preview"
    >
    </toolbar-base>
  </div>
</template>

<script lang="ts">
/* metaService: engine.toolbars.preview.Main */
import { previewPage } from '@opentiny/tiny-engine-common/js/preview'
import { useLayout, useNotify, getOptions } from '@opentiny/tiny-engine-meta-register'
import { isVsCodeEnv } from '@opentiny/tiny-engine-common/js/environments'
import meta from '../meta'
import { ToolbarBase } from '@opentiny/tiny-engine-common'
import { inject } from 'vue'
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n'

// VSCode 环境下调用 goPreview
const callGoPreview = (t: (key: string) => string, callback?: (success: boolean, error?: any) => void) => {
  if (!isVsCodeEnv) {
    callback?.(false, new Error(t('designer.vscode.vscodeEnvRequired')));
    return;
  }

  // 生成请求ID
  const requestId = `req_${Date.now()}_${Math.random()}`;
  
  // 设置回调
  const handleMessage = (event: MessageEvent) => {
    const message = event.data;
    if (message?.source === 'vscode' && message?.method === 'goPreview' && message?.requestId === requestId) {
      window.removeEventListener('message', handleMessage);
      if (message.error) {
        callback?.(false, message.error);
      } else {
        callback?.(true, undefined);
      }
    }
  };
  
  window.addEventListener('message', handleMessage);
  
  // 发送消息
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({
      source: 'designer',
      method: 'goPreview',
      requestId
    }, '*');
  }
};

export default {
  components: {
    ToolbarBase
  },
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    // 获取国际化 t 函数
    const i18n: any = inject(I18nInjectionKey)
    const t = i18n?.global?.t || ((key: string) => key)
    
    const preview = async () => {
      const { beforePreview, previewMethod, afterPreview } = getOptions(meta.id)

      try {
        if (typeof beforePreview === 'function') {
          await beforePreview()
        }

        if (typeof previewMethod === 'function') {
          const stop = await previewMethod()

          if (stop) {
            return
          }
        }
      } catch (error) {
        useNotify({
          type: 'error',
          message: `Error in previewing: ${error}`
        })
      }

      if (useLayout().isEmptyPage()) {
        useNotify({
          type: 'warning',
          message: t('designer.common.createPageFirst')
        })

        return
      }

      // VSCode 环境下，使用 goPreview 由插件发起预览
      if (isVsCodeEnv) {
        callGoPreview(t, (success, error) => {
          if (!success) {
            useNotify({
              type: 'error',
              message: error?.message || t('designer.vscode.previewFailed')
            })
          }
        })
        return
      }

      // 非 VSCode 环境，使用原有预览方式
      previewPage()

      if (typeof afterPreview === 'function') {
        try {
          await afterPreview()
        } catch (error) {
          useNotify({
            type: 'error',
            message: `Error in afterPreview: ${error}`
          })
        }
      }
    }

    return {
      preview,
      t
    }
  }
}
</script>
