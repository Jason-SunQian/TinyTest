/* eslint-disable max-lines, vue/max-lines-per-block */
<!-- eslint-disable vue/block-lang, vue/no-bare-strings-in-template, @typescript-eslint/naming-convention, vue/component-api-style, vue/html-self-closing, vue/attribute-hyphenation, import/order, vue/require-default-prop, vue/require-typed-object-prop, vue/require-typed-ref, default-case, vue/padding-line-between-blocks, @typescript-eslint/prefer-destructuring, @typescript-eslint/no-confusing-void-expression -->
<template>
    <div v-for="state in multiSelectedStates" :key="state.id">
        <canvas-action
            :hoverState="hoverState"
            :inactiveHoverState="inactiveHoverState"
            :selectState="state"
            :lineState="lineState"
            :windowGetClickEventTarget="target"
            :resize="canvasState.type === 'absolute'"
            :multiStateLength="multiStateLength"
            :isMultiDragging="isMultiDragging"
            @select-slot="selectSlot"
            @setting="settingModel"
        ></canvas-action>
    </div>
    <canvas-multi-drag-indicator
        :lineState="lineState"
        :multiDragState="multiDragState"
        :multiStateLength="multiStateLength"
        :isMultiDragging="isMultiDragging"
        :getMultiDragPositionText="getMultiDragPositionText"
    ></canvas-multi-drag-indicator>
    <canvas-router-jumper
        :hoverState="hoverState"
        :inactiveHoverState="inactiveHoverState"
    ></canvas-router-jumper>
    <canvas-viewer-switcher
        :hoverState="hoverState"
        :inactiveHoverState="inactiveHoverState"
    ></canvas-viewer-switcher>
    <canvas-divider :selectState="computedSelectState"></canvas-divider>
    <canvas-resize-border
        :selectState="computedSelectState"
        :iframe="iframe"
    ></canvas-resize-border>
    <div class="canvas-wheel-forward" @wheel.capture.prevent="onCanvasWheel">
        <canvas-resize>
            <template v-if="!loading">
                <iframe
                    id="canvas"
                    :key="iframeRenderKey"
                    ref="iframe"
                    :[srcAttrName]="canvasSrc || iframeSrcdoc"
                    style="border: none; width: 100%; height: 100%"
                ></iframe>
            </template>
            <div v-else class="datainit-tip">应用数据初始化中...</div>
        </canvas-resize>
    </div>
    <canvas-menu @insert="insertComponent"></canvas-menu>
    <!-- 快捷选择物料面板 -->
    <div v-if="insertPosition" ref="insertPanel" class="insert-panel">
        <component
            :is="materialsPanel"
            class="component-wrap"
            :shortcut="insertPosition"
            @close="insertPosition = false"
        ></component>
    </div>
    <!-- 【添加父级容器】快捷选择物料面板 -->
    <div v-if="insertContainer" ref="containerPanel" class="insert-panel">
        <component
            :is="materialsPanel"
            :shortcut="insertContainer"
            class="component-wrap"
            groupName="layout"
            @close="insertContainer = false"
        ></component>
    </div>
</template>

