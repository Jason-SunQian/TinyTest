<template>
    <div
        :class="['mp-date-input', { 'mp-date-input_disabled': disabled, 'mp-date-input_readonly': readonly }]"
        @click="onWrapClick"
    >
        <div class="mp-date-input__inner">
            <div class="mp-date-input__cell" @click.stop="type === 'daterange' ? startInputRef?.click() : inputRef?.click()">
                <span class="mp-date-input__text">{{ displayStart }}</span>
                <span class="mp-date-input__icon" aria-hidden="true" v-html="calendarIconSvg"></span>
            </div>
            <template v-if="type === 'daterange'">
                <div class="mp-date-input__sep">–</div>
                <div class="mp-date-input__cell" @click.stop="endInputRef?.click()">
                    <span class="mp-date-input__text">{{ displayEnd }}</span>
                    <span class="mp-date-input__icon" aria-hidden="true" v-html="calendarIconSvg"></span>
                </div>
            </template>
        </div>
        <input
            v-if="type !== 'daterange'"
            :ref="(el) => { inputRef = el as HTMLInputElement }"
            :type="type === 'month' ? 'month' : 'date'"
            class="mp-date-input__native"
            :value="nativeDateValue"
            :min="minStr"
            :max="maxStr"
            :disabled="disabled || readonly"
            @change="onNativeChange"
        />
        <template v-else>
            <input
                :ref="(el) => { startInputRef = el as HTMLInputElement }"
                type="date"
                class="mp-date-input__native"
                :value="nativeStartValue"
                :min="minStr"
                :max="maxStr"
                :disabled="disabled || readonly"
                @change="onStartChange"
            />
            <input
                :ref="(el) => { endInputRef = el as HTMLInputElement }"
                type="date"
                class="mp-date-input__native"
                :value="nativeEndValue"
                :min="minStr"
                :max="maxStr"
                :disabled="disabled || readonly"
                @change="onEndChange"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
/** 与主工程一致：使用主工程 assets/icons 下的 calendar.svg，复制到本组件 icons 目录 */
import calendarIconSvg from './icons/calendar.svg?raw';

const props = withDefaults(
    defineProps<{
        placeholder?: string;
        readonly?: boolean;
        disabled?: boolean;
        minDate?: Date | string;
        maxDate?: Date | string;
        type?: 'date' | 'month' | 'daterange';
        modelValue?: Date | string;
        endDate?: Date | string;
    }>(),
    {
        placeholder: 'Select date',
        readonly: false,
        disabled: false,
        minDate: undefined,
        maxDate: undefined,
        type: 'date',
        modelValue: undefined,
        endDate: undefined,
    },
);

const emit = defineEmits<{
    'update:modelValue': [value: Date | string];
    'update:endDate': [value: Date | string];
    change: [date: Date, endDate?: Date];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const startInputRef = ref<HTMLInputElement | null>(null);
const endInputRef = ref<HTMLInputElement | null>(null);

function toDate(v: Date | string | undefined): Date | null {
    if (v == null) return null;
    if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
}

function formatDate(d: Date | null, type: string): string {
    if (!d) return '';
    if (type === 'month') return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    return d.toISOString().slice(0, 10);
}

const startDate = computed(() => toDate(props.modelValue));
const endDateVal = computed(() => toDate(props.endDate));

const displayStart = computed(() => {
    const d = startDate.value;
    return d ? formatDate(d, props.type) : props.placeholder;
});

const displayEnd = computed(() => {
    const d = endDateVal.value;
    return d ? formatDate(d, props.type) : props.placeholder;
});

const nativeDateValue = computed(() => {
    const d = startDate.value;
    if (!d) return '';
    return props.type === 'month' ? formatDate(d, 'month') : formatDate(d, 'date');
});

const nativeStartValue = computed(() => (startDate.value ? formatDate(startDate.value, 'date') : ''));
const nativeEndValue = computed(() => (endDateVal.value ? formatDate(endDateVal.value, 'date') : ''));

const minStr = computed(() => {
    const d = toDate(props.minDate);
    return d ? formatDate(d, 'date') : undefined;
});
const maxStr = computed(() => {
    const d = toDate(props.maxDate);
    return d ? formatDate(d, 'date') : undefined;
});

function onWrapClick() {
    if (props.disabled || props.readonly) return;
    if (props.type === 'daterange') startInputRef.value?.click();
    else inputRef.value?.click();
}

function onNativeChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const v = target.value;
    if (!v) return;
    if (props.type === 'month') {
        const dateStr = v + '-01';
        emit('update:modelValue', dateStr);
        emit('change', new Date(dateStr));
    } else {
        emit('update:modelValue', v);
        emit('change', new Date(v));
    }
}

function onStartChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const v = target.value;
    if (v) {
        emit('update:modelValue', v);
        const end = endDateVal.value;
        emit('change', new Date(v), end ?? undefined);
    }
}

function onEndChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const v = target.value;
    if (v) {
        emit('update:endDate', v);
        const start = startDate.value;
        emit('change', start ?? new Date(), new Date(v));
    }
}
</script>

<style scoped>
.mp-date-input {
    display: flex;
    align-items: center;
    min-height: 44px;
    max-width: 100%;
    min-width: 0;
    padding: 0 16px;
    font-size: 14px;
    color: var(--mr-color-text-primary, #323233);
    background: var(--van-field-input-background, #fff);
    border: 1px solid var(--van-cell-border-color, #ebedf0);
    border-radius: 8px;
    box-sizing: border-box;
    cursor: pointer;
}

.mp-date-input:hover:not(.mp-date-input_disabled):not(.mp-date-input_readonly) {
    border-color: var(--van-field-hover-border-color, #c8c9cc);
}

.mp-date-input_disabled,
.mp-date-input_readonly {
    cursor: default;
    opacity: 0.7;
}

.mp-date-input__inner {
    display: flex;
    flex: 1;
    align-items: center;
    min-width: 0;
    overflow: hidden;
}

.mp-date-input__cell {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    min-width: 0;
    gap: 8px;
}

.mp-date-input__text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.mp-date-input__text:empty::before,
.mp-date-input .mp-date-input__text:not(:empty) {
    color: inherit;
}

.mp-date-input__icon {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 17px;
    height: 17px;
    color: var(--mr-color-icon-thirdly, #969799);
}

.mp-date-input__icon :deep(svg) {
    width: 100%;
    height: 100%;
    display: block;
}

.mp-date-input__sep {
    flex-shrink: 0;
    margin: 0 8px;
    color: #969799;
}

.mp-date-input__native {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    border: 0;
    opacity: 0;
    pointer-events: none;
}

</style>
