import designerI18n from '../i18n'

const getI18nInstance = () => {
  if ((window as any).lowcodeI18n) {
    return (window as any).lowcodeI18n
  }
  console.warn('i18n实例未找到，等待实例初始化...')
  return null
}

export const loadDesignerI18n = () => {
  const tryLoadI18n = (): boolean => {
    const instance: any = getI18nInstance()
    if (!instance) {
      setTimeout(tryLoadI18n, 100)
      return false
    }

    try {
      instance.global.mergeLocaleMessage('en_US', (designerI18n as any).en_US)
      instance.global.mergeLocaleMessage('zh_CN', (designerI18n as any).zh_CN)
      console.log('✅ 设计器界面国际化配置已加载')

      if (import.meta.env.MODE === 'development') {
        ;(window as any).testDesignerI18n = () => {
          console.log('=== 测试设计器界面国际化 ===')
          console.log('当前语言:', instance.global.locale.value)
          console.log('页面:', instance.global.t('designer.toolbar.page'))
          console.log('保存:', instance.global.t('designer.toolbar.save'))
          console.log('物料:', instance.global.t('designer.leftPanel.materials'))
          console.log('中英文切换:', instance.global.t('designer.toolbar.chineseEnglishSwitch'))
        }

        ;(window as any).switchToEnglish = () => {
          instance.global.locale.value = 'en_US'
          console.log('已切换到英文')
          ;(window as any).testDesignerI18n()
        }

        ;(window as any).switchToChinese = () => {
          instance.global.locale.value = 'zh_CN'
          console.log('已切换到中文')
          ;(window as any).testDesignerI18n()
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

export const switchLanguage = (locale: 'zh_CN' | 'en_US') => {
  try {
    const instance: any = getI18nInstance()
    if (instance?.global?.locale) {
      instance.global.locale.value = locale
      console.log(`语言已切换到: ${locale}`)
      return true
    }
    console.warn('i18n实例未初始化')
    return false
  } catch (error) {
    console.error('切换语言失败:', error)
    return false
  }
}

export const getCurrentLanguage = (): 'zh_CN' | 'en_US' => {
  try {
    const instance: any = getI18nInstance()
    return (instance?.global?.locale?.value as 'zh_CN' | 'en_US') || 'zh_CN'
  } catch (error) {
    console.error('获取当前语言失败:', error)
    return 'zh_CN'
  }
}

export const getSupportedLanguages = () => {
  return [
    { code: 'zh_CN', name: '中文', nameEn: 'Chinese' },
    { code: 'en_US', name: 'English', nameEn: 'English' }
  ]
}

export const t = (key: string, params: Record<string, any> = {}) => {
  try {
    const instance: any = getI18nInstance()
    return instance?.global?.t?.(key, params) || key
  } catch (error) {
    console.error('翻译失败:', error)
    return key
  }
}


