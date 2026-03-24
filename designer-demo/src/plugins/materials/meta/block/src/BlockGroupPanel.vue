<!-- eslint-disable vue/no-root-v-if -->
<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <plugin-setting
        v-if="panel.show"
        :align="align"
        :title="validGroup.groupName"
        :fixed-name="PLUGIN_NAME.Materials"
        @cancel="closeGroupPanel"
        @save="addBlocks"
    >
        <template #content>
            <div class="block-add-content">
                <div class="block-add-content-title">
                    {{ t('designer.materials.blockList') }}
                </div>
                <block-group-filters
                    :key="validGroup.groupId"
                    :filters="state.filters"
                    @search="searchBlocks"
                />
                <block-group-transfer :block-list="state.blockList">
                    <template #search>
                        <tiny-search
                            v-model="state.searchValue"
                            class="transfer-order-search"
                            :placeholder="
                                t('designer.materials.searchByNameOrId')
                            "
                            @update:model-value="
                                searchBlocks(state.filterValues)
                            "
                        >
                            <template #prefix>
                                <tiny-icon-search />
                            </template>
                        </tiny-search>
                    </template>
                </block-group-transfer>
            </div>
        </template>
    </plugin-setting>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
/* metaService: engine.plugins.materials.block.BlockGroupPanel */
import { reactive, watch, provide, inject, ref, computed } from 'vue';
import { Search } from '@opentiny/vue';
import { iconSearch } from '@opentiny/vue-icon';
import { PluginSetting } from '@opentiny/tiny-engine-common';
import {
    useBlock,
    useLayout,
    useModal,
    useResource,
    useNotify,
    getMetaApi,
    META_SERVICE
} from '@opentiny/tiny-engine-meta-register';

import { useDesignerI18n } from '@/services/i18nService';

import BlockGroupTransfer from './BlockGroupTransfer.vue';
import BlockGroupFilters from './BlockGroupFilters.vue';
import {
    requestUpdateGroup,
    fetchAvailableBlocks,
    fetchGroupBlocksById,
    fetchTags,
    fetchTenants,
    fetchUsers
} from './http';
import { useGroupPanel } from './js/usePanel';

