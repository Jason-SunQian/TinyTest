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

/* metaService: engine.plugins.collections.config */
export const getFieldTypeOptions = (t: (key: string) => string) => [
  {
    name: t('designer.datasource.string'),
    icon: 'text',
    type: 'string',
    value: ''
  },
  {
    name: t('designer.datasource.date'),
    icon: 'datepick',
    type: 'date',
    value: ''
  },
  {
    name: t('designer.datasource.counter'),
    icon: 'numeric',
    type: 'number',
    value: ''
  },
  {
    name: t('designer.datasource.textLink'),
    icon: 'link',
    type: 'link',
    value: ''
  },
  {
    name: t('designer.datasource.switch'),
    icon: 'switch',
    type: 'switch',
    value: ''
  },
  {
    name: t('designer.datasource.slider'),
    icon: 'dragger',
    type: 'slider',
    value: ''
  }
]

export default getFieldTypeOptions
