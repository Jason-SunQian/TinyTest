<!-- eslint-disable vue/max-lines-per-block, vue/no-bare-strings-in-template -->
<template>
    <div class="typography-wrap">
        <div class="typography-font-row split">
            <div class="font-left typography-col">
                <label
                    :class="[
                        'typography-label',
                        {
                            'is-setting':
                                getSettingFlag(TYPO_PROPERTY.FontWeight) ||
                                getSettingFlag(TYPO_PROPERTY.FontFamily)
                        }
                    ]"
                    @click="
                        openSetting(
                            `${TYPO_PROPERTY.FontFamily},${TYPO_PROPERTY.FontWeight}`,
                            $event
                        )
                    "
                >
                    <span>{{
                        t('designer.settings.styles.typography.font')
                    }}</span>
                </label>

                <div class="typography-select">
                    <select-configurator
                        v-model="state.fontFamilyValue"
                        :options="fontFamilyOptions"
                        allow-create
                        filterable
                        default-first-option
                        @update:model-value="selectFontFamily"
                    />
                </div>
            </div>

            <div class="font-right typography-col">
                <div class="typography-select">
                    <select-configurator
                        v-model="state.value"
                        :options="selectOptions"
                        allow-create
                        filterable
                        default-first-option
                        @update:model-value="selectFontWeight"
                    />
                </div>
            </div>
        </div>

        <div class="typography-row font-split">
            <div class="left typography-col">
                <label
                    :class="[
                        'typography-label',
                        { 'is-setting': getSettingFlag(TYPO_PROPERTY.FontSize) }
                    ]"
                    @click="openSetting(TYPO_PROPERTY.FontSize, $event)"
                >
                    <span>{{
                        t('designer.settings.styles.typography.size')
                    }}</span>
                </label>
                <div class="font-size">
                    <select-configurator
                        v-model="state.sizeValue"
                        :options="sizeOptions"
                        :placeholder="selectPlaceholder"
                        allow-create
                        filterable
                        default-first-option
                        @update:model-value="selectFontSize"
                    />
                    px
                </div>
            </div>

            <div class="right typography-col">
                <label
                    :class="[
                        'typography-label',
                        {
                            'is-setting': getSettingFlag(
                                TYPO_PROPERTY.LineHeight
                            )
                        }
                    ]"
                    @click="openSetting(TYPO_PROPERTY.LineHeight, $event)"
                >
                    <span>{{
                        t('designer.settings.styles.typography.lineHeight')
                    }}</span>
                </label>
                <numeric-select
                    :name="getProperty(TYPO_PROPERTY.LineHeight).name"
                    :numerical-text="getProperty(TYPO_PROPERTY.LineHeight).text"
                    @update="updateStyle"
                />
            </div>
        </div>

        <div class="typography-row">
            <div class="left">
                <label
                    :class="[
                        'typography-label',
                        { 'is-setting': getSettingFlag(TYPO_PROPERTY.Color) }
                    ]"
                    @click="openSetting(TYPO_PROPERTY.Color, $event)"
                >
                    <span>{{
                        t('designer.settings.styles.typography.color')
                    }}</span>
                </label>
                <div class="color-wrap">
                    <color-configurator
                        :key="colorPlaceholder"
                        :model-value="getProperty(TYPO_PROPERTY.Color).value"
                        :placeholder="colorPlaceholder"
                        @change="changeColor"
                    />
                </div>
            </div>
        </div>
        <div class="typography-row">
            <div class="left">
                <label
                    :class="[
                        'typography-label',
                        {
                            'is-setting': getSettingFlag(
                                TYPO_PROPERTY.TextAlign
                            )
                        }
                    ]"
                    @click="openSetting(TYPO_PROPERTY.TextAlign, $event)"
                >
                    <span>{{
                        t('designer.settings.styles.typography.align')
                    }}</span>
                </label>
            </div>
            <tabs-group-configurator
                :options="alignOptions"
                :model-value="selectedAlign"
                :label-width="52"
                :effect="effect"
                :placement="placement"
                @update:model-value="selectAlign"
            />
        </div>
        <div class="typography-style-row">
            <div class="style-left">
                <label
                    :class="[
                        'typography-label',
                        {
                            'is-setting':
                                getSettingFlag(TYPO_PROPERTY.FontStyle) ||
                                getSettingFlag(TYPO_PROPERTY.TextDecoration)
                        }
                    ]"
                    title="font-style"
                    @click="
                        openSetting(
                            `${TYPO_PROPERTY.FontStyle},${TYPO_PROPERTY.TextDecoration}`,
                            $event
                        )
                    "
                >
                    <span>{{
                        t('designer.settings.styles.typography.style')
                    }}</span>
                </label>
            </div>
            <div class="style-decoration-wrap">
                <tabs-group-configurator
                    :options="styleOptions"
                    :model-value="selectedFontStyle"
                    :label-width="32"
                    :effect="effect"
                    :placement="placement"
                    @update:model-value="selectFontStyle"
                />
                <tabs-group-configurator
                    :options="decorationOptions"
                    :model-value="selectedTextDecoration"
                    :label-width="32"
                    :effect="effect"
                    :placement="placement"
                    @update:model-value="selectTextDecoration"
                />
            </div>
        </div>
        <modal-mask v-if="showModal" @close="showModal = false">
            <reset-button @reset="reset" />
        </modal-mask>
    </div>
