<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <div class="property-setting-container">
        <div class="property-title" @click="handleCancelEdit">
            <icon-chevron-left />
            {{ propertyName }}
        </div>
        <tiny-form
            class="property-form"
            label-position="left"
            label-width="110px"
        >
            <tiny-form-item :label="t('designer.block.propertyName')">
                <tiny-input v-model="propertyName" />
            </tiny-form-item>
            <tiny-form-item :label="t('designer.block.propertyValueType')">
                <tiny-select
                    v-model="type"
                    :options="typeList"
                    @change="changeType"
                />
            </tiny-form-item>
            <tiny-form-item :label="t('designer.block.propertyPanelComponent')">
                <tiny-select
                    v-model="widgetComponent"
                    :options="widgetComponentList"
                    @change="handleChangeWidgetComponent"
                />
                <div class="global-desc-info">
                    {{ t('designer.block.propertyPanelComponentDescription') }}
                </div>
            </tiny-form-item>
            <tiny-form-item
                :label="t('designer.block.propertyPanelComponentProps')"
            >
                <meta-code-editor
                    :model-value="widgetProps"
                    :title="t('designer.block.propertyPanelComponentProps')"
                    :button-text="t('designer.common.set')"
                    language="json"
                    :tips="componentPropsTips"
                    @save="handleSaveWidgetProps"
                />
            </tiny-form-item>
            <tiny-form-item
                v-if="showArrayItemConfig"
                :label="t('designer.block.configItems')"
            >
                <meta-list-items
                    class="config-list"
                    :options-list="arrayConfig"
                >
                    <template #content="{ data }">
                        <div :class="{ 'item-text': true }">
                            {{ data?.property }}
                        </div>
                    </template>
                    <template #operate="{ data }">
                        <div class="operate-right-container">
                            <tiny-tooltip
                                class="item"
                                effect="light"
                                :content="t('designer.common.edit')"
                                placement="top"
                            >
                                <span
                                    class="item-icon"
                                    @click.stop="handleEdit(data)"
                                >
                                    <svg-icon name="to-edit" />
                                </span>
                            </tiny-tooltip>
                            <tiny-tooltip
                                class="item"
                                effect="light"
                                :content="t('designer.common.delete')"
                                placement="top"
                            >
                                <span class="item-icon" @click="del(data)">
                                    <svg-icon name="delete" />
                                </span>
                            </tiny-tooltip>
                        </div>
                    </template>
                </meta-list-items>
                <span class="add-item-btn" @click="handleAddItem">
                    <icon-plus-circle class="icon" />
                    <span class="text">{{ t('designer.block.addItem') }}</span>
                </span>
                <teleport to=".block-manage">
                    <div
                        v-if="showPropertyConfigItem"
                        class="config-item-container"
                        @click.stop
                    >
                        <div
                            v-for="(data, idx) in itemConfig"
                            :key="idx"
                            class="meta-config-item"
                        >
                            <config-item
                                :key="idx"
                                :property="data"
                                :data-prop-index="idx"
                                :data-group-index="index"
                                @update:model-value="
                                    handleConfigItemChange(
                                        data.property,
                                        $event
                                    )
                                "
                            >
                                <slot name="prefix" :data="data" />
                                <slot name="suffix" :data="data" />
                            </config-item>
                        </div>
                    </div>
                </teleport>
            </tiny-form-item>
            <tiny-form-item :label="t('designer.block.defaultValue')">
                <config-item
                    :property="defaultValueProperty"
                    :only-edit="true"
                    @update:model-value="updateDefaultValue"
                />
            </tiny-form-item>
            <tiny-form-item :label="t('designer.block.propertyDisplayName')">
                <tiny-input v-model="label" />
            </tiny-form-item>
            <tiny-form-item :label="t('designer.block.getPropertyValue')">
                <meta-code-editor
                    :model-value="getterValue"
                    :title="t('designer.block.getPropertyValue')"
                    button-text="getter"
                    language="javascript"
                    single
                    @save="(...args) => saveAccessor('getter', ...args)"
                />
            </tiny-form-item>
            <tiny-form-item :label="t('designer.block.setPropertyValue')">
                <meta-code-editor
                    :model-value="setterValue"
                    :title="t('designer.block.setPropertyValue')"
                    button-text="setter"
                    language="javascript"
                    single
                    @save="(...args) => saveAccessor('setter', ...args)"
                />
            </tiny-form-item>
            <div v-if="property.linked" class="linked-info">
                {{ t('designer.block.linkedToComponent') }}:
                {{ property.linked.componentName }}
                {{ t('designer.block.property') }}:
                {{ property.linked.property }}
            </div>
        </tiny-form>
    </div>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
/* metaService: engine.plugins.blockmanage.BlockPropertyForm */
import { computed, ref, watch, inject } from 'vue';
import {
    Input as TinyInput,
    Form as TinyForm,
    FormItem as TinyFormItem,
    Select as TinySelect,
    Tooltip as TinyTooltip
} from '@opentiny/vue';
import { iconChevronLeft, iconPlusCircle } from '@opentiny/vue-icon';
import {
    MetaListItems,
    MetaCodeEditor
} from '@opentiny/tiny-engine-common';
import { ConfigItem } from '@/components/i18n-wrappers';
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n';

