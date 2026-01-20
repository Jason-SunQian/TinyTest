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
import DateStore from '@seald-io/nedb'
import { getDatabasePath, getResponseData } from '../tool/Common'

export default class ExtensionService {
  constructor () {
    this.db = new DateStore({
      filename: getDatabasePath('extensions.db'),
      autoload: true
    })

    this.db.ensureIndex({
      fieldName: 'name',
      unique: false
    })

    this.extensionModel = {
      id: '',
      name: '',
      type: 'npm', // 'npm' or 'function'
      category: 'utils', // 'utils' or 'bridge'
      app: 1, // 统一使用数字格式，与旧数据保持一致
      content: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  async create (params) {
    // 确保 app 字段统一为数字格式（与旧数据保持一致）
    const normalizedParams = Object.assign({}, params, {
      app: Number(params.app || '1')
    })
    const extensionData = Object.assign({}, this.extensionModel, normalizedParams, {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    const result = await this.db.insertAsync(extensionData)
    const { _id } = result
    await this.db.updateAsync({ _id }, { $set: { id: _id } })
    result.id = result._id

    const response = getResponseData(result)
    return response
  }

  // 获取应用的 extension 列表（从数据库读取）
  async getExtensionsByApp (appId) {
    const appIdNum = Number(appId || '1')
    const appIdStr = String(appId || '1')
    // 分别查询数字和字符串格式，然后合并去重
    const numExtensions = await this.db.findAsync({ app: appIdNum })
    const strExtensions = await this.db.findAsync({ app: appIdStr })
    // 合并结果，使用 _id 去重
    const extensionMap = new Map()
    strExtensions.forEach(ext => extensionMap.set(ext._id, ext))
    numExtensions.forEach(ext => extensionMap.set(ext._id, ext))
    return Array.from(extensionMap.values())
  }

  async update (id, params) {
    // 确保 app 字段统一为数字格式
    const normalizedParams = Object.assign({}, params, {
      app: params.app ? Number(params.app) : undefined
    })
    const updateData = Object.assign({}, normalizedParams, {
      updated_at: new Date().toISOString()
    })
    await this.db.updateAsync({ _id: id }, { $set: updateData })
    const result = await this.db.findOneAsync({ _id: id })
    return getResponseData(result)
  }

  async delete (id) {
    const result = await this.db.findOneAsync({ _id: id })
    if (result) {
      await this.db.removeAsync({ _id: id })
      return getResponseData(result)
    }
    return getResponseData(null)
  }

  async list (appId, category, staticData = []) {
    // 先加载静态数据到 Map 中（按 name 去重）
    const resultMap = new Map()
    staticData.forEach((item) => {
      if (!category || item.category === category) {
        resultMap.set(item.name, item)
      }
    })

    // 兼容查询：同时查询数字和字符串格式（因为数据库中可能有旧数据是字符串格式）
    const appIdNum = Number(appId || '1')
    const appIdStr = String(appId || '1')
    // 分别查询数字和字符串格式，然后合并去重
    const numResult = await this.db.findAsync({ app: appIdNum })
    const strResult = await this.db.findAsync({ app: appIdStr })
    // 合并数据库结果，使用 name 去重（保留最新的）
    numResult.forEach(item => {
      if (!category || item.category === category) {
        const existing = resultMap.get(item.name)
        if (!existing || new Date(item.created_at) > new Date(existing.created_at || 0)) {
          resultMap.set(item.name, item)
        }
      }
    })
    strResult.forEach(item => {
      if (!category || item.category === category) {
        const existing = resultMap.get(item.name)
        if (!existing || new Date(item.created_at) > new Date(existing.created_at || 0)) {
          resultMap.set(item.name, item)
        }
      }
    })

    const result = Array.from(resultMap.values())
    // 按 created_at 降序排序
    result.sort((a, b) => {
      const timeA = new Date(a.created_at || 0).getTime()
      const timeB = new Date(b.created_at || 0).getTime()
      return timeB - timeA
    })
    const response = getResponseData(result)
    return response
  }

  async detail (id) {
    const result = await this.db.findOneAsync({ _id: id })
    return getResponseData(result)
  }
}
