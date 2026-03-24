<template>
    <div class="remote">
        <plugin-setting
            :title="t('designer.datasource.getRemoteFields')"
            class="remote-setting plugin-datasource"
            :is-second="true"
            :align="align"
            @cancel="closePanel"
            @save="saveRemote"
        >
            <template #header>
                <button-group>
                    <tiny-button type="info" @click="saveRemote">{{
                        t('designer.common.save')
                    }}</tiny-button>
                    <svg-button name="close" @click="closePanel" />
                </button-group>
            </template>
            <template #content>
                <div class="create-config">
                    <div>
                        <tiny-collapse v-model="state.activeName">
                            <tiny-collapse-item name="excute">
                                <template #title>{{
                                    t('designer.datasource.requestInfo')
                                }}</template>
                                <data-source-remote-form
                                    v-model="state.remoteData.options"
                                    @send-request="sendRequest"
                                />
                                <data-source-remote-autoload
                                    v-model="state.remoteData.options.isSync"
                                />
                                <div class="tabBox">
                                    <tiny-tabs
                                        v-model="state.activeNameTabs"
                                        tab-style="button-card"
                                    >
                                        <tiny-tab-item
                                            class="json-tab"
                                            :title="
                                                t(
                                                    'designer.datasource.requestJsonParams'
                                                )
                                            "
                                            name="jsonsTab"
                                        >
                                            <data-source-remote-parameter
                                                v-model="
                                                    state.remoteData.options
                                                        .params
                                                "
                                            />
                                        </tiny-tab-item>
                                        <tiny-tab-item
                                            :title="
                                                t(
                                                    'designer.datasource.requestProcessing'
                                                )
                                            "
                                            name="responseTab"
                                        >
                                            <data-source-remote-adapter
                                                ref="dataSourceRemoteAdapteRef"
                                                v-model="state.responseData"
                                                @send-requst="sendRequest"
                                            />
                                        </tiny-tab-item>
                                    </tiny-tabs>
                                </div>
                                <tiny-button
                                    type="primary"
                                    class="send"
                                    @click.stop="sendRequest"
                                >
                                    {{
                                        t('designer.datasource.getData')
                                    }}</tiny-button>
                            </tiny-collapse-item>
                            <tiny-collapse-item name="result">
                                <template #title>{{
                                    t('designer.datasource.requestResult')
                                }}</template>
                                <data-srouce-remote-data-result
                                    v-model="state.remoteData.result"
                                    @check="saveRemote"
                                />
                            </tiny-collapse-item>
                        </tiny-collapse>
                    </div>
                </div>
            </template>
        </plugin-setting>
    </div>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
/* metaService: engine.plugins.collections.DataSourceRemotePanel */
import { reactive, watch, ref, computed } from 'vue';
import { Collapse, CollapseItem, Tabs, TabItem, Button } from '@opentiny/vue';
import {
    PluginSetting,
    ButtonGroup,
    SvgButton
} from '@opentiny/tiny-engine-common';
import {
    useLayout,
    useDataSource,
    useNotify
} from '@opentiny/tiny-engine-meta-register';
import { isEmptyObject } from '@opentiny/vue-renderless/common/type';
import { utils } from '@opentiny/tiny-engine-utils';

import { useDesignerI18n } from '../../services/i18nService';

import DataSourceRemoteForm, {
    getServiceForm
} from './DataSourceRemoteForm.vue';
import DataSourceRemoteParameter from './DataSourceRemoteParameter.vue';
import DataSourceRemoteAutoload from './DataSourceRemoteAutoload.vue';
import DataSourceRemoteAdapter from './DataSourceRemoteDataAdapter.vue';
import DataSrouceRemoteDataResult, {
    getResponseData
} from './DataSourceRemoteDataResult.vue';
import { open as openRemoteMapping } from './DataSourceRemoteMapping.vue';
import { getRequest } from './js/datasource';

