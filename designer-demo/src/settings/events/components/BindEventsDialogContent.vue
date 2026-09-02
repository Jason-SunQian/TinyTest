<template>
    <div class="content-right">
        <div :class="['content-right-top', { 'tip-error': context.tipError }]">
            <div class="content-right-title">
                {{ t('designer.settings.events.dialog.methodName') }}
            </div>
            <tiny-input
                v-model="context.bindMethodInfo.name"
                :disabled="context.bindMethodInfo.type !== NEW_METHOD_TYPE"
                :class="[{ 'status-error': context.tipError }]"
                :placeholder="
                    t('designer.settings.events.dialog.methodNamePlaceholder')
                "
                @update:model-value="change"
            />
            <div class="new-action-tip">{{ context.tip }}</div>
        </div>
        <div
            :class="[
                'content-right-bottom',
                { 'tip-error': !context.isValidParams }
            ]"
        >
            <div class="content-right-title">
                <tiny-checkbox
                    v-model="context.enableExtraParams"
                    name="tiny-checkbox"
                    >{{
                        t('designer.settings.events.dialog.extraParams')
                    }}</tiny-checkbox>
                <div class="set-params-tip">
                    <div>
                        {{
                            t('designer.settings.events.dialog.extraParamsTip')
                        }}
                    </div>
                    {{
                        t(
                            'designer.settings.events.dialog.extraParamsExample',
                            { name: context.bindMethodInfo.name }
                        )
                    }}
                </div>
            </div>

            <div class="content-right-monaco">
                <monaco-editor
                    v-if="dialogVisible"
                    :value="context.editorContent"
                    :options="editorOptions"
                    class="monaco-editor"
                    @change="editorContentChange"
                />
                <div v-if="!context.enableExtraParams" class="mark" />
            </div>
            <div
                v-if="!context.isValidParams && context.enableExtraParams"
                class="params-tip"
            >
                {{ t('designer.settings.events.dialog.paramsTip') }}
            </div>
        </div>
    </div>
</template>
<!-- eslint-disable-next-line -->
<script>
/* metaService: engine.setting.event.BindEventsDialogContent */
import { VueMonaco } from '@opentiny/tiny-engine-common';
import { getMetaApi } from '@opentiny/tiny-engine-meta-register';
import { Input, Checkbox } from '@opentiny/vue';
import { inject } from 'vue';

import { SCRIPT_PLUGIN_ID } from '@/constants/plugin-ids';
import { useDesignerI18n } from '@/services/i18nService';

import {
    METHOD_TIPS_MAP,
    NEW_METHOD_TYPE,
    VALID_VARNAME_RE
} from './constants';

export default {
    components: {
        // eslint-disable-next-line
        MonacoEditor: VueMonaco,
        // eslint-disable-next-line
        TinyInput: Input,
        // eslint-disable-next-line
        TinyCheckbox: Checkbox
    },
    props: {
        dialogVisible: Boolean
    },
    // eslint-disable-next-line
    setup() {
        const { getMethodNameList } = getMetaApi(SCRIPT_PLUGIN_ID) || {};
        const { t } = useDesignerI18n();

        const context = inject('context');

        const editorOptions = {
            language: 'json',
            lineNumbers: false,
            minimap: {
                enabled: false
            }
        };

        const editorContentChange = content => {
            context.editorContent = content;
        };

        const validMethodNameEmpty = name => !name;

        const validMethodNameExist = name =>
            getMethodNameList?.().includes(name);

        const invalidMethodName = name => !VALID_VARNAME_RE.test(name);

        const change = value => {
            const validRules = [
                {
                    validator: validMethodNameEmpty,
                    tip: t(METHOD_TIPS_MAP.empty)
                },
                {
                    validator: validMethodNameExist,
                    tip: t(METHOD_TIPS_MAP.exist)
                },
                {
                    validator: invalidMethodName,
                    tip: t(METHOD_TIPS_MAP.ruleInvalid)
                }
            ];
            // eslint-disable-next-line
            for (let i = 0; i < validRules.length; i++) {
                const rule = validRules[i];
                if (rule.validator(value)) {
                    context.tipError = true;
                    context.tip = rule.tip;

                    // 若存在校验不通过的，则直接返回，不继续走下面的流程
                    return;
                }
            }
            context.tipError = false;
            context.tip = '';
        };

        return {
            // eslint-disable-next-line
            NEW_METHOD_TYPE,
            context,
            editorOptions,
            change,
            editorContentChange,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.content-right {
    width: 68%;

    .content-right-top {
        .new-action-tip {
            margin: 8px 0;
            color: var(--te-bind-event-dialog-tip-text-color);
        }
    }
    .content-right-bottom {
        .content-right-monaco {
            border: 1px solid
                var(--te-bind-event-dialog-content-right-monaco-border-color);
            overflow: hidden;
            position: relative;

            .monaco-editor {
                width: 100%;
                height: 216px;
                color: var(
                    --te-bind-event-dialog-content-right-monaco-text-color
                );
            }
            .mark {
                width: 100%;
                height: 216px;
                position: absolute;
                z-index: 1;
                top: 0;
            }
        }

        .params-tip {
            margin: 8px 0;
            color: var(--te-bind-event-dialog-danger-tip-text-color);
        }
    }
    .content-right-top .content-right-title,
    .content-right-bottom .content-right-title {
        margin-bottom: var(--te-common-vertical-item-spacing-normal);
        .set-params-tip {
            margin-top: 6px;
            font-weight: 400;
            color: var(--te-bind-event-dialog-tip-text-color);
        }
    }

    .tip-error {
        .content-right-monaco {
            border: 1px solid var(--te-bind-event-dialog-danger-border-color);
        }
        .params-tip,
        .new-action-tip {
            color: var(--te-bind-event-dialog-danger-tip-text-color);
        }
    }
}
</style>
