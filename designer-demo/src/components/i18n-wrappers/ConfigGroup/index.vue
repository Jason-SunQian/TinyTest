/* eslint-disable */
<!-- eslint-disable vue/block-lang, camelcase -->
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
        const { locale } = useDesignerI18n();

        return {
            locale
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
        // 在 render 函数中直接计算，避免 computed 解包问题
        const emptyTextValue =
            typeof this.emptyText === 'string'
                ? this.emptyText
                : this.emptyText?.value || this.emptyText || '';
        // eslint-disable-next-line camelcase
        const emptyText =
            emptyTextValue || (this.locale === 'en_US' ? 'Empty' : '空');

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
