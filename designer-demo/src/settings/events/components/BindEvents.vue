<!-- eslint-disable vue/max-lines-per-block, max-lines -->
<template>
    <div class="bind-action-list">
        <div class="popover-head">
            <tiny-popover
                popper-class="option-popper setting-advanced-bind-event-list"
                placement="bottom-start"
                trigger="hover"
                class="bind-action-button-item"
                width="256"
                :visible-arrow="false"
            >
                <template #reference>
                    <tiny-button class="bind-event-btn">
                        <span>{{
                            t('designer.settings.events.bind.bindEvent')
                        }}</span>
                        <icon-chevron-down
                            class="icon-chevron-down bind-event-btn-icon"
                        />
                    </tiny-button>
                </template>
                <ul class="bind-event-list">
                    <li
                        v-for="(event, name) in renderEventList"
                        :key="name"
                        :class="[
                            'bind-event-list-item',
                            {
                                'bind-event-list-item-notallow':
                                    state.bindActions[name]
                            }
                        ]"
                        @click="openActionDialog({ eventName: name }, true)"
                    >
                        <div>
                            {{ name }}&nbsp; | &nbsp;{{
                                event?.label?.[localeKey] || name
                            }}
                        </div>
                    </li>
                </ul>
            </tiny-popover>
            <tiny-button
                class="title add-custom-event-button bind-action-button-item"
                @click="handleToggleAddEventDialog(true)"
            >
                <svg-icon name="add" class="custom-event-button-icon" />
                <span class="custom-event-button-text">{{
                    t('designer.settings.events.bind.addEvent')
                }}</span>
            </tiny-button>
        </div>
        <ul v-show="!isEmpty" class="bind-actions">
            <li v-for="action in state.bindActions" :key="action.eventName">
                <div class="action-item bind-action-item">
                    <div class="binding-name" @click="openActionDialog(action)">
                        <div>
                            {{ action.eventName
                            }}<span>{{
                                renderEventList[action.eventName]?.label?.[
                                    localeKey
                                ]
                            }}</span>
                        </div>
                        <div :class="{ linked: action.linked }">
                            {{ action.linkedEventName }}
                        </div>
                        <span class="event-bind">{{ action.ref }}</span>
                    </div>
                    <div class="action-buttons">
                        <block-link-event v-if="isBlock" :data="action" />
                        <svg-button
                            name="plugin-icon-page-schema"
                            :tips="
                                t('designer.settings.events.bind.locateCode')
                            "
                            placement="top"
                            :hover-bg-color="false"
                            @click="openCodePanel(action)"
                        />
                        <svg-button
                            name="setting"
                            :hover-bg-color="false"
                            @click="openActionDialog(action, false)"
                        />
                        <svg-button
                            name="delete"
                            :hover-bg-color="false"
                            @click="delEvent(action)"
                        />
                    </div>
                </div>
            </li>
        </ul>
        <div v-show="isEmpty" class="empty-action">
            <div class="icon">
                <svg-icon name="empty-action" class="empty-action-icon" />
            </div>
            <div class="center">
                {{ t('designer.settings.events.bind.emptyTip') }}
            </div>
        </div>
    </div>
    <bind-events-dialog :event-binding="state.eventBinding" />
    <add-events-dialog
        :visible="state.showBindEventDialog"
        :component-events="renderEventList"
        @close-dialog="handleToggleAddEventDialog(false)"
        @add-event="handleAddEvent"
    />
</template>

<!-- eslint-disable vue/max-lines-per-block, vue/block-lang, @typescript-eslint/naming-convention -->
<script lang="ts">
/* eslint-disable max-lines */
/* metaService: engine.setting.event.BindEvents */
import { computed, reactive, watchEffect, watch, nextTick, toRaw } from 'vue';
import { Popover, Button } from '@opentiny/vue';
import {
    useModal,
    getMergeMeta,
    useCanvas,
    useLayout,
    useBlock,
    useMaterial,
    getMetaApi,
    META_APP,
    useMessage
} from '@opentiny/tiny-engine-meta-register';
import { BlockLinkEvent, SvgButton } from '@opentiny/tiny-engine-common';
import { iconChevronDown } from '@opentiny/vue-icon';

