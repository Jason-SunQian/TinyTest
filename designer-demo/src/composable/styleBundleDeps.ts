import { getMergeMeta, useResource } from '@opentiny/tiny-engine-meta-register';

type StyleBundleManifest = {
    version?: string;
    tokens?: string[];
    overrides?: string[];
    themes?: Record<string, string>;
    utilities?: {
        mode?: 'runtime' | 'prebuilt';
        css?: string;
        runtimeScript?: string;
    };
};

type ScriptDep = {
    package?: string;
    script?: string;
    css?: string;
    [k: string]: unknown;
};

type CanvasDeps = {
    scripts?: ScriptDep[];
    styles?: string[] | Set<string>;
    /** 已由样式 bundle 增强过，避免 init_canvas_deps 循环 publish */
    styleBundleAugmented?: boolean;
    [k: string]: unknown;
};

function uniqStrings(list: string[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const s of list) {
        if (s && !seen.has(s)) {
            seen.add(s);
            out.push(s);
        }
    }
    return out;
}

function getBaseFromUrl(url: string): string {
    const clean = url.replace(/[#?].*$/, '').replace(/\/[^/]*$/, '');
    return clean.replace(/\/$/, '');
}

function resolveUrl(url: string, base: string): string {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (!base) return url;
    const b = base.replace(/\/$/, '');
    if (url.startsWith('/')) return `${b}${url}`;
    return `${b}/${url.replace(/^\.\//, '').replace(/^\//, '')}`;
}

function getDesignerHttpOrigin(): string {
    if (typeof window === 'undefined') return '';
    /* eslint-disable @typescript-eslint/naming-convention -- 全局变量/环境变量名保持大写下划线 */
    const win = window as Window & { TINY_DESIGNER_ORIGIN?: string };
    type EnvWithOrigin = ImportMetaEnv & { VITE_ORIGIN?: string };
    const origin = (
        win.TINY_DESIGNER_ORIGIN ||
        (import.meta.env as EnvWithOrigin).VITE_ORIGIN ||
        ''
    ).toString();
    /* eslint-enable @typescript-eslint/naming-convention */
    return origin.replace(/\/$/, '');
}

function toAbsoluteStyleBundleUrl(url: string): string {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (typeof window === 'undefined') return url;

    // 在 VSCode webview 中 location.origin 是 vscode-webview://...，不能用于 fetch。
    // 这里优先使用插件/宿主注入的 HTTP origin。
    const httpOrigin = getDesignerHttpOrigin();
    if (httpOrigin) {
        return url.startsWith('/')
            ? `${httpOrigin}${url}`
            : `${httpOrigin}/${url}`;
    }

    // 非 VSCode 环境：直接使用浏览器 origin（通常是 http://localhost:xxxx）
    const { origin } = window.location;
    return url.startsWith('/') ? `${origin}${url}` : `${origin}/${url}`;
}

function getStyleBundleUrls(): string[] {
    const engineCfg = getMergeMeta('engine.config') as
        | { styleBundles?: unknown }
        | undefined;
    const fromConfig = engineCfg?.styleBundles ?? [];
    const configUrls = (Array.isArray(fromConfig) ? fromConfig : [fromConfig])
        .map((u: unknown) =>
            typeof u === 'string' ? u : (u as { url?: string })?.url
        )
        .filter((u): u is string => typeof u === 'string');

    /* eslint-disable @typescript-eslint/naming-convention -- 全局变量/环境变量名保持大写下划线 */
    type WindowWithStyleUrls = Window & { TINY_STYLE_BUNDLE_URLS?: string[] };
    const windowUrls = Array.isArray(
        typeof window !== 'undefined' &&
            (window as WindowWithStyleUrls).TINY_STYLE_BUNDLE_URLS
    )
        ? ((window as WindowWithStyleUrls).TINY_STYLE_BUNDLE_URLS as string[])
        : [];

    type EnvWithStyleUrls = ImportMetaEnv & { VITE_STYLE_BUNDLE_URLS?: string };
    const envRaw = (import.meta.env as EnvWithStyleUrls).VITE_STYLE_BUNDLE_URLS;
    /* eslint-enable @typescript-eslint/naming-convention */
    const envUrls =
        typeof envRaw === 'string'
            ? envRaw
                  .split(',')
                  .map(s => s.trim())
                  .filter(Boolean)
            : [];

    const merged = uniqStrings([...configUrls, ...windowUrls, ...envUrls]);
    return merged;
}

async function fetchStyleManifests(): Promise<
    Array<{ url: string; base: string; manifest: StyleBundleManifest }>
> {
    const urls = getStyleBundleUrls();
    const out: Array<{
        url: string;
        base: string;
        manifest: StyleBundleManifest;
    }> = [];
    for (const u of urls) {
        try {
            const absoluteUrl = toAbsoluteStyleBundleUrl(u);
            const res = await fetch(absoluteUrl).then(r => r.json());
            const base = getBaseFromUrl(absoluteUrl);
            if (res && typeof res === 'object') {
                out.push({
                    url: absoluteUrl,
                    base,
                    manifest: res as StyleBundleManifest
                });
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('[StyleBundle] 拉取 styles.json 失败:', u, e);
        }
    }
    return out;
}

function pickThemeCss(
    manifest: StyleBundleManifest,
    base: string,
    theme?: string
): string[] {
    const themes = manifest.themes || {};
    if (!themes || typeof themes !== 'object') return [];
    const key =
        theme && themes[theme]
            ? theme
            : themes['default-light']
            ? 'default-light'
            : '';
    const css = key ? themes[key] : '';
    return css ? [resolveUrl(css, base)] : [];
}

function manifestsToDeps(
    manifests: Array<{
        url: string;
        base: string;
        manifest: StyleBundleManifest;
    }>,
    theme?: string
): { styles: string[]; scripts: ScriptDep[] } {
    const styles: string[] = [];
    const scripts: ScriptDep[] = [];

    for (const { base, manifest } of manifests) {
        const tokens = Array.isArray(manifest.tokens) ? manifest.tokens : [];
        const overrides = Array.isArray(manifest.overrides)
            ? manifest.overrides
            : [];
        for (const css of [...tokens, ...overrides]) {
            if (typeof css === 'string' && css)
                styles.push(resolveUrl(css, base));
        }
        pickThemeCss(manifest, base, theme).forEach(s => styles.push(s));

        const util = manifest.utilities;
        if (util && typeof util === 'object') {
            if (typeof util.css === 'string' && util.css) {
                styles.push(resolveUrl(util.css, base));
            }
            if (
                util.mode === 'runtime' &&
                typeof util.runtimeScript === 'string' &&
                util.runtimeScript
            ) {
                scripts.push({
                    package: '@local/unocss-runtime',
                    script: resolveUrl(util.runtimeScript, base)
                });
            }
        }
    }

    return { styles: uniqStrings(styles), scripts };
}

export function setupStyleBundleDepsAugmenter(
    subscribe: (opts: {
        topic: string;
        subscriber: string;
        callback: (data: unknown) => void;
    }) => void,
    publish: (opts: { topic: string; data: unknown }) => void
) {
    let extra: { styles: string[]; scripts: ScriptDep[] } | null = null;
    let loading: Promise<void> | null = null;
    let lastPublishedSignature: string | null = null;
    let appliedToMaterialsDeps = false;

    type ScriptDepItem = NonNullable<CanvasDeps['scripts']>[number];

    const applyExtraToMaterialsDeps = () => {
        if (!extra) return false;
        const state = useResource().appSchemaState;
        const deps = state.materialsDeps;
        const stylesSet: Set<unknown> = deps.styles || new Set();
        let changed = false;
        for (const s of extra.styles) {
            if (!stylesSet.has(s)) {
                stylesSet.add(s);
                changed = true;
            }
        }
        deps.styles = stylesSet;

        const scriptsArr: ScriptDepItem[] = Array.isArray(deps.scripts)
            ? deps.scripts
            : [];
        const extraScripts: ScriptDepItem[] = Array.isArray(extra.scripts)
            ? extra.scripts
            : [];
        for (const s of extraScripts) {
            const key = s.package || s.script;
            if (!key) continue;
            const exists = scriptsArr.some(
                x => (x?.package || x?.script) === key
            );
            if (!exists) {
                scriptsArr.push(s);
                changed = true;
            }
        }
        deps.scripts = scriptsArr;
        return changed;
    };

    const ensureLoaded = (theme?: string) => {
        if (loading) return loading;
        loading = (async () => {
            const manifests = await fetchStyleManifests();
            extra = manifestsToDeps(manifests, theme);
            // 将样式写入 materialsDeps 源数据，避免仅靠 init_canvas_deps 消息层补丁导致画布回传后丢失，从而循环重载
            if (!appliedToMaterialsDeps) {
                try {
                    applyExtraToMaterialsDeps();
                    appliedToMaterialsDeps = true;
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.warn('[StyleBundle] 写入 materialsDeps 失败:', e);
                }
            }
            // eslint-disable-next-line no-console
            console.log(
                '[StyleBundle] 已加载样式 bundles，styles:',
                extra.styles.length,
                'scripts:',
                (extra.scripts || []).length
            );
        })().finally(() => {
            loading = null;
        });
        return loading;
    };

    subscribe({
        topic: 'init_canvas_deps',
        subscriber: 'designer-demo.style-bundle-deps-augmenter',
        callback: data => {
            const deps = (data || {}) as CanvasDeps;
            if (deps.styleBundleAugmented) return;
            // 先异步确保加载；加载完成后会再次触发 publish（通过本次回调的重入）
            ensureLoaded().then(() => {
                if (
                    !extra ||
                    (extra.styles.length === 0 && !(extra.scripts || []).length)
                )
                    return;
                // 确保源数据已包含（即使画布丢弃了消息层字段，下一次 getCanvasDeps 也会带上）
                try {
                    applyExtraToMaterialsDeps();
                } catch {
                    // ignore
                }

                const baseStyles = Array.isArray(deps.styles)
                    ? deps.styles
                    : Array.from(deps.styles || []);
                const baseStyleList = baseStyles.filter(
                    s => typeof s === 'string'
                ) as string[];
                const baseStyleSet = new Set(baseStyleList);
                const missingStyles = extra.styles.filter(
                    s => !baseStyleSet.has(s)
                );
                const mergedStyles =
                    missingStyles.length > 0
                        ? uniqStrings([...baseStyleList, ...missingStyles])
                        : baseStyleList;

                const baseScripts = Array.isArray(deps.scripts)
                    ? deps.scripts
                    : [];
                const extraScripts = Array.isArray(extra.scripts)
                    ? extra.scripts
                    : [];
                const mergedScripts = [...baseScripts];
                let addedScript = false;
                for (const s of extraScripts) {
                    const key = s?.package || s?.script;
                    if (!key) continue;
                    const exists = mergedScripts.some(
                        x => (x.package || x.script) === key
                    );
                    if (!exists) {
                        mergedScripts.push(s);
                        addedScript = true;
                    }
                }

                // 如果已经包含所有需要的 style/script，就不再 publish，避免画布回传 deps 时触发循环。
                if (missingStyles.length === 0 && !addedScript) return;

                const next: CanvasDeps = {
                    ...deps,
                    scripts: mergedScripts,
                    styles: mergedStyles,
                    styleBundleAugmented: true
                };
                const signature = JSON.stringify({
                    s: mergedStyles,
                    p: mergedScripts.map(x => x.package || x.script || '')
                });
                if (signature === lastPublishedSignature) return;
                lastPublishedSignature = signature;
                publish({ topic: 'init_canvas_deps', data: next });
            });
        }
    });
}
