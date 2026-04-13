/**
 * 与 registry 里注册的 material 一致；设计器内 getBundleUrls / fetchMaterial 均通过 getMergeMeta('engine.config').material 合并其它来源。
 * 将 VITE_MATERIAL_BUNDLE_URLS 合入本数组，与在 material 里直接写 http://localhost:3000/bundle.json 走同一套读取链路，
 * 避免仅依赖 loadRuntimeFromBundles 内读 import.meta.env 时，在部分构建/嵌入场景下变量未注入导致联调失败。
 */
function materialUrlsFromEnv() {
    try {
        const raw = import.meta.env.VITE_MATERIAL_BUNDLE_URLS;
        if (typeof raw !== 'string' || !raw.trim()) return [];
        return raw.split(',').map(s => s.trim()).filter(Boolean);
    } catch {
        return [];
    }
}

export default {
    id: 'engine.config',
    theme: 'light',
    // 物料源：基础内置 + env（VITE_MATERIAL_BUNDLE_URLS，逗号分隔）+ 可选手写 URL
    material: [
        '/mock/bundle.json',
        // '/mock/business-materials.json',
        ...materialUrlsFromEnv()
    ],
    scripts: [],
    styles: [],
    platformId: 1
};
