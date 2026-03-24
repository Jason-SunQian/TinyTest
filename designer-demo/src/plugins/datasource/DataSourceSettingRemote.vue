<template>
    <div class="data-source-setting-remote">
        <div>
            <data-source-remote-form v-model="state.remoteData.options" />
            <data-source-remote-autoload
                v-model="state.remoteData.options.isSync"
            />
            <div class="tabBox">
                <div class="title">
                    {{ t('designer.datasource.requestSettings') }}
                </div>
                <tiny-tabs
                    v-model="state.activeNameTabs"
                    tab-style="button-card"
                >
                    <tiny-tab-item
                        class="json-tab"
                        :title="t('designer.datasource.requestJsonParams')"
                        name="jsonsTab"
                    >
                        <data-source-remote-parameter
                            v-model="state.remoteData.options.params"
                        />
                    </tiny-tab-item>
                    <tiny-tab-item
                        :title="t('designer.datasource.requestProcessing')"
                        name="responseTab"
                    >
                        <data-source-remote-adapter
                            ref="dataSourceRemoteAdapteRef"
                            v-model="state.responseData"
                        />
                    </tiny-tab-item>
                </tiny-tabs>
            </div>
        </div>
        <tiny-button type="primary" class="send" @click.stop="sendRequest">{{
            t('designer.datasource.viewRemoteFields')
        }}</tiny-button>
    </div>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
import { reactive, watch, ref } from 'vue';
import { TinyTabs, TinyTabItem, TinyButton } from '@opentiny/vue';
import { useNotify } from '@opentiny/tiny-engine-meta-register';
import { utils } from '@opentiny/tiny-engine-utils';

import { useDesignerI18n } from '../../services/i18nService';

import DataSourceRemoteForm, {
    getServiceForm
} from './DataSourceRemoteForm.vue';
import DataSourceRemoteParameter from './DataSourceRemoteParameter.vue';
import DataSourceRemoteAutoload from './DataSourceRemoteAutoload.vue';
import DataSourceRemoteAdapter from './DataSourceRemoteDataAdapter.vue';
import { getRequest } from './js/datasource';

const { reactiveObj2String: obj2String, string2Obj } = utils;

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyButton,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTabs,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTabItem,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSourceRemoteForm,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSourceRemoteParameter,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSourceRemoteAutoload,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSourceRemoteAdapter
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
    emits: ['confirm', 'update:modelValue', 'renderRemoteData'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { t } = useDesignerI18n();

        // eslint-disable-next-line vue/require-typed-ref
        const dataSourceRemoteAdapteRef = ref(null);

        const state = reactive({
            remoteData: { options: {} },
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

            emit('update:modelValue', { ...props.modelValue, options });

            const request = getRequest({
                options,
                ...dataSourceRemoteAdapteRef.value.getEditorValue()
            });

            /**
             * 按照数据源请求面板的提示，dataSourceMap函数的相应结果的结构应该会是：
             * { code: string, msg: string, data: {items: any[], total: number} }
             */
            request
                .load()
                .then(res => {
                    state.remoteData.result = Array.isArray(res?.data?.items)
                        ? res.data.items[0]
                        : res?.data || res;

                    useNotify({
                        type: 'success',
                        title: t('designer.datasource.requestSuccess'),
                        message: t('designer.datasource.requestSuccessMessage')
                    });

                    emit('renderRemoteData', {
                        ...state.remoteData,
                        dataSourceRemoteAdapteRef:
                            dataSourceRemoteAdapteRef.value.getEditorValue()
                    });
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
            state,
            dataSourceRemoteAdapteRef,
            sendRequest,
            closePanel: close,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.data-source-setting-remote {
    .tabBox {
        .title {
            font-size: 12px;
            color: var(--te-datasource-label-text-color);
            margin-bottom: 12px;
        }
        :deep(.tiny-tabs.tiny-tabs) {
            .tiny-tabs__nav-scroll {
                margin-left: 0;
            }
            .tiny-tabs__item {
                background-color: var(
                    --te-datasource-settings-remote-tabs-bg-color
                );
                margin-right: 0;
                &:first-child {
                    border-top-left-radius: var(--te-base-border-radius-1);
                    border-bottom-left-radius: var(--te-base-border-radius-1);
                }

                &:last-child {
                    border-top-right-radius: var(--te-base-border-radius-1);
                    border-bottom-right-radius: var(--te-base-border-radius-1);
                }

                &.is-active {
                    border: 1px solid
                        var(--te-datasource-settings-tabs-border-color-active);
                    background-color: var(--te-datasource-settings-bg-color);
                }
                .tiny-tabs__item__title {
                    padding: 0;
                }
            }
            .tiny-tabs__nav-wrap-not-separator::after {
                z-index: 2;
                background-color: transparent !important;
                margin-bottom: 16px;
            }
        }
    }
    .send {
        margin-top: 12px;
    }
}
</style>
