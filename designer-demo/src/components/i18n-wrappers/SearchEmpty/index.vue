<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-root-v-if -->
<template>
    <div v-if="isShow" class="empty-wrap">
        <svg-icon class="empty-icon" name="empty" />
        <p class="empty-text">
            {{ t('designer.components.searchEmpty.noData') }}
        </p>
    </div>
</template>

<script lang="ts" setup>
import { useDesignerI18n } from '@/services/i18nService';

defineProps<{
    isShow: boolean;
}>();

const { t } = useDesignerI18n();
</script>

<style lang="scss" scoped>
.empty-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 56px;
    .empty-icon {
        width: 80px;
        height: 80px;
    }
    .empty-text {
        font-size: 12px;
        color: var(--te-component-common-text-color-weaken);
    }
}
</style>
