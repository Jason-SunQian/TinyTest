/* eslint-disable max-lines */
<!-- eslint-disable vue/max-lines-per-block, vue/block-lang, vue/component-api-style, @typescript-eslint/naming-convention, max-lines, no-void, vue/require-typed-object-prop -->
<template>
    <div class="radius-row item-row">
        <div
            :class="['radius-label', { 'is-setting': isRadiusSetting() }]"
            @click="openSetting(BORDER_RADIUS_PROPERTY.BorderRadius, $event)"
        >
            <span>{{ t('designer.settings.styles.border.radius') }}</span>
        </div>
        <div class="radius-content">
            <div class="radius-btn-group">
                <button-group
                    :options="radiusOptions"
                    :model-value="radiusSelected"
                    @update:model-value="value => selectRadius(value)"
                />
            </div>

            <div
                v-show="isRadiusSelected(RADIUS_SETTING.Single)"
                class="radius-content-input"
            >
                <slider-configurator
                    :model-value="borderRadius.BorderRadius"
                    :controls="false"
                    :show-unit="true"
                    :selected-unit="'px'"
                    @update:model-value="updateRadiusSingle"
                />
            </div>
        </div>
    </div>
    <div
        v-show="isRadiusSelected(RADIUS_SETTING.Multiple)"
        class="radius-row item-row"
    >
        <div class="radius-label" />
        <div class="radius-multiple-container">
            <div>
                <tiny-tooltip
                    :effect="effect"
                    :placement="placement"
                    :content="
                        t('designer.settings.styles.border.corner.topLeft')
                    "
                >
                    <span>
                        <svg-icon name="border-radius-topleft" />
                    </span>
                </tiny-tooltip>
                <numeric-select
                    :name="
                        getProperty(BORDER_RADIUS_PROPERTY.BorderTopLeftRadius)
                            .name
                    "
                    :numerical-text="borderRadius.BorderTopLeftRadius"
                    placeholder="0"
                    @update="updateStyle"
                />
            </div>
            <div>
                <tiny-tooltip
                    :effect="effect"
                    :placement="placement"
                    :content="
                        t('designer.settings.styles.border.corner.topRight')
                    "
                >
                    <span>
                        <svg-icon name="border-radius-topright" />
                    </span>
                </tiny-tooltip>
                <numeric-select
                    :name="
                        getProperty(BORDER_RADIUS_PROPERTY.BorderTopRightRadius)
                            .name
                    "
                    :numerical-text="borderRadius.BorderTopRightRadius"
                    placeholder="0"
                    @update="updateStyle"
                />
            </div>
            <div>
                <tiny-tooltip
                    :effect="effect"
                    :placement="placement"
                    :content="
                        t('designer.settings.styles.border.corner.bottomLeft')
                    "
                >
                    <span>
                        <svg-icon name="border-radius-bottomleft" />
                    </span>
                </tiny-tooltip>
                <numeric-select
                    :name="
                        getProperty(
                            BORDER_RADIUS_PROPERTY.BorderBottomLeftRadius
                        ).name
                    "
                    :numerical-text="borderRadius.BorderBottomLeftRadius"
                    placeholder="0"
                    @update="updateStyle"
                />
            </div>
            <div>
                <tiny-tooltip
                    :effect="effect"
                    :placement="placement"
                    :content="
                        t('designer.settings.styles.border.corner.bottomRight')
                    "
                >
                    <span>
                        <svg-icon name="border-radius-bottomright" />
                    </span>
                </tiny-tooltip>
                <numeric-select
                    :name="
                        getProperty(
                            BORDER_RADIUS_PROPERTY.BorderBottomRightRadius
                        ).name
                    "
                    placeholder="0"
                    :numerical-text="borderRadius.BorderBottomRightRadius"
                    @update="updateStyle"
                />
            </div>
        </div>
    </div>

    <div class="item-row">
        <label
            class="border-label"
            :class="{
                'is-setting': isBorderSetting(),
                'set-border-style': true
            }"
            @click="openSetting(BORDER_PROPERTY.Border, $event)"
        >
            <span>{{ t('designer.settings.styles.border.title') }}</span>
        </label>
    </div>
    <div class="border-container">
        <div class="position-selector">
            <div
                class="svg-wrap center"
                :class="[
                    'row-item',
                    { selected: isBorderSelected(BORDER_SETTING.All) }
                ]"
                :title="t('designer.settings.styles.border.position.all')"
                @click="selectBorder(BORDER_SETTING.All)"
            >
                <svg-icon name="border-all" />
            </div>
            <div
                class="svg-wrap left"
                :class="[
                    'row-item',
                    { selected: isBorderSelected(BORDER_SETTING.Left) }
                ]"
                :title="t('designer.settings.styles.border.position.left')"
                @click="selectBorder(BORDER_SETTING.Left)"
            >
                <svg-icon name="border-left" />
            </div>
            <div
                class="svg-wrap top"
                :class="[
                    'row-item',
                    { selected: isBorderSelected(BORDER_SETTING.Top) }
                ]"
                :title="t('designer.settings.styles.border.position.top')"
                @click="selectBorder(BORDER_SETTING.Top)"
            >
                <svg-icon name="border-top" />
            </div>
            <div
                class="svg-wrap bottom"
                :class="[
                    'row-item',
                    { selected: isBorderSelected(BORDER_SETTING.Bottom) }
                ]"
                :title="t('designer.settings.styles.border.position.bottom')"
                @click="selectBorder(BORDER_SETTING.Bottom)"
            >
                <svg-icon name="border-bottom" />
            </div>

            <div
                class="svg-wrap right"
                :class="[
                    'row-item',
                    { selected: isBorderSelected(BORDER_SETTING.Right) }
                ]"
                :title="t('designer.settings.styles.border.position.right')"
                @click="selectBorder(BORDER_SETTING.Right)"
            >
                <svg-icon name="border-right" />
            </div>
        </div>
        <div class="inputs">
            <div class="input-row">
                <label
                    class="border-label"
                    :class="{ 'is-setting': isBorderStyleSetting() }"
                    @click="openSetting(BORDER_PROPERTY.BorderStyle, $event)"
                >
                    <span>{{
                        t('designer.settings.styles.border.style')
                    }}</span>
                </label>
                <div class="styles-container">
                    <tabs-group-configurator
                        :options="styleOptions"
                        :model-value="styleValue"
                        label-width="30"
                        :effect="effect"
                        :placement="placement"
                        @update:model-value="value => selectBorderStyle(value)"
                    />
                </div>
            </div>
            <div class="input-row">
                <label
                    class="border-label"
                    :class="{ 'is-setting': isBorderWidthSetting() }"
                    @click="openSetting(BORDER_PROPERTY.BorderWidth, $event)"
                >
                    <span>{{
                        t('designer.settings.styles.border.width')
                    }}</span>
                </label>
                <numeric-select
                    :name="borderWidthValue.name"
                    :numerical-text="borderWidthValue.text"
                    :property="borderWidthValue"
                    @update="updateStyle"
                />
            </div>
            <div class="input-row">
                <label
                    class="border-label"
                    :class="{ 'is-setting': isBorderColorSetting() }"
                    @click="openSetting(BORDER_PROPERTY.BorderColor, $event)"
                >
                    <span>{{
                        t('designer.settings.styles.border.color')
                    }}</span>
                </label>
                <color-configurator
                    :key="colorPlaceholder"
                    :model-value="borderColorValue"
                    :placeholder="colorPlaceholder"
                    @change="changeBorderColor"
                />
            </div>
        </div>
    </div>

    <modal-mask v-if="state.showModal" @close="state.showModal = false">
        <reset-button @reset="reset" />
    </modal-mask>
