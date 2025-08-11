import { useMessage as y, useCanvas as $, useBlock as L, usePage as U, useMaterial as I, useResource as B, getMergeMeta as h, getMetaApi as D, META_SERVICE as E } from "@opentiny/tiny-engine-meta-register";
import { utils as R } from "@opentiny/tiny-engine-utils";
import { isDevelopEnv as T } from "./environments.js";
import { u as b } from "../index-lnBLG_4I.js";
const { deepClone: f } = R;
let a = null;
const k = () => {
  const { scripts: e, styles: o } = I().getCanvasDeps(), t = B().getUtilsDeps(), i = [...e, ...t].reduce((n, s) => (n[s.package] = n[s.package] || s.script, n), {}), c = [...o];
  return {
    scripts: i,
    styles: c
  };
}, P = async () => {
  const { isBlock: e, getPageSchema: o, getCurrentPage: t, getSchema: i } = $(), c = e(), { scripts: n, styles: s } = k();
  if (c) {
    const { getCurrentBlock: m } = L(), M = {
      ...m(),
      page_content: i()
    };
    return f({
      currentPage: M,
      ancestors: [],
      scripts: n,
      styles: s
    });
  }
  const l = o(), g = t(), { getFamily: r } = U(), p = {
    ...g,
    page_content: l
  }, u = await r(p);
  return f({
    currentPage: p,
    ancestors: u,
    scripts: n,
    styles: s
  });
}, S = (e) => {
  a.postMessage(
    {
      source: "designer",
      type: "schema",
      data: e
    },
    a.origin || window.location.origin
  );
};
let v = !1;
const _ = () => {
  const { unsubscribe: e } = y();
  e({
    topic: "schemaChange",
    subscriber: "preview-communication"
  }), e({
    topic: "schemaImport",
    subscriber: "preview-communication"
  }), e({
    topic: "pageOrBlockInit",
    subscriber: "preview-communication"
  }), v = !1;
}, d = async () => {
  if (!a || a.closed) {
    _(), a = null;
    return;
  }
  const e = await P();
  S(e);
}, C = () => {
  if (v)
    return;
  const { subscribe: e } = y();
  e({
    topic: "schemaChange",
    subscriber: "preview-communication",
    // 防抖更新，防止因为属性变化频繁触发
    callback: b(d, 1e3, !0)
  }), e({
    topic: "schemaImport",
    subscriber: "preview-communication",
    callback: b(d, 1e3, !0)
  }), e({
    topic: "pageOrBlockInit",
    subscriber: "preview-communication",
    callback: d
  }), v = !0;
}, A = () => {
  window.addEventListener("message", async (o) => {
    const t = new URL(o.origin), i = new URL(window.location.href);
    if (t.origin === i.origin || t.host === i.host) {
      const { event: c, source: n } = o.data || {};
      if (n === "preview" && c === "connect" && !a && (a = o.source, C()), n === "preview" && c === "onMounted" && a) {
        const s = await P();
        S(s);
      }
    }
  });
  const e = new BroadcastChannel("tiny-engine-preview-channel");
  e.postMessage({
    event: "connect",
    source: "designer"
  }), e.close();
};
A();
const O = (e, o) => {
  let t = null;
  const i = (c) => {
    if (c.origin === window.location.origin || c.origin.includes(window.location.hostname)) {
      const { event: n, source: s } = c.data || {};
      if (s === "preview" && n === "onMounted" && t) {
        const { scripts: l, styles: g, ancestors: r = [], ...p } = e;
        t.postMessage(
          {
            source: "designer",
            type: "schema",
            data: f({
              currentPage: p,
              ancestors: r,
              scripts: l,
              styles: g
            })
          },
          (t == null ? void 0 : t.origin) || window.location.origin
        ), window.removeEventListener("message", i);
      }
    }
  };
  window.addEventListener("message", i), t = window.open(o, "_blank");
}, q = (e = {}, o = !1) => {
  var p, u, m, w;
  const t = new URLSearchParams(location.search), i = t.get("tenant") || "", c = t.get("pageid"), n = t.get("blockid"), s = (u = (p = D(E.ThemeSwitch)) == null ? void 0 : p.getThemeState()) == null ? void 0 : u.theme, l = (m = h("engine.config")) == null ? void 0 : m.dslMode, g = (w = h("engine.config")) == null ? void 0 : w.platformId;
  let r = `tenant=${i}&id=${t.get("id")}&theme=${s}&framework=${l}`;
  return r += `&platform=${g}`, c && (r += `&pageid=${c}`), n && (r += `&blockid=${n}`), o && (r += `&history=${e.history}`), r;
}, F = (e = {}, o = !1) => {
  var r, p;
  const t = window.location.href.split("?")[0] || "./", { scripts: i, styles: c } = k(), n = q(e, o);
  let s = "";
  const l = (p = (r = h("engine.toolbars.preview")) == null ? void 0 : r.options) == null ? void 0 : p.previewUrl, g = T ? "./preview.html" : `${t.endsWith("/") ? t : `${t}/`}preview`;
  if (l ? s = typeof l == "function" ? l(g, n) : `${l}?${n}` : s = `${g}?${n}`, o) {
    O({ ...e, scripts: i, styles: c }, s);
    return;
  }
  if (a && !a.closed) {
    a.focus();
    return;
  }
  a = window.open(s, "_blank"), C();
}, W = (e = {}, o = !1) => {
  F(e, o);
};
export {
  W as previewPage,
  C as setupSchemaChangeListener
};
//# sourceMappingURL=preview.js.map
