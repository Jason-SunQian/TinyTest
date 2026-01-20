/**
 * Copyright (c) 2023 - present TinyEngine Authors.
 * Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.
 *
 * Use of this source code is governed by an MIT-style license.
 *
 * THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,
 * BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR
 * A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.
 *
 */

import fs from 'fs-extra'
import * as glob from 'glob'
import KoaRouter from 'koa-router'
import path from 'path'
import MockService from '../services/mockService'
import { getResponseData } from '../tool/Common'

const router = new KoaRouter()
export const mockService = new MockService()
const getJsonPathData = (jpath, method = 'get') => {
  const usefulPath = jpath.split(`${method}${path.sep}`)[1]
  const apipath = usefulPath.split(path.sep)
  const lastSegment = apipath[apipath.length - 1]
  const lastdirname = lastSegment.split('.')[0]
  apipath[apipath.length - 1] = lastdirname
  const [center, version, ...routes] = apipath
  let api = ''
  if (version === 'v1') {
    api = `/${center}/${version}/api/${routes.join('/')}`
  } else {
    api = `/${center}/api/${version}/${routes.join('/')}`
  }
  const data = fs.readJSONSync(path.resolve(__dirname, path.relative(__dirname, jpath)))
  return {
    api,
    data
  }
}

const mockPath = path.resolve(__dirname, '../mock')

// 先注册动态路由，确保它们优先匹配
// 应用 Schema 接口 - 动态返回 extension 数据
router.get('/app-center/v1/api/apps/schema/:id', async (ctx) => {
  const { id } = ctx.params
  // 读取静态 JSON 文件作为基础数据
  const staticSchema = fs.readJSONSync(
    path.resolve(__dirname, '../mock/get/app-center/v1/apps/schema/1.json')
  )

  // 先加载静态 JSON 中的原始 utils
  const utilsMap = new Map()
  if (staticSchema.data && staticSchema.data.utils) {
    staticSchema.data.utils.forEach((item) => {
      utilsMap.set(item.name, { name: item.name, type: item.type, content: item.content })
    })
  }

  // 从数据库读取最新的 extension 数据，合并到 utils（同名则覆盖）
  const extensions = await mockService.extensionService.getExtensionsByApp(id)
  extensions.forEach((item) => {
    const { name, type, content, category, created_at } = item
    if (category === 'utils') {
      // 如果已存在同名项，比较创建时间，保留最新的
      const existing = utilsMap.get(name)
      if (!existing || new Date(created_at) > new Date(existing.created_at || 0)) {
        utilsMap.set(name, { name, type, content })
      }
    }
  })

  const utils = Array.from(utilsMap.values())

  // 更新 schema 中的 utils 数组
  if (staticSchema.data) {
    staticSchema.data.utils = utils
  }

  ctx.body = staticSchema
})

// 注册路由（glob 自动注册）- 在动态路由之后注册，避免覆盖动态路由
glob.globSync(`${mockPath}/get/**/*.json`).forEach((jpath) => {
  const { api, data } = getJsonPathData(jpath)
  // 跳过已经被动态路由处理的接口
  if (api.startsWith('/app-center/v1/api/apps/schema/') ||
      api === '/app-center/api/apps/extension/list' ||
      api === '/app-center/api/apps/extension/delete') {
    return
  }
  router.get(api, (ctx, next) => {
    ctx.body = data
  })
})

glob.globSync(`${mockPath}/post/**/*.json`).forEach((jpath) => {
  const { api, data } = getJsonPathData(jpath, 'post')
  router.post(api, (ctx, next) => {
    // 如果是 extension/create，跳过静态 JSON，让后面的动态路由处理
    if (api === '/app-center/api/apps/extension/create') {
      return next()
    }
    ctx.body = data
  })
})

router.get('/app-center/api/apps/canvas/lock', async (ctx) => {
  ctx.body = await mockService.appService.lock(ctx.request.query)
})

router.post('/app-center/api/schema2code', (ctx) => {
  const { pageInfo } = ctx.request.body
  ctx.body = mockService.schema2codeService.schema2code(pageInfo)
})

router.get('/app-center/api/preview/metadata', (ctx) => {
  ctx.body = mockService.appService.getAppPreviewMetaData()
})

router.post('/app-center/api/pages/create', async (ctx) => {
  ctx.body = await mockService.pageService.create(ctx.request.body)
})

router.post('/app-center/api/pages/update/:id', async (ctx) => {
  const { id } = ctx.params
  const { body } = ctx.request
  ctx.body = await mockService.pageService.update(id, body)
})

router.get('/app-center/api/pages/list/:appId', async (ctx) => {
  const { appId } = ctx.params
  ctx.body = await mockService.pageService.list(appId)
})

router.get('/app-center/api/pages/detail/:id', async (ctx) => {
  const { id } = ctx.params
  ctx.body = await mockService.pageService.detail(id)
})

router.get('/app-center/api/pages/delete/:id', async (ctx) => {
  const { id } = ctx.params
  ctx.body = await mockService.pageService.delete(id)
})

router.get('/material-center/api/block/detail/:id', async (ctx) => {
  const { id } = ctx.params
  ctx.body = await mockService.blockService.detail(id)
})

router.get('/material-center/api/blocks', async (ctx) => {
  const { appId } = ctx.params
  ctx.body = await mockService.blockService.list(appId)
})

