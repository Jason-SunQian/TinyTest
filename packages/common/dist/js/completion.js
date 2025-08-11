import { useResource as h, useCanvas as C } from "@opentiny/tiny-engine-meta-register";
const x = [
  "state",
  "stores",
  "props",
  "emit",
  "setState",
  "route",
  "i18n",
  "getLocale",
  "setLocale",
  "history",
  "utils",
  "bridge",
  "dataSourceMap"
], f = [
  {
    lable: "new function",
    type: "Function",
    insertText: "function ${1:funName} (${2}) {\n  ${3}\n}",
    detail: "create new function"
  }
], o = {
  Method: "Method",
  Variable: "Variable"
}, y = (r, t, n) => x.map((s) => ({
  label: `this.${s}`,
  kind: r.languages.CompletionItemKind.Keyword,
  insertText: `this.${s}`,
  detail: "Lowcode API",
  range: t
})).filter(({ insertText: s }) => s.indexOf(n) === 0), S = (r, t, n) => f.map((s) => ({
  label: s.lable,
  insertText: s.insertText,
  detail: s.detail,
  kind: r.languages.CompletionItemKind[s.type],
  insertTextRules: r.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  range: t
})).filter(({ insertText: s }) => s.indexOf(n) === 0), I = () => {
  const { bridge: r = [], dataSource: t = [], utils: n = [], globalState: s = [] } = h().appSchemaState;
  return {
    state: {
      type: o.Variable,
      getInsertText: (e) => `this.state.${e}`,
      data: Object.keys(C().getPageSchema().state || {})
    },
    stores: {
      type: o.Variable,
      getInsertText: (e) => `this.stores.${e}`,
      data: s.filter((e) => e.id).map((e) => [
        e.id,
        ...[...Object.keys(e.state), ...Object.keys(e.getters)].map((a) => `${e.id}.${a}`)
      ]).flat()
    },
    storeFn: {
      type: o.Method,
      getInsertText: (e) => `this.stores.${e}()`,
      data: s.filter((e) => e.id).map((e) => Object.keys(e.actions).map((a) => `${e.id}.${a}`)).flat()
    },
    utils: {
      type: o.Variable,
      getInsertText: (e) => `this.utils.${e}`,
      data: n.map((e) => e.name)
    },
    dataSource: {
      type: o.Method,
      getInsertText: (e) => `this.dataSourceMap.${e}.load()`,
      data: t.map((e) => e.name)
    },
    bridge: {
      type: o.Variable,
      getInsertText: (e) => `this.bridge.${e}`,
      data: r.map((e) => e.name)
    }
  };
}, T = (r, t, n) => {
  const s = I();
  return Object.entries(s).map(
    ([e, a]) => a.data.map((i) => ({
      kind: r.languages.CompletionItemKind[a.type],
      label: a.getInsertText(i),
      insertText: a.getInsertText(i),
      detail: "Lowcode API",
      range: t
    }))
  ).flat().filter(({ insertText: e }) => e.indexOf(n) === 0);
}, c = (r, t) => ({ word: r.getValueInRange({
  startLineNumber: t.lineNumber,
  endLineNumber: t.lineNumber,
  startColumn: t.column - 1,
  endColumn: t.column
}), startColumn: t.column - 1, endColumn: t.column }), $ = (r, t) => {
  const n = [], s = r.getWordUntilPosition(t).word ? r.getWordAtPosition(t) : c(r, t);
  n.push(s);
  const e = { ...t, column: s.startColumn };
  for (; e.column > 1; ) {
    const a = r.getWordUntilPosition(e).word ? r.getWordUntilPosition(e) : c(r, e);
    if (!/[\w.]/.test(a.word)) break;
    n.push(a), e.column = a.startColumn;
  }
  return n.reverse();
}, w = (r, t) => ({
  startLineNumber: r.lineNumber,
  endLineNumber: r.lineNumber,
  startColumn: t[0].startColumn,
  endColumn: t[t.length - 1].endColumn
}), W = (r, t, n) => {
  const s = {
    provideCompletionItems(e, a, i, P) {
      if (t && e.id !== t.id)
        return {
          suggestions: []
        };
      const d = $(e, a), l = d.map((g) => g.word).join(""), u = w(a, d), p = y(r, u, l), m = S(r, u, l), b = T(r, u, l);
      return {
        suggestions: [...p, ...m, ...b].filter(
          (g) => n ? n(g) : !0
        )
      };
    },
    triggerCharacters: ["."]
  };
  return ["javascript", "typescript"].map(
    (e) => r.languages.registerCompletionItemProvider(e, s)
  );
};
export {
  W as initCompletion
};
//# sourceMappingURL=completion.js.map
