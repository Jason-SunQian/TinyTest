<!-- eslint-disable vue/attribute-hyphenation, import/order, @typescript-eslint/naming-convention, vue/component-api-style, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, camelcase -->
<template>
    <meta-code-editor
        v-bind="$attrs"
        :buttonText="i18nButtonText"
        :title="i18nTitle"
        @save="$emit('save', $event)"
        @open="$emit('open', $event)"
        @close="$emit('close', $event)"
    >
        <template v-for="(_, slot) in $slots" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
        </template>
    </meta-code-editor>
</template>

<script lang="ts">
import { computed } from 'vue';
import { MetaCodeEditor } from '@opentiny/tiny-engine-common';

import { useDesignerI18n } from '@/services/i18nService';

export default {
    name: 'i18n-code-configurator',
    components: {
         
        MetaCodeEditor
    },
    inheritAttrs: false,
    emits: ['save', 'open', 'close'],
     
    setup(props: Record<string, unknown>, { attrs }) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { locale } = useDesignerI18n();

        // 国际化 buttonText
        const i18nButtonText = computed(() => {
            const buttonText = attrs.buttonText || props.buttonText;

            // 如果已经是多语言对象，直接返回
            if (
                buttonText &&
                typeof buttonText === 'object' &&
                (buttonText.zh_CN || buttonText.en_US)
            ) {
                return buttonText;
            }

            // 如果是字符串且是中文，返回多语言对象
            if (
                typeof buttonText === 'string' &&
                /[\u4e00-\u9fa5]/.test(buttonText)
            ) {
                return {
                     
                    zh_CN: buttonText,
                     
                    en_US: buttonText === '编辑代码' ? 'Edit Code' : buttonText
                };
            }

            // 如果已经是英文或其他语言，返回多语言对象
            if (typeof buttonText === 'string') {
                return {
                     
                    zh_CN: '编辑代码',
                     
                    en_US: buttonText
                };
            }

            // 默认返回多语言对象
            return {
                 
                zh_CN: '编辑代码',
                 
                en_US: 'Edit Code'
            };
        });

        // 国际化 title
        const i18nTitle = computed(() => {
            const title = attrs.title || props.title;

            // 如果已经是多语言对象，直接返回
            if (
                title &&
                typeof title === 'object' &&
                (title.zh_CN || title.en_US)
            ) {
                return title;
            }

            // 如果是字符串且是中文，返回多语言对象
            if (typeof title === 'string' && /[\u4e00-\u9fa5]/.test(title)) {
                return {
                     
                    zh_CN: title,
                     
                    en_US: title === '编辑代码' ? 'Edit Code' : title
                };
            }

            // 如果已经是英文或其他语言，返回多语言对象
            if (typeof title === 'string') {
                return {
                     
                    zh_CN: '编辑代码',
                     
                    en_US: title
                };
            }

            // 默认返回多语言对象
            return {
                 
                zh_CN: '编辑代码',
                 
                en_US: 'Edit Code'
            };
        });

        return {
            i18nButtonText,
            i18nTitle
        };
    }
};
</script>
