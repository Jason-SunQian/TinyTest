<template>
    <div class="data-source-setting">
        <tiny-tabs v-model="state.activeTabName" @click="tabClick">
            <tiny-tab-item
                v-if="showRemote"
                :title="t('designer.datasource.remoteConfig')"
                name="remote"
            >
                <div>
                    <data-source-setting-remote
                        v-model="state.dataSource.data"
                        :editable="editable"
                        @render-remote-data="renderRemoteData"
                    />
                </div>
            </tiny-tab-item>
            <tiny-tab-item
                :title="t('designer.datasource.dataSourceFields')"
                name="field"
            >
                <div>
                    <data-source-field
                        v-model="state.dataSource.data.columns"
                        :editable="editable"
                    />
                </div>
            </tiny-tab-item>
            <tiny-tab-item
                :title="t('designer.datasource.staticData')"
                name="record"
            >
                <data-source-setting-record-list
                    ref="recordRef"
                    :data="state.currentData"
                    @refresh="refresh()"
                    @edit="changeTab()"
                />
            </tiny-tab-item>
        </tiny-tabs>
    </div>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
import { watch, reactive, ref, computed } from 'vue';
import { TinyTabs, TinyTabItem } from '@opentiny/vue';
import {
    useDataSource,
    useResource,
    getMetaApi,
    META_SERVICE
} from '@opentiny/tiny-engine-meta-register';

import { useDesignerI18n } from '../../services/i18nService';

import DataSourceSettingRemote from './DataSourceSettingRemote.vue';
import DataSourceField from './DataSourceField.vue';
import DataSourceSettingRecordList from './DataSourceSettingRecordList.vue';
import { close as closeGlobalDataHandler } from './DataSourceGlobalDataHandler.vue';
import { close as closeRemoteResult } from './DataSourceSettingRemoteResult.vue';
import { fetchDataSourceList } from './js/http';

const dataSourceList = ref([]);

export const refresh = () => {
    const url = new URLSearchParams(location.search);
    const selectedId =
        getMetaApi(META_SERVICE.GlobalService).getBaseInfo().id ||
        url.get('id');
    fetchDataSourceList(selectedId).then(data => {
        dataSourceList.value = data;

        useResource().appSchemaState.dataSource = data;
    });
};

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTabs,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTabItem,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSourceSettingRemote,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSourceField,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSourceSettingRecordList
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
    emits: ['activeTab', 'renderRemoteData'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { t } = useDesignerI18n();

        const { dataSourceState } = useDataSource();
        // eslint-disable-next-line vue/require-typed-ref
        const recordRef = ref(null);

        const state = reactive({
            dataSource: {},
            activeTabName: props.activeTabName,
            currentData: { name: '', columns: [], data: [] }
        });

        const showRemote = computed(
            () =>
                !state.dataSource.data ||
                state.dataSource.data.type === 'remote'
        );

        const saveRecord = () => {
            return recordRef.value.saveRecordList();
        };

        const changeRecord = () => {
            state.currentData = state.dataSource;
            closeRemoteResult();
            closeGlobalDataHandler();
        };

        const changeTab = () => {
            state.activeTabName = 'field';
        };

        const tabClick = e => {
            state.activeTabName = e.name;
            emit('activeTab', e.name);
            if (e.name === 'record') {
                changeRecord();
            }
        };
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

        const renderRemoteData = remoteData => {
            emit('renderRemoteData', remoteData);
        };
        return {
            state,
            recordRef,
            showRemote,
            tabClick,
            renderRemoteData,
            refresh,
            changeTab,
            saveRecord,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.data-source-setting {
    height: 100%;
    transition: 0.3s linear;
    position: relative;
    padding-top: 20px;

    .tiny-tabs {
        height: 100%;
    }

    :deep(.tiny-tabs) {
        display: flex;
        flex-direction: column;

        .tiny-tabs__header .tiny-tabs__nav {
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            margin-bottom: 16px;
            background-color: var(--te-datasource-settings-tabs-bg-color);
        }

        .tiny-tabs__nav-scroll .tiny-tabs__active-bar {
            height: 3px;
            background-color: var(--te-datasource-settings-tabs-item-color-active);
        }

        .tiny-tabs__content {
            flex: 1;
            overflow-y: auto;
            padding: 0;
            margin: 0;

            &::-webkit-scrollbar-track,
            &::-webkit-scrollbar-track-piece,
            &::-webkit-scrollbar-corner,
            &::-webkit-scrollbar-thumb,
            &::-webkit-scrollbar-thumb:hover {
                background-color: transparent;
            }
        }

        .tiny-tabs__nav.is-show-active-bar .tiny-tabs__item {
            margin-right: 4px;
        }

        .tiny-tabs__item {
            flex: 1 1 0;
            width: auto;
            min-width: 0;
            padding: 0 6px;
            margin-right: 4px;
            font-size: 12px;
            line-height: 1.3;
            background-color: var(--te-datasource-settings-bg-color);
            color: var(--te-datasource-settings-text-color);

            &:hover {
                color: var(--te-datasource-settings-text-color-hover);
            }

            &.is-active {
                color: var(--te-datasource-settings-text-color-active);
                font-weight: var(--te-base-font-weight-4);
                border: none;
            }

            .tiny-tabs__item__title {
                padding-bottom: 6px;
                font-size: 12px;
                overflow: visible;
                text-overflow: clip;
                white-space: nowrap;
            }
        }

        .tiny-tabs__nav-wrap-not-separator::after {
            z-index: 2;
            margin-bottom: 16px;
            background-color: var(--te-datasource-settings-tabs-border-color) !important;
        }
    }

    :deep(.tiny-collapse-item__content) {
        padding: 0 8px 12px 12px;
    }
}
</style>
