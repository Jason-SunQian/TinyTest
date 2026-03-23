/**
 * 设计器/预览环境下的 payment store 兼容层
 * 与主工程 usePaymentStore 同 id，仅提供画布展示所需的最小方法
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';

// 最小类型，与主工程 PaymentWay 兼容
interface PaymentWayStub {
    payCode?: string;
    availableBalance?: string | number;
    [key: string]: unknown;
}

export const usePaymentStore = defineStore('common.payment', () => {
    const paymentWayMap = ref<Record<string, unknown[]>>({});
    const paymentWayDirty = ref<Record<string, boolean>>({});
    const paymentWayLoading = ref<Record<string, boolean>>({});

    function checkPaymentway(
        // eslint-disable-next-line
        _payway: PaymentWayStub,
        // eslint-disable-next-line
        _disabledAccounts: string[] = [],
        // eslint-disable-next-line
        _payAmount = ''
    ): boolean {
        return true;
    }
    // eslint-disable-next-line
    function getPaymentWayKey(_sceneType: string, _channelCode = '') {
        return '';
    }
    async function requestPayWay() {
        // stub: no-op
    }
    async function queryPaymentWay() {
        // stub: no-op
    }
    /** 设计器预览：返回一条 mock 数据，便于画布展示列表 */
    // eslint-disable-next-line
    function getPaymentWay(_cacheKey: string) {
        return [
            {
                type: 'account',
                title: 'Account',
                selectTitle: 'Select Account',
                list: [
                    {
                        paymentTool: '0003',
                        nickName: 'My Savings',
                        payerAccountNumber: '****1234',
                        availableBalance: '1,000.00',
                        payerCurrency: 'HKD',
                        payCode: 'mock_1'
                    },
                    {
                        paymentTool: '0003',
                        nickName: 'Current',
                        payerAccountNumber: '****5678',
                        availableBalance: '500.00',
                        payerCurrency: 'HKD',
                        payCode: 'mock_2'
                    }
                ]
            }
        ];
    }
    /** 设计器预览：返回第一条作为默认选中 */
    function getDefaultPaymentWay(groups: unknown[] = []) {
        const first = groups[0] as { list?: unknown[] } | undefined;
        const list = first?.list;
        if (!list?.length) return undefined;
        return { defaultAccount: list[0], index: 0 };
    }
    // eslint-disable-next-line
    async function calcPaymentWayAmount(): Promise<Record<string, string>> {
        return {};
    }

    return {
        paymentWayMap,
        paymentWayDirty,
        paymentWayLoading,
        checkPaymentway,
        getPaymentWayKey,
        requestPayWay,
        queryPaymentWay,
        getPaymentWay,
        getDefaultPaymentWay,
        calcPaymentWayAmount
    };
});
