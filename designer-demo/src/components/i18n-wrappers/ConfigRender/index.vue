<!-- eslint-disable vue/multi-word-component-names, vue/attribute-hyphenation, vue/no-template-shadow, vue/html-self-closing, vue/max-lines-per-block, import/order, @typescript-eslint/naming-convention, vue/require-typed-object-prop, vue/component-api-style, @typescript-eslint/no-explicit-any -->
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
<!-- eslint-disable-next-line vue/max-lines-per-block, import/order -->
<script lang="ts">
/* eslint-disable import/order */
import { computed, provide, ref, watchEffect } from 'vue';
import { Collapse, CollapseItem } from '@opentiny/vue';
import ConfigGroup from '../ConfigGroup/index.vue';
import ConfigItem from '../ConfigItem/index.vue';

import { useDesignerI18n } from '@/services/i18nService';
import {
    getLocalizedText,
    formatPropertyName,
    translateChineseGroupName
} from '@/utils/i18nHelper';

interface GroupLabel {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    zh_CN?: string;
    [key: string]: string | undefined;
}

interface GroupItem {
    fold?: boolean;
    label?: string | GroupLabel;
    name?: string | number;
    group?: string | number;
    [key: string]: unknown;
}

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyCollapse: Collapse,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyCollapseItem: CollapseItem,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ConfigGroup,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ConfigItem
    },
    props: {
        data: {
            // eslint-disable-next-line vue/require-typed-object-prop
            type: [Array, Object],
            default: () => []
        },
        design: {
            // eslint-disable-next-line vue/require-typed-object-prop
            type: Boolean,
            default: false
        },
        emptyText: {
            // eslint-disable-next-line vue/require-typed-object-prop
            type: String,
            default: undefined
        }
    },
    emits: ['selected', 'select-prop', 'select-group'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { locale, t } = useDesignerI18n();
        const activeNames = ref([]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const getPropsObj = (data?: Record<string, any> | any[]) => {
            const obj = {};

            data?.forEach(({ content }) => {
                if (content.length) {
                    content.forEach(
                        (item: {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            schema: string | any[];
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            widget: { props: { modelValue: any } };
                            property: string | number;
                        }) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const node: any = item.schema?.length
                                ? getPropsObj(item.schema)
                                : {};

                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        const onPropClick = (data: GroupItem) => emit('select-prop', data);
        const onGroupClick = (data: GroupItem) => emit('select-group', data);

        const filterActiveGroup = (
            data: GroupItem[] | Record<string, GroupItem>
        ) => {
            if (Array.isArray(data)) {
                const filtered = data.filter((item: GroupItem) => !item.fold);
                return filtered.map((_item: GroupItem, index: number) => index);
            }
            return [];
        };

        watchEffect(() => {
            activeNames.value = filterActiveGroup(props.data);
        });

        const properties = computed(() => props.data);

        // 获取分组标签，支持国际化
        const getGroupLabel = (group: GroupItem) => {
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
                if (
                    group?.label &&
                    typeof group.label === 'object' &&
                    group.label.zh_CN
                ) {
                    const translated = translateChineseGroupName(
                        group.label.zh_CN
                    );
                    if (translated) {
                        return translated;
                    }
                }

                // 3. 回退到 group.name 或 group.group（跳过纯数字）
                const fallbackFields = [group?.name, group?.group].filter(
                    Boolean
                );
                for (const field of fallbackFields) {
                    const fieldStr = String(field);
                    if (!/^\d+$/.test(fieldStr)) {
                        const formatted = formatPropertyName(
                            fieldStr,
                            currentLang
                        );
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
                const zhText =
                    typeof group.label === 'object'
                        ? group.label.zh_CN
                        : group.label;
                return zhText || '';
            }

            return '';
        };

        const getEmptyText = computed(() => {
            // 如果明确传入了 emptyText 且不是默认的 "空" 或 "Empty"，则使用传入的值
            // 否则使用 i18n 翻译
            if (props.emptyText && props.emptyText !== '空' && props.emptyText !== 'Empty') {
                return props.emptyText;
            }
            return t('designer.settings.props.emptyText');
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
