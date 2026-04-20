import type {
    RootStateBag,
    SchemaNode
} from '@/plugins/materials/composable/schema-default-patches/types';
import { patchMpIconIconTagToChild } from './strategies/mpIcon';
import { syncMpBankInputModelValueAndState } from './strategies/mpBankInput';
import { syncMpCityInputModelValueAndState } from './strategies/mpCityInput';
import { syncMpCountryInputModelValueAndState } from './strategies/mpCountryInput';
import { syncMpDictInputModelValueAndState } from './strategies/mpDictInput';
import { syncMpMobileInputModelValueAndState } from './strategies/mpMobileInput';
import { syncMpMultiAmtModelPropsAndState } from './strategies/mpMultiAmt';
import { syncMpTagsModelValueAndState } from './strategies/mpTags';
import { syncMpTextareaModelValueAndState } from './strategies/mpTextarea';
import { syncMrCheckboxGroupModelValueAndState } from './strategies/mrCheckboxGroup';
import { syncMrCollapseModelValueAndState } from './strategies/mrCollapse';
import { syncMrFormModelValueAndState } from './strategies/mrForm';
import { syncMrRadioGroupModelValueAndState } from './strategies/mrRadioGroup';
import { syncMrSwitchModelValueAndState } from './strategies/mrSwitch';
import { syncMrToggleModelValueAndState } from './strategies/mrToggle';

type ModelBindingPatcher = (
    schema: SchemaNode,
    rootState: RootStateBag
) => void;

const PATCHERS: Record<string, ModelBindingPatcher> = {
    /* eslint-disable @typescript-eslint/naming-convention -- 组件名键必须与 schema componentName 对齐 */
    MpIcon: patchMpIconIconTagToChild,
    'mp-icon': patchMpIconIconTagToChild,
    MpBankInput: (schema, rootState) => {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        syncMpBankInputModelValueAndState(props, rootState);
    },
    MpCityInput: (schema, rootState) => {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        syncMpCityInputModelValueAndState(props, rootState);
    },
    MpCountryInput: (schema, rootState) => {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        syncMpCountryInputModelValueAndState(props, rootState);
    },
    MpDictInput: (schema, rootState) => {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        syncMpDictInputModelValueAndState(props, rootState);
    },
    MpMobileInput: (schema, rootState) => {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        syncMpMobileInputModelValueAndState(props, rootState);
    },
    MpMultiAmt: (schema, rootState) => {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        syncMpMultiAmtModelPropsAndState(props, rootState);
    },
    MpTextarea: (schema, rootState) => {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        syncMpTextareaModelValueAndState(props, rootState);
    },
    MpTags: (schema, rootState) => {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        syncMpTagsModelValueAndState(props, rootState);
    },
    MrSwitch: (schema, rootState) => {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        syncMrSwitchModelValueAndState(props, rootState);
    },
    MrToggle: (schema, rootState) => {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        syncMrToggleModelValueAndState(props, rootState);
    },
    MrForm: (schema, rootState) => {
        syncMrFormModelValueAndState(schema as Record<string, unknown>, rootState);
    },
    MrCollapse: (schema, rootState) => {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        syncMrCollapseModelValueAndState(props, rootState);
    },
    MrRadioGroup: (schema, rootState) => {
        syncMrRadioGroupModelValueAndState(
            schema as Record<string, unknown>,
            rootState
        );
    },
    MrCheckboxGroup: (schema, rootState) => {
        const props = (schema.props as Record<string, unknown>) || {};
        if (!schema.props) schema.props = props;
        syncMrCheckboxGroupModelValueAndState(props, rootState);
    }
};
/* eslint-enable @typescript-eslint/naming-convention */

/** 保存/预览前：把常量 modelValue 等改写为 this.state.xxx（与拖拽落盘 external-drop-handlers 配套） */
export function applyModelBindingSchemaPatch(
    componentName: string | undefined,
    schema: SchemaNode,
    rootState: RootStateBag
): void {
    if (!componentName) return;
    const run = PATCHERS[componentName];
    if (run) run(schema, rootState);
}

export { applyGenerateNodeModelPatches } from '@/plugins/materials/composable/schema-default-patches/generateNodePatches';
