/* eslint-disable max-lines */
<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/max-lines-per-block, vue/no-root-v-if, @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention, new-cap, vue/require-typed-object-prop, @typescript-eslint/prefer-destructuring, no-inline-comments, line-comment-position, vue/html-self-closing, vue/attributes-order, vue/attribute-hyphenation, vue/v-on-event-hyphenation, no-param-reassign, object-shorthand, @typescript-eslint/restrict-plus-operands, prefer-template, @typescript-eslint/no-shadow, vue/block-lang -->
<template>
    <div
        v-if="!property.hidden"
        :key="property"
        :style="{ width: property.cols / 0.12 + '%' }"
        :class="[
            'properties-item',
            {
                active: property === currentProperty
            }
        ]"
    >
        <div
            :class="[
                'item-warp',
                labelPosition,
                property.className,
                { multiType }
            ]"
        >
            <div v-if="showLabel" :class="['item-label', { linked: isLinked }]">
                <tiny-popover
                    placement="top"
                    title=""
                    trigger="hover"
                    popper-class="prop-label-tips-container"
                    :open-delay="500"
                    :disabled="
                        !propDescription || propDescription === propLabel
                    "
                >
                    <div class="prop-content">
                        <div class="prop-title">{{ property.property }}</div>
                        <div class="prop-description">
                            {{ propDescription }}
                        </div>
                    </div>
                    <template #reference>
                        <div>
                            <div
                                :class="[
                                    {
                                        'pro-underline':
                                            propDescription &&
                                            propDescription !== propLabel
                                    }
                                ]"
                            >
                                <span>{{ propLabel }}</span>
                            </div>
                        </div>
                    </template>
                </tiny-popover>
            </div>
            <div class="item-input">
                <slot name="prefix"></slot>
                <div
                    :class="[
                        'widget',
                        {
                            'verify-failed': verification.failed
                        }
                    ]"
                >
                    <div
                        v-if="showBindState"
                        class="binding-state text-ellipsis-multiple"
                    >
                        {{
                            t('designer.settings.props.inlineBound', {
                                value: widget.props.modelValue?.value || ''
                            })
                        }}
                    </div>
                    <component
                        v-else
                        :is="component"
                        v-show="!hidden"
                        v-bind="widget.props"
                        :model-value="bindValue"
                        :language="currentLanguage"
                        :meta="property"
                        :label="propLabel"
                        :metaComponents="metaComponents"
                        @update:modelValue="onModelUpdate"
                        @focus="handleFocus"
                        @blur="handleBlur"
                    ></component>
                    <div v-if="showErrorPopup" class="error-tips-container">
                        <svg-icon
                            name="notify-failure"
                            class="error-icon"
                        ></svg-icon>
                        <span class="error-desc">{{
                            verification.message
                        }}</span>
                    </div>
                </div>

                <div class="action-icon">
                    <slot name="suffix"></slot>
                    <component
                        :is="CodeConfigurator"
                        v-if="showCodeEditIcon"
                        ref="editorModalRef"
                        v-bind="widget.props"
                        :model-value="bindValue"
                        :meta="property"
                        :label="propLabel"
                        language="json"
                        @update:modelValue="onModelUpdate"
                    >
                        <template #default>
                            <tiny-tooltip
                                class="item"
                                effect="light"
                                :content="
                                    locale.value === 'en_US'
                                        ? 'Source Code Edit'
                                        : '源码编辑'
                                "
                                placement="left"
                            >
                                <icon-writing
                                    class="code-icon"
                                    @click="
                                        editorModalRef?.open &&
                                            editorModalRef.open()
                                    "
                                ></icon-writing>
                            </tiny-tooltip>
                        </template>
                    </component>
                    <component
                        :is="VariableConfigurator"
                        v-if="
                            isTopLayer &&
                            !onlyEdit &&
                            property.bindState !== false &&
                            !isRelatedComponents(widget.component)
                        "
                        :model-value="widget.props.modelValue"
                        :name="widget.props.name"
                        @update:modelValue="onModelUpdate"
                    ></component>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- eslint-disable vue/block-lang, vue/require-explicit-emits, vue/component-api-style, max-lines -->
