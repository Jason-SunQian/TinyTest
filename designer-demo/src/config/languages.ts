/**
 * 国际化语言配置
 * 支持动态添加/删除语言，便于扩展
 */

export interface LanguageConfig {
  code: string
  name: string
  nameEn: string
  flag?: string
  rtl?: boolean
}

// 默认支持的语言列表
export const DEFAULT_LANGUAGES: LanguageConfig[] = [
  {
    code: 'zh_CN',
    name: '中文',
    nameEn: 'Chinese',
    flag: '🇨🇳'
  },
  {
    code: 'en_US',
    name: 'English',
    nameEn: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'ja_JP',
    name: '日本語',
    nameEn: 'Japanese',
    flag: '🇯🇵'
  },
  {
    code: 'ko_KR',
    name: '한국어',
    nameEn: 'Korean',
    flag: '🇰🇷'
  },
  {
    code: 'fr_FR',
    name: 'Français',
    nameEn: 'French',
    flag: '🇫🇷'
  },
  {
    code: 'de_DE',
    name: 'Deutsch',
    nameEn: 'German',
    flag: '🇩🇪'
  }
]

// 当前启用的语言列表（可配置）
export const ENABLED_LANGUAGES: LanguageConfig[] = [
  DEFAULT_LANGUAGES[0], // zh_CN
  DEFAULT_LANGUAGES[1], // en_US
  DEFAULT_LANGUAGES[2], // ja_JP
  DEFAULT_LANGUAGES[3], // ko_KR
]

// 默认语言
export const DEFAULT_LANGUAGE = 'zh_CN'

// 语言代码映射（用于TinyEngine兼容）
export const LANGUAGE_CODE_MAP: Record<string, string> = {
  'zh_CN': 'zh_CN',
  'en_US': 'en_US',
  'ja_JP': 'ja_JP',
  'ko_KR': 'ko_KR',
  'fr_FR': 'fr_FR',
  'de_DE': 'de_DE'
}

// 获取当前启用的语言列表
export const getEnabledLanguages = (): LanguageConfig[] => {
  return ENABLED_LANGUAGES
}

// 根据代码获取语言配置
export const getLanguageByCode = (code: string): LanguageConfig | undefined => {
  return ENABLED_LANGUAGES.find(lang => lang.code === code)
}

// 检查语言是否支持
export const isLanguageSupported = (code: string): boolean => {
  return ENABLED_LANGUAGES.some(lang => lang.code === code)
}
