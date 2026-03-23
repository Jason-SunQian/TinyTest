<!-- eslint-disable vue/no-root-v-if -->
<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <plugin-setting
        v-if="isOpen"
        :title="t('designer.datasource.setDataSource')"
        class="data-source-form plugin-datasource"
        :fixed-name="PLUGIN_NAME.Collections"
        :align="align"
        :style="{ zIndex: 1000, '--base-collection-panel-width': panelWidth }"
    >
        <template #header>
            <button-group>
                <tiny-button class="field-save" type="primary" @click="save">{{
                    t('designer.common.save')
                }}</tiny-button>
                <svg-button
                    v-if="editable"
                    name="delete"
                    @click="deleteDataSource"
                />
                <svg-button name="close" @click="closeAllPanel" />
            </button-group>
        </template>
        <template #content>
            <tiny-form label-width="0">
                <!-- dataSource类型 -->
                <data-source-type
                    v-model="state.dataSource.data.type"
                    :editable="editable"
                />

                <!-- dataSource name -->
                <data-source-name v-model="state.dataSource.name" />

                <!-- dataSource settings -->
            </tiny-form>
            <data-source-settings
                ref="settingRef"
                v-model="state.dataSource"
                :editable="editable"
                :active-tab-name="state.activeTabName"
                @render-remote-data="renderRemoteData"
                @active-tab="activeTabChange"
            />
        </template>
    </plugin-setting>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
/* metaService: engine.plugins.collections.DataSourceForm */
import {
    reactive,
    ref,
    watch,
    computed,
    camelize,
    capitalize,
    watchEffect
} from 'vue';
import { Form, Button } from '@opentiny/vue';
import {
    ButtonGroup,
    PluginSetting,
    SvgButton
} from '@opentiny/tiny-engine-common';
import {
    useLayout,
    useModal,
    useDataSource,
    useNotify,
    getMetaApi,
    META_SERVICE,
    useCanvas
} from '@opentiny/tiny-engine-meta-register';
import { extend } from '@opentiny/vue-renderless/common/object';

import { useDesignerI18n } from '../../services/i18nService';

import DataSourceType from './DataSourceType.vue';
import DataSourceName, { getDataSourceName } from './DataSourceName.vue';
import { getServiceForm } from './DataSourceRemoteForm.vue';
import DataSourceSettings from './DataSourceSettings.vue';
import {
    close as closeRemoteResult,
    open as openRemoteResult
} from './DataSourceSettingRemoteResult.vue';
import { getRecordGrid } from './DataSourceSettingRecordList.vue';
import {
    requestUpdateDataSource,
    requestAddDataSource,
    fetchTemplateDetail,
    requestDeleteDataSource,
    requestGenerateDataSource
} from './js/http';

const isOpen = ref(false);

export const open = () => {
    isOpen.value = true;
};

export const close = () => {
    isOpen.value = false;
};

