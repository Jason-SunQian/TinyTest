<!-- eslint-disable vue/no-bare-strings-in-template, vue/block-lang, @typescript-eslint/no-empty-function, vue/define-props-declaration, vue/require-typed-object-prop, vue/define-emits-declaration -->
<template>
    <div class="background-row">
        <label class="row-label">Color</label>
        <color-configurator :model-value="modelValue" @change="changeColor" />
    </div>
</template>

<script setup lang="ts">
/* metaService: engine.setting.styles.ColorOverlay */
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import { ColorConfigurator } from '@opentiny/tiny-engine-configurator';

import { BACKGROUND_PROPERTY } from '../../js/styleProperty';

// eslint-disable-next-line vue/define-props-declaration, vue/require-typed-object-prop, @typescript-eslint/no-empty-function
// eslint-disable-next-line vue/define-props-declaration
const props = defineProps({
    style: {
        // eslint-disable-next-line vue/require-typed-object-prop
        type: Object,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        default: () => {}
    }
});

// eslint-disable-next-line vue/define-emits-declaration
const emit = defineEmits(['updateStyle']);

const modelValue = ref('');

const updateStyle = property => {
    emit('updateStyle', property);
};

const changeColor = val => {
    updateStyle({
        [BACKGROUND_PROPERTY.BackgroundImage]: `linear-gradient(${val}, ${val})`
    });
};

onMounted(() => {
    modelValue.value = props.style.text ?? '#000';
});
</script>
