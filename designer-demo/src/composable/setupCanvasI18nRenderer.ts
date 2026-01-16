/* eslint-disable import/order, @typescript-eslint/prefer-optional-chain, @typescript-eslint/init-declarations, no-cond-assign, max-depth, @typescript-eslint/max-params, no-else-return */
import { h } from 'vue';

import { useCanvas, useMessage } from '@opentiny/tiny-engine-meta-register';
import I18nCanvasEmpty from '@/components/canvas/CanvasEmpty.vue';

/**
 * 替换 VNode 中的 CanvasEmpty 组件
 * 只处理 CanvasEmpty 组件，不递归处理其他内容，避免影响 schema 渲染
 */
function replaceCanvasEmptyInVNode(
    vnode: unknown,
    i18nCanvasEmpty: unknown,
    text: string
): unknown {
    if (!vnode) return vnode;

    // 如果是数组，只处理数组中的 CanvasEmpty
    if (Array.isArray(vnode)) {
        return vnode.map(item => {
            // 只检查是否是 CanvasEmpty（通过 props.placeholderText）
            if (item?.props && 'placeholderText' in item.props) {
                return h(i18nCanvasEmpty, { placeholderText: text });
            }
            // 其他元素直接返回，不递归处理
            return item;
        });
    }

    // 检查是否是 CanvasEmpty 组件（通过 props.placeholderText）
    if (vnode.props && 'placeholderText' in vnode.props) {
        return h(i18nCanvasEmpty, { placeholderText: text });
    }

    // 不递归处理 children，避免影响其他 VNode 结构
    return vnode;
}

/**
 * DOM 文本替换器：将画布中的中文文本替换为英文
 */
function setupCanvasTextReplacer() {
    const replaceText = () => {
        try {
            // 直接获取英文翻译（通过 i18n 实例）
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const i18nInstance = (window as any).lowcodeI18n;
            let englishText = 'Drag components here';
            let analyzingText = 'Page analyzing...';

            if (i18nInstance?.global) {
                const originalLocale = i18nInstance.global.locale.value;
                // 临时切换到英文获取翻译
                i18nInstance.global.locale.value = 'en_US';
                englishText =
                    i18nInstance.global.t(
                        'designer.canvas.dragComponentHere'
                    ) || englishText;
                analyzingText =
                    i18nInstance.global.t('designer.canvas.pageAnalyzing') ||
                    analyzingText;
                // 恢复原语言
                i18nInstance.global.locale.value = originalLocale;
            }

            const canvasApi = useCanvas()?.canvasApi?.value;
            if (!canvasApi || typeof canvasApi.getDocument !== 'function') {
                return;
            }

            const doc = canvasApi.getDocument();
            if (!doc || !doc.body) return;

            // 需要替换的中文文本映射为英文
            const dragElementText =
                i18nInstance?.global?.t('designer.canvas.dragElementHere') ||
                'Please drag and drop elements here';
            const textMappings = [
                { chinese: '页面分析加载中', english: analyzingText },
                {
                    chinese: '从左侧面板拖入组件，以构建页面',
                    english: englishText
                },
                {
                    chinese: '从左侧面板拖入组件,以构建页面',
                    english: englishText
                },
                {
                    chinese: '请将元素拖放到这里',
                    english: dragElementText
                }
            ];

            // 查找 .container-tip 元素（CanvasPlaceholder 使用的类名）
            const containerTipElements = doc.querySelectorAll('.container-tip');
            containerTipElements.forEach((el: Element) => {
                const textContent = el.textContent?.trim();
                if (textContent === '请将元素拖放到这里') {
                    el.textContent = dragElementText;
                }
            });

            // 查找 .empty-text 元素
            const emptyTextElements = doc.querySelectorAll(
                'p.empty-text, .empty-text'
            );
            emptyTextElements.forEach((el: Element) => {
                if (el.textContent) {
                    for (const mapping of textMappings) {
                        if (el.textContent.includes(mapping.chinese)) {
                            el.textContent = mapping.english;
                            break;
                        }
                    }
                }
            });

            // 遍历所有文本节点进行替换
            const walker = doc.createTreeWalker(
                doc.body,
                NodeFilter.SHOW_TEXT,
                null
            );

            let node;
            while ((node = walker.nextNode())) {
                if (node.textContent) {
                    for (const mapping of textMappings) {
                        if (node.textContent.includes(mapping.chinese)) {
                            node.textContent = node.textContent.replace(
                                mapping.chinese,
                                mapping.english
                            );
                            break;
                        }
                    }
                }
            }
        } catch (error) {
            // 静默失败
        }
    };

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(() => {
        replaceText();
    });

    // 延迟启动，等待画布 iframe 加载完成
    const startObserving = () => {
        try {
            const canvasApi = useCanvas()?.canvasApi?.value;
            if (!canvasApi || typeof canvasApi.getDocument !== 'function') {
                setTimeout(startObserving, 200);
                return;
            }

            const doc = canvasApi.getDocument();
            if (!doc || !doc.body) {
                setTimeout(startObserving, 200);
                return;
            }

            observer.observe(doc.body, {
                childList: true,
                subtree: true,
                characterData: true
            });

            // 立即执行一次替换
            replaceText();

            // 持续检查，确保文本被替换
            let checkCount = 0;
            const maxChecks = 20;
            const interval = setInterval(() => {
                replaceText();
                checkCount++;
                if (checkCount >= maxChecks) {
                    clearInterval(interval);
                }
            }, 200);
        } catch (error) {
            // 静默失败
        }
    };

    setTimeout(startObserving, 300);
}

