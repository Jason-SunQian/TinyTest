/**
 * 设计器画布用 vue-i18n 桩，useI18n().t 优先走全局 $t，否则返回 key
 */
import { getCurrentInstance } from 'vue';

export function useI18n() {
    const instance = getCurrentInstance();
    const $t =
        (instance?.appContext.config.globalProperties?.$t as
            | ((key: string) => string)
            | undefined) ?? ((key: string) => key);
    return {
        t: $t,
        locale: { value: 'en_US' },
        te: () => false,
        tm: () => ({})
    };
}
