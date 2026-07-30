<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <tiny-form
        ref="storeDataForm"
        class="store-form"
        :model="storeData"
        label-position="top"
        :rules="rules"
        label-width="15%"
        validate-type="text"
        :inline-message="true"
    >
        <tiny-form-item label="stores" prop="name" class="stores">
            <tiny-input
                v-model="state.storeData.name"
                :placeholder="t('designer.state.storeNamePlaceholder')"
            />
        </tiny-form-item>
        <tiny-collapse v-model="state.activeName">
            <tiny-collapse-item :title="STATE" :name="STATE">
                <tiny-form-item :prop="STATE">
                    <monaco-editor
                        ref="variableEditor"
                        class="store-editor"
                        :value="editorCode"
                        :show-format-btn="true"
                        :options="{
                            language: 'json',
                            // 禁用滚动条边边一直显示的边框
                            overviewRulerBorder: false,
                            renderLineHighlightOnlyWhenFocus: true
                        }"
                        @editor-did-mount="editorDidMount"
                        @change="editorDidMount"
                    >
                        <template #toolbarStart>
                            <div class="label-left-wrap" />
                        </template>
                        <template #fullscreenHead>
                            <state-fullscreen-head
                                :title="STATE"
                                @close="cancel"
                            />
                        </template>
                        <template #fullscreenFooter>
                            <div class="fullscreen-footer-content">
                                <state-tips type="app" />
                            </div>
                        </template>
                    </monaco-editor>
                    <state-tips type="app" />
                </tiny-form-item>
            </tiny-collapse-item>
            <tiny-collapse-item :title="GETTERS" :name="GETTERS">
                <tiny-form-item :prop="GETTERS">
                    <monaco-editor
                        ref="gettersEditor"
                        class="store-editor"
                        :options="options"
                        :value="getters"
                    >
                        <template #fullscreenHead>
                            <state-fullscreen-head
                                :title="GETTERS"
                                @close="cancel"
                            />
                        </template>
                    </monaco-editor>
                </tiny-form-item>
            </tiny-collapse-item>
            <tiny-collapse-item :title="ACTIONS" :name="ACTIONS">
                <tiny-form-item :prop="ACTIONS">
                    <monaco-editor
                        ref="actionsEditor"
                        class="store-editor"
                        :options="options"
                        :value="actions"
                    >
                        <template #fullscreenHead>
                            <state-fullscreen-head
                                :title="ACTIONS"
                                @close="cancel"
                            />
                        </template>
                    </monaco-editor>
                </tiny-form-item>
            </tiny-collapse-item>
        </tiny-collapse>
    </tiny-form>
</template>

<!-- eslint-disable vue/max-lines-per-block, vue/require-typed-object-prop, vue/require-default-prop, vue/component-api-style, vue/require-typed-ref, @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow, @typescript-eslint/naming-convention, vue/block-lang -->
<script lang="ts">
/* metaService: engine.plugins.state.CreateStore */
import { getCurrentInstance, reactive, ref, computed, watch } from 'vue';
import {
    Form,
    FormItem,
    Input,
    Collapse as TinyCollapse,
    CollapseItem as TinyCollapseItem
} from '@opentiny/vue';
import { MonacoEditor } from '@/components/i18n-wrappers';
import {
    string2Ast,
    ast2String,
    insertName
} from '@opentiny/tiny-engine-common/js/ast';
import { verifyJsVarName } from '@opentiny/tiny-engine-common/js/verification';

import { useDesignerI18n } from '@/services/i18nService';

