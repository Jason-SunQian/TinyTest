<script lang="jsx">
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
        const propNodes = list.map((data, propIndex) => item({ data, propIndex })); // 使用插槽构造vnode list

        // 将vNodes拆分为默认显示与更多两部份分别渲染
        const expandItems = propNodes.slice(0, number);
        const collapseItems = propNodes.slice(number);
        
        // 获取国际化后的 emptyText
        // 在 render 函数中直接计算，避免 computed 解包问题
        const emptyTextValue = typeof this.emptyText === 'string' 
            ? this.emptyText 
            : (this.emptyText?.value || this.emptyText || '');
        const emptyText = emptyTextValue || (this.locale === 'en_US' ? 'Empty' : '空');

        const expandNode = (
            <div class="item-container" data-group-index={this.index}>
                {expandItems.length ? expandItems : <div class="empty">{emptyText}</div>}
            </div>
        );

        const collapseNode = collapseItems.length ? (
            <ConfigCollapse>
                <div class="item-container" data-group-index={this.index}>
                    {collapseItems}
                </div>
            </ConfigCollapse>
        ) : null;

        return (
            <div style="width:100%">
                {expandNode} {collapseNode}
            </div>
        );
    }
};
</script>

<style lang="less" scoped>
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

