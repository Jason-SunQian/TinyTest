import {
    GroupItemConfigurator,
    ArrayItemConfigurator,
    CodeConfigurator,
    SlotConfigurator,
    ContainerConfigurator,
    VariableConfigurator,
    HtmlAttributesConfigurator,
    I18nInput
} from '@/components/i18n-wrappers';

import MyInputConfigurator from './MyInputConfigurator.vue';

export const configurators = {
     
    MyInputConfigurator,
    // 国际化包装的 Configurator 组件，覆盖原始组件
     
    GroupItemConfigurator,
     
    ArrayItemConfigurator,
     
    CodeConfigurator,
     
    SlotConfigurator,
     
    ContainerConfigurator,
     
    VariableConfigurator,
     
    HtmlAttributesConfigurator,
    // I18nInput 注册为 I18nConfigurator（属性面板中使用）
     
    I18nConfigurator: I18nInput
};
