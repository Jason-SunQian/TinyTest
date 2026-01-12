<!-- eslint-disable vue/multi-word-component-names, vue/max-lines-per-block -->
<template>
    <plugin-panel
        id="source-code"
        :title="t('designer.schema.title')"
        class="plugin-schema"
        fixed-name="engine.plugins.customSchema"
        :fixed-panels="fixedPanels"
        @close="close"
    >
        <template #header>
            <span class="icon-wrap">
                <i v-show="!showRed" class="red" />
                <tiny-button type="primary" @click="saveSchema">{{
                    t('designer.schema.save')
                }}</tiny-button>
            </span>
            <tiny-popover
                v-show="false"
                placement="bottom"
                trigger="hover"
                append-to-body
                :content="t('designer.schema.importSchema')"
            >
                <template #reference>
                    <span class="icon-wrap">
                        <icon-download-link />
                    </span>
                </template>
            </tiny-popover>
        </template>

        <template #content>
            <div class="source-code-content">
                <monaco-editor
                    ref="container"
                    class="code-edit-content"
                    :value="state.pageData"
                    :options="options"
                    @change="editorChange"
                    @shortcut-save="saveSchema"
                />
            </div>
            <div class="source-code-footer">
                <button>{{ t('designer.schema.importSchema') }}</button>
            </div>
        </template>
    </plugin-panel>
</template>

<!-- eslint-disable vue/block-lang, vue/max-lines-per-block -->
<script lang="tsx">
/* metaService: engine.plugins.schema.Main */
import {
    nextTick,
    reactive,
    getCurrentInstance,
    onActivated,
    ref,
    onDeactivated,
    provide
} from 'vue';
import { Popover, Button } from '@opentiny/vue';
import { VueMonaco } from '@opentiny/tiny-engine-common';
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n';
import {
    useCanvas,
    useModal,
    useNotify,
    useMessage,
    useLayout
} from '@opentiny/tiny-engine-meta-register';
import { utils } from '@opentiny/tiny-engine-utils';
import { iconDownloadLink } from '@opentiny/vue-icon';
import { useThrottleFn } from '@vueuse/core';

import PluginPanel from '@/components/i18n-wrappers/PluginPanel/index.vue';

import { useDesignerI18n, t as designerT } from '../../services/i18nService';

