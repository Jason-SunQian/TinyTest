<!-- eslint-disable vue/no-bare-strings-in-template -->
<template>
    <div v-if="props.type === TIPS_TYPE.PAGE" class="tips">
        <div>{{ t('designer.state.stringExample') }}</div>
        <div>{{ t('designer.state.numberExample') }}</div>
        <div>{{ t('designer.state.booleanExample') }}</div>
        <div>{{ t('designer.state.objectExample') }}</div>
        <div>{{ t('designer.state.arrayExample') }}</div>
        <div>{{ t('designer.state.nullExample') }}</div>
        <div>"color":red</div>
        <div>"background":"blue"</div>
    </div>
    <div v-else class="tips app-tips">
        <div class="tip-note">{{ t('designer.state.jsonObjectNote') }}</div>
        <pre><code>{
  "app": "TinyEngine",
  "version": "2.0.0",
  "isAdmin": true,
  "userInfo": {
    "name": "张三",
    "age": 18,
    "gender": "男"
  }
}</code></pre>
    </div>
</template>

<!-- eslint-disable vue/block-lang, @typescript-eslint/naming-convention, vue/define-props-declaration -->
<script setup lang="ts">
import { useDesignerI18n } from '@/services/i18nService';

const props = defineProps({
    type: {
        type: String,
        default: 'page'
    }
});

const { t } = useDesignerI18n();

const TIPS_TYPE = {
     
    PAGE: 'page',
     
    APP: 'app'
};
</script>

<!-- eslint-disable-next-line vue/block-lang -->
<style lang="less" scoped>
.tips {
    font-size: 12px;
    line-height: 18px;
    margin-top: 8px;
    border-radius: 4px;
    background: var(--te-state-tip-bg-color);
    color: var(--te-state-tip-text-color);
    padding: 8px 14px;
}
.app-tips {
    pre {
        margin: 0;
        padding: 0 14px;
    }
    .tip-note {
        font-weight: 500;
        padding: 8px 14px 0;
        color: var(--te-state-tip-highlight-color);
    }
}
</style>
