<template>
    <div class="data-source-list lowcode-scrollbar">
        <ul>
            <li
                v-for="key in filteredKey"
                :key="key"
                :class="[
                    'data-source-list-item',
                    { selected: key === selectedKey }
                ]"
            >
                <div class="item-head">
                    <div class="item-head-left">
                        <svg-icon
                            name="plugin-icon-var"
                            class="item-head-left-icon"
                        />
                        <span class="protocal">
                            {{
                                stateScope === STATE.CURRENT_STATE
                                    ? 'state.'
                                    : 'stores.'
                            }}</span>
                        <span class="name">{{ key }}</span>
                    </div>
                    <div class="item-head-right">
                        <svg-button
                            name="to-edit"
                            :hover-bg-color="false"
                            @click="openPanel(OPTION_TYPE.UPDATE, key)"
                        />
                        <svg-button
                            name="copy"
                            :hover-bg-color="false"
                            @click="openPanel(OPTION_TYPE.COPY, key)"
                        />
                        <svg-button
                            name="delete"
                            :hover-bg-color="false"
                            @click="confirmClick(key)"
                        />
                    </div>
                </div>
            </li>
        </ul>
        <search-empty :is-show="!filteredKey.length" />
    </div>
</template>

<!-- eslint-disable vue/block-lang, vue/require-default-prop, vue/component-api-style, @typescript-eslint/naming-convention -->
<script lang="tsx">
/* metaService: engine.plugins.state.DataSourceList */
import { computed } from 'vue';
import { useModal, useResource } from '@opentiny/tiny-engine-meta-register';
import { findExpressionInAppSchema } from '@opentiny/tiny-engine-common/js/ast';
import { constants } from '@opentiny/tiny-engine-utils';
import { SvgButton } from '@opentiny/tiny-engine-common';

import { SearchEmpty } from '@/components/i18n-wrappers';
import { useDesignerI18n } from '@/services/i18nService';

import { STATE, OPTION_TYPE } from './js/constants';

const { COMPONENT_NAME } = constants;

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        SvgButton,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        SearchEmpty
    },
    props: {
        modelValue: {
            type: Object,
            default: () => ({})
        },
        query: {
            type: String,
            default: ''
        },
        // eslint-disable-next-line vue/require-default-prop
        stateScope: {
            type: String,
            default: undefined
        },
        // eslint-disable-next-line vue/require-default-prop
        selectedKey: {
            type: String,
            default: undefined
        }
    },
    emits: ['openPanel', 'remove', 'removeStore'],
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        const { t } = useDesignerI18n();
        const filteredKey = computed(() =>
            props.modelValue.filter(key => key.includes(props.query))
        );

        const openPanel = (flag, key) => {
            emit('openPanel', flag, key);
        };

        const removeConfirm = key => {
            useModal().confirm({
                title: t('designer.state.deleteTip'),
                message: t('designer.state.confirmDelete', { key }),
                exec: () => emit('remove', key)
            });
        };

        const removeStoreConfirm = key => {
            const appPages = useResource().appSchemaState.pageTree.filter(
                page =>
                    page.componentName === COMPONENT_NAME.Page &&
                    page?.meta?.group !== 'publicPages'
            );
            const expression = `stores.${key}`;
            const expresstionPages = findExpressionInAppSchema(
                appPages,
                expression
            );

            if (expresstionPages.length > 0) {
                const messageText = `${t('designer.state.cannotDelete', {
                    expression
                })}\n${expresstionPages.map(pagaName => pagaName).join('\n')}`;
                useModal().message({
                    title: t('designer.state.deleteTip'),
                    message: messageText
                });
            } else {
                useModal().confirm({
                    title: t('designer.state.deleteTip'),
                    message: t('designer.state.confirmDelete', { key }),
                    exec: () => emit('removeStore', key)
                });
            }
        };

        const confirmClick = key => {
            if (props.stateScope === STATE.CURRENT_STATE) {
                removeConfirm(key);
            } else {
                removeStoreConfirm(key);
            }
        };

        return {
            filteredKey,
            confirmClick,
            openPanel,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            STATE,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            OPTION_TYPE
        };
    }
};
</script>

<!-- eslint-disable-next-line vue/block-lang -->
<style lang="less" scoped>
.data-source-list {
    padding-top: 12px;
    border-top: 1px solid var(--te-state-common-border-color-divider);
    overflow-y: scroll;
    .data-source-list-item {
        &.selected,
        &:hover {
            background: var(--te-state-common-bg-color-hover);
            .item-head-right {
                display: flex;
                justify-content: flex-end;
                width: 30%;
            }
        }
    }

    .item-head {
        height: 24px;
        padding: 0 10px;
        color: var(--te-state-data-list-text-color);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .item-head-left {
            display: flex;
            align-items: center;
            width: 70%;

            .tiny-svg {
                margin-right: 4px;
                cursor: pointer;
                transition: 0.3s;
                color: var(--te-state-data-list-left-icon-color);
                flex-shrink: 0;

                &.is-expand {
                    transform: rotate(90deg);
                }
            }

            .protocal {
                margin-right: 4px;
                font-size: 12px;
                flex-shrink: 0;
            }

            .remote {
                color: #3ac295;
            }

            .name {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .item-head-left-icon {
                color: var(--te-state-data-list-left-icon-color);
                margin-right: 8px;
            }
        }

        .item-head-right {
            display: none;
        }
    }

    .item-content {
        padding: 0 8px;
        transition: 0.3s;
    }

    .content-item {
        p span {
            &:first-child {
                font-size: 14;
                color: var(--te-state-common-label-text-color);
            }

            &:last-child {
                color: var(--te-state-common-text-color);
            }
        }
    }
}
</style>
