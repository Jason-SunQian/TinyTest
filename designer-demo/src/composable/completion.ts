/**
 * 自定义代码提示配置
 * 扩展了 packages/common/js/completion.js 的功能
 * 添加了项目特定的关键字提示，如 this.http, this.router 等
 */

import { useCanvas, useResource } from '@opentiny/tiny-engine-meta-register'
import { getAllKeywords } from '@/config/completion-keywords'

// 使用配置文件中的关键字列表
const keyWords = getAllKeywords()

const snippets = [
  {
    lable: 'new function',
    type: 'Function',
    insertText: `function \${1:funName} (\${2}) {
  \${3}
}`,
    detail: 'create new function'
  }
]

const TYPES = {
  KeyWord: 'KeyWord',
  Function: 'Function',
  Method: 'Method',
  Value: 'Value',
  Variable: 'Variable'
}

const getApiSuggestions = (monaco: any, range: any, wordContent: string) =>
  keyWords
    .map((item) => ({
      label: `this.${item}`,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: `this.${item}`,
      detail: `Lowcode API`,
      range
    }))
    .filter(({ insertText }) => insertText.indexOf(wordContent) === 0)

const getSnippetsSuggestions = (monaco: any, range: any, wordContent: string) =>
  snippets
    .map((item) => ({
      label: item.lable,
      insertText: item.insertText,
      detail: item.detail,
      kind: monaco.languages.CompletionItemKind[item.type],
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range
    }))
    .filter(({ insertText }) => insertText.indexOf(wordContent) === 0)

const getUserWords = () => {
  const { bridge = [], dataSource = [], utils = [], globalState = [] } = useResource().appSchemaState

  return {
    state: {
      type: TYPES.Variable,
      getInsertText: (value: string) => `this.state.${value}`,
      data: Object.keys(useCanvas().getPageSchema().state || {})
    },
    stores: {
      type: TYPES.Variable,
      getInsertText: (value: string) => `this.stores.${value}`,
      data: globalState
        .filter((item: any) => item.id)
        .map((item: any) => [
          item.id,
          ...[...Object.keys(item.state || {}), ...Object.keys(item.getters || {})].map((name: string) => `${item.id}.${name}`)
        ])
        .flat()
    },
    storeFn: {
      type: TYPES.Method,
      getInsertText: (value: string) => `this.stores.${value}()`,
      data: globalState
        .filter((item: any) => item.id)
        .map((item: any) => Object.keys(item.actions || {}).map((name: string) => `${item.id}.${name}`))
        .flat()
    },
    utils: {
      type: TYPES.Variable,
      getInsertText: (value: string) => `this.utils.${value}`,
      data: utils.map((item: any) => item.name)
    },
    dataSource: {
      type: TYPES.Method,
      getInsertText: (value: string) => `this.dataSourceMap.${value}.load()`,
      data: dataSource.map((item: any) => item.name)
    },
    bridge: {
      type: TYPES.Variable,
      getInsertText: (value: string) => `this.bridge.${value}`,
      data: bridge.map((item: any) => item.name)
    }
  }
}

const getUserSuggestions = (monaco: any, range: any, wordContent: string) => {
  const userWords = getUserWords()

  return Object.entries(userWords)
    .map(([_itemKey, itemContent]: [string, any]) =>
      itemContent.data.map((item: string) => ({
        kind: monaco.languages.CompletionItemKind[itemContent.type],
        label: itemContent.getInsertText(item),
        insertText: itemContent.getInsertText(item),
        detail: `Lowcode API`,
        range
      }))
    )
    .flat()
    .filter(({ insertText }: { insertText: string }) => insertText.indexOf(wordContent) === 0)
}

const getCurrentChar = (model: any, position: any) => {
  const currentChar = model.getValueInRange({
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: position.column - 1,
    endColumn: position.column
  })

  return { word: currentChar, startColumn: position.column - 1, endColumn: position.column }
}

const getWords = (model: any, position: any) => {
  const words: any[] = []

  const currentWord = model.getWordUntilPosition(position).word
    ? model.getWordAtPosition(position)
    : getCurrentChar(model, position)
  words.push(currentWord)

  const lastPosition = { ...position, column: currentWord.startColumn }
  while (lastPosition.column > 1) {
    const lastWord = model.getWordUntilPosition(lastPosition).word
      ? model.getWordUntilPosition(lastPosition)
      : getCurrentChar(model, lastPosition)
    if (!/[\w.]/.test(lastWord.word)) break
    words.push(lastWord)
    lastPosition.column = lastWord.startColumn
  }

  return words.reverse()
}

const getRange = (position: any, words: any[]) => ({
  startLineNumber: position.lineNumber,
  endLineNumber: position.lineNumber,
  startColumn: words[0].startColumn,
  endColumn: words[words.length - 1].endColumn
})

/**
 * 初始化 Monaco Editor 的代码提示功能
 * 扩展了原始功能，添加了项目特定的关键字提示
 * 
 * @param monacoInstance Monaco Editor 实例
 * @param editorModel 编辑器模型
 * @param conditionFn 可选的过滤函数
 * @returns 注册的代码提示提供者数组
 */
export const initCompletion = (monacoInstance: any, editorModel: any, conditionFn?: (item: any) => boolean) => {
  const completionItemProvider = {
    provideCompletionItems(model: any, position: any, _context: any, _token: any) {
      if (editorModel && model.id !== editorModel.id) {
        return {
          suggestions: []
        }
      }
      const words = getWords(model, position)
      const wordContent = words.map((item: any) => item.word).join('')
      const range = getRange(position, words)

      // 内置 API 提示 e.g. this.state/props/utils/http/router/...
      const apiSuggestions = getApiSuggestions(monacoInstance, range, wordContent)
      // 代码片段提示 e.g.  create new function
      const snippetSuggestions = getSnippetsSuggestions(monacoInstance, range, wordContent)
      // 用户变量数据提示 e.g. this.dataSourceMap.xxx.load()
      const userSuggestions = getUserSuggestions(monacoInstance, range, wordContent)
      return {
        suggestions: [...apiSuggestions, ...snippetSuggestions, ...userSuggestions].filter((item: any) =>
          conditionFn ? conditionFn(item) : true
        )
      }
    },
    triggerCharacters: ['.']
  }

  return ['javascript', 'typescript'].map((lang) =>
    monacoInstance.languages.registerCompletionItemProvider(lang, completionItemProvider)
  )
}