</template>

<!-- eslint-disable-next-line vue/max-lines-per-block, vue/block-lang -->
<script lang="ts">
 
/* metaService: engine.setting.styles.BorderGroup */
import { computed, reactive, watch } from 'vue';
import { Tooltip } from '@opentiny/vue';
import {
    SliderConfigurator,
    TabsGroupConfigurator
} from '@opentiny/tiny-engine-configurator';

import { useDesignerI18n } from '@/services/i18nService';
import ColorConfigurator from '@/components/i18n-wrappers/ColorConfigurator/index.vue';

import ModalMask, { useModal } from '../inputs/ModalMask.vue';
import NumericSelect from '../inputs/NumericSelect.vue';
import ResetButton from '../inputs/ResetButton.vue';
import ButtonGroup from '../buttons/ButtonGroup.vue';
import useEvent from '../../js/useEvent';
import { useProperties } from '../../js/useStyle';
import {
    RADIUS_SETTING,
    BORDER_SETTING,
    BORDER_STYLE_TYPE
} from '../../js/cssType';
import {
    BORDER_PROPERTY,
    BORDER_RADIUS_PROPERTY
} from '../../js/styleProperty';

const BORDER_STYLE = {
    [BORDER_SETTING.All]: BORDER_PROPERTY.BorderStyle,
    [BORDER_SETTING.Top]: BORDER_PROPERTY.BorderTopStyle,
    [BORDER_SETTING.Right]: BORDER_PROPERTY.BorderRightStyle,
    [BORDER_SETTING.Bottom]: BORDER_PROPERTY.BorderBottomStyle,
    [BORDER_SETTING.Left]: BORDER_PROPERTY.BorderLeftStyle
};

