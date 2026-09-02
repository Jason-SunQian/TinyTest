import { getBundleUrls } from '@/composable/loadRuntimeFromBundles';
import {
    materialsDiag,
    materialsDiagCaller,
    materialsDiagWarn,
    summarizeMaterialPayload
} from '@/composable/materialsDiag';
import {
    claimMaterialsStartupOwnership,
    hasMaterialsClearHandler,
    markMaterialsSessionReady,
    releaseMaterialsStartupOwnership,
    runExclusiveColdStart
} from '@/composable/materialsSession';

type MaterialApi = {
    addMaterials?: (
        payload: Record<string, unknown>,
        bundleUrl?: string
    ) => void;
    updateCanvasDeps?: () => Promise<unknown>;
    refreshMaterial?: () => Promise<unknown>;
    initMaterial?: (opts?: {
        isInit?: boolean;
        appData?: Record<string, unknown>;
    }) => void;
    clearMaterials?: () => void;
    dedupePanelSnippets?: () => void;
    materialState?: { components: unknown[] };
};

type ResourceApi = {
    fetchResource?: (opts?: { isInit?: boolean }) => Promise<unknown>;
};

type GetMetaApi = (id: string) => unknown;

// Claim as early as this module loads in VSCode so App fetchMaterial cannot race ahead
if (
    typeof window !== 'undefined' &&
    ((window as Window & { vscode?: unknown; vscodeBridge?: unknown }).vscode ||
        (window as Window & { vscode?: unknown; vscodeBridge?: unknown })
            .vscodeBridge)
) {
    claimMaterialsStartupOwnership();
}

const pickMaterialsPayload = (v: unknown) => {
    if (!v || typeof v !== 'object') return undefined;
    const dataLevel1 = (v as { data?: unknown }).data;
    const dataLevel2 =
        dataLevel1 && typeof dataLevel1 === 'object'
            ? (dataLevel1 as { data?: unknown }).data
            : undefined;
    const dataLevel3 =
        dataLevel2 && typeof dataLevel2 === 'object'
            ? (dataLevel2 as { data?: unknown }).data
            : undefined;
    const candidate =
        (v as { materials?: unknown }).materials ||
        (dataLevel1 &&
            typeof dataLevel1 === 'object' &&
            (dataLevel1 as { materials?: unknown }).materials) ||
        (dataLevel2 &&
            typeof dataLevel2 === 'object' &&
            (dataLevel2 as { materials?: unknown }).materials) ||
        (dataLevel3 &&
            typeof dataLevel3 === 'object' &&
            (dataLevel3 as { materials?: unknown }).materials) ||
        dataLevel1 ||
        dataLevel2;
    const isMaterialLike = (x: unknown) =>
        x &&
        typeof x === 'object' &&
        (Array.isArray((x as { components?: unknown[] }).components) ||
            Array.isArray((x as { blocks?: unknown[] }).blocks) ||
            Array.isArray((x as { packages?: unknown[] }).packages));
    if (isMaterialLike(v)) return v;
    if (isMaterialLike(candidate)) return candidate;
    return undefined;
};

