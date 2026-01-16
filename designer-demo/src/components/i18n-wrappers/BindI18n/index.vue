<!-- eslint-disable vue/attribute-hyphenation, vue/v-on-event-hyphenation, vue/html-self-closing, vue/max-lines-per-block, vue/block-lang, import/order, @typescript-eslint/naming-convention, vue/component-api-style, vue/require-explicit-emits, @typescript-eslint/no-explicit-any, vue/multi-word-component-names, @typescript-eslint/array-type -->
<template>
    <div ref="languageContent" class="languageContent">
        <div v-show="!showEditItem">
            <tiny-select
                ref="selectRef"
                v-model="selectValue"
                :placeholder="t('designer.i18n.bindI18n.selectPlaceholder')"
                filterable
                is-drop-inherit-width
                :filter-method="filterMethod"
                @change="selectI18n"
            >
                <tiny-option
                    v-for="item in langData"
                    :key="item.key"
                    :label="`${item[currentLang]} (${item.key})`"
                    :value="item.key"
                >
                </tiny-option>
            </tiny-select>
            <div v-if="paramsForm.length" class="params-form">
                <div class="label">
                    {{ t('designer.i18n.bindI18n.paramsLabel') }}
                </div>
                <div
                    v-for="param in paramsForm"
                    :key="param.name"
                    class="params-item"
                >
                    <label>{{ param.name }}</label>
                    <tiny-input
                        v-model="param.value"
                        @update:modelValue="paramsChange"
                    ></tiny-input>
                </div>
            </div>
            <slot name="suffix">
                <div
                    class="bottom-buttons"
                    :class="{ 'buttons-centered': isBind }"
                >
                    <tiny-button v-if="isBind" @click="unbindI18n">{{
                        t('designer.i18n.bindI18n.unbind')
                    }}</tiny-button>
                    <tiny-button type="primary" @click="openCreateForm">
                        {{ t('designer.i18n.bindI18n.createNew') }}
                    </tiny-button>
                </div>
            </slot>
        </div>
        <div v-show="showEditItem" class="addNewLanguage">
            <div>
                <div class="tiny-input">
                    <label>{{ t('designer.i18n.bindI18n.uniqueKey') }}</label>
                    <input v-model="editForm.key" class="tiny-input__inner" />
                </div>

                <div
                    v-for="locale in filteredLocales"
                    :key="locale.lang"
                    class="tiny-input"
                >
                    <label>{{ locale.label }}</label>
                    <input
                        v-model="editForm[locale.lang]"
                        class="tiny-input__inner"
                    />
                </div>
            </div>
            <div class="bottom-buttons">
                <tiny-button @click="activeI18n">{{
                    t('designer.i18n.bindI18n.i18nManagement')
                }}</tiny-button>
                <tiny-button type="primary" @click="addBindI18n">{{
                    t('designer.i18n.bindI18n.addAndBind')
                }}</tiny-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/* eslint-disable vue/max-lines-per-block */
import { reactive, ref, watchEffect, computed } from 'vue';
import { useLayout, useTranslate } from '@opentiny/tiny-engine-meta-register';
import { PROP_DATA_TYPE } from '@opentiny/tiny-engine-common/js/constants';
import { utils } from '@opentiny/tiny-engine-utils';
import { Select, Option, Button, Input } from '@opentiny/vue';

import { useDesignerI18n } from '@/services/i18nService';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinySelect: Select,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyOption: Option,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyButton: Button,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyInput: Input
    },
    inheritAttrs: false,
    props: {
        currentLang: {
            type: String,
            default: ''
        },
        isBind: Boolean,
        langData: {
            type: [Array, Object] as () => unknown[] | Record<string, unknown>,
            default: () => []
        },
        modelValue: {
            type: String,
            default: ''
        },
        data: {
            type: [Object, String] as () => Record<string, unknown> | string,
            default: () => ({})
        },
        locales: {
            type: Array as () => unknown[],
            default: () => []
        }
    },
    emits: ['bind'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const selectValue = ref(props.modelValue);
        const showEditItem = ref(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const selectRef = ref<any>(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const editForm = reactive<any>({});
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const paramsForm = ref<any[]>([]);

        // 过滤掉中文（zh_CN），只保留英文（en_US）和其他语言
        const filteredLocales = computed(() => {
            if (!props.locales) return [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return props.locales.filter(
                (locale: any) => locale.lang !== 'zh_CN'
            );
        });

        watchEffect(() => {
            selectValue.value = props.modelValue;
            if (props.modelValue && props.langData[props.modelValue]) {
                const curValue =
                    props.langData[props.modelValue][props.currentLang] || '';
                const params: any[] = [];
                const data = props?.data?.params || {};

                curValue.replace(/\{(.+?)\}/g, (substr, key) => {
                    if (key) {
                        params.push({ name: key, value: data[key] || '' });
                    }
                });
                paramsForm.value = params;
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filterMethod = (value: any) => {
            const options = selectRef.value.state.cachedOptions;

            options.forEach((item: any) => {
                item.state.visible = value
                    ? item.label.indexOf(value) > -1
                    : true;
            });
        };

        const selectI18n = (key: string) => {
            const data = props.langData[key] || {};

            emit('bind', { ...data, key });
        };

        const { activePlugin } = useLayout();
        const activeI18n = () => activePlugin('engine.plugins.customI18n');

        const addBindI18n = () => {
            useTranslate().ensureI18n(editForm, true);
            emit('bind', { ...editForm });
            showEditItem.value = false;
        };

        const unbindI18n = () => {
            const i18nObj = props.langData[props.modelValue];

            emit('bind', i18nObj[props.currentLang]);
            showEditItem.value = false;
        };

        const paramsChange = () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const params: Record<string, any> = {};

            paramsForm.value.forEach(({ name, value }) => {
                params[name] = value;
            });
            emit('bind', {
                type: PROP_DATA_TYPE.I18N,
                key: selectValue.value,
                params
            });
        };

        const openCreateForm = () => {
            Object.keys(editForm).forEach(key => delete editForm[key]);
            editForm.key = `lowcode.${utils.guid()}`;
            editForm.type = PROP_DATA_TYPE.I18N;
            showEditItem.value = true;
        };

        return {
            t,
            selectRef,
            showEditItem,
            filterMethod,
            selectI18n,
            selectValue,
            activeI18n,
            addBindI18n,
            unbindI18n,
            paramsForm,
            paramsChange,
            editForm,
            openCreateForm,
            filteredLocales
        };
    }
};
</script>

<!-- eslint-disable-next-line vue/block-lang -->
<style lang="less" scoped>
.languageContent {
    z-index: 99;

    .tiny-svg {
        margin-right: 10px;
        font-size: 16px;
        &:hover {
            cursor: pointer;
            color: #ccc;
        }
    }
    .addNewLanguage {
        .tiny-input {
            display: flex;
            margin-bottom: 10px;
            padding: 0 8px;
            align-items: center;
            label {
                text-wrap: nowrap;
                text-align: left;
                width: 50px;
            }
            display: flex;
        }
        .tiny-input__inner {
            flex: 1;
        }
    }
}
.params-form {
    .label {
        margin: 16px 0;
        font-size: 12px;
        line-height: 18px;
    }
    .params-item + .params-item {
        margin-top: 12px;
    }
    .params-item {
        display: flex;
        align-items: center;
        label {
            width: 80px;
        }
    }
}
.bottom-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    gap: 8px;
    flex-wrap: wrap;
    .tiny-button,
    .tiny-button.tiny-button--default {
        margin: 0;
        flex-shrink: 0;
    }
    &.buttons-centered {
        justify-content: center;
    }
}
</style>
