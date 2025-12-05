<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <toolbar-base :options="options">
        <template #default>
            <div class="toolbar-wrap">
                <div class="toolbar-icon-wrap">
                    <span
                        v-for="(item, index) in media"
                        :key="index"
                        :class="[
                            'icon',
                            {
                                active: state.activeIndex === index,
                                'is-rotate': item.view === 'lanMobile'
                            }
                        ]"
                        @click="setViewPort(item)"
                    >
                        <tiny-popover
                            trigger="hover"
                            width="260"
                            append-to-body
                            :open-delay="1000"
                            popper-class="media-icon-popover"
                        >
                            <div class="media-content">
                                <div class="media-title">
                                    <div>
                                        {{ item.title }}
                                        <span
                                            v-if="item.subTitle"
                                            class="sub-title"
                                        >
                                            {{
                                                t(
                                                    'designer.toolbar.media.leftBracket'
                                                )
                                            }}<svg-icon
                                                v-if="item.view === 'desktop'"
                                                name="stars"
                                            />
                                            <span>{{ item.subTitle }}</span>{{
                                                t(
                                                    'designer.toolbar.media.rightBracket'
                                                )
                                            }}
                                        </span>
                                    </div>
                                </div>
                                <div class="content">{{ item.content }}</div>
                            </div>
                            <template #reference>
                                <svg-icon
                                    :name="item.liked"
                                    class="media-icon"
                                />
                            </template>
                        </tiny-popover>
                    </span>
                </div>
                <tiny-popover
                    v-if="isCanvas"
                    width="200"
                    trigger="click"
                    popper-class="toolbar-media-popper"
                >
                    <template #reference>
                        <span
                            class="reference-text"
                            :title="t('designer.toolbar.media.canvasSettings')"
                        >
                            <span>
                                <span>{{ parseInt(state.width) }}</span>
                                <span class="symbol">{{
                                    t('designer.toolbar.media.px')
                                }}</span>
                            </span>
                            <span>
                                <span>{{ scale.toFixed(2) }}</span>
                                <span class="symbol">{{
                                    t('designer.toolbar.media.percent')
                                }}</span>
                            </span>
                        </span>
                    </template>
                    <div class="content-wrap text-content">
                        <div class="title text-title">
                            {{ t('designer.toolbar.media.canvasSettings') }}
                        </div>
                        <div class="setting">
                            <div>
                                <label>{{
                                    t('designer.toolbar.media.width')
                                }}</label>
                                <tiny-input
                                    v-model="state.width"
                                    @change="widthChange"
                                >
                                    <template #suffix>
                                        <span>{{
                                            t('designer.toolbar.media.px')
                                        }}</span>
                                    </template>
                                </tiny-input>
                            </div>
                            <div>
                                <label>{{
                                    t('designer.toolbar.media.scale')
                                }}</label>
                                <tiny-input
                                    v-model="state.scaleValue"
                                    :readonly="state.readonly"
                                    @change="scaleChange"
                                >
                                    <template #suffix>
                                        <span>{{
                                            t('designer.toolbar.media.percent')
                                        }}</span>
                                    </template>
                                </tiny-input>
                            </div>
                            <div>
                                <label>{{
                                    t('designer.toolbar.media.freeLayout')
                                }}</label>
                                <tiny-switch
                                    v-model="isAbsolute"
                                    @change="changeCanvasType"
                                />
                            </div>
                        </div>
                    </div>
                </tiny-popover>
            </div>
        </template>
    </toolbar-base>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
/* eslint-disable max-lines */
/* metaService: engine.toolbars.media.custom.Main */
import {
    ref,
    reactive,
    computed,
    toRaw,
    watchEffect,
    onMounted,
    onUnmounted,
    watch
} from 'vue';
import { Popover, Input, Switch } from '@opentiny/vue';
import { IconWebPlus } from '@opentiny/vue-icon';
import { useLayout, useCanvas } from '@opentiny/tiny-engine-meta-register';
import { ToolbarBase } from '@opentiny/tiny-engine-common';

