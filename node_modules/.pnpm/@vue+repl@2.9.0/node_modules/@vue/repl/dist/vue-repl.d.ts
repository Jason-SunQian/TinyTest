import { AllowedComponentProps } from 'vue';
import { ComponentCustomProps } from 'vue';
import { ComponentOptionsMixin } from 'vue';
import * as defaultCompiler from 'vue/compiler-sfc';
import { DefineComponent } from 'vue';
import type { editor } from 'monaco-editor-core';
import { ExtractPropTypes } from 'vue';
import { PropType } from 'vue';
import { SFCAsyncStyleCompileOptions } from 'vue/compiler-sfc';
import { SFCScriptCompileOptions } from 'vue/compiler-sfc';
import { SFCTemplateCompileOptions } from 'vue/compiler-sfc';
import { VNodeProps } from 'vue';

declare type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;

declare type __VLS_NonUndefinedable_2<T> = T extends undefined ? never : T;

declare type __VLS_NonUndefinedable_3<T> = T extends undefined ? never : T;

declare type __VLS_NonUndefinedable_4<T> = T extends undefined ? never : T;

declare type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

declare type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: PropType<T[K]>;
        required: true;
    };
};

declare type __VLS_TypePropsToRuntimeProps_2<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: PropType<__VLS_NonUndefinedable_2<T[K]>>;
    } : {
        type: PropType<T[K]>;
        required: true;
    };
};

declare type __VLS_TypePropsToRuntimeProps_3<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: PropType<__VLS_NonUndefinedable_3<T[K]>>;
    } : {
        type: PropType<T[K]>;
        required: true;
    };
};

declare type __VLS_TypePropsToRuntimeProps_4<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: PropType<__VLS_NonUndefinedable_4<T[K]>>;
    } : {
        type: PropType<T[K]>;
        required: true;
    };
};

declare type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};

export declare function compileFile(store: Store, { filename, code, compiled }: File_2): Promise<(string | Error)[]>;

declare const _default: DefineComponent<__VLS_TypePropsToRuntimeProps_2<EditorProps>, {}, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    change: (code: string) => void;
}, string, VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<ExtractPropTypes<__VLS_TypePropsToRuntimeProps_2<EditorProps>>> & {
    onChange?: ((code: string) => any) | undefined;
}, {}, {}>;

declare const _default_2: DefineComponent<__VLS_TypePropsToRuntimeProps_3<EditorProps>, {}, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    change: (code: string) => void;
}, string, VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<ExtractPropTypes<__VLS_TypePropsToRuntimeProps_3<EditorProps>>> & {
    onChange?: ((code: string) => any) | undefined;
}, {}, {}>;

declare type EditorComponentType = typeof _default | typeof _default_2;

declare interface EditorProps {
    value: string;
    filename: string;
    readonly?: boolean;
    mode?: PreviewMode;
}

declare class File_2 {
    filename: string;
    code: string;
    hidden: boolean;
    compiled: {
        js: string;
        css: string;
        ssr: string;
    };
    editorViewState: editor.ICodeEditorViewState | null;
    constructor(filename: string, code?: string, hidden?: boolean);
    get language(): "typescript" | "css" | "vue" | "html" | "javascript";
}
export { File_2 as File }

export declare type OutputModes = 'preview' | 'js' | 'css' | 'ssr';

export declare const Preview: DefineComponent<__VLS_TypePropsToRuntimeProps_4<{
    show: boolean;
    ssr: boolean;
}>, {
    reload: typeof reload_2;
}, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<ExtractPropTypes<__VLS_TypePropsToRuntimeProps_4<{
    show: boolean;
    ssr: boolean;
}>>>, {}, {}>;

declare type PreviewMode = 'js' | 'css' | 'ssr';

/**
 * Reload the preview iframe
 */
declare function reload(): void;

/**
 * Reload the preview iframe
 */
declare function reload_2(): void;

export declare const Repl: DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<ReplProps>, {
    theme: string;
    store: () => ReplStore;
    autoResize: boolean;
    showCompileOutput: boolean;
    showImportMap: boolean;
    showTsConfig: boolean;
    clearConsole: boolean;
    layoutReverse: boolean;
    ssr: boolean;
    previewOptions: () => {
        headHTML: string;
        bodyHTML: string;
        placeholderHTML: string;
        customCode: {
            importCode: string;
            useCode: string;
        };
    };
}>, {
    reload: typeof reload;
}, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<ReplProps>, {
    theme: string;
    store: () => ReplStore;
    autoResize: boolean;
    showCompileOutput: boolean;
    showImportMap: boolean;
    showTsConfig: boolean;
    clearConsole: boolean;
    layoutReverse: boolean;
    ssr: boolean;
    previewOptions: () => {
        headHTML: string;
        bodyHTML: string;
        placeholderHTML: string;
        customCode: {
            importCode: string;
            useCode: string;
        };
    };
}>>>, {
    ssr: boolean;
    theme: "dark" | "light";
    store: Store;
    previewOptions: {
        headHTML?: string | undefined;
        bodyHTML?: string | undefined;
        placeholderHTML?: string | undefined;
        customCode?: {
            importCode?: string | undefined;
            useCode?: string | undefined;
        } | undefined;
    };
    showCompileOutput: boolean;
    showTsConfig: boolean;
    showImportMap: boolean;
    autoResize: boolean;
    clearConsole: boolean;
    layoutReverse: boolean;
}, {}>;

