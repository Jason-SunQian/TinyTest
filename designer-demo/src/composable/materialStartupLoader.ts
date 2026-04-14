import { getBundleUrls } from '@/composable/loadRuntimeFromBundles';

type MaterialApi = {
    addMaterials?: (
        payload: Record<string, unknown>,
        bundleUrl?: string
    ) => void;
    updateCanvasDeps?: () => Promise<unknown>;
    refreshMaterial?: () => Promise<unknown>;
};

type ResourceApi = {
    fetchResource?: (opts?: { isInit?: boolean }) => Promise<unknown>;
};

type GetMetaApi = (id: string) => unknown;

const pickMaterialsPayload = (v: any) => {
    if (!v || typeof v !== 'object') return undefined;
    const candidate =
        v.materials ||
        v?.data?.materials ||
        v?.data?.data?.materials ||
        v?.data?.data?.data?.materials ||
        v?.data ||
        v?.data?.data;
    const isMaterialLike = (x: any) =>
        x &&
        typeof x === 'object' &&
        (Array.isArray(x.components) ||
            Array.isArray(x.blocks) ||
            Array.isArray(x.packages));
    if (isMaterialLike(v)) return v;
    if (isMaterialLike(candidate)) return candidate;
    return undefined;
};

const forceLoadFromBundleUrls = async (getMetaApi: GetMetaApi) => {
    const materialApi = getMetaApi('engine.service.material') as MaterialApi;
    if (typeof materialApi?.addMaterials !== 'function') {
        return false;
    }
    const bundleUrls = getBundleUrls();
    if (!bundleUrls.length) return false;
    const settled = await Promise.allSettled(
        bundleUrls.map(async url => {
            if (typeof url !== 'string') return null;
            const res = await fetch(url, {
                cache: 'no-store'
            });
            const json = await res.json();
            return { url, json };
        })
    );
    let loaded = 0;
    settled.forEach(item => {
        if (item.status !== 'fulfilled' || !item.value) return;
        const payload = pickMaterialsPayload(item.value.json);
        if (!payload) return;
        materialApi.addMaterials?.(payload, item.value.url);
        loaded += 1;
    });
    if (loaded > 0) {
        await materialApi.updateCanvasDeps?.();
        return true;
    }
    return false;
};

const ensureInitialMaterialsLoad = async () => {
    const { getMetaApi } = await import('@opentiny/tiny-engine-meta-register');
    const maxAttempts = 12;
    const delayMs = 250;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
            const resourceApi = getMetaApi(
                'engine.service.resource'
            ) as ResourceApi;
            if (typeof resourceApi?.fetchResource === 'function') {
                await resourceApi.fetchResource({ isInit: true });
                await forceLoadFromBundleUrls(getMetaApi);
                return;
            }
            const materialApi = getMetaApi('engine.service.material') as MaterialApi;
            if (typeof materialApi?.refreshMaterial === 'function') {
                await materialApi.refreshMaterial();
                await forceLoadFromBundleUrls(getMetaApi);
                return;
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('[Materials] startup auto-load retry:', {
                attempt,
                error: e
            });
        }
        await new Promise(resolve => {
            setTimeout(resolve, delayMs);
        });
    }
    await forceLoadFromBundleUrls(getMetaApi);
    // eslint-disable-next-line no-console
    console.warn(
        '[Materials] startup auto-load skipped: service not ready after retries'
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
            const materialApi = getMetaApi('engine.service.material') as MaterialApi;
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
                refreshMaterialsFromAssetUpdate().catch(() => {});
            }
        }
    };

    window.addEventListener('tiny:asset-bundles-updated', () => {
        refreshMaterialsFromAssetUpdate().catch(() => {});
    });
};

export const setupMaterialStartupLoader = () => {
    ensureInitialMaterialsLoad().catch(() => {});
    setupAssetBundleUpdateListener();
};

