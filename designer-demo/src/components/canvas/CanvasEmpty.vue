<template>
    <p class="empty-text">{{ placeholderText || defaultText }}</p>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars, import/order */
import { computed } from 'vue';

import { useDesignerI18n } from '@/services/i18nService';

const props = defineProps({
    placeholderText: {
        type: String,
        default: ''
    }
});

const { t } = useDesignerI18n();
const defaultText = computed(() => t('designer.canvas.dragComponentHere'));
</script>

<style lang="scss" scoped>
.empty-text {
    position: absolute;
    top: 250px;
    left: 50%;
    transform: translate(-50%);
    color: #808080;
    font-size: 12px;
}
</style>
