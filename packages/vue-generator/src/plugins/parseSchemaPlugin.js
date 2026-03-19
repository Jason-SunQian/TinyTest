import { BUILTIN_COMPONENTS_MAP } from '@/constant'

/**
 * ion-label/mr-label 使用 slot 显示内容，不支持 label 属性。
 * 若 schema 误用 props.label，转为 children，保证出码为 <mr-label>123</mr-label>
 */
function patchMrLabelPropsToChildren(node) {
  if (!node || typeof node !== 'object') return
  if (node.componentName === 'MrLabel') {
    const props = node.props || {}
    const labelVal = props.label
    const children = node.children
    const hasChildren = Array.isArray(children)
      ? children.length > 0
      : children !== undefined && children !== null && children !== ''
    if (typeof labelVal === 'string' && labelVal !== '' && !hasChildren) {
      node.children = labelVal
      delete props.label
    }
  }
  const children = node.children
  if (Array.isArray(children)) {
    children.forEach((child) => patchMrLabelPropsToChildren(child))
  }
}

function parseSchema() {
  return {
    name: 'tinyEngine-generateCode-plugin-parse-schema',
    description: 'parse schema, preprocess schema',

    /**
     * 解析schema，预处理 schema
     * @param {import('@opentiny/tiny-engine-dsl-vue').IAppSchema} schema
     * @returns
     */
    run(schema) {
      const { pageSchema } = schema
      const pagesMap = {}
      const resPageTree = []

      schema.componentsMap = [...schema.componentsMap, ...BUILTIN_COMPONENTS_MAP]

      // MrLabel props.label -> children 转换（blockSchema）
      const blockSchema = schema.blockSchema || []
      blockSchema.forEach((block) => patchMrLabelPropsToChildren(block))

      for (const componentItem of pageSchema) {
        pagesMap[componentItem.meta.id] = componentItem
      }

      for (const componentItem of pageSchema) {
        if (!componentItem.meta.isPage) {
          continue
        }

        const newComponentItem = structuredClone(componentItem)
        let path = ''
        let curParentId = componentItem.meta.parentId
        let depth = 0

        while (curParentId !== '0' && depth < 1000) {
          const preFolder = pagesMap[curParentId]

          path = `${preFolder.meta.name}${path ? '/' : ''}${path}`
          newComponentItem.meta.router = `${preFolder.meta.router}/${newComponentItem.meta.router}`
          curParentId = preFolder.meta.parentId
          depth++
        }

        newComponentItem.path = path

        patchMrLabelPropsToChildren(newComponentItem)
        resPageTree.push(newComponentItem)
      }

      schema.pageSchema = resPageTree
    }
  }
}

export default parseSchema