// 因为区块版本绑定在区块分组中，而一个应用有多个区块分组，所以要防止同一个应用中出现绑定重复区块
const blockMap = new Map();
const initGruopBlockMap = (groups = []) => {
    blockMap.clear();
    for (const group of groups) {
        const groupBlock = group?.blocks || [];
        for (const block of groupBlock) {
            blockMap.set(block.id, block);
        }
    }
};
const includesBlockInGroups = blockId => blockMap.has(blockId);

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinySearch: Search,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PluginSetting,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        BlockGroupTransfer,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        BlockGroupFilters,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyIconSearch: iconSearch()
    },
    // eslint-disable-next-line vue/component-api-style
    setup() {
        // 获取国际化 t 函数
        const { t } = useDesignerI18n();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // const i18n: any = inject(I18nInjectionKey);

        const {
            isAllGroupId,
            isDefaultGroupId,
            isRefresh,
            selectedGroup,
            selectedBlockArray,
            getGroupList,
            cancelCheckAll
        } = useBlock();
        const { panel, closePanel } = useGroupPanel();
        const { message } = useModal();
        const getAppId = () =>
            getMetaApi(META_SERVICE.GlobalService).getBaseInfo().id;
        const panelState = inject('panelState', {});
        const blockUsers = ref([]);
        provide('blockUsers', blockUsers);

        const state = reactive({
            searchValue: '',
            blockList: [],
            filters: [
                {
                    id: 'publicType',
                    get name() {
                        return t('designer.materials.byPublicScope');
                    },
                    children: []
                },
                {
                    id: 'author',
                    get name() {
                        return t('designer.materials.byAuthor');
                    },
                    children: [],
                    usingSelect: true
                },
                {
                    id: 'tag',
                    get name() {
                        return t('designer.materials.byTag');
                    },
                    children: [],
                    usingSelect: true
                }
            ],
            filterValues: {}
        });

        const validGroup = ref({ ...selectedGroup.value });

        const { PLUGIN_NAME, getPluginByLayout } = useLayout();
        const align = computed(() => getPluginByLayout(PLUGIN_NAME.Materials));

        watch(
            () => selectedGroup.value.groupId,
            groupId => {
                if (
                    groupId &&
                    !isAllGroupId(groupId) &&
                    !isDefaultGroupId(groupId)
                ) {
                    validGroup.value = { ...selectedGroup.value };
                }
            }
        );

        const clearSearchParams = () => {
            state.searchValue = '';
            state.filterValues = {};
        };

        const addBlocks = () => {
            const { groupId } = validGroup.value;
            fetchGroupBlocksById({ groupId })
                .then(data => {
                    const resData =
                        data?.map(item => ({
                            id: item.id,
                            version: item.current_version
                        })) || [];
                    const selectedBlocks =
                        selectedBlockArray?.value?.map(item => ({
                            id: item.id,
                            version: item.latestVersion
                        })) || [];

                    if (selectedBlocks.length === 0) {
                        return;
                    }

                    const blocks = [...resData, ...selectedBlocks];

                    // 这里把异步请求 return，可以让下面的 catch 捕获到错误
                    return requestUpdateGroup({
                        id: groupId,
                        blocks,
                        app: getAppId()
                    }).then(() => {
                        isRefresh.value = true;
                        clearSearchParams();
                        selectedBlockArray.value.length = 0;
                        // 添加区块分组，不需要重新init页面或者区块。
                        useResource().fetchResource({ isInit: false });
                        useNotify({
                            message: t('designer.materials.addBlockSuccess'),
                            type: 'success'
                        });
                        useBlock().isRefresh.value = true;
                    });
                })
                .catch(error => {
                    message({
                        message: `${t('designer.materials.addBlockFailed')}: ${
                            error.message || error
                        }`,
                        status: 'error'
                    });
                })
                .finally(() => {
                    cancelCheckAll();
                });
            panelState.isBlockGroupPanel = false;
            closePanel();
        };

        const closeGroupPanel = () => {
            clearSearchParams();
            selectedBlockArray.value.length = 0;
            panelState.isBlockGroupPanel = false;
            closePanel();
        };

        const selectedBlockFilter = blocks => {
            const isInBlockGroup = block => includesBlockInGroups(block.id);

            return blocks.filter(block => !isInBlockGroup(block));
        };

        const searchBlocks = filters => {
            state.filterValues = filters;

            const params = {
                groupId: validGroup.value.groupId,
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                label_contains: state.searchValue.trim(),
                tag: filters?.tag,
                publicType: filters?.publicType,
                author: filters?.author
            };
            fetchAvailableBlocks(params)
                .then(data => {
                    state.blockList = selectedBlockFilter(data);
                })
                .catch(error => {
                    message({
                        message: `${t(
                            'designer.materials.blockSearchFailed'
                        )}: ${error.message || error}`,
                        status: 'error'
                    });
                });
        };

        const fetchBlocks = groupId => {
            fetchAvailableBlocks({ groupId })
                .then(data => {
                    initGruopBlockMap(getGroupList());
                    state.blockList = selectedBlockFilter(data);
                })
                .catch(error => {
                    message({
                        message: `${t(
                            'designer.materials.fetchAvailableBlocksFailed'
                        )}: ${error.message || error}`,
                        status: 'error'
                    });
                });
        };

        const getFilters = () => {
            Promise.allSettled([
                fetchTenants(),
                fetchUsers(),
                fetchTags()
            ]).then(results => {
                state.filters[0].children = [
                    {
                        get name() {
                            return t('designer.materials.publicToAll');
                        },
                        id: '1'
                    },
                    {
                        get name() {
                            return t('designer.materials.publicToCurrent');
                        },
                        id: '2'
                    }
                ];
                state.filters[1].children =
                    results[1].status === 'fulfilled'
                        ? results[1].value.map(item => ({
                              name: item?.username,
                              id: item?.id
                          }))
                        : [];
                state.filters[2].children =
                    results[2].status === 'fulfilled'
                        ? results[2].value.map(item => ({ name: item }))
                        : [];
                blockUsers.value = state.filters[1].children;
            });
        };

        watch(
            [() => panel.show, () => validGroup.value.groupId],
            ([show, groupId]) => {
                if (!show) {
                    return;
                }

                panelState.isBlockGroupPanel = true;
                clearSearchParams();
                fetchBlocks(groupId);
                getFilters();
            }
        );

        return {
            align,
            validGroup,
            state,
            panel,
            closeGroupPanel,
            addBlocks,
            searchBlocks,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            PLUGIN_NAME,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.block-add-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    .block-add-content-title {
        font-weight: 700;
        margin-bottom: 12px;
    }
    .transfer-order-search {
        flex: 1;
    }
}

:deep(.plugin-setting-header) {
    .tiny-button {
        width: 40px;
        padding: 0;
        min-width: 40px;
    }
}
</style>
