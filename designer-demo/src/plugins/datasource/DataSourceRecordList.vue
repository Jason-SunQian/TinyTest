<!-- eslint-disable vue/max-lines-per-block -->
<!-- eslint-disable vue/attribute-hyphenation -->
<!-- eslint-disable vue/v-on-event-hyphenation -->
<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable vue/html-closing-bracket-newline -->
<template>
    <plugin-setting
        v-if="isOpen"
        :is-icon-button="false"
        :show-if-full-screen="true"
        :fixed-name="PLUGIN_NAME.Collections"
        :align="align"
        :title="t('designer.datasource.staticDataManagement')"
        class="datasource-record-list"
        @cancel="closeRecordList"
        @save="saveRecordList"
        @full-screen-change="fullScreenChange"
    >
        <template #content>
            <div class="actions">
                <tiny-button
                    plain
                    :disabled="!allowCreate"
                    @click.stop="insertNewData"
                    ><svg-icon name="add" class="btn-icon"></svg-icon
                    >{{ t('designer.datasource.addStaticData') }}</tiny-button
                >
                <tiny-button
                    plain
                    :disabled="state.isBatchDeleteDisable"
                    @click.stop="batchDelete"
                    ><svg-icon class="btn-icon" name="delete"></svg-icon
                    >{{ t('designer.common.delete') }}</tiny-button
                >
                <tiny-button
                    plain
                    :disabled="!allowCreate"
                    @click.stop="showImportModal(true)"
                    ><icon-upload class="btn-icon"></icon-upload
                    >{{ t('designer.datasource.batchImport') }}</tiny-button
                >
                <tiny-link
                    type="primary"
                    class="download"
                    :underline="false"
                    @click="download"
                    ><icon-download
                        class="tiny-svg-size icon-download"
                    ></icon-download
                    >{{
                        t('designer.datasource.downloadImportTemplate')
                    }}</tiny-link
                >
            </div>
            <div class="record-list-data">
                <tiny-grid
                    ref="grid"
                    highlight-current-row
                    show-overflow
                    :show-icon="false"
                    :auto-resize="true"
                    :edit-config="{
                        trigger: 'click',
                        mode: 'row',
                        showStatus: false
                    }"
                    :edit-rules="state.validRules"
                    :data="state.tableData"
                    :columns="state.columns"
                    column-min-width="150px"
                    @edit-closed="editClosed"
                    @select-change="handleSelectChange"
                    @select-all="handleSelectChange"
                >
                    <template #empty>
                        <div class="empty-container">
                            <svg-icon
                                class="empty-icon"
                                name="empty"
                            ></svg-icon>
                            <p>
                                <span>{{ t('designer.common.noData') }}</span>
                                <span v-if="isEmptyColumn">
                                    <span>{{
                                        t(
                                            'designer.datasource.pleaseAddFieldFirst'
                                        )
                                    }}</span>
                                    <span
                                        class="add-column"
                                        @click="$emit('edit')"
                                        >{{
                                            t('designer.datasource.addField')
                                        }}</span
                                    >
                                </span>
                            </p>
                        </div>
                    </template>
                </tiny-grid>
                <tiny-pager
                    v-if="state.totalData.length > state.pagerConfig.pageSize"
                    class="data-source-list-pager"
                    layout="prev, pager, next"
                    is-before-page-change
                    :current-page="state.pagerConfig.currentPage"
                    :page-size="state.pagerConfig.pageSize"
                    :total="state.pagerConfig.total"
                    @before-page-change="handleBeforeChange"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                >
                </tiny-pager>
            </div>
        </template>
    </plugin-setting>
    <data-source-record-upload
        :showImportModal="state.showImportModal"
        @override="overrideData"
        @merge="mergeData"
        @close="showImportModal(false)"
    >
    </data-source-record-upload>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<!-- eslint-disable max-lines -->
