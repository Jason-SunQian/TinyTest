<template>
  <div class="components-wrap">
    <tiny-search v-model="state.searchValue" :placeholder="t('designer.leftPanel.searchPlaceholder')" clearable @update:modelValue="change">
      <template #prefix> <icon-search /> </template>
    </tiny-search>
    <tiny-collapse v-model="state.activeName" class="lowcode-scrollbar">
      <tiny-collapse-item
        v-for="(item, index) in state.components"
        :key="item.group"
        :title="getComponentLabel(item)"
        :name="index"
      >
        <ul class="component-group" :style="{ gridTemplateColumns }">
          <template v-for="child in item.children" :key="child.component">
            <canvas-drag-item
              v-if="!child.hidden && getComponentName(child)"
              :data="generateNode({ component: child.snippetName || child.component })"
              @click="componentClick"
            >
              <li class="component-item">
                <div class="component-item-component">
                  <svg-icon :name="child?.icon?.toLowerCase() || 'row'"></svg-icon>
                </div>
                <span class="component-item-name" :title="getComponentName(child)">{{
                  getComponentName(child)
                }}</span>
              </li>
            </canvas-drag-item>
          </template>
        </ul>
      </tiny-collapse-item>
      <search-empty :isShow="!state.components.length" />
    </tiny-collapse>
  </div>
</template>

<script lang="ts">
/* metaService: engine.plugins.materials.component.Main */
import { inject, onMounted, reactive, ref, watch, watchEffect, computed } from 'vue'
import { Collapse, CollapseItem, Search } from '@opentiny/vue'
import { SearchEmpty, CanvasDragItem } from '@opentiny/tiny-engine-common'
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n'
import { iconSearch } from '@opentiny/vue-icon'
import { useMaterial, useCanvas } from '@opentiny/tiny-engine-meta-register'

export default {
  components: {
    TinySearch: Search,
    IconSearch: iconSearch(),
    TinyCollapse: Collapse,
    TinyCollapseItem: CollapseItem,
    CanvasDragItem,
    SearchEmpty
  },
  setup() {
    const COMPONENT_PANEL_COLUMNS = '1fr 1fr 1fr'
    const SHORTCUT_PANEL_COLUMNS = '1fr 1fr 1fr 1fr 1fr 1fr'
    const { generateNode, materialState, getComponentsByGroup } = useMaterial()
    const gridTemplateColumns = ref(COMPONENT_PANEL_COLUMNS)
    
    // 获取国际化 t 函数
    const i18n: any = inject(I18nInjectionKey)
    const t = i18n?.global?.t || ((key: string) => key)
    
    interface PanelState {
      isShortcutPanel: boolean
      materialGroup: string
      emitEvent: (event: string) => void
    }
    const panelState = inject('panelState', {}) as PanelState
    
    const componentsWithChildren = computed(() => materialState.components.filter((item) => item.children.length))

    type Component = typeof componentsWithChildren.value[number]

    // 获取组件标签的国际化文本
    const getComponentLabel = (component: Component) => {
      const currentLocale = i18n?.global?.locale?.value || 'zh_CN'
      if (component.label && typeof component.label === 'object') {
        return component.label[currentLocale] || component.label.zh_CN || component.group
      }
      return component.group
    }

    // 获取组件名称的国际化文本
    const getComponentName = (child: any) => {
      const currentLocale = i18n?.global?.locale?.value || 'zh_CN'
      if (child.name && typeof child.name === 'object') {
        return child.name[currentLocale] || child.name.zh_CN || child.name
      }
      return child.name
    }

    const fetchComponents = (components: Component[], name: string) => {
      if (!name) {
        return components
      }

      const result: Component[] = []
      const currentLocale = i18n?.global?.locale?.value || 'zh_CN'
      
      components.forEach((component) => {
        const children: Component['children'] = []

        component.children.forEach((child) => {
          const childName = getComponentName(child)
          if (childName?.toLowerCase().indexOf(name.toLowerCase()) > -1) {
            children.push(child)
          }
        })

        if (children.length > 0) {
          result.push({
            // @ts-ignore 数据类型兼容
            groupId: component.groupId,
            group: component.group,
            // @ts-ignore 数据类型兼容
            groupName: component.groupName,
            // @ts-ignore 数据类型兼容
            label: component.label,
            children: children
          })
        }
      })

      return result
    }

    const initComponents = () => {
      const groupName = panelState.materialGroup
      if (groupName) {
        return getComponentsByGroup(componentsWithChildren.value, groupName)
      }

      return componentsWithChildren.value
    }

    const state = reactive<{
      components: Component[]
      activeName: number[]
      searchValue: string
    }>({
      components: initComponents(),
      activeName: [],
      searchValue: ''
    })

    watchEffect(() => {
      state.activeName = [...Array(componentsWithChildren.value.length).keys()]
    })

    const change = (value: string) => {
      state.components = fetchComponents(componentsWithChildren.value, value)
    }

    watch(
      () => componentsWithChildren.value,
      (value) => {
        state.components = fetchComponents(value, state.searchValue)
      },
      {
        deep: true
      }
    )

    const componentClick = (data: any) => {
      const { isShortcutPanel, emitEvent } = panelState
      const { addComponent } = useCanvas().canvasApi.value

      if (isShortcutPanel) {
        // FIXME: 类型修复
        // @ts-ignore
        addComponent?.(data, isShortcutPanel)
        emitEvent('close')
      }
    }

    onMounted(() => {
      if (panelState.isShortcutPanel) {
        gridTemplateColumns.value = SHORTCUT_PANEL_COLUMNS
      }
    })

    return {
      gridTemplateColumns,
      state,
      change,
      generateNode,
      componentClick,
      t, // 暴露 t 函数给模板使用
      getComponentLabel, // 暴露 getComponentLabel 函数给模板使用
      getComponentName // 暴露 getComponentName 函数给模板使用
    }
  }
}
</script>

<style lang="less" scoped>
.components-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;

  .tiny-search {
    padding: 12px;
  }

  :deep(.tiny-collapse-item__content) {
    padding: 0 var(--te-common-vertical-form-label-spacing) 4px;
  }

  .component-group {
    display: grid;
    width: 100%;
    color: var(--te-materials-component-list-text-color);

    .component-item {
      padding: var(--te-common-vertical-form-label-spacing) 0 var(--te-common-vertical-form-label-spacing);
      margin-bottom: var(--te-common-vertical-form-label-spacing);
      text-align: center;
      user-select: none;
      cursor: move;
      background: var(--te-materials-component-list-item-bg-color);

      &:hover {
        background: var(--te-materials-component-list-item-bg-color-hover);
        border-radius: 4px;
      }

      .component-item-component {
        margin-bottom: 8px;

        svg {
          font-size: 40px;
          vertical-align: middle;
          color: var(--te-materials-component-list-item-icon-color);
          overflow: hidden;
        }
      }

      .component-item-name {
        max-width: 62px;
        display: inline-block;
        overflow: hidden;
        font-size: 12px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    :deep(.drag-item:nth-child(3n)) {
      .component-item {
        border-right: none;
      }
    }
  }

  .tiny-collapse {
    flex: 1;
    overflow-y: auto;
    .tiny-collapse-item.is-active + .tiny-collapse-item {
      margin-top: 0;
    }
    :deep(.tiny-collapse-item__header .tiny-collapse-item__word-overflow) {
      margin: var(--te-common-vertical-item-spacing-normal) 0px var(--te-common-vertical-form-label-spacing);
    }
    .components-items {
      .item {
        cursor: pointer;
      }
    }
  }
}
</style>
