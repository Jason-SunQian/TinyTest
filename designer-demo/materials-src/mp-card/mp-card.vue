<template>
  <div :class="[$style['mp-card'], 'mp-card-wrap']">
    <template v-if="title || $slots.header || $slots.headerEnd">
      <slot name="header" />
      <div class="mp-card-header">
        <span v-if="title" class="mp-card-title">{{ title }}</span>
        <slot name="headerEnd" />
      </div>
      <MrDivider hairline />
    </template>
    <div class="mp-card-body">
      <slot />
    </div>
    <template v-if="$slots.footer">
      <slot name="footer" />
    </template>
  </div>
</template>

<script setup>
import { MrDivider } from '@local/mr-components';

defineProps({
  title: { type: String, default: '' }
});
</script>

<style module>
.mp-card {
  padding: 12px;
  background: var(--mp-card-bg, #fff);
  border-radius: 8px;
}
</style>

<style scoped>
.mp-card-wrap {
  box-sizing: border-box;
}
.mp-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mp-card-title {
  font-weight: 500;
}
.mp-card-body {
  margin-top: 8px;
}
</style>
