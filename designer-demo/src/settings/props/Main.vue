<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <plugin-panel
        :title="t('designer.settings.props.title')"
        :fixed-panels="fixedPanels"
        :fixed-name="PLUGIN_NAME.Props"
        :show-bottom-border="showEmptyTips"
        @close="$emit('close')"
    >
        <template #content>
            <config-render 
                v-if="shouldShow"
                :key="renderKey" 
                :data="localProperties"
            >
                <template #prefix="{ data }">
                    <block-link-field v-if="isBlock" :data="data" />
                </template>
            </config-render>
            <block-description v-if="isBlock" class="block-description" />
            <empty :show-empty-tips="showEmptyTips" />
        </template>
    </plugin-panel>
</template>

<!-- eslint-disable vue/block-lang, vue/require-explicit-emits, vue/component-api-style, @typescript-eslint/naming-convention, vue/require-default-prop, vue/require-typed-object-prop -->
<script lang="ts">
/* metaService: engine.setting.props.Main */
import { computed, watchEffect, ref, reactive, provide, watch, nextTick, onActivated, onDeactivated } from 'vue';
import {
    BlockDescription,
    BlockLinkField,
    PluginPanel
} from '@opentiny/tiny-engine-common';
import {
    useCanvas,
    useProperty,
    useLayout,
    useProperties,
    useMessage
} from '@opentiny/tiny-engine-meta-register';

import { ConfigRender } from '@/components/i18n-wrappers';
import { useDesignerI18n } from '@/services/i18nService';

import Empty from './components/Empty.vue';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ConfigRender,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        BlockLinkField,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        BlockDescription,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Empty,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PluginPanel
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
        const { pageState, getCurrentSchema, getNodeWithParentById } = useCanvas();
        const { properties } = useProperty().getProperty({ pageState });
        const { getProps } = useProperties();
        const { subscribe, unsubscribe } = useMessage();
        const showEmptyTips = ref(false);
        const renderKey = ref(0);
        const shouldShow = ref(true);
        
        // 使用本地 ref 存储 properties，确保响应式更新
        const localProperties = ref([]);

        // 同步 pageState.properties 到 localProperties
        const syncProperties = async () => {
            await nextTick();
            
            // 如果 pageState.properties 为空，尝试手动调用 getProps
            const currentSchema = getCurrentSchema();
            if (currentSchema && (!pageState.properties || (Array.isArray(pageState.properties) && pageState.properties.length === 0))) {
                // eslint-disable-next-line no-console
                console.log('[Props Plugin] pageState.properties is empty, calling getProps manually for schema:', currentSchema);
                
                // 获取 parent
                const nodeWithParent = getNodeWithParentById(
                    Array.isArray(currentSchema) ? currentSchema[0]?.id : currentSchema.id
                );
                const parent = nodeWithParent?.parent || null;
                
                // 手动调用 getProps
                getProps(currentSchema, parent);
                
                // 等待一下，让 getProps 完成
                await nextTick();
            }
            
            const newProps = pageState.properties || [];
            
            // eslint-disable-next-line no-console
            console.log('[Props Plugin] syncProperties called, newProps:', newProps, 'length:', newProps?.length);
            
            // 先隐藏组件
            shouldShow.value = false;
            await nextTick();
            
            // 使用 JSON 深拷贝确保引用不同，触发响应式更新
            if (Array.isArray(newProps) && newProps.length > 0) {
                try {
                    localProperties.value = JSON.parse(JSON.stringify(newProps));
                } catch (e) {
                    // 如果 JSON 序列化失败，直接使用原值
                    localProperties.value = [...newProps];
                }
            } else {
                localProperties.value = [];
            }
            renderKey.value = Date.now();
            
            await nextTick();
            
            // 重新显示组件
            shouldShow.value = true;
            
            // eslint-disable-next-line no-console
            console.log('[Props Plugin] Synced properties, renderKey:', renderKey.value, 'localProperties length:', localProperties.value.length);
        };

        // 使用 computed 监听 getCurrentSchema 的变化
        const currentSchemaId = computed(() => {
            const schema = getCurrentSchema();
            if (schema) {
                return Array.isArray(schema) ? schema[0]?.id : schema.id;
            }
            return null;
        });

        // 监听 currentSchemaId 的变化
        watch(
            () => currentSchemaId.value,
            async (newId, oldId) => {
                if (newId !== oldId && newId) {
                    // eslint-disable-next-line no-console
                    console.log('[Props Plugin] currentSchemaId changed:', oldId, '->', newId);
                    
                    // 延迟同步，确保 getProps 已经执行完成
                    await nextTick();
                    await nextTick();
                    await syncProperties();
                    
                    // 再次延迟同步，作为兜底
                    setTimeout(() => {
                        syncProperties();
                    }, 100);
                }
            },
            { immediate: false }
        );

        // 监听 pageState.properties 的变化
        watch(
            () => pageState.properties,
            async (newProps, oldProps) => {
                const newLength = Array.isArray(newProps) ? newProps.length : 0;
                const oldLength = Array.isArray(oldProps) ? oldProps.length : 0;
                
                // eslint-disable-next-line no-console
                console.log('[Props Plugin] pageState.properties changed:', {
                    oldLength,
                    newLength,
                    hasNewProps: !!newProps
                });
                
                if (newLength !== oldLength || newProps !== oldProps) {
                    await syncProperties();
                }
            },
            { deep: true, immediate: false }
        );

        // 使用轮询检查 getCurrentSchema 的变化（作为兜底）
        let pollingTimer: ReturnType<typeof setInterval> | null = null;
        let lastSchemaId: string | null = null;
        
        onActivated(() => {
            lastSchemaId = currentSchemaId.value;
            
            pollingTimer = setInterval(() => {
                const currentId = currentSchemaId.value;
                if (currentId !== lastSchemaId) {
                    // eslint-disable-next-line no-console
                    console.log('[Props Plugin] Polling detected schema change:', lastSchemaId, '->', currentId);
                    lastSchemaId = currentId;
                    syncProperties();
                }
            }, 200);
        });

        onDeactivated(() => {
            if (pollingTimer) {
                clearInterval(pollingTimer);
                pollingTimer = null;
            }
        });

        // 初始化时同步一次
        nextTick(() => {
            syncProperties();
        });

        const { PLUGIN_NAME } = useLayout();

        const panelState = reactive({
            emitEvent: emit
        });
        provide('panelState', panelState);

        const isBlock = computed(() => pageState.isBlock);

        watchEffect(() => {
            showEmptyTips.value = !localProperties.value?.length;
        });

        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            PLUGIN_NAME,
            isBlock,
            properties: localProperties,
            localProperties,
            showEmptyTips,
            renderKey,
            shouldShow,
            t
        };
    }
};
</script>

<!-- eslint-disable-next-line vue/block-lang -->
<style lang="less" scoped>
.block-description {
    margin: 12px;
}
</style>
