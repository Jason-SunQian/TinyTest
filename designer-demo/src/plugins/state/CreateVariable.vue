<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <tiny-form
        ref="createDataForm"
        label-position="top"
        class="create-form"
        :model="state.createData"
        :rules="rules"
        validate-type="text"
        :inline-message="true"
    >
        <tiny-form-item
            :label="t('designer.state.variableName')"
            prop="name"
            class="var"
        >
            <tiny-input
                v-model="state.createData.name"
                :placeholder="t('designer.state.variableNamePlaceholder')"
                @change="$emit('nameInput', $event)"
            />
        </tiny-form-item>
        <tiny-form-item
            :label="t('designer.state.initialValueType')"
            class="var-type-item"
        >
            <tiny-radio-group
                v-model="state.variableType"
                :options="VAR_TYPES"
            />
        </tiny-form-item>
        <tiny-collapse v-model="state.activeName">
            <tiny-collapse-item :title="INIT" name="initValue">
                <tiny-form-item>
                    <monaco-editor
                        ref="variableEditor"
                        class="variable-editor"
                        :value="editorCode"
                        :show-format-btn="true"
                        :options="state.editorOptions"
                        @editor-did-mount="editorDidMount"
                        @fullscreen-change="fullscreenChange"
                    >
                        <template #buttons>
                            <editor-i18n-tool
                                ref="i18nToolRef"
                                @confirm="insertContent"
                            />
                        </template>
                        <template #fullscreenHead>
                            <state-fullscreen-head
                                :title="INIT"
                                @close="cancel"
                            />
                        </template>
                        <template #fullscreenFooter>
                            <div class="fullscreen-footer-content">
                                <state-tips />
                            </div>
                        </template>
                    </monaco-editor>
                    <state-tips />
                </tiny-form-item>
            </tiny-collapse-item>
            <tiny-collapse-item :title="GETTER" :name="GETTER">
                <tiny-form-item>
                    <monaco-editor
                        ref="getterEditor"
                        class="variable-editor"
                        :options="options"
                        :value="state.getterEditorValue"
                    >
                        <template #fullscreenHead>
                            <state-fullscreen-head
                                :title="GETTER"
                                @close="cancel"
                            />
                        </template>
                        <template #fullscreenFooter>
                            <div class="fullscreen-footer-content">
                                <div class="tips">
                                    <pre>{{ getterExample }}</pre>
                                </div>
                            </div>
                        </template>
                    </monaco-editor>
                    <div class="tips">
                        <pre>{{ getterExample }}</pre>
                    </div>
                </tiny-form-item>
            </tiny-collapse-item>
            <tiny-collapse-item :title="SETTER" :name="SETTER">
                <tiny-form-item>
                    <monaco-editor
                        ref="setterEditor"
                        class="variable-editor"
                        :options="options"
                        :value="state.setterEditorValue"
                    >
                        <template #fullscreenHead>
                            <state-fullscreen-head
                                :title="SETTER"
                                @close="cancel"
                            />
                        </template>
                        <template #fullscreenFooter>
                            <div class="fullscreen-footer-content">
                                <div class="tips">
                                    <pre>{{ setterExample }}</pre>
                                </div>
                            </div>
                        </template>
                    </monaco-editor>
                    <div class="tips">
                        <pre>{{ setterExample }}</pre>
                    </div>
                </tiny-form-item>
            </tiny-collapse-item>
        </tiny-collapse>
    </tiny-form>
</template>

<!-- eslint-disable vue/max-lines-per-block, vue/require-default-prop, vue/require-typed-object-prop, vue/component-api-style, vue/require-typed-ref, @typescript-eslint/naming-convention -->
<script lang="ts">
/* metaService: engine.plugins.state.CreateVariable */
import { reactive, ref, computed, watch, onBeforeUnmount } from 'vue';
import {
    Form,
    FormItem,
    Input,
    RadioGroup,
    Collapse as TinyCollapse,
    CollapseItem as TinyCollapseItem
} from '@opentiny/vue';
import { MonacoEditor } from '@opentiny/tiny-engine-common';
import { verifyJsVarName } from '@opentiny/tiny-engine-common/js/verification';
import { initCompletion } from '@opentiny/tiny-engine-common/js/completion';
import * as Monaco from 'monaco-editor';

import { useDesignerI18n } from '@/services/i18nService';

