import type { Node } from '@/components/canvas/types';
import type {
    ExternalDropHandler,
    ExternalDropServices
} from '@/components/canvas/container/src/external-drop-handlers/types';
import { getClonedPageState } from '@/components/canvas/container/src/external-drop-handlers/utils';

import { syncMrCheckboxGroupModelValueAndState } from './strategies/mrCheckboxGroup';
import { applyMrCollapseExternalDropLoopDemo } from './strategies/mrCollapse';
import { buildMrFormExternalDropPatch } from './strategies/mrForm';
import { syncMrRadioGroupModelValueAndState } from './strategies/mrRadioGroup';
import { syncMrSwitchModelValueAndState } from './strategies/mrSwitch';
import { syncMrToggleModelValueAndState } from './strategies/mrToggle';
import { syncMpBankInputModelValueAndState } from './strategies/mpBankInput';
import { syncMpCityInputModelValueAndState } from './strategies/mpCityInput';
import { syncMpCountryInputModelValueAndState } from './strategies/mpCountryInput';
import { syncMpDictInputModelValueAndState } from './strategies/mpDictInput';
import { syncMpMobileInputModelValueAndState } from './strategies/mpMobileInput';
import { syncMpMultiAmtModelPropsAndState } from './strategies/mpMultiAmt';
import { syncMpSingleAmtModelPropsAndState } from './strategies/mpSingleAmt';
import { syncMpTagsModelValueAndState } from './strategies/mpTags';
import { syncMpTextareaModelValueAndState } from './strategies/mpTextarea';
import { syncMpPopupShowAndState } from './strategies/mpPopup';
import { syncMpDialogShowAndState } from './strategies/mpDialog';
import { syncMpDatePopupModelPropsAndState } from './strategies/mpDatePopup';
import { syncMpLinkedAccountInputModelValueAndState } from './strategies/mpLinkedAccountInput';
import { syncMpPinInputSimpleUidAndState } from './strategies/mpPinInputSimple';
import { syncMpPinInputUidAndState } from './strategies/mpPinInput';
import { syncMpCodeInputModelValueAndState } from './strategies/mpCodeInput';
import { syncMpBranchInputModelValueAndState } from './strategies/mpBranchInput';
import { syncMpUploaderModelPropsAndState } from './strategies/mpUploader';
import { syncMpMultiUploaderModelValueAndState } from './strategies/mpMultiUploader';
import { syncMpAccountCardsModelPropsAndState } from './strategies/mpAccountCards';
import { syncMpCcyInputModelValueAndState } from './strategies/mpCcyInput';
import { syncMpDictMultipleInputModelValueAndState } from './strategies/mpDictMultipleInput';
import { syncMpCountryMultipleInputModelValueAndState } from './strategies/mpCountryMultipleInput';
import { syncMpTransSummaryTransactionInfoAndState } from './strategies/mpTransSummary';

/* eslint-disable @typescript-eslint/naming-convention -- 组件名键必须与物料 componentName 对齐 */
const HANDLERS: Record<string, ExternalDropHandler> = {
    MrSwitch: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMrSwitchModelValueAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MrToggle: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMrToggleModelValueAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MrForm: (insertData, { getSchema, updateSchema }) => {
        const rootSchema = getSchema();
        const stateObj = getClonedPageState(getSchema);
        const schemaObj =
            rootSchema && typeof rootSchema === 'object'
                ? (rootSchema as { methods?: unknown })
                : null;
        const { nextState, nextMethods } = buildMrFormExternalDropPatch(
            insertData as Record<string, unknown>,
            stateObj,
            schemaObj?.methods
        );
        updateSchema({ state: nextState, methods: nextMethods });
    },
    MrCollapse: (insertData, { getSchema, updateSchema }) => {
        const stateObj = getClonedPageState(getSchema);
        applyMrCollapseExternalDropLoopDemo(
            insertData as Record<string, unknown>,
            stateObj
        );
        updateSchema({ state: stateObj });
    },
    MrRadioGroup: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const stateObj = getClonedPageState(getSchema);
        syncMrRadioGroupModelValueAndState(
            insertData as Record<string, unknown>,
            stateObj
        );
        updateSchema({ state: stateObj });
    },
    MrCheckboxGroup: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMrCheckboxGroupModelValueAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpBankInput: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpBankInputModelValueAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpCityInput: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpCityInputModelValueAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpCountryInput: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpCountryInputModelValueAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpDictInput: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpDictInputModelValueAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpMobileInput: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpMobileInputModelValueAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpMultiAmt: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        const applied = syncMpMultiAmtModelPropsAndState(props, stateObj);
        if (applied) {
            updateSchema({ state: stateObj });
        }
    },
    MpSingleAmt: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        const applied = syncMpSingleAmtModelPropsAndState(props, stateObj);
        if (applied) {
            updateSchema({ state: stateObj });
        }
    },
    MpTextarea: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpTextareaModelValueAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpTags: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpTagsModelValueAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpPopup: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpPopupShowAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpDialog: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpDialogShowAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpDatePopup: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        const applied = syncMpDatePopupModelPropsAndState(props, stateObj);
        if (applied) {
            updateSchema({ state: stateObj });
        }
    },
    MpLinkedAccountInput: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpLinkedAccountInputModelValueAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpPinInputSimple: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpPinInputSimpleUidAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpPinInput: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpPinInputUidAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpCodeInput: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpCodeInputModelValueAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpBranchInput: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpBranchInputModelValueAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpUploader: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        const applied = syncMpUploaderModelPropsAndState(props, stateObj);
        if (applied) {
            updateSchema({ state: stateObj });
        }
    },
    MpMultiUploader: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpMultiUploaderModelValueAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpAccountCards: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        const applied = syncMpAccountCardsModelPropsAndState(props, stateObj);
        if (applied) {
            updateSchema({ state: stateObj });
        }
    },
    MpCcyInput: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpCcyInputModelValueAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpDictMultipleInput: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpDictMultipleInputModelValueAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpCountryMultipleInput: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpCountryMultipleInputModelValueAndState(props, stateObj);
        updateSchema({ state: stateObj });
    },
    MpTransSummary: (insertData, { getSchema, updateSchema }) => {
        insertData.props = insertData.props || {};
        const props = insertData.props as Record<string, unknown>;
        const stateObj = getClonedPageState(getSchema);
        syncMpTransSummaryTransactionInfoAndState(props, stateObj);
        updateSchema({ state: stateObj });
    }
};
/* eslint-enable @typescript-eslint/naming-convention */

/**
 * 从物料面板拖入画布（外部拖入、无 sourceId）时，按组件名补 v-model / state 等演示语义。
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

export type { ExternalDropServices } from '@/components/canvas/container/src/external-drop-handlers/types';
