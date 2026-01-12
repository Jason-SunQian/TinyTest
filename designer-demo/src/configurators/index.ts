import {
    GroupItemConfigurator,
    ArrayItemConfigurator,
    CodeConfigurator,
    SlotConfigurator,
    ContainerConfigurator,
    VariableConfigurator,
    I18nInput
} from '@/components/i18n-wrappers';

import MyInputConfigurator from './MyInputConfigurator.vue';

export const configurators = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    MyInputConfigurator,
    // 国际化包装的 Configurator 组件，覆盖原始组件
    // eslint-disable-next-line @typescript-eslint/naming-convention
    GroupItemConfigurator,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ArrayItemConfigurator,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CodeConfigurator,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SlotConfigurator,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ContainerConfigurator,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    VariableConfigurator,
    // I18nInput 注册为 I18nConfigurator（属性面板中使用）
    // eslint-disable-next-line @typescript-eslint/naming-convention
    I18nConfigurator: I18nInput
};
