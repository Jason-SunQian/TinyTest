<template>
    <mr-field
        v-model="model"
        :label="label"
        :label-align="labelAlign"
        :input-align="innerInputAlign"
        :type="type"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        :error-message="errorMessage"
        :maxlength="maxlength"
        class="mp-input"
        @click-input="$emit('inputClick')"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MrField } from '@local/mr-components';

const props = withDefaults(
    defineProps<{
        label?: string;
        labelAlign?: 'top' | 'left';
        placeholder?: string;
        type?: 'text' | 'number' | 'email' | 'tel' | 'url' | 'password';
        inputAlign?: 'left' | 'right' | '';
        readonly?: boolean;
        disabled?: boolean;
        errorMessage?: string;
        maxlength?: number;
    }>(),
    {
        label: '',
        labelAlign: 'top',
        placeholder: '',
        type: 'text',
        inputAlign: '',
        readonly: false,
        disabled: false,
        errorMessage: '',
        maxlength: undefined,
    },
);

defineEmits<{
    focus: [];
    blur: [];
    inputClick: [];
}>();

const model = defineModel<string>({ default: '' });

const innerInputAlign = computed(() => {
    if (props.inputAlign) return props.inputAlign;
    return props.labelAlign === 'top' ? 'left' : 'right';
});
</script>

<style scoped>
.mp-input :deep(.van-field__body input) {
    color: var(--mr-color-text-primary, #323233);
}
.mp-input :deep(.van-field__body input::placeholder) {
    color: var(--mr-color-text-placeholder, #c8c9cc);
}
</style>
