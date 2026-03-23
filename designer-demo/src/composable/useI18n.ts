import { ref, computed, watch } from 'vue';

import {
    loadDesignerI18n,
    switchLanguage,
    getCurrentLanguage,
    getSupportedLanguages,
    t as translate
} from '../services/i18nService';

const currentLocale = ref<'zh_CN' | 'en_US'>(getCurrentLanguage());
const isInitialized = ref(false);

export function useI18n() {
    const initI18n = () => {
        if (!isInitialized.value) {
            const success = loadDesignerI18n();
            isInitialized.value = success;
            return success;
        }
        return true;
    };

    const changeLanguage = (locale: 'zh_CN' | 'en_US') => {
        const success = switchLanguage(locale);
        if (success) {
            currentLocale.value = locale;
        }
        return success;
    };

    const supportedLanguages = computed(() => getSupportedLanguages());

    const currentLanguage = computed(() => {
        return (
            supportedLanguages.value.find(
                lang => lang.code === currentLocale.value
            ) || supportedLanguages.value[0]
        );
    });

     
    const t = (key: string, params: Record<string, any> = {}) => {
        return translate(key, params);
    };

    watch(currentLocale, newLocale => {
        // eslint-disable-next-line no-console
        console.log(`语言已切换到: ${newLocale}`);
    });

    return {
        currentLocale: computed(() => currentLocale.value),
        isInitialized: computed(() => isInitialized.value),
        currentLanguage,
        supportedLanguages,
        initI18n,
        changeLanguage,
        t
    };
}

export function useT() {
     
    return (key: string, params: Record<string, any> = {}) =>
        translate(key, params);
}

export function useLanguageSwitcher() {
     
    const { currentLocale, changeLanguage, supportedLanguages } = useI18n();

    const switchToChinese = () => changeLanguage('zh_CN');
    const switchToEnglish = () => changeLanguage('en_US');

    const isChinese = computed(() => currentLocale.value === 'zh_CN');
    const isEnglish = computed(() => currentLocale.value === 'en_US');

    return {
        currentLocale,
        supportedLanguages,
        switchToChinese,
        switchToEnglish,
        isChinese,
        isEnglish,
        changeLanguage
    };
}
