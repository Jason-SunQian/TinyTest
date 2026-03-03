<template>
    <div class="mp-date-picker">
        <mr-date-picker
            v-model="date"
            visible-option-num="5"
            option-height="48px"
            :show-toolbar="false"
            :columns-type="columnsTypeArr"
            :formatter="formatter"
            :min-date="minDateVal"
            :max-date="maxDateVal"
            :readonly="readonly"
            @change="onChange"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { MrDatePicker } from '@local/mr-components';

type DatePickerColumnType = 'year' | 'month' | 'day';

const props = withDefaults(
    defineProps<{
        minDate?: Date | string;
        maxDate?: Date | string;
        readonly?: boolean;
        columnsType?: DatePickerColumnType[] | string;
        modelValue?: string[];
    }>(),
    {
        minDate: undefined,
        maxDate: undefined,
        readonly: false,
        columnsType: () => ['month', 'day', 'year'],
        modelValue: undefined,
    },
);

const emit = defineEmits<{
    'update:modelValue': [value: string[]];
    change: [value: string[]];
}>();

function defaultDate(): string[] {
    const d = new Date();
    return [
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0'),
        String(d.getFullYear()),
    ];
}

const date = ref<string[]>(props.modelValue ?? defaultDate());

watch(
    () => props.modelValue,
    (val) => {
        if (val && Array.isArray(val) && val.length) date.value = val;
    },
    { immediate: true },
);

watch(date, (val) => emit('update:modelValue', val), { deep: true });

function parseColumnsType(
    raw: DatePickerColumnType[] | string,
): DatePickerColumnType[] {
    if (Array.isArray(raw) && raw.length) return raw;
    if (typeof raw === 'string' && raw.trim()) {
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : ['month', 'day', 'year'];
        } catch {
            return ['month', 'day', 'year'];
        }
    }
    return ['month', 'day', 'year'];
}

const columnsTypeArr = computed(() => parseColumnsType(props.columnsType));

function toDate(v: Date | string | undefined): Date | undefined {
    if (v == null) return undefined;
    if (v instanceof Date) return isNaN(v.getTime()) ? undefined : v;
    const d = new Date(v);
    return isNaN(d.getTime()) ? undefined : d;
}

const minDateVal = computed(() => toDate(props.minDate));
const maxDateVal = computed(() => toDate(props.maxDate));

function formatter(type: string, option: { text?: string; value?: string | number }) {
    if (type === 'month' && option.value != null) {
        const monthIndex = Number(option.value) - 1;
        option.text = new Date(2024, monthIndex, 1).toLocaleString('en-US', {
            month: 'long',
        });
    }
    return option;
}

function onChange() {
    emit('change', date.value);
}
</script>

<style scoped>
.mp-date-picker {
    max-width: 100%;
    min-width: 0;
    box-sizing: border-box;
}
</style>
