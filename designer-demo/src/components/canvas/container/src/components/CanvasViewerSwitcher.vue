/* eslint-disable max-lines */
<!-- eslint-disable vue/no-bare-strings-in-template, vue/max-lines-per-block, vue/block-lang, @typescript-eslint/naming-convention, vue/component-api-style, no-inline-comments, line-comment-position, @typescript-eslint/restrict-plus-operands, vue/attributes-order, vue/html-self-closing -->
<template>
    <tiny-popover
        ref="popoverRef"
        :visible-arrow="false"
        trigger="click"
        placement="bottom-start"
        :disabled="state.disabled"
        popper-class="preview-switcher-popover"
    >
        <template #reference>
            <div
                v-show="state.show"
                :class="{
                    'action-wrapper': true,
                    disabled: state.disabled
                }"
                :title="t('designer.canvas.showAs')"
                @click="handleClick"
            >
                <div class="action">
                    <slot>
                        <svg-icon name="eye" />
                    </slot>
                </div>
            </div>
        </template>
        <div class="options">
            <div class="title">{{ t('designer.canvas.showAs') }}</div>
            <div
                v-for="option in state.previewOptions"
                :key="option.id"
                class="option"
                @click="handleSwitchPreview(option.id)"
            >
                <svg-icon :name="option.icon" />
                <span>{{ option.label }}</span>
            </div>
        </div>
    </tiny-popover>
</template>

<script lang="ts">
/* eslint-disable vue/max-lines-per-block, vue/component-api-style, @typescript-eslint/naming-convention, no-inline-comments, line-comment-position, @typescript-eslint/restrict-plus-operands, vue/require-typed-object-prop, vue/require-typed-ref */
import {
    getMetaApi,
    META_SERVICE,
    useCanvas,
    usePage,
    useMessage
} from '@opentiny/tiny-engine-meta-register';
import { constants } from '@opentiny/tiny-engine-utils';
import { Popover } from '@opentiny/vue';
import { useBroadcastChannel } from '@vueuse/core';
import { reactive, ref, watch } from 'vue';

import { useDesignerI18n } from '@/services/i18nService';

const { BROADCAST_CHANNEL, CANVAS_ROUTER_VIEW_SETTING_VIEW_MODE_KEY } =
    constants;

const COMPONENT_WHITELIST = ['RouterView'];

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyPopover: Popover
    },
    props: {
        hoverState: {
            type: Object,
            default: () => ({})
        },
        inactiveHoverState: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props) {
        const { t } = useDesignerI18n();

        function getCacheValue() {
            const value = localStorage.getItem(
                CANVAS_ROUTER_VIEW_SETTING_VIEW_MODE_KEY
            );
            if (!['embedded', 'standalone'].includes(value)) {
                return 'embedded';
            }
            return value;
        }

        const state = reactive({
            show: false,
            disabled: false,
            left: 0,
            top: 0,
            previewOptions: [],
            usedHoverState: null,
            viewMode: getCacheValue()
        });

        watch(
            () => [state.usedHoverState, state.viewMode],
            ([usedHoverState, viewMode]) => {
                state.show = usedHoverState && viewMode === 'embedded';
            },
            { immediate: true }
        );

        const popoverRef = ref<{
            doShow: () => void;
            doClose: () => void;
        } | null>(null);

        const handleClick = async () => {
            if (state.disabled) {
                return;
            }

            const pageId =
                state.usedHoverState.element.getAttribute('data-te-page-id');
            const children = await usePage().getPageChildren(pageId);

            state.previewOptions = [
                { id: pageId, label: '路由子页面占位符', icon: 'box' }
            ].concat(
                children.map(({ id, name }) => ({
                    id: String(id),
                    label: name,
                    icon: 'text-page-common'
                }))
            );

            // 在popover已经弹出的情况下，再去另一个位置点击触发弹出，会导致popover闪现（打开后立即关闭），是因为popover关闭时会播放动画，导致延迟关闭
            // 加上setTimeout，稍后重新打开popover
            setTimeout(() => {
                popoverRef.value?.doShow();
            }, 0);
        };

        const closePopover = () => {
            popoverRef.value?.doClose();
        };

        const handleSwitchPreview = previewId => {
            closePopover();
            getMetaApi(META_SERVICE.GlobalService).updatePreviewId(previewId);
            useCanvas().canvasApi.value?.clearSelect?.();
        };

        watch(
            () => [props.hoverState, props.inactiveHoverState],
            ([hoverState, inactiveHoverState]) => {
                // 确保不是已激活的页面上游
                // 确保不是已激活页面自己的页面框
                state.usedHoverState = [inactiveHoverState, hoverState].find(
                    ({ componentName, element }) =>
                        COMPONENT_WHITELIST.includes(componentName) &&
                        element.ownerDocument
                            .querySelector('div[data-page-active="true"]')
                            ?.contains(element) &&
                        element.getAttribute('data-page-active') !== 'true'
                );

                if (!state.usedHoverState) {
                    return;
                }

                const { width, left, top } = state.usedHoverState;
                state.left = `${Number(left) + Number(width)}px`;
                state.top = `${top}px`;
            },
            { deep: true }
        );

        const { data } = useBroadcastChannel({
            name: BROADCAST_CHANNEL.CanvasRouterViewSetting
        });

        watch(data, value => {
            state.viewMode = value.viewMode;
        });

        const { subscribe } = useMessage();

        subscribe({
            topic: 'canvas-mousedown',
            callback: () => {
                closePopover();
            }
        });

        return {
            popoverRef,
            state,
            handleClick,
            handleSwitchPreview,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.action-wrapper {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--te-common-bg-default);
    cursor: pointer;
    z-index: 3;
    transform: translateX(-80%) translateY(-20%);
    top: v-bind('state.top');
    left: v-bind('state.left');
    border: 1px solid var(--te-common-border-hover);
    &.disabled {
        opacity: 0.3;
    }
    &:not(.disabled):hover {
        border-color: var(--te-common-bg-primary-checked);
        background-color: var(--te-common-bg-primary-checked);
        .action {
            color: var(--te-common-text-dark-inverse);
        }
    }
    .action {
        width: 16px;
        height: 16px;
    }
}
.options {
    width: 200px;
    .option {
        font-size: 12px;
        min-height: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 0 12px;
        &:hover {
            background-color: var(--te-common-bg-container);
        }
        svg {
            flex-shrink: 0;
        }
    }
    .title {
        font-size: 14px;
        line-height: 20px;
        padding: 4px 12px;
        font-weight: bold;
        cursor: default;
        border-bottom: 1px solid var(--te-common-border-default);
    }
}
</style>

<style lang="scss">
.tiny-popover.tiny-popper[x-placement].preview-switcher-popover {
    padding: 8px 0;
}
</style>
