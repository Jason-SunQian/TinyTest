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
                            @click="onBack"
                        >
                            <svg-icon :name="options.icon.undo" />
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
                            @click="onForward"
                        >
                            <svg-icon :name="options.icon.redo" />
                        </span>
                    </template>
                </tiny-popover>
            </span>
        </template>
    </toolbar-base>
</template>

<script setup lang="ts">
/* metaService: engine.toolbars.redoundo.custom.Main */
import { onMounted, toRef } from 'vue';
import { Popover as TinyPopover } from '@opentiny/vue';
import { ToolbarBase } from '@opentiny/tiny-engine-common';
import { useHistory } from '@opentiny/tiny-engine-meta-register';

import { useDesignerI18n } from '@/services/i18nService';

interface RedoundoToolbarOptions {
    icon: {
        undo: string;
        redo: string;
    };
}

const props = withDefaults(
    defineProps<{
        options?: RedoundoToolbarOptions;
    }>(),
    {
        options: () => ({
            icon: { undo: '', redo: '' }
        })
    }
);

defineOptions({
    name: 'toolbar-redoundo-main'
});

const options = toRef(props, 'options');

const historyApi = useHistory();
const { historyState, back, forward } = historyApi;
const { t } = useDesignerI18n();

const TRACE_KEY = '__TINY_REDOUNDO_TRACE__';
const LAST_KEY = '__TINY_REDOUNDO_LAST__';

const writeTrace = (event: string, extra?: Record<string, unknown>) => {
    if (typeof window === 'undefined') return;
    const win = window as Window & Record<string, unknown>;
    const row: Record<string, unknown> = {
        ts: Date.now(),
        event,
        ...extra
    };
    const trace =
        (win[TRACE_KEY] as Array<Record<string, unknown>> | undefined) || [];
    trace.push(row);
    win[TRACE_KEY] = trace;
    win[LAST_KEY] = row;
};

const onBack = () => {
    writeTrace('toolbar-back-click', {
        backEnabled: Boolean(historyState.back)
    });
    back();
};

const onForward = () => {
    writeTrace('toolbar-forward-click', {
        forwardEnabled: Boolean(historyState.forward)
    });
    forward();
};

onMounted(() => {
    const apiRecord = historyApi as Record<string, unknown>;
    const { historyServiceSource } = historyApi as {
        historyServiceSource?: string;
    };
    writeTrace('toolbar-mounted', {
        serviceSource: historyServiceSource ?? 'unknown',
        serviceKeys: Object.keys(apiRecord)
    });
});
</script>

<style lang="scss" scoped>
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
