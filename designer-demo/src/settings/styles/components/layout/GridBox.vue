<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <div class="grid-box-container">
        <tiny-popover
            placement="top-start"
            width="264"
            popper-class="toolbar-media-popper grid-edit-popper"
            append-to-body
            @show="state.showMask = true"
            @hide="state.showMask = false"
        >
            <template #reference>
                <div class="grid-edit">
                    <div class="grid-edit-btn">
                        <svg-icon name="pencil-thick" />
                        <span class="text">{{ texts.edit }}</span>
                        <span>{{
                            t('designer.settings.styles.grid.dot')
                        }}</span>
                    </div>
                </div>
            </template>
            <div class="grid-edit-wrap">
                <div class="grid-edit-spacing">
                    <div class="gap">
                        <span
                            :class="[
                                'gap-label',
                                { 'is-setting': getGapSetting() }
                            ]"
                            @click="openSetting(GRID_PROPERTY.GridGap, $event)"
                            >{{ texts.columnGap }}</span>
                        <numeric-select
                            :name="
                                getProperty(GRID_PROPERTY.GridColumnGap).name
                            "
                            :numerical-text="
                                getProperty(GRID_PROPERTY.GridColumnGap).text
                            "
                            @update="updateStyle"
                        />
                        <svg-icon :name="state.icon" />
                        <span
                            :class="[
                                'gap-label',
                                { 'is-setting': getGapSetting() }
                            ]"
                            @click="openSetting(GRID_PROPERTY.GridGap, $event)"
                            >{{ texts.rowGap }}</span>
                        <numeric-select
                            :name="getProperty(GRID_PROPERTY.GridRowGap).name"
                            :numerical-text="
                                getProperty(GRID_PROPERTY.GridRowGap).text
                            "
                            @update="updateStyle"
                        />
                    </div>
                    <div class="direction">
                        <span
                            :class="[
                                'direction-label',
                                {
                                    'is-setting': getSettingFlag(
                                        GRID_PROPERTY.GridAutoFlow
                                    )
                                }
                            ]"
                            @click="
                                openSetting(GRID_PROPERTY.GridAutoFlow, $event)
                            "
                            >{{ texts.direction }}</span>
                        <radio-configurator
                            :options="state.direction"
                            :value="state.picked"
                            :disabled="true"
                            @picked-change="select"
                        />
                    </div>
                    <div class="dense">
                        <input
                            id="dense"
                            v-model="state.densePicked"
                            type="checkbox"
                            name="dense"
                            value="dense"
                            @change="denseChange"
                        >
                        <label for="dense">{{ texts.dense }}</label>
                        <tiny-tooltip
                            :open-delay="500"
                            :content="texts.denseTip"
                            effect="light"
                        >
                            <svg-icon
                                class="btn-icon"
                                name="plugin-icon-plugin-help"
                            />
                        </tiny-tooltip>
                    </div>
                </div>
                <div class="grid-edit-layout">
                    <div
                        v-for="(item, index) in state.metaOptions"
                        :key="index"
                        class="layout-item"
                    >
                        <div class="top">
                            <span>{{ item.label }}</span>
                            <span class="add" @click="addItem(item)">{{
                                texts.add
                            }}</span>
                        </div>
                        <meta-list-items :options-list="item.list">
                            <template #content="{ data }">
                                <svg-icon :name="data.icon" />
                                <span class="text">{{ data.text }}</span>
                            </template>
                            <template #operate="{ data }">
                                <tiny-tooltip
                                    class="item"
                                    effect="light"
                                    :open-delay="500"
                                    :content="texts.copy"
                                    placement="top"
                                >
                                    <span class="item-icon">
                                        <svg-icon
                                            name="copy"
                                            @click="copyItem(item.list, data)"
                                        />
                                    </span>
                                </tiny-tooltip>
                                <tiny-tooltip
                                    class="item"
                                    effect="light"
                                    :open-delay="500"
                                    :content="texts.delete"
                                    placement="top"
                                >
                                    <span class="item-icon">
                                        <svg-icon
                                            name="delete"
                                            @click="deleteItem(item.list, data)"
                                        />
                                    </span>
                                </tiny-tooltip>
                            </template>
                        </meta-list-items>
                    </div>
                </div>
            </div>
        </tiny-popover>

        <div class="grid-item-wrap">
            <div
                v-for="(item, index) in state.gridOptions"
                :key="index"
                class="grid-item"
            >
                <span
                    :class="[
                        'grid-label',
                        { 'is-setting': getPropSetting(item.name) }
                    ]"
                    @click="openSetting(item.name, $event)"
                    >{{ item.title }}</span>
                <div class="radio-wrap">
                    <radio-configurator
                        :options="item.align.list"
                        :value="item.align.picked"
                        @picked-change="args => select(args, item.align)"
                    />
                    <radio-configurator
                        :options="item.justify.list"
                        :value="item.justify.picked"
                        @picked-change="args => select(args, item.justify)"
                    />
                </div>
            </div>
        </div>
    </div>
    <modal-mask v-if="state.showModal" @close="state.showModal = false">
        <reset-button @reset="reset" />
    </modal-mask>
    <mask-modal :visible="state.showMask" @close="state.showMask = false" />
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
 
