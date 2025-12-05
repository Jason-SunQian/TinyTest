<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <tiny-form
        ref="blockForm"
        class="block-setting-content"
        label-position="top"
        :model="formData"
        :rules="rules"
        validate-type="text"
    >
        <tiny-form-item :label="t('designer.block.blockName')" prop="name_cn">
            <div>
                <tiny-input
                    v-model="formData.name_cn"
                    :placeholder="t('designer.block.placeholderBlockName')"
                    @blur="changeBlockProperty('name_cn')"
                />
            </div>
        </tiny-form-item>
        <tiny-form-item :label="t('designer.block.blockId')" prop="label">
            <div>
                <tiny-input
                    v-model="formData.label"
                    :placeholder="t('designer.block.placeholderBlockId')"
                    disabled
                />
            </div>
            <div class="global-desc-info">
                {{ t('designer.block.blockIdDescription') }}
            </div>
        </tiny-form-item>
        <tiny-form-item
            :label="t('designer.block.blockDescription')"
            prop="description"
        >
            <div>
                <tiny-input
                    v-model="formData.description"
                    :placeholder="
                        t('designer.block.placeholderBlockDescription')
                    "
                    @blur="changeBlockProperty('description')"
                />
            </div>
        </tiny-form-item>
        <tiny-form-item :label="groupLabels.select" prop="categoryId">
            <tiny-select
                ref="groupSelect"
                v-model="formData.categoryId"
                popper-class="block-popper"
                :placeholder="groupLabels.selectPlaceholder"
                :options="categoryList"
                :multiple="shouldReplaceCategoryWithGroup()"
                filterable
                :filter-method="categoryFilter"
                clearable
                @change="changeCategory"
            />
        </tiny-form-item>
        <tiny-form-item :label="t('designer.block.blockTags')" prop="tags">
            <div class="block-tag-create">
                <tiny-tag
                    v-for="(tag, index) in formData.tags"
                    :key="index"
                    closable
                    class="tag-button"
                    @close="deleteTag(tag)"
                >
                    <span :title="tag" class="tag-item-text">{{ tag }}</span>
                </tiny-tag>
                <tiny-input
                    v-show="state.inputVisible"
                    ref="saveTagInput"
                    v-model="state.inputValue"
                    size="small"
                    @keyup.enter="confirmTagInput"
                    @blur="confirmTagInput"
                />
                <tiny-button
                    v-show="!state.inputVisible"
                    class="button-new-tag"
                    size="small"
                    @click="addTag"
                >
                    <svg-icon name="add" />{{ t('designer.block.tag') }}
                </tiny-button>
            </div>
            <div class="global-desc-info">
                {{ t('designer.block.tagDescription') }}
            </div>
        </tiny-form-item>
        <tiny-form-item
            :label="t('designer.block.publicScope')"
            prop="openness"
        >
            <div class="block-openness">
                <div class="block-openness-public">
                    <tiny-radio
                        v-model="formData.public"
                        :label="BLOCK_OPENNESS.Private"
                        @change="changeOpenness"
                        >{{ t('designer.block.private') }}</tiny-radio>
                    <tiny-radio
                        v-model="formData.public"
                        :label="BLOCK_OPENNESS.Open"
                        @change="changeOpenness"
                        >{{ t('designer.block.public') }}</tiny-radio>
                    <tiny-radio
                        v-model="formData.public"
                        :label="BLOCK_OPENNESS.Special"
                        @change="changeOpenness"
                        >{{ t('designer.block.semiPublic') }}</tiny-radio>
                    <div
                        v-show="formData.public === BLOCK_OPENNESS.Special"
                        class="block-openness-tenants"
                    >
                        <tiny-select
                            v-model="formData.public_scope_tenants"
                            :placeholder="
                                t('designer.block.selectOrganization')
                            "
                            filterable
                            collapse-tags
                            multiple
                            @change="
                                changeBlockProperty('public_scope_tenants')
                            "
                        >
                            <tiny-option
                                v-for="item in state.publicOptions"
                                :key="item.id"
                                :label="item.name_cn || item.tenant_id"
                                :value="item.id"
                            />
                        </tiny-select>
                    </div>
                </div>
            </div>
            <div class="global-desc-info">
                {{ t('designer.block.publicScopeDescription') }}
            </div>
        </tiny-form-item>
    </tiny-form>
