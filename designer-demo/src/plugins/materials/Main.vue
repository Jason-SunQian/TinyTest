<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <component
        :is="layout.entry"
        :registry-data="registryData"
        class="plugin-materials"
    />
</template>

<script lang="ts">
/* metaService: engine.plugins.customMaterials.Main */
import { getMergeMeta } from '@opentiny/tiny-engine-meta-register';

import meta from './meta';

export default {
     
    setup() {
        const registry = getMergeMeta(meta.id);
        const { layout, ...restRegistry } = registry;

        return {
            registryData: restRegistry,
            layout
        };
    }
};
</script>
