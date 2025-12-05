<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="toolbar-itm-clean">
        <toolbar-base
            :content="t('designer.toolbar.clean')"
            :icon="options.icon.default || options.icon"
            :options="options"
            @click-api="clean"
        />
    </div>
</template>

<script lang="ts">
/* metaService: engine.toolbars.clean.custom.Main */
import { ref, watch } from 'vue';
import {
    useCanvas,
    useLayout,
    useModal
} from '@opentiny/tiny-engine-meta-register';
import { constants } from '@opentiny/tiny-engine-utils';
import { ToolbarBase } from '@opentiny/tiny-engine-common';

import { useDesignerI18n } from '@/services/i18nService';

const { PAGE_STATUS } = constants;
export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ToolbarBase
    },
    props: {
        options: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        }
    },
    // eslint-disable-next-line vue/component-api-style
    setup() {
        const { t } = useDesignerI18n();
        const { pageState, clearCanvas } = useCanvas();
        const isLock = ref(pageState.isLock);
        const { confirm } = useModal();

        watch(
            () => pageState.isLock,
            value => {
                isLock.value = value;
            }
        );

        const clean = () => {
            if (
                ![PAGE_STATUS.Occupy, PAGE_STATUS.Guest].includes(
                    useLayout().layoutState?.pageStatus?.state
                )
            ) {
                return;
            }

            if (!isLock.value) {
                confirm({
                    title: t('designer.common.tip'),
                    message: t('designer.toolbar.cleanConfirm'),
                    exec: () => {
                        clearCanvas();
                    }
                });
            }
        };

        return {
            clean,
            isLock,
            t
        };
    }
};
</script>
