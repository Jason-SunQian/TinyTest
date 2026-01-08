<template>
  <p class="empty-text">{{ placeholderText || defaultText }}</p>
</template>

<script setup>
import { computed } from 'vue'
import { useDesignerI18n } from '@/services/i18nService'

const props = defineProps({
  placeholderText: String
})

const { t } = useDesignerI18n()
const defaultText = computed(() => t('designer.canvas.dragComponentHere'))
</script>

<style lang="less" scoped>
.empty-text {
  position: absolute;
  top: 250px;
  left: 50%;
  transform: translate(-50%);
  color: #808080;
  font-size: 12px;
}
</style>

