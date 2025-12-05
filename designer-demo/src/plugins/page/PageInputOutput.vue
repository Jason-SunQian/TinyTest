<template>
    <div class="input-or-output">
        <meta-code-editor
            :model-value="inputValue"
            :title="t('designer.page.inputConfig')"
            :button-text="t('designer.page.inputConfig')"
            language="json"
            :button-show-content="hasContent(inputValue)"
            single
            @save="saveInputValue"
        >
            <template #icon>
                <svg-icon class="edit-btn-icon" name="to-edit" />
            </template>
        </meta-code-editor>
        <div class="input-output-tips">
            {{ t('designer.page.inputConfigDesc') }}
        </div>
        <meta-code-editor
            :model-value="outputValue"
            :title="t('designer.page.outputConfig')"
            :button-text="t('designer.page.outputConfig')"
            language="json"
            :button-show-content="hasContent(outputValue)"
            single
            @save="saveOutputValue"
        >
            <template #icon>
                <svg-icon class="edit-btn-icon" name="to-edit" />
            </template>
        </meta-code-editor>
        <div class="input-output-div">
            {{ t('designer.page.outputConfigDesc') }}
        </div>

        <tiny-checkbox
            v-model="pageSettingState.currentPageData.isBody"
            class="selectHome"
            ><span>{{ t('designer.page.setBodyAsRoot') }}</span>
        </tiny-checkbox>
        <div class="input-output-div">{{ t('designer.page.defaultDiv') }}</div>
    </div>
</template>

<script lang="ts">
/* metaService: engine.plugins.appmanage.PageInputOutput */
import { ref, watchEffect, computed } from 'vue';
import { Checkbox } from '@opentiny/vue';
import { MetaCodeEditor } from '@opentiny/tiny-engine-common';
import { usePage, useNotify } from '@opentiny/tiny-engine-meta-register';

import { useDesignerI18n } from '../../services/i18nService';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        MetaCodeEditor,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyCheckbox: Checkbox
    },
    // eslint-disable-next-line vue/component-api-style
    setup() {
        const { t } = useDesignerI18n();
        const inputValue = ref('');
        const outputValue = ref('');
        const { pageSettingState } = usePage();
        const currentPageData = computed(
            () => pageSettingState.currentPageData
        );
        watchEffect(() => {
            inputValue.value =
                pageSettingState.currentPageData.page_content?.inputs || '';
            outputValue.value =
                pageSettingState.currentPageData.page_content?.outputs || '';
        });

        const saveInputValue = data => {
            try {
                const inputsData = JSON.parse(data.content);
                inputValue.value = data.content;
                currentPageData.value.page_content.inputs = inputsData;
            } catch (err) {
                useNotify({
                    title: t('designer.page.inputConfigSaveFailed'),
                    message: `${err?.message || err}`,
                    type: 'error'
                });
            }
        };
        const saveOutputValue = data => {
            try {
                const outputsData = JSON.parse(data.content);
                outputValue.value = data.content;
                currentPageData.value.page_content.outputs = outputsData;
            } catch (err) {
                useNotify({
                    title: t('designer.page.outputConfigSaveFailed'),
                    message: `${err?.message || err}`,
                    type: 'error'
                });
            }
        };

        const hasContent = value =>
            (Array.isArray(value) && value.length > 0) ||
            (typeof value === 'object' && Object.keys(value).length > 0);

        return {
            inputValue,
            outputValue,
            saveInputValue,
            saveOutputValue,
            pageSettingState,
            hasContent,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.input-or-output {
    color: var(--te-page-manage-input-or-output-text-color);
    .life-cycle-alert {
        color: var(--te-page-manage-life-cycle-alert-text-color);
        height: 28px;
        padding: 6px;
        border: 0;
        font-size: 11px;
        margin-bottom: 12px;
        :deep(.tiny-alert__close) {
            top: 7px;
        }
    }

    .input-output-tips,
    .input-output-div {
        color: var(--te-page-manage-life-cycle-alert-text-color);
        margin-top: 4px;
        height: 16px;
        line-height: 16px;
    }
    .input-output-tips {
        margin-bottom: 12px;
    }
    .selectHome {
        margin-top: 12px;
    }
    .edit-btn-icon {
        color: var(--te-page-manage-icon-color);
        margin-right: 6px;
    }
    :deep(.edit-btn) {
        flex: none;
        display: flex;
        align-items: center;
    }
}
</style>