import { useDesignerI18n } from '@/services/i18nService';

import BindEventsDialog, { open as openDialog } from './BindEventsDialog.vue';
import AddEventsDialog from './AddEventsDialog.vue';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        BlockLinkEvent,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        BindEventsDialog,
        TinyPopover: Popover,
        TinyButton: Button,
        IconChevronDown: iconChevronDown(),
        SvgButton,
        AddEventsDialog
    },
    inheritAttrs: false,
    // eslint-disable-next-line vue/component-api-style
    setup() {
        const { PLUGIN_NAME, activePlugin } = useLayout();
        const { pageState, getCurrentSchema, canvasApi } = useCanvas();
        const { getBlockEvents, getCurrentBlock, removeEventLink } = useBlock();
        const { getMaterial } = useMaterial();
        const { confirm } = useModal();
        const { t, locale } = useDesignerI18n();
        const localeKey = computed(() => locale.value || 'zh_CN');
        const { highlightMethod } = getMetaApi(META_APP.Page);
        const { commonEvents = {} } = getMergeMeta(
            'engine.setting.event'
        ).options;

        // 事件名称
        // 事件绑定的处理方法对象
        const state = reactive({
            eventName: '',
            eventBinding: null,
            componentEvent: {},
            customEvents: commonEvents,
            bindActions: {},
            showBindEventDialog: false
        });

        const isBlock = computed(() => Boolean(pageState.isBlock));
        const isEmpty = computed(
            () => Object.keys(state.bindActions).length === 0
        );
        const renderEventList = computed(() => ({
            ...state.componentEvent,
            ...state.customEvents
        }));

        const updateBindActions = () => {
            // 尝试多种方式获取当前选中的组件
            let currentSchema = getCurrentSchema();

            // 如果 getCurrentSchema 返回空，尝试从 pageState 获取
            if (
                !currentSchema ||
                (Array.isArray(currentSchema) && currentSchema.length === 0)
            ) {
                currentSchema = pageState?.currentSchema;
            }

            // 如果还是为空，尝试从 canvasApi 获取
            if (!currentSchema && canvasApi?.value) {
                try {
                    const current = canvasApi.value.getCurrent?.();
                    if (current?.schema) {
                        currentSchema = current.schema;
                    }
                } catch (error) {
                    // 静默处理错误
                }
            }

            // 处理数组情况（多选）
            if (Array.isArray(currentSchema) && currentSchema.length > 0) {
                // eslint-disable-next-line @typescript-eslint/prefer-destructuring
                currentSchema = currentSchema[0];
            }

            if (!currentSchema) {
                state.bindActions = {};
                return;
            }

            const componentName = currentSchema?.componentName;
            const componentSchema = getMaterial(componentName);

            state.componentEvent =
                componentSchema?.content?.schema?.events ||
                componentSchema?.schema?.events ||
                {};

            const props = currentSchema?.props || {};
            const keys = Object.keys(props);
            state.bindActions = {};

            // 与官方语义保持一致：仅展示“事件元数据中已定义且在 props 中已绑定”的项
            Object.entries(renderEventList.value).forEach(
                ([eventName, componentEvent]) => {
                    if (!keys.includes(eventName)) {
                        return;
                    }

                    const event = props[eventName];
                    if (!event || typeof event !== 'object') {
                        return;
                    }
                    const { value, params } = event;
                    const eventArgs =
                        (typeof value === 'string' &&
                            !params &&
                            value.match(/\((.+)\)$/)?.[1]?.split(',')) ||
                        params;
                    const action = {
                        eventName,
                        ref: '',
                        event: props[eventName],
                        params: eventArgs
                    };

                    if (
                        action.event.type === 'JSExpression' &&
                        typeof action.event.value === 'string'
                    ) {
                        action.ref = action.event.value
                            .replace('this.', '')
                            .replace(/\(.*\)$/, '');
                    }

                    if (pageState.isBlock) {
                        // 区块编辑态时设置选中组件的事件元数据
                        action.metaEvent = componentEvent;

                        const blockEvents = getBlockEvents(getCurrentBlock());
                        const componentId = currentSchema?.id;

                        if (componentId && blockEvents) {
                            Object.entries(blockEvents).forEach(
                                ([name, blockEvent]) => {
                                    if (
                                        componentId ===
                                            blockEvent?.linked?.id &&
                                        eventName === blockEvent?.linked?.event
                                    ) {
                                        action.linked = blockEvent.linked;
                                        action.linkedEventName = name;
                                    }
                                }
                            );
                        }
                    }

                    state.bindActions[eventName] = action;
                }
            );
        };

        // 使用 computed 监听 getCurrentSchema 的变化，类似 Props 面板的做法
        const currentSchemaId = computed(() => {
            const schema = getCurrentSchema();
            if (schema) {
                return Array.isArray(schema) ? schema[0]?.id : schema.id;
            }
            // 如果 getCurrentSchema 返回空，尝试从 pageState 获取
            const pageStateSchema = pageState?.currentSchema;
            if (pageStateSchema) {
                return Array.isArray(pageStateSchema)
                    ? pageStateSchema[0]?.id
                    : pageStateSchema.id;
            }
            // 如果还是为空，尝试从 canvasApi 获取
            if (canvasApi?.value) {
                try {
                    const current = canvasApi.value.getCurrent?.();
                    if (current?.schema) {
                        return current.schema.id;
                    }
                } catch (error) {
                    // 静默处理错误
                }
            }
            return null;
        });

        // 监听 currentSchemaId 的变化，确保组件选择时能正确更新
        watch(
            () => currentSchemaId.value,
            async (newId, oldId) => {
                if (newId !== oldId) {
                    await nextTick();
                    updateBindActions();
                }
            },
            { immediate: true }
        );

        // 使用 watchEffect 监听 currentSchema 和 props 的变化
        watchEffect(() => {
            updateBindActions();
        });

        // 额外使用 watch 深度监听 props 的变化，确保 props 内部属性的变化也能触发更新
        watch(
            () => {
                const schema = getCurrentSchema();
                return Array.isArray(schema) ? schema[0]?.props : schema?.props;
            },
            () => {
                updateBindActions();
            },
            { deep: true, immediate: false }
        );

        // 监听 schemaChange 事件，手动触发更新
        const { subscribe } = useMessage();
        subscribe({
            topic: 'schemaChange',
            subscriber: 'BindEvents',
            callback: () => {
                nextTick(() => {
                    updateBindActions();
                });
            }
        });

        const openActionDialog = async (action, isAdd) => {
            if (isAdd && state.bindActions[action.eventName]) {
                return;
            }

            // 打开对话框前，强制刷新当前选中的组件状态，确保获取到最新的选中状态
            if (canvasApi?.value) {
                try {
                    const current = canvasApi.value.getCurrent?.();
                    if (current?.schema) {
                        const { setCurrentSchema } = useCanvas();
                        const rawSchema = toRaw(current.schema);
                        pageState.currentSchema = rawSchema;
                        if (setCurrentSchema) {
                            setCurrentSchema(rawSchema);
                        }
                        await nextTick();
                    }
                } catch (error) {
                    // 静默处理错误，不影响对话框打开
                }
            }

            state.eventBinding = action;

            openDialog();
        };

        const deleteAction = action => {
            // 获取当前选中的组件
            let currentSchema = getCurrentSchema();
            if (Array.isArray(currentSchema) && currentSchema.length > 0) {
                // eslint-disable-next-line @typescript-eslint/prefer-destructuring
                currentSchema = currentSchema[0];
            }
            if (!currentSchema) {
                currentSchema = pageState?.currentSchema;
            }
            if (!currentSchema && canvasApi?.value) {
                try {
                    const current = canvasApi.value.getCurrent?.();
                    if (current?.schema) {
                        currentSchema = current.schema;
                    }
                } catch (error) {
                    // 静默处理错误
                }
            }

            if (!currentSchema) {
                return;
            }

            const keys = Object.keys(currentSchema?.props || {});

            if (keys.includes(action.eventName)) {
                if (!currentSchema.props) {
                    currentSchema.props = {};
                }
                delete currentSchema.props[action.eventName];

                useMessage().publish({
                    topic: 'schemaChange',
                    data: { props: currentSchema.props }
                });
            }
        };

        const delEvent = action => {
            confirm({
                title: t('designer.settings.events.bind.confirmTitle'),
                message: t('designer.settings.events.bind.deleteConfirm', {
                    name: action.eventName
                }),
                exec() {
                    if (pageState.isBlock) {
                        removeEventLink({ linked: action.linked });
                    }

                    deleteAction(action);
                }
            });
        };

        const openCodePanel = action => {
            if (action) {
                activePlugin(PLUGIN_NAME.Page).then(() => {
                    if (highlightMethod) {
                        highlightMethod(action.ref);
                    }
                });
            }
        };

        const handleToggleAddEventDialog = visible => {
            state.showBindEventDialog = visible;
        };

        const handleAddEvent = params => {
            const { eventName, eventDescription } = params;

            Object.assign(state.customEvents, {
                [eventName]: {
                    label: {
                        // eslint-disable-next-line camelcase
                        zh_CN: eventDescription,
                        // eslint-disable-next-line camelcase
                        en_US: eventDescription
                    },
                    description: {
                        // eslint-disable-next-line camelcase
                        zh_CN: t(
                            'designer.settings.events.bind.customEventDescription',
                            { name: eventDescription }
                        ),
                        // eslint-disable-next-line camelcase
                        en_US: t(
                            'designer.settings.events.bind.customEventDescription',
                            { name: eventDescription }
                        )
                    },
                    type: 'event',
                    functionInfo: {
                        params: [],
                        returns: {}
                    },
                    defaultValue: ''
                }
            });

            state.showBindEventDialog = false;
        };

        return {
            state,
            isBlock,
            isEmpty,
            delEvent,
            openCodePanel,
            openActionDialog,
            handleAddEvent,
            handleToggleAddEventDialog,
            renderEventList,
            localeKey,
            t
        };
    }
};
</script>

