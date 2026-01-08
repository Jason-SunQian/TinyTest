export interface Node {
    id: string;
    componentName: string;
    props: Record<string, unknown> & {
        columns?: Array<{ slots?: Record<string, unknown> }>;
    };
    children?: Node[];
    componentType?: 'Block' | 'PageStart' | 'PageSection';
    slot?: string | Record<string, unknown>;
    params?: string[];
    loop?: Record<string, unknown>;
    loopArgs?: string[];
    condition?: boolean | Record<string, unknown>;
}

export type RootNode = Omit<Node, 'id'> & {
    id?: string;
    css?: string;
    fileName?: string;
    methods?: Record<string, unknown>;
    state?: Record<string, unknown>;
    lifeCycles?: Record<string, unknown>;
    dataSource?: unknown;
    bridge?: unknown;
    inputs?: unknown[];
    outputs?: unknown[];
    schema?: unknown;
};
