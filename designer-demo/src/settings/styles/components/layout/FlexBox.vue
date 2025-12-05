<template>
    <div class="container-flex">
        <div v-for="(item, index) in layoutOpts" :key="index" class="flex-item">
            <span
                :class="[
                    'title',
                    { 'is-setting': getSettingFlag(hyphenate(item.key)) }
                ]"
                @click="openSetting(hyphenate(item.key), $event)"
                >{{ item.title }}</span>
            <div>
                <radio-configurator
                    :options="item.btnList"
                    :value="item.picked"
                    @picked-change="args => select(args, item)"
                />
            </div>
        </div>
    </div>
    <modal-mask v-if="showModal" @close="showModal = false">
        <reset-button @reset="reset" />
    </modal-mask>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
/* metaService: engine.setting.styles.FlexBox */
import { ref, watchEffect, watch } from 'vue';
import { RadioConfigurator } from '@opentiny/tiny-engine-configurator';
import { utils } from '@opentiny/tiny-engine-utils';

import { useDesignerI18n } from '@/services/i18nService';

import ModalMask, { useModal } from '../inputs/ModalMask.vue';
import ResetButton from '../inputs/ResetButton.vue';
import { useProperties } from '../../js/useStyle';
import { FLEX_PROPERTY } from '../../js/styleProperty';

