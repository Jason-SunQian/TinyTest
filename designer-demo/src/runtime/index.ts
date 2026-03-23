/**
 * 设计器/预览运行时兼容层
 * 挂载与主工程同签名的全局方法与 Pinia 桩，保证画布内业务组件可渲染，出码仍用主工程实现
 */
import type { App } from 'vue';
import { createPinia } from 'pinia';

import { t, currency, getCurrency, getCurrencySymbol, fd } from './globals';

export { t, currency, getCurrency, getCurrencySymbol, fd } from './globals';
export { useAccountStore, usePaymentStore } from './stores';

/**
 * 在画布/预览所用 Vue 应用上安装兼容层（全局属性 + Pinia 桩 store）
 * 应在 app 创建后、mount 前调用
 */
export function installRuntimeCompat(app: App): void {
    // 全局属性：与主工程 globalProperties 同签名
    app.config.globalProperties.$t = t;
    app.config.globalProperties.$currency = currency;
    app.config.globalProperties.$getCurrency = getCurrency;
    app.config.globalProperties.$getCurrencySymbol = getCurrencySymbol;
    app.config.globalProperties.$fd = fd;

    // Pinia + 桩 store，供画布内组件 useAccountStore / usePaymentStore 使用
    const pinia = createPinia();
    app.use(pinia);
}
