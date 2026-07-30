/* eslint-disable @typescript-eslint/naming-convention */
declare module '@opentiny/tiny-engine-common' {
    import type { Component } from 'vue';

    export const VueMonaco: Component;
    export const MonacoEditor: Component;
    export const PublicIcon: Component;
    export const ToolbarBase: Component;
    export const I18nInjectionKey: symbol;
    export const SvgButton: Component;
    export const Modal: Component;
    export const Notify: Component;
    export const Search: Component;
    export const Select: Component;
    export const Option: Component;
    export const Checkbox: Component;
    export const Form: Component;
    export const FormItem: Component;
    export const Input: Component;
    export const Button: Component;
    export const DialogBox: Component;
    export const Popover: Component;
    export const Tooltip: Component;
    export const Collapse: Component;
    export const CollapseItem: Component;
    export const Radio: Component;
    export const RadioGroup: Component;
    export const Split: Component;
    export const Grid: Component;
    export const GridColumn: Component;

    // 导出其他可能用到的组件
    export * from './dist/index.js';
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@opentiny/tiny-engine-common/js/http' {
    export const handlePageUpdate: (updateParams: {
        id: string;
        params: any;
        routerChange?: boolean;
        isCurEditPage?: boolean;
        isUpdateTree?: boolean;
    }) => Promise<any>;
}

declare module '@opentiny/tiny-engine-common/js/i18n' {
    export const I18nInjectionKey: symbol;
}
