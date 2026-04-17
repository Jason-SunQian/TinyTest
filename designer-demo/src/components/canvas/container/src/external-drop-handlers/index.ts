import type { Node } from '@/components/canvas/types';

import type { ExternalDropHandler, ExternalDropServices } from './types';
import { handleMrCheckboxGroupExternalDrop } from './handlers/mrCheckboxGroup';
import { handleMrCollapseExternalDrop } from './handlers/mrCollapse';
import { handleMrFormExternalDrop } from './handlers/mrForm';
import { handleMrRadioGroupExternalDrop } from './handlers/mrRadioGroup';
import { handleMrSwitchExternalDrop } from './handlers/mrSwitch';
import { handleMrToggleExternalDrop } from './handlers/mrToggle';
import { handleMpBankInputExternalDrop } from './handlers/mpBankInput';
import { handleMpCityInputExternalDrop } from './handlers/mpCityInput';
import { handleMpCountryInputExternalDrop } from './handlers/mpCountryInput';
import { handleMpDictInputExternalDrop } from './handlers/mpDictInput';
import { handleMpTextareaExternalDrop } from './handlers/mpTextarea';
import { handleMpTagsExternalDrop } from './handlers/mpTags';

/* eslint-disable @typescript-eslint/naming-convention -- 组件名键必须与物料 componentName 对齐 */
const HANDLERS: Record<string, ExternalDropHandler> = {
    MrSwitch: handleMrSwitchExternalDrop,
    MrToggle: handleMrToggleExternalDrop,
    MrForm: handleMrFormExternalDrop,
    MrCollapse: handleMrCollapseExternalDrop,
    MrRadioGroup: handleMrRadioGroupExternalDrop,
    MrCheckboxGroup: handleMrCheckboxGroupExternalDrop,
    MpBankInput: handleMpBankInputExternalDrop,
    MpCityInput: handleMpCityInputExternalDrop,
    MpCountryInput: handleMpCountryInputExternalDrop,
    MpDictInput: handleMpDictInputExternalDrop,
    MpTextarea: handleMpTextareaExternalDrop,
    MpTags: handleMpTagsExternalDrop
};
/* eslint-enable @typescript-eslint/naming-convention */

/**
 * 外部拖入节点已合并 generateNode 默认 props 后调用；按组件名执行对应 v-model/state 注入。
 */
export function applyExternalDropComponentPatch(
    insertData: Node,
    services: ExternalDropServices
): void {
    const name = insertData.componentName;
    if (!name) return;
    const run = HANDLERS[name];
    if (run) run(insertData, services);
}

export type { ExternalDropServices } from './types';
