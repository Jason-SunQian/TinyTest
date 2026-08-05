<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <span class="link-button">
        <tiny-tooltip effect="light" :content="tips">
            <template #content>
                <div class="tip-content">
                    {{ tips }}
                </div>
                <!--
                  Hide "View Details": links go to opentiny.design help-center,
                  but target=_blank is often blocked / no-op in VS Code webview.
                -->
            </template>
            <svg-icon name="plugin-icon-plugin-help" />
        </tiny-tooltip>
    </span>
</template>

<script lang="ts">
import { TinyTooltip } from '@opentiny/vue';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTooltip
    },
    props: {
        // Kept for call-site compatibility (PluginPanel / styles still pass docsUrl)
        href: {
            type: String,
            default: ''
        },
        tips: {
            type: String,
            default: '帮助'
        }
    }
};
</script>

<style lang="scss" scoped>
.link-button {
    width: 24px;
    height: 24px;
    font-size: 16px;
    margin-left: 4px;
    color: var(--te-component-common-icon-color-primary);
    border: 1px solid transparent;
    border-radius: 4px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .svg-icon {
        outline: none;
    }
    :deep(.svg-icon.icon-plugin-icon-plugin-help) {
        font-size: 16px;
    }
}
.tip-content {
    width: 220px;
    color: var(--te-component-common-text-color-secondary);
}
</style>