const { reactiveObj2String: obj2String, string2Obj } = utils;

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        MonacoEditor: VueMonaco,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyPopover: Popover,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyButton: Button,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PluginPanel,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        IconDownloadLink: iconDownloadLink()
    },
    inheritAttrs: false,
    props: {
        fixedPanels: {
            type: Array,
            default: () => []
        }
    },
    emits: ['close'],
    // eslint-disable-next-line vue/component-api-style
        setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const app = getCurrentInstance();
        const { pageState } = useCanvas();
        const { confirm } = useModal();
        const state = reactive({
            pageData: obj2String(pageState.pageSchema)
        });
        const { subscribe, unsubscribe } = useMessage();

        const { PLUGIN_NAME, changeLeftFixedPanels } = useLayout();

        // 使用实际注册的插件 ID
        const pluginId = 'engine.plugins.customSchema';

        // 直接实现固定面板功能
        const handleFixPanel = () => {
            changeLeftFixedPanels(pluginId);
        };

        // 提供国际化注入
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const inst: any = (window as any).lowcodeI18n;
        if (inst) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            provide(I18nInjectionKey as any, inst);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            provide(I18nInjectionKey as any, { global: { t: designerT } });
        }

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

        const isEdit = false;
        const showRed = ref(true);

        const close = () => {
            const strs = app.refs.container.getEditor().getValue();
            const isChanged = state.pageData === strs;

            if (!isChanged) {
                confirm({
                    title: t('designer.schema.tip'),
                    message: t('designer.schema.unsavedChanges'),
                    exec: () => emit('close')
                });
            } else {
                emit('close');
            }
        };
        const editorChange = val => {
            showRed.value = val === obj2String(state.pageData);
        };

        const saveSchema = () => {
            const editorValue = string2Obj(
                app.refs.container.getEditor().getValue()
            );
            if (!editorValue) {
                // schema 解析不正确，作废此次保存
                useNotify({
                    type: 'error',
                    title: t('designer.schema.saveFailed'),
                    message: t('designer.schema.parseError')
                });

                return;
            }

            // 不允许修改 componentName，因为修改 componentName 等同于修改页面类型
            // 优先从 getSchema() 获取 componentName，如果获取不到则使用 editorValue 中的，最后使用默认值 'Page'
            const { getSchema } = useCanvas();
            const currentSchema = getSchema();
            const originalComponentName =
                currentSchema?.componentName ||
                editorValue?.componentName ||
                'Page';

            const value = {
                ...editorValue,
                componentName: originalComponentName
            };

            const { importSchema, setSaved } = useCanvas();

            importSchema(value);
            setSaved(false);

            // TODO: 历史堆栈
            // useHistory().addHistory()
            state.pageData = '';

            nextTick(() => {
                state.pageData = obj2String(value);
                emit('close');
            });
        };

        const throttleUpdateData = useThrottleFn(
            () => {
                // eslint-disable-next-line no-console
                console.log('[Schema Plugin] throttleUpdateData - pageState.pageSchema:', pageState.pageSchema);
                // 尝试从 useCanvas 的 getSchema 获取
                const { getSchema } = useCanvas();
                const schemaFromGetSchema = getSchema();
                // eslint-disable-next-line no-console
                console.log('[Schema Plugin] throttleUpdateData - getSchema():', schemaFromGetSchema);
                const newPageData = obj2String(pageState.pageSchema || schemaFromGetSchema);
                // eslint-disable-next-line no-console
                console.log('[Schema Plugin] throttleUpdateData - newPageData:', newPageData);
                state.pageData = newPageData || '{}';
            },
            100,
            true
        );

        onActivated(() => {
            // eslint-disable-next-line no-console
            console.log('[Schema Plugin] onActivated - pageState:', pageState);
            // eslint-disable-next-line no-console
            console.log('[Schema Plugin] onActivated - pageState.pageSchema:', pageState.pageSchema);
            // eslint-disable-next-line no-console
            console.log('[Schema Plugin] onActivated - pageState.pageSchema type:', typeof pageState.pageSchema);
            const initialPageData = obj2String(pageState.pageSchema);
            // eslint-disable-next-line no-console
            console.log('[Schema Plugin] onActivated - initialPageData:', initialPageData);
            // eslint-disable-next-line no-console
            console.log('[Schema Plugin] onActivated - initialPageData type:', typeof initialPageData);
            state.pageData = initialPageData || '{}'; // 如果为 null，使用空对象
            
            nextTick(() => {
                window.dispatchEvent(new Event('resize'));
                if (app.refs.container?.getEditor) {
                    showRed.value =
                        state.pageData ===
                        app.refs.container.getEditor().getValue();
                }
            });

            // 监听页面/区块初始化事件
            subscribe({
                topic: 'pageOrBlockInit',
                subscriber: 'schema-plugin',
                callback: (data) => {
                    // eslint-disable-next-line no-console
                    console.log('[Schema Plugin] pageOrBlockInit event received:', data);
                    // eslint-disable-next-line no-console
                    console.log('[Schema Plugin] pageOrBlockInit - event data:', data);
                    // eslint-disable-next-line no-console
                    console.log('[Schema Plugin] pageOrBlockInit - pageState.pageSchema:', pageState.pageSchema);
                    // 尝试直接从事件数据中获取 schema
                    // 事件数据的结构是 { data: schema }，其中 data 字段就是 schema
                    const eventSchema = data?.data || data;
                    // eslint-disable-next-line no-console
                    console.log('[Schema Plugin] pageOrBlockInit - eventSchema:', eventSchema);
                    if (eventSchema && typeof eventSchema === 'object' && !Array.isArray(eventSchema)) {
                        const schemaString = obj2String(eventSchema);
                        // eslint-disable-next-line no-console
                        console.log('[Schema Plugin] pageOrBlockInit - using event schema, schemaString length:', schemaString?.length);
                        if (schemaString && schemaString !== 'null') {
                            state.pageData = schemaString;
                            if (app.refs.container?.getEditor) {
                                nextTick(() => {
                                    showRed.value =
                                        state.pageData ===
                                        app.refs.container.getEditor().getValue();
                                });
                            }
                            return; // 如果成功从事件数据中获取，就不需要再调用 throttleUpdateData
                        }
                    }
                    nextTick(() => {
                        throttleUpdateData();
                    });
                }
            });

            // 监听 schema 变更事件
            subscribe({
                topic: 'schemaChange',
                subscriber: 'schema-plugin',
                callback: (data) => {
                    // eslint-disable-next-line no-console
                    console.log('[Schema Plugin] schemaChange event received:', data);
                    throttleUpdateData();
                }
            });

            // 监听 schema 导入事件
            subscribe({
                topic: 'schemaImport',
                subscriber: 'schema-plugin',
                callback: (eventData) => {
                    // eslint-disable-next-line no-console
                    console.log('[Schema Plugin] schemaImport event received:', eventData);
                    // eslint-disable-next-line no-console
                    console.log('[Schema Plugin] schemaImport - eventData.data:', eventData?.data);
                    // 从 schemaImport 事件中获取 current schema
                    const schemaFromEvent = eventData?.data?.current;
                    if (schemaFromEvent && typeof schemaFromEvent === 'object') {
                        const schemaString = obj2String(schemaFromEvent);
                        // eslint-disable-next-line no-console
                        console.log('[Schema Plugin] schemaImport - using event schema, schemaString:', schemaString?.substring(0, 100));
                        if (schemaString) {
                            state.pageData = schemaString;
                            if (app.refs.container?.getEditor) {
                                nextTick(() => {
                                    showRed.value =
                                        state.pageData ===
                                        app.refs.container.getEditor().getValue();
                                });
                            }
                            return; // 如果成功从事件数据中获取，就不需要再调用 throttleUpdateData
                        }
                    }
                    nextTick(() => {
                        throttleUpdateData();
                    });
                }
            });
        });

        onDeactivated(() => {
            unsubscribe({
                topic: 'pageOrBlockInit',
                subscriber: 'schema-plugin'
            });
            unsubscribe({
                topic: 'schemaChange',
                subscriber: 'schema-plugin'
            });
            unsubscribe({
                topic: 'schemaImport',
                subscriber: 'schema-plugin'
            });
        });

        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            PLUGIN_NAME,
            state,
            isEdit,
            saveSchema,
            editorChange,
            close,
            showRed,
            t,
            options: {
                language: 'json',
                // readOnly: !pageState.isLock,  暂时放开schema录入功能，等画布功能完善后，再打开此注释
                readOnly: false,
                minimap: {
                    enabled: false
                }
            }
        };
    }
};
</script>

<style lang="scss" scoped>
#source-code {
    border-right: none;
    box-shadow: 6px 0px 3px 0px var(--te-schema-panel-shadow-color);
    z-index: 1000;
    width: 600px !important;
    min-width: 600px !important;
    max-width: 600px !important;

    .icon-wrap {
        position: relative;
        margin-right: 6px;

        .tiny-button {
            min-width: 40px;
            margin-right: 2px;
            height: 24px;
            line-height: 24px;
        }

        .red {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: var(--te-schema-dot-color);
            display: block;
            z-index: 100;
            position: absolute;
            top: -3px;
            right: -1px;
        }
    }

    .source-code-content {
        height: calc(100% - 12px);
        border: 1px solid var(--te-schema-common-border-color);
        border-radius: 4px;
        margin: 0 12px;
    }
    .code-edit-content {
        height: 100%;
    }
    .source-code-footer {
        display: none;
        justify-content: flex-end;
        padding: 12px 0;
        button {
            padding: 12px;
            border: none;
            border-radius: 4px;
            color: var(--te-schema-btn-color);
            background: var(--te-schema-btn-bg-color);
            cursor: pointer;
        }
    }
}
</style>
