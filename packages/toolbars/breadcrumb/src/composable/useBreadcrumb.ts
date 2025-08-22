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
/* metaService: engine.service.breadcrumb.useBreadcrumb */

import { ref, computed, inject } from 'vue'
import { I18nInjectionKey } from '@opentiny/tiny-engine-common/js/i18n'

const breadcrumbData = ref<any[]>([])

const CONSTANTS = computed(() => {
  const i18n: any = inject(I18nInjectionKey)
  const t = i18n?.global?.t || ((key: string) => key)
  return {
    PAGETEXT: t('designer.toolbar.page'),
    BLOCKTEXT: t('designer.leftPanel.blockManagement')
  }
})

const setBreadcrumbPage = (value: any) => {
  breadcrumbData.value = [CONSTANTS.value.PAGETEXT, ...value]
  sessionStorage.setItem('pageInfo', value)
}

const setBreadcrumbBlock = (value: any) => {
  breadcrumbData.value = [CONSTANTS.value.BLOCKTEXT, ...value]
  sessionStorage.setItem('blockInfo', value)
}

const getBreadcrumbData = () => breadcrumbData

export default function useBreadcrumb() {
  return {
    CONSTANTS,
    setBreadcrumbPage,
    setBreadcrumbBlock,
    getBreadcrumbData
  }
}
