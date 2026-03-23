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
<!-- eslint-disable-next-line -->
<script lang="ts">
 
/* metaService: engine.toolbars.preview.Main */
import { previewPage } from '@opentiny/tiny-engine-common/js/preview';
import { toRaw } from 'vue';
import {
    useLayout,
    useNotify,
    getOptions,
    useCanvas,
    useMaterial
} from '@opentiny/tiny-engine-meta-register';
import { ToolbarBase } from '@opentiny/tiny-engine-common';

import { useDesignerI18n } from '../../services/i18nService';
import {
    goPreview,
    checkIsVSCodeEnvironment
} from '../../composable/useVSCodeBridge';

export default {
    components: {
         
        ToolbarBase
    },
    props: {
        options: {
             
            type: Object,
            default: () => ({})
        }
    },
     
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

            // 检测是否在 VSCode 环境中
            const isVSCode = checkIsVSCodeEnvironment();

            // VSCode 环境下，使用 goPreview 由插件发起预览
            // 在 VSCode 环境中，优先检查实际的页面数据（currentPage 或 pageSchema），
            // 而不是依赖 isEmptyPage()，因为 pageStatus 可能还未正确设置
            if (isVSCode) {
                // 获取当前页面数据和 schema（与保存时相同）
                const { currentPage } = useCanvas().pageState;
                const rawPageSchema = useCanvas().getSchema();

                // 检查是否有可预览的内容：currentPage 或 pageSchema
                // 在 VSCode 环境中，即使 isEmptyPage() 返回 true，
                // 只要 currentPage 或 pageSchema 存在，就可以预览
                if (!currentPage && !rawPageSchema) {
                    useNotify({
                        type: 'warning',
                        message: t('designer.common.createPageFirst')
                    });
                    return;
                }

                // 如果有 pageSchema 但没有 currentPage.id，使用文件名或时间戳作为临时 ID
                const pageId = currentPage?.id || `temp_${Date.now()}`;

                // 序列化数据：去除 Vue 响应式包装和不可序列化的属性（函数、循环引用等）
                // 使用 JSON.parse(JSON.stringify()) 确保数据可以安全地通过 postMessage 传递
                 
                let pageSchema: any = null;
                 
                let pageData: any = null;

                try {
                    if (rawPageSchema) {
                        // 先使用 toRaw 去除响应式包装，再序列化
                        const rawSchema = toRaw(rawPageSchema);
                        const stringified = JSON.stringify(rawSchema);
                        if (stringified && stringified !== 'undefined') {
                            pageSchema = JSON.parse(stringified);
                            // 若当前环境有该方法则补全物料默认 props（插件环境下 meta-register 可能未暴露此方法，不依赖以免报错）
                            const materialApi = useMaterial();
                            if (typeof materialApi?.patchSchemaWithMaterialDefaults === 'function') {
                                materialApi.patchSchemaWithMaterialDefaults(pageSchema);
                            }
                        }
                    }

                    if (currentPage) {
                        // 同样处理 currentPage
                        const rawPage = toRaw(currentPage);
                        pageData = JSON.parse(JSON.stringify(rawPage));
                        if (pageSchema) {
                             
                            pageData.page_content = pageSchema;
                        }
                    } else if (pageSchema) {
                         
                        pageData = { page_content: pageSchema };
                    }
                } catch (error) {
                    // 序列化失败时不再传原始数据（含 Proxy/响应式会触发 postMessage DataCloneError），直接提示
                    // eslint-disable-next-line no-console
                    console.warn('[Preview] Failed to serialize data:', error);
                    useNotify({
                        type: 'error',
                        message:
                            (error instanceof Error ? error.message : String(error)) ||
                            t('designer.vscode.previewFailed')
                    });
                    return;
                }

                // 发送前再序列化一次，确保 payload 完全可克隆，避免 postMessage DataCloneError
                let payloadToSend: { pageId: string; pageSchema: any; pageData: any };
                try {
                    payloadToSend = JSON.parse(
                        JSON.stringify({ pageId, pageSchema, pageData })
                    );
                } catch (e) {
                    useNotify({
                        type: 'error',
                        message: t('designer.vscode.previewFailed')
                    });
                    return;
                }

                goPreview(
                    payloadToSend,
                    (success, error) => {
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
                    }
                );
                return;
            }

            // 非 VSCode 环境，使用原有预览方式
            // 在非 VSCode 环境中，使用 isEmptyPage() 判断
            if (useLayout().isEmptyPage()) {
                useNotify({
                    type: 'warning',
                    message: t('designer.common.createPageFirst')
                });

                return;
            }

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
