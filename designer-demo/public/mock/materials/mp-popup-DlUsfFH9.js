import { defineComponent, mergeModels, useModel, createBlock, openBlock, Teleport, withDirectives, createElementVNode, withModifiers, createElementBlock, createCommentVNode, renderSlot, toDisplayString, vShow } from "vue";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _hoisted_1 = { class: "mp-popup-panel" };
const _hoisted_2 = {
  key: 0,
  class: "mp-popup-header"
};
const _hoisted_3 = { class: "mp-popup-title" };
const _hoisted_4 = {
  key: 1,
  class: "mp-popup-sub-header"
};
const _hoisted_5 = { class: "mp-popup-body" };
const _hoisted_6 = {
  key: 2,
  class: "mp-popup-footer"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "mp-popup",
  props: /* @__PURE__ */ mergeModels({
    title: { default: "" }
  }, {
    "show": { type: Boolean, ...{ default: false } },
    "showModifiers": {}
  }),
  emits: ["update:show"],
  setup(__props) {
    const show = useModel(__props, "show");
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Teleport, { to: "body" }, [
        withDirectives(createElementVNode("div", {
          class: "mp-popup-overlay",
          onClick: _cache[1] || (_cache[1] = withModifiers(($event) => show.value = false, ["self"]))
        }, [
          createElementVNode("div", _hoisted_1, [
            _ctx.title || _ctx.$slots.title ? (openBlock(), createElementBlock("div", _hoisted_2, [
              renderSlot(_ctx.$slots, "title", {}, () => [
                createElementVNode("span", _hoisted_3, toDisplayString(_ctx.title), 1)
              ], true),
              createElementVNode("button", {
                type: "button",
                class: "mp-popup-close",
                "aria-label": "Close",
                onClick: _cache[0] || (_cache[0] = ($event) => show.value = false)
              }, "×")
            ])) : createCommentVNode("", true),
            _ctx.$slots["sub-header"] ? (openBlock(), createElementBlock("div", _hoisted_4, [
              renderSlot(_ctx.$slots, "sub-header", {}, void 0, true)
            ])) : createCommentVNode("", true),
            createElementVNode("div", _hoisted_5, [
              renderSlot(_ctx.$slots, "default", {}, void 0, true)
            ]),
            _ctx.$slots.footer ? (openBlock(), createElementBlock("div", _hoisted_6, [
              renderSlot(_ctx.$slots, "footer", {}, void 0, true)
            ])) : createCommentVNode("", true)
          ])
        ], 512), [
          [vShow, show.value]
        ])
      ]);
    };
  }
});
const MpPopup = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ad6d4511"]]);
export {
  MpPopup as M
};
