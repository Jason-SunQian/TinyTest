/* eslint-disable max-lines, vue/max-lines-per-block */
<!-- eslint-disable vue/block-lang, vue/component-api-style, @typescript-eslint/naming-convention, vue/require-explicit-emits -->
<template>
    <div
        v-show="menuState.show"
        ref="menuDom"
        class="context-menu"
        :style="menuState.position"
    >
        <ul class="menu-item">
            <li
                v-for="(item, index) in filteredMenus"
                :key="index"
                :class="{
                    'li-item': item.items,
                    'li-item-disabled': actionDisabled(item)
                }"
                @click="doOperation(item)"
                @mouseover="onShowChildrenMenu(item)"
            >
                <div>
                    <span>{{ item.name }}</span>
                    <span v-if="item.items"><icon-right /></span>
                </div>
                <ul
                    v-if="item.items && currentItemKey === getItemKey(item)"
                    class="sub-menu menu-item"
                    :style="subMenuStyles"
                >
                    <template
                        v-for="(subItem, subIndex) in item.items"
                        :key="subIndex"
                    >
                        <li
                            :class="[
                                {
                                    'menu-item-disabled':
                                        subItem.check && !subItem.check?.()
                                }
                            ]"
                            @click.stop="doOperation(subItem)"
                        >
                            {{ subItem.name }}
                        </li>
                    </template>
                </ul>
            </li>
        </ul>
        <component
            :is="SaveNewBlock"
            :box-visibility="boxVisibility"
            :from-canvas="true"
            @close="close"
        />
    </div>
</template>

<script lang="ts">
/* eslint-disable import/order */
import { ref, reactive, nextTick, computed } from 'vue';
import {
    canvasState,
    getConfigure,
    getController,
    getCurrent,
    copyNode,
    removeNodeById
} from '../container';
import {
    useLayout,
    useModal,
    useCanvas,
    usePage,
    getMergeMeta
} from '@opentiny/tiny-engine-meta-register';
import { iconRight } from '@opentiny/vue-icon';
import { useMultiSelect } from '../composables/useMultiSelect';
import { useDesignerI18n } from '@/services/i18nService';

const menuState = reactive({
    position: null,
    show: false,
    menus: []
});

const current = ref(null);
const menuDom = ref(null);
const subMenuStyles = ref(null);

// 子菜单宽度常量
const SUB_MENU_WIDTH = 137;

// 需要在组件外部也能访问到 currentItemKey，所以将其提升到模块作用域
let currentItemKeyRef = null;

export const closeMenu = () => {
    menuState.show = false;
    current.value = null;
    if (currentItemKeyRef) {
        currentItemKeyRef.value = null;
    }
};

export const openMenu = event => {
    menuState.position = {
        left: event.clientX + 2 + 'px',
        top: event.clientY + 'px'
    };
    menuState.show = sessionStorage.getItem('pageInfo') ? true : false;

    nextTick(() => {
        if (menuDom.value) {
            const { right, bottom, width, height } =
                menuDom.value.getBoundingClientRect();
            const canvasRect = canvasState.iframe.getBoundingClientRect();
            if (bottom > canvasRect.bottom) {
                menuState.position.top = `${
                    parseInt(menuState.position.top) - height
                }px`;
            }
            if (right > canvasRect.right) {
                menuState.position.left = `${
                    parseInt(menuState.position.left) - width - 2
                }px`;
            }
            // sub-menu样式width为 137 px，少于 137 宽度的空白区域则放置到左侧
            if (right + SUB_MENU_WIDTH < canvasRect.right) {
                subMenuStyles.value = {
                    right: `-${SUB_MENU_WIDTH}px`,
                    width: `${SUB_MENU_WIDTH}px`
                };
            } else {
                subMenuStyles.value = {
                    left: `-${SUB_MENU_WIDTH}px`,
                    width: `${SUB_MENU_WIDTH}px`
                };
            }
        }
    });
};

