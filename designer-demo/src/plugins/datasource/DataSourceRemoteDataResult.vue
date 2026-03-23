<template>
    <div class="response-data">
        <div class="resonse-header">
            <div class="life-cycle-alert">
                {{ t('designer.datasource.remoteResultTip') }}
            </div>
        </div>
        <div id="remote-data-editor" class="tor">
            <div class="operate">
                <tiny-button plain @click="check">{{
                    t('designer.datasource.viewRemoteFields')
                }}</tiny-button>
                <tiny-button plain @click="copyData">{{
                    t('designer.datasource.copyCode')
                }}</tiny-button>
            </div>
            <monaco-editor
                ref="editor"
                :value="state.value"
                class="editor"
                :options="state.options"
                @change="handleChange"
            />
        </div>
    </div>
</template>

<script lang="ts">
/* metaService: engine.plugins.collections.DataSourceRemoteDataResult */
import { reactive, watchEffect, ref } from 'vue';
import { VueMonaco as MonacoEditor } from '@opentiny/tiny-engine-common';
import { Button as TinyButton } from '@opentiny/vue';
import useClipboard from 'vue-clipboard3';

import { useDesignerI18n } from '../../services/i18nService';

 
const editor = ref(null);

export const getResponseData = () => editor.value.getEditor().getValue();

export default {
    components: {
         
        MonacoEditor,
         
        TinyButton
    },
    props: {
        modelValue: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        }
    },
    emits: ['copy', 'change'],
     
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const state = reactive({
            value: '',
            options: {
                language: 'json',
                minimap: { enabled: true }
            }
        });

        const { toClipboard } = useClipboard();

        watchEffect(() => {
            state.value = JSON.stringify(props.modelValue, null, 2);
        });

        const copyData = async () => {
            try {
                await toClipboard(state.value);
            } catch (e) {
                throw new Error(e);
                // do nothing
            }

            emit('copy', state.value);
        };
        const check = () => {
            emit('change', state.value);
        };
        const handleChange = val => {
            state.value = val;
        };

        return {
            state,
            copyData,
            check,
            editor,
            handleChange,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.response-data {
    position: relative;
    .resonse-header {
        margin-bottom: 12px;

        .life-cycle-alert {
            font-size: var(--te-base-font-size-base);
            color: var(--te-datasource-common-tip-text-color);
        }
        .title {
            color: var(--te-datasource-toolbar-breadcrumb-text-color);
            display: inline-block;
            border-bottom: 1px solid var(--te-datasource-tabs-border-color);
            width: 100%;
            padding-bottom: 8px;
        }
    }

    #remote-data-editor {
        position: relative;
    }

    .operate {
        position: absolute;
        right: 8px;
        top: 8px;
        z-index: 9999;
        .tiny-button {
            border-radius: 4px;
            border-color: var(--te-datasource-editor-btn-border-color);
            & + .tiny-button {
                margin-left: 4px;
            }
        }
    }

    .editor {
        height: 250px;
        margin-top: 8px;
        border: 1px solid var(--te-datasource-editor-border-color-divider);
        border-radius: 4px;
    }
}
</style>
