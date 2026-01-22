/**
 * VSCode 环境下图片代理工具
 * 用于在 VSCode 环境中通过代理加载外部图片，解决 CSP 限制问题
 */

/**
 * 判断是否是外部 URL
 */
const isExternalUrl = (url: string): boolean => {
    return url.startsWith('http://') || url.startsWith('https://');
};

/**
 * 判断是否是 VSCode 环境
 */
const isVSCodeEnv = (): boolean => {
    return typeof window !== 'undefined' && ((window as any).vscode || (window as any).vscodeBridge);
};

/**
 * 通过 VSCode 代理加载图片并转换为 base64
 */
const loadImageViaProxy = async (url: string): Promise<string> => {
    try {
        // 动态导入 useVSCodeBridge
        const { proxyHttpRequest } = await import('../../../composable/useVSCodeBridge');

        // 通过代理获取图片，要求 VSCode 插件返回 base64 格式
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await proxyHttpRequest({
            url,
            method: 'get',
            headers: {
                'Accept': 'image/*'
            },
            responseType: 'base64',
            isImage: true
        } as any);

        // 插件返回 base64 字符串，添加 data: 前缀
        if (typeof response === 'string') {
            // 如果已经是完整的 data URL，直接使用
            if (response.startsWith('data:')) {
                return response;
            }
            // 如果返回的是纯 base64 字符串，添加前缀
            if (response && !response.includes('://') && response.length > 100) {
                const imageType = url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)/i)?.[1]?.toLowerCase() || 'png';
                return `data:image/${imageType};base64,${response}`;
            }
        }

        // 如果返回的是对象，尝试获取 data 字段
        if (response && typeof response === 'object') {
            const data = response.data !== undefined ? response.data : response;
            if (typeof data === 'string' && data.startsWith('data:')) {
                return data;
            }
            if (typeof data === 'string' && data.length > 100) {
                const imageType = url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)/i)?.[1]?.toLowerCase() || 'png';
                return `data:image/${imageType};base64,${data}`;
            }
        }

        // 如果无法处理，返回原始 URL
        return url;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[ImageProxy] Failed to load image via proxy:', error);
        return url;
    }
};

/**
 * 处理单个图片元素的 src
 */
const processImageElement = async (img: HTMLImageElement): Promise<void> => {
    const src = img.getAttribute('src');
    if (!src || !isExternalUrl(src)) {
        return;
    }

    try {
        const base64Url = await loadImageViaProxy(src);
        img.src = base64Url;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[ImageProxy] Failed to process image:', src, error);
    }
};

/**
 * 在 canvas iframe 中注入图片代理处理脚本
 */
