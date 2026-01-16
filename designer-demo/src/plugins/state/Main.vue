/* eslint-disable max-lines, vue/multi-word-component-names */
<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <plugin-panel
        id="data-source"
        :title="t('designer.state.title')"
        class="plugin-state"
        fixed-name="engine.plugins.customState"
        :fixed-panels="fixedPanels"
        :docs-url="docsUrl"
        :docs-content="docsContent"
        :is-show-docs-icon="true"
        @close="closePanel"
    >
        <template #content>
            <div class="data-source-left-panel">
                <tiny-tabs
                    v-model="activeName"
                    tab-style="button-card"
                    @click="tabClick"
                >
                    <tiny-tab-item
                        :name="STATE.CURRENT_STATE"
                        :title="
                            isBlock
                                ? t('designer.state.blockState')
                                : t('designer.state.pageState')
                        "
                    />
                    <tiny-tab-item
                        :name="STATE.GLOBAL_STATE"
                        :title="t('designer.state.appState')"
                    />
                </tiny-tabs>
                <tiny-search
                    :model-value="query"
                    class="left-filter"
                    :placeholder="t('designer.state.searchPlaceholder')"
                    clearable
                    @update:model-value="search"
                >
                    <template #prefix>
                        <tiny-icon-search />
                    </template>
                </tiny-search>
                <div class="add-btn">
                    <tiny-button @click="openPanel(OPTION_TYPE.ADD)">
                        <svg-icon name="add" class="add-btn-icon" />
                        <span class="add-btn-text">{{
                            activeName === STATE.CURRENT_STATE
                                ? t('designer.state.addVariable')
                                : t('designer.state.addGlobalVariable')
                        }}</span>
                    </tiny-button>
                </div>
                <data-source-list
                    :model-value="Object.keys(state.dataSource)"
                    :state-scope="activeName"
                    :query="query"
                    :selected-key="selectedKey"
                    @open-panel="openPanel"
                    @remove="remove"
                    @remove-store="removeStore"
                />
            </div>
            <div
                v-if="isPanelShow"
                class="data-source-right-panel"
                :style="alignStyle"
            >
                <div class="header">
                    <span>{{ addDataSource }}</span>
                    <span class="options-wrap">
                        <tiny-button type="primary" @click="confirm">{{
                            t('designer.state.save')
                        }}</tiny-button>
                        <close-icon @close="cancel" />
                    </span>
                </div>
                <create-variable
                    v-if="activeName === STATE.CURRENT_STATE"
                    ref="variableRef"
                    :data-source="state.dataSource"
                    :flag="flag"
                    :update-key="updateKey"
                    :create-data="state.createData"
                    @name-input="updateName"
                    @close="cancel"
                    @mouseleave="onMouseLeaveVariable"
                />
                <create-store
                    v-if="activeName === STATE.GLOBAL_STATE"
                    ref="storeRef"
                    :data-source="state.dataSource"
                    :flag="flag"
                    :update-key="updateKey"
                    :store-data="state.createData"
                    @name-input="validName"
                    @close="cancel"
                    @mouseleave="onMouseLeaveStore"
                />
            </div>
        </template>
    </plugin-panel>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<!-- eslint-disable vue/require-typed-object-prop -->
<script lang="ts">
/* metaService: engine.plugins.state.Main */
import { reactive, ref, computed, onActivated, watch, provide, nextTick } from 'vue';
import { Button, Search, Tabs, TabItem } from '@opentiny/vue';
import {
    useCanvas,
    useHistory,
    useResource,
    useNotify,
    useHelp,
    useLayout,
    getMetaApi,
    META_APP,
    META_SERVICE
} from '@opentiny/tiny-engine-meta-register';
import { getCommentByKey } from '@opentiny/tiny-engine-common/js/comment';
import { iconSearch } from '@opentiny/vue-icon';
import { CloseIcon } from '@opentiny/tiny-engine-common';

import PluginPanel from '@/components/i18n-wrappers/PluginPanel/index.vue';
import { useDesignerI18n } from '@/services/i18nService';

