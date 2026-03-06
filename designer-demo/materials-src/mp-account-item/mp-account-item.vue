<template>
    <MpCell :data-test-id="`account_${index}`" gap="10" class="cursor-pointer" @click="onClick">
        <template #title>
            <div class="text-h5" :class="{ 'text-color-disabled': disabled }">
                <div v-if="accountData?.paymentTool === PAYMENT_TOOL_ACCOUNT" class="flex items-center">
                    <div class="line-clamp-1">
                        {{ titleText }}
                    </div>
                    <div>{{ `(${lastFour})` }}</div>
                </div>
                <div v-else-if="accountData?.paymentTool === PAYMENT_TOOL_CARD" class="flex items-center">
                    <div class="line-clamp-1">{{ cardTitle }}</div>
                    <div>{{ `(${cardLastFour})` }}</div>
                </div>
                <div v-else class="line-clamp-1">{{ titleText || 'Account' }}</div>
            </div>
        </template>
        <template #desc>
            <div
                :class="[
                    disabled ? 'text-color-disabled' : 'text-color-regular',
                    'text-h6 line-clamp-1',
                ]"
            >
                <template v-if="accountData?.availableBalance !== undefined">
                    <span v-if="canUsed">
                        {{ $t('common.availableBalance') + ': ' + descBalance }}
                    </span>
                    <span v-else>
                        {{ $t('common.insufficientBalance') }}
                    </span>
                </template>
                <template v-else>
                    {{ $t('common.availableBalance') }}
                </template>
            </div>
        </template>
        <template #end>
            <div class="w-24px h-24px flex items-center justify-center">
                <MpIcon
                    v-if="selected"
                    size="24"
                    icon="check"
                    class="text-primary"
                    :class="{ 'text-color-disabled': disabled }"
                />
            </div>
        </template>
    </MpCell>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import { storeToRefs } from 'pinia';
import MpCell from '../mp-cell/mp-cell.vue';
import MpIcon from '../mp-icon/mp-icon.vue';
import { useAccountStore, usePaymentStore } from '@local/runtime';

const PAYMENT_TOOL_ACCOUNT = '0003';
const PAYMENT_TOOL_CARD = '0004';

interface AccountLike {
    paymentTool?: string;
    nickName?: string;
    accountName?: string;
    payerAccountNumber?: string;
    cardType?: string;
    payerCardNumber?: string;
    availableBalance?: string | number;
    payerCurrency?: string;
}

const props = withDefaults(
    defineProps<{
        account?: AccountLike | string;
        index?: number;
        selected?: boolean;
        payAmount?: string;
        ignoreCheck?: boolean;
        disabled?: boolean;
        /** 设计器/出码：遮盖余额，不传则用 useAccountStore().maskBalance */
        maskBalance?: boolean;
    }>(),
    {
        account: undefined,
        index: 0,
        selected: false,
        payAmount: '',
        ignoreCheck: false,
        disabled: false,
        maskBalance: undefined,
    },
);

const emit = defineEmits<{
    click: [];
}>();

const instance = getCurrentInstance();
const $getCurrencySymbol = (instance?.appContext.config.globalProperties?.$getCurrencySymbol as ((c?: string) => string) | undefined) ?? ((c?: string) => c ?? 'HK$');
const $currency = (instance?.appContext.config.globalProperties?.$currency as ((v: string | number, o?: string | object) => { format: () => string }) | undefined) ?? ((v: string | number) => ({ format: () => String(v) }));

const { maskBalance: storeMaskBalance } = storeToRefs(useAccountStore());
const maskBalance = computed(() => props.maskBalance ?? storeMaskBalance.value);

function parseAccount(raw: AccountLike | string | undefined): AccountLike | null {
    if (raw == null) return null;
    if (typeof raw === 'object') return raw;
    if (typeof raw !== 'string' || !raw.trim()) return null;
    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
        return null;
    }
}

const accountData = computed(() => parseAccount(props.account));

const titleText = computed(() => {
    const a = accountData.value;
    if (!a) return 'My Account';
    return a.nickName || a.accountName || 'Account';
});

const lastFour = computed(() => {
    const num = accountData.value?.payerAccountNumber;
    if (!num || typeof num !== 'string') return '****';
    return num.slice(-4);
});

const cardTitle = computed(() => {
    const a = accountData.value;
    if (!a) return 'Card';
    return a.nickName || a.cardType || 'Card';
});

const cardLastFour = computed(() => {
    const num = accountData.value?.payerCardNumber;
    if (!num || typeof num !== 'string') return '****';
    return num.slice(-4);
});

const canUsed = computed(() => {
    if (props.ignoreCheck) return true;
    const acc = accountData.value;
    if (!acc) return true;
    const payAmount = props.payAmount || '';
    return checkPaymentway(acc as Parameters<typeof checkPaymentway>[0], [], payAmount);
});

const descBalance = computed(() => {
    const a = accountData.value;
    if (a?.availableBalance === undefined || a.availableBalance === null) return '';
    if (maskBalance.value) {
        return `${$getCurrencySymbol(a.payerCurrency)} ******`;
    }
    return $currency(a.availableBalance, a.payerCurrency).format();
});

function onClick() {
    if (!canUsed.value || props.disabled) return;
    emit('click');
}
</script>

<style scoped>
.line-clamp-1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