/* metaService: engine.setting.styles.GridBox */
import { reactive, watchEffect, watch } from 'vue';
import { Popover, Tooltip } from '@opentiny/vue';
import { MetaListItems, MaskModal } from '@opentiny/tiny-engine-common';
import { RadioConfigurator } from '@opentiny/tiny-engine-configurator';
import { remove } from '@opentiny/vue-renderless/common/array';

import { useDesignerI18n } from '@/services/i18nService';

import ModalMask, { useModal } from '../inputs/ModalMask.vue';
import ResetButton from '../inputs/ResetButton.vue';
import NumericSelect from '../inputs/NumericSelect.vue';
import { useProperties } from '../../js/useStyle';
import { GRID_PROPERTY } from '../../js/styleProperty';

export default {
    components: {
         
        RadioConfigurator,
         
        ModalMask,
         
        ResetButton,
         
        MetaListItems,
         
        NumericSelect,
         
        MaskModal,
         
        TinyPopover: Popover,
         
        TinyTooltip: Tooltip
    },
    props: {
        style: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        }
    },
    emits: ['update'],
     
    setup(props, { emit }) {
        let activedName = [];

        const { setPosition } = useModal();
        const { t, locale } = useDesignerI18n();

        const directionDefs = [
            {
                value: 'grid-auto-flow:row',
                textKey: 'row',
                tipKey: 'row'
            },
            {
                value: 'grid-auto-flow:column',
                textKey: 'column',
                tipKey: 'column'
            }
        ];

        const gridOptionDefs = [
            {
                name: 'Align',
                titleKey: 'designer.settings.styles.grid.align.title',
                alignKey: 'align-items',
                alignOptions: [
                    {
                        value: 'align-items:start',
                        tipKey: 'alignItems.start',
                        icon: 'align-items-start'
                    },
                    {
                        value: 'align-items:center',
                        tipKey: 'alignItems.center',
                        icon: 'align-items-center'
                    },
                    {
                        value: 'align-items:end',
                        tipKey: 'alignItems.end',
                        icon: 'align-items-end'
                    },
                    {
                        value: 'align-items:stretch',
                        tipKey: 'alignItems.stretch',
                        icon: 'align-content-stretch'
                    },
                    {
                        value: 'align-items:baseline',
                        tipKey: 'alignItems.baseline',
                        icon: 'align-items-baseline'
                    }
                ],
                justifyKey: 'justify-items',
                justifyOptions: [
                    {
                        value: 'justify-items:start',
                        tipKey: 'justifyItems.start',
                        icon: 'justify-items-start'
                    },
                    {
                        value: 'justify-items:center',
                        tipKey: 'justifyItems.center',
                        icon: 'justify-items-center'
                    },
                    {
                        value: 'justify-items:end',
                        tipKey: 'justifyItems.end',
                        icon: 'justify-items-end'
                    },
                    {
                        value: 'justify-items:stretch',
                        tipKey: 'justifyItems.stretch',
                        icon: 'justify-items-stretch'
                    },
                    {
                        value: 'justify-items:baseline',
                        tipKey: 'justifyItems.baseline',
                        icon: 'justify-items-baseline'
                    }
                ]
            },
            {
                name: 'Distribute',
                titleKey: 'designer.settings.styles.grid.distribute.title',
                alignKey: 'align-content',
                alignOptions: [
                    {
                        value: 'align-content:start',
                        tipKey: 'alignContent.start',
                        icon: 'align-content-start'
                    },
                    {
                        value: 'align-content:center',
                        tipKey: 'alignContent.center',
                        icon: 'align-content-center'
                    },
                    {
                        value: 'align-content:end',
                        tipKey: 'alignContent.end',
                        icon: 'align-content-end'
                    },
                    {
                        value: 'align-content:stretch',
                        tipKey: 'alignContent.stretch',
                        icon: 'align-content-stretch'
                    },
                    {
                        value: 'align-content:space-between',
                        tipKey: 'alignContent.spaceBetween',
                        icon: 'align-content-space-between'
                    },
                    {
                        value: 'align-content:space-around',
                        tipKey: 'alignContent.spaceAround',
                        icon: 'align-content-space-around'
                    }
                ],
                justifyKey: 'justify-content',
                justifyOptions: [
                    {
                        value: 'justify-content:start',
                        tipKey: 'justifyContent.start',
                        icon: 'justify-content-start'
                    },
                    {
                        value: 'justify-content:center',
                        tipKey: 'justifyContent.center',
                        icon: 'justify-content-center'
                    },
                    {
                        value: 'justify-content:end',
                        tipKey: 'justifyContent.end',
                        icon: 'justify-content-end'
                    },
                    {
                        value: 'justify-content:stretch',
                        tipKey: 'justifyContent.stretch',
                        icon: 'justify-content-stretch'
                    },
                    {
                        value: 'justify-content:space-between',
                        tipKey: 'justifyContent.spaceBetween',
                        icon: 'justify-content-space-between'
                    },
                    {
                        value: 'justify-content:space-around',
                        tipKey: 'justifyContent.spaceAround',
                        icon: 'justify-content-space-around'
                    }
                ]
            }
        ];

        const metaOptionDefs = [
            {
                type: 'columns',
                labelKey: 'designer.settings.styles.grid.meta.columns',
                defaultText: '1fr',
                icon: 'grid-column-flex'
            },
            {
                type: 'rows',
                labelKey: 'designer.settings.styles.grid.meta.rows',
                defaultText: 'Auto',
                icon: 'grid-row-auto'
            }
        ];

        const texts = reactive({
            edit: '',
            columnGap: '',
            rowGap: '',
            direction: '',
            dense: '',
            denseTip: '',
            add: '',
            copy: '',
            delete: ''
        });

        const state = reactive({
            showModal: false,
            isAlign: false,
            densePicked: false,
            showMask: false,
            icon: 'unlocked',
            picked: '',
            direction: directionDefs.map(item => ({
                value: item.value,
                text: '',
                tip: ''
            })),
            gridOptions: gridOptionDefs.map(def => ({
                name: def.name,
                title: '',
                align: {
                    picked: '',
                    key: def.alignKey,
                    list: def.alignOptions.map(opt => ({
                        value: opt.value,
                        tip: '',
                        icon: opt.icon
                    }))
                },
                justify: {
                    picked: '',
                    key: def.justifyKey,
                    list: def.justifyOptions.map(opt => ({
                        value: opt.value,
                        tip: '',
                        icon: opt.icon
                    }))
                }
            })),
            metaOptions: metaOptionDefs.map(def => ({
                type: def.type,
                label: '',
                list: [
                    { text: def.defaultText, icon: def.icon },
                    { text: def.defaultText, icon: def.icon }
                ]
            }))
        });

        const applyTranslations = () => {
            texts.edit = t('designer.settings.styles.grid.edit');
            texts.columnGap = t('designer.settings.styles.grid.gap.column');
            texts.rowGap = t('designer.settings.styles.grid.gap.row');
            texts.direction = t(
                'designer.settings.styles.grid.direction.title'
            );
            texts.dense = t('designer.settings.styles.grid.dense.label');
            texts.denseTip = t('designer.settings.styles.grid.dense.tip');
            texts.add = t('designer.settings.styles.grid.actions.add');
            texts.copy = t('designer.settings.styles.grid.actions.copy');
            texts.delete = t('designer.settings.styles.grid.actions.delete');

            state.direction.forEach((item, index) => {
                const def = directionDefs[index];
                if (def) {
                    item.text = t(
                        `designer.settings.styles.grid.direction.options.${def.textKey}`
                    );
                    item.tip = t(
                        `designer.settings.styles.grid.direction.tips.${def.tipKey}`
                    );
                }
            });

            state.gridOptions.forEach(option => {
                const def = gridOptionDefs.find(d => d.name === option.name);
                if (!def) {
                    return;
                }

                option.title = t(def.titleKey);

                option.align.list.forEach((listItem, idx) => {
                    const opt = def.alignOptions[idx];
                    if (opt) {
                        listItem.tip = t(
                            `designer.settings.styles.grid.${opt.tipKey}`
                        );
                        listItem.value = opt.value;
                    }
                });

                option.justify.list.forEach((listItem, idx) => {
                    const opt = def.justifyOptions[idx];
                    if (opt) {
                        listItem.tip = t(
                            `designer.settings.styles.grid.${opt.tipKey}`
                        );
                        listItem.value = opt.value;
                    }
                });
            });

            state.metaOptions.forEach((option, index) => {
                const def = metaOptionDefs[index];
                if (def) {
                    option.label = t(def.labelKey);
                }
            });
        };

        applyTranslations();
        watch(locale, applyTranslations);

        const { getProperty, getSettingFlag } = useProperties({
            names: Object.values(GRID_PROPERTY),
            parseNumber: true
        });

        const updateStyle = property => {
            emit('update', property);
        };

        const select = (type, item) => {
            if (type?.includes('grid-auto-flow')) {
                state.picked = type;
            } else {
                item.picked = type;
            }

            if (type?.includes(':')) {
                const styleArr = type.split(':');
                updateStyle({ [styleArr[0]]: styleArr[1] });
            }
        };

        const getPropSetting = name => {
            if (name === 'Align') {
                return (
                    getSettingFlag(GRID_PROPERTY.AlignItems) ||
                    getSettingFlag(GRID_PROPERTY.JustifyItems)
                );
            }
            return (
                getSettingFlag(GRID_PROPERTY.AlignContent) ||
                getSettingFlag(GRID_PROPERTY.JustifyContent)
            );
        };

        const reInit = name => {
            const option = state.gridOptions.find(item => item.name === name);
            option.align.picked = '';
            option.justify.picked = '';
        };

        const reset = () => {
            activedName.forEach(name => {
                updateStyle({ [name]: null });
            });

            if (state.isAlign) {
                reInit('Align');
            } else {
                reInit('Distribute');
            }
            state.picked = '';
            state.showModal = false;
            state.isAlign = false;
        };

        const getGapSetting = () => {
            return (
                getSettingFlag(GRID_PROPERTY.GridColumnGap) ||
                getSettingFlag(GRID_PROPERTY.GridRowGap)
            );
        };

        const openSetting = (name, event) => {
            const isChange =
                getGapSetting() || getPropSetting(name) || getSettingFlag(name);

            if (isChange) {
                switch (name) {
                    case 'Align':
                        state.isAlign = true;
                        activedName = [
                            GRID_PROPERTY.AlignItems,
                            GRID_PROPERTY.JustifyItems
                        ];
                        break;
                    case 'Distribute':
                        activedName = [
                            GRID_PROPERTY.AlignContent,
                            GRID_PROPERTY.JustifyContent
                        ];
                        break;
                    case 'grid-gap':
                        activedName = [
                            GRID_PROPERTY.GridRowGap,
                            GRID_PROPERTY.GridColumnGap
                        ];
                        break;
                    default:
                        activedName = [name];
                        break;
                }

                setPosition(event);
                state.showModal = true;
            }
        };

        const addItem = item => {
            if (item.type === 'columns') {
                item.list?.push({ text: '1fr', icon: 'grid-column-flex' });
            } else {
                item.list?.push({ text: 'Auto', icon: 'grid-row-auto' });
            }
        };

        const copyItem = (list, data) => {
            list.push(data);
        };

        const deleteItem = (list, data) => {
            remove(list, data);
        };

        watchEffect(() => {
            const value = props.style;
            if (value) {
                Object.keys(value).forEach(keys => {
                    state.gridOptions.forEach(item => {
                        if (item.name === keys) {
                            if (keys.includes('align')) {
                                item.align.picked = `${item.align.key}:${value[keys]}`;
                            } else {
                                item.justify.picked = `${item.justify.key}:${value[keys]}`;
                            }
                        } else {
                            item.picked = '';
                        }
                    });
                });
            }
        });

        return {
            state,
             
            GRID_PROPERTY,
            updateStyle,
            select,
            openSetting,
            getProperty,
            getPropSetting,
            getGapSetting,
            getSettingFlag,
            reset,
            addItem,
            copyItem,
            deleteItem,
            texts
        };
    }
};
</script>

