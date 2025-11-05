<template>
  <tiny-grid v-if="history.length" :data="history" row-id="id" height="300">
    <tiny-grid-column v-if="isBlockManage" field="version" :title="t('designer.components.blockHistoryList.version')">
      <template v-slot="data">
        {{ data.row.version }}
        <span v-if="data.row.version === lastVersion.versions" class="version-v">{{ t('designer.components.blockHistoryList.latest') }}</span>
      </template>
    </tiny-grid-column>
    <tiny-grid-column field="updated_at" :title="t('designer.components.blockHistoryList.publishTime')">
      <template v-slot="data">
        {{ format(data.row.updated_at, 'yyyy/MM/dd hh:mm:ss') }}
      </template>
    </tiny-grid-column>
    <tiny-grid-column field="message" :title="t('designer.components.blockHistoryList.description')"></tiny-grid-column>
    <tiny-grid-column width="90" field="operation" :title="t('designer.components.blockHistoryList.operation')">
      <template v-slot="data">
        <span class="operation-text" @click="$emit('preview', data.row)">{{ t('designer.components.blockHistoryList.preview') }}</span>
        <span v-if="!isBlockManage" class="operation-text" @click="$emit('restore', data.row)">{{ t('designer.components.blockHistoryList.restore') }}</span>
      </template>
    </tiny-grid-column>
  </tiny-grid>
  <div v-if="!history.length" class="empty">{{ t('designer.components.searchEmpty.noData') }}</div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import { format } from '@opentiny/vue-renderless/common/date'
import { Grid as TinyGrid, GridColumn as TinyGridColumn } from '@opentiny/vue'
import { useDesignerI18n } from '@/services/i18nService'

const { t } = useDesignerI18n()

defineProps({
  history: {
    type: Array,
    default: () => []
  },
  isBlockManage: {
    type: Boolean,
    default: false
  },
  lastVersion: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['preview', 'restore'])
</script>

<style lang="less" scoped>
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

