import { defineComponent, ref, computed, createElementBlock, openBlock, normalizeStyle, normalizeClass, createElementVNode } from "vue";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _hoisted_1 = ["src"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "mp-image",
  props: {
    src: { default: "" },
    ratio: { default: "" },
    width: { default: "" },
    round: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    fit: { default: "cover" },
    hideBgColor: { type: Boolean, default: false }
  },
  emits: ["error"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const loaded2 = ref(false);
    const ratioNum = computed(() => {
      if (!props.ratio) {
        return;
      }
      const sizeArr = props.ratio.split(":");
      const num = sizeArr.length === 1 ? 1 : +sizeArr[1] / +sizeArr[0];
      return `${num * 100}%`;
    });
    const imgLoadErr = () => {
      loaded2.value = false;
      emit("error");
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([
          _ctx.$style["mp-image"],
          _ctx.$style[_ctx.fit === "cover" ? "cover" : "contain"],
          {
            "rounded-full": _ctx.round,
            [_ctx.$style["bg-color"]]: !_ctx.hideBgColor,
            [_ctx.$style["loaded"]]: loaded2.value
          },
          _ctx.block ? "block" : "inline-block",
          "relative overflow-hidden"
        ]),
        style: normalizeStyle({
          width: _ctx.width ? _ctx.width : "100%"
        })
      }, [
        createElementVNode("div", {
          style: normalizeStyle({
            paddingBottom: ratioNum.value ? ratioNum.value : ""
          }),
          class: "relative"
        }, [
          _ctx.src ? (openBlock(), createElementBlock("img", {
            key: 0,
            src: _ctx.src,
            class: normalizeClass(["mp-image-img", { "mp-image-fill": ratioNum.value }]),
            loading: "lazy",
            onLoad: _cache[0] || (_cache[0] = ($event) => loaded2.value = true),
            onError: imgLoadErr
          }, null, 42, _hoisted_1)) : (openBlock(), createElementBlock("div", {
            key: 1,
            class: normalizeClass(["mp-image-placeholder", { "mp-image-fill": ratioNum.value }])
          }, " Image ", 2))
        ], 4)
      ], 6);
    };
  }
});
const loaded = "_loaded_1gg7k_5";
const cover = "_cover_1gg7k_8";
const contain = "_contain_1gg7k_11";
const style0 = {
  "mp-image": "_mp-image_1gg7k_1",
  loaded,
  cover,
  contain,
  "bg-color": "_bg-color_1gg7k_15"
};
const cssModules = {
  "$style": style0
};
const mpImage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__cssModules", cssModules], ["__scopeId", "data-v-d1733c26"]]);
export {
  mpImage as MpImage
};
