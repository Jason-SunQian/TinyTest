<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="properties-list">
        <tiny-collapse v-model="activeNames">
            <tiny-collapse-item
                v-for="(group, groupIndex) in data"
                :key="group"
                :name="groupIndex"
            >
                <template #title>
                    <slot name="title" :group="group">
                        <div @click="onGroupClick(group)">
                            {{ getGroupLabel(group) }}
                        </div>
                    </slot>
                </template>
                <config-group
                    :group="group"
                    :index="groupIndex"
                    :design="design"
                    :emptyText="getEmptyText"
                >
                    <template #item="{ data, propIndex }">
                        <config-item
                            :key="propIndex"
                            :properties="properties"
                            :property="data"
                            :data-prop-index="propIndex"
                            :data-group-index="groupIndex"
                            :isTopLayer="true"
                            :group="group"
                            @click="onPropClick(data)"
                        >
                            <template #prefix>
                                <slot name="prefix" :data="data"></slot>
                            </template>
                            <template v-if="!data.noBinding" #suffix>
                                <slot name="suffix" :data="data"></slot>
                            </template>
                        </config-item>
                    </template>
                </config-group>
            </tiny-collapse-item>
        </tiny-collapse>
    </div>
</template>

<!-- eslint-disable vue/block-lang, vue/require-explicit-emits -->
<script lang="ts">
import { computed, provide, ref, watchEffect } from 'vue';
import { Collapse, CollapseItem } from '@opentiny/vue';
import ConfigGroup from '../ConfigGroup/index.vue';
import ConfigItem from '../ConfigItem/index.vue';

import { useDesignerI18n } from '@/services/i18nService';
import { getLocalizedText, formatPropertyName, translateChineseGroupName } from '@/utils/i18nHelper';

export default {
    components: {
        TinyCollapse: Collapse,
        TinyCollapseItem: CollapseItem,
        ConfigGroup,
        ConfigItem
    },
    props: {
        data: {
            type: [Array, Object],
            default: () => []
        },
        design: Boolean,
        emptyText: {
            type: String,
            default: undefined
        }
    },
    emits: ['selected', 'select-prop', 'select-group'],
    setup(props, { emit }) {
        const { locale } = useDesignerI18n();
        const activeNames = ref([]);

        const getPropsObj = (data?: Record<string, any> | any[]) => {
            const obj = {};

            data?.forEach(({ content }) => {
                if (content.length) {
                    content.forEach(
                        (
                            item: {
                                schema: string | any[];
                                widget: { props: { modelValue: any } };
                                property: string | number;
                            }
                        ) => {
                            const node: any = item.schema?.length
                                ? getPropsObj(item.schema)
                                : {};

                            node.setValue = (value: any) => {
                                item.widget.props.modelValue = value;
                            };
                            obj[item.property] = node;
                        }
                    );
                }
            });

            return obj;
        };

        const propsObj = computed(() => getPropsObj(props.data || []));

        provide('propsObj', propsObj);

        const onPropClick = (data: any) => emit('select-prop', data);
        const onGroupClick = (data: any) => emit('select-group', data);

        const filterActiveGroup = (data: any[] | Record<string, any>) =>
            data?.filter?.((item: { fold: any }) => !item.fold)?.map?.(
                (item: any, index: any) => index
            ) || [];

        watchEffect(() => {
            activeNames.value = filterActiveGroup(props.data);
        });

        const properties = computed(() => props.data);

        // 获取分组标签，支持国际化
        const getGroupLabel = (group: any) => {
            const currentLang = locale.value;
            
            // 1. 优先使用 label 的国际化翻译
            if (group?.label) {
                const result = getLocalizedText(group.label, currentLang);
                if (result) {
                    return result;
                }
            }
            
            // 2. 英文环境下，尝试使用映射表翻译中文标签
            if (currentLang === 'en_US') {
                if (group?.label && typeof group.label === 'object' && group.label.zh_CN) {
                    const translated = translateChineseGroupName(group.label.zh_CN);
                    if (translated) {
                        return translated;
                    }
                }
                
                // 3. 回退到 group.name 或 group.group（跳过纯数字）
                const fallbackFields = [group?.name, group?.group].filter(Boolean);
                for (const field of fallbackFields) {
                    const fieldStr = String(field);
                    if (!/^\d+$/.test(fieldStr)) {
                        const formatted = formatPropertyName(fieldStr, currentLang);
                        if (formatted) {
                            return formatted;
                        }
                    }
                }
                
                // 4. 最后回退到中文标签（至少显示内容而不是空白）
                if (group?.label?.zh_CN) {
                    return group.label.zh_CN;
                }
                
                return '';
            }
            
            // 5. 中文环境下，回退到中文
            if (currentLang === 'zh_CN' && group?.label) {
                const zhText = typeof group.label === 'object' 
                    ? group.label.zh_CN 
                    : group.label;
                return zhText || '';
            }
            
            return '';
        };

        const getEmptyText = computed(() => {
            if (props.emptyText) {
                return props.emptyText;
            }
            return locale.value === 'en_US' ? 'Empty' : '空';
        });

        return {
            onPropClick,
            onGroupClick,
            activeNames,
            properties,
            getGroupLabel,
            getEmptyText
        };
    }
};
</script>

