<template>
    <div class="add-button">
        <tiny-button @click="addEvent">
            <svg-icon name="add" />{{ t('designer.common.add') }}</tiny-button>
    </div>
    <meta-list-items
        :class="{ list: list.length }"
        :options-list="list"
        :draggable="false"
    >
        <template #content="{ data }">
            <div
                :class="{
                    'item-text': true,
                    active: data.name === currentEventName
                }"
                @click="setEdit(data)"
            >
                {{ data.name }}
            </div>
        </template>
        <template #operate="{ data }">
            <svg-button
                :hover-bg-color="false"
                name="to-edit"
                @click="setEdit(data)"
            />
            <svg-button
                :hover-bg-color="false"
                name="delete"
                @click="delBlockEvent(data.name)"
            />
        </template>
    </meta-list-items>
</template>

<script lang="ts">
/* metaService: engine.plugins.blockmanage.BlockEventList */
import { computed, inject } from 'vue';
import { Button as TinyButton } from '@opentiny/vue';
import { MetaListItems, SvgButton } from '@opentiny/tiny-engine-common';
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n';

import {
    getEditBlockEvents,
    setEditEvent,
    getEditEventName,
    setEditEventName,
    addBlockCustomEvent,
    delBlockEvent
} from './js/blockSetting';

export default {
    components: {
         
        TinyButton,
         
        MetaListItems,
         
        SvgButton
    },
     
    setup() {
        // 获取国际化 t 函数
         
        const i18n: any = inject(I18nInjectionKey);
        const t = i18n?.global?.t || ((key: string) => key);

        const list = computed(() =>
            Object.entries(getEditBlockEvents() || {}).map(([name, event]) => ({
                name,
                event
            }))
        );
        const currentEventName = computed(() => getEditEventName());

        const setEdit = ({ name, event }) => {
            setEditEventName(name);
            setEditEvent(event);
        };

        const addEvent = () => {
            setEdit(addBlockCustomEvent());
        };

        return {
            list,
            currentEventName,
            setEdit,
            addEvent,
            delBlockEvent,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.list {
    margin-top: 12px;
}

.item-text {
    flex: 1;
    color: var(--te-block-event-list-text-color);
}
.item-text.active {
    font-weight: 700;
}

.item-icon + .item-icon {
    margin-left: 8px;
}
.add-button {
    :deep(.tiny-button) {
        border: 1px solid var(--te-block-event-list-btn-border-color);
    }
    .icon-plus {
        margin-right: 6px;
        stroke: var(--te-block-event-list-btn-icon-color);
    }
}
</style>
