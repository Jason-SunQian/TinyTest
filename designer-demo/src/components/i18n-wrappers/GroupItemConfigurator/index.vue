<!-- eslint-disable vue/block-lang, @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention, vue/component-api-style, vue/require-explicit-emits, vue/html-self-closing, vue/v-on-event-hyphenation, import/order, vue/require-typed-object-prop -->
<template>
    <div class="meta-group-container">
        <label
            v-if="meta.label && !meta.label.hidden"
            class="meta-group-label"
            >{{ labelText }}</label>
        <meta-child-item
            :meta="meta"
            @update:modelValue="onValueChange"
        ></meta-child-item>
        <div
            v-if="!meta.widget.props.hiddenTopLine"
            class="sep-line top-line"
        ></div>
        <div
            v-if="!meta.widget.props.hiddenBottomLine"
            class="sep-line bottom-line"
        ></div>
    </div>
</template>

<script lang="ts">
import { computed } from 'vue';
import { MetaChildItem } from '@opentiny/tiny-engine-common';

import { useDesignerI18n } from '@/services/i18nService';
 
import { getLocalizedText, containsChinese } from '@/utils/i18nHelper';

export default {
    name: 'i18n-group-item-configurator',
    components: {
         
        MetaChildItem
    },
    inheritAttrs: false,
    props: {
        meta: {
             
            type: Object,
            default: () => ({})
        }
    },
    emits: ['update:modelValue'],
     
    setup(props, { emit }) {
        const { locale } = useDesignerI18n();

        // 获取标签文本，支持国际化
        const labelText = computed(() => {
            const labelObj = props.meta?.label?.text;
            const currentLang = locale.value;

            if (!labelObj) {
                return '';
            }

            // 如果是对象，尝试获取当前语言的文本
            if (typeof labelObj === 'object') {
                const text = getLocalizedText(labelObj, currentLang);
                if (text) {
                    return text;
                }

                // 英文环境下，如果没有翻译，不回退到中文
                if (currentLang === 'en_US') {
                    return '';
                }
            }

            // 如果是字符串
            if (typeof labelObj === 'string') {
                // 英文环境下，如果是中文，不回退
                if (currentLang === 'en_US' && containsChinese(labelObj)) {
                    return '';
                }
                return labelObj;
            }

            return '';
        });

        const onValueChange = ({ propertyKey, propertyValue }) => {
            const newPropertyValue = {
                ...props.meta.widget?.props?.modelValue,
                [propertyKey]: propertyValue
            };
            emit('update:modelValue', newPropertyValue);
        };

        return { labelText, onValueChange };
    }
};
</script>

<!-- eslint-disable-next-line vue/block-lang -->
<style lang="scss" scoped>
.meta-group-container {
    position: relative;
    width: 100%;
    .sep-line {
        position: absolute;
        background-color: var(--te-configurator-common-bg-color-transparent);
        height: 1px;
        width: 272px;
        left: -16px;
    }
    .top-line {
        top: -10px;
    }
    .bottom-line {
        bottom: -10px;
    }
}
</style>
