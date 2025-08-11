const a = {
  datasource: `
  {
    "list": [
      {
        "name": "columns",
        "protocal": "VALUE",
        "initialData": {
          "variable": [
            {
              "title": "序号",
              "sorter": true
            }
          ],
          "type": "variable",
          "value": ""
        }
      }
    ]
  }
  `,
  globalstyle: `
  body {
    background: #ccc
  }
  .crm-button {
    line-height: 26px;
    padding: 0 20px;
  }
  `,
  imports: `
  /**
   * name: 中文桥接源名称
   * path: 导入的路径(包名或者本地路径)
   * item: 导入的项目，可以有以下几种形式：
   *    1、import { httpService } from  
   *    2、import httpService from 
   *    3、import httpService as http from）
   * instance: 实例名，需要注入service时需要添加该字段
  */
  [
    {
      "name": "中文桥接源名称",
      "type": "package",
      "path": "@cloud/crm-http-service", 
      "item": "HttpServie",  
      "instance": "http"  
    }
  ]
  `,
  inputs: `
  /**
   * name: 输入属性名称
   * type: 输入类型，用于typescript类型声明, 不指定则为any,
   * default: 默认值
  */
  [
    {
      "name": "detailUrl",
      "type": "string",
      "default": "rest/cbc/cbccontractmgmtservice/v1/biz/list"
    },
    {
      "name": "options",
      "type": "Array",
      "default": []
    }
  ]  
  `,
  outputs: `
  /**
   * name: 事件名称
   * type: 事件输出数据类型, 用于typescript类型声明, 不指定则为any
  */
  [
    {
      "name": "goToDetailPage",
      "type": "object"
    }
  ] `
}, r = (t) => {
  const e = `${t || ""}`.toLocaleLowerCase();
  return a[e];
};
export {
  r as getExample
};
//# sourceMappingURL=example.js.map
