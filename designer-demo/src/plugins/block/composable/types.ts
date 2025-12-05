export interface Property {
    label: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        zh_CN?: string;
    };
    description: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        zh_CN?: string;
    };
    collapse: {
        number: number;
        text: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            zh_CN?: string;
        };
    };
    content?: BlockProperty[];
}

export interface BlockContent {
    componentName: string;
    blockName?: string;
    fileName: string;
    css?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: any[];
    schema: {
        properties?: Property[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        events?: Record<string, any>;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state?: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    methods: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataSource?: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    i18n?: any;
}

export interface BlockOccupier {
    id: number;
    username: string;
}

export interface Block {
    id?: string | number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    name_cn?: string;
    label: string;
    path?: string;
    categories: string[];
    public: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    is_published?: number;
    framework: string;
    content: BlockContent;
    occupier?: BlockOccupier | null;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    created_at?: string | Date;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    updated_at?: string | Date;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    histories?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assets?: any;
}

export interface BlockGroup {
    id: string;
    name: string;
    desc: string;
    app: {
        id: string | number;
        name: string;
    };
    blocks: Array<{ data: Block }>;
    groupId: string;
    groupName: string;
}

export interface BlockProperty {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    linked?: { property: any; blockProperty: any } | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    property: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValue: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    widget?: any;
}

export interface SchemaData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    langs: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    methods: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state: Record<string, any>;
    classNameList: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contentList: any[];
}

export type ParsePropToDataOptons = Pick<
    SchemaData,
    'langs' | 'methods' | 'state'
> & {
    prop: {
        type: string;
        key: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: any;
    };
};

export type ParseChildPropsOptions = Pick<
    SchemaData,
    'langs' | 'methods' | 'state'
> & {
    child: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        props: Record<string, any>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [x: string]: any;
    };
};

export interface CreateBlockOptions {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    name_cn: string;
    label: string;
    path?: string;
    categories: string[];
}

export type CreateEmptyBlockOptions = Pick<
    Block,
    'name_cn' | 'label' | 'path' | 'categories'
>;
