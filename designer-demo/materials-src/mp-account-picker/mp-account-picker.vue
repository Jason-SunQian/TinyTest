<template>
    <MpPopup v-model:show="show" :title="realTitle">
        <template v-if="paymentWays.length > 1" #sub-header>
            <mr-segment
                :value="String(currentIndex)"
                class="mt-5px w-100%"
                @ion-change="onTabChange"
            >
                <mr-segment-button
                    v-for="(item, index) in paymentWays"
                    :key="item.type || index"
                    :value="String(index)"
                    class="flex-1"
                >
                    <mr-label>{{ item.title }}</mr-label>
                </mr-segment-button>
            </mr-segment>
        </template>
        <template v-if="paymentWays[currentIndex]">
            <div v-for="(account, index) in paymentWays[currentIndex].list" :key="account.payCode">
                <MpAccountItem
                    class="h-62px"
                    :index="index"
                    :account="account"
                    :disabled="!!account.payCode && disabledAccounts.includes(account.payCode)"
                    :pay-amount="paymentWayAmount[account.payerCurrency]"
                    :selected="selectedAccount?.payCode === account.payCode"
                    :ignore-check="ignoreCheck"
                    @click="onClick(account)"
                />
                <MrDivider class="m-0!" hairline />
            </div>
        </template>
        <template v-if="paymentWays.length === 0">
            <MpEmpty
                :title="$t('common.noAccounts')"
                class="border-1px border-solid border-neutral-200 bg-neutral-50 rounded-12px my-20px mb-36px"
            />
        </template>
    </MpPopup>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import MpPopup from '../mp-popup/mp-popup.vue';
import MpAccountItem from '../mp-account-item/mp-account-item.vue';
import MpEmpty from '../mp-empty/mp-empty.vue';
import { MrDivider, MrSegment, MrSegmentButton, MrLabel } from '@local/mr-components';
import { usePaymentStore } from '@local/runtime';

interface PaymentWay {
    payCode?: string;
    paymentTool?: string;
    payerCurrency?: string;
    [key: string]: unknown;
}
interface PaymentValue {
    [key: string]: unknown;
}

const props = withDefaults(
    defineProps<{
        sceneType?: string;
        channelCode?: string;
        title?: string;
        payAmount?: string;
        payeeCcy?: string;
        ignoreCheck?: boolean;
        disabledAccounts?: string[];
    }>(),
    {
        sceneType: '',
        channelCode: undefined,
        title: '',
        payAmount: '',
        payeeCcy: '',
        ignoreCheck: false,
        disabledAccounts: () => [],
    }
);

const emit = defineEmits<{
    select: [account: PaymentWay, manual?: boolean];
    click: [account: PaymentWay];
}>();

const show = defineModel<boolean>('show', { default: false });
const model = defineModel<PaymentWay>({ default: () => ({}) });

const route = useRoute();
const { t } = useI18n();
const paymentStore = usePaymentStore();

const currentIndex = ref(0);
const paymentWayAmount = ref<Record<string, string>>({});
const selectedAccount = ref<PaymentWay | null>(null);

const cacheKey = computed(() => {
    let codeKey = props.sceneType;
    if (props.channelCode) codeKey = `${props.sceneType}_${props.channelCode}`;
    return codeKey;
});
const paymentWays = computed(() => paymentStore.getPaymentWay(cacheKey.value));
const realTitle = computed(() => {
    if (props.title) return props.title;
    if (paymentWays.value.length === 1) return paymentWays.value[0]?.selectTitle ?? '';
    return t('common.selectPayWayLabel');
});

function filterKeysByPrefix(obj: PaymentWay, prefix: string): PaymentValue {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => key.startsWith(prefix))
    ) as PaymentValue;
}
function setSelectedAccount(item: PaymentWay, manual?: boolean) {
    selectedAccount.value = { ...item };
    model.value = filterKeysByPrefix(selectedAccount.value, 'payer');
    emit('select', item, manual);
}
function setDefaultAccount() {
    const payAccountNo = (route.query?.payAccountNo as string) ?? '';
    const payCode = (route.query?.payCode as string) ?? '';
    const result = paymentStore.getDefaultPaymentWay(paymentWays.value, {
        payAccountNo,
        payCode,
        ignoreCheck: props.ignoreCheck,
        disabledAccounts: props.disabledAccounts,
    });
    if (!result) return;
    const { defaultAccount, index } = result;
    currentIndex.value = index;
    setSelectedAccount(defaultAccount);
}

watch(
    () => props.sceneType,
    () => {
        currentIndex.value = 0;
    }
);
watch(
    () => props.payAmount,
    async () => {
        paymentWayAmount.value = await paymentStore.calcPaymentWayAmount(
            cacheKey.value,
            props.payAmount,
            selectedAccount.value?.payerCurrency || ''
        );
    }
);

function onTabChange(evt: CustomEvent<{ value: string }>) {
    const next = Number(evt.detail?.value ?? 0);
    setTimeout(() => {
        currentIndex.value = next;
    }, 300);
}
function onClick(item: PaymentWay) {
    setSelectedAccount(item, true);
    emit('click', item);
    show.value = false;
}

onMounted(() => {
    watch(
        () => paymentWays.value,
        (newValue) => {
            if (paymentStore.paymentWayLoading[cacheKey.value]) return;
            const [currentPaymentWay] = newValue;
            if (!currentPaymentWay) {
                setSelectedAccount({
                    accountName: '',
                    payerAccountNumber: '',
                    accountNumberMask: '',
                    payerCurrency: '',
                    payTool: '',
                    payCurrency: '',
                    payCode: '',
                });
                return;
            }
            if (
                selectedAccount.value?.paymentTool &&
                newValue.some((pw: { list: PaymentWay[] }) =>
                    pw.list.some((i) => i.payCode === selectedAccount.value?.payCode)
                )
            ) {
                return;
            }
            setDefaultAccount();
        },
        { immediate: true, deep: true, flush: 'post' }
    );
    watch(
        () => props.disabledAccounts,
        () => {
            if (
                props.disabledAccounts.length > 0 &&
                props.disabledAccounts.includes(selectedAccount.value?.payCode || '')
            ) {
                setDefaultAccount();
            }
        },
        { immediate: true, deep: true, flush: 'post' }
    );
    paymentStore.queryPaymentWay({
        sceneType: props.sceneType,
        channelCode: props.channelCode,
        force: true,
    });
});
</script>