<!-- eslint-disable-next-line vue/block-lang, vue/max-lines-per-block -->
<style lang="less" scoped>
.custom-event {
    padding: 10px 20px 10px 10px;
    footer {
        text-align: center;
    }
}
.bind-action-list {
    .bind-actions {
        margin-top: 20px;
        .binding-name {
            word-break: break-all;
        }
        .action-buttons {
            display: flex;
            align-items: center;
            justify-content: center;
            .item {
                margin-right: 10px;
            }
        }
        .event-bind {
            color: var(--te-events-event-bind-text-color);
        }
        .bind-action-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 12px;
            cursor: pointer;
            color: var(--te-events-bind-action-item-text-color);
            border-bottom: 1px solid
                var(--te-events-bind-action-item-border-color);
            &:first-child {
                border-top: 1px solid
                    var(--te-events-bind-action-item-border-color);
            }
            &:hover {
                background: var(--te-events-bind-action-item-bg-color-hover);
            }

            .linked {
                color: var(--te-events-bind-action-item-text-color-link);
            }
        }
    }
    .popover-head {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
        .bind-action-button-item {
            width: 50%;
            &:not(:last-child) {
                margin-right: 12px;
            }
        }
        .add-custom-event-button {
            margin-right: 0;
        }
        .bind-event-btn {
            padding: 0 16px;
            width: 100%;
            .bind-event-btn-icon {
                margin-right: 0;
                margin-left: 4px;
            }
        }
    }
    .empty-action {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--te-events-empty-action-bg-color);
        color: var(--te-events-empty-action-text-color);
        padding: 24px 18px;
        margin-top: var(--te-common-vertical-item-spacing-normal);
        .empty-action-icon {
            font-size: 48px;
        }
        .icon {
            text-align: center;
            opacity: 0.4;
        }
        .center {
            margin-top: 4px;
        }
        .text {
            margin-top: 12px;
        }
    }
}
.bind-event-list {
    color: var(--te-events-bind-event-list-text-color);
}
.bind-event-list-item-notallow {
    cursor: not-allowed;
    pointer-events: none;
    color: var(--te-events-bind-event-list-item-text-color-disabled);
}
.bind-event-list-item {
    padding: 0 16px;
    margin: 0 -16px;
    line-height: 24px;
    &:hover {
        cursor: pointer;
        background: var(--te-events-bind-event-list-item-bg-color-hover);
    }
}
</style>
