<script lang="tsx">
 
/* eslint-disable */
import { h } from 'vue';
import { ConfigCollapse } from '@opentiny/tiny-engine-common';

import { useDesignerI18n } from '@/services/i18nService';

export default {
    name: 'i18n-config-group',
    components: {
        ConfigCollapse
    },
    props: {
        group: Object,
        index: Number,
        design: Boolean,
        emptyText: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const { locale, t } = useDesignerI18n();

        return {
            locale,
            t
        };
    },
    render() {
        const list = this.group.content || [];
        const { item } = this.$slots;
        const number = this.group.collapse?.number || list.length;
        const propNodes = list.map((data, propIndex) =>
            item({ data, propIndex })
        ); // 使用插槽构造vnode list

        // 将vNodes拆分为默认显示与更多两部份分别渲染
        const expandItems = propNodes.slice(0, number);
        const collapseItems = propNodes.slice(number);

        // 获取国际化后的 emptyText
        // Vue 3 会自动解包 computed ref，所以 this.emptyText 应该是字符串值
        // 但如果传入了空字符串或 undefined，使用 i18n 作为 fallback
        const emptyTextValue = this.emptyText || '';
         
        const emptyText =
            emptyTextValue || this.t('designer.settings.props.emptyText');

        const expandNode = h(
            'div',
            {
                class: 'item-container',
                'data-group-index': String(this.index)
            },
            expandItems.length
                ? expandItems
                : h('div', { class: 'empty' }, emptyText)
        );

        const collapseNode = collapseItems.length
            ? h(ConfigCollapse, null, {
                  default: () =>
                      h(
                          'div',
                          {
                              class: 'item-container',
                              'data-group-index': String(this.index)
                          },
                          collapseItems
                      )
              })
            : null;

        return h('div', { style: 'width:100%' }, [expandNode, collapseNode]);
    }
};
</script>

<!-- eslint-disable-next-line vue/block-lang -->
<style lang="scss" scoped>
.item-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .empty {
        height: 40px;
        line-height: 40px;
        text-align: center;
        width: 100%;
    }
}
</style>