<!-- eslint-disable-next-line vue/max-lines-per-block -->
<script lang="ts">
import { inject, computed, watch, ref, reactive, provide } from 'vue';
import { Popover, Tooltip } from '@opentiny/vue';
import {
    IconWriting,
    IconHelpCircle,
    IconPlusCircle
} from '@opentiny/vue-icon';
import { typeOf } from '@opentiny/vue-renderless/common/type';
import {
    useHistory,
    useProperties,
    useMaterial,
    useLayout,
    useCanvas,
    getConfigurator
} from '@opentiny/tiny-engine-meta-register';
import { utils } from '@opentiny/tiny-engine-utils';
import {
    SCHEMA_DATA_TYPE,
    PAGE_STATUS,
    TYPES
} from '@opentiny/tiny-engine-common/js/constants';

// MultiTypeSelector 是内部组件，未从包入口导出
// 使用组件名（假设已通过 injectGlobalComponents 全局注册）

import { useDesignerI18n } from '@/services/i18nService';
import {
    getLocalizedText,
    getNestedLocalizedText,
    formatPropertyName,
    containsChinese,
    translateChinesePropertyName
} from '@/utils/i18nHelper';

const { parseFunction: generateFunction } = utils;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hasRule = (required: any, rules: string | any[]) => {
    if (required) {
        return true;
    }
    return Array.isArray(rules) && rules.length > 0;
};