export default {
    components: {
         
        IconRight: iconRight()
    },
    emits: ['insert'],
    setup(props, { emit }) {
        const {
            multiSelectedStates,
            areSiblingNodes,
            batchAddParent,
            groupAddParent
        } = useMultiSelect();
        const { t } = useDesignerI18n();

        const menus = computed(() => [
            { name: t('designer.canvas.modifyProperties'), code: 'config' },
            {
                name: t('designer.canvas.insert'),
                items: [
                    {
                        name: t('designer.canvas.insertBefore'),
                        code: 'insert',
                        value: 'top'
                    },
                    {
                        name: t('designer.canvas.insertMiddle'),
                        code: 'insert',
                        value: 'in',
                        check() {
                            const { componentName } =
                                getCurrent()?.schema || {};
                            return getConfigure(componentName)?.isContainer;
                        }
                    },
                    {
                        name: t('designer.canvas.insertAfter'),
                        code: 'insert',
                        value: 'bottom'
                    }
                ]
            },
            {
                name: t('designer.canvas.addParent'),
                items: [
                    {
                        name: t('designer.canvas.tooltip'),
                        code: 'wrap',
                        value: 'TinyTooltip'
                    },
                    {
                        name: t('designer.canvas.popover'),
                        code: 'wrap',
                        value: 'TinyPopover'
                    },
                    {
                        name: t('designer.canvas.container'),
                        code: 'insert',
                        value: 'out'
                    }
                ],
                code: 'addParent'
            },
            { name: t('designer.canvas.delete'), code: 'del' },
            { name: t('designer.canvas.copy'), code: 'copy' },
            { name: t('designer.canvas.bindEvent'), code: 'bindEvent' }
        ]);

        // 多选菜单
        const multiSelectMenus = computed(() => [
            { name: t('designer.canvas.delete'), code: 'multiDel' },
            { name: t('designer.canvas.copy'), code: 'multiCopy' },
            {
                name: t('designer.canvas.addParent'),
                items: [
                    {
                        name: t('designer.canvas.batchContainer'),
                        code: 'batchWrap',
                        value: 'div'
                    },
                    {
                        name: t('designer.canvas.sharedParentContainer'),
                        code: 'groupWrap',
                        value: 'div',
                        check: () => areSiblingNodes()
                    },
                    {
                        name: t('designer.canvas.sharedParentPopover'),
                        code: 'groupWrap',
                        value: 'TinyPopover',
                        check: () => areSiblingNodes()
                    }
                ],
                code: 'multiAddParent'
            }
        ]);

        // 通过画布右键快捷新建区块
         
        const { SaveNewBlock } =
            getMergeMeta('engine.plugins.blockmanage')?.components || {};

        const menusWithExtras = computed(() => {
            const baseMenus = [...menus.value];

            if (SaveNewBlock) {
                baseMenus.push({
                    name: t('designer.canvas.createBlock'),
                    code: 'createBlock'
                });
            }

            baseMenus.unshift({
                name: t('designer.canvas.routeJump'),
                code: 'route',
                show: () =>
                    getCurrent()?.schema?.componentName === 'RouterLink',
                check: () => {
                    const targetPageId = getCurrent().schema.props?.to?.name;
                    return typeof targetPageId === 'number' || targetPageId;
                }
            });

            return baseMenus;
        });

        const multiSelectMenusWithExtras = computed(() => {
            const baseMenus = [...multiSelectMenus.value];

            if (SaveNewBlock) {
                baseMenus.push({
                    name: t('designer.canvas.createBlock'),
                    code: 'createBlock'
                });
            }

            return baseMenus;
        });

        const isMultiSelect = computed(
            () => multiSelectedStates.value.length > 1
        );

        const filteredMenus = computed(() => {
            // 如果是多选，则展示多选菜单
            if (isMultiSelect.value) {
                return multiSelectMenusWithExtras.value.filter(item => {
                    // 暂时隐藏带二级菜单的选项
                    if (item.items) {
                        return false;
                    }
                    if (typeof item.show === 'function') {
                        return item.show();
                    }
                    return true;
                });
            }

            return menusWithExtras.value.filter(item => {
                // 暂时隐藏带二级菜单的选项（"插入" 和 "添加父级"）
                if (item.items) {
                    return false;
                }
                if (typeof item.show === 'function') {
                    return item.show();
                }
                return true;
            });
        });

        const boxVisibility = ref(false);

        // 计算上下文菜单位置，右键时显示，否则关闭

        const { PLUGIN_NAME, activeSetting } = useLayout();

        const operations = {
            del() {
                removeNodeById(getCurrent().schema?.id);
            },
            copy() {
                copyNode(getCurrent().schema?.id);
            },
            multiDel() {
                const ids = multiSelectedStates.value.map(state => state.id);
                ids.forEach(id => removeNodeById(id));
            },
            multiCopy() {
                const ids = multiSelectedStates.value.map(state => state.id);
                ids.forEach(id => copyNode(id));

                useCanvas().canvasApi.value.updateRect?.();
            },
            config() {
                activeSetting(PLUGIN_NAME.Props);
            },
            bindEvent() {
                activeSetting(PLUGIN_NAME.Event);
            },
            insert({ value }) {
                emit('insert', value);
            },
            wrap({ value, name }) {
                const componentName = value || name;
                const { schema, parent } = getCurrent();

                if (!schema || !parent) {
                    return;
                }

                const index = parent.children.findIndex(
                    ({ id }) => schema.id === id
                );
                let wrapSchema = {
                    componentName,
                    id: null,
                    props: {
                        content: t('designer.canvas.tooltipInfo')
                    },
                    children: [schema]
                };
                // 需要对popover特殊处理
                if (value === 'TinyPopover') {
                    wrapSchema = {
                        componentName,
                        props: {
                            width: 200,
                            title: t('designer.canvas.popupTitle'),
                            trigger: 'manual',
                            modelValue: true
                        },
                        children: [
                            {
                                componentName: 'Template',
                                props: {
                                    slot: 'reference'
                                },
                                children: [schema]
                            },
                            {
                                componentName: 'Template',
                                props: {
                                    slot: 'default'
                                },
                                children: [
                                    {
                                        componentName: 'div',
                                        props: {
                                            placeholder: t(
                                                'designer.canvas.tooltipContent'
                                            )
                                        }
                                    }
                                ]
                            }
                        ]
                    };
                }
                parent.children.splice(index, 1, wrapSchema);
                getController().addHistory();
            },
            // 处理批量添加父级的操作
            batchWrap({ value }) {
                batchAddParent(value);
            },
            // 处理整体添加父级的操作
            groupWrap({ value }) {
                groupAddParent(value);
            },
            createBlock() {
                if (useCanvas().isSaved()) {
                    boxVisibility.value = true;
                } else {
                    useModal().message({
                        message: t('designer.common.saveCurrentPageFirst'),
                        status: 'error'
                    });
                }
            },
            route() {
                // check中验证过了 targetPageId 是有效值
                const targetPageId = getCurrent().schema.props.to.name;
                usePage().switchPageWithConfirm(targetPageId, true);
            }
        };

        const actionDisabled = actionItem => {
            if (typeof actionItem.check === 'function' && !actionItem.check()) {
                return true;
            }

            if (isMultiSelect.value) {
                const multiSelectActions = [
                    'multiDel',
                    'multiCopy',
                    'multiAddParent'
                ];
                return (
                    multiSelectActions.includes(actionItem.code) &&
                    multiSelectedStates.value.length === 0
                );
            } else {
                const actions = ['del', 'copy', 'addParent'];
                return (
                    actions.includes(actionItem.code) &&
                    !getCurrent().schema?.id
                );
            }
        };

        // 获取菜单项的唯一标识
        const getItemKey = item => {
            return item.code || item.name || JSON.stringify(item);
        };

        // 使用字符串 key 而不是对象引用来跟踪当前菜单
        const currentItemKey = ref(null);
        // 暴露给 closeMenu 函数
        currentItemKeyRef = currentItemKey;

        const onShowChildrenMenu = menuItem => {
            if (actionDisabled(menuItem)) {
                currentItemKey.value = null;
                current.value = null;
                return;
            }
            // 使用唯一标识来匹配菜单项
            currentItemKey.value = getItemKey(menuItem);
            current.value = menuItem;
        };

        const close = () => {
            boxVisibility.value = false;
        };
        const doOperation = item => {
            if (actionDisabled(item)) {
                return;
            }

            if (item?.code) {
                operations[item.code]?.(item);
                closeMenu();
            }
        };

        return {
             
            SaveNewBlock,
            menuState,
            filteredMenus,
            doOperation,
            boxVisibility,
            close,
            current,
            currentItemKey,
            menuDom,
            subMenuStyles,
            actionDisabled,
            onShowChildrenMenu,
            getItemKey
        };
    }
};
</script>