<script lang="ts">
/* metaService: engine.plugins.collections.DataSourceRecordList */
import {
    reactive,
    ref,
    watchEffect,
    watch,
    computed,
    camelize,
    capitalize
} from 'vue';
import {
    Grid,
    Pager,
    Input,
    Numeric,
    DatePicker,
    Switch,
    Slider,
    Link,
    Button
} from '@opentiny/vue';
import { iconUpload } from '@opentiny/vue-icon';
import { PluginSetting } from '@opentiny/tiny-engine-common';
import { utils } from '@opentiny/tiny-engine-utils';
import {
    useModal,
    useLayout,
    useNotify,
    useCanvas
} from '@opentiny/tiny-engine-meta-register';
import useClipboard from 'vue-clipboard3';

import { useDesignerI18n } from '../../services/i18nService';

import { fetchDataSourceDetail, requestUpdateDataSource } from './js/http';
import {
    downloadFn,
    handleImportedData,
    overrideOrMergeData,
    getDataAfterPage
} from './js/datasource';
import DataSourceRecordUpload from './DataSourceRecordUpload.vue';

const isOpen = ref(false);

export const open = () => {
    isOpen.value = true;
};

export const close = () => {
    isOpen.value = false;
};

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyGrid: Grid,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PluginSetting,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyPager: Pager,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSourceRecordUpload,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyLink: Link,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyButton: Button,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        IconUpload: iconUpload()
    },
    props: {
        // 数据源对象
        data: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        }
    },
    emits: ['edit', 'refresh'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        // eslint-disable-next-line vue/require-typed-ref
        const grid = ref(null);
        const { confirm } = useModal();
        const { toClipboard } = useClipboard();
        const { layoutState, PLUGIN_NAME, getPluginByLayout } = useLayout();
        const align = computed(() =>
            getPluginByLayout(PLUGIN_NAME.Collections)
        );

        const state = reactive({
            totalData: [],
            tableData: [],
            columns: [],
            showFullScreen: {
                value: false
            },
            upload: {
                importData: []
            },
            isBatchDeleteDisable: true,
            pagerConfig: {
                currentPage: 1,
                pageSize: 10,
                total: 0
            },
            showImportModal: false,
            validRules: {}
        });

        const allowCreate = computed(() => state.columns?.length > 0);
        const isEmptyColumn = computed(() => state.columns?.length <= 0);

        const copyData = async id => {
            try {
                await toClipboard(id);
            } catch (e) {
                useNotify({
                    message: t('designer.datasource.copyFailed'),
                    type: 'error'
                });
                throw new Error(e);
            }
        };

        const genValidateRules = columns => {
            const res = {};

            for (const item of columns) {
                const rules = [];
                const {
                    format: { min, max, required } = {},
                    type,
                    name
                } = item;

                if (required) {
                    rules.push({ 
                        required: true, 
                        message: `${item.name}${t('designer.datasource.required')}` 
                    });
                }

                if (
                    (type === 'string' || item.type === 'number') &&
                    max !== 0 &&
                    max >= min
                ) {
                    const lengthOrSize = type === 'string' 
                        ? t('designer.datasource.length') 
                        : t('designer.datasource.size');
                    rules.push({
                        min,
                        max,
                        message: `${lengthOrSize} ${t('designer.datasource.between')} ${min} - ${max}`
                    });
                }

                res[name] = rules;
            }

            return res;
        };

        const renderer = (h, { row }) => {
            return h(
                'span',
                {
                    class: 'copy-data',
                    title: t('designer.common.copy'),
                    onClick: (e: Event) => {
                        e.stopPropagation();
                        e.preventDefault();
                        copyData(row._id);
                    }
                },
                [row._id, h('icon-copy')]
            );
        };

        const editorMap = {
            string: {
                component: Input
            },
            number: {
                component: Numeric,
                attrs: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'controls-position': 'right'
                }
            },
            date: {
                component: DatePicker
            },
            link: {
                component: Input
            },
            switch: {
                component: Switch
            },
            slider: {
                component: Slider,
                attrs: {
                    class: 'record-list-slider'
                }
            }
        };

        const getMockPageData = async (offset, pageSize) => {
            const res = await fetchDataSourceDetail(props.data.id);
            const columns = res?.data?.columns;

            if (Array.isArray(columns) && columns.length > 0) {
                state.validRules = genValidateRules(columns || []);
            }

            // 兼容旧版本 唯一key 为 id 的场景
            const result = res.data.data.map(item => {
                if (item._id) {
                    return item;
                }

                return {
                    ...item,
                    _id: item.id
                };
            });

            state.totalData = result;

            const data = result.slice(offset, offset + pageSize);

            return data;
        };

        const getGridData = ({ page, forceUseRemoteData }) => {
            const { currentPage, pageSize } = page;
            const offset = (currentPage - 1) * pageSize;

            return new Promise((resolve, reject) => {
                if (!forceUseRemoteData) {
                    let newOffset = offset;

                    while (
                        newOffset >= state.totalData.length &&
                        newOffset > 0
                    ) {
                        newOffset -= pageSize;
                    }

                    resolve({
                        result: state.totalData.slice(
                            newOffset,
                            newOffset + pageSize
                        ),
                        page: {
                            total: state.totalData.length
                        }
                    });
                    return;
                }

                getMockPageData(offset, pageSize)
                    .then(data => {
                        resolve({
                            result: data,
                            page: { total: state.totalData.length }
                        });
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        };

        const fetchData = (forceUseRemoteData = false) => {
            return getGridData({
                page: state.pagerConfig,
                forceUseRemoteData
            }).then(({ result, page }) => {
                state.tableData = result;
                state.pagerConfig.total = page.total;
                // 通知刷新mock数据到 appSchemaState
                emit('refresh');
            });
        };

        const handleCopy = rowData => {
            const columnsKey = state.columns.map(({ name }) => name);
            const newDataEntries = Object.entries(rowData).filter(([key]) =>
                columnsKey.includes(key)
            );
            const newRecord = {
                ...Object.fromEntries(newDataEntries),
                _id: utils.guid()
            };

            grid.value.insert(newRecord);
            state.totalData.unshift(newRecord);
            fetchData();
        };

        const handleDelete = rowData => {
            const messageSaved = {
                render: () => {
                    return h('span', [
                        h(
                            'span',
                            {
                                style: {
                                    color: 'var(--te-datasource-modal-text-color)'
                                }
                            },
                            t('designer.datasource.confirmDeleteData')
                        )
                    ]);
                }
            };
            confirm({
                title: t('designer.datasource.deleteData'),
                message: messageSaved,
                exec: () => {
                    grid.value.remove(rowData);
                    state.totalData = state.totalData.filter(
                        ({ _id }) => _id !== rowData._id
                    );
                    fetchData();
                }
            });
        };

        watchEffect(() => {
            const { columns, type } = props.data.data;
            let newColumns = columns?.map(column => ({
                ...column,
                title: column.title?.zh_CN || column.title || column.field,
                field: column.name,
                formatText: column.type === 'date' ? 'date' : ''
            }));

            if (type === 'tree') {
                newColumns = [
                    {
                        title: '_id',
                        field: '_id',
                        name: '_id',
                        type: 'string',
                        renderer
                    },
                    {
                        title: t('designer.datasource.parentId'),
                        field: '_pid',
                        name: '_pid',
                        type: 'string'
                    },
                    ...newColumns
                ];
            }

            newColumns = newColumns?.map(item => {
                const editor = editorMap[item.type];

                return {
                    editor,
                    showIcon: false,
                    ...item
                };
            });

            if (newColumns?.length > 0) {
                newColumns.unshift({
                    width: 60,
                    type: 'selection'
                });

                newColumns.push({
                    field: 'option',
                    title: t('designer.datasource.operation'),
                    width: 100,
                    fixed: 'right',
                    slots: {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        default: ({ row }: { row: any }) =>
                            h('div', { class: 'option-container' }, [
                                h('svg-icon', {
                                    name: 'copy',
                                    onClick: () => {
                                        handleCopy(row);
                                    }
                                }),
                                h('svg-icon', {
                                    name: 'delete',
                                    onClick: () => {
                                        handleDelete(row);
                                    }
                                })
                            ])
                    }
                });
            }
            state.columns = newColumns;
        });

        watch(
            () => props.data.name,
            () => {
                state.totalData = [];
                state.pagerConfig.currentPage = 1;
                fetchData(true).then(() => {
                    grid.value?.clearAll?.();
                    grid.value?.resetAll?.();
                    grid.value?.validate?.();
                });
            }
        );

        // 插入一条新数据
        const insertNewData = () => {
            grid.value.insert({ _id: utils.guid() });
            const { fullData } = grid.value.getTableData();
            const [data] = fullData;
            state.totalData.unshift(data);
            grid.value.setActiveRow(data);
        };

        // 保存表单数据
        const saveRecordFormData = data => {
            const {
                name,
                id,
                data: { columns, type, ...other }
            } = props.data;

            const requestData = {
                name,
                id,
                data: { columns, type, ...other, data }
            };

            requestUpdateDataSource(props.data.id, requestData).then(res => {
                if (!res) {
                    return;
                }

                const key = `datasource${capitalize(camelize(name))}`;
                const pageSchema = useCanvas().getSchema();

                if (pageSchema.state[key]) {
                    pageSchema.state[key] = data.map(
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        ({ _id, ...rest }) => rest
                    );
                }

                useNotify({
                    type: 'success',
                    message: t('designer.datasource.dataSourceModifySuccess')
                });

                fetchData(true);
            });
        };

        const saveRecordList = () => {
            grid.value.validate(valid => {
                if (!valid) {
                    return;
                }

                const { totalData, columns } = state;
                const columnsKeys = columns.map(({ name }) => name);
                const data = totalData.map(item =>
                    Object.fromEntries(
                        Object.entries(item).filter(
                            ([key]) =>
                                columnsKeys.includes(key) || key === '_id'
                        )
                    )
                );

                saveRecordFormData(data);
            });
        };

        const fullScreenChange = value => {
            layoutState.settings.showDesignSettings = !value;
        };

        const download = () => {
            downloadFn(state.columns, `${t('designer.datasource.staticData')}.xlsx`);
        };

        const batchDelete = () => {
            const selectedData = grid.value
                .getSelectRecords()
                .map(({ _id }) => _id);

            if (selectedData.length <= 0) {
                return;
            }

            confirm({
                title: t('designer.datasource.batchDelete'),
                message: t('designer.datasource.confirmBatchDelete', { count: selectedData.length }),
                exec: () => {
                    grid.value.removeSelecteds();
                    state.totalData = state.totalData.filter(
                        ({ _id }) => !selectedData.includes(_id)
                    );
                    fetchData();
                    state.isBatchDeleteDisable = true;
                }
            });
        };

        const syncDataToTotalData = () => {
            const { insertRecords, updateRecords } = grid.value.getRecordset();

            const updatedData = [...insertRecords, ...updateRecords];
            const updatedIds = updatedData.filter(({ _id }) => _id);

            state.totalData = state.totalData.map(item => {
                if (!updatedIds.includes(item._id)) {
                    return item;
                }
                return updatedData.find(({ _id }) => _id === item._id);
            });
        };

        const editClosed = () => {
            grid.value.validate(valid => {
                syncDataToTotalData();
                if (valid) {
                    fetchData();
                }
            });
        };

        const showDesignSettings = () => {
            layoutState.settings.showDesignSettings = true;
        };

        const closeRecordList = () => {
            showDesignSettings();
            close();
        };

        const handleSelectChange = () => {
            const selectedData = grid.value.getSelectRecords();

            state.isBatchDeleteDisable = selectedData.length <= 0;
        };

        const handleBeforeChange = param => {
            const { callback, rollback } = param;
            grid.value.validate(valid => {
                if (valid) {
                    callback?.();
                    return;
                }
                rollback?.();
            });
        };

        const handleCurrentChange = current => {
            state.pagerConfig.currentPage = current;
            fetchData();
        };

        const handleSizeChange = size => {
            state.pagerConfig.pageSize = size;
            fetchData();
        };

        const showImportModal = show => {
            state.showImportModal = show;
        };

        const loadData = (localState, gridRef, { importData, isOverride }) => {
            const imported = handleImportedData(localState.columns, importData);
            const result = overrideOrMergeData(
                isOverride,
                localState.totalData,
                imported
            );
            localState.totalData = result;
            const data = getDataAfterPage(result, localState.pagerConfig);
            gridRef.value.loadData(data);
        };

        const overrideData = ({ importData }) => {
            loadData(state, grid, { importData, isOverride: true });
        };

        const mergeData = ({ importData }) => {
            loadData(state, grid, { importData, isOverride: false });
        };

        return {
            align,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            PLUGIN_NAME,
            isOpen,
            state,
            grid,
            closeRecordList,
            insertNewData,
            saveRecordFormData,
            getGridData,
            saveRecordList,
            download,
            showImportModal,
            batchDelete,
            fullScreenChange,
            editClosed,
            allowCreate,
            isEmptyColumn,
            handleSelectChange,
            handleCurrentChange,
            handleSizeChange,
            handleBeforeChange,
            overrideData,
            mergeData
        };
    }
};
</script>

<style lang="scss" scoped>
.actions {
    display: flex;
    justify-content: left;
    margin: 16px 0;
    .box-all-delete {
        margin: 1px 5px 0 5px;
        .all-delete {
            font-size: 14px;
        }
    }
    .download {
        text-decoration: none;
        display: inline-block;
        font-size: 12px;
        text-align: left;
        padding: 0;
        margin-left: 8px;
        &:hover {
            text-decoration: underline;
            color: var(--te-datasource-common-text-color-primary-hover);
        }
        color: var(--te-datasource-common-text-color-primary);
        .icon-download {
            margin: 0 1px 4px 0;
            font-size: 16px;
        }
    }
}

.empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--te-datasource-common-text-color-weaken);
    .empty-icon {
        width: 50px;
        height: 50px;
    }
    .add-column {
        color: var(--te-datasource-json-border-color);
        cursor: pointer;
    }
}

.datasource-record-list {
    width: 642px;
    :deep(.option-container) {
        display: flex;
        align-items: center;
        .svg-icon {
            margin-right: 10px;
            color: var(--te-datasource-list-item-icon-color);
        }
    }
}

.record-list-data {
    :deep(.tiny-grid.tiny-grid-editable .tiny-grid-body__column.col__ellipsis) {
        padding-left: 8px;
    }
    :deep(.data-source-list-pager) {
        padding-right: 8px;
        .tiny-pager__pages {
            li.is-active {
                background-color: var(--te-datasource-list-pager-bg-color);
            }
            li {
                &:not(.dot):not(.is-active):hover {
                    background-color: var(
                        --te-datasource-common-bg-color-hover
                    );
                    color: var(--te-datasource-common-text-color-primary);
                }
            }
        }
        .tiny-pager__pull-left {
            color: var(--te-datasource-toolbar-breadcrumb-text-color);
        }
        .tiny-pager__btn-next,
        .tiny-pager__btn-prev {
            &:not([disabled]):hover {
                background-color: var(--te-datasource-icon-bg-color-hover);

                svg {
                    color: var(--te-datasource-toolbar-icon-color);
                }
            }
        }
    }
}
</style>
