<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <div class="life-cycle">
        <tiny-popover
            v-model="state.showPopover"
            placement="bottom-end"
            trigger="hover"
            popper-class="option-popper"
            :open-delay="OPEN_DELAY.Default"
        >
            <template #reference>
                <tiny-button class="life-cycle-btn"><svg-icon name="add" />{{
                        isPage
                            ? t(
                                  'designer.components.lifeCycles.addPageLifecycle'
                              )
                            : t(
                                  'designer.components.lifeCycles.addBlockLifecycle'
                              )
                    }}
                </tiny-button>
            </template>
            <div class="popover-list">
                <ul>
                    <li
                        v-for="(item, index) in state.lifeCycles"
                        :key="index"
                        :class="{
                            existed: state.bindLifeCycles.hasOwnProperty(item)
                        }"
                        @click="openLifeCyclesPanel(item)"
                    >
                        <div>{{ item }}</div>
                    </li>
                </ul>
            </div>
        </tiny-popover>
    </div>
    <div class="life-cycle-tips">{{ lifeCycleTips }}</div>
    <meta-list-items
        :options-list="Object.keys(state.bindLifeCycles)"
        :draggable="false"
        :class="{
            'life-cycle-content-list': Object.keys(state.bindLifeCycles).length
        }"
    >
        <template #content="{ data }">
            <div class="life-cycle-content-item">
                {{ data }}
            </div>
        </template>
        <template #operate="{ data }">
            <svg-button
                :hover-bg-color="false"
                name="setting"
                @click="openLifeCyclesPanel(data)"
            />
            <svg-button
                :hover-bg-color="false"
                name="delete"
                @click="deleteLifeCycle(data)"
            />
        </template>
    </meta-list-items>
    <tiny-dialog-box
        v-model:visible="state.showLifeCyclesDialog"
        class="bind-dialog-window"
        width="900px"
        :show-close="false"
        :append-to-body="true"
    >
        <template #title>
            <div class="bind-dialog-title">
                <div class="bind-dialog-text">
                    {{
                        isPage
                            ? t(
                                  'designer.components.lifeCycles.addPageLifecycle'
                              )
                            : t(
                                  'designer.components.lifeCycles.addBlockLifecycle'
                              )
                    }}
                </div>
                <div class="bind-dialog-btn">
                    <tiny-button type="info" @click="editorConfirm">{{
                        t('designer.components.lifeCycles.save')
                    }}</tiny-button>
                    <svg-button
                        name="close"
                        @click="state.showLifeCyclesDialog = false"
                    />
                </div>
            </div>
        </template>
        <div v-if="state.showLifeCyclesDialog" class="dialog-content">
            <div class="dialog-content-left">
                <tiny-search
                    :placeholder="t('designer.components.lifeCycles.search')"
                    @update:model-value="searchLifeCyclesList"
                />
                <ul class="life-cycle-list">
                    <li
                        v-for="(item, index) in state.lifeCycles"
                        :key="index"
                        @click="openLifeCyclesPanel(item)"
                    >
                        <div
                            class="life-cycle-name"
                            :class="{
                                'life-cycle-selected': item === state.title
                            }"
                        >
                            {{ item }}
                            <icon-yes
                                v-if="item === state.title"
                                class="life-cycle-selected__icon"
                            />
                        </div>
                    </li>
                </ul>
            </div>
            <div class="dialog-content-right">
                <monaco-editor
                    ref="editorRef"
                    class="life-cycle-editor"
                    :options="{
                        language: 'javascript'
                    }"
                    :value="state.editorValue"
                    @change="handleEditorChange"
                    @editor-did-mount="editorDidMount"
                />
            </div>
        </div>

        <template #footer />
    </tiny-dialog-box>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
