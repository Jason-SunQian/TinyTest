<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <div class="advanced-config-container">
        <div class="advnce-config">
            <label class="text-ellipsis-multiple">{{
                t('designer.settings.events.advanced.render')
            }}</label>
            <div class="advanced-config-form-item">
                <switch-configurator
                    v-if="!isBind"
                    :model-value="condition"
                    @update:model-value="setConfig"
                />
                <div
                    v-else
                    class="binding-state text-ellipsis-multiple"
                    :title="condition.value"
                >
                    {{
                        t('designer.settings.events.advanced.bound', {
                            value: condition.value
                        })
                    }}
                </div>
                <variable-configurator
                    v-model="condition"
                    name="advance"
                    @update:model-value="setConfig"
                />
            </div>
        </div>

        <div class="advnce-config loop-data-item">
            <label class="text-ellipsis-multiple">{{
                t('designer.settings.events.advanced.loopData')
            }}</label>
            <div class="advanced-config-form-item">
                <code-configurator
                    v-if="!state.isLoop"
                    v-model="state.loopData"
                    data-type="JSExpression"
                    @update:model-value="setLoop"
                    @open="openEditor"
                />
                <div
                    v-else
                    class="binding-state text-ellipsis-multiple"
                    :title="state.loopData?.value"
                >
                    {{
                        t('designer.settings.events.advanced.bound', {
                            value: state.loopData?.value
                        })
                    }}
                </div>
                <variable-configurator
                    v-model="state.loopData"
                    name="advance"
                    @update:model-value="setLoop"
                />
            </div>
        </div>
        <div class="advnce-config">
            <label class="text-ellipsis-multiple">{{
                t('designer.settings.events.advanced.loopItem')
            }}</label>
            <div class="advanced-config-form-item">
                <input-configurator
                    v-model="state.loopItem"
                    :placeholder="
                        t('designer.settings.events.advanced.defaultValue', {
                            value: DEFAULT_LOOP_NAME.ITEM
                        })
                    "
                    @update:model-value="setLoopItem"
                />
            </div>
        </div>
        <div class="advnce-config">
            <label class="text-ellipsis-multiple">{{
                t('designer.settings.events.advanced.loopIndex')
            }}</label>
            <div class="advanced-config-form-item">
                <input-configurator
                    v-model="state.loopIndex"
                    :placeholder="
                        t('designer.settings.events.advanced.defaultValue', {
                            value: DEFAULT_LOOP_NAME.INDEX
                        })
                    "
                    @update:model-value="setLoopIndex"
                />
            </div>
        </div>
        <div class="advnce-config">
            <label class="text-ellipsis-multiple">{{
                t('designer.settings.events.advanced.loopKey')
            }}</label>
            <div class="advanced-config-form-item">
                <tiny-tooltip
                    :content="
                        t('designer.settings.events.advanced.loopKeyTooltip')
                    "
                    effect="light"
                >
                    <input-configurator
                        v-model="state.loopKey"
                        :placeholder="
                            t(
                                'designer.settings.events.advanced.defaultIndexName',
                                { value: getIndexName() }
                            )
                        "
                        @update:model-value="setLoopKey"
                    />
                </tiny-tooltip>
            </div>
        </div>
    </div>
</template>

<!-- eslint-disable vue/max-lines-per-block, vue/block-lang, vue/component-api-style, @typescript-eslint/naming-convention, no-param-reassign, @typescript-eslint/no-unused-vars -->
<script lang="ts">
/* metaService: engine.setting.event.AdvanceConfig */
import { ref, computed, reactive, watch } from 'vue';
import {
    InputConfigurator,
    SwitchConfigurator
} from '@opentiny/tiny-engine-configurator';
import {
    useProperties,
    useCanvas,
    getConfigurator
} from '@opentiny/tiny-engine-meta-register';
import { PROP_DATA_TYPE } from '@opentiny/tiny-engine-common/js/constants';
import { constants, utils } from '@opentiny/tiny-engine-utils';
import { Tooltip } from '@opentiny/vue';

import {
    VariableConfigurator,
    CodeConfigurator
} from '@/components/i18n-wrappers';
import { useDesignerI18n } from '@/services/i18nService';

