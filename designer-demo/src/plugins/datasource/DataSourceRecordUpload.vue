<template>
    <!-- 批量导入 -->
    <tiny-modal
        v-model="state.upload.showImportModal"
        :title="t('designer.datasource.importTip')"
        show-footer
    >
        <template #default>
            <span class="import-tip">{{
                t('designer.datasource.importFileTip')
            }}</span>
        </template>
        <template #footer>
            <div class="import-tip-action">
                <tiny-file-upload
                    ref="upload"
                    size="small"
                    action="/"
                    accept="xlsx"
                    :before-upload="beforeUpload"
                    :show-file-list="false"
                    :limit="1"
                >
                    <template #trigger>
                        <tiny-button @click="closeImportModal">{{
                            state.upload.importLabel
                        }}</tiny-button>
                    </template>
                </tiny-file-upload>
                <tiny-button class="ml4" @click="closeImportModal">{{
                    t('designer.common.cancel')
                }}</tiny-button>
            </div>
        </template>
    </tiny-modal>
    <!-- 二次确认 -->
    <tiny-modal
        v-model="state.upload.importConfirm"
        :title="t('designer.datasource.importTip')"
        show-footer
    >
        <template #default>
            <div class="import-tip">
                <span>{{ state.upload.importSuccessLabel }}</span>
                <span class="confirm">{{
                    t('designer.datasource.overrideDataConfirm')
                }}</span>
            </div>
        </template>
        <template #footer>
            <tiny-button @click="overrideData">{{
                t('designer.datasource.override')
            }}</tiny-button>
            <tiny-button class="ml4" @click="mergeData">{{
                t('designer.datasource.merge')
            }}</tiny-button>
        </template>
    </tiny-modal>
    <!-- 校验失败 -->
    <tiny-modal
        v-model="state.upload.showImportFail"
        :title="t('designer.datasource.importTip')"
        show-footer
    >
        <template #default>
            <div v-if="state.upload.typeError" class="import-tip">
                <span class="confirm">{{
                    t('designer.datasource.formatError')
                }}</span>
                <span>{{ t('designer.datasource.onlyXlsxFile') }}</span>
            </div>

            <div v-if="state.upload.sizeExceed" class="import-tip">
                <span class="confirm">{{
                    t('designer.datasource.fileSizeExceed')
                }}</span>
                <span>{{ t('designer.datasource.maxSizeLimit') }}</span>
            </div>
        </template>
        <template #footer>
            <tiny-file-upload
                ref="upload"
                size="small"
                action="/"
                accept="xlsx"
                :before-upload="beforeUpload"
                :show-file-list="false"
                :limit="1"
            >
                <template #trigger>
                    <tiny-button type="danger" @click="closeImportFailModal">{{
                        t('designer.datasource.reimport')
                    }}</tiny-button>
                </template>
            </tiny-file-upload>
            <tiny-button class="ml4" @click="closeImportFailModal">{{
                t('designer.common.cancel')
            }}</tiny-button>
        </template>
    </tiny-modal>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
/* metaService: engine.plugins.collections.DataSourceRecordUpload */
import { reactive, watch } from 'vue';
import { Button, Modal, FileUpload } from '@opentiny/vue';
import { IconHelp } from '@opentiny/vue-icon';

import { useDesignerI18n } from '@/services/i18nService';

import { getDataFromFile } from './js/datasource';

const MIME_TYPE_XLSX =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const FILE_SIZE_MAX = 4;

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyButton: Button,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyModal: Modal,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyFileUpload: FileUpload
    },
    props: {
        showImportModal: {
            type: Boolean,
            default: false
        }
    },
    emits: ['override', 'merge', 'close'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const state = reactive({
            upload: {
                showImportModal: false,
                importLabel: '导入',
                importSuccessLabel: '',
                importConfirm: false,
                showImportFail: false,
                typeError: false,
                sizeExceed: false,
                importData: []
            }
        });
        const importSuccessLabel = '共导入{0}条数据，';

        const closeImportModal = () => {
            state.upload.showImportModal = false;
            emit('close');
        };

        const closeImportFailModal = () => {
            state.upload.showImportFail = false;
            emit('close');
        };

        const beforeUpload = async file => {
            const typeValid = file.type === MIME_TYPE_XLSX;
            const sizeValid = file.size / 1024 / 1024 < FILE_SIZE_MAX;
            const isValid = typeValid && sizeValid;
            if (isValid) {
                state.upload.importConfirm = true;
            } else {
                state.upload.typeError = !typeValid;
                state.upload.sizeExceed = !sizeValid;
                state.upload.showImportFail = true;
            }
            closeImportModal();

            const data = await getDataFromFile(file);
            state.upload.importData = data;
            state.upload.importSuccessLabel = importSuccessLabel.replace(
                '{0}',
                state.upload.importData.length
            );

            return false;
        };

        const closeConfirmModal = () => {
            state.upload.importConfirm = false;
            closeImportFailModal();
        };

        const overrideData = () => {
            closeConfirmModal();
            emit('override', {
                importData: state.upload.importData
            });
        };
        const mergeData = () => {
            closeConfirmModal();
            emit('merge', {
                importData: state.upload.importData
            });
        };

        watch(
            () => props.showImportModal,
            () => {
                state.upload.showImportModal = props.showImportModal;
            }
        );

        return {
            state,
            beforeUpload,
            overrideData,
            mergeData,
            closeImportModal,
            closeImportFailModal,
            // eslint-disable-next-line @typescript-eslint/naming-convention, new-cap
            IconHelp: IconHelp(),
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.import-tip {
    font-size: 12px;
    line-height: 17px;
}
.import-tip-action {
    display: flex;
    justify-content: center;
}
.ml4 {
    margin-left: 10px;
}
.confirm {
    color: var(--te-datasource-common-color-error);
}
</style>
