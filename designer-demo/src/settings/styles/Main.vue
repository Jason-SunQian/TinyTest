<!-- eslint-disable vue/max-lines-per-block, vue/multi-word-component-names, vue/require-explicit-emits -->
<template>
    <plugin-panel
        :title="t('designer.settings.styles.title')"
        :fixed-panels="fixedPanels"
        :fixed-name="PLUGIN_NAME.Styles"
        :is-show-collapse-icon="true"
        :show-bottom-border="true"
        @update-collapse-status="updateCollapseStatus"
        @close="$emit('close')"
    >
        <template #content>
            <div class="style-editor">
                <div class="line-style">
                    <span class="line-text">
                        {{ t('designer.settings.styles.inlinePanel') }}
                    </span>
                    <div class="inline-style">
                        <component
                            :is="CodeConfigurator"
                            v-if="state.lineStyleDisable"
                            :button-show-content="true"
                            :model-value="state.styleContent"
                            :title="t('designer.settings.styles.inlineButton')"
                            :button-text="state.inlineBtnText"
                            language="css"
                            single
                            @save="save"
                        />
                        <div v-if="!state.lineStyleDisable">
                            <tiny-input
                                v-model="state.propertiesList"
                                class="inline-bind-style"
                            />
                        </div>
                        <component
                            :is="VariableConfigurator"
                            ref="bindVariable"
                            :model-value="state.bindModelValue"
                            name="advance"
                            @update:model-value="setConfig"
                        />
                    </div>
                </div>
            </div>
            <class-names-container />
            <tiny-collapse v-model="activeNames" @change="handoverGroup">
                <tiny-collapse-item
                    :title="t('designer.settings.styles.groups.layout')"
                    name="layout"
                >
                    <layout-group
                        :display="state.style.display"
                        @update="updateStyle"
                    />
                    <flex-box
                        v-if="state.style.display === 'flex'"
                        :style="state.style"
                        @update="updateStyle"
                    />
                    <grid-box
                        v-if="state.style.display === 'grid'"
                        :style="state.style"
                        @update="updateStyle"
                    />
                </tiny-collapse-item>

                <tiny-collapse-item
                    :title="t('designer.settings.styles.groups.spacing')"
                    name="spacing"
                >
                    <spacing-group :style="state.style" @update="updateStyle" />
                </tiny-collapse-item>

                <tiny-collapse-item
                    :title="t('designer.settings.styles.groups.size')"
                    name="size"
                >
                    <size-group :style="state.style" @update="updateStyle" />
                </tiny-collapse-item>

                <tiny-collapse-item
                    :title="t('designer.settings.styles.groups.position')"
                    name="position"
                >
                    <position-group
                        :style="state.style"
                        @update="updateStyle"
                    />
                </tiny-collapse-item>

                <tiny-collapse-item
                    :title="t('designer.settings.styles.groups.typography')"
                    name="typography"
                >
                    <typography-group
                        :style="state.style"
                        @update="updateStyle"
                    />
                </tiny-collapse-item>

                <tiny-collapse-item
                    :title="t('designer.settings.styles.groups.background')"
                    name="backgrounds"
                >
                    <background-group
                        :style="state.style"
                        @update="updateStyle"
                    />
                </tiny-collapse-item>

                <tiny-collapse-item
                    :title="t('designer.settings.styles.groups.border')"
                    name="borders"
                >
                    <border-group :style="state.style" @update="updateStyle" />
                </tiny-collapse-item>

                <tiny-collapse-item
                    :title="t('designer.settings.styles.groups.effects')"
                    name="effects"
                    class="effects-style"
                >
                    <effect-group :style="state.style" @update="updateStyle" />
                </tiny-collapse-item>
            </tiny-collapse>
        </template>
    </plugin-panel>
</template>

<!-- eslint-disable vue/max-lines-per-block, vue/block-lang, vue/component-api-style, @typescript-eslint/naming-convention, vue/require-default-prop, vue/require-typed-object-prop, no-inline-comments, line-comment-position -->
<script lang="ts">
/* metaService: engine.setting.styles.Main */
import { watch, ref, reactive, provide } from 'vue';
import { Collapse, CollapseItem, Input } from '@opentiny/vue';
import {
    useLayout,
    useHistory,
    useCanvas,
    useProperties,
    getConfigurator
} from '@opentiny/tiny-engine-meta-register';
import { PluginPanel } from '@opentiny/tiny-engine-common';

import { useDesignerI18n } from '@/services/i18nService';

import {
    SizeGroup,
    LayoutGroup,
    FlexBox,
    GridBox,
    PositionGroup,
    BorderGroup,
    SpacingGroup,
    BackgroundGroup,
    EffectGroup,
    TypographyGroup,
    ClassNamesContainer
} from './components';
import { CSS_TYPE } from './js/cssType';
import useStyle from './js/useStyle';
import { styleStrRemoveRoot } from './js/cssConvert';

