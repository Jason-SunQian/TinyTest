<template>
  <tiny-alert
    v-show="showVideo"
    type="simple"
    :description="t('designer.block.propertyGuideDescription')"
    class="block-alert"
  ></tiny-alert>
  <div class="property-container">
    <block-property-list v-if="!isEdit"></block-property-list>
    <block-property-form v-else></block-property-form>
  </div>
  <block-guide v-show="showVideo" :title="t('designer.block.propertyGuideTitle')">
    <template #video>
      <slot name="video"></slot>
    </template>
  </block-guide>
</template>

<script lang="ts">
/* metaService: engine.plugins.blockmanage.BlockProperty */
import { computed, inject } from 'vue'
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n'
import BlockGuide from './BlockGuide.vue'
import BlockPropertyList from './BlockPropertyList.vue'
import BlockPropertyForm from './BlockPropertyForm.vue'
import { getEditProperty } from './js/blockSetting'
import { Alert } from '@opentiny/vue'

export default {
  components: {
    BlockGuide,
    BlockPropertyList,
    BlockPropertyForm,
    TinyAlert: Alert
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

    return {
      isEdit: computed(() => Boolean(getEditProperty())),
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