const BORDER_WIDTH = {
    [BORDER_SETTING.All]: BORDER_PROPERTY.BorderWidth,
    [BORDER_SETTING.Top]: BORDER_PROPERTY.BorderTopWidth,
    [BORDER_SETTING.Right]: BORDER_PROPERTY.BorderRightWidth,
    [BORDER_SETTING.Bottom]: BORDER_PROPERTY.BorderBottomWidth,
    [BORDER_SETTING.Left]: BORDER_PROPERTY.BorderLeftWidth
};

const BORDER_COLOR = {
    [BORDER_SETTING.All]: BORDER_PROPERTY.BorderColor,
    [BORDER_SETTING.Top]: BORDER_PROPERTY.BorderTopColor,
    [BORDER_SETTING.Right]: BORDER_PROPERTY.BorderRightColor,
    [BORDER_SETTING.Bottom]: BORDER_PROPERTY.BorderBottomColor,
    [BORDER_SETTING.Left]: BORDER_PROPERTY.BorderLeftColor
};

export default {
    components: {
         
        SliderConfigurator,
         
        TabsGroupConfigurator,
         
        ModalMask,
         
        ResetButton,
         
        ColorConfigurator,
         
        NumericSelect,
         
        ButtonGroup,
         
        TinyTooltip: Tooltip
    },
    props: {
         
        style: {
             
            type: Object,
            default: () => ({})
        },
        effect: {
            type: String,
            default: 'light'
        },
        placement: {
            type: String,
            default: 'top'
        }
    },
    emits: useEvent(),
     
    setup(props, { emit }) {
        const { t, locale } = useDesignerI18n();

        const state = reactive({
            showModal: false,
            activedRadius: RADIUS_SETTING.Single,
            activedBorder: BORDER_SETTING.All
        });

        const { setPosition } = useModal();

        const { getProperty, getSettingFlag, getPropertyValue } = useProperties(
            {
                names: Object.values({
                    ...BORDER_RADIUS_PROPERTY,
                    ...BORDER_PROPERTY
                }),
                parseNumber: true
            }
        );

        const updateStyle = properties => {
            emit('update', properties);
        };

        const reset = () => {
            const properties = {};

            if (BORDER_RADIUS_PROPERTY.BorderRadius === activedName) {
                Object.values(BORDER_RADIUS_PROPERTY).forEach(name => {
                    properties[name] = null;
                });
            } else if (BORDER_PROPERTY.Border === activedName) {
                Object.values(BORDER_PROPERTY).forEach(name => {
                    properties[name] = null;
                });
            } else {
                properties[activedName] = null;
            }

            updateStyle(properties);
            state.showModal = false;
        };

        const borderRadius = reactive({
             
            BorderRadius: 0,
             
            BorderTopLeftRadius: 0,
             
            BorderTopRightRadius: 0,
             
            BorderBottomLeftRadius: 0,
             
            BorderBottomRightRadius: 0
        });

        watch(
            () => props.style,
            () => {
                borderRadius.BorderRadius = parseInt(
                    props.style[BORDER_RADIUS_PROPERTY.BorderRadius] || 0
                );
                borderRadius.BorderTopLeftRadius = parseInt(
                    props.style[BORDER_RADIUS_PROPERTY.BorderTopLeftRadius] || 0
                );
                borderRadius.BorderTopRightRadius = parseInt(
                    props.style[BORDER_RADIUS_PROPERTY.BorderTopRightRadius] ||
                        0
                );
                borderRadius.BorderBottomLeftRadius = parseInt(
                    props.style[
                        BORDER_RADIUS_PROPERTY.BorderBottomLeftRadius
                    ] || 0
                );
                borderRadius.BorderBottomRightRadius = parseInt(
                    props.style[
                        BORDER_RADIUS_PROPERTY.BorderBottomRightRadius
                    ] || 0
                );
            },
            { immediate: true }
        );

        const radiusOptionDefs = [
            {
                key: 'single',
                icon: 'border-radius-single',
                value: RADIUS_SETTING.Single
            },
            {
                key: 'multiple',
                icon: 'border-radius-multiple',
                value: RADIUS_SETTING.Multiple
            }
        ];

        const radiusOptions = computed(() =>
            radiusOptionDefs.map(({ key, icon, value }) => ({
                icon,
                value,
                tip: t(`designer.settings.styles.border.radiusOptions.${key}`)
            }))
        );

        const radiusSelected = computed(() => state.activedRadius);

        const selectRadius = type => {
            if (type) {
                state.activedRadius = type;

                // 切换圆角设置类型时，需要将上一个类型设置的值重置，不然会有设置不统一的问题
                if (type === RADIUS_SETTING.Multiple) {
                    updateStyle({
                        [BORDER_RADIUS_PROPERTY.BorderRadius]: 0
                    });
                } else {
                    updateStyle({
                        [BORDER_RADIUS_PROPERTY.BorderTopLeftRadius]: 0,
                        [BORDER_RADIUS_PROPERTY.BorderTopRightRadius]: 0,
                        [BORDER_RADIUS_PROPERTY.BorderBottomLeftRadius]: 0,
                        [BORDER_RADIUS_PROPERTY.BorderBottomRightRadius]: 0
                    });
                }
            }
        };

        const isRadiusSelected = type => type === state.activedRadius;

        const isRadiusSetting = () => {
            let isSetting = false;

            Object.values(BORDER_RADIUS_PROPERTY).forEach(name => {
                if (getSettingFlag(name)) {
                    isSetting = true;
                }
            });

            return isSetting;
        };

        const updateRadiusSingle = (value, unit = 'px') => {
            /**
             * 考虑如下场景：
             * 1. 用户在 monacoEditor 更新了样式 border-radius: 9px 然后保存，该组件接收并同步改值
             * 2. 用户在 monacoEditor 删除了 border-radius: 9px 的样式，然后 watch 函数（props.style），重新计算得到值 0
             * 3. 0 更新后，会再触发改函数更新，导致自动加上了 border-radius: 0px 的样式
             * 所以从如果当前值为 0 且  props.style[BORDER_RADIUS_PROPERTY.BorderRadius] 不存在值，不需要触发更新
             */

            if (!value && !props.style[BORDER_RADIUS_PROPERTY.BorderRadius]) {
                return;
            }

            borderRadius.BorderRadius = value;

            updateStyle({
                [BORDER_RADIUS_PROPERTY.BorderRadius]: `${value}${unit}`
            });
        };

        const isBorderSetting = () => {
            let isSetting = false;

            Object.values(BORDER_PROPERTY).forEach(name => {
                if (getSettingFlag(name)) {
                    isSetting = true;
                }
            });

            return isSetting;
        };

        const selectBorder = type => {
            if (type) {
                state.activedBorder = type;
            }
        };

        const isBorderSelected = type => type === state.activedBorder;

        const isBorderStyleSetting = () => {
            let isSetting = false;
            const propertyName = BORDER_STYLE[state.activedBorder];

            if (propertyName) {
                isSetting = getSettingFlag(propertyName);
            }

            return isSetting;
        };

        const styleOptionDefs = [
            { key: 'none', icon: 'cross', value: BORDER_STYLE_TYPE.None },
            {
                key: 'solid',
                icon: 'border-style-solid',
                value: BORDER_STYLE_TYPE.Solid
            },
            {
                key: 'dashed',
                icon: 'border-style-dashed',
                value: BORDER_STYLE_TYPE.Dashed
            },
            {
                key: 'dotted',
                icon: 'border-style-dotted',
                value: BORDER_STYLE_TYPE.Dotted
            }
        ];

        const styleOptions = computed(() =>
            styleOptionDefs.map(({ key, icon, value }) => ({
                icon,
                value,
                content: t(
                    `designer.settings.styles.border.styleOptions.${key}`
                )
            }))
        );

        const colorPlaceholder = computed(() => {
             
            void locale.value;
            return t('designer.settings.styles.common.colorPlaceholder');
        });

        const styleValue = computed(() => {
            const propertyName = BORDER_STYLE[state.activedBorder];
            return getPropertyValue(propertyName);
        });

        const selectBorderStyle = type => {
            if (type) {
                const propertyName = BORDER_STYLE[state.activedBorder];

                if (propertyName) {
                    updateStyle({ [propertyName]: type });
                }
            }
        };

        const borderWidthValue = computed(() => {
            let property = {};
            const propertyName = BORDER_WIDTH[state.activedBorder];

            if (propertyName) {
                property = getProperty(propertyName);
            }

            return property;
        });

        const isBorderWidthSetting = () => {
            let isSetting = false;
            const propertyName = BORDER_WIDTH[state.activedBorder];

            if (propertyName) {
                isSetting = getSettingFlag(propertyName);
            }

            return isSetting;
        };

        const isBorderColorSetting = () => {
            let isSetting = false;
            const propertyName = BORDER_COLOR[state.activedBorder];

            if (propertyName) {
                isSetting = getSettingFlag(propertyName);
            }

            return isSetting;
        };

        const borderColorValue = computed(() => {
            let color = '';
            const propertyName = BORDER_COLOR[state.activedBorder];

            if (propertyName) {
                color = getPropertyValue(propertyName);
            }

            return color;
        });

        const changeBorderColor = value => {
            const propertyName = BORDER_COLOR[state.activedBorder];
            const val = value?.target?.value || value || '';

            if (propertyName) {
                updateStyle({ [propertyName]: val });
            }
        };

        const shouldOpenSetting = propertyName => {
            const checkMethodMap = {
                [BORDER_RADIUS_PROPERTY.BorderRadius]: isRadiusSetting,
                [BORDER_PROPERTY.Border]: isBorderSetting,
                [BORDER_PROPERTY.BorderStyle]: isBorderStyleSetting,
                [BORDER_PROPERTY.BorderWidth]: isBorderWidthSetting,
                [BORDER_PROPERTY.BorderColor]: isBorderColorSetting
            };

            return checkMethodMap[propertyName]?.();
        };

        const openSetting = (propertyName, event) => {
            if (shouldOpenSetting(propertyName)) {
                activedName = propertyName;
                setPosition(event);
                state.showModal = true;
            }
        };

        return {
            borderColorValue,
            borderWidthValue,
             
            RADIUS_SETTING,
             
            BORDER_SETTING,
             
            BORDER_STYLE_TYPE,
             
            BORDER_PROPERTY,
             
            BORDER_RADIUS_PROPERTY,
            state,
            reset,
            styleOptions,
            styleValue,
            borderRadius,
            radiusOptions,
            radiusSelected,
            updateStyle,
            openSetting,
            getProperty,
            getSettingFlag,
            selectRadius,
            isRadiusSelected,
            isRadiusSetting,
            updateRadiusSingle,
            isBorderSetting,
            selectBorder,
            isBorderSelected,
            isBorderStyleSetting,
            selectBorderStyle,
            isBorderWidthSetting,
            isBorderColorSetting,
            changeBorderColor,
            colorPlaceholder,
            t
        };
    }
};
</script>