</template>

<!-- eslint-disable vue/max-lines-per-block, vue/block-lang, vue/component-api-style, @typescript-eslint/naming-convention, max-lines, no-void, vue/require-typed-object-prop -->
<script lang="ts">
/* metaService: engine.setting.styles.TypographyGroup */
import { ref, reactive, computed } from 'vue';
import {
    SelectConfigurator,
    TabsGroupConfigurator
} from '@opentiny/tiny-engine-configurator';

import ColorConfigurator from '@/components/i18n-wrappers/ColorConfigurator/index.vue';
import { useDesignerI18n } from '@/services/i18nService';

import NumericSelect from '../inputs/NumericSelect.vue';
import { TYPO_PROPERTY } from '../../js/styleProperty';
import useEvent from '../../js/useEvent';
import { useProperties } from '../../js/useStyle';
import ModalMask, { useModal } from '../inputs/ModalMask.vue';
import ResetButton from '../inputs/ResetButton.vue';

export default {
    components: {
         
        NumericSelect,
         
        ModalMask,
         
        ResetButton,
         
        ColorConfigurator,
         
        SelectConfigurator,
         
        TabsGroupConfigurator
    },
    props: {
         
        style: {
            type: Object,
            default: () => ({})
        },
        effect: {
            type: String,
            default: 'dark'
        },
        placement: {
            type: String,
            default: 'top'
        }
    },
    emits: useEvent(),
     
    setup(props, { emit }) {
        let activedName = '';
        const showModal = ref(false);
        const { getProperty, getSettingFlag } = useProperties({
            names: Object.values(TYPO_PROPERTY),
            parseNumber: true
        });
        const { setPosition } = useModal();
        const { t, locale } = useDesignerI18n();

        const fontFamilyDefs = [
            {
                key: 'microsoftYaHei',
                value: '"Microsoft YaHei", "微软雅黑", sans-serif'
            },
            { key: 'pingFang', value: 'PingFang SC' },
            { key: 'simHei', value: 'SimHei' },
            { key: 'simSun', value: 'SimSun' },
            { key: 'arial', value: 'Arial, "Helvetica Neue", Helvetica' },
            { key: 'bitter', value: 'Bitter' },
            { key: 'changaOne', value: '"Changa One", Impact' },
            { key: 'droidSans', value: '"Droid Sans"' },
            { key: 'droidSerif', value: '"Droid Serif"' },
            { key: 'exo', value: 'Exo' },
            { key: 'georgia', value: 'Georgia, Times, "Times New Roman"' },
            { key: 'greatVibes', value: '"Great Vibes"' },
            {
                key: 'impact',
                value: 'Impact, Haettenschweiler, "Franklin Gothic Bold", Charcoal'
            },
            { key: 'inconsolata', value: 'Inconsolata' },
            { key: 'lato', value: 'Lato' },
            { key: 'merriweather', value: 'Merriweather' },
            { key: 'montserrat', value: 'Montserrat' },
            { key: 'openSans', value: '"Open Sans"' },
            { key: 'oswald', value: 'Oswald' },
            { key: 'ptSans', value: '"PT Sans"' },
            { key: 'ptSerif', value: '"PT Serif"' },
            {
                key: 'palatino',
                value: '"Palatino Linotype", "Book Antiqua", Palatino'
            },
            { key: 'tahoma', value: 'Tahoma, Verdana, Segoe' },
            {
                key: 'timesNewRoman',
                value: '"Times New Roman", TimesNewRoman, Times, Baskerville, Georgia'
            },
            {
                key: 'trebuchetMs',
                value: '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Tahoma'
            },
            { key: 'ubuntu', value: 'Ubuntu, Helvetica' },
            { key: 'varela', value: 'Varela' },
            { key: 'varelaRound', value: '"Varela Round"' },
            { key: 'verdana', value: 'Verdana, Geneva' },
            { key: 'vollkorn', value: 'Vollkorn' },
            {
                key: 'systemUi',
                value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue"'
            }
        ];

        const fontFamilyOptions = computed(() =>
            fontFamilyDefs.map(({ key, value }) => ({
                value,
                label: t(
                    `designer.settings.styles.typography.fontFamily.${key}`
                )
            }))
        );

        const weightDefs = [
            { key: 'thin', value: '100' },
            { key: 'normal', value: '400' },
            { key: 'bold', value: '700' },
            { key: 'black', value: '900' }
        ];

        const selectOptions = computed(() =>
            weightDefs.map(({ key, value }) => ({
                value,
                label: t(
                    `designer.settings.styles.typography.fontWeight.${key}`
                )
            }))
        );

        const sizes = ['9', '10', '11', '12', '14', '16', '18', '20', '24'];
        const sizeOptions = computed(() =>
            sizes.map(size => ({ label: size, value: size }))
        );

        const alignOptionDefs = [
            { key: 'left', icon: 'text-align-left', value: 'left' },
            { key: 'center', icon: 'text-align-center', value: 'center' },
            { key: 'right', icon: 'text-align-right', value: 'right' },
            { key: 'justify', icon: 'text-align-justify', value: 'justify' }
        ];

        const alignOptions = computed(() =>
            alignOptionDefs.map(({ key, icon, value }) => ({
                icon,
                value,
                content: t(
                    `designer.settings.styles.typography.alignOptions.${key}`
                )
            }))
        );

        const styleOptionDefs = [
            { key: 'regular', icon: 'font-style-none', value: 'normal' },
            { key: 'italic', icon: 'font-style-italic', value: 'italic' }
        ];

        const styleOptions = computed(() =>
            styleOptionDefs.map(({ key, icon, value }) => ({
                icon,
                value,
                content: t(
                    `designer.settings.styles.typography.styleOptions.${key}`
                )
            }))
        );

        const decorationOptionDefs = [
            { key: 'none', icon: 'cross', value: 'none' },
            {
                key: 'strike',
                icon: 'text-decoration-strike',
                value: 'line-through'
            },
            {
                key: 'underline',
                icon: 'text-decoration-underline',
                value: 'underline'
            },
            {
                key: 'overline',
                icon: 'text-decoration-overline',
                value: 'overline'
            }
        ];

        const decorationOptions = computed(() =>
            decorationOptionDefs.map(({ key, icon, value }) => ({
                icon,
                value,
                content: t(
                    `designer.settings.styles.typography.decorationOptions.${key}`
                )
            }))
        );

        const selectPlaceholder = computed(() => {
            void locale.value;
            return t('designer.settings.styles.common.selectPlaceholder');
        });

        const colorPlaceholder = computed(() => {
            void locale.value;
            return t('designer.settings.styles.common.colorPlaceholder');
        });

        const openSetting = (name, event) => {
            let hasSettingFlag = false;
            if (name.includes(',')) {
                hasSettingFlag = name.split(',').some(item => {
                    return getSettingFlag(item);
                });
            } else {
                hasSettingFlag = Boolean(getSettingFlag(name));
            }
            if (hasSettingFlag) {
                setPosition(event);
                activedName = name;
                showModal.value = true;
            }
        };

        const state = reactive({
            value: '400',
            fontFamilyValue: '"Microsoft YaHei", "微软雅黑", sans-serif',
            sizeValue: ''
        });

        const selectedAlign = ref('');

        const selectedFontStyle = ref('');

        const selectedTextDecoration = ref('');

        const updateStyle = property => {
            emit('update', property);
        };

        const reset = () => {
            if (activedName.includes(',')) {
                activedName.split(',').forEach(name => {
                    updateStyle({ [name]: null });
                });
            } else {
                updateStyle({ [activedName]: null });
            }
            if (
                activedName.includes(TYPO_PROPERTY.FontFamily) ||
                activedName.includes(TYPO_PROPERTY.FontWeight)
            ) {
                state.value = '400';
                state.fontFamilyValue = 'Arial, "Helvetica Neue", Helvetica';
            }
            if (
                activedName.includes(TYPO_PROPERTY.FontStyle) ||
                activedName.includes(TYPO_PROPERTY.TextDecoration)
            ) {
                selectedFontStyle.value = '';
                selectedTextDecoration.value = '';
            }
            if (activedName.includes(TYPO_PROPERTY.TextAlign)) {
                selectedAlign.value = '';
            }
            showModal.value = false;
        };

        const changeColor = value => {
            const propertyName = TYPO_PROPERTY.Color;
            const val = value?.target?.value || value || '';

            if (propertyName) {
                updateStyle({ [propertyName]: val });
            }
        };

        const selectAlign = type => {
            if (type) {
                selectedAlign.value = type;
                updateStyle({ 'text-align': type });
            }
        };

        const selectFontStyle = type => {
            if (type) {
                selectedFontStyle.value = type;
                updateStyle({ 'font-style': type });
            }
        };

        const selectTextDecoration = type => {
            if (type) {
                selectedTextDecoration.value = type;
                updateStyle({ 'text-decoration': type });
            }
        };

        const selectFontWeight = type => {
            if (type) {
                updateStyle({ 'font-weight': type });
            }
        };

        const selectFontSize = type => {
            if (type) {
                updateStyle({ 'font-size': `${type}px` });
            }
        };

        const selectFontFamily = type => {
            if (type) {
                updateStyle({ [TYPO_PROPERTY.FontFamily]: type });
            }
        };

        return {
            TYPO_PROPERTY,
            getProperty,
            getSettingFlag,
            changeColor,
            selectFontFamily,
            selectFontWeight,
            selectFontSize,
            selectAlign,
            selectFontStyle,
            selectTextDecoration,
            reset,
            openSetting,
            updateStyle,
            selectedAlign,
            selectedFontStyle,
            selectedTextDecoration,
            selectOptions,
            sizeOptions,
            fontFamilyOptions,
            alignOptions,
            styleOptions,
            decorationOptions,
            selectPlaceholder,
            colorPlaceholder,
            showModal,
            state,
            t
        };
    }
};
</script>