/** webview 内相对路径 fetch 会得到空 body */
const toAbsoluteBundleUrl = (url: string): string => {
    if (/^https?:\/\//.test(url)) return url;
    const win = window as Window & { TINY_DESIGNER_ORIGIN?: string };
    const origin = (
        win.TINY_DESIGNER_ORIGIN ||
        (typeof import.meta !== 'undefined' &&
            (import.meta as ImportMeta & { env?: { VITE_ORIGIN?: string } }).env
                ?.VITE_ORIGIN) ||
        'http://localhost:8090'
    ).replace(/\/$/, '');
    return url.startsWith('/') ? `${origin}${url}` : `${origin}/${url}`;
};

const forceLoadFromBundleUrls = async (getMetaApi: GetMetaApi) => {
    const materialApi = getMetaApi('engine.service.material') as MaterialApi;
    if (typeof materialApi?.addMaterials !== 'function') {
        materialsDiag('forceLoad: skip (no addMaterials)');
        return false;
    }
    const bundleUrls = getBundleUrls();
    const absoluteUrls = bundleUrls
        .filter((u): u is string => typeof u === 'string')
        .map(toAbsoluteBundleUrl);
    materialsDiag('forceLoad: start', {
        bundleUrls,
        absoluteUrls,
        caller: materialsDiagCaller()
    });
    if (!absoluteUrls.length) return false;
    const settled = await Promise.allSettled(
        absoluteUrls.map(async url => {
            const res = await fetch(url, {
                cache: 'no-store'
            });
            const text = await res.text();
            let json: unknown = null;
            try {
                json = JSON.parse(text);
            } catch (e) {
                throw new Error(
                    `JSON parse fail status=${res.status} len=${text.length}: ${
                        e instanceof Error ? e.message : String(e)
                    }`
                );
            }
            return { url, json, status: res.status };
        })
    );
    let loaded = 0;
    settled.forEach((item, index) => {
        if (item.status !== 'fulfilled' || !item.value) {
            materialsDiagWarn('forceLoad: fetch rejected', {
                url: absoluteUrls[index],
                reason: item.status === 'rejected' ? String(item.reason) : null
            });
            return;
        }
        const payload = pickMaterialsPayload(item.value.json);
        materialsDiag('forceLoad: each url', {
            url: item.value.url,
            httpStatus: item.value.status,
            payload: summarizeMaterialPayload(
                payload as {
                    components?: unknown[];
                    snippets?: [];
                    packages?: unknown[];
                }
            )
        });
        if (!payload) return;
        try {
            materialApi.addMaterials?.(
                payload as Record<string, unknown>,
                item.value.url
            );
            loaded += 1;
        } catch (e) {
            materialsDiagWarn('forceLoad: addMaterials threw', {
                url: item.value.url,
                error: e instanceof Error ? e.message : String(e)
            });
        }
    });
    materialsDiag('forceLoad: done', { loaded });
    if (loaded > 0) {
        await materialApi.updateCanvasDeps?.();
        return true;
    }
    return false;
};

/**
 * VSCode + HTTP: exclusive cold start via materialsSession (NOT getMetaApi —
 * TinyEngine strips unknown API keys → runExclusiveColdStart unavailable).
 *
 * User timing: panel 1x before forceLoad, 2x after = App.vue fetchMaterial raced
 * with fallback forceLoad. Exclusive gate + direct import fixes that.
 */
const ensureInitialMaterialsLoad = async () => {
    const { getMetaApi } = await import('@opentiny/tiny-engine-meta-register');
    const isVsCodeEnv =
        typeof window !== 'undefined' &&
        ((window as Window & { vscode?: unknown; vscodeBridge?: unknown })
            .vscode ||
            (window as Window & { vscode?: unknown; vscodeBridge?: unknown })
                .vscodeBridge);
    const maxAttempts = 12;
    const delayMs = 250;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
            const resourceApi = getMetaApi(
                'engine.service.resource'
            ) as ResourceApi;
            const materialApi = getMetaApi(
                'engine.service.material'
            ) as MaterialApi;
            const bundleUrls = getBundleUrls();
            const hasHttpBundles = bundleUrls.some(
                u => typeof u === 'string' && /^https?:\/\//.test(u)
            );
            materialsDiag('startup: begin', {
                attempt,
                isVsCodeEnv: !!isVsCodeEnv,
                hasHttpBundles,
                bundleUrls,
                hasAddMaterials: typeof materialApi?.addMaterials === 'function',
                caller: materialsDiagCaller()
            });

            if (!materialApi || typeof materialApi.addMaterials !== 'function') {
                throw new Error('material service addMaterials not ready');
            }

            if (isVsCodeEnv && !hasHttpBundles && attempt < maxAttempts) {
                await new Promise(resolve => {
                    setTimeout(resolve, delayMs);
                });
                continue;
            }

            if (isVsCodeEnv && hasHttpBundles) {
                // useMaterial must register clear handler before exclusive load,
                // otherwise forceLoad stacks on top of App.vue's first fetch → 2x panel
                if (!hasMaterialsClearHandler() && attempt < maxAttempts) {
                    materialsDiag('startup: wait clear handler', { attempt });
                    await new Promise(resolve => {
                        setTimeout(resolve, delayMs);
                    });
                    continue;
                }
                materialsDiag('startup: path=exclusiveColdStart(forceLoad)', {
                    attempt,
                    hasClearHandler: hasMaterialsClearHandler(),
                    hasMetaClear: typeof materialApi.clearMaterials === 'function'
                });
                try {
                    // clear/dedupe/panel via same getMetaApi instance as addMaterials
                    await runExclusiveColdStart(
                        async () => {
                            try {
                                materialApi.initMaterial?.({ isInit: true });
                            } catch (e) {
                                materialsDiagWarn(
                                    'startup: initMaterial failed (canvas may not be ready)',
                                    { error: e }
                                );
                            }
                            const ok = await forceLoadFromBundleUrls(getMetaApi);
                            materialsDiag('startup: forceLoad inside exclusive', {
                                forceLoadOk: ok,
                                panelGroups: Array.isArray(
                                    materialApi.materialState?.components
                                )
                                    ? materialApi.materialState!.components
                                          .length
                                    : -1
                            });
                        },
                        {
                            // Prefer getMetaApi when present; else session handlers
                            // (same globalThis store after singleton fix).
                            ...(typeof materialApi.clearMaterials === 'function'
                                ? {
                                      clear: () =>
                                          materialApi.clearMaterials?.()
                                  }
                                : {}),
                            ...(materialApi.materialState
                                ? {
                                      getPanelGroups: () =>
                                          (materialApi.materialState
                                              ?.components || []) as {
                                              group?: string;
                                              children?: {
                                                  snippetName?: string;
                                                  component?: string;
                                              }[];
                                          }[]
                                  }
                                : {}),
                            ...(typeof materialApi.dedupePanelSnippets ===
                            'function'
                                ? {
                                      applyDedupe: () =>
                                          materialApi.dedupePanelSnippets?.()
                                  }
                                : {})
                        }
                    );
                } finally {
                    releaseMaterialsStartupOwnership();
                }
                // 页面初始化；fetchMaterial 会因 session ready 直接 skip
                if (typeof resourceApi?.fetchResource === 'function') {
                    await resourceApi.fetchResource({ isInit: true });
                }
                materialsDiag('startup: path=exclusiveColdStart done');
                return;
            }

            if (typeof resourceApi?.fetchResource === 'function') {
                materialsDiag('startup: path=fetchResource', { attempt });
                await resourceApi.fetchResource({ isInit: true });
                markMaterialsSessionReady();
                materialsDiag('startup: path=fetchResource done');
                return;
            }

            if (typeof materialApi?.refreshMaterial === 'function') {
                materialsDiag('startup: path=refreshMaterial', { attempt });
                await materialApi.refreshMaterial();
                markMaterialsSessionReady();
                materialsDiag('startup: path=refreshMaterial done');
                return;
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('[Materials] startup auto-load retry:', {
                attempt,
                error: e
            });
            materialsDiagWarn('startup: retry error', { attempt, error: e });
        }
        await new Promise(resolve => {
            setTimeout(resolve, delayMs);
        });
    }
    materialsDiag('startup: fallback exclusive forceLoad');
    const { getMetaApi: getMeta } = await import(
        '@opentiny/tiny-engine-meta-register'
    );
    const materialApi = getMeta('engine.service.material') as MaterialApi;
    try {
        await runExclusiveColdStart(
            async () => {
                materialApi.initMaterial?.({ isInit: true });
                await forceLoadFromBundleUrls(getMeta);
            },
            {
                ...(typeof materialApi.clearMaterials === 'function'
                    ? { clear: () => materialApi.clearMaterials?.() }
                    : {}),
                ...(materialApi.materialState
                    ? {
                          getPanelGroups: () =>
                              (materialApi.materialState?.components ||
                                  []) as {
                                  group?: string;
                                  children?: {
                                      snippetName?: string;
                                      component?: string;
                                  }[];
                              }[]
                      }
                    : {}),
                ...(typeof materialApi.dedupePanelSnippets === 'function'
                    ? {
                          applyDedupe: () =>
                              materialApi.dedupePanelSnippets?.()
                      }
                    : {})
            }
        );
    } finally {
        releaseMaterialsStartupOwnership();
    }
    // eslint-disable-next-line no-console
    console.warn(
        '[Materials] startup auto-load used fallback after retries'
    );
};

