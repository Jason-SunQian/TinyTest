<template>
  <div>
    <div v-if="leftTitle || rightTitle" :class="$style['title-view']">
      <div :class="$style['left']">{{ leftTitle }}</div>
      <div :class="$style['right']">{{ rightTitle }}</div>
    </div>

    <div v-if="customText">
      <div
        :class="$style['progress-text']"
        :style="{
          color: percentage === 100 || percentage === '100' ? 'var(--mr-color-white)' : ''
        }"
      >
        {{ customText }}
      </div>
    </div>
    <MrProgress
      :percentage="percentage"
      :stroke-width="strokeWidth"
      :show-pivot="showPivot"
      :style="{
        '--van-progress-color': customColor ? customColor : '',
        '--van-progress-background': bgColor ? bgColor : ''
      }"
    />

    <div v-if="leftContent || rightContent" :class="$style['content-view']">
      <div :class="$style['left']">{{ leftContent }}</div>
      <div :class="$style['right']" :style="{ color: rightContentColor }">{{ rightContent }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MrProgress } from '@local/mr-components';

withDefaults(
  defineProps<{
    percentage?: string | number;
    strokeWidth?: string;
    leftTitle?: string;
    rightTitle?: string;
    leftContent?: string;
    rightContent?: string;
    rightContentColor?: string;
    showPivot?: boolean;
    customText?: string;
    customColor?: string;
    bgColor?: string;
  }>(),
  {
    percentage: '0',
    strokeWidth: '16',
    leftTitle: '',
    rightTitle: '',
    leftContent: '',
    rightContent: '',
    rightContentColor: 'var(--mr-color-neutral-600)',
    showPivot: true,
    customText: '',
    customColor: '',
    bgColor: ''
  }
);
</script>

<style module lang="scss">
.title-view {
  display: flex;
  font-size: 14px;
  margin-bottom: 12px;
}

.content-view {
  display: flex;
  font-size: 14px;
  margin-top: 12px;
}

.left {
}
.right {
  margin-left: auto;
  color: var(--mr-color-neutral-600);
}

.progress-text {
  color: var(--mr-color-neutral-950);
  font-size: 12px;
  position: relative;
  width: 100%;
  text-align: right;
  top: 20px;
  z-index: 1;
  right: 8px;
}
</style>
