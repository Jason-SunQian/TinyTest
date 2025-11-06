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
/* metaService: engine.service.breadcrumb.custom.useBreadcrumb */

import { ref, computed } from 'vue'

// 全局共享的面包屑数据
const breadcrumbData = ref<any[]>([])
// 全局共享的类型
const breadcrumbType = ref<'page' | 'block'>('page')

// 初始化：从 sessionStorage 恢复
const storedType = sessionStorage.getItem('breadcrumbType')
const storedData = sessionStorage.getItem('breadcrumbData')
if (storedType) {
  breadcrumbType.value = storedType as 'page' | 'block'
}
if (storedData) {
  try {
    breadcrumbData.value = JSON.parse(storedData)
  } catch (e) {
    breadcrumbData.value = []
  }
}

export default function useBreadcrumb() {
  const setBreadcrumbPage = (value: any) => {
    breadcrumbType.value = 'page'
    breadcrumbData.value = value
    sessionStorage.setItem('breadcrumbData', JSON.stringify(value))
    sessionStorage.setItem('breadcrumbType', 'page')
  }

  const setBreadcrumbBlock = (value: any) => {
    breadcrumbType.value = 'block'
    breadcrumbData.value = value
    sessionStorage.setItem('breadcrumbData', JSON.stringify(value))
    sessionStorage.setItem('breadcrumbType', 'block')
  }

  const getBreadcrumbData = () => breadcrumbData

  // 返回简化的接口（直接返回 ref，不用函数）
  return {
    setBreadcrumbPage,
    setBreadcrumbBlock,
    getBreadcrumbData,
    breadcrumbType  // 直接返回 ref
  }
}