import { useDesignerI18n } from '@/services/i18nService';
import { MEDIA_MOBILE_ONLY } from '@/config/featureFlags';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyPopover: Popover,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyInput: Input,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinySwitch: Switch,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ToolbarBase
    },
    props: {
        data: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        },
        isCanvas: {
            type: Boolean,
            default: true
        },
        options: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        }
    },
    emits: ['setViewPort'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let timer: ReturnType<typeof setTimeout> | null = null;
        let prevWidthVal = '';
        let prevScaleVal = '';
        const { layoutState } = useLayout();
        const visible = ref(false);
        const active = ref(false);
        const flag = ref(false);
        const { getCanvasType } = useCanvas().canvasApi.value;
        const isAbsolute = ref(getCanvasType?.() === 'absolute');

        const dimension = computed(() => useLayout().getDimension());
        const scale = computed(() => dimension.value.scale * 100);

        const state = reactive({
            activeIndex: 0,
            guideValue: '',
            width: '' as string | number,
            scaleValue: '' as string | number,
            readonly: false,
            viewWidth: null
        });

        const moreData = computed(() => ({
            title: t('designer.toolbar.media.addLargeBreakpoint'),
            list: [
                {
                    // eslint-disable-next-line new-cap
                    icon: IconWebPlus(),
                    text: '1280px'
                },
                {
                    // eslint-disable-next-line new-cap
                    icon: IconWebPlus(),
                    text: '1440px'
                },
                {
                    // eslint-disable-next-line new-cap
                    icon: IconWebPlus(),
                    text: '1920px'
                }
            ],
            tips: t('designer.toolbar.media.hoverBreakpointTip')
        }));

        const textData = computed(() => ({
            title: t('designer.toolbar.media.canvasSettings'),
            width: t('designer.toolbar.media.width'),
            scale: t('designer.toolbar.media.scale'),
            list: [
                {
                    text: t('designer.toolbar.media.freeLayout')
                }
            ],
            vision: '视觉预览'
        }));

        const guideOptions = computed(() => [
            {
                value: '选项1',
                label: 'No guide'
            },
            {
                value: '选项2',
                label: 'Line guide(960px)'
            },
            {
                value: '选项3',
                label: 'Filled guide(960px)'
            }
        ]);

        const media = computed(() => {
            // 如果只显示手机竖屏，只返回手机竖屏配置
            if (MEDIA_MOBILE_ONLY) {
                return [
                    {
                        idx: 0,
                        view: 'mobile',
                        icon: 'IconMobileView',
                        liked: 'mobile-portrai',
                        width: '480px',
                        minWidth: '240px',
                        maxWidth: '480px',
                        title: t('designer.toolbar.media.devices.mobile.title'),
                        subTitle: t(
                            'designer.toolbar.media.devices.mobile.subTitle'
                        ),
                        content: t(
                            'designer.toolbar.media.devices.mobile.content'
                        ),
                        enContent:
                            'styles added here will apply at 480px and down.'
                    }
                ];
            }

            // 恢复所有设备选项
            return [
                {
                    idx: 0,
                    view: 'mdx',
                    icon: 'IconDesktopView',
                    liked: 'desktop-large',
                    width: '1920px',
                    minWidth: '1200px',
                    maxWidth: '1920px',
                    title: t(
                        'designer.toolbar.media.devices.largeScreen.title'
                    ),
                    subTitle: t(
                        'designer.toolbar.media.devices.largeScreen.subTitle'
                    ),
                    content: t(
                        'designer.toolbar.media.devices.largeScreen.content'
                    ),
                    enContent:
                        'Style added here will apply at 1200px and up,unless they′re edited at a larger breakpoint.'
                },
                {
                    idx: 1,
                    view: 'desktop',
                    icon: 'IconDesktopView',
                    liked: 'laptop-cut-corner',
                    width: '1200px',
                    minWidth: '992px',
                    maxWidth: '1200px',
                    title: t('designer.toolbar.media.devices.desktop.title'),
                    subTitle: t(
                        'designer.toolbar.media.devices.desktop.subTitle'
                    ),
                    content: t(
                        'designer.toolbar.media.devices.desktop.content'
                    ),
                    enContent:
                        'Desktop styles apply at all breakpoints,unless they′re edited at a larger or smaller breakpoints. Start your stying here.'
                },
                {
                    idx: 2,
                    view: 'tablet',
                    icon: 'IconTabletView',
                    liked: 'tablet-portrait',
                    width: '992px',
                    minWidth: '768px',
                    maxWidth: '992px',
                    title: t('designer.toolbar.media.devices.tablet.title'),
                    subTitle: t(
                        'designer.toolbar.media.devices.tablet.subTitle'
                    ),
                    content: t('designer.toolbar.media.devices.tablet.content'),
                    enContent:
                        'styles added here will apply at 992px and down,unless they′re edited at smaller breakpoints.'
                },
                {
                    idx: 3,
                    view: 'lanMobile',
                    icon: 'IconMobileView',
                    liked: 'mobile-landscape',
                    width: '768px',
                    minWidth: '480px',
                    maxWidth: '768px',
                    title: t(
                        'designer.toolbar.media.devices.landscapeMobile.title'
                    ),
                    subTitle: t(
                        'designer.toolbar.media.devices.landscapeMobile.subTitle'
                    ),
                    content: t(
                        'designer.toolbar.media.devices.landscapeMobile.content'
                    ),
                    enContent:
                        'styles added here will apply at 768px and down,unless they′re edited at smaller breakpoints.'
                },
                {
                    idx: 4,
                    view: 'mobile',
                    icon: 'IconMobileView',
                    liked: 'mobile-portrai',
                    width: '480px',
                    minWidth: '240px',
                    maxWidth: '480px',
                    title: t('designer.toolbar.media.devices.mobile.title'),
                    subTitle: t(
                        'designer.toolbar.media.devices.mobile.subTitle'
                    ),
                    content: t('designer.toolbar.media.devices.mobile.content'),
                    enContent: 'styles added here will apply at 480px and down.'
                }
            ];
        });

        const hide = () => {
            active.value = false;
        };

        const showTips = () => {
            timer = setTimeout(() => {
                visible.value = true;
            }, 1000);
        };

        const hideTips = () => {
            visible.value = false;
            clearTimeout(timer);
        };

        const showPopover = () => {
            layoutState.toolbars.visiblePopover = true;
            flag.value = true;
        };

        const hidePopover = () => {
            layoutState.toolbars.visiblePopover = false;
            flag.value = false;
        };

        const closePopover = (e: Event) => {
            const ele = document.querySelector('.reference-text');
            const isChild = ele?.contains(e.target);

            if (ele !== e.target && !isChild) {
                layoutState.toolbars.visiblePopover = false;
            }
        };

        const mediaMap = computed(() => {
            return media.value.reduce(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (output: Record<string, any>, obj, index) => {
                    output[obj.view] = { ...toRaw(obj), index };
                    return output;
                },
                {} as Record<string, unknown>
            );
        });

        const setViewPort = (item: {
            view: string;
            width: string;
            minWidth: string;
            maxWidth: string;
            idx: number;
        }) => {
            if (props.isCanvas) {
                useLayout().setDimension({
                    deviceType: item.view,
                    width: item.width,
                    minWidth: item.minWidth,
                    maxWidth: item.maxWidth
                });
            } else {
                state.activeIndex = item.idx;
                emit('setViewPort', item.width);
            }
        };

        const activeView = (val: number, type: string) => {
            const item = mediaMap.value[type];
            useLayout().setDimension({
                deviceType: item.view,
                width: val ? `${val}px` : item.width,
                minWidth: item.minWidth,
                maxWidth: item.maxWidth
            });
        };

        const breakpoints = [
            { type: 'mobile', min: 240, max: 480 },
            { type: 'lanMobile', min: 480, max: 768 },
            { type: 'tablet', min: 768, max: 992 },
            { type: 'desktop', min: 992, max: 1200 },
            { type: 'mdx', min: 1200, max: 1920 }
        ];

        const widthChange = (val: string) => {
            const reg = /^\d+$/;

            if (!reg.exec(String(val))) {
                state.width = prevWidthVal
                    ? prevWidthVal
                    : parseInt(dimension.value.width, 10);
            } else if (Number(val) < 240) {
                state.width = 240;
            } else if (Number(val) > 1920) {
                state.width = 1920;
            } else {
                state.width = val;
            }

            const width = Number(state.width);
            const type =
                breakpoints.find(item => item.min <= width && width <= item.max)
                    ?.type || 'desktop';
            activeView(width, type);
        };

        const scaleChange = (val: string) => {
            const item = mediaMap.value.mdx;
            const reg = /^\d+(\.\d+)?$/;

            if (!reg.exec(String(val))) {
                state.scaleValue = prevScaleVal
                    ? prevScaleVal
                    : parseInt(item.scale);
            } else if (Number(val) > 100) {
                state.scaleValue = 100;
            } else if (Number(val) < 20) {
                state.scaleValue = 20;
            } else {
                state.scaleValue = val;
            }
            state.scaleValue = Number(state.scaleValue).toFixed(2);

            useLayout().setDimension({
                scale: Number(state.scaleValue) / 100
            });
        };

        const changeCanvasType = (value: boolean) => {
            const { setCanvasType } = useCanvas().canvasApi.value;
            setCanvasType(value ? 'absolute' : 'normal');
        };

        watch(
            () => dimension.value.deviceType,
            deviceType => {
                // 如果当前设备类型不在 mediaMap 中（比如只显示手机竖屏时，deviceType 可能是 desktop），使用默认值
                const device =
                    mediaMap.value[deviceType] ||
                    mediaMap.value[MEDIA_MOBILE_ONLY ? 'mobile' : 'desktop'];
                if (device) {
                    state.activeIndex = device.index;
                    state.readonly = deviceType !== 'mdx';
                }
            },
            { immediate: true }
        );

        watchEffect(() => {
            state.scaleValue = scale.value.toFixed(2);
            prevScaleVal = scale.value;
        });

        watch(
            () => dimension.value.width,
            width => {
                const newWidth = parseInt(width, 10);
                if (Number.isInteger(newWidth)) {
                    state.width = newWidth;
                    prevWidthVal = newWidth;
                }
            }
        );

        onMounted(() => {
            document.addEventListener('click', closePopover);
        });

        onUnmounted(() => {
            document.removeEventListener('click', closePopover);
        });

        // 初始化 viewpoint
        // 如果只显示手机竖屏，默认选择 mobile；否则使用当前设备类型或默认 desktop
        // eslint-disable-next-line vue/no-ref-object-reactivity-loss
        const dimensionValue = dimension.value;
        const defaultMode = MEDIA_MOBILE_ONLY
            ? 'mobile'
            : dimensionValue.deviceType || 'desktop';
        // eslint-disable-next-line vue/no-ref-object-reactivity-loss
        const mediaMapValue = mediaMap.value;
        // eslint-disable-next-line vue/no-ref-object-reactivity-loss
        const mediaValue = media.value;
        const firstMediaView = mediaValue[0]?.view;
        const targetDevice =
            mediaMapValue[defaultMode] ||
            (firstMediaView ? mediaMapValue[firstMediaView] : undefined) ||
            mediaMapValue.mobile;
        if (targetDevice) {
            setViewPort(targetDevice);
        }

        return {
            scale,
            state,
            media,
            moreData,
            textData,
            guideOptions,
            active,
            flag,
            hide,
            layoutState,
            visible,
            showTips,
            hideTips,
            timer,
            dimension,
            setViewPort,
            showPopover,
            hidePopover,
            widthChange,
            scaleChange,
            isAbsolute,
            changeCanvasType,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
@import './styles/vars.scss';

.toolbar-wrap {
    display: flex;
    align-items: center;

    .reference-text {
        cursor: pointer;
        height: var(--base-top-panel-height);
        line-height: var(--base-top-panel-height);
        padding: 0 7px;
        color: var(--te-toolbars-media-text-color-secondary);
        display: inline-block;

        & > span {
            &:last-child {
                margin-left: 8px;
            }
        }
    }

    .toolbar-icon-wrap {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        gap: 6px;
        .icon {
            width: 24px;
            height: 24px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            border-radius: 4px;

            svg {
                cursor: pointer;
                color: var(--te-toolbars-media-text-color-primary);
                outline: none;
                width: 18px;
                height: 18px;
                margin-top: -0.5px;
            }

            &.active,
            &:hover {
                background: var(--te-toolbars-media-bg-color-active);
            }
            &.active {
                svg {
                    color: var(--te-toolbars-media-text-color-checked);
                }
            }
        }
    }
    .more-setting {
        .setting-item {
            display: flex;
            justify-content: space-between;
            padding: 12px;
        }
    }
}
.media-content {
    line-height: 18px;
    .media-title {
        font-weight: 600;
    }
    .content {
        color: var(--te-toolbars-media-text-color-secondary);
    }
}
.setting-content {
    padding: 12px 8px;
}

.content-wrap {
    .title {
        font-weight: 600;
        margin-bottom: 16px;
    }

    .setting {
        display: flex;
        flex-direction: column;
        gap: 12px;
        div {
            display: flex;
            align-items: center;
            justify-content: space-between;
            label {
                color: var(--te-toolbars-media-text-color-secondary);
                min-width: 64px;
            }
            &:last-child {
                justify-content: flex-start;
            }
        }
    }
}
</style>
