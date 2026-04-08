import type { RootStateBag, SchemaNode } from './types';
import { patchMrCheckboxGroupModelBinding } from './mrCheckboxGroup';
import { patchMrCollapseModelBinding } from './mrCollapse';
import { patchMrFormModelBinding } from './mrForm';
import { patchMrRadioGroupModelBinding } from './mrRadioGroup';
import { patchMrSwitchModelBinding } from './mrSwitch';
import { patchMrToggleModelBinding } from './mrToggle';
import { patchMpTagsModelBinding } from './mpTags';

type ModelBindingPatcher = (
    schema: SchemaNode,
    rootState: RootStateBag
) => void;

const PATCHERS: Record<string, ModelBindingPatcher> = {
    MpTags: patchMpTagsModelBinding,
    MrSwitch: patchMrSwitchModelBinding,
    MrToggle: patchMrToggleModelBinding,
    MrForm: patchMrFormModelBinding,
    MrCollapse: patchMrCollapseModelBinding,
    MrRadioGroup: patchMrRadioGroupModelBinding,
    MrCheckboxGroup: patchMrCheckboxGroupModelBinding
};

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
