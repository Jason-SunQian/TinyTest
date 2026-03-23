<!-- eslint-disable vue/attribute-hyphenation, vue/v-on-event-hyphenation, vue/html-self-closing, vue/max-lines-per-block, vue/block-lang, import/order, @typescript-eslint/naming-convention, vue/component-api-style, vue/require-explicit-emits, @typescript-eslint/no-explicit-any -->
<template>
    <div class="text-input">
        <tiny-input
            :modelValue="inputValue"
            :placeholder="t('designer.common.pleaseInputContent')"
            v-bind="$attrs"
            @input="inputChange"
        >
            <template #suffix>
                <tiny-popover
                    ref="popoverRef"
                    width="340"
                    trigger="click"
                    :visible-arrow="false"
                    popper-class="i18n-input-popover"
                    @hide="onHide"
                >
                    <div class="popover-content">
                        <h3 class="title">
                            {{ t('designer.i18n.bindI18n.title') }}
                        </h3>
                        <icon-close
                            class="icon-close"
                            @click="closePopover"
                        ></icon-close>
                        <bind-i18n
                            ref="addI1i8nRef"
                            v-model="i18nValue"
                            :lang-data="langs"
                            :is-bind="isBind"
                            :currentLang="currentLanguage"
                            :data="modelValue"
                            :locales="i18nResource.locales"
                            @bind="setI18n"
                        ></bind-i18n>
                    </div>

                    <template #reference>
                        <svg-icon
                            name="internationalization"
                            :class="['icon-language', { isBind }]"
                        ></svg-icon>
                    </template>
                </tiny-popover>
            </template>
        </tiny-input>
    </div>
</template>

<script lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useTranslate } from '@opentiny/tiny-engine-meta-register';
import { Input, Popover } from '@opentiny/vue';
import { IconClose } from '@opentiny/vue-icon';

import { useDesignerI18n } from '@/services/i18nService';

import BindI18n from '../BindI18n/index.vue';

export default {
     
    name: 'I18nInput',
    components: {
         
        TinyInput: Input,
         
        BindI18n,
         
        TinyPopover: Popover,
         
        IconClose: IconClose()
    },
    inheritAttrs: false,
    props: {
        modelValue: {
            type: [String, Object] as () => string | Record<string, unknown>,
            default: ''
        }
    },
    emits: ['update:modelValue'],
     
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const { currentLanguage, getLangs, i18nResource } = useTranslate();
        const langs = computed(() => getLangs());
        const isBind = computed(() => props.modelValue?.type === 'i18n');
        const inputValue = ref('');
        const i18nValue = ref(props.modelValue?.key || '');
         
        const addI1i8nRef = ref<any>(null);
         
        const popoverRef = ref<any>(null);

        watchEffect(() => {
            i18nValue.value = props.modelValue?.key || '';
            inputValue.value = useTranslate().translate(props.modelValue);
        });

         
        const inputChange = (event: { target: { value: any } }) => {
            // 直接修改时去掉绑定
            emit('update:modelValue', event.target.value);
        };

         
        const setI18n = (data: any) => {
            emit('update:modelValue', data);
        };

        const onHide = () => {
            if (addI1i8nRef.value) {
                addI1i8nRef.value.showEditItem = false;
            }
        };

        const closePopover = () => {
            popoverRef.value.state.showPopper = false;
        };

        return {
            t,
            isBind,
            inputValue,
            inputChange,
            langs,
            i18nValue,
            currentLanguage,
            i18nResource,
            setI18n,
            addI1i8nRef,
            onHide,
            closePopover,
            popoverRef
        };
    }
};
</script>

<!-- eslint-disable-next-line vue/block-lang -->
<style lang="less" scoped>
.text-input {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.popover-content {
    position: relative;

    .title {
        margin-top: 0;
        margin-bottom: 16px;
        font-size: 14px;
        line-height: 20px;
    }
    .icon-close {
        position: absolute;
        top: 0;
        right: 0;
    }
}
.icon-language {
    color: var(--te-component-common-icon-color);
    outline: none;
    &:hover {
        cursor: pointer;
        color: var(--te-component-common-icon-color-hover);
    }
    &.isBind {
        color: var(--te-component-common-icon-color-primary);
    }
}
</style>

<style lang="scss">
.tiny-popover.tiny-popover.tiny-popper[x-placement].i18n-input-popover {
    padding: 20px;
}
</style>
