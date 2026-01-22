<!-- eslint-disable vue/max-lines-per-block -->
<!-- eslint-disable max-lines -->
<template>
    <tiny-dialog-box
        :visible="dialogVisible"
        :title="t('designer.settings.events.dialog.title')"
        width="50%"
        dialog-class="bind-event-dialog"
        draggable
        :append-to-body="true"
        @close="closeDialog"
        @opened="openedDialog"
    >
        <div class="bind-event-dialog-tip">
            <tiny-alert
                type="info"
                :description="t('designer.settings.events.dialog.description')"
                class="header-alert"
                :closable="false"
            />
        </div>
        <div class="bind-event-dialog-content">
            <component
                :is="BindEventsDialogSidebar"
                :dialog-visible="dialogVisible"
                :event-binding="eventBinding"
            />
            <component
                :is="BindEventsDialogContent"
                :dialog-visible="dialogVisible"
            />
        </div>
        <template #footer>
            <div class="bind-dialog-footer">
                <tiny-button @click="closeDialog">{{
                    t('designer.settings.events.dialog.cancel')
                }}</tiny-button>
                <tiny-button type="info" @click="confirm">{{
                    t('designer.settings.events.dialog.confirm')
                }}</tiny-button>
            </div>
        </template>
    </tiny-dialog-box>
</template>

<!-- eslint-disable vue/max-lines-per-block, vue/block-lang, vue/component-api-style, @typescript-eslint/naming-convention, @typescript-eslint/max-params, vue/require-typed-object-prop -->
<script lang="ts">
/* metaService: engine.setting.event.BindEventsDialog */
import { string2Ast } from '@opentiny/tiny-engine-common/js/ast';
import {
    getMergeMeta,
    useCanvas,
    useHistory,
    useLayout,
    getOptions,
    getMetaApi,
    META_APP,
    useNotify,
    useMessage
} from '@opentiny/tiny-engine-meta-register';
import { Button, DialogBox, TinyAlert } from '@opentiny/vue';
import { nextTick, provide, reactive, ref, toRaw } from 'vue';
import MagicString from 'magic-string';

import { useDesignerI18n } from '@/services/i18nService';

const META_ID = 'engine.setting.event';

const dialogVisible = ref(false);

export const open = () => {
    dialogVisible.value = true;
};

