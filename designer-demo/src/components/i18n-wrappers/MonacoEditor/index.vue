<!--
    i18n wrapper for @opentiny/tiny-engine-common MonacoEditor.
    Official hardcodes Format/Fullscreen tips in Chinese; re-render with designer i18n.
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

<script setup lang="ts">
/* metaService: engine.plugins.state.MonacoEditorI18n */
import { computed, ref } from 'vue';
import { Tooltip as TinyTooltip } from '@opentiny/vue';
import {
    MonacoEditor as OriginMonacoEditor,
    PublicIcon
} from '@opentiny/tiny-engine-common';
import { constants } from '@opentiny/tiny-engine-utils';

import { useDesignerI18n } from '@/services/i18nService';

const props = withDefaults(
    defineProps<{
        value?: string;
        options?: Record<string, unknown>;
        showFormatBtn?: boolean;
        showFullScreenBtn?: boolean;
    }>(),
    {
        value: '',
        options: () => ({}),
        showFormatBtn: false,
        showFullScreenBtn: true
    }
);

const emit = defineEmits<{
    editorDidMount: [editor: unknown];
    change: [value: unknown];
    fullscreenChange: [value: boolean];
    shortcutSave: [payload: unknown];
}>();

defineOptions({ name: 'monaco-editor-i18n', inheritAttrs: false });

const { OPEN_DELAY } = constants;
const { t } = useDesignerI18n();
// eslint-disable-next-line vue/require-typed-ref, @typescript-eslint/no-explicit-any
const editorRef = ref<any>(null);
const isFullscreen = ref(false);

interface EditorApi {
    getEditor?: () => unknown;
    getValue?: () => unknown;
    formatCode?: () => void;
    switchFullScreen?: (v: boolean) => void;
    editor?: unknown;
}

const getInner = (): EditorApi | null => editorRef.value as EditorApi | null;
const showFormatIcon = computed(
    () => props.showFormatBtn && props.options?.language === 'json'
);
const fullscreenIcon = computed(() =>
    isFullscreen.value ? 'cancel-full-screen' : 'full-screen'
);
const fullscreenTooltip = computed(() =>
    isFullscreen.value
        ? t('designer.components.monacoEditor.exitFullscreen')
        : t('designer.components.monacoEditor.fullscreen')
);
const formatCode = () => getInner()?.formatCode?.();
const toggleFullscreen = () =>
    getInner()?.switchFullScreen?.(!isFullscreen.value);
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

const publicApi: EditorApi & { switchFullScreen: (v: boolean) => void } = {
    getEditor: () => getInner()?.getEditor?.(),
    getValue: () => getInner()?.getValue?.(),
    formatCode: () => getInner()?.formatCode?.(),
    switchFullScreen: (value: boolean) => getInner()?.switchFullScreen?.(value)
};
Object.defineProperty(publicApi, 'editor', {
    enumerable: true,
    get: () => getInner()?.editor
});
defineExpose(publicApi);
</script>

<style lang="scss" scoped>
/* Absolute toolbar needs inset; keep icon row vertically aligned */
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

:deep(#icon-buttons > *) {
    display: inline-flex;
    align-items: center;
    line-height: 1;
    vertical-align: middle;
}
</style>