<!-- eslint-disable-next-line vue/block-lang, vue/max-lines-per-block -->
<style lang="less" scoped>
.typography-wrap {
    span {
        color: var(--te-styles-common-text-color-secondary);
        padding: 2px;
    }
    .typography-row {
        display: grid;
        gap: 4px 20px;
        grid-template-columns: 15px 1fr;
        align-items: center;
        margin-bottom: var(--te-common-vertical-item-spacing-normal);
        &:last-child {
            margin-bottom: 0;
        }

        &.split {
            grid-template-columns: 45% auto;
        }

        &.font-split {
            gap: 4px 8px;
            grid-template-columns: 56% auto;
        }

        &.more {
            grid-template-columns: 1fr;
        }

        .typography-label {
            margin-right: -16px;
            line-height: 16px;

            .font-family-col {
                width: 118px;
            }

            .font-weight-col {
                width: 84px;
            }
        }

        .typography-style {
            display: grid;
            gap: 4px 8px;
            grid-template-columns: 2fr 4fr;
        }

        .typography-italicize {
            grid-row-start: 2;
            justify-self: center;
            cursor: default;
        }

        .typography-decoration {
            justify-self: center;
            cursor: default;
        }

        .left {
            display: grid;
            align-items: center;
            gap: 4px 20px;
        }
        .right {
            display: grid;
            align-items: center;
            gap: 4px 8px;
        }

        .left {
            grid-template-columns: 23px 1fr;
        }

        .right {
            grid-template-columns: 40px 1fr;
            .typography-label {
                margin-right: 0;
            }
        }

        & > div {
            width: 100%;
        }
        .color-wrap {
            width: 210px;
        }
        .font-size {
            display: flex;
            font-size: 12px;
            color: var(--te-styles-common-text-color-weaken);
            align-items: center;
            gap: 4px;
        }
    }

    .typography-font-row {
        display: grid;
        gap: 4px 8px;
        grid-template-columns: 63% 1fr;
        align-items: center;
        margin-bottom: 8px;

        .font-left {
            display: grid;
            align-items: center;
            gap: 4px 20px;
        }
        .font-right {
            display: grid;
            align-items: center;
            gap: 4px 8px;
        }

        .font-left {
            grid-template-columns: 23px 1fr;
        }
    }

    .typography-style-row {
        display: grid;
        gap: 4px 20px;
        grid-template-columns: 15px 1fr;
        align-items: center;
        margin-bottom: 8px;
        color: var(--te-styles-common-text-color-secondary);

        .style-left {
            display: grid;
            align-items: center;
            gap: 4px 15px;
        }
        .style-right {
            display: grid;
            align-items: center;
            gap: 4px 8px;
        }

        .style-left {
            grid-template-columns: 28px 1fr;
        }

        .style-decoration-wrap {
            display: flex;
            gap: 18px;
        }
    }

    .typography-label {
        color: var(--te-styles-common-text-color-secondary);
    }
    .is-setting {
        span {
            cursor: pointer;
            border-radius: 2px;
            color: var(--te-styles-common-setting-text-color);
            background-color: var(--te-styles-common-setting-bg-color);
        }
    }
}
</style>
