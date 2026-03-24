<template>
    <div class="request-load">
        <tiny-checkbox
            v-model="state.value"
            class="send-requesNew"
            @change="change"
        />
        <div class="use-service">
            {{ t('designer.datasource.loadServiceOnPageInit') }}
        </div>
    </div>
</template>

<script lang="ts">
/* metaService: engine.plugins.collections.DataSourceRemoteAutoload */
import { reactive } from 'vue';
import { Checkbox } from '@opentiny/vue';

import { useDesignerI18n } from '../../services/i18nService';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyCheckbox: Checkbox
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { t } = useDesignerI18n();

        const state = reactive({
            value: props.modelValue
        });

        const change = value => {
            emit('update:modelValue', value);
        };

        return {
            state,
            change,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.request-load {
    display: flex;
    margin-bottom: 12px;
    margin-top: 12px;

    .use-service {
        color: var(--te-datasource-common-text-color-primary);
        font-size: 12px;

        span {
            color: var(--te-datasource-description-text-color-warning);
        }
    }
}
</style>
