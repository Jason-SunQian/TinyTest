<template>
    <div id="tiny-bottom-panel">
        <div class="content">
            <TinySteps
                v-show="data.length > 0"
                :data="data"
                @click="(_index: number, node: unknown) => selectFooterNode(node)"
            />
            <div v-show="data.length <= 0" class="tip">
                {{ t('designer.canvas.noSelectedNode') }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getMetaApi } from '@opentiny/tiny-engine-meta-register';
import { Steps } from '@opentiny/vue';

import { useDesignerI18n } from '@/services/i18nService';

defineProps<{
    data?: unknown[];
}>();

defineEmits<{
    click: [];
}>();

// eslint-disable-next-line @typescript-eslint/naming-convention
const TinySteps = Steps;

// 使用 useDesignerI18n 确保国际化正常工作
const { t } = useDesignerI18n();

const { selectNode } = getMetaApi('engine.canvas').canvasApi.value;
const selectFooterNode = (node: unknown) => {
    selectNode(node);
};
</script>

<style lang="scss" scoped>
#tiny-bottom-panel {
    width: 100%;
    height: var(--base-bottom-panel-height, 30px);
    bottom: 0;
    position: absolute;
    background-color: var(--te-canvas-breadcrumb-bg-color);
    z-index: 90;
    border-top: 1px solid var(--te-canvas-breadcrumb-border-color);
    .content {
        .tip {
            color: var(--te-canvas-breadcrumb-text-color);
            line-height: 30px;
            height: 30px;
            padding-left: 10px;
        }
        :deep(.tiny-steps-advanced) {
            li {
                width: unset !important;
                background: var(--te-canvas-breadcrumb-bg-color);
                .label {
                    padding: 0 3px 0 16px;
                    border-top: 0;
                    color: var(--te-canvas-breadcrumb-text-color);
                    transition: 0.3s;
                    border: none;
                    &:hover {
                        cursor: pointer;
                        background-color: var(
                            --te-canvas-breadcrumb-bg-color-hover
                        );
                        &::after {
                            border-left-color: var(
                                --te-canvas-breadcrumb-arrow-border-color-hover
                            );
                        }
                    }
                    &::after {
                        border-left-color: var(--te-canvas-breadcrumb-bg-color);
                    }
                }
                &:last-child .label {
                    border-right: 0px solid
                        var(--te-canvas-breadcrumb-border-color);
                    border-radius: 0;
                }
                &:first-child .label {
                    border-right: 0px solid
                        var(--te-canvas-breadcrumb-border-color);
                    border-radius: 0;
                    border-left: unset;
                }
            }
        }
    }
}
</style>
