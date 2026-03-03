<template>
    <div :class="$style['mp-tags']">
        <div
            :class="['mp-tags-inner', { 'mp-tags-scrollable': scrollable }]"
        >
            <button
                v-for="(item, index) in parsedList"
                :key="index"
                type="button"
                :class="['mp-tag-btn', { 'mp-tag-btn-active': item[valueField] === modelValue }]"
                @click="onTagClick(item)"
            >
                {{ item[displayField] }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        list?: Record<string, unknown>[] | string;
        displayField?: string;
        valueField?: string;
        scrollable?: boolean;
        modelValue?: string;
    }>(),
    {
        list: () => [],
        displayField: 'name',
        valueField: 'value',
        scrollable: true,
        modelValue: '',
    },
);

const emit = defineEmits<{
    'update:modelValue': [value: string];
    change: [item: Record<string, unknown>];
}>();

function parseList(raw: Record<string, unknown>[] | string): Record<string, unknown>[] {
    if (Array.isArray(raw)) {
        return raw;
    }
    if (typeof raw !== 'string' || !raw.trim()) {
        return [];
    }
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        try {
            const fn = new Function(`return ${raw}`);
            const result = fn();
            return Array.isArray(result) ? result : [];
        } catch {
            return [];
        }
    }
}

const parsedList = computed(() => {
    const arr = parseList(props.list);
    if (arr.length === 0) {
        return [
            { name: 'Tag 1', value: '1' },
            { name: 'Tag 2', value: '2' },
            { name: 'Tag 3', value: '3' },
        ] as Record<string, unknown>[];
    }
    return arr;
});

function onTagClick(item: Record<string, unknown>) {
    const val = String(item[props.valueField] ?? '');
    emit('update:modelValue', val);
    emit('change', item);
}
</script>

<style lang="scss" module>
.mp-tags {
    /* 不再使用负 margin，避免在插件画布中宽度超出屏幕；主工程若需贴边效果可由页面容器控制 */
    max-width: 100%;
    box-sizing: border-box;
}
</style>

<style scoped>
.mp-tags-inner {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-left: var(--mp-horizontal-padding, 16px);
    padding-right: var(--mp-horizontal-padding, 16px);
    box-sizing: border-box;
}

.mp-tags-scrollable {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.mp-tags-scrollable::-webkit-scrollbar {
    display: none;
}

.mp-tag-btn {
    flex-shrink: 0;
    min-height: 30px;
    padding: 0 12px;
    font-size: 14px;
    color: var(--mr-color-text-primary, #111827);
    background: transparent;
    border: 1px solid var(--mr-color-button-border-tertiary, #e5e7eb);
    border-radius: 999px;
    cursor: pointer;
    white-space: nowrap;
}

.mp-tag-btn:hover {
    opacity: 0.9;
}

.mp-tag-btn-active {
    background-color: var(--mr-color-button-bg-primary, #2563eb);
    border-color: transparent;
    color: #fff;
}
</style>
