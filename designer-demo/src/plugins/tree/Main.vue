<template>
  <plugin-panel
    tabindex="0"
    :title="t('designer.leftPanel.outlineTree')"
    ref="panelRef"
    class="outlinebox plugin-tree"
    :fixed-name="PLUGIN_NAME.OutlineTree"
    :fixedPanels="fixedPanels"
    @close="$emit('close')"
  >
    <template #content>
      <draggable-tree
        label-key="componentName"
        :data="state.pageSchema"
        :draggable="true"
        :actives="selectedIds"
        :disallow-drop="disallowDrop"
        class="outline-tree"
        @click="handleClickRow"
        @mouseenter="handleMouseEnterRow"
        @drop="handleDrop"
      >
        <template #content="row">
          <div class="row-content">
            <svg-icon v-if="getIconName(row)" :name="getIconName(row)"></svg-icon>
            <span :class="['row-label', { 'node-isblock': row.rawData.componentType === 'Block' }]">{{
              row.label
            }}</span>
            <template v-if="row.id !== 'body'">
              <svg-icon :name="eyeOpen(row.id) ? 'eye' : 'eye-invisible'" @mouseup="showNode(row.rawData)"></svg-icon>
              <svg-icon name="delete" @mouseup="delNode(row.rawData)"></svg-icon>
            </template>
          </div>
        </template>
      </draggable-tree>
    </template>
  </plugin-panel>
</template>

<script lang="ts">
/* metaService: engine.plugins.outlinetree.custom.Main */
import {
  reactive,
  watch,
  computed,
  onActivated,
  onDeactivated,
  provide,
  onMounted,
  onBeforeUnmount,
  nextTick,
  ref
} from 'vue'
import PluginPanel from '@/components/i18n-wrappers/PluginPanel/index.vue'
import { constants } from '@opentiny/tiny-engine-utils'
import {
  useCanvas,
  useMaterial,
  useLayout,
  useMessage,
  useHistory,
  getMergeMeta
} from '@opentiny/tiny-engine-meta-register'
import { extend } from '@opentiny/vue-renderless/common/object'
import DraggableTree from './DraggableTree.vue'
import { useDesignerI18n } from '../../services/i18nService'

