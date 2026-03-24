/**
 * 从物料 bundle 中加载 runtime 模块，实现设计器与主工程 runtime 解耦。
 * 主工程在 bundle.json 中声明 runtimeScript，设计器优先加载该脚本；
 * 若无或加载失败，则回退到设计器内置 runtime。
 */
import type { App } from 'vue';
import { getMergeMeta } from '@opentiny/tiny-engine-meta-register';

/** 与 getMaterialsRes 一致的 bundle URL 来源，合并 engine.config.material、window、env */
export function getBundleUrls(): string[] {
    const fromConfig = getMergeMeta('engine.config')?.material || [];
    const configUrls = (Array.isArray(fromConfig) ? fromConfig : [fromConfig])
        .map((u: unknown) =>
            typeof u === 'string' ? u : (u as { url?: string })?.url
        )
        .filter((u): u is string => typeof u === 'string');

    /* eslint-disable @typescript-eslint/naming-convention -- 环境变量/全局变量名保持大写下划线 */
    type WindowWithBundleUrls = Window & {
        TINY_MATERIAL_BUNDLE_URLS?: string[];
    };
    const fromWindow = (typeof window !== 'undefined' &&
        (window as WindowWithBundleUrls).TINY_MATERIAL_BUNDLE_URLS) as
        | string[]
        | undefined;
    const windowUrls = Array.isArray(fromWindow) ? fromWindow : [];

    type EnvWithBundleUrls = ImportMetaEnv & {
        VITE_MATERIAL_BUNDLE_URLS?: string;
    };
    const fromEnv = (import.meta.env as EnvWithBundleUrls)
        .VITE_MATERIAL_BUNDLE_URLS;
    /* eslint-enable @typescript-eslint/naming-convention */

    const envUrls =
        typeof fromEnv === 'string'
            ? fromEnv
                  .split(',')
                  .map(s => s.trim())
                  .filter(Boolean)
            : [];

    const seen = new Set<string>();
    const result: string[] = [];
    for (const u of [...configUrls, ...windowUrls, ...envUrls]) {
        if (u && !seen.has(u)) {
            seen.add(u);
            result.push(u);
        }
    }
    // 优先返回 HTTP(S) bundle（主工程远程物料），避免 webview 本地 URI 抢占解析基准导致资源回落到错误地址。
    const httpFirst = result.filter(
        u => u.startsWith('http://') || u.startsWith('https://')
    );
    const nonHttp = result.filter(
        u => !u.startsWith('http://') && !u.startsWith('https://')
    );
    return [...httpFirst, ...nonHttp];
}

/**
 * 从 bundle URL 推导其 base（用于解析 script/css 相对路径）。
 * 例：http://localhost:3000/bundle.json → http://localhost:3000
 */
export function getBundleBaseFromUrl(bundleUrl: string): string {
    const clean = bundleUrl.replace(/[#?].*$/, '').replace(/\/[^/]*$/, '').replace(/\/$/, '');
    if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
    if (typeof window !== 'undefined') {
        const origin = window.location.origin;
        return clean.startsWith('/') ? `${origin}${clean}` : `${origin}/${clean}`;
    }
    return clean;
}

/**
 * 从物料 bundle URL 列表中取第一个 HTTP URL 的 base，作为物料脚本/样式的解析基准。
 * 设计器加载组件时应用此 base，而非 design 的 origin（8090）。
 */
export function getMaterialsBaseFromBundleUrls(): string | null {
    const urls = getBundleUrls();
    for (const u of urls) {
        if (typeof u === 'string' && (u.startsWith('http://') || u.startsWith('https://'))) {
            const base = getBundleBaseFromUrl(u);
            if (base) return base;
        }
    }
    return null;
}

/** 在 webview 中 fetch 相对路径会被解析为 vscode-webview:// 导致 CSP 拦截，需转成设计器 HTTP origin 的绝对 URL */
function toAbsoluteBundleUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (typeof window === 'undefined') return url;
    const win = window as Window & { TINY_DESIGNER_ORIGIN?: string };
    const origin = (
        win.TINY_DESIGNER_ORIGIN ||
        (import.meta.env as { VITE_ORIGIN?: string }).VITE_ORIGIN ||
        'http://localhost:8090'
    ).replace(/\/$/, '');
    return url.startsWith('/') ? `${origin}${url}` : `${origin}/${url}`;
}

/** 将相对 URL 解析为基于 base 的绝对 URL */
function resolveUrl(url: string, base: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) {
        const origin = base.replace(/\/[^/]*$/, '');
        const regex = /^(https?:\/\/[^/]+)/;
        const match = regex.exec(origin);
        return match
            ? `${match[1]}${url}`
            : `${base.replace(/\/[^/]*$/, '')}${url}`;
    }
    const baseDir = base.replace(/\/[^/]*$/, '/');
    return new URL(url, baseDir).href;
}

