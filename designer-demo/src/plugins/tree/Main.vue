<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <plugin-panel
        ref="panelRef"
        tabindex="0"
        :title="t('designer.leftPanel.outlineTree')"
        class="outlinebox plugin-tree"
        fixed-name="engine.plugins.customOutlineTree"
        :fixed-panels="fixedPanels"
        @close="$emit('close')"
    >
        <template #content>
            <draggable-tree
                label-key="componentName"
                :data="state.pageSchema"
                :draggable="true"
                :actives="selectedIds"
                :disallow-drop="disallowDrop"
                class="outline-tree"
                @click="handleClickRow"
                @mouseenter="handleMouseEnterRow"
                @drop="handleDrop"
            >
                <template #content="row">
                    <div class="row-content">
                        <svg-icon
                            v-if="getIconName(row)"
                            :name="getIconName(row)"
                        />
                        <span
                            :class="[
                                'row-label',
                                {
                                    'node-isblock':
                                        row.rawData.componentType === 'Block'
                                }
                            ]"
                            >{{ row.label }}</span>
                        <template v-if="row.id !== 'body'">
                            <svg-icon
                                :name="
                                    eyeOpen(row.id) ? 'eye' : 'eye-invisible'
                                "
                                @mouseup="showNode(row.rawData)"
                            />
                            <svg-icon
                                name="delete"
                                @mouseup="delNode(row.rawData)"
                            />
                        </template>
                    </div>
                </template>
            </draggable-tree>
        </template>
    </plugin-panel>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
/* metaService: engine.plugins.outlinetree.custom.Main */
import {
    reactive,
    watch,
    computed,
    onActivated,
    onDeactivated,
    provide,
    onMounted,
    onBeforeUnmount,
    nextTick,
    ref
} from 'vue';
import { constants } from '@opentiny/tiny-engine-utils';
import {
    useCanvas,
    useMaterial,
    useLayout,
    useMessage,
    useHistory,
    getMergeMeta
} from '@opentiny/tiny-engine-meta-register';
import { extend } from '@opentiny/vue-renderless/common/object';

import PluginPanel from '@/components/i18n-wrappers/PluginPanel/index.vue';

import { useDesignerI18n } from '../../services/i18nService';

import DraggableTree from './DraggableTree.vue';

