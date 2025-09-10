<template>
  <tiny-alert
    v-show="showVideo"
    type="simple"
    :description="t('designer.block.eventGuideDescription')"
    class="block-alert"
  ></tiny-alert>
  <tiny-row>
    <tiny-col :span="6">
      <block-event-list></block-event-list>
    </tiny-col>
    <tiny-col class="form" :span="6">
      <block-event-form v-show="isEdit"></block-event-form>
    </tiny-col>
  </tiny-row>
  <block-guide v-show="showVideo" :title="t('designer.block.eventGuideTitle')">
    <template #video>
      <slot name="video"></slot>
    </template>
  </block-guide>
</template>

<script lang="ts">
/* metaService: engine.plugins.blockmanage.BlockEvent */
import { computed, reactive, inject } from 'vue'
import { Row as TinyRow, Col as TinyCol, Alert as TinyAlert } from '@opentiny/vue'
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n'
import BlockGuide from './BlockGuide.vue'
import BlockEventList from './BlockEventList.vue'
import BlockEventForm from './BlockEventForm.vue'
import { getEditEvent } from './js/blockSetting'

export default {
  components: {
    TinyRow,
    TinyCol,
    TinyAlert,
    BlockGuide,
    BlockEventList,
    BlockEventForm
  },
  props: {
    showVideo: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    // 获取国际化 t 函数
    const i18n: any = inject(I18nInjectionKey)
    const t = i18n?.global?.t || ((key: string) => key)

    const state = reactive({
      isShowVideo: false
    })

    return {
      state,
      isEdit: computed(() => Boolean(getEditEvent())),
      t
    }
  }
}
</script>

<style lang="less" scoped>
.block-alert {
  color: var(--te-block-alert-text-color);
  height: 28px;
  padding: 6px;
  border: 0;
  font-size: 11px;
  margin-bottom: 12px;
  :deep(.tiny-alert__close) {
    top: 7px;
  }
}
</style>
