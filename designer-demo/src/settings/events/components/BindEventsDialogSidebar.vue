<template>
    <div class="dialog-content-left">
        <div class="left-title">
            {{ t('designer.settings.events.dialog.sidebar.title') }}
        </div>
        <div class="left-list-wrap">
            <div class="left-action-list">
                <tiny-search
                    v-model="searchValue"
                    :placeholder="
                        t(
                            'designer.settings.events.dialog.sidebar.searchPlaceholder'
                        )
                    "
                />
                <ul class="action-list-wrap">
                    <li
                        v-for="item in filteredMethodList"
                        :key="item.name"
                        @click="selectMethod(item)"
                    >
                        <div
                            :class="[
                                'action-name',
                                {
                                    active:
                                        item.name ===
                                        context.bindMethodInfo.name
                                }
                            ]"
                        >
                            {{ item.title || item.name }}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<!-- eslint-disable vue/block-lang, vue/component-api-style, @typescript-eslint/naming-convention, vue/require-typed-object-prop -->
<script lang="ts">
/* metaService: engine.setting.event.BindEventsDialogSidebar */
import { getMetaApi, META_APP } from '@opentiny/tiny-engine-meta-register';
import { Search } from '@opentiny/vue';
import { inject, ref, watchEffect } from 'vue';

import { useDesignerI18n } from '@/services/i18nService';

import { INVALID_VARNAME_CHAR_RE, NEW_METHOD_TYPE } from './constants';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinySearch: Search
    },
    props: {
        // eslint-disable-next-line vue/require-typed-object-prop
        eventBinding: {
            type: Object,
            default: () => ({})
        }
    },
    // eslint-disable-next-line vue/component-api-style
    setup(props) {
        const { getMethodNameList } = getMetaApi(META_APP.Page);
        const { t } = useDesignerI18n();

        const searchValue = ref('');
        const filteredMethodList = ref([]);
        const context = inject('context');

        const generateMethodName = (nameList, eventName) => {
            const max = nameList
                .map(name => Number.parseInt(name.match(/\d+$/)?.[0]) || 0)
                .sort((a, b) => a - b)
                .pop();

            const functionName =
                eventName?.replace(INVALID_VARNAME_CHAR_RE, '_') || '';
            let name = `${functionName}New`;

            if (max > -1) {
                name += `${max + 1}`;
            }

            return name;
        };

        const selectMethod = data => {
            context.bindMethodInfo = data;
        };

        watchEffect(() => {
            const eventName = props.eventBinding?.eventName;

            const nameList =
                getMethodNameList?.().filter(action =>
                    action.includes(eventName)
                ) || [];
            const newMethodName = generateMethodName(nameList, eventName);

            const newMethod = {
                title: t(
                    'designer.settings.events.dialog.sidebar.addNewMethod'
                ),
                name: newMethodName,
                type: NEW_METHOD_TYPE
            };

            if (props.eventBinding?.ref) {
                selectMethod({ name: props.eventBinding.ref });
            } else {
                selectMethod(newMethod);
            }

            const methodList =
                getMethodNameList?.()
                    .filter(item => item.includes(searchValue.value))
                    .map(name => ({ name })) || [];

            filteredMethodList.value = [newMethod, ...methodList];
        });

        return {
            context,
            searchValue,
            filteredMethodList,
            selectMethod,
            t
        };
    }
};
</script>

<!-- eslint-disable-next-line vue/block-lang -->
<style lang="less" scoped>
.dialog-content-left {
    margin-right: 30px;
    width: 30%;
    display: flex;
    flex-direction: column;

    .left-title {
        font-weight: 400;
    }

    .left-list-wrap {
        border: 1px solid var(--te-bind-event-dialog-content-left-border-color);
        border-radius: 4px;
        height: 300px;
        margin-top: var(--te-common-vertical-item-spacing-normal);
        display: flex;
        flex: 1;

        .left-action-list {
            flex: 1;
            padding: 12px;
            .action-list-wrap {
                height: 250px;
                margin-top: 8px;
                overflow: auto;
            }

            .action-name {
                display: flex;
                justify-content: space-between;
                padding: 8px 12px;
                cursor: pointer;
                color: var(--te-bind-event-dialog-text-color);
                &.active {
                    background: var(
                        --te-bind-event-dialog-content-left-list-item-bg-color-active
                    );
                }
            }
        }
    }
}
</style>
