import { ComputedRef } from 'vue';
import * as defaultCompiler from 'vue/compiler-sfc';
import { editor } from 'monaco-editor-core';
import { version as languageToolsVersion } from '@vue/language-service/package.json';
import { Ref } from 'vue';
import { SFCAsyncStyleCompileOptions } from 'vue/compiler-sfc';
import { SFCScriptCompileOptions } from 'vue/compiler-sfc';
import { SFCTemplateCompileOptions } from 'vue/compiler-sfc';
import { ToRefs } from 'vue';
import { UnwrapRef } from 'vue';

export declare function compileFile(store: Store, { filename, code, compiled }: File_2): Promise<(string | Error)[]>;

declare type EditorMode = 'js' | 'css' | 'ssr';

declare class File_2 {
    filename: string;
    code: string;
    hidden: boolean;
    compiled: {
        js: string;
        css: string;
        ssr: string;
        clientMap: string;
        ssrMap: string;
    };
    editorViewState: editor.ICodeEditorViewState | null;
    constructor(filename: string, code?: string, hidden?: boolean);
    get language(): "css" | "vue" | "typescript" | "html" | "javascript";
}
export { File_2 as File }

export declare interface ImportMap {
    imports?: Record<string, string | undefined>;
    scopes?: Record<string, Record<string, string>>;
}

export { languageToolsVersion }

export declare function mergeImportMap(a: ImportMap, b: ImportMap): ImportMap;

declare type OutputModes = 'preview' | 'ssr output' | EditorMode;

export declare interface ReplStore extends UnwrapRef<StoreState> {
    activeFile: File_2;
    /** Loading compiler */
    loading: boolean;
    init(): void;
    setActive(filename: string): void;
    addFile(filename: string | File_2): void;
    deleteFile(filename: string): void;
    renameFile(oldFilename: string, newFilename: string): void;
    getImportMap(): ImportMap;
    setImportMap(map: ImportMap, merge?: boolean): void;
    getTsConfig(): Record<string, any>;
    serialize(): string;
    /**
     * Deserializes the given string to restore the REPL store state.
     * @param serializedState - The serialized state string.
     * @param checkBuiltinImportMap - Whether to check the built-in import map. Default to true
     */
    deserialize(serializedState: string, checkBuiltinImportMap?: boolean): void;
    getFiles(): Record<string, string>;
    setFiles(newFiles: Record<string, string>, mainFile?: string): Promise<void>;
}

export declare interface SFCOptions {
    script?: Partial<SFCScriptCompileOptions>;
    style?: Partial<SFCAsyncStyleCompileOptions>;
    template?: Partial<SFCTemplateCompileOptions>;
}

export declare type Store = Pick<ReplStore, 'files' | 'activeFile' | 'mainFile' | 'errors' | 'showOutput' | 'outputMode' | 'sfcOptions' | 'ssrOutput' | 'compiler' | 'vueVersion' | 'locale' | 'typescriptVersion' | 'dependencyVersion' | 'reloadLanguageTools' | 'init' | 'setActive' | 'addFile' | 'deleteFile' | 'renameFile' | 'getImportMap' | 'getTsConfig'>;

export declare type StoreState = ToRefs<{
    files: Record<string, File_2>;
    activeFilename: string;
    mainFile: string;
    template: {
        welcomeSFC?: string;
        newSFC?: string;
    };
    builtinImportMap: ImportMap;
    errors: (string | Error)[];
    showOutput: boolean;
    outputMode: OutputModes;
    sfcOptions: SFCOptions;
    ssrOutput: {
        html: string;
        context: unknown;
    };
    /** `@vue/compiler-sfc` */
    compiler: typeof defaultCompiler;
    vueVersion: string | null;
    locale: string | undefined;
    typescriptVersion: string;
    /** \{ dependencyName: version \} */
    dependencyVersion: Record<string, string>;
    reloadLanguageTools?: (() => void) | undefined;
}>;

export declare function useStore({ files, activeFilename, // set later
    mainFile, template, builtinImportMap, // set later
    errors, showOutput, outputMode, sfcOptions, compiler, vueVersion, locale, typescriptVersion, dependencyVersion, reloadLanguageTools, }?: Partial<StoreState>, serializedState?: string): ReplStore;

export declare function useVueImportMap(defaults?: {
    runtimeDev?: string | (() => string);
    runtimeProd?: string | (() => string);
    serverRenderer?: string | (() => string);
    vueVersion?: string | null;
}): {
    productionMode: Ref<boolean, boolean>;
    importMap: ComputedRef<ImportMap>;
    vueVersion: Ref<string | null, string | null>;
    defaultVersion: string;
};

export { }
