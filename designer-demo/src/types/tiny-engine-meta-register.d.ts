declare module '@opentiny/tiny-engine-meta-register' {
    import { Ref } from 'vue';

    // Hook functions
    export function useCanvas(): any;
    export function useMessage(): {
        subscribe: (options: {
            topic: string;
            subscriber: string;
            callback: Function;
        }) => void;
        unsubscribe: (options: { topic: string; subscriber: string }) => void;
        publish: (options: { topic: string; data?: any }) => void;
    };
    export function useLayout(): any;
    export function useBlock(): any;
    export function usePage(): any;
    export function useNotify(): (options: {
        type: string;
        title?: string;
        message?: string;
    }) => void;
    export function useModal(): any;
    export function useHistory(): any;
    export function useProperties(): any;
    export function useMaterial(): any;
    export function useResource(): any;
    export function useTranslate(): any;
    export function useHelp(): any;
    export function useHttp(): any;
    export function useEnv(): any;
    export function useCustom(): any;
    export function useStyle(): any;
    export function useProperty(): any;
    export function useDataSource(): any;
    export function useBreadcrumb(): any;
    export function useSaveLocal(): any;

    // API functions
    export function getMetaApi(serviceId: string): any;
    export function getOptions(pluginId: string): any;
    export function getMergeMeta(metaId: string): any;
    export function getMergeMetaByType(type: string): any;
    export function getAllMergeMeta(): any;

    // Constants
    export const META_APP: any;
    export const META_SERVICE: any;

    // Other exports
    export * from './dist/index.js';
}
