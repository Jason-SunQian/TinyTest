<template>
    <div
        :class="['mp-account-input', { 'mp-account-input_disabled': disabled }]"
        @click="onClick"
    >
        <div class="mp-account-input__cell">
            <span class="mp-account-input__label">{{ label }}</span>
            <span class="mp-account-input__value">{{ displayValue }}</span>
            <span class="mp-account-input__arrow">›</span>
        </div>
        <MpAccountPicker
            v-model:show="showPicker"
            v-model="modelValue"
            :scene-type="sceneType"
            :channel-code="channelCode"
            :title="pickerTitle"
            :pay-amount="payAmount"
            :payee-ccy="payeeCcy"
            :ignore-check="ignoreCheck"
            :disabled-accounts="disabledAccounts"
            @select="onSelect"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import MpAccountPicker from '../mp-account-picker/mp-account-picker.vue';

interface AccountModel {
    payerAccountNumber?: string;
    accountNumberMask?: string;
    nickName?: string;
    payerCurrency?: string;
    payCode?: string;
    [key: string]: unknown;
}

const props = withDefaults(
    defineProps<{
        label?: string;
        placeholder?: string;
        sceneType?: string;
        channelCode?: string;
        pickerTitle?: string;
        payAmount?: string;
        payeeCcy?: string;
        ignoreCheck?: boolean;
        disabledAccounts?: string[];
        disabled?: boolean;
    }>(),
    {
        label: '',
        placeholder: 'Select account',
        sceneType: 'transfer',
        channelCode: undefined,
        pickerTitle: '',
        payAmount: '',
        payeeCcy: '',
        ignoreCheck: false,
        disabledAccounts: () => [],
        disabled: false,
    }
);

defineEmits<{
    select: [account: AccountModel];
}>();

const modelValue = defineModel<AccountModel>({ default: () => ({}) });
const showPicker = ref(false);
/** 选中后展示文案（picker 的 v-model 仅含 payer* 字段，需从 select 事件存一份用于展示） */
const displayText = ref('');

const displayValue = computed(() => {
    if (displayText.value) return displayText.value;
    const v = modelValue.value;
    if (v && typeof v === 'object' && v.payerAccountNumber) return v.payerAccountNumber;
    return props.placeholder;
});

watch(
    () => modelValue.value,
    (v) => {
        if (!v || typeof v !== 'object') displayText.value = '';
        else displayText.value = (v as AccountModel).payerAccountNumber || '';
    },
    { immediate: true }
);

function onClick() {
    if (props.disabled) return;
    showPicker.value = true;
}

function onSelect(account: AccountModel) {
    displayText.value = account.nickName || account.accountNumberMask || account.payerAccountNumber || '';
    showPicker.value = false;
}
</script>

<style scoped>
.mp-account-input {
    min-height: 44px;
    padding: 10px 12px;
    background: var(--mr-color-background, #fff);
    border-radius: 8px;
    cursor: pointer;
}
.mp-account-input_disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.mp-account-input__cell {
    display: flex;
    align-items: center;
    gap: 8px;
}
.mp-account-input__label {
    color: var(--mr-color-text-secondary, #969799);
    font-size: 14px;
    flex-shrink: 0;
}
.mp-account-input__value {
    flex: 1;
    color: var(--mr-color-text-primary, #323233);
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.mp-account-input__arrow {
    color: var(--mr-color-text-secondary, #969799);
    font-size: 16px;
}
</style>
