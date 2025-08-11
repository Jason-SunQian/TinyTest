import { defineComponent as l, useCssVars as a, createElementBlock as r, openBlock as s, createElementVNode as n, renderSlot as _, createCommentVNode as m, createBlock as p, resolveDynamicComponent as d, toDisplayString as i } from "vue";
import { _ as f } from "../_plugin-vue_export-helper.js";
const u = { class: "tr-welcome" }, h = { class: "tr-welcome__title-wrapper" }, w = {
  key: 0,
  class: "tr-welcome__icon"
}, v = { class: "tr-welcome__title" }, k = { class: "tr-welcome__description" }, x = /* @__PURE__ */ l({
  __name: "index",
  props: {
    title: {},
    description: {},
    align: { default: "center" },
    icon: {}
  },
  setup(o) {
    a((c) => ({
      a8ff55f2: e.align
    }));
    const e = o;
    return (c, g) => (s(), r("div", u, [
      n("div", h, [
        e.icon ? (s(), r("span", w, [
          (s(), p(d(e.icon)))
        ])) : m("", !0),
        n("h3", v, i(e.title), 1)
      ]),
      n("span", k, i(e.description), 1),
      _(c.$slots, "footer", {}, void 0, !0)
    ]));
  }
}), t = /* @__PURE__ */ f(x, [["__scopeId", "data-v-b9a85199"]]);
t.name = "TrWelcome";
const C = function(o) {
  o.component(t.name, t);
};
t.install = C;
export {
  t as default
};
