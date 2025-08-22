<template>
  <div class="toolbar-save">
    <toolbar-base
      :content="isLoading ? t('designer.toolbar.saving') : t('designer.toolbar.save')"
      :icon="options.icon.default || options.icon"
      :options="{ ...options, showDots: !isSaved() }"
      @click-api="openApi"
    >
      <template #button>
        <tiny-popover :visible-arrow="false" width="203" trigger="click" :open-delay="OPEN_DELAY.Default">
          <template #reference>
            <svg-icon :name="iconExpand"></svg-icon>
          </template>
          <div class="save-style">
            <div class="save-setting">{{ t('designer.toolbar.saveSetting') }}</div>
            <tiny-checkbox v-model="state.checked" name="tiny-checkbox">{{ t('designer.toolbar.autoSave') }}</tiny-checkbox>
            <div class="save-time">
              <div class="save-time-label">{{ t('designer.toolbar.saveInterval') }}</div>
              <tiny-select v-model="state.timeValue" :options="delayOptions" :disabled="!state.checked" autocomplete>
              </tiny-select>
            </div>
            <div class="save-button-group">
              <tiny-button type="primary" @click="saveConfig">{{ t('designer.toolbar.setAndSave') }}</tiny-button>
            </div>
          </div>
        </tiny-popover>
      </template>
      <template #default>
        <tiny-dialog-box
          class="dialog-box"
          :modal="false"
          :fullscreen="true"
          :append-to-body="true"
          :visible="state.visible"
          :title="t('designer.toolbar.schemaDiff')"
          @update:visible="state.visible = $event"
        >
          <vue-monaco
            v-if="state.visible"
            ref="editor"
            class="monaco-editor"
            :diffEditor="true"
            :options="editorOptions"
            :value="state.code"
            :original="state.originalCode"
          ></vue-monaco>
          <template #footer>
            <tiny-button @click="close">{{ t('designer.common.cancel') }}</tiny-button>
            <tiny-button type="primary" @click="saveApi">{{ t('designer.common.save') }}</tiny-button>
          </template>
        </tiny-dialog-box>
      </template>
    </toolbar-base>
  </div>
</template>

<script lang="ts">
/* metaService: engine.toolbars.save.Main */
import { reactive, ref, onUnmounted, onMounted, inject } from 'vue'
import { VueMonaco } from '@opentiny/tiny-engine-common'
import { Button, Popover, DialogBox, Checkbox, Select } from '@opentiny/vue'
import { useCanvas, useMessage } from '@opentiny/tiny-engine-meta-register'
import { ToolbarBase } from '@opentiny/tiny-engine-common'
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n'
import { openCommon, saveCommon } from './js/index'
import { isLoading, setAutoSaveStatus, getAutoSaveStatus } from './js/index'
import { constants } from '@opentiny/tiny-engine-utils'
const { OPEN_DELAY } = constants

