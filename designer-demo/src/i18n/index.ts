import zhCN from './zh-CN.json'
import enUS from './en-US.json'
import jaJP from './ja-JP.json'
import koKR from './ko-KR.json'
import componentsZhCN from './components.zh-CN.json'
import componentsEnUS from './components.en-US.json'

// 深度合并对象
const deepMerge = (target: any, source: any) => {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]))
    }
  }
  return Object.assign(target || {}, source)
}

export default {
  zh_CN: deepMerge(zhCN, componentsZhCN),
  en_US: deepMerge(enUS, componentsEnUS),
  ja_JP: jaJP, // TODO: 添加日语组件翻译
  ko_KR: koKR  // TODO: 添加韩语组件翻译
}
