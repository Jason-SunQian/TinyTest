<!-- eslint-disable vue/max-lines-per-block -->
<!-- eslint-disable vue/no-root-v-if -->
<template>
    <plugin-setting
        v-if="isOpen"
        :align="align"
        :fixed-name="PLUGIN_NAME.Bridge"
    >
        <template #title>
            <div class="title-wrap">
                <span>{{ state.title }}</span>
            </div>
        </template>
        <template #header>
            <button-group>
                <tiny-button class="save-btn" type="primary" @click="save">{{
                    t('designer.common.save')
                }}</tiny-button>
                <svg-button
                    v-if="state.status"
                    class="delete-btn"
                    name="delete"
                    @click="deleteReSource"
                />
                <svg-button
                    class="close-btn"
                    name="close"
                    @click="closePanel"
                />
            </button-group>
        </template>
        <template #content>
            <tiny-form
                ref="resourceForm"
                class="resource-form"
                :rules="rules"
                :model="state"
                validate-type="text"
                :inline-message="true"
                label-position="top"
                :label-align="true"
            >
                <div class="right-item">
                    <tiny-form-item
                        v-if="!state.status"
                        :label="t('designer.bridge.utilType')"
                        prop="type"
                    >
                        <tiny-radio-group
                            v-model="state.type"
                            class="resource-type-radio-group"
                            @change="handleChangeType"
                        >
                            <tiny-radio :label="RESOURCE_CATEGORY.Npm">{{
                                RESOURCE_CATEGORY.Npm
                            }}</tiny-radio>
                            <tiny-radio :label="RESOURCE_CATEGORY.Function">{{
                                RESOURCE_CATEGORY.Function
                            }}</tiny-radio>
                        </tiny-radio-group>
                    </tiny-form-item>
                    <tiny-form-item
                        v-if="!state.status"
                        :label="t('designer.bridge.utilName')"
                        prop="name"
                    >
                        <tiny-input
                            v-model="state.name"
                            :placeholder="t('designer.bridge.inputUtilName')"
                        />
                    </tiny-form-item>
                    <div v-if="state.category">
                        <tiny-form-item label="npm" prop="content.package">
                            <tiny-input
                                v-model="state.content.package"
                                :placeholder="t('designer.bridge.inputNpmName')"
                            />
                        </tiny-form-item>
                        <tiny-form-item
                            :label="t('designer.bridge.npmExportName')"
                            prop="content.exportName"
                        >
                            <tiny-input
                                v-model="state.content.exportName"
                                :placeholder="
                                    t('designer.bridge.inputNpmExportName')
                                "
                            />
                        </tiny-form-item>
                        <tiny-form-item label="">
                            <tiny-checkbox
                                v-model="state.content.destructuring"
                                >{{
                                    t('designer.bridge.destructNpm')
                                }}</tiny-checkbox>
                        </tiny-form-item>
                        <tiny-form-item
                            v-if="state.mode"
                            :label="t('designer.bridge.asInstance')"
                        >
                            <tiny-checkbox v-model="state.isInstance" />
                        </tiny-form-item>
                        <tiny-form-item
                            v-if="state.isInstance"
                            :label="t('designer.bridge.instanceName')"
                            prop="content.instanceName"
                        >
                            <tiny-input v-model="state.content.instance" />
                        </tiny-form-item>
                        <tiny-form-item :label="t('designer.bridge.entryPath')">
                            <tiny-input
                                v-model="state.content.main"
                                :placeholder="
                                    t('designer.bridge.entryPathPlaceholder')
                                "
                            />
                        </tiny-form-item>
                        <tiny-form-item :label="t('designer.bridge.version')">
                            <tiny-input
                                v-model="state.content.version"
                                :placeholder="
                                    t('designer.bridge.versionPlaceholder')
                                "
                            />
                        </tiny-form-item>
                        <tiny-form-item>
                            <template #label>
                                <div class="cdn-label-wrap">
                                    <span>{{ t('designer.bridge.cdn') }}</span>
                                </div>
                            </template>
                            <tiny-input
                                v-model="state.content.cdnLink"
                                :placeholder="t('designer.bridge.cdn')"
                            />
                            <div class="tip">
                                {{ t('designer.bridge.cdnTip') }}
                            </div>
                        </tiny-form-item>
                        <tiny-form-item
                            :label="t('designer.bridge.generatePreview')"
                        >
                            <div class="code-preview">
                                <pre>{{ codePreview }}</pre>
                            </div>
                        </tiny-form-item>
                    </div>
                    <monaco-editor
                        v-else
                        ref="editor"
                        :value="state.value"
                        class="monaco-editor"
                        :options="options"
                    />
                </div>
            </tiny-form>
        </template>
    </plugin-setting>
