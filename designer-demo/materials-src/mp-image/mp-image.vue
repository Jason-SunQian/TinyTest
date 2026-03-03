<template>
    <div
        :class="[
            $style['mp-image'],
            $style[fit === 'cover' ? 'cover' : 'contain'],
            {
                'rounded-full': round,
                [$style['bg-color']]: !hideBgColor,
                [$style['loaded']]: loaded,
            },
            block ? 'block' : 'inline-block',
            'relative overflow-hidden',
        ]"
        :style="{
            width: width ? width : '100%',
        }"
    >
        <div
            :style="{
                paddingBottom: ratioNum ? ratioNum : '',
            }"
            class="relative"
        >
            <img
                v-if="src"
                :src="src"
                :class="['mp-image-img', { 'mp-image-fill': ratioNum }]"
                loading="lazy"
                @load="loaded = true"
                @error="imgLoadErr"
            />
            <div
                v-else
                :class="['mp-image-placeholder', { 'mp-image-fill': ratioNum }]"
            >
                Image
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
    src: string;
    ratio?: string;
    width?: number | string;
    round?: boolean;
    block?: boolean;
    fit?: 'contain' | 'cover';
    hideBgColor?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    src: '',
    ratio: '',
    width: '',
    round: false,
    block: false,
    fit: 'cover',
    hideBgColor: false,
});

const emit = defineEmits<{
    error: [];
}>();

const loaded = ref(false);

const ratioNum = computed(() => {
    if (!props.ratio) {
        return;
    }
    const sizeArr = props.ratio.split(':');
    const num = sizeArr.length === 1 ? 1 : +sizeArr[1] / +sizeArr[0];
    return `${num * 100}%`;
});

const imgLoadErr = () => {
    loaded.value = false;
    emit('error');
};
</script>

<style module lang="scss">
.mp-image {
    img {
        opacity: 0;
        transition: opacity linear 260ms;
    }

    &.loaded img {
        opacity: 1;
    }

    &.cover img {
        object-fit: cover;
    }
    &.contain img {
        object-fit: contain;
    }
}
.bg-color {
    background-color: var(--mp-image-bg-color, var(--mr-color-neutral-100, #f3f4f6));
}
</style>

<style scoped>
.mp-image-img,
.mp-image-placeholder {
    width: 100%;
    height: 100%;
}
.mp-image-fill {
    position: absolute;
    top: 0;
    left: 0;
}
.mp-image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    font-size: 14px;
}
</style>