/**
 * 设置国际化的 Canvas Renderer
 * 用于将空画布的提示文字始终显示为英文
 */
export const setupCanvasI18nRenderer = () => {
    try {
        const { subscribe } = useMessage();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const setupRenderer = (canvasApi: any) => {
            try {
                if (
                    !canvasApi ||
                    typeof canvasApi.getRenderer !== 'function' ||
                    typeof canvasApi.setRenderer !== 'function'
                ) {
                    return false;
                }

                const defaultRenderer = canvasApi.getRenderer();
                if (!defaultRenderer || typeof defaultRenderer !== 'function') {
                    return false;
                }

                // 创建 renderer，始终返回英文文本
                /* eslint-disable @typescript-eslint/no-explicit-any */
                const i18nRenderer = (
                    schema: any,
                    refreshKey: any,
                    entry: any,
                    active: any,
                    isPage = true
                ) => {
                    // 强制使用英文翻译
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const i18nInstance = (window as any).lowcodeI18n;
                    let currentText = 'Drag components here';

                    if (i18nInstance?.global) {
                        const originalLocale = i18nInstance.global.locale.value;
                        i18nInstance.global.locale.value = 'en_US';
                        currentText =
                            i18nInstance.global.t(
                                'designer.canvas.dragComponentHere'
                            ) || currentText;
                        i18nInstance.global.locale.value = originalLocale;
                    }

                    // 直接判断是否需要显示空画布提示
                    if (!entry) {
                        const isEmpty = !schema.children?.length && active;
                        if (isEmpty) {
                            return [
                                h(I18nCanvasEmpty, {
                                    placeholderText: currentText
                                })
                            ];
                        }
                        const result: unknown = defaultRenderer(
                            schema,
                            refreshKey,
                            entry,
                            active,
                            isPage
                        );
                        return replaceCanvasEmptyInVNode(
                            result,
                            I18nCanvasEmpty,
                            currentText
                        );
                    } else {
                        if (!isPage && !schema.children?.length) {
                            return [
                                h(I18nCanvasEmpty, {
                                    placeholderText: currentText
                                })
                            ];
                        }
                        const result: unknown = defaultRenderer(
                            schema,
                            refreshKey,
                            entry,
                            active,
                            isPage
                        );
                        return replaceCanvasEmptyInVNode(
                            result,
                            I18nCanvasEmpty,
                            currentText
                        );
                    }
                };
                /* eslint-enable @typescript-eslint/no-explicit-any */

                // 设置自定义 renderer
                canvasApi.setRenderer(i18nRenderer);
                return true;
            } catch (error) {
                return false;
            }
        };

        // 监听 canvasReady 事件，在画布加载完成后设置 renderer
        subscribe({
            topic: 'canvasReady',
            subscriber: 'canvasI18nRenderer',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            callback: ({ detail }: any) => {
                if (detail && detail.setRenderer) {
                    setTimeout(() => {
                        setupRenderer(detail);
                        // 设置 DOM 文本替换器（作为兜底）
                        setupCanvasTextReplacer();
                    }, 50);
                }
            }
        });

        // 同时也尝试从 useCanvas 获取（作为兜底）
        setTimeout(() => {
            const canvasApi = useCanvas()?.canvasApi?.value;
            if (canvasApi) {
                setupRenderer(canvasApi);
                setupCanvasTextReplacer();
            }
        }, 200);
    } catch (error) {
        // 静默失败
    }
};
