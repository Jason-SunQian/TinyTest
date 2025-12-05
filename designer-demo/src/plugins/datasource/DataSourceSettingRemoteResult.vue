<template>
    <div class="remote">
        <plugin-setting
            :title="t('designer.datasource.viewRemoteFieldsTitle')"
            class="remote-setting"
            :align="align"
            :is-second="true"
        >
            <template #header>
                <button-group>
                    <tiny-button
                        class="field-save"
                        type="primary"
                        @click="saveMapping"
                        >{{ t('designer.common.save') }}</tiny-button>
                    <svg-button name="close" @click="closePanel" />
                </button-group>
            </template>
            <template #content>
                <div class="create-config">
                    <div class="item">
                        <div class="item-title">
                            {{ t('designer.datasource.requestResult') }}
                        </div>
                        <data-srouce-remote-data-result
                            v-model="state.remoteData.result"
                            @change="resultChange"
                        />
                    </div>
                    <div class="item">
                        <div class="item-title field">
                            {{ t('designer.datasource.viewFields') }}
                        </div>
                        <data-source-remote-result-mapping
                            ref="dataSourceRemoteResultMappingref"
                            :data="mappingData()"
                            :model-value="state.remoteFields"
                        />
                    </div>
                </div>
            </template>
        </plugin-setting>
    </div>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
import { reactive, watch, ref, computed } from 'vue';
import { Button } from '@opentiny/vue';
import {
    ButtonGroup,
    PluginSetting,
    SvgButton
} from '@opentiny/tiny-engine-common';
import { useLayout, useDataSource } from '@opentiny/tiny-engine-meta-register';
import { utils } from '@opentiny/tiny-engine-utils';

import { useDesignerI18n } from '../../services/i18nService';

import DataSrouceRemoteDataResult from './DataSourceRemoteDataResult.vue';
import DataSourceRemoteResultMapping from './DataSourceRemoteResultMapping.vue';

const { string2Obj } = utils;

export const isOpen = ref(false);

export const open = () => {
    isOpen.value = true;
};

export const close = () => {
    isOpen.value = false;
};

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyButton: Button,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PluginSetting,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ButtonGroup,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        SvgButton,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSrouceRemoteDataResult,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSourceRemoteResultMapping
    },
    props: {
        editable: {
            type: Boolean,
            default: true
        },
        remoteData: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        },
        modelValue: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        }
    },
    emits: ['confirm', 'update:modelValue', 'activeTab'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { t } = useDesignerI18n();

        // eslint-disable-next-line vue/require-typed-ref
        const dataSourceRemoteResultMappingref = ref(null);
        const { dataSourceState } = useDataSource();

        const { PLUGIN_NAME, getPluginByLayout } = useLayout();
        const align = computed(() =>
            getPluginByLayout(PLUGIN_NAME.Collections)
        );

        const state = reactive({
            remoteData: props.remoteData,
            remoteFields: {}
        });

        watch(
            () => props.modelValue,
            value => {
                state.remoteFields = value || {};
            },
            { immediate: true }
        );

        watch(
            () => props.remoteData,
            value => {
                state.remoteData = value || {};
            },
            { immediate: true, deep: true }
        );

        const mappingData = () => {
            const data = state.remoteData.result;
            let params = state.remoteData.options?.params;

            if (params) {
                params = string2Obj(params);
            }

            dataSourceState.remoteConfig = {
                options: { ...state.remoteData.options, params },
                ...state.remoteData.dataSourceRemoteAdapteRef
            };
            return data;
        };

        const resultChange = data => {
            state.remoteData.result = string2Obj(data);

            mappingData();
        };

        const saveMapping = () => {
            const newColumns =
                dataSourceRemoteResultMappingref.value.saveMapping();
            emit('update:modelValue', newColumns);
            emit('activeTab', 'field');
            close();
        };

        return {
            align,
            state,
            closePanel: close,
            isOpen,
            saveMapping,
            resultChange,
            mappingData,
            dataSourceRemoteResultMappingref,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.remote {
    .remote-setting {
        :deep(.plugin-save) {
            display: none;
        }
    }
    :deep(.plugin-setting-content) {
        padding: 0;
    }
    .create-config {
        padding: 0 12px;
        .item {
            .item-title {
                padding: 12px 0;
                font-weight: var(--te-base-font-weight-bold);
                color: var(--te-datasource-toolbar-breadcrumb-text-color);
                &.field {
                    padding-bottom: 0;
                }
            }
        }
        .send {
        }
        .tip-dot {
            padding-left: 4px;
            color: var(--te-datasource-description-text-color-error);
        }

        .use-service {
            color: var(--te-datasource-toolbar-breadcrumb-text-color);
            font-size: 12px;
            margin-top: 10px;

            span {
                color: var(--te-datasource-description-text-color-error);
            }
        }

        :deep(.send-service) {
            text-align: right;
            border-top: 1px solid var(--te-datasource-tabs-border-color);
            padding: 12px 0px 0px;

            .use-service {
                text-align: left;
                padding-top: 5px;
            }

            .title {
                margin-bottom: 10px;
            }
        }

        :deep(.send-request) {
            margin: 12px;
        }

        .monaco-editor {
            height: 80px;
            margin-top: 8px;
        }
        .tabBox {
            box-sizing: border-box;
            overflow-y: scroll;
            :deep(.tiny-tabs.tiny-tabs--button-card .tiny-tabs__item) {
                border-radius: 4px;
                &:hover {
                    color: var(--te-datasource-common-text-color-primary);
                }
            }
            :deep(.tiny-tabs__content) {
                margin: 12px 0;
            }
            :deep(.is-active) {
                .tiny-tabs__item__title {
                    color: var(--te-datasource-common-text-color-primary);
                }
            }
        }
    }
}
</style>