import DataSourceList from './DataSourceList.vue';
import CreateVariable from './CreateVariable.vue';
import CreateStore from './CreateStore.vue';
import { updateGlobalState } from './js/http';
import { STATE, OPTION_TYPE } from './js/constants';
import { validateMonacoEditorData } from './js/common';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinySearch: Search,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyButton: Button,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DataSourceList,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        CreateVariable,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        CloseIcon,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTabs: Tabs,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTabItem: TabItem,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        CreateStore,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PluginPanel,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyIconSearch: iconSearch()
    },
    props: {
        // eslint-disable-next-line vue/require-default-prop, vue/require-typed-object-prop
        fixedPanels: {
            type: Array,
            default: undefined
        }
    },
    emits: ['close'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        // eslint-disable-next-line vue/require-typed-ref
        const variableRef = ref(null);
        // eslint-disable-next-line vue/require-typed-ref
        const storeRef = ref(null);
        // eslint-disable-next-line vue/require-typed-ref
        const isPanelShow = ref(false);
        const errorMessage = ref('');
        const flag = ref('');
        const query = ref('');
        const updateKey = ref('');
        const addDataSource = ref('');
        const activeName = ref(STATE.CURRENT_STATE);
        const isBlock = computed(() => useCanvas().isBlock());
        const { setSaved } = useCanvas();
        // 使用自定义 ID 获取 API
        const customSaveId = 'engine.toolbars.customSave';
        let saveApi = getMetaApi(customSaveId);
        
        // 如果找不到自定义的，尝试使用原插件的 ID（向后兼容）
        if (!saveApi) {
            saveApi = getMetaApi(META_APP.Save);
        }
        
        if (!saveApi) {
            throw new Error(`无法找到 Save API，请检查 registry.ts 中的配置`);
        }
        
        const { openCommon, saveCommon: saveCommonFn } = saveApi;
        const docsUrl = useHelp().getDocsUrl('data');
        const docsContent = computed(() => t('designer.state.docs'));
        const state = reactive({
            dataSource: {},
            createData: {
                name: '',
                description: '',
                variable: ''
            }
        });
        // eslint-disable-next-line vue/require-typed-ref
        const selectedKey = ref(null);

        const {
            PLUGIN_NAME,
            getPluginWidth,
            getPluginByLayout,
            changeLeftFixedPanels
        } = useLayout();

        // 使用实际注册的插件 ID（迁移后的自定义 ID）
        const pluginId = 'engine.plugins.customState';

        // 直接实现固定面板功能
        const handleFixPanel = () => {
            changeLeftFixedPanels(pluginId);
        };

        const firstPanelOffset = computed(() => {
            try {
                let width: number;
                try {
                    width = getPluginWidth(pluginId);
                    if (width === 280) {
                        width = getPluginWidth(PLUGIN_NAME.State);
                    }
                } catch (e) {
                    try {
                        width = getPluginWidth(PLUGIN_NAME.State);
                    } catch (e2) {
                        width = 280;
                    }
                }
                return width + 1;
            } catch (error) {
                return 281;
            }
        });

        const alignStyle = computed(() => {
            try {
                let panelAlign: string = 'leftTop';
                try {
                    const align1 = getPluginByLayout(pluginId);
                    if (align1 && align1 !== 'leftTop') {
                        panelAlign = align1;
                    } else {
                        try {
                            const align2 = getPluginByLayout(PLUGIN_NAME.State);
                            if (align2 && align2 !== 'leftTop') {
                                panelAlign = align2;
                            }
                        } catch (e2) {
                            // 忽略错误，使用默认值
                        }
                    }
                } catch (e) {
                    try {
                        const align2 = getPluginByLayout(PLUGIN_NAME.State);
                        if (align2) {
                            panelAlign = align2;
                        }
                    } catch (e2) {
                        // 忽略错误，使用默认值
                    }
                }
                
                const align = panelAlign?.includes('left') ? 'left' : 'right';
                let offset: number = 281;
                try {
                    offset = firstPanelOffset.value;
                } catch (e) {
                    // 忽略错误，使用默认值
                }
                return `${align}: ${offset}px`;
            } catch (error) {
                return 'left: 281px';
            }
        });

        const panelState = reactive({
            emitEvent: (eventName: string, ...args: unknown[]) => {
                // 如果是 fixPanel 事件，直接调用 changeLeftFixedPanels
                if (eventName === 'fixPanel' || eventName === 'fix-panel') {
                    handleFixPanel();
                } else {
                    // 其他事件正常 emit
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (emit as (event: string, ...args: unknown[]) => void)(
                        eventName,
                        ...args
                    );
                }
            }
        });

        provide('panelState', panelState);

        watch(activeName, () => {
            selectedKey.value = null;
        });

        const openPanel = (flagValue, key = '') => {
            updateKey.value = key;
            flag.value = flagValue;
            const isCurrent = activeName.value === STATE.CURRENT_STATE;
            if (flagValue === OPTION_TYPE.ADD) {
                state.createData.name = '';
                state.createData.variable = '';
                errorMessage.value = '';
                addDataSource.value = isCurrent
                    ? t('designer.state.addVariable')
                    : t('designer.state.addGlobalVariable');
            } else if (flagValue === OPTION_TYPE.UPDATE) {
                state.createData.name = key;
                state.createData.variable = state.dataSource[key];
                addDataSource.value = isCurrent
                    ? t('designer.state.modifyVariable')
                    : t('designer.state.modifyGlobalVariable');
            } else {
                state.createData.name = `${key}_copy`;
                state.createData.variable = state.dataSource[key];
                addDataSource.value = isCurrent
                    ? t('designer.state.copyVariable')
                    : t('designer.state.copyGlobalVariable');
            }

            isPanelShow.value = true;
            selectedKey.value = flagValue === OPTION_TYPE.UPDATE ? key : null;
        };

        const cancel = () => {
            errorMessage.value = '';
            isPanelShow.value = false;
            selectedKey.value = null;
        };

        const add = (name, variable) => {
            const { getSchema } = useCanvas();

            if (getSchema()) {
                if (
                    updateKey.value !== name &&
                    flag.value === OPTION_TYPE.UPDATE
                ) {
                    delete state.dataSource[updateKey.value];
                }
                state.dataSource[name] = variable;
            }
        };

        const validName = name => {
            errorMessage.value = name;
        };

        const notifySaveError = message => {
            useNotify({
                title: t('designer.state.saveError'),
                type: 'error',
                message
            });
        };

        const updateName = value => {
            state.createData.name = value;
        };

        const confirm = () => {
            const { name } = state.createData;
            const { getSchema, updateSchema } = useCanvas();

            if (activeName.value === STATE.CURRENT_STATE) {
                // 校验
                variableRef.value.validateForm().then(async () => {
                    // 获取数据
                    const variable = variableRef.value.getFormData();

                    // 保存数据
                    add(name, variable);
                    isPanelShow.value = false;
                    setSaved(false);

                    const schema = getSchema();
                    const updatedState = { ...(schema.state || {}), [name]: variable };
                    
                    // 更新 schema 的 state，确保包含新添加的变量
                    updateSchema({
                        state: updatedState
                    });

                    useHistory().addHistory();

                    // 兼容处理：如果 fixedPanels 中包含旧的 ID，也认为已固定
                    const isFixed = props.fixedPanels?.includes(pluginId) || 
                                   props.fixedPanels?.includes(PLUGIN_NAME.State) || 
                                   false;
                    
                    // 如果面板没有固定，临时固定，避免因保存时清空选中状态导致的面板关闭
                    if (!isFixed) {
                        changeLeftFixedPanels(pluginId);
                    }
                    
                    // 尝试自动保存，如果失败则保持红点，让用户手动保存
                    try {
                        await nextTick();
                        
                        if (saveCommonFn && typeof saveCommonFn === 'function') {
                            await saveCommonFn();
                            setSaved(true);
                            useNotify({
                                type: 'success',
                                message: 'Save successful!'
                            });
                        }
                    } catch (error) {
                        // 保存失败时，保持 setSaved(false)，红点会显示，用户可以手动保存
                    } finally {
                        if (!isFixed) {
                            changeLeftFixedPanels(pluginId);
                        }
                    }
                });
            } else {
                storeRef.value.validateForm().then(() => {
                    const validateResult = validateMonacoEditorData(
                        storeRef.value.getEditor(),
                        t('designer.state.stateField'),
                        { required: true }
                    );
                    if (!validateResult.success) {
                        notifySaveError(validateResult.message);
                        return;
                    }

                    const storeState = storeRef.value.getEditor().getValue();
                    const getters = storeRef.value.saveMethods('gettersEditor');
                    const actions = storeRef.value.saveMethods('actionsEditor');
                    const store = {
                        [name]: {
                            id: name,
                            state: storeState,
                            getters,
                            actions
                        }
                    };

                    if (
                        updateKey.value !== name &&
                        flag.value === OPTION_TYPE.UPDATE
                    ) {
                        delete state.dataSource[updateKey.value];
                    }

                    Object.assign(state.dataSource, store);
                    const storeList = Object.values(state.dataSource);

                    const { id } = getMetaApi(
                        META_SERVICE.GlobalService
                    ).getBaseInfo();
                    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                    updateGlobalState(id, { global_state: storeList }).then(
                        res => {
                            isPanelShow.value = false;
                            useResource().appSchemaState.globalState =
                                res.global_state || [];
                            useNotify({
                                message: t('designer.state.saveSuccess'),
                                type: 'success'
                            });
                        }
                    );
                    openCommon();
                });
            }
        };

        const search = value => {
            if (value === undefined) {
                return;
            }

            query.value = value;
        };

        const remove = key => {
            const { getSchema, updateSchema } = useCanvas();

            delete state.dataSource[key];

            const schema = getSchema();
            const { lifeCycles } = schema;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [key]: deletedKey, ...restState } = schema.state;

            if (key.startsWith('datasource')) {
                const pageSchema = getSchema();
                const { start, end } = getCommentByKey(key);

                /**
                 * 匹配提前注入的 loadDataSource 表达式和注释，级联删除
                 * 等价：/([\s\n]*\/\*\* start \*\/[\s\S]*\/\*\* end \*\/)/
                 * "任意换行或空白字符 /** start-key *\/ 任意字符 /** end-key *\/"，该字符串会被匹配
                 */
                const pattern = new RegExp(
                    `([\\s\\n]*\\/\\*\\* ${start} \\*\\/[\\s\\S]*\\/\\*\\* ${end} \\*\\/)`
                );

                lifeCycles.setup.value =
                    pageSchema.lifeCycles.setup.value.replace(pattern, '');
            }

            updateSchema({ state: restState, lifeCycles });

            // 如果删除的是当前编辑的状态变量，则需要关闭二级面板
            if (state.createData.name === key) {
                isPanelShow.value = false;
            }

            setSaved(false);
        };

        const setGlobalStateToDataSource = () => {
            const { globalState } = useResource().appSchemaState;

            if (!globalState) {
                state.dataSource = {};

                return;
            }

            state.dataSource = globalState.reduce(
                (acc, store) => ({ ...acc, [store.id]: store }),
                {}
            );
        };

        const removeStore = key => {
            const storeList =
                [...useResource().appSchemaState.globalState] || [];
            const index = storeList.findIndex(store => store.id === key);

            if (index !== -1) {
                const { id } = getMetaApi(
                    META_SERVICE.GlobalService
                ).getBaseInfo();

                storeList.splice(index, 1);
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                updateGlobalState(id, { global_state: storeList }).then(res => {
                    useResource().appSchemaState.globalState =
                        res.global_state || [];
                    setGlobalStateToDataSource();
                });

                // 如果删除的是当前编辑的状态变量，则需要关闭二级面板
                if (state.createData.name === key) {
                    isPanelShow.value = false;
                }
            }
        };

        const closePanel = () => {
            emit('close');
        };

        const initDataSource = (tabsName = activeName.value) => {
            const { getSchema } = useCanvas();

            if (tabsName === STATE.GLOBAL_STATE) {
                setGlobalStateToDataSource();
            } else {
                const pageSchema = getSchema() || {};

                state.dataSource = pageSchema.state || {};
            }

            // 初始化 addDataSource 的值
            const isCurrent = activeName.value === STATE.CURRENT_STATE;
            addDataSource.value = isCurrent
                ? t('designer.state.addVariable')
                : t('designer.state.addGlobalVariable');
        };

        const tabClick = () => {
            isPanelShow.value = false;
            query.value = '';
            initDataSource();
        };
        const onMouseLeaveVariable = () => {
            variableRef.value?.clearValidateForm();
        };
        const onMouseLeaveStore = () => {
            storeRef.value?.clearValidateForm();
        };

        onActivated(() => {
            initDataSource();
        });

        return {
            t,
            alignStyle,
            firstPanelOffset,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            PLUGIN_NAME,
            isBlock,
            isPanelShow,
            errorMessage,
            state,
            variableRef,
            addDataSource,
            updateName,
            openPanel,
            cancel,
            confirm,
            search,
            query,
            remove,
            closePanel,
            validName,
            flag,
            updateKey,
            activeName,
            selectedKey,
            tabClick,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            STATE,
            removeStore,
            storeRef,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            OPTION_TYPE,
            open,
            docsUrl,
            docsContent,
            onMouseLeaveVariable,
            onMouseLeaveStore
        };
    }
};
</script>