<style lang="scss" scoped>
.context-menu {
    position: absolute;
    z-index: 10;
}
.menu-item {
    width: 140px;
    line-height: 20px;
    border-radius: 6px;
    padding: 8px 0;
    background-color: var(--te-canvas-container-bg-color);
    box-shadow: 0 1px 15px 0 rgb(0 0 0 / 20%);
    display: flex;
    flex-direction: column;
    .li-item {
        border-bottom: 1px solid var(--te-canvas-container-border-color);
    }
    .li-item-disabled {
        cursor: not-allowed;
        color: var(--te-canvas-container-text-color-disabled);
        svg {
            fill: var(--te-canvas-container-text-color-disabled);
        }
    }
    li {
        & > div {
            display: flex;
            width: 100%;
            justify-content: space-between;
        }
        font-size: 12px;
        color: var(--te-canvas-container-text-color-primary);
        svg {
            fill: var(--te-canvas-container-text-color-primary);
        }
        padding: 6px 15px;
        &:not(.menu-item-disabled):hover {
            background: var(--te-canvas-container-bg-color-hover);
        }
        position: relative;

        &.menu-item-disabled {
            cursor: not-allowed;
            color: var(--te-canvas-container-text-color-disabled);
        }
    }
    &.sub-menu {
        position: absolute;
        top: -2px;
    }
}
</style>