const { reactiveObj2String: obj2String, string2Obj } = utils;

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
        TinyCollapse: Collapse,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyButton: Button,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyCollapseItem: CollapseItem,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTabs: Tabs,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTabItem: TabItem,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PluginSetting,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ButtonGroup,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        SvgButton,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSourceRemoteForm,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSourceRemoteParameter,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSourceRemoteAutoload,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSourceRemoteAdapter,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSrouceRemoteDataResult
    },
    props: {
        editable: {
            type: Boolean,
            default: true
        },
        modelValue: {
            type: Object as () => Record<string, unknown>,
            default: () => ({
                options: {
                    name: '',
                    descriptions: '',
                    method: '',
                    uri: '',
                    params: '',
                    isSync: true
                },
                willFetch: {},
                dataHandler: {},
                result: {},
                shouldFetch: {},
                errorHandler: {}
            })
        }
    },
    emits: ['confirm'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        // eslint-disable-next-line vue/require-typed-ref
        const dataSourceRemoteAdapteRef = ref(null);
        const { dataSourceState } = useDataSource();

        const { PLUGIN_NAME, getPluginByLayout } = useLayout();
        const align = computed(() =>
            getPluginByLayout(PLUGIN_NAME.Collections)
        );

        const state = reactive({
            remoteData: { options: {} },
            activeName: ['excute', 'result'],
            responseData: {
                shouldFetch: null,
                dataHandler: null,
                errorHandler: null,
                willFetch: null
            },
            activeNameTabs: 'jsonsTab'
        });

        watch(
            () => props.modelValue,
            value => {
                const {
                    willFetch,
                    dataHandler,
                    shouldFetch,
                    errorHandler,
                    columns
                } = value;
                state.remoteData.options = { ...value?.options } || {};
                state.remoteData.options.params = obj2String(
                    value?.options?.params
                );
                state.responseData.willFetch = willFetch?.value || '';
                state.responseData.dataHandler = dataHandler?.value || '';
                state.responseData.shouldFetch = shouldFetch?.value || '';
                state.responseData.errorHandler = errorHandler?.value || '';
                if (columns?.length === 0) {
                    state.remoteData.result = {};
                }
            },
            { immediate: true }
        );

        const saveRemote = () => {
            // 远程表单校验
            getServiceForm().validate(valid => {
                if (valid) {
                    state.remoteData.result = string2Obj(getResponseData());

                    const save = () => {
                        let params = state.remoteData.options?.params;

                        if (params) {
                            params = string2Obj(params);
                        }

                        dataSourceState.remoteConfig = {
                            options: { ...state.remoteData.options, params },
                            ...dataSourceRemoteAdapteRef.value.getEditorValue()
                        };

                        state.remoteData.result = string2Obj(getResponseData());
                        emit('confirm', state.remoteData.result);
                        close();
                    };

                    save();
                    if (!isEmptyObject(state.remoteData.result)) {
                        openRemoteMapping();
                    }
                }
            });
        };

        const sendRequest = async () => {
            try {
                // await validate() 如果验证不通过会抛出异常，而不是返回 false
                await getServiceForm().validate();
            } catch (error) {
                throw new Error(
                    `${t('designer.datasource.formValidationRequired')}: ${
                        error?.message || ''
                    }`
                );
            }

            const options = { ...state.remoteData.options };

            if (options.params) {
                options.params = string2Obj(options.params);
            }

            const request = getRequest({
                options,
                ...dataSourceRemoteAdapteRef.value.getEditorValue()
            });

            /**
             * 按照数据源请求面板的提示，dataSourceMap函数的相应结果的结构应该会是：
             * 对于对象数组：{ code: string, msg: string, data: {items: any[], total: number} }
             * 对于树结构：{ code: string, msg: string, data: any }
             */
            request
                .load()
                .then(res => {
                    state.remoteData.result = Array.isArray(res?.data?.items)
                        ? res.data.items[0]
                        : res?.data || res;

                    useNotify({
                        type: 'success',
                        title: '请求成功',
                        message: '返回已填充到"请求结果"'
                    });

                    // "请求结果"代码编辑框
                    const remoteDataEditor = document.querySelector(
                        '#remote-data-editor'
                    );

                    remoteDataEditor.scrollIntoView();
                })
                .catch(error => {
                    useNotify({
                        type: 'error',
                        title: t('designer.datasource.requestFailed'),
                        message:
                            error.message ||
                            t('designer.datasource.requestFailedMessage')
                    });
                });
        };

        return {
            align,
            state,
            dataSourceRemoteAdapteRef,
            closePanel: close,
            saveRemote,
            sendRequest,
            isOpen,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.remote {
    .remote-setting {
        :deep(.plugin-save) {
            display: none !important;
        }
    }
    :deep(.plugin-setting-content) {
        padding: 0;
    }
    .create-config {
        :deep(.title) {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background: var(--te-datasource-toolbar-bg-color);
            border-top: 1px solid var(--te-datasource-tabs-border-color);
            color: var(--te-datasource-toolbar-breadcrumb-text-color);
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
        :deep(.tiny-collapse) {
            .tiny-collapse-item:first-child {
                border-top: 0;
            }
            .tiny-collapse-item__header {
                .tiny-collapse-item__word-overflow {
                    margin: var(--te-common-vertical-item-spacing-normal) 0px 0;
                }
            }
        }
    }
}
</style>