const { hyphenate } = utils;

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        RadioConfigurator,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ModalMask,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ResetButton
    },
    props: {
        style: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        }
    },
    emits: ['update'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        let activedName = '';
        const { t, locale } = useDesignerI18n();

        const sectionDefs = [
            {
                titleKey: 'designer.settings.styles.flex.mainAxis',
                picked: '',
                key: 'flexDirection',
                btnList: [
                    {
                        value: 'flex-direction:row',
                        icon: 'flex-directionrow',
                        tipKey: 'designer.settings.styles.flex.tips.directionRow'
                    },
                    {
                        value: 'flex-direction:row-reverse',
                        icon: 'flex-directionrow-reverse',
                        tipKey: 'designer.settings.styles.flex.tips.directionRowReverse'
                    },
                    {
                        value: 'flex-direction:column',
                        icon: 'flex-directioncolumn',
                        tipKey: 'designer.settings.styles.flex.tips.directionColumn'
                    },
                    {
                        value: 'flex-direction:column-reverse',
                        icon: 'flex-directioncolumn-reverse',
                        tipKey: 'designer.settings.styles.flex.tips.directionColumnReverse'
                    }
                ]
            },
            {
                titleKey: 'designer.settings.styles.flex.mainAlign',
                picked: '',
                key: 'justifyContent',
                btnList: [
                    {
                        value: 'justify-content:flex-start',
                        icon: 'flex-justifyflex-startrow',
                        tipKey: 'designer.settings.styles.flex.tips.justifyStart'
                    },
                    {
                        value: 'justify-content:flex-end',
                        icon: 'flex-justifyflex-endrow',
                        tipKey: 'designer.settings.styles.flex.tips.justifyEnd'
                    },
                    {
                        value: 'justify-content:center',
                        icon: 'flex-justifycenterrow',
                        tipKey: 'designer.settings.styles.flex.tips.justifyCenter'
                    },
                    {
                        value: 'justify-content:space-between',
                        icon: 'flex-justifyspace-betweenrow',
                        tipKey: 'designer.settings.styles.flex.tips.justifySpaceBetween'
                    },
                    {
                        value: 'justify-content:space-around',
                        icon: 'flex-justifyspace-aroundrow',
                        tipKey: 'designer.settings.styles.flex.tips.justifySpaceAround'
                    }
                ]
            },
            {
                titleKey: 'designer.settings.styles.flex.crossAlign',
                picked: '',
                key: 'alignItems',
                btnList: [
                    {
                        value: 'align-items:flex-start',
                        icon: 'flex-alignflex-startrow',
                        tipKey: 'designer.settings.styles.flex.tips.alignStart'
                    },
                    {
                        value: 'align-items:flex-end',
                        icon: 'flex-alignflex-endrow',
                        tipKey: 'designer.settings.styles.flex.tips.alignEnd'
                    },
                    {
                        value: 'align-items:center',
                        icon: 'flex-aligncenterrow',
                        tipKey: 'designer.settings.styles.flex.tips.alignCenter'
                    },
                    {
                        value: 'align-items:baseline',
                        icon: 'flex-alignbaselinerow',
                        tipKey: 'designer.settings.styles.flex.tips.alignBaseline'
                    },
                    {
                        value: 'align-items:stretch',
                        icon: 'flex-alignstretchrow',
                        tipKey: 'designer.settings.styles.flex.tips.alignStretch'
                    }
                ]
            },
            {
                titleKey: 'designer.settings.styles.flex.wrap',
                picked: '',
                key: 'flexWrap',
                btnList: [
                    {
                        value: 'flex-wrap:nowrap',
                        titleKey:
                            'designer.settings.styles.flex.wrapOptions.nowrap',
                        tipKey: 'designer.settings.styles.flex.tips.wrapNowrap'
                    },
                    {
                        value: 'flex-wrap:wrap',
                        titleKey:
                            'designer.settings.styles.flex.wrapOptions.wrap',
                        tipKey: 'designer.settings.styles.flex.tips.wrapNormal'
                    },
                    {
                        value: 'flex-wrap:wrap-reverse',
                        titleKey:
                            'designer.settings.styles.flex.wrapOptions.wrapReverse',
                        tipKey: 'designer.settings.styles.flex.tips.wrapReverse'
                    }
                ]
            }
        ];

        const layoutOpts = ref(
            sectionDefs.map(section => ({
                ...section,
                title: t(section.titleKey),
                btnList: section.btnList.map(btn => ({
                    ...btn,
                    title: btn.titleKey ? t(btn.titleKey) : '',
                    tip: btn.tipKey ? t(btn.tipKey) : btn.tip || ''
                }))
            }))
        );

        watch(locale, () => {
            layoutOpts.value.forEach((section, index) => {
                const def = sectionDefs[index];
                section.title = t(def.titleKey);
                section.btnList.forEach((btn, btnIndex) => {
                    const btnDef = def.btnList[btnIndex];
                    btn.title = btnDef.titleKey ? t(btnDef.titleKey) : '';
                    btn.tip = btnDef.tipKey ? t(btnDef.tipKey) : btn.tip || '';
                });
            });
        });

        const { setPosition } = useModal();
        const showModal = ref(false);

        const { getSettingFlag } = useProperties({
            names: Object.values(FLEX_PROPERTY),
            parseNumber: true
        });

        const updateStyle = property => {
            emit('update', property);
        };

        const select = (type, item) => {
            item.picked = type;
            if (type?.includes(':')) {
                const styleArr = type.split(':');
                updateStyle({ [styleArr[0]]: styleArr[1] });
            }
        };

        const openSetting = (name, event) => {
            if (getSettingFlag(name)) {
                activedName = name;
                setPosition(event);
                showModal.value = true;
            }
        };

        const reset = () => {
            updateStyle({ [activedName]: null });
            showModal.value = false;
        };

        watchEffect(() => {
            const value = props.style;
            if (value) {
                layoutOpts.value.forEach(item => {
                    if (value[item.key]) {
                        item.picked = `${hyphenate(item.key)}:${
                            value[item.key]
                        }`;
                    } else {
                        item.picked = '';
                    }
                });
            }
        });

        return {
            layoutOpts,
            showModal,
            hyphenate,
            getSettingFlag,
            select,
            openSetting,
            reset,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.container-flex {
    margin-top: 10px;
}
.flex-item {
    display: flex;
    align-items: center;
    padding: 5px 0;
}
.title {
    margin-right: 10px;
    color: var(--te-styles-common-text-color-secondary);
}
.flex-item :deep(.radio-button) {
    padding: 5px;
}
</style>