export default {
    components: {
         
        PluginPanel,
         
        SizeGroup,
         
        LayoutGroup,
         
        FlexBox,
         
        GridBox,
         
        PositionGroup,
         
        BorderGroup,
         
        SpacingGroup,
         
        BackgroundGroup,
         
        TypographyGroup,
         
        EffectGroup,
         
        ClassNamesContainer,
        TinyCollapse: Collapse,
        TinyCollapseItem: CollapseItem,
        TinyInput: Input
    },
    props: {
         
        fixedPanels: {
            type: Array,
            default: undefined
        }
    },
    emits: ['close'],
     
    setup(props, { emit }) {
        const CodeConfigurator = getConfigurator('CodeConfigurator');
        const VariableConfigurator = getConfigurator('VariableConfigurator');
        const styleCategoryGroup = [
            'layout',
            'spacing',
            'size',
            'position',
            'typography',
            'backgrounds',
            'borders',
            'effects'
        ];
        const isCollapsed = ref(false);
        const activeNames = ref(styleCategoryGroup);
        const { getCurrentSchema } = useCanvas();
        // 获取当前节点 style 对象
        const { state, updateStyle } = useStyle(); // updateStyle
        const { addHistory } = useHistory();
        const { getSchema, setProp } = useProperties();
        const { PLUGIN_NAME } = useLayout();
        const { t, locale } = useDesignerI18n();

        const panelState = reactive({
            emitEvent: emit
        });
        provide('panelState', panelState);

        const handoverGroup = actives => {
            if (isCollapsed.value) {
                activeNames.value =
                    actives.length > 1 ? actives.shift() : actives;
            }
        };

        const updateStyleToSchema = value => {
            const schema = getSchema();

            if (schema) {
                setProp('style', value);

                return;
            }

            const { getSchema: getCanvasPageSchema, updateSchema } =
                useCanvas();
            const pageSchema = getCanvasPageSchema();

            // TODO: 当 style 为空时，支持移除 style key
            updateSchema({
                props: { ...(pageSchema.props || {}), style: value }
            });
        };

        // 保存编辑器内容，并回写到 schema
        const save = ({ content }) => {
            const { updateRect } = useCanvas().canvasApi.value;
            const styleString = styleStrRemoveRoot(content);

            state.styleContent = content;

            updateStyleToSchema(styleString);

            addHistory();
            updateRect();
        };

        const updateInlineTexts = boundValue => {
            state.inlineBtnText = t('designer.settings.styles.inlineButton');
            if (boundValue) {
                state.propertiesList = t(
                    'designer.settings.styles.inlineBound',
                    { value: boundValue }
                );
            } else {
                state.propertiesList = t(
                    'designer.settings.styles.inlinePlaceholder'
                );
            }
        };

        updateInlineTexts(state.bindModelValue?.value);

        watch(locale, () => {
            updateInlineTexts(state.bindModelValue?.value);
        });

        const setConfig = value => {
            const { updateRect } = useCanvas().canvasApi.value;

            if (value !== '') {
                updateStyleToSchema(value);
                state.bindModelValue = value;
                state.lineStyleDisable = false;
                updateInlineTexts(value?.value);
                addHistory();
            } else {
                updateStyleToSchema('');
                state.bindModelValue = null;
                state.lineStyleDisable = true;
                updateInlineTexts();
                addHistory();
            }

            updateRect();
        };

        watch(
            () => getCurrentSchema(),
            val => {
                if (val?.props?.style?.value) {
                    state.lineStyleDisable = false;
                    state.bindModelValue = val.props.style;
                    updateInlineTexts(val.props.style?.value);
                } else {
                    state.lineStyleDisable = true;
                    state.bindModelValue = null;
                    updateInlineTexts();
                }
            },
            {
                deep: true
            }
        );

        const updateCollapseStatus = val => {
            isCollapsed.value = val;
        };

        watch(
            () => isCollapsed.value,
            () => {
                if (isCollapsed.value) {
                    activeNames.value = [];
                } else {
                    activeNames.value = styleCategoryGroup;
                }
            }
        );

        return {
            updateCollapseStatus,
             
            PLUGIN_NAME,
            CodeConfigurator,
            VariableConfigurator,
            state,
            activeNames,
            CSS_TYPE,
            open,
            handoverGroup,
            save,
            close,
            updateStyle,
            setConfig,
            isCollapsed,
            t,
            locale
        };
    }
};
</script>

<!-- eslint-disable-next-line vue/block-lang -->
<style lang="less" scoped>
.style-editor {
    justify-content: space-around;
    margin-top: 12px;
    column-gap: 8px;
    .line-style {
        padding: 0 8px 0 12px;
        display: block;
        font-size: 12px;
        .line-text {
            display: block;
            margin-bottom: 8px;
            font-size: 12px;
            color: var(--te-styles-common-text-color-secondary);
        }
    }
    .inline-style {
        display: flex;
        align-items: center;
        :deep(.editor-wrap) {
            display: flex;
            .tiny-button {
                padding: 0 16px;
                border-radius: 8px;
                width: 216px;
                text-align: left;
                color: var(--te-styles-common-text-color-primary);
            }
            .tiny-button:hover {
                background: none;
                border-color: var(--te-styles-common-border-color);
            }
        }
        .inline-bind-style {
            :deep(.tiny-input__inner) {
                width: 216px;
                pointer-events: none;
                background: var(--te-styles-editor-bg-color);
                color: var(--te-styles-editor-font-text-color);
                border-color: var(--te-styles-editor-border-color);
            }
        }
    }
}

.dots {
    display: inline-block;
    margin-left: 4px;
    vertical-align: middle;
    border: 2px solid var(--te-styles-editor-border-color);
    border-radius: 2px;
}
</style>
