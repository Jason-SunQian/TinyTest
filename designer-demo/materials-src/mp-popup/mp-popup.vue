<template>
    <Teleport to="body">
        <div
            v-show="show"
            class="mp-popup-overlay"
            @click.self="show = false"
        >
            <div class="mp-popup-panel">
                <div v-if="title || $slots.title" class="mp-popup-header">
                    <slot name="title">
                        <span class="mp-popup-title">{{ title }}</span>
                    </slot>
                    <button type="button" class="mp-popup-close" aria-label="Close" @click="show = false">×</button>
                </div>
                <div v-if="$slots['sub-header']" class="mp-popup-sub-header">
                    <slot name="sub-header" />
                </div>
                <div class="mp-popup-body">
                    <slot />
                </div>
                <div v-if="$slots.footer" class="mp-popup-footer">
                    <slot name="footer" />
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        title?: string;
    }>(),
    { title: '' }
);

const show = defineModel<boolean>('show', { default: false });
</script>

<style scoped>
.mp-popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
    display: flex;
    align-items: flex-end;
    justify-content: center;
}
.mp-popup-panel {
    background: var(--mr-color-bg-primary, #fff);
    border-radius: 16px 16px 0 0;
    max-height: 80vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
}
.mp-popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--mr-color-border-1, #ebedf0);
}
.mp-popup-title {
    font-size: 18px;
    font-weight: 500;
    color: var(--mr-color-text-primary, #323233);
}
.mp-popup-close {
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    font-size: 24px;
    line-height: 1;
    color: var(--mr-color-text-secondary, #969799);
    cursor: pointer;
}
.mp-popup-sub-header {
    padding: 8px 16px;
    border-bottom: 1px solid var(--mr-color-border-1, #ebedf0);
}
.mp-popup-body {
    flex: 1;
    overflow: auto;
    padding: 16px;
}
.mp-popup-footer {
    padding: 12px 16px;
    border-top: 1px solid var(--mr-color-border-1, #ebedf0);
}
</style>
