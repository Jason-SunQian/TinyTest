import entry from './Main.vue';
import metaData from './meta';
import { ResourceService, MaterialService } from './composable/index';
import MaterialLayout from './meta/layout/index';
import MaterialBlock from './meta/block/index';
import MaterialComponent from './meta/component/index';
import MaterialHeader from './components/header/Main.vue';
import { basePropertyOptions } from './js/options';
import mcp from './mcp';
import './styles/vars.scss';

export default {
    ...metaData,
    entry,
    layout: MaterialLayout,
    options: {
        defaultTabId: 'engine.plugins.customMaterials.component',
        displayComponentIds: [
            'engine.plugins.customMaterials.component',
            'engine.plugins.customMaterials.block'
        ],
        basePropertyOptions,
        useBaseStyle: true,
        blockBaseStyle: {
            className: 'block-base-style',
            style: 'margin: 16px;'
        },
        componentBaseStyle: {
            className: 'component-base-style',
            style: 'margin: 8px;'
        },
        hiddenBuiltinMaterials: []
    },
    components: {
        header: MaterialHeader
    },
    apis: { ...MaterialBlock.apis },
    metas: [MaterialBlock, MaterialComponent, ResourceService, MaterialService],
    mcp
};

export { entry, ResourceService, MaterialService };
export * from './composable/types';
