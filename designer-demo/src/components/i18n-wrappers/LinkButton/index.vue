<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <span class="link-button">
        <tiny-tooltip effect="light" :content="tips">
            <template #content>
                <div class="tip-content">
                    {{ tips }}
                </div>
                <a
                    v-if="href"
                    class="tip-jump"
                    :href="href"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <svg-icon name="jump" />
                    {{ t('designer.common.viewDetails') }}
                </a>
            </template>
            <svg-icon name="plugin-icon-plugin-help" />
        </tiny-tooltip>
    </span>
</template>

<script lang="ts">
import { TinyTooltip } from '@opentiny/vue';

import { useDesignerI18n } from '@/services/i18nService';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTooltip
    },
    props: {
        href: {
            type: String,
            default: ''
        },
        tips: {
            type: String,
            default: '帮助'
        }
    },
    // eslint-disable-next-line vue/component-api-style
    setup() {
        const { t } = useDesignerI18n();
        return { t };
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
    margin-bottom: 6px;
    color: var(--te-component-common-text-color-secondary);
}
.tip-jump {
    color: var(--te-component-common-text-color-link);
}
</style>
