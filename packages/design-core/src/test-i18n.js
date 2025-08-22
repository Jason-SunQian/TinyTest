/**
 * 测试设计器界面国际化配置
 */
import i18n from '@opentiny/tiny-engine-common/js/i18n'
import designerI18n from './i18n'

// 测试函数
export function testDesignerI18n() {
  console.log('=== 测试设计器界面国际化配置 ===')
  
  try {
    // 测试中文
    i18n.global.locale.value = 'zh_CN'
    console.log('当前语言:', i18n.global.locale.value)
    console.log('中文 - 页面:', i18n.global.t('designer.toolbar.page'))
    console.log('中文 - 保存:', i18n.global.t('designer.toolbar.save'))
    console.log('中文 - 物料:', i18n.global.t('designer.leftPanel.materials'))
    
    // 测试英文
    i18n.global.locale.value = 'en_US'
    console.log('当前语言:', i18n.global.locale.value)
    console.log('英文 - 页面:', i18n.global.t('designer.toolbar.page'))
    console.log('英文 - 保存:', i18n.global.t('designer.toolbar.save'))
    console.log('英文 - 物料:', i18n.global.t('designer.leftPanel.materials'))
    
    console.log('✅ 国际化测试通过')
    return true
  } catch (error) {
    console.error('❌ 国际化测试失败:', error)
    return false
  }
}

// 加载设计器界面国际化配置
export function loadDesignerI18n() {
  try {
    // 合并英文国际化配置
    i18n.global.mergeLocaleMessage('en_US', designerI18n.en_US)
    // 合并中文国际化配置
    i18n.global.mergeLocaleMessage('zh_CN', designerI18n.zh_CN)
    console.log('✅ 设计器界面国际化配置已加载')
    return true
  } catch (error) {
    console.error('❌ 加载设计器界面国际化配置失败:', error)
    return false
  }
}

// 切换语言测试
export function switchLanguageTest() {
  console.log('=== 语言切换测试 ===')
  
  const languages = ['zh_CN', 'en_US']
  let currentIndex = 0
  
  const switchLang = () => {
    const lang = languages[currentIndex]
    i18n.global.locale.value = lang
    console.log(`切换到语言: ${lang}`)
    console.log('页面:', i18n.global.t('designer.toolbar.page'))
    console.log('保存:', i18n.global.t('designer.toolbar.save'))
    console.log('物料:', i18n.global.t('designer.leftPanel.materials'))
    console.log('---')
    
    currentIndex = (currentIndex + 1) % languages.length
  }
  
  // 执行两次切换测试
  switchLang()
  switchLang()
  
  console.log('✅ 语言切换测试完成')
}