import {
    getEditProperty,
    DEFAULT_ARRAY_CONFIG,
    META_COMPONENTS_ENUM
} from './js/blockSetting';
import {
    itemConfig,
    arrayConfig,
    showArrayItemConfig,
    type,
    label,
    propertyName,
    widgetComponent,
    saveAccessor,
    handleConfigItemChange,
    handleAddItem,
    del,
    handleSaveWidgetProps,
    updateDefaultValue,
    handleChangeWidgetComponent,
    handleEdit,
    handleCancelEdit,
    changeType,
    widgetComponentList,
    typeList,
    showPropertyConfigItem
} from './js/blockPropertyForm';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyForm,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyInput,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinySelect,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyFormItem,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ConfigItem,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        MetaCodeEditor,
        // eslint-disable-next-line @typescript-eslint/naming-convention, new-cap
        IconChevronLeft: iconChevronLeft(),
        // eslint-disable-next-line @typescript-eslint/naming-convention, new-cap
        IconPlusCircle: iconPlusCircle(),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        MetaListItems,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTooltip
    },
    // eslint-disable-next-line vue/component-api-style
    setup() {
        // 获取国际化 t 函数
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const i18n: any = inject(I18nInjectionKey);
        const t = i18n?.global?.t || ((key: string) => key);

        const property = computed(() => getEditProperty() || {});
        const propertyValue = computed(() => property.value);
        const getterValue = computed(() => {
            const currentProperty = propertyValue.value;
            return (
                currentProperty?.accessor?.getter?.value ||
                'function getter() {}'
            );
        });
        const setterValue = computed(() => {
            const currentProperty = propertyValue.value;
            return (
                currentProperty?.accessor?.setter?.value ||
                'function setter() {}'
            );
        });
        const getDefaultValueProperty = () => {
            const currentProperty = propertyValue.value;
            const currentWidget = currentProperty?.widget;
            return {
                ...currentProperty,
                widget: {
                    props: {
                        ...currentWidget?.props
                    },
                    component:
                        currentWidget?.component ===
                        META_COMPONENTS_ENUM.ArrayItemConfigurator
                            ? META_COMPONENTS_ENUM.CodeConfigurator
                            : currentWidget?.component
                }
            };
        };
        const defaultValueProperty = ref(getDefaultValueProperty());

        const componentPropsTips = ref({
            title: t('designer.block.componentPropsTipsTitle'),
            demo: t('designer.block.componentPropsTipsDemo')
        });
        watch(
            () => getEditProperty(),
            // eslint-disable-next-line @typescript-eslint/no-shadow
            propertyValue => {
                if (!propertyValue) {
                    return;
                }

                const {
                    defaultValue,
                    widget: { props, component },
                    ...otherProperty
                } = propertyValue;

                const newDefaultValueProperty = {
                    ...otherProperty,
                    widget: {
                        props: {
                            ...props,
                            modelValue: defaultValue
                        },
                        component:
                            component ===
                            META_COMPONENTS_ENUM.ArrayItemConfigurator
                                ? META_COMPONENTS_ENUM.CodeConfigurator
                                : component
                    }
                };

                Object.assign(
                    defaultValueProperty.value,
                    newDefaultValueProperty
                );
            },
            {
                deep: true
            }
        );

        const widgetProps = computed(() => property.value?.widget?.props || {});

        return {
            type,
            label,
            property,
            typeList,
            getterValue,
            setterValue,
            propertyName,
            changeType,
            saveAccessor,
            updateDefaultValue,
            handleCancelEdit,
            widgetProps,
            handleSaveWidgetProps,
            widgetComponent,
            widgetComponentList,
            handleChangeWidgetComponent,
            arrayConfig,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            DEFAULT_ARRAY_CONFIG,
            handleEdit,
            del,
            handleAddItem,
            showPropertyConfigItem,
            handleConfigItemChange,
            itemConfig,
            defaultValueProperty,
            showArrayItemConfig,
            componentPropsTips,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.property-setting-container {
    padding: 12px 15px;
}

.property-title {
    margin-bottom: 12px;
    cursor: pointer;
    fill: currentcolor;
}

.property-form {
    :deep(.tiny-form-item__label) {
        font-size: 12px;
    }
}

.add-item-btn {
    display: inline-block;
    margin-top: 6px;
    font-size: 12px;
    color: var(--te-block-property-add-item-text-color);
    cursor: pointer;

    .text {
        margin-left: 4px;
    }
}

.linked-info {
    margin-top: 10px;
    padding: 15px 0px;
}

.handle {
    display: flex;
    align-items: center;
    margin: 10px 0;
}

.config-item-container {
    position: absolute;
    right: calc(-280px - var(--base-collection-panel-width));
    top: 0;
    width: 280px;
    height: 100%;
    padding: 20px;
    background-color: var(--te-block-property-config-item-bg-color);
    border-right: 1px solid var(--te-block-property-config-item-border-color);
}

.config-list {
    :deep(.operate-right-container) {
        .item-icon {
            cursor: pointer;
            padding: 2px;
        }

        .item + .item {
            margin-left: 8px;
        }
    }
}
</style>
