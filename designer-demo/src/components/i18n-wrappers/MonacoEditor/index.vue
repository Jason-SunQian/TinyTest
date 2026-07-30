<!--
  i18n wrapper for @opentiny/tiny-engine-common MonacoEditor.
  Official component hardcodes Format / Fullscreen tooltips in Chinese.
  Hide built-in buttons and re-render them with designer i18n.
  Keep Format / Fullscreen DOM identical (TinyTooltip > PublicIcon) for alignment.
-->
<template>
    <origin-monaco-editor
        ref="editorRef"
        class="monaco-editor-i18n"
        v-bind="$attrs"
        :value="value"
        :options="options"
        :show-format-btn="false"
        :show-full-screen-btn="false"
        @editor-did-mount="onEditorDidMount"
        @change="onChange"
        @fullscreen-change="onFullscreenChange"
        @shortcut-save="onShortcutSave"
    >
        <template #toolbarStart>
            <slot name="toolbarStart" />
        </template>
        <template #buttons>
            <slot name="buttons" />
            <tiny-tooltip
                v-if="showFormatIcon"
                :content="t('designer.components.monacoEditor.format')"
                placement="top"
                effect="light"
                :open-delay="OPEN_DELAY.Default"
            >
                <public-icon name="json" @click="formatCode" />
            </tiny-tooltip>
            <tiny-tooltip
                v-if="showFullScreenBtn"
                :content="fullscreenTooltip"
                placement="top"
                effect="light"
                :open-delay="OPEN_DELAY.Default"
            >
                <public-icon :name="fullscreenIcon" @click="toggleFullscreen" />
            </tiny-tooltip>
        </template>
        <template #fullscreenHead>
            <slot name="fullscreenHead" />
        </template>
        <template #fullscreenFooter>
            <slot name="fullscreenFooter" />
        </template>
    </origin-monaco-editor>
</template>

<script lang="ts">
/* metaService: engine.plugins.state.MonacoEditorI18n */
import { computed, ref } from 'vue';
import { Tooltip } from '@opentiny/vue';
import {
    MonacoEditor as OriginMonacoEditor,
    PublicIcon
} from '@opentiny/tiny-engine-common';
import { constants } from '@opentiny/tiny-engine-utils';

import { useDesignerI18n } from '@/services/i18nService';

const { OPEN_DELAY } = constants;

export default {
    name: 'MonacoEditorI18n',
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        OriginMonacoEditor,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PublicIcon,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTooltip: Tooltip
    },
    inheritAttrs: false,
    props: {
        value: {
            type: String,
            default: ''
        },
        options: {
            type: Object,
            default: () => ({})
        },
        showFormatBtn: {
            type: Boolean,
            default: false
        },
        showFullScreenBtn: {
            type: Boolean,
            default: true
        }
    },
    emits: ['editorDidMount', 'change', 'fullscreenChange', 'shortcutSave'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit, expose }) {
        const { t } = useDesignerI18n();
        // eslint-disable-next-line vue/require-typed-ref
        const editorRef = ref(null);
        const isFullscreen = ref(false);

        const showFormatIcon = computed(
            () =>
                props.showFormatBtn &&
                (props.options as { language?: string })?.language === 'json',
        );

        const fullscreenIcon = computed(() =>
            isFullscreen.value ? 'cancel-full-screen' : 'full-screen',
        );

        const fullscreenTooltip = computed(() =>
            isFullscreen.value
                ? t('designer.components.monacoEditor.exitFullscreen')
                : t('designer.components.monacoEditor.fullscreen'),
        );

        const getInner = () =>
            editorRef.value as {
                getEditor?: () => unknown;
                getValue?: () => unknown;
                formatCode?: () => void;
                switchFullScreen?: (v: boolean) => void;
                editor?: unknown;
            } | null;

        const formatCode = () => {
            getInner()?.formatCode?.();
        };

        const toggleFullscreen = () => {
            getInner()?.switchFullScreen?.(!isFullscreen.value);
        };

        const onFullscreenChange = (value: boolean) => {
            isFullscreen.value = value;
            emit('fullscreenChange', value);
        };

        const onEditorDidMount = (editor: unknown) => {
            emit('editorDidMount', editor);
        };

        const onChange = (value: unknown) => {
            emit('change', value);
        };

        const onShortcutSave = (payload: unknown) => {
            emit('shortcutSave', payload);
        };

        const publicApi = {
            getEditor: () => getInner()?.getEditor?.(),
            getValue: () => getInner()?.getValue?.(),
            formatCode: () => getInner()?.formatCode?.(),
            switchFullScreen: (value: boolean) =>
                getInner()?.switchFullScreen?.(value)
        };
        Object.defineProperty(publicApi, 'editor', {
            enumerable: true,
            get() {
                return getInner()?.editor;
            }
        });
        expose(publicApi);

        return {
            t,
            editorRef,
            isFullscreen,
            showFormatIcon,
            fullscreenIcon,
            fullscreenTooltip,
            formatCode,
            toggleFullscreen,
            onFullscreenChange,
            onEditorDidMount,
            onChange,
            onShortcutSave,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            OPEN_DELAY
        };
    }
};
</script>

<style scoped>
/**
 * State plugin overlays .toolbar with position:absolute; without top it hugs
 * the editor edge when only fullscreen is shown. Keep inset + vertical align.
 */
.monaco-editor-i18n:deep(.editor-container),
:deep(.editor-container) {
    position: relative;
}

:deep(.toolbar) {
    top: 6px;
    right: 12px;
}

:deep(.toolbar .buttons),
:deep(#icon-buttons) {
    display: flex;
    align-items: center;
    gap: 8px;
}

/* Popover (i18n) / tooltip / icon share the same flex cross-axis */
:deep(#icon-buttons > *) {
    display: inline-flex;
    align-items: center;
    line-height: 1;
    vertical-align: middle;
}
</style>
