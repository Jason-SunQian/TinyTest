/* eslint-disable max-lines */
<!-- eslint-disable vue/max-lines-per-block, vue/no-bare-strings-in-template, vue/block-lang, @typescript-eslint/naming-convention, vue/html-self-closing, vue/v-on-event-hyphenation, vue/html-closing-bracket-newline, vue/attributes-order -->
<template>
    <slot>
        <span
            :class="['icon', { 'icon-bind': modelValue?.variable }]"
            @click="open"
        >
            <svg-button
                name="cloud-shell"
                placement="top"
                :tips="t('designer.configurators.variableBinding.title')"
            />
        </span>
    </slot>

    <tiny-dialog-box
        v-if="dialogShouldInitialize"
        :visible="state.isVisible"
        :title="t('designer.configurators.variableBinding.title')"
        width="48%"
        :append-to-body="true"
        class="meta-bind-variable-dialog-box"
        @update:visible="state.isVisible = $event"
        @close="cancel"
    >
        <div class="bind-dialog-container">
            <div class="bind-dialog-container-header">
                <tiny-alert
                    type="info"
                    :description="
                        t('designer.configurators.variableBinding.description')
                    "
                    class="header-alert"
                    :closable="false"
                />
            </div>
            <div class="bind-dialog-content">
                <div class="content-left">
                    <span class="content-left__title">{{
                        t('designer.configurators.variableBinding.variableList')
                    }}</span>
                    <div class="list-wrap">
                        <ul class="content-left__list">
                            <li
                                v-for="item in state.variableList"
                                :key="item.id"
                                :class="{
                                    'content-left__list-item': true,
                                    active: item.id === state.active
                                }"
                                @click="selectItem(item)"
                            >
                                {{ item.content }}
                            </li>
                        </ul>
                        <div class="item-content">
                            <tiny-search
                                v-model="state.value"
                                :placeholder="
                                    t(
                                        'designer.configurators.variableBinding.search'
                                    )
                                "
                            />
                            <div
                                class="item-content-list lowcode-scrollbar-thin"
                            >
                                <ul>
                                    <li
                                        v-for="(item, key) in state.variables"
                                        v-show="key.includes(state.value)"
                                        :key="key"
                                        :class="{
                                            'item-selected':
                                                state.variableName === key
                                        }"
                                        @click="variableClick(key, item)"
                                    >
                                        <div
                                            class="item-text"
                                            :title="state.bindPrefix + key"
                                        >
                                            {{ `${state.bindPrefix}${key}` }}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content-right">
                    <div class="content-detail-header">
                        <div class="header-name">
                            <span class="content-right__title">{{
                                t(
                                    'designer.configurators.variableBinding.variable'
                                )
                            }}</span>
                        </div>
                    </div>
                    <div class="content-wrap">
                        <div v-if="!state.isEditorEditMode" class="top">
                            {{ state.variable }}
                        </div>
                        <div
                            v-else
                            :class="['top', { 'poll-top': isDataSource }]"
                        >
                            <monaco-editor
                                ref="editor"
                                :value="state.variable"
                                :options="editorOptions"
                                @editor-did-mount="editorDidMount"
                            />
                            <div
                                v-if="isDataSource"
                                class="datasource-poll-wrap"
                            >
                                <tiny-tooltip
                                    placement="top"
                                    :content="
                                        t(
                                            'designer.configurators.variableBinding.pollTooltip'
                                        )
                                    "
                                    effect="light"
                                >
                                    <span>{{
                                        t(
                                            'designer.configurators.variableBinding.pollUpdate'
                                        )
                                    }}</span>
                                </tiny-tooltip>
                                <tiny-switch v-model="state.isPoll" />
                                <div
                                    v-if="state.isPoll"
                                    class="datasource-poll-interval"
                                >
                                    <span>{{
                                        t(
                                            'designer.configurators.variableBinding.updateInterval'
                                        )
                                    }}</span>
                                    <tiny-input
                                        v-model="state.pollInterval"
                                        type="number"
                                    />
                                    <span>ms</span>
                                </div>
                            </div>
                        </div>
                        <div class="bottom lowcode-scrollbar-thin">
                            <span class="bottom-title">{{
                                t(
                                    'designer.configurators.variableBinding.usage'
                                )
                            }}</span>
                            <div class="bottom-demo">
                                <p>
                                    {{
                                        t(
                                            'designer.configurators.variableBinding.usageDescription1'
                                        )
                                    }}
                                </p>
                                <p>
                                    {{
                                        t(
                                            'designer.configurators.variableBinding.usageDescription2'
                                        )
                                    }}
                                </p>
                                <div>
                                    {{
                                        t(
                                            'designer.configurators.variableBinding.usageExample.pageState'
                                        )
                                    }}
                                </div>
                                <div>
                                    {{
                                        t(
                                            'designer.configurators.variableBinding.usageExample.string'
                                        )
                                    }}
                                </div>
                                <div>
                                    {{
                                        t(
                                            'designer.configurators.variableBinding.usageExample.number'
                                        )
                                    }}
                                </div>
                                <div>
                                    {{
                                        t(
                                            'designer.configurators.variableBinding.usageExample.boolean'
                                        )
                                    }}
                                </div>
                                <div>
                                    {{
                                        t(
                                            'designer.configurators.variableBinding.usageExample.object'
                                        )
                                    }}
                                </div>
                                <div>
                                    {{
                                        t(
                                            'designer.configurators.variableBinding.usageExample.array'
                                        )
                                    }}
                                </div>
                                <div>
                                    {{
                                        t(
                                            'designer.configurators.variableBinding.usageExample.null'
                                        )
                                    }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="bind-dialog-footer">
                <tiny-button type="danger" plain @click="remove">{{
                    t('designer.configurators.variableBinding.removeBinding')
                }}</tiny-button>
                <div class="right">
                    <tiny-button @click="cancel">{{
                        t('designer.common.cancel')
                    }}</tiny-button>
                    <tiny-button type="info" @click="confirm">{{
                        t('designer.common.confirm')
                    }}</tiny-button>
                </div>
            </div>
        </template>
    </tiny-dialog-box>
</template>

<script lang="ts">
/* eslint-disable vue/max-lines-per-block, @typescript-eslint/naming-convention, vue/prefer-import-from-vue, import/order, vue/component-definition-name-casing, vue/html-self-closing, vue/v-on-event-hyphenation, vue/html-closing-bracket-newline, vue/attributes-order, vue/component-api-style, no-lonely-if, prefer-template, @typescript-eslint/no-unused-vars, vue/require-explicit-emits, max-lines, vue/block-lang */
import {
    VueMonaco as MonacoEditor,
    SvgButton
} from '@opentiny/tiny-engine-common';
import {
    useCanvas,
    useProperties,
    useResource,
    getMetaApi,
    META_APP,
    META_SERVICE
} from '@opentiny/tiny-engine-meta-register';
import { getCommentByKey } from '@opentiny/tiny-engine-common/js/comment';
import { generate, parse, traverse } from '@opentiny/tiny-engine-common/js/ast';
import { DEFAULT_LOOP_NAME } from '@opentiny/tiny-engine-common/js/constants';
import { constants } from '@opentiny/tiny-engine-utils';
import {
    Alert,
    Button,
    DialogBox,
    Input,
    Search,
    Switch,
    Tooltip
} from '@opentiny/vue';
import {
    computed,
    nextTick,
    reactive,
    ref,
    watch,
    camelize,
    capitalize
} from 'vue';

import { useDesignerI18n } from '@/services/i18nService';

const { EXPRESSION_TYPE } = constants;

// 注意：DATASOUCEPREFIX 需要在 setup 中动态获取，因为需要国际化
const CONSTANTS = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    THIS: 'this.',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    STATE: 'this.state.',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    STORE: 'this.stores.',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PROPS: 'this.props.',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    COLLECTION: 'Collection',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ITEM: 'item',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    DATASOUCE: 'datasource',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    DATASOURCEMAP: 'this.dataSourceMap.',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    INTERVALID: 'intervalId'
};

