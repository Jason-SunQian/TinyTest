/**
 * Copyright (c) 2023 - present TinyEngine Authors.
 * Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.
 *
 * Use of this source code is governed by an MIT-style license.
 *
 * THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,
 * BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR
 * A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.
 *
 */

/* metaService: engine.plugins.state.js-common */
import { t } from '@/services/i18nService';

/**
 * Validate monaco editor required + syntax markers.
 * @param {Object} editor editor instance
 * @param {String} name form field label for messages
 * @param {Object} options { required?: boolean, language?: string }
 * @return {{ success: boolean, message?: string }}
 */
export const validateMonacoEditorData = (
    editor,
    name,
    { required, language = 'json' } = {}
) => {
    if (!editor?.getEditor || !editor.getValue) {
        return {
            success: false,
            message: t('designer.state.validateSystemError')
        };
    }

    const content = editor.getValue();
    if (required && !content) {
        return {
            success: false,
            message: t('designer.state.validateRequired', { name })
        };
    }

    const model = editor.getEditor().getModel();
    const uri = model.uri._formatted;
    const markers = editor.editor
        .getMonaco()
        .editor.getModelMarkers({ owner: language })
        .filter(({ resource: { _formatted } }) => _formatted === uri);
    const messages = markers.map(({ startLineNumber, startColumn, message }) =>
        t('designer.state.validateErrorLine', {
            line: startLineNumber,
            column: startColumn,
            message
        })
    );

    if (messages.length) {
        return {
            success: false,
            message: t('designer.state.validateSyntaxError', {
                name,
                messages: messages.join('\n')
            })
        };
    }

    return { success: true };
};
