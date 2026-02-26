import { createElementBlock, openBlock, normalizeClass, createCommentVNode, createElementVNode, renderSlot, Fragment, createVNode, toDisplayString, unref } from "vue";
import { MrDivider } from "@local/mr-components";
const style0 = {
  "mp-card": "_mp-card_r07xm_2"
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _hoisted_1 = { class: "mp-card-header" };
const _hoisted_2 = {
  key: 0,
  class: "mp-card-title"
};
const _hoisted_3 = { class: "mp-card-body" };
const _sfc_main = {
  __name: "mp-card",
  props: {
    title: { type: String, default: "" }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([_ctx.$style["mp-card"], "mp-card-wrap"])
      }, [
        __props.title || _ctx.$slots.header || _ctx.$slots.headerEnd ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          renderSlot(_ctx.$slots, "header", {}, void 0, true),
          createElementVNode("div", _hoisted_1, [
            __props.title ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString(__props.title), 1)) : createCommentVNode("", true),
            renderSlot(_ctx.$slots, "headerEnd", {}, void 0, true)
          ]),
          createVNode(unref(MrDivider), { hairline: "" })
        ], 64)) : createCommentVNode("", true),
        createElementVNode("div", _hoisted_3, [
          renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ]),
        _ctx.$slots.footer ? renderSlot(_ctx.$slots, "footer", { key: 1 }, void 0, true) : createCommentVNode("", true)
      ], 2);
    };
  }
};
const cssModules = {
  "$style": style0
};
const mpCard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__cssModules", cssModules], ["__scopeId", "data-v-de2f6141"]]);
export {
  mpCard as MpCard
};
