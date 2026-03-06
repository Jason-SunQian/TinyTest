import { defineComponent, createElementBlock, openBlock, normalizeClass, renderSlot, createCommentVNode, createElementVNode, normalizeStyle, toDisplayString, createBlock, withCtx, unref } from "vue";
import { M as MpIcon } from "./mp-icon-wb8X8knC.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const arrowRightSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n</svg>\n';
const _hoisted_1 = ["data-test-id"];
const _hoisted_2 = { class: "flex-1 overflow-hidden" };
const _hoisted_3 = {
  key: 0,
  class: "text-h6 text-color-secondary line-clamp-2 mt-4px"
};
const _hoisted_4 = {
  key: 0,
  class: "flex items-center justify-end px-5px"
};
const _hoisted_5 = ["innerHTML"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "mp-cell",
  props: {
    title: { default: "" },
    desc: { default: "" },
    isLink: { type: Boolean, default: false },
    gap: { default: 8 },
    testId: { default: "cell" }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        "data-test-id": _ctx.testId,
        class: normalizeClass([_ctx.$style["mp-cell"], { "cursor-pointer": _ctx.isLink }, "relative flex items-center"])
      }, [
        renderSlot(_ctx.$slots, "start"),
        _ctx.$slots.start ? (openBlock(), createElementBlock("div", {
          key: 0,
          style: normalizeStyle({ minWidth: `${_ctx.gap}px` })
        }, null, 4)) : createCommentVNode("", true),
        createElementVNode("div", _hoisted_2, [
          renderSlot(_ctx.$slots, "title", {}, () => [
            createElementVNode("div", {
              class: normalizeClass([_ctx.$style["title"], "flex text-h4 text-color-primary line-clamp-1"])
            }, [
              createElementVNode("div", null, toDisplayString(_ctx.title), 1)
            ], 2)
          ]),
          renderSlot(_ctx.$slots, "desc", {}, () => [
            _ctx.desc ? (openBlock(), createElementBlock("div", _hoisted_3, toDisplayString(_ctx.desc), 1)) : createCommentVNode("", true)
          ])
        ]),
        renderSlot(_ctx.$slots, "end", {}, () => [
          _ctx.isLink ? (openBlock(), createElementBlock("div", _hoisted_4, [
            _ctx.isLink ? (openBlock(), createBlock(MpIcon, {
              key: 0,
              size: "24",
              class: "text-color-secondary"
            }, {
              default: withCtx(() => [
                createElementVNode("span", { innerHTML: unref(arrowRightSvg) }, null, 8, _hoisted_5)
              ]),
              _: 1
            })) : createCommentVNode("", true)
          ])) : createCommentVNode("", true)
        ])
      ], 10, _hoisted_1);
    };
  }
});
const title = "_title_1tz7o_13";
const style0 = {
  "mp-cell": "_mp-cell_1tz7o_1",
  title
};
const cssModules = {
  "$style": style0
};
const MpCell = /* @__PURE__ */ _export_sfc(_sfc_main, [["__cssModules", cssModules]]);
export {
  MpCell as M
};
