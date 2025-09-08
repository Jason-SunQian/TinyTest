/**
 * 国际化组合式函数
 * 提供响应式的国际化功能
 */
import { ref, computed, watch } from 'vue'
import { 
  loadDesignerI18n, 
  switchLanguage, 
  getCurrentLanguage, 
  getSupportedLanguages, 
  t as translate 
} from '../services/i18nService'

// 全局状态
const currentLocale = ref(getCurrentLanguage())
const isInitialized = ref(false)

/**
 * 国际化组合式函数
 */
export function useI18n() {
  // 初始化国际化
  const initI18n = () => {
    if (!isInitialized.value) {
      const success = loadDesignerI18n()
      isInitialized.value = success
      return success
    }
    return true
  }

  // 切换语言
  const changeLanguage = (locale) => {
    const success = switchLanguage(locale)
    if (success) {
      currentLocale.value = locale
    }
    return success
  }

  // 获取支持的语言列表
  const supportedLanguages = computed(() => getSupportedLanguages())

  // 当前语言信息
  const currentLanguage = computed(() => {
    return supportedLanguages.value.find(lang => lang.code === currentLocale.value) || supportedLanguages.value[0]
  })

  // 翻译函数
  const t = (key, params = {}) => {
    return translate(key, params)
  }

  // 监听语言变化
  watch(currentLocale, (newLocale) => {
    console.log(`语言已切换到: ${newLocale}`)
  })

  return {
    // 状态
    currentLocale: computed(() => currentLocale.value),
    isInitialized: computed(() => isInitialized.value),
    currentLanguage,
    supportedLanguages,
    
    // 方法
    initI18n,
    changeLanguage,
    t
  }
}

/**
 * 简化的翻译函数
 * 可以直接在模板中使用
 */
export function useT() {
  return (key, params = {}) => translate(key, params)
}

/**
 * 语言切换Hook
 * 专门用于语言切换功能
 */
export function useLanguageSwitcher() {
  const { currentLocale, changeLanguage, supportedLanguages } = useI18n()

  const switchToChinese = () => changeLanguage('zh_CN')
  const switchToEnglish = () => changeLanguage('en_US')

  const isChinese = computed(() => currentLocale.value === 'zh_CN')
  const isEnglish = computed(() => currentLocale.value === 'en_US')

  return {
    currentLocale,
    supportedLanguages,
    switchToChinese,
    switchToEnglish,
    isChinese,
    isEnglish,
    changeLanguage
  }
}
