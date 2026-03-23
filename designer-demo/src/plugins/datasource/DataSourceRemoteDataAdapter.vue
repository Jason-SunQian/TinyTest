<template>
    <div class="send-service">
        <div class="use-service">
            <div class="life-cycle-alert">
                {{ t('designer.datasource.corsAuthTip') }}
            </div>
        </div>
    </div>
    <div>
        <remote-data-adapter-form
            v-model="state.shouldFetch"
            :name="t('designer.datasource.shouldFetchFunction')"
        />
        <remote-data-adapter-form
            v-model="state.willFetch"
            :name="t('designer.datasource.willFetchFunction')"
        />
        <remote-data-adapter-form
            v-model="state.dataHandler"
            :name="t('designer.datasource.dataHandlerFunction')"
        >
            <template #title>
                <tiny-popover placement="top" trigger="hover">
                    <div>
                        {{ t('designer.datasource.dataSourceFormatTip') }}
                    </div>
                    <div>
                        <code>{{ formatExample }}</code>
                    </div>
                    <template #reference>
                        <div>
                            <svg-icon name="flow-help-center" />
                        </div>
                    </template>
                </tiny-popover>
            </template>
        </remote-data-adapter-form>
        <remote-data-adapter-form
            v-model="state.errorHandler"
            :name="t('designer.datasource.errorHandlerFunction')"
        />
    </div>
</template>

<script lang="ts">
/* metaService: engine.plugins.collections.DataSourceRemoteDataAdapter */
import { reactive, ref, watch, computed } from 'vue';
import { Popover } from '@opentiny/vue';
import { constants } from '@opentiny/tiny-engine-utils';

import { useDesignerI18n } from '@/services/i18nService';

import RemoteDataAdapterForm from './RemoteDataAdapterForm.vue';

const { DEFAULT_INTERCEPTOR } = constants;

 
const dataHandler = ref(null);
 
const willFetch = ref(null);
 
const shouldFetch = ref(null);
 
const errorHandler = ref(null);

export default {
    components: {
         
        TinyPopover: Popover,
         
        RemoteDataAdapterForm
    },
    props: {
        modelValue: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        }
    },
    emits: ['sendRequst', 'update:modelValue'],
     
    setup(props, { emit }) {
        const { t } = useDesignerI18n();

        // 计算属性：生成完整的示例代码，避免在 i18n 消息中使用嵌套大括号
        const formatExample = computed(() => {
            const example = t('designer.datasource.dataSourceFormatExample');
            // 将 "items: any[], total: number" 替换为 "{items: any[], total: number}"
            return `{ ${example.replace(
                'items: any[], total: number',
                '{items: any[], total: number}'
            )} }`;
        });

        const state = reactive({
            dataHandler:
                props.modelValue.dataHandler ||
                DEFAULT_INTERCEPTOR.dataHandler.value,
            willFetch:
                props.modelValue.willFetch ||
                DEFAULT_INTERCEPTOR.willFetch.value,
            shouldFetch:
                props.modelValue.shouldFetch ||
                DEFAULT_INTERCEPTOR.shouldFetch.value,
            errorHandler:
                props.modelValue.errorHandler ||
                DEFAULT_INTERCEPTOR.errorHandler.value
        });

        const getEditorValue = () => ({
            dataHandler: { type: 'JSFunction', value: state.dataHandler },
            willFetch: { type: 'JSFunction', value: state.willFetch },
            shouldFetch: { type: 'JSFunction', value: state.shouldFetch },
            errorHandler: { type: 'JSFunction', value: state.errorHandler }
        });

        watch(
            () => [
                state.dataHandler,
                state.willFetch,
                state.shouldFetch,
                state.errorHandler
            ],
             
            ([
                dataHandlerValue,
                willFetchValue,
                shouldFetchValue,
                errorHandlerValue
            ]) => {
                emit('update:modelValue', {
                    dataHandler: dataHandlerValue,
                    willFetch: willFetchValue,
                    shouldFetch: shouldFetchValue,
                    errorHandler: errorHandlerValue
                });
            }
        );

        return {
            state,
            getEditorValue,
            dataHandler,
            willFetch,
            shouldFetch,
            errorHandler,
            formatExample,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.send-service {
    .use-service {
        margin-bottom: 0;
    }
    :deep(.tiny-alert) {
        .tiny-alert__content {
            .tiny-alert__description {
                font-size: 14px;
                margin-bottom: -5px;
            }
        }
    }
    .life-cycle-alert {
        font-size: var(--te-base-font-size-base);
        color: var(--te-datasource-common-tip-text-color);
    }
}
.svg-icon.plugin-icon-plugin-help {
    font-size: 16px;
}
</style>
