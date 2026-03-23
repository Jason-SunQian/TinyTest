/**
 * 设计器/预览环境下的 account store 兼容层
 * 与主工程 useAccountStore 同 id，仅提供画布展示所需的最小字段
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAccountStore = defineStore('common.account', () => {
    const maskBalance = ref(false);
    const accountProductMap = ref<unknown[]>([]);
    const accountProductLoading = ref(false);
    const youthAccountList = ref<unknown[] | undefined>(undefined);

    async function requestAccountProduct() {
        // stub: no-op
    }
    async function queryYouthAccountInfo() {
        // stub: no-op
    }

    return {
        maskBalance,
        accountProductMap,
        accountProductLoading,
        requestAccountProduct,
        queryYouthAccountInfo,
        youthAccountList
    };
});
