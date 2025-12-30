<!-- eslint-disable vue/no-bare-strings-in-template, vue/max-lines-per-block, vue/block-lang -->
<template>
    <div class="datasource-record-list">
        <div class="actions">
            <tiny-button
                plain
                :disabled="!allowCreate"
                @click.stop="insertNewData"
                ><svg-icon
                    name="add"
                    class="btn-icon"
                />{{ t('designer.datasource.addStaticData') }}</tiny-button>
            <tiny-button
                plain
                :disabled="state.isBatchDeleteDisable"
                @click.stop="batchDelete"
                ><svg-icon class="btn-icon" name="delete" />{{ t('designer.common.delete') }}</tiny-button>
            <tiny-button
                plain
                :disabled="!allowCreate"
                @click.stop="showImportModal(true)"
                ><svg-icon
                    class="btn-icon"
                    name="upload"
                />{{ t('designer.datasource.batchImport') }}</tiny-button>
            <tiny-link
                type="primary"
                class="download"
                :underline="false"
                @click="download"
                >{{ t('designer.datasource.downloadImportTemplate') }}</tiny-link>
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
                        <svg-icon class="empty-icon" name="empty" />
                        <p>
                            <span>{{ t('designer.datasource.noData') }}</span>
                            <span v-if="isEmptyColumn">
                                <span>{{ t('designer.datasource.pleaseAddFieldFirst') }}</span>
                                <span class="add-column" @click="$emit('edit')">{{ t('designer.datasource.addField') }}</span>
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
            />
        </div>
        <data-source-record-upload
            :show-import-modal="state.showImportModal"
            @override="overrideData"
            @merge="mergeData"
            @close="showImportModal(false)"
        />
    </div>
</template>

<!-- eslint-disable vue/max-lines-per-block, vue/block-lang -->
<script lang="tsx">
/* eslint-disable */
import { reactive, ref, watchEffect, watch, computed, h } from 'vue';
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
import { utils } from '@opentiny/tiny-engine-utils';
import { useModal, useLayout } from '@opentiny/tiny-engine-meta-register';
import { fetchDataSourceDetail } from './js/http';
import {
    downloadFn,
    handleImportedData,
    overrideOrMergeData,
    getDataAfterPage
} from './js/datasource';
import DataSourceRecordUpload from './DataSourceRecordUpload.vue';
import { useDesignerI18n } from '../../services/i18nService';

const grid = ref(null);

export const getRecordGrid = () => {
    return grid.value;
};

export default {
    components: {
        TinyGrid: Grid,
        TinyPager: Pager,
        DataSourceRecordUpload,
        TinyLink: Link,
        TinyButton: Button
    },
    props: {
        // 数据源对象
        data: {
            type: Object,
            default: () => ({})
        }
    },
    emits: ['edit'],
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const { confirm } = useModal();
        const { PLUGIN_NAME, getPluginByLayout } = useLayout();
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
                        type,
                        min,
                        max,
                        message: `${lengthOrSize} ${t('designer.datasource.between')} ${min} - ${max}`
                    });
                }

                res[name] = rules;
            }

            return res;
        };

        const editorMap = {
            string: {
                component: Input
            },
            number: {
                component: Numeric,
                attrs: {
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
            if (!props.data.id) return;
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
            const { columns } = props.data.data;
            let newColumns = columns?.map(column => ({
                ...column,
                title: column.title?.zh_CN || column.title || column.field,
                field: column.name,
                formatText: column.type === 'date' ? 'date' : ''
            }));

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
                        default: ({ row }) => {
                            return h('div', { class: 'option-container' }, [
                                h('svg-icon', {
                                    name: 'copy',
                                    onClick: () => handleCopy(row)
                                }),
                                h('svg-icon', {
                                    name: 'delete',
                                    onClick: () => handleDelete(row)
                                })
                            ]);
                        }
                    }
                });
            }
            state.columns = newColumns;
            state.validRules = genValidateRules(newColumns || []);
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
            const data = grid.value.getTableData().fullData[0];
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

            return { requestData, data };
        };

        const saveRecordList = () => {
            return new Promise(resolve => {
                grid.value.validate(valid => {
                    if (!valid) {
                        return;
                    }
                    if (!state.totalData?.length) {
                        resolve(null);
                        return;
                    }
                    const totalData = state.totalData;
                    const columnsKeys = state.columns.map(({ name }) => name);
                    const data = totalData.map(item =>
                        Object.fromEntries(
                            Object.entries(item).filter(
                                ([key]) =>
                                    columnsKeys.includes(key) || key === '_id'
                            )
                        )
                    );

                    resolve(saveRecordFormData(data));
                });
            });
        };

        const download = () => {
            downloadFn(state.columns, '静态数据.xlsx');
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

        const loadData = (state, gridRef, { importData, isOverride }) => {
            const imported = handleImportedData(state.columns, importData);
            const result = overrideOrMergeData(
                isOverride,
                state.totalData,
                imported
            );
            state.totalData = result;
            const data = getDataAfterPage(result, state.pagerConfig);
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
            PLUGIN_NAME,
            state,
            grid,
            insertNewData,
            saveRecordFormData,
            getGridData,
            saveRecordList,
            download,
            showImportModal,
            batchDelete,
            editClosed,
            allowCreate,
            isEmptyColumn,
            handleSelectChange,
            handleCurrentChange,
            handleSizeChange,
            handleBeforeChange,
            overrideData,
            mergeData,
            t
        };
    }
};
</script>

<style lang="less" scoped>
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
    max-width: 642px;
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
    :deep(.tiny-grid .tiny-grid-editor, .tiny-grid__filter-wrapper
            .tiny-grid-editor) {
        height: 24px;
    }
}
</style>
