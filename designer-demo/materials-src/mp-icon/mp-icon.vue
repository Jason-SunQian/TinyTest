<template>
    <i
        :style="iconStyle"
        :class="[$style.icon, 'mp-icon-inline']"
    >
        <span v-if="iconSvg" class="mp-icon__svg" v-html="iconSvg"></span>
        <slot v-else />
        <span v-if="!iconSvg && !$slots.default" class="mp-icon__placeholder">Icon</span>
    </i>
</template>

<script setup lang="ts">
import { computed, type StyleValue } from 'vue';
/** 与主工程一致：图标来自主工程 assets/icons，复制到本组件 icons 目录 */
import calendarSvg from './icons/calendar.svg?raw';
import checkSvg from './icons/check.svg?raw';

const iconMap: Record<string, string> = {
    calendar: calendarSvg,
    check: checkSvg,
};

const props = withDefaults(
    defineProps<{
        color?: string;
        size?: string | number;
        /** 设计器用：指定内置图标名（如 calendar），与 icons 目录下同名 svg 对应；为空则使用默认插槽 */
        icon?: string;
    }>(),
    {
        color: '',
        size: undefined,
        icon: '',
    },
);

const iconStyle = computed(() => {
    const styleObj: StyleValue = {};
    if (props.color) styleObj.color = props.color;
    if (props.size !== undefined && props.size !== '') {
        styleObj.fontSize = typeof props.size === 'number' ? `${props.size}px` : props.size;
    }
    return styleObj;
});

const iconSvg = computed(() => {
    if (!props.icon) return '';
    return iconMap[props.icon] ?? '';
});
</script>

<style module lang="scss">
.icon {
    height: 1em;
    width: 1em;
    line-height: 1em;
    fill: currentColor;
    font-size: inherit;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;

    :global(svg) {
        height: 1em;
        width: 1em;
    }
}
</style>

<style scoped>
.mp-icon-inline {
    flex-shrink: 0;
}

.mp-icon__svg {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
}

.mp-icon__svg :deep(svg) {
    width: 100%;
    height: 100%;
    display: block;
}

.mp-icon__placeholder {
    font-size: 0.65em;
    color: #969799;
    line-height: 1;
}
</style>
