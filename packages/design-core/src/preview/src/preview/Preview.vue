<template>
  <div :class="['vue-repl-container', debugSwitch ? 'preview-debug-mode' : '']">
    <Repl
      :editor="editorComponent"
      :store="store"
      :showCompileOutput="false"
      :showTsConfig="false"
      :showImportMap="true"
      :clearConsole="false"
      :autoResize="false"
    />
  </div>
</template>

<script>
import { defineComponent, computed, defineAsyncComponent, onMounted, onBeforeUnmount, ref } from 'vue'
import { Repl, useStore, useVueImportMap } from '@vue/repl'
import { getMergeMeta } from '@opentiny/tiny-engine-meta-register'
import { injectDebugSwitch } from './debugSwitch'
import { usePreviewCommunication } from './usePreviewCommunication'
import { usePreviewData } from './usePreviewData'
import '@vue/repl/style.css'

const Monaco = defineAsyncComponent(() => import('@vue/repl/monaco-editor')) // 异步组件实现懒加载，打开debug后再加载

const EmptyEditor = defineComponent({
  setup() {
    return () => null
  }
})

export default {
  components: {
    Repl
  },
  setup() {
    const debugSwitch = injectDebugSwitch()
    const editorComponent = computed(() => (debugSwitch?.value ? Monaco : EmptyEditor))
    const sfcOptions = ref({
      script: {
        // scirpt setup 编译后注入 import { * } from "vue"
        inlineTemplate: false
      }
    })
    const { importMap: builtinImportMap } = useVueImportMap()

    const currentImportMap = ref({
      imports: {
        ...builtinImportMap.value.imports
      }
    })

    const store = useStore({
      builtinImportMap: currentImportMap,
      showOutput: false,
      outputMode: 'preview',
      sfcOptions
    })

    const setFiles = async (newFiles, mainFileName) => {
      await store.setFiles(newFiles, mainFileName)
    }

    const setImportMap = (newImportMap) => {
      currentImportMap.value = newImportMap
    }

    const queryParams = new URLSearchParams(location.search)
    document.documentElement?.setAttribute?.('data-theme', queryParams.get('theme') || 'light')

    const { loadInitialData, updateUrl, updatePreview } = usePreviewData({ setFiles, store, setImportMap })

    let cleanupCommunicationAction = null
    const onSchemaReceivedAction = async (data) => {
      updateUrl(data.currentPage)
      const isHistory = new URLSearchParams(location.search).get('history')
      const previewHotReload = getMergeMeta('engine.config').previewHotReload
      // 如果是历史预览，则不需要实时预览，接收到消息之后直接取消监听(需要监听到第一次消息接受页面信息)
      // 如果预览热更新关闭，则不需要实时预览
      if (isHistory || previewHotReload === false) {
        cleanupCommunicationAction()
      }
      await updatePreview(data)
    }

    const { initCommunication, cleanupCommunication } = usePreviewCommunication({
      onSchemaReceived: onSchemaReceivedAction,
      loadInitialData: async () => {
        try {
          await loadInitialData()
        } catch (error) {
          console.error('预览初始化失败:', error)
          // 显示错误信息给用户
          const errorMessage = error instanceof Error ? error.message : '未知错误'
          store.setFiles({
            'Main.vue': `<template>
  <div style="display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; color: #666; padding: 20px;">
    <h2 style="color: #f56c6c; margin-bottom: 16px;">预览加载失败</h2>
    <p style="margin-bottom: 8px; text-align: center;">${errorMessage}</p>
    <div style="font-size: 12px; color: #999; text-align: left; margin-top: 16px;">
      <p style="margin-bottom: 8px;">请检查：</p>
      <ul style="margin: 0; padding-left: 20px;">
        <li>URL 中是否包含有效的 pageid 或 blockid 参数</li>
        <li>后端服务是否正常运行</li>
        <li>网络连接是否正常</li>
        <li>页面是否已保存</li>
      </ul>
    </div>
  </div>
</template>`
          }, 'Main.vue')
        }
      }
    })

    cleanupCommunicationAction = cleanupCommunication

    onMounted(initCommunication)
    onBeforeUnmount(cleanupCommunication)

    return {
      store,
      sfcOptions,
      editorComponent,
      debugSwitch
    }
  }
}
</script>

<style lang="less">
.vue-repl {
  height: 100%;

  .split-pane {
    .left {
      display: none;
    }

    .right {
      width: 100% !important;

      .output-container {
        height: 100%;

        .msg.warn {
          display: none;
        }
      }

      .tab-buttons {
        display: none;
      }
    }
  }
}
.vue-repl-container {
  height: calc(100vh - 48px);
  &.preview-debug-mode .vue-repl .split-pane {
    .left,
    .right .tab-buttons {
      display: block;
    }
    .right .output-container {
      height: calc(100% - 38px);
    }
  }
}
</style>
