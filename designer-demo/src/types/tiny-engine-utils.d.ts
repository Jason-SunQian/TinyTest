declare module '@opentiny/tiny-engine-utils' {
    export const constants: {
        OPEN_DELAY: {
            Default: number;
        };
        PAGE_STATUS: {
            Release: string;
            Empty: string;
            Guest: string;
            Lock: string;
        };
        AUTO_SAVED: string;
        BROADCAST_CHANNEL: {
            Notify: string;
        };
    };

    export const utils: any;

    // 导出其他可能用到的工具
    export * from './dist/index.js';
}