<!-- eslint-disable vue/max-lines-per-block -->
<style lang="scss" scoped>
.grid-box-container {
    align-items: center;
    display: grid;
    gap: 8px;
    grid-template-columns: 46px 1fr;
    & > span {
        grid-column: 2 / -1;
    }
    .grid-edit {
        width: 100%;
        padding: 8px 0;
        .grid-edit-btn {
            display: grid;
            column-gap: 4px;
            grid-template-columns: 22px 1fr 20px;
            place-items: center;
            position: relative;
            justify-content: center;
            align-self: center;
            height: 24px;
            padding: 0px 4px;
            border: 1px solid var(--te-styles-common-border-color);
            border-radius: 2px;
            color: var(--te-styles-common-text-color-primary);
            background: var(--te-styles-common-bg-color);
            outline: 0px;
            cursor: pointer;
            user-select: none;
            .text {
                grid-area: 1 / 2 / 2 / 3;
                justify-self: start;
            }
            .svg-icon {
                font-size: 16px;
            }
        }
    }

    .grid-item-wrap {
        grid-column: 1 / -1;
        grid-row-start: 3;
        .grid-item {
            display: grid;
            grid-template-columns: 46px 1fr;
            gap: 8px;
            & + .grid-item {
                margin-top: 8px;
            }
        }
        .grid-label {
            display: inline-block;
            height: 24px;
            line-height: 24px;
            padding-left: 3px;
            width: 54px;
            color: var(--te-styles-common-text-color-secondary);
        }
        .radio-wrap {
            display: grid;
            row-gap: 8px;
        }
    }
    .is-setting {
        color: var(--te-styles-common-setting-text-color);
        background-color: var(--te-styles-common-setting-bg-color);
    }
    :deep(.reference-wrapper) {
        width: 100%;
        display: inline-block;
    }
}
.grid-edit-spacing {
    padding-top: 12px;
    padding-bottom: 12px;
    .gap {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        .style-numeric {
            width: 52px;
        }
        .gap-label {
            color: var(--te-styles-common-text-color-secondary);
        }
    }
    .direction {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 12px;
        color: var(--te-styles-common-text-color-secondary);
        .radio-group {
            width: 180px;
            background-color: var(--te-styles-layout-grid-box-bg-color);
            color: var(--te-styles-common-text-color-secondary);
            border-radius: 4px;
            :deep(.radio-button) {
                color: var(--te-styles-common-text-color-secondary);
                &.active {
                    border-radius: 4px;
                    background-color: var(
                        --te-styles-layout-grid-box-radio-bg-color-active
                    );
                    color: var(--te-styles-common-text-color-primary);
                }
            }
        }
    }
    .dense {
        display: flex;
        align-items: center;
        .btn-icon {
            color: var(--te-styles-layout-grid-box-icon-color);
            margin-left: 4px;
        }
    }
}
.grid-edit-layout {
    .layout-item {
        .top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: var(--te-styles-common-text-color-secondary);
            .add {
                color: var(--te-styles-layout-grid-box-text-color-emphasize);
            }
            background-color: var(--te-styles-layout-grid-box-bg-color);
            height: 24px;
            padding: 3px 8px 3px 16px;
        }
        & + .layout-item {
            margin-top: 15px;
        }
    }
}
.item-icon {
    color: var(--te-styles-layout-grid-box-icon-color);
    .svg-icon {
        font-size: 14px;
    }
    & + .item-icon {
        margin-left: 4px;
    }
}
</style>