import { validateMonacoEditorData } from './js/common';
import EditorI18nTool from './EditorI18nTool.vue';
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
        TinyRadioGroup: RadioGroup,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        EditorI18nTool,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyCollapse,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyCollapseItem
    },
    props: {
        createData: {
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
    emits: ['nameInput', 'close'],
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const INIT = computed(() => t('designer.state.initialValue'));
        const GETTER = 'getter';
        const SETTER = 'setter';
        const variableEditor = ref(null);
        const getterEditor = ref(null);
        const setterEditor = ref(null);

        const i18nToolRef = ref(null);

        const getEditor = () => variableEditor.value;

        const isAccessorData = data =>
            [
                data?.accessor?.getter?.type,
                data?.accessor?.setter?.type
            ].includes('JSFunction');
        const getPropsCreateData = () => ({
            name: '',
            ...props.createData,
            variable: isAccessorData(props.createData.variable)
                ? props.createData.variable.defaultValue
                : props.createData.variable
        });

        const DEFAULT_GETTER = 'function getter() {}';
        const DEFAULT_SETTER = 'function setter() {}';

        const LANG_TYPES = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            JSON: 'json',
            JS: 'javascript'
        };
        const VAR_TYPES = computed(() => [
            { text: t('designer.state.jsonType'), label: LANG_TYPES.JSON },
            { text: t('designer.state.jsExpressionType'), label: LANG_TYPES.JS }
        ]);
        const getVarType = () =>
            props.createData.variable?.type === 'JSExpression'
                ? LANG_TYPES.JS
                : LANG_TYPES.JSON;

        const state = reactive({
            errorMessage: '',
            activeName: ['initValue', 'getter', 'setter'],
            createData: getPropsCreateData(),
            variableType: getVarType(),
            getterEditorValue:
                props.createData.variable?.accessor?.getter?.value ||
                DEFAULT_GETTER,
            setterEditorValue:
                props.createData.variable?.accessor?.setter?.value ||
                DEFAULT_SETTER,
            editorOptions: {
                language: getVarType(),
                lineNumbers: true,
                overviewRulerBorder: false,
                renderLineHighlightOnlyWhenFocus: true,
                // 快速提示禁用，避免调用其他模块提供的函数，因为变量是最先初始化
                quickSuggestions: false,
                suggest: {
                    showFields: false,
                    showFunctions: false
                }
            },
            completionProvider: null
        });

        const changeLanguage = language => {
            state.editorOptions.language = language;
            Monaco.editor.setModelLanguage(
                variableEditor.value.getEditor().getModel(),
                language
            );
        };

        watch(
            () => props.createData.variable,
            () => {
                state.errorMessage = '';
                state.getterEditorValue =
                    props.createData.variable?.accessor?.getter?.value ||
                    DEFAULT_GETTER;
                state.setterEditorValue =
                    props.createData.variable?.accessor?.setter?.value ||
                    DEFAULT_SETTER;
                state.variableType = getVarType();
                if (state.editorOptions.language !== state.variableType) {
                    changeLanguage(state.variableType);
                }
            }
        );

        watch(
            () => [props.createData.name, props.createData.variable],
            () => {
                state.createData = getPropsCreateData();
            }
        );

        watch(
            () => props.createData.name,
            () => {
                variableEditor.value?.switchFullScreen(false);
                getterEditor.value?.switchFullScreen(false);
                setterEditor.value?.switchFullScreen(false);
            }
        );

        watch(
            () => state.variableType,
            () => {
                changeLanguage(state.variableType);
            }
        );

        const validate = () => {
            if (state.errorMessage) {
                return { success: false, message: state.errorMessage };
            }
            // JS表达式不进行校验
            if (state.variableType === LANG_TYPES.JS) {
                return { success: true };
            }
            return validateMonacoEditorData(variableEditor.value, '初始数据');
        };

        const getDefaultValue = () => {
            // JS表达式使用字符串值，不进行解析
            if (state.variableType === LANG_TYPES.JS) {
                return {
                    type: 'JSExpression',
                    value: getEditor().getEditor().getValue()
                };
            }
            return getEditor().getValue();
        };

        const getFormData = () => {
            const defaultValue = getDefaultValue();

            const getter = getterEditor.value.getEditor().getValue();
            const setter = setterEditor.value.getEditor().getValue();
            if (!getter && !setter) return defaultValue;

            const result = { defaultValue };

            if (getter && getter !== DEFAULT_GETTER) {
                result.accessor = {
                    ...result.accessor,
                    getter: { type: 'JSFunction', value: getter }
                };
            }

            if (setter && setter !== DEFAULT_SETTER) {
                result.accessor = {
                    ...result.accessor,
                    setter: { type: 'JSFunction', value: setter }
                };
            }

            // 没有设置 getter setter，需要直接返回 defaultValue
            if (!result.accessor) {
                return defaultValue;
            }

            return result;
        };

        const validateName = (rule, name, callback) => {
            state.errorMessage = '';

            if (!name) {
                state.errorMessage = t('designer.state.inputRequired');
            } else if (!verifyJsVarName(name)) {
                state.errorMessage = t('designer.state.invalidName');
            } else if (
                Object.keys(props.dataSource).includes(name) &&
                (props.flag !== 'update' || name !== props.updateKey)
            ) {
                state.errorMessage = t('designer.state.nameExists');
            }

            if (state.errorMessage) {
                callback(new Error(state.errorMessage));
            } else {
                callback();
            }
        };

        const rules = {
            name: { validator: validateName, required: true }
        };

        const editorCode = computed(() => {
            const { type, value } = state.createData.variable || {};

            if (type === 'JSExpression') {
                return value;
            }

            return JSON.stringify(state.createData.variable, null, 2);
        });

        const addContextMenu = (editorInstance, id, label, handler) => {
            editorInstance.addAction({
                id,
                label,
                precondition: null,
                keybindingContext: null,
                contextMenuGroupId: 'navigation',
                contextMenuOrder: 1,
                run: handler
            });
        };

        const editorDidMount = editorInstance => {
            addContextMenu(editorInstance, 'addI18n', '插入词条', () => {
                i18nToolRef.value.state.showPopover = true;
            });

            // 支持对象类型数据或表达式，不显示语法校验报错
            const diagnosticsOptions = variableEditor.value.editor
                .getMonaco()
                .languages?.typescript?.javascriptDefaults.getDiagnosticsOptions();
            variableEditor.value.editor
                .getMonaco()
                .languages?.typescript?.javascriptDefaults.setDiagnosticsOptions(
                    {
                        ...diagnosticsOptions,
                        noSyntaxValidation: true,
                        noSemanticValidation: true
                    }
                );
            if (variableEditor.value) {
                state.completionProvider = initCompletion(
                    variableEditor.value.editor.getMonaco(),
                    variableEditor.value.editor.getEditor()?.getModel(),
                    item =>
                        item.label !== 'this.state' &&
                        !item.label.startsWith('this.state.')
                );
            }
        };

        const fullscreenChange = () => {
            i18nToolRef.value.state.showPopover = false;
        };

        onBeforeUnmount(() => {
            state.completionProvider?.forEach(provider => {
                provider.dispose();
            });
        });

        const insertContent = (insertText = '') => {
            const monacoEditor = getEditor().editor.getEditor();
            const selection = monacoEditor.getSelection();
            const range = new Monaco.Range(
                selection?.startLineNumber || 1,
                selection?.startColumn || 1,
                selection?.endLineNumber || 1,
                selection?.endColumn || 1
            );

            monacoEditor.executeEdits('', [{ range, text: insertText }]);
            getEditor().formatCode();
            monacoEditor.focus();
        };

        const cancel = () => {
            emit('close');
        };

        const createDataForm = ref(null);

        const validateForm = () => {
            return new Promise(resolve => {
                createDataForm.value.validate(valid => {
                    if (valid) {
                        resolve();
                    }
                });
            });
        };

        const clearValidateForm = () => {
            createDataForm.value?.clearValidate();
        };

        const options = {
            lineNumbers: true,
            language: 'javascript',
            // 禁用滚动条边边一直显示的边框
            overviewRulerBorder: false,
            renderLineHighlightOnlyWhenFocus: true
        };
        const getterExample =
            // eslint-disable-next-line no-template-curly-in-string
            'function getter() {\r\n  // this.state.name = `${this.props.firstName} ${this.props.lastName}`\r\n}';
        const setterExample =
            "function setter() {\r\n  // const [firstName, lastName] = this.state.name.split(' ')\r\n  // this.emit('update:firstName', firstName)\r\n  // this.emit('update:lastName', lastName)\r\n}";

        return {
            t,
            INIT,
            GETTER,
            SETTER,
            state,
            VAR_TYPES,
            variableEditor,
            getterEditor,
            setterEditor,
            i18nToolRef,
            editorCode,
            rules,
            options,
            getterExample,
            setterExample,
            getEditor,
            validateName,
            editorDidMount,
            validate,
            getFormData,
            insertContent,
            fullscreenChange,
            cancel,
            validateForm,
            createDataForm,
            clearValidateForm
        };
    }
};
</script>

<!-- eslint-disable vue/block-lang, max-lines -->
<style lang="less" scoped>
.create-form {
    height: calc(100% - 45px);
    overflow-y: auto;
    .tips {
        font-size: 12px;
        line-height: 18px;
        margin-top: 8px;
        border-radius: 4px;
        padding: 8px 14px;
        background: var(--te-state-tip-bg-color);
        color: var(--te-state-tip-text-color);
        & > pre {
            font-family: Consolas, 'Courier New', monospace;
        }
    }
    :deep(.toolbar) {
        position: absolute;
        z-index: 99;
        right: 12px;
    }
    .var {
        padding: 12px 12px 0 12px;
    }
    .var-type-item {
        padding: 0 12px;
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

.variable-editor {
    height: 270px;
}
</style>