export const close = () => {
    dialogVisible.value = false;
};

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyButton: Button,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyDialogBox: DialogBox,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyAlert
    },
    inheritAttrs: false,
    props: {
        // eslint-disable-next-line vue/require-typed-object-prop
        eventBinding: {
            type: Object,
            default: () => ({})
        }
    },
    // eslint-disable-next-line vue/component-api-style
    setup(props) {
        const {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            BindEventsDialogSidebar,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            BindEventsDialogContent
        } = getMergeMeta(META_ID).components;
        const { t } = useDesignerI18n();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { PLUGIN_NAME, activePlugin } = useLayout();
        const { pageState, canvasApi, setCurrentSchema, getCurrentSchema } = useCanvas();
        const { getMethods, saveMethod } = getMetaApi(META_APP.Page);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { highlightMethod } = getMetaApi(META_APP.Page);
        const { publish } = useMessage();

        const state = reactive({
            editorContent: '',
            bindMethodInfo: {},
            tip: '',
            tipError: false,
            enableExtraParams: false,
            isValidParams: true
        });

        provide('context', state);

        const selectMethod = data => {
            state.bindMethodInfo = data;
        };

        const bindMethod = async data => {
            if (!data) {
                return;
            }

            const eventName = props.eventBinding?.eventName;
            if (!eventName) {
                return;
            }

            // 优先从 canvasApi 获取最新的选中状态，确保获取到的是当前实际选中的组件
            let currentSchema = null;

            // 首先尝试从 canvasApi 获取最新的选中状态
            if (canvasApi?.value) {
                try {
                    const current = canvasApi.value.getCurrent?.();
                    if (current?.schema) {
                        currentSchema = current.schema;
                    }
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.warn(
                        '[BindEventsDialog] Error getting current from canvasApi:',
                        error
                    );
                }
            }

            // 如果 canvasApi 获取失败，再尝试从 pageState 获取（作为后备）
            if (!currentSchema) {
                currentSchema = pageState?.currentSchema;
            }

            // 如果仍然没有，尝试使用 getCurrentSchema 方法
            if (!currentSchema && getCurrentSchema) {
                currentSchema = getCurrentSchema();
            }

            const nodeProps = currentSchema?.props;
            if (!nodeProps) {
                useNotify()({
                    type: 'error',
                    title: '绑定失败',
                    message:
                        '无法获取当前选中的组件，请先选中一个组件后再绑定事件'
                });
                return;
            }

            const { name, extra } = data;

            if (!nodeProps[eventName]) {
                nodeProps[eventName] = {
                    type: 'JSExpression',
                    value: ''
                };
            }

            if (extra && state.enableExtraParams) {
                nodeProps[eventName].params = extra;
            }

            nodeProps[eventName].value = `this.${name}`;

            // 先添加历史记录
            useHistory().addHistory();

            // 然后直接更新 pageState.currentSchema，确保事件面板能检测到变化
            if (currentSchema) {
                const rawSchema = toRaw(currentSchema);
                pageState.currentSchema = rawSchema;
                if (setCurrentSchema) {
                    setCurrentSchema(rawSchema);
                }
                await nextTick();
            }

            // 触发 schemaChange 事件，通知其他组件更新
            if (publish && currentSchema) {
                publish({
                    topic: 'schemaChange',
                    data: { props: currentSchema.props }
                });
            }
        };

        const resetTipError = () => {
            state.tipError = false;
            state.tip = '';
            state.isValidParams = true;
        };

        const getExtraParams = () => {
            let extraParams = '';
            if (state.enableExtraParams) {
                try {
                    extraParams = JSON.parse(state.editorContent);
                    state.isValidParams = Array.isArray(extraParams);
                    // eslint-disable-next-line no-console
                    console.log(
                        '[BindEventsDialog] getExtraParams parsed:',
                        extraParams,
                        'isValidParams:',
                        state.isValidParams
                    );
                } catch (error) {
                    state.isValidParams = false;
                    // eslint-disable-next-line no-console
                    console.error(
                        '[BindEventsDialog] getExtraParams parse error:',
                        error
                    );
                }
            } else {
                // eslint-disable-next-line no-console
                console.log(
                    '[BindEventsDialog] getExtraParams: enableExtraParams is false, returning empty string'
                );
            }
            return extraParams;
        };

        // 原插件实现：直接访问 extraParams.length，假设 extraParams 是数组
        const getFormatParams = extraParams => {
            // 原插件没有检查，直接使用。但为了安全，我们添加检查
            if (!extraParams || !Array.isArray(extraParams)) {
                return 'event';
            }
            return Array.from(
                { length: extraParams.length },
                (v, i) => `args${i}`
            ).join(',');
        };

        // eslint-disable-next-line @typescript-eslint/max-params
        const rewriteMethodParams = (
            method,
            name,
            formatParams,
            extraParams,
            enableExtraParams
        ) => {
            // 原插件实现：直接访问 extraParams.length
            // 如果 extraParams 是空字符串，extraParams.length 是 0（字符串长度）
            // 如果 extraParams 是数组，extraParams.length 是数组长度
            // 如果 extraParams 是 undefined/null，需要处理
            const extraParamsLength = extraParams
                ? Array.isArray(extraParams)
                    ? extraParams.length
                    : 0
                : 0;
            const finalParams =
                enableExtraParams && extraParamsLength
                    ? `event,${formatParams}`
                    : formatParams;
            const defaultMethod = `function ${name} (${finalParams}) {\n}\n`;

            // 没有现存方法，直接拼接一个新的
            if (!method) {
                return defaultMethod;
            }

            try {
                const magicStr = new MagicString(method);
                const astStr = string2Ast(method);

                // 解析出来不是函数声明，直接返回默认拼接的函数
                const [firstNode] = astStr?.program?.body || [];
                if (!firstNode || firstNode.type !== 'FunctionDeclaration') {
                    return defaultMethod;
                }

                const functionNode = firstNode;

                // 参数数量一致，不需要改写参数，直接返回
                // extraParams.length 是传入的参数数量，+1 是 event 参数
                const currentParamsLength = functionNode.params?.length || 0;
                if (currentParamsLength === extraParamsLength + 1) {
                    return method;
                }

                // 参数数量不一致，需要改写参数
                if (!functionNode.id || !functionNode.body) {
                    return defaultMethod;
                }

                const start = functionNode.id.end;
                const end = functionNode.body.start;

                if (typeof start !== 'number' || typeof end !== 'number') {
                    return defaultMethod;
                }

                magicStr.remove(start, end);
                magicStr.appendLeft(start, `(${finalParams})`);
                return magicStr.toString();
            } catch (e) {
                // 尝试改写失败了，直接返回拼接的
                return defaultMethod;
            }
        };

        const activePagePlugin = () => {
            // eslint-disable-next-line no-console
            console.log('[BindEventsDialog] activePagePlugin called');
            // 直接跳过 highlightMethod，避免错误
            // highlightMethod 只是用于高亮显示，不影响事件绑定功能
            return;

            // 以下代码暂时注释，等 highlightMethod 问题解决后再启用
            /*
            activePlugin(PLUGIN_NAME.Page).then(() => {
                console.log('[BindEventsDialog] activePlugin resolved');
                // 确认js面板渲染完成之后再对目标函数进行高亮处理
                nextTick(() => {
                    console.log('[BindEventsDialog] nextTick callback, highlightMethod:', highlightMethod, 'name:', state.bindMethodInfo?.name);
                    if (highlightMethod && state.bindMethodInfo?.name) {
                        try {
                            console.log('[BindEventsDialog] Calling highlightMethod with name:', state.bindMethodInfo.name);
                            highlightMethod(state.bindMethodInfo.name);
                            console.log('[BindEventsDialog] highlightMethod completed successfully');
                        } catch (error) {
                            console.error('[BindEventsDialog] Error in highlightMethod:', error);
                            console.error('[BindEventsDialog] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
                            // highlightMethod 失败不影响事件绑定，只记录警告
                        }
                    } else {
                        console.warn('[BindEventsDialog] highlightMethod or name not available:', { highlightMethod, name: state.bindMethodInfo?.name });
                    }
                });
            }).catch((error) => {
                console.error('[BindEventsDialog] Error in activePagePlugin:', error);
                console.error('[BindEventsDialog] activePagePlugin error stack:', error instanceof Error ? error.stack : 'No stack trace');
                // activePlugin 失败不影响事件绑定，只记录警告
            });
            */
        };

        const confirm = async () => {
            if (state.tipError) {
                return;
            }

            let params = 'event';
            const extraParams = getExtraParams();

            let formatParams = params;

            if (!state.isValidParams) {
                // eslint-disable-next-line no-console
                console.warn('[BindEventsDialog] Invalid params, returning');
                return;
            }

            // 原插件逻辑：如果 extraParams 存在（truthy），就处理
            // 原插件直接调用 extraParams.join(',') 和 getFormatParams(extraParams)
            // 但需要确保 extraParams 是数组，否则 join 会报错
            if (extraParams && Array.isArray(extraParams)) {
                params = extraParams.join(',');
                formatParams = getFormatParams(extraParams);
            }

            // 检查 bindMethodInfo 是否有 name
            if (!state.bindMethodInfo?.name) {
                // eslint-disable-next-line no-console
                console.error(
                    '[BindEventsDialog] bindMethodInfo or name is missing:',
                    state.bindMethodInfo
                );
                return;
            }

            await bindMethod({
                ...state.bindMethodInfo,
                params,
                extra: extraParams
            });

            // 等待 bindMethod 完成后，确保 currentSchema 被设置
            await nextTick();
            const canvasApiCurrent = canvasApi?.value?.getCurrent?.();
            if (canvasApiCurrent?.schema) {
                const rawSchema = toRaw(canvasApiCurrent.schema);
                pageState.currentSchema = rawSchema;
                if (setCurrentSchema) {
                    setCurrentSchema(rawSchema);
                }
                await nextTick();
            }

            // 需要在bindMethod之后
            const { name } = state.bindMethodInfo;
            const methodValue =
                getMethods()?.[state.bindMethodInfo.name]?.value;

            const functionStr = rewriteMethodParams(
                methodValue,
                name,
                formatParams,
                extraParams,
                state.enableExtraParams
            );

            const method = {
                name,
                content: functionStr
            };

            // beforeSaveMethod 是可选的，如果不存在就跳过
            try {
                const options = getOptions(META_ID);
                // eslint-disable-next-line no-console
                console.log('[BindEventsDialog] getOptions result:', options);

                const { beforeSaveMethod } = options || {};

                if (typeof beforeSaveMethod === 'function') {
                    // eslint-disable-next-line no-console
                    console.log('[BindEventsDialog] calling beforeSaveMethod');
                    await beforeSaveMethod(method, state.bindMethodInfo);
                } else {
                    // eslint-disable-next-line no-console
                    console.log(
                        '[BindEventsDialog] beforeSaveMethod is not a function or not defined, skipping'
                    );
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(
                    '[BindEventsDialog] Error in beforeSaveMethod:',
                    error
                );
                // 即使 beforeSaveMethod 出错，也继续执行保存
            }

            // eslint-disable-next-line no-console
            console.log('[BindEventsDialog] calling saveMethod with:', method);
            if (!saveMethod) {
                // eslint-disable-next-line no-console
                console.error(
                    '[BindEventsDialog] saveMethod is not available from getMetaApi(META_APP.Page)'
                );
                useNotify()({
                    type: 'error',
                    title: '保存失败',
                    message: '保存方法不可用，请检查 Page 插件是否正确加载'
                });
                return;
            }

            // 确保 method 对象有 name 和 content
            if (!method?.name || !method?.content) {
                // eslint-disable-next-line no-console
                console.error(
                    '[BindEventsDialog] Invalid method object:',
                    method
                );
                useNotify()({
                    type: 'error',
                    title: '保存失败',
                    message: '方法信息不完整，无法保存'
                });
                return;
            }

            try {
                // eslint-disable-next-line no-console
                console.log(
                    '[BindEventsDialog] Calling saveMethod with validated method:',
                    { name: method.name, contentLength: method.content?.length }
                );
                saveMethod(method);
                // eslint-disable-next-line no-console
                console.log(
                    '[BindEventsDialog] saveMethod completed successfully'
                );
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('[BindEventsDialog] Error in saveMethod:', error);
                // eslint-disable-next-line no-console
                console.error(
                    '[BindEventsDialog] Error stack:',
                    error instanceof Error ? error.stack : 'No stack trace'
                );
                useNotify()({
                    type: 'error',
                    title: '保存失败',
                    message:
                        error instanceof Error
                            ? error.message
                            : '保存方法执行失败'
                });
                // 不抛出错误，让用户知道保存失败即可
            }

            activePagePlugin();
            close();
        };

        const openedDialog = async () => {
            // 对话框打开时，强制刷新当前选中的组件状态，确保获取到最新的选中状态
            if (canvasApi?.value) {
                try {
                    const current = canvasApi.value.getCurrent?.();
                    if (current?.schema) {
                        const rawSchema = toRaw(current.schema);
                        pageState.currentSchema = rawSchema;
                        if (setCurrentSchema) {
                            setCurrentSchema(rawSchema);
                        }
                        await nextTick();
                    }
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.warn(
                        '[BindEventsDialog] Error refreshing current schema on dialog open:',
                        error
                    );
                }
            }

            state.enableExtraParams = Boolean(
                props.eventBinding?.params?.length
            );
            state.editorContent = JSON.stringify(
                props.eventBinding?.params || [],
                null,
                2
            );
            resetTipError();
        };

        const closeDialog = () => {
            resetTipError();
            close();
        };

        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            BindEventsDialogSidebar,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            BindEventsDialogContent,
            state,
            dialogVisible,
            confirm,
            closeDialog,
            openedDialog,
            selectMethod,
            t
        };
    }
};
</script>

<!-- eslint-disable-next-line vue/block-lang -->
<style lang="less" scoped>
.bind-event-dialog {
    z-index: 99;
    :deep(.tiny-dialog-box) {
        min-width: 760px;
    }
}

.bind-event-dialog-tip {
    .tiny-alert.tiny-alert--normal {
        margin: 12px 0;
    }
}

.bind-event-dialog-content {
    display: flex;
    min-width: 700px;
}
</style>
