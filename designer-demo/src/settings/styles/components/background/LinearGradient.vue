<template>
    <div class="background-row line">
        <label class="row-label">{{
            t('designer.settings.styles.background.angle')
        }}</label>
        <div class="angle-wrap">
            <div class="angle-icon">
                <div>
                    <svg
                        ref="rotateSvg"
                        data-icon="AngleControlDialTop"
                        aria-hidden="true"
                        focusable="false"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        class="rotate-svg"
                    >
                        <circle cx="11" cy="11" r="11" fill="#C2C2C2" />
                        <circle cx="11" cy="4" r="2" fill="#EEE" />
                    </svg>
                    <svg
                        data-icon="AngleControlDialBase"
                        aria-hidden="true"
                        focusable="false"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        class="action-svg"
                        @click="handleClickAngle"
                    >
                        <circle cx="11" cy="11" r="11" fill="currentColor" />
                    </svg>
                </div>
                <span @click="counterclockwiseRotate"><svg-icon name="clock-wise-counter" color="#808080"/></span>
                <span @click="clockwiseRotate"><svg-icon name="clock-wise" color="#808080"/></span>
            </div>
            <input-select
                :model-value="state.angle"
                suffix-value="DEG"
                class="angle-select"
                @input-change="inputAngle"
            />
        </div>
    </div>
    <background-image-gradient
        :repeat="state.repeat"
        :color-list="state.colorList"
        @update="updateGradient"
    />
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts" setup>
/* metaService: engine.setting.styles.LinearGradient */
import { ref, reactive, onMounted } from 'vue';

import { useDesignerI18n } from '@/services/i18nService';

import InputSelect from '../inputs/InputSelect.vue';
import { BACKGROUND_PROPERTY } from '../../js/styleProperty';

import BackgroundImageGradient from './BackgroundImageGradient.vue';

interface Props {
    style?: Record<string, unknown>;
}

const props = withDefaults(defineProps<Props>(), {
    style: () => ({})
});

const emit = defineEmits<{
    updateStyle: [property: Record<string, unknown>];
}>();

const { t } = useDesignerI18n();
const ONE_PI_DEG = 180;
const DAUBLE_PI_DEG = 360;
const QUARTER_PI_DEG = 45;

const state = reactive({
    angle: ONE_PI_DEG,
    repeat: '',
    colorList: []
});

// eslint-disable-next-line vue/require-typed-ref
const rotateSvg = ref(null);

const updateStyle = property => {
    emit('updateStyle', property);
};

const angleChange = () => {
    updateStyle({
        [BACKGROUND_PROPERTY.BackgroundImage]: `linear-gradient(${state.angle}deg, black, white)`
    });
};

const rotateAngle = () => {
    rotateSvg.value.style.transform = `rotate(${
        state.angle % DAUBLE_PI_DEG
    }deg)`;
    angleChange();
};

const inputAngle = val => {
    state.angle = Number(val);
    rotateAngle();
};

const counterclockwiseRotate = () => {
    state.angle = state.angle % DAUBLE_PI_DEG;
    state.angle -= QUARTER_PI_DEG;
    if (state.angle < 0) {
        state.angle += DAUBLE_PI_DEG;
    }
    rotateAngle();
};

const clockwiseRotate = () => {
    state.angle = state.angle % 360;
    state.angle += QUARTER_PI_DEG;
    if (state.angle >= 360) {
        state.angle -= 360;
    }
    rotateAngle();
};

const handleClickAngle = e => {
    const radius = e.currentTarget.clientWidth / 2;
    const x = e.offsetX - radius;
    const y = radius - e.offsetY;
    const tan = x / y;
    let deg = Math.ceil((Math.atan(tan) * ONE_PI_DEG) / Math.PI);
    if (y < 0) {
        deg += ONE_PI_DEG;
    }
    if (deg >= DAUBLE_PI_DEG) {
        deg -= DAUBLE_PI_DEG;
    }
    if (deg < 0) {
        deg += DAUBLE_PI_DEG;
    }
    state.angle = deg;
    rotateAngle();
};

const updateGradient = ({ repeat }) => {
    updateStyle({ [BACKGROUND_PROPERTY.BackgroundRepeat]: repeat ?? '' });
};

onMounted(() => {
    const { styleObj } = props.style;
    state.repeat = styleObj[BACKGROUND_PROPERTY.BackgroundRepeat] ?? '';

    const angleMatch = /(\d+)(?:deg)/.exec(
        styleObj[BACKGROUND_PROPERTY.BackgroundImage]
    );
    state.angle = angleMatch ? Number(angleMatch[1]) : ONE_PI_DEG;
    rotateAngle();

    // #fff | #fff
    const rColor = /#(?:[a-f0-9]{6}|[a-f0-9]{3})/;
    // .5 5px 50%
    const rLengthPercentage = /(?:[+-]?\d*\.?\d+)(?:%|[a-z]+)?/;
    const rLinearColorStop = new RegExp(
        `${rColor.source}(?:\\s+${rLengthPercentage.source})?`
    );
    const rComma = /\s*,\s*/;
    const rColorStopList = new RegExp(
        `(?:(${rLinearColorStop.source}${rComma.source})*${rLinearColorStop.source})`,
        'gi'
    );
    const colorStopListMatch =
        styleObj[BACKGROUND_PROPERTY.BackgroundImage].match(rColorStopList);
    if (colorStopListMatch?.length) {
        state.colorList = colorStopListMatch.map((item, index) => {
            const [color, percent] = item.split(' ');
            return {
                color,
                percent: percent ?? (index === 0 ? '0%' : '100%')
            };
        });
    }
});
</script>

<style lang="scss" scoped>
.angle-wrap {
    display: grid;
    gap: 8px 4px;
    grid-template-columns: 1fr 65px;
    align-items: center;
    .angle-select {
        :deep(.tiny-select) {
            cursor: not-allowed;
            pointer-events: none;
        }
    }
}
.angle-icon {
    display: grid;
    gap: 8px;
    grid-template-columns: 24px auto auto 1fr;
    align-items: center;
}
.rotate-svg {
    display: block;
    width: 22px;
    height: 22px;
    transform: rotate(180deg);
    color: rgb(117, 117, 117);
}
.action-svg {
    display: block;
    position: absolute;
    top: 4px;
    grid-column-start: 1;
    grid-row-start: 1;
    color: transparent;
}
</style>
