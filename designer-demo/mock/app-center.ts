import { MockMethod } from 'vite-plugin-mock'

// 通用请求日志记录
const logRequest = (url: string, method: string, query?: any, body?: any) => {
  console.log(`[MOCK] ${method.toUpperCase()} ${url}`, {
    query,
    body,
    timestamp: new Date().toISOString()
  })
}

export default [
  // 应用详情接口
  {
    url: '/app-center/api/apps/detail/:id',
    method: 'get',
    response: ({ query }) => {
      logRequest('/app-center/api/apps/detail/:id', 'get', query)
      return {
        data: {
          id: query.id || "1",
          name: "portal-app",
          app_desc: "demo应用",
          app_website: "",
          obs_url: null,
          published_at: "",
          created_at: "2022-06-08 03:19:01",
          updated_at: "2023-08-23 10:22:28",
          platform: "Vue",
          state: "published",
          published: true,
          tenant: 1,
          editor_url: ""
        }
      }
    }
  },

  // 应用列表接口
  {
    url: '/app-center/api/apps/list/:platformId',
    method: 'get',
    response: ({ query }) => {
      return {
        data: [
          {
            id: "1",
            name: "portal-app",
            app_desc: "demo应用",
            app_website: "",
            obs_url: null,
            published_at: "",
            created_at: "2022-06-08 03:19:01",
            updated_at: "2023-08-23 10:22:28",
            platform: "Vue",
            state: "published",
            published: true,
            tenant: 1,
            editor_url: ""
          }
        ]
      }
    }
  },

  // 应用Schema接口 - 这是最核心的接口
  {
    url: '/app-center/v1/api/apps/schema/:id',
    method: 'get',
    response: ({ query }) => {
      logRequest('/app-center/v1/api/apps/schema/:id', 'get', query)
      return {
        data: {
          meta: {
            name: "portal-app",
            tenant: 1,
            git_group: "",
            project_name: "",
            description: "demo应用",
            branch: "develop",
            is_demo: null,
            global_state: [],
            appId: query.id || "1",
            creator: "",
            gmt_create: "2022-06-08 03:19:01",
            gmt_modified: "2023-08-23 10:22:28"
          },
          dataSource: {
            list: [
              {
                id: 132,
                name: "getAllComponent",
                data: {
                  data: [],
                  type: "array"
                },
                tpl: null,
                app: query.id || "1",
                desc: null,
                created_at: "2022-06-28T06:26:26.000Z",
                updated_at: "2022-06-28T07:02:30.000Z"
              }
            ]
          },
          bridge: {
            list: []
          },
          i18n: {
            list: []
          },
          componentsTree: [
            {
              id: "1",
              componentName: "Page",
              props: {
                style: {
                  width: "100%",
                  height: "100%"
                }
              },
              children: [
                {
                  id: "2",
                  componentName: "TinyButton",
                  props: {
                    type: "primary",
                    children: "按钮"
                  }
                }
              ]
            }
          ],
          componentsMap: [
            {
              componentName: "TinyButton",
              package: "@opentiny/vue",
              version: "3.20.0",
              exportName: "TinyButton",
              destructuring: true
            },
            {
              componentName: "TinyTimeLine",
              package: "@opentiny/vue",
              version: "3.20.0",
              exportName: "TinyTimeLine",
              destructuring: true
            },
            {
              componentName: "div",
              package: "html",
              version: "",
              exportName: "div",
              destructuring: false
            },
            {
              componentName: "Page",
              package: "@opentiny/tiny-engine",
              version: "2.7.0",
              exportName: "Page",
              destructuring: true
            }
          ]
        }
      }
    }
  },

  // 页面列表接口
  {
    url: '/app-center/api/pages/list/:appId',
    method: 'get',
    response: ({ query }) => {
      logRequest('/app-center/api/pages/list/:id', 'get', query)
      return {
        data: [
          {
            name: "createVm",
            id: "1",
            app: query.appId || "1",
            route: "createVm",
            page_content: {
              state: {
                dataDisk: [1, 2, 3]
              },
              methods: {},
              componentName: "Page",
              css: "body {\r\n  background-color:#eef0f5 ;\r\n  margin-bottom: 80px;\r\n}",
              props: {},
              children: [
                {
                  componentName: "div",
                  props: {
                    style: "padding-bottom: 10px; padding-top: 10px;"
                  },
                  id: "2b2cabf0",
                  children: [
                    {
                      componentName: "TinyTimeLine",
                      props: {
                        active: "2",
                        data: [
                          { name: "基础配置" },
                          { name: "网络配置" },
                          { name: "高级配置" },
                          { name: "确认配置" }
                        ],
                        horizontal: true,
                        style: "border-radius: 0px;"
                      },
                      id: "dd764b17"
                    }
                  ]
                },
                {
                  componentName: "div",
                  props: {
                    style: "border-width: 1px; border-style: solid; border-radius: 4px; border-color: #fff; padding-top: 10px; padding-bottom: 10px; padding-left: 10px; padding-right: 10px; box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px; background-color: #fff; margin-bottom: 10px;"
                  },
                  id: "30c94cc8",
                  children: [
                    {
                      componentName: "TinyForm",
                      props: {
                        labelWidth: "80px",
                        labelPosition: "top",
                        inline: false,
                        "label-position": "left ",
                        "label-width": "150px",
                        style: "border-radius: 0px;"
                      },
                      children: [
                        {
                          componentName: "TinyFormItem",
                          props: {
                            label: "计费模式"
                          },
                          children: [
                            {
                              componentName: "TinyButtonGroup",
                              props: {
                                data: [
                                  {
                                    text: "包年/包月",
                                    value: "1"
                                  },
                                  {
                                    text: "按需计费",
                                    value: "2"
                                  }
                                ],
                                modelValue: "1"
                              },
                              id: "a8d84361"
                            }
                          ],
                          id: "9f39f3e7"
                        },
                        {
                          componentName: "TinyFormItem",
                          props: {
                            label: "区域"
                          },
                          children: [
                            {
                              componentName: "TinyButtonGroup",
                              props: {
                                data: [
                                  {
                                    text: "乌兰察布二零一",
                                    value: "1"
                                  }
                                ],
                                modelValue: "1",
                                style: "border-radius: 0px; margin-right: 10px;"
                              },
                              id: "c97ccd99"
                            },
                            {
                              componentName: "Text",
                              props: {
                                text: "温馨提示：页面左上角切换区域",
                                style: "background-color: [object Event]; color: #8a8e99; font-size: 12px;"
                              },
                              id: "20923497"
                            },
                            {
                              componentName: "Text",
                              props: {
                                text: "不同区域的云服务产品之间内网互不相通；请就近选择靠近您业务的区域，可减少网络时延，提高访问速度",
                                style: "display: block; color: #8a8e99; border-radius: 0px; font-size: 12px;"
                              },
                              id: "54780a26"
                            }
                          ],
                          id: "4966384d"
                        },
                        {
                          componentName: "TinyFormItem",
                          props: {
                            label: "可用区",
                            style: "border-radius: 0px;"
                          },
                          children: [
                            {
                              componentName: "TinyButtonGroup",
                              props: {
                                data: [
                                  {
                                    text: "可用区1",
                                    value: "1"
                                  },
                                  {
                                    text: "可用区2",
                                    value: "2"
                                  },
                                  {
                                    text: "可用区3",
                                    value: "3"
                                  }
                                ],
                                modelValue: "1"
                              },
                              id: "6184481b"
                            }
                          ],
                          id: "690837bf"
                        }
                      ],
                      id: "b6a425d4"
                    }
                  ]
                }
              ],
              fileName: "createVm"
            },
            tenant: 1,
            isBody: false,
            parentId: "0",
            group: "staticPages",
            depth: 0,
            isPage: true,
            isDefault: false,
            occupier: {
              id: 86,
              username: "开发者",
              email: "developer@lowcode.com",
              confirmationToken: "dfb2c162-351f-4f44-ad5f-8998",
              is_admin: true
            },
            isHome: false,
            _id: "1"
          },
          {
            name: "DemoPage",
            id: "5bhD7p5FUsUOTFRN",
            app: query.appId || "1",
            route: "demopage",
            page_content: {
              state: {},
              methods: {},
              componentName: "Page",
              css: "",
              props: {},
              lifeCycles: {},
              children: [
                {
                  componentName: "div",
                  props: {},
                  id: "85375559",
                  children: [
                    {
                      componentName: "TinySwitch",
                      props: {
                        modelValue: ""
                      },
                      id: "33433546"
                    }
                  ]
                }
              ],
              dataSource: {
                list: []
              },
              utils: [],
              bridge: [],
              inputs: [],
              outputs: [],
              fileName: "DemoPage"
            },
            tenant: 1,
            isBody: false,
            parentId: "0",
            group: "staticPages",
            depth: 0,
            isPage: true,
            isDefault: false,
            occupier: {
              id: 86,
              username: "开发者",
              email: "developer@lowcode.com",
              confirmationToken: "dfb2c162-351f-4f44-ad5f-8998",
              is_admin: true
            },
            isHome: false,
            message: "Page auto save",
            _id: "5bhD7p5FUsUOTFRN"
          }
        ]
      }
    }
  },

  // 页面详情接口
  {
    url: '/app-center/api/pages/detail/:id',
    method: 'get',
    response: ({ query }) => {
      logRequest('/app-center/api/pages/detail/:id', 'get', query)
      return {
        data: {
          name: "createVm",
          id: query.id || "1",
          app: "1",
          route: "createVm",
          page_content: {
            state: {
              dataDisk: [1, 2, 3]
            },
            methods: {},
            componentName: "Page",
            css: "body {\r\n  background-color:#eef0f5 ;\r\n  margin-bottom: 80px;\r\n}",
            props: {},
            children: [
              {
                componentName: "div",
                props: {
                  style: "padding-bottom: 10px; padding-top: 10px;"
                },
                id: "2b2cabf0",
                children: [
                  {
                    componentName: "TinyTimeLine",
                    props: {
                      active: 2,
                      data: [
                        { name: "基础配置" },
                        { name: "网络配置" },
                        { name: "高级配置" },
                        { name: "确认配置" }
                      ],
                      horizontal: true,
                      style: "border-radius: 0px;"
                    },
                    id: "dd764b17"
                  }
                ]
              },
              {
                componentName: "div",
                props: {
                  style: "border-width: 1px; border-style: solid; border-radius: 4px; border-color: #fff; padding-top: 10px; padding-bottom: 10px; padding-left: 10px; padding-right: 10px; box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px; background-color: #fff; margin-bottom: 10px;"
                },
                id: "container-1",
                children: [
                  {
                    componentName: "TinyForm",
                    props: {
                      labelWidth: "80px",
                      labelPosition: "top",
                      inline: false,
                      "label-position": "left ",
                      "label-width": "150px",
                      style: "border-radius: 0px;"
                    },
                    children: [
                      {
                        componentName: "TinyFormItem",
                        props: {
                          label: "计费模式"
                        },
                        children: [
                          {
                            componentName: "TinyButtonGroup",
                            props: {
                              data: [
                                {
                                  text: "包年/包月",
                                  value: "1"
                                },
                                {
                                  text: "按需计费",
                                  value: "2"
                                }
                              ],
                              modelValue: "1"
                            },
                            id: "a8d84361"
                          }
                        ],
                        id: "9f39f3e7"
                      },
                      {
                        componentName: "TinyFormItem",
                        props: {
                          label: "区域"
                        },
                        children: [
                          {
                            componentName: "TinyButtonGroup",
                            props: {
                              data: [
                                {
                                  text: "乌兰察布二零一",
                                  value: "1"
                                }
                              ],
                              modelValue: "1",
                              style: "border-radius: 0px; margin-right: 10px;"
                            },
                            id: "c97ccd99"
                          },
                          {
                            componentName: "Text",
                            props: {
                              text: "温馨提示：页面左上角切换区域",
                              style: "background-color: [object Event]; color: #8a8e99; font-size: 12px;"
                            },
                            id: "20923497"
                          },
                          {
                            componentName: "Text",
                            props: {
                              text: "不同区域的云服务产品之间内网互不相通；请就近选择靠近您业务的区域，可减少网络时延，提高访问速度",
                              style: "display: block; color: #8a8e99; border-radius: 0px; font-size: 12px;"
                            },
                            id: "54780a26"
                          }
                        ],
                        id: "4966384d"
                      },
                      {
                        componentName: "TinyFormItem",
                        props: {
                          label: "可用区",
                          style: "border-radius: 0px;"
                        },
                        children: [
                          {
                            componentName: "TinyButtonGroup",
                            props: {
                              data: [
                                {
                                  text: "可用区1",
                                  value: "1"
                                },
                                {
                                  text: "可用区2",
                                  value: "2"
                                },
                                {
                                  text: "可用区3",
                                  value: "3"
                                }
                              ],
                              modelValue: "1"
                            },
                            id: "b8d84361"
                          }
                        ],
                        id: "9f39f3e8"
                      },
                      {
                        componentName: "TinyFormItem",
                        props: {
                          label: "配置费用 ¥1.5776 小时",
                          style: "border-radius: 0px;"
                        },
                        children: [
                          {
                            componentName: "div",
                            props: {
                              style: "text-align: right; margin-top: 20px;"
                            },
                            children: [
                              {
                                componentName: "TinyButton",
                                props: {
                                  type: "primary",
                                  children: "下一步: 网络配置"
                                },
                                id: "next-button"
                              }
                            ],
                            id: "button-container"
                          }
                        ],
                        id: "9f39f3e9"
                      }
                    ],
                    id: "form-container"
                  }
                ]
              }
            ]
          }
        }
      }
    }
  },

  // 页面更新接口
  {
    url: '/app-center/api/pages/update/:id',
    method: 'post',
    response: ({ query, body }) => {
      console.log('页面更新:', query.id, body)
      return {
        data: {
          id: query.id,
          success: true,
          message: "更新成功"
        }
      }
    }
  },

  // 页面创建接口
  {
    url: '/app-center/api/pages/create',
    method: 'post',
    response: ({ body }) => {
      console.log('页面创建:', body)
      return {
        data: {
          id: Date.now().toString(),
          success: true,
          message: "创建成功"
        }
      }
    }
  },

  // 页面删除接口
  {
    url: '/app-center/api/pages/delete/:id',
    method: 'get',
    response: ({ query }) => {
      console.log('页面删除:', query.id)
      return {
        data: {
          id: query.id,
          success: true,
          message: "删除成功"
        }
      }
    }
  },

  // 应用更新接口
  {
    url: '/app-center/api/apps/update/:id',
    method: 'post',
    response: ({ query, body }) => {
      console.log('应用更新:', query.id, body)
      return {
        data: {
          id: query.id,
          success: true,
          message: "更新成功"
        }
      }
    }
  },

  // 页面历史接口
  {
    url: '/app-center/api/pages/histories',
    method: 'get',
    response: ({ query }) => {
      return {
        data: [
          {
            id: "1",
            page: query.page || "1",
            schema: {
              componentsTree: [],
              componentsMap: []
            },
            created_at: "2022-06-08 03:19:01",
            updated_at: "2023-08-23 10:22:28"
          }
        ]
      }
    }
  },

  // 页面历史详情接口
  {
    url: '/app-center/api/pages/histories/:id',
    method: 'get',
    response: ({ query }) => {
      return {
        data: {
          id: query.id,
          page: "1",
          schema: {
            componentsTree: [],
            componentsMap: []
          },
          created_at: "2022-06-08 03:19:01",
          updated_at: "2023-08-23 10:22:28"
        }
      }
    }
  },

  // 页面历史恢复接口
  {
    url: '/app-center/api/pageHistory/restore',
    method: 'post',
    response: ({ body }) => {
      console.log('页面历史恢复:', body)
      return {
        data: {
          success: true,
          message: "恢复成功"
        }
      }
    }
  },

  // 画布锁定接口
  {
    url: '/app-center/api/apps/canvas/lock',
    method: 'get',
    response: ({ query }) => {
      logRequest('/app-center/api/apps/canvas/lock', 'get', query)
      return {
        data: {
          locked: false,
          message: "画布未锁定"
        }
      }
    }
  },

  // 代码生成接口
  {
    url: '/app-center/api/schema2code',
    method: 'post',
    response: ({ body }) => {
      logRequest('/app-center/api/schema2code', 'post', {}, body)
      return {
        data: {
          code: "// 生成的代码",
          success: true,
          message: "代码生成成功"
        }
      }
    }
  },

  // 预览元数据接口
  {
    url: '/app-center/api/preview/metadata',
    method: 'get',
    response: () => {
      logRequest('/app-center/api/preview/metadata', 'get')
      return {
        data: {
          title: "页面预览",
          description: "这是一个页面预览",
          version: "1.0.0"
        }
      }
    }
  },

  // 数据源详情接口
  {
    url: '/app-center/api/sources/detail/:id',
    method: 'get',
    response: ({ query }) => {
      logRequest('/app-center/api/sources/detail/:id', 'get', query)
      return {
        data: {
          id: query.id,
          name: "示例数据源",
          type: "api",
          url: "https://api.example.com/data",
          method: "GET",
          headers: {},
          params: {}
        }
      }
    }
  }
] as MockMethod[]