<script lang="ts">
/* eslint-disable vue/component-api-style -- Options API 与现有 setup 深度耦合，暂不迁移 script setup */
/* eslint-disable import/order */
import type { PropType } from 'vue';
import { onMounted, ref, computed, onUnmounted, watch, watchEffect } from 'vue';
import { iframeMonitoring } from '@opentiny/tiny-engine-common/js/monitor';
import {
    useTranslate,
    useCanvas,
    useMessage,
    useResource,
    useMaterial
} from '@opentiny/tiny-engine-meta-register';
import { NODE_UID, NODE_LOOP, DESIGN_MODE } from '@/components/canvas/common';
import { getCanvasLowcodeLocale } from '@/services/i18nService';
import { setCanvasVueI18nLocale } from './container';
import { registerHotkeyEvent, removeHotkeyEvent } from './keyboard';
import CanvasMenu, { closeMenu, openMenu } from './components/CanvasMenu.vue';
import CanvasAction from './components/CanvasAction.vue';
import CanvasRouterJumper from './components/CanvasRouterJumper.vue';
import CanvasViewerSwitcher from './components/CanvasViewerSwitcher.vue';
import CanvasResize from './components/CanvasResize.vue';
import CanvasDivider from './components/CanvasDivider.vue';
import CanvasResizeBorder from './components/CanvasResizeBorder.vue';
import CanvasMultiDragIndicator from './components/CanvasMultiDragIndicator.vue';
import { useMultiSelect } from './composables/useMultiSelect';
import { useMultiDrag } from './composables/useMultiDrag';
import {
    getDesignerMaterialBaseUrl,
    toAbsoluteMaterialUrl
} from '@/utils/designerOrigin';
import { getMaterialsBaseFromBundleUrls } from '@/composable/loadRuntimeFromBundles';
import {
    canvasState,
    onMouseUp,
    dragMove,
    dragState,
    initialRectState,
    hoverState,
    inactiveHoverState,
    lineState,
    removeNodeById,
    syncNodeScroll,
    getElement,
    dragStart,
    selectNode,
    initCanvas,
    clearLineState,
    querySelectById,
    getCurrent,
    canvasApi
} from './container';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        CanvasAction,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        CanvasResize,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        CanvasMenu,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        CanvasDivider,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        CanvasResizeBorder,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        CanvasRouterJumper,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        CanvasViewerSwitcher,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        CanvasMultiDragIndicator
    },
    props: {
        controller: {
            type: Object as PropType<Record<string, unknown>>,
            default: () => ({})
        },
        canvasSrc: { type: String, default: '' },
        canvasSrcDoc: { type: String, default: '' },
        materialsPanel: {
            type: Object as PropType<Record<string, unknown>>,
            default: () => ({})
        }
    },
    emits: ['selected', 'remove'],
    setup(props, { emit }) {
        const iframe = ref<HTMLIFrameElement | null>(null);
        const insertPanel = ref<HTMLElement | null>(null);
        const insertPosition = ref<boolean | Record<string, unknown>>(false);
        const loading = computed(() => useCanvas().isLoading());
        const iframeRenderKey = ref(0);
        const showSettingModel = ref(false);
        const target = ref<EventTarget | null>(null);
        const srcAttrName = computed(() =>
            props.canvasSrc ? 'src' : 'srcdoc'
        );
        // 插件环境下画布 iframe (srcdoc) 需注入 CSP。只放行合法 origin（不能把带路径的完整 URL 放进 CSP，否则会报 invalid source）
        const iframeSrcdoc = computed(() => {
            const base = getDesignerMaterialBaseUrl();
            const doc = props.canvasSrcDoc;
            if (!doc || !base) return doc;
            const cdn =
                'https://registry.npmmirror.com https://esm.sh https://cdn.jsdelivr.net https://unpkg.com https://at.alicdn.com';
            let origins = '';
            if (base.includes('vscode-webview')) {
                origins = 'vscode-webview://*';
            } else if (
                base.includes('vscode-resource') ||
                base.includes('vscode-cdn.net')
            ) {
                // file+.vscode-resource.vscode-cdn.net 无法作为合法 host 写入 CSP（含 + 或 %2B 均报 invalid），改用 scheme 放行所有 https
                origins = 'https:';
            } else {
                const origin = base.replace(/\/$/, '');
                const origin127 = origin.replace(/localhost/, '127.0.0.1');
                origins = `${origin} ${origin127}`;
            }
            const win = typeof window !== 'undefined' ? (window as any) : null;
            const designerOrigin = win?.TINY_DESIGNER_ORIGIN
                ? `${win.TINY_DESIGNER_ORIGIN.replace(
                      /\/$/,
                      ''
                  )} ${win.TINY_DESIGNER_ORIGIN.replace(/\/$/, '').replace(
                      /localhost/,
                      '127.0.0.1'
                  )}`
                : '';
            // TODO(方案B): 物料域应从配置/设置读取（如 engine.config 或 VSCode materialBundleUrls 解析出的 origin），而非写死
            // 主工程物料服务器：允许从 localhost:3000 / 3060 加载脚本和样式，避免 CSP 拦截
            const materialServerOrigins =
                'http://localhost:3000 http://127.0.0.1:3000 http://localhost:3060 http://127.0.0.1:3060';
            const allOrigins = designerOrigin
                ? `${origins} ${designerOrigin} ${materialServerOrigins}`
                : `${origins} ${materialServerOrigins}`;
            const scriptSrc = `'self' 'unsafe-inline' 'unsafe-eval' ${allOrigins} ${cdn}`;
            const styleSrc = `'self' 'unsafe-inline' ${allOrigins} ${cdn}`;
            const csp = `script-src ${scriptSrc}; script-src-elem ${scriptSrc}; style-src ${styleSrc}; style-src-elem ${styleSrc}; connect-src 'self' ${allOrigins} ${cdn};`;
            const meta = `<meta http-equiv="Content-Security-Policy" content="${csp}">`;
            if (/<head[^>]*>/i.test(doc)) {
                return doc.replace(/(<head[^>]*>)/i, `$1\n    ${meta}`);
            }
            return doc;
        });

        const containerPanel = ref<HTMLElement | null>(null);
        const insertContainer = ref(false);

        /* eslint-disable @typescript-eslint/naming-convention -- 拖拽类型枚举与画布约定一致 */
        const DRAG_TYPE = {
            NONE: 'none',
            SINGLE: 'single',
            MULTI: 'multi'
        };
        /* eslint-enable @typescript-eslint/naming-convention */

        // 当前拖拽类型状态
        const currentDragType = ref<string>(DRAG_TYPE.NONE);

        const { multiSelectedStates, isMouseDown } = useMultiSelect();

        const multiStateLength = computed(
            () => multiSelectedStates.value.length
        );
        const {
            startMultiDrag,
            moveMultiDrag,
            endMultiDrag,
            isMultiDragging,
            getMultiDragPositionText,
            multiDragState,
            cleanupDragState
        } = useMultiDrag();

        const computedSelectState = computed(() => {
            if (multiSelectedStates.value.length === 1) {
                return multiSelectedStates.value[0];
            }

            return initialRectState;
        });

        // 强制清除所有拖拽指示状态
        const clearAllDragStates = () => {
            clearLineState();
            cleanupDragState();
            currentDragType.value = DRAG_TYPE.NONE;
        };

        const setCurrentNode = async event => {
            const { clientX, clientY } = event;
            const element = getElement(event.target);
            closeMenu();

            if (!element) return;

            // 优先处理右键菜单
            if (event.button === 2) {
                openMenu(event);
                return;
            }

            let node = getCurrent().schema;

            if (element) {
                // 首先尝试处理多选拖拽开始
                if (startMultiDrag(event, element)) {
                    // 设置为多选拖拽状态
                    currentDragType.value = DRAG_TYPE.MULTI;
                    return;
                }

                // 只有当不是多选拖拽的情况下，才进行选择操作
                const currentElement = querySelectById(getCurrent().schema?.id);

                // 如果是点击右键则打开右键菜单
                if (event.button === 2) {
                    openMenu(event);
                    return;
                }

                if (!currentElement?.contains(element) || event.button === 0) {
                    const isCtrlKey = event.ctrlKey || event.metaKey;
                    const loopId = element.getAttribute(NODE_LOOP);
                    if (loopId) {
                        node = await selectNode(
                            element.getAttribute(NODE_UID),
                            `loop-id=${loopId}`,
                            isCtrlKey
                        );
                    } else {
                        node = await selectNode(
                            element.getAttribute(NODE_UID),
                            undefined,
                            isCtrlKey
                        );
                    }
                }

                // 处理单节点拖拽开始
                if (
                    event.button === 0 &&
                    element !== element.ownerDocument.body
                ) {
                    const { x, y } = element.getBoundingClientRect();
                    if (multiStateLength.value === 1) {
                        dragStart(node, element, {
                            offsetX: clientX - x,
                            offsetY: clientY - y
                        });
                        // 设置为单选拖拽状态
                        currentDragType.value = DRAG_TYPE.SINGLE;
                    }
                }
            }
        };

        useCanvas().initCanvasApi(canvasApi);

        // 把物料脚本转为绝对 URL 并写入画布，供画布加载 mp-card.js 等；插件里相对路径会变成 vscode-webview 导致 403；浏览器里用绝对 URL 避免 iframe/base 解析差异
        const syncComponentsDepsToIframe = () => {
            if (!iframe.value?.contentWindow) return;
            const win = iframe.value.contentWindow;
            const materialScripts =
                useResource().appSchemaState.materialsDeps.scripts.filter(
                    item => item.components
                );
            const designerBase = String(
                getDesignerMaterialBaseUrl() ||
                    (typeof location !== 'undefined'
                        ? location.origin
                        : null) ||
                    'http://localhost:8090'
            ).replace(/\/$/, '');
            const remoteBundleBase =
                getMaterialsBaseFromBundleUrls()?.replace(/\/$/, '') || null;
            const depBase = String(remoteBundleBase || designerBase).replace(
                /\/$/,
                ''
            );
            const componentsDeps = materialScripts.map(s => ({
                ...s,
                script: toAbsoluteMaterialUrl(s.script, depBase) ?? s.script,
                ...(s.css && {
                    css: toAbsoluteMaterialUrl(s.css, depBase) ?? s.css
                })
            }));
            win.componentsDeps = componentsDeps;
            /* eslint-disable no-console -- 诊断画布组件依赖 */
            if (console?.log && componentsDeps.length) {
                const names = componentsDeps.flatMap(
                    (d: { components?: Record<string, unknown> }) =>
                        Object.keys(d.components || {})
                );
                console.log(
                    '[Materials] 画布 componentsDeps 已设置，将预加载并注册的组件:',
                    names
                );
            }
            /* eslint-enable no-console */
        };

        const beforeCanvasReady = () => {
            if (iframe.value) {
                const win = iframe.value.contentWindow;
                // 画布就绪时主动推送一次依赖（含扩展 data URL），避免仅靠 fetchMaterial 时未调用导致 403
                const { scripts } = useResource().appSchemaState.materialsDeps;
                if (scripts?.length) {
                    useMaterial().updateCanvasDeps();
                }
                syncComponentsDepsToIframe();

                // 在 VSCode 环境中注入图片代理处理脚本
                if (win?.document) {
                    // 延迟注入，确保 iframe 完全加载
                    setTimeout(() => {
                        import('../../utils/imageProxy')
                            .then(({ injectImageProxyScript }) => {
                                injectImageProxyScript(win);
                            })
                            .catch(error => {
                                // eslint-disable-next-line no-console
                                console.error(
                                    '[CanvasContainer] Failed to inject image proxy script:',
                                    error
                                );
                            });
                    }, 100);
                }

                const { subscribe, unsubscribe } = useMessage();
                const { getSchemaDiff, patchLatestSchema, getSchema, getNode } =
                    useCanvas();
                const { appSchemaState } = useResource();

                // 创建一个代理对象，确保传递给画布的 utils 数据始终是规范化的
                const normalizedAppSchema = {
                    ...appSchemaState,
                    get utils() {
                        const { utils } = appSchemaState;
                        if (!Array.isArray(utils)) {
                            return utils;
                        }
                        // 规范化每个 item，确保 content 对象存在
                        // 过滤掉非对象类型的 item（如数组、null、undefined 等）
                        return utils

                            .filter((item: any) => {
                                // 过滤掉数组、null、undefined 等无效项
                                return (
                                    item &&
                                    typeof item === 'object' &&
                                    !Array.isArray(item)
                                );
                            })

                            .map((item: any) => {
                                // 确保 content 对象存在
                                if (!item.content) {
                                    item.content = {};
                                }
                                // function 类型确保有 exportName 字段（即使为 undefined）
                                if (
                                    item.type === 'function' &&
                                    item.content.exportName === undefined
                                ) {
                                    item.content.exportName = undefined;
                                }
                                // npm 类型确保有 exportName
                                if (
                                    item.type === 'npm' &&
                                    !item.content.exportName
                                ) {
                                    item.content.exportName = '';
                                }
                                return item;
                            });
                    }
                };

                iframe.value.contentWindow.host = {
                    unsubscribe,
                    subscribe,
                    getSchemaDiff,
                    patchLatestSchema,
                    watch,
                    watchEffect,
                    getSchema,
                    appSchema: normalizedAppSchema,
                    schemaUtils: {
                        getSchema,
                        getNode
                    }
                };
            }
        };

        const handleCanvasEvent = handler => {
            const designMode = canvasApi.getDesignMode();

            if (designMode !== DESIGN_MODE.DESIGN) {
                return;
            }

            return handler();
        };

        const canvasReady = ({ detail }) => {
            if (iframe.value) {
                // 设置monitor报错埋点
                iframeMonitoring();

                initCanvas({
                    emit,
                    renderer: detail,
                    iframe: iframe.value,
                    controller: props.controller
                });

                // 与国际化插件词条一致：画布 vue-i18n 默认常为 zh_CN，此处对齐为设计器当前语言（默认 en_US）
                setCanvasVueI18nLocale(getCanvasLowcodeLocale());

                const doc = iframe.value.contentDocument;
                const win = iframe.value.contentWindow;

                // 覆盖 Ionic structure.css 对 body 的 overflow: hidden / position: fixed，使画布可滚动
                const canvasScrollStyle = doc.createElement('style');
                canvasScrollStyle.id = 'designer-canvas-scroll-override';
                canvasScrollStyle.textContent = `
                    html, body { overflow: auto !important; overflow-x: hidden !important; }
                    body { position: static !important; height: auto !important; max-height: none !important; min-height: 100% !important; }
                `;
                doc.head.appendChild(canvasScrollStyle);

                // 若浏览器把滚轮事件发给 iframe 内部，在 iframe 内也监听并手动滚动
                const applyWheelScroll = (deltaY: number) => {
                    const wheelDoc = iframe.value?.contentDocument;
                    if (!wheelDoc) return;
                    const scrollEl =
                        wheelDoc.scrollingElement || wheelDoc.documentElement;
                    const nextTop = scrollEl.scrollTop + deltaY;
                    scrollEl.scrollTop = Math.max(
                        0,
                        Math.min(
                            nextTop,
                            scrollEl.scrollHeight - scrollEl.clientHeight
                        )
                    );
                };
                win.addEventListener(
                    'wheel',
                    (e: WheelEvent) => {
                        e.preventDefault();
                        applyWheelScroll(e.deltaY);
                    },
                    { passive: false }
                );

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                let isScrolling = false;

                // 监听鼠标按下事件
                win.addEventListener('mousedown', event => {
                    handleCanvasEvent(() => {
                        // html元素使用scroll和mouseup事件处理
                        if (event.target === doc.documentElement) {
                            isScrolling = false;
                            return;
                        }

                        const element = getElement(event.target);
                        if (!element) {
                            return;
                        }

                        isMouseDown.value = true;
                        // 重置拖拽状态
                        currentDragType.value = DRAG_TYPE.NONE;

                        insertPosition.value = false;
                        insertContainer.value = false;
                        setCurrentNode(event);
                        target.value = event.target;
                    });

                    useMessage().publish({
                        topic: 'canvas-mousedown',
                        data: { event }
                    });
                });

                win.addEventListener('scroll', () => {
                    isScrolling = true;
                });

                // 监听鼠标移动事件
                win.addEventListener('mousemove', ev => {
                    handleCanvasEvent(() => {
                        // 根据当前拖拽类型执行相应操作
                        switch (currentDragType.value) {
                            case DRAG_TYPE.MULTI:
                                moveMultiDrag(ev);
                                break;
                            case DRAG_TYPE.SINGLE:
                                dragMove(ev, true);
                                break;
                            case DRAG_TYPE.NONE:
                                // 如果尚未确定拖拽类型，尝试确定
                                if (isMouseDown.value) {
                                    if (multiDragState.keydown) {
                                        currentDragType.value = DRAG_TYPE.MULTI;
                                        moveMultiDrag(ev);
                                    } else if (dragState.element) {
                                        currentDragType.value =
                                            DRAG_TYPE.SINGLE;
                                        dragMove(ev, true);
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    });
                });

                // 监听拖拽结束事件
                win.addEventListener('mouseup', ev => {
                    handleCanvasEvent(() => {
                        if (ev.button === 0 && isMouseDown.value) {
                            isMouseDown.value = false;

                            // 判断是否需要切换到单选状态
                            // 只有当点击多选节点但没有拖动时，才需要切换到单选状态
                            if (
                                multiDragState.keydown &&
                                !multiDragState.dragStarted &&
                                multiStateLength.value > 1
                            ) {
                                const element = getElement(ev.target);
                                if (element) {
                                    const clickedNodeId =
                                        element?.getAttribute(NODE_UID);
                                    // 只有点击的是多选节点中的一个时才切换到单选
                                    if (
                                        clickedNodeId &&
                                        multiSelectedStates.value.some(
                                            state => state.id === clickedNodeId
                                        )
                                    ) {
                                        selectNode(clickedNodeId);
                                    }
                                }
                            }
                        }

                        // 根据当前拖拽类型执行相应的结束操作
                        switch (currentDragType.value) {
                            case DRAG_TYPE.MULTI:
                                endMultiDrag();
                                break;
                            case DRAG_TYPE.SINGLE:
                                onMouseUp(ev);
                                break;
                            default:
                                break;
                        }

                        clearAllDragStates();
                    });
                });

                // 监听拖拽过程事件
                win.addEventListener('dragover', ev => {
                    ev.dataTransfer.dropEffect = 'move';
                    ev.preventDefault();

                    // 根据当前拖拽类型执行相应操作
                    if (currentDragType.value === DRAG_TYPE.MULTI) {
                        moveMultiDrag(ev);
                    } else {
                        dragMove(ev);
                    }
                });

                // 监听放置事件
                win.addEventListener('drop', ev => {
                    ev.preventDefault();

                    // 根据当前拖拽类型执行相应的结束操作
                    if (currentDragType.value === DRAG_TYPE.MULTI) {
                        endMultiDrag();
                    } else {
                        onMouseUp(ev);
                    }

                    clearAllDragStates();
                });

                // 阻止浏览器默认的右键菜单功能
                win.oncontextmenu = e => {
                    e.preventDefault();
                };

                registerHotkeyEvent(doc);

                win.addEventListener('scroll', syncNodeScroll, true);
            }
        };
        // 设置弹窗
        const settingModel = () => {
            showSettingModel.value = true;
        };

        const updateI18n = message => {
            if (message?.data?.isI18n) {
                const data = message.data.data || {};
                const { ensureI18n } = useTranslate();
                Object.keys(data).forEach(key => {
                    ensureI18n(data[key], false);
                });
            }
        };
        const run = () => {
            // 以下是外部window需要监听的事件
            window.addEventListener('mousedown', e => {
                insertPosition.value = insertPanel.value?.contains(e.target);
                insertContainer.value = containerPanel.value?.contains(
                    e.target
                );
                target.value = e.target;
            });

            window.addEventListener('dragenter', () => {
                // 如果拖拽范围超出了iframe范围，则清空拖拽位置数据
                clearLineState();
            });

            window.addEventListener('message', updateI18n);
        };

        const insertComponent = position => {
            if (position === 'out') {
                insertContainer.value = position;
                return;
            }
            insertPosition.value = position;
        };

        const selectSlot = slotName => {
            hoverState.slot = slotName;
        };

        /** 画布区域滚轮转发：在包装 div 上捕获滚轮并滚动 iframe 内文档，解决浏览器中 iframe 无法用滚轮滚动 */
        const onCanvasWheel = (e: WheelEvent) => {
            const el = iframe.value;
            if (!el?.contentDocument) return;
            const doc = el.contentDocument;
            const scrollEl = doc.scrollingElement || doc.documentElement;
            const nextTop = scrollEl.scrollTop + e.deltaY;
            scrollEl.scrollTop = Math.max(
                0,
                Math.min(nextTop, scrollEl.scrollHeight - scrollEl.clientHeight)
            );
        };

        // 监听来自 canvas iframe 的图片代理请求
        const handleImageProxyMessage = (event: MessageEvent) => {
            import('../../utils/imageProxy').then(
                ({ handleImageProxyRequest }) => {
                    handleImageProxyRequest(event);
                }
            );
        };
        const refreshSubscriber = 'canvas-container-refresh';
        const handleCanvasRefreshRequest = (payload?: { mode?: string }) => {
            const mode = payload?.mode;
            if (mode !== 'srcdoc-remount') {
                return;
            }
            // srcdoc 模式下避免直接 location.reload() 导致空白，改为父层重建 iframe。
            iframeRenderKey.value += 1;
            setTimeout(() => {
                useMessage().publish({ topic: 'canvas_refreshed' });
            }, 0);
        };

        onMounted(() => {
            run(iframe);
            // 添加消息监听器
            window.addEventListener('message', handleImageProxyMessage);
            useMessage().subscribe({
                topic: 'canvas_refresh_request',
                subscriber: refreshSubscriber,
                callback: handleCanvasRefreshRequest
            });
        });
        onUnmounted(() => {
            // 移除消息监听器
            window.removeEventListener('message', handleImageProxyMessage);
            if (iframe.value?.contentDocument) {
                removeHotkeyEvent(iframe.value.contentDocument);
            }
            window.removeEventListener('message', updateI18n, false);
            useMessage().unsubscribe({
                topic: 'canvas_refresh_request',
                subscriber: refreshSubscriber
            });
        });

        document.addEventListener('beforeCanvasReady', beforeCanvasReady);
        document.addEventListener('canvasReady', canvasReady);

        // 物料列表变化时（如打开页面含 MpCard）同步到画布，避免画布仍用旧列表导致相对路径 403
        watch(
            () => useResource().appSchemaState.materialsDeps.scripts,
            () => {
                syncComponentsDepsToIframe();
            },
            { deep: true }
        );

        return {
            onCanvasWheel,
            isMouseDown,
            iframe,
            dragState,
            hoverState,
            inactiveHoverState,
            computedSelectState,
            lineState,
            multiSelectedStates,
            multiStateLength,
            removeNodeById,
            selectSlot,
            canvasState,
            insertComponent,
            insertPanel,
            containerPanel,
            settingModel,
            target,
            showSettingModel,
            insertPosition,
            insertContainer,
            loading,
            iframeRenderKey,
            srcAttrName,
            iframeSrcdoc,
            isMultiDragging,
            multiDragState,
            getMultiDragPositionText
        };
    }
};
</script>

<style lang="scss" scoped>
.insert-panel {
    z-index: 4;
    position: fixed;
    top: 200px;
    left: 400px;

    .component-wrap {
        width: 480px !important;
    }

    :deep(.components-wrap) {
        & > .tiny-collapse {
            max-height: 300px;
        }
    }
    :deep(#pane-blocks) {
        max-height: 400px;
    }
}
.canvas-wheel-forward {
    height: 100%;
    position: relative;
}
.datainit-tip {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    color: #1890ff;
}
</style>