<!-- eslint-disable vue/max-lines-per-block, vue/block-lang, max-lines -->
<style lang="less" scoped>
#data-source {
    height: 100%;
    position: relative;

    .data-source-left-panel {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .add-btn {
            margin: 12px 0;
            padding: 0 8px;
            width: 100%;
            .tiny-button {
                width: 100%;
                border-color: var(--te-state-add-btn-border-color);
                &:hover {
                    border-color: var(--te-state-add-btn-border-color-hover);
                }
            }
            .add-btn-icon {
                margin-right: 4px;
                font-size: 16px;
                color: var(--te-state-add-btn-icon-color);
                vertical-align: sub;
            }
            .add-btn-text {
                display: inline-block;
            }
        }

        .left-filter {
            margin-top: 4px;
            padding: 0 8px;
        }

        & > span {
            display: inline-block;
            padding: 0 10px;
            &,
            .left-btn,
            :deep(.tiny-popover__reference) {
                width: 100%;
            }
        }
        .left-btn {
            max-width: 100%;
            margin-top: 12px;
        }
    }

    .data-source-right-panel {
        width: 492px;
        height: 100%;
        box-shadow: 6px 0px 3px 0px var(--te-state-panel-shadow-color);
        border-right: 1px solid var(--te-state-common-border-color-divider);
        background: var(--te-state-common-bg-color);
        position: absolute;
        top: 0;

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 45px;
            padding: 0 12px;
            font-size: 12px;
            font-weight: 700;
            color: var(--te-state-common-text-color);
            background: var(--te-state-common-bg-color);
            border-bottom: 1px solid var(--te-state-common-border-color-divider);
            .options-wrap {
                display: flex;
                column-gap: 8px;
                align-items: center;
                :deep(button.tiny-button.tiny-button--primary) {
                    display: flex;
                    align-items: center;
                    min-width: 40px;
                    justify-content: center;
                    height: 24px;
                    border-radius: 4px;
                }
            }
        }
    }

    :deep(.tiny-tabs__header) {
        padding: 0 8px 8px 8px;
    }

    :deep(.tiny-tabs__header .tiny-tabs__active-bar) {
        bottom: auto;
        top: 0;
        height: 2px;
        background-color: transparent;
    }

    :deep(.tiny-tabs__header .tiny-tabs__nav-wrap::after) {
        content: none;
    }

    :deep(.tiny-tabs__item) {
        flex: 1 1 auto;
        text-align: center;
    }

    :deep(.tiny-tabs__nav) {
        float: none;
        display: flex;
        flex-wrap: wrap;
    }

    :deep(.tiny-tabs__content) {
        margin: 0;
        padding: 0;
    }
    :deep(.help-box) {
        position: absolute;
        left: 60px;
        top: 10px;
    }
}
</style>
