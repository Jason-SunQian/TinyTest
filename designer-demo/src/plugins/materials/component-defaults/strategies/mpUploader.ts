/**
 * MpUploader: defineModel() fileId + defineModel('name') fileName.
 * Bind this.state.mpUploaderFormN.{fileId,name} (both ''); never hardcode demo ids in snippet.
 */

import {
    allocateIndexedStateKey,
    isModelValueJsExpression
} from '@/composable/modelBindingShared';

const RE_FILE = /^this\.state\.(mpUploaderForm\d+)\.fileId$/;
const RE_NAME = /^this\.state\.(mpUploaderForm\d+)\.name$/;

function getExpr(prop: unknown): string | undefined {
    if (!isModelValueJsExpression(prop)) return undefined;
    const v = (prop as { value?: unknown }).value;
    return typeof v === 'string' ? v.trim() : undefined;
}

function isManaged(
    fileExpr: string | undefined,
    nameExpr: string | undefined
): boolean {
    if (fileExpr && !RE_FILE.test(fileExpr)) return false;
    if (nameExpr && !RE_NAME.test(nameExpr)) return false;
    return true;
}

function parseFormKey(
    fileExpr: string | undefined,
    nameExpr: string | undefined
): string | null {
    const keys = [
        fileExpr?.match(RE_FILE)?.[1],
        nameExpr?.match(RE_NAME)?.[1]
    ].filter(Boolean) as string[];
    if (!keys.length) return null;
    if (keys.some(k => k !== keys[0])) return null;
    return keys[0];
}

function ensureForm(rootState: Record<string, unknown>, formKey: string): void {
    const cur = rootState[formKey];
    if (!cur || typeof cur !== 'object' || Array.isArray(cur)) {
        rootState[formKey] = { fileId: '', name: '' };
        return;
    }
    const o = cur as Record<string, unknown>;
    if (!Object.prototype.hasOwnProperty.call(o, 'fileId')) o.fileId = '';
    if (!Object.prototype.hasOwnProperty.call(o, 'name')) o.name = '';
}

/**
 * @returns whether props were rewritten
 */
export function syncMpUploaderModelPropsAndState(
    props: Record<string, unknown>,
    rootState: Record<string, unknown>
): boolean {
    const fileExpr = getExpr(props.modelValue);
    const nameExpr = getExpr(props.name);

    if (!isManaged(fileExpr, nameExpr)) {
        return false;
    }

    let formKey = parseFormKey(fileExpr, nameExpr);
    if (!formKey) {
        formKey = allocateIndexedStateKey(rootState, 'mpUploaderForm');
    }
    ensureForm(rootState, formKey);

    props.modelValue = {
        type: 'JSExpression',
        value: `this.state.${formKey}.fileId`,
        model: true
    };
    props.name = {
        type: 'JSExpression',
        value: `this.state.${formKey}.name`,
        model: { prop: 'name' }
    };

    return true;
}