const { PAGE_STATUS } = constants
export default {
  components: {
    PluginPanel,
    DraggableTree
  },
  props: {
    fixedPanels: {
      type: Array
    }
  },
  emits: ['close', 'fix-panel'],
  setup(props, { emit }) {
    const { t } = useDesignerI18n()
    const { pageState } = useCanvas()
    const { getMaterial } = useMaterial()
    const { PLUGIN_NAME } = useLayout()

    const panelFixed = computed(() => props.fixedPanels?.includes(PLUGIN_NAME.OutlineTree))

    const { useMultiSelect, registerHotkeyEvent, removeHotkeyEvent } = getMergeMeta('engine.canvas.container').api

    const selectedIds = computed(() => useMultiSelect().multiSelectedStates.value.map((state) => state.id))

    const panelState = reactive({
      emitEvent: emit
    })
    provide('panelState', panelState)

    const filterSchema = (data) => {
      const translateChild = (data) => {
        data.forEach((item) => {
          item.show = pageState.nodesStatus[item.id] !== false
          item.showEye = !item.show
          const child = item.children
          if (Array.isArray(child)) {
            translateChild(item.children)
          }
        })

        return data
      }

      return [{ ...translateChild([extend(true, {}, data)])[0], componentName: 'body', id: 'body' }]
    }
    const state = reactive({
      pageSchema: [],
      isLock: computed(
        () => ![PAGE_STATUS.Occupy, PAGE_STATUS.Guest].includes(useLayout().layoutState.pageStatus.state)
      )
    })

    const { subscribe, unsubscribe } = useMessage()

    onActivated(() => {
      state.pageSchema = filterSchema(pageState.pageSchema)

      subscribe({
        topic: 'schemaChange',
        subscriber: 'node-tree',
        callback: ({ operation }) => {
          if (operation?.type !== 'changeProps') {
            state.pageSchema = filterSchema(pageState.pageSchema)
          }
        }
      })
    })

    onDeactivated(() => {
      unsubscribe({
        topic: 'schemaChange',
        subscriber: 'node-tree'
      })
    })

    watch(
      () => pageState.currentSchema,
      () => {
        const { getSchema } = useCanvas()
        state.pageSchema = filterSchema(getSchema())
      }
    )

    const eyeOpen = (id) => {
      return pageState.nodesStatus[id] !== false
    }

    const showNode = (data) => {
      data.show = !data.show
      pageState.nodesStatus[data.id] = data.show

      const { getRenderer, clearSelect } = useCanvas().canvasApi.value

      getRenderer().setCondition(data.id, data.show)
      clearSelect()
    }

    const delNode = (data) => {
      const { clearSelect } = useCanvas().canvasApi.value
      useCanvas().operateNode({
        type: 'delete',
        id: data.id
      })
      clearSelect()
      useHistory().addHistory()
    }

    const handleMouseEnterRow = (row) => {
      const { hoverNode } = useCanvas().canvasApi.value

      hoverNode(row.id)
    }

    const disallowDrop = ({ dragged, target, position }) => {
      if (dragged.id === 'body') {
        return true
      }

      const dropTo = position === 'center' ? target : target.parent

      if (dropTo.id === 'body') {
        return false
      }

      const { getConfigure, allowInsert } = useCanvas().canvasApi.value

      return !allowInsert(getConfigure(dropTo.rawData.componentName), dragged.rawData)
    }

    const handleDrop = ({ dragged, target, position }) => {
      if (dragged.id === target.id) {
        return
      }
      if (position === 'center' && target.rawData.children.some((item) => item.id === dragged.id)) {
        return
      }
      if (position !== 'center') {
        const targetParentChildren = target.parent.rawData.children
        const targetIndex = targetParentChildren.findIndex((item) => item.id === target.id)
        const node = targetParentChildren[position === 'top' ? targetIndex - 1 : targetIndex + 1]
        if (dragged.id === node?.id) {
          return
        }
      }

      const { insertNode, removeNode, selectNode } = useCanvas().canvasApi.value
      removeNode(dragged.id)
      insertNode(
        { data: dragged.rawData, node: target.rawData, parent: target.parent.rawData },
        position === 'center' ? 'in' : position
      )
      nextTick(() => {
        selectNode(dragged.id, 'clickTree')
      })
    }

    const handleClickRow = (event, row) => {
      const isCtrlKey = event.ctrlKey || event.metaKey
      const { selectNode } = useCanvas().canvasApi.value
      selectNode(row.id, 'clickTree', isCtrlKey)
    }

    const getIconName = (row) => {
      const iconName = getMaterial(row.rawData.componentName).icon || 'plugin-icon-page'
      return iconName.toLowerCase()
    }

    const panelRef = ref(null)

    const eventFilter = () => {
      return panelRef.value.$el.contains(document.activeElement)
    }

    onMounted(() => {
      if (panelRef.value) {
        registerHotkeyEvent(document, { eventFilter })
      }
    })

    onBeforeUnmount(() => {
      if (panelRef.value) {
        removeHotkeyEvent(document)
      }
    })

    return {
      t,
      panelFixed,
      selectedIds,
      panelRef,
      eyeOpen,
      delNode,
      showNode,
      state,
      PLUGIN_NAME,
      pageState,
      getIconName,
      handleClickRow,
      handleMouseEnterRow,
      disallowDrop,
      handleDrop
    }
  }
}
</script>

<style lang="less" scoped>
.outlinebox {
  height: 100%;
  overflow: hidden;
  &:focus {
    outline: none;
  }
}
.outline-tree {
  flex: 1;
  overflow: auto;
  .row-label {
    flex: 1;
    font-size: var(--te-base-font-size-base);
    line-height: 20px;
  }
  svg {
    color: var(--te-common-icon-secondary);
    flex-shrink: 0;
    &:hover {
      color: var(--te-common-icon-hover);
    }
  }
  svg.icon-eye,
  svg.icon-delete {
    visibility: hidden;
  }
  .tree-row:hover {
    svg.icon-eye,
    svg.icon-delete {
      visibility: unset;
    }
  }
  .row-content {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .node-isblock {
    color: var(--te-tree-block-text-color);
  }
}
</style>


