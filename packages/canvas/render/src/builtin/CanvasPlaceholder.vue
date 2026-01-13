<template>
  <div class="canvas-container">
    <div class="container-box">
      <div class="container-tip">
        <slot>{{ placeholderText }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n'

const props = defineProps<{
  placeholder?: string
}>()

// 获取 i18n 实例（尝试多种方式）
const i18n = inject(I18nInjectionKey, null) as any
// 也尝试从 window 获取（某些情况下 i18n 可能挂载在 window 上）
const windowI18n = typeof window !== 'undefined' ? (window as any).lowcodeI18n : null

// 计算 placeholder 文本
const placeholderText = computed(() => {
  // 如果传入了自定义 placeholder，优先使用
  if (props.placeholder) {
    return props.placeholder
  }
  
  // 获取当前语言
  const currentLocale = i18n?.global?.locale?.value || windowI18n?.global?.locale?.value || 'zh_CN'
  const isEnglish = currentLocale === 'en_US' || currentLocale === 'en-US' || currentLocale === 'en'
  
  // 尝试从 i18n 获取翻译
  let text: string | undefined
  
  if (i18n?.global?.t) {
    text = i18n.global.t('designer.canvas.dragElementHere')
    if (text && text !== 'designer.canvas.dragElementHere') {
      return text
    }
  }
  
  if (windowI18n?.global?.t) {
    text = windowI18n.global.t('designer.canvas.dragElementHere')
    if (text && text !== 'designer.canvas.dragElementHere') {
      return text
    }
  }
  
  // 回退文本（根据当前语言决定）
  return isEnglish ? 'Please drag and drop elements here' : '请将元素拖放到这里'
})
</script>

<style lang="less" scoped>
.canvas-container {
  min-height: 48px;
}
</style>
