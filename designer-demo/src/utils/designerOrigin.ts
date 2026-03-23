/**
 * VSCode 插件环境下，画布 iframe 的 base 为 vscode-webview，相对路径的物料脚本/样式无法加载。
 * 返回设计器物料 base。开发模式下强制用 TINY_DESIGNER_ORIGIN（localhost），
 * 避免 vscode-webview 在 iframe 内 403；非 localhost 时再考虑 MATERIALS_BASE。
 */
/* eslint-disable @typescript-eslint/naming-convention -- 全局变量/环境变量名保持大写下划线 */
type WindowWithDesignerOrigin = Window & {
    vscode?: unknown;
    vscodeBridge?: unknown;
    TINY_DESIGNER_ORIGIN?: string;
    TINY_DESIGNER_MATERIALS_BASE?: string;
};

type EnvWithOrigin = ImportMetaEnv & { VITE_ORIGIN?: string };
/* eslint-enable @typescript-eslint/naming-convention */

export function getDesignerMaterialBaseUrl(): string | null {
    if (typeof window === 'undefined') return null;
    /* eslint-disable @typescript-eslint/naming-convention -- 全局变量/环境变量名保持大写下划线 */
    const win = window as WindowWithDesignerOrigin;
    const hasVscodeBridge = !!win.vscode || !!win.vscodeBridge;
    const isWebViewLike =
        win.location?.protocol &&
        win.location.protocol !== 'http:' &&
        win.location.protocol !== 'https:';
    if (!hasVscodeBridge && !isWebViewLike) return null;
    const origin = (
        win.TINY_DESIGNER_ORIGIN ||
        (import.meta.env as EnvWithOrigin).VITE_ORIGIN ||
        'http://localhost:8090'
    ).replace(/\/$/, '');
    // 开发模式（ORIGIN 为 localhost）：画布 iframe 内 vscode-webview 会 403，统一用 localhost 加载物料
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return origin;
    }
    const base = win.TINY_DESIGNER_MATERIALS_BASE || origin;
    /* eslint-enable @typescript-eslint/naming-convention */
    return String(base).replace(/\/$/, '');
}

/**
 * MATERIALS_BASE 为 webview/vscode-resource 时优先用扩展注入的 MATERIALS_MAP（每个文件完整 asWebviewUri，避免目录+子路径 404）；
 * 否则 base 已是 .../mock/materials，只拼文件名。若误拼成 base + "/mock/materials/xxx" 会得到 .../mock/materials/mock/materials/xxx 导致 404。
 */
export function toAbsoluteMaterialUrl(
    url: string | undefined,
    base: string | null
): string | undefined {
    if (!url || !base) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('vscode-webview:')) return url;
    const isMaterialsBase =
        base.includes('vscode-webview') ||
        base.includes('vscode-resource') ||
        base.includes('vscode-cdn.net');
    const filename = url.replace(/^.*\//, '');
    if (isMaterialsBase && typeof window !== 'undefined') {
        /* eslint-disable @typescript-eslint/naming-convention -- 全局变量名保持大写下划线 */
        const winExt = window as Window & {
            TINY_DESIGNER_MATERIALS_MAP?: Record<string, string>;
        };
        if (winExt.TINY_DESIGNER_MATERIALS_MAP?.[filename])
            return winExt.TINY_DESIGNER_MATERIALS_MAP[filename];
        /* eslint-enable @typescript-eslint/naming-convention */
    }
    if (url.startsWith('/')) {
        if (isMaterialsBase && url.includes('/mock/materials/')) {
            return `${base}/${filename}`;
        }
        return base + url;
    }
    if (isMaterialsBase) return `${base}/${url}`;
    return url;
}
