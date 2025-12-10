<!-- eslint-disable vue/multi-word-component-names, vue/html-self-closing, vue/require-typed-object-prop -->
<template>
    <div class="toolbar-preview">
        <toolbar-base
            :content="t('designer.toolbar.preview')"
            :icon="options.icon?.default || options?.icon"
            :options="options"
            @click-api="preview"
        />
    </div>
</template>

<script lang="ts">
/* metaService: engine.toolbars.preview.Main */
import { previewPage } from '@opentiny/tiny-engine-common/js/preview';
import {
    useLayout,
    useNotify,
    getOptions
} from '@opentiny/tiny-engine-meta-register';
import { ToolbarBase } from '@opentiny/tiny-engine-common';

import { useDesignerI18n } from '../../services/i18nService';
import {
    goPreview,
    checkIsVSCodeEnvironment
} from '../../composable/useVSCodeBridge';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ToolbarBase
    },
    props: {
        options: {
            // eslint-disable-next-line vue/require-typed-object-prop
            type: Object,
            default: () => ({})
        }
    },
    // eslint-disable-next-line vue/component-api-style
    setup() {
        // 统一的国际化钩子：t、locale均可用
        const { t } = useDesignerI18n();

        const preview = async () => {
            const metaId = 'engine.toolbars.preview';
            const { beforePreview, previewMethod, afterPreview } =
                getOptions(metaId);

            try {
                if (typeof beforePreview === 'function') {
                    await beforePreview();
                }

                if (typeof previewMethod === 'function') {
                    const stop = await previewMethod();

                    if (stop) {
                        return;
                    }
                }
            } catch (error) {
                useNotify({
                    type: 'error',
                    message: `Error in previewing: ${error}`
                });
            }

            if (useLayout().isEmptyPage()) {
                useNotify({
                    type: 'warning',
                    message: t('designer.common.createPageFirst')
                });

                return;
            }

            // 检测是否在 VSCode 环境中
            const isVSCode = checkIsVSCodeEnvironment();

            // VSCode 环境下，使用 goPreview 由插件发起预览
            if (isVSCode) {
                goPreview((success, error) => {
                    if (!success) {
                        useNotify({
                            type: 'error',
                            message:
                                error?.message ||
                                t('designer.vscode.previewFailed')
                        });
                    } else {
                        // 预览成功，可以添加成功提示（如果需要）
                        // eslint-disable-next-line no-console
                        console.log(
                            '[Preview] Preview opened successfully in VSCode'
                        );
                    }
                });
                return;
            }

            // 非 VSCode 环境，使用原有预览方式
            previewPage();

            if (typeof afterPreview === 'function') {
                try {
                    await afterPreview();
                } catch (error) {
                    useNotify({
                        type: 'error',
                        message: `Error in afterPreview: ${error}`
                    });
                }
            }
        };

        return {
            preview,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.toolbar-preview {
    // 可以添加自定义样式
}
</style>
