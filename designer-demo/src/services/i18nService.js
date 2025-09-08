/**
 * 国际化初始化服务
 * 用于在designer-demo中初始化国际化配置，不修改design-core
 */
// 延迟获取i18n实例的函数
const getI18nInstance = () => {
  // 优先从window对象获取
  if (window.lowcodeI18n) {
    return window.lowcodeI18n
  }
  
  // 如果window.lowcodeI18n不存在，等待一段时间后重试
  console.warn('i18n实例未找到，等待实例初始化...')
  return null
}

// 创建一个代理对象，延迟获取真实的i18n实例
const i18n = new Proxy({}, {
  get(target, prop) {
    const instance = getI18nInstance()
    if (instance) {
      return instance[prop]
    }
    
    // 如果实例不存在，返回默认值
    if (prop === 'global') {
      return {
        locale: { value: 'zh_CN' },
        mergeLocaleMessage: () => {
          console.warn('i18n实例未初始化，无法合并国际化消息')
        },
        t: (key) => key
      }
    }
    
    return undefined
  }
})
import designerI18n from '../i18n'

/**
 * 加载设计器界面的国际化配置
 */
export const loadDesignerI18n = () => {
  const tryLoadI18n = () => {
    const instance = getI18nInstance()
    if (!instance) {
      // 如果实例不存在，延迟重试
      setTimeout(tryLoadI18n, 100)
      return false
    }

    try {
      // 合并英文国际化配置
      instance.global.mergeLocaleMessage('en_US', designerI18n.en_US)
      // 合并中文国际化配置
      instance.global.mergeLocaleMessage('zh_CN', designerI18n.zh_CN)
      console.log('✅ 设计器界面国际化配置已加载')
      
      // 在开发环境下添加测试功能
      if (process.env.NODE_ENV === 'development') {
        // 将测试函数暴露到全局，方便在控制台调试
        window.testDesignerI18n = () => {
          console.log('=== 测试设计器界面国际化 ===')
          console.log('当前语言:', instance.global.locale.value)
          console.log('页面:', instance.global.t('designer.toolbar.page'))
          console.log('保存:', instance.global.t('designer.toolbar.save'))
          console.log('物料:', instance.global.t('designer.leftPanel.materials'))
          console.log('中英文切换:', instance.global.t('designer.toolbar.chineseEnglishSwitch'))
        }
        
        window.switchToEnglish = () => {
          instance.global.locale.value = 'en_US'
          console.log('已切换到英文')
          window.testDesignerI18n()
        }
        
        window.switchToChinese = () => {
          instance.global.locale.value = 'zh_CN'
          console.log('已切换到中文')
          window.testDesignerI18n()
        }
        
        console.log('🎯 开发环境国际化测试功能已启用:')
        console.log('  - testDesignerI18n() - 测试国际化')
        console.log('  - switchToEnglish() - 切换到英文')
        console.log('  - switchToChinese() - 切换到中文')
      }
      
      return true
    } catch (error) {
      console.warn('❌ 加载设计器界面国际化配置失败:', error)
      return false
    }
  }

  return tryLoadI18n()
}

/**
 * 切换语言
 * @param {string} locale - 语言代码 ('zh_CN' | 'en_US')
 */
export const switchLanguage = (locale) => {
  try {
    const instance = getI18nInstance()
    if (instance && instance.global && instance.global.locale) {
      instance.global.locale.value = locale
      console.log(`语言已切换到: ${locale}`)
      return true
    } else {
      console.warn('i18n实例未初始化')
      return false
    }
  } catch (error) {
    console.error('切换语言失败:', error)
    return false
  }
}

/**
 * 获取当前语言
 */
export const getCurrentLanguage = () => {
  try {
    const instance = getI18nInstance()
    return instance?.global?.locale?.value || 'zh_CN'
  } catch (error) {
    console.error('获取当前语言失败:', error)
    return 'zh_CN'
  }
}

/**
 * 获取支持的语言列表
 */
export const getSupportedLanguages = () => {
  return [
    { code: 'zh_CN', name: '中文', nameEn: 'Chinese' },
    { code: 'en_US', name: 'English', nameEn: 'English' }
  ]
}

/**
 * 翻译函数
 * @param {string} key - 翻译键
 * @param {object} params - 参数对象
 */
export const t = (key, params = {}) => {
  try {
    const instance = getI18nInstance()
    return instance?.global?.t?.(key, params) || key
  } catch (error) {
    console.error('翻译失败:', error)
    return key
  }
}