</template>
<!-- eslint-disable-next-line -->
<script lang="ts">
 
import {
    computed,
    onMounted,
    reactive,
    ref,
    watchEffect,
    nextTick,
    watch
} from 'vue';
import {
    Input as TinyInput,
    Button as TinyButton,
    Form as TinyForm,
    FormItem as TinyFormItem,
    Checkbox as TinyCheckbox,
    Radio,
    RadioGroup
} from '@opentiny/vue';
import {
    VueMonaco as MonacoEditor,
    PluginSetting,
    SvgButton,
    ButtonGroup
} from '@opentiny/tiny-engine-common';
import {
    useLayout,
    useModal,
    useNotify,
    getMetaApi,
    META_SERVICE,
    getMergeMeta
} from '@opentiny/tiny-engine-meta-register';

import { useDesignerI18n } from '../../services/i18nService';

import {
    ACTION_TYPE,
    RESOURCE_TYPE,
    RESOURCE_CATEGORY,
    getType,
    deleteData,
    getCategory,
    setCategory,
    getResource,
    saveResource,
    getActionType,
    getResourceNamesByType
} from './js/resource';

const isOpen = ref(false);
export const openPanel = () => {
    isOpen.value = true;
    nextTick(() => window.dispatchEvent(new Event('resize')));
};
export const closePanel = () => {
    isOpen.value = false;
};

