<template>
    <tiny-dialog-box
        v-model:visible="state.visible"
        dialog-class="deploy-dialog"
        :title="title"
        :append-to-body="true"
        :is-form-reset="false"
        @close="closeDialog"
    >
        <tiny-form
            ref="form"
            show-message
            :model="formData"
            :rules="rules"
            label-width="64px"
            :label-align="true"
            label-position="left"
            validate-type="text"
        >
            <tiny-form-item :label="groupLabels.nameInput" prop="name">
                <tiny-input
                    v-model="formData.name"
                    :placeholder="groupLabels.nameInputPlaceholder"
                    @change="handleChangeName"
                />
            </tiny-form-item>
            <tiny-form-item
                v-if="!shouldReplaceCategoryWithGroup()"
                :label="t('designer.block.categoryId')"
                prop="categoryId"
            >
                <tiny-input
                    v-model="formData.categoryId"
                    :placeholder="t('designer.block.enterCategoryId')"
                    :disabled="isEdit"
                />
            </tiny-form-item>
        </tiny-form>
        <template #footer>
            <tiny-button type="primary" @click="confirm">{{
                t('designer.common.confirm')
            }}</tiny-button>
            <tiny-button @click="closeDialog">{{
                t('designer.common.cancel')
            }}</tiny-button>
        </template>
    </tiny-dialog-box>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts" setup>
import { ref, reactive, computed, watch, inject } from 'vue';
import { pinyin } from 'pinyin-pro';
import {
    Form as TinyForm,
    FormItem as TinyFormItem,
    Input as TinyInput,
    Button as TinyButton,
    DialogBox as TinyDialogBox
} from '@opentiny/vue';
import { useBlock } from '@opentiny/tiny-engine-meta-register';
import { REGEXP_GROUP_NAME } from '@opentiny/tiny-engine-common/js/verification';
import { extend } from '@opentiny/vue-renderless/common/object';
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n';

import { createOrUpdateCategory } from './js/blockSetting';

interface Props {
    modelValue: boolean;
    initialValue: Record<string, unknown>;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    initialValue: () => ({})
});

 
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
 
const i18n: any = inject(I18nInjectionKey);
const t = i18n?.global?.t || ((key: string) => key);

const { getGroupList, shouldReplaceCategoryWithGroup } = useBlock();

const groupLabels = computed(() =>
    shouldReplaceCategoryWithGroup()
        ? {
              text: t('designer.block.group'),
              nameInput: t('designer.block.groupName'),
              nameInputPlaceholder: t('designer.block.enterGroupName'),
              validateErrMsg: t('designer.block.groupNameRepeat')
          }
        : {
              text: t('designer.block.category'),
              nameInput: t('designer.block.categoryName'),
              nameInputPlaceholder: t('designer.block.enterCategoryName'),
              validateErrMsg: t('designer.block.categoryNameRepeat')
          }
);

const state = reactive({ visible: false });
const isEdit = computed(() => Object.keys(props.initialValue).length !== 0);
const groupList = computed(getGroupList);
 
const form = ref(null);
const formData = reactive({ name: '', categoryId: '' });

const validateGroup = (rule, value, callback) => {
    const isRepeat =
        props.initialValue?.name !== value &&
        groupList.value.some(group => group.name === value);
    if (isRepeat) {
        callback(new Error(groupLabels.value.validateErrMsg));
        return;
    }
    callback();
};
const rules = reactive({
    name: [
        {
            required: true,
            message: t('designer.block.required'),
            trigger: 'blur'
        },
        {
            pattern: REGEXP_GROUP_NAME,
            message: t('designer.block.groupNameRule'),
            trigger: 'change'
        },
        { validator: validateGroup, trigger: 'blur' }
    ],
    categoryId: [
        {
            required: true,
            message: t('designer.block.required'),
            trigger: 'blur'
        }
    ]
});
if (shouldReplaceCategoryWithGroup()) {
    rules.categoryId = [];
}

const handleChangeName = value => {
    if (isEdit.value) return;
    const cnReg = /[\u4e00-\u9fa5]/g;
    let id = value.replace(cnReg, match => {
        return pinyin(match, { toneType: 'none' });
    });
    const isRepeat = groupList.value.some(
        item => item.name !== value && item.category_id === id
    );
    if (isRepeat) {
        id += new Date().getTime();
    }
    formData.categoryId = id;
};

const title = computed(
    () =>
        `${isEdit.value ? t('designer.block.edit') : t('designer.block.new')} ${groupLabels.value.text}`
);
const closeDialog = () => {
    emit('update:modelValue', false);
};
const confirm = () => {
    form.value.validate(valid => {
        if (valid) {
            const params = extend(true, {}, formData);
            if (isEdit.value) {
                params.id = props.initialValue.id;
            }
            createOrUpdateCategory(params, isEdit.value);
            closeDialog();
        }
    });
};

watch(
    () => props.modelValue,
    val => {
        state.visible = val;
    }
);
watch(
    () => props.initialValue,
    val => {
        if (val) {
            formData.name = val.name ?? '';
            formData.categoryId = val.category_id ?? '';
        }
    }
);
</script>
