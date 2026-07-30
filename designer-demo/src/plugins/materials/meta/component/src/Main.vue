<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <div class="components-wrap">
        <tiny-search
            v-model="state.searchValue"
            :placeholder="t('designer.leftPanel.searchPlaceholder')"
            clearable
            @update:model-value="change"
        >
            <template #prefix> <icon-search /> </template>
        </tiny-search>
        <tiny-collapse v-model="state.activeName" class="lowcode-scrollbar">
            <tiny-collapse-item
                v-for="(item, index) in state.components"
                :key="item.group"
                :title="getComponentLabel(item)"
                :name="index"
            >
                <ul class="component-group" :style="{ gridTemplateColumns }">
                    <template
                        v-for="child in item.children"
                        :key="child.component"
                    >
                        <canvas-drag-item
                            v-if="!child.hidden && getComponentName(child)"
                            :data="
                                generateNode({
                                    component:
                                        child.snippetName || child.component
                                })
                            "
                            @click="componentClick"
                        >
                            <tiny-tooltip
                                class="component-item-tooltip"
                                effect="light"
                                placement="bottom"
                                :open-delay="100"
                                :content="getComponentName(child)"
                            >
                                <li class="component-item">
                                    <div class="component-item-component">
                                        <img
                                            v-if="
                                                isMaterialIconUrl(
                                                    getMaterialIconName(child)
                                                )
                                            "
                                            :src="getMaterialIconName(child)"
                                            :alt="getComponentName(child)"
                                            class="component-item-icon-image"
                                            @error="
                                                handleMaterialIconError(
                                                    $event,
                                                    child
                                                )
                                            "
                                        >
                                        <svg-icon
                                            v-else
                                            :name="getMaterialIconName(child)"
                                        />
                                    </div>
                                    <span class="component-item-name">{{
                                        getComponentName(child)
                                    }}</span>
                                </li>
                            </tiny-tooltip>
                        </canvas-drag-item>
                    </template>
                </ul>
            </tiny-collapse-item>
            <search-empty :is-show="!state.components.length" />
        </tiny-collapse>
    </div>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
/* metaService: engine.plugins.materials.component.Main */
import {
    inject,
    onMounted,
    reactive,
    ref,
    watch,
    watchEffect,
    computed
} from 'vue';
import { Collapse, CollapseItem, Search, Tooltip } from '@opentiny/vue';
import { SearchEmpty, CanvasDragItem } from '@opentiny/tiny-engine-common';
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n';
import { iconSearch } from '@opentiny/vue-icon';
import { useMaterial, useCanvas } from '@opentiny/tiny-engine-meta-register';

