import { defineComponent, createElementBlock, openBlock, createCommentVNode, createVNode, normalizeClass, createElementVNode, toDisplayString, normalizeStyle, unref } from "vue";
import { MrProgress } from "@local/mr-components";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _hoisted_1 = { key: 1 };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "mp-progress",
  props: {
    percentage: { default: "0" },
    strokeWidth: { default: "16" },
    leftTitle: { default: "" },
    rightTitle: { default: "" },
    leftContent: { default: "" },
    rightContent: { default: "" },
    rightContentColor: { default: "var(--mr-color-neutral-600)" },
    showPivot: { type: Boolean, default: true },
    customText: { default: "" },
    customColor: { default: "" },
    bgColor: { default: "" }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        _ctx.leftTitle || _ctx.rightTitle ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(_ctx.$style["title-view"])
        }, [
          createElementVNode("div", {
            class: normalizeClass(_ctx.$style["left"])
          }, toDisplayString(_ctx.leftTitle), 3),
          createElementVNode("div", {
            class: normalizeClass(_ctx.$style["right"])
          }, toDisplayString(_ctx.rightTitle), 3)
        ], 2)) : createCommentVNode("", true),
        _ctx.customText ? (openBlock(), createElementBlock("div", _hoisted_1, [
          createElementVNode("div", {
            class: normalizeClass(_ctx.$style["progress-text"]),
            style: normalizeStyle({
              color: _ctx.percentage === 100 || _ctx.percentage === "100" ? "var(--mr-color-white)" : ""
            })
          }, toDisplayString(_ctx.customText), 7)
        ])) : createCommentVNode("", true),
        createVNode(unref(MrProgress), {
          percentage: _ctx.percentage,
          "stroke-width": _ctx.strokeWidth,
          "show-pivot": _ctx.showPivot,
          style: normalizeStyle({
            "--van-progress-color": _ctx.customColor ? _ctx.customColor : "",
            "--van-progress-background": _ctx.bgColor ? _ctx.bgColor : ""
          })
        }, null, 8, ["percentage", "stroke-width", "show-pivot", "style"]),
        _ctx.leftContent || _ctx.rightContent ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: normalizeClass(_ctx.$style["content-view"])
        }, [
          createElementVNode("div", {
            class: normalizeClass(_ctx.$style["left"])
          }, toDisplayString(_ctx.leftContent), 3),
          createElementVNode("div", {
            class: normalizeClass(_ctx.$style["right"]),
            style: normalizeStyle({ color: _ctx.rightContentColor })
          }, toDisplayString(_ctx.rightContent), 7)
        ], 2)) : createCommentVNode("", true)
      ]);
    };
  }
});
const right = "_right_1yhxv_13";
const style0 = {
  "title-view": "_title-view_1yhxv_1",
  "content-view": "_content-view_1yhxv_7",
  right,
  "progress-text": "_progress-text_1yhxv_18"
};
const cssModules = {
  "$style": style0
};
const mpProgress = /* @__PURE__ */ _export_sfc(_sfc_main, [["__cssModules", cssModules]]);
export {
  mpProgress as MpProgress
};