import StateTips from './StateTips.vue';
import StateFullscreenHead from './StateFullscreenHead.vue';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        MonacoEditor,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        StateTips,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        StateFullscreenHead,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyForm: Form,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyFormItem: FormItem,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyInput: Input,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyCollapse,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyCollapseItem
    },
    props: {
        storeData: {
            type: Object,
            default: undefined
        },
        dataSource: {
            type: Object,
            default: undefined
        },
        flag: {
            type: String,
            default: undefined
        },
        updateKey: {
            type: String,
            default: undefined
        }
    },
    emits: ['close', 'nameInput'],
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const STATE = 'state';
        const GETTERS = 'getters';
        const ACTIONS = 'actions';
        const instance = getCurrentInstance();
        const isDemoShow = ref(false);
        const gettersEditor = ref(null);
        const actionsEditor = ref(null);
        const variableEditor = ref(null);
        const state = reactive({
            storeData: props.storeData,
            activeName: ['state', 'getters', 'actions']
        });

        const options = {
            language: 'javascript',
            minimap: {
                enabled: false
            },
            // 禁用滚动条边边一直显示的边框
            overviewRulerBorder: false,
            renderLineHighlightOnlyWhenFocus: true
        };

        watch(
            () => state.storeData.name,
            () => {
                variableEditor.value?.switchFullScreen(false);
                gettersEditor.value?.switchFullScreen(false);
                actionsEditor.value?.switchFullScreen(false);
            }
        );

        const validateName = (rule, name, callback) => {
            let errorMessage = '';
            const isSameState = Object.keys(props.dataSource).includes(name);
            if (!name) {
                errorMessage = t('designer.state.storeNameRequired');
            }

            if (!verifyJsVarName(name)) {
                errorMessage = t('designer.state.storeNameInvalid');
            }

            if (
                isSameState &&
                (props.flag !== 'update' || name !== props.updateKey)
            ) {
                errorMessage = t('designer.state.storeNameExists');
            }

            if (errorMessage) {
                callback(new Error(errorMessage));
            } else {
                callback();
            }
            emit('nameInput', errorMessage);
        };

        const validateState = (
            rule: any,
            value: string,
            callback: (error?: Error) => void
        ) => {
            const stateValue = variableEditor.value
                .getEditor()
                .getValue()
                .replace(new RegExp('\\r\\n', 'g'), '')
                .replace(/\s/g, '');

            if (!stateValue?.trim()) {
                callback(new Error(t('designer.state.storeContentRequired')));
                return;
            }

            try {
                const parsed = JSON.parse(stateValue);

                // 检查是否为对象且不是数组和null
                if (
                    typeof parsed !== 'object' ||
                    Array.isArray(parsed) ||
                    parsed === null
                ) {
                    callback(new Error(t('designer.state.storeMustBeObject')));
                    return;
                }

                callback();
            } catch (error) {
                callback(new Error(t('designer.state.storeFormatError')));
            }
        };

        const rules = {
            name: { validator: validateName, required: true },
            [STATE]: { validator: validateState, required: true }
        };
        const editorCode = computed(() => {
            const { state: storeState = {} } = state.storeData.variable || {};
            if (storeState) {
                return JSON.stringify(storeState, null, 2);
            }
            return '';
        });

        const getEditor = () => instance.refs.variableEditor;

        const getScriptString = res => {
            const list = Object.entries(res).map(([name, method]) =>
                insertName(name, method.value)
            );
            const script = list.join(`\n`);
            return script;
        };

        const getters = computed(() => {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const { getters } = state.storeData.variable || {};
            if (getters) {
                return getScriptString(getters);
            }
            return '';
        });
        const actions = computed(() => {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const { actions } = state.storeData.variable || {};
            if (actions) {
                return getScriptString(actions);
            }
            return '';
        });

        const saveMethod = ({ name, content }) => {
            if (!name) {
                return undefined;
            }

            return { [name]: { type: 'JSFunction', value: content } };
        };

        const saveMethods = editor => {
            const storeEditor =
                editor === 'gettersEditor' ? gettersEditor : actionsEditor;
            const gettersMap = {};
            const editorContent = storeEditor?.value?.getEditor()?.getValue();
            const ast = string2Ast(editorContent);

            ast.program.body.forEach(declaration => {
                const name = declaration?.id?.name;
                const content = ast2String(declaration).trim();
                Object.assign(gettersMap, saveMethod({ name, content }));
            });

            return gettersMap;
        };

        const editorDidMount = () => {
            const variable = variableEditor.value
                .getEditor()
                .getValue()
                .replace(new RegExp('\\r\\n', 'g', ''), '')
                .replace(/\s/g, '');

            return (
                Object.prototype.toString.call(variable) === '[object Object]'
            );
        };

        const cancel = () => {
            emit('close');
        };

        const storeDataForm = ref(null);

        const validateForm = () => {
            return new Promise(resolve => {
                storeDataForm.value.validate(valid => {
                    if (valid) {
                        resolve();
                    }
                });
            });
        };

        const clearValidateForm = () => {
            storeDataForm.value?.clearValidate();
        };

        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            STATE,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            GETTERS,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            ACTIONS,
            isDemoShow,
            state,
            getEditor,
            editorCode,
            rules,
            getters,
            options,
            gettersEditor,
            getScriptString,
            saveMethods,
            actionsEditor,
            editorDidMount,
            variableEditor,
            actions,
            cancel,
            validateForm,
            storeDataForm,
            clearValidateForm,
            t
        };
    }
};
</script>

<!-- eslint-disable-next-line vue/block-lang -->
<style lang="less" scoped>
.store-form {
    height: calc(100% - 45px);
    overflow-y: auto;
    :deep(.tiny-collapse-item__wrap) {
        padding: 0 12px;
        .tiny-collapse-item__content {
            padding: 0;
        }
    }
    :deep(.toolbar) {
        position: absolute;
        z-index: 99;
        top: 6px;
        right: 12px;
    }
    .stores {
        padding: 12px;
    }
    .tiny-form-item:not(:last-child) {
        margin-bottom: 12px;
    }

    :deep(.tiny-form-item__label) {
        color: var(--te-state-common-label-text-color);
    }

    .label-left-wrap {
        color: var(--te-state-common-label-text-color);
        display: flex;
    }
    :deep(.tiny-collapse-item__wrap) {
        padding: 0 12px;
        .tiny-collapse-item__content {
            padding: 0;
            .tiny-form-item:first-child {
                padding-bottom: 12px;
            }
        }
    }
}

.create-content-description {
    font-size: 12px;
    color: var(--te-state-common-text-color-emphasize);
    margin-left: 8px;
    cursor: pointer;
}

.create-content-demo {
    padding: 12px;
    font-size: 14px;
    li + li {
        margin-top: 8px;
    }
}

.store-editor {
    height: 270px;
}
</style>