const { PAGE_STATUS } = constants;
export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PluginPanel,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DraggableTree
    },
    props: {
        fixedPanels: {
            type: Array as () => string[],
            default: () => []
        }
    },
    emits: ['close', 'fix-panel'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const { pageState } = useCanvas();
        const { getMaterial } = useMaterial();
        const { PLUGIN_NAME, changeLeftFixedPanels } = useLayout();

        // 使用实际注册的插件 ID
        const pluginId = 'engine.plugins.customOutlineTree';

        const panelFixed = computed(() =>
            props.fixedPanels?.includes(pluginId)
        );

        const { useMultiSelect, registerHotkeyEvent, removeHotkeyEvent } =
            getMergeMeta('engine.canvas.container').api;

        const selectedIds = computed(() =>
            useMultiSelect().multiSelectedStates.value.map(state => state.id)
        );

        // 直接实现固定面板功能
        const handleFixPanel = () => {
            changeLeftFixedPanels(pluginId);
        };

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

        const filterSchema = data => {
            // 处理空数据情况
            if (!data || (typeof data === 'object' && !data.children)) {
                return [];
            }

            const translateChild = (childData: typeof data) => {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                childData.forEach(item => {
                    item.show = pageState.nodesStatus[item.id] !== false;
                    item.showEye = !item.show;
                    const child = item.children;
                    if (Array.isArray(child)) {
                        translateChild(item.children);
                    }
                });

                return childData;
            };

            const clonedData = extend(true, {}, data);
            const processed = translateChild([clonedData]);

            if (!processed?.[0]) {
                return [];
            }

            return [
                {
                    ...processed[0],
                    componentName: 'body',
                    id: 'body'
                }
            ];
        };
        const state = reactive({
            pageSchema: [],
            isLock: computed(
                () =>
                    ![PAGE_STATUS.Occupy, PAGE_STATUS.Guest].includes(
                        useLayout().layoutState.pageStatus.state
                    )
            )
        });

        const { subscribe, unsubscribe } = useMessage();

        // 更新树数据的方法
        const updateTreeData = () => {
            const { getSchema } = useCanvas();
            const schema = getSchema() || pageState.pageSchema;
            if (schema) {
                state.pageSchema = filterSchema(schema);
            }
        };

        onActivated(() => {
            // 立即更新一次
            updateTreeData();

            // 监听页面/区块初始化事件
            subscribe({
                topic: 'pageOrBlockInit',
                subscriber: 'node-tree',
                callback: () => {
                    // 延迟一下确保 pageState 已更新
                    nextTick(() => {
                        updateTreeData();
                    });
                }
            });

            // 监听 schema 变更事件
            subscribe({
                topic: 'schemaChange',
                subscriber: 'node-tree',
                callback: ({ operation }) => {
                    if (operation?.type !== 'changeProps') {
                        updateTreeData();
                    }
                }
            });

            // 监听 schema 导入事件
            subscribe({
                topic: 'schemaImport',
                subscriber: 'node-tree',
                callback: () => {
                    updateTreeData();
                }
            });
        });

        onDeactivated(() => {
            unsubscribe({
                topic: 'pageOrBlockInit',
                subscriber: 'node-tree'
            });
            unsubscribe({
                topic: 'schemaChange',
                subscriber: 'node-tree'
            });
            unsubscribe({
                topic: 'schemaImport',
                subscriber: 'node-tree'
            });
        });

        watch(
            () => pageState.currentSchema,
            () => {
                updateTreeData();
            }
        );

        const eyeOpen = id => {
            return pageState.nodesStatus[id] !== false;
        };

        const showNode = data => {
            data.show = !data.show;
            pageState.nodesStatus[data.id] = data.show;

            const { getRenderer, clearSelect } = useCanvas().canvasApi.value;

            getRenderer().setCondition(data.id, data.show);
            clearSelect();
        };

        const delNode = data => {
            const { clearSelect } = useCanvas().canvasApi.value;
            useCanvas().operateNode({
                type: 'delete',
                id: data.id
            });
            clearSelect();
            useHistory().addHistory();
        };

        const handleMouseEnterRow = row => {
            const { hoverNode } = useCanvas().canvasApi.value;

            hoverNode(row.id);
        };

        const disallowDrop = ({ dragged, target, position }) => {
            if (dragged.id === 'body') {
                return true;
            }

            const dropTo = position === 'center' ? target : target.parent;

            if (dropTo.id === 'body') {
                return false;
            }

            const { getConfigure, allowInsert } = useCanvas().canvasApi.value;

            return !allowInsert(
                getConfigure(dropTo.rawData.componentName),
                dragged.rawData
            );
        };

        const handleDrop = ({ dragged, target, position }) => {
            if (dragged.id === target.id) {
                return;
            }
            if (
                position === 'center' &&
                target.rawData.children.some(item => item.id === dragged.id)
            ) {
                return;
            }
            if (position !== 'center') {
                const targetParentChildren = target.parent.rawData.children;
                const targetIndex = targetParentChildren.findIndex(
                    item => item.id === target.id
                );
                const node =
                    targetParentChildren[
                        position === 'top' ? targetIndex - 1 : targetIndex + 1
                    ];
                if (dragged.id === node?.id) {
                    return;
                }
            }

            const { insertNode, removeNode, selectNode } =
                useCanvas().canvasApi.value;
            removeNode(dragged.id);
            insertNode(
                {
                    data: dragged.rawData,
                    node: target.rawData,
                    parent: target.parent.rawData
                },
                position === 'center' ? 'in' : position
            );
            nextTick(() => {
                selectNode(dragged.id, 'clickTree');
            });
        };

        const handleClickRow = (event, row) => {
            const isCtrlKey = event.ctrlKey || event.metaKey;
            const { selectNode } = useCanvas().canvasApi.value;
            selectNode(row.id, 'clickTree', isCtrlKey);
        };

        const getIconName = row => {
            const iconName =
                getMaterial(row.rawData.componentName).icon ||
                'plugin-icon-page';
            return iconName.toLowerCase();
        };

        // eslint-disable-next-line vue/require-typed-ref
        const panelRef = ref(null);

        const eventFilter = () => {
            return panelRef.value.$el.contains(document.activeElement);
        };

        onMounted(() => {
            if (panelRef.value) {
                registerHotkeyEvent(document, { eventFilter });
            }
        });

        onBeforeUnmount(() => {
            if (panelRef.value) {
                removeHotkeyEvent(document);
            }
        });

        return {
            t,
            panelFixed,
            selectedIds,
            panelRef,
            eyeOpen,
            delNode,
            showNode,
            state,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            PLUGIN_NAME,
            pageState,
            getIconName,
            handleClickRow,
            handleMouseEnterRow,
            disallowDrop,
            handleDrop
        };
    }
};
</script>

<style lang="scss" scoped>
.outlinebox {
    height: 100%;
    overflow: hidden;
    &:focus {
        outline: none;
    }
}
.outline-tree {
    flex: 1;
    overflow: auto;
    .row-label {
        flex: 1;
        font-size: var(--te-base-font-size-base);
        line-height: 20px;
    }
    svg {
        color: var(--te-common-icon-secondary);
        flex-shrink: 0;
        &:hover {
            color: var(--te-common-icon-hover);
        }
    }
    svg.icon-eye,
    svg.icon-delete {
        visibility: hidden;
    }
    .tree-row:hover {
        svg.icon-eye,
        svg.icon-delete {
            visibility: unset;
        }
    }
    .row-content {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        gap: 4px;
    }
    .node-isblock {
        color: var(--te-tree-block-text-color);
    }
}
</style>
