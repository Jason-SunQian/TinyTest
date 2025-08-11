import { parse as f } from "@babel/parser";
import { parse as G, parseExpression as L } from "@babel/parser";
import g from "@babel/generator";
import { default as _ } from "@babel/generator";
import d from "@babel/traverse";
import { default as z } from "@babel/traverse";
import a from "prettier";
import y from "prettier/parser-html";
import S from "prettier/parser-postcss";
import i from "prettier/parser-babel";
import c from "./config-files/prettierrc.js";
const m = /function.*?\(/, k = (r, t) => t.replace(m, `function ${r}(`), M = (r) => r.replace(m, "function ("), x = (r = "") => f(r, { sourceType: "module", plugins: ["typescript", "jsx"] }), R = (r) => g(r, { retainLines: !0 }).code, l = (r) => {
  var e, n, s;
  let t = r;
  const o = {
    parser: "babel",
    plugins: [i],
    ...c
  };
  try {
    const p = x(r);
    ((e = p.program.body) == null ? void 0 : e.length) === 1 && ((s = (n = p.program.body) == null ? void 0 : n[0]) == null ? void 0 : s.type) === "ExpressionStatement" ? (t = a.format(`!(${r})`, o).replace(/\r?\n$/, ""), t.match(/^!\([\s\S]*\)$/) ? t = t.replace(/^!\(([\s\S]*)\)$/, "$1") : t = t.replace(/^!/, "")) : t = a.format(r, o);
  } catch {
    t = a.format(t, o);
  }
  return t;
}, u = (r) => a.format(r, {
  parser: "json",
  plugins: [i],
  trailingComma: "es5",
  ...c
}), E = (r) => a.format(r, {
  parser: "html",
  plugins: [i, y],
  ...c
}), h = (r) => a.format(r, {
  parser: "css",
  plugins: [S],
  ...c
}), b = {
  json: u,
  typescript: l,
  javascript: l,
  html: E,
  css: h
}, T = (r, t) => {
  const o = b[t] || u;
  let e = r;
  try {
    e = o(r);
  } catch (n) {
    console.log(n);
  }
  return e;
}, j = (r, t) => {
  let o = !1;
  try {
    d(f(r), {
      ExpressionStatement(e) {
        if (e.toString().includes(t)) {
          o = !0;
          return;
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
  return o;
}, v = (r, t) => {
  let o = !1;
  const e = (n) => {
    Object.values(n).forEach((s) => {
      if (["[object Array]", "[object Object]"].includes(Object.prototype.toString.call(s)) && Object.keys(s).length)
        if (s.type && ["jsstring", "JSExpression", "JSFunction"].includes(s.type)) {
          if (j(s.value, t)) {
            o = !0;
            return;
          }
        } else
          e(s);
    });
  };
  return e(r), o;
}, w = (r, t) => {
  const o = [];
  return r.forEach((e) => {
    v(e, t) && o.push(e.fileName);
  }), o;
};
export {
  R as ast2String,
  w as findExpressionInAppSchema,
  T as formatString,
  _ as generate,
  j as includedExpression,
  v as includedExpressionInSchema,
  k as insertName,
  G as parse,
  L as parseExpression,
  M as removeName,
  x as string2Ast,
  z as traverse
};
//# sourceMappingURL=ast.js.map
