<template>
    <span>{{ t('designer.configurators.myInputConfigurator.title') }}</span>
    <tiny-input
        v-model="value"
        :type="type"
        :placeholder="placeholder"
        :rows="rows"
        @update:model-value="change"
    />
</template>

<script lang="ts">
import { ref } from 'vue';
import { Input } from '@opentiny/vue';

import { useDesignerI18n } from '@/services/i18nService';

export default {
    name: 'my-input-configurator',
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyInput: Input
    },
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        placeholder: {
            type: String,
            default: ''
        },
        suffixIcons: {
            type: Array as () => unknown[],
            default: () => []
        },
        dataType: {
            type: String,
            default: ''
        },
        rows: {
            type: Number,
            default: 10
        }
    },
    emits: ['update:modelValue'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const value = ref(props.modelValue);

        const change = val => {
            emit(
                'update:modelValue',
                props.dataType === 'Array' ? val.split(',') : val
            );
        };

        return {
            value,
            change,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.tiny-svg-size {
    margin-left: 10px;
    font-size: 16px;
    &:hover {
        cursor: pointer;
        color: var(--te-common-text-primary);
    }
}
</style>