/** 获取 bundle 的 base URL（用于解析相对路径） */
function getBundleBase(bundleUrl: string): string {
    const clean = bundleUrl.replace(/[#?].*$/, '');
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
        return clean.replace(/\/[^/]*$/, '/');
    }
    if (typeof window !== 'undefined') {
        const base = `${window.location.origin}${
            clean.startsWith('/') ? '' : '/'
        }`;
        return `${base.replace(/\/$/, '')}/`;
    }
    return clean.replace(/\/[^/]*$/, '/');
}

/** 从 bundle JSON 中提取 runtimeScript URL */
function extractRuntimeScript(
    payload: unknown,
    bundleBase: string
): string | null {
    if (!payload || typeof payload !== 'object') return null;
    const obj = payload as Record<string, unknown>;
    const script =
        typeof obj.runtimeScript === 'string'
            ? obj.runtimeScript
            : obj.data &&
              typeof obj.data === 'object' &&
              typeof (obj.data as Record<string, unknown>).runtimeScript ===
                  'string'
            ? ((obj.data as Record<string, unknown>).runtimeScript as string)
            : undefined;
    if (!script || typeof script !== 'string') return null;
    return resolveUrl(script, bundleBase);
}

/**
 * 从物料 bundle 中解析出第一个 runtimeScript URL。
 * 使用原生 fetch 拉取，避免 Http 的 preResponse 拦截器返回 res.data.data 导致 runtimeScript 丢失。
 * @returns runtimeScript 的绝对 URL，若无则返回 null
 */
export async function findRuntimeScriptUrl(): Promise<string | null> {
    const bundleUrls = getBundleUrls();
    // eslint-disable-next-line no-console
    console.log('[loadRuntimeFromBundles] bundle URL 列表:', bundleUrls);
    if (!bundleUrls.length) return null;

    for (const bundleUrl of bundleUrls) {
        try {
            const absoluteUrl = toAbsoluteBundleUrl(bundleUrl);
            const res = await fetch(absoluteUrl).then(r => r.json());
            const base = getBundleBase(absoluteUrl);
            const url = extractRuntimeScript(res, base);
            // eslint-disable-next-line no-console
            console.log(
                '[loadRuntimeFromBundles] 已拉取',
                bundleUrl,
                'runtimeScript:',
                url ?? '无'
            );
            if (url) return url;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(
                '[loadRuntimeFromBundles] 拉取 bundle 失败:',
                bundleUrl,
                e
            );
        }
    }
    return null;
}

export interface RuntimeModule {
    installRuntimeCompat: (app: App) => void;
}

/**
 * 加载 runtime 模块：优先从物料 bundle 的 runtimeScript 加载，失败则使用设计器内置 runtime。
 */
export async function loadRuntimeModule(): Promise<RuntimeModule> {
    const url = await findRuntimeScriptUrl();
    if (url) {
        try {
            // eslint-disable-next-line no-console
            console.log(
                '[loadRuntimeFromBundles] 从 bundle 加载 runtime:',
                url
            );
            // eslint-disable-next-line no-inline-comments -- @vite-ignore 必须内联以使 Vite 识别
            const mod = await import(/* @vite-ignore */ url);
            if (mod && typeof mod.installRuntimeCompat === 'function') {
                // eslint-disable-next-line no-console
                console.log(
                    '[loadRuntimeFromBundles] 已从 bundle 加载 runtime 成功'
                );
                return mod as RuntimeModule;
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(
                '[loadRuntimeFromBundles] 从 bundle 加载 runtime 失败，回退到内置 runtime:',
                e
            );
        }
    } else {
        // eslint-disable-next-line no-console
        console.log(
            '[loadRuntimeFromBundles] 未找到 runtimeScript，使用设计器内置 runtime'
        );
    }
    return import('@/runtime');
}