router.post('/material-center/api/block/create', async (ctx) => {
  const result = await mockService.blockService.create(ctx.request.body)
  const categoriesId = (ctx.request.body.categories && ctx.request.body.categories[0]) || (ctx.request.body.groups && ctx.request.body.groups[0])
  const _id = result.id
  await mockService.blockCategoryService.update(categoriesId, { _id })
  ctx.body = getResponseData(result)
})

router.post('/material-center/api/block/update/:id', async (ctx) => {
  const { id } = ctx.params
  const { body } = ctx.request
  ctx.body = await mockService.blockService.update(id, body)
})

router.get('/material-center/api/block/delete/:id', async (ctx) => {
  const { id } = ctx.params
  ctx.body = await mockService.blockService.delete(id)
})

router.post('/material-center/api/block-groups/create', async (ctx) => {
  ctx.body = await mockService.blockGroupService.create(ctx.request.body)
})

router.post('/material-center/api/block-groups/update/:id', async (ctx) => {
  const { id } = ctx.params
  const { body } = ctx.request
  ctx.body = await mockService.blockGroupService.update(id, body)
})

router.get('/material-center/api/block-groups/delete/:id', async (ctx) => {
  const { id } = ctx.params
  ctx.body = await mockService.blockGroupService.delete(id)
})

router.get('/material-center/api/block-groups', async (ctx) => {
  const result = await mockService.blockGroupService.find(ctx.query)
  let blockGroup
  if (result.data.length === 0) {
    ctx.body = result
  } else if (result.data.length > 1) {
    blockGroup = await Promise.all(
      result.data.map(async (group) => {
        group.blocks = await Promise.all(
          group.blocks.map(async (block) => {
            const blockData = await mockService.blockService.detail(block.id)
            return blockData
          })
        )
        return group
      })
    )
    ctx.body = getResponseData(blockGroup)
  } else if (result.data.length === 1) {
    blockGroup = result.data[0]
    const blocks = await Promise.all(
      blockGroup.blocks.map(async (item) => {
        const blockData = await mockService.blockService.detail(item)
        return blockData
      })
    )

    blockGroup.blocks = blocks
    ctx.body = getResponseData([blockGroup])
  }
})

router.post('/material-center/api/block-categories', async (ctx) => {
  ctx.body = await mockService.blockCategoryService.create(ctx.request.body)
})

router.put('/material-center/api/block-categories/:id', async (ctx) => {
  const { id } = ctx.params
  const { body } = ctx.request
  ctx.body = await mockService.blockCategoryService.update(id, body)
})

router.delete('/material-center/api/block-categories/:id', async (ctx) => {
  const { id } = ctx.params
  ctx.body = await mockService.blockCategoryService.delete(id)
})

router.get('/material-center/api/block-categories', async (ctx) => {
  const result = await mockService.blockCategoryService.find(ctx.query)
  const blockCategories = await Promise.all(
    result.data.map(async (group) => {
      const blocks = await Promise.all(
        group.blocks.map(async (block) => {
          const blockData = await mockService.blockService.detail(block)
          return blockData
        })
      )
      group.blocks = blocks
      return group
    })
  )
  ctx.body = getResponseData(blockCategories)
})

router.get('/app-center/api/sources/detail/:id', async (ctx) => {
  const { id } = ctx.params
  ctx.body = await mockService.sourceService.detail(id)
})

router.post('/material-center/api/block/deploy', async (ctx) => {
  ctx.body = await mockService.blockBuildService.build(ctx.request.body)
})

router.get('/material-center/api/tasks/:id', async (ctx) => {
  const { id } = ctx.params
  ctx.body = await mockService.taskService.detail(id)
})

router.get('/block-history', async (ctx) => {
  const { id } = ctx.params
  ctx.body = await mockService.blockHistoryService.find(id)
})

router.post('block-history/create', async (ctx) => {
  ctx.body = await mockService.blockHistoryService.create(ctx.request.body)
})

// ========== Extension (Bridge/Utils) 相关接口 ==========
// eslint-disable-next-line no-console
console.log('[MockServer] 注册 Extension 路由...')

// Extension 列表接口 - 覆盖 glob 自动注册的路由
router.get('/app-center/api/apps/extension/list', async (ctx) => {
  const { app, category } = ctx.request.query

  // 先加载静态 JSON 中的原始数据（如果存在）
  const staticListPath = path.resolve(__dirname, '../mock/get/app-center/apps/extension/list.json')
  let staticData = []
  if (fs.existsSync(staticListPath)) {
    const staticList = fs.readJSONSync(staticListPath)
    staticData = staticList.data || []
  }

  // 从数据库读取数据，并合并静态数据
  const result = await mockService.extensionService.list(app, category, staticData)
  ctx.body = result
})

// Extension 创建接口 - 覆盖 glob 自动注册的路由
router.post('/app-center/api/apps/extension/create', async (ctx) => {
  const result = await mockService.extensionService.create(ctx.request.body)
  ctx.body = result
})

// Extension 更新接口 - 覆盖 glob 自动注册的路由
router.post('/app-center/api/apps/extension/update', async (ctx) => {
  const { id } = ctx.request.body
  if (!id) {
    ctx.body = getResponseData(null, 'id is required')
    return
  }
  ctx.body = await mockService.extensionService.update(id, ctx.request.body)
})

// Extension 删除接口 - 覆盖 glob 自动注册的路由
router.get('/app-center/api/apps/extension/delete', async (ctx) => {
  const { id } = ctx.request.query
  if (!id) {
    ctx.body = getResponseData(null, 'id is required')
    return
  }
  ctx.body = await mockService.extensionService.delete(id)
})

export default router