export const injectImageProxyScript = (iframeWindow: Window): void => {
    if (!isVSCodeEnv()) {
        return;
    }

    try {
        // 等待文档加载完成
        const inject = () => {
            // 检查是否已经注入过
            if (iframeWindow.document.getElementById('image-proxy-script')) {
                return;
            }

            // 创建一个脚本来处理图片加载
            const script = iframeWindow.document.createElement('script');
            script.id = 'image-proxy-script';
            script.textContent = `
            (function() {
                const isExternalUrl = (url) => {
                    return url && (url.startsWith('http://') || url.startsWith('https://'));
                };

                // 全局消息监听器，处理所有图片代理响应
                const globalMessageHandler = (event) => {
                    if (event.data && event.data.type === 'proxyImageResponse') {
                        const requestId = event.data.requestId;
                        const base64Url = event.data.base64Url;
                        const error = event.data.error;
                        
                        // 查找所有等待此 requestId 的图片元素
                        const waitingImages = document.querySelectorAll('img[data-proxy-request-id="' + requestId + '"]');
                        
                        waitingImages.forEach(img => {
                            if (base64Url && base64Url.startsWith('data:image/')) {
                                // 移除所有可能阻止显示的样式
                                img.style.display = '';
                                img.style.visibility = 'visible';
                                img.style.opacity = '1';
                                
                                // 设置 src
                                img.src = base64Url;
                                img.removeAttribute('data-proxy-request-id');
                            } else if (error) {
                                // 加载失败，恢复原始 URL
                                img.style.display = '';
                                img.style.visibility = 'visible';
                                const originalSrc = img.getAttribute('data-original-src');
                                if (originalSrc) {
                                    img.src = originalSrc;
                                }
                                img.removeAttribute('data-proxy-request-id');
                                img.removeAttribute('data-original-src');
                            }
                        });
                    }
                };
                window.addEventListener('message', globalMessageHandler);

                // 处理已存在的图片
                const processExistingImages = () => {
                    const images = document.querySelectorAll('img');
                    images.forEach(img => {
                        const src = img.getAttribute('src');
                        if (src && isExternalUrl(src) && !img.dataset.proxyProcessed) {
                            // 标记已处理
                            img.dataset.proxyProcessed = 'true';
                            // 保存原始 URL
                            img.setAttribute('data-original-src', src);
                            // 先阻止图片加载，避免 CSP 错误
                            img.style.display = 'none';
                            img.removeAttribute('src');
                            
                            // 通过 postMessage 请求父窗口代理加载图片
                            const requestId = 'img_' + Date.now() + '_' + Math.random();
                            img.setAttribute('data-proxy-request-id', requestId);
                            
                            window.parent.postMessage({
                                type: 'proxyImage',
                                url: src,
                                requestId: requestId
                            }, '*');
                            
                            // 设置超时，避免无限等待
                            setTimeout(() => {
                                if (img.getAttribute('data-proxy-request-id') === requestId) {
                                    img.style.display = '';
                                    img.src = src;
                                    img.removeAttribute('data-proxy-request-id');
                                    img.removeAttribute('data-original-src');
                                }
                            }, 10000);
                        }
                    });
                };

                // 使用 MutationObserver 监听新添加的图片和属性变化
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        // 处理新添加的节点
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) { // Element node
                                if (node.tagName === 'IMG') {
                                    const img = node;
                                    const src = img.getAttribute('src');
                                    if (src && isExternalUrl(src) && !img.dataset.proxyProcessed) {
                                        img.dataset.proxyProcessed = 'true';
                                        img.setAttribute('data-original-src', src);
                                        img.style.display = 'none';
                                        img.removeAttribute('src');
                                        
                                        const requestId = 'img_' + Date.now() + '_' + Math.random();
                                        img.setAttribute('data-proxy-request-id', requestId);
                                        
                                        window.parent.postMessage({
                                            type: 'proxyImage',
                                            url: src,
                                            requestId: requestId
                                        }, '*');
                                        
                                        setTimeout(() => {
                                            if (img.getAttribute('data-proxy-request-id') === requestId) {
                                                img.style.display = '';
                                                img.src = src;
                                                img.removeAttribute('data-proxy-request-id');
                                                img.removeAttribute('data-original-src');
                                            }
                                        }, 10000);
                                    }
                                } else {
                                    // 检查子元素中的图片
                                    const images = node.querySelectorAll && node.querySelectorAll('img');
                                    if (images) {
                                        images.forEach(img => {
                                            const src = img.getAttribute('src');
                                            if (src && isExternalUrl(src) && !img.dataset.proxyProcessed) {
                                                img.dataset.proxyProcessed = 'true';
                                                img.setAttribute('data-original-src', src);
                                                img.style.display = 'none';
                                                img.removeAttribute('src');
                                                
                                                const requestId = 'img_' + Date.now() + '_' + Math.random();
                                                img.setAttribute('data-proxy-request-id', requestId);
                                                
                                                window.parent.postMessage({
                                                    type: 'proxyImage',
                                                    url: src,
                                                    requestId: requestId
                                                }, '*');
                                                
                                                setTimeout(() => {
                                                    if (img.getAttribute('data-proxy-request-id') === requestId) {
                                                        img.style.display = '';
                                                        img.src = src;
                                                        img.removeAttribute('data-proxy-request-id');
                                                        img.removeAttribute('data-original-src');
                                                    }
                                                }, 10000);
                                            }
                                        });
                                    }
                                }
                            }
                        });
                        
                        // 处理属性变化（特别是 src 属性的变化）
                        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                            const img = mutation.target;
                            if (img.tagName === 'IMG') {
                                const src = img.getAttribute('src');
                                if (src && isExternalUrl(src) && !img.dataset.proxyProcessed) {
                                    img.dataset.proxyProcessed = 'true';
                                    img.setAttribute('data-original-src', src);
                                    img.style.display = 'none';
                                    img.removeAttribute('src');
                                    
                                    const requestId = 'img_' + Date.now() + '_' + Math.random();
                                    img.setAttribute('data-proxy-request-id', requestId);
                                    
                                    window.parent.postMessage({
                                        type: 'proxyImage',
                                        url: src,
                                        requestId: requestId
                                    }, '*');
                                    
                                    setTimeout(() => {
                                        if (img.getAttribute('data-proxy-request-id') === requestId) {
                                            img.style.display = '';
                                            img.src = src;
                                            img.removeAttribute('data-proxy-request-id');
                                            img.removeAttribute('data-original-src');
                                        }
                                    }, 10000);
                                }
                            }
                        }
                    });
                });

                // 等待 DOM 加载完成后处理
                const startObserving = () => {
                    processExistingImages();
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        attributeFilter: ['src'] // 只监听 src 属性的变化
                    });
                };
                
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', startObserving);
                } else {
                    startObserving();
                }
                
                // 也监听 window.load 事件，确保所有资源加载完成后再处理
                window.addEventListener('load', () => {
                    setTimeout(processExistingImages, 100);
                });
            })();
        `;
            iframeWindow.document.head.appendChild(script);
        };

        // 等待文档加载完成后再注入
        if (iframeWindow.document.readyState === 'loading') {
            iframeWindow.document.addEventListener('DOMContentLoaded', inject);
        } else {
            inject();
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[ImageProxy] Failed to inject script:', error);
    }
};

/**
 * 处理来自 canvas iframe 的图片代理请求
 */
export const handleImageProxyRequest = async (event: MessageEvent): Promise<void> => {
    if (!isVSCodeEnv()) {
        return;
    }

    if (event.data && event.data.type === 'proxyImage' && event.data.url) {
        try {
            const base64Url = await loadImageViaProxy(event.data.url);
            // 发送响应回 canvas iframe
            if (event.source && typeof (event.source as Window).postMessage === 'function') {
                (event.source as Window).postMessage(
                    {
                        type: 'proxyImageResponse',
                        requestId: event.data.requestId,
                        base64Url: base64Url
                    },
                    '*'
                );
            }
        } catch (error) {
            // 发送错误响应
            if (event.source && typeof (event.source as Window).postMessage === 'function') {
                (event.source as Window).postMessage(
                    {
                        type: 'proxyImageResponse',
                        requestId: event.data.requestId,
                        error: error instanceof Error ? error.message : String(error)
                    },
                    '*'
                );
            }
        }
    }
};
