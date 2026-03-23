<template>
    <div>
        <tiny-dialog-box
            :append-to-body="true"
            :close-on-click-modal="false"
            :visible="visible"
            :title="t('designer.block.newBlock')"
            width="500"
            @close="cancel"
        >
            <tiny-form
                ref="formRef"
                show-message
                :model="formData"
                :rules="rules"
                label-width="64px"
                :label-align="true"
                label-position="left"
                validate-type="text"
            >
                <tiny-form-item
                    :label="t('designer.block.blockName')"
                    prop="name_cn"
                >
                    <TinyInput
                        v-model="formData.name_cn"
                        :placeholder="t('designer.block.placeholderBlockName')"
                    />
                </tiny-form-item>
                <tiny-form-item
                    :label="t('designer.block.blockId')"
                    prop="label"
                >
                    <TinyInput
                        v-model="formData.label"
                        :placeholder="t('designer.block.placeholderBlockId')"
                    />
                </tiny-form-item>
                <tiny-form-item
                    :label="
                        shouldReplaceCategoryWithGroup()
                            ? t('designer.block.blockGroup')
                            : t('designer.block.blockCategory')
                    "
                    prop="group"
                >
                    <tiny-select
                        v-model="formData.group"
                        :options="categoryList"
                        :placeholder="t('designer.common.pleaseSelect')"
                        @change="changeCategory"
                    />
                </tiny-form-item>
                <p v-show="fromCanvas" class="block-tip">
                    {{ t('designer.block.copyTip') }}
                </p>
            </tiny-form>
            <template #footer>
                <tiny-button type="primary" @click="addBlock">{{
                    t('designer.common.confirm')
                }}</tiny-button>
                <tiny-button @click="cancel">{{
                    t('designer.common.cancel')
                }}</tiny-button>
            </template>
        </tiny-dialog-box>
    </div>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
import { reactive, computed, ref, inject } from 'vue';
import {
    Input,
    Form,
    FormItem,
    Button,
    DialogBox,
    Select
} from '@opentiny/vue';
import {
    useBlock,
    useLayout,
    useCanvas,
    useModal,
    getMetaApi,
    META_SERVICE
} from '@opentiny/tiny-engine-meta-register';
import { REGEXP_BLOCK_NAME } from '@opentiny/tiny-engine-common/js/verification';
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n';

export default {
    components: {
         
        TinyForm: Form,
         
        TinyInput: Input,
         
        TinyFormItem: FormItem,
         
        TinyDialogBox: DialogBox,
         
        TinyButton: Button,
         
        TinySelect: Select
    },
    props: { boxVisibility: Boolean, fromCanvas: Boolean },
    emits: ['close'],
     
    setup(props, { emit }) {
         
        const i18n: any = inject(I18nInjectionKey);
        const t = i18n?.global?.t || ((key: string) => key);

        const formData = reactive({
            label: '',
            path: 'default',
             
            name_cn: '',
            group: ''
        });
        const {
            createEmptyBlock,
            createBlock,
            getCategoryList,
            shouldReplaceCategoryWithGroup
        } = useBlock();
        const visible = computed(() => props.boxVisibility);
        const { PLUGIN_NAME, activePlugin } = useLayout();
        const { isSaved } = useCanvas();
        const { confirm } = useModal();
         
        const formRef = ref(null);

        const categoryList = computed(() =>
            getCategoryList().map(item => ({
                ...item,
                value: item.id,
                label: item.name
            }))
        );

        const cancel = () => {
            emit('close');
        };
        const changeCategory = value => {
            const foundItem = categoryList.value.find(
                item => item.value === value
            );
            if (foundItem) {
                 
                const { category_id: categoryId, id } = foundItem;
                formData.path = categoryId || '';
                formData.categories = [id];
            }
        };

        const handleAddBlock = () => {
            const promise = props.fromCanvas
                ? createBlock(formData)
                : createEmptyBlock(formData);
            promise.then(block => {
                getMetaApi(META_SERVICE.GlobalService).updateBlockId(block.id);
                activePlugin(PLUGIN_NAME.Materials);
                cancel();
            });
        };
        const addBlock = () => {
            formRef.value.validate(valid => {
                if (!valid) return;
                if (isSaved()) {
                    handleAddBlock();
                    return;
                }
                confirm({
                    message: t('designer.block.switchTip'),
                    exec: () => {
                        handleAddBlock();
                    }
                });
            });
        };

        const rules = {
             
            name_cn: [
                {
                    required: true,
                    message: t('designer.block.required'),
                    trigger: 'blur'
                }
            ],
            label: [
                {
                    pattern: REGEXP_BLOCK_NAME,
                    message: t('designer.block.blockNameRule')
                },
                {
                    required: true,
                    message: t('designer.block.required'),
                    trigger: 'blur'
                }
            ]
        };

        return {
            formData,
            categoryList,
            formRef,
            rules,
            addBlock,
            cancel,
            changeCategory,
            visible,
            shouldReplaceCategoryWithGroup,
            t
        };
    }
};
</script>

<style scoped lang="scss">
.block-tip {
    color: var(--te-block-tip-color-error);
}
</style>
