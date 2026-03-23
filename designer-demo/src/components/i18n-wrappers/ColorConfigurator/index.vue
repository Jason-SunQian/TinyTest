<template>
    <div class="background-input">
        <tiny-input
            ref="tinyInput"
            v-model="color"
            :placeholder="currentPlaceholder"
            @change="handleChange"
        >
            <template #prefix>
                <input
                    v-model="inputColor"
                    type="color"
                    class="input-color"
                    @change="handleColorChange"
                >
            </template>
        </tiny-input>
    </div>
</template>

<script lang="ts">
import { Input } from '@opentiny/vue';
import { ref, computed, watchEffect, watch, nextTick } from 'vue';

import { useDesignerI18n } from '@/services/i18nService';

export default {
    name: 'i18n-color-configurator',
    components: {
         
        TinyInput: Input
    },
    props: {
        name: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        modelValue: {
            type: String,
            default: ''
        }
    },
    emits: ['change', 'update:modelValue'],
     
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const color = ref(props.modelValue);
         
        const tinyInput = ref(null);

        const currentPlaceholder = computed(
            () =>
                props.placeholder ||
                t('designer.settings.styles.common.colorPlaceholder')
        );
        const inputColor = computed(() => color.value || '#FFFFFF');

        const emitChange = value => {
            emit('update:modelValue', value);
            emit('change', value);
        };

        watchEffect(() => {
            color.value = props.modelValue;
        });

        const handleChange = value => {
            emitChange(value);
        };

        const handleColorChange = event => {
            emitChange(event.target.value);
        };

        watch(
            currentPlaceholder,
            async val => {
                await nextTick();
                const inputRef =
                    tinyInput.value?.refs?.input ||
                    tinyInput.value?.$refs?.input;
                if (inputRef?.setAttribute) {
                    inputRef.setAttribute('placeholder', val);
                }
            },
            { immediate: true }
        );

        return {
            color,
            inputColor,
            currentPlaceholder,
            tinyInput,
            handleChange,
            handleColorChange
        };
    }
};
</script>

<style lang="scss" scoped>
.background-input {
    width: 100%;

    .input-color {
        width: 20px;
        height: 24px;
        border: none;
        background: transparent;
        padding: 0;
        border-radius: 4px;
    }

    :deep(.tiny-input-prefix) {
        .tiny-input__prefix {
            left: 2px;
        }
        .tiny-input__inner {
            padding-left: 24px;
            padding-right: 8px;
            background-color: transparent;
        }
    }
}
</style>
