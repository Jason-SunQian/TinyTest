<!-- eslint-disable vue/block-lang -->
<template>
    <div class="data-handle">
        <div>{{ name }}</div>
        <icon-del class="icon-del" @click="remove" />
    </div>
    <monaco-editor
        ref="functionEditor"
        class="function-editor"
        :value="state.value"
        :options="state.options"
    />
</template>

<script lang="ts">
/* metaService: engine.plugins.state.CreateRemoteFunction */
import { getCurrentInstance, reactive } from 'vue';
import { VueMonaco } from '@opentiny/tiny-engine-common';
import { iconDel } from '@opentiny/vue-icon';

export default {
    components: {
         
        MonacoEditor: VueMonaco,
         
        IconDel: iconDel()
    },
    props: {
         
        name: {
            type: String,
            default: undefined
        },
         
        value: {
            type: String,
            default: undefined
        }
    },
    emits: ['remove'],
     
    setup(props, { emit }) {
        const instance = getCurrentInstance();

        const state = reactive({
            options: {
                language: 'javascript',
                minimap: { enabled: false }
            },
            value: props.value
        });

        const remove = () => {
            emit('remove');
        };

        const getEditor = () => {
            return instance.refs.functionEditor;
        };

        return {
            state,
            remove,
            getEditor
        };
    }
};
</script>

<!-- eslint-disable-next-line vue/block-lang -->
<style lang="less" scoped>
.data-handle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: var(--te-state-common-bg-color-hover);
    color: var(--te-state-remote-icon-color);
    margin-top: 12px;

    .icon-del {
        cursor: pointer;
        color: var(--te-state-remote-icon-color);
    }
}

.function-editor {
    height: 240px;
    margin-top: 8px;
}
</style>
