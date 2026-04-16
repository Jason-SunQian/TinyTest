<template>
    <toolbar-base :options="options">
        <template #default>
            <span class="redo-undo-wrap">
                <tiny-popover
                    trigger="hover"
                    :open-delay="1000"
                    popper-class="toolbar-right-popover"
                    append-to-body
                    :content="
                        historyState.back
                            ? t('designer.toolbar.undo', {
                                  defaultValue: '撤销'
                              })
                            : t('designer.toolbar.undoDisabled', {
                                  defaultValue: '没有要撤销的'
                              })
                    "
                >
                    <template #reference>
                        <span
                            :class="[
                                'icon-wrap',
                                'undo',
                                { disabled: !historyState.back }
                            ]"
                            @click="back"
                        >
                            <svg-icon :name="options.icon.undo"></svg-icon>
                        </span>
                    </template>
                </tiny-popover>
                <tiny-popover
                    trigger="hover"
                    :open-delay="1000"
                    popper-class="toolbar-right-popover"
                    append-to-body
                    :content="
                        historyState.forward
                            ? t('designer.toolbar.redo', {
                                  defaultValue: '恢复'
                              })
                            : t('designer.toolbar.redoDisabled', {
                                  defaultValue: '没有要恢复的'
                              })
                    "
                >
                    <template #reference>
                        <span
                            :class="[
                                'icon-wrap',
                                'redo',
                                !historyState.forward ? 'disabled' : ''
                            ]"
                            @click="forward"
                        >
                            <svg-icon :name="options.icon.redo"></svg-icon>
                        </span>
                    </template>
                </tiny-popover>
            </span>
        </template>
    </toolbar-base>
</template>

<script lang="ts">
/* metaService: engine.toolbars.redoundo.custom.Main */
import { onMounted } from 'vue';
import { Popover } from '@opentiny/vue';
import { ToolbarBase } from '@opentiny/tiny-engine-common';
import { useHistory } from '@opentiny/tiny-engine-meta-register';
import { useDesignerI18n } from '@/services/i18nService';

export default {
    components: {
        TinyPopover: Popover,
        ToolbarBase
    },
    props: {
        options: {
            type: Object,
            default: () => ({})
        }
    },
    setup() {
        const historyApi = useHistory();
        const { t } = useDesignerI18n();

        const writeTrace = (event: string, extra?: Record<string, unknown>) => {
            if (typeof window === 'undefined') return;
            const win = window as Window & {
                __TINY_REDOUNDO_TRACE__?: Array<Record<string, unknown>>;
                __TINY_REDOUNDO_LAST__?: Record<string, unknown>;
            };
            const row = {
                ts: Date.now(),
                event,
                ...extra
            };
            win.__TINY_REDOUNDO_TRACE__ = win.__TINY_REDOUNDO_TRACE__ || [];
            win.__TINY_REDOUNDO_TRACE__.push(row);
            win.__TINY_REDOUNDO_LAST__ = row;
        };

        const back = () => {
            writeTrace('toolbar-back-click', {
                backEnabled: Boolean(historyApi?.historyState?.back)
            });
            historyApi?.back?.();
        };

        const forward = () => {
            writeTrace('toolbar-forward-click', {
                forwardEnabled: Boolean(historyApi?.historyState?.forward)
            });
            historyApi?.forward?.();
        };

        onMounted(() => {
            writeTrace('toolbar-mounted', {
                serviceSource:
                    (historyApi as { __source?: string } | undefined)?.__source ||
                    'unknown',
                serviceKeys: Object.keys(
                    (historyApi as Record<string, unknown>) || {}
                )
            });
        });

        return {
            ...historyApi,
            back,
            forward,
            t
        };
    }
};
</script>

<style lang="less" scoped>
.redo-undo-wrap {
    display: flex;

    :deep(.icon-wrap) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        width: 32px;
        border-radius: 6px;
        svg {
            color: var(--te-toolbars-redoundo-text-color);
            font-size: 20px;
        }
        &.disabled {
            cursor: not-allowed;
            svg {
                color: var(--te-toolbars-redoundo-text-color-disabled);
            }
        }
        &:not(.disabled):hover {
            background: var(--te-toolbars-redoundo-bg-color-active);
            svg {
                color: var(--te-toolbars-redoundo-icon-color-hover);
            }
        }
        &.redo {
            margin-left: -5px;
        }
    }
}
</style>