export default {
    components: {
         
        ButtonGroup,
         
        SvgButton,
         
        TinyForm: Form,
         
        TinyButton: Button,
         
        PluginSetting,
         
        DataSourceType,
         
        DataSourceName,
         
        DataSourceSettings
    },
    props: {
        modelValue: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        },
        editable: {
            type: Boolean,
            default: true
        },
        activeTabName: {
            type: String,
            default: 'remote'
        }
    },
    emits: ['update:modelValue', 'save', 'activeTab', 'renderRemoteData'],
     
    setup(props, { emit }) {
        const { t } = useDesignerI18n();

        const { message } = useModal();
        const { dataSourceState } = useDataSource();

         
        const settingRef = ref(null);

        const state = reactive({
            dataSource: {},
            activeTabName: props.activeTabName
        });

        const {
            PLUGIN_NAME,
            getPluginByLayout,
            getPluginWidth,
            changePluginWidth
        } = useLayout();

        // 确保 Collections 插件的宽度正确设置，这样 PluginSetting 才能正确定位和显示
        // 使用 watchEffect 确保在组件渲染前就设置好宽度
        watchEffect(() => {
            const currentWidth = getPluginWidth(PLUGIN_NAME.Collections);
            // 如果宽度未设置或太小，设置为默认宽度
            // PLUGIN_DEFAULT_WIDTH
            const defaultWidth = 280;
            if (!currentWidth || currentWidth < 100) {
                changePluginWidth(PLUGIN_NAME.Collections, defaultWidth);
            }
        });

        const align = computed(() => {
            return getPluginByLayout(PLUGIN_NAME.Collections);
        });

        // 计算面板宽度，确保在 VSCode 环境中也能正确显示
        const panelWidth = computed(() => {
            // 尝试从 CSS 变量获取实际宽度
            const root = document.documentElement;
            const cssVarWidth = getComputedStyle(root)
                .getPropertyValue('--base-collection-panel-width')
                .trim();

            // 如果 CSS 变量有有效值且不是 calc()，直接使用
            if (
                cssVarWidth &&
                !cssVarWidth.includes('calc') &&
                !cssVarWidth.includes('var(')
            ) {
                const parsedWidth = parseFloat(cssVarWidth);
                if (parsedWidth > 100) {
                    return cssVarWidth;
                }
            }

            // 否则，基于视口宽度动态计算（参考 base-config-page.less 的计算方式）
            // (100vw - (280 + 280 + 40 * 2 - 1)) / 2
            const viewportWidth =
                window.innerWidth || document.documentElement.clientWidth;
            const leftPanelWidth = 280;
            const rightPanelWidth = 280;
            const navPanelWidth = 40;
            const calculatedWidth = Math.floor(
                (viewportWidth -
                    (leftPanelWidth +
                        rightPanelWidth +
                        navPanelWidth * 2 -
                        1)) /
                    2
            );

            // 如果计算出的宽度合理，使用它；否则使用默认值 600px（参考 TutorialVideoPanel）
            const finalWidth =
                calculatedWidth > 400 && calculatedWidth < 1200
                    ? calculatedWidth
                    : 600;

            return `${finalWidth}px`;
        });

        watch(
            () => state.dataSource.name,
            value => {
                dataSourceState.dataSourceColumn.name = value;
            }
        );

        watch(
            () => state.dataSource.data?.columns,
            value => {
                if (!value || !state.dataSource.id) {
                    return;
                }

                dataSourceState.dataSourceColumn.columns = value?.map(
                    ({ name, title, type, format }) => ({
                        name,
                        title,
                        type,
                        format
                    })
                );
            },
            { deep: true }
        );

        watch(
            () => props.modelValue,
            value => {
                state.dataSource = value || {};
                const {
                    id,
                    name,
                    data: { columns, type }
                } = value;

                if (!id) {
                    return;
                }

                const filterColumns = (columns || []).map(
                    ({
                        name: columnName,
                        title,
                        type: columnType,
                        format
                    }) => ({
                        name: columnName,
                        title,
                        type: columnType,
                        format
                    })
                );

                dataSourceState.dataSourceColumn = {
                    name,
                    type: type || 'remote',
                    columns: filterColumns
                };
                dataSourceState.dataSourceColumnCopies = extend(
                    true,
                    {},
                    dataSourceState.dataSourceColumn
                );
            },
            { immediate: true }
        );

        watch(
            () => props.activeTabName,
            value => {
                state.activeTabName = value;
            },
            { immediate: true, deep: true }
        );

        const closeAllPanel = () => {
            close();
            closeRemoteResult();
        };

        const getAppId = () =>
            getMetaApi(META_SERVICE.GlobalService).getBaseInfo().id;

        const deleteDataSource = () => {
            const execDelete = () =>
                requestDeleteDataSource(state.dataSource.id)
                    .then(data => {
                        if (data) {
                            requestGenerateDataSource(getAppId());
                            useNotify({
                                title: t(
                                    'designer.datasource.dataSourceDeleteSuccess'
                                ),
                                type: 'success'
                            });
                            close();
                            emit('save');
                        }
                    })
                    .catch(error => {
                        message({
                            message: `${t(
                                'designer.datasource.dataSourceDeleteFailed'
                            )},${error?.message || ''}`,
                            status: 'error'
                        });
                    });

            useModal().confirm({
                message: t('designer.datasource.confirmDeleteDataSource'),
                exec: execDelete
            });
        };

        const activeTabChange = name => {
            emit('activeTab', name);
        };

        const save = async () => {
            try {
                // await validate() 如果验证不通过会抛出异常，而不是返回 false
                await getServiceForm().validate();
            } catch (error) {
                activeTabChange('remote');
                return;
            }
            getDataSourceName().validate(async valid => {
                if (valid) {
                    // 安全检查：确保 columns 存在，如果是 undefined 或 null，使用空数组
                    const columnsData = state.dataSource.data?.columns || [];
                    const columns = columnsData.map(
                        ({ name, title, type, format, field }) => {
                            return {
                                name,
                                title,
                                field,
                                type,
                                format
                            };
                        }
                    );

                    try {
                        // await validate() 如果验证不通过会抛出异常，而不是返回 false
                        await getRecordGrid().fullValidate();
                    } catch (error) {
                        activeTabChange('record');
                        return;
                    }

                    settingRef.value.saveRecord().then(record => {
                        // 确保 state.dataSource.data 存在，如果不存在则初始化
                        if (!state.dataSource.data) {
                            state.dataSource.data = {};
                        }

                        const editRequestData = {
                            name: state.dataSource.name,
                            data: Object.assign(state.dataSource.data, {
                                columns,
                                ...dataSourceState.remoteConfig,
                                data: record
                                    ? record.requestData.data.data
                                    : state.dataSource.data.data
                            })
                        };
                        const addRequestData = {
                            columns,
                            data: record ? record.requestData.data.data : [],
                            type: state.dataSource.data.type
                                ? state.dataSource.data.type
                                : 'remote',
                            ...dataSourceState.remoteConfig
                        };
                        if (props.editable) {
                            requestUpdateDataSource(
                                state.dataSource.id,
                                editRequestData
                            ).then(() => {
                                requestGenerateDataSource(getAppId());
                                // 修改dataSource成功
                                if (record) {
                                    const { name } = record.requestData;
                                    const key = `datasource${capitalize(
                                        camelize(name)
                                    )}`;
                                    const pageSchema = useCanvas().getSchema();

                                    if (pageSchema.state[key]) {
                                        pageSchema.state[key] = record.data.map(
                                             
                                            ({ _id, ...other }) => other
                                        );
                                    }
                                }
                                useNotify({
                                    title: t(
                                        'designer.datasource.dataSourceModifySuccess'
                                    ),
                                    type: 'success'
                                });
                                emit('save');
                                dataSourceState.dataSourceColumn = {};
                                dataSourceState.dataSourceColumnCopies = {};
                                dataSourceState.remoteConfig = {};
                            });
                        } else {
                            requestAddDataSource({
                                name: state.dataSource.name,
                                app: getAppId(),
                                data: addRequestData
                            })
                                .then(() => {
                                    requestGenerateDataSource(getAppId());
                                    useNotify({
                                        title: t(
                                            'designer.datasource.dataSourceAddSuccess'
                                        ),
                                        type: 'success'
                                    });
                                    emit('save');
                                    dataSourceState.dataSourceColumn = {};
                                    dataSourceState.dataSourceColumnCopies = {};
                                    dataSourceState.remoteConfig = {};
                                })
                                .catch(error => {
                                    message({
                                        message: `${t(
                                            'designer.datasource.dataSourceSaveFailed'
                                        )}：${error?.message || ''}`,
                                        status: 'error'
                                    });
                                });
                        }
                    });
                    close();
                    closeRemoteResult();
                }
            });
        };

        const selectDataSourceTemplate = templateId => {
            fetchTemplateDetail(templateId).then(res => {
                if (res && res.length > 0) {
                    // 确保 state.dataSource.data 存在
                    if (!state.dataSource.data) {
                        state.dataSource.data = {};
                    }
                    state.dataSource.data.columns = (
                        res[0].data.columns || []
                    ).map(({ title, field, name, type }) => ({
                        title,
                        name,
                        field,
                        type,
                        format: {}
                    }));
                }
            });
        };

        const renderRemoteData = remoteData => {
            emit('renderRemoteData', remoteData);
        };

        watch(
            () => state.dataSource.data?.type,
            value => {
                activeTabChange(value);
            }
        );

        return {
            align,
            panelWidth,
            settingRef,
             
            PLUGIN_NAME,
            state,
            isOpen,
            save,
            closeAllPanel,
            openRemoteResult,
            selectDataSourceTemplate,
            deleteDataSource,
            renderRemoteData,
            activeTabChange,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.datasource-form-footer {
    padding: 12px;
    .tiny-svg {
        margin-right: 6px;
    }

    .del:hover {
        background-color: var(--te-datasource-delete-button-bg-color-hover);
    }
}
</style>
