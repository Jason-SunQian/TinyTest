<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <div class="blocks-wrap">
        <block-group v-model="state.groups" @change-group="changeGroup" />
        <tiny-search
            v-model="state.searchValue"
            clearable
            :placeholder="t('designer.leftPanel.searchPlaceholder')"
        >
            <template #prefix> <tiny-icon-search /> </template>
        </tiny-search>
        <div class="block-list">
            <block-list
                v-model:block-list="filterBlocks"
                :show-add-button="true"
                :show-block-shot="true"
            />
        </div>
    </div>
    <!-- TODO: vue 版本升级到 3.5+ 之后，支持 defer，就不需要 rightPanelRef 了 -->
    <teleport v-if="rightPanelRef" defer to=".material-right-panel">
        <block-group-panel />
        <block-version-select />
    </teleport>
</template>

<!-- eslint-disable vue/max-lines-per-block, vue/block-lang, vue/component-api-style -->
<script lang="tsx">
/* metaService: engine.plugins.materials.block.BlockPanel */
import { onMounted, reactive, watch, provide, computed } from 'vue';
import { Search } from '@opentiny/vue';
import { iconSearch } from '@opentiny/vue-icon';
import {
    useBlock,
    useMaterial,
    useModal,
    getMetaApi,
    META_SERVICE
} from '@opentiny/tiny-engine-meta-register';

import { useDesignerI18n } from '@/services/i18nService';

import metaData from '../meta';

import BlockGroup from './BlockGroup.vue';
import BlockList from './BlockList.vue';
import BlockGroupPanel from './BlockGroupPanel.vue';
import BlockVersionSelect from './BlockVersionSelect.vue';
import {
    fetchGroups,
    fetchGroupBlocksById,
    fetchGroupBlocksByIds
} from './http';
import {
    setBlockPanelVisible,
    setBlockVersionPanelVisible
} from './js/usePanel';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinySearch: Search,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyIconSearch: iconSearch(),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        BlockGroup,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        BlockList,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        BlockGroupPanel,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        BlockVersionSelect
    },
    props: {
        activeTabName: {
            type: String,
            default: ''
        },
        rightPanelRef: {
            type: Object,
            default: null
        }
    },
    // eslint-disable-next-line vue/component-api-style
    setup(props) {
        // 获取国际化 t 函数
        const { t } = useDesignerI18n();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // const i18n: any = inject(I18nInjectionKey);

        const {
            addDefaultGroup,
            isDefaultGroupId,
            isAllGroupId,
            isRefresh,
            selectedGroup,
            getGroupList,
            setGroupList
        } = useBlock();
        const { materialState } = useMaterial();
        const { message } = useModal();
        const getAppId = () =>
            getMetaApi(META_SERVICE.GlobalService).getBaseInfo().id;

        const state = reactive({
            searchValue: '',
            groups: [],
            groupData: []
        });

        const filterBlocks = computed(() => {
            if (!state.searchValue) {
                return state.groupData;
            }

            const lowerCaseSearchValue = state.searchValue.toLowerCase();

            return state.groupData.filter(block => {
                const nameCN = block?.name_cn?.toLowerCase?.() ?? '';
                const label = block?.label?.toLowerCase?.() ?? '';
                const description = block?.description?.toLowerCase?.() ?? '';

                return (
                    nameCN.includes(lowerCaseSearchValue) ||
                    label.includes(lowerCaseSearchValue) ||
                    description.includes(lowerCaseSearchValue)
                );
            });
        });

        const changeGroup = () => {
            state.searchValue = '';
        };

        provide('displayType', 'default');

        // 读取区块
        const fetchBlocks = async value => {
            // 设计器默认区块分组的数据从bundle.json取，其他用户自定义分组调接口向数据库查询
            const { groupId } = selectedGroup.value;
            if (isDefaultGroupId(groupId)) {
                const blocks = materialState.blocks[0]?.children || [];
                state.groupData = value
                    ? blocks.filter(item =>
                          new RegExp(value, 'i').test(item?.label)
                      )
                    : blocks;
                state.groupData.forEach(block => {
                    block.isDefaultGroup = true;
                });
            } else if (isAllGroupId(groupId)) {
                const groupIds = state.groups
                    .map(item => item.value.groupId)
                    .filter(id => typeof id === 'number');
                const innerBlocks = materialState.blocks[0]?.children || [];
                innerBlocks.forEach(item => {
                    item.isDefaultGroup = true;
                    item.groupName = t(
                        'designer.materials.defaultBlockGroupName'
                    );
                });
                let blocks = [];
                try {
                    blocks = await fetchGroupBlocksByIds({ groupIds });
                } catch (error) {
                    message({
                        message: `${t(
                            'designer.materials.fetchBlockListFailed'
                        )}: ${error.message || error}`,
                        status: 'error'
                    });
                }
                state.groupData = [...innerBlocks, ...blocks];
            } else {
                fetchGroupBlocksById({ groupId, value })
                    .then(data => {
                        state.groupData = data;
                        const list = getGroupList()?.map(item => {
                            if (item.id === groupId) {
                                item.blocks = data;
                            }
                            return item;
                        });
                        setGroupList(list);
                    })
                    .catch(error => {
                        state.groupData = [];
                        message({
                            message: `${t(
                                'designer.materials.fetchBlockListFailed'
                            )}: ${error.message || error}`,
                            status: 'error'
                        });
                    });
            }
        };

        watch(
            () => selectedGroup.value.groupId,
            // 避免简写带入watch默认参数
            () => fetchBlocks()
        );

        watch(
            () => isRefresh.value,
            value => {
                if (value) {
                    fetchBlocks();
                    isRefresh.value = false;
                }
            }
        );

        watch(
            () => props.activeTabName,
            value => {
                if (value !== metaData.id) {
                    setBlockPanelVisible(false);
                    setBlockVersionPanelVisible(false);
                }
            }
        );

        onMounted(() => {
            fetchGroups(getAppId())
                .then(data => {
                    const groups = addDefaultGroup(data);
                    state.groups.push(...groups);

                    fetchBlocks();
                })
                .catch(error => {
                    message({
                        message: `${t(
                            'designer.materials.fetchBlockListFailed'
                        )}: ${error.message || error}`,
                        status: 'error'
                    });
                });
        });

        return {
            state,
            filterBlocks,
            changeGroup,
            // 暴露 t 函数给模板使用
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.blocks-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    .tiny-search {
        padding: 0 12px 12px 12px;
        border-bottom: 1px solid var(--te-materials-block-panel-border-color);
        :deep(.tiny-input__inner) {
            height: 30px;
        }
    }

    :deep(.block-list) {
        .block-item {
            color: #ababab;
        }
    }
}

.block-list {
    padding: 12px;
    overflow-y: auto;
}
</style>
