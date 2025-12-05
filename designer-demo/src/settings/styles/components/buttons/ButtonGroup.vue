<template>
    <ul>
        <tiny-tooltip
            v-for="(item, index) in props.options"
            :key="index"
            :content="item.tip"
            placement="top"
            effect="light"
        >
            <li
                :data-active="item.value === value ? '' : undefined"
                @click="handleClick(item.value)"
            >
                <span v-if="item.icon" class="icon-wrap">
                    <svg-icon v-if="item.icon" :name="item.icon" />
                </span>
                <span v-if="item.label">{{ item.label }}</span>
            </li>
        </tiny-tooltip>
    </ul>
</template>

<!-- eslint-disable vue/block-lang, vue/require-default-prop, vue/define-props-declaration, vue/require-typed-object-prop, vue/define-emits-declaration -->
<script setup lang="ts">
/* metaService: engine.setting.styles.ButtonGroup */
import { Tooltip as TinyTooltip } from '@opentiny/vue';
import { defineEmits, defineProps, ref, watch } from 'vue';

// eslint-disable-next-line vue/define-props-declaration
const props = defineProps({
    // eslint-disable-next-line vue/require-default-prop, vue/require-typed-object-prop
    options: {
        type: Array,
        default: undefined
    },
    // eslint-disable-next-line vue/require-typed-object-prop
    modelValue: {
        type: String,
        required: true
    }
});

// eslint-disable-next-line vue/define-emits-declaration
const emit = defineEmits(['update:modelValue']);

const value = ref(props.modelValue);

watch(
    () => props.modelValue,
    newValue => {
        value.value = newValue;
    }
);

const handleClick = newValue => {
    value.value = newValue;
    emit('update:modelValue', newValue);
};
</script>

<!-- eslint-disable-next-line vue/block-lang -->
<style lang="less" scoped>
ul {
    width: 100%;
    display: flex;
    border-radius: 4px;
    background: var(--te-styles-button-bg-color);
    li {
        background: var(--te-styles-button-bg-color);
        color: var(--te-styles-common-text-color-secondary);
        border-radius: 4px;
        flex: 1;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        cursor: pointer;
        position: relative;
    }
    li[data-active] {
        background: var(--te-styles-button-bg-color-active);
        color: var(--te-styles-button-text-color-active);
    }
    li:not(:last-child)::after {
        content: '';
        position: absolute;
        width: 1px;
        height: 50%;
        background-color: var(--te-styles-common-border-color);
        right: 0;
        top: 50%;
        transform: translate(50%, -50%);
        z-index: 100;
    }
    li:has(+ li[data-active])::after,
    li[data-active]::after {
        content: none;
    }
    li > .icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .icon-wrap > svg.svg-icon {
        font-size: 14px;
    }
}
</style>