const { DEFAULT_LOOP_NAME } = constants;
const { string2Obj } = utils;

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        SwitchConfigurator,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTooltip: Tooltip,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        VariableConfigurator,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        InputConfigurator,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        CodeConfigurator
    },
    inheritAttrs: false,
    // eslint-disable-next-line vue/component-api-style
    setup() {
        const { t } = useDesignerI18n();
        const { pageState, getCurrentSchema, canvasApi } = useCanvas();
        const condition = ref(false);
        const isBind = computed(
            () => condition.value?.type === PROP_DATA_TYPE.JSEXPRESSION
        );
        const getIndexName = () =>
            useProperties().getSchema()?.loopArgs?.[1] ||
            DEFAULT_LOOP_NAME.INDEX;

        const state = reactive({
            loopData: null,
            loopItem: 'item',
            loopIndex: 'index',
            isLoop: computed(
                () => state.loopData?.type === PROP_DATA_TYPE.JSEXPRESSION
            ),
            loopKey: '',
            shouldUpdate: false
        });

        const getActiveSchema = () => {
            let schema = getCurrentSchema?.();

            if (!schema || (Array.isArray(schema) && schema.length === 0)) {
                schema = pageState?.currentSchema;
            }

            if (!schema && canvasApi?.value) {
                try {
                    const { getCurrent } = canvasApi.value;
                    const current = getCurrent?.();
                    if (current?.schema) {
                        const { schema: activeSchema } = current;
                        schema = activeSchema;
                    }
                } catch (error) {
                    // ignore
                }
            }

            if (Array.isArray(schema) && schema.length > 0) {
                return schema[0];
            }

            return schema || null;
        };

        const getActiveSchemaId = () => {
            const schema = getActiveSchema();
            return schema?.id || null;
        };

        watch(
            () => [getActiveSchemaId(), state.shouldUpdate],
            () => {
                const schema = getActiveSchema();

                condition.value =
                    schema?.condition === undefined ? true : schema?.condition;
                state.loopData = schema?.loop || null;
                state.loopItem = schema?.loopArgs?.[0] || '';
                state.loopIndex = schema?.loopArgs?.[1] || '';
                state.loopKey = schema?.props?.key?.value || '';
            },
            { immediate: true }
        );

        const setLoopKey = (value = '') => {
            // eslint-disable-next-line no-param-reassign
            const cleanedValue = value.replace(/\s*/g, '');
            const { getSchema, setProp } = useProperties();
            const schema = getSchema();

            if (!schema) {
                return;
            }

            const isNumber = Number(cleanedValue).toString() !== 'NaN';
            let newPropsKey = schema.props?.key;

            if (cleanedValue && !isNumber) {
                newPropsKey = {
                    type: PROP_DATA_TYPE.JSEXPRESSION,
                    value: cleanedValue
                };
            }

            if (!cleanedValue) {
                if (state.isLoop) {
                    newPropsKey = {
                        type: PROP_DATA_TYPE.JSEXPRESSION,
                        value: getIndexName()
                    };
                } else {
                    newPropsKey = '';
                }
            }

            setProp('key', newPropsKey);
        };

        watch([() => state.isLoop, () => state.loopIndex], () => {
            if (!state.loopKey && state.isLoop) {
                setLoopKey(getIndexName());
            }

            if (!state.isLoop) {
                setLoopKey('');
            }
        });

        const openEditor = () => {
            state.loopData = useProperties().getSchema()?.loop;
        };

        const setConfig = value => {
            const { getSchema } = useProperties();
            const schema = getSchema();

            if (!schema) {
                return;
            }

            const { operateNode } = useCanvas();

            if (value === false || value?.type) {
                operateNode({
                    type: 'updateAttributes',
                    id: schema.id,
                    value: { condition: value }
                });
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    condition: _schemaCondition,
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    children,
                    ...rest
                } = schema;
                operateNode({
                    type: 'updateAttributes',
                    id: schema.id,
                    value: { ...rest },
                    overwrite: true
                });
            }

            useCanvas().canvasApi.value.updateRect();
            condition.value = value;
        };

        const setLoopIndex = value => {
            const schema = useProperties().getSchema();
            let { loopArgs } = schema;
            const { operateNode } = useCanvas();

            if (loopArgs) {
                loopArgs[1] = value || DEFAULT_LOOP_NAME.INDEX;
            } else {
                loopArgs = [DEFAULT_LOOP_NAME.ITEM, value];
            }

            operateNode({
                type: 'updateAttributes',
                id: schema.id,
                value: { loopArgs }
            });
        };

        const setLoop = value => {
            const { operateNode } = useCanvas();
            const { getSchema } = useProperties();
            const schema = getSchema();

            if (value) {
                const newLoop = value?.type ? value : string2Obj(value);

                operateNode({
                    type: 'updateAttributes',
                    id: schema.id,
                    value: { loop: newLoop }
                });
                setLoopIndex(DEFAULT_LOOP_NAME.INDEX);
            } else {
                setLoopKey();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    loop: _loop,
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    loopArgs: _loopArgs,
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    children: _children,
                    ...rest
                } = schema;

                operateNode({
                    type: 'updateAttributes',
                    id: schema.id,
                    value: rest,
                    overwrite: true
                });
            }

            // 触发更新state
            state.shouldUpdate = !state.shouldUpdate;
        };

        const setLoopItem = value => {
            const schema = useProperties().getSchema();
            let { loopArgs } = schema;
            const { operateNode } = useCanvas();

            if (loopArgs) {
                loopArgs[0] = value || DEFAULT_LOOP_NAME.ITEM;
            } else {
                loopArgs = [value, DEFAULT_LOOP_NAME.INDEX];
            }

            operateNode({
                type: 'updateAttributes',
                id: schema.id,
                value: { loopArgs }
            });
        };

        return {
            condition,
            setConfig,
            isBind,
            state,
            setLoop,
            setLoopItem,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            DEFAULT_LOOP_NAME,
            openEditor,
            setLoopIndex,
            setLoopKey,
            getIndexName,
            t
        };
    }
};
</script>

<!-- eslint-disable-next-line vue/block-lang -->
<style lang="less" scoped>
.advanced-config-container {
    .advnce-config {
        &:not(:last-child) {
            margin-bottom: var(--te-common-vertical-item-spacing-normal);
        }
        align-items: center;
        display: flex;
        column-gap: 12px;
        color: var(--te-events-advanced-config-text-color);

        label {
            width: 80px;
            word-break: keep-all;
            color: var(--te-events-advanced-label-text-color);
            flex-shrink: 0;
        }

        .advanced-config-form-item {
            display: grid;
            grid-template-columns: 1fr auto;
            flex: 1;
        }
        .binding-state {
            box-sizing: border-box;
            background: var(--te-events-advanced-binding-state-bg-color);
            color: var(--te-events-advanced-binding-state-text-color);
            border: 1px solid
                var(--te-events-advanced-binding-state-border-color);
            font-size: 12px;
            height: 24px;
            line-height: 14px;
            padding: 4px 8px;
            --ellipsis-line: 1;
            border-radius: var(--te-base-border-radius-1);
        }

        .advance-config-loop-wrap {
            .advance-item {
                width: 100%;
            }
        }
    }
    .loop-data-item {
        display: block;
        label {
            margin-bottom: 5px;
        }
    }
}
</style>