export declare interface ReplProps {
    theme?: 'dark' | 'light';
    editor: EditorComponentType;
    store?: Store;
    autoResize?: boolean;
    showCompileOutput?: boolean;
    showImportMap?: boolean;
    showTsConfig?: boolean;
    clearConsole?: boolean;
    sfcOptions?: SFCOptions;
    layout?: 'horizontal' | 'vertical';
    layoutReverse?: boolean;
    ssr?: boolean;
    previewOptions?: {
        headHTML?: string;
        bodyHTML?: string;
        placeholderHTML?: string;
        customCode?: {
            importCode?: string;
            useCode?: string;
        };
    };
}

export declare class ReplStore implements Store {
    state: StoreState;
    compiler: typeof defaultCompiler;
    vueVersion?: string;
    productionMode: boolean;
    options?: SFCOptions;
    initialShowOutput: boolean;
    initialOutputMode: OutputModes;
    reloadLanguageTools: undefined | (() => void);
    customElement: boolean | string | RegExp | (string | RegExp)[];
    private defaultVueRuntimeDevURL;
    private defaultVueRuntimeProdURL;
    private defaultVueServerRendererURL;
    private pendingCompiler;
    constructor({ serializedState, defaultVueRuntimeURL, defaultVueRuntimeProdURL, defaultVueServerRendererURL, showOutput, outputMode, productionMode, customElement, }?: StoreOptions);
    get defaultVueRuntimeURL(): string;
    init(): void;
    private initTsConfig;
    setTsConfig(config: any): void;
    getTsConfig(): any;
    setActive(filename: string): void;
    addFile(fileOrFilename: string | File_2): void;
    deleteFile(filename: string): void;
    renameFile(oldFilename: string, newFilename: string): void;
    serialize(): string;
    getFiles(): Record<string, string>;
    setFiles(newFiles: Record<string, string>, mainFile?: string): Promise<void>;
    private forceSandboxReset;
    private initImportMap;
    getImportMap(): any;
    setImportMap(map: {
        imports: Record<string, string>;
        scopes?: Record<string, Record<string, string>>;
    }): void;
    setTypeScriptVersion(version: string): void;
    setVueVersion(version: string): Promise<void>;
    resetVueVersion(): void;
    toggleProduction(): void;
}

export declare interface SFCOptions {
    script?: Partial<SFCScriptCompileOptions>;
    style?: Partial<SFCAsyncStyleCompileOptions>;
    template?: Partial<SFCTemplateCompileOptions>;
}

export declare interface Store {
    state: StoreState;
    options?: SFCOptions;
    compiler: typeof defaultCompiler;
    vueVersion?: string;
    init: () => void;
    setActive: (filename: string) => void;
    addFile: (filename: string | File_2) => void;
    deleteFile: (filename: string) => void;
    renameFile: (oldFilename: string, newFilename: string) => void;
    getImportMap: () => any;
    getTsConfig?: () => any;
    reloadLanguageTools?: undefined | (() => void);
    initialShowOutput: boolean;
    initialOutputMode: OutputModes;
    customElement: boolean | string | RegExp | (string | RegExp)[];
}

export declare interface StoreOptions {
    serializedState?: string;
    showOutput?: boolean;
    outputMode?: OutputModes | string;
    productionMode?: boolean;
    defaultVueRuntimeURL?: string;
    defaultVueRuntimeProdURL?: string;
    defaultVueServerRendererURL?: string;
    customElement?: boolean | string | RegExp | (string | RegExp)[];
}

export declare interface StoreState {
    mainFile: string;
    files: Record<string, File_2>;
    activeFile: File_2;
    errors: (string | Error)[];
    vueRuntimeURL: string;
    vueServerRendererURL: string;
    typescriptVersion: string;
    /** @deprecated use `locale` instead */
    typescriptLocale?: string | undefined;
    locale?: string | undefined;
    resetFlip: boolean;
    /** \{ dependencyName: version \} */
    dependencyVersion?: Record<string, string>;
}

export { }
