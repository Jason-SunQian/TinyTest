import type { RootStateBag, SchemaNode } from './types';
import { patchMrCheckboxGroupModelBinding } from './mrCheckboxGroup';
import { patchMrCollapseModelBinding } from './mrCollapse';
import { patchMrFormModelBinding } from './mrForm';
import { patchMrRadioGroupModelBinding } from './mrRadioGroup';
import { patchMrSwitchModelBinding } from './mrSwitch';
import { patchMrToggleModelBinding } from './mrToggle';
import { patchMpIconIconTagToChild } from './mpIcon';
import { patchMpBankInputModelBinding } from './mpBankInput';
import { patchMpCityInputModelBinding } from './mpCityInput';
import { patchMpCountryInputModelBinding } from './mpCountryInput';
import { patchMpDictInputModelBinding } from './mpDictInput';
import { patchMpMobileInputModelBinding } from './mpMobileInput';
import { patchMpTextareaModelBinding } from './mpTextarea';
import { patchMpTagsModelBinding } from './mpTags';

type ModelBindingPatcher = (
    schema: SchemaNode,
    rootState: RootStateBag
) => void;

const PATCHERS: Record<string, ModelBindingPatcher> = {
    /* eslint-disable @typescript-eslint/naming-convention -- 组件名键必须与 schema componentName 对齐 */
    MpIcon: patchMpIconIconTagToChild,
    'mp-icon': patchMpIconIconTagToChild,
    MpBankInput: patchMpBankInputModelBinding,
    MpCityInput: patchMpCityInputModelBinding,
    MpCountryInput: patchMpCountryInputModelBinding,
    MpDictInput: patchMpDictInputModelBinding,
    MpMobileInput: patchMpMobileInputModelBinding,
    MpTextarea: patchMpTextareaModelBinding,
    MpTags: patchMpTagsModelBinding,
    MrSwitch: patchMrSwitchModelBinding,
    MrToggle: patchMrToggleModelBinding,
    MrForm: patchMrFormModelBinding,
    MrCollapse: patchMrCollapseModelBinding,
    MrRadioGroup: patchMrRadioGroupModelBinding,
    MrCheckboxGroup: patchMrCheckboxGroupModelBinding
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

export { applyGenerateNodeModelPatches } from './generateNodePatches';