</template>
<!-- eslint-disable-next-line -->
<script lang="ts">
/* eslint-disable max-lines */
/* metaService: engine.plugins.blockmanage.BlockConfig */
import { reactive, ref, computed, nextTick, watchEffect, inject } from 'vue';
import {
    Input,
    Tag,
    Button,
    Form,
    FormItem,
    Radio,
    Select,
    Option
} from '@opentiny/vue';
import { constants } from '@opentiny/tiny-engine-utils';
import { remove } from '@opentiny/vue-renderless/common/array';
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n';
import {
    useBlock,
    getMetaApi,
    META_SERVICE
} from '@opentiny/tiny-engine-meta-register';
import { isVsCodeEnv } from '@opentiny/tiny-engine-common/js/environments';

import { getEditBlock } from './js/blockSetting';

const { BLOCK_OPENNESS } = constants;

export default {
    components: {
        // eslint-disable-next-line
        TinyTag: Tag,
        // eslint-disable-next-line
        TinyInput: Input,
        // eslint-disable-next-line
        TinyButton: Button,
        // eslint-disable-next-line
        TinyForm: Form,
        // eslint-disable-next-line
        TinyFormItem: FormItem,
        // eslint-disable-next-line
        TinyRadio: Radio,
        // eslint-disable-next-line
        TinySelect: Select,
        // eslint-disable-next-line
        TinyOption: Option
    },
    // eslint-disable-next-line
    setup() {
        // 获取国际化 t 函数
        // eslint-disable-next-line
        const i18n: any = inject(I18nInjectionKey);
        const t = i18n?.global?.t || ((key: string) => key);

        const { getCategoryList, shouldReplaceCategoryWithGroup } = useBlock();
        const nameCn = 'name_cn';
        const state = reactive({
            inputVisible: false,
            inputValue: '',
            publicOptions: getMetaApi(META_SERVICE.GlobalService).getState()
                .userInfo.tenants
        });
        // eslint-disable-next-line
        const groupSelect = ref(null);

        const formData = reactive({
            tags: [],
            // eslint-disable-next-line
            name_cn: '',
            label: '',
            categoryId: '',
            description: '',
            public: '',
            // eslint-disable-next-line
            public_scope_tenants: []
        });
        // eslint-disable-next-line
        const blockForm = ref(null);

        const categoryList = computed(() =>
            getCategoryList().map(item => ({
                ...item,
                value: item.id,
                label: item.name
            }))
        );

        watchEffect(() => {
            const block = getEditBlock();
            if (formData.id && block.id === formData.id) {
                // 防止修改区块数据后，重复赋值
                return;
            }
            if (!block.tags) {
                block.tags = [];
            }
            Object.assign(formData, block);
            formData[nameCn] = block[nameCn] ?? block.label;
            if (shouldReplaceCategoryWithGroup()) {
                formData.categoryId = (block.groups || []).map(
                    group => group.id
                );
            } else {
                const [id] = block.categories || [];
                formData.categoryId = id || '';
            }
        });

        const rules = {
            // eslint-disable-next-line
            name_cn: [
                {
                    required: true,
                    message: t('designer.block.required'),
                    trigger: 'blur'
                }
            ]
        };
        // eslint-disable-next-line
        const saveTagInput = ref(null);

        const deleteTag = tag => {
            remove(formData.tags, tag);
        };

        const validateForm = () => {
            return new Promise(resolve => {
                blockForm.value.validate(valid => {
                    if (valid) {
                        resolve();
                    }
                });
            });
        };

        const clearValidateForm = () => {
            blockForm.value?.clearValidate();
        };

        const confirmTagInput = () => {
            const block = getEditBlock();
            const { inputValue } = state;
            if (inputValue) {
                formData.tags.push(inputValue);
                block.tags = formData.tags;
            }

            state.inputVisible = false;
            state.inputValue = '';
        };

        const addTag = () => {
            state.inputVisible = true;

            nextTick(() => {
                saveTagInput.value.getInput().focus();
            });
        };

        const changeOpenness = () => {
            const block = getEditBlock();

            if (block) {
                block.public = formData.public;
            }
            if (formData.public !== BLOCK_OPENNESS.Special) {
                // eslint-disable-next-line
                formData.public_scope_tenants = [];
                // eslint-disable-next-line
                block.public_scope_tenants = [];
            }
        };

        const categoryFilter = value => {
            const select = groupSelect.value;

            select.state.cachedOptions.forEach(item => {
                item.state.visible = !value || item.label.includes(value);
            });
        };

        const changeCategory = value => {
            const block = getEditBlock();

            if (block) {
                const idKey = shouldReplaceCategoryWithGroup()
                    ? 'id'
                    : 'category_id';
                const selectedCategory =
                    categoryList.value.find(item => item.id === value) ?? {};
                block.path = selectedCategory[idKey];
                block.categories = Array.isArray(value) ? value : value || '';
            }
        };

        const changeBlockProperty = property => {
            const block = getEditBlock();

            if (block) {
                block[property] = formData[property];
            }
        };

        const groupLabels = shouldReplaceCategoryWithGroup()
            ? {
                  select: t('designer.block.blockGroup'),
                  selectPlaceholder: t('designer.block.defaultGroup')
              }
            : {
                  select: t('designer.block.blockCategory'),
                  selectPlaceholder: t('designer.block.defaultCategory')
              };

        return {
            isVsCodeEnv,
            state,
            rules,
            formData,
            saveTagInput,
            groupSelect,
            categoryList,
            changeCategory,
            validateForm,
            addTag,
            deleteTag,
            confirmTagInput,
            // eslint-disable-next-line
            BLOCK_OPENNESS,
            changeOpenness,
            clearValidateForm,
            blockForm,
            categoryFilter,
            changeBlockProperty,
            shouldReplaceCategoryWithGroup,
            groupLabels,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.block-setting-content {
    :deep(.tiny-form-item) {
        margin-bottom: 10px;
    }
    :deep(.tiny-form-item__label) {
        font-size: 12px;
    }

    .description {
        margin-top: 10px;
        font-size: 12px;
    }
    .global-desc-info {
        font-size: 12px;
    }
}

.block-tag-create {
    .tag-button {
        color: var(--te-block-config-tag-text-color);
        background-color: var(--te-block-config-tag-bg-color);
        border: none;
        height: 28px;
        :deep(.tiny-tag__close) {
            fill: var(--te-block-config-tag-close-icon-color);
        }
        &:hover {
            color: var(--te-block-config-tag-color-hover);
            background-color: var(--te-block-config-tag-bg-hover);
            :deep(.tiny-tag__close) {
                fill: var(--te-block-config-tag-close-icon-color-hover);
            }
        }
    }

    .tiny-button.button-new-tag {
        height: 24px;
        line-height: 20px;
        padding-top: 0;
        padding-bottom: 0;
        border: 1px solid var(--te-block-config-new-tag-border-color);
    }

    .tiny-input {
        width: 90px;
        height: 22px;
        line-height: 20px;
        vertical-align: middle;
    }

    .tiny-tag {
        margin: 4px 0;
        & + .tiny-tag,
        & + .tiny-input,
        & ~ .button-new-tag {
            margin-left: 10px;
        }
    }
    :deep(.tiny-input__inner) {
        height: 24px;
    }
}
.block-openness {
    &-public {
        display: flex;
    }
    &-tenants {
        display: inline-block;
        height: 24px;
        .tiny-select {
            :deep(.tiny-tag) {
                height: 17px;
            }
        }
    }
}
.tag-item-text {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
}
</style>

<style lang="scss">
.block-openness .block-openness-tenants .tiny-input__inner {
    height: 24px !important;
}
</style>