<!-- eslint-disable-next-line vue/max-lines-per-block, vue/block-lang -->
<style lang="less" scoped>
.border-row {
    display: flex;
    .border-col {
        flex: 1;
        display: flex;
        align-items: center;
        padding: 5px 0;

        .border-label {
            color: var(--te-styles-common-text-color-secondary);
            flex: 0 0 40px;
            padding-left: 2px;
            margin-right: 2px;
            line-height: 28px;
        }
    }
    svg {
        color: var(--te-styles-border-icon-color);
    }
}
.item-row {
    margin-bottom: var(--te-common-vertical-form-label-spacing);
}
.radius-row {
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    margin-bottom: var(--te-common-vertical-item-spacing-normal);
    svg {
        color: var(--te-styles-border-icon-color);
        font-size: 16px;
    }

    .radius-label {
        flex: 0 0 48px;
        line-height: 24px;
        color: var(--te-styles-common-text-color-secondary);
    }

    .radius-content {
        flex: auto;
        align-items: center;
        display: flex;
        gap: 4px;

        .radius-btn-group:deep(ul) {
            width: 48px;
        }

        .radius-content-svg {
            &:hover,
            &.selected {
                color: var(--te-styles-border-icon-color-active);
                svg {
                    color: var(--te-styles-border-icon-color-active);
                }
            }

            .radius-svg {
                margin: auto;
            }

            .radius-auto {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: center;
            }
        }

        .radius-content-input {
            margin-left: 4px;

            :deep(.slider-container) {
                grid-template-columns: 64px 1fr;
                column-gap: 8px;
            }

            :deep(.meta-numeric-input) {
                width: 70px;
            }

            :deep(.tiny-input__suffix) {
                right: 0;
            }
        }
    }
}