import { useDesignerI18n } from '@/services/i18nService';
import { getMaterialsBaseFromBundleUrls } from '@/composable/loadRuntimeFromBundles';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinySearch: Search,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        IconSearch: iconSearch(),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyCollapse: Collapse,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyCollapseItem: CollapseItem,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTooltip: Tooltip,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        CanvasDragItem,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        SearchEmpty
    },
    // eslint-disable-next-line vue/component-api-style
    setup() {
        const COMPONENT_PANEL_COLUMNS = '1fr 1fr 1fr';
        const SHORTCUT_PANEL_COLUMNS = '1fr 1fr 1fr 1fr 1fr 1fr';
        const materialApi = useMaterial() as {
            generateNode: ReturnType<typeof useMaterial>['generateNode'];
            materialState: ReturnType<typeof useMaterial>['materialState'];
            getComponentsByGroup: ReturnType<
                typeof useMaterial
            >['getComponentsByGroup'];
            getMaterial: ReturnType<typeof useMaterial>['getMaterial'];
            getBundleBaseUrlForComponent?: (name: string) => string | null;
        };
        const {
            generateNode,
            materialState,
            getComponentsByGroup,
            getMaterial,
            getBundleBaseUrlForComponent
        } = materialApi;
        const gridTemplateColumns = ref(COMPONENT_PANEL_COLUMNS);

        // 获取国际化 t 函数和语言
        const { t, locale: currentLocaleRef } = useDesignerI18n();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const i18n: any = inject(I18nInjectionKey);

        interface PanelState {
            isShortcutPanel: boolean;
            materialGroup: string;
            emitEvent: (event: string) => void;
        }
        const panelState = inject('panelState', {}) as PanelState;

        const componentsWithChildren = computed(() =>
            materialState.components.filter(item => item.children.length)
        );

        type Component = typeof componentsWithChildren.value[number];

        // 分组名称翻译映射表（用于没有 label 的分组）
        const GROUP_NAME_TRANSLATIONS: Record<
            string,
            Record<string, string>
        > = {
            容器组件: {
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                zh_CN: '容器组件',
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                en_US: 'Container Components'
            },
            布局与容器: {
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                zh_CN: '布局与容器',
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                en_US: 'Layout and Containers'
            },
            基础元素: {
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                zh_CN: '基础元素',
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                en_US: 'Basic Elements'
            },
            高级元素: {
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                zh_CN: '高级元素',
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                en_US: 'Advanced Elements'
            },
            form: {
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                zh_CN: '表单',
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                en_US: 'Form'
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'data-display': {
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                zh_CN: '数据展示',
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                en_US: 'Data Display'
            },
            table: {
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                zh_CN: '表格',
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                en_US: 'Table'
            },
            layout: {
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                zh_CN: '布局',
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                en_US: 'Layout'
            },
            basic: {
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                zh_CN: '基础',
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                en_US: 'Basic'
            },
            advanced: {
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                zh_CN: '高级',
                // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
                en_US: 'Advanced'
            },
            // 业务物料分类：mr 原子组件 / mp 业务组件，与 locale 一致时显示英文
            /* eslint-disable @typescript-eslint/naming-convention, camelcase */
            原子组件: {
                zh_CN: '原子组件',
                en_US: 'MR Components'
            },
            业务组件: {
                zh_CN: '业务组件',
                en_US: 'MP Components'
            }
            /* eslint-enable @typescript-eslint/naming-convention, camelcase */
        };

        // 获取组件标签的国际化文本
        const getComponentLabel = (component: Component) => {
            const currentLocale =
                currentLocaleRef.value ||
                i18n?.global?.locale?.value ||
                'zh_CN';
            const isEnglish =
                currentLocale === 'en_US' ||
                currentLocale === 'en-US' ||
                currentLocale === 'en' ||
                String(currentLocale).toLowerCase().startsWith('en');

            if (component.label && typeof component.label === 'object') {
                // 如果是英文环境，优先使用 en_US
                if (isEnglish) {
                    return (
                        component.label.en_US ||
                        component.label['en-US'] ||
                        component.label.en ||
                        component.label[currentLocale] ||
                        component.label.zh_CN ||
                        component.group
                    );
                }
                return (
                    component.label[currentLocale] ||
                    component.label.zh_CN ||
                    component.group
                );
            }

            // 如果没有 label，使用分组名称翻译映射表
            if (isEnglish && GROUP_NAME_TRANSLATIONS[component.group]) {
                return (
                    GROUP_NAME_TRANSLATIONS[component.group].en_US ||
                    component.group
                );
            }
            if (!isEnglish && GROUP_NAME_TRANSLATIONS[component.group]) {
                return (
                    GROUP_NAME_TRANSLATIONS[component.group].zh_CN ||
                    component.group
                );
            }

            return component.group;
        };

        // 翻译映射表（精简版，适合有限显示空间）
        const TRANSLATION_MAP: Record<string, string> = {
            盒子容器: 'Box',
            行列容器: 'Row/Col',
            弹性容器: 'Flex',
            全宽居中容器: 'Full Width',
            全宽居中布局: 'Full Width',
            栅格布局: 'Grid',
            文本: 'Text',
            图标: 'Icon',
            图片: 'Image',
            段落: 'Paragraph',
            链接: 'Link',
            分隔线: 'Divider',
            标题: 'Title',
            视频: 'Video',
            按钮: 'Button',
            按钮组: 'Button Group',
            互斥按钮组: 'Mutex Buttons',
            搜索框: 'Search',
            插槽: 'Slot',
            路由视图: 'Router View',
            路由链接: 'Router Link',
            导航条: 'Nav Bar',
            纵向导航: 'Vertical Nav',
            数据源容器: 'Data Source',
            复选框组: 'Checkbox Group',
            复选框拖拽按钮组: 'Checkbox Buttons'
        };

        // 获取组件名称的国际化文本
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const getComponentName = (child: any) => {
            const currentLocale =
                currentLocaleRef.value ||
                i18n?.global?.locale?.value ||
                'zh_CN';

            if (child.name && typeof child.name === 'object') {
                // 检查是否是英文环境（支持多种格式）
                const isEnglish =
                    currentLocale === 'en_US' ||
                    currentLocale === 'en-US' ||
                    currentLocale === 'en' ||
                    String(currentLocale).toLowerCase().startsWith('en');

                if (isEnglish) {
                    // 优先使用 en_US
                    let enName =
                        child.name.en_US ||
                        child.name['en-US'] ||
                        child.name.en;

                    // 如果 en_US 不存在或者是中文，尝试从翻译映射表获取
                    if (!enName || /[\u4e00-\u9fa5]/.test(enName)) {
                        const zhName = child.name.zh_CN;
                        if (zhName && TRANSLATION_MAP[zhName]) {
                            enName = TRANSLATION_MAP[zhName];
                            // 动态更新 child.name.en_US，以便后续使用
                            // eslint-disable-next-line max-depth, camelcase
                            if (
                                !child.name.en_US ||
                                /[\u4e00-\u9fa5]/.test(child.name.en_US)
                            ) {
                                // eslint-disable-next-line camelcase
                                child.name.en_US = enName;
                            }
                        }
                    }

                    if (enName && !/[\u4e00-\u9fa5]/.test(enName)) {
                        return enName;
                    }
                    // 如果没有英文，回退到中文
                    return child.name.zh_CN || child.name;
                }
                // 中文环境使用中文
                return (
                    child.name.zh_CN || child.name[currentLocale] || child.name
                );
            }
            return child.name;
        };

        const isMaterialIconUrl = (icon?: string) => {
            const value = icon?.trim();
            if (!value) return false;
            return (
                value.startsWith('http://') ||
                value.startsWith('https://') ||
                value.startsWith('data:') ||
                value.startsWith('/') ||
                value.startsWith('./') ||
                value.startsWith('../') ||
                value.includes('/') ||
                /\.(svg|png|jpe?g|webp|gif|ico)$/i.test(value)
            );
        };

        /**
         * 物料面板图标相对路径的兜底基座（与 useMaterial.addMaterials 中
         * getMaterialsBaseFromBundleUrls 同源）。入库后 icon 多为绝对 URL，此处仅处理少数仍为相对路径的情况。
         */
        const getMaterialIconHttpBase = (componentKey: string): string => {
            const fromMap =
                getBundleBaseUrlForComponent?.(componentKey)?.trim();
            if (
                fromMap &&
                (fromMap.startsWith('http://') ||
                    fromMap.startsWith('https://'))
            ) {
                return fromMap.replace(/\/$/, '');
            }
            return getMaterialsBaseFromBundleUrls()?.replace(/\/$/, '') || '';
        };

        const resolveRelativeMaterialIconUrl = (
            icon: string,
            componentKey: string
        ) => {
            if (
                icon.startsWith('http://') ||
                icon.startsWith('https://') ||
                icon.startsWith('data:') ||
                icon.startsWith('vscode-webview:')
            ) {
                return icon;
            }
            const base = getMaterialIconHttpBase(componentKey);
            if (!base) return icon;
            return `${base.replace(/\/$/, '')}/${icon.replace(/^\//, '')}`;
        };

        /** 物料面板图标：支持 icon name 与 icon URL（方案A） */
        const getMaterialIconName = (child: {
            icon?: string;
            snippetName?: string;
            component?: string;
            // eslint-disable-next-line @typescript-eslint/naming-convention -- 运行时标记，避免与物料字段冲突
            __iconLoadFailed?: boolean;
        }) => {
            if (child?.__iconLoadFailed) return 'component-default';
            let rawIcon = child?.icon?.trim();
            const componentKey = child?.snippetName || child?.component || '';
            if (!rawIcon || rawIcon === 'component-default') {
                const material = getMaterial(componentKey) as
                    | { icon?: string }
                    | undefined;
                rawIcon = material?.icon?.trim() || rawIcon;
            }
            if (!rawIcon) return 'component-default';
            if (isMaterialIconUrl(rawIcon)) {
                return resolveRelativeMaterialIconUrl(rawIcon, componentKey);
            }
            return rawIcon.toLowerCase();
        };

        const handleMaterialIconError = (
            event: Event,
            child: {
                // eslint-disable-next-line @typescript-eslint/naming-convention -- 与 getMaterialIconName 一致
                __iconLoadFailed?: boolean;
            }
        ) => {
            child.__iconLoadFailed = true;
            const target = event.target as HTMLImageElement | null;
            if (target) {
                target.onerror = null;
                target.src = '';
            }
        };

        const fetchComponents = (components: Component[], name: string) => {
            if (!name) {
                return components;
            }

            const result: Component[] = [];
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const currentLocale = i18n?.global?.locale?.value || 'zh_CN';

            components.forEach(component => {
                const children: Component['children'] = [];

                component.children.forEach(child => {
                    const childName = getComponentName(child);
                    if (
                        childName?.toLowerCase().indexOf(name.toLowerCase()) >
                        -1
                    ) {
                        children.push(child);
                    }
                });

                if (children.length > 0) {
                    result.push({
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error 数据类型兼容
                        groupId: component.groupId,
                        group: component.group,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error 数据类型兼容
                        groupName: component.groupName,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error 数据类型兼容
                        label: component.label,
                        children
                    });
                }
            });

            return result;
        };

        const initComponents = () => {
            const groupName = panelState.materialGroup;
            if (groupName) {
                const grouped = getComponentsByGroup(
                    componentsWithChildren.value,
                    groupName
                );
                return grouped.length ? grouped : componentsWithChildren.value;
            }

            return componentsWithChildren.value;
        };

        const state = reactive<{
            components: Component[];
            activeName: number[];
            searchValue: string;
        }>({
            components: initComponents(),
            activeName: [],
            searchValue: ''
        });

        watchEffect(() => {
            state.activeName = [
                ...Array(componentsWithChildren.value.length).keys()
            ];
        });

        const change = (value: string) => {
            state.components = fetchComponents(
                componentsWithChildren.value,
                value
            );
        };

        watch(
            () => componentsWithChildren.value,
            value => {
                state.components = fetchComponents(value, state.searchValue);
            },
            {
                deep: true
            }
        );

        // 监听语言变化，重新计算组件列表
        watch(
            [currentLocaleRef, () => i18n?.global?.locale?.value],
            () => {
                state.components = fetchComponents(
                    componentsWithChildren.value,
                    state.searchValue
                );
            },
            { immediate: false }
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const componentClick = (data: any) => {
            const { isShortcutPanel, emitEvent } = panelState;
            const { addComponent } = useCanvas().canvasApi.value;

            if (isShortcutPanel) {
                // FIXME: 类型修复
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                addComponent?.(data, isShortcutPanel);
                emitEvent('close');
            }
        };

        onMounted(() => {
            if (panelState.isShortcutPanel) {
                gridTemplateColumns.value = SHORTCUT_PANEL_COLUMNS;
            }
        });

        return {
            gridTemplateColumns,
            state,
            change,
            generateNode,
            componentClick,
            t,
            // 暴露 getComponentLabel 函数给模板使用
            getComponentLabel,
            getComponentName,
            getMaterialIconName,
            isMaterialIconUrl,
            handleMaterialIconError
        };
    }
};
</script>

<style lang="scss" scoped>
.components-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;

    .tiny-search {
        padding: 12px;
    }

    :deep(.tiny-collapse-item__content) {
        padding: 0 var(--te-common-vertical-form-label-spacing) 4px;
    }

    .component-group {
        display: grid;
        width: 100%;
        color: var(--te-materials-component-list-text-color);

        /* Keep grid cell full-width; TinyTooltip default span would shrink layout */
        :deep(.component-item-tooltip) {
            display: block;
            width: 100%;
        }

        .component-item {
            padding: var(--te-common-vertical-form-label-spacing) 0
                var(--te-common-vertical-form-label-spacing);
            margin-bottom: var(--te-common-vertical-form-label-spacing);
            text-align: center;
            user-select: none;
            cursor: move;
            background: var(--te-materials-component-list-item-bg-color);

            &:hover {
                background: var(
                    --te-materials-component-list-item-bg-color-hover
                );
                border-radius: 4px;
            }

            .component-item-component {
                margin-bottom: 8px;

                svg {
                    font-size: 40px;
                    vertical-align: middle;
                    color: var(--te-materials-component-list-item-icon-color);
                    overflow: hidden;
                }

                .component-item-icon-image {
                    width: 40px;
                    height: 40px;
                    object-fit: contain;
                    vertical-align: middle;
                }
            }

            .component-item-name {
                max-width: 62px;
                display: inline-block;
                overflow: hidden;
                font-size: 12px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
        }

        :deep(.drag-item:nth-child(3n)) {
            .component-item {
                border-right: none;
            }
        }
    }

    .tiny-collapse {
        flex: 1;
        overflow-y: auto;
        .tiny-collapse-item.is-active + .tiny-collapse-item {
            margin-top: 0;
        }
        :deep(.tiny-collapse-item__header .tiny-collapse-item__word-overflow) {
            margin: var(--te-common-vertical-item-spacing-normal) 0px
                var(--te-common-vertical-form-label-spacing);
        }
        .components-items {
            .item {
                cursor: pointer;
            }
        }
    }
}
</style>