const getJsSlot = () => {
    const { getCurrent } = useCanvas().canvasApi.value || {};

    if (!getCurrent) {
        return [false, {}];
    }

    const { getNodeWithParentById } = useCanvas();

    const jsSlot = getNodeWithParentById(
        getCurrent()?.parent?.id,
        true
    )?.parent;

    return [jsSlot?.type === 'JSSlot', jsSlot];
};

const getJsSlotParams = () => {
    const [isJsSlot, jsSlot] = getJsSlot();
    return isJsSlot ? jsSlot?.params || [] : [];
};

export default {
    // eslint-disable-next-line vue/component-definition-name-casing
    name: 'VariableConfigurator',
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        MonacoEditor,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyDialogBox: DialogBox,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyButton: Button,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinySearch: Search,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinySwitch: Switch,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyInput: Input,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTooltip: Tooltip,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        SvgButton,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyAlert: Alert
    },
    inheritAttrs: false,
    props: {
        name: {
            type: String,
            default: ''
        },
        // eslint-disable-next-line vue/require-typed-object-prop
        // eslint-disable-next-line vue/require-typed-object-prop
        modelValue: {
            // eslint-disable-next-line vue/require-typed-object-prop
            type: [String, Number, Boolean, Array, Object, Date],
            default: ''
        },
        lazyLoad: {
            type: Boolean,
            default: true
        }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const editor = ref<{
            getEditor: () => {
                getValue: () => string;
                setValue: (value: string) => void;
            };
        } | null>(null);
        let oldValue = '';

        // 使用 computed 确保响应式更新
        const list = computed(() => [
            {
                id: 'state',
                content: t(
                    'designer.configurators.variableBinding.categories.state'
                )
            },
            {
                id: 'store',
                content: t(
                    'designer.configurators.variableBinding.categories.store'
                )
            },
            {
                id: 'function',
                content: t(
                    'designer.configurators.variableBinding.categories.function'
                )
            },
            {
                id: 'utils',
                content: t(
                    'designer.configurators.variableBinding.categories.utils'
                )
            },
            {
                id: 'bridge',
                content: t(
                    'designer.configurators.variableBinding.categories.bridge'
                )
            },
            {
                id: 'datasource',
                content: t(
                    'designer.configurators.variableBinding.categories.datasource'
                )
            }
        ]);

        const state = reactive({
            isBlock: computed(() => useCanvas().isBlock()),
            variables: {},
            // 控制变量列表显示/隐藏
            isVisible: false,
            // 搜索框value
            value: '',
            active: 'state',
            // 某一类型下的变量列表
            variableList: computed(() => {
                const extendedVars = [];
                const [isInJsSlot] = getJsSlot();

                if (state.isBlock) {
                    extendedVars.push({ id: 'props', content: 'props' });
                }

                if (state.loopData) {
                    extendedVars.push({
                        id: 'loop',
                        content: t(
                            'designer.configurators.variableBinding.categories.loop'
                        )
                    });
                }

                if (isInJsSlot) {
                    extendedVars.push({
                        id: 'slotScope',
                        content: t(
                            'designer.configurators.variableBinding.categories.slotScope'
                        )
                    });
                }

                return [...list.value, ...extendedVars];
            }),
            // 绑定的变量名/变量表达式
            variable: '',
            // 绑定的变量指向的值内容
            variableContent: null,
            // 引用的state变量名
            variableName: '',
            // 编辑器状态：只读状态(false)、编辑状态(true)
            isEditorEditMode: true,
            dataSouce: null,
            // 静态值
            mock: props.modelValue?.value || props.modelValue,
            bindPrefix: '',
            loopData: null,
            loopArgs: '',
            isPoll: false,
            pollInterval: 5000
        });

        const isDataSource = computed(
            () => state.active === CONSTANTS.DATASOUCE
        );

        // 每次弹窗打开时都记录下绑定变量的旧值，用来判断保存按钮状态
        watch(
            () => state.isVisible,
            value => {
                if (value) {
                    oldValue = state.variable;
                    state.loopData = useProperties().getSchema()?.loop;
                }
            }
        );

        const bindKey = computed(
            () => props.modelValue?.value?.replace?.('this.state.', '') || ''
        );

        const editorOptions = {
            language: 'javascript',
            lineNumbers: false,
            minimap: {
                enabled: false
            },
            tabSize: 2,
            insertSpaces: true,
            formatOnPaste: true,
            formatOnType: true,
            autoIndent: 'full',
            newLineCharacter: '\n',
            convertTabsToSpaces: true,
            trimAutoWhitespace: true,
            wordWrap: 'on',
            wordWrapColumn: 120,
            wordWrapMinChars: 10,
            wordWrapStrategy: 'advanced'
        };

        const editorDidMount = () => {
            if (!editor.value) {
                return;
            }

            // 支持对象类型数据或表达式，不显示语法校验报错
            const diagnosticsOptions = editor.value
                .getMonaco()
                .languages.typescript.javascriptDefaults.getDiagnosticsOptions();
            editor.value
                .getMonaco()
                .languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                    ...diagnosticsOptions,
                    noSyntaxValidation: true,
                    noSemanticValidation: true
                });
        };

        const removeInterval = (start, end, intervalId, pageSchema) => {
            const unmountedFn = pageSchema.lifeCycles?.onUnmounted?.value;
            const fetchBody = `
      /** ${start} */
      clearInterval(state.${intervalId});
      /** ${end} */`;

            if (!unmountedFn) {
                pageSchema.lifeCycles = pageSchema.lifeCycles || {};
                pageSchema.lifeCycles.onUnmounted = {
                    type: 'JSFunction',
                    value: `function onUnmounted() {${fetchBody}}`
                };
            } else {
                if (!unmountedFn.includes(`${intervalId}`)) {
                    pageSchema.lifeCycles.onUnmounted.value = unmountedFn
                        .trim()
                        .replace(/\}$/, `${fetchBody}}`);
                }
            }
        };

        const genRemoteMethodToLifeSetup = (
            variableName,
            sourceRef,
            pageSchema
        ) => {
            if (sourceRef?.data?.data) {
                const setupFn = pageSchema.lifeCycles?.setup?.value;
                const { start, end } = getCommentByKey(variableName);
                const intervalId = `${CONSTANTS.INTERVALID}${capitalize(
                    camelize(sourceRef.name)
                )}`;
                const isPoll = state.isPoll && state.pollInterval !== undefined;

                let fetchBodyFn = `${CONSTANTS.DATASOURCEMAP}${sourceRef.name}.load().then(res => {
          state.${variableName} = res?.data?.items || res?.data || res
        })`;

                if (isPoll) {
                    fetchBodyFn = `state.${intervalId} = setInterval(() => {${CONSTANTS.DATASOURCEMAP}${sourceRef.name}.load().then(res => {
            state.${variableName} = res?.data?.items || res?.data || res
          })}, ${state.pollInterval})`;
                }

                const fetchBody = `
        /** ${start} */
        ${fetchBodyFn};
        /** ${end} */`;

                if (!setupFn) {
                    pageSchema.lifeCycles = pageSchema.lifeCycles || {};
                    pageSchema.lifeCycles.setup = {
                        type: 'JSFunction',
                        value: `function setup({ props, state, watch, onMounted }) {${fetchBody}}`
                    };
                } else {
                    if (
                        !setupFn.includes(
                            `${CONSTANTS.DATASOURCEMAP}${sourceRef.name}`
                        )
                    ) {
                        pageSchema.lifeCycles.setup.value = setupFn
                            .trim()
                            .replace(/\}$/, `${fetchBody}}`);
                    } else {
                        const ast = parse(setupFn);
                        traverse(ast, {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            ExpressionStatement(path) {
                                if (path.toString().includes(sourceRef.name)) {
                                    path.replaceWithSourceString(fetchBodyFn);
                                    path.stop();
                                }
                            }
                        });

                        pageSchema.lifeCycles.setup.value = generate(ast).code;
                    }
                }

                if (isPoll) {
                    removeInterval(start, end, intervalId, pageSchema);
                }
            }
        };

        // 动态获取数据源前缀（国际化）
        const getDatasourcePrefix = () => {
            return t('designer.configurators.variableBinding.datasourcePrefix');
        };

        const variableClick = (key, item) => {
            if (state.bindPrefix === getDatasourcePrefix()) {
                // 当选中数据源时，直接生成对应state变量并绑定数据源的静态数据
                const stateName = `${CONSTANTS.DATASOUCE}${capitalize(
                    camelize(key)
                )}`;
                const staticData = item?.data?.data || [];

                // 处理数据数据回显
                state.dataSouce = item;
                state.variable = `${CONSTANTS.STATE}${stateName}`;
                // 安全检查：确保编辑器已初始化
                const editorInstance = editor.value?.getEditor();
                if (editorInstance) {
                    editorInstance.setValue(state.variable);
                }
                state.variableName = key;
                state.variableContent = staticData;
            } else {
                state.variable = !state.bindPrefix
                    ? `${state.loopArgs}${key}`
                    : `${state.bindPrefix}${key}`;
                // 安全检查：确保编辑器已初始化
                const editorInstance = editor.value?.getEditor();
                if (editorInstance) {
                    editorInstance.setValue(state.variable);
                }
                state.variableName = key;
                state.variableContent = state.variables[key];
            }
        };

        const cancel = () => {
            state.variable = '';
            state.isVisible = false;
        };

        const remove = () => {
            emit('update:modelValue', '');
            cancel();
        };

        const confirm = async () => {
            const editorInstance = editor.value?.getEditor();
            
            // 安全检查：确保编辑器已初始化（VSCode 环境中可能需要更多时间）
            if (editorInstance) {
                try {
                    // 尝试格式化文档（如果编辑器已准备好）
                    const formatAction = editorInstance.getAction('editor.action.formatDocument');
                    if (formatAction) {
                        await formatAction.run();
                    }
                } catch (error) {
                    // 如果格式化失败，继续使用当前值（不影响绑定功能）
                    // eslint-disable-next-line no-console
                    console.warn('[VariableConfigurator] Format document failed:', error);
                }
            }

            const variableContent = state.isEditorEditMode && editorInstance
                ? editorInstance.getValue()
                : state.variable;

            const { setSaved, getSchema, updateSchema } = useCanvas();
            // 如果新旧值不一样就显示未保存状态
            if (oldValue !== variableContent) {
                setSaved(false);
            }

            const pattern = /^[\s]*{[\s]*api[\s]*:[\s\w.]*}$/;
            const needFetchDataFormat =
                props.name === 'fetchData' && !pattern.test(variableContent);

            if (variableContent) {
                if (state.bindPrefix === getDatasourcePrefix()) {
                    const pageSchema = getSchema();
                    const stateName = state.variable.replace(
                        `${CONSTANTS.STATE}`,
                        ''
                    );
                    const staticData = state.variableContent.map(
                        ({ _id: _unused, ...other }) => other
                    );
                    updateSchema({
                        state: { ...pageSchema.state, [stateName]: staticData }
                    });
                    // 这里在setup生命周期函数内部处理用户真实环境中的数据源请求
                    genRemoteMethodToLifeSetup(
                        stateName,
                        state.dataSouce,
                        pageSchema
                    );
                }

                emit('update:modelValue', {
                    type: 'JSExpression',
                    value: needFetchDataFormat
                        ? `{api:${variableContent}}`
                        : variableContent
                });
            } else {
                emit('update:modelValue', '');
            }

            cancel();
        };

        const getInitVariable = () => {
            if (
                props.modelValue?.value &&
                props.modelValue?.type === EXPRESSION_TYPE.JS_EXPRESSION &&
                Object.keys(props.modelValue || {}).length === 2
            ) {
                return String(props.modelValue?.value);
            }

            return '';
        };

        const dialogShouldInitialize = ref(!props.lazyLoad);
        const open = () => {
            dialogShouldInitialize.value = true;
            state.isVisible = true;
            state.variableName = bindKey.value;
            state.variable = getInitVariable();
            state.variables = useCanvas().getSchema()?.state || {};
            state.bindPrefix = CONSTANTS.STATE;
            state.variableContent = state.variables[bindKey.value];
            // 等待编辑器初始化完成后再触发 resize 事件
            nextTick(() => {
                // 确保编辑器已初始化（VSCode 环境中可能需要更多时间）
                const checkEditor = () => {
                    if (editor.value?.getEditor()) {
                        window.dispatchEvent(new Event('resize'));
                    } else {
                        // 如果编辑器还未初始化，等待一段时间后重试
                        setTimeout(checkEditor, 100);
                    }
                };
                checkEditor();
            });
        };

        const selectItem = item => {
            state.active = item.id;
            const { getSchema } = useCanvas();

            if (item.id === 'function') {
                state.bindPrefix = CONSTANTS.THIS;
                const { getMethods } = getMetaApi(META_APP.Page);
                state.variables = { ...getMethods?.() };
            } else if (item.id === 'bridge' || item.id === 'utils') {
                state.bindPrefix = `${CONSTANTS.THIS}${item.id}.`;
                const bridge = {};
                useResource().appSchemaState[item.id]?.forEach(res => {
                    bridge[res.name] = `${item.id}.${res.content.exportName}`;
                });

                state.variables = bridge;
            } else if (item.id === 'props') {
                state.bindPrefix = CONSTANTS.PROPS;
                const properties = getSchema()?.schema?.properties;
                const bindProperties = {};
                properties?.forEach(({ content }) => {
                    content.forEach(({ property }) => {
                        bindProperties[property] = property;
                    });
                });
                state.variables = bindProperties;
            } else if (item.id === 'datasource') {
                state.bindPrefix = getDatasourcePrefix();
                const url = new URLSearchParams(location.search);
                const appId = getMetaApi(
                    META_SERVICE.GlobalService
                ).getBaseInfo().id;
                const selectedId = appId || url.get('id');

                // 实时请求数据源列表数据，保证数据源获取最新的数据源数据
                getMetaApi(META_SERVICE.Http)
                    .get(`/app-center/api/sources/list/${selectedId}`)
                    .then(data => {
                        const sourceData = {};
                        data.forEach(res => {
                            sourceData[res.name] = res;
                        });
                        state.variables = sourceData;
                    });
            } else if (item.id === 'store') {
                state.bindPrefix = CONSTANTS.STORE;
                state.variables = {};

                const stores = useResource().appSchemaState.globalState;
                stores.forEach(
                    ({ id, state: storeState = {}, getters = {} }) => {
                        const loadProp = prop => {
                            const propBinding = `${id}.${prop}`;
                            state.variables[propBinding] = propBinding;
                        };

                        Object.keys(storeState).forEach(loadProp);
                        Object.keys(getters).forEach(loadProp);
                    }
                );
            } else if (item.id === 'loop') {
                state.bindPrefix = '';
                const [
                    loopItem = DEFAULT_LOOP_NAME.ITEM,
                    loopIndex = DEFAULT_LOOP_NAME.INDEX
                ] = useProperties().getSchema()?.loopArgs || [];
                state.variables = [loopItem, loopIndex].reduce(
                    (variables, param) => ({ ...variables, [param]: param }),
                    {}
                );
            } else if (item.id === 'slotScope') {
                state.bindPrefix = '';
                const params = getJsSlotParams();
                state.variables = params.reduce(
                    (variables, param) => ({ ...variables, [param]: param }),
                    {}
                );
            } else {
                state.bindPrefix = CONSTANTS.STATE;
                state.variables = getSchema()?.[item.id];
            }
        };

        return {
            editorDidMount,
            editorOptions,
            variableClick,
            remove,
            cancel,
            confirm,
            dialogShouldInitialize,
            open,
            selectItem,
            state,
            editor,
            isDataSource,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.icon {
    margin-left: 8px;
}

.meta-bind-variable-dialog-box {
    .header-alert {
        margin-top: 0;
        margin-bottom: 12px;
    }

    .bind-dialog-content {
        display: flex;
        align-items: center;

        .content-left {
            margin-right: 12px;
            width: 38%;

            .content-left__title {
                color: var(--te-configurator-common-text-color-primary);
            }

            .list-wrap {
                border: 1px solid
                    var(--te-configurator-common-border-color-divider);
                border-radius: 4px;
                height: 300px;
                margin-top: 8px;
                display: flex;
            }

            .content-left__list {
                width: 120px;
                color: var(--te-configurator-common-text-color-secondary);
                border-right: 1px solid
                    var(--te-configurator-common-border-color-divider);
            }

            .content-left__list-item {
                padding: 8px 12px;
                cursor: pointer;
                transition: background 0.3s;
                &.active,
                &:hover {
                    background: var(--te-configurator-common-bg-color-hover);
                    color: var(--te-configurator-common-text-color-primary);
                }
            }

            .item-selected {
                background-color: var(--te-configurator-common-bg-color-active);
            }

            .item-text {
                padding: 8px 12px;
                cursor: pointer;
                color: var(--te-configurator-common-text-color-secondary);

                &:hover {
                    background-color: var(
                        --te-configurator-common-bg-color-hover
                    );
                    color: var(--te-configurator-common-text-color-primary);
                }
            }

            .content-left__title {
                font-weight: 600;
            }

            .item-content {
                padding: 12px;
                width: calc(100% - 140px);

                .item-content-list {
                    height: calc(100% - 42px);
                    overflow-y: auto;
                }
            }
        }

        .content-right {
            flex: 1 1 0;
            width: 60%;
            .content-detail-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .header-name {
                    display: flex;
                    align-items: center;
                }
            }

            .content-right__title {
                color: var(--te-configurator-common-text-color-primary);
                font-weight: 600;
                margin-right: 5px;
            }

            .state-preview {
                margin-top: 5px;
            }

            .content-wrap {
                height: 300px;
                margin-top: 8px;
                box-sizing: border-box;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .top {
                    width: 100%;
                    height: 54%;
                    border-radius: 4px;
                    padding: 12px 8px;
                    color: var(--te-configurator-common-text-color-primary);
                    border: 1px solid
                        var(--te-configurator-common-border-color-divider);
                    box-sizing: border-box;
                    & > div {
                        height: 100%;
                        width: 100%;
                    }
                    .datasource-poll-wrap {
                        display: flex;
                        align-items: center;
                        height: 24px;
                        margin-top: 12px;
                        .datasource-poll-interval {
                            margin-left: 16px;
                            .tiny-input {
                                width: 120px;
                                height: 20px;
                                margin: 0 8px;
                            }
                        }
                    }
                }

                .poll-top {
                    & > div {
                        height: calc(100% - 36px);
                        width: 100%;
                    }
                }

                .bottom {
                    width: 100%;
                    height: 40%;
                    padding: 8px 12px;
                    border-radius: 4px;
                    box-sizing: border-box;
                    overflow: auto;
                    color: var(--te-configurator-common-text-color-secondary);
                    border: 1px solid
                        var(--te-configurator-common-border-color-divider);
                    pre {
                        font-family: consolas;
                    }
                    .bottom-title {
                        font-weight: var(--te-base-font-weight-6);
                        color: var(--te-configurator-common-text-color-primary);
                    }
                }
            }
        }
    }

    .bind-dialog-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
}
</style>