.border-label,
.radius-label {
    span {
        padding: 2px;
    }
}

.radius-multiple-container {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 6px;
    column-gap: 18px;
    & > div {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    svg {
        font-size: 14px;
    }
}

.border-label {
    color: var(--te-styles-common-text-color-secondary);
    flex-shrink: 0;
}
.border-container {
    display: flex;
    flex-direction: row;
    gap: 12px;
    & .position-selector {
        width: 82px;
        height: 82px;
        background-color: var(--te-styles-border-bg-color);
        border-radius: 4px;
        padding: 4px;
        display: grid;
        grid-template-rows: repeat(3, 1fr);
        grid-template-columns: repeat(3, 1fr);
    }
    & .svg-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        & > .svg-icon {
            font-size: 14px;
        }
        &.center {
            grid-area: 2 / 2;
        }
        &.left {
            grid-area: 2 / 1;
        }
        &.right {
            grid-area: 2 / 3;
        }
        &.top {
            grid-area: 1 / 2;
        }
        &.bottom {
            grid-area: 3 / 2;
        }
        &.selected {
            background-color: var(--te-styles-border-bg-color-active);
            border-radius: 4px;
        }
    }
    & .inputs {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
        & .input-row {
            display: flex;
            align-items: center;
            gap: 12px;
            height: 24px;
        }
    }
    & .styles-container {
        flex: 1;
        display: flex;
        justify-content: space-between;
    }
}

.is-setting {
    span {
        border-radius: 2px;
        color: var(--te-styles-common-setting-text-color);
        background: var(--te-styles-common-setting-bg-color);
        cursor: pointer;
    }
}
</style>
