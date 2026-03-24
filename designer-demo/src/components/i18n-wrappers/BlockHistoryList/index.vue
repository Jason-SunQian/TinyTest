<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <tiny-grid
        v-if="props.history.length"
        :data="props.history"
        row-id="id"
        height="300"
    >
        <tiny-grid-column
            v-if="props.isBlockManage"
            field="version"
            :title="t('designer.components.blockHistoryList.version')"
        >
            <template #default="data">
                {{ data.row.version }}
                <span
                    v-if="data.row.version === props.lastVersion.versions"
                    class="version-v"
                    >{{
                        t('designer.components.blockHistoryList.latest')
                    }}</span>
            </template>
        </tiny-grid-column>
        <tiny-grid-column
            field="updated_at"
            :title="t('designer.components.blockHistoryList.publishTime')"
        >
            <template #default="data">
                {{ format(data.row.updated_at, 'yyyy/MM/dd hh:mm:ss') }}
            </template>
        </tiny-grid-column>
        <tiny-grid-column
            field="message"
            :title="t('designer.components.blockHistoryList.description')"
        />
        <tiny-grid-column
            width="90"
            field="operation"
            :title="t('designer.components.blockHistoryList.operation')"
        >
            <template #default="data">
                <span
                    class="operation-text"
                    @click="emit('preview', data.row)"
                    >{{
                        t('designer.components.blockHistoryList.preview')
                    }}</span>
                <span
                    v-if="!props.isBlockManage"
                    class="operation-text"
                    @click="emit('restore', data.row)"
                    >{{
                        t('designer.components.blockHistoryList.restore')
                    }}</span>
            </template>
        </tiny-grid-column>
    </tiny-grid>
    <div v-if="!props.history.length" class="empty">
        {{ t('designer.components.searchEmpty.noData') }}
    </div>
</template>

<script setup lang="ts">
import { format } from '@opentiny/vue-renderless/common/date';
import { Grid as TinyGrid, GridColumn as TinyGridColumn } from '@opentiny/vue';

import { useDesignerI18n } from '@/services/i18nService';

interface HistoryItem {
    id: string;
    version?: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    updated_at: string;
    message?: string;
    [key: string]: unknown;
}

interface LastVersion {
    versions?: string;
    [key: string]: unknown;
}

interface Props {
    history?: HistoryItem[];
    isBlockManage?: boolean;
    lastVersion?: LastVersion;
}

const props = withDefaults(defineProps<Props>(), {
    history: () => [],
    isBlockManage: false,
    lastVersion: () => ({})
});

const emit = defineEmits<{
    preview: [row: HistoryItem];
    restore: [row: HistoryItem];
}>();

const { t } = useDesignerI18n();
</script>

<style lang="scss" scoped>
.version-v {
    font-size: 12px;
    padding: 2px 8px;
    margin-left: 5px;
    background-color: var(--te-component-block-history-list-tag-bg-color);
    color: var(--te-component-block-history-list-tag-text-color);
    border-radius: var(--te-base-border-radius-1);
}
.operation-text {
    color: var(--te-component-common-text-color-emphasize);
    & + .operation-text {
        margin-left: 8px;
    }
}

.empty {
    color: var(--te-component-common-text-color-weaken);
}
</style>