const setupAssetBundleUpdateListener = () => {
    let isRefreshingFromAssetUpdate = false;
    let hasPendingRefresh = false;
    const refreshMaterialsFromAssetUpdate = async () => {
        if (isRefreshingFromAssetUpdate) {
            hasPendingRefresh = true;
            return;
        }
        isRefreshingFromAssetUpdate = true;
        try {
            const { getMetaApi } = await import(
                '@opentiny/tiny-engine-meta-register'
            );
            const materialApi = getMetaApi(
                'engine.service.material'
            ) as MaterialApi;
            materialsDiag('asset-update: refreshMaterial', {
                bundleUrls: getBundleUrls()
            });
            if (typeof materialApi?.refreshMaterial === 'function') {
                await materialApi.refreshMaterial();
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('[AssetSync] refreshMaterial failed:', e);
        } finally {
            isRefreshingFromAssetUpdate = false;
            if (hasPendingRefresh) {
                hasPendingRefresh = false;
                refreshMaterialsFromAssetUpdate().catch(() => undefined);
            }
        }
    };

    window.addEventListener('tiny:asset-bundles-updated', () => {
        refreshMaterialsFromAssetUpdate().catch(() => undefined);
    });
};

export const setupMaterialStartupLoader = () => {
    claimMaterialsStartupOwnership();
    ensureInitialMaterialsLoad()
        .catch(() => undefined)
        .finally(() => {
            releaseMaterialsStartupOwnership();
        });
    setupAssetBundleUpdateListener();
};