export default {
    components: {
         
        TinyForm,
         
        TinyInput,
         
        TinyButton,
         
        TinyFormItem,
         
        TinyCheckbox,
         
        PluginSetting,
         
        MonacoEditor,
         
        TinyRadioGroup: RadioGroup,
         
        TinyRadio: Radio,
         
        SvgButton,
         
        ButtonGroup
    },
     
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const monacoOptions = {
            language: 'javascript',
            mouseStyle: 'default',
            minimap: { enabled: false },
            overviewRulerBorder: false,
            renderLineHighlightOnlyWhenFocus: true
        };
        const { confirm } = useModal();
        const { PLUGIN_NAME, getPluginByLayout } = useLayout();
        const align = computed(() => getPluginByLayout(PLUGIN_NAME.Bridge));

        const state = reactive({
            resource: computed(() => getResource()),
            name: '',
            value: '',
            content: {},
            status: computed(() => getActionType() === ACTION_TYPE.Edit),
            category: computed(() => getCategory() === RESOURCE_CATEGORY.Npm),
            mode: computed(
                () => getMergeMeta('engine.config')?.dslMode !== 'Vue'
            ),
            isInstance: false,
            title: computed(() => {
                const action =
                    getActionType() === ACTION_TYPE.Edit
                        ? t('designer.common.edit')
                        : t('designer.common.add');
                const type =
                    getType() === RESOURCE_TYPE.Bridge
                        ? t('designer.bridge.bridge')
                        : t('designer.bridge.util');
                return action + type;
            }),
            type: RESOURCE_CATEGORY.Npm
        });

        const codePreview = computed(() => {
            const name = state.name || 'name';
            let importName = name;
            if (state.content.destructuring) {
                importName =
                    state.name && state.name === state.content.exportName
                        ? `{ ${state.content.exportName || 'exportName'} }`
                        : `{ ${
                              state.content.exportName || 'exportName'
                          } as ${name} }`;
            }

            const importFrom = `${state.content.package || 'package'}${
                state.content.main || ''
            }`;
            return `import ${importName} from '${importFrom}'\nexport { ${name} }`;
        });

        watchEffect(() => {
            state.name = state.resource.name;
            state.content = state.resource.content || {};
            state.value = state.resource?.content?.value || '';
            state.type = getCategory();
        });
        watch(
            () => state.isInstance,
            v => {
                if (!v) state.content.instance = '';
            }
        );

         
        const editor = ref(null);
         
        const resourceForm = ref(null);
        onMounted(() => window.dispatchEvent(new Event('resize')));

        const save = () => {
            const data = {
                category: getType(),
                type: getCategory(),
                name: state.name,
                app: getMetaApi(META_SERVICE.GlobalService).getBaseInfo().id,
                content: state.category
                    ? state.content
                    : {
                          type: 'JSFunction',
                          value: editor.value.getEditor().getValue()
                      }
            };
            resourceForm.value.validate(valid => {
                if (!valid) return;
                if (!state.category && !editor.value.getEditor().getValue()) {
                    useNotify({
                        type: 'error',
                        message: t('designer.bridge.functionRequired')
                    });
                    return;
                }
                saveResource(data, closePanel, emit);
            });
        };

        const deleteReSource = () => {
            confirm({
                title: t('designer.bridge.deleteTitle'),
                message: t('designer.bridge.deleteConfirm'),
                exec: () => {
                    deleteData(state.name, closePanel, emit);
                }
            });
        };

        const rules = {
            name: [
                {
                    required: true,
                    message: t('designer.datasource.required'),
                    trigger: 'change'
                },
                {
                    validator: (rule, value, callback) => {
                        const names = getResourceNamesByType(getType());
                        if (Array.isArray(names) && names.includes(value)) {
                            callback(
                                new Error(t('designer.bridge.nameExists'))
                            );
                        } else {
                            callback();
                        }
                    },
                    trigger: 'change'
                }
            ],
             
            'content.package': [
                {
                    required: true,
                    message: t('designer.datasource.required'),
                    trigger: 'change'
                }
            ],
             
            'content.exportName': [
                {
                    required: true,
                    message: t('designer.datasource.required'),
                    trigger: 'change'
                }
            ],
             
            'content.instanceName': {
                required: true,
                message: t('designer.datasource.required'),
                trigger: 'change'
            }
        };

        const handleChangeType = value => {
            setCategory(value);
        };

        return {
            t,
            align,
             
            PLUGIN_NAME,
            rules,
            resourceForm,
            editor,
            state,
            codePreview,
            isOpen,
            closePanel,
            save,
            deleteReSource,
            options: monacoOptions,
            handleChangeType,
             
            RESOURCE_CATEGORY
        };
    }
};
</script>

<style lang="scss" scoped>
.plugin-setting {
    :deep(.icon-wrap) {
        margin-right: 8px;
    }
    .resource-form {
        .tip {
            font-size: 12px;
            line-height: 18px;
            margin-top: 8px;
            color: var(--te-bridge-setting-tip-text-color);
        }
    }
}
.title-wrap {
    font-size: 12px;
    font-weight: 700;
    color: var(--te-bridge-setting-title-text-color);
}
.header-wrap {
    display: flex;
    align-items: center;
    column-gap: 6px;
}
.header-wrap .tiny-button {
    width: 40px;
    padding: 0;
    min-width: 40px;
    margin-right: 2px;
}
.monaco-editor {
    height: 500px;
    margin-top: 8px;
    border: 1px solid var(--te-bridge-editor-border-color);
}
.cdn-label-wrap {
    display: flex;
    align-items: center;
}
.code-preview {
    font-size: 12px;
    line-height: 20px;
    background: var(--te-bridge-setting-code-bg-color);
    color: var(--te-bridge-setting-code-text-color);
    border-radius: 4px;
}
.code-preview > pre {
    margin: 0;
    padding: 8px 20px;
    font-family: Consolas, 'Courier New', monospace;
}
</style>
