<!-- eslint-disable vue/no-root-v-if, vue/multi-word-component-names -->
<template>
    <block-panel v-if="existBlockModule" v-bind="$attrs" />
</template>

<script lang="ts">
/* metaService: engine.plugins.materials.block.Main */
import { getMergeMeta } from '@opentiny/tiny-engine-meta-register';

import BlockPanel from './BlockPanel.vue';

export default {
    components: {
         
        BlockPanel
    },
    props: {},
     
    setup() {
        const existBlockModule = getMergeMeta('engine.plugins.blockmanage');

        return {
            existBlockModule
        };
    }
};
</script>