export const api = {
  saveCommon,
  openCommon
}
export default {
  components: {
    VueMonaco,
    TinyButton: Button,
    TinyPopover: Popover,
    TinyDialogBox: DialogBox,
    TinyCheckbox: Checkbox,
    TinySelect: Select,
    ToolbarBase
  },
  props: {
    iconExpand: {
      type: String,
      default: 'down-arrow'
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    // 获取国际化 t 函数
    const i18n: any = inject(I18nInjectionKey)
    const t = i18n?.global?.t || ((key: string) => key)
    
    const delayOptions = [
      { value: 5, label: t('designer.toolbar.fiveMinutes') },
      { value: 10, label: t('designer.toolbar.tenMinutes') },
      { value: 15, label: t('designer.toolbar.fifteenMinutes') }
    ]
    const state = reactive({
      visible: false,
      code: '',
      originalCode: '',
      checked: false,
      timeValue: 5,
      preservationTime: null
    })

    const editor = ref(null)

    const { isSaved, setSaved, getSchema } = useCanvas()

    const { subscribe, unsubscribe } = useMessage()
    const subscriber = 'toolbar-save'

    const originSchema = ref(null)

    onMounted(() => {
      // 订阅页面/区块初始化事件
      subscribe({
        topic: 'pageOrBlockInit',
        subscriber,
        callback: (schema: any) => {
          originSchema.value = JSON.stringify(schema)
          setSaved(true) // 初始化时标记为已保存
        }
      })

      // 订阅 schema 变更事件
      subscribe({
        topic: 'schemaChange',
        subscriber,
        callback: () => {
          if (originSchema.value) {
            const hasChange = JSON.stringify(getSchema()) === originSchema.value
            setSaved(hasChange)
          }
        }
      })

      // 订阅 schema 导入事件
      subscribe({
        topic: 'schemaImport',
        subscriber,
        callback: () => {
          if (originSchema.value) {
            const hasChange = JSON.stringify(getSchema()) === originSchema.value
            setSaved(hasChange)
          }
        }
      })
    })

    onUnmounted(() => {
      unsubscribe({ topic: 'pageOrBlockInit', subscriber })
      unsubscribe({ topic: 'schemaChange', subscriber })
      unsubscribe({ topic: 'schemaImport', subscriber })
    })

    const close = () => {
      state.visible = false
      state.originalCode = ''
    }
    const openApi = () => {
      if (!isLoading.value) {
        openCommon()
      }
    }
    const saveApi = () => {
      saveCommon()
    }
    // 保存或新建区块
    const editorOptions = {
      language: 'json',
      lineNumbers: true,
      minimap: {
        enabled: false
      }
    }
    const saveSetTimeout = () => {
      clearTimeout(state.preservationTime)
      state.preservationTime = setTimeout(() => {
        openApi()
        saveSetTimeout()
      }, state.timeValue * 60 * 1000)
    }
    const saveConfig = () => {
      setAutoSaveStatus(state.checked)
      if (state.checked) {
        saveSetTimeout()
      } else {
        clearTimeout(state.preservationTime)
      }
    }

    onMounted(() => {
      state.checked = getAutoSaveStatus()
      if (state.checked) {
        saveSetTimeout()
      }
    })

    onUnmounted(() => {
      clearTimeout(state.preservationTime)
    })

    return {
      state,
      editor,
      editorOptions,
      isLoading,
      isSaved,
      close,
      openApi,
      saveApi,
      delayOptions,
      saveConfig,
      OPEN_DELAY,
      t
    }
  }
}
</script>

<style lang="less" scoped>
.dots {
  width: 6px;
  height: 6px;
  background: var(--te-toolbars-save-dot-color);
  border-radius: 50%;
  display: inline-block;
  position: absolute;
  top: 4px;
  right: 3px;
  z-index: 100;
}

.toolbar-save {
  .icon-down-arrow.icon-down-arrow {
    margin-left: var(--te-base-space-2x);
    margin-right: var(--te-base-space-0);
  }
  .save-button {
    background-color: var(--te-toolbars-save-button-bg-color);
    border: none;
    min-width: 70px;
    height: 26px;
    display: flex;
    align-items: center;
    padding: 0 8px;
    border-radius: 4px;
    &:not(.disabled):hover {
      background-color: var(--te-toolbars-save-button-bg-color);
    }
  }

  :deep(.icon-down-arrow:focus) {
    outline: none;
  }
}

.save-style {
  padding: 8px 4px;
  font-size: 12px;

  .save-setting {
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    height: 20px;
    margin-bottom: 16px;
  }

  .save-time {
    line-height: 24px;
    font-size: 12px;
    margin: 12px 0 16px 0;
    display: flex;
    .save-time-label {
      width: 60px;
      color: var(--te-toolbars-save-text-color);
    }

    .tiny-select {
      width: 103px;
      margin-left: 12px;

      :deep(.tiny-input__suffix) {
        width: 12px;
      }
    }
    :deep(.tiny-select.is-disabled .tiny-input__suffix) {
      display: flex;
    }
  }

  .save-button-group {
    text-align: right;
  }
}

#saving {
  cursor: not-allowed;
  color: var(--te-toolbars-save-text-color-disabled);

  :deep(svg) {
    color: var(--te-toolbars-save-text-color-disabled);
  }
}

.dialog-box {
  :deep(.tiny-dialog-box) {
    display: flex;
    flex-direction: column;

    .tiny-dialog-box__body {
      flex: 1;
    }
  }

  .monaco-editor {
    width: 100%;
    height: 100%;
  }
}
</style>

<style>
.changeRole a {
  color: var(--te-toolbars-save-text-color-link);
  padding: 0 5px;
}
.save-style .save-time .tiny-input__inner {
  height: 24px !important;
}
</style>
