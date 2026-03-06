<template>
    <div
        :data-test-id="testId"
        :class="[$style['mp-cell'], { 'cursor-pointer': isLink }, 'relative flex items-center']"
    >
        <slot name="start" />
        <div v-if="$slots.start" :style="{ minWidth: `${gap}px` }" />
        <div class="flex-1 overflow-hidden">
            <slot name="title">
                <div :class="[$style['title'], 'flex text-h4 text-color-primary line-clamp-1']">
                    <div>{{ title }}</div>
                </div>
            </slot>
            <slot name="desc">
                <div v-if="desc" class="text-h6 text-color-secondary line-clamp-2 mt-4px">
                    {{ desc }}
                </div>
            </slot>
        </div>
        <slot name="end">
            <div v-if="isLink" class="flex items-center justify-end px-5px">
                <MpIcon v-if="isLink" size="24" class="text-color-secondary">
                    <span v-html="arrowRightSvg"></span>
                </MpIcon>
            </div>
        </slot>
    </div>
</template>

<script setup lang="ts">
import MpIcon from '../mp-icon/mp-icon.vue';
import arrowRightSvg from './icons/arrow-right.svg?raw';

withDefaults(
    defineProps<{
        title?: string;
        desc?: string;
        isLink?: boolean;
        gap?: number | string;
        testId?: string;
    }>(),
    {
        title: '',
        desc: '',
        isLink: false,
        gap: 8,
        testId: 'cell',
    },
);
</script>

<style module lang="scss">
.mp-cell {
    &:after {
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        top: -50%;
        right: -50%;
        bottom: -50%;
        left: -50%;
        border-top: var(--mp-cell-border-width, 0) solid var(--mr-color-border-1, #ebedf0);
        transform: scale(0.5);
    }

    .title {
        justify-content: var(--mp-cell-title-align, start);
    }
}
</style>