import { reactive, ref, watchEffect, onBeforeUnmount } from 'vue';
import { Button, DialogBox, Popover, Search } from '@opentiny/vue';
import {
    useModal,
    usePage,
    useNotify,
    useCanvas,
    getMergeMeta
} from '@opentiny/tiny-engine-meta-register';
import {
    MetaListItems,
    VueMonaco,
    SvgButton
} from '@opentiny/tiny-engine-common';
import { iconYes } from '@opentiny/vue-icon';
import { initLinter, lint } from '@opentiny/tiny-engine-common/js/linter';
import { constants } from '@opentiny/tiny-engine-utils';

import { initCompletion } from '@/composable/completion';
import { useDesignerI18n } from '@/services/i18nService';

const { OPEN_DELAY } = constants;

export default {
    components: {
         
        TinyPopover: Popover,
         
        TinyDialogBox: DialogBox,
         
        TinySearch: Search,
         
        TinyButton: Button,
         
        MonacoEditor: VueMonaco,
         
        SvgButton,
         
        MetaListItems,
         
        IconYes: iconYes()
    },

    props: {
        bindLifeCycles: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        },
        isPage: {
            type: Boolean,
            default: true
        }
    },
    emits: ['updatePageLifeCycles', 'bind'],
     
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const { confirm } = useModal();
        const { getPageContent } = usePage();

        const lifeCycles =
            getMergeMeta('engine.config')?.lifeCyclesOptions[
                getMergeMeta('engine.config')?.dslMode
            ];

        const lifeCycleTips =
            getMergeMeta('engine.config')?.lifeCycleTips[
                getMergeMeta('engine.config')?.dslMode
            ];

        const state = reactive({
            showPopover: true,
            showLifeCyclesDialog: false,
            title: '',
            lifeCycles,
            bindLifeCycles: {},
            editorValue: '{}',
            hasError: false,
            linterWorker: null,
            completionProvider: null
        });

        watchEffect(() => {
            state.bindLifeCycles = props.bindLifeCycles || {};
        });

        const searchLifeCyclesList = value => {
            if (!value) {
                state.lifeCycles = lifeCycles;
                return;
            }
            state.lifeCycles = lifeCycles.filter(
                item => item?.toLowerCase().indexOf(value.toLowerCase()) > -1
            );
        };

        const syncLifeCycle = () => {
            const currentSchema = useCanvas().getSchema();
            const pageContent = getPageContent();
            const { id, fileName } = pageContent;
            if (
                id === currentSchema.id ||
                fileName === currentSchema.fileName
            ) {
                currentSchema.lifeCycles = state.bindLifeCycles;
            }
        };

        const deleteLifeCycle = name => {
            confirm({
                title: t('designer.components.lifeCycles.tip'),
                message: t('designer.components.lifeCycles.deleteConfirm', {
                    name
                }),
                exec: () => {
                    delete state.bindLifeCycles[name];
                    syncLifeCycle();
                }
            });
        };

         
        const editorRef = ref(null);

        const openLifeCyclesPanel = item => {
            state.title = item;
            const bindLifeCycleSource =
                props.bindLifeCycles?.[item] ||
                useCanvas().getSchema()?.lifeCycles?.[item];
            state.editorValue =
                bindLifeCycleSource?.value ||
                `function ${item} (${
                    item === 'setup' ? '{ props, state, watch, onMounted }' : ''
                }) {} `;
            state.showLifeCyclesDialog = true;
            setTimeout(() => {
                editorRef.value
                    .getEditor()
                    .trigger('anyString', 'editor.action.formatDocument');
            });
        };

        const editorConfirm = () => {
            if (state.hasError) {
                useNotify({
                    type: 'error',
                    message: t('designer.components.lifeCycles.lintError')
                });

                return;
            }

            const editorValue = editorRef.value.getEditor().getValue();
            const value = {
                type: 'JSFunction',
                value: editorValue
            };

            if (!state.bindLifeCycles) {
                state.bindLifeCycles = {};
            }

            state.bindLifeCycles[state.title] = value;
            state.showLifeCyclesDialog = false;
            syncLifeCycle();

            if (!props.isPage) {
                emit('bind', state.bindLifeCycles);
            } else {
                emit('updatePageLifeCycles', state.bindLifeCycles);
            }
        };

        const editorDidMount = editor => {
            if (!editorRef.value) {
                return;
            }
            // Lowcode API 提示
            state.completionProvider = initCompletion(
                editorRef.value.getMonaco(),
                editorRef.value.getEditor()?.getModel()
            );

            // 初始化 ESLint worker
            state.linterWorker = initLinter(
                editor,
                editorRef.value.getMonaco(),
                state
            );
        };

        const handleEditorChange = () => {
            if (!editorRef.value) {
                return;
            }
            // 用户在线编辑代码内容变化时，发起 ESLint 静态检查
            const monacoModel = editorRef.value.getEditor().getModel();
            lint(monacoModel, state.linterWorker);
        };

        onBeforeUnmount(() => {
            state.completionProvider?.forEach?.(provider => {
                provider.dispose();
            });
            // 终止 ESLint worker
            state.linterWorker?.terminate?.();
        });

        return {
            t,
            state,
            lifeCycleTips,
            editorRef,
            searchLifeCyclesList,
            openLifeCyclesPanel,
            deleteLifeCycle,
            editorConfirm,
            editorDidMount,
            handleEditorChange,
             
            OPEN_DELAY
        };
    }
};
</script>

