import { MockMethod } from 'vite-plugin-mock'

const logRequest = (url: string, method: string, query?: any, body?: any) => {
  console.log(`[MOCK] ${method.toUpperCase()} ${url}`, {
    query,
    body,
    timestamp: new Date().toISOString()
  })
}

export default [
  // 区块分组接口
  {
    url: '/material-center/api/block-groups',
    method: 'get',
    response: ({ query }) => {
      logRequest('/material-center/api/block-groups', 'get', query)
      return {
        data: [
          {
            id: "b57MCCORYPGjgL23",
            name: "默认分组",
            app: {
              id: 1,
              name: "portal-app",
              description: "demo应用"
            },
            blocks: [
              {
                id: "block1",
                label: "示例区块1",
                name: "ExampleBlock1",
                description: "这是一个示例区块",
                category: "通用",
                author: "开发者",
                version: "1.0.0",
                created_at: "2022-06-08 03:19:01",
                updated_at: "2023-08-23 10:22:28"
              }
            ]
          }
        ]
      }
    }
  },

  // 区块详情接口
  {
    url: '/material-center/api/block/detail/:id',
    method: 'get',
    response: ({ query }) => {
      return {
        data: {
          id: query.id,
          label: "示例区块",
          name: "ExampleBlock",
          description: "这是一个示例区块",
          category: "通用",
          author: "开发者",
          version: "1.0.0",
          schema: {
            componentName: "ExampleBlock",
            props: {
              title: {
                type: "string",
                default: "示例标题"
              }
            }
          },
          created_at: "2022-06-08 03:19:01",
          updated_at: "2023-08-23 10:22:28"
        }
      }
    }
  },

  // 区块列表接口
  {
    url: '/material-center/api/blocks',
    method: 'get',
    response: ({ query }) => {
      logRequest('/material-center/api/blocks', 'get', query)
      return {
        data: [
          {
            id: "ALvDb0JD8atzd3nA",
            label: "PortalHome",
            name_cn: null,
            framework: "Vue",
            content: {
              state: {},
              methods: {},
              componentName: "Block",
              fileName: "PortalHome",
              css: "",
              props: {},
              children: []
            },
            created_at: "2022-06-08 03:19:01",
            updated_at: "2023-08-23 10:22:28"
          },
          {
            id: "V85zd9sWEya25Kxh",
            label: "PortalBlock",
            name_cn: null,
            framework: "Vue",
            content: {
              state: {},
              methods: {},
              componentName: "Block",
              fileName: "PortalBlock",
              css: "",
              props: {},
              children: []
            },
            created_at: "2022-06-08 03:19:01",
            updated_at: "2023-08-23 10:22:28"
          }
        ]
      }
    }
  },

  // 区块查询接口
  {
    url: '/material-center/api/block',
    method: 'get',
    response: ({ query }) => {
      return {
        data: {
          id: "block1",
          label: query.label || "示例区块",
          name: "ExampleBlock",
          description: "这是一个示例区块",
          category: "通用",
          author: "开发者",
          version: "1.0.0",
          schema: {
            componentName: "ExampleBlock",
            props: {
              title: {
                type: "string",
                default: "示例标题"
              }
            }
          },
          created_at: "2022-06-08 03:19:01",
          updated_at: "2023-08-23 10:22:28"
        }
      }
    }
  },

  // 区块创建接口
  {
    url: '/material-center/api/block/create',
    method: 'post',
    response: ({ body }) => {
      console.log('区块创建:', body)
      return {
        data: {
          id: Date.now().toString(),
          success: true,
          message: "创建成功"
        }
      }
    }
  },

  // 区块更新接口
  {
    url: '/material-center/api/block/update/:id',
    method: 'post',
    response: ({ query, body }) => {
      console.log('区块更新:', query.id, body)
      return {
        data: {
          id: query.id,
          success: true,
          message: "更新成功"
        }
      }
    }
  },

  // 区块删除接口
  {
    url: '/material-center/api/block/delete/:id',
    method: 'get',
    response: ({ query }) => {
      console.log('区块删除:', query.id)
      return {
        data: {
          id: query.id,
          success: true,
          message: "删除成功"
        }
      }
    }
  },

  // 区块分组创建接口
  {
    url: '/material-center/api/block-groups/create',
    method: 'post',
    response: ({ body }) => {
      console.log('区块分组创建:', body)
      return {
        data: {
          id: Date.now().toString(),
          success: true,
          message: "创建成功"
        }
      }
    }
  },

  // 区块分组更新接口
  {
    url: '/material-center/api/block-groups/update/:id',
    method: 'post',
    response: ({ query, body }) => {
      console.log('区块分组更新:', query.id, body)
      return {
        data: {
          id: query.id,
          success: true,
          message: "更新成功"
        }
      }
    }
  },

  // 区块分组删除接口
  {
    url: '/material-center/api/block-groups/delete/:id',
    method: 'get',
    response: ({ query }) => {
      console.log('区块分组删除:', query.id)
      return {
        data: {
          id: query.id,
          success: true,
          message: "删除成功"
        }
      }
    }
  },

  // 区块分类接口
  {
    url: '/material-center/api/block-categories',
    method: 'get',
    response: ({ query }) => {
      return {
        data: [
          {
            id: "1",
            name: "通用组件",
            description: "通用组件分类",
            blocks: []
          }
        ]
      }
    }
  },

  // 区块分类创建接口
  {
    url: '/material-center/api/block-categories',
    method: 'post',
    response: ({ body }) => {
      console.log('区块分类创建:', body)
      return {
        data: {
          id: Date.now().toString(),
          success: true,
          message: "创建成功"
        }
      }
    }
  },

  // 区块分类更新接口
  {
    url: '/material-center/api/block-categories/:id',
    method: 'put',
    response: ({ query, body }) => {
      console.log('区块分类更新:', query.id, body)
      return {
        data: {
          id: query.id,
          success: true,
          message: "更新成功"
        }
      }
    }
  },

  // 区块分类删除接口
  {
    url: '/material-center/api/block-categories/:id',
    method: 'delete',
    response: ({ query }) => {
      console.log('区块分类删除:', query.id)
      return {
        data: {
          id: query.id,
          success: true,
          message: "删除成功"
        }
      }
    }
  },

  // 区块部署接口
  {
    url: '/material-center/api/block/deploy',
    method: 'post',
    response: ({ body }) => {
      console.log('区块部署:', body)
      return {
        data: {
          taskId: Date.now().toString(),
          success: true,
          message: "部署任务已创建"
        }
      }
    }
  },

  // 任务详情接口
  {
    url: '/material-center/api/tasks/:id',
    method: 'get',
    response: ({ query }) => {
      return {
        data: {
          id: query.id,
          status: "completed",
          progress: 100,
          result: "部署成功"
        }
      }
    }
  }
] as MockMethod[]
