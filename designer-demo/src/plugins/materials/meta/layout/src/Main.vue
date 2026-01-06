<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <plugin-panel
        :title="shortcut ? '' : title"
        fixed-name="engine.plugins.customMaterials"
        :fixed-panels="fixedPanels"
        @close="$emit('close')"
    >
        <template #content>
            <!-- 暂时隐藏切换标签 -->
            <tiny-tabs
                v-if="false"
                v-model="activeName"
                tab-style="button-card"
                class="full-width-tabs"
            >
                <tiny-tab-item
                    v-for="item in tabComponents"
                    :key="item.id"
                    :title="item.title"
                    :name="item.id"
                >
                    <component
                        :is="item.component"
                        :active-tab-name="activeName"
                        :right-panel-ref="rightPanelRef"
                    />
                </tiny-tab-item>
            </tiny-tabs>
            <!-- 始终显示默认组件（component），不依赖 onlyShowDefault -->
            <component :is="defaultComponent" />
            <div ref="rightPanelRef" class="material-right-panel" />
        </template>
    </plugin-panel>
</template>

<script lang="ts">
/* metaService: engine.plugins.materials.layout.Main */
import { reactive, provide, ref, computed } from 'vue';
import { Tabs, TabItem } from '@opentiny/vue';
import {
    META_APP as PLUGIN_NAME,
    getMergeMeta,
    useLayout
} from '@opentiny/tiny-engine-meta-register';

import PluginPanel from '@/components/i18n-wrappers/PluginPanel/index.vue';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PluginPanel,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTabs: Tabs,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTabItem: TabItem
    },

    props: {
        shortcut: {
            type: [Boolean, String],
            default: false
        },
        fixedPanels: {
            type: Array as () => string[],
            default: () => []
        },
        registryData: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        },
        groupName: {
            type: String,
            default: ''
        }
    },
    emits: ['close', 'fix-panel'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { changeLeftFixedPanels } = useLayout();

        // 使用实际注册的插件 ID
        const pluginId = 'engine.plugins.customMaterials';

        // 直接实现固定面板功能
        const handleFixPanel = () => {
            changeLeftFixedPanels(pluginId);
        };

        const panelState = reactive({
            isShortcutPanel: props.shortcut,
            isBlockGroupPanel: false,
            isBlockList: false,
            materialGroup: props.groupName,
            emitEvent: (eventName: string, ...args: unknown[]) => {
                // 如果是 fixPanel 事件，直接调用 changeLeftFixedPanels
                if (eventName === 'fixPanel' || eventName === 'fix-panel') {
                    handleFixPanel();
                } else {
                    // 其他事件正常 emit
                    emit(eventName as any, ...args);
                }
            }
        });
        // 使用provide传给子组件,后续可能会有调整，先暂定
        provide('panelState', panelState);

        // eslint-disable-next-line vue/require-typed-ref
        const rightPanelRef = ref(null);
        const displayComponentIds =
            props.registryData?.options?.displayComponentIds || [];
        const onlyShowDefault = ref(
            displayComponentIds.length === 1 || props.groupName !== ''
        );

        const activeTabId =
            displayComponentIds.find(
                item => item === props.registryData?.options?.defaultTabId
            ) || displayComponentIds[0];

        const activeName = ref(activeTabId);
        const defaultComponent = computed(() => {
            // 暂时隐藏切换功能，始终显示默认的 component
            const defaultComponentID =
                props.registryData?.options?.defaultTabId;
            // 如果隐藏了切换标签，始终使用默认的 component
            return getMergeMeta(defaultComponentID)?.entry;
        });
        const tabComponents = displayComponentIds.map(id => {
            const itemMeta = getMergeMeta(id);
            return {
                id,
                component: itemMeta?.entry,
                title: itemMeta?.options?.title || itemMeta?.id
            };
        });

        const title = ref(props.registryData?.title);

        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            PLUGIN_NAME,
            title,
            activeName,
            defaultComponent,
            onlyShowDefault,
            tabComponents,
            rightPanelRef
        };
    }
};
</script>

<style lang="scss" scoped>
.tiny-tabs {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
}

:deep(.tiny-tabs__header) {
    padding: 0 12px;
}

:deep(.tiny-tabs__content) {
    flex: 1;
    padding: 0;
    margin: 0px;
    & > div {
        height: 100%;
    }
}

:deep(.tiny-tabs__item:first-child) {
    border-top-left-radius: var(--te-base-border-radius-1);
    border-bottom-left-radius: var(--te-base-border-radius-1);
}

:deep(.tiny-tabs__item:last-child) {
    border-top-right-radius: var(--te-base-border-radius-1);
    border-bottom-right-radius: var(--te-base-border-radius-1);
}

.tiny-collapse {
    flex: 1;
    overflow-y: scroll;
}
</style>