<!-- eslint-disable vue/max-lines-per-block -->
<style lang="scss" scoped>
.life-cycle {
    display: flex; // 决定了鼠标移入后的弹窗位置
    svg {
        outline: none;
    }
    .life-cycle-btn {
        color: var(--te-component-common-text-color-primary);
        border-color: var(--te-component-common-border-color);
        &:hover {
            border-color: var(--te-component-common-border-color-hover);
        }
    }
}
.life-cycle-tips {
    color: var(--te-component-common-text-color-weaken);
    margin: 4px 0 0;
    height: 16px;
    line-height: 16px;
}
.life-cycle-content-list {
    margin-top: 12px;
}
.life-cycle-alert {
    color: var(--te-component-common-text-color-weaken);
    margin-left: 20px;
    margin-right: 20px;
}
.life-cycle-content-item {
    color: var(--te-component-common-text-color-primary);
}
.opt-button {
    &:last-child {
        margin-right: var(--te-base-space-2x);
    }
}

.popover-list {
    li {
        padding: 0 12px;
        margin: 0 -16px;
        line-height: 24px;
        cursor: pointer;
        &:hover {
            background: var(--te-component-common-bg-color-hover);
        }
    }
    .existed {
        cursor: not-allowed;
        pointer-events: none;
        color: var(--te-component-common-text-color-disabled);
    }
}

:deep(.tiny-dialog-box__body) {
    height: 70vh;
    min-height: 500px;
    max-height: 800px;
}

.dialog-content {
    display: flex;
    height: 100%;
    .dialog-content-left {
        width: 200px;
        margin-right: 20px;

        .life-cycle-list {
            border-radius: 4px;
            max-height: 500px;
            margin-top: 8px;
            overflow: auto;
        }

        .life-cycle-name {
            padding: 8px 12px 8px 30px;
            cursor: pointer;
            position: relative;
            transition: 0.3s;

            &.life-cycle-selected {
                background: var(--te-component-common-bg-color-active);
            }

            .life-cycle-selected__icon {
                font-size: 16px;
                position: absolute;
                top: 50%;
                left: 12px;
                transform: translateY(-50%);
            }

            &:hover {
                background: var(--te-component-common-bg-color-hover);
            }
        }
    }

    .dialog-content-right {
        flex: 1;
        .life-cycle-editor {
            border: 1px solid var(--te-component-common-border-color-divider);
            height: 100%;
            box-sizing: border-box;
        }
    }
}

.bind-dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
}
.bind-dialog-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .bind-dialog-text {
        color: var(--te-component-common-text-color-primary);
        font-size: var(--te-base-font-size-1);
    }
    .bind-dialog-btn {
        display: flex;
        align-items: center;
        .tiny-button {
            margin-right: 8px;
            min-width: 40px;
        }
    }
}
</style>
