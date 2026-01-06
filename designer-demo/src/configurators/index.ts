import {
    GroupItemConfigurator,
    ArrayItemConfigurator,
    CodeConfigurator,
    SlotConfigurator,
    ContainerConfigurator
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
    ContainerConfigurator
};
