<template>
  <div class="simple-language-switcher">
    <h3>🌐 语言切换测试</h3>
    
    <div class="current-language">
      <p>当前语言: <strong>{{ currentLanguage.name }}</strong></p>
      <p>当前语言代码: <code>{{ currentLocale }}</code></p>
    </div>

    <div class="language-buttons">
      <button 
        @click="switchToChinese" 
        :class="{ active: currentLocale === 'zh_CN' }"
        class="lang-btn"
      >
        中文
      </button>
      <button 
        @click="switchToEnglish" 
        :class="{ active: currentLocale === 'en_US' }"
        class="lang-btn"
      >
        English
      </button>
    </div>

    <div class="test-translations">
      <h4>翻译测试:</h4>
      <ul>
        <li>页面: {{ t('designer.toolbar.page') }}</li>
        <li>保存: {{ t('designer.toolbar.save') }}</li>
        <li>物料: {{ t('designer.leftPanel.materials') }}</li>
        <li>属性: {{ t('designer.rightPanel.properties') }}</li>
      </ul>
    </div>

    <div class="debug-info">
      <h4>调试信息:</h4>
      <p>支持的语言数量: {{ supportedLanguages.length }}</p>
      <p>i18n实例状态: {{ i18nStatus }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useLanguageSwitcher, useT } from '../composable/useI18n'

// 使用语言切换功能
const { 
  currentLocale, 
  supportedLanguages, 
  switchToChinese,
  switchToEnglish
} = useLanguageSwitcher()

// 使用翻译函数
const t = useT()

// 当前语言信息
const currentLanguage = computed(() => {
  return supportedLanguages.value.find(lang => lang.code === currentLocale.value) || supportedLanguages.value[0]
})

// 调试信息
const i18nStatus = computed(() => {
  return window.lowcodeI18n ? '已初始化' : '未初始化'
})
</script>

<style scoped>
.simple-language-switcher {
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.current-language {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
}

.current-language p {
  margin: 5px 0;
}

.language-buttons {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.lang-btn {
  padding: 10px 20px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.lang-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.lang-btn.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.test-translations {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
}

.test-translations ul {
  margin: 10px 0;
  padding-left: 20px;
}

.test-translations li {
  margin: 5px 0;
  font-family: monospace;
}

.debug-info {
  background: #fff3cd;
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
  border-left: 4px solid #ffc107;
}

.debug-info p {
  margin: 5px 0;
  font-size: 12px;
  color: #856404;
}

h3, h4 {
  color: #333;
  margin: 10px 0;
}

code {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
}
</style>