export default {
    // eslint-disable-next-line vue/component-definition-name-casing, vue/multi-word-component-names
    name: 'ConfigItem',
    components: {
        // MultiTypeSelector 使用组件名，如果已全局注册
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyPopover: Popover,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTooltip: Tooltip,
        // eslint-disable-next-line @typescript-eslint/naming-convention, new-cap
        IconWriting: IconWriting(),
        // eslint-disable-next-line @typescript-eslint/naming-convention, new-cap
        IconPlusCircle: IconPlusCircle(),
        // eslint-disable-next-line @typescript-eslint/naming-convention, new-cap
        IconHelpCircle: IconHelpCircle()
    },
    props: {
        properties: {
            // eslint-disable-next-line vue/require-typed-object-prop
            type: [Array, Object],
            default: () => []
        },
        property: {
            // eslint-disable-next-line vue/require-typed-object-prop
            type: Object,
            default: () => ({})
        },
        isTopLayer: {
            // eslint-disable-next-line vue/require-typed-object-prop
            type: Boolean,
            default: false
        },
        onlyEdit: {
            // eslint-disable-next-line vue/require-typed-object-prop
            type: Boolean,
            default: false
        },
        group: {
            // eslint-disable-next-line vue/require-typed-object-prop
            type: Object,
            default: () => ({})
        },
        metaComponents: {
            // eslint-disable-next-line vue/require-typed-object-prop
            type: Object,
            default: () => ({})
        },
        showMessageError: {
            // eslint-disable-next-line vue/require-typed-object-prop
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue'],
    // eslint-disable-next-line vue/component-api-style
    setup(props: Record<string, unknown>, { emit }) {
        // 使用国际化的 CodeConfigurator（已通过 configurators 注册覆盖）
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const CodeConfigurator = getConfigurator('CodeConfigurator');
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const VariableConfigurator = getConfigurator('VariableConfigurator');

        const { t, locale } = useDesignerI18n();

        const verification = reactive({
            failed: false,
            message: '',
            hasRule: computed(() =>
                hasRule(props.property?.required, props.property?.rules)
            )
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const editorModalRef = ref<any>(null);
        const currentProperty = inject('currentProperty', null);
        const propsObj = inject('propsObj', null);
        const required = computed(() => props.property?.required || false);

        const hidden = computed(() => props.hidden);
        const widget = computed(() => props.property?.widget || {});

        // 修复 propLabel 计算逻辑，对齐原始实现但支持英文不回退到中文
        // 原始逻辑：label.text[locale] || label.text || property
        const propLabel = computed(() => {
            const labelObj = props.property?.label;
            const currentLang = locale.value;
            const propertyName = props.property.property || '';

            // 1. 优先使用 label.text[currentLang]
            if (labelObj?.text?.[currentLang]) {
                return labelObj.text[currentLang];
            }

            // 2. 如果 label.text 是字符串
            if (typeof labelObj?.text === 'string') {
                // 英文环境下，如果是中文，尝试使用映射表翻译
                if (currentLang === 'en_US' && containsChinese(labelObj.text)) {
                    const translated = translateChinesePropertyName(
                        labelObj.text
                    );
                    if (translated) {
                        return translated;
                    }
                    // 如果映射表没有，使用格式化的 property 名称
                    return propertyName
                        ? formatPropertyName(propertyName, currentLang)
                        : '';
                }
                return labelObj.text;
            }

            // 3. 英文环境下，如果 label.text 是对象但没有 en_US，尝试使用映射表翻译
            if (currentLang === 'en_US') {
                if (labelObj?.text?.zh_CN) {
                    const translated = translateChinesePropertyName(
                        labelObj.text.zh_CN
                    );
                    if (translated) {
                        return translated;
                    }
                }
                // 如果映射表没有，返回格式化的 property 名称
                return propertyName
                    ? formatPropertyName(propertyName, currentLang)
                    : '';
            }

            // 4. 中文环境下，可以回退到中文
            if (currentLang === 'zh_CN') {
                if (labelObj?.text?.zh_CN) {
                    return labelObj.text.zh_CN;
                }
                if (typeof labelObj?.text === 'object' && labelObj.text) {
                    // 如果 label.text 是对象，尝试获取第一个值
                    // eslint-disable-next-line @typescript-eslint/prefer-destructuring
                    const firstKey = Object.keys(labelObj.text)[0];
                    if (firstKey && labelObj.text[firstKey]) {
                        return labelObj.text[firstKey];
                    }
                }
            }

            // 5. 最后回退到 property 名称（原始逻辑）
            // 英文环境下，如果 property 名称是中文，返回空字符串
            if (propertyName) {
                if (currentLang === 'en_US' && containsChinese(propertyName)) {
                    return '';
                }
                return formatPropertyName(propertyName, currentLang);
            }

            return '';
        });

        const multiType = computed(() => Array.isArray(widget.value.component));
        // 当前是否是绑定到状态变量state
        const isBindingState = ref(false);
        const showCodeEditIcon = computed(
            () =>
                props.isTopLayer &&
                isBindingState.value === false &&
                (multiType.value ||
                    ['array', 'object'].includes(props.property.type))
        );
        const showLabel = computed(
            () =>
                !props.onlyEdit &&
                propLabel.value &&
                (isBindingState.value ||
                    ![
                        'GroupItemConfigurator',
                        'ArrayItemConfigurator',
                        'RelatedColumnsConfigurator',
                        'TableColumnsConfigurator'
                    ].includes(widget.value.component)) &&
                !multiType.value
        );

        // 修复 propDescription 计算逻辑
        // 注意：对于 description（提示信息），允许回退到中文，因为这是帮助信息
        const propDescription = computed(() => {
            const currentLang = locale.value;

            // 优先使用 description
            // eslint-disable-next-line no-inline-comments, line-comment-position
            if (props.property?.description) {
                // 先尝试获取当前语言的翻译
                let desc = getLocalizedText(
                    props.property.description,
                    currentLang
                );

                // 如果当前是英文但没有英文翻译，允许回退到中文（仅用于 description 提示）
                if (
                    !desc &&
                    currentLang === 'en_US' &&
                    typeof props.property.description === 'object'
                ) {
                    desc = props.property.description.zh_CN || '';
                }

                if (desc) {
                    return desc;
                }
            }

            // 回退到 label.text
            if (props.property?.label?.text) {
                const labelText = getNestedLocalizedText(
                    props.property.label,
                    currentLang
                );
                // 如果当前是英文但没有英文翻译，允许回退到中文（仅用于 description 提示）
                if (
                    !labelText &&
                    currentLang === 'en_US' &&
                    props.property.label?.text
                ) {
                    if (
                        typeof props.property.label.text === 'object' &&
                        props.property.label.text.zh_CN
                    ) {
                        return props.property.label.text.zh_CN;
                    }
                    if (
                        typeof props.property.label.text === 'string' &&
                        containsChinese(props.property.label.text)
                    ) {
                        return props.property.label.text;
                    }
                }
                return labelText;
            }

            return '';
        });

        const isLinked = computed(() => Boolean(props.property.linked));
        const component = computed(() => {
            // TODO: 需要弄清楚 props.metaComponents[widget.value.component] 是什么场景
            // 使用组件名（假设已全局注册）
            return multiType.value
                ? 'MultiTypeSelector'
                : getConfigurator(widget.value.component) ||
                      props.metaComponents[widget.value.component] ||
                      getConfigurator('InputConfigurator');
        });
        const bindValue = computed(() => {
            let value = props.property?.widget?.props?.modelValue;
            // locale 现在是 computed，locale.value 直接是字符串
            const currentLang = locale.value;

            if (value === null || value === undefined) {
                const defaultValue = props.property?.defaultValue;
                // 使用工具函数处理默认值的多语言
                if (defaultValue && typeof defaultValue === 'object') {
                    value =
                        getLocalizedText(defaultValue, currentLang) ||
                        defaultValue;
                } else {
                    value = defaultValue;
                }
            }

            if (value?.componentName === 'Icon') {
                value = value.props.name;
            }

            return value;
        });

        const currentLanguage = computed(() => {
            const language = props.property?.widget?.props?.language;
            const defaultLanguage =
                props.property?.description?.zh_CN === '分页配置' ||
                props.property?.type === 'Object'
                    ? 'json'
                    : 'javascript';

            return language || defaultLanguage;
        });

        const labelPosition = computed(() => {
            if (!showLabel.value) {
                return 'none';
            }

            if (props.property.labelPosition) {
                return props.property.labelPosition;
            }

            if (
                ['CheckBoxConfigurator', 'SwitchConfigurator'].includes(
                    props.property.widget?.component
                )
            ) {
                return 'left';
            }

            if (props.property.widget?.component === 'CodeConfigurator') {
                return 'top';
            }

            return 'auto';
        });

        const updateValue = (value: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type?: any;
            componentName?: string;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            props?: { name: any };
        }) => {
            const { property, type } = props.property;
            const { setProp, getSchema } = useProperties();

            // 是否双向绑定
            if (value?.type === SCHEMA_DATA_TYPE.JSExpression) {
                const schema = getSchema();
                // 安全检查：确保 schema 存在（VSCode 环境中可能为 null）
                if (schema?.componentName) {
                    const currentComponent = schema.componentName;
                    const material =
                        useMaterial().getMaterial(currentComponent);

                    // 安全检查：确保 material 存在
                    if (material?.schema?.events) {
                        const { events = {} } = material.schema;

                        if (
                            Object.keys(events).includes(`onUpdate:${property}`)
                        ) {
                            // 默认情况下，v-model 在组件上都是使用 modelValue 作为 prop，并以 update:modelValue 作为对应的事件。
                            // 支持指定参数的 v-model，如：`v-model:visible`，如果组件使用的是除 modelValue 之外的其它参数，则将该参数显式声明为 prop
                            const model =
                                property === 'modelValue'
                                    ? true
                                    : { prop: property };
                            // eslint-disable-next-line no-param-reassign
                            value = { ...value, model };
                        }
                    }
                }
            }

            const { operateNode, isSaved } = useCanvas();

            if (property === 'children') {
                const schema = getSchema();
                // 安全检查：确保 schema 存在
                if (schema?.id) {
                    // Slot text lives on node.children; panel reads props.children.
                    // Must update BOTH — Remove Binding used to only clear node.children,
                    // then slotChildrenPropsSync resurrected Bound from leftover props.children.
                    operateNode({
                        type: 'updateAttributes',
                        id: schema.id,
                        value: { children: value }
                    });
                    setProp('children', value, type);
                } else {
                    // eslint-disable-next-line no-console
                    console.warn(
                        '[ConfigItem] Cannot update children: schema is null or missing id'
                    );
                }
            } else {
                if (
                    !isSaved() &&
                    ![PAGE_STATUS.Guest, PAGE_STATUS.Occupy].includes(
                        useLayout().layoutState.pageStatus.state
                    )
                ) {
                    return;
                }

                if (
                    property !== 'name' &&
                    ['SelectIconConfigurator'].includes(
                        props.property.widget.component
                    )
                ) {
                    // icon以组件形式传入，实现类似:icon="IconPlus"的图标配置（排除Icon组件本身）
                    // eslint-disable-next-line no-param-reassign
                    value = {
                        componentName: 'Icon',
                        props: {
                            name: value
                        }
                    };
                }

                if (props.isTopLayer) {
                    setProp(property, value, type);
                }
            }

            useHistory().addHistory();
        };

        const setVerifyFailed = (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            result: { failed: any; message: any },
            message: string
        ) => {
            result.failed = true;
            // locale 现在是 computed，locale.value 直接是字符串
            const currentLang = locale.value;

            // 使用工具函数处理错误消息的多语言
            if (typeof message === 'string') {
                result.message = message;
            } else if (message && typeof message === 'object') {
                result.message = getLocalizedText(message, currentLang);
            } else {
                result.message = '';
            }
        };

        const isEmptyInputValue = (value: string | null) => {
            // 空值约定为 undefined | null | ''
            return (
                value === null ||
                value === undefined ||
                (typeOf(value) === TYPES.StringType && value.trim() === '')
            );
        };
        const verifyRequired = (value: string) => {
            return !isEmptyInputValue(value);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const verifyValue = (value = '', rules: any[] = []) => {
            const result = {
                failed: false,
                message: ''
            };

            if (!hasRule(props.property?.required, props.property?.rules)) {
                return result;
            }

            if (required.value && !verifyRequired(value)) {
                setVerifyFailed(result, t('common.required'));

                return result;
            }

            // eslint-disable-next-line @typescript-eslint/prefer-destructuring
            const length = rules.length;
            const { getProp } = useProperties();

            for (let i = 0; i < length; i++) {
                const rule = rules[i];
                if (rule.required && !verifyRequired(value)) {
                    setVerifyFailed(result, rule.message);
                    return result;
                }
                if (rule.pattern) {
                    const reg = new RegExp(rule.pattern);

                    if (!reg.test(value)) {
                        setVerifyFailed(result, rule.message);
                        break;
                    }
                } else if (rule.validator) {
                    try {
                        const fn = generateFunction(rule.validator, {
                            props: {
                                value
                            },
                            getProp
                        });

                        if (!fn(rule, value)) {
                            setVerifyFailed(result, rule.message);
                            break;
                        }
                    } catch (error) {
                        const printer = console;
                        printer.log(error);
                    }
                }
            }

            return result;
        };

        const executeRelationAction = (
            value: string | undefined,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            preValue: any
        ) => {
            const { onChange, rules } = props.property;
            const { setProp, delProp } = useProperties();

            // 关联
            if (onChange && propsObj) {
                try {
                    const fun = generateFunction(onChange, {
                        ...propsObj.value,
                        config: {
                            ...widget.value?.props
                        },
                        setProp,
                        delProp
                    });
                    fun(value, preValue);
                } catch (error) {
                    const printer = console;
                    printer.log(error);
                }
            }

            // 校验
            Object.assign(verification, verifyValue(value, rules));
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onModelUpdate = (data: any, shouldUpdate = true) => {
            const preValue = bindValue.value;
            widget.value.props.modelValue = data;
            emit('update:modelValue', data);
            if (!shouldUpdate) {
                return;
            }
            updateValue(data);
            executeRelationAction(data, preValue);
        };

        const parentPath = inject('path', '');
        const parentData = inject('data', null);
        provide(
            'path',
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, prefer-template
            `${parentPath ? parentPath + '.' : ''}${props.property.property}`
        );
        provide('data', useProperties().getSchema());

        watch(
            () => bindValue.value,
            value => {
                isBindingState.value =
                    value?.type === SCHEMA_DATA_TYPE.JSExpression;
            },
            {
                immediate: true
            }
        );

        const showErrorPopup = ref(false);

        const isFocus = ref(false);

        watch(
            () => [verification.failed, isFocus.value],
            () => {
                if (!verification.failed) {
                    showErrorPopup.value = false;
                    return;
                }

                showErrorPopup.value = true;
            }
        );

        const handleFocus = () => {
            isFocus.value = true;
        };

        const handleBlur = () => {
            isFocus.value = false;
            const onBlur = props.property?.onBlur;
            if (onBlur) {
                try {
                    const fun = generateFunction(onBlur, {});
                    fun(bindValue.value);
                } catch (error) {
                    /* empty */
                }
            }
        };

        // eslint-disable-next-line @typescript-eslint/no-shadow
        const isRelatedComponents = (component: string) =>
            [
                'RelatedEditorConfigurator',
                'RelatedColumnsConfigurator'
            ].includes(component);

        const showBindState = computed(
            () =>
                !props.onlyEdit &&
                (isBindingState.value || isLinked.value) &&
                !isRelatedComponents(widget.value.component)
        );

        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            CodeConfigurator,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            VariableConfigurator,
            verification,
            showCodeEditIcon,
            editorModalRef,
            isBindingState,
            component,
            hidden,
            widget,
            required,
            isLinked,
            propLabel,
            showLabel,
            multiType,
            propDescription,
            bindValue,
            currentProperty,
            showBindState,
            onModelUpdate,
            parentData,
            currentLanguage,
            showErrorPopup,
            handleFocus,
            handleBlur,
            isFocus,
            isRelatedComponents,
            labelPosition,
            t
        };
    }
};
</script>

<!-- eslint-disable-next-line vue/block-lang, vue/max-lines-per-block -->
<style lang="scss" scoped>
.sensitive-tip {
    width: 50px;
    position: absolute;
}
.properties-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
    align-items: center;
    padding-bottom: var(--te-common-vertical-item-spacing-normal);
    &:last-child {
        padding-bottom: 0;
    }
    &.active {
        background: var(--te-component-common-bg-color-active);
    }

    .item-label {
        color: var(--te-component-common-text-color-secondary);
        font-size: 12px;
        display: flex;
        line-height: 18px;
    }

    .item-input {
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        position: relative;
        overflow: visible;
        &:has(.verify-failed) {
            align-items: flex-start;
        }
        .widget {
            flex: 1;
            padding: 1px;
            overflow: hidden;

            .binding-state {
                color: var(--te-component-common-text-color-emphasize);
                background: var(--te-component-config-item-bind-bg-color);
                border: 1px solid
                    var(--te-component-config-item-bind-border-color);
                padding: 4px 12px;
                overflow: hidden;
                text-overflow: ellipsis;
                border-radius: 6px;
            }
            &:has(.tiny-switch) {
                text-align: right;
            }
            &.verify-failed {
                :deep(.tiny-input .tiny-input__inner) {
                    &,
                    &:focus {
                        border-color: var(--te-component-common-error-color);
                        background-color: var(
                            --te-component-common-bg-color-error
                        );
                    }
                }
                :deep(.tiny-textarea__inner) {
                    &,
                    &:focus {
                        background-color: var(
                            --te-component-common-bg-color-error
                        );
                    }
                }
                :deep(.tiny-textarea) {
                    &,
                    &:focus {
                        border-color: var(--te-component-common-error-color);
                        background-color: var(
                            --te-component-common-bg-color-error
                        );
                    }
                }
            }
            .widget-popover {
                display: inline-block;
                width: 100%;
            }
        }
        .action-icon {
            display: flex;
            align-items: center;
            .code-icon {
                font-size: 16px;
            }
        }
        :deep(.tiny-input__inner) {
            padding-right: 6px;
            padding-left: 4px;
        }
        :deep(.tiny-select .tiny-input__inner) {
            padding-right: 26px;
        }
        :deep(.tiny-input-suffix) {
            .tiny-input__inner {
                padding-right: 28px;
            }
        }
    }

    .prop-description {
        margin-top: 8px;
        color: var(--te-component-common-text-color-weaken);
    }
    .label-tip {
        padding: 2px 0;
    }

    .help-icon {
        margin-left: 3px;
        cursor: help;
        width: 14px;
        height: 14px;
    }

    .item-warp {
        display: flex;
        gap: 8px;
        width: 100%;

        .pro-underline {
            border-bottom: 1px dashed transparent;
            &:hover {
                border-bottom: 1px dashed;
            }
        }
        &.multiType {
            border-bottom: 1px solid
                var(--te-component-common-border-color-transparent);
            border-top: 1px solid
                var(--te-component-common-border-color-transparent);
        }
        &.auto {
            flex-wrap: wrap;
            align-items: center;
            .item-label {
                min-width: 30%;
            }
            .item-input {
                width: calc(70% - 8px);
                flex-grow: 1;
            }
        }
        &.left {
            flex-wrap: wrap;
            align-items: center;
            .item-label {
                width: 30%;
            }
            .item-input {
                width: calc(70% - 8px);
            }
        }
        &.top {
            flex-direction: column;
        }
        &.bottom {
            flex-direction: column-reverse;
        }
        &.none {
            .item-label {
                display: none;
            }
            .item-input {
                flex-grow: 1;
            }
        }
    }
    .error-tips {
        margin: 0;
        display: flex;
        align-items: center;
        margin-top: 8px;
        color: var(--te-component-common-error-color);
        font-size: 12px;
        .failure-icon {
            width: 16px;
            height: 16px;
        }
        .error-desc {
            margin-left: 4px;
        }
    }
}

.error-tips-container {
    padding: 4px 6px;
    color: var(--te-component-common-error-color);
    .error-icon {
        flex-shrink: 0;
    }
    .error-desc {
        margin-left: 4px;
    }
}
</style>

<!-- eslint-disable-next-line vue/block-lang -->
<style lang="scss">
.tiny-popover.tiny-popper {
    &.prop-label-tips-container {
        .prop-content {
            margin: 6px;
            max-width: 224px;

            .prop-title {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 8px;
                color: var(--te-component-common-text-color-primary);
            }
            .prop-description {
                font-size: 12px;
                color: var(--te-component-common-text-color-secondary);
                line-height: 18px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 5;
                overflow-y: auto;
            }
        }
    }
}
</style>
