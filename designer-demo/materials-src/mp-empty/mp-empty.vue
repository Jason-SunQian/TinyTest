<template>
    <div class="mp-empty">
        <div class="mp-empty-icon" v-if="showIcon">
            <img :src="iconUrl" alt="empty" class="mp-empty-icon-img" />
        </div>
        <div class="mp-empty-title">
            {{ title || 'No data' }}
        </div>
        <div v-if="desc" class="mp-empty-desc">
            {{ desc }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import defaultIcon from './images/no_data.png';

const props = withDefaults(
    defineProps<{
        title?: string;
        desc?: string;
        /** 可选的图标地址，设计器里可自行配置 */
        icon?: string;
    }>(),
    {
        title: '',
        desc: '',
        icon: '',
    },
);

const iconUrl = computed(() => props.icon || defaultIcon);
const showIcon = computed(() => !!iconUrl.value);
</script>

<style scoped>
.mp-empty {
    width: 100%;
    padding: 22px 0 26px;
    text-align: center;
}

.mp-empty-icon {
    margin-bottom: 24px;
}

.mp-empty-icon-img {
    max-width: 206px;
    width: 100%;
    display: inline-block;
}

.mp-empty-title {
    margin-top: 10px;
    font-size: 16px;
    font-weight: 500;
    color: var(--mr-color-text-primary, #111827);
}

.mp-empty-desc {
    margin-top: 4px;
    font-size: 14px;
    color: var(--mr-color-text-secondary, #6b7280);
}
</style>

