import zhCN from './zh-CN.json';
import enUS from './en-US.json';
import jaJP from './ja-JP.json';
import koKR from './ko-KR.json';
import componentsZhCN from './components.zh-CN.json';
import componentsEnUS from './components.en-US.json';

// 简单合并：保留所有原有配置，只添加新的 common 和 components
const mergedZhCN = {
    ...zhCN,
    designer: {
        ...zhCN.designer,
        common: componentsZhCN.designer?.common || {},
        components: componentsZhCN.designer?.components || {}
    }
};

const mergedEnUS = {
    ...enUS,
    designer: {
        ...enUS.designer,
        common: componentsEnUS.designer?.common || {},
        components: componentsEnUS.designer?.components || {}
    }
};

/* eslint-disable @typescript-eslint/naming-convention, camelcase */
export default {
    zh_CN: mergedZhCN,
    en_US: mergedEnUS,
    ja_JP: jaJP,
    ko_KR: koKR
};
/* eslint-enable @typescript-eslint/naming-convention, camelcase */
