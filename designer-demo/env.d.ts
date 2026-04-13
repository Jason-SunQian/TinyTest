/// <reference types="vite/client" />

/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention */
declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<
        Record<string, never>,
        Record<string, never>,
        unknown
    >;
    export default component;
}

declare module 'virtual:svg-icons-register';

interface ImportMetaEnv {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    readonly VITE_USE_MOCK?: string;
    /** 逗号分隔的物料 bundle.json URL；已并入 engine.config.js 的 material，与手写进 material 同源 */
    readonly VITE_MATERIAL_BUNDLE_URLS?: string;
    readonly VITE_STYLE_BUNDLE_URLS?: string;
    readonly VITE_COMPLETION_CONFIG_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module '@opentiny/tiny-engine' {
    export function init(options: any): void;
}

declare module '@opentiny/tiny-engine-meta-register' {
    export const META_SERVICE: Record<string, string>;
    export const META_APP: Record<string, string>;
}

declare module '@opentiny/tiny-engine-vite-config' {
    export function useTinyEngineBaseConfig(options: any): any;
}
