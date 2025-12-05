export interface Material {
    components: Component[];
    snippets?: Snippet[];
    blocks?: Block[];
    packages?: Package[];
}

export interface Block {
    id: number | string;
    label: string;
    framework: string;
    content: BlockResource;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    created_by?: unknown;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    updated_by?: unknown;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    created_at: Date;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    updated_at: Date;
    assets: Assets;
    createdBy: CreatedBy;
    updatedBy: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    last_build_info: BuildInfo;
    description?: unknown;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags: any[];
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    current_history: number;
    screenshot: string;
    path: string;
    occupier?: CreatedBy;
    isOfficial?: boolean;
    public: number;
    isDefault?: boolean;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    tiny_reserved?: boolean;
    author?: unknown;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    name_cn?: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    npm_name: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    created_app?: unknown;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    content_blocks?: unknown;
    histories: History[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories: any[];
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase, @typescript-eslint/no-explicit-any
    public_scope_tenants: any[];
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    histories_length: number;
    state?: unknown;
}

export interface Assets {
    material: string[];
    scripts: string[];
    styles: string[];
}

export type Resource = Omit<Component, 'component'> & {
    type: string;
    component?: string;
    item?: string;
};

export interface BlockResource {
    componentName: string;
    fileName: string;
    css?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataSource?: Record<string, any>;
    schema: Schema;
    children: Schema[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state?: Record<string, any>;
    methods: {
        [key: string]: TypeValuePair;
    };
    lifeCycles?: {
        [key: string]: TypeValuePair;
    };
    id?: string | number;
    type?: string;
    component?: string;
    label?: string;
    configure?: Configure;
    actions?: unknown;
    blockName?: string;
    properties?: Property[];
}

export interface TypeValuePair {
    type: DataTypeEnum;
    value: string;
}

export type DataTypeEnum =
    | 'JSExpression'
    | 'JSFunction'
    | 'JSResource'
    | 'JSResouce';

export interface Locale {
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    zh_CN?: string;
}

export interface Collapse {
    number: number;
    text: Locale;
}

export interface Linked {
    componentName: string;
    property: string;
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blockProperty: any;
}

export interface CreatedBy {
    id: number;
    username: string;
}

export interface History {
    id: number;
    message: string;
    content: unknown;
    assets?: Assets;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    build_info?: BuildInfo;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    created_by?: unknown;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    updated_by?: unknown;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    created_at: Date | string;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    updated_at: Date | string;
    screenshot?: string;
    path?: string;
    label?: string;
    description?: unknown;
    mode?: string | null;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    block_id: number;
    version?: string | null;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    npm_name?: string;
    i18n?: unknown;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    created_app?: unknown;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    content_blocks?: unknown;
}

export interface BuildInfo {
    result: boolean;
    versions: string[];
    endTime: string;
}

export interface Component {
    id?: number | string;
    version?: string;
    name: {
        // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
        zh_CN?: string;
    };
    component: string;
    icon: string;
    description?: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    doc_url?: string;
    screenshot?: string;
    tags?: string;
    keywords?: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    dev_mode?: string;
    npm?: Npm;
    group?: string;
    configure?: Configure;
    content?: { configure?: Configure; schema?: Schema };
    createdBy?: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    created_at?: Date | string;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    updated_at?: Date | string;
    public?: number;
    framework?: string;
    isOfficial?: boolean;
    isDefault?: boolean;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    tiny_reserved?: boolean;
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    component_metadata?: {
        events?: unknown[];
        attrs?: unknown[];
        slots?: unknown;
    };
    library?: number;
    schema: Schema;
}

export interface Configure {
    loop?: boolean;
    condition?: boolean;
    styles?: boolean;
    isContainer?: boolean;
    isModal?: boolean;
    nestingRule?: NestingRule;
    isNullNode?: boolean;
    isLayout?: boolean;
    string?: string;
    shortcuts?: {
        properties: string[];
    };
    contextMenu?: ContextMenu;
    slots?: string[];
    framework?: string;
    isPopper?: boolean;
    invalidity?: string[];
    clickCapture?: boolean;
}

export interface ContextMenu {
    actions: string[];
    disable: string[];
}

export interface Property {
    label: Locale;
    description?: Locale;
    collapse?: Collapse;
    content: Array<{
        [x: string]: unknown;
        property: string;
        label?: {
            text: Locale;
        };
        required?: boolean;
        readOnly?: boolean;
        disabled?: boolean;
        cols?: number;
        widget: {
            component: string;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            props?: Record<string, any>;
        };
        description?: Locale;
        labelPosition?: string;
        type?: string;
        defaultValue?: unknown;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rules?: any[];
        hidden?: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        device?: any[];
        onChange?: string;
        properties?: ContentProperty[];
        linked?: Linked | null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handle?: Record<string, any>;
    }>;
    name?: string;
    group?: string;
    defaultValue?: unknown;
}

export interface ContentProperty {
    label: Locale;
    content: Array<{
        property: string;
        type?: string;
        defaultValue?: boolean | string;
        label: {
            text: Locale;
        };
        widget: {
            component: string;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            props: Record<string, any>;
        };
        labelPosition?: string;
        required?: boolean;
        readOnly?: boolean;
        disabled?: boolean;
        cols?: number;
        description?: Locale;
    }>;
}

export interface Package {
    name: string;
    packageName: string;
    package?: string;
    version: string;
    script: string;
    css: string;
    others?: unknown;
}

export interface Snippet {
    group: string;
    children: SnippetChild[];
}

export interface SnippetChild {
    icon?: string;
    name?: Locale;
    schema?: Schema;
    screenshot?: string;
    snippetName?: string;
    configure?: Configure;
    group?: boolean;
    component?: string;
    description?: string;
    docUrl?: string;
    tags?: string;
    keywords?: string;
    devMode?: string;
    npm?: Dependency;
    priority?: number;
}

export interface Npm {
    package: string;
    exportName: string;
    version?: string;
    destructuring?: boolean;
    script?: string;
    css?: string;
    dependencies?: unknown;
}

export type Dependency = Omit<Npm, 'exportName'> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    components?: any;
};

export interface NestingRule {
    string?: string[] | string;
    parentWhitelist?: string[];
    descendantBlacklist?: string[];
    ancestorWhitelist?: string[];
}

export interface Schema {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props?: Record<string, any>;
    children?: Schema[];
    componentName?: string;
    componentType?: string;
    properties?: Property[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    events?: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    slots?: Record<string, any>;
    lifeCycles?: Record<string, TypeValuePair>;
    id?: string;
    condition?: boolean;
    fileName?: string;
}

export interface MaterialState {
    components: Snippet[];
    blocks: Array<{ groupId: string; groupName: string; children: Block[] }>;
    componentsDepsMap: {
        scripts: Dependency[];
        styles: Set<unknown>;
    };
    packages: never[];
}

export type ComponentMap = Dependency & { componentName: string };

export interface InitMaterialOptions {
    isInit?: boolean;
    appData?: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [x: string]: any;
        componentsMap?: ComponentMap[];
    };
}
